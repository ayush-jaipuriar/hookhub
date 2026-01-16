# HookHub MVP - Product Specification

## Overview

**HookHub** is a web application that displays and helps users discover open-source Claude Code hooks from GitHub repositories. Claude hooks are scripts (Python/TypeScript) that extend Claude Code functionality, providing automation, validation, monitoring, and workflow control capabilities.

### Vision

Create a centralized hub where developers can browse, search, and discover high-quality Claude Code hooks to enhance their development workflow.

---

## MVP Scope

### In Scope for MVP

- ✅ Display hooks in a responsive grid layout
- ✅ Search hooks by name and description
- ✅ Filter hooks by category
- ✅ Click hook card to view detailed information in modal
- ✅ Fetch live data from GitHub API
- ✅ Show hook metadata (stars, last updated, language, owner)
- ✅ Dark mode support (already configured in Tailwind)

### Out of Scope for MVP

- ❌ User authentication
- ❌ Saving/favoriting hooks
- ❌ User-submitted hooks
- ❌ Comments or ratings
- ❌ Hook installation automation
- ❌ Analytics and tracking

---

## User Stories

### Primary User Flow

1. User visits HookHub homepage
2. User sees a grid of hook cards with basic information
3. User can search for specific hooks using search bar
4. User can filter hooks by category using category tabs/dropdown
5. User clicks on a hook card to see detailed information in a modal
6. User clicks "View on GitHub" to visit the repository

### Search & Filter Flow

- User types in search bar → Results filter in real-time (debounced)
- User selects category → Only hooks in that category are shown
- User can combine search + category filter
- If no results found, show "No hooks found" empty state

---

## Features & Requirements

### 1. Hook Display (Grid View)

**Layout:**

- Responsive grid: 1 column (mobile) → 2 columns (tablet) → 3-4 columns (desktop)
- Each card shows:
  - Hook name
  - Short description (truncated to 2-3 lines)
  - Category badge (color-coded)
  - GitHub stars count
  - Last updated (relative time: "2 days ago")
  - Primary language badge/icon
  - Owner avatar

**Interactions:**

- Hover effect on cards
- Click card → Opens modal with details

### 2. Search Functionality

**Requirements:**

- Search input at top of page
- Debounced input (300ms delay)
- Searches both name and description
- Case-insensitive matching
- Shows result count
- Clear search button (X icon)

### 3. Category Filter

**Categories (6 core categories):**

1. **Monitoring & Observability** - Real-time tracking, logging, debugging
2. **Validation & Quality** - Code quality checks, linting, testing
3. **Automation & Workflow** - Task automation, CI/CD integration
4. **Development Tools** - Utilities, helpers, code generation
5. **AI Enhancement** - Prompt engineering, context management
6. **Security & Compliance** - Security scanning, secret detection

**UI Options:**

- Category tabs (horizontal scrollable on mobile)
- OR Category dropdown/select
- Show "All" option to clear filter
- Show count per category

### 4. Hook Detail Modal

**Content:**

- All information from card view
- Full description
- README excerpt or link
- List of hook scripts with links to files
- Installation instructions (if available)
- License information
- "View on GitHub" button (primary CTA)
- Close button (X icon and ESC key)

**Behavior:**

- Opens on card click
- Closes on: X button, ESC key, click outside (backdrop)
- Accessible (keyboard navigation, focus trap)
- Scrollable content if too long

### 5. GitHub Data Integration

**Data Source:**

- GitHub Search API with `topic:claude-hooks`
- Supplement with curated list of known repositories
- Fetch repository metadata, stars, topics, languages

**Data Refresh:**

- Server-side caching (1 hour revalidation)
- User can see when data was last fetched
- Graceful handling of rate limits

**Rate Limiting:**

- Use GitHub Personal Access Token for 5,000 requests/hour
- Cache responses to minimize API calls
- Show cached data if rate limit exceeded

---

## Technical Architecture

### Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Data Fetching:** GitHub REST API
- **Deployment:** Vercel (recommended)

### File Structure

