# Applied Archive Atelier

A Vite + React + TypeScript single-page app (converted from Next.js).

- **Build tool:** Vite (`npm run dev`, `npm run build`, `npm run preview`)
- **Routing:** `react-router-dom` (routes declared in `src/App.tsx`)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` (`src/index.css`)
- **Structure:** pages in `src/pages`, shared UI in `src/components`, data in
  `src/lib`, imported images in `src/assets`, static files in `public`.

The `@` alias maps to `src/`. Images are imported as URL strings (Vite asset
handling), not Next `StaticImageData`.
