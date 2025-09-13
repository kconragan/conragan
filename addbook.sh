#!/bin/bash

# A script to create a new book note for an Astro.js content collection.

# --- CONFIGURATION ---
# Set the directory where your book notes are stored.
# The script will create subdirectories for the year.
OUTPUT_DIR="src/content/notes"

# -----------------------------------------------------------------------------
# Function to prompt for user input.
# -----------------------------------------------------------------------------
prompt_input() {
  local prompt="$1"
  local input
  while true; do
    read -r -p "$prompt: " input
    if [[ -n "$input" ]]; then
      printf "%s" "$input"
      break
    else
      echo "Error: This field is required."
    fi
  done
}

# -----------------------------------------------------------------------------
# Function to generate a URL-friendly slug from a string.
# -----------------------------------------------------------------------------
slugify() {
  echo "$1" | iconv -t ascii//TRANSLIT | sed -r s/[~\^]+//g | sed -r s/[^a-zA-Z0-9]+/-/g | sed -r s/^-+\|-+$//g | tr A-Z a-z
}

# ==============================================================================
# SCRIPT EXECUTION
# ==============================================================================

echo "Creating a new book note..."

# --- 1. GATHER BOOK DETAILS ---
book_title=$(prompt_input "Book Title")
book_author=$(prompt_input "Book Author")
book_thumbnail=$(prompt_input "Book Thumbnail URL (e.g., from bookshop.org)")
book_link=$(prompt_input "Book Link (e.g., on bookshop.org)")

# --- 2. GET USER CONTENT FROM EDITOR ---
# Create a temporary file for the user to write their notes.
temp_file=$(mktemp)
echo "Opening your default editor (\$EDITOR). Write your key takeaways, then save and quit."
echo "---"
sleep 1 # Give user a moment to read the message

# Open a blank file in the user's default text editor (e.g., nano, nvim, vi).
${EDITOR:-nano} "$temp_file"

# Read the user's content back from the temp file.
user_content=$(cat "$temp_file")
rm "$temp_file" # Clean up the temporary file.

# --- 3. PREPARE DATA FOR THE FILE ---
# Get the current date in full ISO 8601 format for precise sorting.
current_date=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
current_year=$(date +"%Y")

# Create a URL-friendly slug from the book title.
slug=$(slugify "$book_title")
final_dir="$OUTPUT_DIR/$current_year/$slug"

# Create the frontmatter block.
# Using printf for safe and reliable formatting.
read -r -d '' frontmatter <<EOM
---
title: "Reading: ${book_title}"
date: ${current_date}
isPublic: true
tags: ["books", "reading-notes"]
bookDetails:
  title: "${book_title}"
  author: "${book_author}"
  thumbnail: "${book_thumbnail}"
  link: "${book_link}"
---
EOM

# Create the main body content of the markdown file.
read -r -d '' body <<EOM

Reading ${book_title} by ${book_author}

<p>
  <a href="${book_link}" title="View on bookshop.org">
    <img src="${book_thumbnail}" alt="Cover of ${book_title}" class="book-cover" />
  </a>
</p>

${user_content}
EOM

# --- 4. CREATE THE FILE AND DIRECTORIES ---
# Ensure the target directory exists.
mkdir -p "$final_dir"
output_file="$final_dir/index.mdx"

# Check if the file already exists.
if [ -f "$output_file" ]; then
  echo "Error: A file already exists at $output_file"
  exit 1
fi

# Write the final content to the file using printf to ensure newlines are handled correctly.
printf "%s\n\n%s\n" "$frontmatter" "$body" >"$output_file"

# --- 5. FINAL OUTPUT ---
echo ""
echo "✅ Success! New book note created at:"
echo "$output_file"
