# StudySphere 🎓

StudySphere is a real-time, AI-powered classroom comprehension analysis platform designed to empower educators. By leveraging computer vision and machine learning, it provides instant insights into student engagement and understanding.

## 📸 Application Showcase

*(Replace the placeholder image paths in this table with your actual screenshot files once captured)*

| Live Video Dashboard | Snapshot Evaluation |
| :---: | :---: |
| <img src="/Users/astitva/Desktop/Screenshot 2026-05-14 at 1.35.28 AM.png" width="400" alt="Dashboard Video"/> | <img src='/Users/astitva/Desktop/Screenshot 2026-05-14 at 1.35.22 AM.png' width="400" alt="Dashboard Snapshot"/> |
| **Detailed Session Reports** | **Class Setup & Themes** |
| <img src='/Users/astitva/Desktop/Screenshot 2026-05-14 at 1.35.28 AM.png' width="400" alt="Session Report"/> | <img src= width="400" alt="Class Setup"/> |
| <img src='/Users/astitva/Desktop/Screenshot 2026-05-14 at 1.35.28 AM.png' width="400" alt="Session Report"/> | <img src= width="400" alt="Class Setup"/> |

---

## ✨ Features
- **Real-Time Video Monitoring:** Track student comprehension on the fly using your webcam.
- **Snapshot Evaluation:** Upload static classroom photos for instant, detailed analysis.
- **Intelligent Session Reports:** Automatically generate reports with high-resolution concentration trend graphs (recorded every 5 seconds) and "Peak Attention" detection.
- **Customizable Themes:** Switch dynamically between three premium UI aesthetics: Lilac, Yellow, and Blue.

## 🛠 Tech Stack
- **Frontend:** React, Vite, Recharts, Custom CSS
- **Backend:** Python, Flask, OpenCV (Stricter Haar Cascades), TensorFlow/Keras

## 🚀 Getting Started

### 1. Run the Backend
Ensure you have your conda environment activated.
```bash
cd backend
python app.py
```

### 2. Run the Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the application!
