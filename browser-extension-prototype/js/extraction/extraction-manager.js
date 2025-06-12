// 🔍 EXTRACTION MANAGER MODULE
// Main manager class for handling comment extraction and page analysis functionality

class ExtractionManager {
  constructor() {
    this.init();
  }

  init() {
    // Set up any initial state if needed
  }

  // 🔍 EXTRACT CURRENT PAGE ANALYSIS
  async extractCurrentPage() {
    this.showStatus('Analyzing page...', 'info');
    
    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      
      if (!tab.url.includes('makerworld.com')) {
        this.showStatus('Please navigate to a MakerWorld page first!', 'error');
        return;
      }
      
      const results = await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: analyzePageFunction
      });
      
      const analysis = results[0].result;
      
      if (analysis.recommendation === 'HIGH PRIORITY') {
        this.showStatus(`✅ Great page! Relevance: ${analysis.relevance_score}, Engagement: ${analysis.total_engagement}`, 'success');
      } else if (analysis.recommendation === 'MEDIUM PRIORITY') {
        this.showStatus(`📊 Decent page. Relevance: ${analysis.relevance_score}, Engagement: ${analysis.total_engagement}`, 'info');
      } else {
        this.showStatus(`⚠️ Low priority page. Consider finding better prospects.`, 'error');
      }
      
    } catch (error) {
      this.showStatus('Error analyzing page: ' + error.message, 'error');
    }
  }

  // 💬 EXTRACT COMMENTS FROM PAGE
  async extractComments() {
    this.showStatus('Extracting comments...', 'info');
    
    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      
      if (!tab.url.includes('makerworld.com')) {
        this.showStatus('Please navigate to a MakerWorld page first!', 'error');
        return;
      }
      
      const results = await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: extractCommentsFunction
      });
      
      const comments = results[0].result;
      
      if (comments && comments.length > 0) {
        // Save prospects to storage
        const existing = await chrome.storage.local.get(['prospects']);
        const allProspects = [...(existing.prospects || []), ...comments];
        
        await chrome.storage.local.set({prospects: allProspects});
        
        this.showStatus(`✅ Found ${comments.length} quality commenters! Check prospects.`, 'success');
        
        // Trigger stats update
        if (window.updateStatsDisplay) {
          await window.updateStatsDisplay();
        }
      } else {
        this.showStatus('No comments found. Try scrolling down or loading more comments first.', 'error');
      }
      
    } catch (error) {
      this.showStatus('Error extracting comments: ' + error.message, 'error');
    }
  }

  // 📜 AUTO-LOAD ALL COMMENTS - Uses modularized components
  async autoLoadComments() {
    this.showStatus('Auto-loading all comments...', 'info');
    
    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      
      if (!tab.url.includes('makerworld.com')) {
        this.showStatus('Please navigate to a MakerWorld page first!', 'error');
        return;
      }
      
      // Add a small delay before script execution to ensure page is fully loaded
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add timeout protection for script execution
      const scriptExecutionPromise = chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: safeAutoLoadCommentsFunction,
        // Use world: "MAIN" to ensure script has full access to page context
        world: "MAIN"
      });
      
      // Create a timeout promise
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            timeoutError: true,
            result: [{
              result: {
                success: false,
                message: 'Operation timed out after 30 seconds',
                commentsFound: 0
              }
            }]
          });
        }, 30000); // 30 seconds timeout
      });
      
      // Race between script execution and timeout
      const results = await Promise.race([
        scriptExecutionPromise,
        timeoutPromise
      ]);
      
      // Check if we hit the timeout
      if (results.timeoutError) {
        console.warn('Auto-loading comments timed out');
        this.showStatus('Auto-loading comments timed out. Try scrolling manually.', 'error');
        return;
      }
      
      if (results && results[0]) {
        // Check if we have a valid result
        const loadResult = results[0].result;
        
        if (loadResult && loadResult.success) {
          this.showStatus(`✅ Loaded ${loadResult.commentsFound} comments!`, 'success');
          // Add a small delay before extracting comments
          await new Promise(resolve => setTimeout(resolve, 500));
          // Automatically extract comments after loading
          await this.extractComments();
        } else {
          // Handle case where we have a result but it wasn't successful
          const errorMsg = loadResult && loadResult.message ? loadResult.message : 'Unknown error';
          this.showStatus(`⚠️ ${errorMsg}`, 'error');
          console.error('Comment loading failed:', loadResult);
        }
      } else {
        // Handle case where we don't have a valid result at all
        this.showStatus('Error auto-loading comments - no result returned', 'error');
        console.error('No results from executeScript:', results);
      }
      
    } catch (error) {
      console.error('Exception during auto-loading comments:', error);
      // Try to get a useful error message
      let errorMessage = 'Error auto-loading comments';
      
      if (error && error.message) {
        errorMessage += ': ' + error.message;
      } else if (error && typeof error === 'object') {
        errorMessage += ': ' + JSON.stringify(error);
      } else if (error) {
        errorMessage += ': ' + error.toString();
      }
      
      this.showStatus(errorMessage, 'error');
    }
  }

  showStatus(message, type) {
    // Find the status element
    const statusEl = document.getElementById('status-message');
    if (statusEl) {
      // Clear any existing timeout to prevent issues
      if (this._statusTimeout) {
        clearTimeout(this._statusTimeout);
      }
      
      // Update the status message
      statusEl.textContent = message;
      statusEl.className = type || 'info';
      
      // Set timeout to clear the message after 5 seconds
      this._statusTimeout = setTimeout(() => {
        if (statusEl) {
          statusEl.textContent = '';
          statusEl.className = '';
        }
        this._statusTimeout = null;
      }, 5000);
      
      // Also log to console for debugging
      const logMethod = type === 'error' ? console.error : console.log;
      logMethod(`Status: ${message}`);
    } else {
      // Log even if status element is not available
      console.log(`Status update (no element): ${message}`);
    }
  }
}

// Export for use in main popup.js
window.ExtractionManager = ExtractionManager;
