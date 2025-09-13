---
title: Building An Automated Photo Gallery With Astro.js
date: 2025-08-24T10:34:00-10:36
type: post
isPublic: true
---

When I rebuilt my website using Astro.js, a primary goal was to make publishing my photos easier. Because of the ease of publishing on social media platforms, I had fallen into the trap of only posting there. Inevitably, when you post on social media, you evaluate your work through the lens of engagement. This is not my goal. I create photos for myself. For the sake of the creative process. And to watch my progress over time.

The majority of my photo workflow is in [Capture One](https://www.captureone.com/), my favorite RAW editor. It occurred to me: *why can't I just export a photo from Capture One and have it publish to my website?*. So I set off to build that workflow as closely as possible.

My goals were:

1. Organize my photos into galleries for frequent subjects like [Landscapes](/photography/landscapes/) or [Birds & Wildlife](/photography/birds-wildlife/)
2. Give each photo a permanent URL to make it easy to share and link to
3. Publish EXIF data with my photos

While I don't have a computer science background, I'm quite happy with the solution I built. I'm sure the code below could be improved (please share if you have ideas!). But for now, this code works well for me and provides a starting point for anyone interested in a similar setup.


## The Code

The system has three components:

1. A `nodemon` process that watches for changes to my `src/photography` directory
2. A `JavaScript` script that reads EXIF data from an image, and is called by `nodemon` when a new image is detected. This script saves EXIF data to a `json` file that Astro.js files are able to process
3. Astro.js templates that render a gallery (e.g. *landscapes*) and a single image view for each photo

Let's go through them step-by-step.

### `package.json`

The process begins with **`nodemon`**, a simple utility that uses [concurrently](https://www.npmjs.com/package/concurrently) to watch for new images in my `src/photography` directory. As soon as a new image appears (e.g. `.jpg`), it triggers the automation.

```javascript
{
  "name": "astro-photography-site",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"astro dev\" \"nodemon -L --watch 'src/photography/**' --ext 'jpg,jpeg,png,gif' --exec 'node image-exif.js'\"",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/mdx": "^4.1.0",
    "astro": "^5.3.1",
    "exifreader": "^4.26.1"
  },
  "devDependencies": {
    "concurrently": "^9.1.2",
    "nodemon": "^3.1.9"
  }
}
```

### Extracting metadata from images

This is where the system becomes an extension of my editing workflow. After **`nodemon`** invokes the script, it recursively walks through the `src/photography` directory and uses the **[exifreader](https://www.npmjs.com/package/exifreader)** library to pull out the metadata I've already embedded in Capture One. The script then writes all of that data to a single **`JSON`** file, **`src/image-data.json`**, which becomes our on-disk database. This gives **Astro.js** everything it needs to render rich, dynamic templates.

```javascript
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const EXIF = require('exifreader');

/**
 * Extracts EXIF data from an image file.
 * @param {string} imagePath - The path to the image file.
 * @returns {Promise<object|null>} The EXIF tags or null if an error occurs.
 */
async function extractEXIFData(imagePath) {
    try {
        const imageBuffer = await fs.readFile(imagePath);
        const tags = EXIF.load(imageBuffer);
        return tags;
    } catch (error) {
        console.error(`Error processing ${imagePath}:`, error);
        return null;
    }
}

/**
 * Traverses the photography directory, extracts EXIF data, and writes it to a JSON file.
 */
async function processImages() {
    const imageData = {};
    const photographyDir = 'src/photography';
    const outputFilePath = 'src/image-data.json';

    async function traverseDir(dir) {
        const files = await fs.readdir(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dir, file.name);

            if (file.isDirectory()) {
                await traverseDir(fullPath); // Recursive call for subdirectories
            } else if (/\.(jpg|jpeg|png|gif)$/i.test(file.name)) {
                const exifData = await extractEXIFData(fullPath);
                if (exifData) {
                    imageData[fullPath] = exifData;
                }
            }
        }
    }

    await traverseDir(photographyDir);

    await fs.writeFile(outputFilePath, JSON.stringify(imageData, null, 2));
    console.log(`EXIF data written to ${outputFilePath}`);
}

processImages();
```


### The Gallery Template

With the JSON file in place, Astro components can read that data and use it to display content.

The gallery page uses `import.meta.glob` to find all of the images within a given gallery directory (e.g. *landscapes* or *travel*) and then uses the image path to look up the correct EXIF data from our JSON file.

```javascript
---
import { Picture } from 'astro:assets';
import imageData from '../../image-data.json';

// Get a list of all images from the "photography" directory.
const allImages = import.meta.glob<{ default: ImageMetadata }>('../../photography/*/*.{jpg,jpeg,png,gif}', { eager: true });

// Process the image list to be used in the template.
const imageList = Object.keys(allImages).map(path => {
  const imageModule = allImages[path];
  const parts = path.split('/');
  const slugWithExtension = parts.pop();
  const slug = slugWithExtension ? slugWithExtension.split('.')[0] : '';
  const alt = slug || "Gallery Image";

  return {
    src: imageModule.default,
    alt: alt,
    slug: slug,
    imagePath: `src/photography/${parts.pop()}/${slugWithExtension}`,
  };
});

// Define a type for the imageData JSON
interface ImageData {
  [key: string]: {
    Headline?: {
      description?: string;
    };
    [key: string]: any;
  };
}
const typedImageData: ImageData = imageData;

function getImageOrientation(width: number, height: number): 'portrait' | 'landscape' {
  return width > height ? 'landscape' : 'portrait';
}
---

<h1>My Photo Gallery</h1>
<ul class="photo-grid">
  {imageList.map((image) => {
    const imageEXIF = typedImageData[image.imagePath];
    const orientation = getImageOrientation(image.src.width, image.src.height);

    return (
      <li class={`photo-item ${orientation}`}>
        <a href={`/photography/${image.slug}/`}>
          <figure>
            <Picture src={image.src}
                     formats={['avif', 'webp']}
                     alt={imageEXIF?.Headline?.description ?? 'View'} />
            <figcaption>
              {imageEXIF?.Headline?.description ?? 'View Image'}
            </figcaption>
          </figure>
        </a>
      </li>
    );
  })}
</ul>
```

### Single Image View

It's important to me that each image has a permanent `URL` so I can easily link to the image from elsewhere. Such as:

`https://conragan.com/photography/birds-wildlife/coyote-stalking/`

The code that handles that page is:

```javascript
---
import { Image } from 'astro:assets';
import imageData from '../../../image-data.json';

// Get the props passed from getStaticPaths.
const { slug, imagePath, imageModule } = Astro.props;

const typedImageData = imageData as any;

// Retrieve image EXIF data using the imagePath.
const imageEXIF = typedImageData[imagePath];
---

<div id="photo-container">
  <div id="photo-image">
    <Image src={imageModule.default} alt={imageEXIF?.Headline?.description ?? slug} width="1200"/>
  </div>
  <div id="photo-content">
    <h1 class="photo-title">{imageEXIF?.Headline?.description ?? slug}</h1>
    <dl id="exif">
      {imageEXIF?.Make?.description && (
        <>
          <dt>Camera</dt>
          <dd>{imageEXIF.Make.description} {imageEXIF.Model?.description}</dd>
        </>
      )}
      {imageEXIF?.LensModel?.description && (
        <>
          <dt>Lens</dt>
          <dd>{imageEXIF.LensModel.description}</dd>
        </>
      )}
      {imageEXIF?.FocalLength?.description && (
        <>
          <dt>Focal Length</dt>
          <dd>{imageEXIF.FocalLength.description}</dd>
        </>
      )}
      {imageEXIF?.FNumber?.description && (
        <>
          <dt>Aperture</dt>
          <dd>{imageEXIF.FNumber.description}</dd>
        </>
      )}
      {imageEXIF?.ExposureTime?.description && (
        <>
          <dt>Exposure Time</dt>
          <dd>{imageEXIF.ExposureTime.description}</dd>
        </>
      )}
      {imageEXIF?.ISOSpeedRatings?.description && (
        <>
          <dt>ISO</dt>
          <dd>{imageEXIF.ISOSpeedRatings.description}</dd>
        </>
      )}
      {imageEXIF?.DateTimeOriginal?.value && (
        <>
          <dt>Captured</dt>
          <dd>{imageEXIF.DateTimeOriginal.value[0]}</dd>
        </>
      )}
    </dl>
  </div>
</div>
```

That's the system in full. I've simplified some of the examples above by removing extra code pertaining to style and presentation. If you want to view the code in full, head on over to my [Github repo](https://github.com/kconragan/conragan). If you end up using this, I'd love to hear about it and check out your photography as well!

In a future blog post I'll cover how I handle some of the front-end rendering. In particular how I was able to provide responsive layouts for different clients, as well as how I used JavaScript to provide streamlined navigation.
