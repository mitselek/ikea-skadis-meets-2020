# SKÅDIS Outreach Browser Extension - Prototype

## 🎯 What This Is

A **super simple** prototype browser extension that takes your existing outreach tools and puts them in a convenient browser popup. This is just to test the concept - nothing scary!

## 🚀 What It Does (In 30 Seconds)

1. **Detects SKÅDIS pages** - Shows a small 🛠️ icon when you visit relevant MakerWorld pages
2. **Analyzes pages** - Tells you if a page is worth your time (HIGH/MEDIUM/LOW priority)  
3. **Extracts comments** - Finds all the commenters and scores them automatically
4. **Generates messages** - Creates personalized messages using your templates
5. **Tracks progress** - Shows how many prospects you've found and contacted

## 📦 How to Install (5 Minutes)

### Step 1: Enable Developer Mode
1. Open Brave browser
2. Go to `brave://extensions/`  
3. Toggle "Developer mode" in the top right
4. You'll see new buttons appear

### Step 2: Load the Extension
1. Click "Load unpacked"
2. Navigate to your project folder: `/home/michelek/Documents/ikea-skadis-adapters/browser-extension-prototype/`
3. Click "Select Folder"
4. You should see "SKÅDIS Outreach Helper" appear in your extensions!

### Step 3: Test It
1. Visit: https://makerworld.com/en/models/632335-ikea-skadis-hook
2. Look for a small 🛠️ icon in the top-right corner of the page
3. Click the extension icon in your browser toolbar (should be a puzzle piece)
4. Try clicking "📊 Analyze This Page"

## ✨ What Makes This Less Intimidating

### It's Just Your Existing Code! 
- Same extraction logic you already have
- Same templates you already wrote  
- Same scoring algorithm you already built
- Just wrapped in a prettier interface!

### No Complex Setup
- No databases to configure
- No servers to run
- No complicated APIs
- Just load and go!

### Easy to Modify
- All the files are simple HTML/CSS/JavaScript
- Change colors, text, buttons - whatever you want
- Add features one at a time
- Break something? Just reload the extension!

## 🛠️ Files Explained

- **`manifest.json`** - Tells Brave what permissions the extension needs (like a settings file)
- **`popup.html`** - The interface you see when you click the extension icon (like a webpage)
- **`popup.js`** - The logic that makes the buttons work (your existing scripts, cleaned up)
- **`content.js`** - Runs on MakerWorld pages to detect SKÅDIS content (very simple)

## 🧪 Try This First

Instead of worrying about the whole thing, just:

1. **Install it** (5 minutes following steps above)
2. **Visit a MakerWorld page**
3. **Click "Analyze This Page"** 
4. **See if it works!**

If it works, you'll think "Oh, this isn't so scary after all!" 😊

If it doesn't work, we'll debug it together and you'll learn something useful.

## 🎨 Easy Customizations You Can Try

Once it's working, you could easily:

- **Change the colors** (edit the CSS in popup.html)
- **Add your logo** (create simple icon files)
- **Modify the messages** (edit the template in popup.js)
- **Add new buttons** (copy existing button code)

## 🔧 Debugging Tips

If something doesn't work:

1. **Right-click the extension icon** → "Inspect popup" to see console errors
2. **Check the MakerWorld page** → F12 → Console tab for any red errors  
3. **Reload the extension** → Go to brave://extensions → Click the reload icon
4. **Check permissions** → Make sure "Developer mode" is still on

## 🎯 Why This Approach Works

- **Start small** - Just get something working first
- **Build confidence** - See immediate results  
- **Learn gradually** - Add features one by one
- **Low risk** - If you break it, just reload!

---

**Remember**: You already did the hard part (all the logic)! This is just putting a nice bow on it. 🎁

Ready to give it a try? The worst that can happen is it doesn't work and we learn something! 😄
