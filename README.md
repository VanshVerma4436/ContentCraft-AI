# ContentCraft AI

> AI-powered content generation platform built with **React + FastAPI + OpenRouter AI**

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment (recommended)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure your API key
# Open .env and replace with your actual OpenRouter API key
# OPENROUTER_API_KEY=your_actual_key_here
# OPENROUTER_MODEL=google/gemini-2.5-flash

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**
API Docs (Swagger): **http://localhost:8000/docs**

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔑 Getting Your OpenRouter API Key

1. Visit [OpenRouter API Keys](https://openrouter.ai/keys)
2. Sign in or create an account
3. Click **"Create Key"**
4. Copy the key and paste it into `backend/.env`:
   ```
   OPENROUTER_API_KEY=your_key_here
   OPENROUTER_MODEL=google/gemini-2.5-flash
   ```

---

## 🛠 Tech Stack

| Layer     | Technology           |
|-----------|---------------------|
| Frontend  | React + TypeScript  |
| Styling   | Tailwind CSS v3     |
| HTTP      | Axios               |
| Icons     | React Icons         |
| Backend   | FastAPI (Python)    |
| AI Model  | OpenRouter (Gemini, Llama, DeepSeek, etc.) |
| Env Vars  | python-dotenv       |

---

## 📁 Project Structure

```
AI_Content_Generation/
├── backend/
│   ├── main.py           # FastAPI app + OpenRouter integration
│   ├── requirements.txt  # Python dependencies
│   ├── .env              # API key (DO NOT COMMIT)
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── Hero.tsx
    │   │   ├── ContentForm.tsx
    │   │   ├── OutputCard.tsx
    │   │   ├── HistorySection.tsx
    │   │   └── Footer.tsx
    │   ├── services/
    │   │   └── api.ts        # Axios API calls
    │   ├── types/
    │   │   └── index.ts      # TypeScript types
    │   ├── App.tsx           # Root component
    │   ├── main.tsx          # Entry point
    │   └── index.css         # Global styles + Tailwind
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.ts
```

---

## ✨ Features

- **7 Content Types**: Blog Post, LinkedIn Post, Instagram Caption, Product Description, Email, Marketing Copy, YouTube Script
- **5 Tones**: Professional, Casual, Friendly, Marketing, Educational
- **3 Lengths**: Short, Medium, Long
- **Copy & Download**: One-click copy to clipboard, download as TXT
- **History**: Browser localStorage history with view/reuse/delete
- **Responsive**: Mobile-first, works on all size sizes
- **Dark SaaS UI**: Glassmorphism, gradients, smooth animations

---

## 🔌 API Endpoints

| Method | Path      | Description         |
|--------|-----------|---------------------|
| GET    | /         | Health check        |
| POST   | /generate | Generate AI content |
| GET    | /docs     | Swagger API docs    |

---

## ⚠️ Notes

- Keep your `GOOGLE_API_KEY` secret — never commit `.env` to git
- Be mindful of rate limits or token credits on your OpenRouter account
- History is stored in browser localStorage (client-side only)
