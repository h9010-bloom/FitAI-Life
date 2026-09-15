import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/progress.css";

const Progress = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your progress.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = response.data.user || response.data;
        setProfile(user);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load your progress."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const bmi =
    profile?.height && profile?.weight
      ? (
          Number(profile.weight) /
          ((Number(profile.height) / 100) ** 2)
        ).toFixed(1)
      : "--";

  const targetDays = Number(profile?.targetDays || 0);
  const completedDays = Number(profile?.completedDays || 0);

  const remainingDays = Math.max(
    targetDays - completedDays,
    0
  );

  const completionPercentage =
    targetDays > 0
      ? Math.min(
          100,
          Math.round((completedDays / targetDays) * 100)
        )
      : 0;

  const challengeProgressWidth =
    targetDays > 0
      ? `${completionPercentage}%`
      : "0%";

  const isFree =
    profile?.membershipType === "Free";

  const achievements = [
    {
      title: "🏋 First Workout",
      unlocked: (profile?.dailyStreak || 0) >= 1,
      description: "Complete your first workout.",
    },
    {
      title: "🔥 Workout Champion",
      unlocked: (profile?.dailyStreak || 0) >= 7,
      description: "Reach a 7-day workout streak.",
    },
    {
      title: "🍎 Healthy Eater",
      unlocked: (profile?.mealStreak || 0) >= 1,
      description: "Complete your first meal plan.",
    },
    {
      title: "🌟 Nutrition Master",
      unlocked: (profile?.mealStreak || 0) >= 7,
      description: "Maintain meals for 7 days.",
    },
    {
      title: "🎯 Goal Setter",
      unlocked: !!profile?.goal,
      description: "Choose your fitness goal.",
    },
    {
      title: "⚖ Healthy BMI",
      unlocked:
        bmi !== "--" &&
        Number(bmi) >= 18.5 &&
        Number(bmi) <= 24.9,
      description: "Maintain a healthy BMI.",
    },
  ];

  if (loading) {
    return (
      <main
        className={`progress-page ${
          isFree
            ? "progress-page--free"
            : "progress-page--premium"
        }`}
      >
        <div className="progress-loading">
          Loading your progress...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="progress-page">
        <div className="progress-error">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main
      className={`progress-page ${
        isFree
          ? "progress-page--free"
          : "progress-page--premium"
      }`}
    >
      <section className="progress-container">

        {/* =========================
            PREMIUM FITNESS REPORT
        ========================== */}
        {!isFree && (
          <div className="premium-progress-overview">

            <div className="premium-progress-header">
              <h2>👑 Premium Fitness Report</h2>

              <span className="premium-badge">
                {profile?.membershipType}
              </span>
            </div>

            <div className="premium-overview-grid">

              <div>
                <span>Fitness Goal</span>
                <h3>
                  {profile?.goal || "Not selected"}
                </h3>
              </div>

              <div>
                <span>Challenge</span>
                <h3>
                  {profile?.challengePlan ||
                    "Not selected"}
                </h3>
              </div>

              <div>
                <span>Completed</span>
                <h3>
                  {completedDays}/{targetDays} Days
                </h3>
              </div>

              <div>
                <span>Overall Progress</span>
                <h3>
                  {completionPercentage}%
                </h3>
              </div>

            </div>
          </div>
        )}

        {/* =========================
            PAGE HEADER
        ========================== */}
        <div className="progress-header">

          <div className="progress-title-row">
            <span className="progress-title-icon">
              📈
            </span>

            <div>
              <h1>Progress Dashboard</h1>

              <p>
                Track your fitness journey and
                celebrate every achievement.
              </p>
            </div>
          </div>

          <div
            className={`progress-membership-tag ${
              isFree
                ? "progress-membership-tag--free"
                : "progress-membership-tag--premium"
            }`}
          >
            {isFree ? "FREE PLAN" : "👑 PREMIUM"}
          </div>

        </div>

        {/* =========================
            MAIN PROGRESS CARDS
        ========================== */}
        <div className="progress-grid">

          <div
            className={`progress-main-grid ${
              isFree
                ? "progress-main-grid--free"
                : "progress-main-grid--premium"
            }`}
          >

            {/* WORKOUT STREAK */}
            <div
              className={`progress-main-card workout-card ${
                isFree
                  ? "progress-main-card--free"
                  : "progress-main-card--premium"
              }`}
            >
              <div className="progress-icon">
                🔥
              </div>

              <div>
                <p>Workout Streak</p>

                <h2>
                  {profile?.dailyStreak || 0} Days
                </h2>

                <span>
                  Stay consistent every day
                </span>
              </div>
            </div>

            {/* MEAL STREAK */}
            <div
              className={`progress-main-card meal-card ${
                isFree
                  ? "progress-main-card--free"
                  : "progress-main-card--premium"
              }`}
            >
              <div className="progress-icon">
                🍽️
              </div>

              <div>
                <p>Meal Streak</p>

                <h2>
                  {profile?.mealStreak || 0} Days
                </h2>

                <span>
                  Healthy eating progress
                </span>
              </div>
            </div>

            {/* CURRENT WEIGHT */}
            <div
              className={`progress-main-card weight-card ${
                isFree
                  ? "progress-main-card--free"
                  : "progress-main-card--premium"
              }`}
            >
              <div className="progress-icon">
                ⚖️
              </div>

              <div>
                <p>Current Weight</p>

                <h2>
                  {profile?.weight || "--"} kg
                </h2>

                <span>
                  Goal:{" "}
                  {profile?.goal || "Not selected"}
                </span>
              </div>
            </div>

            {/* BMI */}
            <div
              className={`progress-main-card bmi-card ${
                isFree
                  ? "progress-main-card--free"
                  : "progress-main-card--premium"
              }`}
            >
              <div className="progress-icon">
                ❤️
              </div>

              <div>
                <p>BMI Score</p>

                <h2>{bmi}</h2>

                <span>
                  {bmi !== "--" &&
                  Number(bmi) >= 18.5 &&
                  Number(bmi) <= 24.9
                    ? "Healthy Range ✅"
                    : "Keep Improving 💪"}
                </span>
              </div>
            </div>

          </div>

          {/* =========================
              PREMIUM WEEKLY STATISTICS
          ========================== */}
          {!isFree && (
            <section className="premium-stats">

              <div className="premium-stats-header">
                <div>
                  <span className="premium-section-label">
                    PERFORMANCE OVERVIEW
                  </span>

                  <h2>
                    📊 Weekly Statistics
                  </h2>
                </div>
              </div>

              <div className="progress-grid">

                <div className="progress-card">
                  <h3>🏋 Workout Days</h3>
                  <h2>
                    {profile?.totalWorkoutDays || 0}
                  </h2>
                  <span>
                    Active workout days
                  </span>
                </div>

                <div className="progress-card">
                  <h3>🍽 Meal Days</h3>
                  <h2>
                    {profile?.totalMealDays || 0}
                  </h2>
                  <span>
                    Healthy meal days
                  </span>
                </div>

                <div className="progress-card">
                  <h3>🔥 Calories Burned</h3>
                  <h2>
                    {(profile?.totalWorkoutDays || 0) *
                      300}{" "}
                    kcal
                  </h2>
                  <span>
                    Estimated calories
                  </span>
                </div>

                <div className="progress-card">
                  <h3>🎯 Current Goal</h3>
                  <h2>
                    {profile?.goal ||
                      "Not selected"}
                  </h2>
                  <span>
                    Your fitness target
                  </span>
                </div>

              </div>
            </section>
          )}

        </div>

        {/* =========================
            CHALLENGE PROGRESS
        ========================== */}
        <div className="section-title">
          <span>🎯</span>
          Challenge Progress
        </div>

        <div className="progress-section">

          <div className="progress-info">
            <span>Challenge Name</span>
            <strong>
              {profile?.challengePlan ||
                "Not selected"}
            </strong>
          </div>

          <div className="progress-info">
            <span>Completed Days</span>
            <strong>{completedDays}</strong>
          </div>

          <div className="progress-info">
            <span>Remaining Days</span>
            <strong>{remainingDays}</strong>
          </div>

          <div className="progress-info">
            <span>Completion</span>
            <strong>
              {completionPercentage}%
            </strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: challengeProgressWidth,
              }}
            />
          </div>

        </div>

        {/* =========================
            WORKOUT PROGRESS
        ========================== */}
        <div className="section-title">
          <span>🏋️</span>
          Workout Progress
        </div>

        <div className="progress-section">

          <div className="progress-info">
            <span>Challenge Completion</span>

            <strong>
              {completionPercentage}%
            </strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: challengeProgressWidth,
              }}
            />
          </div>

        </div>

        {/* =========================
            MEAL PROGRESS
        ========================== */}
        <div className="section-title">
          <span>🍎</span>
          Meal Progress
        </div>

        <div className="progress-section">

          <div className="progress-info">
            <span>Challenge Completion</span>

            <strong>
              {completionPercentage}%
            </strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: challengeProgressWidth,
              }}
            />
          </div>

        </div>

        {/* =========================
            ACHIEVEMENTS
        ========================== */}
        <div className="section-title">
          <span>🏆</span>
          Achievements
        </div>

        <div className="achievement-grid">

          {achievements.map((item, index) => (
            <div
              key={index}
              className={`achievement-card ${
                item.unlocked
                  ? "unlocked"
                  : "locked"
              }`}
            >
              <h3>{item.title}</h3>

              <p className="achievement-status">
                {item.unlocked
                  ? "✅ Unlocked"
                  : "🔒 Locked"}
              </p>

              <p>{item.description}</p>
            </div>
          ))}

        </div>

        {/* =========================
            PREMIUM COACH RECOMMENDATION
        ========================== */}
        {!isFree && (
          <div className="coach-card">

            <div className="coach-card-icon">
              🤖
            </div>

            <div>
              <h2>
                Coach Recommendation
              </h2>

              <p>
                Great work! You have completed{" "}
                <strong>
                  {completedDays}
                </strong>{" "}
                days of your challenge. Maintain
                your{" "}
                <strong>
                  {profile?.dailyStreak || 0}
                  -day workout streak
                </strong>{" "}
                to unlock more achievements.
                Stay consistent and trust the
                process.
              </p>
            </div>

          </div>
        )}

      </section>
    </main>
  );
};

export default Progress;