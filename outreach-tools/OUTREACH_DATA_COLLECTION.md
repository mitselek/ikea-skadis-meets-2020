# MakerWorld Outreach Data Collection Guide

This guide helps you systematically collect potential contacts from MakerWorld for promoting your SKÅDIS hook variants.

## Collection Strategy

### 1. Start with Your Project's Related Models

**Your Project**: https://makerworld.com/en/models/1503225-simple-skadis-hook#profileId-1572818

1. Scroll down to the "Related Models" section
2. Visit each related SKÅDIS project
3. Look for projects with good engagement (comments, likes, makes)
4. Focus on recent projects (last 6-12 months for active users)

### 2. Target Project Types

Look for these types of related projects:
- **SKÅDIS hooks and accessories**
- **SKÅDIS organizers**
- **Workshop organization tools**
- **Pegboard accessories**
- **Tool storage solutions**
- **3D printed organizational systems**

### 3. User Types to Target

#### High-Value Targets
- **Active commenters** - Users who leave detailed feedback
- **Project creators** - People who make SKÅDIS accessories
- **Heavy users** - Multiple SKÅDIS-related uploads/makes
- **Workshop enthusiasts** - Focus on tool organization

#### Medium-Value Targets
- **Casual commenters** - Simple "nice work" comments
- **Recent joiners** - New to MakerWorld but engaged
- **Makers** - Users who have made the projects

## Data Collection Process

### Step 1: Visit Related Projects

For each related project, collect:

```
Project URL: _______________
Project Title: _______________
Creator: _______________
Upload Date: _______________
Comments Count: _______________
Makes Count: _______________
Likes Count: _______________
```

### Step 2: Analyze Comments Section

For each project with good engagement:

1. **Scroll through comments**
2. **Identify quality commenters** (detailed feedback, questions, suggestions)
3. **Note user engagement level** (multiple comments, helpful responses)
4. **Check comment dates** (recent activity preferred)

### Step 3: Collect User Information

For each potential contact:

```
Username: _______________
Profile URL: https://makerworld.com/en/@USERNAME/upload
Message URL: https://makerworld.com/en/my/message?recvID=USERID
Last Active: _______________
Project Count: _______________
SKÅDIS Projects: _______________
Comment Quality: [High/Medium/Low]
Engagement Level: [High/Medium/Low]
Notes: _______________
```

## Quick Collection Workflow

### 1. Browser Setup
- Open your project page
- Open a spreadsheet or use the CSV template below
- Have multiple tabs ready for efficient browsing

### 2. Systematic Collection (30-60 minutes)
1. **Related Models** (15 mins)
   - Visit 5-10 related projects
   - Note high-engagement projects
   
2. **Comment Analysis** (30 mins)
   - Focus on top 3-5 projects with best engagement
   - Identify 10-20 quality commenters
   
3. **Profile Checks** (15 mins)
   - Quick verification of user activity
   - Confirm they're active SKÅDIS users

## User Profile Quick Assessment

When visiting a user's profile (`@username/upload`):

### Look For:
- **Recent uploads** (last 3-6 months)
- **SKÅDIS-related projects**
- **Workshop/organization focus**
- **Quality project descriptions**
- **Active community engagement**

### Red Flags to Avoid:
- **Inactive accounts** (no recent uploads/activity)
- **Commercial accounts** (selling services)
- **Spam/low-quality content**
- **Non-English profiles** (unless you speak the language)

## Data Organization Templates

### CSV Template for Collection

```csv
Date_Collected,Username,Profile_URL,Message_URL,Source_Project,Comment_Quality,Engagement_Level,SKADIS_Projects,Last_Active,Priority,Notes,Contact_Status
```

### Example Entry

```csv
2025-06-12,workshop_guru,https://makerworld.com/en/@workshop_guru/upload,https://makerworld.com/en/my/message?recvID=1234567,Simple Hook Organizer,High,High,3,2025-06-10,High,"Multiple detailed comments about hook stability issues",Not_Contacted
```

## Priority Scoring System

### High Priority (Contact First)
- Active SKÅDIS project creators
- Users with multiple detailed comments about hook issues
- Recent workshop organization uploads
- Users asking about hook stability in comments

### Medium Priority (Contact Second)
- Casual SKÅDIS users with recent activity
- Users who made related projects
- Commenters with good engagement but less specific needs

### Low Priority (Contact Last)
- Inactive users (6+ months)
- Single low-quality comments
- Users outside your target area (if relevant)

## Collection Tools

### Browser Bookmarklets

Save these as bookmarks for quick data collection:

#### Extract Username from Profile
```javascript
javascript:alert(window.location.pathname.split('/')[3].replace('@',''));
```

#### Extract User ID for Messaging
```javascript
javascript:
var userId = document.querySelector('[data-user-id]')?.getAttribute('data-user-id') || 
           document.URL.match(/recvID=(\d+)/)?.[1] || 
           'ID not found';
alert('User ID: ' + userId);
```

### Time Management

- **Daily collection**: 30-60 minutes maximum
- **Weekly batches**: Collect 10-20 prospects per week
- **Quality over quantity**: Better to have 20 good contacts than 100 poor ones

## Legal and Ethical Considerations

### Do's
- ✅ Only collect publicly available information
- ✅ Respect MakerWorld's terms of service
- ✅ Focus on genuine community engagement
- ✅ Provide real value in your outreach

### Don'ts
- ❌ Use automated scraping tools
- ❌ Contact users who've opted out of messages
- ❌ Save private or personal information
- ❌ Spam or mass message without personalization

## Next Steps After Collection

1. **Clean and organize** your collected data
2. **Prioritize contacts** using the scoring system
3. **Personalize outreach** using the templates
4. **Track responses** and engagement
5. **Refine targeting** based on response rates

## Integration with Outreach Templates

Match collected users to appropriate templates:

- **Technical users** → Template 1 (Professional & Technical)
- **Problem-focused comments** → Template 2 (Problem-Solution)
- **Community leaders** → Template 3 (Community & Collaboration)
- **Casual users** → Template 4 (Brief & Direct)
- **Visual learners** → Template 5 (Visual/Image Focus)

---

*This collection process should be done manually and respectfully, following MakerWorld's community guidelines and terms of service.*
