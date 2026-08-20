# 🚀 HackForge - Production-Ready Full-Stack Hackathon Platform

**HackForge** is an enterprise-grade, full-stack hackathon discovery, management, and judging platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.

---

## 🌟 Key Features

### 1. 🔍 Discovery & Public Experience
- **Hero & Lifecycle**: "Build. Collaborate. Innovate." with animated live platform counters, innovation tracks, and interactive lifecycle workflows.
- **Advanced Multi-Faceted Search**: Keyword search, filters by Theme (AI, Web3, Climate, Health, FinTech, CyberSecurity, etc.), Format (Online, Offline, Hybrid), Status (Registration Open, Active, Judging, Completed), and Sorting.
- **Hackathon Hubs (`/hackathons/[slug]`)**: Tabbed interface featuring Overview, Interactive Timeline Schedule, Rules & Eligibility, Prizes & Tracks, Sponsor Tiers, Judges & Mentors panel, Announcements, and 1-Click Registration.
- **Public Leaderboards (`/hackathons/[slug]/leaderboard`)**: Live ranked leaderboards with weighted scores, judge review counts, and winner award badges with celebration confetti.
- **Public Developer Profiles (`/profile/[username]`)**: Developer showcases displaying participated hackathons, submitted projects, skills chips, and verified credentials.
- **Cryptographic Certificate Verification (`/certificates/verify/[code]`)**: Unique verification codes (`HK-XXXX-XXXX-XXXX`) with high-resolution printable certificates.

### 2. 🧑‍💻 Participant Experience
- **Participant Dashboard (`/dashboard`)**: Unified command center with live status for registered hackathons, upcoming deadlines, active teams, project submissions, and issued certificates.
- **Team Workspace (`/teams/[slug]`)**: Team formation with shareable join codes (`TEAM-XXXX`), invitation system, member roster management, leadership delegation, and capacity enforcement.
- **Project Submission Wizard (`/hackathons/[slug]/submit`)**: Rich multi-section submission form supporting draft auto-saving, problem/solution breakdown, tech stack tags, GitHub repositories, live demo links, video pitch walkthroughs, and deadline enforcement.

### 3. 🎪 Organizer Experience
- **Organizer Command Center (`/organizer`)**: Platform analytics with Recharts (participation velocity, format breakdown), hackathons manager, and live stats.
- **11-Step Creation Wizard (`/organizer/new`)**:
  1. Basic Info & Slug
  2. Dates & Deadlines
  3. Rules & Eligibility
  4. Team Configuration
  5. Prizes & Tracks
  6. Judging Criteria & Multiplier Weights
  7. Sponsors & Tier Management
  8. Event Schedule Timeline
  9. Mentors & Judges Assignment
  10. Full Preview & Validation
  11. Publish / Save Draft
- **Setup Progress Checklist**: Visual completion status bar.
- **Live Leaderboard Controller**: Toggle public visibility, freeze judging scores, and assign winner prizes.

### 4. ⚖️ Judging & Evaluation System
- **Judge Portal (`/judge`)**: Assigned hackathons queue, project review progress indicators (% completed), and pending review queues.
- **Dedicated Judging Studio (`/judge/projects/[id]`)**: Side-by-side evaluation with project demo/code on the left and interactive weighted score sliders (1 to 10), written feedback, and live weighted total score calculator on the right.

### 5. 🛡️ Platform Admin Moderation
- **Governance Console (`/admin`)**: Platform-wide metrics, user role management, content reports triage (Spam, Plagiarism, Harassment), and chronological audit logs stream.

---

## 🔑 Demo Accounts

Use the **Instant Demo Switcher** in the top navigation bar or log in directly with:

| Role | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **🛡️ Admin** | `admin@hackathon.dev` | `Password123!` | Full admin console, user moderation, reports triage, audit logs |
| **🎪 Organizer** | `organizer@hackathon.dev` | `Password123!` | Host hackathons, creation wizard, prize allocation, analytics |
| **⚖️ Judge** | `judge@hackathon.dev` | `Password123!` | Assigned project review queue, weighted scoring studio |
| **🧭 Mentor** | `mentor@hackathon.dev` | `Password123!` | Mentorship sessions, technical advice |
| **🧑‍💻 Hacker** | `hacker@hackathon.dev` | `Password123!` | Register, form teams, submit projects, view certificates |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router, Server & Client Components)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS, Glassmorphism, CSS Custom Properties
- **Database**: Prisma ORM with SQLite (zero-setup local) & PostgreSQL support
- **Authentication**: JWT Cookie Sessions with Bcrypt Password Hashing & RBAC
- **Analytics & Visuals**: Recharts, Lucide Icons, Canvas Confetti
- **Testing**: Vitest Unit & Integration Test Suite

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Database
```bash
npx prisma generate
npx prisma db push
```

### 3. Seed Database with Realistic Data
```bash
npx tsx prisma/seed.ts
```

### 4. Run Automated Tests
```bash
npm test
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Deployment

### Production Build
```bash
npm run build
npm start
```

### PostgreSQL Configuration (Optional)
To use PostgreSQL (Neon, Supabase, AWS RDS), update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Set `DATABASE_URL="postgresql://user:password@host:5432/dbname"` in `.env` and run `npx prisma db push`.
