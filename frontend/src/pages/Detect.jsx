import { useState, useMemo } from "react";
import { FiZap, FiX, FiClipboard, FiAlertCircle } from "react-icons/fi";
import { predictSpam } from "../services/api";
import ResultCard from "../components/ResultCard";
import "./Detect.css";

const SAMPLE_EMAILS = [
  `Congratulations! You have WON a $1,000,000 cash prize!!! Click here immediately to claim your free reward before it expires. Limited time offer, act now and verify your account details to receive your bonus gift.`,
  `Hi Priya, just confirming our project sync tomorrow at 11 AM. I've attached the updated slides — let me know if the timing still works for you. Thanks, Rohan`,
];

const MAX_CHARS = 5000;

export default function Detect() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const charCount = message.length;
  const charPercent = useMemo(() => Math.min(100, (charCount / MAX_CHARS) * 100), [charCount]);

  const handleAnalyze = async () => {
    setError("");
    if (!message.trim()) {
      setError("Please paste or type an email message before analyzing.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await predictSpam(message);
      setResult(data);
    } catch (err) {
      const errMsg =
        err?.response?.data?.error ||
        err?.message ||
        "Couldn't reach the SpamGuard backend. The server may be starting up — please wait a moment and try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSample = () => {
    const sample = SAMPLE_EMAILS[Math.floor(Math.random() * SAMPLE_EMAILS.length)];
    setMessage(sample);
    setResult(null);
    setError("");
  };

  const handleClear = () => {
    setMessage("");
    setResult(null);
    setError("");
  };

  return (
    <div className="detect-page fade-in">
      <div className="container">
        <div className="detect-header">
          <h1>Spam Email <span className="gradient-text">Detector</span></h1>
          <p>Paste any email message below and let the ML model analyze it for spam signals.</p>
        </div>

        <div className="detect-grid">
          <div className="card detect-card">
            <div className="textarea-wrap">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Paste the full email content here (subject, body, sender notes — anything)..."
                rows={14}
              />
              <div className="char-counter">
                <div className="char-bar">
                  <div className="char-bar-fill" style={{ width: `${charPercent}%` }} />
                </div>
                <span>{charCount} / {MAX_CHARS} characters</span>
              </div>
            </div>

            {error && (
              <div className="alert-error">
                <FiAlertCircle /> {error}
              </div>
            )}

            <div className="detect-actions">
              <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>
                {loading ? <span className="loader" /> : <FiZap />}
                {loading ? "Analyzing..." : "Analyze"}
              </button>
              <button className="btn btn-outline" onClick={handleSample} disabled={loading}>
                <FiClipboard /> Sample Email
              </button>
              <button className="btn btn-ghost" onClick={handleClear} disabled={loading}>
                <FiX /> Clear
              </button>
            </div>
          </div>

          <div className="detect-result-area">
            {loading && (
              <div className="card loading-card">
                <span className="loader-lg" />
                <p>Running TF-IDF vectorization and model inference...</p>
              </div>
            )}

            {!loading && result && <ResultCard result={result} />}

            {!loading && !result && (
              <div className="card placeholder-card">
                <p>Your analysis results will appear here once you click <strong>Analyze</strong>.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
