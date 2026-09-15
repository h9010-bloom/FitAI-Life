import "../styles/about.css";

const About = () => {
  return (
    <main className="about-page">

      {/* Hero Section */}

      <section className="about-hero">

        <h1>💚 About FitAI-Life</h1>

        <p>
          Your Smart AI Fitness & Wellness Companion
        </p>

      </section>

      {/* Mission */}

      <section className="about-section">

        <h2>🎯 Our Mission</h2>

        <p>
          FitAI-Life is designed to make healthy living simple,
          accessible and personalized for everyone.
          Our platform combines Artificial Intelligence with
          fitness knowledge to provide users with personalized
          workout recommendations, healthy meal guidance,
          wellness tips and progress tracking.
        </p>

      </section>

      {/* Why Choose */}

      <section className="about-section">

        <h2>⭐ Why Choose FitAI-Life?</h2>

        <div className="benefits-grid">

          <div className="benefit-card">
            <span>🤖</span>
            <h3>AI Powered</h3>
            <p>
              Get intelligent fitness and nutrition guidance
              whenever you need it.
            </p>
          </div>

          <div className="benefit-card">
            <span>🏋</span>
            <h3>Personalized Workouts</h3>
            <p>
              Workout plans suitable for beginners,
              intermediate and advanced users.
            </p>
          </div>

          <div className="benefit-card">
            <span>🥗</span>
            <h3>Healthy Diet Plans</h3>
            <p>
              Receive meal suggestions that support
              your fitness goals.
            </p>
          </div>

          <div className="benefit-card">
            <span>📈</span>
            <h3>Progress Tracking</h3>
            <p>
              Monitor your fitness journey and stay
              motivated every day.
            </p>
          </div>

        </div>

      </section>
            {/* Features */}

      <section className="about-section">

        <h2>🚀 Our Features</h2>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Fitness Assistant</h3>
            <p>
              Ask questions about fitness, nutrition,
              BMI, sleep, hydration and healthy living.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏋</div>
            <h3>Workout Planner</h3>
            <p>
              Create workout plans according to your
              fitness goals and experience level.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🥗</div>
            <h3>Diet Planner</h3>
            <p>
              Get healthy meal suggestions for weight
              loss, muscle gain and balanced nutrition.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Progress Tracker</h3>
            <p>
              Keep track of your daily activities,
              workouts and overall improvement.
            </p>
          </div>

        </div>

      </section>

      {/* Vision */}

      <section className="vision-section">

        <h2>🌍 Our Vision</h2>

        <p>
          Our vision is to empower individuals with
          intelligent technology that makes healthy
          living easier, more enjoyable and accessible
          to everyone. We believe fitness should be
          simple, personalized and motivating.
        </p>

      </section>

      {/* CTA */}

      <section className="cta-section">

        <h2>Start Your Fitness Journey Today 💚</h2>

        <p>
          Join FitAI-Life and experience a smarter
          way to achieve your health and fitness goals.
        </p>

      </section>

    </main>
  );
};

export default About;