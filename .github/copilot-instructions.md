# AI Coding Agent Guidelines for This Project

## Project Overview
This project appears to be a web-based application with the following structure:
- **Frontend**: Built using TypeScript and React, with Tailwind CSS for styling. Key files include:
  - `src/app/layout.tsx` and `src/app/page.tsx`: Define the main layout and page structure.
  - `src/components/`: Contains reusable UI components like `Header.tsx` and `Hero.tsx`.
- **Configuration**: Tailwind CSS is configured in `tailwind.config.ts`, and TypeScript settings are in `tsconfig.json`.
- **Static Assets**: Includes HTML files (e.g., `activity-report.html`) and a CSV file (`surya_hero_schedule.csv`).

## Key Developer Workflows
### Building the Project
- Ensure all dependencies are installed by running:
  ```bash
  npm install
  ```
- To build the project, use:
  ```bash
  npm run build
  ```

### Running the Development Server
- Start the development server with:
  ```bash
  npm run dev
  ```
- The server typically runs on `http://localhost:3000`.

### Testing
- Currently, there is no explicit testing setup in the project. If tests are added, document the commands here.

## Project-Specific Conventions
- **Component Structure**: Components are stored in `src/components/` and follow a modular design. Each component should be self-contained with its logic and styles.
- **Styling**: Tailwind CSS is used for styling. Avoid inline styles; use utility classes defined in `tailwind.config.ts`.
- **TypeScript**: Ensure all new code is strongly typed. Update `tsconfig.json` if additional configurations are needed.

## Integration Points
- **External Libraries**: Tailwind CSS and React are the primary dependencies. Check `package.json` for the full list.
- **Data Handling**: Static data like `surya_hero_schedule.csv` may be used for populating components or pages. Ensure proper parsing and validation.

## Examples
### Adding a New Component
1. Create a new file in `src/components/`, e.g., `MyComponent.tsx`.
2. Use the following template:
   ```tsx
   import React from 'react';

   const MyComponent: React.FC = () => {
       return (
           <div className="p-4 bg-gray-100">
               {/* Component content */}
           </div>
       );
   };

   export default MyComponent;
   ```
3. Import and use the component in `src/app/page.tsx` or another relevant file.

### Updating Tailwind Configuration
- Modify `tailwind.config.ts` to add custom utility classes or extend the theme. For example:
  ```ts
  module.exports = {
      theme: {
          extend: {
              colors: {
                  customBlue: '#1E40AF',
              },
          },
      },
  };
  ```

## Notes
- Regularly review and update this file as the project evolves.
- If you encounter repetitive patterns or workflows, document them here to assist future contributors.