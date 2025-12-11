import React from "react";
import { Link } from "react-router-dom";
import Aurora from "../components/ReactBits/Aurora";

const Home = () => {
  return (
    <Aurora
      colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
      amplitude={1.4}
      blend={1}
      speed={1}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            "linear-gradient(transparent 0, rgba(255,255,255,0.035) 1.5px), linear-gradient(90deg, transparent 0, rgba(255,255,255,0.035) 1px)",
          backgroundSize: "48px 48px",
          mixBlendMode: "overlay",
          transform: "translateZ(0)",
          opacity: 0.9,
        }}
        aria-hidden="true"
      />

      {/* Main content wrapper */}
      <div className="relative z-20 min-h-screen flex flex-col text-white">
        {/* Navbar */}
        <nav className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-100 to-purple-600 bg-clip-text text-transparent">
                {" "}
                FinBot{" "}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white font-medium transition text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
              >
                Sign Up
              </Link>

              {/* mobile sign-up visible as icon/button */}
              <Link
                to="/signup"
                className="sm:hidden inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 rounded-lg font-medium transition"
                aria-label="Sign up"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 2v20M2 12h20"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </nav>

        {/* HERO section */}
        <main className="flex-grow">
          <section className="min-h-[70vh] sm:min-h-[75vh] flex items-center">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center py-10">
              <div className="inline-block bg-slate-800/60 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium border border-slate-700 animate-pulse">
                AI-Powered Expense Tracking
              </div>

              <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Track &amp; Manage Money
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  Fast, Simple, Smart
                </span>
              </h1>

              <p className="mt-6 text-slate-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Stop typing manually. Just send a message or a photo of your
                bill to our Telegram Bot, and let AI handle the rest. Track,
                Analyze, and Save.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-xl text-lg sm:text-base font-bold shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5"
                >
                  Get Started For Free
                </Link>

                <a
                  href="#how-it-works"
                  className="bg-slate-800/70 hover:bg-slate-700 text-white px-8 py-3 rounded-xl text-lg sm:text-base font-bold border border-slate-700"
                >
                  See How It Works
                </a>
              </div>

              {/* small stats sample*/}
              <div className="mt-10 flex flex-wrap gap-6 justify-center items-center text-slate-300 pb-12">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    100k+
                  </div>
                  <div className="text-xs sm:text-sm">
                    Transactions processed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    99.5%
                  </div>
                  <div className="text-xs sm:text-sm">
                    Receipt parsing accuracy
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    Telegram + Web
                  </div>
                  <div className="text-xs sm:text-sm">Use it anywhere</div>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS section*/}
          <section id="how-it-works" className="py-8 sm:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-2xl font-semibold mb-6 text-center">
                How FinBot works — quick overview
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                  <h4 className="font-semibold">1. Sign up & Link</h4>
                  <p className="text-slate-400 mt-2 text-sm">
                    Sign up on the web, get a unique linking code, send it to
                    our Telegram bot and your account gets linked instantly.
                  </p>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                  <h4 className="font-semibold">
                    2. Add expenses (Telegram / Web)
                  </h4>
                  <p className="text-slate-400 mt-2 text-sm">
                    Send messages like{" "}
                    <span className="italic">"100 momos"</span> or upload a bill
                    image. Bot saves transactions to your account.
                  </p>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                  <h4 className="font-semibold">3. Smart AI parsing</h4>
                  <p className="text-slate-400 mt-2 text-sm">
                    Integrated Gemini OCR understands multiple languages
                    (including Hindi), extracts amounts, vendor and date,
                    categorizes automatically.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                  <h4 className="font-semibold">4. Edit & Undo</h4>
                  <p className="text-slate-400 mt-2 text-sm">
                    Mistakes? Delete or edit any transaction via bot commands or
                    from the web UI.
                  </p>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                  <h4 className="font-semibold">5. Monthly PDF Statements</h4>
                  <p className="text-slate-400 mt-2 text-sm">
                    Download bank-style monthly statements (PDF) with category
                    summaries and charts.
                  </p>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                  <h4 className="font-semibold">6. Analytics & Goals</h4>
                  <p className="text-slate-400 mt-2 text-sm">
                    Visual dashboards, spending trends, top categories, and
                    automated saving suggestions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-8 sm:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-slate-900/40 p-6 sm:p-8 rounded-2xl border border-slate-800">
              <h4 className="text-lg sm:text-xl font-bold">
                Ready to simplify your finances?
              </h4>
              <p className="text-slate-300 mt-3 text-sm sm:text-base">
                Sign up and connect your Telegram in under a minute. Start
                tracking expenses via chat or web.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white font-semibold shadow-md text-sm sm:text-base"
                >
                  Create Account
                </Link>
                <Link
                  to="/login"
                  className=" font-bold px-14 py-2 rounded-lg border border-slate-700 hover:text-white text-blue-600 text-sm sm:text-base"
                >
                  Log In
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-slate-400">
            <div className="mb-3 sm:mb-0 text-sm text-center">
              © 2025 FinBot. Built with ❤️.
            </div>
          </div>
        </footer>
      </div>
    </Aurora>
  );
};

export default Home;
