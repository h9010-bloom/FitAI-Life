import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/sleepTracker.css";

const SleepTracker = () => {

    const [sleep, setSleep] = useState(null);

    const [bedTime, setBedTime] = useState("");

    const [wakeTime, setWakeTime] = useState("");

    const token = localStorage.getItem("token");

    const fetchSleep = async () => {

        const res = await axios.get(
            "https://fitai-life-backend.onrender.com/api/sleep",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setSleep(res.data);

    };

    useEffect(() => {
        fetchSleep();
    }, []);

    const saveSleep = async () => {

        await axios.post(
            "https://fitai-life-backend.onrender.com/api/sleep/save",
            {
                bedTime,
                wakeTime,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        fetchSleep();

    };

    if (!sleep) return <h2>Loading...</h2>;

    return (

        <main className="sleep-page">

            <div className="sleep-card">

                <h1>🌙 AI Recovery Center</h1>

                <p>
                    Better sleep leads to better performance.
                </p>

                <div
                    className="sleep-circle"
                    style={{
                        "--progress": sleep.sleepScore,
                    }}
                ></div>

                <div className="sleep-inputs">

                    <div>

                        <label>🌙 Bed Time</label>

                        <input
                            type="time"
                            value={bedTime}
                            onChange={(e) =>
                                setBedTime(e.target.value)
                            }
                        />

                    </div>

                    <div>

                        <label>☀ Wake Time</label>

                        <input
                            type="time"
                            value={wakeTime}
                            onChange={(e) =>
                                setWakeTime(e.target.value)
                            }
                        />

                    </div>

                </div>

                <button
                    className="sleep-btn"
                    onClick={saveSleep}
                >
                    Save Sleep
                </button>

                <div className="sleep-result">

                    <h3>
                        ⭐ Sleep Quality
                    </h3>

                    <h2>
                        {sleep.quality}
                    </h2>

                    <p>

                        Total Sleep:

                        {" "}

                        {sleep.sleepHours}

                        {" "}Hours

                    </p>

                </div>

            </div>

        </main>

    );

};

export default SleepTracker;