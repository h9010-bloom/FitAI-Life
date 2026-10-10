import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import PremiumModal from '../components/PremiumModal/PremiumModal.jsx';
import '../styles/workoutplanner.css';

const WorkoutPlanner = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://fitai-life-backend.onrender.com/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        const user = data.user || data;
        setProfile(user);

        if (user.membershipType === 'Free') {
          setShowPremiumModal(true);
        }
      } catch (error) {
        console.error('Unable to load profile', error);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleStartTrial = () => {
    setShowPremiumModal(false);
    navigate('/membership');
  };

  return (
    <main className="workoutplanner-page">
      <section className="workoutplanner-shell">
        <div className="workoutplanner-header">
          <p className="workoutplanner-eyebrow">Professional Workout Plans</p>
          <h1>Workout Planner</h1>
          <p className="workoutplanner-subtitle">Your premium guided workout experience.</p>
        </div>

        {profile?.membershipType === 'Free' ? (
          <div className="workoutplanner-state">Upgrade to unlock professional workout plans.</div>
        ) : (
          <div className="workoutplanner-state">Premium workout plans are available for your account.</div>
        )}
      </section>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onStartTrial={handleStartTrial}
      />
    </main>
  );
};

export default WorkoutPlanner;
