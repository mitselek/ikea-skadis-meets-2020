// 🚀 MODULAR POPUP SCRIPT - Main Initialization
// Uses modular components for better maintainability

// Initialize all managers
let prospectsManager;
let dashboardManager;
let messagingManager;
let extractionManager;
let statsManager;
let realAIAssistant;

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing SKÅDIS Outreach Extension...');
  
  // Initialize all modules
  try {
    prospectsManager = new ProspectsManager();
    dashboardManager = new DashboardManager();
    messagingManager = new MessagingManager();
    extractionManager = new ExtractionManager();
    statsManager = new StatsManager();
    
    // Initialize Real AI Assistant with error handling
    try {
      realAIAssistant = new RealAIAssistant();
      console.log('✅ RealAIAssistant initialized successfully');
    } catch (aiError) {
      console.warn('⚠️ RealAIAssistant failed to initialize:', aiError);
      realAIAssistant = null;
    }
    
    // Make realAIAssistant globally accessible for debugging
    window.realAIAssistant = realAIAssistant;
    
    console.log('✅ All modules initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing modules:', error);
  }
  
  // Load initial stats
  statsManager.loadStats();
  
  // Main button event listeners
  document.getElementById('extract-page').addEventListener('click', () => {
    extractionManager.extractCurrentPage();
  });
  
  document.getElementById('extract-comments').addEventListener('click', () => {
    extractionManager.extractComments();
  });
  
  document.getElementById('view-prospects').addEventListener('click', () => {
    prospectsManager.showProspectsView();
  });
  
  document.getElementById('send-template').addEventListener('click', () => {
    messagingManager.quickMessage();
  });
  
  document.getElementById('view-campaign').addEventListener('click', () => {
    dashboardManager.showDashboard();
  });
  
  document.getElementById('configure-ai').addEventListener('click', () => {
    showAIConfiguration();
  });
  
  document.getElementById('export-csv').addEventListener('click', () => {
    messagingManager.exportTrackingData();
  });

  // AI Configuration buttons
  document.getElementById('test-ai-connection').addEventListener('click', async () => {
    console.log('🔍 Test AI Connection clicked');
    
    const provider = document.getElementById('ai-provider').value;
    const apiKey = document.getElementById('ai-api-key').value;
    
    if (!provider || !apiKey) {
      showStatus('❌ Please select provider and enter API key', 'error');
      return;
    }
    
    showStatus('🔍 Testing connection...', 'warning');
    
    try {
      if (!realAIAssistant) {
        showStatus('❌ RealAIAssistant not available', 'error');
        return;
      }
      
      await realAIAssistant.configureProvider(provider, apiKey);
      const testResult = await realAIAssistant.testConnection();
      
      if (testResult.success) {
        showStatus(`✅ Connection successful with ${provider}!`, 'success');
        console.log('✅ AI connection test successful:', testResult);
      } else {
        showStatus(`❌ Connection failed: ${testResult.error}`, 'error');
        console.error('❌ AI connection test failed:', testResult);
      }
    } catch (error) {
      showStatus(`❌ Test failed: ${error.message}`, 'error');
      console.error('❌ AI connection test error:', error);
    }
  });
  
  document.getElementById('save-ai-config').addEventListener('click', async () => {
    console.log('💾 Save AI Config clicked');
    
    const provider = document.getElementById('ai-provider').value;
    const apiKey = document.getElementById('ai-api-key').value;
    
    if (!provider || !apiKey) {
      showStatus('❌ Please select provider and enter API key', 'error');
      return;
    }
    
    try {
      if (!realAIAssistant) {
        showStatus('❌ RealAIAssistant not available', 'error');
        return;
      }
      
      await realAIAssistant.configureProvider(provider, apiKey);
      showStatus('💾 Configuration saved successfully!', 'success');
      document.getElementById('ai-api-key').value = ''; // Clear for security
      console.log('✅ AI configuration saved successfully');
    } catch (error) {
      showStatus(`❌ Save failed: ${error.message}`, 'error');
      console.error('❌ AI configuration save error:', error);
    }
  });
  
  document.getElementById('disable-real-ai').addEventListener('click', async () => {
    console.log('❌ Disable Real AI clicked');
    
    try {
      if (!realAIAssistant) {
        showStatus('❌ RealAIAssistant not available', 'error');
        return;
      }
      
      await realAIAssistant.disable();
      showStatus('🔄 Real AI disabled - using template system', 'warning');
      document.getElementById('ai-provider').value = '';
      document.getElementById('ai-api-key').value = '';
      console.log('✅ Real AI disabled successfully');
    } catch (error) {
      showStatus(`❌ Disable failed: ${error.message}`, 'error');
      console.error('❌ AI disable error:', error);
    }
  });
  
  document.getElementById('close-ai-config').addEventListener('click', () => {
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
  });
  
  // Dashboard navigation
  const backToMainBtn = document.getElementById('back-to-main');
  if (backToMainBtn) {
    backToMainBtn.addEventListener('click', function() {
      document.getElementById('dashboard-view').classList.remove('active');
      document.getElementById('main-view').classList.remove('hidden');
    });
  }

  // Prospects view navigation
  const backToMainFromProspectsBtn = document.getElementById('back-to-main-from-prospects');
  if (backToMainFromProspectsBtn) {
    backToMainFromProspectsBtn.addEventListener('click', function() {
      document.getElementById('prospects-view').classList.remove('active');
      document.getElementById('main-view').classList.remove('hidden');
    });
  }

  // Set up custom event listeners for cross-module communication
  window.addEventListener('extractComments', () => {
    extractionManager.extractComments();
  });

  window.addEventListener('updateStats', () => {
    statsManager.updateStatsDisplay();
  });

  // Simulate response for testing (if button exists)
  const simulateBtn = document.getElementById('simulate-response');
  if (simulateBtn) {
    simulateBtn.addEventListener('click', async function() {
      const result = await chrome.storage.local.get(['outreachLog']);
      const outreachLog = result.outreachLog || [];
      
      if (outreachLog.length > 0) {
        // Pick a random recent message to simulate response
        const randomEntry = outreachLog[Math.floor(Math.random() * outreachLog.length)];
        const responseTypes = ['positive', 'interested', 'neutral', 'not_interested'];
        const randomResponse = responseTypes[Math.floor(Math.random() * responseTypes.length)];
        
        await statsManager.updateResponseRate(randomEntry.username, randomResponse);
        
        // Reload dashboard data
        await dashboardManager.loadDashboardData();
        
        showStatus(`✅ Simulated ${randomResponse} response from @${randomEntry.username}`, 'success');
      } else {
        showStatus('No messages to simulate responses for yet!', 'error');
      }
    });
  }
});

