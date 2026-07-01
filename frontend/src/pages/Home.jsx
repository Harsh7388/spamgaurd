import { Link } from "react-router-dom";
import {
  FiShield, FiZap, FiBarChart2, FiKey, FiArrowRight,
  FiEdit3, FiCpu, FiCheckCircle, FiMoon,
} from "react-icons/fi";
import "./Home.css";

const features = [
  { icon: <FiShield />, title: "Accurate Detection", desc: "Trained and validated across multiple ML models, with the best performer (98%+ accuracy) deployed automatically." },
  { icon: <FiBarChart2 />, title: "Confidence Score", desc: "Every prediction comes with a clear confidence percentage and spam probability breakdown." },
  { icon: <FiKey />, title: "Suspicious Keywords", desc: "See exactly which words in your email pushed the prediction toward spam or ham." },
  { icon: <FiZap />, title: "Instant Results", desc: "Paste an email and get a prediction in well under a second, no page reloads." },
  { icon: <FiMoon />, title: "Light & Dark Mode", desc: "A clean, modern interface that's comfortable to use day or night." },
  { icon: <FiCheckCircle />, title: "Plain-English Explanation", desc: "Get a short, human-readable explanation for why a message was flagged." },
];

const steps = [
  { icon: <FiEdit3 />, title: "Paste Your Email", desc: "Copy any email message and paste it into the detection box." },
  { icon: <FiCpu />, title: "ML Model Analyzes It", desc: "The text is cleaned, vectorized with TF-IDF, and run through the trained model." },
  { icon: <FiCheckCircle />, title: "Get Instant Results", desc: "View the prediction, confidence score, and the keywords behind it." },
];

export default function Home() {
  return (
    <div className="fade-in">
      <section className="hero">
        <div className="container hero-inner">
          <span className="hero-badge">Machine Learning · Flask · React</span>
          <h1 className="hero-title">
            Detect Spam Emails <span className="gradient-text">Instantly</span> with Machine Learning
          </h1>
          <p className="hero-subtitle">
            SpamGuard analyzes email text using a trained ML pipeline — TF-IDF vectorization
            and a comparison of Naive Bayes, Logistic Regression, and SVM — to tell you
            whether a message is spam, with confidence scores and explainable keywords.
          </p>
          <div className="hero-actions">
            <Link to="/detect" className="btn btn-primary">
              Try It Now <FiArrowRight />
            </Link>
            <Link to="/about" className="btn btn-outline">
              How It Works
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <p className="stat-value">98.3%</p>
              <p className="stat-label">Model Accuracy</p>
            </div>
            <div className="stat">
              <p className="stat-value">3</p>
              <p className="stat-label">ML Models Compared</p>
            </div>
            <div className="stat">
              <p className="stat-value">&lt;1s</p>
              <p className="stat-label">Average Response</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Why <span className="gradient-text">SpamGuard</span>?</h2>
          <p className="section-subtitle">
            Built with a real, trained machine learning pipeline — not a hard-coded rules list —
            so it generalizes to messages it hasn't seen before.
          </p>

          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps from raw email to a clear verdict.</p>

          <div className="steps-grid">
            {steps.map((s, i) => (
              <div className="step-card card" key={s.title}>
                <div className="step-number">{i + 1}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="cta-banner">
            <div>
              <h3>Ready to check an email?</h3>
              <p>It only takes a few seconds.</p>
            </div>
            <Link to="/detect" className="btn btn-primary">
              Go to Detector <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
