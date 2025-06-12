// 🚀 MODULAR POPUP SCRIPT - Main Initialization
// Uses modular components for better maintainability

// Initialize all managers
let prospectsManager;
let dashboardManager;
let messagingManager;
let extractionManager;
let statsManager;

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing SKÅDIS Outreach Extension...');
  
  // Initialize all modules
  try {
    prospectsManager = new ProspectsManager();
    dashboardManager = new DashboardManager();
    messagingManager = new MessagingManager();
    extractionManager = new ExtractionManager();
    statsManager = new StatsManager();
    
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
  
  document.getElementById('export-csv').addEventListener('click', () => {
    messagingManager.exportTrackingData();
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
