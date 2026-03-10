# Intentionally Vulnerable SaaS CRM

This repository contains an intentionally vulnerable TypeScript/Express CRM application for security testing in isolated lab environments.

## Stack

- Node.js + Express + TypeScript
- EJS server-rendered admin/UI pages
- PostgreSQL + Redis
- Docker Compose runtime

## Quick Start

1. Copy environment: `cp .env.example .env`
2. Start infrastructure and app: `docker compose up --build`
3. Local app URL: `http://localhost:4000`
4. Health check: `GET /health`

## Seed Accounts

- `viewer1` / `Password123!`
- `agent1` / `Password123!`
- `manager1` / `Password123!`
- `admin1` / `Password123!`
- cross-tenant admin: `admin2` / `Password123!`

## API Families

- Core CRM: tenants, users, contacts, accounts, deals, notes, files, api keys, audits, admin
- Additional operations: tasks, tickets, campaigns, invoices, activities, webhooks, workflows, reports
- Expansion suite: products, subscriptions, contracts, quotes, forecasts, segments, playbooks, escalations, onboardings, integrations, notifications, announcements

## Vulnerability Notes

- Single inventory file: `docs/VULNERABILITIES.md`

## Commands

- `npm run dev` - start app in watch mode
- `npm run build` - compile TypeScript
- `npm run seed` - initialize schema + load fixtures
- `npm test` - execute tests
- `npm run fixtures:check` - print fixture counts

## Important

This project is intentionally insecure and intended only for isolated security testing in disposable environments.
