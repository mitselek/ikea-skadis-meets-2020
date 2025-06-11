# Multi-Project Intelligence Crawler

## Automated Related Project Discovery

This script automatically finds and queues related SKÅDIS projects for analysis.

### 1. Project Discovery Script

```javascript
// Run this on your MakerWorld project page to find all related SKÅDIS projects
(function() {
    console.log('=== SKÅDIS PROJECT DISCOVERY STARTING ===');
    
    const relatedProjects = new Set(); // Use Set to avoid duplicates
    const currentUrl = window.location.href;
    
    // Strategy 1: Find explicit "Related Models" section
    const relatedLinks = document.querySelectorAll('a[href*="/models/"]');
    relatedLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const href = link.href;
        
        // Check if it's SKÅDIS related
        if ((text.includes('skadis') || text.includes('skådis') || 
             text.includes('pegboard') || text.includes('hook') || 
             text.includes('organizer')) && href.includes('/models/')) {
            relatedProjects.add({
                url: href,
                title: link.textContent.trim(),
                discoveredVia: 'related_links',
                relevanceIndicators: text.match(/(skadis|skådis|pegboard|hook|organizer)/gi) || []
            });
        }
    });
    
    // Strategy 2: Search page content for project mentions
    const pageText = document.body.textContent;
    const projectUrls = pageText.match(/https:\/\/makerworld\.com\/en\/models\/\d+[^\s]*/g) || [];
    projectUrls.forEach(url => {
        if (!relatedProjects.has(url)) {
            relatedProjects.add({
                url: url,
                title: 'Discovered from page content',
                discoveredVia: 'content_scan',
                relevanceIndicators: ['mentioned_in_content']
            });
        }
    });
    
    // Strategy 3: Find similar projects by same authors who made SKÅDIS content
    const authorLinks = document.querySelectorAll('a[href*="/@"]');
    const skadisAuthors = [];
    authorLinks.forEach(link => {
        const nearbyText = link.parentElement.textContent.toLowerCase();
        if (nearbyText.includes('skadis') || nearbyText.includes('skådis')) {
            skadisAuthors.push({
                username: link.href.split('/@')[1].split('/')[0],
                profileUrl: link.href.split('/upload')[0] + '/upload'
            });
        }
    });
    
    const relatedProjectsArray = Array.from(relatedProjects);
    
    console.log(`=== DISCOVERY RESULTS ===`);
    console.log(`Found ${relatedProjectsArray.length} potentially related SKÅDIS projects`);
    
    // Sort by relevance
    const sortedProjects = relatedProjectsArray.sort((a, b) => {
        return b.relevanceIndicators.length - a.relevanceIndicators.length;
    });
    
    console.log('=== HIGH RELEVANCE PROJECTS ===');
    sortedProjects.slice(0, 10).forEach((project, i) => {
        console.log(`${i+1}. ${project.title}`);
        console.log(`   URL: ${project.url}`);
        console.log(`   Relevance: ${project.relevanceIndicators.join(', ')}`);
        console.log(`   Discovery: ${project.discoveredVia}`);
        console.log('');
    });
    
    console.log('=== SKÅDIS AUTHORS TO INVESTIGATE ===');
    skadisAuthors.forEach((author, i) => {
        console.log(`${i+1}. @${author.username} - ${author.profileUrl}`);
    });
    
    console.log('=== CRAWL QUEUE (Copy these URLs) ===');
    sortedProjects.forEach(project => {
        console.log(project.url);
    });
    
    return {
        projects: sortedProjects,
        authors: skadisAuthors,
        totalFound: relatedProjectsArray.length
    };
})();
```

### 2. Batch Analysis Script

