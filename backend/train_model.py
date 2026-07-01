"""
train_model.py
Trains Multinomial Naive Bayes, Logistic Regression, and SVM on a spam/ham
dataset, compares accuracy/F1, and saves the best model + TF-IDF vectorizer.
"""
import json
import time

import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC, SVC

from preprocess import clean_text

print("Loading dataset...")
df = pd.read_csv("dataset/sms.tsv", sep="\t", header=None, names=["label", "message"])
df = df.dropna()
df["label_num"] = df["label"].map({"ham": 0, "spam": 1})
print(f"Total samples: {len(df)}  |  spam: {df['label_num'].sum()}  ham: {(df['label_num']==0).sum()}")

print("Cleaning text (lowercase, punctuation removal, stopwords, lemmatization)...")
t0 = time.time()
df["clean_message"] = df["message"].apply(clean_text)
print(f"Cleaning done in {time.time()-t0:.1f}s")

X_train, X_test, y_train, y_test = train_test_split(
    df["clean_message"], df["label_num"], test_size=0.2, random_state=42, stratify=df["label_num"]
)

print("Vectorizing with TF-IDF...")
vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), min_df=2)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

models = {
    "Multinomial Naive Bayes": MultinomialNB(),
    "Logistic Regression": LogisticRegression(max_iter=1000, C=10),
    "Support Vector Machine": SVC(kernel="linear", probability=True, C=1.0),
}

results = {}
trained_models = {}

print("\nTraining & evaluating models...\n" + "-" * 50)
for name, model in models.items():
    model.fit(X_train_vec, y_train)
    preds = model.predict(X_test_vec)
    acc = accuracy_score(y_test, preds)
    f1 = f1_score(y_test, preds)
    results[name] = {"accuracy": round(acc * 100, 2), "f1_score": round(f1 * 100, 2)}
    trained_models[name] = model
    print(f"{name:30s} | Accuracy: {acc*100:6.2f}%  | F1: {f1*100:6.2f}%")
    print(classification_report(y_test, preds, target_names=["ham", "spam"]))

# Pick best model by F1 score (more robust to class imbalance than raw accuracy)
best_name = max(results, key=lambda n: results[n]["f1_score"])
best_model = trained_models[best_name]

print("-" * 50)
print(f"\nBest model: {best_name}  (Accuracy: {results[best_name]['accuracy']}%, F1: {results[best_name]['f1_score']}%)")

# Save model, vectorizer, and metadata
joblib.dump(best_model, "spam_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

metadata = {
    "best_model": best_name,
    "results": results,
    "trained_on_samples": len(df),
}
with open("model_metadata.json", "w") as f:
    json.dump(metadata, f, indent=2)

print("\nSaved spam_model.pkl, vectorizer.pkl, model_metadata.json")
