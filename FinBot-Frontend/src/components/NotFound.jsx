import React from "react";
import { Link } from "react-router-dom";
import Aurora from "./ReactBits/Aurora";

const NotFound = () => {
  return (
    <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} speed={0.5}>
      {/* Grid */}
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
        <div className="text-center">
          <h1 className="text-8xl font-extrabold bg-gradient-to-r from-blue-300 to-purple-500 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-white mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-blue-500/25"
            >
              Go Home
            </Link>
            <Link
              to="/dashboard"
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </Aurora>
  );
};

export default NotFound;
