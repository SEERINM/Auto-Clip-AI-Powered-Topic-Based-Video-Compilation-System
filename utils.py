from faster_whisper import WhisperModel
from moviepy.editor import VideoFileClip, concatenate_videoclips
import os
import gc

model = WhisperModel("base", device="cpu")

def transcribe_audio(video_path):
    segments, _ = model.transcribe(video_path)
    transcript_text = ""
    timestamps = []
    for seg in segments:
        transcript_text += seg.text + " "
        timestamps.append((seg.start, seg.end, seg.text))
    fname = os.path.basename(video_path).replace(".mp4", ".txt")
    with open(f"transcripts/{fname}", "w") as f:
        f.write(transcript_text)
    return timestamps

def extract_topic_segments(transcript, topic, video_path):
    clip = VideoFileClip(video_path)
    matched_clips = []
    for start, end, text in transcript:
        if topic.lower() in text.lower():
            safe_end = min(end, clip.duration)
            if start < safe_end:
                subclip = clip.subclip(start, safe_end)
                matched_clips.append(subclip)
    # Do NOT close clips here; keep them open for merging
    return matched_clips

def merge_clips(clips, output_path):
    if not clips:
        print("No clips found matching the topic.")
        return
    final = concatenate_videoclips(clips, method="compose")
    final.write_videofile(
        output_path,
        codec='libx264',
        audio_codec='aac',
        preset='medium',
        bitrate='2000k',
        threads=4
    )
    # Close merged clip and all subclips after writing finishes
    final.close()
    for c in clips:
        try:
            c.close()
        except Exception:
            pass
    del final
    gc.collect()




