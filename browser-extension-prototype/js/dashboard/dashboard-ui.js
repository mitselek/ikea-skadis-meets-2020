// dashboard-ui.js
// Handles all dashboard UI rendering and DOM manipulation

class DashboardUI {
  static updateQualityBreakdown(breakdown) {
    const total = breakdown.High + breakdown.Medium + breakdown.Low;
    const container = document.getElementById('quality-breakdown');
    if (total === 0) {
      container.innerHTML = '<p style="opacity: 0.7; font-size: 12px;">No quality data yet - send some messages!</p>';
      return;
    }
    container.innerHTML = `
      <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>High Quality</span>
          <span class="quality-high">${breakdown.High} (${(breakdown.High/total*100).toFixed(1)}%)</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${breakdown.High/total*100}%; background: #4CAF50;"></div>
        </div>
      </div>
      <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Medium Quality</span>
          <span class="quality-medium">${breakdown.Medium} (${(breakdown.Medium/total*100).toFixed(1)}%)</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${breakdown.Medium/total*100}%; background: #FF9800;"></div>
        </div>
      </div>
      <div style="margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Low Quality</span>
          <span class="quality-low">${breakdown.Low} (${(breakdown.Low/total*100).toFixed(1)}%)</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${breakdown.Low/total*100}%; background: #F44336;"></div>
        </div>
      </div>
    `;
  }

  static updateDuplicateStats(totalProspects, uncontacted) {
    const contacted = totalProspects - uncontacted;
    const container = document.getElementById('duplicate-stats');
    container.innerHTML = `
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-value">${totalProspects}</div>
          <div class="metric-label">Total Found</div>
        </div>
        <div class="metric-card">
          <div class="metric-value" style="color: #F44336;">${contacted}</div>
          <div class="metric-label">Already Contacted</div>
        </div>
      </div>
      <div style="margin-top: 10px; padding: 8px; background: rgba(76, 175, 80, 0.2); border-radius: 4px; font-size: 12px;">
        🛡️ Duplicate prevention: ${contacted > 0 ? 'ACTIVE' : 'Ready'} - Never contact the same user twice!
      </div>
    `;
  }

  static updateRecentActivity(recentLog) {
    const container = document.getElementById('recent-activity');
    if (recentLog.length === 0) {
      container.innerHTML = '<p style="opacity: 0.7; font-size: 12px;">No recent activity</p>';
      return;
    }
    container.innerHTML = recentLog.map((entry, i) => `
      <div class="activity-item">
        <span>@${entry.username}</span>
        <span class="quality-${entry.prospectQuality.toLowerCase()}">${entry.prospectQuality}</span>
        <span>${entry.date}</span>
      </div>
    `).join('');
  }

  static updateSourceProjects(projects) {
    const container = document.getElementById('source-projects');
    const projectEntries = Object.entries(projects);
    if (projectEntries.length === 0) {
      container.innerHTML = '<p style="opacity: 0.7; font-size: 12px;">No source data yet</p>';
      return;
    }
    const total = projectEntries.reduce((sum, [,count]) => sum + count, 0);
    container.innerHTML = projectEntries
      .sort(([,a], [,b]) => b - a)
      .map(([project, count]) => `
        <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="font-size: 12px;">${project}</span>
            <span>${count} prospects</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${count/total*100}%;"></div>
          </div>
        </div>
      `).join('');
  }

  static showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    statusEl.className = type;
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = '';
    }, 5000);
  }
}

window.DashboardUI = DashboardUI;
