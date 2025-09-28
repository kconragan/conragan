#!/bin/bash

# A script to create a new blog post for an Astro.js content collection.

# --- CONFIGURATION ---
# Set the directory where your blog posts are stored.
# The script will create subdirectories for the year.
OUTPUT_DIR="src/content/posts"

# -----------------------------------------------------------------------------
# Function to prompt for user input.
# Arguments:
#   $1: The prompt message to display.
#   $2: (Optional) Set to "false" if input is not required. Defaults to "true".
# -----------------------------------------------------------------------------
prompt_input() {
  local prompt="$1"
  local is_required="${2:-true}"
  local input
  while true; do
    read -r -p "$prompt: " input
    if [[ "$is_required" == "true" && -z "$input" ]]; then
      echo "Error: This field is required."
    else
      printf "%s" "$input"
      break
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

echo "Creating a new blog post..."

# --- 1. GATHER POST DETAILS ---
post_title=$(prompt_input "Post Title" "true")
post_tags_raw=$(prompt_input "Tags (comma-separated, optional)" "false")

# --- 2. GET USER CONTENT FROM EDITOR ---
temp_file=$(mktemp)
echo "Opening your default editor (\$EDITOR). Write your post, then save and quit."
echo "---"
sleep 1

# Open a blank file in the user's default text editor (e.g., nvim, vi, nano).
${EDITOR:-nano} "$temp_file"

# Read the user's content back from the temp file.
user_content=$(cat "$temp_file")
rm "$temp_file" # Clean up the temporary file.

# --- 3. PREPARE DATA FOR THE FILE ---
current_date=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
current_year=$(date +"%Y")
slug=$(slugify "$post_title")
final_dir="$OUTPUT_DIR/$current_year/$slug"

# Convert comma-separated tags into a YAML-formatted string (e.g., "design", "ux")
IFS=',' read -ra tags_array <<<"$post_tags_raw"
yaml_tags=""
for tag in "${tags_array[@]}"; do
  # Trim leading/trailing whitespace from each tag
  trimmed_tag=$(echo "$tag" | xargs)
  if [[ -n "$trimmed_tag" ]]; then
    # Append the quoted tag and a comma
    yaml_tags+="\"$trimmed_tag\", "
  fi
done
# Remove the final trailing comma and space
yaml_tags=${yaml_tags%, }

# Create the frontmatter block.
read -r -d '' frontmatter <<EOM
---
title: "${post_title}"
date: ${current_date}
isPublic: false
tags: [${yaml_tags}]
---
EOM

# The body is just the user's content directly.
body="${user_content}"

# --- 4. CREATE THE FILE AND DIRECTORIES ---
mkdir -p "$final_dir"
output_file="$final_dir/index.mdx"

if [ -f "$output_file" ]; then
  echo "Error: A file already exists at $output_file"
  exit 1
fi

# Write the final content to the file.
printf "%s\n\n%s\n" "$frontmatter" "$body" >"$output_file"

# --- 5. FINAL OUTPUT ---
echo ""
echo "✅ Success! New post created at:"
echo "$output_file"
