import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import Aurora from "../components/ReactBits/Aurora";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify & Reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]); // 4 digit OTP
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Refs for OTP inputs to handle auto-focus
  const inputRefs = useRef([]);

  // Handle OTP Typing
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // only numbers allow

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // if user input a digit then focus on next box
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // STEP 1: input email -> send OTP to Telegram bot
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        email,
      },{ withCredentials: true });
      toast.success("OTP sent to your Telegram Bot! ");
      setStep(2); //next step
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Check email."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: OTP & Password Verification
  const handleReset = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join(""); // Array to String "1234"

    if (finalOtp.length !== 4 || !newPassword) {
      return toast.error("Enter valid 4-digit OTP & Password");
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        email,
        otp: finalOtp,
        newPassword,
      });
      toast.success("Password Changed Successfully!");
      navigate("/login"); // jump to login page
    } catch (error) {
      toast.error(error.response?.data?.message || "Wrong OTP or Expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} speed={0.5}>
      {/* Bg Grid  */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            "linear-gradient(transparent 0, rgba(255,255,255,0.035) 1.5px), linear-gradient(90deg, transparent 0, rgba(255,255,255,0.035) 1px)",
          backgroundSize: "48px 48px",
          mixBlendMode: "overlay",
          opacity: 0.9,
        }}
        aria-hidden="true"
      />

      <div className="min-h-screen flex items-center justify-center px-4 relative z-20">
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {step === 1 ? "Forgot Password?" : "Reset Password"}
            </h1>
            <p className="text-slate-400 text-[18px]">
              {step === 1
                ? "Enter email to receive code on Telegram"
                : "Enter the 4-digit code sent to your bot"}
            </p>
          </div>

          {step === 1 ? (
            /*EMAIL */
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition placeholder:text-slate-600"
                    placeholder="Enter registered email"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <>
                    Send Code To Bot <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              {/* OTP INPUTS */}
              <div className="space-y-3">
                <label className="block text-slate-300 text-xl font-medium text-center ">
                  Enter 4-Digit Code
                </label>
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-14 h-14 bg-slate-800/50 border border-slate-700 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-10 py-3 text-white focus:outline-none focus:border-purple-500 transition placeholder:text-slate-600"
                    placeholder="Set new password"
                  />
                  {/* Toggle EYE Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg transform transition active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <>
                    Change Password <CheckCircle2 size={20} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* BACK TO LOGIN BUTTON */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </Aurora>
  );
};

export default ForgotPassword;
