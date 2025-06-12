// 📈 DASHBOARD MANAGEMENT MODULE
// Handles all AI dashboard functionality

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
      this.showStatus('Error loading campaign dashboard: ' + error.message, 'error');
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
    this.generateAIInsights(stats, log, prospects, uncontactedCount, aiAnalytics);
    
    // Update quality breakdown
    this.updateQualityBreakdown(stats.qualityBreakdown);
    
    // Update duplicate prevention stats
    this.updateDuplicateStats(prospects.length, uncontactedCount);
    
    // Update recent activity
    this.updateRecentActivity(log.slice(-5).reverse());
    
    // Update source projects
    this.updateSourceProjects(stats.sourceProjects);

    // Update AI messaging analytics
    this.updateAIMessagingAnalytics(aiAnalytics);
  }

  // 🤖 AI INSIGHTS GENERATOR
  generateAIInsights(stats, log, prospects, uncontactedCount, aiAnalytics) {
    const insights = [];
    
    // Response rate insights
    if (stats.responseStats && stats.responseStats.totalResponses > 0) {
      const responseRate = parseFloat(stats.responseStats.responseRate);
      const positiveRate = parseFloat(stats.responseStats.positiveRate);
      
      if (responseRate > 15) {
        insights.push({
          icon: '🔥',
          text: `Outstanding response rate! ${responseRate}% of prospects are responding - your targeting is excellent!`,
          type: 'success'
        });
      } else if (responseRate > 8) {
        insights.push({
          icon: '📈',
          text: `Good response rate: ${responseRate}%. Industry average is 5-10%, you're doing well!`,
          type: 'success'
        });
      } else if (responseRate > 0) {
        insights.push({
          icon: '⚡',
          text: `Response rate: ${responseRate}%. Consider testing different message templates to improve engagement.`,
          type: 'improvement'
        });
      }
      
      if (positiveRate > 60 && stats.responseStats.totalResponses > 3) {
        insights.push({
          icon: '🎯',
          text: `${positiveRate}% positive response rate! Your message resonates well with prospects.`,
          type: 'success'
        });
      }
    }
    
    // Quality insights
    const totalQuality = stats.qualityBreakdown.High + stats.qualityBreakdown.Medium + stats.qualityBreakdown.Low;
    if (totalQuality > 0) {
      const highQualityRate = (stats.qualityBreakdown.High / totalQuality * 100).toFixed(1);
      if (highQualityRate > 60) {
        insights.push({
          icon: '🎯',
          text: `Excellent targeting! ${highQualityRate}% of your contacts are high-quality prospects.`,
          type: 'success'
        });
      } else if (highQualityRate < 30) {
        insights.push({
          icon: '⚡',
          text: `Focus on quality: Only ${highQualityRate}% high-quality prospects. Look for users with detailed comments.`,
          type: 'improvement'
        });
      }
    }

    // Activity insights
    if (log.length > 0) {
      const recentMessages = log.filter(entry => {
        const messageDate = new Date(entry.date);
        const daysSince = (new Date() - messageDate) / (1000 * 60 * 60 * 24);
        return daysSince <= 7;
      });
      
      if (recentMessages.length > 10) {
        insights.push({
          icon: '🚀',
          text: `Great momentum! You've sent ${recentMessages.length} messages this week. Keep it up!`,
          type: 'success'
        });
      } else if (recentMessages.length === 0 && log.length > 0) {
        insights.push({
          icon: '📅',
          text: 'No activity this week. Consider reaching out to more prospects to maintain engagement.',
          type: 'reminder'
        });
      }
    }

    // Prospect availability insights
    if (uncontactedCount > 50) {
      insights.push({
        icon: '💎',
        text: `${uncontactedCount} prospects available! Great opportunity to expand your reach.`,
        type: 'opportunity'
      });
    } else if (uncontactedCount < 10 && uncontactedCount > 0) {
      insights.push({
        icon: '⏰',
        text: `Only ${uncontactedCount} prospects left. Consider extracting comments from other SKÅDIS projects.`,
        type: 'action'
      });
    } else if (uncontactedCount === 0 && prospects.length > 0) {
      insights.push({
        icon: '✅',
        text: 'All prospects contacted! Time to find new SKÅDIS projects to expand your reach.',
        type: 'complete'
      });
    }

    // Template insights
    const templates = Object.entries(stats.templateUsage);
    if (templates.length > 1) {
      const mostUsed = templates.sort(([,a], [,b]) => b - a)[0];
      insights.push({
        icon: '📝',
        text: `"${mostUsed[0]}" is your most effective template (${mostUsed[1]} uses). Consider A/B testing variations.`,
        type: 'optimization'
      });
    }

    // Source project insights
    const sources = Object.entries(stats.sourceProjects);
    if (sources.length > 0) {
      const bestSource = sources.sort(([,a], [,b]) => b - a)[0];
      insights.push({
        icon: '🏆',
        text: `"${bestSource[0]}" generates the most prospects (${bestSource[1]}). Look for similar projects.`,
        type: 'strategy'
      });
    }

    // AI messaging insights
    if (aiAnalytics && aiAnalytics.length > 0) {
      const avgConfidence = (aiAnalytics.reduce((sum, entry) => sum + entry.ai.confidence, 0) / aiAnalytics.length * 100).toFixed(1);
      
      if (avgConfidence > 80) {
        insights.push({
          icon: '🤖',
          text: `Excellent AI performance! ${avgConfidence}% average confidence in message personalization.`,
          type: 'success'
        });
      } else if (avgConfidence > 60) {
        insights.push({
          icon: '🎯',
          text: `Good AI targeting: ${avgConfidence}% confidence. AI is learning your prospect patterns well.`,
          type: 'success'
        });
      }

      // Template performance insights
      const templateUsage = {};
      aiAnalytics.forEach(entry => {
        const template = entry.ai.templateUsed;
        templateUsage[template] = (templateUsage[template] || 0) + 1;
      });
      
      const mostUsedAITemplate = Object.entries(templateUsage).sort(([,a], [,b]) => b - a)[0];
      if (mostUsedAITemplate) {
        insights.push({
          icon: '✨',
          text: `AI prefers "${mostUsedAITemplate[0].replace('AI: ', '')}" template (${mostUsedAITemplate[1]} uses). Personalization is working!`,
          type: 'optimization'
        });
      }

      // Personalization insights
      const avgPersonalizations = (aiAnalytics.reduce((sum, entry) => sum + entry.message.personalizedElements, 0) / aiAnalytics.length).toFixed(1);
      if (avgPersonalizations > 3) {
        insights.push({
          icon: '🎨',
          text: `High personalization: Average ${avgPersonalizations} custom elements per message. Great targeting depth!`,
          type: 'success'
        });
      }
    }

    // Render insights
    const container = document.getElementById('ai-insights-container');
    container.innerHTML = insights.map(insight => `
      <div class="ai-insight">
        <span class="icon">${insight.icon}</span>
        ${insight.text}
      </div>
    `).join('');
    
    if (insights.length === 0) {
      container.innerHTML = `
        <div class="ai-insight">
          <span class="icon">🤖</span>
          Start sending messages to unlock AI-powered campaign insights!
        </div>
      `;
    }
  }

  updateQualityBreakdown(breakdown) {
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

  updateDuplicateStats(totalProspects, uncontacted) {
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

  updateRecentActivity(recentLog) {
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

  updateSourceProjects(projects) {
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

  updateAIMessagingAnalytics(aiAnalytics) {
    const container = document.getElementById('ai-messaging-analytics');
    
    if (!aiAnalytics || aiAnalytics.length === 0) {
      container.innerHTML = '<p style="opacity: 0.7; font-size: 12px;">Start using AI messaging to see analytics</p>';
      return;
    }

    // Calculate AI analytics metrics
    const totalAIMessages = aiAnalytics.length;
    const avgConfidence = (aiAnalytics.reduce((sum, entry) => sum + entry.ai.confidence, 0) / totalAIMessages * 100).toFixed(1);
    const avgPersonalization = (aiAnalytics.reduce((sum, entry) => sum + entry.message.personalizedElements, 0) / totalAIMessages).toFixed(1);
    
    // Template usage analysis
    const templateUsage = {};
    aiAnalytics.forEach(entry => {
      const template = entry.ai.templateUsed;
      templateUsage[template] = (templateUsage[template] || 0) + 1;
    });
    
    const mostUsedTemplate = Object.entries(templateUsage).sort(([,a], [,b]) => b - a)[0];

    container.innerHTML = `
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-value">${totalAIMessages}</div>
          <div class="metric-label">AI Messages</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${avgConfidence}%</div>
          <div class="metric-label">Avg Confidence</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${avgPersonalization}</div>
          <div class="metric-label">Avg Personalizations</div>
        </div>
      </div>
      
      ${mostUsedTemplate ? `
        <div style="margin-top: 10px; padding: 8px; background: rgba(76, 175, 80, 0.2); border-radius: 4px; font-size: 12px;">
          🎯 Most effective: <strong>${mostUsedTemplate[0]}</strong> (${mostUsedTemplate[1]} uses)
        </div>
      ` : ''}
      
      <div style="margin-top: 10px;">
        <div style="font-size: 11px; margin-bottom: 5px;">AI Template Distribution:</div>
        ${Object.entries(templateUsage).map(([template, count]) => `
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px;">
            <span>${template.replace('AI: ', '')}</span>
            <span>${count} (${(count/totalAIMessages*100).toFixed(1)}%)</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    statusEl.className = type;
    
    // Auto-clear after 5 seconds
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = '';
    }, 5000);
  }

  // Initialize event handlers
  initializeEventHandlers() {
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
          await this.loadDashboardData();
          
          this.showStatus(`✅ Simulated ${randomResponse} response from @${randomEntry.username}`, 'success');
        } else {
          this.showStatus('No messages to simulate responses for yet!', 'error');
        }
      });
    }
  }
}

// Make it globally available
window.DashboardManager = DashboardManager;
