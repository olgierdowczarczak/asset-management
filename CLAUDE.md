# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack asset management system built with:
- **Client**: React + TypeScript, Vite, TailwindCSS
- **Server**: Node.js + Express
- **Common**: Shared code (schemas, constants, helpers) used by both client and server
- **Database**: MongoDB with Mongoose ODM

The system manages IT assets, accessories, licenses, users, locations, companies, and departments with check-in/check-out functionality and history tracking.

## Development Commands

### Client (React + TypeScript)
```bash
cd client
npm run dev          # Start Vite dev server
npm run build        # Build for production (TypeScript + Vite)
npm run eslint       # Run ESLint
npm run eslint:fix   # Auto-fix ESLint issues
npm run format       # Format with Prettier
```

### Server (Node.js + Express)
```bash
cd server
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
npm run eslint       # Run ESLint
npm run eslint:fix   # Auto-fix ESLint issues
npm run format       # Format with Prettier
```

### Docker Deployment
```bash
cd compose
docker-compose up -d          # Start all services (MongoDB, server, client)
docker-compose down           # Stop all services
docker-compose logs -f        # View logs
```

## Architecture

### Monorepo Structure
The repository uses a shared module pattern:
- `common/` - Shared schemas, constants, and helpers used by both client and server
- `client/` - React frontend application
- `server/` - Express backend API
- Both client and server depend on `common/` via `file:../common` in package.json

### Server Architecture

#### Controller Pattern
The server uses a class-based controller pattern with three main controller types:

1. **Model Controller** (`server/src/controllers/model.js`)
   - Base controller for standard CRUD operations
   - Used for: companies, departments, jobtitles, seniorities, users
   - Implements: GET all, GET by ID, POST, PUT/PATCH, DELETE
   - Supports soft delete for assets, accessories, licenses
   - Auto-populates references using manual population
   - Handles check-in/check-out for assets

2. **Instance Controller** (`server/src/controllers/instance.js`)
   - Manages individual instances of accessories and licenses
   - Creates/deletes instances when quantity changes
   - Tracks assignment status (available/assigned)
   - Supports check-in/check-out at instance level

3. **Auth Controller** (`server/src/controllers/auth.js`)
   - Handles login, logout, token refresh
   - JWT-based authentication with access and refresh tokens
   - Cookies for token storage

#### Key Server Concepts

**Polymorphic Assignments**: Assets, accessories, and licenses can be assigned to:
- Users (direct assignment)
- Locations (indirect - shows actual assignee via `actualAssigneeModel`)
- Uses `assigneeModel`, `assignee`, and `actualAssigneeModel` fields

**Instance Management**: Accessories and licenses use a parent-instance pattern:
- Parent record defines the item (e.g., "Keyboard Model X")
- Instance records track individual units (#1, #2, #3...)
- Quantity changes automatically create/delete instances
- Cannot decrease quantity below number of assigned instances

**Manual Population**: The server uses manual population instead of Mongoose populate to avoid reference issues with custom `id` fields (not `_id`).

**History Logging**: All create, update, delete, check-in, and check-out actions are logged to the History collection with metadata.

### Client Architecture

#### Controller Pattern
The client mirrors the server's controller pattern with PageHandlers:

1. **PageHandler** (`client/src/core/core/PageHandler.ts`)
   - Base class for all client controllers
   - Auto-registers routes with path and component
   - Wraps methods with error handling

2. **Resource/MainResource/InstanceMasterResource** Controllers
   - Extend PageHandler with specific functionality
   - Connect services to UI components
   - Register routes for list, detail, create, edit pages

#### Key Client Concepts

**Schema-Driven Forms**: Forms are generated from schema definitions in `client/src/schemas/` matching the backend schemas.

**Dynamic Routing**: Routes are auto-generated from controller configuration in `client/src/core/core/controllers.ts` and rendered in `AppRoutes.tsx`.

**Context-Based Auth**: `AuthContext` provides authentication state and user info throughout the app.

**Axios Interceptors**: Auto-attach JWT tokens, handle token refresh on 401 errors.

### Common Module

Shared between client and server:
- **Schemas**: Mongoose schemas define data models (e.g., `usersSchema.js`, `assetsSchema.js`)
- **Constants**: All constants (collection names, routes, messages, field names, etc.)
- **Helpers**: Shared utility functions (e.g., `logHistory.js`, `getLastDocument.js`)

When modifying schemas or constants, changes automatically apply to both client and server.

### Database Schema Design

**Custom ID System**: All collections use a custom numeric `id` field (not MongoDB `_id`) for user-friendly IDs. The `getLastDocument` helper generates sequential IDs.

**Auto-Incrementing**: `usersSchema.js` uses mongoose-sequence plugin for auto-incrementing ID.

**Password Hashing**: User passwords are hashed with bcrypt via Mongoose pre-save hooks.

**Soft Delete**: Assets, accessories, and licenses use `isDeleted` flag instead of hard delete.

## Environment Configuration

### Server (.env)
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/asset-management
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_SALT=10
JWT_ACCESS_EXPIRY_REMEMBERED=30d
JWT_ACCESS_EXPIRY_DEFAULT=15m
JWT_REFRESH_EXPIRY=7d
ALLOWED_ADDRESS=http://localhost
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_USER_ID=1
ENVIRONMENT=development
PAGINATION_DEFAULT_LIMIT=10
PAGINATION_MAX_LIMIT=100
```

### Client (.env)
```
VITE_API_BASE_URL=http://localhost:3000
```

## Common Patterns

### Adding a New Resource Type

1. **Define schema** in `common/schemas/yourResourceSchema.js`
2. **Add collection name** to `common/constants/collectionNames.js`
3. **Export schema** in `common/schemas/index.js`
4. **Create model** in `server/src/lib/models/index.js`
5. **Add controller** in `server/src/controllers/index.js` (choose Model or Instance type)
6. **Add route** to `server/src/config/routes.js` and `server/src/routes/index.js`
7. **Create service** in `client/src/services/`
8. **Create schema definition** in `client/src/schemas/`
9. **Add controller** to `client/src/core/core/controllers.ts`

### Working with Polymorphic References

When querying assets/accessories/licenses with assignees:
- Check `assigneeModel` to determine the type (users/locations)
- If `assigneeModel` is "common", use `actualAssigneeModel` for the real type
- Use `handlePolymorphicPopulate` helper to resolve all assignee references

### Testing Check-In/Check-Out

1. Create an asset/accessory/license
2. For accessories/licenses, instances are auto-created based on quantity
3. Check-out requires `assigneeModel`, `actualAssigneeModel`, and `assignee` ID
4. Check-in clears assignee fields and updates status
5. All actions are logged to history with metadata

## Database Startup

The server auto-creates an admin user on first run (see `server/src/startup/index.js`) using credentials from environment variables.
