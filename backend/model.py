import cv2
import numpy as np
from tensorflow.keras.models import load_model
import time

model = load_model(os.path.join(os.path.dirname(__file__), "models", "model.keras"))
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

print("face detector loaded!")

def predict_face(face_crop):

    face_resized = cv2.resize(face_crop, (48, 48))
    face_norm = face_resized.astype("float32") / 255.0
    face_input = np.expand_dims(face_norm, axis=0)

    pred = float(model.predict(face_input, verbose=0)[0][0])

    if pred >= 0.85:
        return pred, "Understood", (0, 255, 0)

    elif pred >= 0.70:
        return pred, "Uncertain", (0, 255, 255)

    else:
        return pred, "Not Understood", (0, 0, 255)
        
        
        
def evaluate_image(image_path):
    frame = cv2.imread(image_path)
    if frame is None:
        return {"error": "Image not found"}

    # ---- IMPROVEMENT 1: use RGB for better detection ----
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # ---- IMPROVEMENT 2: looser cascade params to catch more faces ----
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.2,       # was 1.05
        minNeighbors=8,        # was 3 — strict to avoid false positives
        minSize=(60, 60)       # was 20x20
    )

    if len(faces) == 0:
        return {"error": "No faces detected in image"}

    u = un = n = 0

    for (x, y, w, h) in faces:
        # ---- IMPROVEMENT 3: add padding around face crop ----
        pad = 10
        x1 = max(0, x - pad)
        y1 = max(0, y - pad)
        x2 = min(frame.shape[1], x + w + pad)
        y2 = min(frame.shape[0], y + h + pad)
        face_crop = frame[y1:y2, x1:x2]

        face_resized = cv2.resize(face_crop, (48, 48))

        face_resized = cv2.resize(face_crop, (48, 48))

        # model expects (None, 48, 48, 3) — keep color, just normalize
        face_norm = face_resized.astype("float32") / 255.0
        face_input = np.expand_dims(face_norm, axis=0)   # (1, 48, 48, 3)

        pred = float(model.predict(face_input, verbose=0)[0][0])


        # ---- IMPROVEMENT 5: relaxed thresholds ----

        
        if pred >= 0.65:
            label = "Understood"
            color = (0, 255, 0)
            u += 1
        elif pred >= 0.40:
            label = "Uncertain"
            color = (0, 255, 255)
            un += 1
        else:
            label = "Not Understood"
            color = (0, 0, 255)
            n += 1

        cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
        cv2.putText(frame, f"{label} {pred*100:.1f}%",
                    (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    # ---- REPORT (unchanged logic, same formula) ----
    total = u + un + n
    if total > 0:
        final_score = (u + un * 0.5) / total * 100
        if final_score >= 75:
            verdict_string = "Highly Engaged — Students are mostly attentive"
        elif final_score >= 50:
            verdict_string = "Moderately Engaged — Some confusion detected"
        else:
            verdict_string = "Low Engagement — Students need attention"

        return {
            "understood_pct": round(u / total * 100, 2),
            "uncertain_pct": round(un / total * 100, 2),
            "not_understood_pct": round(n / total * 100, 2),
            "final_score": round(final_score, 2),
            "verdict": verdict_string,
            "unique_faces": len(faces)
        }
    return {"error": "No data collected"}
    
def run_video(get_stop_flag, session_timeline, latest_score, session_stats):

    cap = cv2.VideoCapture(0)
    print("Video session started")

    window_start = time.time()
    session_start = time.time()

    # ---------------- WINDOW COUNTERS ----------------
    u = 0
    un = 0
    n = 0

    while True:
        if get_stop_flag():
            print("Stop flag detected. Ending video session.")
            break

        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        faces = face_cascade.detectMultiScale(
            gray, scaleFactor=1.2, minNeighbors=8, minSize=(60, 60)
        )

        if len(faces) > 0:
            if len(faces) > session_stats["max_faces"]:
                session_stats["max_faces"] = len(faces)

            for (x, y, w, h) in faces:
                face_crop = frame[y:y+h, x:x+w]
                pred, label, color = predict_face(face_crop)

                # ---------------- UPDATE COUNTERS ----------------
                if pred >= 0.75:
                    u += 1
                elif pred >= 0.70:
                    un += 1
                else:
                    n += 1

                # Update global latest_score
                latest_score["score"] = float(round(pred * 100, 2))
                latest_score["label"] = label

        # ---------------- 5 SEC REPORT ----------------
        if time.time() - window_start >= 5:
            total = u + un + n
            if total > 0:
                final_score_for_this_window = (u + un * 0.5) / total * 100
                
                elapsed_seconds = int(time.time() - session_start)
                minutes = elapsed_seconds // 60
                seconds = elapsed_seconds % 60
                elapsed_time_string = f"{minutes}:{seconds:02d}"

                session_timeline.append({
                    "time": elapsed_time_string,
                    "understood_pct": round(u / total * 100, 2),
                    "uncertain_pct": round(un / total * 100, 2),
                    "not_understood_pct": round(n / total * 100, 2),
                    "score": round(final_score_for_this_window, 2)
                })

            u = un = n = 0
            window_start = time.time()

    # ---------------- FINAL CLEANUP ----------------
    cap.release()
