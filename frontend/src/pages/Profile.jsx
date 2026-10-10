import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import '../styles/profile.css';

const emptyForm = {
  name: '',
  email: '',
  age: '',
  gender: '',
  height: '',
  weight: '',
  goal: '',
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      const user = response.data.user || response.data;
      setProfile(user);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        age: user?.age ?? '',
        gender: user?.gender || '',
        height: user?.height ?? '',
        weight: user?.weight ?? '',
        goal: user?.goal || '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembership = async () => {
    try {
      const response = await api.get('/membership');
      setMembership(response.data);
    } catch (error) {
      setMembership(null);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMembership();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth:update'));
    navigate('/login');
  };

  const getImageUrl = (image) => {
    if (!image) return '';
    if (/^https?:\/\//i.test(image)) return image;
    const baseUrl = (import.meta.env.VITE_API_URL || 'https://fitai-life-backend.onrender.com/api').replace(/\/api$/, '');
    return `${baseUrl}${image}`;
  };

  const initials = (profile?.name || 'U').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  const bmi = profile?.height && profile?.weight
    ? Number(profile.weight) / ((Number(profile.height) / 100) ** 2)
    : null;

  const bmiLabel = bmi
    ? bmi < 18.5
      ? 'Underweight'
      : bmi < 25
        ? 'Healthy range'
        : bmi < 30
          ? 'Overweight'
          : 'Obesity risk'
    : 'Add height and weight';

  const formatDate = (date) => {
    if (!date) return 'Not available';

    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const wellnessStats = [
    { label: 'Activity score', value: profile?.goal?.toLowerCase().includes('muscle') ? 82 : 76, color: 'green' },
    { label: 'Nutrition balance', value: profile?.goal?.toLowerCase().includes('weight') ? 79 : 84, color: 'emerald' },
    { label: 'Recovery focus', value: profile?.age && Number(profile.age) < 35 ? 88 : 80, color: 'teal' },
  ];

  const completedChallenges = (profile?.challengeHistory || []).filter((entry) => entry?.status === 'Completed');

  const handleOpenEdit = () => {
    setShowEditModal(true);
    setMessage('');
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setError('');
    setMessage('');

    const trimmedName = formData.name.trim();
    const trimmedGender = formData.gender.trim();
    const trimmedGoal = formData.goal.trim();
    const ageValue = Number(formData.age);
    const heightValue = Number(formData.height);
    const weightValue = Number(formData.weight);

    if (!trimmedName) {
      setError('Full name is required.');
      setSavingProfile(false);
      return;
    }

    if (!trimmedGender) {
      setError('Gender is required.');
      setSavingProfile(false);
      return;
    }

    if (!trimmedGoal) {
      setError('Fitness goal is required.');
      setSavingProfile(false);
      return;
    }

    if (!Number.isInteger(ageValue) || ageValue <= 0) {
      setError('Age must be a valid whole number.');
      setSavingProfile(false);
      return;
    }

    if (!Number.isFinite(heightValue) || heightValue <= 0) {
      setError('Height must be greater than zero.');
      setSavingProfile(false);
      return;
    }

    if (!Number.isFinite(weightValue) || weightValue <= 0) {
      setError('Weight must be greater than zero.');
      setSavingProfile(false);
      return;
    }

    try {
      const payload = {
        name: trimmedName,
        email: formData.email.trim(),
        age: ageValue,
        gender: trimmedGender,
        height: heightValue,
        weight: weightValue,
        goal: trimmedGoal,
      };

      const response = await api.put('/profile', payload);
      const updatedUser = response.data.user || response.data;
      setProfile(updatedUser);
      setFormData({
        name: updatedUser?.name || '',
        email: updatedUser?.email || '',
        age: updatedUser?.age ?? '',
        gender: updatedUser?.gender || '',
        height: updatedUser?.height ?? '',
        weight: updatedUser?.weight ?? '',
        goal: updatedUser?.goal || '',
      });
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      setShowEditModal(false);
      setMessage('Profile updated successfully.');
      window.dispatchEvent(new Event('auth:update'));
      await fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setChangingPassword(true);
    setMessage('');

    try {
      await api.put('/profile/change-password', passwordData);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
      setMessage('Password updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update password.');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <section className="profile-card profile-card--loading">
          <p>Loading your profile...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="profile-page">
        <section className="profile-card profile-card--error">
          <h2>Profile unavailable</h2>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      {message && <div className="profile-page__message">{message}</div>}

      <section className="profile-card">
        <div className="profile-card__hero">
          <div className="profile-card__avatar-wrap">
            <div className="profile-card__avatar">
              {profile?.profileImage ? (
                <img src={getImageUrl(profile.profileImage)} alt={profile.name || 'Profile'} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
          </div>

          <div className="profile-card__hero-content">
            <div className="profile-card__intro">
              <p className="profile-card__eyebrow">Healthcare dashboard</p>
              <h1>{profile?.name || 'Your Profile'}</h1>
              <p className="profile-card__subtitle">
                {profile?.goal ? `${profile.goal} plan` : 'Balanced wellness focus'}
              </p>
            </div>

            <div className="profile-card__hero-actions">
              <button type="button" className="profile-card__button profile-card__button--primary" onClick={handleOpenEdit}>
                Edit Profile
              </button>
              <button type="button" className="profile-card__button profile-card__button--secondary" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </button>
              <button type="button" className="profile-card__button profile-card__button--danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="profile-card__summary-grid">
          <article className="profile-card__summary-card profile-card__summary-card--bmi">
            <span className="profile-card__label">BMI</span>
            <h3>{bmi ? bmi.toFixed(1) : '—'}</h3>
            <p>{bmiLabel}</p>
          </article>
          <article className="profile-card__summary-card">
            <span className="profile-card__label">Goal focus</span>
            <h3>{profile?.goal || 'Wellness'}</h3>
            <p>Personalized guidance is ready for your next milestone.</p>
          </article>
          <article className="profile-card__summary-card">
            <span className="profile-card__label">Member since</span>
            <h3>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'New member'}</h3>
            <p>Stay consistent with your daily health habits.</p>
          </article>
        </div>

        <div className="profile-card__content-grid">
          <div className="profile-card__panel">
            <div className="profile-card__panel-header">
              <h2>Profile details</h2>
              <span>Your core health information</span>
            </div>
            <div className="profile-card__details-grid">
              <div className="profile-card__info">
                <span className="profile-card__label">Email</span>
                <span>{profile?.email || 'Not provided'}</span>
              </div>
              <div className="profile-card__info">
                <span className="profile-card__label">Age</span>
                <span>{profile?.age ? `${profile.age} yrs` : 'Not provided'}</span>
              </div>
              <div className="profile-card__info">
                <span className="profile-card__label">Gender</span>
                <span>{profile?.gender || 'Not provided'}</span>
              </div>
              <div className="profile-card__info">
                <span className="profile-card__label">Height</span>
                <span>{profile?.height ? `${profile.height} cm` : 'Not provided'}</span>
              </div>
              <div className="profile-card__info">
                <span className="profile-card__label">Weight</span>
                <span>{profile?.weight ? `${profile.weight} kg` : 'Not provided'}</span>
              </div>
              <div className="profile-card__info">
                <span className="profile-card__label">Goal</span>
                <span>{profile?.goal || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="profile-card__panel">
            <div className="profile-card__panel-header">
              <h2>Health overview</h2>
              <span>Progress signals for your next check-in</span>
            </div>
            <div className="profile-card__stats-list">
              {wellnessStats.map((stat) => (
                <div key={stat.label} className="profile-card__stat-row">
                  <div className="profile-card__stat-labels">
                    <span>{stat.label}</span>
                    <strong>{stat.value}%</strong>
                  </div>
                  <div className="profile-card__bar">
                    <div className={`profile-card__bar-fill profile-card__bar-fill--${stat.color}`} style={{ width: `${stat.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="profile-card__membership-section">
          <div className="profile-card__panel-header">
            <h2>Membership Information</h2>
            <span>Your current membership and challenge details</span>
          </div>

          <div className="profile-card__membership-badge-row">
            <span className={`profile-card__badge ${membership?.membershipType === 'Premium Trial' ? 'profile-card__badge--premium' : 'profile-card__badge--free'}`}>
              {membership?.membershipType === 'Premium Trial' ? '⭐ Premium' : 'Free'}
            </span>
            <button type="button" className="profile-card__button profile-card__button--primary" onClick={() => navigate('/membership')}>
              Upgrade Membership
            </button>
          </div>

          <div className="profile-card__membership-grid">
            <div className="profile-card__membership-item">
              <span className="profile-card__label">Membership Type</span>
              <strong>{membership?.membershipType || 'Free'}</strong>
            </div>
            <div className="profile-card__membership-item">
              <span className="profile-card__label">Challenge Plan</span>
              <strong>{membership?.challengePlan || 'Not selected'}</strong>
            </div>
            <div className="profile-card__membership-item">
              <span className="profile-card__label">Challenge Status</span>
              <strong>{membership?.challengeStatus || 'Not started'}</strong>
            </div>
            <div className="profile-card__membership-item">
              <span className="profile-card__label">Membership Status</span>
              <strong>{membership?.membershipStatus || 'Active'}</strong>
            </div>
            <div className="profile-card__membership-item">
              <span className="profile-card__label">Target Days</span>
              <strong>{membership?.targetDays || 0}</strong>
            </div>
            {membership?.trialActive && (
              <>
                <div className="profile-card__membership-item">
                  <span className="profile-card__label">Trial Start Date</span>
                  <strong>{formatDate(membership?.trialStartDate)}</strong>
                </div>
                <div className="profile-card__membership-item">
                  <span className="profile-card__label">Trial End Date</span>
                  <strong>{formatDate(membership?.trialEndDate)}</strong>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="profile-card__challenge-history-section">
          <div className="profile-card__panel-header">
            <h2>Challenge History</h2>
            <span>Your completed challenge milestones</span>
          </div>

          {completedChallenges.length === 0 ? (
            <div className="profile-card__history-empty">No completed challenges yet.</div>
          ) : (
            <div className="profile-card__badge-grid">
              {completedChallenges.map((item, index) => (
                <article key={`${item.challengeName}-${item.completedAt || index}`} className="profile-card__history-card">
                  <div className="profile-card__history-title-row">
                    <h3>🏆 {item.challengeName}</h3>
                    <span className="profile-card__history-status">Completed</span>
                  </div>
                  <p>{item.completedDays || 0} / {item.targetDays || 0} Days</p>
                  <p>Finished on: {formatDate(item.completedAt)}</p>
                  <p>Membership: {item.membershipType || 'Free'}</p>
                </article>
              ))}
            </div>
          )}
        </section>
        {/* =======================================
    Achievement Badges
======================================= */}

        <section className="profile-card__challenge-history-section">

          <div className="profile-card__panel-header">
            <h2>🏆 Achievement Badges</h2>
            <span>Your fitness achievements</span>
          </div>

          {profile?.badges && profile.badges.length > 0 ? (

            <div className="profile-card__history-grid">

              {profile.badges.map((badge, index) => (

                <div
                  key={index}
                  className="profile-card__badge-card"
                >
                  <h3>{badge}</h3>
                </div>

              ))}

            </div>

          ) : (

            <p className="profile-card__history-empty">
              Complete challenges to unlock badges.
            </p>

          )}

        </section>

        {/* =======================================
    Lifetime Statistics
======================================= */}

        <section className="profile-card__challenge-history-section">

          <div className="profile-card__panel-header">
            <h2>📊 Lifetime Statistics</h2>
            <span>Your overall fitness journey</span>
          </div>

          <div className="profile-card__membership-grid">

            <div className="profile-card__membership-item">
              <strong>🏆 Challenges Completed</strong>
              <span>{profile?.totalChallengesCompleted || 0}</span>
            </div>

            <div className="profile-card__membership-item">
              <strong>🏋 Workout Days</strong>
              <span>{profile?.totalWorkoutDays || 0}</span>
            </div>

            <div className="profile-card__membership-item">
              <strong>🥗 Meal Days</strong>
              <span>{profile?.totalMealDays || 0}</span>
            </div>

            <div className="profile-card__membership-item">
              <strong>🔥 Current Streak</strong>
              <span>{profile?.dailyStreak || 0} Days</span>
            </div>

          </div>

        </section>

      </section>

      {showEditModal && (
        <div className="profile-modal" role="dialog" aria-modal="true">
          <div className="profile-modal__content">
            <div className="profile-modal__header">
              <h3>Edit profile</h3>
              <button type="button" className="profile-modal__close" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>

            <form className="profile-modal__form" onSubmit={handleSaveProfile}>
              <label>
                <span>Full Name</span>
                <input required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
              </label>
              <label>
                <span>Email</span>
                <input type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} />
              </label>
              <label>
                <span>Age</span>
                <input type="number" min="1" step="1" required value={formData.age} onChange={(event) => setFormData({ ...formData, age: event.target.value })} />
              </label>
              <label>
                <span>Gender</span>
                <input required value={formData.gender} onChange={(event) => setFormData({ ...formData, gender: event.target.value })} />
              </label>
              <label>
                <span>Height (cm)</span>
                <input type="number" min="1" step="any" required value={formData.height} onChange={(event) => setFormData({ ...formData, height: event.target.value })} />
              </label>
              <label>
                <span>Weight (kg)</span>
                <input type="number" min="1" step="any" required value={formData.weight} onChange={(event) => setFormData({ ...formData, weight: event.target.value })} />
              </label>
              <label>
                <span>Fitness Goal</span>
                <input required value={formData.goal} onChange={(event) => setFormData({ ...formData, goal: event.target.value })} />
              </label>

              <div className="profile-modal__actions">
                <button type="button" className="profile-card__button profile-card__button--secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="profile-card__button profile-card__button--primary" disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="profile-modal" role="dialog" aria-modal="true">
          <div className="profile-modal__content">
            <div className="profile-modal__header">
              <h3>Change password</h3>
              <button type="button" className="profile-modal__close" onClick={() => setShowPasswordModal(false)}>
                ×
              </button>
            </div>

            <form className="profile-modal__form" onSubmit={handlePasswordChange}>
              <label>
                <span>Current password</span>
                <input type="password" value={passwordData.currentPassword} onChange={(event) => setPasswordData({ ...passwordData, currentPassword: event.target.value })} />
              </label>
              <label>
                <span>New password</span>
                <input type="password" value={passwordData.newPassword} onChange={(event) => setPasswordData({ ...passwordData, newPassword: event.target.value })} />
              </label>

              <div className="profile-modal__actions">
                <button type="button" className="profile-card__button profile-card__button--secondary" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="profile-card__button profile-card__button--primary" disabled={changingPassword}>
                  {changingPassword ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
