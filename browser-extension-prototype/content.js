// Content script - runs on MakerWorld pages
console.log('🛠️ SKÅDIS Outreach Helper loaded!');

// Add a subtle indicator when on relevant pages
if (window.location.hostname === 'makerworld.com') {
  checkPageRelevance();
  
  // Set a flag that can be used by injected scripts to know they're on the right page
  window.__skadisOutreachExtensionActive = true;
}

function checkPageRelevance() {
  const pageText = document.body.textContent.toLowerCase();
  const isSkadisRelevant = pageText.includes('skadis') || pageText.includes('skådis') || 
                          pageText.includes('pegboard') || pageText.includes('hook');
  
  if (isSkadisRelevant) {
    addSkadisIndicator();
  }
}

function addSkadisIndicator() {
  // Add a small, non-intrusive indicator
  const indicator = document.createElement('div');
  indicator.id = 'skadis-outreach-indicator';
  indicator.innerHTML = '🛠️';
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8px;
    border-radius: 50%;
    font-size: 16px;
    z-index: 10000;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    transition: transform 0.2s;
    title: "SKÅDIS page detected! Click extension icon to analyze.";
  `;
  
  indicator.addEventListener('mouseenter', () => {
    indicator.style.transform = 'scale(1.1)';
  });
  
  indicator.addEventListener('mouseleave', () => {
    indicator.style.transform = 'scale(1)';
  });
  
  indicator.addEventListener('click', () => {
    alert('This page contains SKÅDIS content! Use the extension popup to analyze it.');
  });
  
  document.body.appendChild(indicator);
  
  // Remove after 10 seconds to avoid clutter
  setTimeout(() => {
    if (document.getElementById('skadis-outreach-indicator')) {
      document.getElementById('skadis-outreach-indicator').remove();
    }
  }, 10000);
}