// Global functions for prospect actions (used by onclick handlers in HTML)
window.sendMessageToProspect = async function(username) {
  if (messagingManager && messagingManager.sendMessageToProspect) {
    await messagingManager.sendMessageToProspect(username);
  } else {
    console.error('MessagingManager not available');
  }
};

window.openProspectProfile = async function(profileUrl) {
  if (messagingManager && messagingManager.openProspectProfile) {
    await messagingManager.openProspectProfile(profileUrl);
  } else {
    console.error('MessagingManager not available');
  }
};

// Global stats update function
window.updateStatsDisplay = async function() {
  if (statsManager) {
    await statsManager.updateStatsDisplay();
  }
};

// 🤖 AI CONFIGURATION FUNCTIONS
function showAIConfiguration() {
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
  loadCurrentAIConfig();
}

// Make showAIConfiguration globally accessible
window.showAIConfiguration = showAIConfiguration;

async function loadCurrentAIConfig() {
  console.log('🔍 Loading current AI config...');
  
  try {
    const stored = await chrome.storage.local.get(['aiProvider', 'aiApiKey']);
    
    const providerSelect = document.getElementById('ai-provider');
    if (providerSelect && stored.aiProvider) {
      providerSelect.value = stored.aiProvider;
      console.log('✅ Loaded provider:', stored.aiProvider);
    }
    
    if (stored.aiProvider && stored.aiApiKey) {
      showStatus('✅ AI Assistant is configured and active', 'success');
    } else {
      showStatus('⚠️ AI Assistant not configured - using template system', 'warning');
    }
  } catch (error) {
    console.error('❌ Error loading AI config:', error);
    showStatus('❌ Error loading configuration', 'error');
  }
}

