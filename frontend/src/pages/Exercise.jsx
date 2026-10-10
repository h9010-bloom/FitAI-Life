import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import PremiumModal from "../components/PremiumModal/PremiumModal.jsx";
import ChallengeFlowModal from "../components/ChallengeFlowModal/ChallengeFlowModal.jsx";
import "../styles/exercise.css";

const Exercise = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [generatedExercises, setGeneratedExercises] = useState([]);
  const [workoutCompletedToday, setWorkoutCompletedToday] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
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
    const fetchData = async () => {
      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        // Get User Profile
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

        // The backend is the source of truth for whether today's workout is already completed.
        const today = new Date().toDateString();
        const lastWorkout = user.lastWorkoutDate
          ? new Date(user.lastWorkoutDate).toDateString()
          : "";
        setWorkoutCompletedToday(
          Boolean(user.workoutCompleted && lastWorkout === today)
        );

        // Get Exercises Based on Goal
        const exerciseRes = await axios.get(
          `https://fitai-life-backend.onrender.com/api/exercises/goal/${encodeURIComponent(
            user.goal
          )}`
        );

        setExercises(exerciseRes.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load exercises."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const resetTodayWorkout = async () => {
    try {
      await axios.put(
        "https://fitai-life-backend.onrender.com/api/exercises/reset-today",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGeneratedExercises([]);
      setMessage("Today's workout has been reset.");

    } catch (error) {
      console.error("Reset workout error:", error);
      setMessage("Unable to reset today's workout.");
    }
  };

  // Generate Random Workout
  const handleGenerateWorkout = async () => {
    if (!token) {
      setMessage("Please login first.");
      return;
    }

    // Never allow a second workout to be generated after today's completion.
    if (workoutCompletedToday) {
      setGeneratedExercises([]);
      setMessage("You have already completed today's workout. Come back tomorrow!");
      return;
    }

    try {

      const response = await axios.get(
        "https://fitai-life-backend.onrender.com/api/exercises/today",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      if (response.data.completed) {

        setWorkoutCompletedToday(true);
        setGeneratedExercises([]);

        setMessage(response.data.message || "You have already completed today's workout. Come back tomorrow!");

        return;

      }

      if (!response.data.exercises) {

        setGeneratedExercises([]);

        setMessage(
          response.data.message || "No workout available."
        );

        return;

      }

      const receivedExercises = response.data.exercises || [];

      const isPremiumUser =
        profile?.membershipType === "Premium" ||
        profile?.membershipType === "Premium Trial";

      let filteredExercises;

      if (isPremiumUser) {
        filteredExercises = receivedExercises.filter(
          (exercise) =>
            exercise.membership?.toLowerCase() === "premium"
        );
      } else {
        filteredExercises = receivedExercises.filter(
          (exercise) =>
            exercise.membership?.toLowerCase() === "free"
        );
      }

      setGeneratedExercises(filteredExercises);

      console.log(
        "Membership:",
        profile?.membershipType
      );

      console.log(
        "Exercises received:",
        receivedExercises
      );

      console.log(
        "Exercises displayed:",
        filteredExercises
      );

      if (filteredExercises.length === 0) {
        setMessage(
          isPremiumUser
            ? "No Premium workouts available for your goal."
            : "No Free workouts available for your goal."
        );
        return;
      }

      setMessage("Today's workout generated successfully!");

    } catch (error) {

      setGeneratedExercises([]);

      setMessage(
        error.response?.data?.message ||
        "Unable to generate workout."
      );

    }

  };

  // Get trainer instructions for every exercise
  const getTrainerInstruction = (exercise) => {
    // Use the database instruction if it exists
    if (
      exercise?.trainerNote &&
      String(exercise.trainerNote).trim()
    ) {
      return exercise.trainerNote;
    }

    const name = String(
      exercise?.exerciseName || ""
    ).toLowerCase();

    const category = String(
      exercise?.category || ""
    ).toLowerCase();

    // Specific exercise instructions
    if (name.includes("incline dumbbell press")) {
      return "Keep your back supported, lower the dumbbells with control, and press upward without locking your elbows.";
    }

    if (name.includes("medicine ball slam")) {
      return "Keep your core engaged, maintain proper posture, and slam the medicine ball using controlled movement.";
    }

    if (name.includes("child pose")) {
      return "Focus on slow breathing, relax your shoulders, and gently stretch without forcing the position.";
    }

    // Category-based instructions
    if (category.includes("upper body")) {
      return "Maintain proper posture, keep your core engaged, and perform every repetition with controlled movement.";
    }

    if (category.includes("lower body")) {
      return "Keep your knees aligned with your toes and perform each repetition slowly while maintaining proper form.";
    }

    if (category.includes("yoga")) {
      return "Focus on slow breathing, maintain proper alignment, and gently move into the position without forcing the stretch.";
    }

    if (category.includes("power")) {
      return "Perform the movement explosively while maintaining proper form and control throughout the exercise.";
    }

    if (category.includes("cardio")) {
      return "Maintain a steady pace, keep your breathing controlled, and focus on maintaining good form.";
    }

    if (category.includes("core")) {
      return "Keep your core engaged throughout the movement and perform each repetition slowly and with control.";
    }

    if (category.includes("full body")) {
      return "Maintain proper posture, engage your core, and perform the complete movement with controlled technique.";
    }

    // Final fallback for any exercise
    return "Maintain proper form, control your breathing, and perform the exercise with steady and controlled movement.";
  };

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

  // Workout Summary
  const handleStartTrial = () => {
    setShowPremiumModal(false);
    navigate('/membership', { state: { openPremiumTrial: true } });
  };

  const totalDuration = useMemo(() => {
    return (generatedExercises || []).reduce(
      (sum, item) => sum + Number(item.duration || 0),
      0
    );
  }, [generatedExercises]);

  const totalCalories = useMemo(() => {
    return (generatedExercises || []).reduce(
      (sum, item) => sum + Number(item.caloriesBurned || 0),
      0
    );
  }, [generatedExercises]);

  // Complete Workout
  const handleCompleteWorkout = async () => {
    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      setIsCompleting(true);

      const response = await axios.post(
        "https://fitai-life-backend.onrender.com/api/profile/workout-complete",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWorkoutCompletedToday(true);

      setProfile((prev) => ({
        ...prev,
        ...response.data,
        dailyStreak:
          response.data.streak ??
          prev.dailyStreak,

        lastWorkoutDate:
          response.data.lastWorkoutDate ??
          prev.lastWorkoutDate,
      }));

      setGeneratedExercises([]);

      setMessage(
        response.data.message ||
        "Workout Completed Successfully!"
      );

      if (response.data.challengeStatus === "Completed") {
        openChallengeCompletionModal(profile?.membershipType || 'Free', profile?.challengePlan || 'your challenge');
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "Unable to save workout."
      );
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <main className="exercise-page">
        <div className="exercise-state">
          Loading exercises...
        </div>
      </main>
    );
  }

  if (showPremiumModal) {
    return (
      <main className="exercise-page">
        <PremiumModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
          onStartTrial={handleStartTrial}
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className="exercise-page">
        <div className="exercise-state exercise-state--error">
          {error}
        </div>
      </main>
    );
  }
  return (
    <main className="exercise-page">
      <section className="exercise-shell">

        <div className="exercise-header">
          <div>
            <p className="exercise-eyebrow">
              Daily Workout
            </p>

            <h1>
              {profile?.membershipType === "Free"
                ? "Today's Exercise Recommendation"
                : "👑 Premium Trainer Workout"}
            </h1>

            <p className="exercise-subtitle">
              {profile?.membershipType === "Free"
                ? "Exercises recommended according to your fitness goal."
                : "Professional trainer-designed workout based on your fitness goal."}
            </p>

          </div>
        </div>

        {/* =====================================================
    EXERCISE PAGE INFORMATION
    ===================================================== */}

        <div className="exercise-stats">

          <div className="exercise-stat-card">
            <span className="exercise-stat-label">
              Your Goal
            </span>

            <strong className="exercise-stat-value">
              {profile?.goal || "Not Set"}
            </strong>
          </div>


          <div className="exercise-stat-card">
            <span className="exercise-stat-label">
              Total Exercises
            </span>

            <strong className="exercise-stat-value">
              {generatedExercises.length}
            </strong>
          </div>


          <div className="exercise-stat-card">
            <span className="exercise-stat-label">
              Workout Streak
            </span>

            <strong className="exercise-stat-value">
              {profile?.dailyStreak || 0} Days
            </strong>
          </div>

        </div>


        {/* =====================================================
    GENERATE / COMPLETE BUTTON
    ===================================================== */}

        <div className="exercise-generate-area">

          {workoutCompletedToday ? (

            <button
              className="exercise-complete-btn"
              disabled
            >
              ✓ Today's Workout Completed
            </button>

          ) : generatedExercises.length === 0 ? (

            <button
              className="exercise-complete-btn"
              onClick={handleGenerateWorkout}
            >
              {profile?.membershipType === "Free"
                ? "🏃 Generate Exercise"
                : "👑 Generate Premium Workout"}
            </button>

          ) : (

            <button
              className="exercise-complete-btn"
              onClick={handleCompleteWorkout}
              disabled={isCompleting}
            >
              {isCompleting
                ? "Saving..."
                : "✓ Complete Today's Workout"}
            </button>

          )}

        </div>

        {message && (
          <div className="exercise-message">
            {message}
          </div>
        )}

        <div className="exercise-grid">

          {workoutCompletedToday ? (

            <div className="exercise-state">
              <h2>✅</h2>

              <h3>Today's Workout Completed</h3>

              <p>
                Great job! Your workout streak has been updated. Come back tomorrow for your next workout.
              </p>
            </div>

          ) : generatedExercises.length === 0 ? (

            <div className="exercise-state">
              <h2>🏃</h2>

              <h3>No Workout Generated</h3>

              <p>
                Click the Generate Exercise button to generate today's workout.
              </p>
            </div>

          ) : (

            generatedExercises.map((exercise) => (

              <article
                key={exercise._id}
                className={
                  profile?.membershipType === "Free"
                    ? "exercise-card exercise-card--free"
                    : "exercise-card exercise-card--premium"
                }
              >

                {profile?.membershipType === "Free" ? (

                  <div className="free-exercise-content">

                    <div className="free-card-header">

                      <span className="free-exercise-category">
                        {exercise.category}
                      </span>

                      <span className="free-exercise-difficulty">
                        {exercise.difficulty}
                      </span>

                    </div>

                    <h3 className="free-exercise-name">
                      {exercise.exerciseName}
                    </h3>

                    <p className="free-exercise-description">
                      {exercise.description}
                    </p>

                    <div className="free-exercise-details">

                      <div className="free-detail">

                        <span>⏱</span>

                        <div>
                          <small>Duration</small>
                          <strong>
                            {exercise.duration} min
                          </strong>
                        </div>

                      </div>

                      <div className="free-detail">

                        <span>🔥</span>

                        <div>
                          <small>Calories</small>
                          <strong>
                            {exercise.caloriesBurned} kcal
                          </strong>
                        </div>

                      </div>

                    </div>

                    <div className="free-exercise-goal">
                      🎯 Recommended for:{" "}
                      <strong>{profile?.goal}</strong>
                    </div>

                  </div>

                ) : (

                  /* =========================
                     PREMIUM EXERCISE CARD
                     ========================= */

                  <div className="premium-exercise-content">

                    <div className="exercise-card__top">

                      <span className="exercise-card__badge">
                        {exercise.category}
                      </span>

                      <span className="exercise-card__badge exercise-card__badge--secondary">
                        {exercise.difficulty}
                      </span>

                    </div>

                    <h3>
                      {exercise.exerciseName}
                    </h3>

                    <p>
                      {exercise.description}
                    </p>

                    <div className="exercise-card__details">

                      <div>
                        <span>⏱ Duration</span>
                        <strong>
                          {exercise.duration} min
                        </strong>
                      </div>

                      <div>
                        <span>🔥 Calories</span>
                        <strong>
                          {exercise.caloriesBurned} kcal
                        </strong>
                      </div>

                      <div>
                        <span>💪 Sets</span>
                        <strong>
                          {exercise.sets}
                        </strong>
                      </div>

                      <div>
                        <span>🔁 Reps</span>
                        <strong>
                          {exercise.reps}
                        </strong>
                      </div>

                      <div>
                        <span>😴 Rest</span>
                        <strong>
                          {exercise.rest}
                        </strong>
                      </div>

                      <div>
                        <span>🏋 Equipment</span>
                        <strong>
                          {exercise.equipment}
                        </strong>
                      </div>

                    </div>

                    <div className="trainer-box">

                      <h4>
                        👨‍🏫 Trainer Instructions
                      </h4>

                      <p>
                        {getTrainerInstruction(exercise)}
                      </p>

                    </div>

                  </div>

                )}

              </article>

            ))

          )}

        </div>

        <div className="exercise-summary">

          <h3>
            {profile?.membershipType === "Free"
              ? "Today's Workout Summary"
              : "👑 Premium Workout Summary"}
          </h3>

          <div className="exercise-summary__grid">

            <div>
              <span>Goal</span>
              <strong>
                {profile?.goal}
              </strong>
            </div>

            <div>
              <span>Total Exercises</span>
              <strong>
                {generatedExercises.length}
              </strong>
            </div>

            <div>
              <span>Total Duration</span>
              <strong>
                {totalDuration} min
              </strong>
            </div>

            <div>
              <span>Calories Burned</span>
              <strong>
                {totalCalories} kcal
              </strong>
            </div>

            <div>
              <span>Workout Streak</span>
              <strong>
                {profile?.dailyStreak || 0} Days
              </strong>
            </div>

          </div>

        </div>

      </section>
    </main>
  );
};

export default Exercise;