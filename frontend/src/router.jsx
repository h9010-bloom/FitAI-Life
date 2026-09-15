import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Exercise from './pages/Exercise.jsx';
import Diet from './pages/Diet.jsx';
import Progress from './pages/Progress.jsx';
import Chat from './pages/AIChat.jsx';
import MealPlanner from './pages/MealPlanner.jsx';
import WorkoutPlanner from './pages/WorkoutPlanner.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import DailyCheckIn from './pages/DailyCheckIn.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Membership from './pages/Membership.jsx';
import Challenge from './pages/Challenge.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute/AdminRoute.jsx';
import WaterTracker from "./pages/WaterTracker";
import SleepTracker from "./pages/SleepTracker";

const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/exercise" element={<ProtectedRoute><Exercise /></ProtectedRoute>} />
    <Route path="/diet" element={<ProtectedRoute><Diet /></ProtectedRoute>} />
    <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
    <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
    <Route path="/meal-planner" element={<ProtectedRoute><MealPlanner /></ProtectedRoute>} />
    <Route path="/workout-planner" element={<ProtectedRoute><WorkoutPlanner /></ProtectedRoute>} />
    <Route path="/daily-checkin" element={<ProtectedRoute><DailyCheckIn /></ProtectedRoute>} />
    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/membership" element={<ProtectedRoute><Membership /></ProtectedRoute>} />
    <Route path="/challenge" element={<ProtectedRoute><Challenge /></ProtectedRoute>} />
    <Route path="/water" element={<ProtectedRoute><WaterTracker /></ProtectedRoute>} />
    <Route path="/sleep" element={<ProtectedRoute><SleepTracker /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default Router;