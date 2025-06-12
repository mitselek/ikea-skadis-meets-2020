// 🎯 MESSAGING & TRACKING MODULE
// Handles message generation, tracking, and outreach functionality

class MessagingManager {
  constructor() {
    this.templates = {
      standard: 'Standard Template',
      prospects: 'Prospects View Template',
      ai: 'AI Generated'
    };
    
    // Initialize AI messaging if available
    this.aiMessaging = window.AIMessagingManager ? new window.AIMessagingManager() : null;
    
    if (this.aiMessaging) {
      console.log('✅ AI messaging system initialized successfully');
    } else {
      console.log('⚠️ AI messaging system not available - using standard templates');
    }
  }

  async quickMessage() {
    try {
      const result = await chrome.storage.local.get(['prospects', 'outreachLog']);
      const prospects = result.prospects || [];
      const outreachLog = result.outreachLog || [];
      
      if (prospects.length === 0) {
        this.showStatus('No prospects yet. Extract some comments first!', 'error');
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
        this.showStatus('⚠️ All prospects have already been contacted! Extract more comments.', 'error');
        return;
      }
      
      // Find the best uncontacted prospect
      const bestProspect = uncontactedProspects.find(p => p.quality === 'High') || uncontactedProspects[0];
      
      // Generate a quick message and get template info
      const messageResult = await this.generateQuickMessageWithTemplate(bestProspect);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(messageResult.message);
      
      // 🚀 AUTOMATIC MESSAGE TRACKING - Log this outreach with correct template!
      await this.logOutreachMessage(bestProspect, messageResult.message, messageResult.templateUsed);
      
      // 🌐 AUTO-OPEN USER PROFILE - Open user's profile in new tab for easy messaging
      try {
        const profileUrl = bestProspect.profileLink;
        await chrome.tabs.create({ url: profileUrl, active: true });
        this.showStatus(`✅ Message copied & profile opened! @${bestProspect.username} (${uncontactedProspects.length - 1} uncontacted left)`, 'success');
      } catch (tabError) {
        console.error('Error opening profile tab:', tabError);
        this.showStatus(`✅ Message copied & tracked! @${bestProspect.username} (Profile link: ${bestProspect.profileLink})`, 'success');
      }
      
      // Refresh stats display
      if (window.updateStatsDisplay) {
        await window.updateStatsDisplay();
      }
      
    } catch (error) {
      this.showStatus('Error generating message: ' + error.message, 'error');
    }
  }
  
  async generateQuickMessageWithTemplate(prospect) {
    // 🤖 Try AI-generated message first
    if (this.aiMessaging) {
      try {
        const aiResult = await this.aiMessaging.generatePersonalizedMessage(prospect);
        console.log(`✨ AI Generated ${aiResult.templateUsed} for @${prospect.username}`);
        
        // Store AI analytics for dashboard
        this.storeAIAnalytics(prospect, aiResult);
        
        return {
          message: aiResult.message,
          templateUsed: aiResult.templateUsed
        };
      } catch (error) {
        console.error('❌ AI message generation failed, using fallback:', error);
      }
    }
    
    // 📝 Fallback to standard template
    console.log(`📝 Using standard template for @${prospect.username}`);
    return {
      message: this.generateStandardMessage(prospect),
      templateUsed: this.templates.standard
    };
  }

  // Legacy method for backwards compatibility
  generateQuickMessage(prospect) {
    return this.generateQuickMessageWithTemplate(prospect).message;
  }

  generateStandardMessage(prospect) {
    return `Hi ${prospect.username},

Saw your comment on this SKÅDIS project - great to meet another SKÅDIS enthusiast!

I've been working on some enhanced SKÅDIS hooks that solve the stability issues of single-slot hooks through a two-slot mounting system. Since you're interested in SKÅDIS accessories, I thought you might find them interesting.

The project includes 4 hook variants with complete documentation and assembly photos:
https://makerworld.com/en/models/1503225-simple-skadis-hook#profileId-1572818

Would love to hear your thoughts if you check them out!

Best,
Mihkel`;
  }

  async storeAIAnalytics(prospect, aiResult) {
    try {
      const result = await chrome.storage.local.get(['aiAnalytics']);
      const analytics = result.aiAnalytics || [];
      
      const analyticsEntry = {
        timestamp: new Date().toISOString(),
        prospect: {
          username: prospect.username,
          quality: prospect.quality,
          commentLength: prospect.text.length
        },
        ai: {
          templateUsed: aiResult.templateUsed,
          confidence: aiResult.confidence,
          personalizationCount: Object.keys(aiResult.personalizations || {}).length
        },
        message: {
          length: aiResult.message.length,
          personalizedElements: Object.keys(aiResult.personalizations || {}).filter(key => 
            aiResult.personalizations[key] && aiResult.personalizations[key].length > 0
          ).length
        }
      };
      
      analytics.push(analyticsEntry);
      
      // Keep only last 100 entries
      if (analytics.length > 100) {
        analytics.splice(0, analytics.length - 100);
      }
      
      await chrome.storage.local.set({ aiAnalytics: analytics });
      
    } catch (error) {
      console.error('Error storing AI analytics:', error);
    }
  }

  // 🎯 AUTOMATIC MESSAGE TRACKING SYSTEM
  async logOutreachMessage(prospect, messageContent, templateUsed) {
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
        messageUrl: this.generateMessageUrl(prospect.username),
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
      
      const sourceProjectName = this.extractProjectName(prospect.source);
      campaignStats.sourceProjects[sourceProjectName] = (campaignStats.sourceProjects[sourceProjectName] || 0) + 1;

      // Save updated data
      await chrome.storage.local.set({
        outreachLog: outreachLog,
        campaignStats: campaignStats
      });

      // Also create CSV-compatible entry for export
      await this.saveToCSVFormat(logEntry);

      console.log('✅ Message logged successfully:', logEntry);

    } catch (error) {
      console.error('❌ Error logging outreach message:', error);
    }
  }

  generateMessageUrl(username) {
    // Construct MakerWorld message URL
    return `https://makerworld.com/en/my/message?username=${username}`;
  }

  extractProjectName(url) {
    const match = url.match(/models\/\d+-([^#?]+)/);
    return match ? match[1].replace(/-/g, ' ') : 'Unknown Project';
  }

  async saveToCSVFormat(logEntry) {
    try {
      // Get existing CSV data
      const result = await chrome.storage.local.get(['csvExportData']);
      const csvData = result.csvExportData || [];

      // Create CSV row format matching outreach_contacts.csv structure
      const csvRow = {
        Date_Collected: logEntry.date,
        Username: logEntry.username,
        Profile_URL: logEntry.profileUrl,
        Message_URL: logEntry.messageUrl,
        Source_Project: this.extractProjectName(logEntry.sourceProject),
        Comment_Quality: logEntry.prospectQuality,
        Engagement_Level: logEntry.prospectQuality,
        SKADIS_Projects: 'Unknown',
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
}

// Make it globally available
window.MessagingManager = MessagingManager;
