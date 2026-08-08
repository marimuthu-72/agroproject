/* ==========================================================================
   G. Saravana Agro Clinic - AI Crop & Fertilizer Advisory Assistant
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const fab = document.getElementById('ai-chat-btn');
  const chatBox = document.getElementById('ai-chat-box');
  const closeBtn = document.getElementById('ai-chat-close');
  const sendBtn = document.getElementById('ai-send-btn');
  const input = document.getElementById('ai-chat-input');
  const body = document.getElementById('ai-chat-messages');

  if (!fab || !chatBox) return;

  fab.addEventListener('click', () => {
    chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatBox.style.display = 'none';
    });
  }

  const responses = [
    { keywords: ['npk', 'fertilizer', 'ratio'], reply: 'For general crops, NPK 19-19-19 is ideal for vegetative growth. During flowering, switch to high Phosphorus (10-26-26) or Potassium (0-0-50).' },
    { keywords: ['paddy', 'rice', 'seed'], reply: 'For Paddy fields, we recommend CO-51 seeds with 50kg Vermicompost per acre and Azospirillum bio-fertilizer.' },
    { keywords: ['pest', 'insects', 'neem'], reply: 'Try our Bio-Neem Oil Pest Guard (10,000 PPM). Spray 5ml per liter of water early in the morning for best results.' },
    { keywords: ['soil', 'test', 'testing'], reply: 'We offer free digital soil testing at our store! Bring a 500g soil sample taken from 15cm depth.' },
    { keywords: ['delivery', 'door', 'shipping'], reply: 'We provide free door delivery within 24 hours for all orders over ₹999.' }
  ];

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-bubble user';
    userMsg.textContent = text;
    body.appendChild(userMsg);
    input.value = '';
    body.scrollTop = body.scrollHeight;

    // Bot Response Logic
    setTimeout(() => {
      let replyText = "I'm your AI Farming Guide! For complex crop advisory, visit our Soil Testing & Consultation center or call us directly.";
      const lower = text.toLowerCase();
      
      for (const res of responses) {
        if (res.keywords.some(k => lower.includes(k))) {
          replyText = res.reply;
          break;
        }
      }

      const botMsg = document.createElement('div');
      botMsg.className = 'chat-bubble bot';
      botMsg.textContent = replyText;
      body.appendChild(botMsg);
      body.scrollTop = body.scrollHeight;
    }, 600);
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
});
