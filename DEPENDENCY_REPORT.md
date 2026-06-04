# Dependency Audit Report

This report analyzes the package dependencies and devDependencies used in the **Centre for Peace Praxis** application.

---

## 1. Used Dependencies

The application maintains a highly lightweight dependency graph. All declared dependencies are active and necessary:

| Package | Version | Usage Status | Purpose in Application |
| --- | --- | --- | --- |
| **next** | `16.2.7` | **Active** | Core React application framework (using App Router features). |
| **react** | `19.2.4` | **Active** | Core UI rendering library. |
| **react-dom** | `19.2.4` | **Active** | Virtual DOM rendering for browser. |
| **lucide-react** | `^1.17.0` | **Active** | Renders vector icons in navbars, stats panels, card layouts, and lists. |

---

## 2. DevDependencies

| Package | Version | Usage Status | Purpose in Application |
| --- | --- | --- | --- |
| **tailwindcss** | `^4.0.0` | **Active** | Utility styling framework used for modern responsive SaaS grids. |
| **@tailwindcss/postcss** | `^4.0.0` | **Active** | Direct compilation engine mapping Tailwind directives to vanilla CSS. |
| **typescript** | `^5.0.0` | **Active** | Compiler providing compile-time type-safety checks. |
| **eslint** | `^9.0.0` | **Active** | Static analysis linter confirming syntax conventions. |
| **eslint-config-next** | `16.2.7` | **Active** | Lints specific to Next.js practices. |
| **@types/node** | `^20.0.0` | **Active** | Ambient typings for Node environments. |
| **@types/react** | `^19.0.0` | **Active** | TypeScript definitions for React elements. |

---

## 3. Recommended Packages & Replacements

### A. Core Additions for Premium UX
- **framer-motion**: Recommended to add smooth page transitions, entrance animations, and rich interactive micro-animations (e.g., stats cards floating in when scrolled into view).
- **clsx** & **tailwind-merge**: Simplifies writing conditional styling tags cleanly without string concatenation issues.
  ```typescript
  import { twMerge } from "tailwind-merge";
  import { clsx, ClassValue } from "clsx";

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```

### B. Database Migration Additions
- **prisma**: Client generator mapping schemas directly to type-safe queries.
- **@prisma/client**: Runtime engine translating database changes to standard objects.
