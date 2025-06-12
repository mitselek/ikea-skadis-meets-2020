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
