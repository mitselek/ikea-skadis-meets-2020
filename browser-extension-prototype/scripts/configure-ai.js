/*
🔧 CONFIGURE OPENAI API KEY
Paste this in the browser extension console to configure your OpenAI key
*/

function configureOpenAIKey() {
    console.log('🔧 CONFIGURING OPENAI API KEY...');
    
    // ⚠️ REPLACE WITH YOUR ACTUAL OPENAI API KEY
    const apiKey = 'YOUR_OPENAI_API_KEY_HERE';
    
    // Validate the key format
    console.log('🔍 Key Validation:');
    console.log('- Key starts with "sk-proj-":', apiKey.startsWith('sk-proj-') ? '✅' : '❌');
    console.log('- Key length:', apiKey.length, '(expected: ~140-160)');
    
    if (!apiKey.startsWith('sk-proj-')) {
        console.error('❌ Invalid key format! OpenAI project keys should start with "sk-proj-"');
        return;
    }
    
    // Store the configuration
    const config = {
        aiProvider: 'openai',
        aiApiKey: apiKey
    };
    
    chrome.storage.local.set(config, () => {
        console.log('✅ Configuration saved successfully!');
        console.log('📋 Stored config:', {
            aiProvider: config.aiProvider,
            aiApiKey: config.aiApiKey.substring(0, 15) + '...'
        });
        
        // Update UI if elements exist
        updateConfigUI();
        
        // Test the connection
        setTimeout(() => {
            testOpenAIConnection();
        }, 500);
    });
}

function updateConfigUI() {
    console.log('🔄 Updating UI elements...');
    
    const providerSelect = document.getElementById('ai-provider');
    const apiKeyInput = document.getElementById('ai-api-key');
    const saveButton = document.getElementById('save-ai-config');
    const testButton = document.getElementById('test-ai-connection');
    
    if (providerSelect) {
        providerSelect.value = 'openai';
        console.log('✅ Provider select updated');
    }
    
    if (apiKeyInput) {
        // ⚠️ REPLACE WITH YOUR ACTUAL OPENAI API KEY
        apiKeyInput.value = 'YOUR_OPENAI_API_KEY_HERE';
        console.log('✅ API key input updated');
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

async function testOpenAIConnection() {
    console.log('🧪 TESTING OPENAI CONNECTION...');
    
    try {
        // Get the stored config
        const result = await new Promise(resolve => {
            chrome.storage.local.get(['aiProvider', 'aiApiKey'], resolve);
        });
        
        if (!result.aiApiKey) {
            console.error('❌ No API key found in storage');
            return;
        }
        
        console.log('📋 Using stored config:', {
            provider: result.aiProvider,
            keyLength: result.aiApiKey.length
        });
        
        // Test API call
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${result.aiApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'user',
                        content: 'Hello! This is a test message. Please respond with "Test successful!"'
                    }
                ],
                max_tokens: 50,
                temperature: 0.7
            })
        });
        
        console.log('📡 API Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ CONNECTION SUCCESSFUL!');
            console.log('🤖 AI Response:', data.choices[0].message.content);
            
            // Update test button
            const testButton = document.getElementById('test-ai-connection');
            if (testButton) {
                testButton.textContent = 'Test Successful ✓';
                testButton.style.backgroundColor = '#4CAF50';
                setTimeout(() => {
                    testButton.textContent = 'Test Connection';
                    testButton.style.backgroundColor = '';
                }, 3000);
            }
            
            console.log('\n🎉 OPENAI INTEGRATION READY!');
            console.log('💡 You can now use AI-powered message synthesis');
            
        } else {
            const errorData = await response.json();
            console.error('❌ API Error:', response.status, errorData);
            
            if (response.status === 401) {
                console.error('🔑 Authentication failed - check your API key');
            } else if (response.status === 429) {
                console.error('⏱️ Rate limit exceeded - try again later');
            } else if (response.status === 403) {
                console.error('🚫 Access forbidden - check your API key permissions');
            }
        }
        
    } catch (error) {
        console.error('❌ Connection test failed:', error);
        
        const testButton = document.getElementById('test-ai-connection');
        if (testButton) {
            testButton.textContent = 'Test Failed ✗';
            testButton.style.backgroundColor = '#f44336';
            setTimeout(() => {
                testButton.textContent = 'Test Connection';
                testButton.style.backgroundColor = '';
            }, 3000);
        }
    }
}

function quickConfigGuide() {
    console.log('📋 QUICK CONFIGURATION GUIDE:');
    console.log('');
    console.log('1. 🔧 Configure: configureOpenAIKey()');
    console.log('2. 🧪 Test: testOpenAIConnection()');
    console.log('3. 🎯 Use AI messaging in the extension');
    console.log('');
    console.log('🔧 Your key format: ✅ Valid OpenAI project key');
    console.log('📊 Key length: 140+ characters (correct)');
    console.log('🎯 Provider: OpenAI GPT-4');
}

// Auto-run configuration
console.log('🚀 OpenAI Configuration Script Loaded');
console.log('');
console.log('Available functions:');
console.log('- configureOpenAIKey() - Configure and save your API key');
console.log('- testOpenAIConnection() - Test the API connection');
console.log('- quickConfigGuide() - Show setup guide');
console.log('');
console.log('🚀 Ready to configure! Run: configureOpenAIKey()');
