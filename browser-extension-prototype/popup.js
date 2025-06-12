// 🚀 MAIN POPUP SCRIPT - Refactored & Modular
// Clean initialization with modular components

// Ensure NavigationManager is loaded before PopupManager
(function ensureAllDependenciesLoaded() {
  // Make sure document is fully loaded and all elements are rendered
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAfterLoad);
  } else {
    // Small delay to ensure scripts have finished loading completely
    setTimeout(initAfterLoad, 100);
  }
  
  function initAfterLoad() {
    // Check that all required manager classes are available
    const requiredClasses = [
      'NavigationManager', 
      'MessagePreviewManager', 
      'AIConfigurationManager'
    ];
    
    const missingClasses = requiredClasses.filter(
      className => typeof window[className] === 'undefined'
    );
    
    if (missingClasses.length > 0) {
      console.warn(`⚠️ Missing required classes: ${missingClasses.join(', ')}`);
      
      // Load all missing scripts sequentially with proper error handling
      loadMissingScripts(missingClasses, 0, initializePopupManager);
    } else {
      console.log('✅ All required classes available');
      initializePopupManager();
    }
  }
  
  function loadMissingScripts(classNames, index, callback) {
    if (index >= classNames.length) {
      callback();
      return;
    }
    
    const className = classNames[index];
    const scriptSrc = `js/${className.replace(/Manager$/, '').toLowerCase()}-${className.includes('AI') ? 'configuration' : 'preview'}.js`;
    
    console.log(`📂 Loading missing script: ${scriptSrc}`);
    
    const script = document.createElement('script');
    script.src = scriptSrc;
    
    script.onload = () => {
      console.log(`✅ Loaded ${scriptSrc} successfully`);
      loadMissingScripts(classNames, index + 1, callback);
    };
    
    script.onerror = (error) => {
      console.error(`❌ Failed to load ${scriptSrc}:`, error);
      loadMissingScripts(classNames, index + 1, callback);
    };
    
    document.head.appendChild(script);
  }
})();

function initializePopupManager() {
  // Create manager immediately instead of waiting for a second DOMContentLoaded event
  window.popupManager = new PopupManager();
}

class PopupManager {
  constructor() {
    this.managers = {};
    this.initialize();
  }

  async initialize() {
    console.log('🚀 Initializing SKÅDIS Outreach Extension...');
    
    try {
      // Ensure DOM is fully loaded before proceeding
      if (document.readyState !== 'complete') {
        console.log('⏳ Waiting for DOM to fully load...');
        await new Promise(resolve => {
          window.addEventListener('load', resolve, { once: true });
        });
      }
      
      console.log('🏁 DOM fully loaded, initializing managers...');
      
      // Initialize core managers
      this.managers.prospects = new ProspectsManager();
      this.managers.dashboard = new DashboardManager();
      this.managers.messaging = new MessagingManager();
      this.managers.extraction = new ExtractionManager();
      this.managers.stats = new StatsManager();
      this.managers.navigation = new NavigationManager();
      
      // Initialize Real AI Assistant with error handling
      try {
        this.managers.realAI = new RealAIAssistant();
        console.log('✅ RealAIAssistant initialized successfully');
      } catch (aiError) {
        console.warn('⚠️ RealAIAssistant failed to initialize:', aiError);
        this.managers.realAI = null;
      }
      
      // Initialize AI Configuration Manager with better error handling
      try {
        // Ensure global window object is used and that AIConfigurationManager exists
        if (typeof window.AIConfigurationManager === 'function') {
          this.managers.aiConfig = new window.AIConfigurationManager(this.managers.realAI);
          console.log('✅ AIConfigurationManager initialized successfully');
        } else {
          // Graceful handling for when the class might be available but not defined as expected
          console.warn('⚠️ AIConfigurationManager not found or not a constructor function');
          
          // Check if we need to wait for scripts to fully initialize
          let retryCount = 0;
          const maxRetries = 3;
          
          while (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (typeof window.AIConfigurationManager === 'function') {
              this.managers.aiConfig = new window.AIConfigurationManager(this.managers.realAI);
              console.log(`✅ AIConfigurationManager initialized successfully after ${retryCount + 1} retry`);
              break;
            }
            
            retryCount++;
            console.log(`⏳ Waiting for AIConfigurationManager to be available (retry ${retryCount}/${maxRetries})`);
          }
          
          // If still not available, create a dummy manager with basic functionality
          if (retryCount >= maxRetries) {
            console.warn('⚠️ Could not initialize AIConfigurationManager after retries, using fallback');
            this.managers.aiConfig = {
              showAIConfiguration: () => {
                this.showStatus('AI Configuration not available', 'error');
              },
              showStatus: (msg, type) => this.showStatus(msg, type)
            };
          }
        }
      } catch (configError) {
        console.warn('⚠️ AIConfigurationManager failed to initialize:', configError);
        this.managers.aiConfig = {
          showAIConfiguration: () => {
            this.showStatus('AI Configuration not available', 'error');
          },
          showStatus: (msg, type) => this.showStatus(msg, type)
        };
      }
      
      // Initialize Message Preview Manager with better error handling
      try {
        // Use the global window object explicitly to access the class
        if (typeof window.MessagePreviewManager === 'function') {
          this.managers.messagePreview = new window.MessagePreviewManager(this.managers.messaging);
          console.log('✅ MessagePreviewManager initialized successfully');
        } else {
          console.warn('⚠️ MessagePreviewManager not found or not a constructor function');
          
          // Allow time for scripts to initialize fully
          let retryCount = 0;
          const maxRetries = 3;
          
          while (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (typeof window.MessagePreviewManager === 'function') {
              this.managers.messagePreview = new window.MessagePreviewManager(this.managers.messaging);
              console.log(`✅ MessagePreviewManager initialized successfully after ${retryCount + 1} retry`);
              break;
            }
            
            retryCount++;
            console.log(`⏳ Waiting for MessagePreviewManager to be available (retry ${retryCount}/${maxRetries})`);
          }
          
          // If still not available, create a dummy manager with basic functionality
          if (retryCount >= maxRetries) {
            console.warn('⚠️ Could not initialize MessagePreviewManager after retries, using fallback');
            this.managers.messagePreview = {
              showMessagePreview: () => {
                this.showStatus('Message preview functionality is not available', 'error');
              },
              showStatus: (msg, type) => this.showStatus(msg, type)
            };
          }
        }
      } catch (previewError) {
        console.warn('⚠️ MessagePreviewManager failed to initialize:', previewError);
        this.managers.messagePreview = {
          showMessagePreview: () => {
            this.showStatus('Message preview functionality is not available', 'error');
          },
          showStatus: (msg, type) => this.showStatus(msg, type)
        };
      }
      
      // Make managers globally accessible for debugging
      window.popupManager = this;
      window.realAIAssistant = this.managers.realAI;
      
      console.log('✅ All modules initialized successfully');
      
      // Add a small delay to ensure the DOM has fully processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Load initial stats
      this.managers.stats.loadStats();
      
      // Set up main button event listeners
      this.setupMainEventListeners();
      
      // Set up testing functionality
      this.setupTestingFunctions();
      
    } catch (error) {
      console.error('❌ Error initializing modules:', error);
      this.showStatus('❌ Extension initialization failed', 'error');
    }
  }

