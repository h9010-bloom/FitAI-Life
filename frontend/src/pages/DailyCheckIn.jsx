import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/dailycheckin.css';

const DailyCheckIn = () => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const fetchToday = async () => {
    if (!token) {
      setLoading(false);
      setError('Please log in to view your daily check-in.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('https://fitai-life-backend.onrender.com/api/checkin/today', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data || null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your check-in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, [token]);

  const handleAction = async (endpoint) => {
    if (!token || busy) return;

    try {
      setBusy(true);
      const method = endpoint === 'present' ? 'post' : 'put';
      await axios({
        method,
        url: `https://fitai-life-backend.onrender.com/api/checkin/${endpoint}`,
        data: {},
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchToday();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update today\'s check-in.');
    } finally {
      setBusy(false);
    }
  };

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const record = data?.record || null;

  return (
    <main className="checkin-page">
      <section className="checkin-shell">
        <div className="checkin-header">
          <div>
            <p className="checkin-eyebrow">Daily wellness</p>
            <h1>Daily Check-In</h1>
            <p className="checkin-subtitle">Track your attendance, workout, meal, and water goals in one simple routine.</p>
          </div>
        </div>

        {loading ? (
          <div className="checkin-card checkin-card--state">Loading your check-in...</div>
        ) : error ? (
          <div className="checkin-card checkin-card--state checkin-card--error">{error}</div>
        ) : (
          <>
            <div className="checkin-card checkin-card--hero">
              <div>
                <p className="checkin-date">{todayLabel}</p>
                <h2>Today's progress</h2>
              </div>
              <div className="checkin-streak">
                <span>🔥 Current Streak</span>
                <strong>{data?.streak || 1} days</strong>
              </div>
            </div>

            <div className="checkin-grid">
              <article className="checkin-card">
                <div className="checkin-card__top">
                  <h3>Attendance</h3>
                  <button className="checkin-btn" onClick={() => handleAction('present')} disabled={record?.attendance || busy}>
                    {record?.attendance ? '✓' : 'Mark Present'}
                  </button>
                </div>
                <p>Mark yourself present for today.</p>
              </article>

              <article className="checkin-card">
                <div className="checkin-card__top">
                  <h3>Workout</h3>
                  <button className="checkin-btn" onClick={() => handleAction('workout')} disabled={record?.workoutCompleted || busy}>
                    {record?.workoutCompleted ? '✓' : 'Complete Workout'}
                  </button>
                </div>
                <p>Log your workout for today.</p>
              </article>

              <article className="checkin-card">
                <div className="checkin-card__top">
                  <h3>Meal</h3>
                  <button className="checkin-btn" onClick={() => handleAction('meal')} disabled={record?.mealCompleted || busy}>
                    {record?.mealCompleted ? '✓' : 'Complete Meal'}
                  </button>
                </div>
                <p>Record your meal completion.</p>
              </article>

              <article className="checkin-card">
                <div className="checkin-card__top">
                  <h3>Water</h3>
                  <button className="checkin-btn" onClick={() => handleAction('water')} disabled={record?.waterCompleted || busy}>
                    {record?.waterCompleted ? '✓' : 'Complete Water Goal'}
                  </button>
                </div>
                <p>Confirm your daily water goal.</p>
              </article>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default DailyCheckIn;
