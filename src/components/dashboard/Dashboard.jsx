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

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [openTelegramDrawer, setOpenTelegramDrawer] = useState(false);
  const [openAddExpenseDrawer, setOpenAddExpenseDrawer] = useState(false);
  const [openReportDrawer, setOpenReportDrawer] = useState(false);

  const { token, user } = useAuthStore();
  const { expenses, stats, fetchDashboardData, deleteExpense } = useExpenseStore();

  useEffect(() => {
    if (token) fetchDashboardData(token);
  }, [token]);

  const currentMonthYear = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} amplitude={1.0} blend={0.5} speed={0.5}>
        <div className="relative min-h-screen text-white overflow-hidden font-sans selection:bg-blue-500/30">

        {/* BACKGROUND GRID */}
        <div className="absolute inset-0 pointer-events-none z-10"
            style={{
            backgroundImage: "linear-gradient(transparent 0, rgba(255,255,255,0.035) 2.5px), linear-gradient(90deg, transparent 0, rgba(255,255,255,0.035) 2.5px)",
            backgroundSize: "48px 48px",
            mixBlendMode: "overlay", 
            }}
            aria-hidden="true"
        />

        {/* Sidebar Overlay */}
        {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30" />}

        {/* SIDEBAR */}
        <Sidebar 
            open={open} 
            setOpen={setOpen} 
            onLinkClick={() => setOpenTelegramDrawer(true)}
            onAddExpenseClick={() => setOpenAddExpenseDrawer(true)} 
            onReportClick={() => setOpenReportDrawer(true)} 
        />

       
        <main className={`relative z-20 min-h-screen transition-[margin] duration-300 ease-out ${open ? "ml-64" : "ml-0"}`}>
            
            {/* HEADER */}
            <header className="h-20 flex items-center justify-between px-6 sm:px-12 sticky top-0 z-20 bg-[#050505]/70 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-6">
                    <button onClick={() => setOpen(true)} className={`p-2 -ml-2 rounded-xl text-gray-400 hover:text-white transition ${open ? "opacity-0 pointer-events-none" : ""}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            {user?.name ? `${user.name}'s Dashboard` : "My Dashboard"}
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">Overview for {currentMonthYear}</p>
                    </div>
                </div>
                
                <div className="hidden sm:flex items-center gap-4">
                    
                    {/* Reports Button*/}
                    <button 
                        onClick={() => setOpenReportDrawer(true)}
                        className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
                    >
                        <FileText size={18} className="text-black"/>
                        Reports
                    </button>

                    {/* Add Expense Button */}
                    <button 
                        onClick={() => setOpenAddExpenseDrawer(true)} 
                        className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
                    >
                        + Add Expense
                    </button>
                </div>
            </header>

            {/* TELEGRAM ALERT */}
            <div className="px-6 sm:px-12 pt-6">
                <TelegramAlert onLinkClick={() => setOpenTelegramDrawer(true)} />
            </div>

            {/* DASHBOARD WIDGETS */}
            <div className="px-6 sm:px-12 pb-12 pt-2 max-w-[1920px] mx-auto space-y-6">
                
                {/* 1.Stats Grid */}
                <StatsGrid stats={stats} expensesCount={expenses.length} />

                {/* 2. Charts Row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto xl:h-[450px]">
                    <SpendingChart data={stats.dailyStats} />
                    <CategoryChart data={stats.categoryStats} total={stats.totalExpense} />
                </div>

                {/* 3.Transactions List */}
                <RecentTransactions expenses={expenses} onDelete={deleteExpense} token={token} />

            </div>
        </main>

        <TelegramLinkDrawer open={openTelegramDrawer} onClose={() => setOpenTelegramDrawer(false)} />
        <AddExpenseDrawer open={openAddExpenseDrawer} onClose={() => { setOpenAddExpenseDrawer(false); fetchDashboardData(token); }} />
        <ReportDrawer open={openReportDrawer} onClose={() => setOpenReportDrawer(false)} />
        
        </div>
    </Aurora>
  );
};

export default Dashboard;