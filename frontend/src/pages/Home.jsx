import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/home.css";
import heroMeal from "../assets/images/hero-meal.jpg";
  import homeImage from "../assets/images/home-image.webp";

const features = [
  {
    title: "AI Workout Planner",
    text: "Personalized training plans based on your goals and schedule.",
  },
  {
    title: "AI Diet Planner",
    text: "Balanced meal suggestions tailored to your nutrition needs.",
  },
  {
    title: "Progress Tracker",
    text: "Track every milestone with clear analytics and insights.",
  },
  {
    title: "AI Chat Assistant",
    text: "Get expert guidance and wellness support anytime.",
  },
];

const reasons = [
  {
    title: "Personalized Plans",
    text: "Custom recommendations built around your body and lifestyle.",
  },
  {
    title: "Smart AI",
    text: "Use intelligent coaching to stay motivated and consistent.",
  },
  {
    title: "Progress Analytics",
    text: "Visual insights make it easier to measure real progress.",
  },
  {
    title: "Healthy Lifestyle",
    text: "Build habits that support sustainable fitness and nutrition.",
  },
];

const testimonials = [
  {
    name: "Maya R.",
    role: "Fitness Enthusiast",
    quote:
      "FitAI-Life helped me stay consistent with workouts and healthier meals every week.",
  },
  {
    name: "Daniel K.",
    role: "Busy Professional",
    quote:
      "The AI guidance feels personal and practical. I love how simple it makes planning.",
  },
  {
    name: "Sofia L.",
    role: "Wellness Beginner",
    quote:
      "The progress tracking and motivation tips made my journey feel exciting and achievable.",
  },
];

const ADMIN_PASSWORD = "FitAI@2026";

const Home = () => {
  const navigate = useNavigate();

  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState("");

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      localStorage.setItem("adminAccess", "true");

      setAdminPassword("");
      setAdminError("");
      setShowAdminPopup(false);

      navigate("/admin");
    } else {
      setAdminError("Incorrect Admin Password");
    }
  };

  return (
    <main className="home-page">

      {/* Hero Section */}

      <section className="hero-section"
       style={{
          backgroundImage: `url(${homeImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>

        <div className="hero-section__content">

          <p className="hero-section__eyebrow">
            AI-powered wellness platform
          </p>

          <h1>Your AI Fitness & Nutrition Companion</h1>

          <p className="hero-section__text">
            Transform your health journey with personalized workout plans,
            nutrition guidance, progress insights, and AI support designed
            for real life.
          </p>

          <div className="hero-section__actions">

            <Link
              to="/register"
              className="hero-section__button hero-section__button--primary"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="hero-section__button hero-section__button--secondary"
            >
              Login
            </Link>

          </div>

        </div>

        <div
          className="hero-section__visual"
          style={{
            backgroundImage: `url(${heroMeal})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          aria-label="FitAI-Life illustration placeholder"
        >

          <div className="hero-section__card hero-section__card--main">

            <div className="hero-section__icon">✚</div>

            <h3>Healthy habits, smarter support</h3>

            <p>Personalized plans for every goal.</p>

          </div>

          <div className="hero-section__card hero-section__card--small">

            <p>Daily Progress will depend on your consistency.</p>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="features-section">

        <div className="section-heading">

          <p className="section-heading__eyebrow">
            Features
          </p>

          <h2>Everything you need to stay on track</h2>

        </div>

        <div className="feature-grid">

          {features.map((feature) => (

            <article
              key={feature.title}
              className="feature-card"
            >

              <div className="feature-card__icon">
                ✦
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.text}</p>

            </article>

          ))}

        </div>

      </section>

      {/* Benefits */}

      <section className="benefits-section">

        <div className="section-heading">

          <p className="section-heading__eyebrow">
            Why choose us
          </p>

          <h2>Built to help you thrive</h2>

        </div>

        <div className="benefit-grid">

          {reasons.map((reason) => (

            <article
              key={reason.title}
              className="benefit-card"
            >

              <h3>{reason.title}</h3>

              <p>{reason.text}</p>

            </article>

          ))}

        </div>

      </section>
      {/* Testimonials */}

      <section className="testimonials-section">

        <div className="section-heading">

          <p className="section-heading__eyebrow">
            Testimonials
          </p>

          <h2>What our users say</h2>

        </div>

        <div className="testimonial-grid">

          {testimonials.map((item) => (

            <article
              key={item.name}
              className="testimonial-card"
            >

              <p>"{item.quote}"</p>

              <div className="testimonial-card__author">

                <strong>{item.name}</strong>

                <span>{item.role}</span>

              </div>

            </article>

          ))}

        </div>

      </section>

      {/* CTA */}

      <section className="cta-section">

        <h2>Start Your Fitness Journey Today</h2>

        <p>
          Join FitAI-Life and discover smarter wellness
          habits that fit your life.
        </p>

        <Link
          to="/register"
          className="hero-section__button hero-section__button--primary"
        >
          Register Now
        </Link>

      </section>

      {/* ===========================
          ADMIN PANEL
      ============================ */}

      <section className="admin-panel-section">

        <h2>Administrator Access</h2>

        <p>
          This section is only for the project administrator.
          Click below to access the Admin Dashboard.
        </p>

        <button
          className="admin-panel-btn"
          onClick={() => {
            setShowAdminPopup(true);
            setAdminError("");
            setAdminPassword("");
          }}
        >
          Open Admin Panel
        </button>

      </section>

      {/* ===========================
          ADMIN POPUP
      ============================ */}

      {showAdminPopup && (

        <div className="admin-popup-overlay">

          <div className="admin-popup">

            <h2>🔒 Admin Login</h2>

            <p>
              Enter the administrator password.
            </p>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Admin Password"
              value={adminPassword}
              onChange={(e) => {
                setAdminPassword(e.target.value);
                setAdminError("");
              }}
            />

            <button
              className="show-password-btn"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword
                ? "Hide Password"
                : "Show Password"}
            </button>

            {adminError && (

              <p className="admin-error">
                {adminError}
              </p>

            )}

            <div className="admin-popup-buttons">

              <button
                className="admin-login-btn"
                onClick={handleAdminLogin}
              >
                Login
              </button>

              <button
                className="admin-cancel-btn"
                onClick={() => {
                  setShowAdminPopup(false);
                  setAdminPassword("");
                  setAdminError("");
                }}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
};

export default Home;