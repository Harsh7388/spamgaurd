import { FiCheckCircle, FiAlertTriangle, FiTag, FiCpu } from "react-icons/fi";
import "./ResultCard.css";

export default function ResultCard({ result }) {
  const isSpam = result.prediction === "Spam";

  return (
    <div className={`card result-card fade-in ${isSpam ? "is-spam" : "is-ham"}`}>
      <div className="result-top">
        <div className={`result-icon ${isSpam ? "spam" : "ham"}`}>
          {isSpam ? <FiAlertTriangle /> : <FiCheckCircle />}
        </div>
        <div>
          <p className="result-label">Prediction</p>
          <h2 className="result-verdict">{result.prediction}</h2>
        </div>
        <div className="result-confidence">
          <p className="result-label">Confidence</p>
          <p className="confidence-value">{result.confidence}%</p>
        </div>
      </div>

      <div className="prob-bars">
        <div className="prob-row">
          <span>Spam Probability</span>
          <span>{result.spam_probability}%</span>
        </div>
        <div className="prob-track">
          <div className="prob-fill spam" style={{ width: `${result.spam_probability}%` }} />
        </div>

        <div className="prob-row">
          <span>Not Spam Probability</span>
          <span>{result.ham_probability}%</span>
        </div>
        <div className="prob-track">
          <div className="prob-fill ham" style={{ width: `${result.ham_probability}%` }} />
        </div>
      </div>

      {result.keywords && result.keywords.length > 0 && (
        <div className="keywords-section">
          <p className="result-label"><FiTag /> Top Suspicious Keywords</p>
          <div className="keyword-chips">
            {result.keywords.map((kw) => (
              <span className="chip" key={kw}>{kw}</span>
            ))}
          </div>
        </div>
      )}

      <div className="explanation-box">
        <p>{result.explanation}</p>
      </div>

      {result.model_used && (
        <div className="model-used">
          <FiCpu /> Predicted using <strong>{result.model_used}</strong>
        </div>
      )}
    </div>
  );
}
