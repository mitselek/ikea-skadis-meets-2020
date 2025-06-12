#!/bin/bash
# 🧹 DOCUMENTATION CLEANUP SCRIPT
# Organizes documentation and removes obsolete files

set -e  # Exit on any error

EXTENSION_DIR="/home/michelek/Documents/ikea-skadis-adapters/browser-extension-prototype"
cd "$EXTENSION_DIR"

echo "🧹 Starting Documentation Cleanup..."
echo "📁 Working in: $(pwd)"

# Create new directory structure
echo "📂 Creating organized directory structure..."
mkdir -p docs
mkdir -p scripts
mkdir -p archive/development-history

# Move essential documentation to docs/
echo "📚 Organizing essential documentation..."
if [ -f "REAL_AI_SETUP_GUIDE.md" ]; then
    mv "REAL_AI_SETUP_GUIDE.md" "docs/AI_SETUP_GUIDE.md"
    echo "  ✅ Moved AI setup guide"
fi

if [ -f "README.md" ]; then
    cp "README.md" "docs/README.md"  # Copy to preserve original
    echo "  ✅ Copied main README"
fi

if [ -f "FINAL_INTEGRATION_STEPS.md" ]; then
    mv "FINAL_INTEGRATION_STEPS.md" "docs/DEVELOPMENT_GUIDE.md"
    echo "  ✅ Moved development guide"
fi

if [ -f "AI_SYSTEM_SUMMARY.md" ]; then
    mv "AI_SYSTEM_SUMMARY.md" "docs/PROJECT_STATUS.md"
    echo "  ✅ Moved project status"
fi

# Move essential scripts to scripts/
echo "🔧 Organizing essential scripts..."
if [ -f "CONFIGURE_OPENAI_KEY.js" ]; then
    mv "CONFIGURE_OPENAI_KEY.js" "scripts/configure-ai.js"
    echo "  ✅ Moved AI configuration script"
fi

if [ -f "FINAL_AI_INTEGRATION_TEST.js" ]; then
    mv "FINAL_AI_INTEGRATION_TEST.js" "scripts/test-integration.js"
    echo "  ✅ Moved integration test"
fi

if [ -f "SECURE_CONFIGURE_AI.js" ]; then
    mv "SECURE_CONFIGURE_AI.js" "scripts/secure-configure.js"
    echo "  ✅ Moved secure configuration script"
fi

# Archive some files that might be useful for reference
echo "📦 Archiving development history..."
archive_files=(
    "REAL_AI_INTEGRATION_COMPLETE.md"
    "FINAL_ACHIEVEMENT.md"
    "COMPLETION_STATUS.md"
)

for file in "${archive_files[@]}"; do
    if [ -f "$file" ]; then
        mv "$file" "archive/development-history/"
        echo "  📦 Archived: $file"
    fi
done

# Remove obsolete debug files
echo "🗑️ Removing obsolete debug files..."
debug_files=(
    "DEBUG_AI_MESSAGING.md"
    "DEBUG_AI_NEXT_STEPS.md"
    "DEBUG_DASHBOARD.md"
    "DEBUG_SCRIPT.md"
    "DEBUG_SCRIPT_V2.md"
    "DEBUG_SCRIPT_V3.md"
    "DEBUG_SCRIPT_V4.md"
    "AI_CONFIG_DEBUG_GUIDE.md"
    "DEBUG_INITIALIZATION.js"
    "LINTING_FINAL_STATUS.md"
    "LINTING_REPORT.md"
)

removed_count=0
for file in "${debug_files[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "  🗑️ Removed: $file"
        ((removed_count++))
    fi
done

# Remove obsolete test scripts
echo "🗑️ Removing obsolete test scripts..."
test_files=(
    "COMPREHENSIVE_AI_TEST.js"
    "QUICK_AI_TEST_FIXED.js"
    "QUICK_AI_TEST_PASTE.js"
    "SIMPLE_AI_TEST.js"
    "TEST_AI_CONFIG.js"
    "API_KEY_DEBUG.js"
    "EXTENSION_RELOAD_TEST.js"
    "QUICK_FIX_TEST.js"
    "AI_CONFIG_VISUAL_DEBUG.js"
)

for file in "${test_files[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "  🗑️ Removed: $file"
        ((removed_count++))
    fi
done

# Remove status/progress files
echo "🗑️ Removing obsolete status files..."
status_files=(
    "AI_MESSAGING_COMPLETE.md"
    "AI_MESSAGING_FIXED.md"
    "AI_MESSAGING_TEST.md"
    "AI_DASHBOARD.md"
    "AI_DASHBOARD_FIXED.md"
    "AI_DASHBOARD_GUIDE.md"
    "AI_STATUS_NEXT_STEPS.md"
    "PROSPECTS_UI.md"
    "PROSPECTS_UI_FIXED.md"
)

for file in "${status_files[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "  🗑️ Removed: $file"
        ((removed_count++))
    fi
done

# Remove obsolete guides
echo "🗑️ Removing obsolete guides..."
guide_files=(
    "TESTING_GUIDE.md"
    "TESTING_GUIDE_FIXED.md"
    "TRACKING_IMPLEMENTATION.md"
    "AUTOMATIC_TRACKING_TEST.md"
    "DUPLICATE_PREVENTION.md"
    "AUTO_PROFILE_OPENING.md"
    "QUICK_START_TRACKING.md"
)

for file in "${guide_files[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "  🗑️ Removed: $file"
        ((removed_count++))
    fi
done

# Remove old/duplicate files
echo "🗑️ Removing old/duplicate files..."
old_files=(
    "README_V4.md"
    "FIND_API_KEYS.sh"
    "OPENAI_API_TEST.js"
)

for file in "${old_files[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "  🗑️ Removed: $file"
        ((removed_count++))
    fi
done

# Check if popup_new.js is actually used
if [ -f "popup_new.js" ]; then
    echo "⚠️ Found popup_new.js - please manually check if this is still needed"
fi

echo ""
echo "🎉 CLEANUP COMPLETE!"
echo "📊 Summary:"
echo "  📚 Organized: 4 essential documentation files → docs/"
echo "  🔧 Organized: 3 essential scripts → scripts/"
echo "  📦 Archived: 3 development history files → archive/"
echo "  🗑️ Removed: $removed_count obsolete files"
echo ""
echo "📁 New structure:"
echo "├── docs/ (essential documentation)"
echo "├── scripts/ (utility scripts)" 
echo "├── archive/ (development history)"
echo "└── [core extension files]"
echo ""
echo "✨ Your documentation is now clean and organized!"
