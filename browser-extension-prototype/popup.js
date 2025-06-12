// 🚀 MAIN POPUP SCRIPT - Refactored & Modular
// Clean initialization with modular components

class PopupManager {
  constructor() {
    this.managers = {};
    this.initialize();
  }

  async initialize() {
    console.log('🚀 Initializing SKÅDIS Outreach Extension...');
    
    try {
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
      
      // Initialize AI Configuration Manager
      this.managers.aiConfig = new AIConfigurationManager(this.managers.realAI);
      
      // Initialize Message Preview Manager
      this.managers.messagePreview = new MessagePreviewManager(this.managers.messaging);
      
      // Make managers globally accessible for debugging
      window.popupManager = this;
      window.realAIAssistant = this.managers.realAI;
      
      console.log('✅ All modules initialized successfully');
      
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
    // Main extraction buttons
    document.getElementById('extract-page')?.addEventListener('click', () => {
      this.managers.extraction.extractCurrentPage();
    });
    
    document.getElementById('extract-comments')?.addEventListener('click', () => {
      this.managers.extraction.extractComments();
    });
    
    // Main navigation buttons
    document.getElementById('view-prospects')?.addEventListener('click', () => {
      this.managers.prospects.showProspectsView();
    });
    
    document.getElementById('send-template')?.addEventListener('click', () => {
      this.managers.messagePreview.showMessagePreview();
    });
    
    document.getElementById('view-campaign')?.addEventListener('click', () => {
      this.managers.dashboard.showDashboard();
    });
    
    document.getElementById('configure-ai')?.addEventListener('click', () => {
      this.managers.aiConfig.showAIConfiguration();
    });
    
    document.getElementById('export-csv')?.addEventListener('click', () => {
      this.managers.messaging.exportTrackingData();
    });

    // Testing functionality
    const simulateBtn = document.getElementById('simulate-response');
    if (simulateBtn) {
      simulateBtn.addEventListener('click', async () => {
        await this.simulateResponse();
      });
    }
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.popupManager = new PopupManager();
});
