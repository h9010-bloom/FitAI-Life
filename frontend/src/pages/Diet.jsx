import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PremiumModal from "../components/PremiumModal/PremiumModal.jsx";
import "../styles/diet.css";

const Diet = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [generatedMeals, setGeneratedMeals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Keeps track of whether today's diet has already been completed.
  const [dietCompletedToday, setDietCompletedToday] = useState(false);

  // Prevents concurrent duplicate fetches in React Strict Mode
  const isFetchingRef = useRef(false);

  // =========================================================
  // BEST TIME
  // =========================================================

  const getBestTime = (mealType) => {
    const type = String(mealType || "").trim().toLowerCase();

    switch (type) {
      case "breakfast":
        return "Morning";

      case "lunch":
        return "Afternoon";

      case "dinner":
        return "Evening";

      case "snack":
        return "Between Meals";

      default:
        return "As recommended";
    }
  };

  // =========================================================
  // MEAL-SPECIFIC DIETITIAN NOTE
  // =========================================================

  const getDietitianNote = (mealType) => {
    const type = String(mealType || "").trim().toLowerCase();

    switch (type) {
      case "breakfast":
        return "Start your day with a balanced, protein-rich meal to support energy and recovery.";

      case "lunch":
        return "Keep lunch balanced with protein, vegetables, whole grains, and controlled portions to maintain steady energy.";

      case "snack":
        return "Choose a light, nutritious snack to manage hunger and maintain energy between meals.";

      case "dinner":
        return "Choose a balanced, lighter dinner and avoid heavy meals close to bedtime.";

      default:
        return "Follow the recommended portion and timing for a balanced meal.";
    }
  };

  // =========================================================
  // LOAD PROFILE ONLY (DO NOT FETCH DIET AUTOMATICALLY)
  // =========================================================

  useEffect(() => {
    const fetchData = async () => {
      // Prevent duplicate executions during re-renders/React.StrictMode
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        isFetchingRef.current = false;
        return;
      }

      try {
        // 1. Get User Profile
        const profileRes = await axios.get(
          "https://fitai-life-backend.onrender.com/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = profileRes.data.user || profileRes.data;
        setProfile(user);

        // 2. Check if today's diet was already completed based strictly on user.mealCompleted
        // =====================================================
        // CHECK WHETHER DIET WAS COMPLETED TODAY
        // =====================================================

        const today = new Date();

        let completedToday = false;

        if (user.mealCompleted && user.lastMealDate) {
          const lastMealDate = new Date(user.lastMealDate);

          completedToday =
            lastMealDate.toDateString() ===
            today.toDateString();
        }

        if (completedToday) {
          setDietCompletedToday(true);

          setMessage(
            "Today's diet has already been completed."
          );
        } else {
          setDietCompletedToday(false);

          // Clear old completion state from the frontend
          setGeneratedMeals([]);

          setMessage("");

          // User must click Generate Diet
        }

      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load profile data."
        );
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchData();
  }, []);

  // =========================================================
  // GENERATE TODAY'S DIET
  // =========================================================

  const handleGenerateDiet = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      const response = await axios.get(
        `https://fitai-life-backend.onrender.com/api/diets/today?t=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.completed) {
        setGeneratedMeals([]);
        setDietCompletedToday(true);
        setMessage(
          response.data.message ||
          "Today's diet has already been completed. Come back tomorrow."
        );
        return;
      }

      setDietCompletedToday(false);
      setGeneratedMeals(response.data.diets || []);
      setMessage("Today's diet generated successfully!");

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to generate today's diet."
      );
      console.log(error.response?.data);
    }
  };

  // =========================================================
  // START PREMIUM TRIAL
  // =========================================================

  const handleStartTrial = () => {
    setShowPremiumModal(false);
    navigate("/membership");
  };

  // =========================================================
  // TOTAL CALORIES
  // =========================================================

  const totalCalories = useMemo(() => {
    return (generatedMeals || []).reduce(
      (sum, meal) => sum + Number(meal.calories || 0),
      0
    );
  }, [generatedMeals]);

  // =========================================================
  // TOTAL PROTEIN
  // =========================================================

  const totalProtein = useMemo(() => {
    return (generatedMeals || []).reduce(
      (sum, meal) => sum + Number(meal.protein || 0),
      0
    );
  }, [generatedMeals]);

  // =========================================================
  // COMPLETE TODAY'S DIET
  // =========================================================

  const handleMealComplete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      setIsCompleting(true);

      const response = await axios.post(
        "https://fitai-life-backend.onrender.com/api/profile/meal-complete",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update profile information
      setProfile((prev) => ({
        ...prev,
        mealCompleted: true,
        mealStreak:
          response.data.streak ??
          prev?.mealStreak ??
          0,
        lastMealDate:
          response.data.lastMealDate ??
          prev?.lastMealDate ??
          null,
      }));

      // Hide today's meals on completion
      setGeneratedMeals([]);
      setDietCompletedToday(true);

      // Completion message
      setMessage(
        response.data.message ||
        "Today's diet completed successfully! You can come back tomorrow."
      );

    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "Unable to complete today's diet."
      );
    } finally {
      setIsCompleting(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="diet-page">
        <div className="diet-state">
          Loading diet plans...
        </div>
      </main>
    );
  }

  // =========================================================
  // PREMIUM MODAL
  // =========================================================

  if (showPremiumModal) {
    return (
      <main className="diet-page">
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onStartTrial={handleStartTrial}
        />
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <main className="diet-page">
        <div className="diet-state diet-state--error">
          {error}
        </div>
      </main>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <main className="diet-page">
      <section className="diet-shell">

        {/* HEADER */}
        <div className="diet-header">
          <p className="diet-eyebrow">
            Nutrition Plans
          </p>

          <h1>
            {profile?.membershipType === "Free"
              ? "Healthy Diet Plans"
              : "👑 Premium Dietitian Meal Plan"}
          </h1>

          <p className="diet-subtitle">
            {profile?.membershipType === "Free"
              ? "Healthy meal recommendations according to your fitness goal."
              : "Professionally designed meal plans prepared by certified dietitians."}
          </p>
        </div>

        {/* TOP SUMMARY */}
        <div className="diet-summary">
          <div className="summary-card">
            <h3>🎯 Your Goal</h3>
            <h2>{profile?.goal}</h2>
          </div>

          <div className="summary-card">
            <h3>🍽 Total Meals</h3>
            <h2>{generatedMeals?.length || 0}</h2>
          </div>

          <div className="summary-card">
            <h3>🔥 Meal Streak</h3>
            <h2>{profile?.mealStreak || 0} Days</h2>
          </div>
        </div>

        {/* BUTTON SECTION */}
        <div className="diet-complete">
          {!dietCompletedToday && generatedMeals.length === 0 && (
            <button
              className="meal-complete-btn"
              onClick={handleGenerateDiet}
            >
              🍽 Generate Diet
            </button>
          )}

          {!dietCompletedToday && generatedMeals.length > 0 && (
            <button
              className="meal-complete-btn"
              onClick={handleMealComplete}
              disabled={isCompleting}
            >
              {isCompleting
                ? "Saving..."
                : "✅ Complete Today's Diet"}
            </button>
          )}
        </div>

        {/* MEALS */}
        {dietCompletedToday ? (
          <div className="diet-state">
            <h2>✅</h2>
            <h3>Today's Diet Completed</h3>
            <p>
              You have completed today's diet successfully.
              Come back tomorrow for a fresh diet recommendation.
            </p>
          </div>
        ) : generatedMeals.length === 0 ? (
          <div className="diet-state">
            <h2>🥗</h2>
            <h3>No Diet Generated Yet</h3>
            <p>
              Click "Generate Diet" to get today's personalized
              meal recommendations.
            </p>
          </div>
        ) : (
          <div className="diet-grid">
            {(generatedMeals || []).map((meal) => (
              <article key={meal._id} className="diet-card">
                <div className="diet-card__top">
                  <span className="diet-card__badge">
                    {meal.mealType}
                  </span>

                  <span className="diet-card__badge diet-card__badge--secondary">
                    {meal.calories} kcal
                  </span>
                </div>

                <h3>{meal.dietName}</h3>

                <p>{meal.description}</p>

                <div className="diet-card__meta">
                  <span>
                    <strong>Protein:</strong> {meal.protein} g
                  </span>
                  <span>
                    <strong>Carbs:</strong> {meal.carbs} g
                  </span>
                </div>

                <div className="diet-card__meta" style={{ marginTop: "10px" }}>
                  <span>
                    <strong>Fats:</strong> {meal.fats} g
                  </span>
                  <span>
                    <strong>Meal:</strong> {meal.mealType}
                  </span>
                </div>

                {/* PREMIUM DIETITIAN DETAILS */}
                {profile?.membershipType !== "Free" && (
                  <div className="premium-diet-box">
                    <h4>👨‍⚕️ Dietitian Details</h4>

                    {meal.quantity && (
                      <p>
                        🎯 <strong>Quantity:</strong> {meal.quantity}
                      </p>
                    )}

                    <p>
                      ⏰ <strong>Best Time:</strong> {getBestTime(meal.mealType)}
                    </p>

                    <p>
                      💪 <strong>Perfect For:</strong> {profile?.goal}
                    </p>

                    {meal.dietitianNotes && (
                      <p>
                        ⭐ <strong>Dietitian Note:</strong> {meal.dietitianNotes}
                      </p>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {/* NUTRITION SUMMARY */}
        {generatedMeals.length > 0 && !dietCompletedToday && (
          <div className="diet-summary" style={{ marginTop: "40px" }}>
            <div className="summary-card">
              <h3>Total Calories</h3>
              <h2>{totalCalories} kcal</h2>
            </div>

            <div className="summary-card">
              <h3>Total Protein</h3>
              <h2>{totalProtein} g</h2>
            </div>
          </div>
        )}

        {/* HEALTHY EATING TIPS */}
        <div className="diet-tips">
          <h2>💡 Healthy Eating Tips</h2>
          <ul>
            <li>🥦 Eat fresh fruits and vegetables every day.</li>
            <li>💧 Drink enough water throughout the day.</li>
            <li>🍚 Eat balanced meals with protein and fiber.</li>
            <li>🍟 Reduce junk food and sugary drinks.</li>
            <li>⏰ Eat meals on time every day.</li>
          </ul>
        </div>

      </section>
    </main>
  );
};

export default Diet;