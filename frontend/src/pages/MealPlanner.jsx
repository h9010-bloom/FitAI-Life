import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import PremiumModal from "../components/PremiumModal/PremiumModal.jsx";
import ChallengeFlowModal from "../components/ChallengeFlowModal/ChallengeFlowModal.jsx";
import "../styles/mealplanner.css";

const normalizeGoal = (goal) => {
  if (!goal) return "Stay Fit";

  const value = goal.toLowerCase();

  if (value.includes("lose")) return "Weight Loss";
  if (value.includes("weight loss")) return "Weight Loss";

  if (value.includes("gain")) return "Weight Gain";
  if (value.includes("weight gain")) return "Weight Gain";

  return "Stay Fit";
};

const MealPlanner = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [meals, setMeals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const [message, setMessage] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeModalConfig, setChallengeModalConfig] = useState({
    title: "🎉 Congratulations!",
    message: "",
    primaryLabel: "OK",
    secondaryLabel: null,
    onPrimary: () => setShowChallengeModal(false),
    onSecondary: () => setShowChallengeModal(false),
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = res.data.user || res.data;
      setProfile(user);

      if (user.membershipType === "Free") {
        setShowPremiumModal(true);
        setLoading(false);
        return;
      }
    } catch (err) {
      setError("Unable to load profile.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchMeals();
    }
  }, [profile]);

  const fetchMeals = async () => {
    try {
      const goal = normalizeGoal(profile.goal);

      const res = await axios.get(
        `http://localhost:5000/api/diets/goal/${encodeURIComponent(goal)}`
      );

      setMeals(res.data);
    } catch (err) {
      console.log(err);
      setError("Unable to load meals.");
    } finally {
      setLoading(false);
    }
  };

  const totalCalories = useMemo(() => {
    return meals.reduce((total, meal) => total + Number(meal.calories), 0);
  }, [meals]);

  const openChallengeCompletionModal = (membershipType, challengeName) => {
    const baseMessage = `You successfully completed your\n"${challengeName}"\nfitness challenge.\nKeep up the great work!`;

    if (membershipType === "Free") {
      setChallengeModalConfig({
        title: "🎉 Congratulations!",
        message: baseMessage,
        primaryLabel: "OK",
        secondaryLabel: null,
        onPrimary: () => {
          setShowChallengeModal(false);
          setChallengeModalConfig({
            title: "Unlock More Challenges",
            message: "Congratulations!\nYou completed your Free Challenge.\nUpgrade to Premium and unlock:\nProfessional Trainer Plans\nDietitian Meal Plans\nLong-term Challenges\nWeekly Reports\nPremium AI",
            primaryLabel: "Start Premium Trial",
            secondaryLabel: "Choose Another Free Challenge",
            onPrimary: () => {
              setShowChallengeModal(false);
              navigate('/membership', { state: { openPremiumTrial: true } });
            },
            onSecondary: () => {
              setShowChallengeModal(false);
              navigate('/challenge', { state: { membershipType: 'Free' } });
            },
          });
          setShowChallengeModal(true);
        },
        onSecondary: () => setShowChallengeModal(false),
      });

      setShowChallengeModal(true);
      return;
    }

    if (membershipType === "Premium Trial") {
      setChallengeModalConfig({
        title: "🎉 Challenge Completed!",
        message: `You successfully completed your "${challengeName}" premium trial challenge. Choose another premium challenge when you're ready.`,
        primaryLabel: "OK",
        secondaryLabel: null,
        onPrimary: () => {
          setShowChallengeModal(false);
          navigate('/challenge', { state: { membershipType: 'Premium Trial' } });
        },
        onSecondary: () => setShowChallengeModal(false),
      });

      setShowChallengeModal(true);
      return;
    }

    setChallengeModalConfig({
      title: "Congratulations!",
      message: `You successfully completed your "${challengeName}" challenge. Choose your next Premium Challenge.`,
      primaryLabel: "OK",
      secondaryLabel: null,
      onPrimary: () => {
        setShowChallengeModal(false);
        navigate('/challenge', { state: { membershipType: 'Premium' } });
      },
      onSecondary: () => setShowChallengeModal(false),
    });

    setShowChallengeModal(true);
  };

  const handleCompleteMeals = async () => {
    try {
      setIsCompleting(true);

      const res = await axios.post(
        "http://localhost:5000/api/profile/meal-complete",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);

      setProfile((prev) => ({
        ...prev,
        ...res.data,
        mealStreak: res.data.streak,
      }));

      if (res.data.challengeStatus === "Completed") {
        openChallengeCompletionModal(profile?.membershipType || 'Free', profile?.challengePlan || 'your challenge');
      }
    } catch (err) {
      setMessage("Unable to save meal streak.");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleStartTrial = () => {
    setShowPremiumModal(false);
    navigate('/membership', { state: { openPremiumTrial: true } });
  };

  if (loading) {
    return (
      <div className="mealplanner-state">
        Loading Meal Planner...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mealplanner-state mealplanner-state--error">
        {error}
      </div>
    );
  }

  return (
    <main className="mealplanner-page">
      <section className="mealplanner-shell">

        <div className="mealplanner-header">
          <div>
            <p className="mealplanner-eyebrow">
              Daily Nutrition
            </p>

            <h1>Today's Meal Planner</h1>

            <p className="mealplanner-subtitle">
              Meal plan based on your selected goal.
            </p>
          </div>
        </div>

        <div className="mealplanner-highlight">

          <div>

            <p className="mealplanner-eyebrow">
              Goal
            </p>

            <h2>{normalizeGoal(profile.goal)}</h2>

            <p className="mealplanner-highlight__text">
              These meals are loaded from your admin panel.
            </p>

          </div>

          <button
            className="mealplanner-complete-btn"
            onClick={handleCompleteMeals}
            disabled={isCompleting}
          >
            {isCompleting
              ? "Saving..."
              : "Mark Meals Completed"}
          </button>

        </div>

        {message && (
          <div className="mealplanner-message mealplanner-message--success">
            {message}
          </div>
        )}

        <div className="mealplanner-grid">

          {meals.map((meal) => (
            <article
              key={meal._id}
              className="mealplanner-card"
            >
              <div className="mealplanner-card__top">

                <span className="mealplanner-card__badge">
                  {meal.mealType}
                </span>

                <span className="mealplanner-card__badge mealplanner-card__badge--secondary">
                  {meal.calories} kcal
                </span>

              </div>

              <h3>{meal.mealName}</h3>

              <ul className="mealplanner-card__list">

                <li>
                  <span>Protein</span>
                  <strong>{meal.protein} g</strong>
                </li>

                <li>
                  <span>Carbs</span>
                  <strong>{meal.carbs} g</strong>
                </li>

                <li>
                  <span>Fats</span>
                  <strong>{meal.fats} g</strong>
                </li>

              </ul>

              <p className="mealplanner-tip">
                {meal.description}
              </p>
            </article>
          ))}

        </div>

        <div className="mealplanner-summary">

          <h3>Total Daily Calories</h3>

          <div className="mealplanner-summary__grid">

            <div>
              <span>Goal</span>
              <strong>{normalizeGoal(profile.goal)}</strong>
            </div>

            <div>
              <span>Total Calories</span>
              <strong>{totalCalories} kcal</strong>
            </div>

            <div>
              <span>Meal Streak</span>
              <strong>{profile?.mealStreak || 0} Days</strong>
            </div>

          </div>

        </div>

      </section>

      <ChallengeFlowModal
        isOpen={showChallengeModal}
        title={challengeModalConfig.title}
        message={challengeModalConfig.message}
        primaryLabel={challengeModalConfig.primaryLabel}
        secondaryLabel={challengeModalConfig.secondaryLabel}
        onPrimary={challengeModalConfig.onPrimary}
        onSecondary={challengeModalConfig.onSecondary}
        onClose={() => setShowChallengeModal(false)}
      />

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onStartTrial={handleStartTrial}
      />
    </main>
  );
};

export default MealPlanner;