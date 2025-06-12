// 📧 MESSAGE PREVIEW MODULE
// Handles message preview, editing, and sending functionality

class MessagePreviewManager {
  constructor(messagingManager) {
    this.messagingManager = messagingManager;
    this.currentProspect = null;
    this.currentMessage = null;
  }

  async showMessagePreview() {
    try {
      const result = await chrome.storage.local.get(['prospects']);
      const prospects = result.prospects || [];
      
      const uncontactedProspects = prospects.filter(p => !p.contacted);
      
      if (uncontactedProspects.length === 0) {
        this.showStatus('❌ No uncontacted prospects available. Extract comments first!', 'error');
        return;
      }
      
      // Find the best uncontacted prospect
      const bestProspect = uncontactedProspects.find(p => p.quality === 'High') || uncontactedProspects[0];
      this.currentProspect = bestProspect;
      
      this.showStatus('🤖 Generating personalized message...', 'success');
      
      // Generate message using AI or fallback
      const messageResult = await this.messagingManager.generateQuickMessageWithTemplate(bestProspect);
      this.currentMessage = messageResult;
      
      // Display the preview
      this.displayMessagePreview(messageResult);
      
    } catch (error) {
      this.showStatus('Error generating message: ' + error.message, 'error');
      console.error('Message generation error:', error);
    }
  }

  displayMessagePreview(data) {
    // Show preview section
    document.getElementById('main-view').classList.add('hidden');
    document.getElementById('message-preview').classList.add('active');
    
    // Fill preview data
    const messageTextarea = document.getElementById('generated-message');
    const templateUsedEl = document.getElementById('template-used');
    const prospectInfoEl = document.getElementById('prospect-info');
    
    if (data && typeof data === 'object') {
      messageTextarea.value = data.message || 'No message generated';
      
      if (templateUsedEl) {
        templateUsedEl.textContent = data.templateUsed || 'Unknown Template';
      }
      
      if (prospectInfoEl && this.currentProspect) {
        prospectInfoEl.innerHTML = `
          <strong>👤 ${this.currentProspect.username}</strong><br>
          <span class="quality-${this.currentProspect.quality?.toLowerCase()}">${this.currentProspect.quality} Quality</span><br>
          <small>💬 "${(this.currentProspect.text || this.currentProspect.comment || '').substring(0, 100)}..."</small>
        `;
      }
    } else {
      messageTextarea.value = data || 'No message generated';
      if (templateUsedEl) {
        templateUsedEl.textContent = 'Standard Template';
      }
    }
    
    // Set up edit mode
    if (data && data.editable) {
      messageTextarea.readOnly = false;
      messageTextarea.style.fontStyle = 'italic';
      messageTextarea.style.color = '#666';
      
      const editBtn = document.getElementById('edit-message');
      const regenBtn = document.getElementById('regenerate-message');
      const sendBtn = document.getElementById('send-final-message');
      
      if (editBtn) editBtn.disabled = true;
      if (regenBtn) regenBtn.disabled = true;
      if (sendBtn) sendBtn.disabled = true;
    } else {
      messageTextarea.readOnly = true;
      messageTextarea.style.fontStyle = 'normal';
      messageTextarea.style.color = '';
    }
    
    // Add event listeners for preview actions
    this.setupPreviewEventListeners();
  }

  setupPreviewEventListeners() {
    console.log('🔄 Setting up message preview event listeners...');
    
    // Store reference to this for closures
    const self = this;
    
    // Helper function for setting up button event listeners
    const setupButton = (id, handlerFn) => {
      const btn = document.getElementById(id);
      if (!btn) {
        console.warn(`⚠️ Button with ID ${id} not found`);
        return;
      }
      
      // Clone and replace to remove any existing event listeners
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      // Add multiple event types for better reliability with proper context binding
      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handlerFn.apply(self);
      }, { capture: true });
      
      // Add visual feedback for clicking
      newBtn.addEventListener('mousedown', () => {
        newBtn.style.transform = 'scale(0.95)';
      });
      
      newBtn.addEventListener('mouseup', () => {
        newBtn.style.transform = 'scale(1)';
      });
      
      newBtn.addEventListener('mouseleave', () => {
        newBtn.style.transform = 'scale(1)';
      });
      
