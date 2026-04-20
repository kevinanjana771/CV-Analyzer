import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeCV } from "../../services/api";
import "./Upload.css";

function Upload() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!validTypes.includes(selectedFile.type)) {
        setFileError("Please upload a PDF or DOCX file");
        setFile(null);
        return;
      }
      setFileError("");
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDesc) {
      alert("Please upload a CV and enter a job description.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_desc", jobDesc);

    try {
      const res = await analyzeCV(formData);
      navigate("/result", { state: res.data });
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.detail || err.message || "Error analyzing CV";
      alert("Error: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>📄 Upload Your Resume</h2>
        <p className="upload-subtitle">Upload your CV and job description to find your match score</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="resume">Resume (PDF or DOCX)</label>
            <label htmlFor="file-input" className="file-input-wrapper">
              <input 
                id="file-input"
                type="file" 
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className={fileError ? "error" : ""}
              />
              <div className="file-input-content">
                <span className="file-icon">📁</span>
                <span className="file-label">{file ? file.name : "Click to select file"}</span>
              </div>
            </label>
            {fileError && <p className="error-msg">{fileError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="jobdesc">Job Description</label>
            <textarea
              id="jobdesc"
              placeholder="Paste the job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="job-textarea"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <span className="loading-spinner">⏳ Analyzing...</span>
            ) : (
              <span>🚀 Analyze Match</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;
