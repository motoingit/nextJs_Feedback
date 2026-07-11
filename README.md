# 🚀 Anonymous Feedback

An Anonymous Feedback platform built with **Next.js 16**, **TypeScript**, **MongoDB**, and **Zod**, allowing users to create anonymous profiles and receive feedback without revealing the sender's identity.

> 🎉 **Production Ready Beta**: The core codebase, AI integrations, database models, and validation layers are 100% complete and fully verified.

---

# 📌 Current Progress (100% Complete)

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
  │   ├── (app)/                    # App Route Group (Shares Navbar header layout)
  │   │   ├── layout.tsx
  │   │   ├── page.tsx              # Redesigned landing page with feature cards
  │   │   └── dashboard/
  │   │       └── page.tsx          # Modular grid dashboard widgets
  │   ├── (auth)/                   # Auth Route Group (Clean pages without Navbar)
  │   │   ├── sign-in/
  │   │   ├── sign-up/
  │   │   └── verify/
  │   │       └── [username]/
  │   ├── api/
  │   │   ├── accept-messages/
  │   │   ├── auth/
  │   │   ├── check-username-unique/
  │   │   ├── delete-message/       # DELETE API for removing feedback messages
  │   │   │   └── [messageid]/
  │   │   ├── get-messages/
  │   │   ├── get-user-status/      # GET API to fetch user profile accepting status
  │   │   ├── send-messages/
  │   │   ├── sign-up/
  │   │   ├── suggest-messages/
  │   │   └── verify-code/
  │   ├── u/                        # Public access routes
  │   │   └── [username]/           # Dynamic feedback submission page with Gemini suggestions
  │   ├── favicon.ico
  │   ├── globals.css
  │   ├── layout.tsx                # Root layout (Main HTML / body / providers)
  │
  ├── components/
  │   ├── my/
  │   │   ├── MessageCard.tsx       # Message card render & deletion component
  │   │   └── Navbar.tsx            # Sticky glassmorphic navbar component
  │   └── shadcn/                   # Reusable shadcn design tokens
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
  │   ├── logger-init.ts            # Monkey-patched global server console stream formatters
  │   ├── returnResponse.ts
  │   └── sendVerificationEmail.ts
  │
  ├── proxy.ts                      # Request gateway proxy checker (Replacing deprecated middleware)
  │   └── [messageid]/
  │   ├── get-messages/
  │   ├── get-user-status/      # GET API to fetch user profile accepting status
  │   ├── send-messages/
  │   ├── sign-up/
  │   ├── suggest-messages/
  │   └── verify-code/
  │   ├── u/                        # Public access routes
  │   │   └── [username]/           # Dynamic feedback submission page with Gemini suggestions
  │   ├── favicon.ico
  │   ├── globals.css
  │   ├── layout.tsx                # Root layout (Main HTML / body / providers)
  │
  ├── components/
  │   ├── my/
  │   │   ├── MessageCard.tsx       # Message card render & deletion component
  │   │   └── Navbar.tsx            # Sticky glassmorphic navbar component
  │   └── shadcn/                   # Reusable shadcn design tokens
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
  │   ├── logger-init.ts            # Monkey-patched global server console stream formatters
  │   ├── returnResponse.ts
  │   └── sendVerificationEmail.ts
  │
  ├── proxy.ts                      # Request gateway proxy checker (Replacing deprecated middleware)
  ├── public/
  ├── .env
  ├── next.config.ts
  └── tsconfig.json
```

---

# ✅ Features Completed

### 1. UI Redesign & Aesthetics
- **Branding Header**: Added a sticky, glassmorphic Navigation Header (`Navbar.tsx`) with blur backdrops, bold gradients, and conditional account logic.
- **Home Landing Page**: Beautiful, fully responsive homepage layout featuring an interactive mesh background glow, card carousels, and detailed feature grids.
- **Glassmorphic Auth Pages**: Styled all registration, login, and verify layouts with background flows, drop shadows, and clean field group structures.
- **Modular Dashboard Layout**: Replaced flat page layouts with widget panels (Link Sharing card, Status control block, and 3-column inbox grid).
- **Public Submission Page (`/u/[username]`)**: Renders public-facing landing where anonymous feedback is typed, checked against AI suggestion Prompts (via Gemini), and dispatched to MongoDB inbox arrays.
- **Custom Toasters (Sonner)**: Standardized to colorful, bold, and centered top-center banner alerts.

### 2. Database & Data Models
- Reusable MongoDB connection state function (cached globally to survive HMR/Hot Reload re-evaluations).
- Mongoose User & Message schemas.

### 3. Validation
- Comprehensive form parsing and validation schemas implemented using **Zod** (Sign up, sign in, validation, messages, and switches).

### 4. Email Verification Setup
- Verification email utility using Resend with custom HTML responsive styling templates.

### 5. Authentication & API Handlers
- Conflicting unverified user cleanup triggers on new sign-ups.
- NextAuth configuration (`options.ts` and callback token persistence).
- Dynamic Username availability checker (with client-side input debounce).
- Verification OTP handler (`verify-code`).
- Toggle inbox acceptance API (`accept-messages` with modern native `{ returnDocument: 'after' }` mongoose queries).
- Message delete API (`DELETE` route fully wired to databases).
- Global console logs formatter (appends vertical spacing and colorizes status outputs like `SUCCESS;`, `ERROR;`, etc. with terminal background block colors).

---

# 🛠 Tech Stack

| Technology | Usage |
|------------|-------|
| Next.js 16 | React framework |
| React 19 | UI engine |
| TypeScript | Dynamic safety |
| MongoDB | Datastore |
| Mongoose 9 | ODM layer |
| Zod | Payload validation |
| Resend | Email sender API |
| Gemini AI | Suggested prompt generators |
| Tailwind CSS 4 | Styling layout |

---

# 🚀 Getting Started

Clone the repository:
```bash
git clone <repository-url>
```

Install dependencies:
```bash
npm install
```

Create environment variables:
```bash
cp .env.example .env
```

Run the development server:
```bash
npm run dev
```

Open:
```
http://localhost:3000
```

---

# 📈 Project Status

| Module | Status |
|---------|--------|
| Project Setup | ✅ |
| TypeScript Compiler | ✅ |
| MongoDB Connector | ✅ |
| Zod Schemas | ✅ |
| Sign-Up API | ✅ |
| OTP Verification Route | ✅ |
| Sign-In (NextAuth credentials) | ✅ |
| Gateway Proxy Checker (`proxy.ts`) | ✅ |
| Accept Messages API | ✅ |
| Get Messages API | ✅ |
| Delete Message API | ✅ |
| Dashboard UI | ✅ |
| Terminal Logging Colors & Spacing | ✅ |
| Public Profile Page (`/u/[username]`) | ✅ |
| Deployment Adaptations | ✅ |

---

# 📄 License

This project is created for educational purposes and personal learning.
