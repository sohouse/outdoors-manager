<div align="center">
  <a href="README.md">中文</a> |
  <span>English</span>
</div>

# Outdoors Manager

Outdoors Manager is a prototype platform for managing outdoor activities. It focuses on the core product flows you would expect in a real-world activity system: activity management, filtered search, detail views, user registration and login, and basic permission control. The project is built with the Next.js App Router and combines Hono, Prisma, PostgreSQL, and Better Auth into a cohesive full-stack application.

## Overview

This project explores the domain of outdoor activity management. The current version already includes the main building blocks: an activity list, activity detail pages, filterable queries, activity editing and deletion, user registration and login, and API-level authorization.

The application is organized around a Next.js page layer, a Hono API layer, and a Prisma-powered data layer, covering the end-to-end flow from page rendering and API access to session handling and database operations.

## Demo

- Local development URL: `http://localhost:3000`
- API base path: `/api`
- OpenAPI docs entry: `/api/openapi`
- Demo screenshots: you can add screenshots for the activity list page, login page, and detail page
- Online demo: if deployed later, you can add a Vercel or self-hosted URL here

## Why This Project

The project is based on a business scenario that feels much closer to a real product than a typical practice app. Managing outdoor activities is not just about displaying event information; it naturally opens the door to features like participation, scheduling, leaders, vehicles, and resource allocation.

The current version focuses on the core activity management workflow and serves a few specific goals:

1. It is much closer to a real business domain than classic practice projects like blogs or todo apps.
2. It is a natural fit for engineering concerns such as multiple roles, multiple modules, and state-driven workflows, which makes it a good vehicle for demonstrating system design.
3. It covers the full-stack skills I most want to practice, including frontend interaction, API design, database modeling, authentication and authorization, and project-level engineering decisions.

The project also leaves room for future expansion into modules such as orders, vehicles, leaders, and scheduling.

## Features

Implemented so far:

- User registration and login
- Session authentication based on Better Auth
- Unified auth context injection via Hono middleware
- RBAC checks based on role permissions and resource ownership
- Permission cache and invalidation entry backed by Redis
- Activity list display
- Activity detail view
- Activity filtering and paginated search
- Basic activity editing and deletion
- Database access layer encapsulated with Prisma
- API route organization based on Hono
- Initial OpenAPI integration
- Basic theme switching and some shared UI component abstractions

Planned next:

- A more complete activity creation flow
- Order management
- User profile center and "My Activities"
- Role permissions and finer-grained access control
- Business modules for vehicles, leaders, scheduling, and more
- More complete API documentation and parameter validation
- Automated testing and CI pipelines

## Tech Stack

Frontend:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI
- Zustand
- React Hook Form
- Zod

Backend and API:

- Hono
- Hono OpenAPI
- Better Auth

Data layer:

- Prisma
- PostgreSQL

Other utilities:

- Day.js
- Faker (for test data generation)
- Upstash Redis (permission cache)

## Architecture

The project uses an integrated full-stack architecture:

- Next.js App Router handles page routing and the application shell
- Hono organizes API routes under `/api`
- Prisma serves as the database access layer
- Better Auth manages user authentication and sessions
- The frontend consumes backend capabilities through page components, service functions, and an API client
- Data access is organized with DAO / Service layering to reduce direct coupling between the page layer and database implementation

At this stage, the architecture is mainly designed to validate the following:

- Clear separation between the page layer and the API layer
- Centralized route mounting and middleware-based protection
- Centralized management of data models and query logic
- Decoupling auth context, authorization context, and business services
- Enough structure to support future business module expansion

The frontend structure of the activity module is also intentionally organized so that the list page, detail modal, and shared state each have a clearer responsibility:

- `src/app/(app)/activity/page.tsx`: activity page container; fetches list and permission data, and orchestrates `loading / empty / error / success` states
- `src/lib/components/web/ActivityList.tsx`: activity list presentation layer; iterates through data and composes list items
- `src/lib/components/web/ActivityListItem.tsx`: individual activity card; handles card UI, detail navigation, and delete entry
- `src/lib/features/activity/client/activity-detail-modal-client.tsx`: detail modal container; handles modal closing, list refresh after successful edits, and edit-permission branching
- `src/lib/features/activity/client/ActivityEditForm.tsx`: activity edit form; uses React Hook Form + Zod to manage field input and submission state
- `src/lib/features/activity/client/ActivityDetailView.tsx`: read-only activity detail view
- `src/lib/features/activity/shared/activity-store.ts`: stores list query conditions, pagination metadata, and refresh flags with Zustand so the list page, pagination, and delete/edit actions can coordinate
- `src/lib/features/activity/shared/activity-auth.ts`: centralizes activity edit/delete permission checks to avoid repeated RBAC parameter wiring in the page layer

## Auth & RBAC

The current auth flow is split into two layers:

- Authentication: Better Auth validates the session. Hono `authMiddleware` reads the session from the request headers and injects `auth` and `authz` into the request context after successful authentication.
- Authorization: `userRolePermission(user.id)` aggregates the current user's roles and permissions. Business services consume `UserRolePermission` directly instead of manually reconstructing `user + permissions` at the route layer.

