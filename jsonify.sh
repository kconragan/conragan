#!/bin/bash

# Safety Check: Ensure script is not run from the root directory
if [[ "$PWD" == "/" ]]; then
  echo "Error: This script cannot be run from the root directory."
  exit 1
fi

# Safety Check: Ensure script is run from a directory with a recognized name
if [[ ! "$PWD" =~ (^|/)(photography|images|pictures)($|/) ]]; then
  echo "Error: This script must be run from within a directory named 'photography', 'images', or 'pictures' (or one of their subdirectories)."
  exit 1
fi

# Create an argument file for exiftool
argfile=$(mktemp)

# Log file for exiftool errors
log_file="$PWD/exiftool_errors.log"

# Write exiftool options to the argument file
cat << EOF > "$argfile"
-j
-struct
-XMP:All
-EXIF:All
-IPTC:All
-o
%d%f.json
-if
\$filename ne 'cover.jpg' and \$filename ne '_cover.jpg' and not -e \$directory/%f.json
-ext
jpg
-r
.
EOF

# Run exiftool with the argument file, capturing error output
exiftool -@ "$argfile" 2>> "$log_file"

# Check exiftool exit status
if [[ $? -ne 0 ]]; then
  echo "Error: exiftool encountered errors. See '$log_file' for details."
else
  echo "exiftool completed successfully."
fi

# Clean up the argument file
rm "$argfile"
