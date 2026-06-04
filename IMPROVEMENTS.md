# Recommended Codebase Improvements

This document lists prioritized technical recommendations to improve the security, performance, structure, and scalability of the **Centre for Peace Praxis** application.

---

## 1. Critical Fixes & Security Improvements

### A. Eliminate Hardcoded Credentials
- **Problem**: Admin credentials (`admin/admin`) are hardcoded in the client-side login component.
- **Solution**: Move credential checks to a secure Next.js API route or Server Action. Use `process.env.ADMIN_USERNAME` and `process.env.ADMIN_PASSWORD` stored securely in a `.env.local` file.

### B. Implement Secure Middleware Route Guards
- **Problem**: Dashboard routes are protected by checking a client-side localStorage flag, which can be easily spoofed.
- **Solution**: Set an HTTP-only secure cookie upon successful login, and protect access to `/dashboard` using a Next.js `middleware.ts` route guard running on the edge server.

---

## 2. Performance Improvements

### A. Resolve Image Loader Lints
- **Problem**: The project compiles with 25 warnings regarding the use of native HTML `<img>` tags.
- **Solution**: Replace `<img>` elements with Next.js native `<Image />` components from `next/image` to automatically scale, compress, and lazy-load assets.
- **Example Implementation**:
  ```tsx
  import Image from "next/image";

  <Image
    src={imgSrc}
    alt="Gallery Item"
    width={400}
    height={300}
    className="object-cover"
    placeholder="blur"
    blurDataURL="..."
  />
  ```

---

## 3. Refactoring Opportunities

### A. De-duplicate Live Preview Code (DRY)
- **Problem**: The preview panel inside `src/app/dashboard/page.tsx` recreates large portions of `src/app/page.tsx`.
- **Solution**: Extract page segments into modular, stateless sub-components inside `src/components/` (e.g., `HeroSection.tsx`, `StatsGrid.tsx`, `PillarsList.tsx`). Pass the dynamic `content` state as a prop so both pages render the exact same component logic.

---

## 4. Database Optimizations & Storage Migration

### A. Migrate from LocalStorage to a Relational Database
- **Problem**: Admin configurations and list additions are lost if cached browser data is deleted or if another user views the application.
- **Solution**: Connect a database client. Install **Prisma ORM** and run migrations to a database (e.g. PostgreSQL or SQLite).
- **Proposed Schema**:
  ```prisma
  model Workshop {
    id           String   @id @default(uuid())
    slug         String   @unique
    title        String
    subtitle     String?
    tag          String
    date         String
    time         String
    location     String
    summary      String   @db.Text
    highlights   String   @db.Text
    participants String
    takeaways    String[]
    speakers     Speaker[]
    gallery      String[]
    sdgNumbers   Int[]
  }
  ```

---

## 5. UI/UX Enhancements

- **Volunteering Application Forms**: Replace static email anchors with interactive, multi-step application forms that capture student details directly.
- **Dynamic Content Search**: Add a client-side fuzzy-search input in the Activities section so users can instantly filter by tag, SDG index, or date range.
