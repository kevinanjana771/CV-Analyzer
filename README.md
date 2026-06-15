# 📄 CV Analyzer

An AI-powered CV/Resume analysis tool that compares your resume against a job description and provides a match score, identifies missing keywords, and offers actionable recommendations to improve your chances of landing the job.

## ✨ Features

- **Resume Upload** — Upload your CV in PDF or DOCX format
- **Job Description Matching** — Paste any job description to compare against
- **AI-Powered Scoring** — Uses TF-IDF vectorization and cosine similarity for intelligent matching
- **Keyword Analysis** — Identifies missing keywords from the job description
- **Smart Recommendations** — Actionable suggestions to improve your CV's match score
- **Modern UI** — Clean, responsive React frontend

## 🛠️ Tech Stack

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **NLP:** scikit-learn (TF-IDF), NLTK (tokenization & stopwords)
- **File Parsing:** pdfplumber (PDF), python-docx (DOCX)
- **Server:** Uvicorn

### Frontend
- **Framework:** [React](https://react.dev/) 18
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Build Tool:** Create React App

### Deployment
- **Platform:** [Vercel](https://vercel.com/) (full-stack)

## 📁 Project Structure

```
cv-analyzer/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py          # API endpoints
│   │   ├── core/
│   │   │   └── config.py          # CORS & middleware config
│   │   ├── models/
│   │   │   └── response.py        # Pydantic response models
│   │   ├── services/
│   │   │   └── analyzer.py        # Core CV analysis logic
│   │   ├── utils/
│   │   │   └── file_parser.py     # PDF/DOCX text extraction
│   │   └── main.py                # FastAPI app entry point
│   ├── requirements.txt
│   ├── run.py                     # Local dev server runner
│   └── test_analyzer.py           # Unit tests
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home/              # Landing page
│   │   │   ├── Upload/            # File upload page
│   │   │   └── Result/            # Analysis results page
│   │   ├── routes/                # Route definitions
│   │   ├── services/              # API service layer
│   │   ├── App.js                 # Root component
│   │   └── index.js               # React entry point
│   └── package.json
├── vercel.json                    # Vercel deployment config
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Python** 3.9+
- **Node.js** 16+
- **npm** 8+

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate          # Windows

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python run.py
```

The API will be running at `http://127.0.0.1:8000`.

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app will be running at `http://localhost:3000`.

## 📡 API Reference

### `POST /api/analyze`

Analyzes a CV against a job description.

**Request:** `multipart/form-data`

| Field      | Type   | Description                        |
| ---------- | ------ | ---------------------------------- |
| `file`     | File   | CV file (`.pdf` or `.docx`)        |
| `job_desc` | String | Job description text to match against |

**Response:**

```json
{
  "match_score": 72.5,
  "missing_keywords": ["kubernetes", "docker", "ci/cd"],
  "recommendations": [
    "Add the keyword 'kubernetes' to strengthen your match.",
    "Good match overall. Consider adding more relevant keywords."
  ]
}
```

### `GET /`

Health check endpoint — returns `{ "status": "healthy" }`.

## ⚙️ How It Works

1. **Text Extraction** — Parses uploaded PDF/DOCX and extracts raw text
2. **Text Cleaning** — Normalizes text (lowercasing, special character removal)
3. **TF-IDF Vectorization** — Converts CV and job description into TF-IDF vectors (unigrams + bigrams)
4. **Cosine Similarity** — Calculates similarity score between the two vectors
5. **Keyword Matching** — Extracts meaningful keywords using NLTK and computes a direct keyword overlap score
6. **Weighted Scoring** — Final score = 40% TF-IDF similarity + 60% keyword match
7. **Recommendations** — Generates actionable tips based on missing keywords and overall score

## 🧪 Running Tests

```bash
cd backend
python test_analyzer.py
```

## 🌐 Deployment

This project is configured for deployment on **Vercel**. The `vercel.json` handles routing:

- `/api/*` → Python backend (FastAPI)
- `/*` → React frontend (static build)

To deploy:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
