# Understanding Node.js Runtime vs Edge Runtime

## 📺 Resources

- **Detailed:** https://youtu.be/DhHE7NcZChQ
- **Short:** https://youtu.be/ORqN_j8iqqw?t=120

---

## My Understanding

When a request reaches a Next.js application, the framework decides **where the server-side code should execute**.

- In **Node.js Runtime**, the code runs in a full Node.js environment.
- In **Edge Runtime**, the code runs in a lightweight edge environment closer to the user.

The runtime is responsible for executing server-side logic and generating the response.

---

## Request Flow

```text
Client
   │
   ▼
Next.js
   │
   ├── Node Runtime
   │      └── Full backend capabilities
   │
   └── Edge Runtime
          └── Lightweight execution near the user
```

---

## Key Points

- Node Runtime supports Node.js APIs.
- Edge Runtime has faster startup times.
- Choose the runtime based on your application's requirements.
