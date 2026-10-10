import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";
import "../styles/register-food-preference.css";

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: '',
  gender: 'Male',
  height: '',
  weight: '',
  goal: 'Maintain Fitness',
  foodPreference: '',
};

const Register = () => {
  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Please enter a valid email address.";

    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";

    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match.";

    if (!formData.age || Number(formData.age) <= 0)
      return "Please enter a valid age.";

    if (!formData.height || Number(formData.height) <= 0)
      return "Please enter a valid height.";

    if (!formData.weight || Number(formData.weight) <= 0) {
      return 'Please enter a valid weight.';
    }

    if (!formData.foodPreference) {
      return 'Please select Vegetarian or Non-Vegetarian.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        'https://fitai-life-backend.onrender.com/api/auth/register',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: Number(formData.age),
          gender: formData.gender,
          height: Number(formData.height),
          weight: Number(formData.weight),
          goal: formData.goal,

          // Vegetarian = true
          // Non-Vegetarian = false
          vegetarian: formData.foodPreference === 'vegetarian',
        }
      );

      setSuccessMessage(
        'Registration successful! Redirecting to login...'
      );

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);

      setErrorMessage(
        error.response?.data?.message ||
        'Registration failed. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-card__brand">
          <div className="register-card__logo">✚</div>
          <div>
            <h1>FitAI-Life</h1>
            <p>Your AI-powered path to healthier living.</p>
          </div>
        </div>

        <div className="register-card__content">
          <h2>Create Your Account</h2>
          <p className="register-card__subtitle">
            Join FitAI-Life and start your personalized wellness plan.
          </p>

          {errorMessage && <div className="register-card__error">{errorMessage}</div>}
          {successMessage && <div className="register-card__success">{successMessage}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-form__grid">
              <label className="register-form__field">
                <span>Full Name</span>
                <input type="text" name="name" value={formData.name}
                  onChange={handleChange} placeholder="John Doe" required />
              </label>

              <label className="register-form__field">
                <span>Email</span>
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="you@example.com" required />
              </label>

              <label className="register-form__field">
                <span>Password</span>
                <div className="register-form__password">
                  <input type={showPassword ? "text" : "password"} name="password"
                    value={formData.password} onChange={handleChange}
                    placeholder="Create a password" required />
                  <button type="button" className="register-form__toggle"
                    onClick={() => setShowPassword((p) => !p)}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <label className="register-form__field">
                <span>Confirm Password</span>
                <div className="register-form__password">
                  <input type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword" value={formData.confirmPassword}
                    onChange={handleChange} placeholder="Confirm password" required />
                  <button type="button" className="register-form__toggle"
                    onClick={() => setShowConfirmPassword((p) => !p)}>
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <label className="register-form__field">
                <span>Age</span>
                <input type="number" name="age" value={formData.age}
                  onChange={handleChange} min="1" required />
              </label>

              <label className="register-form__field">
                <span>Gender</span>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="register-form__field">
                <span>Height (cm)</span>
                <input type="number" name="height" value={formData.height}
                  onChange={handleChange} min="1" step="any" placeholder="e.g. 148.5" required />
              </label>

              <label className="register-form__field">
                <span>Weight (kg)</span>
                <input type="number" name="weight" value={formData.weight}
                  onChange={handleChange} min="1" step="any" placeholder="e.g. 52.5" required />
              </label>
            </div>

            <label className="register-form__field register-form__field--full">
              <span>Fitness Goal</span>
              <select name="goal" value={formData.goal} onChange={handleChange}>
                <option value="Lose Weight">Lose Weight</option>
                <option value="Gain Weight">Gain Weight</option>
                <option value="Maintain Fitness">Maintain Fitness</option>
              </select>
            </label>

            <div className="register-form__food-preference">
              <div className="food-preference__header">
                <span className="food-preference__title">
                  Food Preference
                </span>

                <span className="food-preference__subtitle">
                  Choose your preferred diet type
                </span>
              </div>

              <div className="food-preference__options">

                {/* VEGETARIAN */}
                <label
                  className={`food-preference__option ${formData.foodPreference === 'vegetarian'
                    ? 'food-preference__option--selected'
                    : ''
                    }`}
                >
                  <input
                    type="radio"
                    name="foodPreference"
                    value="vegetarian"
                    checked={formData.foodPreference === 'vegetarian'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        foodPreference: e.target.value,
                      }))
                    }
                  />

                  <span className="food-preference__radio"></span>

                  <span className="food-preference__emoji">
                    🥗
                  </span>

                  <span className="food-preference__text">
                    <strong>Vegetarian</strong>
                    <small>Plant-based meals</small>
                  </span>
                </label>


                {/* NON-VEGETARIAN */}
                <label
                  className={`food-preference__option ${formData.foodPreference === 'non-vegetarian'
                    ? 'food-preference__option--selected'
                    : ''
                    }`}
                >
                  <input
                    type="radio"
                    name="foodPreference"
                    value="non-vegetarian"
                    checked={formData.foodPreference === 'non-vegetarian'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        foodPreference: e.target.value,
                      }))
                    }
                  />

                  <span className="food-preference__radio"></span>

                  <span className="food-preference__emoji">
                    🍗
                  </span>

                  <span className="food-preference__text">
                    <strong>Non-Vegetarian</strong>
                    <small>Includes meat &amp; eggs</small>
                  </span>
                </label>

              </div>
            </div>

            <button type="submit" className="register-form__submit" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="register-card__footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;