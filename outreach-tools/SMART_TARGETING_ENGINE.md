# Smart Targeting & Personalization Engine

## Advanced User Scoring Algorithm

### 1. Comprehensive User Scoring Script

```javascript
// Enhanced user scoring that considers multiple engagement factors
(function() {
    
    function calculateAdvancedUserScore(user) {
        let score = 0;
        const factors = {};
        
        // Factor 1: Comment Quality (35 points max)
        if (user.bestComment.quality === 'High') {
            factors.commentQuality = 35;
        } else if (user.bestComment.quality === 'Medium') {
            factors.commentQuality = 20;
        } else {
            factors.commentQuality = 8;
        }
        
        // Factor 2: Engagement Frequency (25 points max)
        factors.frequency = Math.min(user.commentCount * 5, 25);
        
        // Factor 3: Technical Depth (20 points max)
        const technicalKeywords = [
            'print', 'material', 'infill', 'layer', 'support', 'tolerance',
            'petg', 'pla', 'abs', 'pctg', 'design', 'modification', 'remix'
        ];
        const commentText = user.bestComment.text.toLowerCase();
        const technicalMatches = technicalKeywords.filter(keyword => 
            commentText.includes(keyword)
        ).length;
        factors.technicalDepth = Math.min(technicalMatches * 3, 20);
        
        // Factor 4: Problem-Solution Orientation (10 points max)
        const problemKeywords = [
            'problem', 'issue', 'fix', 'solution', 'improve', 'better',
            'modification', 'change', 'adjust', 'optimize'
        ];
        const problemMatches = problemKeywords.filter(keyword => 
            commentText.includes(keyword)
        ).length;
        factors.problemOriented = Math.min(problemMatches * 2, 10);
        
        // Factor 5: SKÅDIS Enthusiasm (10 points max)
        const skadisKeywords = ['skadis', 'skådis', 'pegboard', 'organization', 'workshop'];
        const skadisMatches = skadisKeywords.filter(keyword => 
            commentText.includes(keyword)
        ).length;
        factors.skadisEnthusiasm = Math.min(skadisMatches * 2, 10);
        
        // Calculate total score
        score = Object.values(factors).reduce((sum, val) => sum + val, 0);
        
        return {
            totalScore: Math.min(score, 100),
            factors: factors,
            tier: score >= 80 ? 'PREMIUM' : score >= 60 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW'
        };
    }
    
    // Template recommendation based on user profile
    function recommendOptimalTemplate(user, score) {
        const commentText = user.bestComment.text.toLowerCase();
        
        if (score.factors.technicalDepth >= 15 && score.factors.problemOriented >= 6) {
            return {
                template: 'Template 1: Professional & Technical Focus',
                reason: 'User shows high technical expertise and problem-solving orientation'
            };
        }
        
        if (score.factors.problemOriented >= 8) {
            return {
                template: 'Template 2: Problem-Solution Focus',
                reason: 'User frequently discusses problems and solutions'
            };
        }
        
        if (user.commentCount >= 3 && score.factors.skadisEnthusiasm >= 6) {
            return {
                template: 'Template 3: Community & Collaboration Focus',
                reason: 'User is highly engaged in SKÅDIS community'
            };
        }
        
        if (score.totalScore >= 60) {
            return {
                template: 'Template 5: Visual/Image Focus',
                reason: 'High-quality user who would appreciate detailed documentation'
            };
        }
        
        return {
            template: 'Template 4: Brief & Direct',
            reason: 'Standard approach for moderate engagement users'
        };
    }
    
    // Personalization insights
    function generatePersonalizationInsights(user, score) {
        const insights = [];
        const commentText = user.bestComment.text.toLowerCase();
        
        if (score.factors.technicalDepth >= 10) {
            insights.push('Mention technical specifications and print settings');
        }
        
        if (commentText.includes('tool') || commentText.includes('caliper') || commentText.includes('precision')) {
            insights.push('Reference the precision tool mounting capabilities');
        }
        
        if (commentText.includes('stab') || commentText.includes('wobbl') || commentText.includes('loose')) {
            insights.push('Emphasize the stability improvements of two-slot mounting');
        }
        
        if (commentText.includes('cable') || commentText.includes('wire') || commentText.includes('organiz')) {
            insights.push('Highlight the center hole cable management features');
        }
        
        if (user.commentCount >= 3) {
            insights.push('Acknowledge their active community participation');
        }
        
        if (score.factors.problemOriented >= 6) {
            insights.push('Frame your hooks as solutions to common SKÅDIS problems');
        }
        
        return insights;
    }
    
    // Apply to existing commenter data
    window.enhanceCommenterData = function(commenters) {
        return commenters.map(user => {
            const score = calculateAdvancedUserScore(user);
            const template = recommendOptimalTemplate(user, score);
            const insights = generatePersonalizationInsights(user, score);
            
            return {
                ...user,
                advancedScore: score,
                recommendedTemplate: template,
                personalizationInsights: insights,
                priority: score.tier,
                outreachReadiness: score.totalScore >= 50 ? 'READY' : 'SKIP'
            };
        });
    };
    
    console.log('=== ADVANCED SCORING SYSTEM LOADED ===');
    console.log('Run your comment extraction script, then use:');
    console.log('enhancedUsers = enhanceCommenterData(highQualityCommenters);');
    
    return { calculateAdvancedUserScore, recommendOptimalTemplate, generatePersonalizationInsights };
})();
```

