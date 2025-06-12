// 📊 STATS MANAGER MODULE
// Handles statistics display and updates

class StatsManager {
  constructor() {
    this.init();
  }

  init() {
    // Set up any initial state if needed
  }

  // 📊 UPDATE MAIN STATS DISPLAY
  async updateStatsDisplay() {
    try {
      const result = await chrome.storage.local.get(['prospects', 'campaignStats', 'outreachLog']);
      const prospects = result.prospects || [];
      const stats = result.campaignStats || { totalMessages: 0 };
      const outreachLog = result.outreachLog || [];
      
      // Calculate uncontacted prospects
      const contactedUsernames = new Set(
        outreachLog.map(entry => entry.username.toLowerCase())
      );
      const uncontactedCount = prospects.filter(
        prospect => !contactedUsernames.has(prospect.username.toLowerCase())
      ).length;
      
      // Update display with uncontacted/total format
      const prospectsCountEl = document.getElementById('prospects-count');
      if (prospectsCountEl) {
        prospectsCountEl.textContent = `${uncontactedCount}/${prospects.length}`;
      }
      
      const messagesSentEl = document.getElementById('messages-sent');
      if (messagesSentEl) {
        messagesSentEl.textContent = stats.totalMessages;
      }
      
      // Calculate response rate from actual data
      const responseRate = stats.responseStats ? `${stats.responseStats.responseRate}%` : '0%';
      const responseRateEl = document.getElementById('response-rate');
      if (responseRateEl) {
        responseRateEl.textContent = responseRate;
      }
      
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }

  // 📈 LOAD INITIAL STATS
  async loadStats() {
    await this.updateStatsDisplay();
  }

  // 📈 RESPONSE RATE TRACKING
  async updateResponseRate(username, responseType) {
    try {
      const result = await chrome.storage.local.get(['campaignStats', 'outreachLog']);
      let stats = result.campaignStats || {
        totalMessages: 0,
        messagesByMonth: {},
        templateUsage: {},
        qualityBreakdown: { High: 0, Medium: 0, Low: 0 },
        sourceProjects: {},
        responseStats: {
          totalResponses: 0,
          positiveResponses: 0,
          neutralResponses: 0,
          negativeResponses: 0,
          responseRate: 0,
          positiveRate: 0
        }
      };
      
      const outreachLog = result.outreachLog || [];
      
      // Find the log entry and update it
      const logEntry = outreachLog.find(entry => entry.username.toLowerCase() === username.toLowerCase());
      if (logEntry) {
        logEntry.responseStatus = responseType;
        logEntry.responseDate = new Date().toISOString();
        logEntry.responseType = responseType;
      }
      
      // Update response statistics
      if (!stats.responseStats) {
        stats.responseStats = {
          totalResponses: 0,
          positiveResponses: 0,
          neutralResponses: 0,
          negativeResponses: 0,
          responseRate: 0,
          positiveRate: 0
        };
      }
      
      stats.responseStats.totalResponses++;
      
      switch (responseType) {
        case 'positive':
        case 'interested':
          stats.responseStats.positiveResponses++;
          break;
        case 'neutral':
          stats.responseStats.neutralResponses++;
          break;
        case 'not_interested':
        case 'negative':
          stats.responseStats.negativeResponses++;
          break;
      }
      
      // Recalculate rates
      await this.updateCampaignResponseStats();
      
      // Save updated data
      await chrome.storage.local.set({
        campaignStats: stats,
        outreachLog: outreachLog
      });
      
      console.log(`✅ Response recorded: ${username} - ${responseType}`);
      
    } catch (error) {
      console.error('❌ Error updating response rate:', error);
    }
  }

  async updateCampaignResponseStats() {
    try {
      const result = await chrome.storage.local.get(['campaignStats', 'outreachLog']);
      let stats = result.campaignStats || {};
      const outreachLog = result.outreachLog || [];
      
      // Count responses from outreach log
      const responses = outreachLog.filter(entry => entry.responseStatus && entry.responseStatus !== 'Sent');
      const positiveResponses = responses.filter(entry => 
        entry.responseType === 'positive' || entry.responseType === 'interested'
      );
      
      // Calculate rates
      const totalMessages = stats.totalMessages || 0;
      const responseRate = totalMessages > 0 ? (responses.length / totalMessages * 100).toFixed(1) : 0;
      const positiveRate = responses.length > 0 ? (positiveResponses.length / responses.length * 100).toFixed(1) : 0;
      
      // Update stats
      if (!stats.responseStats) {
        stats.responseStats = {};
      }
      
      stats.responseStats.totalResponses = responses.length;
      stats.responseStats.positiveResponses = positiveResponses.length;
      stats.responseStats.responseRate = responseRate;
      stats.responseStats.positiveRate = positiveRate;
      
      // Save updated stats
      await chrome.storage.local.set({ campaignStats: stats });
      
      console.log(`📊 Response stats updated: ${responseRate}% response rate, ${positiveRate}% positive`);
      
    } catch (error) {
      console.error('❌ Error updating campaign response stats:', error);
    }
  }
}

// Export for use in main popup.js
window.StatsManager = StatsManager;
