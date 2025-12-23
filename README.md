# Hadithi Web App

Hadithi is a comprehensive content creation and distribution platform designed for creators to share stories, articles, books, and podcasts. Built with Next.js 14 and TypeScript, it offers a seamless experience for both content creators and consumers, featuring granular subscription tiers, multimedia support, and episodic series management.

## 🚀 Features

### 📝 Content Management
- **Rich Text Editing**: Integrated Tiptap editor for immersive writing experiences.
- **Multiple Formats**: Support for **Stories**, **Articles**, **Books**, and **Podcasts**.
- **Workflow System**: Robust status lifecycle including Draft, Pending Approval, Published, Rejected, and Archived.
- **Multimedia Integration**:
  - **Cover Images**: Base64 encoded storage for content covers.
  - **Podcasts**: Native audio file support with duration tracking.
  - **Cross-Linking**: Ability to attach **Image Galleries** or link related **Podcasts** directly within written content.

### 📚 Series & Collections
- **Episodic Content**: Organize stories or chapters into **Series**.
- **Chapter Management**: Automatic or manual chapter numbering within series.
- **Galleries**: Dedicated management for image collections with captions and alt text.

### 💰 Monetization & Access Control
- **Subscription Tiers**: Flexible gating system supporting **Free**, **Bronze**, **Silver**, and **Gold** tiers.
- **Granular Control**: Apply subscription requirements per content item or per gallery.

### 👥 Community & Discovery
- **Role-Based Access**: Distinct dashboards and capabilities for **Creators**, **Editors**, **Admins**, and **Users**.
- **Engagement**: Like and Comment systems.
- **Discovery**: Tagging system and advanced filtering by content type, status, and series.

## �️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Validation**: [Zod](https://zod.dev/)
- **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add the necessary environment variables:
   ```env
   # Local Database URL Format: 
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   NEXTAUTH_SECRET="your-super-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

   **Generating a Secure Secret:**
   
   - **Linux/macOS (Terminal):**
     ```bash
     openssl rand -base64 32
     ```
   - **Windows (PowerShell):**
     ```powershell
     [Convert]::ToBase64String((1..32 | %{ [byte](Get-Random -Max 256) }))
     ```

### Database Setup

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Run Migrations**
   Apply the schema to your local database.
   ```bash
   npx prisma migrate dev
   ```

3. **Seed the Database**
   Populate the database with initial data, including 4 default user accounts.
   ```bash
   npx prisma db seed
   ```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

## 🚀 Deployment

This project is optimized for deployment on Vercel.

1. Push your code to a Git repository.
2. Import the project into Vercel.
3. **Database Setup**: When you create a Postgres database within Vercel, it automatically updates the required `DATABASE_URL` variable.
4. **Manual Configuration**: You must manually add the `NEXTAUTH_SECRET` to the Environment Variables in Vercel settings.
5. Deploy!

**Automated Build Process:**
The `package.json` is configured to automatically run migrations and seed the database during the build process on Vercel:
```json
"build": "prisma migrate deploy && prisma db seed && next build"
```