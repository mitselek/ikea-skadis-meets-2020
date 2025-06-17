// 📈 DASHBOARD MANAGEMENT MODULE
// Handles all AI dashboard functionality

// Import submodules (assume global for browser extension)
// DashboardUI, DashboardAnalytics, DashboardEvents

class DashboardManager {
  constructor() {
    this.isLoaded = false;
  }

  // 📈 CAMPAIGN DASHBOARD - Enhanced UI Version
  async showDashboard() {
    try {
      // Switch to dashboard view
      document.getElementById('main-view').classList.add('hidden');
      document.getElementById('dashboard-view').classList.add('active');
      
      // Load dashboard data
      await this.loadDashboardData();
      
    } catch (error) {
      DashboardUI.showStatus('Error loading campaign dashboard: ' + error.message, 'error');
    }
  }

  // 🤖 AI-POWERED DASHBOARD INSIGHTS
  async loadDashboardData() {
    const result = await chrome.storage.local.get(['campaignStats', 'outreachLog', 'prospects', 'aiAnalytics']);
    const stats = result.campaignStats || {
      totalMessages: 0,
      messagesByMonth: {},
      templateUsage: {},
      qualityBreakdown: { High: 0, Medium: 0, Low: 0 },
      sourceProjects: {}
    };
    const log = result.outreachLog || [];
    const prospects = result.prospects || [];
    const aiAnalytics = result.aiAnalytics || [];

    // Calculate duplicate prevention stats
    const contactedUsernames = new Set(log.map(entry => entry.username.toLowerCase()));
    const uncontactedCount = prospects.filter(
      prospect => !contactedUsernames.has(prospect.username.toLowerCase())
    ).length;

    // Update performance metrics
    document.getElementById('total-messages').textContent = stats.totalMessages;
    const responseRate = stats.responseStats ? `${stats.responseStats.responseRate}%` : '0%';
    document.getElementById('response-rate-dash').textContent = responseRate;
    document.getElementById('uncontacted-count').textContent = uncontactedCount;
    
    // Calculate campaign days
    const campaignDays = log.length > 0 ? 
      Math.ceil((new Date() - new Date(log[0].date)) / (1000 * 60 * 60 * 24)) || 1 : 0;
    document.getElementById('campaign-days').textContent = campaignDays;

    // Generate AI insights (now includes AI messaging insights)
    DashboardAnalytics.generateAIInsights(stats, log, prospects, uncontactedCount, aiAnalytics);
    
    // Update quality breakdown
    DashboardUI.updateQualityBreakdown(stats.qualityBreakdown);
    
    // Update duplicate prevention stats
    DashboardUI.updateDuplicateStats(prospects.length, uncontactedCount);
    
    // Update recent activity
    DashboardUI.updateRecentActivity(log.slice(-5).reverse());
    
    // Update source projects
    DashboardUI.updateSourceProjects(stats.sourceProjects);

    // Update AI messaging analytics
    DashboardAnalytics.updateAIMessagingAnalytics(aiAnalytics);
  }
}

// Make it globally available
window.DashboardManager = DashboardManager;
