````markdown
# 🎬 Auto-Clip: AI-Powered Topic-Based Video Compilation System

## 📌 Overview
**Auto-Clip** is an AI-powered application that helps users quickly find and compile **topic-based clips** from multiple videos into a single merged output video.  

Users simply:
1. Upload multiple videos  
2. Provide a **topic keyword** (e.g., "Artificial Intelligence")  
3. Get an automatically generated video containing only the relevant clips from all uploaded videos  

This project is designed for **students, educators, and content creators** to save time and focus on exactly what they need.

---

## ⚙️ Tech Stack
- **Backend**: Python, Whisper AI (speech-to-text), MoviePy/FFmpeg (video processing)
- **Frontend**: React.js
- **Database**: SQLite (for dynamic extension, optional)
- **Other Tools**: Virtual environment (venv), npm

---

## 🚀 Features
- 🎥 Upload multiple videos (MP4)
- 📝 Automatic transcription of audio to text
- 🔎 Topic-based extraction of relevant clips
- ✂️ Smart merging of clips into one video
- 🌐 Simple React frontend for interaction

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/SEERINM/Auto-Clip-AI-Powered-Topic-Based-Video-Compilation-System.git
cd Auto-Clip-AI-Powered-Topic-Based-Video-Compilation-System
````

---

### 2. Backend Setup

```bash
# Create backend folder
mkdir backend
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate   # (Windows)
# or
source venv/bin/activate  # (Mac/Linux)

# Install dependencies
pip install -r requirements.txt

# Create required folders
mkdir input_videos transcripts extracted_clips final_output
```

✅ Place these files into the backend folder:

* `main.py`
* `utils.py`
* `requirements.txt`

---

### 3. Frontend Setup

```bash
# Go back to root project folder
cd ..

# Create React frontend
npx create-react-app frontend
cd frontend

# Install dependencies
npm install
```

✅ Inside `frontend/src/`, replace `App.js` with the provided `App.js`.

---

## ▶️ Running the Application

### Run Backend

```bash
cd backend
venv\Scripts\activate   # (Windows)
# or
source venv/bin/activate  # (Mac/Linux)

python main.py
```

### Run Frontend

```bash
cd frontend
npm start
```

---

## 📂 Project Structure

```
backend/
│── input_videos/       # Upload your MP4 videos here
│── transcripts/        # Auto-generated transcripts
│── extracted_clips/    # Extracted clips matching topic
│── final_output/       # Final merged video
│── utils.py
│── main.py
│── requirements.txt

frontend/
│── src/
    └── App.js          # Frontend user interface
```
## 👨‍💻 Author

Developed by **SEERINM**
Department of Computer Science & Engineering

