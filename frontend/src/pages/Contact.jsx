import "../styles/contact.css";

const faqs = [
  {
    question: "How do I create a FitAI-Life account?",
    answer:
      "Click the Register button on the home page, fill in your details, and create your account. After registration, you can log in using your email and password.",
  },
  {
    question: "How do I log in to my account?",
    answer:
      "Click the Login button, enter your registered email address and password, and you will be redirected to your dashboard.",
  },
  {
    question: "How do I generate a diet plan?",
    answer:
      "After logging in, open the Diet section and generate a personalized diet plan according to your fitness goal.",
  },
  {
    question: "How do I generate an exercise plan?",
    answer:
      "Go to the Exercise section after logging in and generate an exercise routine based on your selected fitness goal.",
  },
  {
    question: "What is AI Chat?",
    answer:
      "AI Chat is your virtual fitness assistant. It can answer health-related questions, provide fitness guidance, explain exercises, and help you understand healthy eating habits.",
  },
  {
    question: "How can I track my progress?",
    answer:
      "Open the Progress page after logging in to monitor your fitness journey and view your recorded activities.",
  },
  {
    question: "Can I update my profile?",
    answer:
      "Yes. Go to your Profile page to update your personal details and profile picture.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes. Your information is securely stored and used only within the FitAI-Life application.",
  },
  {
    question: "Who can access the Admin Panel?",
    answer:
      "The Admin Panel can only be accessed by the administrator using the administrator password.",
  },
];

const Contact = () => {
  return (
    <main className="help-page">

      {/* Hero Section */}

      <section className="help-hero">
        <h1>Help & Support</h1>

        <p>
          Welcome to <strong>FitAI-Life</strong>. This page provides answers to
          common questions about using the application. After logging in,
          you can use the AI Chat feature for health and fitness guidance.
        </p>
      </section>

      {/* FAQ Section */}

      <section className="help-section">

        <h2>Frequently Asked Questions</h2>

        <div className="faq-container">

          {faqs.map((faq, index) => (
            <div className="faq-card" key={index}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}

        </div>

      </section>

      {/* About Project */}

      <section className="help-section">

        <h2>About FitAI-Life</h2>

        <div className="project-card">

          <div className="project-item">
            <strong>Application Name</strong>
            <p>FitAI-Life</p>
          </div>

          <div className="project-item">
            <strong>Version</strong>
            <p>1.0</p>
          </div>

          <div className="project-item">
            <strong>Category</strong>
            <p>AI Health Tracker & Fitness Planner</p>
          </div>

          <div className="project-item">
            <strong>Purpose</strong>
            <p>Academic Major Project</p>
          </div>

        </div>

      </section>

      {/* AI Help */}

      <section className="help-section">

        <h2>Need More Help?</h2>

        <div className="ai-help-card">

          <h3>AI Chat Assistant</h3>

          <p>
            After logging into your account, you can use the AI Chat feature
            for assistance with diet planning, exercise recommendations,
            healthy lifestyle guidance, and general fitness questions.
          </p>

        </div>

      </section>

      {/* Footer */}

      <section className="help-footer">

        <h2>Thank You for Choosing FitAI-Life</h2>

        <p>
          Our goal is to help users achieve a healthier lifestyle through
          AI-powered diet planning, exercise recommendations, progress
          tracking, and intelligent assistance.
        </p>

      </section>

    </main>
  );
};

export default Contact;