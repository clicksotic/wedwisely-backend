// Swagger UI Token Extractor
console.log('🚀 Swagger UI Token Extractor loaded');

// Function to show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    max-width: 300px;
  `;
  notification.innerHTML = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 4000);
}

// Function to extract and set token
function extractAndSetToken(responseText) {
  console.log('🔍 Trying to extract token from:', responseText.substring(0, 200) + '...');
  
  try {
    const responseData = JSON.parse(responseText);
    console.log('📊 Parsed response data:', responseData);
    
    let token = null;
    
    // Try different possible paths
    if (responseData.data && responseData.data.data && responseData.data.data.tokens && responseData.data.data.tokens.accessToken) {
      token = responseData.data.data.tokens.accessToken;
      console.log('✅ Found token at: data.data.tokens.accessToken');
    } else if (responseData.data && responseData.data.tokens && responseData.data.tokens.accessToken) {
      token = responseData.data.tokens.accessToken;
      console.log('✅ Found token at: data.tokens.accessToken');
    } else if (responseData.data && responseData.data.token) {
      token = responseData.data.token;
      console.log('✅ Found token at: data.token');
    } else if (responseData.tokens && responseData.tokens.accessToken) {
      token = responseData.tokens.accessToken;
      console.log('✅ Found token at: tokens.accessToken');
    } else if (responseData.token) {
      token = responseData.token;
      console.log('✅ Found token at: token');
    }
    
    if (token) {
      console.log('🔑 Extracted token:', token.substring(0, 50) + '...');
      
      // Set the token in the authorization
      if (window.swaggerUIRedirect && window.swaggerUIRedirect.authActions) {
        window.swaggerUIRedirect.authActions.authorize({
          bearerAuth: {
            name: 'bearerAuth',
            schema: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            },
            value: token
          }
        });
        
        showNotification('🎉 Token automatically set! You can now use protected endpoints.');
        return true;
      } else {
        console.error('❌ Swagger UI auth actions not available');
        showNotification('❌ Error: Swagger UI not ready', 'error');
      }
    } else {
      console.log('❌ No token found in response');
      showNotification('❌ No token found in response', 'error');
    }
  } catch (e) {
    console.error('❌ Error parsing response:', e);
    showNotification('❌ Error parsing response: ' + e.message, 'error');
  }
  
  return false;
}

// Add button to response sections
function addTokenButton() {
  const responseSections = document.querySelectorAll('.response-col_description__inner');
  console.log('🔍 Looking for response sections, found:', responseSections.length);
  
  responseSections.forEach(function(section) {
    if (!section.querySelector('.auto-token-btn')) {
      const responseText = section.textContent;
      if (responseText && (responseText.includes('"token"') || responseText.includes('"data"') || responseText.includes('"success"'))) {
        console.log('🔍 Found response section with potential token');
        
        const button = document.createElement('button');
        button.className = 'auto-token-btn';
        button.textContent = '🔑 Auto-set Token';
        button.style.cssText = `
          background: #10b981;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin: 10px 0;
          font-size: 12px;
          display: block;
        `;
        button.onclick = function() {
          console.log('🔑 Button clicked, extracting token...');
          extractAndSetToken(responseText);
        };
        section.appendChild(button);
      }
    }
  });
}

// Add a test indicator to the page
const testIndicator = document.createElement('div');
testIndicator.style.cssText = `
  position: fixed;
  top: 10px;
  left: 10px;
  background: #3b82f6;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10000;
  font-family: monospace;
`;
testIndicator.textContent = '🔧 Token Extractor Active';
document.body.appendChild(testIndicator);

// Check for new response sections periodically
setInterval(addTokenButton, 2000);

// Also check immediately
setTimeout(addTokenButton, 1000);

console.log('✅ Token extraction setup complete');
