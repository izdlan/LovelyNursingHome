// Chatbot Widget Implementation
document.addEventListener('DOMContentLoaded', function() {
  // Create chatbot widget elements
  const chatbotWidget = document.createElement('div');
  chatbotWidget.id = 'chatbot-widget';
  chatbotWidget.style.cssText = 'position: fixed; bottom: 30px; right: 30px; z-index: 9999;';

  const chatbotToggle = document.createElement('button');
  chatbotToggle.id = 'chatbot-toggle';
  chatbotToggle.innerHTML = '💬';
  chatbotToggle.style.cssText = 'background: #2563eb; color: #fff; border: none; border-radius: 50%; width: 56px; height: 56px; font-size: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.15); cursor: pointer;';

  const chatbotWindow = document.createElement('div');
  chatbotWindow.id = 'chatbot-window';
  chatbotWindow.style.cssText = 'display: none; position: absolute; bottom: 70px; right: 0; width: 320px; max-width: 90vw; background: #fff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.18); overflow: hidden;';

  chatbotWindow.innerHTML = `
    <div style="background: #2563eb; color: #fff; padding: 14px; font-weight: bold;">Lovely Nursing Home ChatBot <span id='chatbot-close' style='float:right; cursor:pointer;'>✖️</span></div>
    <div id="chatbot-messages" style="padding: 14px; height: 260px; overflow-y: auto; font-size: 0.98rem; background: #f8fafc;"></div>
    <form id="chatbot-form" style="display: flex; border-top: 1px solid #eee;">
      <input id="chatbot-input" type="text" placeholder="Ask me anything..." autocomplete="off" style="flex:1; border:none; padding: 12px; font-size: 1rem; background: #f8fafc;">
      <button type="submit" style="background: #2563eb; color: #fff; border: none; padding: 0 18px; font-size: 1.2rem; cursor: pointer;">➤</button>
    </form>
  `;

  // Append elements to widget
  chatbotWidget.appendChild(chatbotToggle);
  chatbotWidget.appendChild(chatbotWindow);
  document.body.appendChild(chatbotWidget);

  // Toggle chatbot window
  document.getElementById('chatbot-toggle').onclick = function() {
    document.getElementById('chatbot-window').style.display = 'block';
  };
  document.getElementById('chatbot-close').onclick = function() {
    document.getElementById('chatbot-window').style.display = 'none';
  };

  // Use the chatbot FAQ from notification.js
  const faqAnswers = window.chatbotFAQ || [];

  document.getElementById('chatbot-form').onsubmit = function(e) {
    e.preventDefault();
    
    // Stop loading spinner from showing when chatbot form is submitted
    e.stopPropagation();
    
    const input = document.getElementById('chatbot-input');
    const msg = input.value.trim();
    if (!msg) return;
    addChatMessage('You', msg);
    let answered = false;
    const lowerMsg = msg.toLowerCase();
    
    // Extract keywords from the user's message
    const keywords = lowerMsg.split(/\s+/);
    
    // First try to find exact matches (for short queries)
    for (const faq of faqAnswers) {
      if (lowerMsg.includes(faq.q.toLowerCase())) {
        setTimeout(() => addChatMessage('Bot', faq.a), 400);
        answered = true;
        break;
      }
    }
    
    // If no exact match, try to match keywords
    if (!answered) {
      for (const keyword of keywords) {
        // Skip very short keywords (less than 3 characters)
        if (keyword.length < 3) continue;
        
        for (const faq of faqAnswers) {
          const lowerQuestion = faq.q.toLowerCase();
          // Check if the keyword is in the question
          if (lowerQuestion.includes(keyword)) {
            setTimeout(() => addChatMessage('Bot', faq.a), 400);
            answered = true;
            break;
          }
        }
        if (answered) break; // Exit keyword loop if we found a match
      }
    }
    
    // If still no answer, respond with default message
    if (!answered) {
      setTimeout(() => addChatMessage('Bot', "Sorry, I don't have an answer for that. Please contact us directly or check the FAQ above!"), 400);
    }
    
    input.value = '';
  };

  function addChatMessage(sender, text) {
    const messages = document.getElementById('chatbot-messages');
    messages.innerHTML += `<div style="margin-bottom:8px;"><strong style="color:${sender==='Bot'?'#2563eb':'#222'}">${sender}:</strong> <span>${text}</span></div>`;
    messages.scrollTop = messages.scrollHeight;
  }

  // Add welcome message
  setTimeout(() => {
    addChatMessage('Bot', 'Hello! Welcome to Lovely Nursing Home. How can I help you today?');
  }, 500);
}); 