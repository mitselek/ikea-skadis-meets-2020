// 📜 AUTO LOADER MODULE
// Functions for auto-loading all comments on a MakerWorld page

// COMPLETELY REWRITTEN AUTO-LOAD COMMENTS FUNCTION (injected into page)
// This is a safer implementation that properly handles promises and errors
function autoLoadCommentsFunction() {
  console.log('🔄 AUTO-LOADING ALL COMMENTS - Improved Version');
  
  // Return a proper Promise
  return new Promise((resolve) => {
    try {
      // Check if we're on MakerWorld
      if (window.location.hostname !== 'makerworld.com') {
        console.error('Not on a MakerWorld page');
        resolve({
          success: false,
          message: 'This function only works on MakerWorld pages',
          commentsFound: 0
        });
        return;
      }
      
      // Set a flag to identify that we're running the extension
      window.__skadisOutreachExtensionActive = true;
      
      // Check if document is fully loaded
      if (document.readyState !== 'complete') {
        console.log('Document not fully loaded, waiting 1 second...');
        setTimeout(() => {
          try {
            // Rather than recursively calling, we'll run the main function after waiting
            runCommentLoading(resolve);
          } catch (e) {
            console.error('Error after document ready check:', e);
            resolve({
              success: false,
              message: 'Failed to load comments: document not ready',
              commentsFound: 0
            });
          }
        }, 1000);
      } else {
        // Document is ready, proceed immediately
        runCommentLoading(resolve);
      }
    } catch (outerError) {
      // Catch any synchronous errors in the initialization
      console.error('Critical initialization error:', outerError);
      resolve({
        success: false,
        message: 'Critical initialization error: ' + (outerError.message || 'Unknown error'),
        commentsFound: 0
      });
    }
  });
}

