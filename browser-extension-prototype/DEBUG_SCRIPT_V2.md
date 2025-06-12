# Improved MakerWorld Extractor - V2

This version is specifically designed for MakerWorld's comment structure. Copy and paste this into the browser console:

```javascript
// MakerWorld Comment Extractor V2 - Optimized for MakerWorld structure
(function() {
    console.log('🚀 MAKERWORLD EXTRACTOR V2 STARTING...');
    console.log('URL:', window.location.href);
    console.log('Title:', document.title);
    
    const prospects = [];
    
    // Strategy: Focus on finding actual comment/review content near profile links
    console.log('🔍 Looking for profile links and nearby content...');
    const profileLinks = document.querySelectorAll('a[href*="/@"]');
    console.log(`Found ${profileLinks.length} profile links`);
    
    profileLinks.forEach((link, index) => {
        try {
            // Extract username from URL
            const match = link.href.match(/@([^/]+)/);
            if (!match) return;
            
            const username = match[1];
            
            // Look for content in the same container as the profile link
            const container = link.closest('div, section, article, li');
            if (!container) return;
            
            // Get all text content from the container
            let fullText = container.textContent.trim();
            
            // Clean up the text
            fullText = fullText.replace(/\s+/g, ' ');
            fullText = fullText.replace(/Like|Reply|Share|Report|Edit|Delete|Follow/gi, '');
            fullText = fullText.replace(/\d+\s*(likes?|replies?|hours?|days?|months?|weeks?)\s*ago/gi, '');
            
            // Remove the username itself from the text
            fullText = fullText.replace(new RegExp(`@?${username}`, 'gi'), '');
            fullText = fullText.replace(/^[^a-zA-Z]*/, ''); // Remove leading non-letters
            
            // Look for meaningful content
            if (fullText.length < 10) {
                // Maybe the comment is in a sibling element
                const parent = container.parentElement;
                if (parent) {
                    const siblings = parent.children;
                    for (let sibling of siblings) {
                        if (sibling !== container && sibling.textContent.length > 20) {
                            fullText = sibling.textContent.trim();
                            break;
                        }
                    }
                }
            }
            
            // Skip if still no meaningful content
            if (fullText.length < 15 || fullText.length > 1000) return;
            
            // Quality scoring based on content
            let quality = 'Low';
            let score = 0;
            
            // High-value keywords
            const highValueWords = ['printed', 'works', 'great', 'perfect', 'awesome', 'excellent', 'amazing', 'love', 'brilliant', 'fantastic'];
            const mediumValueWords = ['good', 'nice', 'cool', 'useful', 'helpful', 'thanks', 'thank you', 'appreciate'];
            
            highValueWords.forEach(word => {
                if (fullText.toLowerCase().includes(word)) score += 3;
            });
            
            mediumValueWords.forEach(word => {
                if (fullText.toLowerCase().includes(word)) score += 1;
            });
            
            // Length bonus
            if (fullText.length > 100) score += 2;
            if (fullText.length > 200) score += 1;
            
            // Determine quality
            if (score >= 5) quality = 'High';
            else if (score >= 2) quality = 'Medium';
            
            prospects.push({
                username: username,
                text: fullText.substring(0, 200),
                quality: quality,
                score: score,
                containerHTML: container.outerHTML.substring(0, 300) + '...'
            });
            
        } catch (e) {
            console.log(`Error processing link ${index}:`, e);
        }
    });
    
    // Remove duplicates and keep best quality
    const uniqueUsers = new Map();
    prospects.forEach(prospect => {
        const key = prospect.username.toLowerCase();
        if (!uniqueUsers.has(key)) {
            uniqueUsers.set(key, prospect);
        } else {
            const existing = uniqueUsers.get(key);
            // Keep the one with higher score
            if (prospect.score > existing.score) {
                uniqueUsers.set(key, prospect);
            }
        }
    });
    
    const finalProspects = Array.from(uniqueUsers.values())
        .sort((a, b) => b.score - a.score); // Sort by score, highest first
    
    console.log('=== EXTRACTION RESULTS V2 ===');
    console.log(`Total unique users found: ${finalProspects.length}`);
    
    if (finalProspects.length > 0) {
        console.log('=== HIGH QUALITY PROSPECTS ===');
        const highQuality = finalProspects.filter(p => p.quality === 'High');
        if (highQuality.length > 0) {
            highQuality.forEach((prospect, i) => {
                console.log(`${i+1}. @${prospect.username} [Score: ${prospect.score}]`);
                console.log(`   "${prospect.text.substring(0, 100)}..."`);
                console.log('');
            });
        } else {
            console.log('No high-quality prospects found');
        }
        
        console.log('=== MEDIUM QUALITY PROSPECTS ===');
        const mediumQuality = finalProspects.filter(p => p.quality === 'Medium');
        if (mediumQuality.length > 0) {
            mediumQuality.forEach((prospect, i) => {
                console.log(`${i+1}. @${prospect.username} [Score: ${prospect.score}]`);
                console.log(`   "${prospect.text.substring(0, 80)}..."`);
            });
        } else {
            console.log('No medium-quality prospects found');
        }
        
        console.log('=== ALL PROSPECTS (Top 10) ===');
        finalProspects.slice(0, 10).forEach((prospect, i) => {
            console.log(`${i+1}. @${prospect.username} [${prospect.quality}] [Score: ${prospect.score}]`);
            console.log(`   "${prospect.text.substring(0, 60)}..."`);
        });
        
        // Debug: Show HTML structure of first few prospects
        console.log('=== DEBUG: HTML STRUCTURE SAMPLES ===');
        finalProspects.slice(0, 3).forEach((prospect, i) => {
            console.log(`Sample ${i+1} (@${prospect.username}):`);
            console.log(prospect.containerHTML);
            console.log('---');
        });
        
    } else {
        console.log('❌ No prospects extracted.');
        console.log('💡 This might mean:');
        console.log('   - Comments are loaded dynamically (try scrolling)');
        console.log('   - Comments are in a separate section/tab');
        console.log('   - The page structure is different than expected');
        
        // Show some debug info
        console.log('=== DEBUG INFO ===');
        console.log('Sample profile links found:');
        Array.from(profileLinks).slice(0, 5).forEach((link, i) => {
            console.log(`${i+1}. ${link.href} - Container text: "${link.closest('div, section, article')?.textContent.substring(0, 100)}..."`);
        });
    }
    
    return finalProspects;
})();
```

## Try This Improved Version!

This V2 script is much smarter about:
- **Finding comment text** near profile links
- **Quality scoring** based on positive keywords
- **Better text cleaning** to remove UI elements
- **Detailed debugging** to show what it's finding

**Instructions:**
1. Go to the MakerWorld page: https://makerworld.com/en/models/23592-ikea-skadis-hook#profileId-28439
2. **Make sure to scroll down** to load all comments first!
3. Press F12 → Console tab
4. Paste the V2 script above
5. Check the results!

The V2 version should give us much better insight into MakerWorld's comment structure and hopefully extract some actual comment content instead of just usernames.
