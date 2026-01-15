#!/bin/bash

# Package a Claude Skill for distribution
# Usage: ./package-skill.sh <skill-name> [version]
# Example: ./package-skill.sh full-stack-mvp-builder 1.0.0

set -e

# Save original working directory
ORIGINAL_DIR="$(pwd)"

# Check if skill name provided
if [ -z "$1" ]; then
    echo "❌ Error: Skill name required"
    echo ""
    echo "Usage: ./package-skill.sh <skill-name> [version]"
    echo "Example: ./package-skill.sh full-stack-mvp-builder 1.0.0"
    echo ""
    echo "Available skills:"
    ls -d skills/*/ 2>/dev/null | sed 's|skills/||' | sed 's|/||' | sed 's/^/  - /' || echo "  (no skills found)"
    exit 1
fi

SKILL_NAME="$1"
# Remove leading ./ if present
SKILL_NAME="${SKILL_NAME#./}"
# Remove trailing / if present
SKILL_NAME="${SKILL_NAME%/}"
VERSION="${2:-1.0.0}"
SKILL_DIR="skills/$SKILL_NAME"
TEMP_DIR=$(mktemp -d)
PACKAGE_DIR="$TEMP_DIR/$SKILL_NAME"

# Check if skill directory exists
if [ ! -d "$SKILL_DIR" ]; then
    echo "❌ Error: Skill directory not found: $SKILL_DIR"
    echo ""
    echo "Available skills:"
    ls -d skills/*/ 2>/dev/null | sed 's|skills/||' | sed 's|/||' | sed 's/^/  - /' || echo "  (no skills found)"
    exit 1
fi

# Check if SKILL.md exists (required)
if [ ! -f "$SKILL_DIR/SKILL.md" ]; then
    echo "❌ Error: SKILL.md not found in $SKILL_DIR"
    echo "   SKILL.md is required for Claude skills"
    exit 1
fi

echo "📦 Packaging $SKILL_NAME v$VERSION..."
echo "   Source: $SKILL_DIR"
echo ""

# Create package directory
mkdir -p "$PACKAGE_DIR"

# Copy all files from skill directory
echo "📋 Copying files..."
cp -r "$SKILL_DIR"/* "$PACKAGE_DIR/"

# Copy LICENSE from root if it exists
if [ -f "LICENSE" ]; then
    echo "📄 Copying LICENSE..."
    cp LICENSE "$PACKAGE_DIR/"
fi

# Check if zip command is available
if ! command -v zip &> /dev/null; then
    echo "❌ Error: 'zip' command not found"
    echo ""
    echo "Please install zip:"
    echo "  Ubuntu/Debian: sudo apt-get install zip"
    echo "  macOS: zip is usually pre-installed, or: brew install zip"
    echo "  Fedora/RHEL: sudo dnf install zip"
    echo ""
    echo "Alternatively, you can manually create the ZIP:"
    echo "  1. cd $TEMP_DIR"
    echo "  2. zip -r ${SKILL_NAME}-v${VERSION}.zip $SKILL_NAME"
    echo "  3. Move the ZIP to dist/ directory"
    exit 1
fi

# Create ZIP file (skill folder as root)
echo "🗜️  Creating ZIP file..."
cd "$TEMP_DIR"
ZIP_NAME="${SKILL_NAME}-v${VERSION}.zip"
zip -r "$ZIP_NAME" "$SKILL_NAME" -q

# Move ZIP to dist directory (create if doesn't exist)
DIST_DIR="$ORIGINAL_DIR/dist"
mkdir -p "$DIST_DIR"
mv "$ZIP_NAME" "$DIST_DIR/"

# Cleanup
rm -rf "$TEMP_DIR"

# Change back to original directory
cd "$ORIGINAL_DIR"

echo "✅ Package created: dist/$ZIP_NAME"
echo ""
echo "📝 Next steps:"
echo "1. Test the skill by uploading to Claude (Settings > Capabilities > Upload skill)"
echo "2. Verify all links work correctly"
echo "3. Test with example prompts"
echo ""
echo "📦 ZIP structure:"
if command -v unzip &> /dev/null; then
    unzip -l "$DIST_DIR/$ZIP_NAME" | head -15
else
    echo "  (unzip not available to preview structure)"
fi
