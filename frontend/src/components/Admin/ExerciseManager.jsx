import { useEffect, useState } from "react";
import axios from "axios";

const ExerciseManager = () => {
  const [exercises, setExercises] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    exerciseName: "",
    category: "",
    difficulty: "",
    duration: "",
    caloriesBurned: "",
    description: "",
    goal: "",

    membership: "Free",
    workoutType: "Main Workout",
    sets: 3,
    reps: "10-12",
    rest: "60 sec",
    equipment: "Body Weight",
    trainerNote: "",
  });

  const fetchExercises = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/exercises");
      setExercises(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const clearForm = () => {
    setEditingId(null);

    setFormData({
      exerciseName: "",
      category: "",
      difficulty: "",
      duration: "",
      caloriesBurned: "",
      description: "",
      goal: "",

      membership: "Free",
      workoutType: "Main Workout",
      sets: 3,
      reps: "10-12",
      rest: "60 sec",
      equipment: "Body Weight",
      trainerNote: "",
    });
  };

  const addExercise = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/exercises",
      formData
    );

    alert("Exercise added successfully.");

    clearForm();
    fetchExercises();
  };

  const updateExercise = async (e) => {
    e.preventDefault();

    await axios.put(
      `http://localhost:5000/api/exercises/${editingId}`,
      formData
    );

    alert("Exercise updated successfully.");

    clearForm();
    fetchExercises();
  };

  const deleteExercise = async (id) => {
    if (!window.confirm("Delete this exercise?")) return;

    await axios.delete(
      `http://localhost:5000/api/exercises/${id}`
    );

    fetchExercises();
  };

  const editExercise = (exercise) => {
    setEditingId(exercise._id);

    setFormData({
      exerciseName: exercise.exerciseName,
      category: exercise.category,
      difficulty: exercise.difficulty,
      duration: exercise.duration,
      caloriesBurned: exercise.caloriesBurned,
      description: exercise.description,
      goal: exercise.goal,

      membership: exercise.membership || "Free",
      workoutType: exercise.workoutType || "Main Workout",
      sets: exercise.sets || 3,
      reps: exercise.reps || "10-12",
      rest: exercise.rest || "60 sec",
      equipment: exercise.equipment || "Body Weight",
      trainerNote: exercise.trainerNote || "",
    });
  };

  return (
    <div className="content-card">
      <h2>🏋️ Exercise Management</h2>

      <form
        onSubmit={editingId ? updateExercise : addExercise}
        className="diet-form"
      >
        <input
          name="exerciseName"
          placeholder="Exercise Name"
          value={formData.exerciseName}
          onChange={handleChange}
          required
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Cardio">Cardio</option>
          <option value="Strength">Strength</option>
          <option value="Flexibility">Flexibility</option>
          <option value="Balance">Balance</option>
          <option value="HIIT">HIIT</option>
          <option value="Yoga">Yoga</option>
        </select>

        {/* Difficulty Dropdown */}
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          required
        >
          <option value="">Select Difficulty</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <input
          type="number"
          name="duration"
          placeholder="Duration (Minutes)"
          value={formData.duration}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="caloriesBurned"
          placeholder="Calories Burned"
          value={formData.caloriesBurned}
          onChange={handleChange}
          required
        />

        {/* Goal Dropdown */}
        <select
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          required
        >
          <option value="">Select Goal</option>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Weight Gain">Weight Gain</option>
          <option value="Stay Fit">Stay Fit</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <hr style={{ margin: "20px 0" }} />

        <h3>👑 Premium Workout Details</h3>

        {/* Membership */}

        <select
          name="membership"
          value={formData.membership}
          onChange={handleChange}
        >
          <option value="Free">Free</option>
          <option value="Premium">Premium</option>
        </select>

        {/* Workout Type */}

        <select
          name="workoutType"
          value={formData.workoutType}
          onChange={handleChange}
        >
          <option value="Warm-up">Warm-up</option>
          <option value="Main Workout">Main Workout</option>
          <option value="Core">Core</option>
          <option value="Cool Down">Cool Down</option>
        </select>

        <input
          type="number"
          name="sets"
          placeholder="Sets"
          value={formData.sets}
          onChange={handleChange}
        />

        <input
          name="reps"
          placeholder="Reps (Example: 10-12)"
          value={formData.reps}
          onChange={handleChange}
        />

        <input
          name="rest"
          placeholder="Rest Time"
          value={formData.rest}
          onChange={handleChange}
        />

        <input
          name="equipment"
          placeholder="Equipment"
          value={formData.equipment}
          onChange={handleChange}
        />

        <textarea
          name="trainerNote"
          placeholder="Trainer Note"
          value={formData.trainerNote}
          onChange={handleChange}
        />

        <button id="add-btn" type="submit">
          {editingId ? "Update Exercise" : "Add Exercise"}
        </button>

        <button id="clear-btn" type="button" onClick={clearForm}>
          Clear
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Duration</th>
            <th>Calories</th>
            <th>Goal</th>
            <th>Membership</th>
            <th>Workout Type</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {exercises.map((exercise) => (
            <tr key={exercise._id}>
              <td>{exercise.exerciseName}</td>
              <td>{exercise.category}</td>
              <td>{exercise.difficulty}</td>
              <td>{exercise.duration} min</td>
              <td>{exercise.caloriesBurned}</td>
              <td>{exercise.goal}</td>
              <td>{exercise.membership}</td>
              <td>{exercise.workoutType}</td>

              <td>
                <div className="action-buttons">

                  <button
                    id="btn"
                    type="button"
                    onClick={() => editExercise(exercise)}
                  >
                    Edit
                  </button>

                  <button
                    id="btn"
                    type="button"
                    onClick={() => deleteExercise(exercise._id)}
                  >
                    Delete
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExerciseManager;