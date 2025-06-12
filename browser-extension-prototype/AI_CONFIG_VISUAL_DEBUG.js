/*
🔧 AI CONFIG PANEL DEBUG - Visual Debugging and Emergency Fix

Copy and paste this into the popup console to debug and fix the visual issues
with the AI configuration panel.
*/

function debugConfigPanelVisual() {
    console.log('🔧 DEBUGGING AI CONFIG PANEL VISUAL ISSUES...');
    
    const configPanel = document.getElementById('ai-config-section');
    const mainView = document.querySelector('.main-view');
    
    if (!configPanel) {
        console.log('❌ Config panel element not found');
        return false;
    }
    
    // Get current styles
    const computedStyle = window.getComputedStyle(configPanel);
    console.log('\n📋 Current Panel Styles:');
    console.log(`- display: ${computedStyle.display}`);
    console.log(`- position: ${computedStyle.position}`);
    console.log(`- visibility: ${computedStyle.visibility}`);
    console.log(`- opacity: ${computedStyle.opacity}`);
    console.log(`- z-index: ${computedStyle.zIndex}`);
    console.log(`- background: ${computedStyle.backgroundColor}`);
    console.log(`- width: ${computedStyle.width}`);
    console.log(`- height: ${computedStyle.height}`);
    
    // Check positioning
    const rect = configPanel.getBoundingClientRect();
    console.log('\n📋 Panel Position:');
    console.log(`- top: ${rect.top}px`);
    console.log(`- left: ${rect.left}px`);
    console.log(`- width: ${rect.width}px`);
    console.log(`- height: ${rect.height}px`);
    console.log(`- visible in viewport: ${rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth}`);
    
    // Check parent containers
    console.log('\n📋 Parent Container Info:');
    let parent = configPanel.parentElement;
    let level = 0;
    while (parent && level < 3) {
        const parentStyle = window.getComputedStyle(parent);
        console.log(`- Level ${level}: ${parent.tagName}${parent.className ? '.' + parent.className : ''}${parent.id ? '#' + parent.id : ''}`);
        console.log(`  - display: ${parentStyle.display}, overflow: ${parentStyle.overflow}`);
        parent = parent.parentElement;
        level++;
    }
    
    return true;
}

function emergencyFixConfigPanel() {
    console.log('🚨 APPLYING EMERGENCY FIX TO CONFIG PANEL...');
    
    const configPanel = document.getElementById('ai-config-section');
    
    if (!configPanel) {
        console.log('❌ Config panel not found');
        return false;
    }
    
    // Apply emergency styling to make it visible
    const emergencyStyles = {
        display: 'block',
        position: 'relative',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%)',
        color: 'white',
        padding: '15px',
        margin: '10px 0',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        zIndex: '1000',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif'
    };
    
    // Apply styles
    Object.assign(configPanel.style, emergencyStyles);
    
    // Make sure main view is hidden
    const mainView = document.querySelector('.main-view');
    if (mainView) {
        mainView.style.display = 'none';
    }
    
    // Style the dashboard-section inside
    const dashboardSection = configPanel.querySelector('.dashboard-section');
    if (dashboardSection) {
        Object.assign(dashboardSection.style, {
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '15px',
            borderRadius: '6px',
            marginBottom: '10px'
        });
    }
    
    // Enhance form elements
    const selects = configPanel.querySelectorAll('select');
    const inputs = configPanel.querySelectorAll('input');
    const buttons = configPanel.querySelectorAll('button');
    
    selects.forEach(select => {
        Object.assign(select.style, {
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '8px',
            width: '100%',
            fontSize: '12px'
        });
    });
    
    inputs.forEach(input => {
        Object.assign(input.style, {
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '8px',
            width: '100%',
            fontSize: '12px',
            boxSizing: 'border-box'
        });
    });
    
    buttons.forEach(button => {
        Object.assign(button.style, {
            background: 'rgba(76, 175, 80, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'background 0.3s'
        });
        
        // Special styling for specific buttons
        if (button.id === 'disable-real-ai') {
            button.style.background = 'rgba(244, 67, 54, 0.8)';
        }
        if (button.id === 'close-ai-config') {
            button.style.background = 'rgba(128, 128, 128, 0.8)';
        }
    });
    
    console.log('✅ Emergency styling applied to config panel');
    console.log('💡 The panel should now be clearly visible with proper styling');
    
    // Force a repaint
    configPanel.style.display = 'none';
    configPanel.offsetHeight; // Trigger reflow
    configPanel.style.display = 'block';
    
    return true;
}

function testConfigPanelComplete() {
    console.log('🧪 COMPLETE CONFIG PANEL TEST...');
    
    // First show the config
    if (typeof window.showAIConfiguration === 'function') {
        window.showAIConfiguration();
    }
    
    // Debug visual issues
    debugConfigPanelVisual();
    
    // Apply emergency fix
    emergencyFixConfigPanel();
    
    // Test if panel is now visible
    const configPanel = document.getElementById('ai-config-section');
    if (configPanel) {
        const rect = configPanel.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0 && configPanel.style.display !== 'none';
        
        console.log(`\n🎯 FINAL RESULT: Panel is ${isVisible ? '✅ VISIBLE' : '❌ STILL HIDDEN'}`);
        
        if (isVisible) {
            console.log('🎉 SUCCESS! The AI configuration panel should now be visible!');
            console.log('📝 You can now configure your AI settings:');
            console.log('   1. Select OpenAI or Anthropic from the dropdown');
            console.log('   2. Enter your API key');
            console.log('   3. Click "Test Connection"');
            console.log('   4. Click "Save Config"');
        }
        
        return isVisible;
    }
    
    return false;
}

console.log('🔧 AI Config Panel Visual Debug Functions Loaded:');
console.log('- debugConfigPanelVisual() - Debug visual styling issues');
console.log('- emergencyFixConfigPanel() - Apply emergency styling fix');
console.log('- testConfigPanelComplete() - Complete test and fix');
console.log('');
console.log('🚀 Quick start: testConfigPanelComplete()');
