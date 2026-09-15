import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Router from "./router.jsx";

function AppLayout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const publicPages = ["/", "/about", "/contact", "/login", "/register"];

  const isPublicPage = publicPages.includes(location.pathname);

  return (
    <>
      {location.pathname !== "/admin" && <Navbar />}

      <Router />

      {!user && isPublicPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}