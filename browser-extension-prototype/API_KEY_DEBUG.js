/*
🔧 API KEY DEBUG SCRIPT
Paste this in the browser extension console to debug the API key issue
*/

function debugAPIKey() {
    console.log('🔧 DEBUGGING API KEY ISSUE...');
    
    // Check stored configuration
    chrome.storage.local.get(['aiProvider', 'aiApiKey'], (result) => {
        console.log('📋 Current Configuration:');
        console.log('- Provider:', result.aiProvider || 'None');
        console.log('- API Key length:', result.aiApiKey ? result.aiApiKey.length : 0);
        console.log('- API Key starts with:', result.aiApiKey ? result.aiApiKey.substring(0, 8) + '...' : 'None');
        
        if (result.aiProvider === 'openai') {
            console.log('🔍 OpenAI Key Format Check:');
            if (result.aiApiKey) {
                const startsCorrectly = result.aiApiKey.startsWith('sk-');
                console.log('- Starts with "sk-":', startsCorrectly ? '✅' : '❌');
                console.log('- Length (should be ~51):', result.aiApiKey.length);
                
                if (!startsCorrectly) {
                    console.log('⚠️ OpenAI keys should start with "sk-"');
                }
                if (result.aiApiKey.length < 40) {
                    console.log('⚠️ Key seems too short for OpenAI');
                }
            }
        } else if (result.aiProvider === 'anthropic') {
            console.log('🔍 Anthropic Key Format Check:');
            if (result.aiApiKey) {
                const startsCorrectly = result.aiApiKey.startsWith('sk-ant-');
                console.log('- Starts with "sk-ant-":', startsCorrectly ? '✅' : '❌');
                console.log('- Length (should be ~108):', result.aiApiKey.length);
                
                if (!startsCorrectly) {
                    console.log('⚠️ Anthropic keys should start with "sk-ant-"');
                }
            }
        }
        
        console.log('\n💡 RECOMMENDATIONS:');
        if (!result.aiApiKey) {
            console.log('❌ No API key found - please configure one');
        } else if (result.aiProvider === 'openai' && !result.aiApiKey.startsWith('sk-')) {
            console.log('❌ Invalid OpenAI key format - should start with "sk-"');
            console.log('🔧 Get new key from: https://platform.openai.com/api-keys');
        } else if (result.aiProvider === 'anthropic' && !result.aiApiKey.startsWith('sk-ant-')) {
            console.log('❌ Invalid Anthropic key format - should start with "sk-ant-"');
            console.log('🔧 Get new key from: https://console.anthropic.com/');
        } else {
            console.log('✅ Key format looks correct');
            console.log('💡 Try regenerating the key from your provider dashboard');
        }
    });
}

function quickSwitchToAnthropic() {
    console.log('🔄 Quick switch to Anthropic for testing...');
    console.log('💡 In the config panel:');
    console.log('1. Select "Anthropic (Claude)"');
    console.log('2. Enter your Claude Dev API key');
    console.log('3. Test connection');
    console.log('');
    console.log('🔧 To find Claude Dev key:');
    console.log('- Open VS Code/Cursor');
    console.log('- Ctrl+Shift+P → "Claude Dev"');
    console.log('- Check extension settings for API key');
}

console.log('🔧 API Debug functions loaded:');
console.log('- debugAPIKey() - Check current key format');
console.log('- quickSwitchToAnthropic() - Switch to Anthropic guide');
console.log('');
console.log('🚀 Run: debugAPIKey()');
