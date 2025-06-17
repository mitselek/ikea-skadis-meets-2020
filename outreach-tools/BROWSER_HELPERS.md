# Browser Helper Scripts for MakerWorld Data Collection

## Quick Data Extraction Scripts

Copy and paste these into your browser's developer console (F12) while on MakerWorld pages.

### 1. Extract Current User Info from Profile Page

```javascript
// Run this on a user's profile page (e.g., https://makerworld.com/en/@username/upload)
(function() {
    const username = window.location.pathname.split('/')[2].replace('@', '');
    const profileUrl = window.location.href.split('/upload')[0] + '/upload';
    
    // Try to extract user ID from page elements
    let userId = 'UNKNOWN';
    const userElements = document.querySelectorAll('[data-user-id], [data-userid], .user-id');
    for (let elem of userElements) {
        if (elem.dataset.userId || elem.dataset.userid) {
            userId = elem.dataset.userId || elem.dataset.userid;
            break;
        }
    }
    
    // Count projects (approximate)
    const projectCount = document.querySelectorAll('.model-card, .project-item, .upload-item').length;
    
    // Check for SKADIS-related content
    const pageText = document.body.textContent.toLowerCase();
    const skadisCount = (pageText.match(/skadis|skådis/g) || []).length;
    
    const messageUrl = userId !== 'UNKNOWN' ? 
        `https://makerworld.com/en/my/message?recvID=${userId}` : 
        'MANUAL_LOOKUP_REQUIRED';
    
    const result = {
        username: username,
        profile_url: profileUrl,
        message_url: messageUrl,
        project_count: projectCount,
        skadis_mentions: skadisCount,
        collection_date: new Date().toISOString().split('T')[0]
    };
    
    console.log('=== USER DATA COLLECTED ===');
    console.log(JSON.stringify(result, null, 2));
    console.log('=== CSV FORMAT ===');
    console.log(`${result.collection_date},${result.username},${result.profile_url},${result.message_url},MANUAL_ENTRY,Medium,Medium,${result.skadis_mentions},Unknown,Medium,"${result.project_count} projects found",Not_Contacted`);
    
    return result;
})();
```

### 2. Extract Comments from Project Page

```javascript
// Run this on a project page to get commenter information
// IMPORTANT: Scroll down to load comments first, or click "Load More" if needed
(function() {
    const comments = [];
    
    // MakerWorld-specific selectors (update as needed)
    const commentSelectors = [
        '.comment-item',
        '.comment-list .comment',
        '[data-testid="comment"]',
        '.review-item',
        '.user-comment',
        '.comment-content'
    ];
    
    // Try multiple selector strategies
    let commentElements = [];
    for (let selector of commentSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            commentElements = elements;
            console.log(`Found ${elements.length} comments using selector: ${selector}`);
            break;
        }
    }
    
    // If no comments found with specific selectors, try broader search
    if (commentElements.length === 0) {
        console.log('No comments found with specific selectors, trying broader search...');
        // Look for elements containing usernames and comment-like text
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            const text = el.textContent;
            if (text && text.length > 20 && text.length < 500 && 
                el.querySelector('img[src*="avatar"], .avatar, [data-username]')) {
                commentElements.push(el);
            }
        });
    }
    
    // Extract comment data
    commentElements.forEach((comment, index) => {
        try {
            // Multiple strategies for finding username
            let username = '';
            const usernameSelectors = [
                '.username', '.user-name', '.commenter', '[data-username]',
                '.author', '.reviewer', '.poster', 'a[href*="/@"]'
            ];
            
            for (let selector of usernameSelectors) {
                const usernameEl = comment.querySelector(selector);
                if (usernameEl) {
                    username = usernameEl.textContent.trim();
                    break;
                }
            }
            
            // Extract from URL if found in link
            if (!username) {
                const userLink = comment.querySelector('a[href*="/@"]');
                if (userLink) {
                    const match = userLink.href.match(/@([^\/]+)/);
                    username = match ? match[1] : '';
                }
            }
            
            // Get comment text
            let text = '';
            const textSelectors = [
                '.comment-text', '.content', '.message', '.review-text',
                '.comment-body', '.text-content'
            ];
            
            for (let selector of textSelectors) {
                const textEl = comment.querySelector(selector);
                if (textEl) {
                    text = textEl.textContent.trim();
                    break;
                }
            }
            
            // If no specific text element, use the whole comment but clean it
            if (!text && comment.textContent) {
                text = comment.textContent.trim();
                // Remove common UI elements
                text = text.replace(/Like|Reply|Share|Report|Edit|Delete/gi, '');
                text = text.replace(/\d+\s*(likes?|replies?|hours?|days?|months?)\s*ago/gi, '');
            }
            
            // Get date/time
            let date = '';
            const dateSelectors = ['.date', '.time', '.timestamp', '.ago', '[datetime]'];
            for (let selector of dateSelectors) {
                const dateEl = comment.querySelector(selector);
                if (dateEl) {
                    date = dateEl.textContent.trim() || dateEl.getAttribute('datetime') || '';
                    break;
                }
            }
            
            if (username && text && text.length > 10) {
                comments.push({
                    username: username,
                    text: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
                    date: date,
                    quality: text.length > 80 ? 'High' : text.length > 30 ? 'Medium' : 'Low',
                    element_html: comment.outerHTML.substring(0, 200) + '...'
                });
            }
        } catch (e) {
            console.log('Error processing comment:', e);
        }
    });
    
    console.log('=== COMMENTS EXTRACTION RESULTS ===');
    console.log(`Found ${comments.length} total comments on this project`);
    
    // Create unique commenters list
    const uniqueCommenters = new Map();
    comments.forEach(comment => {
        const username = comment.username.toLowerCase();
        if (!uniqueCommenters.has(username)) {
            uniqueCommenters.set(username, {
                username: comment.username,
                commentCount: 1,
                bestComment: comment,
                allComments: [comment]
            });
        } else {
            const existing = uniqueCommenters.get(username);
            existing.commentCount++;
            existing.allComments.push(comment);
            // Keep the highest quality comment as the best one
            if (comment.quality === 'High' && existing.bestComment.quality !== 'High') {
                existing.bestComment = comment;
            } else if (comment.quality === 'Medium' && existing.bestComment.quality === 'Low') {
                existing.bestComment = comment;
            }
        }
    });
    
    const uniqueCommentersList = Array.from(uniqueCommenters.values());
    console.log(`Found ${uniqueCommentersList.length} unique commenters`);
    
    if (comments.length === 0) {
        console.log('No comments found. Try these steps:');
        console.log('1. Scroll down to load comments');
        console.log('2. Click "Load More Comments" if present');
        console.log('3. Wait for page to fully load');
        console.log('4. Check if comments are in a tab that needs to be clicked');
        
        // Check for comment count indicators
        const commentCounters = document.querySelectorAll('*');
        commentCounters.forEach(el => {
            const text = el.textContent;
            if (text && text.match(/comment.+\(\d+\)|rating.+\(\d+\)|\d+\s*comments?/i)) {
                console.log('Found comment indicator:', text.trim());
            }
        });
    }
    
    console.log('=== ALL UNIQUE COMMENTERS ===');
    uniqueCommentersList.forEach((commenter, i) => {
        const commentCountText = commenter.commentCount > 1 ? ` (${commenter.commentCount} comments)` : '';
        console.log(`${i+1}. @${commenter.username}${commentCountText}: ${commenter.bestComment.text.substring(0, 100)}... [${commenter.bestComment.quality}]`);
    });
    
    console.log('=== HIGH QUALITY UNIQUE COMMENTERS ===');
    const highQualityCommenters = uniqueCommentersList.filter(c => c.bestComment.quality === 'High');
    highQualityCommenters.forEach(commenter => {
        const commentCountText = commenter.commentCount > 1 ? ` (${commenter.commentCount} comments)` : '';
        console.log(`@${commenter.username}${commentCountText} - "${commenter.bestComment.text.substring(0, 80)}..."`);
    });
    
    console.log('=== MEDIUM+ QUALITY UNIQUE COMMENTERS ===');
    const mediumPlusCommenters = uniqueCommentersList.filter(c => c.bestComment.quality === 'High' || c.bestComment.quality === 'Medium');
    mediumPlusCommenters.forEach(commenter => {
        const commentCountText = commenter.commentCount > 1 ? ` (${commenter.commentCount} comments)` : '';
        console.log(`@${commenter.username}${commentCountText} - [${commenter.bestComment.quality}]`);
    });
    
    // Return structured data for potential CSV export
    console.log('=== CSV READY FORMAT (HIGH QUALITY UNIQUE COMMENTERS) ===');
    highQualityCommenters.forEach(commenter => {
        const today = new Date().toISOString().split('T')[0];
        const engagementLevel = commenter.commentCount > 2 ? 'High' : commenter.commentCount > 1 ? 'Medium' : 'Medium';
        console.log(`${today},${commenter.username},TO_LOOKUP,TO_LOOKUP,Current_Project,High,${engagementLevel},Unknown,${commenter.bestComment.date},High,"${commenter.bestComment.text.replace(/"/g, "'").substring(0, 50)}... (${commenter.commentCount} comments)",Not_Contacted`);
    });
    
    return comments;
})();
```

### 3. Quick Page Analysis

```javascript
// Run this to quickly assess if a page/user is worth pursuing
(function() {
    const url = window.location.href;
    const title = document.title;
    const pageText = document.body.textContent.toLowerCase();
    
    // Check for SKADIS relevance
    const skadisTerms = ['skadis', 'skådis', 'pegboard', 'hook', 'organizer', 'workshop'];
    const relevanceScore = skadisTerms.reduce((score, term) => {
        return score + (pageText.match(new RegExp(term, 'g')) || []).length;
    }, 0);
    
    // Check activity level
    const hasRecentActivity = pageText.includes('2025') || pageText.includes('2024');
    
    // Better engagement detection for MakerWorld
    const engagement = {
        comments: 0,
        likes: 0,
        makes: 0
    };
    
    // Look for MakerWorld-specific comment indicators
    const commentIndicators = document.querySelectorAll('*');
    commentIndicators.forEach(el => {
        const text = el.textContent;
        if (text) {
            // Match patterns like "Comment & Rating (749)" or "749 comments"
            const commentMatch = text.match(/comment[^0-9]*\((\d+)\)|(\d+)\s*comments?/i);
            if (commentMatch) {
                engagement.comments = parseInt(commentMatch[1] || commentMatch[2]);
            }
            
            // Match like indicators
            const likeMatch = text.match(/like[^0-9]*\((\d+)\)|(\d+)\s*likes?/i);
            if (likeMatch) {
                engagement.likes = parseInt(likeMatch[1] || likeMatch[2]);
            }
            
            // Match make/download indicators
            const makeMatch = text.match(/made?[^0-9]*\((\d+)\)|download[^0-9]*\((\d+)\)|(\d+)\s*(?:made?|downloads?)/i);
            if (makeMatch) {
                engagement.makes = parseInt(makeMatch[1] || makeMatch[2] || makeMatch[3]);
            }
        }
    });
    
    // Alternative: count actual elements if numbers aren't found
    if (engagement.comments === 0) {
        engagement.comments = document.querySelectorAll('.comment, .comment-item, .review').length;
    }
    if (engagement.likes === 0) {
        engagement.likes = document.querySelectorAll('.like, .heart, .favorite, [aria-label*="like"]').length;
    }
    if (engagement.makes === 0) {
        engagement.makes = document.querySelectorAll('.make, .print, .download, [data-testid*="download"]').length;
    }
    
    // Calculate total engagement score
    const totalEngagement = engagement.comments + engagement.likes + engagement.makes;
    
    const assessment = {
        url: url,
        title: title,
        relevance_score: relevanceScore,
        recent_activity: hasRecentActivity,
        engagement: engagement,
        total_engagement: totalEngagement,
        recommendation: relevanceScore > 5 && totalEngagement > 10 ? 'HIGH PRIORITY' : 
                      relevanceScore > 2 && totalEngagement > 5 ? 'MEDIUM PRIORITY' : 'LOW PRIORITY'
    };
    
    console.log('=== PAGE ASSESSMENT ===');
    console.log(JSON.stringify(assessment, null, 2));
    
    // Additional debugging info
    console.log('=== DETECTED ENGAGEMENT INDICATORS ===');
    commentIndicators.forEach(el => {
        const text = el.textContent;
        if (text && text.match(/comment[^0-9]*\(\d+\)|rating[^0-9]*\(\d+\)|\d+\s*comments?/i)) {
            console.log('Comment indicator:', text.trim().substring(0, 100));
        }
    });
    
    return assessment;
})();
```

## Usage Instructions

### Setup Process

1. **Open Developer Console**
   - Press F12 in your browser
   - Go to the "Console" tab
   - Keep it open while browsing MakerWorld

2. **Navigate to Target Pages**
   - Start with your project's "Related Models" section
   - Visit each related project
   - Visit commenter profile pages

3. **Run Scripts**
   - Copy and paste the appropriate script
   - Press Enter to execute
   - Copy the output to your CSV file

### Workflow Example

1. **Visit your project page**
   - Run script #3 to confirm it's working
   - Navigate to "Related Models"

2. **For each related project:**
   - Run script #3 (quick assessment)
   - If HIGH/MEDIUM priority, run script #2 (extract comments)
   - Note high-quality commenters

3. **For each high-quality commenter:**
   - Visit their profile page
   - Run script #1 (extract user info)
   - Copy CSV output to your tracking spreadsheet

### Manual Fallbacks

If scripts don't work on certain pages:

1. **Username**: Copy from URL or profile display name
2. **Profile URL**: `https://makerworld.com/en/@USERNAME/upload`
3. **User ID**: Look in page source or try messaging link
4. **Message URL**: `https://makerworld.com/en/my/message?recvID=USERID`

