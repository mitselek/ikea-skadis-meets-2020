// dashboard-events.js
// Handles all dashboard event listeners and handlers

class DashboardEvents {
  static initializeEventHandlers(manager) {
    // Dashboard navigation
    document.getElementById('back-to-main')?.addEventListener('click', () => {
      document.getElementById('dashboard-view').classList.remove('active');
      document.getElementById('main-view').classList.remove('hidden');
    });
    // Simulate response for testing (if button exists)
    const simulateBtn = document.getElementById('simulate-response');
    if (simulateBtn) {
      simulateBtn.addEventListener('click', async () => {
        const result = await chrome.storage.local.get(['outreachLog']);
        const outreachLog = result.outreachLog || [];
        if (outreachLog.length > 0) {
          // Pick a random recent message to simulate response
          const randomEntry = outreachLog[Math.floor(Math.random() * outreachLog.length)];
          const responseTypes = ['positive', 'interested', 'neutral', 'not_interested'];
          const randomResponse = responseTypes[Math.floor(Math.random() * responseTypes.length)];
          if (window.updateResponseRate) {
            await window.updateResponseRate(randomEntry.username, randomResponse);
          }
          // Reload dashboard data
          await manager.loadDashboardData();
          DashboardUI.showStatus(`✅ Simulated ${randomResponse} response from @${randomEntry.username}`, 'success');
        } else {
          DashboardUI.showStatus('No messages to simulate responses for yet!', 'error');
        }
      });
    }
  }
}

window.DashboardEvents = DashboardEvents;
