import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import '../styles/challenge.css';

const freeChallenges = [
  {
    value: '2 Weeks',
    title: '2 Weeks',
    description: 'Build a healthy workout routine.',
  },
  {
    value: '5 Weeks',
    title: '5 Weeks',
    description: 'Improve consistency and endurance.',
  },
  {
    value: '8 Weeks',
    title: '8 Weeks',
    description: 'Complete a beginner fitness transformation.',
  },
];

const premiumChallenges = [
  {
    value: '1 Month',
    title: '1 Month',
    description: 'Kick off a simple, focused habit reset.',
  },
  {
    value: '2 Months',
    title: '2 Months',
    description: 'Build stronger consistency with guided progress.',
  },
  {
    value: '4 Months',
    title: '4 Months',
    description: 'Stay committed with a long-term performance plan.',
  },
  {
    value: '6 Months',
    title: '6 Months',
    description: 'Push your endurance and body composition goals.',
  },
  {
    value: '1 Year',
    title: '1 Year',
    description: 'Commit to a full transformation journey.',
  },
];

const Challenge = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const membershipType = location.state?.membershipType || 'Free';

  const [selectedPlan, setSelectedPlan] = useState(
    membershipType === 'Free' ? freeChallenges[0].value : premiumChallenges[0].value
  );

  const challengeOptions = membershipType === 'Free' ? freeChallenges : premiumChallenges;

  const handleBack = () => {
    navigate('/membership');
  };

  const handleContinue = async () => {
    try {
      await api.post('/membership/save', {
        membershipType,
        challengePlan: selectedPlan,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Membership Save Error:', error);
      console.error('Server Response:', error.response?.data);
      console.error('Status Code:', error.response?.status);

      alert(
        error.response?.data?.message ||
        `Request failed: ${error.response?.status || error.message}`
      );
    }

    return (
      <main className="challenge-page">
        <section className="challenge-card">
          <p className="challenge-card__eyebrow">Fitness Challenge</p>

          <h1 className="challenge-card__title">
            {membershipType === 'Free'
              ? 'Choose Your Free Fitness Challenge'
              : 'Choose Your Premium Fitness Challenge'}
          </h1>

          <div className="challenge-list">
            {challengeOptions.map((option) => (
              <label key={option.value} className="challenge-option">
                <input
                  type="radio"
                  name="challenge"
                  value={option.value}
                  checked={selectedPlan === option.value}
                  onChange={(event) => setSelectedPlan(event.target.value)}
                />
                <span className="challenge-option__content">
                  <span className="challenge-option__title">{option.title}</span>
                  <span className="challenge-option__description">{option.description}</span>
                </span>
              </label>
            ))}
          </div>

          <div className="challenge-summary">
            <h2>Selected Plan</h2>
            <p><strong>Duration:</strong> {selectedPlan}</p>
            <p><strong>Membership Type:</strong> {membershipType}</p>
          </div>

          <div className="challenge-actions">
            <button type="button" className="challenge-action challenge-action--back" onClick={handleBack}>
              Back
            </button>
            <button type="button" className="challenge-action challenge-action--continue" onClick={handleContinue}>
              Continue
            </button>
          </div>
        </section>
      </main>
    );
  };
}
  export default Challenge;
