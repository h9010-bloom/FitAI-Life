import { useEffect, useState } from "react";
import axios from "axios";

const CheckInManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCheckIns = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://fitai-life-backend.onrender.com/api/admin/checkins"
      );

      setUsers(res.data);
    } catch (error) {
      console.error("Error loading check-ins:", error);
      alert("Unable to load check-in data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckIns();
  }, []);

  return (
    <div className="content-card">

      <h2>📈 Daily Check-In Management</h2>

      <p
        style={{
          marginBottom: "20px",
          color: "#666",
        }}
      >
        View all registered users along with their workout and meal streaks.
      </p>

      {loading ? (
        <h3>Loading...</h3>
      ) : users.length === 0 ? (
        <h3>No users found.</h3>
      ) : (
        <table className="admin-table">

          <thead>

            <tr>

              <th>Name</th>

              <th>Email</th>

              <th>Goal</th>

              <th>Workout Streak</th>

              <th>Meal Streak</th>

              <th>Last Workout</th>

              <th>Last Meal</th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr key={user._id}>

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>{user.goal || "-"}</td>

                <td>
                  🔥 {user.dailyStreak || 0} days
                </td>

                <td>
                  🍽 {user.mealStreak || 0} days
                </td>

                <td>
                  {user.lastWorkoutDate
                    ? new Date(
                      user.lastWorkoutDate
                    ).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  {user.lastMealDate
                    ? new Date(
                      user.lastMealDate
                    ).toLocaleDateString()
                    : "-"}
                </td>

              </tr>

            ))}

          </tbody>

        </table>
      )}
    </div>
  );
};

export default CheckInManager;