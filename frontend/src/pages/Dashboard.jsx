import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import PremiumModal from "../components/PremiumModal/PremiumModal";
import ChallengeFlowModal from "../components/ChallengeFlowModal/ChallengeFlowModal";

import "../styles/dashboard.css";

const quickActions = [
  {
    title: "Exercise Recommendation",
    description: "Discover workouts that match your current fitness goal.",
    to: "/exercise",
    icon: "🏋️",
    premiumFeature: true,
  },
  {
    title: "Diet Recommendation",
    description: "Get nutrition ideas that support your health plan.",
    to: "/diet",
    icon: "🥗",
    premiumFeature: true,
  },
  {
    title: "Progress Tracker",
    description: "Keep an eye on your milestones and improvements.",
    to: "/progress",
    icon: "📈",
    premiumFeature: false,
  },
  {
    title: "AI Chat",
    description: "Talk to your wellness assistant for guidance.",
    to: "/chat",
    icon: "🤖",
    premiumFeature: false,
  },
];

const Dashboard = () => {

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [membership, setMembership] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Premium Feature Popup
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Trial Expired Popup
  const [showTrialExpiredModal, setShowTrialExpiredModal] = useState(false);

  // Challenge Completed Popup
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  useEffect(() => {

    const fetchDashboardData = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to continue.");
        setLoading(false);
        return;
      }

      try {

        // -------------------------
        // Profile
        // -------------------------

        const profileResponse = await axios.get(
          "https://fitai-life-backend.onrender.com/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData =
          profileResponse.data.user || profileResponse.data;

        setProfile(userData);

        // Show challenge completion popup
        if (userData.challengeCompletedPopup) {
          setShowChallengeModal(true);
        }

        // If challenge is already completed and
        // premium popup hasn't been shown yet
        else if (
          userData.challengeStatus === "Completed" &&
          userData.membershipType === "Free" &&
          !userData.premiumPopupShown
        ) {
          setShowPremiumModal(true);
        }

        // If user hasn't selected a challenge yet
        if (!userData.challengePlan || userData.targetDays === 0) {
          navigate("/membership");
          return;
        }

        // -------------------------
        // Membership
        // -------------------------

        const membershipResponse = await axios.get(
          "https://fitai-life-backend.onrender.com/api/membership",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMembership(membershipResponse.data);

        // -------------------------
        // Trial Check
        // -------------------------

        const trialResponse = await axios.get(
          "https://fitai-life-backend.onrender.com/api/membership/check-trial",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          trialResponse.data.membershipStatus === "Expired"
        ) {
          setShowTrialExpiredModal(true);
        }

      } catch (error) {

        console.error(error);

        setError(
          error.response?.data?.message ||
          "Unable to load dashboard."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchDashboardData();

  }, [navigate]);

  // ==========================================
  // Premium Feature Modal
  // ==========================================

  const handleOpenPremiumModal = () => {

    // Premium users don't need popup
    if (
      membershipType === "Premium" ||
      membershipType === "Premium Trial"
    ) {
      return;
    }

    setShowPremiumModal(true);
  };

  const handleStartTrial = async () => {

    setShowPremiumModal(false);

    try {

      const token = localStorage.getItem("token");

      await axios.put(
        "https://fitai-life-backend.onrender.com/api/profile/premium-popup",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } catch (error) {
      console.error(error);
    }

    navigate("/membership", {
      state: {
        openPremiumTrial: true,
      },
    });

  };

  // ==========================================
  // Trial Expired Flow
  // ==========================================

  const handleUpgradeNow = () => {
    setShowTrialExpiredModal(false);

    navigate("/membership", {
      state: {
        openPremiumTrial: true,
      },
    });
  };

  const handleContinueWithFreePlan = () => {
    setShowTrialExpiredModal(false);

    navigate("/challenge", {
      state: {
        membershipType: "Free",
      },
    });
  };


  // ==========================================
  // Dashboard Data
  // ==========================================

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const bmi =
    profile?.height && profile?.weight
      ? (
        Number(profile.weight) /
        ((Number(profile.height) / 100) ** 2)
      ).toFixed(1)
      : "—";

  const membershipType =
    membership?.membershipType ||
    profile?.membershipType ||
    "Free";

  const completedDays = profile?.completedDays ?? 0;

  const targetDays = profile?.targetDays ?? 0;

  const remainingDays = Math.max(
    targetDays - completedDays,
    0
  );

  const completionPercentage =
    targetDays > 0
      ? Math.round((completedDays / targetDays) * 100)
      : 0;
  if (loading) {
    return (
      <main className="dashboard-page">
        <section className="dashboard dashboard--state">
          <div className="dashboard__spinner" />
          <p className="dashboard__state-text">
            Loading your dashboard...
          </p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <section className="dashboard dashboard--state">
          <p className="dashboard__error">
            {error}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">

      <section className="dashboard">

        {/* Hero */}

        <div className="dashboard__hero">

          <div>

            <p className="dashboard__eyebrow">
              Wellness Overview
            </p>

            <h1>
              Welcome back, {profile?.name || "User"}!

              {(membershipType === "Premium" ||
                membershipType === "Premium Trial") && (
                  <span className="dashboard__premium-user">
                    👑 PREMIUM
                  </span>
                )}

            </h1>

            <p className="dashboard__subtitle">
              Stay consistent and complete today's goals.
            </p>

          </div>

          <div className="dashboard__hero-badge">
            {currentDate}
          </div>

        </div>

        {/* Overview */}

        <div className="dashboard__overview-grid">

          <article className="dashboard__overview-card dashboard__overview-card--goal">
            <span className="dashboard__card-label">
              Goal
            </span>

            <h3>
              {profile?.goal || "Not Selected"}
            </h3>

          </article>

          <article className="dashboard__overview-card">

            <span className="dashboard__card-label">
              Height
            </span>

            <h3>
              {profile?.height
                ? `${profile.height} cm`
                : "Not Added"}
            </h3>

          </article>

          <article className="dashboard__overview-card">

            <span className="dashboard__card-label">
              Weight
            </span>

            <h3>
              {profile?.weight
                ? `${profile.weight} kg`
                : "Not Added"}
            </h3>

          </article>

          <article className="dashboard__overview-card">

            <span className="dashboard__card-label">
              BMI
            </span>

            <h3>{bmi}</h3>

          </article>

        </div>

        {/* Membership */}

        <section className="dashboard__membership-card">

          <div className="dashboard__panel-header">

            <h2>
              Membership Summary
            </h2>

            <p>
              {membershipType}
            </p>

          </div>

          <div className="dashboard__summary-list">

            <div className="dashboard__summary-item">
              <span>Membership</span>
              <strong>{membershipType}</strong>
            </div>

            <div className="dashboard__summary-item">
              <span>Challenge</span>
              <strong>{profile?.challengePlan}</strong>
            </div>

            <div className="dashboard__summary-item">
              <span>Completed</span>
              <strong>{completedDays} / {targetDays}</strong>
            </div>

            <div className="dashboard__summary-item">
              <span>Remaining</span>
              <strong>{remainingDays}</strong>
            </div>

            <div className="dashboard__summary-item">
              <span>Completion</span>
              <strong>{completionPercentage}%</strong>
            </div>

            <div className="dashboard__summary-item">
              <span>Status</span>
              <strong>{profile?.challengeStatus}</strong>
            </div>

            <div className="dashboard__summary-item">
              <span>Workout Progress</span>
              <strong>{completedDays}/{targetDays}</strong>
            </div>

            <div className="dashboard__summary-item">
              <span>Meal Progress</span>
              <strong>{completedDays}/{targetDays}</strong>
            </div>

          </div>

        </section>

        {/* Quick Actions */}

        <div className="dashboard__cards-grid">

          {quickActions.map((action) => (

            <article
              key={action.title}
              className={`dashboard__action-card ${action.premiumFeature
                ? "dashboard__action-card--premium"
                : ""
                }`}
            >

              <div className="dashboard__action-icon">
                {action.icon}
              </div>

              <div className="dashboard__action-content">

                <h3>{action.title}</h3>

                {action.premiumFeature && (
                  <span className="dashboard__premium-badge">
                    🔒 Premium
                  </span>
                )}

                <p>{action.description}</p>

                {action.premiumFeature &&
                  membershipType === "Free" ? (

                  <button
                    className="dashboard__action-btn"
                    onClick={() => {

                      if (
                        membershipType === "Premium" ||
                        membershipType === "Premium Trial"
                      ) {
                        navigate(action.to);
                        return;
                      }

                      handleOpenPremiumModal();

                    }}
                  >
                    Open
                  </button>

                ) : (

                  <Link
                    to={action.to}
                    className="dashboard__action-btn"
                  >
                    Open
                  </Link>

                )}

              </div>

            </article>

          ))}

        </div>
        {/* ===============================
    Premium Dashboard
================================ */}

        {membershipType !== "Free" && (

          <section className="dashboard__premium-panel">

            <div className="dashboard__panel-header">
              <h2>👑 Premium Wellness Center</h2>
              <p>Premium Features</p>
            </div>

            <div className="dashboard__premium-grid">

              <Link
                to="/water"
                className="dashboard__premium-card"
              >

                <h3>💧 Water Tracker</h3>

                <h1>Open</h1>

                <p>Track Today's Hydration</p>

              </Link>

              <Link
                to="/sleep"
                className="dashboard__premium-card"
              >

                <h3>😴 Sleep Tracker</h3>

                <h1>Open</h1>

                <p>Track Your Sleep</p>

              </Link>

              <div className="dashboard__premium-card">

                <h3>🏋 Today's Workout</h3>

                <p>Professional Trainer Plan Ready</p>

              </div>

              <div className="dashboard__premium-card">

                <h3>🥗 Today's Diet</h3>

                <p>Dietitian Meal Plan Ready</p>

              </div>

            </div>

          </section>

        )}
        {/* Health Summary */}

        <section className="dashboard__health-panel">

          <div className="dashboard__panel-header">

            <h2>
              Health Summary
            </h2>

          </div>

          <div className="dashboard__summary-list">

            <div className="dashboard__summary-item">
              <span>Age</span>
              <strong>{profile?.age}</strong>
            </div>

            <div className="dashboard__summary-item">
              <span>Gender</span>
              <strong>{profile?.gender}</strong>
            </div>

            <div className="dashboard__summary-item">
              <span>Height</span>
              <strong>{profile?.height} cm</strong>
            </div>

            <div className="dashboard__summary-item">
              <span>Weight</span>
              <strong>{profile?.weight} kg</strong>
            </div>

            <div className="dashboard__summary-item">
              <span>BMI</span>
              <strong>{bmi}</strong>
            </div>

            <div className="dashboard__summary-item">
              <span>Goal</span>
              <strong>{profile?.goal}</strong>
            </div>

          </div>

        </section>

      </section>

      {/* -------------------------------
          Trial Expired Modal
      -------------------------------- */}

      <ChallengeFlowModal
        isOpen={showTrialExpiredModal}
        title="⏳ Premium Trial Ended"
        message="Your 7-Day Premium Trial has expired. Upgrade to continue enjoying Premium workouts, meal plans and advanced AI features."
        primaryLabel="Upgrade Now"
        secondaryLabel="Continue with Free Plan"
        onPrimary={handleUpgradeNow}
        onSecondary={handleContinueWithFreePlan}
        onClose={() => setShowTrialExpiredModal(false)}
      />

      {/* -------------------------------
          Premium Feature Modal
      -------------------------------- */}

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={async () => {

          setShowPremiumModal(false);

          try {

            const token = localStorage.getItem("token");

            await axios.put(
              "https://fitai-life-backend.onrender.com/api/profile/premium-popup",
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          } catch (error) {
            console.error(error);
          }

        }}
        onStartTrial={handleStartTrial}
      />

    </main>
  );

};

export default Dashboard;