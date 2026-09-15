import '../../styles/footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__top">
      <div className="footer__section">
        <h3 className="footer__title">About FitAI-Life</h3>
        <p className="footer__text">
          FitAI-Life is your AI-powered companion for smarter fitness, balanced nutrition,
          and guided wellness support.
        </p>
      </div>

      <div className="footer__section">
        <h3 className="footer__title">Quick Links</h3>
        <ul className="footer__list">
          <li><a href="/">Home</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/exercise">Exercise</a></li>
          <li><a href="/diet">Diet</a></li>
          <li><a href="/chat">AI Chat</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>

      <div className="footer__section">
        <h3 className="footer__title">Contact</h3>
        <ul className="footer__list footer__list--contact">
          <li>Email: xyz@gmail.com</li>
          <li>Phone: +1 (800) 555-0147</li>
          <li>Address: 123 Wellness Avenue, Austin, TX</li>
        </ul>
      </div>

      <div className="footer__section">
        <h3 className="footer__title">Our Features</h3>
        <ul className="footer__list">
          <li>✔ AI Chat Assistant</li>
          <li>✔ Meal Planner</li>
          <li>✔ Exercise Planner</li>
          <li>✔ Daily Check-ins</li>
          <li>✔ Workout & Meal Streaks</li>
        </ul>
      </div>
    </div>

    <div className="footer__bottom">
      <p>© 2026 FitAI-Life. All rights reserved.</p>

      </div>
  </footer>
);

export default Footer;