```javascript
// Run this after discovering projects to analyze multiple projects efficiently
(function() {
    console.log('=== BATCH PROJECT ANALYSIS ===');
    
    // This would be your list of discovered project URLs
    const projectUrls = [
        // Paste URLs from the crawler results here
        'https://makerworld.com/en/models/632335-ikea-skadis-hook',
        // Add more URLs...
    ];
    
    const analysisResults = [];
    
    // Since we can't actually navigate between pages in a script,
    // this provides a framework for manual batch processing
    
    console.log('MANUAL BATCH PROCESS:');
    console.log('1. Open each URL in a new tab');
    console.log('2. Run the page assessment script (#3)');
    console.log('3. If HIGH/MEDIUM priority, run comment extraction (#2)');
    console.log('4. Compile results in your tracking spreadsheet');
    
    console.log('=== URLS TO PROCESS ===');
    projectUrls.forEach((url, i) => {
        console.log(`${i+1}. ${url}`);
    });
    
    console.log('=== BATCH TRACKING TEMPLATE ===');
    console.log('Project_URL,Assessment_Score,Total_Comments,High_Quality_Commenters,Analysis_Date,Priority_Level');
    
    return projectUrls;
})();
```

### 3. Cross-Project User Intelligence

```javascript
// Enhanced user analysis that tracks users across multiple projects
(function() {
    const userDatabase = new Map();
    
    // This would integrate with your existing comment extraction script
    function addUserToDatabase(username, projectUrl, comment) {
        const key = username.toLowerCase();
        
        if (!userDatabase.has(key)) {
            userDatabase.set(key, {
                username: username,
                projects: [],
                totalComments: 0,
                qualityScore: 0,
                skadisEngagement: 0,
                firstSeen: new Date().toISOString(),
                lastSeen: new Date().toISOString()
            });
        }
        
        const user = userDatabase.get(key);
        user.projects.push({
            url: projectUrl,
            comment: comment,
            date: new Date().toISOString()
        });
        user.totalComments++;
        user.lastSeen = new Date().toISOString();
        
        // Update quality score
        if (comment.quality === 'High') user.qualityScore += 3;
        else if (comment.quality === 'Medium') user.qualityScore += 2;
        else user.qualityScore += 1;
        
        // Update SKÅDIS engagement
        const commentText = comment.text.toLowerCase();
        if (commentText.includes('skadis') || commentText.includes('skådis')) {
            user.skadisEngagement++;
        }
    }
    
    // Export top prospects
    function getTopProspects(minProjects = 2, minQuality = 4) {
        const prospects = Array.from(userDatabase.values())
            .filter(user => user.projects.length >= minProjects && user.qualityScore >= minQuality)
            .sort((a, b) => b.qualityScore - a.qualityScore);
        
        console.log('=== TOP CROSS-PROJECT PROSPECTS ===');
        prospects.slice(0, 20).forEach((user, i) => {
            console.log(`${i+1}. @${user.username}`);
            console.log(`   Projects: ${user.projects.length}`);
            console.log(`   Quality Score: ${user.qualityScore}`);
            console.log(`   SKÅDIS Mentions: ${user.skadisEngagement}`);
            console.log(`   Last Seen: ${user.lastSeen.split('T')[0]}`);
            console.log('');
        });
        
        return prospects;
    }
    
    return { addUserToDatabase, getTopProspects };
})();
```

## Implementation Strategy

### Phase 1: Discovery & Mapping (Week 1)
1. Run the discovery script on your project and top competitors
2. Build a list of 20-30 related SKÅDIS projects
3. Create a project analysis spreadsheet

### Phase 2: Intelligence Gathering (Week 2) 
1. Systematically analyze each discovered project
2. Build cross-project user database
3. Identify power users who comment on multiple projects

### Phase 3: Strategic Outreach (Week 3+)
1. Prioritize users based on cross-project engagement
2. Personalize messages with specific project references
3. Track response rates and optimize

## Expected Results

With this system, you could:
- **Find 500+ qualified prospects** instead of just analyzing one project
- **Identify super-users** who are active across multiple SKÅDIS projects
- **Increase response rates** by referencing multiple touchpoints
- **Build a comprehensive SKÅDIS community map**

This transforms your outreach from single-project targeting to **ecosystem-wide intelligence gathering**!
