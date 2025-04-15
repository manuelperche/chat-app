import { useEffect } from "react";
import { BrowserRouter, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import { Routes, Route } from "react-router";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Navbar from "./components/Navbar";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { useThemeStore } from "./store/useThemeStore";
const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <BrowserRouter>
      <div data-theme={theme}>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>

        <Toaster />
      </div>
    </BrowserRouter>
  );
};
export default App;
