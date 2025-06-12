/*
🧪 OPENAI API KEY TEST
Paste this in browser extension console to test the new OpenAI key directly
*/

async function testOpenAIKeyDirect() {
    console.log('🧪 Testing OpenAI API key directly...');
    
    // ⚠️ REPLACE WITH YOUR ACTUAL OPENAI API KEY
    const apiKey = 'YOUR_OPENAI_API_KEY_HERE';
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{
                    role: 'user',
                    content: 'Say "API key works!" if you can read this.'
                }],
                max_tokens: 10
            })
        });
        
        console.log('📡 API Response Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Key Test: SUCCESS!');
            console.log('🤖 AI Response:', data.choices[0].message.content);
            console.log('💰 Usage:', data.usage);
            
            // Update extension with working key
            chrome.storage.local.set({
                aiProvider: 'openai',
                aiApiKey: apiKey
            }, () => {
                console.log('✅ Key saved to extension storage');
                
                // Update global instance
                if (window.realAIAssistant) {
                    window.realAIAssistant.currentProvider = 'openai';
                    window.realAIAssistant.apiKey = apiKey;
                    window.realAIAssistant.isAvailable = true;
                    console.log('✅ Global AI instance updated');
                }
            });
            
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ API Key Test: FAILED');
            console.error('Status:', response.status);
            console.error('Error:', errorData);
            
            if (response.status === 401) {
                console.log('💡 401 Error suggests key is invalid or expired');
            } else if (response.status === 429) {
                console.log('💡 429 Error suggests rate limit or billing issue');
            }
        }
        
    } catch (error) {
        console.error('❌ Network Error:', error);
    }
}

async function updateExtensionConfig() {
    console.log('🔧 Updating extension configuration...');
    
    // ⚠️ REPLACE WITH YOUR ACTUAL OPENAI API KEY
    const apiKey = 'YOUR_OPENAI_API_KEY_HERE';
    
    // Save to storage
    chrome.storage.local.set({
        aiProvider: 'openai',
        aiApiKey: apiKey
    }, () => {
        console.log('✅ Configuration saved');
        
        // Update global instance
        if (window.realAIAssistant) {
            window.realAIAssistant.currentProvider = 'openai';
            window.realAIAssistant.apiKey = apiKey;
            window.realAIAssistant.isAvailable = true;
            console.log('✅ Real AI Assistant updated and ready!');
            console.log('🎯 You can now generate AI-powered personalized messages!');
        }
    });
}

console.log('🧪 OpenAI API Test Functions Loaded:');
console.log('- testOpenAIKeyDirect() - Test API key with direct call');
console.log('- updateExtensionConfig() - Apply working config to extension');
console.log('');
console.log('🚀 Run: testOpenAIKeyDirect()');
