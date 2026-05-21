import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/*protected dashboard*/}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
