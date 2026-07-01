import {
  FiCode, FiServer, FiCpu, FiUser, FiGithub, FiLinkedin, FiMail,
  FiDatabase, FiFilter, FiLayers, FiCheckSquare,
} from "react-icons/fi";
import "./About.css";

const techGroups = [
  {
    title: "Frontend",
    icon: <FiCode />,
    items: ["React.js", "React Router", "Axios", "React Icons", "CSS3"],
  },
  {
    title: "Backend",
    icon: <FiServer />,
    items: ["Python", "Flask", "Flask-CORS", "REST API"],
  },
  {
    title: "Machine Learning",
    icon: <FiCpu />,
    items: ["Scikit-learn", "Pandas", "NumPy", "NLTK", "Joblib", "TF-IDF Vectorizer"],
  },
];

const workflow = [
  { icon: <FiDatabase />, title: "Dataset", desc: "A labeled spam/ham message dataset is loaded and cleaned." },
  { icon: <FiFilter />, title: "Preprocessing", desc: "Lowercasing, punctuation removal, stopword removal, tokenization, and lemmatization." },
  { icon: <FiLayers />, title: "TF-IDF Vectorization", desc: "Cleaned text is converted into numerical feature vectors using TF-IDF." },
  { icon: <FiCpu />, title: "Model Training", desc: "Multinomial Naive Bayes, Logistic Regression, and SVM are trained and compared." },
  { icon: <FiCheckSquare />, title: "Best Model Selection", desc: "The model with the highest accuracy/F1 score is automatically saved with Joblib and served via Flask." },
];

export default function About() {
  return (
    <div className="about-page fade-in">
      <div className="container">
        <div className="about-header">
          <h1>About <span className="gradient-text">SpamGuard</span></h1>
          <p>
            SpamGuard is a full-stack machine learning web application that classifies
            email messages as Spam or Not Spam, built end-to-end as a B.Tech CSE portfolio project.
          </p>
        </div>

        <div className="card about-desc-card">
          <h2>Project Description</h2>
          <p>
            The goal of SpamGuard is to demonstrate a complete, practical ML pipeline —
            from raw text data to a deployed, interactive prediction service. Users paste
            an email into the detector, and a trained classifier returns a prediction along
            with a confidence score, spam probability, and the specific keywords that
            influenced the decision, making the result explainable rather than a black box.
          </p>
        </div>

        <h2 className="section-title small-title">Technologies Used</h2>
        <div className="tech-grid">
          {techGroups.map((g) => (
            <div className="card tech-card" key={g.title}>
              <div className="tech-icon">{g.icon}</div>
              <h3>{g.title}</h3>
              <ul>
                {g.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="section-title small-title">Machine Learning Workflow</h2>
        <div className="workflow-list">
          {workflow.map((w, i) => (
            <div className="workflow-item card" key={w.title}>
              <div className="workflow-num">{i + 1}</div>
              <div className="workflow-icon">{w.icon}</div>
              <div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="section-title small-title">Developer</h2>
        <div className="card developer-card">
          <div className="dev-avatar"><FiUser /></div>
          <div className="dev-info">
            <h3>B.Tech CSE Student</h3>
            <p>Built SpamGuard to apply machine learning, full-stack web development, and clean UI/UX design in a single, deployable project.</p>
            <div className="dev-links">
              <a href="#" aria-label="GitHub"><FiGithub /></a>
              <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="#" aria-label="Email"><FiMail /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
