# Hadithi Platform: Backend Architecture & API Specification

This document outlines the backend architecture, database schema, and API endpoints for the Hadithi platform. The goal is to create a robust, scalable, and secure backend service that will replace the current mock API structure.

## 1. Technology Stack

*   **Runtime Environment:** Node.js
*   **Framework:** Express.js
*   **Database ORM:** Prisma
*   **Database:** PostgreSQL (Recommended for its robustness and feature set with Prisma)
*   **Authentication:** JSON Web Tokens (JWT) with `bcrypt` for password hashing.
*   **API Client (for internal services if needed):** Axios
*   **Validation:** A library like `joi` or `express-validator` for input validation.

## 2. Database Schema (Prisma)

Below is the proposed Prisma schema. This schema defines the tables, columns, and relationships in our database.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

//================================================================
// AUTH & USER MODELS
//================================================================

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  password     String
  name         String
  role         Role      @default(USER)
  avatar       String?
  bio          String?
  isVerified   Boolean   @default(false)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  subscription UserSubscription?
  content      Content[]
  comments     Comment[]
  galleries    Gallery[]
  likes        Like[]
}

model UserSubscription {
  id                   String   @id @default(cuid())
  status               SubscriptionStatus @default(ACTIVE)
  tier                 SubscriptionTier
  startDate            DateTime
  endDate              DateTime
  autoRenew            Boolean  @default(true)
  stripeSubscriptionId String?  @unique // From Stripe
  stripeCustomerId     String?  @unique // From Stripe

  user   User   @relation(fields: [userId], references: [id])
  userId String @unique
}

enum Role {
  USER
  CREATOR
  EDITOR
  ADMIN
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  PAST_DUE
}

enum SubscriptionTier {
  BRONZE
  SILVER
  GOLD
}


//================================================================
// CONTENT MODELS
//================================================================

model Content {
  id           String    @id @default(cuid())
  title        String
  description  String
  content      String    @db.Text
  coverImage   String?
  type         ContentType
  status       ContentStatus @default(DRAFT)
  isFree       Boolean   @default(false)
  subscriptionTier SubscriptionTier? // Required tier if not free
  readingTime  String?   // e.g., "5 min read"
  duration     String?   // e.g., "45:32" for podcasts
  audioUrl     String?   // for podcasts

  publishedAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  author       User      @relation(fields: [authorId], references: [id])
  authorId     String

  tags         Tag[]     @relation("ContentTags")
  comments     Comment[]
  likes        Like[]
  views        Int       @default(0)
}

model Tag {
  id      String    @id @default(cuid())
  name    String    @unique
  content Content[] @relation("ContentTags")
}

model Comment {
  id        String   @id @default(cuid())
  comment   String
  createdAt DateTime @default(now())

  author    User   @relation(fields: [authorId], references: [id])
  authorId  String

  content   Content @relation(fields: [contentId], references: [id])
  contentId String
}

model Like {
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  content   Content  @relation(fields: [contentId], references: [id])
  contentId String
  createdAt DateTime @default(now())

  @@id([userId, contentId])
}

enum ContentType {
  STORY
  ARTICLE
  BOOK
  PODCAST
}

enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}


//================================================================
// GALLERY MODELS
//================================================================

model Gallery {
  id           String    @id @default(cuid())
  title        String
  description  String
  isPublished  Boolean   @default(false)
  publishedAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  viewCount    Int       @default(0)

  author       User      @relation(fields: [authorId], references: [id])
  authorId     String
  
  images       GalleryImage[]
  tags         String[] // Simple array of strings for tags
}

