from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from utils import transcribe_audio, extract_topic_segments, merge_clips

app = Flask(__name__)
CORS(app)

for folder in ["input_videos", "extracted_clips", "final_output", "transcripts"]:
    os.makedirs(folder, exist_ok=True)

@app.route("/api/extract-and-merge", methods=["POST"])
def extract_and_merge():
    topic = request.form.get("topic", "").strip()
    video_files = request.files.getlist("videos")

    if not topic or len(video_files) == 0:
        return jsonify({"success": False, "output_url": None, "message": "Missing topic or videos"}), 400

    # Better error handling on cleanup
    for folder in ["input_videos", "extracted_clips", "final_output", "transcripts"]:
        for f in os.listdir(folder):
            path = os.path.join(folder, f)
            if os.path.isfile(path):
                try:
                    os.remove(path)
                except Exception as e:
                    print(f"Could not remove {path}: {e}")

    for vid in video_files:
        filename = vid.filename
        vid.save(os.path.join("input_videos", filename))

    video_files = [f for f in os.listdir("input_videos") if f.endswith(".mp4")]
    all_clips = []

    for video in video_files:
        transcript = transcribe_audio(f"input_videos/{video}")
        clips = extract_topic_segments(transcript, topic, f"input_videos/{video}")
        all_clips.extend(clips)

    if not all_clips:
        return jsonify({"success": False, "output_url": None, "message": "No clips found for this topic!"}), 200

    output_file = "final_video.mp4"
    output_path = os.path.join("final_output", output_file)
    merge_clips(all_clips, output_path)
    return jsonify({
        "success": True,
        "output_url": f"/api/download/{output_file}",
        "message": None
    }), 200

@app.route("/api/download/<path:filename>", methods=["GET"])
def download_merged(filename):
    return send_from_directory("final_output", filename, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True)
