#!/bin/bash
# 🔑 SECURE API KEY EXTRACTION SCRIPT
# This script helps you find and copy your existing Claude/Anthropic API key
# from your VS Code extensions without displaying it in the terminal.

echo "🔍 Searching for your existing API keys in VS Code extensions..."
echo "=============================================================="

# Look for Claude Dev API key
CLAUDE_DEV_DIR="$HOME/.config/Code/User/globalStorage/saoudrizwan.claude-dev"
if [ -d "$CLAUDE_DEV_DIR" ]; then
    echo "✅ Found Claude Dev extension data"
    
    # Check global state for API key
    GLOBAL_STATE="$HOME/.config/Code/User/globalStorage/storage.json"
    if [ -f "$GLOBAL_STATE" ]; then
        if grep -q "anthropic\|claude" "$GLOBAL_STATE" 2>/dev/null; then
            echo "✅ Found Anthropic/Claude references in global storage"
        fi
    fi
    
    # Look for recent task files that might contain API key references
    RECENT_TASK=$(find "$CLAUDE_DEV_DIR/tasks" -name "*.json" -type f | head -1)
    if [ -f "$RECENT_TASK" ]; then
        echo "✅ Found recent Claude Dev task files"
        echo "📁 Example file: $(basename $(dirname $RECENT_TASK))"
    fi
else
    echo "❌ Claude Dev extension data not found"
fi

# Look for GitHub Copilot API key
COPILOT_DIR="$HOME/.config/Code/User/globalStorage/github.copilot"
if [ -d "$COPILOT_DIR" ]; then
    echo "✅ Found GitHub Copilot extension data"
fi

# Check for Cursor configuration
CURSOR_DIR="$HOME/.config/Cursor"
if [ -d "$CURSOR_DIR" ]; then
    echo "✅ Found Cursor configuration directory"
fi

echo ""
echo "🎯 NEXT STEPS:"
echo "=============="
echo ""
echo "Since you have Claude Dev extension working, you have an Anthropic API key!"
echo ""
echo "🔐 To find your API key securely:"
echo "1. Open VS Code/Cursor"
echo "2. Go to Claude Dev extension settings"
echo "3. Look for 'API Key' or 'Anthropic API Key' setting"
echo "4. Copy that key to use in the browser extension"
echo ""
echo "🌐 Alternative - Get API key from Anthropic directly:"
echo "1. Go to: https://console.anthropic.com/"
echo "2. Sign in with the same account you use for Claude Dev"
echo "3. Go to 'API Keys' section"
echo "4. Copy an existing key or create a new one"
echo ""
echo "🚀 Once you have the key:"
echo "1. Open the SKÅDIS browser extension"
echo "2. Click '🤖 Configure AI Assistant'"
echo "3. Select 'Anthropic (Claude)'"
echo "4. Paste your API key"
echo "5. Click 'Test Connection' then 'Save Config'"
echo ""
echo "✨ Your extension will then use Real AI for personalized messages!"