model GalleryImage {
  id        String  @id @default(cuid())
  url       String
  caption   String
  alt       String
  
  gallery   Gallery @relation(fields: [galleryId], references: [id])
  galleryId String
}
```

### 3. API Endpoint Specification

Here are the API endpoints derived from your mock API files. All endpoints should be prefixed with `/api/v1`.

#### 3.1. Authentication (`/auth`)

*   **`POST /auth/register`**
    *   **Description:** Registers a new user.
    *   **Body:** `{ name, email, password }`
    *   **Response (Success):** `201 Created` - `{ user, token, message }`
    *   **Response (Error):** `409 Conflict` - If email already exists.

*   **`POST /auth/login`**
    *   **Description:** Logs in an existing user.
    *   **Body:** `{ email, password }`
    *   **Response (Success):** `200 OK` - `{ user, token, message }`
    *   **Response (Error):** `401 Unauthorized` - Invalid credentials.

*   **`POST /auth/logout`**
    *   **Description:** Logs out the user (client-side token removal, can be stateful if needed).
    *   **Response:** `200 OK` - `{ message }`

*   **`GET /auth/profile`**
    *   **Description:** Gets the profile of the currently authenticated user.
    *   **Auth:** Required (Bearer Token).
    *   **Response:** `200 OK` - `{ user }`

*   **`PUT /auth/profile`**
    *   **Description:** Updates the profile of the currently authenticated user.
    *   **Auth:** Required.
    *   **Body:** `{ name?, bio?, avatar? }`
    *   **Response:** `200 OK` - `{ user }`

#### 3.2. Content (`/content`)

*   **`GET /content`**
    *   **Description:** Retrieves a paginated and filtered list of content.
    *   **Query Params:** `type`, `tags`, `author`, `search`, `sortBy`, `sortOrder`, `page`, `limit`, `includeUnpublished`.
    *   **Response:** `200 OK` - `{ content: [], total, page, limit }`

*   **`GET /content/featured`**
    *   **Description:** Gets a list of featured content (e.g., most viewed).
    *   **Query Params:** `limit`
    *   **Response:** `200 OK` - `[content]`

*   **`GET /content/latest`**
    *   **Description:** Gets a list of the most recently published content.
    *   **Query Params:** `limit`
    *   **Response:** `200 OK` - `[content]`

*   **`GET /content/tags`**
    *   **Description:** Retrieves all unique tags.
    *   **Response:** `200 OK` - `[tag]`

*   **`GET /content/:id`**
    *   **Description:** Retrieves a single piece of content by its ID. Increments view count.
    *   **Response:** `200 OK` - `{ content }`
    *   **Logic:** Check if content is free or if the user's subscription tier is sufficient.

*   **`POST /content`**
    *   **Description:** Creates new content (as a draft).
    *   **Auth:** Required (Role: `CREATOR`, `EDITOR`, `ADMIN`).
    *   **Body:** `{ title, description, content, type, tags, isFree, subscriptionTier }`
    *   **Response:** `201 Created` - `{ content }`

*   **`PUT /content/:id`**
    *   **Description:** Updates a piece of content.
    *   **Auth:** Required (Owner or `EDITOR`/`ADMIN`).
    *   **Body:** `{ title?, description?, ... }`
    *   **Response:** `200 OK` - `{ content }`

*   **`DELETE /content/:id`**
    *   **Description:** Deletes a piece of content.
    *   **Auth:** Required (Owner or `ADMIN`).
    *   **Response:** `204 No Content`

*   **`POST /content/:id/publish`**
    *   **Description:** Publishes a piece of content.
    *   **Auth:** Required (`EDITOR`, `ADMIN`).
    *   **Response:** `200 OK` - `{ content }`

*   **`POST /content/:id/like`**
    *   **Description:** Likes/unlikes a piece of content.
    *   **Auth:** Required.
    *   **Response:** `200 OK` - `{ likes: count }`

#### 3.3. Comments (`/content/:id/comments`)

*   **`GET /content/:id/comments`**
    *   **Description:** Gets all comments for a piece of content.
    *   **Response:** `200 OK` - `[comment]`

*   **`POST /content/:id/comments`**
    *   **Description:** Adds a new comment.
    *   **Auth:** Required.
    *   **Body:** `{ comment }`
    *   **Response:** `201 Created` - `{ comment }`

#### 3.4. Subscriptions (`/subscriptions`)

*   **`GET /subscriptions/tiers`**
    *   **Description:** Gets all available subscription tiers and their details.
    *   **Response:** `200 OK` - `{ tiers }` (This can be a static config file).

*   **`GET /subscriptions/my-subscription`**
    *   **Description:** Gets the current user's subscription details.
    *   **Auth:** Required.
    *   **Response:** `200 OK` - `{ subscription }`

*   **`POST /subscriptions/create-payment-intent`**
    *   **Description:** Creates a Stripe Payment Intent to initiate a subscription purchase.
    *   **Auth:** Required.
    *   **Body:** `{ tierName }`
    *   **Response:** `200 OK` - `{ clientSecret }`

*   **`POST /subscriptions/update`**
    *   **Description:** This endpoint is triggered by a Stripe webhook after a successful payment to create or update the user's subscription in the DB.
    *   **Auth:** Stripe Webhook Signature.
    *   **Body:** (Stripe event object)
    *   **Response:** `200 OK`

*   **`POST /subscriptions/cancel`**
    *   **Description:** Cancels a user's subscription (sets `autoRenew` to false in Stripe and our DB).
    *   **Auth:** Required.
    *   **Response:** `200 OK` - `{ message, subscription }`

### 4. Authentication Flow

1.  **Registration/Login:** User provides credentials. The server validates them, hashes the password using `bcrypt`, and generates a JWT.
2.  **Token Storage:** The JWT is sent to the client, which stores it securely (e.g., in an HttpOnly cookie or local storage).
3.  **Authenticated Requests:** For protected routes, the client sends the JWT in the `Authorization` header (`Bearer <token>`).
4.  **Middleware:** A middleware on the server verifies the JWT signature and expiration. If valid, it decodes the payload (e.g., `userId`, `role`) and attaches it to the request object (`req.user`) for use in downstream controllers.
5.  **Role-Based Access:** Controllers check `req.user.role` to authorize actions restricted to specific roles (e.g., publishing content).

