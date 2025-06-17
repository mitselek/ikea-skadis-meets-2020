# Extraction Module System

## Overview

This directory contains the modular implementation of the extraction system for the SKÅDIS Outreach Helper browser extension. The code has been refactored from a single large file into smaller, more manageable modules organized by functionality.

## Module Structure

- **index.js** - Main entry point that loads and coordinates all extraction modules
- **extraction-manager.js** - Core ExtractionManager class that handles UI interactions and coordinates all extraction operations
- **page-analyzer.js** - Contains the logic for analyzing MakerWorld pages for relevance and engagement
- **comment-extractor.js** - Handles extraction and processing of comments from MakerWorld pages
- **auto-loader.js** - Implements the auto-loading of comments functionality

## Dependencies

These modules are loaded in a specific order through the main index.js file. The parent extraction.js file in the js directory acts as a thin wrapper that loads the entire module system with proper error handling and fallbacks.

## Using the Extraction System

To use the extraction functionality, simply import extraction.js as before. The modular implementation is transparent to the rest of the application. All global functions and the ExtractionManager class remain available in the global scope for backward compatibility.

## Error Handling

The system includes comprehensive error handling:

1. Module loading failures trigger fallbacks
2. Temporary placeholder functions ensure the application doesn't crash if a module fails to load
3. Error reporting through the UI status system
4. Console logging for debugging

## Adding New Features

When adding new features:

1. Decide which module should contain the new functionality
2. If it's a major new feature, consider adding a new module file
3. Make sure to export any functions that need to be globally accessible
4. Update index.js if you add a new module file
