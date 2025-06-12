// 🧭 NAVIGATION MODULE
// Handles all view navigation and routing functionality

class NavigationManager {
  constructor() {
    this.initializeEventHandlers();
  }

  initializeEventHandlers() {
    // Dashboard navigation
    const backToMainBtn = document.getElementById('back-to-main');
    if (backToMainBtn) {
      backToMainBtn.addEventListener('click', () => {
        this.navigateToMain('dashboard-view');
      });
    }

    // Prospects view navigation
    const backToMainFromProspectsBtn = document.getElementById('back-to-main-from-prospects');
    if (backToMainFromProspectsBtn) {
      backToMainFromProspectsBtn.addEventListener('click', () => {
        this.navigateToMain('prospects-view');
      });
    }

    // Set up custom event listeners for cross-module communication
    window.addEventListener('extractComments', () => {
      if (window.extractionManager) {
        window.extractionManager.extractComments();
      }
    });

    window.addEventListener('updateStats', () => {
      if (window.statsManager) {
        window.statsManager.updateStatsDisplay();
      }
    });
  }

  navigateToMain(fromView) {
    const fromElement = document.getElementById(fromView);
    const mainElement = document.getElementById('main-view');
    
    if (fromElement) {
      fromElement.classList.remove('active');
    }
    
    if (mainElement) {
      mainElement.classList.remove('hidden');
    }
    
    console.log(`✅ Navigated from ${fromView} to main view`);
  }

  navigateTo(toView, fromView = 'main-view') {
    const fromElement = document.getElementById(fromView);
    const toElement = document.getElementById(toView);
    
    if (fromElement) {
      fromElement.classList.add('hidden');
    }
    
    if (toElement) {
      toElement.classList.add('active');
    }
    
    console.log(`✅ Navigated from ${fromView} to ${toView}`);
  }

  hideView(viewId) {
    const element = document.getElementById(viewId);
    if (element) {
      element.classList.remove('active');
      element.classList.add('hidden');
    }
  }

  showView(viewId) {
    const element = document.getElementById(viewId);
    if (element) {
      element.classList.add('active');
      element.classList.remove('hidden');
    }
  }
}

// Make it globally available
window.NavigationManager = NavigationManager;
