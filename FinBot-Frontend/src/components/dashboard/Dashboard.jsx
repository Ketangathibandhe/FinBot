import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TelegramAlert from "./TelegramAlert";
import TelegramLinkDrawer from "./TelegramLinkDrawer";
import AddExpenseDrawer from "./AddExpenseDrawer";
import ReportDrawer from "./ReportDrawer";
import { useAuthStore } from "../../store/authStore";
import { useExpenseStore } from "../../store/expenseStore";
import Aurora from "../ReactBits/Aurora";
import { FileText } from "lucide-react";

import StatsGrid from "./Widgets/StatsGrid";
import SpendingChart from "./Widgets/SpendingChart";
import CategoryChart from "./Widgets/CategoryChart";
import RecentTransactions from "./Widgets/RecentTransactions";

import Footer from "../Footer";

import{io} from "socket.io-client";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [openTelegramDrawer, setOpenTelegramDrawer] = useState(false);
  const [openAddExpenseDrawer, setOpenAddExpenseDrawer] = useState(false);
  const [openReportDrawer, setOpenReportDrawer] = useState(false);

  const { token, user } = useAuthStore();
  const { expenses, stats, fetchDashboardData, deleteExpense } =
    useExpenseStore();

  // Initial Fetch
  useEffect(() => {
    if (token) fetchDashboardData(token);
  }, [token]);

  //SOCKET.IO LOGIC (Replaces Polling)
  useEffect(() => {
    if (!token|| !user) return;

    // Connect to Backend
    const socket = io(import.meta.env.VITE_API_URL, {
        withCredentials: true,
    });

    // join room
    socket.on("connect", () => {
        console.log("Socket Connected:", socket.id);
        socket.emit("join-room", user._id); // Join room with User ID
    });
    //listen when backend says expense-updated
    socket.on("expense-updated", () => {
        console.log("Real-time update received!");
        // 'true' flag ensures loading spinner doesn't show (background refresh)
        fetchDashboardData(token, true);
    });

    // User Linked update (green dot in sidebar for linked status)
    socket.on("user-linked", () => {
        window.location.reload(); 
    });
    
    return () => {socket.disconnect();} // Cleanup on unmount
  }, [token, user,fetchDashboardData]);

  const currentMonthYear = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <Aurora
      colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
      amplitude={1.4}
      blend={1}
      speed={1}
    >
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            "linear-gradient(transparent 0, rgba(255,255,255,0.035) 2px), linear-gradient(90deg, transparent 0, rgba(255,255,255,0.035) 2px)",
          backgroundSize: "48px 48px",
          mixBlendMode: "overlay",
          opacity: 0.9,
        }}
        aria-hidden="true"
      />

      {/* Sidebar Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30"
        />
      )}

      {/* SIDEBAR */}
      <Sidebar
        open={open}
        setOpen={setOpen}
        onLinkClick={() => setOpenTelegramDrawer(true)}
        onAddExpenseClick={() => setOpenAddExpenseDrawer(true)}
        onReportClick={() => setOpenReportDrawer(true)}
      />

      {/* MAIN LAYOUT */}
      <main
        className={`relative z-20 min-h-screen flex flex-col transition-[margin] duration-300 ease-out ${
          open ? "ml-64" : "ml-0"
        }`}
      >
        {/* HEADER */}
        <header className="h-20 flex items-center justify-between px-6 sm:px-12 sticky top-0 z-30 bg-[#050505]/70 backdrop-blur-xl border-b border-white/5 shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setOpen(true)}
              className={`p-2 -ml-2 rounded-xl text-gray-400 hover:text-white transition ${
                open ? "opacity-0 pointer-events-none" : ""
              }`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-linear-to-r from-blue-300 to bg-purple-400 bg-clip-text text-transparent">
                {user?.name ? `${user.name}'s Dashboard` : "My Dashboard"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium text-center">
                Overview for {currentMonthYear}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => setOpenReportDrawer(true)}
              className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
            >
              <FileText size={18} className="text-black" />
              Reports
            </button>

            <button
              onClick={() => setOpenAddExpenseDrawer(true)}
              className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
            >
              + Add Expense
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-grow w-full max-w-[1920px] mx-auto px-6 sm:px-12 pb-12 pt-6 space-y-6">
          <TelegramAlert onLinkClick={() => setOpenTelegramDrawer(true)} />

          <StatsGrid stats={stats} expensesCount={expenses.length} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 min-h-[400px]">
            <SpendingChart data={stats.dailyStats} />
            <CategoryChart
              data={stats.categoryStats}
              total={stats.totalExpense}
            />
          </div>
          <div className="lg:mt-16">
            <RecentTransactions
              expenses={expenses}
              onDelete={deleteExpense}
              token={token}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="w-full relative z-50 mt-auto">
          <Footer />
        </div>
      </main>

      {/* DRAWERS */}
      <TelegramLinkDrawer
        open={openTelegramDrawer}
        onClose={() => setOpenTelegramDrawer(false)}
      />
      <AddExpenseDrawer
        open={openAddExpenseDrawer}
        onClose={() => {
          setOpenAddExpenseDrawer(false);
          fetchDashboardData(token);
        }}
      />
      <ReportDrawer
        open={openReportDrawer}
        onClose={() => setOpenReportDrawer(false)}
      />
    </Aurora>
  );
};

export default Dashboard;
