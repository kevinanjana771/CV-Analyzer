import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Handle case where user visits page directly without state
  if (!state) {
    return (
      <div className="result-container">
        <div className="result-card">
          <h2>❌ No Data Found</h2>
          <p>Please upload a CV first to see results.</p>
          <button className="back-btn" onClick={() => navigate("/upload")}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { match_score, missing_keywords, recommendations } = state;

  // Calculate metrics
  const matchPercentage = Math.min(match_score, 100);
  const missingCount = missing_keywords.length;
  const recommendationCount = recommendations.length;

  // Determine score color and emoji
  let scoreColor = "#e74c3c"; // Red
  let scoreEmoji = "❌";
  let scoreStatus = "Poor Match";
  let scoreAdvice = "Your CV needs significant improvements to match this job.";
  
  if (match_score > 40) {
    scoreColor = "#f39c12"; // Orange
    scoreEmoji = "⚠️";
    scoreStatus = "Fair Match";
    scoreAdvice = "Your CV has some relevant elements but needs improvements.";
  }
  if (match_score > 60) {
    scoreColor = "#f1c40f"; // Yellow
    scoreEmoji = "👍";
    scoreStatus = "Good Match";
    scoreAdvice = "Your CV is well-aligned with this job posting. Consider the recommendations to strengthen it further.";
  }
  if (match_score > 75) {
    scoreColor = "#27ae60"; // Green
    scoreEmoji = "✅";
    scoreStatus = "Excellent Match";
    scoreAdvice = "Your CV is an excellent match for this position. You're well-positioned to apply!";
  }

  return (
    <div className="result-container">
      <div className="result-card">
        <div className="result-header">
          <h2>📊 CV Match Analysis Report</h2>
          <p className="report-date">Generated on {new Date().toLocaleDateString()}</p>
        </div>
        


        <div className="metrics-section">
          <div className="metric-item">
            <span className="metric-label">Match Score</span>
            <div className="score-display" style={{color: scoreColor}}>
              <span className="score-emoji">{scoreEmoji}</span>
              <span className="score-status">{scoreStatus}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${matchPercentage}%`, backgroundColor: scoreColor}}></div>
            </div>
            <span className="metric-value">{matchPercentage}%</span>
            <p className="score-advice">{scoreAdvice}</p>
          </div>
          <div className="metric-row">
            <div className="metric-box">
              <span className="metric-count new">{missingCount}</span>
              <span className="metric-name">Keywords to Add</span>
            </div>
            <div className="metric-box">
              <span className="metric-count action">{recommendationCount}</span>
              <span className="metric-name">Action Items</span>
            </div>
          </div>
        </div>

        <div className="section missing-keywords-section">
          <h3>🎯 Missing Keywords ({missingCount})</h3>
          {missingCount > 0 ? (
            <div className="keywords-container">
              <p className="section-tip">Add these keywords to strengthen your match:</p>
              <ul className="keyword-list">
                {missing_keywords.map((k, i) => (
                  <li key={i} className="keyword-tag">
                    <span className="keyword-icon">➕</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="success-msg">🎉 Excellent! All key skills are covered in your CV.</p>
          )}
        </div>

        <div className="section recommendations-section">
          <h3>💡 Recommendations for Improvement</h3>
          {recommendationCount > 0 ? (
            <ul className="rec-list">
              {recommendations.map((r, i) => (
                <li key={i} className="rec-item">
                  <span className="rec-check">✓</span>
                  <span className="rec-text">{r}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="success-msg">👏 No recommendations needed!</p>
          )}
        </div>

        <div className="action-section">
          <button className="back-btn" onClick={() => navigate("/upload")}>
            🔄 Analyze Another Resume
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
