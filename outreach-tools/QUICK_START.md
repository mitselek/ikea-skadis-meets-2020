# Quick Reference Guide - SKÅDIS Hooks Outreach

## 🚀 Getting Started (5 minutes)

### Step 1: Navigate to Tools
```bash
cd /home/michelek/Documents/ikea-skadis-adapters/outreach-tools
```

### Step 2: Test Your Setup
```bash
./track_contacts.sh stats
```

### Step 3: Open Browser & Extract Data
1. Open: https://makerworld.com/en/models/632335-ikea-skadis-hook
2. Press F12 → Console tab
3. Copy/paste scripts from `BROWSER_HELPERS.md`

## ⚡ Essential Commands

### Add New Contact
```bash
./track_contacts.sh add "username" "profile_url" "message_url" "source_project" "notes"
```

### View Statistics
```bash
./track_contacts.sh stats
```

### View Contact Database
```bash
head -10 outreach_contacts.csv
```

## 📋 Daily Workflow

### Morning (Project Discovery)
1. Use `MULTI_PROJECT_INTELLIGENCE.md` scripts to find related SKÅDIS projects
2. Run page assessment script on each project (Script #3 from BROWSER_HELPERS.md)
3. Focus on HIGH and MEDIUM priority projects

### Afternoon (Contact Extraction)
1. Run comment extraction script (Script #2 from BROWSER_HELPERS.md) on priority projects
2. Focus on HIGH QUALITY UNIQUE COMMENTERS
3. Add top prospects to database using track_contacts.sh

### Evening (Outreach)
1. Use templates from `OUTREACH_TEMPLATES.md`
2. Apply personalization from `SMART_TARGETING_ENGINE.md`
3. Send 5-10 personalized messages
4. Update contact status in database

## 🎯 Key Scripts Quick Reference

### Browser Script #1: User Profile Analysis
- Run on: User profile pages
- Extracts: Username, project count, SKÅDIS mentions, message URL

### Browser Script #2: Comment Extraction (★ MOST IMPORTANT)
- Run on: Project pages with comments
- Extracts: Unique commenters with quality scoring
- Output: Ready-to-use prospect list

### Browser Script #3: Page Assessment
- Run on: Any SKÅDIS project page
- Extracts: Engagement metrics, relevance score
- Output: Priority recommendation (HIGH/MEDIUM/LOW)

## 💡 Pro Tips

### High-Value Targets
- Users with 3+ comments on same project
- Comments 80+ characters (technical depth)
- Mentions of "problem", "solution", "modification"
- Multiple SKÅDIS project involvement

### Template Selection
- **Template 1**: Technical users with detailed comments
- **Template 2**: Users who mention problems/issues
- **Template 3**: Active community members (3+ projects)
- **Template 4**: Quick approach for moderate users
- **Template 5**: Users who appreciate detailed documentation

### Personalization Keys
- Reference their specific project comment
- Mention the exact problem they discussed
- Include relevant technical details
- Acknowledge their expertise level

## 🔗 Quick Links

- **Your Project**: https://makerworld.com/en/models/1503225-simple-skadis-hook#profileId-1572818
- **GitHub Repo**: https://github.com/michelek/ikea-skadis-adapters
- **Related Projects**: Start with https://makerworld.com/en/models/632335-ikea-skadis-hook

## 📊 Success Metrics

### Daily Goals
- Discover: 3-5 new related projects
- Extract: 20-30 unique high-quality commenters
- Contact: 5-10 personalized messages
- Track: Update all responses and follow-ups

### Weekly Goals
- 50+ new qualified prospects
- 15%+ response rate (aim for 20%+)
- 2-3 positive project feedback/questions
- 1-2 potential collaborations or remixes

---

*Keep this guide handy and reference the detailed documentation in other files for advanced features!*