```
hookhub/
├── app/
│   ├── layout.tsx                    # Root layout (existing)
│   ├── page.tsx                      # Homepage (main hub view)
│   ├── globals.css                   # Global styles (existing)
│   ├── api/
│   │   └── hooks/
│   │       └── route.ts              # GitHub API proxy endpoint
│   └── components/
│       ├── HookGrid.tsx              # Grid container
│       ├── HookCard.tsx              # Hook card component
│       ├── HookModal.tsx             # Detail modal
│       ├── SearchBar.tsx             # Search input
│       ├── CategoryFilter.tsx        # Category filter
│       └── LoadingState.tsx          # Loading skeleton
├── lib/
│   ├── github.ts                     # GitHub API client
│   ├── types.ts                      # TypeScript interfaces
│   ├── categories.ts                 # Category definitions
│   └── utils.ts                      # Utility functions
└── .env.local                        # Environment variables
```

### Data Model

```typescript
interface Hook {
  id: string;                    // Unique identifier
  name: string;                  // Repository name
  fullName: string;              // owner/repo
  description: string;           // Repo description
  category: HookCategory;        // Assigned category
  repoUrl: string;              // GitHub URL
  stars: number;                 // Star count
  lastUpdated: string;           // ISO date
  owner: {
    login: string;
    avatarUrl: string;
  };
  language: string | null;       // Python, TypeScript, etc.
  topics: string[];              // GitHub topics
  license: string | null;        // License type
}

type HookCategory =
  | 'monitoring'
  | 'validation'
  | 'automation'
  | 'tools'
  | 'ai-enhancement'
  | 'security'
  | 'uncategorized';
```

### API Routes

**GET /api/hooks**

- Fetches hooks from GitHub API
- Returns: `{ hooks: Hook[], totalCount: number, fetchedAt: string }`
- Caching: 1 hour revalidation
- Error handling: Rate limits, network errors

### Component Architecture

```
page.tsx (Server Component)
└── HookBrowser (Client Component wrapper)
    ├── SearchBar (Client)
    ├── CategoryFilter (Client)
    ├── HookGrid (Client)
    │   └── HookCard[] (Client)
    │       └── Opens HookModal on click
    └── HookModal (Client)
```

**Server Components:**

- `page.tsx` - Fetches initial data

**Client Components (interactive):**

- All other components need `'use client'` directive

### State Management

- React `useState` for search query, selected category, modal state
- No external state library needed for MVP

---

## Implementation Plan

### Phase 1: Foundation

1. Create TypeScript interfaces in `lib/types.ts`
2. Build GitHub API client in `lib/github.ts`
3. Create category definitions in `lib/categories.ts`
4. Set up API route at `/app/api/hooks/route.ts`
5. Add `GITHUB_TOKEN` to `.env.local`

### Phase 2: Core UI Components

6. Create `LoadingState.tsx` - Loading skeleton
7. Build `HookCard.tsx` - Individual hook card
8. Build `HookGrid.tsx` - Grid container
9. Create `SearchBar.tsx` - Search input
10. Create `CategoryFilter.tsx` - Category tabs/dropdown
11. Build `HookModal.tsx` - Detail modal

### Phase 3: Integration

12. Update `app/page.tsx` - Integrate all components
13. Implement search functionality
14. Implement category filtering
15. Wire up modal interactions

### Phase 4: Polish

16. Responsive design (mobile, tablet, desktop)
17. Dark mode styling
18. Loading states and animations
19. Error handling and empty states
20. SEO meta tags

---

## Critical Files to Create/Modify

1. **`lib/types.ts`** - TypeScript interfaces for Hook, Category, etc.
2. **`lib/github.ts`** - GitHub API client with search and fetch functions
3. **`app/api/hooks/route.ts`** - Server-side API route with caching
4. **`app/page.tsx`** - Main homepage (complete rewrite)
5. **`app/components/HookCard.tsx`** - Core UI component

---

## GitHub API Strategy

### Search Query

```
GET https://api.github.com/search/repositories
?q=topic:claude-hooks+stars:>0+archived:false
&sort=stars
&order=desc
```

### Authentication

- Use GitHub Personal Access Token
- Store in `GITHUB_TOKEN` environment variable
- Include in Authorization header: `Bearer ${token}`

### Rate Limits

