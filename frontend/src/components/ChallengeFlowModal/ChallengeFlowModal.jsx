import "./ChallengeFlowModal.css";

const ChallengeFlowModal = ({
  isOpen,
  title,
  message,
  icon = "🎉",
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  onClose,
}) => {

  if (!isOpen) return null;

  return (
    <div className="challenge-modal-overlay">

      <div className="challenge-modal">

        <button
          className="challenge-modal-close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="challenge-modal-icon">
          {icon}
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="challenge-modal-buttons">

          {primaryLabel && (
            <button
              className="challenge-primary-btn"
              onClick={onPrimary}
            >
              {primaryLabel}
            </button>
          )}

          {secondaryLabel && (
            <button
              className="challenge-secondary-btn"
              onClick={onSecondary}
            >
              {secondaryLabel}
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default ChallengeFlowModal;