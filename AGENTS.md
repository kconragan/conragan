# Agent Guidelines for conragan.com

## Build/Lint/Test Commands

### Development
- `npm run dev` - Start development server with auto-reload and image EXIF processing
- `npm run build` - Build production site with Astro
- `npm run preview` - Preview built site locally
- `npm run astro` - Access Astro CLI commands

### Testing
No test framework configured. Run `npm run build` to verify builds succeed.

### Linting/Type Checking
- TypeScript strict mode enabled (tsconfig extends astro/tsconfigs/strict)
- No explicit linter configured - rely on TypeScript for type checking

## Code Style Guidelines

### TypeScript/JavaScript
- Use ES modules (`import`/`export`) exclusively
- Define interfaces for component props and complex data structures
- Use optional chaining (`?.`) for safe property access
- Prefer `const` for immutable bindings, `let` for mutable
- Use descriptive variable names in camelCase
- Add JSDoc comments for complex functions explaining purpose and parameters

### Error Handling
- Use try/catch blocks for file operations and external API calls
- Log errors with descriptive messages including context
- Return null/undefined for missing optional data rather than throwing

### File Organization
- Components in `src/components/` with `.astro` extension
- Scripts in `src/scripts/` with `.js` extension
- Photography content in `src/photography/` with automatic EXIF processing
- Static assets in `static/` directory

### Naming Conventions
- Components: PascalCase (e.g., `DiveChart.astro`)
- Functions/variables: camelCase
- Files: kebab-case for URLs, camelCase for scripts
- CSS classes: kebab-case with BEM-like structure

### Imports
- Group imports: external libraries first, then internal modules
- Use absolute paths for internal imports (e.g., `/src/scripts/...`)
- Avoid relative imports with `../`

### Astro-Specific
- Use frontmatter for component logic and prop destructuring
- Keep HTML minimal and semantic
- Use `<script>` tags for client-side JavaScript
- Inline styles in components when component-specific

### Photography Workflow
- Images placed in `src/photography/` subdirectories
- EXIF data automatically extracted to `src/image-data.json`
- Required: Set "Headline" IPTC field for image titles
- Filenames become URL slugs (lowercase, hyphens)
