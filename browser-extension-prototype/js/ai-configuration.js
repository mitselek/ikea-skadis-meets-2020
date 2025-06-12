// 🤖 AI CONFIGURATION MODULE
// Handles all AI configuration UI and functionality

class AIConfigurationManager {
  constructor(realAIAssistant) {
    this.realAIAssistant = realAIAssistant;
    this.initializeEventHandlers();
  }

  initializeEventHandlers() {
    // Test AI Connection
    document.getElementById('test-ai-connection')?.addEventListener('click', async () => {
      await this.testAIConnection();
    });

    // Save AI Configuration  
    document.getElementById('save-ai-config')?.addEventListener('click', async () => {
      await this.saveAIConfiguration();
    });

    // Disable Real AI
    document.getElementById('disable-real-ai')?.addEventListener('click', async () => {
      await this.disableRealAI();
    });

    // Close AI Config
    document.getElementById('close-ai-config')?.addEventListener('click', () => {
      this.closeAIConfiguration();
    });

    // Configure AI
    document.getElementById('configure-ai')?.addEventListener('click', () => {
      this.showAIConfiguration();
    });
  }

  async testAIConnection() {
    console.log('🔍 Test AI Connection clicked');
    
    const provider = document.getElementById('ai-provider').value;
    const apiKey = document.getElementById('ai-api-key').value;
    
    if (!provider || !apiKey) {
      this.showStatus('❌ Please select provider and enter API key', 'error');
      return;
    }

    this.showStatus('🔍 Testing connection...', 'warning');
    
    try {
      if (!this.realAIAssistant) {
        this.showStatus('❌ RealAIAssistant not available', 'error');
        return;
      }
      
      await this.realAIAssistant.configureProvider(provider, apiKey);
      const testResult = await this.realAIAssistant.testConnection();
      
      if (testResult.success) {
        this.showStatus(`✅ Connection successful with ${provider}!`, 'success');
        console.log('✅ AI connection test successful:', testResult);
      } else {
        this.showStatus(`❌ Connection failed: ${testResult.error}`, 'error');
        console.error('❌ AI connection test failed:', testResult);
      }
    } catch (error) {
      this.showStatus(`❌ Test failed: ${error.message}`, 'error');
      console.error('❌ AI connection test error:', error);
    }
  }

  async saveAIConfiguration() {
    console.log('💾 Save AI Config clicked');
    
    const provider = document.getElementById('ai-provider').value;
    const apiKey = document.getElementById('ai-api-key').value;
    
    if (!provider || !apiKey) {
      this.showStatus('❌ Please select provider and enter API key', 'error');
      return;
    }
    
    try {
      if (!this.realAIAssistant) {
        this.showStatus('❌ RealAIAssistant not available', 'error');
        return;
      }
      
      await this.realAIAssistant.configureProvider(provider, apiKey);
      this.showStatus('💾 Configuration saved successfully!', 'success');
      document.getElementById('ai-api-key').value = ''; // Clear for security
      console.log('✅ AI configuration saved successfully');
    } catch (error) {
      this.showStatus(`❌ Save failed: ${error.message}`, 'error');
      console.error('❌ AI configuration save error:', error);
    }
  }

  async disableRealAI() {
    console.log('❌ Disable Real AI clicked');
    
    try {
      if (!this.realAIAssistant) {
        this.showStatus('❌ RealAIAssistant not available', 'error');
        return;
      }
      
      await this.realAIAssistant.disable();
      this.showStatus('🔄 Real AI disabled - using template system', 'warning');
      document.getElementById('ai-provider').value = '';
      document.getElementById('ai-api-key').value = '';
      console.log('✅ Real AI disabled successfully');
    } catch (error) {
      this.showStatus(`❌ Disable failed: ${error.message}`, 'error');
      console.error('❌ AI disable error:', error);
    }
  }

  showAIConfiguration() {
    console.log('🔍 showAIConfiguration called');
    
    const configSection = document.getElementById('ai-config-section');
    const mainView = document.querySelector('.main-view');
    
    if (!configSection) {
      console.error('❌ ai-config-section element not found');
      return;
    }
    
    if (!mainView) {
      console.error('❌ main-view element not found');
      return;
    }
    
    // Show config section and hide main view
    configSection.style.display = 'block';
    mainView.style.display = 'none';
    
    console.log('✅ AI Configuration UI shown');
    
    // Load current configuration
    this.loadCurrentAIConfig();
  }

  closeAIConfiguration() {
    console.log('✖️ Close AI Config clicked');
    
    const configSection = document.getElementById('ai-config-section');
    const mainView = document.querySelector('.main-view');
    
    if (configSection) {
      configSection.style.display = 'none';
    }
    
    if (mainView) {
      mainView.style.display = 'block';
    }
    
    console.log('✅ AI configuration panel closed');
  }

  async loadCurrentAIConfig() {
    try {
      const result = await chrome.storage.local.get(['aiProvider', 'hasValidAPIKey']);
      
      if (result.aiProvider) {
        document.getElementById('ai-provider').value = result.aiProvider;
      }
      
      if (result.hasValidAPIKey) {
        document.getElementById('ai-api-key').placeholder = 'API key configured ✓';
      }
      
      console.log('✅ Current AI config loaded');
    } catch (error) {
      console.error('❌ Error loading AI config:', error);
    }
  }

  showStatus(message, type) {
    const statusDiv = document.getElementById('ai-config-status');
    if (statusDiv) {
      statusDiv.style.display = 'block';
      statusDiv.textContent = message;
      statusDiv.style.background = type === 'success' ? 'rgba(0,255,0,0.2)' : 
                                  type === 'error' ? 'rgba(255,0,0,0.2)' : 
                                  'rgba(255,255,0,0.2)';
    }

    // Also update main status
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
}

// Make it globally available
window.AIConfigurationManager = AIConfigurationManager;
