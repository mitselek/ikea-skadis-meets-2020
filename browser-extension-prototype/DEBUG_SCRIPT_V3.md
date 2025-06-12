# MakerWorld Comment Finder V3 - Find the Comment Section

This version tries to find where MakerWorld actually puts comments/reviews. Copy and paste this into the browser console:

```javascript
// MakerWorld Comment Section Finder V3
(function() {
    console.log('🔍 MAKERWORLD COMMENT SECTION FINDER V3');
    console.log('URL:', window.location.href);
    
    const prospects = [];
    
    // First, let's find where comments actually live on MakerWorld
    console.log('=== SEARCHING FOR COMMENT SECTIONS ===');
    
    // Strategy 1: Look for comment-related text patterns in the page
    const pageText = document.body.textContent.toLowerCase();
    const commentIndicators = [
        'comment', 'review', 'feedback', 'rating', 'make', 'print', 
        'great', 'awesome', 'perfect', 'love it', 'works', 'printed'
    ];
    
    commentIndicators.forEach(indicator => {
        const count = (pageText.match(new RegExp(indicator, 'g')) || []).length;
        if (count > 0) {
            console.log(`Found "${indicator}": ${count} times`);
        }
    });
    
    // Strategy 2: Look for sections that might contain comments
    console.log('\\n=== LOOKING FOR COMMENT CONTAINERS ===');
    
    const possibleCommentSections = [
        'section[data-testid*="comment"]',
        'div[data-testid*="comment"]',
        'section[data-testid*="review"]',
        'div[data-testid*="review"]',
        '.comments',
        '.reviews',
        '.feedback',
        '#comments',
        '#reviews',
        '[aria-label*="comment"]',
        '[aria-label*="review"]'
    ];
    
    let foundSections = [];
    
    possibleCommentSections.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`Found ${elements.length} elements with selector: ${selector}`);
                foundSections.push(...elements);
            }
        } catch (e) {
            // Ignore selector errors
        }
    });
    
    // Strategy 3: Look for tabs or buttons that might reveal comments
    console.log('\\n=== LOOKING FOR COMMENT TABS/BUTTONS ===');
    
    const possibleTabs = document.querySelectorAll('button, a, div[role="tab"], .tab');
    const commentTabs = [];
    
    possibleTabs.forEach(tab => {
        const text = tab.textContent.toLowerCase();
        if (text.includes('comment') || text.includes('review') || text.includes('feedback') || 
            text.includes('make') || text.includes('rating')) {
            console.log(`Found potential comment tab: "${tab.textContent.trim()}"`);
            commentTabs.push(tab);
        }
    });
    
    // Strategy 4: Look for sections with lots of user profile links (likely comment areas)
    console.log('\\n=== ANALYZING SECTIONS WITH MULTIPLE USERS ===');
    
    const allSections = document.querySelectorAll('section, div[class*="section"], div[class*="container"], main');
    const sectionsWithUsers = [];
    
    allSections.forEach(section => {
        const userLinks = section.querySelectorAll('a[href*="/@"]');
        if (userLinks.length >= 3) { // Sections with 3+ user links might be comment areas
            const uniqueUsers = new Set();
            userLinks.forEach(link => {
                const match = link.href.match(/@([^/]+)/);
                if (match) uniqueUsers.add(match[1]);
            });
            
            if (uniqueUsers.size >= 3) {
                console.log(`Section with ${uniqueUsers.size} unique users found`);
                console.log(`First 100 chars: "${section.textContent.substring(0, 100)}..."`);
                sectionsWithUsers.push({
                    section: section,
                    userCount: uniqueUsers.size,
                    users: Array.from(uniqueUsers).slice(0, 5),
                    textSample: section.textContent.substring(0, 200)
                });
            }
        }
    });
    
    // Sort by user count
    sectionsWithUsers.sort((a, b) => b.userCount - a.userCount);
    
    console.log('\\n=== TOP SECTIONS WITH MULTIPLE USERS ===');
    sectionsWithUsers.slice(0, 3).forEach((item, i) => {
        console.log(`${i+1}. Section with ${item.userCount} users:`);
        console.log(`   Users: ${item.users.join(', ')}`);
        console.log(`   Text: "${item.textSample}"`);
        console.log(`   HTML preview: ${item.section.outerHTML.substring(0, 200)}...`);
        console.log('---');
    });
    
    // Strategy 5: Try to extract from the most promising section
    if (sectionsWithUsers.length > 0) {
        console.log('\\n=== EXTRACTING FROM MOST PROMISING SECTION ===');
        
        const bestSection = sectionsWithUsers[0].section;
        const userLinks = bestSection.querySelectorAll('a[href*="/@"]');
        
        userLinks.forEach((link, index) => {
            try {
                const match = link.href.match(/@([^/]+)/);
                if (!match) return;
                
                const username = match[1];
                
                // Look for text content near this user link
                let container = link.closest('div, section, article, li, p');
                let attempts = 0;
                
                while (container && attempts < 3) {
                    let text = container.textContent.trim();
                    text = text.replace(/\\s+/g, ' ');
                    text = text.replace(/Like|Reply|Share|Report|Edit|Delete|Follow/gi, '');
                    
                    // Remove username from text
                    text = text.replace(new RegExp(username, 'gi'), '');
                    text = text.replace(/^[@\\s]*/, '');
                    
                    if (text.length >= 20 && text.length <= 500) {
                        let quality = 'Low';
                        let score = 0;
                        
                        // Score based on positive keywords
                        const positiveWords = ['great', 'awesome', 'perfect', 'love', 'excellent', 'amazing', 'brilliant', 'fantastic', 'wonderful', 'good', 'nice', 'works', 'printed', 'useful', 'helpful'];
                        
                        positiveWords.forEach(word => {
                            if (text.toLowerCase().includes(word)) {
                                score += word.length > 5 ? 3 : 1;
                            }
                        });
                        
                        if (text.length > 50) score += 1;
                        if (text.length > 100) score += 2;
                        
                        if (score >= 4) quality = 'High';
                        else if (score >= 2) quality = 'Medium';
                        
                        prospects.push({
                            username: username,
                            text: text.substring(0, 150),
                            quality: quality,
                            score: score
                        });
                        
                        break; // Found good content, stop looking
                    }
                    
                    // Try parent container
                    container = container.parentElement;
                    attempts++;
                }
            } catch (e) {
                console.log(`Error processing user link ${index}:`, e);
            }
        });
    }
    
    // Final results
    console.log('\\n=== FINAL EXTRACTION RESULTS ===');
    
    if (prospects.length > 0) {
        const uniqueProspects = new Map();
        prospects.forEach(prospect => {
            const key = prospect.username.toLowerCase();
            if (!uniqueProspects.has(key) || prospect.score > uniqueProspects.get(key).score) {
                uniqueProspects.set(key, prospect);
            }
        });
        
        const finalProspects = Array.from(uniqueProspects.values())
            .sort((a, b) => b.score - a.score);
        
        console.log(`Found ${finalProspects.length} prospects!`);
        
        finalProspects.forEach((prospect, i) => {
            console.log(`${i+1}. @${prospect.username} [${prospect.quality}] [Score: ${prospect.score}]`);
            console.log(`   "${prospect.text}"`);
            console.log('');
        });
        
        return finalProspects;
        
    } else {
        console.log('❌ Still no prospects found.');
        console.log('\\n💡 RECOMMENDATIONS:');
        console.log('1. Try clicking on a "Comments" or "Reviews" tab if you see one');
        console.log('2. Scroll down to load more content');
        console.log('3. Check if comments are behind a login wall');
        console.log('4. Look for a "Show more" or "Load comments" button');
        
        if (commentTabs.length > 0) {
            console.log('\\n🎯 TRY CLICKING THESE TABS FIRST:');
            commentTabs.forEach((tab, i) => {
                console.log(`${i+1}. "${tab.textContent.trim()}"`);
            });
            console.log('Then run this script again!');
        }
        
        return [];
    }
})();
```

## What This V3 Script Does:

1. **🔍 Searches for comment sections** - Looks for dedicated comment areas
2. **📋 Finds comment tabs** - Looks for buttons/tabs that might reveal comments  
3. **👥 Analyzes user clusters** - Finds sections with multiple users (likely comments)
4. **🎯 Extracts from best section** - Tries to get actual comment content
5. **💡 Gives recommendations** - Tells you what to try next

## Try This:

1. Go to: https://makerworld.com/en/models/23592-ikea-skadis-hook#profileId-28439
2. **Look for any tabs** like "Comments", "Reviews", "Community", etc.
3. **Scroll down** to make sure everything is loaded
4. Paste the V3 script and run it
5. Check if it recommends clicking any specific tabs!

This should finally help us find where MakerWorld hides their comments! 🕵️‍♂️
