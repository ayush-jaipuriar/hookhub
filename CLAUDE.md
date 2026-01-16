# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HookHub is a Next.js 16 application using the App Router architecture, built with TypeScript, React 19, and Tailwind CSS v4.

## Commands

### Development
```bash
cd hookhub
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Create production build
npm start          # Start production server
npm run lint       # Run ESLint
```

## Architecture

### Framework & Routing
- **Next.js 16** with App Router (`/app` directory)
- Server Components by default
- File-based routing: pages defined in `app/` directory

### Styling
- **Tailwind CSS v4** with PostCSS plugin (`@tailwindcss/postcss`)
- Global styles in `app/globals.css`
- Dark mode support via CSS classes

### TypeScript Configuration
- Path alias: `@/*` maps to root directory (`./`)
- Strict mode enabled
- JSX pragma: `react-jsx` (no React import needed in components)

### Key Files
- `app/layout.tsx` - Root layout with Geist font configuration
- `app/page.tsx` - Homepage component
- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint configuration using flat config
- `tsconfig.json` - TypeScript configuration

## Project Structure

```
hookhub/
├── app/              # Next.js App Router pages and layouts
│   ├── layout.tsx    # Root layout (HTML shell, fonts, metadata)
│   ├── page.tsx      # Homepage
│   └── globals.css   # Global styles and Tailwind directives
├── public/           # Static assets (SVG icons)
├── next.config.ts    # Next.js configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Dependencies and scripts
```

## Notes

- This is a fresh create-next-app project - minimal configuration has been added
- The app uses React 19 and Next.js 16, which may have different APIs than older versions
- ESLint uses the new flat config format (`eslint.config.mjs`)
- All work should be done in the `hookhub/` directory