### 2. Dynamic Message Generator

```javascript
// Intelligent message personalization based on user profile
(function() {
    
    function generatePersonalizedMessage(user, templateChoice) {
        const baseTemplates = {
            'Template 1': `Hi {name},

I came across your feedback on {project} and noticed you're interested in SKÅDIS accessories. As a fellow maker working with SKÅDIS systems, I thought you might find my latest hook design interesting.

{technical_section}

{specific_benefits}

{project_links}

Would love to hear your thoughts if you check them out!

Best,
Mihkel`,

            'Template 2': `Hi {name},

Saw your comment on {project} - great to meet another SKÅDIS enthusiast!

{problem_section}

{solution_benefits}

{project_links}

Curious to hear if you've had similar {problem_type} issues with standard hooks?

Cheers,
Mihkel`
        };
        
        let message = baseTemplates[templateChoice.template.split(':')[0]] || baseTemplates['Template 1'];
        
        // Basic replacements
        message = message.replace(/{name}/g, user.username);
        message = message.replace(/{project}/g, user.sourceProject || 'your SKÅDIS project');
        
        // Dynamic sections based on user insights
        const insights = user.personalizationInsights || [];
        
        // Technical section
        if (insights.includes('Mention technical specifications and print settings')) {
            message = message.replace(/{technical_section}/g, 
                `I've developed a set of 4 specialized SKÅDIS hooks with detailed technical specifications:

