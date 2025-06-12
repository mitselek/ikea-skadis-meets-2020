// 🔍 PAGE ANALYZER MODULE
// Functions for analyzing page content and relevance

// PAGE ANALYSIS FUNCTION (injected into page)
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

// Make function available globally
window.analyzePageFunction = analyzePageFunction;
