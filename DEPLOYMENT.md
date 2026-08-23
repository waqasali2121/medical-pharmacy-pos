# GitHub + Vercel Deployment Checklist

## 1. Local
- Install Node.js 20.19+
- Install PostgreSQL or create a hosted PostgreSQL database
- Copy `.env.example` to `.env`
- Set DATABASE_URL
- Run `npm install`
- Run `npm run db:migrate`
- Run `npm run db:seed`
- Run `npm run dev`

## 2. GitHub
- Create a new empty GitHub repository
- Push this project
- Never commit `.env`

## 3. Vercel
- Import the GitHub repository
- Add `DATABASE_URL` under Environment Variables
- Deploy

The build command is already configured in package.json:
`prisma generate && prisma migrate deploy && next build`

## 4. Production database
Use a managed PostgreSQL provider. Prisma Postgres and Neon both integrate with Vercel.

## 5. First production login
admin / Admin@123

Immediately change/remove demo credentials before real use.
