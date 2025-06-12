# 🧪 CSP-Compliant Testing Guide

## Overview

This guide explains the new Content Security Policy (CSP) compliant testing system for the SKÅDIS Outreach Helper browser extension. The previous testing system used `eval()` which was blocked by browser extension security policies.

## Problem Solved

**Issue**: Browser extensions have strict Content Security Policy (CSP) that blocks `eval()` function calls, preventing our previous test loading mechanism from working.

**Solution**: Created standalone HTML test runner with separate test modules that load directly without using `eval()`.

## Test Runner Components

### 1. Test Runner HTML (`utils/test-runner.html`)
- **Purpose**: Main testing interface with beautiful UI
- **Features**: 
  - Four test categories with individual run buttons
  - Real-time results display with color coding
  - Mock Chrome API for standalone testing
  - Progress indicators and status updates

### 2. Test Modules
All tests are now separate JavaScript files that load directly:

#### 🤖 AI Integration Tests (`test-ai-integration.js`)
- RealAIAssistant initialization
- Configuration checks
- Provider detection
- Message synthesis (with API key fallback)
- Configuration updates

#### 📝 Template System Tests (`test-template-system.js`)
- Template engine initialization
- Template selection logic
- Template personalization
- Fallback behavior when AI fails
- Message history tracking

#### 🔧 System Integration Tests (`test-system-integration.js`)
- AI Messaging module integration
- Complete message generation pipeline
- Error handling and fallback scenarios
- Data validation
- Storage integration

#### ⚙️ Configuration Tests (`test-configuration.js`)
- Configuration storage and retrieval
- Provider validation
- API key format validation
- Configuration update procedures
- Default configuration handling

### 3. Launch Script (`launch-tests.sh`)
- **Purpose**: Quick launcher for the test runner
- **Usage**: `./launch-tests.sh` from utils directory
- **Features**: Cross-platform browser opening, status messages

## How to Run Tests

### Method 1: Using the Launch Script
```bash
cd browser-extension-prototype/utils
./launch-tests.sh
```

### Method 2: Direct Browser Opening
1. Navigate to `browser-extension-prototype/utils/`
2. Open `test-runner.html` in your browser
3. Click individual test category buttons

### Method 3: Live Server (Recommended for Development)
If you have a live server extension in VS Code:
1. Right-click `test-runner.html`
2. Select "Open with Live Server"
3. Tests will run with better module loading

## Test Results Interpretation

### Color Coding
- 🟢 **Green**: All tests passed successfully
- 🔴 **Red**: Tests failed with error details
- 🟡 **Yellow**: Tests skipped (usually due to missing API keys)
- 🔵 **Blue**: Tests running or waiting to start

### Success Criteria
- **AI Integration**: 4-5 tests should pass (5th may skip without real API key)
- **Template System**: All 5 tests should pass
- **System Integration**: All 5 tests should pass
- **Configuration**: All 5 tests should pass

## Mock Environment

The test runner includes mock implementations for:
- `chrome.storage.local` API
- Extension storage functionality
- AI API responses (for structure testing)

This allows testing the extension logic without requiring:
- Actual browser extension context
- Real API keys (for basic functionality tests)
- Chrome extension permissions

## CSP Compliance Features

### What We Fixed
- ❌ **Before**: Used `eval()` to load test code dynamically
- ✅ **After**: Direct script loading with `<script src="">` tags

### Security Benefits
- No dynamic code execution
- All scripts loaded from trusted local files
- Full compliance with extension CSP policies
- Safe to run in any browser environment

## Development Workflow

### Adding New Tests
1. Create new test file in `utils/` directory
2. Follow the pattern: `test-[category].js`
3. Export main function: `window.run[Category]Tests = function`
4. Add script tag to `test-runner.html`
5. Add button and handler in the HTML

### Test Structure Template
```javascript
async function runYourCategoryTests() {
    const results = [];
    let testsPassed = 0;
    let totalTests = 5;
    
    // Test 1: Your test
    try {
        // Test logic here
        results.push('✅ Test 1: Description - PASSED');
        testsPassed++;
    } catch (error) {
        results.push(`❌ Test 1: Description - FAILED: ${error.message}`);
    }
    
    // ... more tests ...
    
    // Summary
    results.push(`\n📊 Test Summary: ${testsPassed}/${totalTests} passed`);
    return results.join('\n');
}

window.runYourCategoryTests = runYourCategoryTests;
```

## Troubleshooting

### Common Issues

1. **Tests Not Loading**
   - Ensure all script tags are correct in `test-runner.html`
   - Check browser console for loading errors
   - Verify file paths are relative and correct

2. **Chrome API Errors**
   - Tests use mock Chrome API, real errors are expected
   - Focus on logic testing rather than actual API calls

3. **Module Not Found**
   - Ensure extension JavaScript files are in correct locations
   - Check that relative paths in HTML are accurate

4. **Browser Security Warnings**
   - Normal for local file access
   - Use live server for development to avoid warnings

### Getting Help

If tests fail unexpectedly:
1. Check browser console for detailed error messages
2. Verify all extension files are in place
3. Ensure you're using a modern browser (Chrome/Firefox/Edge)
4. Try running individual test categories to isolate issues

## Benefits of New System

✅ **CSP Compliant**: Works in all browser extension environments  
✅ **User Friendly**: Beautiful HTML interface with clear results  
✅ **Comprehensive**: Tests all major extension functionality  
✅ **Maintainable**: Easy to add new tests and categories  
✅ **Safe**: No dynamic code execution or security risks  
✅ **Portable**: Works standalone without extension context  

This testing system ensures the SKÅDIS extension is robust, well-tested, and ready for production use!
