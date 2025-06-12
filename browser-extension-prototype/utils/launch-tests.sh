#!/bin/bash

# SKÅDIS Extension Test Runner Launcher
# CSP-compliant testing solution

echo "🧪 SKÅDIS Extension Test Runner"
echo "================================"
echo
echo "Launching CSP-compliant test runner..."
echo

# Get the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Path to the test runner HTML file
TEST_RUNNER="$DIR/test-runner.html"

if [ -f "$TEST_RUNNER" ]; then
    echo "✅ Test runner found: $TEST_RUNNER"
    echo
    echo "Opening test runner in your default browser..."
    echo "This will open a local HTML file that runs all tests safely."
    echo
    
    # Try to open in different ways depending on the OS
    if command -v xdg-open > /dev/null; then
        xdg-open "$TEST_RUNNER"
    elif command -v open > /dev/null; then
        open "$TEST_RUNNER"
    elif command -v start > /dev/null; then
        start "$TEST_RUNNER"
    else
        echo "❌ Could not automatically open browser."
        echo "Please manually open: file://$TEST_RUNNER"
    fi
    
    echo
    echo "📋 Test Categories Available:"
    echo "   🤖 AI Integration Tests - Test Real AI Assistant functionality"
    echo "   📝 Template System Tests - Test template-based messaging fallback"
    echo "   🔧 System Integration Tests - Test complete message generation pipeline"
    echo "   ⚙️ Configuration Tests - Test AI configuration and storage"
    echo
    echo "💡 All tests are now CSP-compliant and safe to run in browser environments!"
    
else
    echo "❌ Test runner not found at: $TEST_RUNNER"
    echo "Please ensure you're running this script from the utils directory."
    exit 1
fi
