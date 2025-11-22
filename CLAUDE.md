# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo asset management system with three packages:
- **client/** - React + TypeScript frontend (Vite)
- **server/** - Express + Node.js backend
- **common/** - Shared schemas, constants, and helpers

The common package is a local dependency used by both client and server for code reuse.

## Development Commands

### Client (from client/ directory)
```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript compile + Vite production build
npm run eslint       # Lint code
npm run eslint:fix   # Lint and auto-fix
npm run format       # Format with Prettier
```

### Server (from server/ directory)
```bash
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start with node
npm run eslint       # Lint code
npm run eslint:fix   # Lint and auto-fix
npm run format       # Format with Prettier
```

### Environment Variables Required

**Server (.env):**
- `PORT`, `MONGO_URI`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_SALT`
- `ALLOWED_ADDRESS` (CORS)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `ENVIRONMENT`

**Client (.env):**
- `VITE_API_BASE_URL`

## Core Architecture Patterns

### Controller-Based Resource Management (Frontend)

The frontend uses a sophisticated abstraction layer that eliminates repetitive CRUD code:

**Class Hierarchy:**
1. **PageHandler** - Base class providing resource management, route registration, service integration, and schema attachment
2. **MainResource** extends PageHandler - Registers standard routes (list, create, detail, edit, history, delete)
3. **Resource** extends PageHandler - Similar but without history route
4. **InstanceMasterResource** extends PageHandler - Like MainResource but detail view replaced with InstanceMasterPage for managing individual instances

**Dynamic Routing:**
Routes are generated automatically from controller definitions in `client/src/core/core/controllers.ts`:
```typescript
AccessoriesController = new MainResource(route, service, schema)
AssetsController = new MainResource(route, service, schema)
// etc.
```

The `AppRoutes.tsx` component maps these controllers to React Router routes dynamically, meaning one set of page components (`MainPage`, `CreatePage`, `EditPage`, etc.) serves ALL resources.

### Schema-Driven UI

The most powerful pattern in the codebase - UI components are generated from schema definitions:

**IResourceSchema** (defined in `client/src/types/types/resourceSchema.ts`) declares:
- Field types: `string`, `number`, `email`, `password`, `boolean`, `enum`, `reference`, `polymorphicReference`
- Validation rules: `required`, `minLength`, `maxLength`, `min`, `max`
- Display configuration: `showInTable`, `showInForm`, `showInDetail`, `showInCreate`, `showInEdit`
- Reference configuration: `referencedCollection`, `displayField`, `excludeSelfFromOptions`

**SchemaForm** (`client/src/components/components/forms/schema/SchemaForm.tsx`):
- Automatically renders form fields from schema
- Loads reference data for dropdowns via API
- Handles polymorphic references (see below)
- Manages dependent field clearing
- Validates on submit

**SchemaTable** (`client/src/components/components/tables/schema/SchemaTable.tsx`):
- Generates table columns from schema
- Renders appropriate UI for each field type
- Creates clickable reference links

### Backend Controller Pattern

**Class Hierarchy:**
1. **Endpoint** - Base class providing Express Router
2. **Model** extends Endpoint - Generic CRUD controller implementing:
   - Standard CRUD operations with pagination
   - Manual population of references (via `_manualPopulate`)
   - Polymorphic reference handling (via `_handlePolymorphicPopulate`)
   - Soft delete support for assets/accessories/licenses
   - Check-in/check-out workflow
   - Automatic history logging
   - Cascade reference cleanup on deletion
   - Automatic instance creation/deletion when quantity changes (for accessories/licenses)

3. **Instance** extends Endpoint - Instance management for accessories/licenses (see Instance Management System)
4. **Auth** extends Endpoint - JWT authentication with refresh tokens
5. **History** extends Endpoint - Audit trail endpoints

All controllers are instantiated generically - you pass a collection name and the base controller handles all operations.

### Polymorphic References System

**Problem:** Assets/Accessories/Licenses can be assigned to either Users OR Locations.

**Solution:** Three-field system:
- `assigneeModel` - 'users', 'locations', or 'common'
- `actualAssigneeModel` - 'users' or 'locations' (the actual type when assigneeModel is 'common')
- `assignee` - numeric ID of the assigned resource

**Backend (`_handlePolymorphicPopulate` in `server/src/controllers/model.js`):**
- Manually resolves the reference based on `actualAssigneeModel`
- Loads the correct model and populates data

**Frontend (`SchemaForm.tsx` lines 511-607):**
- Declares field as `type: 'polymorphicReference'` with `modelField` pointing to the type selector
- When `assigneeModel` is 'common', loads both users and locations
- Combines into a single searchable dropdown with prefixed labels ("User: John Doe", "Location: Office")
- Stores both `assignee` ID and `actualAssigneeModel` on selection

### History Tracking

Every modification is logged to the History collection:
- Schema: `resourceType`, `resourceId`, `action`, `performedBy`, `changes`, `metadata`, `timestamp`
- Actions: `created`, `updated`, `checkin`, `checkout`, `deleted`
- Uses `logHistory` helper from common package
- Stores denormalized data (names) to preserve history even if resources are deleted

History endpoints:
- Global: `/history` - all actions across system
- Resource: `/{resource}/:id/history` - actions for specific resource
- User: `/history/user/:id` - items checked out to a user

### Check-In/Check-Out Workflow

Assets, Accessories, and Licenses support check-in/check-out:
- **Check-out:** Assigns resource to user/location (sets `assignee`, `assigneeModel`, `actualAssigneeModel`)
- **Check-in:** Clears assignment (uses `$unset` operator)
- Both operations log to history with assignee details
- Frontend modal (`CheckInOutModal.tsx`) handles UI for both operations

### Instance Management System

Accessories and Licenses support **instance-level management** - instead of checking in/out the entire item, individual instances can be tracked separately.

**Automatic Instance Creation:**
- Accessories and Licenses have a `quantity` field
- When quantity is updated, instances are automatically created/deleted in `accessory-instances` or `license-instances` collections
- Each instance gets: `parentId`, `instanceNumber` (1-based), `status` ('available'/'assigned'), and polymorphic assignee fields
- Increasing quantity creates new instances with sequential instance numbers
- Decreasing quantity removes available (unassigned) instances from the end
- System prevents reducing quantity below number of assigned instances

**Backend Controller (Instance extends Endpoint):**
- Routes: `/:id/instances` (list), `/:id/instances/:instanceId/checkin`, `/:id/instances/:instanceId/checkout`, `/instances/stats`
- Handles polymorphic population of instance assignees
- Validates that instances belong to parent resource
- Logs check-in/check-out to history with parent context

**Frontend Integration:**
- `InstanceMasterResource` controller class combines parent resource + instance management
- `InstanceMasterPage` displays parent details + paginated table of instances with check-in/out buttons
- `InstanceService` provides API methods: `getInstances`, `checkInInstance`, `checkOutInstance`, `getStats`
- Instance schemas (`accessoryInstancesSchema`, `licenseInstancesSchema`) define UI for instance tables

**Assigned Count Enrichment:**
- When fetching Accessories or Licenses, the Model controller automatically adds an `assignedCount` field
- Shows how many instances are currently assigned (useful for "15 of 50 assigned" displays)

**Use Case:**
Instead of "Check out Mouse (quantity: 50)", you can "Check out Mouse #23 to John Doe" and track each individual mouse separately.

### Database Patterns

- **Custom numeric IDs:** Uses `id` field (number) instead of MongoDB's `_id` for user-friendly IDs
- **Auto-increment:** `getLastDocument` helper finds highest ID and increments
- **Mongoose schemas** defined in `common/schemas/`
- **Reference fields** use numeric IDs, not ObjectIds
- **Manual population** via `_manualPopulate` method (not Mongoose populate)

### Authentication Flow

JWT with refresh tokens:
1. Login returns `access_token` (short-lived, stored in localStorage)
2. Refresh token in HTTP-only cookie (30 days)
3. Axios interceptor adds `access_token` to all requests
4. On 401 error, refresh interceptor automatically gets new `access_token`
5. If refresh fails, redirect to login

Security:
- Main admin account (id=1) cannot be edited or deleted
- Passwords hashed with bcrypt
- Auth middleware validates JWT on protected routes

### Reference Cascade Cleanup

When deleting a resource, `_clearReferences` method in `server/src/controllers/model.js`:
- Removes references from all related collections
- Handles polymorphic references correctly (checks both direct and common assignees)
- Different cleanup logic per collection type (users, locations, companies, departments)
- Prevents orphaned references

### Soft Delete

Assets, Accessories, and Licenses use `isDeleted` flag:
- Filtered out from queries (`isDeleted: { $ne: true }`)
- Preserved in database for history/audit purposes

## Adding a New Resource

**Standard Resource:**
1. Define Mongoose schema in `common/schemas/`
2. Add collection name constant to `common/constants/collectionNames.js`
3. Create controller instance in `server/src/controllers/index.js`:
   ```javascript
   new Model('resource-name')
   ```
4. Register route in `server/src/routes/index.js`
5. Define UI schema in `client/src/schemas/schemas/resourceSchema.ts`
6. Create service instance in `client/src/services/services/`
7. Create controller instance in `client/src/core/core/controllers.ts`:
   ```typescript
   new MainResource(route, service, schema)
   ```
8. Add route config to `client/src/config/routes.ts`

The framework handles the rest automatically - no need to create custom CRUD endpoints, forms, tables, or pages.

**Instance-Managed Resource (like Accessories/Licenses):**
Follow steps 1-8 above, then additionally:
9. Define instance Mongoose schema in `common/schemas/` (e.g., `resourceInstancesSchema.js`)
10. Add instance collection name to `common/constants/collectionNames.js`
11. Create Instance controller in `server/src/controllers/index.js`:
   ```javascript
   new Instance('resource-name')
   ```
12. Register instance routes in `server/src/routes/index.js`
13. Define instance UI schema in `client/src/schemas/schemas/`
14. Create InstanceService in `client/src/services/services/`
15. Use `InstanceMasterResource` instead of `MainResource` in step 7:
   ```typescript
   new InstanceMasterResource(route, service, schema, instanceService, instanceSchema)
   ```

## Important Implementation Notes

### Handling undefined/null in Updates

**Issue:** MongoDB `$set` operator ignores `undefined` values. To clear a field, use `$unset`.

**Pattern (in `updateItem` method):**
```javascript
const fieldsToSet = {};
const fieldsToUnset = {};

Object.entries(request.body).forEach(([key, value]) => {
    if (value === undefined || value === null) {
        fieldsToUnset[key] = '';
    } else {
        fieldsToSet[key] = value;
    }
});

const updateQuery = {};
if (Object.keys(fieldsToSet).length > 0) updateQuery.$set = fieldsToSet;
if (Object.keys(fieldsToUnset).length > 0) updateQuery.$unset = fieldsToUnset;

await collection.findOneAndUpdate({ id }, updateQuery, { new: true, runValidators: true });
```

This ensures that clearing a reference (e.g., removing a manager from a location) actually removes the field and creates a history entry.

### SearchableSelect Component

The `SearchableSelect` component (`client/src/components/components/ui/ui/SearchableSelect.tsx`) is used for all reference fields. Key features:
- Type-to-search filtering
- Keyboard navigation (arrow keys, Enter, Escape)
- Clear button when `allowClear={true}`
- `onClear` callback for proper undefined handling

When a field is cleared via the X button, it should call `handleChange(fieldName, undefined)` to ensure the field is unset, not just set to empty string.

## Resource Types

The system manages 12 resource types:

**Main Resources:**
1. **Assets** - Trackable items (check-in/out enabled)
2. **Accessories** - Trackable items with quantity (check-in/out enabled, instance management)
3. **Licenses** - Software licenses (check-in/out enabled, instance management)
4. **Users** - System users with roles (admin/user)
5. **Companies** - Organizations with owner reference
6. **Departments** - Business units with manager reference
7. **Locations** - Physical locations with parent/manager/company references
8. **Job Titles** - Simple lookup table for user job titles
9. **Seniorities** - Simple lookup table for user seniority levels

**System Resources:**
10. **Accessory Instances** - Individual instances of accessories (auto-managed)
11. **License Instances** - Individual instances of licenses (auto-managed)
12. **History** - Audit log (read-only)

## Code Organization

**Client:**
- `/api` - Axios client with auth interceptors
- `/components` - Reusable UI (forms, tables, modals, layouts)
- `/core` - Controller classes and PageHandler base
- `/schemas` - UI schema definitions (IResourceSchema)
- `/services` - API service classes
- `/pages` - Generic page components (reused across resources)
- `/routes` - Routing configuration

**Server:**
- `/controllers` - Request handlers (Auth, Model, History base classes)
- `/lib/models` - Mongoose model registration
- `/lib/helpers` - Utilities (getModelByName, getPopulateFields, etc.)
- `/middleware` - Auth and refresh token middleware
- `/routes` - Route registration
- `/startup` - Initialization (create admin user)

**Common:**
- `/constants` - Shared constants (collection names, messages)
- `/helpers` - Shared utilities (logHistory, encryption, logger)
- `/schemas` - Mongoose schemas

## Architecture Philosophy

This codebase prioritizes **DRY principles** and **developer productivity** through:
- Generic controllers that work for any resource
- Schema-driven UI that eliminates boilerplate
- Automatic route generation
- Centralized error handling
- Consistent patterns across all resources

When implementing features, always check if the generic controllers can be extended rather than creating resource-specific code.
