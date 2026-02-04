# Gemini Context: Conragan Personal Website

This `GEMINI.md` file provides context for the Gemini CLI agent when working on the `conragan` project.

## Project Overview

**Project Name:** conragan (Personal Website & Portfolio)
**URL:** [conragan.com](https://conragan.com)
**Type:** Static Site / Portfolio
**Framework:** [Astro](https://astro.build/) (v5+)
**Languages:** TypeScript, JavaScript, HTML, CSS (Bulma + Custom)
**Deployment:** Cloudflare Pages (Automatic via GitHub)

This project is a personal portfolio and blog featuring automated photo gallery generation, dive logs, and standard blog posts. It appears to be migrating from or co-existing with a Hugo structure, but the active development is in Astro.

## Key Directories

*   `src/`: Main source code (Astro components, pages, content).
*   `src/content/`: Astro Content Collections (`posts`, `divelogs`, `links`, `notes`).
*   `src/photography/`: Source directory for photography portfolio images and gallery descriptions.
*   `public/`: Static assets served at the root (fonts, favicons, etc.).
*   `assets/`: Raw CSS/JS assets (Bulma, LightGallery, custom scripts).
*   `content/` & `public_hugo/`: likely legacy or backup directories from a previous Hugo version.

## Building and Running

### Prerequisites
*   Node.js (v22+ recommended)
*   npm

### Key Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | **Primary Dev Command.** Starts Astro dev server + `nodemon` watcher for image processing. |
| `npm run build` | Builds the production site. |
| `npm run preview` | Previews the built site locally. |
| `./addpost.sh` | Interactive script to create a new blog post. |
| `./addnote.sh` | Interactive script to create a new note. |

## Development Workflows

### 1. Photography Portfolio
*   **Automation:** The site uses `image-exif.js` to automatically generate gallery data from image metadata.
*   **Adding Photos:**
    1.  Place processed images (JPG) in `src/photography/<gallery-name>/`.
    2.  Ensure IPTC **Headline** metadata is set (used as Title/Alt text). Fallback is filename.
    3.  Run `npm run dev`. The watcher will detect changes and update the site.
*   **Filenames:** Use lowercase, hyphen-separated filenames (e.g., `golden-gate-sunset.jpg`). These become the URL slugs.

### 2. Content Management (Blog/Notes)
*   **Collections:** Content is managed via Astro Content Collections in `src/content/`.
*   **Creating Posts:** Use the helper scripts:
    *   `./addpost.sh`: Prompts for title/tags and opens $EDITOR.
*   **Frontmatter:** All markdown files use YAML frontmatter.

### 3. Styling
*   **CSS Framework:** Bulma CSS is present (`assets/css/bulma.min.css`).
*   **Custom CSS:** `assets/css/conragan.css`.
*   **Tailwind:** Listed in `package.json` dependencies, but usage should be verified in components.

## Technical Details

*   **Image Processing:** `image-exif.js` reads EXIF/IPTC data and likely updates a JSON data file (referenced as `src/image-data.json` in README, though verify existence).
*   **Dive Logs:** Specialized content collection with detailed schema for dive statistics (`src/content/divelogs`).
*   **Routing:** Uses `trailingSlash: 'always'` config.
