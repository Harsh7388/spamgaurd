"""
app.py - SpamGuard Flask API

Endpoints:
  GET  /health   -> service + model status
  POST /predict  -> { "message": "..." } -> prediction, confidence, keywords, explanation
"""
import json
import os
import sys
from pathlib import Path

import joblib
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from preprocess import clean_text

app = Flask(__name__)
CORS(app)

MODEL_PATH = BASE_DIR / "spam_model.pkl"
VEC_PATH = BASE_DIR / "vectorizer.pkl"
META_PATH = BASE_DIR / "model_metadata.json"

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VEC_PATH)

metadata = {}
if META_PATH.exists():
    with META_PATH.open(encoding="utf-8") as f:
        metadata = json.load(f)

# A curated list of classic spam-trigger words used to make the "top suspicious
# keywords" explanation human-readable, intersected with the words that
# actually carry the highest TF-IDF / model weight in the submitted message.
SPAM_TRIGGER_HINTS = {
    "free", "win", "winner", "won", "cash", "prize", "offer", "urgent",
    "click", "buy", "credit", "loan", "discount", "guarantee", "congratulation",
    "congratulations", "claim", "limited", "act", "now", "txt", "text",
    "call", "selected", "award", "bonus", "deal", "subscribe", "risk",
    "investment", "viagra", "lottery", "million", "deposit", "verify",
    "account", "password", "bank", "gift", "voucher", "exclusive",
}


def get_feature_weights(model_obj):
    """Return a 1D array of per-feature weights, regardless of model type."""
    if hasattr(model_obj, "coef_"):
        coef = model_obj.coef_
        if hasattr(coef, "toarray"):  # handle sparse coef_ (e.g. linear-kernel SVC)
            coef = coef.toarray()
        return np.asarray(coef).ravel()
    if hasattr(model_obj, "feature_log_prob_"):
        # Naive Bayes: spam-class log prob minus ham-class log prob ~ feature importance
        return model_obj.feature_log_prob_[1] - model_obj.feature_log_prob_[0]
    return None


def top_keywords(raw_message, cleaned_message, top_n=5):
    """Pick the most influential words in this specific message for the prediction."""
    feature_names = vectorizer.get_feature_names_out()
    vec = vectorizer.transform([cleaned_message])
    weights = get_feature_weights(model)

    scored = []
    if weights is not None:
        nonzero_idx = vec.nonzero()[1]
        for idx in nonzero_idx:
            tfidf_val = vec[0, idx]
            word = feature_names[idx]
            # skip bigrams for display simplicity, keep single words
            if " " in word:
                continue
            score = tfidf_val * weights[idx]
            scored.append((word, score))
        scored.sort(key=lambda x: x[1], reverse=True)

    keywords = [w for w, s in scored if s > 0][:top_n]

    # Fallback / augmentation: include any classic trigger words present in the raw text
    lowered = raw_message.lower()
    for trigger in SPAM_TRIGGER_HINTS:
        if trigger in lowered and trigger not in keywords and len(keywords) < top_n:
            keywords.append(trigger)

    return keywords[:top_n]


def build_explanation(prediction, keywords):
    if prediction == "Spam":
        if keywords:
            words_str = ", ".join(f"'{w.capitalize()}'" for w in keywords[:3])
            return (
                f"This email contains words such as {words_str}, which are commonly "
                "found in spam and promotional messages. The pattern of language used "
                "closely matches known spam characteristics."
            )
        return "This email's overall language pattern closely matches known spam characteristics."
    else:
        return (
            "This email's content and language pattern resemble normal, legitimate "
            "correspondence. No strong spam indicators were detected."
        )


@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "ok",
        "service": "SpamGuard API",
        "message": "Backend is running.",
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model": metadata.get("best_model", "unknown"),
        "metrics": metadata.get("results", {}),
    })


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "")

    if not message or not message.strip():
        return jsonify({"error": "Message cannot be empty."}), 400

    if len(message.strip()) < 3:
        return jsonify({"error": "Message is too short to analyze."}), 400

    cleaned = clean_text(message)
    if not cleaned.strip():
        # message had no meaningful tokens after cleaning (e.g. only symbols)
        cleaned = message.lower()

    vec = vectorizer.transform([cleaned])

    pred = model.predict(vec)[0]
    label = "Spam" if pred == 1 else "Not Spam"

    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(vec)[0]
        spam_prob = float(proba[1]) * 100
        ham_prob = float(proba[0]) * 100
    else:
        # decision_function fallback (e.g. LinearSVC without probability=True)
        score = model.decision_function(vec)[0]
        spam_prob = float(1 / (1 + np.exp(-score))) * 100
        ham_prob = 100 - spam_prob

    confidence = spam_prob if pred == 1 else ham_prob
    keywords = top_keywords(message, cleaned)
    explanation = build_explanation(label, keywords)

    return jsonify({
        "prediction": label,
        "confidence": round(confidence, 2),
        "spam_probability": round(spam_prob, 2),
        "ham_probability": round(ham_prob, 2),
        "keywords": keywords,
        "explanation": explanation,
        "model_used": metadata.get("best_model", "ML Model"),
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