- Authenticated: 5,000 requests/hour
- Implement 1-hour cache using Next.js `revalidate`
- Show cached timestamp to users

### Curated Repositories (Manual Seed Data)

Start with these known repositories:

- `disler/claude-code-hooks-mastery`
- `johnlindquist/claude-hooks`
- `ChrisWiles/claude-code-showcase`
- `disler/claude-code-hooks-multi-agent-observability`
- `carlrannaberg/claudekit`
- `decider/claude-hooks`

---

## Design Guidelines

### Visual Design

- **Style:** Modern, clean, minimal
- **Colors:** Use Tailwind's default palette
- **Typography:** Geist Sans (already configured)
- **Spacing:** Generous whitespace between cards
- **Shadows:** Subtle shadows on cards, stronger on hover

### Category Colors (Suggested)

- Monitoring → Blue (`bg-blue-500`)
- Validation → Green (`bg-green-500`)
- Automation → Purple (`bg-purple-500`)
- Tools → Orange (`bg-orange-500`)
- AI Enhancement → Pink (`bg-pink-500`)
- Security → Red (`bg-red-500`)

### Responsive Breakpoints (Tailwind defaults)

- Mobile: `< 640px` (1 column)
- Tablet: `640px - 1024px` (2 columns)
- Desktop: `> 1024px` (3-4 columns)

---

## Error Handling & Edge Cases

### Scenarios to Handle

1. **No hooks found** - Show empty state with message
2. **Rate limit exceeded** - Show cached data + warning message
3. **Network error** - Show error message with retry button
4. **No search results** - "No hooks match your search"
5. **Loading state** - Show skeleton cards while fetching

### Error Messages

- User-friendly language
- Actionable suggestions
- Retry mechanisms where appropriate

---

## Environment Setup

### Required Environment Variables

```bash
# .env.local (DO NOT COMMIT)
GITHUB_TOKEN=ghp_your_github_personal_access_token_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting GitHub Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scopes: `public_repo` (read access)
4. Copy token to `.env.local`

---

## Verification & Testing

### Manual Testing Checklist

- [ ] Homepage loads and displays hooks in grid
- [ ] Search filters hooks correctly
- [ ] Category filter works (shows only selected category)
- [ ] Combining search + filter works
- [ ] Clicking hook card opens modal
- [ ] Modal displays all information correctly
- [ ] "View on GitHub" link opens correct repository
- [ ] Modal closes on X button, ESC key, backdrop click
- [ ] Responsive layout works on mobile, tablet, desktop
- [ ] Dark mode styling looks correct
- [ ] Loading states display during data fetch
- [ ] Error states display when API fails
- [ ] Empty state shows when no results found

### Browser Testing

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Android)

---

## Future Enhancements (Post-MVP)

### Phase 2 Features

- Advanced filtering (language, star count range, last updated)
- Sorting options (by stars, date, name)
- Pagination or infinite scroll
- Hook installation helper (copy commands)
- Share hook (copy link)

### Phase 3 Features

- User authentication
- Favorite/bookmark hooks
- User-submitted hooks (with moderation)
- Hook ratings and reviews
- Analytics (view counts, popular hooks)

### Phase 4 Features

- Hook collections/playlists
- Related hooks recommendations
- Hook compatibility checker
- Embed widgets for other sites

---

## Success Metrics

### MVP Goals

- Display at least 20-30 hooks
- Sub-2s page load time
- 100% responsive on all devices
- Zero critical bugs
- Clean, intuitive UI

### Post-Launch Tracking (Future)

- Page views
- Search usage rate
- Most popular categories
- Click-through rate to GitHub
- Mobile vs desktop usage

---

## Resources & References

### GitHub API Documentation

- [REST API - Search Repositories](https://docs.github.com/en/rest/search#search-repositories)
- [Rate Limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)

### Example Repositories

- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- [claude-hooks topic](https://github.com/topics/claude-hooks)

### Design Inspiration

- GitHub's repository search interface
- npm package explorer
- VS Code extension marketplace

---

## Notes

- This spec focuses on MVP functionality - keep it simple
- Prioritize working software over perfect software
- Can always iterate and add features post-launch
- Ensure good foundation (types, API client, components) for future growth
