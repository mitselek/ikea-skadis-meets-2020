// 🔧 DEBUG INITIALIZATION SCRIPT
// Copy and paste this in popup console to test initialization step by step

function debugInitialization() {
    console.log('🔧 DEBUG INITIALIZATION TEST');
    console.log('=====================================');
    
    // Step 1: Check if classes are available
    console.log('\n📋 STEP 1: Class Availability Check');
    const classes = [
        'RealAIAssistant',
        'ProspectsManager', 
        'DashboardManager',
        'MessagingManager',
        'ExtractionManager',
        'StatsManager'
    ];
    
    classes.forEach(className => {
        const available = typeof window[className] !== 'undefined';
        console.log(`- ${className}: ${available ? '✅' : '❌'}`);
        if (!available) {
            console.warn(`  ⚠️  ${className} class not found in window object`);
        }
    });
    
    // Step 2: Test individual class instantiation
    console.log('\n📋 STEP 2: Individual Class Instantiation');
    
    // Test RealAIAssistant specifically
    console.log('\n🤖 Testing RealAIAssistant:');
    try {
        console.log('- Checking constructor...');
        if (typeof RealAIAssistant === 'function') {
            console.log('- Constructor type: ✅ Function');
            
            console.log('- Attempting instantiation...');
            const testAI = new RealAIAssistant();
            console.log('- Instantiation: ✅ Success');
            console.log('- Instance type:', typeof testAI);
            console.log('- Instance prototype:', Object.getPrototypeOf(testAI).constructor.name);
            
            // Store for further testing
            window.debugTestAI = testAI;
            console.log('- Stored as window.debugTestAI for testing');
            
        } else {
            console.log('- Constructor type: ❌ Not a function');
        }
    } catch (error) {
        console.error('- Instantiation failed:', error);
        console.error('- Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    }
    
    // Step 3: Test other classes
    console.log('\n🔧 Testing Other Classes:');
    const testClasses = {
        ProspectsManager: () => new ProspectsManager(),
        DashboardManager: () => new DashboardManager(),
        MessagingManager: () => new MessagingManager(),
        ExtractionManager: () => new ExtractionManager(),
        StatsManager: () => new StatsManager()
    };
    
    Object.entries(testClasses).forEach(([name, createFn]) => {
        try {
            const instance = createFn();
            console.log(`- ${name}: ✅ Success`);
        } catch (error) {
            console.log(`- ${name}: ❌ Failed - ${error.message}`);
        }
    });
    
    // Step 4: Test full initialization sequence
    console.log('\n📋 STEP 3: Full Initialization Sequence');
    try {
        console.log('- Creating all instances...');
        
        const testProspectsManager = new ProspectsManager();
        console.log('  ✅ ProspectsManager created');
        
        const testDashboardManager = new DashboardManager();
        console.log('  ✅ DashboardManager created');
        
        const testMessagingManager = new MessagingManager();
        console.log('  ✅ MessagingManager created');
        
        const testExtractionManager = new ExtractionManager();
        console.log('  ✅ ExtractionManager created');
        
        const testStatsManager = new StatsManager();
        console.log('  ✅ StatsManager created');
        
        const testRealAIAssistant = new RealAIAssistant();
        console.log('  ✅ RealAIAssistant created');
        
        // Store all for testing
        window.debugInstances = {
            prospectsManager: testProspectsManager,
            dashboardManager: testDashboardManager,
            messagingManager: testMessagingManager,
            extractionManager: testExtractionManager,
            statsManager: testStatsManager,
            realAIAssistant: testRealAIAssistant
        };
        
        console.log('✅ All instances created successfully');
        console.log('✅ Stored in window.debugInstances for testing');
        
    } catch (error) {
        console.error('❌ Full initialization failed:', error);
    }
    
    // Step 5: Check DOM ready state
    console.log('\n📋 STEP 4: DOM and Environment Check');
    console.log('- Document ready state:', document.readyState);
    console.log('- DOMContentLoaded fired:', document.readyState !== 'loading');
    console.log('- Chrome extension APIs:', {
        storage: !!(chrome && chrome.storage),
        tabs: !!(chrome && chrome.tabs),
        runtime: !!(chrome && chrome.runtime)
    });
    
    // Step 6: Recommendations
    console.log('\n📋 RECOMMENDATIONS:');
    console.log('=====================================');
    
    if (typeof RealAIAssistant === 'undefined') {
        console.log('🚨 RealAIAssistant class not found:');
        console.log('  1. Check if real-ai-assistant.js is loaded');
        console.log('  2. Check for JavaScript errors in console');
        console.log('  3. Verify script loading order in popup.html');
    } else {
        console.log('✅ RealAIAssistant class found');
        
        if (window.debugTestAI) {
            console.log('✅ Manual instantiation successful');
            console.log('💡 Issue likely in popup.js DOMContentLoaded handler');
            console.log('🔧 Check console for initialization errors');
        } else {
            console.log('❌ Manual instantiation failed');
            console.log('💡 Check RealAIAssistant constructor for errors');
        }
    }
    
    return {
        classesAvailable: classes.every(name => typeof window[name] !== 'undefined'),
        realAIAvailable: typeof RealAIAssistant !== 'undefined',
        instantiationWorks: !!window.debugTestAI,
        domReady: document.readyState !== 'loading'
    };
}

// Quick fix attempt
function attemptManualFix() {
    console.log('🔧 ATTEMPTING MANUAL FIX...');
    
    if (typeof RealAIAssistant !== 'undefined') {
        try {
            window.realAIAssistant = new RealAIAssistant();
            console.log('✅ Manual fix successful - window.realAIAssistant created');
            return true;
        } catch (error) {
            console.error('❌ Manual fix failed:', error);
            return false;
        }
    } else {
        console.error('❌ Cannot fix - RealAIAssistant class not available');
        return false;
    }
}

console.log('🔧 Debug initialization functions loaded:');
console.log('- Run: debugInitialization() for detailed debug');
console.log('- Run: attemptManualFix() to try manual fix');
