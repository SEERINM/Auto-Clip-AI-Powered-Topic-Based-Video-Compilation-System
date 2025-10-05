import React, { useState, useEffect } from "react";

function App() {
  const [topic, setTopic] = useState("");
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [processMessage, setProcessMessage] = useState("");

  useEffect(() => {
    let timer;
    if (processing) {
      setProcessMessage("Please wait, your input is being processed...");
      timer = setTimeout(() => {
        setProcessMessage("Thanks for waiting! Almost done...");
      }, 5000);
    } else {
      setProcessMessage("");
    }
    return () => clearTimeout(timer);
  }, [processing]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setError("");
    setOutputUrl("");
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
    setError("");
    setOutputUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim() || files.length === 0) {
      setError("Please enter topic & select video files.");
      return;
    }
    setProcessing(true);
    setError("");
    setOutputUrl("");
    try {
      const formData = new FormData();
      formData.append("topic", topic);
      files.forEach((file) => {
        formData.append("videos", file);
      });
      const res = await fetch("/api/extract-and-merge", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.output_url) {
        setOutputUrl(data.output_url);
      } else {
        setError(data.message || "No clips found for this topic!");
      }
    } catch (err) {
      setError("Processing failed. Try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Video Topic Summarizer</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Topic to Extract
          <input
            value={topic}
            onChange={handleTopicChange}
            type="text"
            placeholder="e.g. present tense"
            style={styles.input}
            disabled={processing}
          />
        </label>
        <label style={styles.label}>
          Upload .mp4 videos
          <input
            type="file"
            accept=".mp4"
            multiple
            onChange={handleFileChange}
            style={styles.input}
            disabled={processing}
          />
        </label>
        <button
          type="submit"
          disabled={processing}
          style={{
            ...styles.button,
            backgroundColor: processing ? "#6c8bf5" : "#2c5aed",
            cursor: processing ? "not-allowed" : "pointer",
          }}
        >
          {processing ? (
            <>
              <span className="loader" style={styles.loader}></span> Processing...
            </>
          ) : (
            "Extract & Merge"
          )}
        </button>
      </form>

      {processMessage && (
        <div style={styles.processMessage}>{processMessage}</div>
      )}

      {error && <div style={styles.error}>{error}</div>}

      {outputUrl && (
        <div style={styles.outputContainer}>
          <p style={styles.outputText}>✅ Done! Output:</p>
          <a
            href={"http://localhost:5000" + outputUrl}
            download="final_video.mp4"
            style={{ textDecoration: "none" }}
          >
            <button style={styles.downloadButton}>Download Final Video</button>
          </a>
        </div>
      )}

      
      <style>
        {`
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            animation: spin 1s linear infinite;
            display: inline-block;
            vertical-align: middle;
            margin-right: 8px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 520,
    margin: "40px auto",
    padding: 32,
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  },
  title: {
    marginBottom: 28,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: 600,
    marginBottom: 12,
    fontSize: 16,
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    marginTop: 6,
    fontSize: 15,
    borderRadius: 8,
    border: "1.5px solid #ccc",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  },
  button: {
    width: "100%",
    marginTop: 20,
    padding: "14px 0",
    borderRadius: 10,
    border: "none",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    boxShadow: "0 4px 15px rgba(44, 90, 237, 0.4)",
    transition: "background-color 0.3s",
  },
  processMessage: {
    marginTop: 20,
    fontStyle: "italic",
    color: "#555",
    textAlign: "center",
  },
  error: {
    marginTop: 20,
    color: "red",
    fontWeight: 600,
    textAlign: "center",
  },
  outputContainer: {
    marginTop: 30,
    textAlign: "center",
  },
  outputText: {
    fontWeight: 600,
    fontSize: 18,
  },
  downloadButton: {
    backgroundColor: "#19be6b",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 10,
    padding: "12px 32px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(25, 190, 107, 0.5)",
    transition: "background-color 0.3s",
  },
};

export default App;



