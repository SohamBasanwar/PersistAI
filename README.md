# 🚀 PersistAI – AI-Powered Resume Builder

PersistAI is an AI-enhanced resume builder that auto-tailors your resume to match job descriptions using a custom AI scoring model. With a clean, user-friendly interface and intelligent optimization, PersistAI helps job seekers build high-impact, ATS-friendly resumes in minutes.

> 🛡️ This repository contains only the **public-facing frontend**. All sensitive files (e.g., Firebase config, backend logic, AI model) are maintained separately in a **private repository** for security reasons.

---

## 🌟 Features

* 📄 **Multi-Step Resume Input** – Add education, experience, projects, skills, achievements, and more
* 🤖 **AI Resume Scoring** – Intelligent matching of resume entries to job descriptions *(private backend)*
* 📝 **NEW: Cover Letter Generator** – Instantly generate tailored cover letters using GPT
* 📱 **Cross-Platform UI** – Works on both web and mobile via React Native + Expo
* ☁️ **Cloud Data Sync** – Firebase integration *(not included in this public repo)*

---

## 🎥 Demo Videos

* 🔹 [Main Demo – Resume Builder Walkthrough](https://youtu.be/LUslo5eH1Ac)
* 🔹 [Latest Update – Cover Letter Generator Feature](https://youtu.be/fgEIEknOvI8)

---

## 🛠️ Tech Stack

* **Frontend:** React Native (Expo SDK)
* **Navigation:** React Navigation
* **Cloud:** Firebase (Firestore, Auth) *(private keys excluded)*
* **AI Scoring:** Python (Flask + SBERT) *(in private repo)*
* **PDF Generation:** Handled server-side *(in private repo)*

---

## 🔒 What's Not Included (Private Files)

This repo **excludes the following for security reasons**:

* `firebase.ts` – Firebase project config
* `config.js` – App environment variables
* `ContactScreen.tsx` – Contact logic and submission
* `backend/` – Scoring engine, AI model, PDF generation logic

These files are maintained in the private repository:
🔐 [`privates.PersistAI`](https://github.com/SohamBasanwar/privates.PersistAI)

---

## 🚀 Getting Started (Frontend UI Only)

To test the public UI locally:

"`bash
cd frontend
npm install
npx expo start
```

> **Note:** This version uses mock data and does not include Firebase, AI scoring, or PDF generation. It is meant for UI demonstration only.

---

## 📬 Contact

Made with ❤️ by **Soham Basanwar**
🔗 [Portfolio](https://sohambasanwar.netlify.app)
🔗 [LinkedIn](https://linkedin.com/in/sohambasanwar)
📧 Email: [sohamdono03@gmail.com](mailto:sohamdono03@gmail.com)

> **Notice:** This website was shut down for public use due to high costs.

---

## 📄 License

**All rights reserved © 2025 Soham Basanwar.**
This project is **not open-source**; you **may not** use, copy, modify, publish, or distribute any part of this codebase without **explicit written permission** from the author.

Please take a look at the [LICENSE](LICENSE) file for complete details.

For permission inquiries, contact: [sohamdono03@gmail.com](mailto:sohamdono03@gmail.com)

