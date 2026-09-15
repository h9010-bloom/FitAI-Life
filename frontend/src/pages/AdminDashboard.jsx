import { useEffect, useState } from "react";
import DietManager from "../components/Admin/DietManager";
import ExerciseManager from "../components/Admin/ExerciseManager";
import CheckInManager from "../components/Admin/CheckInManager";
import ChatHistoryManager from "../components/Admin/ChatHistoryManager";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/adminDashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState("dashboard");
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [dietCount, setDietCount] = useState(0);
    const [exerciseCount, setExerciseCount] = useState(0);
    const [checkInCount, setCheckInCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [membershipFilter, setMembershipFilter] = useState("All");

    const handleLogout = () => {
        localStorage.removeItem("adminAccess");
        navigate("/");
    };

    const getDisplayMembershipType = (user) => {
        const trialEndDate = user?.trialEndDate ? new Date(user.trialEndDate) : null;
        const today = new Date();

        if (
            user?.membershipType === "Premium Trial" &&
            user?.trialActive &&
            trialEndDate &&
            trialEndDate < today
        ) {
            return "Expired";
        }

        return user?.membershipType || "Free";
    };

    const getChallengeStatus = (user) => user?.challengeStatus || "Not Started";

    const getBadgeClass = (membershipType) => {
        if (membershipType === "Free") return "membership-badge membership-badge--free";
        if (membershipType === "Premium Trial") return "membership-badge membership-badge--trial";
        if (membershipType === "Premium") return "membership-badge membership-badge--premium";
        if (membershipType === "Expired") return "membership-badge membership-badge--expired";
        return "membership-badge";
    };

    const getChallengeClass = (status) => {
        if (status === "In Progress") return "challenge-badge challenge-badge--in-progress";
        if (status === "Completed") return "challenge-badge challenge-badge--completed";
        return "challenge-badge challenge-badge--not-started";
    };

    const formatDate = (value) => {
        if (!value) return "N/A";
        return new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            const response = await axios.get("http://localhost:5000/api/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchDietCount = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/diets");
            setDietCount(response.data.length);
        } catch (error) {
            console.error("Error fetching diets:", error);
        }
    };

    const fetchExerciseCount = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/exercises");
            setExerciseCount(response.data.length);
        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    };

    const fetchCheckInCount = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/checkins");
            setCheckInCount(response.data.length);
        } catch (error) {
            console.error("Error fetching check-ins:", error);
        }
    };

    const deleteUser = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");

        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);

            fetchUsers();
            fetchDietCount();
            fetchExerciseCount();
            fetchCheckInCount();
        } catch (error) {
            console.error(error);
            alert("Unable to delete user.");
        }
    };

    const membershipStats = {
        totalUsers: users.length,
        freeUsers: users.filter((user) => getDisplayMembershipType(user) === "Free").length,
        premiumTrialUsers: users.filter((user) => getDisplayMembershipType(user) === "Premium Trial").length,
        premiumUsers: users.filter((user) => getDisplayMembershipType(user) === "Premium").length,
        expiredMemberships: users.filter((user) => getDisplayMembershipType(user) === "Expired").length,
        activeChallenges: users.filter((user) => user.challengeStatus === "In Progress").length
    };

    const filteredUsers = users.filter((user) => {
        const displayMembership = getDisplayMembershipType(user);
        const query = searchTerm.trim().toLowerCase();
        const matchesSearch = !query ||
            (user.name || "").toLowerCase().includes(query) ||
            (user.email || "").toLowerCase().includes(query);
        const matchesFilter = membershipFilter === "All" || displayMembership === membershipFilter;

        return matchesSearch && matchesFilter;
    });

    useEffect(() => {
        fetchUsers();
        fetchDietCount();
        fetchExerciseCount();
        fetchCheckInCount();
    }, []);

    return (
        <div className="admin-dashboard">

            <div className="admin-sidebar">
                <div className="admin-logo">
                    <h2>FitAI-Life</h2>
                    <p>Admin Panel</p>
                </div>

                <button
                    className={activeSection === "dashboard" ? "active" : ""}
                    onClick={() => setActiveSection("dashboard")}
                >
                    📊 Dashboard
                </button>

                <button
                    className={activeSection === "users" ? "active" : ""}
                    onClick={() => setActiveSection("users")}
                >
                    👥 Users
                </button>

                <button
                    className={activeSection === "diet" ? "active" : ""}
                    onClick={() => setActiveSection("diet")}
                >
                    🥗 Diet Plans
                </button>

                <button
                    className={activeSection === "exercise" ? "active" : ""}
                    onClick={() => setActiveSection("exercise")}
                >
                    🏋 Exercise Plans
                </button>

                <button
                    className={activeSection === "checkins" ? "active" : ""}
                    onClick={() => setActiveSection("checkins")}
                >
                    📈 Daily Check-ins
                </button>

                <button
                    className={activeSection === "chat" ? "active" : ""}
                    onClick={() => setActiveSection("chat")}
                >
                    💬 AI Chat History
                </button>

                <button className="logout-btn" onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>

            <div className="admin-main">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome to the FitAI-Life Admin Panel.</p>
                </div>

                {activeSection === "dashboard" && (
                    <>
                        <div className="dashboard-cards">
                            <div className="dashboard-card">
                                <h3>Total Users</h3>
                                <h2>{membershipStats.totalUsers}</h2>
                            </div>

                            <div className="dashboard-card">
                                <h3>Free Users</h3>
                                <h2>{membershipStats.freeUsers}</h2>
                            </div>

                            <div className="dashboard-card">
                                <h3>Premium Trial Users</h3>
                                <h2>{membershipStats.premiumTrialUsers}</h2>
                            </div>

                            <div className="dashboard-card">
                                <h3>Premium Users</h3>
                                <h2>{membershipStats.premiumUsers}</h2>
                            </div>

                            <div className="dashboard-card">
                                <h3>Expired Memberships</h3>
                                <h2>{membershipStats.expiredMemberships}</h2>
                            </div>
                        </div>

                        <div className="dashboard-cards secondary-dashboard-cards">
                            <div className="dashboard-card">
                                <h3>Diet Plans</h3>
                                <h2>{dietCount}</h2>
                            </div>

                            <div className="dashboard-card">
                                <h3>Exercise Plans</h3>
                                <h2>{exerciseCount}</h2>
                            </div>

                            <div className="dashboard-card">
                                <h3>Daily Check-ins</h3>
                                <h2>{checkInCount}</h2>
                            </div>

                            <div className="dashboard-card">
                                <h3>🏁 Active Challenges</h3>
                                <h2>{membershipStats.activeChallenges}</h2>
                            </div>
                        </div>

                        <div className="content-card">
                            <h2>Dashboard Overview</h2>
                            <p>
                                Welcome to the FitAI-Life Administration Panel.

                                Here you can:

                                • Monitor all registered users
                                • View Free and Premium memberships
                                • Track active fitness challenges
                                • Manage diet and exercise plans
                                • Monitor daily check-ins
                                • View AI chat history
                            </p>
                        </div>
                    </>
                )}

                {activeSection === "users" && (
                    <div className="content-card">
                        <h2>👥 Membership Management</h2>

                        <div className="admin-management-toolbar">
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                className="admin-search-input"
                            />

                            <select
                                value={membershipFilter}
                                onChange={(event) => setMembershipFilter(event.target.value)}
                                className="admin-filter-select"
                            >
                                <option value="All">All</option>
                                <option value="Free">Free</option>
                                <option value="Premium Trial">Premium Trial</option>
                                <option value="Premium">Premium</option>
                                <option value="Expired">Expired</option>
                            </select>
                        </div>

                        {loadingUsers ? (
                            <p>Loading users...</p>
                        ) : filteredUsers.length === 0 ? (
                            <p>No matching members found.</p>
                        ) : (
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Membership</th>
                                            <th>Challenge</th>
                                            <th>Challenge Status</th>
                                            <th>Membership Status</th>
                                            <th>Target Days</th>
                                            <th>Trial End Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredUsers.map((user) => {
                                            const displayMembership = getDisplayMembershipType(user);
                                            const challengeStatus = getChallengeStatus(user);

                                            return (
                                                <tr key={user._id}>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <span className={getBadgeClass(displayMembership)}>
                                                            {displayMembership}
                                                        </span>
                                                    </td>
                                                    <td>{user.challengePlan || "-"}</td>
                                                    <td>
                                                        <span className={getChallengeClass(challengeStatus)}>
                                                            {challengeStatus}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={
                                                                user.membershipStatus === "Trial"
                                                                    ? "status-badge status-trial"
                                                                    : user.membershipStatus === "Expired"
                                                                        ? "status-badge status-expired"
                                                                        : "status-badge status-active"
                                                            }
                                                        >
                                                            {user.membershipStatus || "Active"}
                                                        </span>
                                                    </td>
                                                    <td>{user.targetDays || 0}</td>
                                                    <td>{formatDate(user.trialEndDate)}</td>
                                                    <td>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => deleteUser(user._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === "diet" && <DietManager />}
                {activeSection === "exercise" && <ExerciseManager />}
                {activeSection === "checkins" && <CheckInManager />}
                {activeSection === "chat" && <ChatHistoryManager />}
            </div>
        </div>
    );
};

export default AdminDashboard;