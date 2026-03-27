# HealthCare Connect – NGO Healthcare Support Portal

A clean, responsive web app designed for a non-profit healthcare NGO to manage patient support requests, volunteer registrations, and provide AI-powered health assistance.

---

## 📁 Project Structure

```
healthcare-connect/
├── index.html     → Main HTML (all sections: hero, form, chatbot, contact)
├── style.css      → Full responsive CSS with custom design system
├── script.js      → Form logic + AI chatbot (Claude API integration)
└── README.md      → This file
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Fonts | Google Fonts (Playfair Display + DM Sans) |
| AI/Chatbot | Anthropic Claude API (claude-sonnet-4-20250514) |
| Hosting | Vercel (recommended) / Netlify / Render |

**No build tools or npm required** — pure HTML/CSS/JS. Open `index.html` directly in any browser.

---

## 🤖 AI Idea – HealthBot (AI FAQ Chatbot)

### Concept
**HealthBot** is an AI-powered assistant embedded in the app, built using the Anthropic Claude API. It allows patients and volunteers to ask natural language questions and receive instant, empathetic, context-aware answers — 24/7 without human staff involvement.

### How It Works
1. User types a question in the chat interface
2. The frontend sends the message to Claude API with a healthcare-specific **system prompt**
3. The system prompt defines HealthBot's persona: an NGO health support assistant aware of all services, locations, and guidelines
4. Claude responds with a concise, warm, helpful answer
5. Full **conversation history** is maintained — the bot remembers context across the session

### Key Features
- **Multi-turn memory** — remembers the full conversation
- **Quick replies** — pre-built buttons for common questions
- **Fallback responses** — works offline with pre-written answers when API is unavailable
- **Emergency detection** — directs urgent cases to call 112

### NGO Use-Case Value
- Reduces call center load by handling repetitive FAQs automatically
- Available 24/7, even outside office hours
- Can be extended to support regional languages (Kannada, Telugu, etc.)
- Scalable — can handle hundreds of queries simultaneously
- Can be integrated with WhatsApp Business API for wider reach

---

## 📋 Features

- **Patient Support Form** — Name, age, location, medical concern, type of support needed
- **Volunteer Registration Form** — Profession, availability, motivation
- **AI Chatbot** — Real-time Q&A with context memory and fallback mode
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Smooth Animations** — Scroll-triggered reveals, floating cards, typing indicator
- **Contact Section** — Address, phone, email for the NGO

---

## 🚀 How to Run Locally

1. Download or clone this repository
2. Open `index.html` in your browser — no installation needed!
3. *(Optional)* To enable live AI responses, add your Anthropic API key:
   - Open `script.js`
   - Find `window.ANTHROPIC_API_KEY || ''`
   - Replace `''` with your API key string: `'sk-ant-...'`
   - **Note:** For production, use environment variables or a backend proxy

---

## 🌍 Deploying to Vercel (Free, Recommended)

1. Go to [vercel.com](https://vercel.com) and create a free account
2. Click **"Add New Project"**
3. Drag and drop your project folder, or connect your GitHub repo
4. Click **Deploy**
5. Your live URL will be ready in ~30 seconds!

---

## 💡 Future Enhancements

- WhatsApp chatbot integration via Twilio
- Patient data dashboard for NGO staff
- Multilingual support (Kannada, Telugu, Hindi)
- SMS notifications via Twilio when a request is received
- Admin panel for managing registrations
- Google Sheets integration to log form submissions

---

## 👩‍💻 Built For
Internship Assignment – Mini Healthcare Support Web App  
Submitted by: [Your Name]  
Date: March 2026
