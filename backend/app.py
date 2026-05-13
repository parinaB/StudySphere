from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from model import evaluate_image, predict_face, run_video, face_cascade
import cv2
import threading
import time
import os

app = Flask(__name__)
CORS(app)

# Global state
stop_flag = False
latest_score = {"score": 0.0, "label": "No data"}
session_timeline = []
session_stats = {"max_faces": 0}
video_thread = None

@app.route('/evaluate', methods=['POST'])
def evaluate():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No image selected"}), 400
        
    temp_path = f"/tmp/{file.filename}"
    file.save(temp_path)
    
    result = evaluate_image(temp_path)
    
    # Delete temp file after inference
    if os.path.exists(temp_path):
        os.remove(temp_path)
        
    return jsonify(result)

def generate_frames():
    cap = cv2.VideoCapture(0)
    while True:
        success, frame = cap.read()
        if not success:
            break
            
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray, scaleFactor=1.2, minNeighbors=8, minSize=(60, 60)
        )
        
        if len(faces) > 0:
            for (x, y, w, h) in faces:
                face_crop = frame[y:y+h, x:x+w]
                pred, label, color = predict_face(face_crop)
                
                # We do not update latest_score here as requested, 
                # wait, prompt says: "Update global latest_score with current prediction" for /stream?
                # "GET /stream ... Update global latest_score with current prediction"
                # But it also says: "run_video() is the only function that updates session_timeline" and "updates latest_score every frame".
                # If /stream runs, I'll update latest_score here as requested by endpoint 2.
                latest_score["score"] = float(round(pred * 100, 2))
                latest_score["label"] = label
                
                cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                cv2.putText(frame, f"{label} {pred*100:.1f}%", (x, y-10), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                            
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
               
    cap.release()

@app.route('/stream', methods=['GET'])
def stream():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/comprehension', methods=['GET'])
def comprehension():
    return jsonify(latest_score)

@app.route('/start-video', methods=['POST'])
def start_video():
    global stop_flag, session_timeline, video_thread, session_stats
    stop_flag = False
    session_timeline.clear()
    session_stats["max_faces"] = 0
    
    # Start run_video() in a background thread
    video_thread = threading.Thread(
        target=run_video, 
        args=(lambda: stop_flag, session_timeline, latest_score, session_stats),
        daemon=True
    )
    video_thread.start()
    return jsonify({"status": "started"})

@app.route('/stop-video', methods=['POST'])
def stop_video():
    global stop_flag
    stop_flag = True
    # Give it a moment to finish the loop
    time.sleep(0.5)
    return jsonify({"status": "stopped"})

@app.route('/session-report', methods=['GET'])
def session_report():
    if not session_timeline:
        return jsonify({"error": "No session data available"})
        
    scores = [entry['score'] for entry in session_timeline]
    final_score = sum(scores) / len(scores) if scores else 0
    
    if final_score >= 75:
        verdict = "Highly Engaged — Students are mostly attentive"
    elif final_score >= 50:
        verdict = "Moderately Engaged — Some confusion detected"
    else:
        verdict = "Low Engagement — Students need attention"
        
    return jsonify({
        "timeline": session_timeline,
        "final_score": round(final_score, 2),
        "verdict": verdict,
        "unique_faces": session_stats["max_faces"]
    })

if __name__ == '__main__':
    app.run(port=5050, debug=True, threaded=True)
