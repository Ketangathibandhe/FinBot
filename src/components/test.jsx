// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import Aurora from "../components/ReactBits/Aurora"; // path: adjust if needed
// If you mounted ClickSpark globally, no import needed here.

export default function Home() {
  return (
    <Aurora
      colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
      amplitude={2.8}
      blend={0.9}
      speed={0.7}
    >
      {/* ---------- subtle grid layer (Tailwind + inline style) ---------- */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-90"
        style={{
          backgroundImage:
            "linear-gradient(transparent 0, rgba(255,255,255,0.03) 1px), linear-gradient(90deg, transparent 0, rgba(255,255,255,0.03) 1px)",
          backgroundSize: "52px 52px",
          mixBlendMode: "overlay",
          transform: "translateZ(0)",
        }}
        aria-hidden="true"
      />

      {/* ---------- main content (place above BG) ---------- */}
      <div className="relative z-20 min-h-screen flex flex-col text-white">
        {/* NAVBAR */}
        <header className="w-full py-6">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M12 2v20M2 12h20"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-600 bg-clip-text text-transparent">
                FinBot
              </h1>
            </div>

            <nav className="flex items-center gap-4">
              <Link to="/login" className="text-slate-300 hover:text-white">
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/20"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </header>

        {/* HERO */}
        <main className="flex-grow">
          <section className="max-w-5xl mx-auto px-6 py-12 lg:py-24 text-center">
            <div className="mb-6 inline-block bg-slate-800/60 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium border border-slate-700 animate-pulse">
              AI-Powered Expense Tracking 
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mt-6">
              Track & Manage Money — Fast, Simple, Smart
            </h2>

            <p className="mt-6 text-slate-300 max-w-3xl mx-auto text-lg">
              Use FinBot from your browser or directly from Telegram. Send a
              message or upload a receipt photo — our AI reads amounts,
              categories and stores them automatically.
              <br />
              (Hindi friendly — "100 ka petrol" ya फोटो भेजो — FinBot samajh
              lega.)
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-blue-500/30 transform hover:-translate-y-1"
              >
                Get Started — Free
              </Link>

              <a
                href="#how-it-works"
                className="bg-slate-800/70 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-lg font-semibold border border-slate-700"
              >
                How it Works
              </a>
            </div>

            {/* small stats / trust */}
            <div className="mt-12 flex flex-wrap gap-6 justify-center items-center text-slate-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100k+</div>
                <div className="text-sm">Transactions processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.5%</div>
                <div className="text-sm">Receipt parsing accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  Telegram + Web
                </div>
                <div className="text-sm">Use it anywhere</div>
              </div>
            </div>
          </section>

          {/* DASHBOARD PREVIEW */}
          <section className="bg-transparent py-10">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* KEY CARDS */}
              <div className="col-span-1 lg:col-span-2 space-y-6">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">Monthly Summary</h3>
                      <p className="text-slate-400 mt-1">
                        Snapshot of income & spending with category breakdown
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹ 24,580</div>
                      <div className="text-sm text-slate-400">
                        Total this month
                      </div>
                    </div>
                  </div>

                  {/* placeholder for chart */}
                  <div className="mt-6 h-56 bg-gradient-to-b from-slate-900/40 to-transparent rounded-xl border border-dashed border-slate-800 flex items-center justify-center">
                    <div className="text-slate-500">
                      [Chart Placeholder — replace with recharts / chart.js
                      component]
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <div className="text-sm text-slate-400">Today</div>
                    <div className="text-xl font-bold mt-2">₹ 450</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Groceries, Transport
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <div className="text-sm text-slate-400">Avg. Daily</div>
                    <div className="text-xl font-bold mt-2">₹ 820</div>
                    <div className="text-xs text-slate-500 mt-1">
                      This month
                    </div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <div className="text-sm text-slate-400">Savings Goal</div>
                    <div className="text-xl font-bold mt-2">₹ 12,000</div>
                    <div className="text-xs text-slate-500 mt-1">Remaining</div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <aside className="space-y-6">
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-sm text-slate-300">Quick Add</h4>
                  <p className="text-slate-400 text-sm mt-2">
                    Add a transaction instantly from the web
                  </p>
                  <div className="mt-4 flex gap-2">
                    <input
                      className="flex-1 bg-transparent border border-slate-800 px-3 py-2 rounded-md outline-none"
                      placeholder="e.g. 100 momos"
                    />
                    <button className="bg-blue-600 px-3 py-2 rounded-md text-white">
                      Add
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-sm text-slate-300">Export</h4>
                  <p className="text-slate-400 text-sm mt-2">
                    Download monthly PDF statements (bank-like)
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-slate-800/60 px-3 py-2 rounded-md border border-slate-700">
                      Download PDF
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-sm text-slate-300">Telegram</h4>
                  <p className="text-slate-400 text-sm mt-2">
                    Link your Telegram to add expenses via messages
                  </p>
                  <div className="mt-3">
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 px-3 py-2 rounded-md text-white">
                      Get Link Code
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* FEATURES / HOW IT WORKS */}
          <section
            id="how-it-works"
            className="max-w-6xl mx-auto px-6 py-12 lg:py-20"
          >
            <h3 className="text-2xl font-semibold mb-6">
              How FinBot works — quick overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <h4 className="font-semibold">1. Sign up & Link</h4>
                <p className="text-slate-400 mt-2 text-sm">
                  Sign up on the web, get a unique linking code, send it to our
                  Telegram bot and your account gets linked instantly.
                </p>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <h4 className="font-semibold">
                  2. Add expenses (Telegram / Web)
                </h4>
                <p className="text-slate-400 mt-2 text-sm">
                  Send messages like <span className="italic">"100 momos"</span>{" "}
                  or upload a bill image. Bot saves transactions to your
                  account.
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
          </section>

          {/* ACTIONABLE CTA / Signup */}
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-6 text-center bg-slate-900/40 p-8 rounded-2xl border border-slate-800">
              <h4 className="text-xl font-bold">
                Ready to simplify your finances?
              </h4>
              <p className="text-slate-300 mt-3">
                Sign up and connect your Telegram in under 2 minutes. Start
                tracking expenses via chat or web.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Link
                  to="/signup"
                  className="bg-blue-600 px-6 py-3 rounded-lg text-white font-semibold shadow-md"
                >
                  Create Account
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-lg border border-slate-700 text-slate-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="py-8 mt-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-400">
            <div className="mb-4 md:mb-0">
              © 2025 FinBot. Built with ❤️ & AI.
            </div>
            <div className="flex items-center gap-4">
              <a className="text-slate-300 hover:text-white">Privacy</a>
              <a className="text-slate-300 hover:text-white">Terms</a>
              <a className="text-slate-300 hover:text-white">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </Aurora>
  );
}