      console.log(`📌 Listener set up for button: ${id}`);
    };

    // Set up all button event listeners with proper binding
    setupButton('close-preview', function() { self.closeMessagePreview(); });
    setupButton('edit-message', function() { self.toggleEditMode(); });
    setupButton('regenerate-message', function() { self.regenerateMessage(); });
    setupButton('send-final-message', function() { self.sendFinalMessage(); });
    
    // Show AI chat if available
    const chatSection = document.getElementById('ai-chat-section');
    if (this.messagingManager?.aiMessaging && chatSection) {
      chatSection.style.display = 'block';
      setupButton('apply-chat-changes', function() { self.applyChatChanges(); });
    }
  }

  toggleEditMode() {
    const messageTextarea = document.getElementById('generated-message');
    const isReadOnly = messageTextarea.readOnly;
    
    messageTextarea.readOnly = !isReadOnly;
    
    if (!isReadOnly) {
      // Switching to read-only (save changes)
      this.saveMessageChanges();
    } else {
      // Switching to edit mode
      messageTextarea.focus();
      this.showStatus('✏️ Edit mode enabled - modify the message as needed', 'success');
    }
  }

  saveMessageChanges() {
    const messageTextarea = document.getElementById('generated-message');
    this.currentMessage.message = messageTextarea.value;
    this.showStatus('💾 Message changes saved', 'success');
  }

  async regenerateMessage() {
    if (!this.currentProspect) {
      this.showStatus('❌ No prospect available for regeneration', 'error');
      return;
    }
    
    try {
      this.showStatus('🔄 Regenerating message...', 'success');
      
      const messageResult = await this.messagingManager.generateQuickMessageWithTemplate(this.currentProspect);
      this.currentMessage = messageResult;
      
      const messageTextarea = document.getElementById('generated-message');
      messageTextarea.value = messageResult.message || messageResult;
      
      this.showStatus('✨ Message regenerated successfully!', 'success');
      this.enablePreviewActions();
      
    } catch (error) {
      this.showStatus('Error regenerating message: ' + error.message, 'error');
    }
  }

  async applyChatChanges() {
    const chatInput = document.getElementById('chat-input').value.trim();
    if (!chatInput) {
      this.showStatus('Please enter your adjustment request', 'error');
      return;
    }
    
    try {
      this.showStatus('🤖 AI is adjusting the message...', 'success');
      
      // For now, let's just regenerate with a note
      // TODO: Implement actual AI message adjustment
      this.showStatus('🔄 Feature coming soon - regenerating message instead...', 'success');
      await this.regenerateMessage();
      document.getElementById('chat-input').value = '';
      
    } catch (error) {
      this.showStatus('Error adjusting message: ' + error.message, 'error');
    }
  }

  async sendFinalMessage() {
    if (!this.currentProspect || !this.currentMessage) {
      this.showStatus('❌ No message to send', 'error');
      return;
    }
    
    try {
      const messageTextarea = document.getElementById('generated-message');
      const finalMessage = messageTextarea.value;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(finalMessage);
      
      // Log the outreach
      await this.messagingManager.logOutreachMessage(
        this.currentProspect, 
        finalMessage, 
        this.currentMessage.templateUsed || 'Manual'
      );
      
      this.showStatus('📋 Message copied to clipboard and logged!', 'success');
      
      // Close preview after short delay
      setTimeout(() => {
        this.closeMessagePreview();
      }, 2000);
      
    } catch (error) {
      this.showStatus('Error sending message: ' + error.message, 'error');
    }
  }

  closeMessagePreview() {
    document.getElementById('message-preview').classList.remove('active');
    document.getElementById('main-view').classList.remove('hidden');
    
    // Reset current data
    this.currentProspect = null;
    this.currentMessage = null;
  }

  enablePreviewActions() {
    // Re-enable buttons that might have been disabled during generation
    const editBtn = document.getElementById('edit-message');
    const regenBtn = document.getElementById('regenerate-message');
    const sendBtn = document.getElementById('send-final-message');
    
    if (editBtn) editBtn.disabled = false;
    if (regenBtn) regenBtn.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
  }

  showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.className = type;
      
      setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = '';
      }, 5000);
    }
  }
}

// Make it globally available
window.MessagePreviewManager = MessagePreviewManager;
