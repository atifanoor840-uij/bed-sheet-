# Neend — bedding store + admin

Next.js storefront with a built-in admin panel. Data is kept in a JSON file (`data/db.json`), created on first run.

## Run

```bash
npm install
npm run build
npm run start      # http://localhost:3000
```

`npm run dev` works too, but is much slower because pages compile on first visit.

## Admin

- Open `/admin` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env.local` (see `.env.example`).
  The admin account is created the first time the database is set up — change the password in `.env.local` **before** first run.
- **Products** — add, edit, hide/show, delete, set stock, upload photos (JPG/PNG/WebP/AVIF, up to 8 MB) or paste Unsplash links,
  and link pillow covers to the set they match.
- **Orders** — filter by status, search, change status (cancelling returns stock), add internal notes.
- **Customers** — registered customers with order count and total spent; give or remove admin access.

## Data

| Path | What |
| --- | --- |
| `data/db.json` | products, customers (passwords hashed with scrypt), orders, sessions |
| `data/uploads/` | photos uploaded from the admin |

Delete the `data/` folder to start again from the original catalogue.

This file database suits a single server. For hosting on serverless platforms (e.g. Vercel) or several servers,
move `lib/db.ts` to a real database (Postgres, MySQL) and uploads to object storage (S3, Cloudinary).
