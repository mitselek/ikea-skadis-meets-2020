// Popup script - handles the extension interface
document.addEventListener('DOMContentLoaded', function() {
  
  // Load current stats from storage
  loadStats();
  
  // Button event listeners
  document.getElementById('extract-page').addEventListener('click', extractCurrentPage);
  document.getElementById('extract-comments').addEventListener('click', extractComments);
  document.getElementById('view-prospects').addEventListener('click', viewProspects);
  document.getElementById('send-template').addEventListener('click', quickMessage);
  
  async function loadStats() {
    try {
      const result = await chrome.storage.local.get(['prospects', 'messagesSent', 'responses']);
      
      document.getElementById('prospects-count').textContent = (result.prospects || []).length;
      document.getElementById('messages-sent').textContent = result.messagesSent || 0;
      
      const responseRate = result.messagesSent > 0 ? 
        Math.round((result.responses || 0) / result.messagesSent * 100) : 0;
      document.getElementById('response-rate').textContent = responseRate + '%';
      
    } catch (error) {
      console.log('Stats loading error:', error);
    }
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
        loadStats(); // Refresh the display
      } else {
        showStatus('No comments found. Try scrolling down or loading more comments first.', 'error');
      }
      
    } catch (error) {
      showStatus('Error extracting comments: ' + error.message, 'error');
    }
  }
  
  async function viewProspects() {
    try {
      const result = await chrome.storage.local.get(['prospects']);
      const prospects = result.prospects || [];
      
      if (prospects.length === 0) {
        showStatus('No prospects yet. Try extracting comments from SKÅDIS projects!', 'error');
        return;
      }
      
      // Simple prospect display (in real version, this would be a nice UI)
      const topProspects = prospects.slice(0, 5);
      let message = `Top ${topProspects.length} prospects:\\n\\n`;
      
      topProspects.forEach((prospect, i) => {
        message += `${i+1}. @${prospect.username} - ${prospect.quality} quality\\n`;
        message += `   "${prospect.text.substring(0, 60)}..."\\n\\n`;
      });
      
      alert(message);
      
    } catch (error) {
      showStatus('Error loading prospects: ' + error.message, 'error');
    }
  }
  
  async function quickMessage() {
    try {
      const result = await chrome.storage.local.get(['prospects']);
      const prospects = result.prospects || [];
      
      if (prospects.length === 0) {
        showStatus('No prospects yet. Extract some comments first!', 'error');
        return;
      }
      
      // Find the best prospect
      const bestProspect = prospects.find(p => p.quality === 'High') || prospects[0];
      
      // Generate a quick message (simplified template)
      const message = generateQuickMessage(bestProspect);
      
      // Copy to clipboard (in real version, this would open MakerWorld message composer)
      await navigator.clipboard.writeText(message);
      
      showStatus(`✅ Message for @${bestProspect.username} copied to clipboard!`, 'success');
      
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
  // Your existing page analysis script (simplified)
  const url = window.location.href;
  const title = document.title;
  const pageText = document.body.textContent.toLowerCase();
  
  // Check for SKADIS relevance
  const skadisTerms = ['skadis', 'skådis', 'pegboard', 'hook', 'organizer', 'workshop'];
  const relevanceScore = skadisTerms.reduce((score, term) => {
    return score + (pageText.match(new RegExp(term, 'g')) || []).length;
  }, 0);
  
  // Simple engagement detection
  const engagement = {
    comments: document.querySelectorAll('.comment, .comment-item, .review').length,
    likes: document.querySelectorAll('.like, .heart, .favorite').length
  };
  
  const totalEngagement = engagement.comments + engagement.likes;
  
  return {
    url: url,
    title: title,
    relevance_score: relevanceScore,
    total_engagement: totalEngagement,
    recommendation: relevanceScore > 5 && totalEngagement > 10 ? 'HIGH PRIORITY' : 
                   relevanceScore > 2 && totalEngagement > 5 ? 'MEDIUM PRIORITY' : 'LOW PRIORITY'
  };
}

function extractCommentsFunction() {
  // Simplified version of your comment extraction script
  const comments = [];
  
  // Try to find comment elements
  const commentElements = document.querySelectorAll('.comment-item, .comment, .review');
  
  commentElements.forEach((comment, index) => {
    try {
      // Try to extract username
      let username = '';
      const usernameEl = comment.querySelector('.username, .user-name, .author, a[href*="/@"]');
      if (usernameEl) {
        username = usernameEl.textContent.trim();
        if (usernameEl.href && usernameEl.href.includes('/@')) {
          const match = usernameEl.href.match(/@([^/]+)/);
          username = match ? match[1] : username;
        }
      }
      
      // Try to extract comment text
      let text = '';
      const textEl = comment.querySelector('.comment-text, .content, .message, .text');
      if (textEl) {
        text = textEl.textContent.trim();
      } else {
        text = comment.textContent.trim();
      }
      
      if (username && text && text.length > 10) {
        comments.push({
          username: username,
          text: text.substring(0, 150),
          quality: text.length > 80 ? 'High' : text.length > 30 ? 'Medium' : 'Low',
          source: window.location.href,
          date: new Date().toISOString()
        });
      }
    } catch (e) {
      console.log('Error processing comment:', e);
    }
  });
  
  // Return unique commenters only
  const uniqueCommenters = new Map();
  comments.forEach(comment => {
    const key = comment.username.toLowerCase();
    if (!uniqueCommenters.has(key) || comment.quality === 'High') {
      uniqueCommenters.set(key, comment);
    }
  });
  
  return Array.from(uniqueCommenters.values());
}
