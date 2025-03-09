---
title: "File Naming & Organization For Photographers"
date: 2025-02-07T17:14:25-08:00
type: post
isPublic: true
---

File organization and naming is not exactly the most exciting topic for photographers. Most of us would rather discuss our next photo destination or piece of photography gear we want to purchase. But digital asset management becomes a much more significant part of being a photographer as your portfolio grows. These past couple of years I've been putting a lot more focus on my system: optimizing my import process in Capture One, getting a NAS established to store my photo collection, and publishing my best photos here and in Google Photos as a cloud-based backup.

Key to all of this is file naming and organization. As I've written about previously, I'm a big fan of Capture One's Sessions because they're directly linked to the file system, unlike Catalogs which rely on a database. Each Session gets its own dedicated folder for all the images, adjustments, and metadata. This makes it incredibly easy to move projects between my laptop and desktop, but more importantly, it means I can still intuitivel navigate my entire photo archive when I'm not using Capture One (or if at any point in the future I decide to switch to a different photo app).

## An archival approach

There are lots of great resources online that provide best practices here: [Harvard University](https://datamanagement.hms.harvard.edu/plan-design/file-naming-conventions), [National Archives](https://records-express.blogs.archives.gov/2017/08/22/best-practices-for-file-naming/), [The Library of Congress](https://blogs.loc.gov/thesignal/2012/01/with-liberty-and-file-naming-for-all/), [Society of American Archivists](http://files.archivists.org/groups/museum/standards/3.%20Records%20Management/Getty%20Records%20Management%20User%20Guides.pdf).

Across them all are a handful of consistent guidelines:

- Keep filenames as short as possible, no more than 25-30 characters
- Avoid use of special characters
- Replace periods and spaces with hyphens or underscores
- Include descriptive information
- Include dates and format them consistently (ISO 8601)

### A simple but scalable system

So, with these best practices in mind, here's how I organize my own photo library.

To start, all my photos are in one parent folder. _Surprise!_ It is named 'Photos'.

Within that directory, I create a new folder each year, simply named after the year (e.g. 2025). Inside each year folder is a flat list of folders, each folder representing a a photoshoot. I'm not too precious about what constitutes a photoshoot. Sometimes it's literally just a single photoshoot. Other times it is a few days of successive shooting that are all part of one "trip" or "project". The name of each folder follows the same naming convention: YYYY-MM-DD_Short_Description. Here is an example from my 2023 photo directory:

```
2023-10-15_Paso_Robles_Horse_Show
2023-10-28_Woodside_Park_Horse_Show
2023-11-02_Crystal_Springs_Landscape
```

There are a few benefits to this:

- I can easily sort the folders in chronological order
- The brief descriptions tell me what's inside without having to click further
- The names are compatible in most (if not all) filesystems

Now, a mistake many photographers make (myself included for many years) is to just use the default names of files provided by their camera:

```
- DSCF9450.RAF
- CRW_0001.CRW
- NEF_0001.NEF
```

There are a few problems with these:

- The filename tells you nothing about the image
- They can be sorted by name, but that doesn't necessarily mean they are sorted chronologically
- Once you have taken 9,999 images, you run into the risk of duplicate filenames

Based on the archival naming conventions from above, I use the following:

```
YYYYMMDD_Short_Description_COUNTER_KAI.extension
```

Broken down, that is:

- The year in ISO 8601 format (with no spaces, periods, or dashes)
- A short description from the photoshoot
- A 4-digit image counter (0001-9999)
- My firstname (in case I share the file)

Here is what looks like in practice:

```
20250207_Marine_Preserve_0001_KAI.RAF
20250207_Marine_Preserve_0002_KAI.RAF
20250207_Marine_Preserve_0003_KAI.RAF
20250207_Marine_Preserve_0004_KAI.RAF
```

## Putting this into practice in Capture One

While any modern photo editing software can help you implement a consistent file naming system, Capture One offers particularly powerful tools for this. Here's how I set up my `YYYYMMDD_Short_Description_COUNTER_KAI.extension` convention within Capture One:

You can rename files during import or at any point afterward using the _Batch Rename_ feature (the process and interface are largely the same). The key is understanding Capture One's _Tokens_. Think of them as fill-in-the-blanks for your filenames, automatically inserting details like dates, numbers, and camera info. They even let you use dynamic metadata like location or capture time. While Capture One offers pre-built templates, you'll need a custom one for our specific convention.

Here's the step-by-step:

1.  **Name Your Job:** Before importing or selecting images, you have to enter a "Job Name." This provides the short description for your files. Go to the "Next Capture" tab (or if you're batch renaming, access the metadata tool) and enter a descriptive name for your shoot in the "Job Name" field. This is less error prone but also works better when you save this as a preset.
2.  **Import or Select:** Either begin your import (File -> Import Images… or the Import icon) or select the images you want to rename.
3.  **Access the Naming Tool:** In the Import window (or by right-clicking selected images and choosing "Rename..."), find the Naming tool. Click the button next to the "Format" text box to open the Naming dialog.
4.  **Create a Custom Format:** Create a new naming format by dragging tokens and/or adding custom text directly into the "Format" text box. (Click the downward arrow on "Tokens" to access more options.)
5.  **Add Tokens and Text:** Drag and drop the following tokens into the format line:

    - `[YYYY][MM][DD]` (for the date)
    - `[Job Name]` (for the short description – this automatically pulls the name you entered in step 1)
    - `[4 Digit Counter]`
    - Your first name or initials (e.g., `KAI`).

    Your final format should look like this:
    `[YYYY][MM][DD]_[Job Name]_[4 Digit Counter]_KAI`

6.  **Verify and Save:** Click "OK" to accept the changes. _Important_: verify the sample below the "Format" text box to ensure it's correct.

**Create a Preset:** Instead of repeating these steps each time, save this format as a new preset. This allows you to select it from the drop-down menu during import or batch renaming, streamlining your workflow considerably.
