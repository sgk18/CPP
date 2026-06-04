# Codebase Analysis & Audit Report

This report presents a thorough technical review of the **Centre for Peace Praxis** (CPP) codebase.

---

## 1. Architectural Review

The application is built using **Next.js (App Router)**, structuring routes into discrete folder segments inside `src/app/`.

### Core Flow & Data Hydration
The system relies on client-side state management that blends static constants with browser-level persistent data:

```text
               ┌────────────────────────┐
               │  src/constants/*.ts    │
               └───────────┬────────────┘
                           │ Fallback Data
                           ▼
 ┌──────────┐    ┌──────────────────┐    ┌─────────────┐
 │ Browser  │───►│ Client Component │───►│ Rendered UI │
 │  Cache   │    │  (hydration)     │    │   Elements  │
 └──────────┘    └──────────────────┘    └─────────────┘
```

1. **Static Data Constants**: Located under `src/constants/`, providing seed databases for workshops/activities, gallery paths, and community members.
2. **Local Storage CMS**: The homepage loads dynamic text configurations. Upon mounting, the page reads from local storage keys. If no keys are cached, it falls back to the hardcoded default object.
3. **Admin Dashboard State**: Admin inputs write directly to local storage keys, triggering local layout changes in the synchronized preview frame.

---

## 2. Strengths

- **Design System Consistency**: Styled using Tailwind CSS v4 variables defined in a single source of truth (`src/app/globals.css`). The Ocean Blue, Calm Emerald, and Warm Coral color scheme is enforced cleanly across pages.
- **Type Safety**: Core data entities (Speaker, SDG, Workshop, Faculty, Student, GalleryItem) are governed by TypeScript interfaces in `src/types/index.ts`, preventing run-time errors due to missing fields.
- **Modularity**: Separation of layout wrappers (`Header`, `Footer`) and base components (`Button`, `Card`, `Modal`, `Toast`) ensures easy styling updates without touching business logic.
- **Zero-Dependency Lightbox**: Custom image modals built with native React state management keep bundle sizes low.
- **Clean Linter profile**: Compiles with 0 linter errors and runs builds in under 3 seconds.

---

## 3. Weaknesses

- **Ephemeral CMS State**: The site builder persists data only in the local browser's `localStorage`. Content changes are lost if the user switches browsers, clears history, or visits from another machine.
- **Lack of Media Upload Backend**: The site builder references files by their public string paths (e.g. `/assets/speaker_image.jpg`). There is no file upload handler to dynamically receive and serve user images.
- **Preview Redundancy**: The dashboard's mock-desktop and mock-mobile preview panel contains duplicate layouts and styling copied directly from the homepage, leading to dry/reusability violations (DRY).

---

## 4. Security Findings

> [!WARNING]
> ### Critical Hardcoded Credentials
> - **Location**: `src/app/login/page.tsx#L30`
> - **Issue**: Username and password are hardcoded plain-text comparisons in the client component:
>   ```typescript
>   if (username.trim() === "admin" && password.trim() === "admin") { ... }
>   ```
> - **Risk**: Anyone inspecting the client bundle can discover these credentials.

> [!CAUTION]
> ### Insecure Route Guard Protection
> - **Location**: `src/app/dashboard/page.tsx`
> - **Issue**: Authorization checks are performed solely via client-side local storage flag queries:
>   ```typescript
>   const auth = localStorage.getItem("cpp_is_authenticated");
>   ```
> - **Risk**: A user can bypass the login screen completely by opening the browser console and typing `localStorage.setItem('cpp_is_authenticated', 'true')`.

---

## 5. Scalability Assessment

- **File/Route Scalability**: High. Next.js App Router folder structure allows developers to add new features (`src/app/new-feature/page.tsx`) without risking conflict with existing endpoints.
- **Content Scalability**: Low. To add a new event or member, a developer must manually edit the array constants in `src/constants/workshops.ts` or `src/constants/community.ts` and trigger a re-build/re-deployment of the project.

---

## 6. Technical Debt Analysis

1. **Local Storage CMS**: The mock CMS state represents the largest structural technical debt in the application. To move this project into standard production, a database engine (like Prisma ORM + PostgreSQL) and Server Actions/APIs must replace the `localStorage` logic.
2. **Duplicate Preview Markup**: The live preview panel in `src/app/dashboard/page.tsx` repeats substantial sections of JSX from the main `src/app/page.tsx` file. Modifying home page elements requires parallel updates to the dashboard code to keep the preview accurate.
