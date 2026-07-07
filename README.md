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
  │   ├── api/
  │   │   └── sign-up/
  │   │       └── route.ts
  │   ├── favicon.ico
  │   ├── globals.css
  │   ├── layout.tsx
  │   └── page.tsx
  │
  ├── components/
  │   └── email/
  │       └── VerificationEmail.tsx
  │
  ├── lib/
  │   ├── dbConnect.ts
  │   └── resend.ts
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
  ├── types/
  │   └── ApiResponse.ts
  │
  ├── utils/
  │   └── sendVerificationEmail.ts
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

### Email Verification Setup

- Verification Email Component with React-Email
- Reusable Resend Client Setup
- Verification Email Sending Utility

```
components/email/VerificationEmail.tsx
lib/resend.ts
utils/sendVerificationEmail.ts
```

---

### Authentication & User API

- Sign Up Route Handler (`POST`)
- Password Hashing (using `bcryptjs`)
- OTP Verification Code Generation & Persistent Expiry

```
app/api/sign-up/route.ts
```

---

### Types & Interfaces

- Custom Standardized `ApiResponse` interface

```
types/ApiResponse.ts
```

---

# 🚧 Currently Working On

- Authentication (NextAuth Integration for Sign-In)
- User OTP/Verification Code Verification API Route
- Toggle Accept Message API Route
- User Dashboard & Public Profile
- Anonymous Feedback Submission API

---

# 🛠 Tech Stack

| Technology | Usage |
|------------|-------|
| Next.js 16 | Framework |
| React 19 | UI |
| TypeScript | Language |
| MongoDB | Database |
| Zod | Validation |
| Resend | Email Service |
| React Email | Email Styling |
| Bcryptjs | Password Hashing |
| ESLint | Linting |
| PostCSS | Styling |

---

# 📅 Upcoming Features

- User Sign-In (NextAuth integration)
- OTP Verification API (Verify Email)
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
| Sign-Up API | ✅ |
| Email Verification Setup | ✅ |
| Sign-In (NextAuth) | 🚧 |
| OTP Verification Route | 🚧 |
| Anonymous Messages | 🚧 |
| Dashboard | 🚧 |
| Deployment | ⏳ |

---

# 📄 License

This project is created for educational purposes and personal learning.
