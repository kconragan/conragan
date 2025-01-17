#!/usr/bin/env python3

import json
import os
import subprocess


def scan_directory_and_extract_metadata(base_dir):
    """
    Scans the given directory and its subdirectories, extracts metadata from .jpg files,
    and creates a corresponding .json file for each image, skipping existing JSON files and cover images.

    Args:
        base_dir (str): The base directory to start scanning.
    """
    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.lower().endswith(".jpg"):
                base_filename, _ = os.path.splitext(file)

                # Skip cover images
                if base_filename.lower() in ("cover", "_cover"):
                    print(f"Skipping (cover image): {file}")
                    continue

                image_path = os.path.join(root, file)
                json_path = os.path.splitext(image_path)[0] + ".json"

                # Skip if JSON file already exists
                if os.path.exists(json_path):
                    print(f"Skipping (JSON exists): {image_path}")
                    continue

                # Use exiftool to extract metadata
                try:
                    result = subprocess.run(
                        [
                            "exiftool",
                            "-json",
                            "-struct",
                            "-XMP:All",
                            "-EXIF:All",
                            "-IPTC:All",
                            image_path,
                        ],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True,
                        check=True,  # Raises an exception for non-zero exit codes
                    )

                    # Parse the output and save it to a .json file
                    metadata = json.loads(result.stdout)

                    # Check if metadata is a list and get the first element
                    if isinstance(metadata, list) and len(metadata) > 0:
                        metadata = metadata[0]

                    with open(json_path, "w") as json_file:
                        json.dump(metadata, json_file, indent=4)

                    print(f"Metadata extracted for {image_path} -> {json_path}")

                except subprocess.CalledProcessError as e:
                    print(f"Error processing {image_path}: {e.stderr}")
                except Exception as e:
                    print(f"Exception occurred while processing {image_path}: {e}")


if __name__ == "__main__":
    base_directory = os.getcwd()  # Use the current working directory

    # Safety checks
    if base_directory in ("/", "/home", "/root", "/Users"):
        print("Error: Refusing to run in a potentially unsafe directory.")
        exit(1)

    print(f"Scanning directory: {base_directory}")
    scan_directory_and_extract_metadata(base_directory)
