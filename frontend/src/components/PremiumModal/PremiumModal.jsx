import "./PremiumModal.css";

const PremiumModal = ({
  isOpen,
  onClose,
  onStartTrial,
  title = "🔒 Premium Feature",
  message = "Unlock Premium to access this feature.",
}) => {

  if (!isOpen) return null;

  return (
    <div className="premium-modal-overlay">

      <div
        className="premium-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="premium-modal__close"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="premium-modal__title">
          {title}
        </h2>

        <p className="premium-modal__text">
          {message}
        </p>

        <div className="premium-modal__benefits">

          <p>Premium Benefits</p>

          <ul>
            <li>✔ Professional Workout Plans</li>
            <li>✔ Dietitian Meal Plans</li>
            <li>✔ Water Reminder</li>
            <li>✔ Sleep Suggestions</li>
            <li>✔ Weekly Reports</li>
            <li>✔ Premium AI Chat</li>
          </ul>

        </div>

        <p className="premium-modal__offer">
          🎁 FREE 7-Day Premium Trial
        </p>

        <div className="premium-modal__actions">

          <button
            className="premium-modal__button premium-modal__button--primary"
            onClick={onStartTrial}
          >
            Start Free Trial
          </button>

          <button
            className="premium-modal__button premium-modal__button--secondary"
            onClick={onClose}
          >
            Maybe Later
          </button>

        </div>

      </div>

    </div>
  );
};

export default PremiumModal;