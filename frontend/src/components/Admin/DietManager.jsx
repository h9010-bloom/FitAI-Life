import { useEffect, useState } from "react";
import axios from "axios";

const DietManager = () => {
  const [diets, setDiets] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    mealName: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    mealType: "",
    goal: "",
    membership: "Free",
    description: "",
    image: "",
  });

  const fetchDiets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/diets");
      setDiets(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDiets();
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
      mealName: "",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
      mealType: "",
      membership: "Free",
      goal: "",
      description: "",
      image: "",
    });
  };

  const addDiet = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/api/diets", formData);

    alert("Diet added successfully.");

    clearForm();
    fetchDiets();
  };

  const updateDiet = async (e) => {
    e.preventDefault();

    await axios.put(
      `http://localhost:5000/api/diets/${editingId}`,
      formData
    );

    alert("Diet updated successfully.");

    clearForm();
    fetchDiets();
  };

  const deleteDiet = async (id) => {
    if (!window.confirm("Delete this diet?")) return;

    await axios.delete(`http://localhost:5000/api/diets/${id}`);

    fetchDiets();
  };

  const editDiet = (diet) => {
    setEditingId(diet._id);

    setFormData({
      mealName: diet.mealName,
      calories: diet.calories,
      protein: diet.protein,
      carbs: diet.carbs,
      fats: diet.fats,
      mealType: diet.mealType,
      goal: diet.goal,
      description: diet.description,
      image: diet.image,
    });
  };

  return (
    <div className="content-card">
      <h2>🥗 Diet Management</h2>

      <form
        onSubmit={editingId ? updateDiet : addDiet}
        className="diet-form"
      >
        <input
          name="mealName"
          placeholder="Meal Name"
          value={formData.mealName}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="calories"
          placeholder="Calories"
          value={formData.calories}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="protein"
          placeholder="Protein"
          value={formData.protein}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="carbs"
          placeholder="Carbs"
          value={formData.carbs}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="fats"
          placeholder="Fats"
          value={formData.fats}
          onChange={handleChange}
          required
        />

        {/* Meal Type Dropdown */}
        <select
          name="mealType"
          value={formData.mealType}
          onChange={handleChange}
          required
        >
          <option value="">Select Meal Type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
        </select>

        {/* Goal Dropdown */}
        <select
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          required
        >
          <option value="">Select Goal</option>
          <option value="Weight Loss">Lose Weight</option>
          <option value="Weight Gain">Gain Weight</option>
          <option value="Stay Fit">Maintain Fitness</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
/
        <input
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />

        <button id="add-btn" type="submit">
          {editingId ? "Update Diet" : "Add Diet"}
        </button>

        <button id="clear-btn" type="button" onClick={clearForm}>
          Clear
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Meal</th>
            <th>Meal Type</th>
            <th>Calories</th>
            <th>Goal</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {diets.map((diet) => (
            <tr key={diet._id}>
              <td>{diet.dietName}</td>
              <td>{diet.mealType}</td>
              <td>{diet.calories}</td>
              <td>{diet.goal}</td>

              <td>
                <button
                  id="btn"
                  type="button"
                  onClick={() => editDiet(diet)}
                >
                  Edit
                </button>

                <button
                  id="btn"
                  type="button"
                  onClick={() => deleteDiet(diet._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DietManager;