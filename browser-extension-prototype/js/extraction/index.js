// 📦 EXTRACTION MODULE INDEX
// Imports all extraction components and sets them up

// This file serves as the main entry point for the extraction functionality
// It loads all required modules in the correct order and initializes them

// Global extraction functions and managers get exposed through this module
// to maintain compatibility with existing code that imports extraction.js

console.log('🔍 Initializing SKÅDIS extraction modules...');

// Track which modules have been loaded
const moduleLoadStatus = {
  pageAnalyzer: false,
  commentExtractor: false,
  autoLoader: false,
  manager: false
};

// Function to check if all modules are loaded
function checkAllModulesLoaded() {
  const allLoaded = Object.values(moduleLoadStatus).every(status => status === true);
  if (allLoaded) {
    console.log('✅ All extraction modules successfully loaded');
  }
  return allLoaded;
}

// Helper to load a script
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

// Load page analyzer module
loadScript('/js/extraction/page-analyzer.js')
  .then(() => {
    moduleLoadStatus.pageAnalyzer = true;
    console.log('✓ Page analyzer module loaded');
    return checkAllModulesLoaded();
  })
  .catch(err => {
    console.error('Failed to load page analyzer module:', err);
  });

// Load comment extractor module
loadScript('/js/extraction/comment-extractor.js')
  .then(() => {
    moduleLoadStatus.commentExtractor = true;
    console.log('✓ Comment extractor module loaded');
    return checkAllModulesLoaded();
  })
  .catch(err => {
    console.error('Failed to load comment extractor module:', err);
  });

// Load auto loader module
loadScript('/js/extraction/auto-loader.js')
  .then(() => {
    moduleLoadStatus.autoLoader = true;
    console.log('✓ Auto loader module loaded');
    return checkAllModulesLoaded();
  })
  .catch(err => {
    console.error('Failed to load auto loader module:', err);
  });

// Load extraction manager module last
loadScript('/js/extraction/extraction-manager.js')
  .then(() => {
    moduleLoadStatus.manager = true;
    console.log('✓ Extraction manager module loaded');
    return checkAllModulesLoaded();
  })
  .catch(err => {
    console.error('Failed to load extraction manager module:', err);
  });

// For backwards compatibility, ensure the ExtractionManager is globally available
if (typeof ExtractionManager === 'undefined') {
  // This is a backup in case the module loading fails
  class ExtractionManagerFallback {
    constructor() {
      console.error('Using ExtractionManager fallback - modules may not have loaded correctly');
    }
    
    showStatus(message) {
      console.error('ExtractionManager not properly initialized:', message);
      alert('Error: Extraction components not properly loaded. Please reload the extension.');
    }
    
    extractCurrentPage() {
      this.showStatus('Cannot analyze page - components not loaded');
    }
    
    extractComments() {
      this.showStatus('Cannot extract comments - components not loaded');
    }
    
    autoLoadComments() {
      this.showStatus('Cannot auto-load comments - components not loaded');
    }
  }
  
  window.ExtractionManager = ExtractionManagerFallback;
}
