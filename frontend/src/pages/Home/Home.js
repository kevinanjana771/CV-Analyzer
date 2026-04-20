import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="title">CV Analyzer</h1>
        <p className="subtitle">Optimize your resume for the job you want using AI.</p>
        <button className="cta-button" onClick={() => navigate("/upload")}>
          Start Analysis
        </button>
      </div>
    </div>
  );
}

export default Home;
