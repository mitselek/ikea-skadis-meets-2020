# Debug Test Script - Run in Browser Console

Copy and paste this into the browser console (F12) on the MakerWorld page to test the improved extraction:

```javascript
// Enhanced MakerWorld Comment Extractor - Debug Version
(function() {
    console.log('🔍 ENHANCED MAKERWORLD EXTRACTOR STARTING...');
    console.log('URL:', window.location.href);
    console.log('Title:', document.title);
    
    const comments = [];
    
    // Multiple strategies for finding comments/users
    const strategies = [
        // Strategy 1: Look for user profile links
        () => {
            console.log('Strategy 1: Looking for profile links...');
            const userLinks = document.querySelectorAll('a[href*="/@"]');
            console.log(`Found ${userLinks.length} profile links`);
            return userLinks;
        },
        
        // Strategy 2: Look for elements with user avatars
        () => {
            console.log('Strategy 2: Looking for avatars...');
            const avatars = document.querySelectorAll('img[src*="avatar"], img[src*="profile"], img[alt*="user"]');
            console.log(`Found ${avatars.length} avatar images`);
            return Array.from(avatars).map(img => img.closest('div, section, article')).filter(el => el);
        },
        
        // Strategy 3: Look for engagement text patterns
        () => {
            console.log('Strategy 3: Looking for engagement patterns...');
            const allElements = document.querySelectorAll('div, section, article, p');
            const engagementElements = Array.from(allElements).filter(el => {
                const text = el.textContent;
                return text && text.length > 20 && text.length < 500 && 
                       text.match(/\b(printed|works|great|awesome|perfect|love|thank|nice|good|excellent|amazing)\b/i);
            });
            console.log(`Found ${engagementElements.length} elements with engagement patterns`);
            return engagementElements;
        }
    ];
    
    let bestElements = [];
    
    // Try each strategy
    for (let i = 0; i < strategies.length; i++) {
        try {
            const elements = strategies[i]();
            if (elements.length > 0) {
                bestElements = Array.from(elements);
                console.log(`✅ Using strategy ${i+1} with ${bestElements.length} elements`);
                break;
            }
        } catch (e) {
            console.log(`❌ Strategy ${i+1} failed:`, e);
        }
    }
    
    if (bestElements.length === 0) {
        console.log('❌ No elements found. Debugging page structure...');
        
        // Debug: Show page structure
        console.log('=== PAGE STRUCTURE DEBUG ===');
        console.log('All links:', document.querySelectorAll('a').length);
        console.log('All images:', document.querySelectorAll('img').length);
        console.log('All divs:', document.querySelectorAll('div').length);
        
        // Look for the word "comment" anywhere
        const pageText = document.body.textContent.toLowerCase();
        const commentWords = pageText.match(/comment|review|feedback|rating|user|profile/g);
        console.log('Comment-related words:', commentWords ? commentWords.length : 0);
        
        // Show sample of page text
        console.log('Page text sample:', pageText.substring(0, 500));
        
        return [];
    }
    
    console.log(`Processing ${bestElements.length} elements...`);
    
    // Extract user data from elements
    bestElements.forEach((element, index) => {
        try {
            let username = '';
            let text = '';
            
            // Try to find username
            const userLink = element.querySelector('a[href*="/@"]') || 
                           (element.href && element.href.includes('/@') ? element : null);
            
            if (userLink) {
                const match = userLink.href.match(/@([^/]+)/);
                username = match ? match[1] : userLink.textContent.trim();
            }
            
            // Get text content
            text = element.textContent.trim();
            text = text.replace(/\s+/g, ' ');
            text = text.replace(/Like|Reply|Share|Report|Edit|Delete/gi, '');
            
            if (username && text && text.length > 15) {
                let quality = 'Low';
                if (text.length > 100 || text.match(/printed|works|great|perfect|awesome|excellent|amazing/i)) {
                    quality = 'High';
                } else if (text.length > 50 || text.match(/good|nice|cool|useful|helpful|thanks/i)) {
                    quality = 'Medium';
                }
                
                comments.push({
                    username: username,
                    text: text.substring(0, 200),
                    quality: quality,
                    elementIndex: index
                });
            }
        } catch (e) {
            console.log(`Error processing element ${index}:`, e);
        }
    });
    
    // Remove duplicates
    const uniqueUsers = new Map();
    comments.forEach(comment => {
        const key = comment.username.toLowerCase();
        if (!uniqueUsers.has(key) || comment.quality === 'High') {
            uniqueUsers.set(key, comment);
        }
    });
    
    const finalComments = Array.from(uniqueUsers.values());
    
    console.log('=== EXTRACTION RESULTS ===');
    console.log(`Total unique users found: ${finalComments.length}`);
    
    if (finalComments.length > 0) {
        console.log('=== HIGH QUALITY USERS ===');
        finalComments.filter(c => c.quality === 'High').forEach((comment, i) => {
            console.log(`${i+1}. @${comment.username} - "${comment.text.substring(0, 80)}..."`);
        });
        
        console.log('=== ALL USERS ===');
        finalComments.forEach((comment, i) => {
            console.log(`${i+1}. @${comment.username} [${comment.quality}] - "${comment.text.substring(0, 60)}..."`);
        });
    } else {
        console.log('❌ No users extracted. The page might use a different structure.');
        console.log('💡 Try scrolling down to load more content, or check if comments are in a separate tab.');
    }
    
    return finalComments;
})();
```

## Instructions:

1. **Go to the MakerWorld page**: https://makerworld.com/en/models/23592-ikea-skadis-hook#profileId-28439
2. **Open browser console**: Press F12, go to Console tab
3. **Scroll down** to load any comments that might be dynamically loaded
4. **Paste the script above** and press Enter
5. **Check the results** in the console

This debug version will show you exactly what it's finding and help us figure out how MakerWorld structures their comment system!