The current context contract is:

- `auth`: authenticated `user` and `session`
- `authz`: aggregated roles and permissions for the current user

The activity module currently uses owner-aware RBAC:

- `activity:read`: allows reading the activity list and activity details
- `activity:update.own`: allows updating activities created by the current user
- `activity:update.any`: allows updating any activity
- `activity:delete.own`: allows deleting activities created by the current user
- `activity:delete.any`: allows deleting any activity

Ownership is determined only by `ownerId === authz.userId`. It no longer falls back to string matching against `ownerName`, `name`, or `username`. This avoids false positives caused by duplicate names or username changes, and makes the authorization model easier to reason about.

The current error conventions are:

- `400 Bad Request`: missing parameters, invalid parameter formats, invalid enum values
- `401 Unauthorized`: not logged in, invalid session, authentication failure
- `403 Forbidden`: logged in but lacking sufficient permissions
- `404 Not Found`: target resource does not exist
- `500 Internal Server Error`: unhandled server-side exceptions

Business error objects in the project already carry their HTTP status. `ApplicationException` includes the status code directly, and Hono's global error handler returns the response with that bound status, so the entry layer does not need to maintain a separate code-to-status mapping.

## Project Structure

```text
src/
  app/                    Next.js pages, routes, and layouts
  lib/
    api/                  Hono API entrypoint and client definitions
    auth.ts               Better Auth configuration
    components/           UI components and business components
    database/             Prisma client, DAO, schema, seed
    features/             Feature-based business modules
    middlewares/          Hono middlewares
    types/                Type definitions
    utils/                Shared utility functions
    config/               Routes and base configuration
prisma/                   Prisma-related configuration (if retained)
public/                   Static assets
```

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env` file in the project root and fill in the required values, for example:

```bash
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
AUTHZ_CACHE_TTL_SECONDS=300
```

### 3. Initialize the database

With the current project scripts, Prisma handles migrations, client generation, and seed initialization.

Common commands:

```bash
pnpm db:gen
pnpm db:push
pnpm db:seed
```

### 4. Start the development server

```bash
pnpm dev
```

Then visit:

```text
http://localhost:3000
```

## Available Scripts

Common scripts:

- `pnpm dev`: start the development server
- `pnpm build`: build the production bundle
- `pnpm start`: start the production server
- `pnpm lint`: run ESLint checks
- `pnpm type`: run TypeScript type checking
- `pnpm test:unit`: run unit tests with Vitest
- `pnpm test:unit:file -- <file>`: run a single test file
- `pnpm test:unit:name -- "<pattern>" [file]`: run tests filtered by test name
- `pnpm db:gen`: generate Prisma Client
- `pnpm db:push`: sync the database schema
- `pnpm db:dev`: run Prisma migrate dev
- `pnpm db:reset`: reset the database
- `pnpm db:seed`: run seed data

Unit test examples:

```bash
pnpm test:unit
pnpm test:unit:file -- src/lib/features/activity/test/activity-check.test.ts
pnpm test:unit:name -- "editActivityCheck should reject invalid date string" src/lib/features/activity/test/activity-check.test.ts
```

## API Documentation

OpenAPI support is already wired in. You can view the current API docs at:

```text
/api/openapi
```

Permission cache invalidation endpoints:

```text
DELETE /api/rolePermission/cache?id=<userId>
DELETE /api/rolePermission/cache?id=<userId>&type=role
DELETE /api/rolePermission/cache?id=<userId>&type=permission&name=activity:read
```

## Testing

The current unit tests mainly cover three areas:

- schema / check: parameter validation, default values, and format conversion
- service: permission checks, owner / own / any branches, and resource-not-found cases
- route: authentication middleware flow, `401 / 403 / 404` response boundaries, and behavior after context injection

Key test coverage already added:

- `activity-service.test.ts`: covers `activity:read`, `update.own`, `update.any`, `delete.own`, `delete.any`, and `404 not found`
- `role-permission.test.ts`: covers `isOwner` and `canManageOwnedResource`
- `role-permission-api.test.ts`: covers `authz` context access and parameter validation
- `auth-route.test.ts`: covers unauthenticated `401`, insufficient permission `403`, and missing resource `404`

The current testing principle for business code is:

- Every execution branch that affects final output, error type, permission decisions, or side effects should be covered by a corresponding test

## Challenges and Trade-offs

During implementation, the project has mainly revolved around these questions:

1. How should a Next.js project organize a clear API layering model instead of pushing all logic directly into pages?
2. How can the project move quickly on product features while still preserving type safety and maintainability?
3. How should authentication, API protection, database access, and frontend consumption be separated into clean boundaries?
4. How do you balance "ship the feature" with "invest in engineering quality"?

The current version focuses first on the main activity management and authentication flow. More tests, CI, deployment documentation, and additional business modules will be added incrementally.

## What I Learned
