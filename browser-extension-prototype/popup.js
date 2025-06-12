// Popup Script - handles the extension interface
document.addEventListener('DOMContentLoaded', function() {
  
  // Load current stats from storage
  loadStats();
  
  // Button event listeners
  document.getElementById('extract-page').addEventListener('click', extractCurrentPage);
  document.getElementById('extract-comments').addEventListener('click', extractComments);
  document.getElementById('view-prospects').addEventListener('click', viewProspects);
  document.getElementById('send-template').addEventListener('click', quickMessage);
  document.getElementById('view-campaign').addEventListener('click', viewCampaignDashboard);
  document.getElementById('export-csv').addEventListener('click', exportTrackingData);
  
  // Dashboard navigation
  document.getElementById('back-to-main').addEventListener('click', function() {
    document.getElementById('dashboard-view').classList.remove('active');
    document.getElementById('main-view').classList.remove('hidden');
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
        
        await updateResponseRate(randomEntry.username, randomResponse);
        
        // Reload dashboard data
        await loadDashboardData();
        
        showStatus(`✅ Simulated ${randomResponse} response from @${randomEntry.username}`, 'success');
      } else {
        showStatus('No messages to simulate responses for yet!', 'error');
      }
    });
  }
  
  // Load and display initial stats
  updateStatsDisplay();
  
  async function loadStats() {
    // Redirect to the new updateStatsDisplay function
    await updateStatsDisplay();
  }
  
  async function extractCurrentPage() {
    showStatus('Analyzing page...', 'info');
    
    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      
      if (!tab.url.includes('makerworld.com')) {
        showStatus('Please navigate to a MakerWorld page first!', 'error');
        return;
      }
      
      // Inject and run the page analysis script
      const results = await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: analyzePageFunction
      });
      
      const analysis = results[0].result;
      
      if (analysis.recommendation === 'HIGH PRIORITY') {
        showStatus(`✅ Great page! Relevance: ${analysis.relevance_score}, Engagement: ${analysis.total_engagement}`, 'success');
      } else if (analysis.recommendation === 'MEDIUM PRIORITY') {
        showStatus(`📊 Decent page. Relevance: ${analysis.relevance_score}, Engagement: ${analysis.total_engagement}`, 'info');
      } else {
        showStatus(`⚠️ Low priority page. Consider finding better prospects.`, 'error');
      }
      
    } catch (error) {
      showStatus('Error analyzing page: ' + error.message, 'error');
    }
  }
  
  async function extractComments() {
    showStatus('Extracting comments...', 'info');
    
    try {
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      
      if (!tab.url.includes('makerworld.com')) {
        showStatus('Please navigate to a MakerWorld page first!', 'error');
        return;
      }
      
      // Inject and run the comment extraction script
      const results = await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: extractCommentsFunction
      });
      
      const comments = results[0].result;
      
      if (comments && comments.length > 0) {
        // Save prospects to storage
        const existing = await chrome.storage.local.get(['prospects']);
        const allProspects = [...(existing.prospects || []), ...comments];
        
        await chrome.storage.local.set({prospects: allProspects});
        
        showStatus(`✅ Found ${comments.length} quality commenters! Check prospects.`, 'success');
        updateStatsDisplay(); // Refresh the display with new function
      } else {
        showStatus('No comments found. Try scrolling down or loading more comments first.', 'error');
      }
      
    } catch (error) {
      showStatus('Error extracting comments: ' + error.message, 'error');
    }
  }
  
  async function viewProspects() {
    try {
      const result = await chrome.storage.local.get(['prospects', 'outreachLog']);
      const prospects = result.prospects || [];
      const outreachLog = result.outreachLog || [];
      
      if (prospects.length === 0) {
        showStatus('No prospects yet. Try extracting comments from SKÅDIS projects!', 'error');
        return;
      }
      
      // 🚫 Get list of already contacted usernames
      const contactedUsernames = new Set(
        outreachLog.map(entry => entry.username.toLowerCase())
      );
      
      // Separate contacted and uncontacted prospects
      const uncontactedProspects = prospects.filter(
        prospect => !contactedUsernames.has(prospect.username.toLowerCase())
      );
      const contactedProspects = prospects.filter(
        prospect => contactedUsernames.has(prospect.username.toLowerCase())
      );
      
      // Display prospect breakdown
      const topUncontacted = uncontactedProspects.slice(0, 3);
      const topContacted = contactedProspects.slice(0, 2);
      
      let message = `📊 PROSPECT OVERVIEW\\n\\n`;
      message += `🟢 UNCONTACTED: ${uncontactedProspects.length} prospects\\n`;
      message += `🔴 ALREADY CONTACTED: ${contactedProspects.length} prospects\\n\\n`;
      
      if (topUncontacted.length > 0) {
        message += `🎯 TOP UNCONTACTED PROSPECTS:\\n`;
        topUncontacted.forEach((prospect, i) => {
          message += `${i+1}. @${prospect.username} - ${prospect.quality} quality\\n`;
          message += `   "${prospect.text.substring(0, 50)}..."\\n\\n`;
        });
      }
      
      if (topContacted.length > 0) {
        message += `✅ ALREADY CONTACTED:\\n`;
        topContacted.forEach((prospect, i) => {
          message += `${i+1}. @${prospect.username} - ${prospect.quality} quality (CONTACTED)\\n`;
        });
      }
      
      alert(message);
      
    } catch (error) {
      showStatus('Error loading prospects: ' + error.message, 'error');
    }
  }
  
  async function quickMessage() {
    try {
      const result = await chrome.storage.local.get(['prospects', 'outreachLog']);
      const prospects = result.prospects || [];
      const outreachLog = result.outreachLog || [];
      
      if (prospects.length === 0) {
        showStatus('No prospects yet. Extract some comments first!', 'error');
        return;
      }
      
      // 🚫 DUPLICATE PREVENTION - Get list of already contacted usernames
      const contactedUsernames = new Set(
        outreachLog.map(entry => entry.username.toLowerCase())
      );
      
      // Filter out prospects we've already contacted
      const uncontactedProspects = prospects.filter(
        prospect => !contactedUsernames.has(prospect.username.toLowerCase())
      );
      
      if (uncontactedProspects.length === 0) {
        showStatus('⚠️ All prospects have already been contacted! Extract more comments.', 'error');
        return;
      }
      
      // Find the best uncontacted prospect
      const bestProspect = uncontactedProspects.find(p => p.quality === 'High') || uncontactedProspects[0];
      
      // Generate a quick message (simplified template)
      const message = generateQuickMessage(bestProspect);
      
      // Copy to clipboard (in real version, this would open MakerWorld message composer)
      await navigator.clipboard.writeText(message);
      
      // 🚀 AUTOMATIC MESSAGE TRACKING - Log this outreach!
      await logOutreachMessage(bestProspect, message, 'Standard Template');
      
      // Refresh stats display to show updated message count
      await updateStatsDisplay();
      
      // 🌐 AUTO-OPEN USER PROFILE - Open user's profile in new tab for easy messaging
      try {
        const profileUrl = bestProspect.profileLink;
        await chrome.tabs.create({ url: profileUrl, active: true }); // Opens in foreground for immediate use
        showStatus(`✅ Message copied & profile opened! @${bestProspect.username} (${uncontactedProspects.length - 1} uncontacted left)`, 'success');
      } catch (tabError) {
        console.error('Error opening profile tab:', tabError);
        showStatus(`✅ Message copied & tracked! @${bestProspect.username} (Profile link: ${bestProspect.profileLink})`, 'success');
      }
      
    } catch (error) {
      showStatus('Error generating message: ' + error.message, 'error');
    }
  }
  
  function generateQuickMessage(prospect) {
    return `Hi ${prospect.username},

Saw your comment on this SKÅDIS project - great to meet another SKÅDIS enthusiast!

I've been working on some enhanced SKÅDIS hooks that solve the stability issues of single-slot hooks through a two-slot mounting system. Since you're interested in SKÅDIS accessories, I thought you might find them interesting.

The project includes 4 hook variants with complete documentation and assembly photos:
https://makerworld.com/en/models/1503225-simple-skadis-hook#profileId-1572818

Would love to hear your thoughts if you check them out!

Best,
Mihkel`;
  }

  // 🎯 AUTOMATIC MESSAGE TRACKING SYSTEM
  async function logOutreachMessage(prospect, messageContent, templateUsed) {
    try {
      // Get current tracking data
      const result = await chrome.storage.local.get(['outreachLog', 'campaignStats']);
      const outreachLog = result.outreachLog || [];
      const campaignStats = result.campaignStats || {
        totalMessages: 0,
        messagesByMonth: {},
        templateUsage: {},
        qualityBreakdown: { High: 0, Medium: 0, Low: 0 },
        sourceProjects: {}
      };

      // Create message log entry
      const logEntry = {
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        username: prospect.username,
        profileUrl: prospect.profileLink,
        messageUrl: generateMessageUrl(prospect.username), // Construct MakerWorld message URL
        sourceProject: prospect.source,
        prospectQuality: prospect.quality,
        templateUsed: templateUsed,
        messagePreview: messageContent.substring(0, 100) + '...',
        responseStatus: 'Sent',
        responseDate: null,
        responseType: null,
        notes: `Auto-tracked from extension. Original comment: "${prospect.text.substring(0, 50)}..."`
      };

      // Add to log
      outreachLog.push(logEntry);

      // Update campaign statistics
      campaignStats.totalMessages++;
      const month = new Date().toISOString().substring(0, 7); // YYYY-MM
      campaignStats.messagesByMonth[month] = (campaignStats.messagesByMonth[month] || 0) + 1;
      campaignStats.templateUsage[templateUsed] = (campaignStats.templateUsage[templateUsed] || 0) + 1;
      campaignStats.qualityBreakdown[prospect.quality]++;
      
      const sourceProjectName = extractProjectName(prospect.source);
      campaignStats.sourceProjects[sourceProjectName] = (campaignStats.sourceProjects[sourceProjectName] || 0) + 1;

      // Save updated data
      await chrome.storage.local.set({
        outreachLog: outreachLog,
        campaignStats: campaignStats
      });

      // Also create CSV-compatible entry for export
      await saveToCSVFormat(logEntry);

      console.log('✅ Message logged successfully:', logEntry);

    } catch (error) {
      console.error('❌ Error logging outreach message:', error);
    }
  }

  function generateMessageUrl(username) {
    // Construct MakerWorld message URL (this would need the actual user ID in practice)
    return `https://makerworld.com/en/my/message?username=${username}`;
  }

  function extractProjectName(url) {
    const match = url.match(/models\/\d+-([^#?]+)/);
    return match ? match[1].replace(/-/g, ' ') : 'Unknown Project';
  }

  async function saveToCSVFormat(logEntry) {
    try {
      // Get existing CSV data
      const result = await chrome.storage.local.get(['csvExportData']);
      const csvData = result.csvExportData || [];

      // Create CSV row format matching your outreach_contacts.csv structure
      const csvRow = {
        Date_Collected: logEntry.date,
        Username: logEntry.username,
        Profile_URL: logEntry.profileUrl,
        Message_URL: logEntry.messageUrl,
        Source_Project: extractProjectName(logEntry.sourceProject),
        Comment_Quality: logEntry.prospectQuality,
        Engagement_Level: logEntry.prospectQuality, // Use quality as engagement proxy
        SKADIS_Projects: 'Unknown', // Would need additional analysis
        Last_Active: logEntry.date,
        Priority: logEntry.prospectQuality,
        Notes: logEntry.notes,
        Contact_Status: 'Contacted',
        Template_Used: logEntry.templateUsed,
        Response_Date: '',
        Response_Type: ''
      };

      csvData.push(csvRow);
      await chrome.storage.local.set({ csvExportData: csvData });

    } catch (error) {
      console.error('❌ Error saving CSV format:', error);
    }
  }
  
  async function updateStatsDisplay() {
    try {
      const result = await chrome.storage.local.get(['prospects', 'campaignStats', 'outreachLog']);
      const prospects = result.prospects || [];
      const stats = result.campaignStats || { totalMessages: 0 };
      const outreachLog = result.outreachLog || [];
      
      // 🚫 Calculate uncontacted prospects
      const contactedUsernames = new Set(
        outreachLog.map(entry => entry.username.toLowerCase())
      );
      const uncontactedCount = prospects.filter(
        prospect => !contactedUsernames.has(prospect.username.toLowerCase())
      ).length;
      
      // Update display with uncontacted/total format
      document.getElementById('prospects-count').textContent = `${uncontactedCount}/${prospects.length}`;
      document.getElementById('messages-sent').textContent = stats.totalMessages;
      
      // Calculate response rate from actual data
      const responseRate = stats.responseStats ? `${stats.responseStats.responseRate}%` : '0%';
      document.getElementById('response-rate').textContent = responseRate;
      
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }

  // 📈 CAMPAIGN DASHBOARD - Enhanced UI Version
  async function viewCampaignDashboard() {
    try {
      // Switch to dashboard view
      document.getElementById('main-view').classList.add('hidden');
      document.getElementById('dashboard-view').classList.add('active');
      
      // Load dashboard data
      await loadDashboardData();
      
    } catch (error) {
      showStatus('Error loading campaign dashboard: ' + error.message, 'error');
    }
  }

  // 🤖 AI-POWERED DASHBOARD INSIGHTS
  async function loadDashboardData() {
    const result = await chrome.storage.local.get(['campaignStats', 'outreachLog', 'prospects']);
    const stats = result.campaignStats || {
      totalMessages: 0,
      messagesByMonth: {},
      templateUsage: {},
      qualityBreakdown: { High: 0, Medium: 0, Low: 0 },
      sourceProjects: {}
    };
    const log = result.outreachLog || [];
    const prospects = result.prospects || [];

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

    // Generate AI insights
    generateAIInsights(stats, log, prospects, uncontactedCount);
    
    // Update quality breakdown
    updateQualityBreakdown(stats.qualityBreakdown);
    
    // Update duplicate prevention stats
    updateDuplicateStats(prospects.length, uncontactedCount);
    
    // Update recent activity
    updateRecentActivity(log.slice(-5).reverse());
    
    // Update source projects
    updateSourceProjects(stats.sourceProjects);
  }

  // 🤖 AI INSIGHTS GENERATOR
  function generateAIInsights(stats, log, prospects, uncontactedCount) {
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

  function updateQualityBreakdown(breakdown) {
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

  function updateDuplicateStats(totalProspects, uncontacted) {
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

  function updateRecentActivity(recentLog) {
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

  function updateSourceProjects(projects) {
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

  // Navigation handlers
  document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // Dashboard navigation
    document.getElementById('back-to-main').addEventListener('click', function() {
      document.getElementById('dashboard-view').classList.remove('active');
      document.getElementById('main-view').classList.remove('hidden');
    });
  });

  // 💾 EXPORT TRACKING DATA
  async function exportTrackingData() {
    try {
      const result = await chrome.storage.local.get(['csvExportData', 'outreachLog']);
      const csvData = result.csvExportData || [];
      const outreachLog = result.outreachLog || [];

      if (csvData.length === 0 && outreachLog.length === 0) {
        showStatus('No tracking data to export yet!', 'error');
        return;
      }

      // Create CSV content
      const headers = [
        'Date_Collected', 'Username', 'Profile_URL', 'Message_URL', 'Source_Project',
        'Comment_Quality', 'Engagement_Level', 'SKADIS_Projects', 'Last_Active',
        'Priority', 'Notes', 'Contact_Status', 'Template_Used', 'Response_Date', 'Response_Type'
      ];

      let csvContent = headers.join(',') + '\\n';

      // Add CSV data
      csvData.forEach(row => {
        const values = headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes in CSV
          return value.includes(',') || value.includes('"') ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvContent += values.join(',') + '\\n';
      });

      // Create downloadable file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `skadis_outreach_tracking_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showStatus(`✅ Exported ${csvData.length} tracking records!`, 'success');
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(csvContent);
        showStatus('📋 CSV data copied to clipboard!', 'success');
      }
      
    } catch (error) {
      showStatus('Error exporting data: ' + error.message, 'error');
    }
  }

  function showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    statusEl.className = type;
    
    // Auto-clear after 5 seconds
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = '';
    }, 5000);
  }
});

// These functions will be injected into the page context
function analyzePageFunction() {
  console.log('🔍 Analyzing page:', window.location.href);
  
  const url = window.location.href;
  const title = document.title;
  const pageText = document.body.textContent.toLowerCase();
  
  console.log('Page title:', title);
  console.log('Page text length:', pageText.length);
  
  // Enhanced SKÅDIS relevance detection
  const skadisTerms = ['skadis', 'skådis', 'pegboard', 'hook', 'organizer', 'workshop', 'tool storage', 'ikea'];
  let relevanceScore = 0;
  
  skadisTerms.forEach(term => {
    const matches = (pageText.match(new RegExp(term, 'g')) || []).length;
    relevanceScore += matches;
    if (matches > 0) {
      console.log(`Found "${term}": ${matches} times`);
    }
  });
  
  // Check title for extra relevance
  const titleLower = title.toLowerCase();
  if (titleLower.includes('skadis') || titleLower.includes('skådis')) {
    relevanceScore += 10;
    console.log('SKÅDIS found in title: +10 points');
  }
  
  // Better engagement detection for MakerWorld
  const engagement = {
    comments: 0,
    likes: 0,
    makes: 0,
    downloads: 0
  };
  
  // Look for engagement indicators in text
  const engagementPatterns = [
    /(\d+)\s*comments?/gi,
    /(\d+)\s*reviews?/gi,
    /(\d+)\s*likes?/gi,
    /(\d+)\s*downloads?/gi,
    /(\d+)\s*makes?/gi,
    /(\d+)\s*prints?/gi
  ];
  
  engagementPatterns.forEach(pattern => {
    const matches = pageText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const number = parseInt(match.match(/\d+/)[0]);
        if (number > engagement.comments) {
          engagement.comments = Math.max(engagement.comments, number);
        }
      });
    }
  });
  
  // Also count visible elements that might be comments/reviews
  const possibleComments = document.querySelectorAll(
    '[class*="comment"], [class*="review"], [class*="feedback"], ' +
    'a[href*="/@"], .user-card, .review-card'
  ).length;
  
  if (possibleComments > engagement.comments) {
    engagement.comments = possibleComments;
  }
  
  console.log('Engagement detected:', engagement);
  console.log('Relevance score:', relevanceScore);
  
  const totalEngagement = engagement.comments + engagement.likes + engagement.makes + engagement.downloads;
  
  let recommendation;
  if (relevanceScore >= 5 && totalEngagement >= 10) {
    recommendation = 'HIGH PRIORITY';
  } else if (relevanceScore >= 3 && totalEngagement >= 5) {
    recommendation = 'MEDIUM PRIORITY';
  } else if (relevanceScore >= 1) {
    recommendation = 'LOW PRIORITY';
  } else {
    recommendation = 'NOT RELEVANT';
  }
  
  console.log('Final recommendation:', recommendation);
  
  return {
    url: url,
    title: title,
    relevance_score: relevanceScore,
    engagement: engagement,
    total_engagement: totalEngagement,
    recommendation: recommendation,
    page_text_sample: pageText.substring(0, 200)
  };
}

