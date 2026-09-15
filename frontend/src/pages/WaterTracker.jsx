import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/waterTracker.css";

const WaterTracker = () => {

    const [water, setWater] = useState(null);

    const token = localStorage.getItem("token");

    const fetchWater = async () => {

        const res = await axios.get(
            "http://localhost:5000/api/water",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Water API Response:", res.data);

        setWater(res.data.water || res.data);

    };

    useEffect(() => {
        fetchWater();
    }, []);

    const addWater = async (amount) => {

        await axios.post(
            "http://localhost:5000/api/water/add",
            { amount },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        fetchWater();

    };

    if (!water)
        return <h2>Loading...</h2>;

    const percentage = Math.min(
        100,
        Math.round((water.consumed / water.goal) * 100)
    );

    let progressColor = "#ef4444"; // Red

    if (percentage >= 30) {
        progressColor = "#f59e0b"; // Orange
    }

    if (percentage >= 60) {
        progressColor = "#3b82f6"; // Blue
    }

    if (percentage >= 100) {
        progressColor = "#22c55e"; // Green
    }

    return (

        <main className="water-page">

            <div className="water-card">

                <h1>💧 Hydration Center</h1>

                <p>
                    Stay hydrated to improve
                    your performance.
                </p>

                <div
                    className="water-circle"
                    style={{
                        "--progress": percentage,
                        "--color": progressColor,
                    }}
                >
                    <h2>{percentage}%</h2>

                    <span>
                        {water.consumed} / {water.goal} ml
                    </span>
                </div>

                {!water.completed ? (

                    <div className="water-buttons">

                        <button onClick={() => addWater(250)}>
                            +250 ml
                        </button>

                        <button onClick={() => addWater(500)}>
                            +500 ml
                        </button>

                        <button onClick={() => addWater(750)}>
                            +750 ml
                        </button>

                        <button onClick={() => addWater(1000)}>
                            +1000 ml
                        </button>

                    </div>

                ) : (

                    <div className="water-success">

                        <h2>🏆 Goal Completed!</h2>

                        <p>
                            Excellent work!
                        </p>

                        <p>
                            You have successfully completed today's hydration goal.
                        </p>

                        <p>
                            Come back tomorrow and continue your healthy streak.
                        </p>

                    </div>

                )}

                <div className="water-tip">

                    <h3>
                        💡 AI Hydration Tip
                    </h3>

                    <p>

                        Drink one glass of water
                        30 minutes before meals.

                    </p>

                </div>

                <div className="water-status">

                    {

                        water.completed

                            ?

                            "🏆 Goal Achieved!"

                            :

                            "💧 Keep Hydrating"

                    }

                </div>

            </div>

        </main>

    );

};

export default WaterTracker;