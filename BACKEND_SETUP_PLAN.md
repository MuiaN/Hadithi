# Hadithi Backend Setup & Implementation Plan

This document outlines the step-by-step plan to transition the Hadithi application from a mock API to a real backend powered by Node.js, Prisma, and PostgreSQL, within the existing Next.js application structure.

## Phase 1: Setup and Initialization (Current Step)

-   [x] Install backend dependencies (`prisma`, `bcrypt`).
-   [x] Create `.env` file with `DATABASE_URL` for local PostgreSQL.
-   [x] Create `.gitignore` to exclude `node_modules` and `.env`.
-   [x] Create this `BACKEND_SETUP_PLAN.md` file.

## Phase 2: Prisma Schema and Database Migration

-   [ ] **Initialize Prisma:** Run `npx prisma init`. This will create the `prisma` directory and a `schema.prisma` file.
-   [ ] **Define Schema:** Copy the schema from `BACKEND_DOCUMENTATION.md` into `prisma/schema.prisma`.
-   [ ] **First Migration:** Run `npx prisma migrate dev --name init` to create the database tables based on the schema. This will also generate the Prisma Client.
-   [ ] **Database Seeding (Optional but Recommended):**
    -   Create a `prisma/seed.ts` file.
    -   Write a script to populate the database with initial data (e.g., admin user, subscription tiers, sample content) based on the existing `mockData` files.
    -   Update `package.json` to add a `prisma.seed` script.
    -   Run the seed script.

## Phase 3: API Route Implementation

The goal is to replace the mock API files (`lib/api/*.js`) with actual Next.js API routes that interact with the database via Prisma.

### 3.1. Authentication (`/api/v1/auth/*`)

-   [ ] **Create Prisma Client Instance:** Create a singleton instance of Prisma Client (e.g., in `lib/prisma.ts`) to be used across all API routes.
-   [ ] **Implement `POST /api/v1/auth/register`:**
    -   Create the route file: `app/api/v1/auth/register/route.ts`.
    -   Validate input (name, email, password).
    -   Check if user exists.
    -   Hash password using `bcrypt`.
    -   Create user in DB using Prisma.
    -   Generate JWT.
-   [ ] **Implement `POST /api/v1/auth/login`:**
    -   Create the route file: `app/api/v1/auth/login/route.ts`.
    -   Find user by email.
    -   Compare password hash with `bcrypt`.
    -   Generate JWT.
-   [ ] **Update Frontend:** Modify `authApi.js` and the auth pages (`login`, `register`) to call these new API endpoints instead of the mock functions.

### 3.2. Content API (`/api/v1/content/*`)

-   [ ] **Implement `GET /api/v1/content`:**
    -   Create the route file: `app/api/v1/content/route.ts`.
    -   Implement filtering, sorting, and pagination logic using Prisma queries.
-   [ ] **Implement `GET /api/v1/content/:id`:**
    -   Create the route file: `app/api/v1/content/[id]/route.ts`.
    -   Fetch content by ID and increment view count.
-   [ ] **Implement other content endpoints:**
    -   `POST /api/v1/content` (Create)
    -   `PUT /api/v1/content/:id` (Update)
    -   `DELETE /api/v1/content/:id` (Delete)
-   [ ] **Update Frontend:** Modify `contentApi.js` to use the new endpoints.

## Phase 4: Advanced Features & Refinement

-   [ ] **Implement User Profile API:** Create endpoints for `GET` and `PUT` on `/api/v1/auth/profile`.
-   [ ] **Implement Subscriptions API:** Plan and implement the subscription logic, including webhooks for a payment provider like Stripe.
-   [ ] **Implement Galleries API:** Build out the API routes for gallery management.
-   [ ] **Authentication Middleware:** Create middleware for Next.js to protect routes and manage user sessions based on JWT.
-   [ ] **Refactor Frontend Stores:** Update `useStore.js` and `galleriesStore.ts` to fetch data from the new APIs instead of relying on mock functions.