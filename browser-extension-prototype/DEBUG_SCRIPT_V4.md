# MakerWorld Comment Finder V4 - Deep Structure Analysis

Based on V3 results, this version looks for the actual comment content structure on MakerWorld.

```javascript
// MakerWorld Comment Finder V4 - Deep Analysis
(function() {
    console.log('🔍 MAKERWORLD COMMENT FINDER V4 - DEEP ANALYSIS');
    console.log('URL:', window.location.href);
    
    const prospects = [];
    
    // V3 found lots of engagement words, so let's find where they actually are
    console.log('=== DEEP TEXT ANALYSIS ===');
    
    // Strategy 1: Find all text nodes that contain engagement keywords
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
    
    const allTextNodes = getTextNodes(document.body);
    const engagementNodes = [];
    
    const engagementKeywords = ['great', 'awesome', 'perfect', 'love', 'works', 'printed', 'amazing', 'excellent', 'fantastic', 'good', 'nice', 'useful', 'helpful'];
    
    allTextNodes.forEach(node => {
        const text = node.nodeValue.toLowerCase();
        const hasEngagement = engagementKeywords.some(keyword => text.includes(keyword));
        
        if (hasEngagement && text.length > 15 && text.length < 200) {
            engagementNodes.push({
                text: node.nodeValue.trim(),
                element: node.parentElement,
                html: node.parentElement.outerHTML.substring(0, 300)
            });
        }
    });
    
    console.log(`Found ${engagementNodes.length} text nodes with engagement keywords:`);
    engagementNodes.slice(0, 5).forEach((item, i) => {
        console.log(`${i+1}. "${item.text}"`);
        console.log(`   Element: ${item.element.tagName.toLowerCase()}`);
        console.log(`   HTML: ${item.html}...`);
        console.log('---');
    });
    
    // Strategy 2: Look for profile sections that might contain user content
    console.log('\n=== ANALYZING PROFILE SECTIONS ===');
    
    const profileLinks = document.querySelectorAll('a[href*="/@"]');
    console.log(`Found ${profileLinks.length} profile links`);
    
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
            
            // Skip if container is too big (probably page-level) or too small
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
    
    console.log(`Found ${profileSections.size} users with associated content:`);
    
    // Strategy 3: Extract and score the best content
    Array.from(profileSections.values()).forEach(profile => {
        let text = profile.text;
        
        // Clean up common UI elements
        text = text.replace(/Like|Reply|Share|Report|Edit|Delete|Follow|Subscribe|Download|View|Show|Hide/gi, '');
        text = text.replace(/\d+\s*(likes?|views?|downloads?|follows?)/gi, '');
        text = text.replace(/^\s*[@#]\w+\s*/, ''); // Remove @mentions and #hashtags at start
        text = text.replace(/\s+/g, ' ').trim();
        
        if (text.length >= 20 && text.length <= 300) {
            let score = 0;
            let quality = 'Low';
            
            // Score based on engagement indicators
            const positiveWords = ['great', 'awesome', 'perfect', 'love', 'excellent', 'amazing', 'brilliant', 'fantastic', 'wonderful', 'good', 'nice', 'works', 'printed', 'useful', 'helpful', 'recommend', 'impressed', 'solid', 'quality'];
            
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
                    profileLink: profile.link
                });
            }
        }
    });
    
    // Strategy 4: Look for specific MakerWorld comment patterns
    console.log('\n=== LOOKING FOR MAKERWORLD-SPECIFIC PATTERNS ===');
    
    // Look for elements that might be comment containers
    const possibleCommentElements = document.querySelectorAll('div[class*="comment"], div[class*="review"], div[class*="feedback"], article, .card, .item');
    
    console.log(`Checking ${possibleCommentElements.length} potential comment elements...`);
    
    possibleCommentElements.forEach((element, index) => {
        const text = element.textContent.trim();
        const hasUserLink = element.querySelector('a[href*="/@"]');
        
        if (hasUserLink && text.length > 30 && text.length < 500) {
            const userMatch = hasUserLink.href.match(/@([^/]+)/);
            if (userMatch) {
                const username = userMatch[1];
                console.log(`Potential comment ${index}: @${username}`);
                console.log(`Text preview: "${text.substring(0, 100)}..."`);
            }
        }
    });
    
    // Final results
    console.log('\n=== FINAL RESULTS ===');
    
    if (prospects.length > 0) {
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
        
        console.log(`🎉 Found ${finalProspects.length} prospects with content!`);
        
        finalProspects.forEach((prospect, i) => {
            console.log(`${i+1}. @${prospect.username} [${prospect.quality}] [Score: ${prospect.score}]`);
            console.log(`   Profile: ${prospect.profileLink}`);
            console.log(`   "${prospect.text}"`);
            console.log('');
        });
        
        return finalProspects;
        
    } else {
        console.log('❌ Still no meaningful content found.');
        console.log('\n🔍 DEBUGGING INFO:');
        console.log(`- Found ${profileLinks.length} profile links`);
        console.log(`- Found ${engagementNodes.length} engagement text nodes`);
        console.log(`- Analyzed ${profileSections.size} user content sections`);
        
        console.log('\n💡 NEXT STEPS:');
        console.log('1. Try scrolling down to load more content');
        console.log('2. Look for "Load more" or "Show comments" buttons');
        console.log('3. Check if you need to be logged in to see comments');
        console.log('4. Try clicking on user profiles (@username links) to see their activity');
        
        return [];
    }
})();
```

## What V4 Does Differently:

1. **🔍 Deep text analysis** - Finds all text nodes with engagement keywords
2. **👤 Profile content mapping** - Associates text content with user profiles  
3. **🧹 Better text cleaning** - Removes UI elements and noise
4. **📊 Smarter scoring** - Better quality assessment
5. **🎯 MakerWorld-specific patterns** - Looks for their specific comment structure

## Try This:

1. **Stay on the same page** where you ran V3
2. **Scroll down** to make sure all content is loaded
3. **Paste and run the V4 script**
4. This should finally extract actual user comments and text!

This version should find the actual comment content that V3 detected! 🎯
