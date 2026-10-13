# Next.js Auth

A small Next.js app with email and password authentication. Users can sign up, log in and log out, and only authenticated users can see the protected training page.

## Features

- Sign up and login with server-side validation
- Password hashing with `scrypt` and a random salt
- Session-based auth with Lucia, stored in SQLite
- Protected `/training` route that redirects unauthenticated users to `/`
- Server Actions with `useFormState` for form handling
- Fully typed with TypeScript

## Tech Stack

- Next.js 14 (App Router, Server Actions)
- React 18
- TypeScript
- Lucia v3
- better-sqlite3

## Getting Started

Requirements: Node.js 20 or 22.

```bash
git clone https://github.com/dianakovtoniuk/react_next_auth.git
cd react_next_auth
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The SQLite database (`training.db`) is created automatically on first run and seeded with sample training sessions.

## Project Structure

```
actions/
  auth-actions.ts     # signup, login, logout server actions
app/
  (auth)/
    layout.tsx        # header with logout button
    training/page.tsx # protected page
  page.tsx            # login / signup form
  layout.tsx          # root layout
components/
  auth-form.tsx       # shared login / signup form
lib/
  auth.ts             # Lucia setup and session helpers
  db.ts               # SQLite setup and seed data
  hash.ts             # password hashing and verification
  training.ts         # training queries
  user.ts             # user queries
```

## How It Works

1. The form on `/` switches between login and signup through the `mode` query param.
2. On submit, a server action validates the input, hashes the password and creates the user.
3. Lucia creates a session and stores its ID in a cookie.
4. The training page checks the session on every request and redirects if it is missing or expired.
5. Logout invalidates the session and clears the cookie.

## Deployment Note

The app uses a local SQLite file, so it will not work on serverless platforms such as Vercel, where the file system is read-only. Use a hosted database there, or deploy somewhere with persistent storage.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Create a production build |
| `npm start`     | Run the production build |
| `npm run lint`  | Run ESLint               |
