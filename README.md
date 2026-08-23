# Medical Pharmacy POS

A deployable Next.js + PostgreSQL + Prisma pharmacy POS starter based on the requested medical-shop POS specification.

## Included in this build

- Login and role foundation: Admin / Manager / Cashier
- Dashboard
- Medicine catalog
- Batch-level inventory
- Expiry tracking
- FEFO-ready POS batch selection
- Barcode/search field
- Sales and inventory transaction records
- Sales history
- Customers and suppliers views
- Purchases view
- Basic reports
- Audit logging
- PostgreSQL + Prisma schema
- Seed/demo data
- Vercel-oriented build command

## Demo accounts

- admin / Admin@123
- manager / Manager@123
- cashier / Cashier@123

Change these passwords before production use.

## Local setup

Requirements: Node.js 20.19+, PostgreSQL.

1. Copy `.env.example` to `.env`.
2. Put your PostgreSQL connection string in `DATABASE_URL`.
3. Install packages:

```bash
npm install
```

4. Generate Prisma:

```bash
npm run db:generate
```

5. Create/apply migrations locally:

```bash
npm run db:migrate
```

6. Seed demo data:

```bash
npm run db:seed
```

7. Start:

```bash
npm run dev
```

Open http://localhost:3000.

## GitHub

Create a repository and push this folder:

```bash
git init
git add .
git commit -m "Initial medical pharmacy POS"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/medical-pharmacy-pos.git
git push -u origin main
```

## Vercel + PostgreSQL

Recommended production setup is Vercel + a managed PostgreSQL database such as Prisma Postgres or Neon.

1. Import the GitHub repository into Vercel.
2. Add `DATABASE_URL` to Vercel Environment Variables.
3. Deploy.

The production build runs:

```bash
prisma generate && prisma migrate deploy && next build
```

For the first production deployment, create and commit a migration locally before deploying:

```bash
npm run db:migrate
git add prisma/migrations
git commit -m "Add initial database migration"
git push
```

Do not put database credentials in GitHub.

## Important production notes

This is a strong MVP foundation, not a finished regulated-pharmacy compliance package. Before using it in a real pharmacy, add and validate local legal/regulatory requirements, prescription controls, medicine licensing rules, tax requirements, backup strategy, and printer/device testing.

Also replace the demo authentication/session implementation with a hardened authentication system before production.

## Roadmap

Recommended next modules:

1. Full purchase-entry UI and purchase API
2. Sales returns and purchase returns
3. Customer credit ledger
4. Supplier payable ledger
5. Expenses and cash register
6. A4/58mm/80mm invoice printing
7. Barcode label generation
8. CSV/Excel/PDF reporting
9. Prescription attachment/validation
10. Automated cloud backups
11. Full permission matrix
12. Multi-branch support
