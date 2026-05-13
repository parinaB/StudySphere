# StudySphere 

A real-time classroom comprehension analysis platform built for educators.
StudySphere uses computer vision and deep learning to analyze student facial
expressions during live sessions — giving teachers instant, data-driven
insights into how well their class is following along.

---

## Screenshots

<div align="center">

<table>
  <tr>
    <td align="center"><img width="400" src="https://github.com/user-attachments/assets/85072394-6d09-4628-9da7-70afa73c14d1" /><br/><b>Login Screen</b></td>
    <td align="center"><img width="400" src="https://github.com/user-attachments/assets/3c9b3bb0-77d9-43e4-a596-cdfe3b975a18" /><br/><b>Class Setup</b></td>
  </tr>
  <tr>
    <td align="center"><img width="400" src="https://github.com/user-attachments/assets/f95d069e-c25c-4af6-a870-ba1bc1decd08" /><br/><b>Dashboard</b></td>
    <td align="center"><img width="400" src="https://github.com/user-attachments/assets/dc77fe4b-713d-4ba5-b321-8db9c6c6437a" /><br/><b>Session Report</b></td>
  </tr>
</table>

</div>


---

## Features

- **Real-Time Video Monitoring** — Live webcam feed with per-face comprehension labels updated every frame
- **Snapshot Evaluation** — Upload a classroom photo for instant comprehension analysis across all detected faces
- **Session Reports** — Auto-generated reports with comprehension timeline logged every 30 seconds, concentration trend graph, and final verdict
- **Multi-Theme UI** — Switch between Lilac, Yellow, and Blue themes

---

##  How It Works

1. Faces are detected in each webcam frame using OpenCV Haar Cascades
2. Each face crop is passed to a MobileNetV2 model fine-tuned on FER2013
3. The model outputs a confidence score mapped to:
   - 🟢 **Understood** (≥ 0.65)
   - 🟡 **Uncertain** (0.40 – 0.65)
   - 🔴 **Not Understood** (< 0.40)
4. Scores are aggregated using a weighted formula grounded in Cognitive Load Theory
5. Every 30 seconds, a window report is logged and pushed to the frontend dashboard

---

##  Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Recharts, Custom CSS |
| Backend | Python, Flask, flask-cors |
| ML & Vision | TensorFlow/Keras, OpenCV, MobileNetV2 |
| Dataset | FER2013 (binary: Understood / Not Understood) |

---

##  Getting Started

### Prerequisites

- Python 3.10 (conda `cnn` environment)
- Node.js 18+
- Webcam access

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/studysphere.git
cd studysphere
```

### 2. Start the backend

```bash
conda activate cnn
cd backend
python app.py
```

Backend runs at `http://localhost:5050`

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/evaluate` | Upload image, returns comprehension breakdown |
| GET | `/stream` | Live MJPEG webcam stream |
| GET | `/comprehension` | Latest real-time comprehension score |
| POST | `/start-video` | Start session processing thread |
| POST | `/stop-video` | Stop session cleanly |
| GET | `/session-report` | Full 30-sec timeline + final verdict |

---

## 👩‍💻 Author

Built by Parina — ML student, edutech researcher.  