🔧 **Two-slot mounting system** (40mm spacing) for superior stability
🔧 **Four variants**: U, U-o, H, H-o hooks for different applications  
🔧 **Center holes** in o-variants for threading cables, zip-ties, or countersunk screws
🔧 **Optimized print settings** - 15% infill, no supports needed`);
        } else {
            message = message.replace(/{technical_section}/g, 
                `I've developed a set of 4 specialized SKÅDIS hooks that address some common limitations of standard single-slot hooks:`);
        }
        
        // Specific benefits based on user interests
        let benefits = [];
        if (insights.includes('Emphasize the stability improvements of two-slot mounting')) {
            benefits.push('• **No more wobbly hooks** - two mounting points distribute load');
        }
        if (insights.includes('Reference the precision tool mounting capabilities')) {
            benefits.push('• **Secure precision tools** - perfect for calipers, measuring tools');
        }
        if (insights.includes('Highlight the center hole cable management features')) {
            benefits.push('• **Cable management** - center holes for zip-ties and wire routing');
        }
        if (insights.includes('Frame your hooks as solutions to common SKÅDIS problems')) {
            benefits.push('• **Closed loop option** - H-hooks prevent items from sliding off');
        }
        
        if (benefits.length === 0) {
            benefits = [
                '• **Superior stability** with two-slot mounting',
                '• **Versatile applications** with four hook variants',
                '• **Professional documentation** with assembly photos'
            ];
        }
        
        message = message.replace(/{specific_benefits}/g, benefits.join('\n'));
        message = message.replace(/{solution_benefits}/g, benefits.join('\n'));
        
        // Problem-specific language
        const commentText = (user.bestComment?.text || '').toLowerCase();
        let problemType = 'stability';
        if (commentText.includes('organiz')) problemType = 'organization';
        if (commentText.includes('cable') || commentText.includes('wire')) problemType = 'cable management';
        if (commentText.includes('tool')) problemType = 'tool storage';
        
        message = message.replace(/{problem_type}/g, problemType);
        
        // Problem section for Template 2
        message = message.replace(/{problem_section}/g, 
            `I've been frustrated with how single-slot hooks can wiggle and rotate under load, so I designed a two-slot mounting system that completely eliminates this problem. The hooks use standard 40mm SKÅDIS spacing for rock-solid mounting.`);
        
        // Project links
        const projectLinks = `GitHub: https://github.com/michelek/ikea-skadis-adapters
MakerWorld: https://makerworld.com/en/models/1503225-simple-skadis-hook#profileId-1572818`;
        
        message = message.replace(/{project_links}/g, projectLinks);
        
        return message;
    }
    
    window.generatePersonalizedMessage = generatePersonalizedMessage;
    
    console.log('=== PERSONALIZATION ENGINE LOADED ===');
    console.log('Usage: generatePersonalizedMessage(enhancedUser, enhancedUser.recommendedTemplate)');
    
    return generatePersonalizedMessage;
})();
```

### 3. Outreach Campaign Manager

```javascript
// Campaign management and optimization tracking
(function() {
    
    const campaignTracker = {
        campaigns: new Map(),
        
        createCampaign: function(name, users) {
            const campaign = {
                name: name,
                created: new Date(),
                users: users,
                stats: {
                    total: users.length,
                    contacted: 0,
                    responded: 0,
                    positive_responses: 0,
                    conversions: 0
                },
                templates_used: {},
                timeline: []
            };
            
            this.campaigns.set(name, campaign);
            return campaign;
        },
        
        recordContact: function(campaignName, username, template, timestamp = new Date()) {
            const campaign = this.campaigns.get(campaignName);
            if (!campaign) return;
            
            campaign.stats.contacted++;
            campaign.templates_used[template] = (campaign.templates_used[template] || 0) + 1;
            campaign.timeline.push({
                action: 'contact',
                username: username,
                template: template,
                timestamp: timestamp
            });
        },
        
        recordResponse: function(campaignName, username, responseType, timestamp = new Date()) {
            const campaign = this.campaigns.get(campaignName);
            if (!campaign) return;
            
            campaign.stats.responded++;
            if (responseType === 'positive') {
                campaign.stats.positive_responses++;
            }
            
            campaign.timeline.push({
                action: 'response',
                username: username,
                responseType: responseType,
                timestamp: timestamp
            });
        },
        
        generateReport: function(campaignName) {
            const campaign = this.campaigns.get(campaignName);
            if (!campaign) return null;
            
            const responseRate = campaign.stats.contacted > 0 ? 
                (campaign.stats.responded / campaign.stats.contacted * 100).toFixed(1) : 0;
            
            const positiveRate = campaign.stats.responded > 0 ? 
                (campaign.stats.positive_responses / campaign.stats.responded * 100).toFixed(1) : 0;
            
            return {
                campaign: campaign.name,
                total_users: campaign.stats.total,
                contacted: campaign.stats.contacted,
                response_rate: `${responseRate}%`,
                positive_rate: `${positiveRate}%`,
                best_template: Object.entries(campaign.templates_used)
                    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None',
                days_running: Math.ceil((new Date() - campaign.created) / (1000 * 60 * 60 * 24))
            };
        }
    };
    
    window.campaignTracker = campaignTracker;
    
    console.log('=== CAMPAIGN MANAGER LOADED ===');
    console.log('Usage:');
    console.log('- campaignTracker.createCampaign("SKADIS_Hooks_Jan2025", enhancedUsers)');
    console.log('- campaignTracker.recordContact("SKADIS_Hooks_Jan2025", "username", "Template 1")');
    console.log('- campaignTracker.recordResponse("SKADIS_Hooks_Jan2025", "username", "positive")');
    console.log('- campaignTracker.generateReport("SKADIS_Hooks_Jan2025")');
    
    return campaignTracker;
})();
```

## Power-User Workflow

With these enhancements, your workflow becomes:

1. **Discover** related projects (Multi-Project Intelligence)
2. **Extract** commenters from multiple projects  
3. **Score** users with advanced algorithm
4. **Generate** personalized messages automatically
5. **Track** campaign performance and optimize

This transforms your outreach from manual, generic messaging to **intelligent, data-driven relationship building** that could easily **3x your response rates**! 🚀
