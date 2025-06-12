/*
🔒 SECURE AI CONFIGURATION
This script prompts for your API key instead of having it hardcoded
*/

function secureConfigureAI() {
    console.log('🔒 SECURE AI CONFIGURATION');
    console.log('='.repeat(40));
    
    // Prompt for API key
    const apiKey = prompt('🔑 Enter your OpenAI API key:');
    
    if (!apiKey) {
        console.log('❌ Configuration cancelled');
        return;
    }
    
    // Validate key format
    if (!apiKey.startsWith('sk-proj-') && !apiKey.startsWith('sk-')) {
        console.error('❌ Invalid API key format');
        console.log('OpenAI keys should start with "sk-proj-" or "sk-"');
        return;
    }
    
    console.log('✅ Valid key format detected');
    
    // Store configuration
    const config = {
        aiProvider: 'openai',
        aiApiKey: apiKey
    };
    
    chrome.storage.local.set(config, () => {
        console.log('✅ Configuration saved securely!');
        console.log('📋 Provider:', config.aiProvider);
        console.log('🔑 Key length:', apiKey.length);
        
        // Update UI
        updateUIElements();
        
        // Test connection
        setTimeout(() => {
            testSecureConnection();
        }, 500);
    });
}

function updateUIElements() {
    const providerSelect = document.getElementById('ai-provider');
    const saveButton = document.getElementById('save-ai-config');
    
    if (providerSelect) {
        providerSelect.value = 'openai';
    }
    
    if (saveButton) {
        saveButton.textContent = 'Saved ✓';
        saveButton.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            saveButton.textContent = 'Save Configuration';
            saveButton.style.backgroundColor = '';
        }, 2000);
    }
}

async function testSecureConnection() {
    console.log('🧪 Testing API connection...');
    
    try {
        const result = await new Promise(resolve => {
            chrome.storage.local.get(['aiApiKey'], resolve);
        });
        
        if (!result.aiApiKey) {
            console.error('❌ No API key found');
            return;
        }
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${result.aiApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{ role: 'user', content: 'Test' }],
                max_tokens: 10
            })
        });
        
        if (response.ok) {
            console.log('✅ CONNECTION SUCCESSFUL!');
            
            const testButton = document.getElementById('test-ai-connection');
            if (testButton) {
                testButton.textContent = 'Test Successful ✓';
                testButton.style.backgroundColor = '#4CAF50';
                setTimeout(() => {
                    testButton.textContent = 'Test Connection';
                    testButton.style.backgroundColor = '';
                }, 3000);
            }
            
            console.log('🎉 AI ASSISTANT READY FOR USE!');
            
        } else {
            console.error('❌ Connection failed:', response.status);
        }
        
    } catch (error) {
        console.error('❌ Test error:', error);
    }
}

function showSecureGuide() {
    console.log('🔒 SECURE CONFIGURATION GUIDE:');
    console.log('');
    console.log('✅ Benefits of this approach:');
    console.log('  - No API keys in source code');
    console.log('  - Keys stored only in browser extension');
    console.log('  - Safe to commit to git');
    console.log('');
    console.log('🚀 Usage:');
    console.log('  1. Run: secureConfigureAI()');
    console.log('  2. Enter your OpenAI API key when prompted');
    console.log('  3. Test connection automatically');
    console.log('');
    console.log('🔧 Available functions:');
    console.log('  - secureConfigureAI() - Configure with prompted key');
    console.log('  - testSecureConnection() - Test saved configuration');
    console.log('  - showSecureGuide() - Show this guide');
}

// Auto-load guide
console.log('🔒 Secure AI Configuration Loaded');
console.log('');
showSecureGuide();
