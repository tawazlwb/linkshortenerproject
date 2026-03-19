# Agent Instructions — Link Shortener Project

This file is the authoritative entry point for LLM agents working on this codebase. All coding standards, conventions, and architectural decisions are documented in the `/docs` directory. **ALWAYS Refer to the relevant docs file BEFORE generating or making any changes to the corresponding area of the codebase.**

## Project Overview

A full-stack link shortener built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Drizzle ORM on Neon PostgreSQL, and Clerk for authentication. UI components are provided by shadcn/ui (radix-nova style).

## Docs Index

| File | What it covers |
|------|----------------|
| [docs/auth.md](docs/auth.md) | Clerk authentication, route protection, redirects, modal sign-in/sign-up |
| [docs/ui.md](docs/ui.md) | shadcn/ui components, adding new components, icons, styling conventions |


## Non-Negotiable Rules

1. **TypeScript strict mode is enabled.** Every file must be fully typed — no `any`, no `@ts-ignore`.
2. **All database access goes through Drizzle ORM.** Raw SQL strings are forbidden.
3. **Authentication state is managed exclusively by Clerk.** Do not implement custom auth logic.
4. **UI components must come from `@/components/ui` (shadcn) before creating custom ones.** Always prefer composition over duplication.
5. **Server Components are the default.** Only add `"use client"` when interaction or browser APIs are strictly required.
6. **Environment variables are never hard-coded.** All secrets live in `.env.local` and are accessed via `process.env`.
7. **Never commit `.env.local` or any file containing secrets.**
