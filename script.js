// ===== FORM TAB SWITCHING =====
function switchTab(type) {
  const patientForm = document.getElementById('patientForm');
  const volunteerForm = document.getElementById('volunteerForm');
  const successMsg = document.getElementById('successMsg');
  const tabs = document.querySelectorAll('.tab-btn');

  successMsg.style.display = 'none';

  if (type === 'patient') {
    patientForm.style.display = 'block';
    volunteerForm.style.display = 'none';
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
  } else {
    patientForm.style.display = 'none';
    volunteerForm.style.display = 'block';
    tabs[1].classList.add('active');
    tabs[0].classList.remove('active');
  }
}

// ===== FORM SUBMISSION =====
function handleSubmit(event, type) {
  event.preventDefault();

  const patientForm = document.getElementById('patientForm');
  const volunteerForm = document.getElementById('volunteerForm');
  const successMsg = document.getElementById('successMsg');
  const successText = document.getElementById('successText');

  patientForm.style.display = 'none';
  volunteerForm.style.display = 'none';
  successMsg.style.display = 'block';

  if (type === 'patient') {
    successText.textContent = 'Your patient support request has been received. Our healthcare team will contact you within 24 hours. Please keep your phone accessible.';
  } else {
    successText.textContent = 'Thank you for registering as a volunteer! We appreciate your generosity. A coordinator will reach out within 2 business days.';
  }

  successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm() {
  const patientForm = document.getElementById('patientForm');
  const successMsg = document.getElementById('successMsg');
  const tabs = document.querySelectorAll('.tab-btn');

  patientForm.reset();
  successMsg.style.display = 'none';
  patientForm.style.display = 'block';
  tabs[0].classList.add('active');
  tabs[1].classList.remove('active');
}

// ===== AI CHATBOT =====

// Conversation history for multi-turn memory
let conversationHistory = [];

// System prompt defining HealthBot's persona
const SYSTEM_PROMPT = `You are HealthBot, a friendly and empathetic AI health support assistant for HealthCare Connect — a non-profit NGO based in Karnataka, India. 

Your role:
- Help users understand our services and how to access them
- Answer general health FAQs clearly and compassionately
- Guide patients on how to register for support
- Explain volunteer opportunities
- Provide basic first-aid or health tips when asked
- Direct urgent medical cases to emergency services

Services we offer:
- Free medical consultations with qualified doctors
- Medicine assistance for low-income families
- Mental health support and counseling
- Home visit requests for elderly and differently-abled patients
- Ambulance coordination for emergencies
- Community health camps in rural areas

Registration is completely free. Patients can register online or call our helpline: +91 80 1234 5678.

Keep responses concise (2-4 sentences ideally), warm, and helpful. Always be empathetic. If someone describes a medical emergency, immediately direct them to call 112 (India emergency).

Respond in English. Do not use markdown formatting — plain text only.`;

async function sendMessage() {
  const input = document.getElementById('userInput');
  const message = input.value.trim();
  if (!message) return;

  input.value = '';

  // Hide quick replies after first user message
  const quickReplies = document.getElementById('quickReplies');
  if (quickReplies) quickReplies.remove();

  // Add user message to chat
  addMessage(message, 'user');

  // Add to history
  conversationHistory.push({ role: 'user', content: message });

  // Show typing indicator
  const typingId = showTyping();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': window.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: conversationHistory
      })
    });

    removeTyping(typingId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const botReply = data.content[0].text;

    // Add assistant reply to history
    conversationHistory.push({ role: 'assistant', content: botReply });

    addMessage(botReply, 'bot');

  } catch (error) {
    removeTyping(typingId);
    console.error('Chatbot error:', error);

    // Graceful fallback with pre-written responses
    const fallbackReply = getFallbackResponse(message);
    conversationHistory.push({ role: 'assistant', content: fallbackReply });
    addMessage(fallbackReply, 'bot');
  }
}

// Quick reply buttons
function sendQuick(text) {
  document.getElementById('userInput').value = text;
  sendMessage();
}


function addMessage(text, sender) {
  const chatMessages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg ${sender === 'bot' ? 'bot-msg' : 'user-msg'}`;

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;

  div.appendChild(bubble);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}


function showTyping() {
  const chatMessages = document.getElementById('chatMessages');
  const div = document.createElement('div');
  const id = 'typing-' + Date.now();
  div.id = id;
  div.className = 'msg bot-msg typing-indicator';
  div.innerHTML = `<div class="msg-bubble"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// Fallback responses when API is unavailable (e.g. no API key set yet)
function getFallbackResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes('service') || msg.includes('offer') || msg.includes('help')) {
    return "We offer free medical consultations, medicine assistance, mental health counseling, home visits, and emergency ambulance coordination. All services are completely free for patients in need. Would you like to register or know more about a specific service?";
  }
  if (msg.includes('register') || msg.includes('sign up') || msg.includes('patient')) {
    return "To register for patient support, scroll up to the 'Register' section on this page and fill out the Patient Support form. You can also call us at +91 80 1234 5678. Our team will contact you within 24 hours!";
  }
  if (msg.includes('volunteer') || msg.includes('join')) {
    return "We'd love to have you as a volunteer! Head to the Register section and click on 'Volunteer' tab to fill in your details. We welcome doctors, nurses, students, and anyone passionate about community health!";
  }
  if (msg.includes('free') || msg.includes('cost') || msg.includes('charge') || msg.includes('fee')) {
    return "Yes, all our healthcare support services are 100% free for patients. We are funded by donations and grants. No patient will ever be charged for consultations, medicines, or any other support we provide.";
  }
  if (msg.includes('emergency') || msg.includes('urgent') || msg.includes('serious')) {
    return "For any medical emergency, please call 112 (India Emergency) immediately! For urgent but non-emergency support, call our helpline at +91 80 1234 5678 and we'll connect you with a doctor as quickly as possible.";
  }
  if (msg.includes('mental') || msg.includes('stress') || msg.includes('depression') || msg.includes('anxiety')) {
    return "Mental health is just as important as physical health. We have trained counselors who offer free, confidential sessions. You can register through our form or call us directly. You are not alone — we are here to help.";
  }
  if (msg.includes('medicine') || msg.includes('drug') || msg.includes('tablet')) {
    return "We provide free medicine assistance to patients who cannot afford medications. After registering, a case worker will assess your needs and connect you with our pharmacy partners. Please register using the form on this page.";
  }
  if (msg.includes('location') || msg.includes('where') || msg.includes('district') || msg.includes('area')) {
    return "We currently operate in 38 districts across Karnataka. Our head office is in Koramangala, Bengaluru. For rural or remote areas, we coordinate home visits and health camps. Register to find out about coverage in your area!";
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hello! Welcome to HealthCare Connect. I'm HealthBot, your AI health assistant. I can help you with registering for services, learning about our programs, or answering general health questions. How can I help you today?";
  }
  return "Thank you for your question. For the most accurate information, please call our helpline at +91 80 1234 5678 or email support@healthcareconnect.org. You can also register directly using the form on this page, and our team will assist you personally.";
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// Animate elements on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.contact-card, .form-section, .chat-container').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
