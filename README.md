# Asset Management System

A comprehensive full-stack IT asset management system for tracking and managing company assets, accessories, licenses, users, locations, and organizational structure.

## Features

- **Asset Management**: Track IT assets with check-in/check-out functionality
- **Accessories & Licenses**: Manage accessories and licenses with instance-based tracking
- **User Management**: Manage users with roles and authentication
- **Organizational Structure**: Handle companies, departments, job titles, and seniorities
- **Location Tracking**: Track asset locations and indirect assignments
- **History Logging**: Complete audit trail of all actions
- **Soft Delete**: Safely archive items without permanent deletion
- **JWT Authentication**: Secure authentication with access and refresh tokens
- **Responsive UI**: Modern React interface with TailwindCSS

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **React Router** for routing
- **Axios** for API communication
- **Recharts** for data visualization

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Express Rate Limit** for API protection

### Architecture
- **Monorepo** structure with shared common module
- **Controller pattern** on both client and server
- **Schema-driven** forms and validation
- **Docker** support for easy deployment

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB 7+ (or Docker)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/olgierdowczarczak/asset-management.git
   cd asset-management
   ```

2. **Install dependencies**
   ```bash
   # Install common module dependencies
   cd common
   npm install
   cd ..

   # Install server dependencies
   cd server
   npm install
   cd ..

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Configure environment variables**

   **Server** (`server/.env`):
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

   **Client** (`client/.env`):
   ```bash
   cp client/.env.example client/.env
   # Edit client/.env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7

   # Or use your local MongoDB installation
   ```

5. **Start the development servers**

   **Terminal 1 - Server:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Client:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Client: http://localhost:5174
   - Server API: http://localhost:3000
   - Default admin credentials: See `ADMIN_EMAIL` and `ADMIN_PASSWORD` in server/.env

## Docker Deployment

For production deployment using Docker:

1. **Configure environment**
   ```bash
   cd compose
   cp .env.example .env
   # Edit .env with production values
   ```

2. **Start all services**
   ```bash
   cd compose
   docker-compose up -d
   ```

3. **Access the application**
   - Client: http://localhost:80
   - Server API: http://localhost:3000

4. **View logs**
   ```bash
   docker-compose logs -f
   ```

5. **Stop services**
   ```bash
   docker-compose down
   ```

## Development

### Project Structure

```
asset-management/
├── client/               # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── core/         # Core controllers and handlers
│   │   ├── pages/        # Page components
│   │   ├── schemas/      # Form schemas
│   │   ├── services/     # API services
│   │   └── lib/          # Utilities and helpers
│   └── package.json
├── server/               # Express backend API
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/       # API routes
│   │   ├── lib/          # Models and utilities
│   │   ├── middleware/   # Express middleware
│   │   ├── config/       # Configuration
│   │   └── startup/      # Initialization scripts
│   └── package.json
├── common/               # Shared code between client and server
│   ├── schemas/          # Mongoose schemas
│   ├── constants/        # Shared constants
│   └── helpers/          # Shared utilities
├── compose/              # Docker compose configuration
```

### Available Scripts

#### Client
```bash
cd client
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run eslint       # Run ESLint
npm run eslint:fix   # Auto-fix ESLint issues
npm run format       # Format with Prettier
npm run preview      # Preview production build
```

#### Server
```bash
cd server
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
npm run eslint       # Run ESLint
npm run eslint:fix   # Auto-fix ESLint issues
npm run format       # Format with Prettier
```

### Environment Variables

#### Server Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/asset-management` |
| `JWT_SECRET` | JWT access token secret | Required |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Required |
| `JWT_SALT` | bcrypt salt rounds | `10` |
| `JWT_ACCESS_EXPIRY_REMEMBERED` | Access token expiry (remembered) | `30d` |
| `JWT_ACCESS_EXPIRY_DEFAULT` | Access token expiry (default) | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry | `7d` |
| `ALLOWED_ADDRESS` | CORS allowed origin | `http://localhost:5174` |
| `ADMIN_EMAIL` | Default admin email | `admin@example.com` |
| `ADMIN_PASSWORD` | Default admin password | `admin123` |
| `ADMIN_USER_ID` | Default admin user ID | `1` |
| `ENVIRONMENT` | Environment mode | `development` |
| `PAGINATION_DEFAULT_LIMIT` | Default pagination limit | `10` |
| `PAGINATION_MAX_LIMIT` | Maximum pagination limit | `100` |

#### Client Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000` |

## Key Concepts

### Polymorphic Assignments
Assets, accessories, and licenses can be assigned to:
- **Users** (direct assignment)
- **Locations** (indirect assignment - shows actual assignee via `actualAssigneeModel`)

### Instance Management
Accessories and licenses use a parent-instance pattern:
- **Parent record** defines the item (e.g., "Keyboard Model X")
- **Instance records** track individual units (#1, #2, #3...)
- Quantity changes automatically create/delete instances
- Cannot decrease quantity below number of assigned instances

### History Logging
All create, update, delete, check-in, and check-out actions are logged to the History collection with complete metadata for audit trails.

### Soft Delete
All main collections (Assets, Accessories, Licenses, Users, Locations, Companies, Departments) use an `isDeleted` flag instead of hard deletion. This approach:
- Allows recovery of deleted items
- Maintains complete historical data integrity and audit trail
- Prevents foreign key integrity issues
- Exception: AccessoryInstances and LicenseInstances are physically deleted when parent is removed

## API Documentation

The API follows RESTful conventions with the following main endpoints:

- `GET /api/{resource}` - List all items (with pagination)
- `GET /api/{resource}/:id` - Get single item by ID
- `POST /api/{resource}` - Create new item
- `PUT/PATCH /api/{resource}/:id` - Update item
- `DELETE /api/{resource}/:id` - Delete item (soft delete)
- `POST /api/{resource}/:id/checkin` - Check in item
- `POST /api/{resource}/:id/checkout` - Check out item

Resources: `assets`, `accessories`, `licenses`, `users`, `companies`, `departments`, `jobtitles`, `seniorities`, `locations`

### Authentication Endpoints

- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout and invalidate tokens
- `POST /api/auth/refresh` - Refresh access token

### Code Style

- Run ESLint before committing: `npm run eslint`
- Format code with Prettier: `npm run format`
- Follow existing patterns and conventions
