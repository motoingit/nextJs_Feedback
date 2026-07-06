# AGENTS.md

## Project Philosophy

- Prioritize readability over clever code.
- Keep the project modular and maintainable.
- Follow modern Next.js App Router conventions.
- Use TypeScript everywhere.
- Avoid unnecessary abstractions.

---

## Code Style

- Use `const` by default.
- Use `let` only when reassignment is required.
- Never use `var`.
- Prefer arrow functions for callbacks.
- Use async/await instead of `.then()`.

Example:

```ts
const getUser = async () => {
  const user = await db.user.findUnique(...);
  return user;
};
```

---

## Naming Conventions

### Variables

camelCase

```ts
userName
isVerified
currentUser
```

### Functions

Use verbs.

```ts
createUser()
sendVerificationEmail()
verifyCode()
```

### Components

PascalCase.

```tsx
SignUpForm.tsx
Navbar.tsx
MessageCard.tsx
```

### Files

- Components → PascalCase
- Utilities → camelCase
- Routes → lowercase

---

## Folder Structure

``` txt
  src/
  │
  ├── app/
  ├── components/
  ├── lib/
  ├── model/
  ├── schemas/
  ├── types/
  ├── helpers/
  ├── hooks/
  ├── services/
  └── utils/
```

---

## React

- Prefer Server Components.
- Use Client Components only when necessary.
- Keep components under 200 lines.
- Split reusable UI into components.

---

## Next.js

- Use the App Router.
- Keep Route Handlers inside `app/api`.
- Store reusable server logic in `lib/`.
- Do not duplicate business logic.

---

## TypeScript

Avoid `any`.

Prefer:

```ts
unknown
```

or proper interfaces.

Always type function parameters and return values.

---

## Validation

Use Zod.

Keep validation schemas inside:

``` txt
  src/schemas
```

Reuse schemas whenever possible.

---

## Database

- One model per file.
- Keep model names singular.

Example:

``` txt
  User.ts
  Message.ts
```

---

## Error Handling

Never swallow errors.

Use

```ts
try {
} catch (error) {
}
```

Return meaningful error messages.

---

## Imports

Prefer absolute imports.

Example:

```ts
import User from "@/model/User";
```

instead of

```ts
../../../model/User
```

---

## Comments

Comment **why**, not **what**.

Avoid obvious comments.

Good:

```ts
// Prevent duplicate usernames.
```

Bad:

```ts
// Increment i.
i++;
```

---

## Performance

- Avoid unnecessary re-renders.
- Memoize expensive calculations when needed.
- Don't optimize prematurely.

---

## Formatting

- Keep functions small.
- Prefer early returns.
- One responsibility per function.

---

## Security

- Never expose secrets.
- Validate every API input.
- Never trust client-side data.
- Store secrets in `.env`.

---

## Git

Write meaningful commit messages.

Good:

``` txt
  feat(auth): add email verification
```

Bad:

``` txt
  update
```

---

## Goal

Code should be easy to read six months later.
