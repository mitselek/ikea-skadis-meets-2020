// 💬 COMMENT EXTRACTOR MODULE
// Functions for extracting and processing comments from MakerWorld pages

// COMMENT EXTRACTION FUNCTION (injected into page)
function extractCommentsFunction() {
  console.log('🔍 EXTRACTING COMMENTS - V4 (Deep Analysis)');
  
  const prospects = [];
  
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
          text: text,
          profileLink: profile.link,
          quality: quality,
          score: score,
          source: window.location.href,
          timestamp: new Date().toISOString()
        });
      }
    }
  });
  
  console.log(`Final prospects found: ${prospects.length}`);
  return prospects;
}

// Make function available globally
window.extractCommentsFunction = extractCommentsFunction;