  setupMainEventListeners() {
    console.log('🔄 Setting up button event listeners...');
    
    // Helper function to safely add click listeners to buttons
    const addButtonListener = (id, handler) => {
      const button = document.getElementById(id);
      if (button) {
        console.log(`📌 Adding listener for ${id}`);
        // Remove any existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add event listener with both click and mousedown for reliability
        newButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handler.call(this);
        }, { capture: true });
        
        // Add a visual feedback for clicks
        newButton.addEventListener('mousedown', () => {
          newButton.style.transform = 'scale(0.95)';
        });
        
        newButton.addEventListener('mouseup', () => {
          newButton.style.transform = 'scale(1)';
        });
        
        newButton.addEventListener('mouseleave', () => {
          newButton.style.transform = 'scale(1)';
        });
      } else {
        console.warn(`⚠️ Button '${id}' not found`);
      }
    };
    
    // Main extraction buttons
    addButtonListener('extract-page', () => {
      if (this.managers.extraction) {
        this.managers.extraction.extractCurrentPage();
      } else {
        this.showStatus('Extraction manager not available', 'error');
      }
    });
    
    addButtonListener('auto-load-comments', async () => {
      if (this.managers.extraction) {
        try {
          // Check if we're on a MakerWorld page first
          const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
          if (!tab.url.includes('makerworld.com')) {
            this.showStatus('Please navigate to a MakerWorld page first!', 'error');
            return;
          }
          
          // Provide feedback that process is starting
          this.showStatus('Starting auto-loading comments, this may take a moment...', 'info');
          
          // Call the auto-load comments function
          await this.managers.extraction.autoLoadComments();
        } catch (error) {
          console.error('Error in auto-load comments:', error);
          this.showStatus('Error auto-loading comments: ' + (error.message || 'Unknown error'), 'error');
        }
      } else {
        this.showStatus('Extraction manager not available', 'error');
      }
    });
    
    addButtonListener('extract-comments', () => {
      if (this.managers.extraction) {
        this.managers.extraction.extractComments();
      } else {
        this.showStatus('Extraction manager not available', 'error');
      }
    });
    
    // Main navigation buttons
    addButtonListener('view-prospects', () => {
      if (this.managers.prospects) {
        this.managers.prospects.showProspectsView();
      } else {
        this.showStatus('Prospects manager not available', 'error');
      }
    });
    
    addButtonListener('send-template', () => {
      if (this.managers.messagePreview) {
        this.managers.messagePreview.showMessagePreview();
      } else {
        this.showStatus('Message preview not available', 'error');
      }
    });
    
    addButtonListener('view-campaign', () => {
      if (this.managers.dashboard) {
        this.managers.dashboard.showDashboard();
      } else {
        this.showStatus('Dashboard not available', 'error');
      }
    });
    
    addButtonListener('configure-ai', () => {
      if (this.managers.aiConfig && this.managers.aiConfig.showAIConfiguration) {
        this.managers.aiConfig.showAIConfiguration();
      } else {
        this.showStatus('AI configuration not available', 'error');
      }
    });
    
    addButtonListener('export-csv', () => {
      if (this.managers.messaging) {
        this.managers.messaging.exportTrackingData();
      } else {
        this.showStatus('Messaging manager not available', 'error');
      }
    });

    // Testing functionality
    addButtonListener('simulate-response', async () => {
      await this.simulateResponse();
    });
  }

  async simulateResponse() {
    try {
      const result = await chrome.storage.local.get(['outreachLog']);
      const outreachLog = result.outreachLog || [];
      
      if (outreachLog.length > 0) {
        const randomEntry = outreachLog[Math.floor(Math.random() * outreachLog.length)];
        const responseTypes = ['positive', 'interested', 'neutral', 'not_interested'];
        const randomResponse = responseTypes[Math.floor(Math.random() * responseTypes.length)];
        
        await this.managers.stats.updateResponseRate(randomEntry.username, randomResponse);
        await this.managers.dashboard.loadDashboardData();
        
        this.showStatus(`✅ Simulated ${randomResponse} response from @${randomEntry.username}`, 'success');
      } else {
        this.showStatus('No messages to simulate responses for yet!', 'error');
      }
    } catch (error) {
      this.showStatus('Error simulating response: ' + error.message, 'error');
    }
  }

  setupTestingFunctions() {
    // Global functions for prospect actions (used by onclick handlers in HTML)
    window.sendMessageToProspect = async (username) => {
      if (this.managers.messaging && this.managers.messaging.sendMessageToProspect) {
        await this.managers.messaging.sendMessageToProspect(username);
      } else {
        console.error('MessagingManager not available');
      }
    };

    window.openProspectProfile = async (profileUrl) => {
      if (this.managers.messaging && this.managers.messaging.openProspectProfile) {
        await this.managers.messaging.openProspectProfile(profileUrl);
      } else {
        console.error('MessagingManager not available');
      }
    };

    // Global stats update function
    window.updateStatsDisplay = async () => {
      if (this.managers.stats) {
        await this.managers.stats.updateStatsDisplay();
      }
    };

    // AI testing functions
    window.quickAITest = () => {
      console.log('🔧 Quick AI Setup Test...');
      
      if (this.managers.aiConfig && typeof this.managers.aiConfig.showAIConfiguration === 'function') {
        this.managers.aiConfig.showAIConfiguration();
        console.log('✅ Configuration panel opened');
        return 'Configuration panel opened - you can now enter your API key!';
      } else {
        console.error('❌ AI Configuration not available');
        return 'Error: AI Configuration not available';
      }
    };

    // System prompt testing
    window.testSystemPrompt = async () => {
      console.log('🧪 Testing System Prompt...');
      
      if (!this.managers.messaging) {
        return 'MessagingManager not available';
      }

      const systemPrompt = this.managers.messaging.getSystemPrompt();
      console.log('Current system prompt:', systemPrompt);
      
      return 'System prompt test complete - check console for details';
    };

    // Debug functions
    window.debugAI = () => {
      console.log('=== AI SYSTEM DIAGNOSTIC ===');
      console.log('1. AIMessagingManager:', typeof window.AIMessagingManager);
      console.log('2. MessagingManager:', typeof window.MessagingManager);
      console.log('3. messagingManager instance:', typeof this.managers.messaging);

      if (this.managers.messaging) {
        console.log('4. AI instance:', !!this.managers.messaging.aiMessaging);
        console.log('5. AI type:', typeof this.managers.messaging.aiMessaging);
      }

      // Test manual creation
      if (window.AIMessagingManager) {
        try {
          const testAI = new window.AIMessagingManager();
          console.log('6. Manual AI creation: SUCCESS');
          console.log('7. AI templates available:', Object.keys(testAI.messageTemplates));
        } catch (error) {
          console.log('6. Manual AI creation: FAILED', error);
        }
      } else {
        console.log('6. AIMessagingManager class not available');
      }
    };

    console.log('🧪 AI Test functions loaded:');
    console.log('   - testAISystem() - Comprehensive system test');
    console.log('   - quickAITest() - Quick setup test');
  }

  showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.className = type;
      
      setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = '';
      }, 5000);
    }
  }

  // Utility methods for manager access
  getManager(name) {
    return this.managers[name];
  }

  getAllManagers() {
    return this.managers;
  }
}
