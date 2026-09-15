import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData
      );

      const { token, user } = response.data;

      // Temporary debugging
      console.log('Login Response:', response.data);
      console.log('Logged In User:', user);

      login(user, token);

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        'Unable to log in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-card__brand">
          <div className="login-card__logo">✚</div>

          <div>
            <h1>FitAI-Life</h1>
            <p>Smart health, fitness, and nutrition support</p>
          </div>
        </div>

        <div className="login-card__content">
          <h2>Welcome Back</h2>

          <p className="login-card__subtitle">
            Sign in to continue your wellness journey.
          </p>

          {errorMessage && (
            <div className="login-card__error">{errorMessage}</div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-form__field">
              <span>Email</span>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="login-form__field">
              <span>Password</span>

              <div className="login-form__password">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="login-form__toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <div className="login-form__options">
              <label className="login-form__checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                />
                <span>Remember Me</span>
              </label>

              <a href="/forgot-password" className="login-form__link">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="login-form__submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="login-card__footer">
            Don&apos;t have an account?{' '}
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;