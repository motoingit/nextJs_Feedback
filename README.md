# 🚀 Anonymous Feedback

An Anonymous Feedback platform built with **Next.js 16**, **TypeScript**, **MongoDB**, and **Zod**, allowing users to create anonymous profiles and receive feedback without revealing the sender's identity.

> ⚠️ This project is currently under active development.

---

# 📌 Current Progress

## ✅ Project Setup

- Next.js 16 (App Router)
- TypeScript
- Turbopack
- ESLint
- PostCSS
- Environment Variables
- Git Repository Initialized

---

## 📂 Project Structure

``` md
  ├── app/
  │   ├── favicon.ico
  │   ├── globals.css
  │   ├── layout.tsx
  │   └── page.tsx
  │
  ├── lib/
  │   └── dbConnect.ts
  │
  ├── model/
  │   └── User.ts
  │
  ├── schemas/
  │   ├── acceptMessageSchema.ts
  │   ├── messageSchema.ts
  │   ├── signInSchema.ts
  │   ├── signUpSchema.ts
  │   └── verifySchema.ts
  │
  ├── public/
  ├── .env
  ├── next.config.ts
  ├── package.json
  └── tsconfig.json
```

---

# ✅ Features Completed

### Project Configuration

- Next.js App Router
- TypeScript Configuration
- Path Aliases (`@/*`)
- Environment Configuration

---

### Database

- MongoDB Connection Utility
- Reusable Database Connection Function

```
lib/dbConnect.ts
```

---

### Data Models

- User Model

```
model/User.ts
```

---

### Validation

Implemented using **Zod**

- Sign Up Validation
- Sign In Validation
- Verification Validation
- Message Validation
- Accept Message Validation

```
schemas/
```

---

### Styling

- Global CSS
- Root Layout

---

# 🚧 Currently Working On

- Authentication
- API Routes
- User Registration
- Login
- Email Verification
- Anonymous Messaging
- Dashboard

---

# 🛠 Tech Stack

| Technology | Usage |
|------------|-------|
| Next.js 16 | Framework |
| React 19 | UI |
| TypeScript | Language |
| MongoDB | Database |
| Zod | Validation |
| ESLint | Linting |
| PostCSS | Styling |

---

# 📅 Upcoming Features

- User Authentication
- Email Verification
- Anonymous Feedback Submission
- Public Profile Page
- User Dashboard
- Toggle Accept Messages
- Message Inbox
- Delete Messages
- Loading States
- Toast Notifications
- Error Handling
- Responsive UI

---

# 🧠 Learning Goals

This project is being built to learn:

- Next.js App Router
- Server Components
- Route Handlers
- MongoDB Integration
- Zod Validation
- Authentication
- TypeScript Best Practices
- Scalable Project Structure

---

# 🚀 Getting Started

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Create environment variables

```bash
cp .env.example .env
```

Run the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 📈 Project Status

| Module | Status |
|---------|--------|
| Project Setup | ✅ |
| TypeScript | ✅ |
| MongoDB Setup | ✅ |
| User Model | ✅ |
| Zod Schemas | ✅ |
| Authentication | 🚧 |
| API Routes | 🚧 |
| Email Verification | 🚧 |
| Anonymous Messages | 🚧 |
| Dashboard | 🚧 |
| Deployment | ⏳ |

---

# 📄 License

This project is created for educational purposes and personal learning.
