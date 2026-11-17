#!/bin/bash

# Define directories to skip
skip_dirs=("node_modules" "pnpm-lock.yaml" ".git" "dist" "build" "test-results" "playwright-report" "coverage" "logs" "temp" "tmp" "output" ".vercel")

# Define file extensions to skip
skip_exts=("jpg" "webp" "jpeg" "png" "gif" "bmp" "tiff" "ico" "svg" "psd" "eps" "raw" "heif" "heic")

# Helper function to check if an item exists in an array
is_in_array() {
    local seek="$1"
    shift
    for element; do
        if [[ "$element" == "$seek" ]]; then
            return 0
        fi
    done
    return 1
}

# Recursive function to process files and directories
process_path() {
    local current_path="$1"
    local recursive="${2:-true}"

    for item in "$current_path"/*; do
        # Skip if the glob didn't match anything (empty directory)
        [[ -e "$item" ]] || continue

        local filename
        filename=$(basename "$item")

        if [[ -d "$item" ]]; then
            if ! is_in_array "$filename" "${skip_dirs[@]}"; then
                echo "Directory: $item"
                if [[ "$recursive" == "true" ]]; then
                    process_path "$item"
                fi
            fi
        elif [[ -f "$item" ]]; then
            if [[ "$filename" != "output.txt" ]]; then
                # Extract file extension and convert to lowercase
                local ext=""
                if [[ "$filename" == *.* ]]; then
                    ext="${filename##*.}"
                    ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')
                fi

                if ! is_in_array "$ext" "${skip_exts[@]}"; then
                    echo "$filename"
                    echo ""
                    echo "\`\`\`$ext"
                    cat "$item"
                    echo ""
                    echo "\`\`\`"
                    echo ""
                fi
            fi
        fi
    done
}

while true; do
    read -r -p "Print [1] root-level contents only or [2] the src/ tree? " scope
    case "$scope" in
        1)
            process_path "." false > output.txt
            break
            ;;
        2)
            if [[ ! -d "src" ]]; then
                echo "Error: src/ directory not found." >&2
                exit 1
            fi
            process_path "src" > output.txt
            break
            ;;
        *)
            echo "Please enter 1 or 2."
            ;;
    esac
done
