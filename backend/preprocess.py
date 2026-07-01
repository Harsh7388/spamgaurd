"""
Text preprocessing utilities for SpamGuard.
Used identically during training and inference to avoid train/serve skew.
"""
import re
import string

try:
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer
    from nltk.tokenize import word_tokenize
except Exception:  # pragma: no cover - fallback for serverless environments
    stopwords = None
    WordNetLemmatizer = None
    word_tokenize = None

try:
    _lemmatizer = WordNetLemmatizer() if WordNetLemmatizer is not None else None
    _stopwords = set(stopwords.words("english")) if stopwords is not None else set()
except Exception:  # pragma: no cover - fallback if NLTK data is missing
    _lemmatizer = None
    _stopwords = {
        "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from",
        "has", "have", "he", "her", "here", "hers", "him", "his", "how", "i",
        "in", "is", "it", "its", "me", "my", "of", "on", "or", "our", "ours",
        "she", "that", "the", "their", "them", "there", "these", "they", "this",
        "those", "to", "was", "were", "what", "when", "where", "which", "who",
        "whom", "why", "will", "with", "you", "your", "yours"
    }

# Keep a few words that are actually useful spam signals even though
# generic stopword lists sometimes drop short ones like "free"/"win" — not stopwords anyway,
# but we explicitly DON'T remove digits since "100% free", "$$$" etc. matter.


def clean_text(text: str) -> str:
    """Lowercase, strip punctuation/numbers-noise, tokenize, remove stopwords, lemmatize."""
    if not isinstance(text, str):
        text = str(text)

    # 1. Lowercase
    text = text.lower()

    # 2. Remove URLs and emails (common spam noise, replace with tokens)
    text = re.sub(r"http\S+|www\.\S+", " urltoken ", text)
    text = re.sub(r"\S+@\S+", " emailtoken ", text)

    # 3. Remove punctuation
    text = text.translate(str.maketrans("", "", string.punctuation))

    # 4. Tokenization
    if word_tokenize is not None:
        try:
            tokens = word_tokenize(text)
        except Exception:
            tokens = re.findall(r"[A-Za-z]+", text)
    else:
        tokens = re.findall(r"[A-Za-z]+", text)

    # 5. Remove stopwords + non-alphabetic junk (keep alpha tokens only)
    tokens = [t for t in tokens if t.isalpha() and t not in _stopwords and len(t) > 1]

    # 6. Lemmatization
    if _lemmatizer is not None:
        tokens = [_lemmatizer.lemmatize(t) for t in tokens]
    else:
        tokens = [t.rstrip("s") for t in tokens]

    return " ".join(tokens)
