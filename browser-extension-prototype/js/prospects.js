// 👥 PROSPECTS MANAGEMENT MODULE
// Handles all prospects view functionality

class ProspectsManager {
  constructor() {
    this.currentFilter = 'all';
    
    // Initialize AI messaging if available
    this.aiMessaging = window.AIMessagingManager ? new window.AIMessagingManager() : null;
  }

  // 👥 VIEW PROSPECTS - Modern UI Version
  async showProspectsView() {
    try {
      // Show prospects view
      document.getElementById('main-view').classList.add('hidden');
      document.getElementById('prospects-view').classList.add('active');
      
      // Load and display prospects data
      await this.loadProspectsData();
      
    } catch (error) {
      this.showStatus('Error loading prospects: ' + error.message, 'error');
    }
  }

  // 📊 LOAD PROSPECTS DATA FOR UI
  async loadProspectsData(filterType = 'all') {
    try {
      const result = await chrome.storage.local.get(['prospects', 'outreachLog']);
      const prospects = result.prospects || [];
      const outreachLog = result.outreachLog || [];
      
      if (prospects.length === 0) {
        this.displayEmptyProspectsState();
        return;
      }
      
      // Get contacted usernames
      const contactedUsernames = new Set(
        outreachLog.map(entry => entry.username.toLowerCase())
      );
      
      // Separate contacted and uncontacted prospects
      const uncontactedProspects = prospects.filter(
        prospect => !contactedUsernames.has(prospect.username.toLowerCase())
      );
      const contactedProspects = prospects.filter(
        prospect => contactedUsernames.has(prospect.username.toLowerCase())
      );
      
      // Update summary cards
      this.updateProspectsSummary(prospects.length, uncontactedProspects.length, contactedProspects.length);
      
      // Apply filter and display prospects
      let filteredProspects = prospects;
      let sectionTitle = '📋 All Prospects';
      
      switch (filterType) {
        case 'High':
        case 'Medium':
        case 'Low':
          filteredProspects = prospects.filter(p => p.quality === filterType);
          sectionTitle = `🎯 ${filterType} Quality Prospects`;
          break;
        case 'uncontacted':
          filteredProspects = uncontactedProspects;
          sectionTitle = '🟢 Uncontacted Prospects';
          break;
        case 'contacted':
          filteredProspects = contactedProspects;
          sectionTitle = '🔴 Already Contacted';
          break;
        default:
          // Show all prospects
          break;
      }
      
      // Update section title
      document.getElementById('prospects-section-title').textContent = sectionTitle;
      
      // Display filtered prospects
      this.displayProspectsList(filteredProspects, contactedUsernames);
      
    } catch (error) {
      console.error('Error loading prospects data:', error);
      this.displayEmptyProspectsState();
    }
  }

  updateProspectsSummary(total, uncontacted, contacted) {
    document.getElementById('prospects-total').textContent = total;
    document.getElementById('prospects-uncontacted').textContent = uncontacted;
    document.getElementById('prospects-contacted').textContent = contacted;
  }