## Safety Notes

- These scripts only read publicly available information
- They don't modify any data or send requests
- They respect the same data you can see manually
- If a script doesn't work, fall back to manual collection

## Troubleshooting

### Script Not Working?

- Make sure you're on the right type of page
- Check if MakerWorld has updated their HTML structure
- Try refreshing the page and running again

### No User ID Found?

- Try visiting the user's profile and looking for message/contact buttons
- Check the browser's Network tab when clicking "Message" button
- Use manual lookup: search for the user in MakerWorld's message system

### Data Quality Issues?

- Always verify username manually
- Double-check profile URLs work
- Test message URLs before bulk outreach

### MakerWorld-Specific Issues

#### Comments Not Detected?

1. **Try this diagnostic script first:**

```javascript
// Debug script to find comment structure
(function() {
    console.log('=== DEBUGGING COMMENT STRUCTURE ===');
    
    // Check for comment count in page text
    const pageText = document.body.textContent;
    const commentMatches = pageText.match(/comment[^0-9]*\((\d+)\)|(\d+)\s*comments?/gi);
    console.log('Comment count indicators found:', commentMatches);
    
    // Look for comment-related elements
    const commentKeywords = ['comment', 'review', 'rating', 'feedback'];
    commentKeywords.forEach(keyword => {
        const elements = document.querySelectorAll(`[class*="${keyword}"], [id*="${keyword}"], [data-testid*="${keyword}"]`);
        console.log(`Elements with "${keyword}":`, elements.length);
        if (elements.length > 0 && elements.length < 10) {
            Array.from(elements).forEach((el, i) => {
                console.log(`  ${i+1}. ${el.tagName}.${el.className} - "${el.textContent.substring(0, 50)}..."`);
            });
        }
    });
    
    // Check if comments are in tabs or sections
    const tabs = document.querySelectorAll('[role="tab"], .tab, .section-header');
    console.log('Tabs/sections found:', tabs.length);
    Array.from(tabs).forEach((tab, i) => {
        console.log(`  Tab ${i+1}: "${tab.textContent.trim()}"`);
    });
    
    return 'Check console output above';
})();
```

1. **If comments are in a tab:** Click the comments tab first, then run script #2
1. **If comments load dynamically:** Scroll to bottom of page, wait 2-3 seconds, then run script
1. **If comments are paginated:** Click "Load More" or "Show All Comments" first

#### Engagement Numbers Wrong?

The page assessment script now looks for MakerWorld's specific format like "Comment & Rating (749)". If it's still wrong:

1. **Check the exact text format** by running:

```javascript
// Find engagement text patterns
Array.from(document.querySelectorAll('*')).forEach(el => {
    const text = el.textContent;
    if (text && text.match(/\(\d+\)/)) {
        console.log('Found number pattern:', text.trim());
    }
});
```

1. **Update the regex patterns** in script #3 if needed