function showStatus(message, type) {
  const statusDiv = document.getElementById('ai-config-status');
  statusDiv.style.display = 'block';
  statusDiv.textContent = message;
  statusDiv.style.background = type === 'success' ? 'rgba(0,255,0,0.2)' : 
                              type === 'error' ? 'rgba(255,0,0,0.2)' : 
                              'rgba(255,255,0,0.2)';
}

// Global functions for prospect actions (used by onclick handlers in HTML)
window.sendMessageToProspect = async function(username) {
  if (messagingManager && messagingManager.sendMessageToProspect) {
    await messagingManager.sendMessageToProspect(username);
  } else {
    console.error('MessagingManager not available');
  }
};

window.openProspectProfile = async function(profileUrl) {
  if (messagingManager && messagingManager.openProspectProfile) {
    await messagingManager.openProspectProfile(profileUrl);
  } else {
    console.error('MessagingManager not available');
  }
};

// Global stats update function
window.updateStatsDisplay = async function() {
  if (statsManager) {
    await statsManager.updateStatsDisplay();
  }
};

// Global status display function
function showStatus(message, type) {
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

// 🔍 DEBUG FUNCTIONS - Remove after fixing
window.debugAI = function() {
  console.log('=== AI SYSTEM DIAGNOSTIC ===');
  console.log('1. AIMessagingManager:', typeof window.AIMessagingManager);
  console.log('2. MessagingManager:', typeof window.MessagingManager);
  console.log('3. messagingManager instance:', typeof window.messagingManager);

  if (window.messagingManager) {
    console.log('4. AI instance:', !!window.messagingManager.aiMessaging);
    console.log('5. AI type:', typeof window.messagingManager.aiMessaging);
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
    console.log('6. Cannot test - AIMessagingManager not available');
  }
};

window.testAIMessage = function() {
  console.log('🧪 Testing AI message generation...');
  
  const testProspect = {
    username: 'TestUser',
    text: 'These look great! What layer height and infill settings work best?',
    quality: 'High',
    source: 'https://makerworld.com/en/models/1503225-simple-skadis-hook'
  };
  
  if (window.messagingManager && window.messagingManager.aiMessaging) {
    try {
      const result = window.messagingManager.aiMessaging.generatePersonalizedMessage(testProspect);
      console.log('✅ AI Test Result:', result);
      return result;
    } catch (error) {
      console.log('❌ AI Test Failed:', error);
      return null;
    }
  } else {
    console.log('❌ AI system not available');
    return null;
  }
};

window.forceReinitializeAI = function() {
  console.log('🔧 Force re-initializing AI system...');
  
  if (window.messagingManager && window.AIMessagingManager) {
    try {
      window.messagingManager.aiMessaging = new window.AIMessagingManager();
      console.log('✅ AI system re-initialized successfully');
      return true;
    } catch (error) {
      console.log('❌ Re-initialization failed:', error);
      return false;
    }
  } else {
    console.log('❌ Required components not available');
    return false;
  }
};

// 🧪 DEBUG FUNCTIONS FOR TESTING
window.debugAIConfig = function() {
  console.log('🔍 Debugging AI Configuration...');
  
  // Test element existence
  const elements = {
    'ai-config-section': document.getElementById('ai-config-section'),
    'configure-ai': document.getElementById('configure-ai'),
    'test-ai-connection': document.getElementById('test-ai-connection'),
    'save-ai-config': document.getElementById('save-ai-config'),
    'ai-provider': document.getElementById('ai-provider'),
    'ai-api-key': document.getElementById('ai-api-key'),
    'main-view': document.querySelector('.main-view')
  };
  
  console.log('Element check:');
  Object.entries(elements).forEach(([name, element]) => {
    console.log(`  ${name}: ${element ? '✅ Found' : '❌ Missing'}`);
  });
  
  // Test RealAIAssistant
  console.log('\nRealAIAssistant check:');
  console.log(`  window.RealAIAssistant: ${window.RealAIAssistant ? '✅ Available' : '❌ Missing'}`);
  console.log(`  realAIAssistant instance: ${window.realAIAssistant ? '✅ Available' : '❌ Missing'}`);
  
  // Test opening config
  console.log('\nTesting showAIConfiguration...');
  try {
    showAIConfiguration();
    console.log('✅ showAIConfiguration called successfully');
    
    setTimeout(() => {
      const configSection = document.getElementById('ai-config-section');
      const mainView = document.querySelector('.main-view');
      console.log(`Config section visible: ${configSection && configSection.style.display !== 'none' ? '✅ Yes' : '❌ No'}`);
      console.log(`Main view hidden: ${mainView && mainView.style.display === 'none' ? '✅ Yes' : '❌ No'}`);
    }, 100);
  } catch (error) {
    console.error('❌ Error calling showAIConfiguration:', error);
  }
};

// 🧪 COMPREHENSIVE AI SYSTEM TEST FUNCTION
window.testAISystem = function() {
  console.log('🧪 Testing AI System Comprehensive...');
  
  // Test 1: Check if RealAIAssistant is available
  console.log('1. RealAIAssistant instance:', window.realAIAssistant ? '✅ Available' : '❌ Missing');
  
  // Test 2: Check configuration functions
  console.log('2. showAIConfiguration function:', typeof window.showAIConfiguration === 'function' ? '✅ Available' : '❌ Missing');
  console.log('3. testAIConnection function:', typeof window.testAIConnection === 'function' ? '✅ Available' : '❌ Missing');
  console.log('4. saveAIConfiguration function:', typeof window.saveAIConfiguration === 'function' ? '✅ Available' : '❌ Missing');
  
  // Test 3: Check UI elements
  const configSection = document.getElementById('ai-config-section');
  const configButton = document.getElementById('configure-ai');
  const providerSelect = document.getElementById('ai-provider');
  const apiKeyInput = document.getElementById('ai-api-key');
  
  console.log('5. AI Config Section:', configSection ? '✅ Present' : '❌ Missing');
  console.log('6. Configure AI Button:', configButton ? '✅ Present' : '❌ Missing');
  console.log('7. Provider Select:', providerSelect ? '✅ Present' : '❌ Missing');
  console.log('8. API Key Input:', apiKeyInput ? '✅ Present' : '❌ Missing');
  
  // Test 4: Try to access RealAIAssistant methods
  if (window.realAIAssistant) {
    console.log('9. RealAIAssistant methods:');
    console.log('   - isConfigured:', typeof realAIAssistant.isConfigured === 'function' ? '✅' : '❌');
    console.log('   - synthesizePersonalizedMessage:', typeof realAIAssistant.synthesizePersonalizedMessage === 'function' ? '✅' : '❌');
    console.log('   - testConnection:', typeof realAIAssistant.testConnection === 'function' ? '✅' : '❌');
  }
  
  // Test 5: Check storage access
  chrome.storage.local.get(['aiProvider', 'aiApiKey'], (result) => {
    console.log('10. Storage access:', result ? '✅ Working' : '❌ Failed');
    console.log('11. Stored AI Provider:', result.aiProvider || 'None');
    console.log('12. Stored API Key:', result.aiApiKey ? '✅ Present' : '❌ Missing');
  });
  
  return 'AI System test complete - check console for results!';
};

// 🔧 QUICK AI SETUP TEST
window.quickAITest = function() {
  console.log('🔧 Quick AI Setup Test...');
  
  // Show configuration panel
  if (typeof window.showAIConfiguration === 'function') {
    window.showAIConfiguration();
    console.log('✅ Configuration panel opened');
    return 'Configuration panel opened - you can now enter your API key!';
  } else {
    console.error('❌ showAIConfiguration function not available');
    return 'Error: Configuration function not available';
  }
};

console.log('🧪 AI Test functions loaded:');
console.log('   - testAISystem() - Comprehensive system test');
console.log('   - quickAITest() - Quick setup test');