  displayProspectsList(prospects, contactedUsernames) {
    const container = document.getElementById('prospects-list');
    
    if (prospects.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h4>No prospects match your filter</h4>
          <p>Try adjusting your filter criteria or extract more comments from SKÅDIS projects.</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = prospects.map(prospect => {
      const isContacted = contactedUsernames.has(prospect.username.toLowerCase());
      const statusClass = isContacted ? 'contacted' : 'uncontacted';
      const qualityClass = `quality-${prospect.quality.toLowerCase()}`;
      
      return `
        <div class="prospect-item ${statusClass} ${qualityClass}">
          <div class="prospect-info">
            <div class="prospect-username">@${prospect.username}</div>
            <div class="prospect-text">"${prospect.text.substring(0, 50)}${prospect.text.length > 50 ? '...' : ''}"</div>
            <div class="prospect-meta">
              <span>${prospect.quality}</span>
              <span>Score:${prospect.score}</span>
              <span>${isContacted ? '🔴' : '🟢'}</span>
            </div>
          </div>
          <div class="prospect-actions">
            <button class="prospect-btn message" ${isContacted ? 'disabled' : ''} 
                    onclick="sendMessageToProspect('${prospect.username}')"
                    title="${isContacted ? 'Already contacted this prospect' : 'Send message to this prospect'}">
              📧
            </button>
            <button class="prospect-btn profile" 
                    onclick="openProspectProfile('${prospect.profileLink}')"
                    title="Open prospect's profile in new tab">
              👤
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  displayEmptyProspectsState() {
    const container = document.getElementById('prospects-list');
    container.innerHTML = `
      <div class="empty-state">
        <h4>No prospects found</h4>
        <p>Extract comments from SKÅDIS projects to find prospects!</p>
      </div>
    `;
    
    // Update summary to show zero
    this.updateProspectsSummary(0, 0, 0);
  }

  // 📧 SEND MESSAGE TO SPECIFIC PROSPECT
  async sendMessageToProspect(username) {
    try {
      const result = await chrome.storage.local.get(['prospects']);
      const prospects = result.prospects || [];
      
      const prospect = prospects.find(p => p.username === username);
      if (!prospect) {
        this.showStatus('Prospect not found!', 'error');
        return;
      }
      
      // Generate and copy message
      const message = this.generateQuickMessage(prospect);
      await navigator.clipboard.writeText(message);
      
      // Open profile
      try {
        await chrome.tabs.create({ url: prospect.profileLink, active: true });
        this.showStatus(`✅ Message copied & profile opened! @${prospect.username}`, 'success');
      } catch (tabError) {
        this.showStatus(`✅ Message copied! Profile: ${prospect.profileLink}`, 'success');
      }
      
      // Refresh prospects display
      await this.loadProspectsData();
      
    } catch (error) {
      this.showStatus('Error sending message: ' + error.message, 'error');
    }
  }

  // 👤 OPEN PROSPECT PROFILE
  async openProspectProfile(profileUrl) {
    try {
      await chrome.tabs.create({ url: profileUrl, active: true });
      this.showStatus('✅ Profile opened in new tab', 'success');
    } catch (error) {
      this.showStatus('Error opening profile: ' + error.message, 'error');
    }
  }

  generateQuickMessage(prospect) {
    // 🤖 Try AI-generated message first
    if (this.aiMessaging) {
      try {
        const aiResult = this.aiMessaging.generatePersonalizedMessage(prospect);
        console.log('✨ AI Message Generated for prospect:', prospect.username);
        return aiResult.message;
      } catch (error) {
        console.error('AI message generation failed, using fallback:', error);
      }
    }
    
    // 📝 Fallback to standard template
    return `Hi ${prospect.username},

Saw your comment on this SKÅDIS project - great to meet another SKÅDIS enthusiast!

I've been working on some enhanced SKÅDIS hooks that solve the stability issues of single-slot hooks through a two-slot mounting system. Since you're interested in SKÅDIS accessories, I thought you might find them interesting.

The project includes 4 hook variants with complete documentation and assembly photos:
https://makerworld.com/en/models/1503225-simple-skadis-hook#profileId-1572818

Would love to hear your thoughts if you check them out!

Best,
Mihkel`;
  }

  showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    statusEl.className = type;
    
    // Auto-clear after 5 seconds
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = '';
    }, 5000);
  }

  // Initialize event handlers
  initializeEventHandlers() {
    // Prospects view navigation
    document.getElementById('back-to-main-from-prospects')?.addEventListener('click', () => {
      document.getElementById('prospects-view').classList.remove('active');
      document.getElementById('main-view').classList.remove('hidden');
    });

    // Filter buttons for prospects view
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        // Remove active class from all filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        e.target.classList.add('active');
        // Load prospects with the selected filter
        const filterType = e.target.getAttribute('data-filter');
        this.loadProspectsData(filterType);
      }
    });

    // Prospects action buttons
    const refreshProspectsBtn = document.getElementById('refresh-prospects');
    if (refreshProspectsBtn) {
      refreshProspectsBtn.addEventListener('click', async () => {
        await this.loadProspectsData();
        this.showStatus('📊 Prospects list refreshed!', 'success');
      });
    }

    const extractMoreBtn = document.getElementById('extract-more-prospects');
    if (extractMoreBtn) {
      extractMoreBtn.addEventListener('click', () => {
        // Switch back to main view and trigger comment extraction
        document.getElementById('prospects-view').classList.remove('active');
        document.getElementById('main-view').classList.remove('hidden');
        // Trigger comment extraction
        if (window.extractComments) {
          window.extractComments();
        }
      });
    }
  }
}

// Make it globally available
window.ProspectsManager = ProspectsManager;