function extractCommentsFunction() {
  console.log('🔍 EXTRACTING COMMENTS - V4 (Deep Analysis)');
  
  const prospects = [];
  
  // Strategy 1: Find all text nodes with engagement keywords (not used for now, but available)
  function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeValue.trim().length > 10) {
        textNodes.push(node);
      }
    }
    return textNodes;
  }
  
  // Strategy 2: Look for profile sections that contain user content
  const profileLinks = document.querySelectorAll('a[href*="/@"]');
  console.log(`Found ${profileLinks.length} profile links`);
  
  if (profileLinks.length === 0) {
    return [];
  }
  
  const profileSections = new Map();
  
  profileLinks.forEach(link => {
    const match = link.href.match(/@([^/]+)/);
    if (!match) return;
    
    const username = match[1];
    
    // Look for content containers around this profile link
    let container = link.parentElement;
    let depth = 0;
    
    while (container && depth < 5) {
      const containerText = container.textContent.trim();
      
      // Skip if container is too big or too small
      if (containerText.length > 50 && containerText.length < 1000) {
        
        // Check if this container has meaningful content beyond just the username
        let cleanText = containerText.replace(new RegExp(username, 'gi'), '');
        cleanText = cleanText.replace(/\s+/g, ' ').trim();
        
        if (cleanText.length > 20) {
          if (!profileSections.has(username) || cleanText.length < profileSections.get(username).text.length) {
            profileSections.set(username, {
              username: username,
              text: cleanText,
              element: container,
              link: link.href
            });
          }
        }
      }
      
      container = container.parentElement;
      depth++;
    }
  });
  
  console.log(`Found ${profileSections.size} users with associated content`);
  
  // Strategy 3: Extract and score the best content
  Array.from(profileSections.values()).forEach(profile => {
    let text = profile.text;
    
    // Clean up common UI elements
    text = text.replace(/Like|Reply|Share|Report|Edit|Delete|Follow|Subscribe|Download|View|Show|Hide/gi, '');
    text = text.replace(/\d+\s*(likes?|views?|downloads?|follows?)/gi, '');
    text = text.replace(/^\s*[@#]\w+\s*/, ''); // Remove @mentions and #hashtags at start
    text = text.replace(/ProfileTwo hooks, strong.*?infill/gi, ''); // Remove MakerWorld profile template text
    text = text.replace(/print profile is no longer public/gi, '');
    text = text.replace(/\s+/g, ' ').trim();
    
    if (text.length >= 20 && text.length <= 300) {
      let score = 0;
      let quality = 'Low';
      
      // Score based on engagement indicators
      const positiveWords = ['great', 'awesome', 'perfect', 'love', 'excellent', 'amazing', 'brilliant', 'fantastic', 'wonderful', 'good', 'nice', 'works', 'printed', 'useful', 'helpful', 'recommend', 'impressed', 'solid', 'quality', 'strong', 'fits'];
      
      positiveWords.forEach(word => {
        if (text.toLowerCase().includes(word)) {
          score += word.length > 5 ? 3 : 2;
        }
      });
      
      // Bonus for length and sentence structure
      if (text.length > 50) score += 2;
      if (text.length > 100) score += 3;
      if (text.includes('.') || text.includes('!')) score += 1;
      
      if (score >= 6) quality = 'High';
      else if (score >= 3) quality = 'Medium';
      
      if (score > 0) { // Only include prospects with some positive indicators
        prospects.push({
          username: profile.username,
          text: text.substring(0, 200),
          quality: quality,
          score: score,
          profileLink: profile.link,
          source: window.location.href,
          date: new Date().toISOString()
        });
      }
    }
  });
  
  // Remove duplicates and sort by score
  const uniqueProspects = new Map();
  prospects.forEach(prospect => {
    const key = prospect.username.toLowerCase();
    if (!uniqueProspects.has(key) || prospect.score > uniqueProspects.get(key).score) {
      uniqueProspects.set(key, prospect);
    }
  });
  
  const finalProspects = Array.from(uniqueProspects.values())
    .sort((a, b) => b.score - a.score);
  
  console.log(`Found ${finalProspects.length} prospects with meaningful content!`);
  
  return finalProspects;
}

// 📈 RESPONSE RATE TRACKING
async function updateResponseRate(username, responseType) {
  try {
    const result = await chrome.storage.local.get(['outreachLog']);
    const outreachLog = result.outreachLog || [];
    
    // Find the log entry for this user
    const logEntry = outreachLog.find(entry => 
      entry.username.toLowerCase() === username.toLowerCase()
    );
    
    if (logEntry) {
      logEntry.responseStatus = responseType;
      logEntry.responseDate = new Date().toISOString().split('T')[0];
      logEntry.responseType = responseType;
      
      await chrome.storage.local.set({ outreachLog: outreachLog });
      
      // Update campaign stats
      await updateCampaignResponseStats();
      
      console.log(`✅ Response tracked: ${username} - ${responseType}`);
    }
  } catch (error) {
    console.error('❌ Error updating response rate:', error);
  }
}

async function updateCampaignResponseStats() {
  const result = await chrome.storage.local.get(['outreachLog', 'campaignStats']);
  const outreachLog = result.outreachLog || [];
  const campaignStats = result.campaignStats || {};
  
  // Calculate response statistics
  const totalMessages = outreachLog.length;
  const responses = outreachLog.filter(entry => 
    entry.responseStatus && entry.responseStatus !== 'Sent'
  );
  const positiveResponses = outreachLog.filter(entry => 
    entry.responseType === 'positive' || entry.responseType === 'interested'
  );
  
  campaignStats.responseStats = {
    totalResponses: responses.length,
    positiveResponses: positiveResponses.length,
    responseRate: totalMessages > 0 ? (responses.length / totalMessages * 100).toFixed(1) : 0,
    positiveRate: responses.length > 0 ? (positiveResponses.length / responses.length * 100).toFixed(1) : 0
  };
  
  await chrome.storage.local.set({ campaignStats: campaignStats });
}
