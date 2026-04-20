import re
from io import BytesIO
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from ..utils.file_parser import extract_text_from_pdf, extract_text_from_docx

# Ensure NLTK data is downloaded
def setup_nltk():
    for res in ['tokenizers/punkt', 'corpora/stopwords']:
        try:
            nltk.data.find(res)
        except LookupError:
            nltk.download(res.split('/')[-1], quiet=True)

try:
    setup_nltk()
    STOPWORDS = set(stopwords.words('english'))
except Exception:
    # Fallback if NLTK data not available
    STOPWORDS = set()

def clean_text(text):
    """Clean text by removing special characters and extra whitespace."""
    if not text:
        return ""
    text = str(text).lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_meaningful_keywords(text):
    """Extract keywords that are likely to be skills or important terms."""
    if not text or len(text.strip()) < 3:
        return set()
    try:
        words = word_tokenize(text.lower())
        # Filter: alphanumeric, not a stopword, length > 2
        keywords = {w for w in words if w.isalnum() and w not in STOPWORDS and len(w) > 2}
        return keywords
    except Exception:
        # Fallback: simple word extraction if tokenization fails
        words = text.lower().split()
        return {w for w in words if len(w) > 2 and w.isalnum()}

async def analyze_cv(file, job_desc):
    try:
        filename = file.filename
        
        # 1. Extract Text
        content = await file.read()
        if not content:
            raise ValueError("File is empty. Please upload a valid file.")
        
        file_buffer = BytesIO(content)

        if filename.lower().endswith(".pdf"):
            text = extract_text_from_pdf(file_buffer)
        elif filename.lower().endswith(".docx"):
            file_buffer.seek(0)
            text = extract_text_from_docx(file_buffer)
        else:
            raise ValueError("Unsupported file format. Please upload PDF or DOCX.")

        if not text or not text.strip():
            raise ValueError("Could not extract text from the file. It might be empty or scanned.")

        # Validate job description
        if not job_desc or not job_desc.strip():
            raise ValueError("Job description is empty. Please provide a job description.")

        # 2. Clean and Tokenize
        cleaned_cv = clean_text(text)
        cleaned_job = clean_text(job_desc)

        if not cleaned_cv or not cleaned_job:
            raise ValueError("Unable to process the provided text. Please check your inputs.")

        # 3. Calculate TF-IDF Similarity
        vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1)
        vectors = vectorizer.fit_transform([cleaned_cv, cleaned_job])
        similarity_matrix = cosine_similarity(vectors[0:1], vectors[1:2])
        tfidf_score = float(similarity_matrix[0][0])

        # 4. Keyword Match Score
        cv_keywords = extract_meaningful_keywords(text)
        job_keywords = extract_meaningful_keywords(job_desc)
        
        if not job_keywords:
            match_score = round(tfidf_score * 100, 2)
            missing = []
        else:
            matching_keywords = cv_keywords.intersection(job_keywords) if cv_keywords else set()
            keyword_score = len(matching_keywords) / len(job_keywords) if job_keywords else 0
            
            # Weighted average: 40% TF-IDF, 60% direct keyword match
            final_score = (tfidf_score * 0.4) + (keyword_score * 0.6)
            match_score = round(final_score * 100, 2)
            missing = sorted(list(job_keywords - cv_keywords)) if cv_keywords else sorted(list(job_keywords))

        # 5. Generate recommendations
        recommendations = []
        if missing:
            recommendations = [f"Add the keyword '{w}' to strengthen your match." for w in missing[:5]]
        
        if match_score < 50:
            recommendations.append("Consider restructuring your CV to better match the job requirements.")
        elif match_score > 85:
            recommendations.append("Great match! Your CV aligns well with this job.")
        else:
            recommendations.append("Good match overall. Consider adding more relevant keywords.")

        return {
            "match_score": min(match_score, 100),  # Cap at 100
            "missing_keywords": missing[:15],
            "recommendations": recommendations[:5]  # Limit recommendations
        }
    except ValueError as ve:
        raise ve
    except Exception as e:
        raise ValueError(f"Error analyzing CV: {str(e)}")
