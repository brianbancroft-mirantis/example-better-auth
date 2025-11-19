# Turborepo Auth Setup

This is a simple setup for a Turborepo with a PostgreSQL database and a Next.js API.

## Quick Start

1. `pnpm install`
1. `cp sample.env .env`
1. Get a postgres DB running
   1. `docker pull postgres`
   1. `docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres`
   1. Update .env `DATABASE_URL=postgresql://postgres:mysecretpassword@<ip-or-db-url>:5432/auth_db?sslmode=disable`
1. Run `pnpm run db:init`
1. Run `pnpm dev`
