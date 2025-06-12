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
      
      // Calculate response rate (placeholder for now)
      const responseRate = stats.totalMessages > 0 ? '12%' : '0%'; // Would calculate from actual responses
      document.getElementById('response-rate').textContent = responseRate;
      
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  }

  // 📈 CAMPAIGN DASHBOARD
  async function viewCampaignDashboard() {
    try {
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

      // 🚫 Calculate duplicate prevention stats
      const contactedUsernames = new Set(
        log.map(entry => entry.username.toLowerCase())
      );
      const uncontactedCount = prospects.filter(
        prospect => !contactedUsernames.has(prospect.username.toLowerCase())
      ).length;

      // Create detailed dashboard report
      let dashboard = `📈 CAMPAIGN DASHBOARD\\n\\n`;
      dashboard += `📊 OVERVIEW:\\n`;
      dashboard += `Total Messages Sent: ${stats.totalMessages}\\n`;
      dashboard += `Campaign Started: ${log.length > 0 ? log[0].date : 'Not started'}\\n`;
      dashboard += `Latest Activity: ${log.length > 0 ? log[log.length - 1].date : 'None'}\\n\\n`;

      dashboard += `🚫 DUPLICATE PREVENTION:\\n`;
      dashboard += `Total Prospects Found: ${prospects.length}\\n`;
      dashboard += `Already Contacted: ${prospects.length - uncontactedCount}\\n`;
      dashboard += `Available to Contact: ${uncontactedCount}\\n`;
      dashboard += `Duplicate Prevention: ${prospects.length - uncontactedCount > 0 ? 'ACTIVE ✅' : 'No duplicates yet'}\\n\\n`;

      dashboard += `🎯 PROSPECT QUALITY:\\n`;
      dashboard += `High Quality: ${stats.qualityBreakdown.High || 0} messages\\n`;
      dashboard += `Medium Quality: ${stats.qualityBreakdown.Medium || 0} messages\\n`;
      dashboard += `Low Quality: ${stats.qualityBreakdown.Low || 0} messages\\n\\n`;

      dashboard += `📝 TEMPLATE USAGE:\\n`;
      Object.entries(stats.templateUsage).forEach(([template, count]) => {
        dashboard += `${template}: ${count} times\\n`;
      });

      dashboard += `\\n🚀 SOURCE PROJECTS:\\n`;
      Object.entries(stats.sourceProjects).forEach(([project, count]) => {
        dashboard += `${project}: ${count} prospects\\n`;
      });

      dashboard += `\\n📅 RECENT ACTIVITY (Last 5):\\n`;
      const recentMessages = log.slice(-5).reverse();
      recentMessages.forEach((entry, i) => {
        dashboard += `${i+1}. @${entry.username} - ${entry.date} (${entry.prospectQuality})\\n`;
      });

      alert(dashboard);
      
    } catch (error) {
      showStatus('Error loading campaign data: ' + error.message, 'error');
    }
  }

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