// This function contains the main logic for loading comments
function runCommentLoading(resolveFunction) {
  // Safety check - make sure we have a resolver function
  if (typeof resolveFunction !== 'function') {
    console.error('No resolver function provided to runCommentLoading');
    return;
  }
  
  // Initialize state for the comment loading process
  const state = {
    isDone: false,
    totalScrolls: 0,
    lastHeight: 0,
    noChangeCount: 0,
    commentSection: null,
    initialCommentCount: 0,
    operationTimeout: null
  };
  
  // Set global timeout to ensure we don't run forever
  state.operationTimeout = setTimeout(() => {
    if (!state.isDone) {
      console.log('Global operation timeout reached (25s), finishing...');
      finishLoading();
    }
  }, 25000); // 25 second overall timeout
  
  // Safer method to find elements by their text content
  function findElementsByText(text, tagName = '*') {
    try {
      const allElements = document.getElementsByTagName(tagName);
      const matchingElements = [];
      
      for (let i = 0; i < allElements.length; i++) {
        if (allElements[i].textContent && 
            allElements[i].textContent.toLowerCase().includes(text.toLowerCase())) {
          matchingElements.push(allElements[i]);
        }
      }
      
      return matchingElements;
    } catch (e) {
      console.warn('Error finding elements by text:', e);
      return [];
    }
  }

  // Find comment section with enhanced detection
  function findCommentSection() {
    try {
      // Common selectors for comment sections
      const commentSectionSelectors = [
        '#comments',
        '.comments-section',
        '.comment-list',
        '.comments-container',
        '[data-testid="comments"]',
        'section[id*="comment"]',
        'div[id*="comment"]',
        'section[class*="comment"]',
        'div[class*="comment"]',
        '[aria-label*="comment"]',
        '.comments',
        '.reviews',
        '.feedback-section',
        '[data-test="comments"]',
        '.comment-thread'
      ];
      
      // First try with specific selectors
      for (let selector of commentSectionSelectors) {
        try {
          const section = document.querySelector(selector);
          if (section) {
            console.log('Found comment section by selector:', selector);
            return section;
          }
        } catch (err) {
          // Ignore individual selector errors
        }
      }
      
      // If still not found, try content-based detection
      // Find elements that contain the word "comments" and might be sections
      const commentElements = findElementsByText('comments');
      
      // Go through these elements to see if they are likely containers
      for (const el of commentElements) {
        // Skip small elements - looking for containers
        if (el && 
            el.offsetHeight > 100 && 
            (el.tagName === 'DIV' || el.tagName === 'SECTION')) {
          console.log('Found comment section by content detection');
          return el;
        }
        
        // Check parents for potential containers
        let parent = el.parentElement;
        let depth = 0;
        while (parent && depth < 3) {
          if (parent.offsetHeight > 100 && 
              (parent.tagName === 'DIV' || parent.tagName === 'SECTION')) {
            console.log('Found comment section by parent container detection');
            return parent;
          }
          parent = parent.parentElement;
          depth++;
        }
      }
      
      // Last resort - check for comment containers by class name patterns
      const allDivs = document.querySelectorAll('div');
      for (let i = 0; i < allDivs.length; i++) {
        const classes = allDivs[i].className || '';
        if (typeof classes === 'string' && 
            (classes.includes('comment') || classes.includes('review'))) {
          if (allDivs[i].offsetHeight > 100) {
            console.log('Found comment section by class name pattern');
            return allDivs[i];
          }
        }
      }
      
      // If we still can't find anything, return null
      return null;
    } catch (e) {
      console.error('Error finding comment section:', e);
      return null;
    }
  }

  // Count comments using multiple methods
  function countComments() {
    try {
      let commentCount = 0;
      
      // Use individual selectors to count comments to avoid selector errors
      const commentSelectors = [
        'a[href*="/@"]', 
        '.comment-item', 
        '.comment', 
        '[class*="comment-"]',
        '[data-testid*="comment"]',
        '.review',
        '.feedback',
        '[class*="review-"]',
        '.user-comment'
      ];
      
      for (let selector of commentSelectors) {
        try {
          const count = document.querySelectorAll(selector).length;
          commentCount = Math.max(commentCount, count);
        } catch (e) {
          // Ignore individual selector errors
        }
      }
      
      return commentCount;
    } catch (e) {
      console.error('Error counting comments:', e);
      return 0;
    }
  }
  
  // Start the auto-loading process
  function startProcess() {
    console.log('Starting auto-loading process...');
    
    // Find the comment section
    state.commentSection = findCommentSection();
    
    // Count initial comments
    state.initialCommentCount = countComments();
    console.log('Initial comment count:', state.initialCommentCount);
    
    // Check if we need to find and click comment tabs first
    if (state.initialCommentCount === 0) {
      // Look for comment tabs or sections that might need to be clicked
      const commentTabsWithText = [
        ...findElementsByText('Comments', 'button'),
        ...findElementsByText('Comments', 'a'),
        ...findElementsByText('Comment', 'div')
      ];
      
      // Also look for elements with common tab classes
      let commentTabs = [];
      try {
        commentTabs = [
          ...commentTabsWithText,
          ...document.querySelectorAll('[role="tab"], .tab, [data-tab="comments"]')
        ];
      } catch (err) {
        commentTabs = commentTabsWithText; // Fall back to text-based search
      }
      
      if (commentTabs.length > 0) {
        console.log('Found comment tabs, clicking the first one...');
        try {
          commentTabs[0].click();
          console.log('Successfully clicked comment tab');
          
          // Wait for comments to load after clicking the tab
          setTimeout(() => {
            // Try to find comment section again after tab click
            state.commentSection = findCommentSection();
            attemptLoadMore();
          }, 1500);
        } catch (err) {
          console.warn('Error clicking comment tab:', err);
          attemptLoadMore(); // Continue anyway
        }
      } else {
        console.log('No comment tabs found, proceeding with auto-loading anyway...');
        attemptLoadMore();
      }
    } else {
      attemptLoadMore();
    }
  }
  
  // Find and click "Load More" buttons
  function attemptLoadMore() {
    if (state.isDone) return;
    
    try {
      let loadMoreFound = false;
      
      // Find possible "Load more" buttons
      const loadMoreSelectors = [
        'button[class*="load-more"]',
        'a[class*="load-more"]',
        'button[class*="more-comments"]',
        'button[class*="show-more"]',
        '.pagination button',
        '.load-more',
        '.show-more',
        'button.more',
        'button.pagination',
        '[data-testid="load-more"]',
        '[aria-label*="load more"]',
        '[aria-label*="Load more"]',
        '[aria-label*="Show more"]'
      ];
      
      // Try standard selectors first
      for (let selector of loadMoreSelectors) {
        try {
          const loadMoreButtons = document.querySelectorAll(selector);
          
          if (loadMoreButtons.length > 0) {
            console.log('Found Load More button:', selector, loadMoreButtons.length);
            loadMoreFound = true;
            
            // Click the button
            try {
              loadMoreButtons[0].click();
              console.log('Clicked Load More button');
            } catch (clickErr) {
              console.warn('Error clicking load more button:', clickErr);
              // Try another method to trigger the button
              try {
                const clickEvent = new MouseEvent('click', {
                  bubbles: true,
                  cancelable: true,
                  view: window
                });
                loadMoreButtons[0].dispatchEvent(clickEvent);
                console.log('Dispatched click event to Load More button');
              } catch (dispatchErr) {
                console.warn('Error dispatching click event:', dispatchErr);
              }
            }
            
            // Wait and then check for more buttons or start scrolling
            setTimeout(() => {
              attemptLoadMore();
            }, 1800);
            
            // Only click one button per cycle
            return;
          }
        } catch (err) {
          // Ignore individual selector errors
        }
      }
      
      // If no buttons found by CSS selectors, try finding by text content
      if (!loadMoreFound) {
        const loadMoreButtonTexts = ['load more', 'show more', 'view more', 'see more', 'more comments'];
        
        for (let buttonText of loadMoreButtonTexts) {
          const textButtons = findElementsByText(buttonText, 'button');
          const textLinks = findElementsByText(buttonText, 'a');
          
          const buttons = [...textButtons, ...textLinks];
          
          if (buttons.length > 0) {
            console.log(`Found Load More button by text: "${buttonText}"`);
            loadMoreFound = true;
            
            // Click the button
            try {
              buttons[0].click();
              console.log('Clicked text-matched Load More button');
              
              // Wait and then check for more buttons or start scrolling
              setTimeout(() => {
                attemptLoadMore();
              }, 1800);
              
              return;
            } catch (e) {
              console.warn('Error clicking text-matched button:', e);
            }
          }
        }
      }
      
      // If still no Load More buttons found, start scroll loading
      if (!loadMoreFound) {
        console.log('No more Load More buttons found, starting scroll loading...');
        autoScroll();
      }
    } catch (err) {
      console.error('Error in attemptLoadMore:', err);
      // Try to recover by starting auto-scroll
      autoScroll();
    }
  }
  
  // Automatically scroll to load more content
  function autoScroll() {
    if (state.isDone) return;
    
    try {
      // Target to scroll - either the comment section or the whole page
      const scrollTarget = state.commentSection || document.documentElement;
    
      // Get current scroll height
      const currentHeight = scrollTarget.scrollHeight;
      console.log(`Scroll ${state.totalScrolls + 1}: Current height = ${currentHeight}px`);
      
      // If we've scrolled a lot without change, stop
      if (currentHeight === state.lastHeight) {
        state.noChangeCount++;
        console.log(`No height change detected (${state.noChangeCount}/3)`);
        
        if (state.noChangeCount >= 3) {
          finishLoading();
          return;
        }
      } else {
        // Reset the counter if we saw a change
        state.lastHeight = currentHeight;
        state.noChangeCount = 0;
      }
      
      // Scroll to bottom - use different methods for compatibility
      try {
        // Try standard scrollTo with smooth behavior
        scrollTarget.scrollTo({
          top: currentHeight,
          behavior: 'smooth'
        });
      } catch (e) {
        // Fallback to traditional method
        try {
          scrollTarget.scrollTop = currentHeight;
        } catch (e2) {
          console.warn('Standard scroll methods failed, trying window.scrollTo');
          // Last resort - try window scroll
          window.scrollTo(0, document.body.scrollHeight);
        }
      }
      
      state.totalScrolls++;
      
      // Check if we've done enough scrolls
      if (state.totalScrolls > 40) {
        console.log('Reached maximum scroll count (40), stopping');
        finishLoading();
        return;
      }
      
      // Look for additional indicators that we've reached the end
      const endIndicators = [
        "No more comments",
        "End of comments",
        "No comments yet",
        "Be the first to comment",
        "End of discussion",
        "That's all"
      ];
      
      for (let indicator of endIndicators) {
        if (document.body.textContent && 
            document.body.textContent.includes(indicator)) {
          console.log(`Detected end indicator: "${indicator}"`);
          finishLoading();
          return;
        }
      }
      
      // Continue scrolling with a delay - check if load more buttons appeared
      setTimeout(() => {
        // Look for more "Load More" buttons that might have appeared
        let newLoadMoreButtons = false;
        
        try {
          const loadMoreButtons = document.querySelectorAll('[class*="load-more"], [class*="show-more"]');
          if (loadMoreButtons.length > 0) {
            newLoadMoreButtons = true;
          }
        } catch (e) { 
          // Ignore selector errors 
        }
        
        // If new buttons appeared, click them instead of scrolling
        if (newLoadMoreButtons) {
          console.log('New Load More buttons appeared, clicking them...');
          attemptLoadMore();
        } else {
          // Otherwise continue scrolling
          autoScroll();
        }
      }, 800);
    } catch (scrollError) {
      console.error('Error while auto-scrolling:', scrollError);
      // Try to recover by continuing with a delay
      setTimeout(autoScroll, 1000);
    }
  }
  
  // Finish the loading process and resolve the promise
  function finishLoading() {
    if (state.isDone) return;
    
    // Mark as done to prevent multiple calls
    state.isDone = true;
    
    // Clear the overall timeout
    if (state.operationTimeout) {
      clearTimeout(state.operationTimeout);
    }
    
    try {
      // Count final comments
      const finalCommentCount = countComments();
      console.log('Final comment count:', finalCommentCount);
      console.log('Total scrolls performed:', state.totalScrolls);
      
      // Return results to extension
      if (finalCommentCount === 0) {
        resolveFunction({
          success: false,
          message: 'No comments found on this page',
          commentsFound: 0,
          scrollsPerformed: state.totalScrolls
        });
      } else {
        resolveFunction({
          success: true,
          commentsFound: finalCommentCount,
          message: `Successfully loaded ${finalCommentCount} comments`,
          scrollsPerformed: state.totalScrolls
        });
      }
    } catch (finalError) {
      // Last resort error handling
      console.error('Critical error during finishLoading:', finalError);
      resolveFunction({
        success: false,
        message: 'Error while loading comments: ' + (finalError.message || 'Unknown error'),
        commentsFound: 0
      });
    }
  }
  
  // Start the process
  startProcess();
}

// Safer version of autoLoadCommentsFunction that catches all errors
function safeAutoLoadCommentsFunction() {
  try {
    // Directly return the promise from autoLoadCommentsFunction
    return autoLoadCommentsFunction();
  } catch (outerError) {
    console.error('Critical error in safeAutoLoadCommentsFunction:', outerError);
    return Promise.resolve({
      success: false,
      message: 'Critical error: ' + (outerError.message || 'Unknown error'),
      commentsFound: 0
    });
  }
}

// Make functions available globally
window.autoLoadCommentsFunction = autoLoadCommentsFunction;
window.safeAutoLoadCommentsFunction = safeAutoLoadCommentsFunction;
