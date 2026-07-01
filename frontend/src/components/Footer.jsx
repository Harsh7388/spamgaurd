import { FiShield, FiGithub, FiMail, FiLinkedin } from "react-icons/fi";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand-icon"><FiShield /></span>
          <div>
            <p className="footer-title">SpamGuard</p>
            <p className="footer-tagline">Spam Email Detection Using Machine Learning</p>
          </div>
        </div>

        <div className="footer-links">
          <a href="/" className="footer-link">Home</a>
          <a href="/detect" className="footer-link">Detect Spam</a>
          <a href="/about" className="footer-link">About</a>
        </div>

        <div className="footer-socials">
          <a href="#" className="social-icon" aria-label="GitHub"><FiGithub /></a>
          <a href="#" className="social-icon" aria-label="LinkedIn"><FiLinkedin /></a>
          <a href="#" className="social-icon" aria-label="Email"><FiMail /></a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SpamGuard. Built as a B.Tech CSE portfolio project.</p>
      </div>
    </footer>
  );
}
