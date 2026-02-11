# 🚀 Promptly Frontend

🌐 **Deployed Application**: _Add your deployed frontend URL here_

---

# 📑 Table of Contents
- [🎯 Project Overview](#-project-overview)
- [🧩 Core Features](#-core-features)
- [👤 Developer Role](#-developer-role)
- [🧱 System Highlights](#-system-highlights)
- [🗂️ Project Architecture](#-project-architecture)
- [🛠️ Tech Stack](#-tech-stack)
- [⚙️ Environment Variables](#️-environment-variables)
- [🧪 Getting Started](#-getting-started)
- [🔗 Project References](#-project-references)
- [📄 Credits](#-credits)
- [🚀 Future Enhancements](#-future-enhancements)

---

## 🎯 Project Overview

Promptly Frontend is a React + Vite application supporting both Learner Mode (coding exercises with AI emotion detection) and Developer Mode (split-screen AI orchestration).

---

## 🧩 Core Features

### 📌 (Developer Mode)
- DevSession management UI
- Split-screen Coder / Explainer interface
- Pipeline & Parallel mode switching
- Stream-based AI message handling
- Multi-model run visualization

### 🗂️ (Learner Mode)
- Language & exercise browsing
- Code editor interface
- Submission feedback display
- Emotion-triggered encouragement/jokes
- Camera toggle with CPU optimization

### 👥 Authentication
- JWT login/register UI
- Global Auth Context
- Axios interceptor for auto token injection
- Protected routes


---

## 🧱 System Highlights

- AI Vision Engine with face-api
- Singleton AI Loader
- Split UI streaming protocol handler
- State-isolated Coder & Explainer chats
- Optimized detection loop (600ms smoothing)

---

## 🗂️ Project Architecture

```
Promptly-FE/
├── public/models/
├── src/
│   ├── services/
│   ├── hooks/
│   ├── components/
│   ├── pages/
│   └── context/
├── vite.config.js
└── package.json
```

---

## 🛠️ Tech Stack

- React
- Vite
- Axios
- face-api (@vladmandic/face-api)
- Tailwind CSS
- Codemirror

---

## ⚙️ Environment Variables

```
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🧪 Getting Started

```bash
git clone https://github.com/BAlshowaikh/Promptly-FE.git
cd Promptly-FE
npm install
npm run dev
```

---

## 🔗 Project References

- https://github.com/BAlshowaikh/Promptly (BE)
- React Documentation
- face-api

---

## 📄 Credits

Built by **BAlshowaikh**

---

## 🚀 Future Enhancements

- TanStack Query rather than useEffect
- UI animations
- Advanced AI state visualization
