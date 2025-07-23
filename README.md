# Personal Website & Portfolio

This is the source code for my personal website, portfolio, and blog, available at [conragan.com](https://conragan.com). It is built with [Astro](https://astro.build/) and uses an automated script to generate photo galleries from image metadata.

## 1. Setup & Local Development

To set up and run this project on a new machine, follow these steps.

### Prerequisites

* **Node.js:** This project uses a modern version of Node.js. It's recommended to use Node.js v22 or later.
* **npm:** The Node.js package manager, which is included with Node.js.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kconragan/conragan.git
    cd conragan
    ```

2.  **Install dependencies:** This will install Astro and all other required packages.
    ```bash
    npm install
    ```

### Running the Development Server

To start the local development server, run the following command:

```bash
npm run dev
```

This command does two things simultaneously:

1.  It starts the standard Astro development server at `http://localhost:4321`.
2.  It starts a watcher that automatically runs an image processing script whenever a new photo is added.

## 2. Content Management: Adding New Photos

The photography portfolio is managed by an automated script that reads EXIF/IPTC metadata directly from the image files.

### 2.1 The Workflow

The process to add a new photo is extremely simple:

1.  **Add the Image File:** Place your final, web-optimized image file into the appropriate gallery sub-directory within `src/photography/`. For example: `src/photography/landscape/my-new-photo.jpg`.

2.  **Run the Dev Server:** If the development server (`npm run dev`) is running, it will automatically detect the new image and update the website.

No manual creation of markdown or data files is necessary. The system reads the image, updates a central `src/image-data.json` file, and the website builds the gallery pages from that file.

### 2.2 Required Metadata for Titles

For the system to create a proper title for your photo, you must set it in your photo editing software before exporting the image.

* **Required Field:** **Headline** (IPTC Standard)
* **Usage:** The value of the `Headline` field is used as the main title and `alt` text for the image on its dedicated page.
* **Fallback:** If the `Headline` field is empty, the system will use the image's filename as a fallback title.

Other standard EXIF data (camera, lens, settings, etc.) is read automatically and requires no manual setup.

### 2.3 Image Filenames and URL Slugs

The URL for each photo page (the 'slug') is generated directly from its filename.

* **Logic:** The system takes the image filename (e.g., `golden-gate-sunset.jpg`), removes the extension, and uses the result as the slug.
* **Example:** A file named `golden-gate-sunset.jpg` will result in a page at the URL `/photography/gallery-name/golden-gate-sunset/`.
* **Best Practice:** For clean and predictable URLs, use filenames that are lowercase with words separated by hyphens. Avoid spaces or special characters.

## 3. Deployment

This site is hosted on **Cloudflare Pages** and is configured for automatic, continuous deployment.

The deployment process is triggered every time you push new code to the `main` branch of your GitHub repository.

### Deployment Steps

1.  **Finalize Local Changes:** After adding new photos or making other changes, ensure everything is working correctly on your local development server.

2.  **Commit and Push to Main:** Commit all your changes and push them to the `main` branch on GitHub.
    ```bash
    git add .
    git commit -m "Your commit message"
    git push origin main
    ```

3.  **Automatic Deployment:** That's it. Cloudflare will automatically detect the new commit on the `main` branch, rebuild your Astro site, and deploy the new version to your production domains. You can monitor the progress in your Cloudflare Pages dashboard.

