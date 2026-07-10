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
  │   ├── (auth)/
  │   │   ├── sign-in/
  │   │   ├── sign-up/
  │   │   └── verify/
  │   │       └── [username]/
  │   ├── api/
  │   │   ├── accept-messages/
  │   │   ├── auth/
  │   │   ├── check-username-unique/
  │   │   ├── get-messages/
  │   │   ├── send-messages/
  │   │   ├── sign-up/
  │   │   ├── suggest-messages/
  │   │   └── verify-code/
  │   ├── favicon.ico
  │   ├── globals.css
  │   ├── layout.tsx
  │   └── page.tsx
  │
  ├── components/
  │   └── ui/
  │
  ├── context/
  │   └── AuthProvider.tsx
  │
  ├── lib/
  │   ├── dbConnect.ts
  │   ├── env.ts
  │   ├── gemini.ts
  │   └── resend.ts
  │
  ├── model/
  │   ├── Message.ts
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
  │   ├── returnResponse.ts
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
- Environment Configuration & Validation (Zod schema checking on startup)

---

### Database

- MongoDB Connection Utility
- Reusable Database Connection Function (Globally cached to prevent HMR leaks)

```
lib/dbConnect.ts
```

---

### Data Models

- User & Message Schema Models

```
model/User.ts
model/Message.ts
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
- Tailored Toast Notifications (Sonner)

---

### Email Verification Setup

- Reusable Resend Client Setup
- Verification Email Sending Utility (HTML template built with inlined responsive styles for minimal compilation overhead)

```
lib/resend.ts
utils/sendVerificationEmail.ts
```

---

### Authentication & API Handlers

- Sign Up Route Handler (`POST` with conflicting unverified username cleanups)
- NextAuth Authentication configuration (`options.ts` and `[...nextauth]/route.ts`)
- OTP Verification Code Route Handler (`POST`)
- Unique Username Availability Check API (`GET` with debounce support)
- Message Acceptance Toggle API (`GET` & `POST`)
- Anonymous Feedback Messaging APIs (`POST` delivery & `GET` aggregations)

```
app/api/sign-up/route.ts
app/api/auth/[...nextauth]/options.ts
app/api/verify-code/route.ts
app/api/check-username-unique/route.ts
app/api/accept-messages/route.ts
app/api/get-messages/route.ts
app/api/send-messages/route.ts
```

---

# 🚧 Currently Working On

- User Dashboard UI & Public Profile page integration
- Deployment pipeline optimizations

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
| Bcryptjs | Password Hashing |
| ESLint | Linting |
| PostCSS | Styling |

---

# 📅 Upcoming Features

- Public Profile Page
- User Dashboard UI
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
| Sign-In (NextAuth) | ✅ |
| OTP Verification Route | ✅ |
| Anonymous Messages API | ✅ |
| Dashboard UI | 🚧 |
| Deployment | ⏳ |

---

# 📄 License

This project is created for educational purposes and personal learning.
