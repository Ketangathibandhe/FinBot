import { useState } from "react";
import Sidebar from "./Sidebar";
import TelegramAlert from "./TelegramAlert";
import TelegramLinkDrawer from "./TelegramLinkDrawer";
import AddExpenseDrawer from "./AddExpenseDrawer";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [openTelegramDrawer, setOpenTelegramDrawer] = useState(false);
  // State for Add Expense Drawer
  const [openAddExpenseDrawer, setOpenAddExpenseDrawer] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0b1020] text-white overflow-hidden">

      {/* GRID BG */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)",
          backgroundSize: "48px 48px",
          opacity: 0.35,
        }}
      />

      {/* click outside to close sidebar */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30"
        />
      )}

      {/* SIDEBAR */}
      {/*Pass onAddExpenseClick handler */}
      <Sidebar 
        open={open} 
        setOpen={setOpen} 
        onLinkClick={() => setOpenTelegramDrawer(true)}
        onAddExpenseClick={() => setOpenAddExpenseDrawer(true)} 
      />

      {/* MAIN */}
      <main
        className={`
          relative z-20 min-h-screen
          transition-[margin] duration-300 ease-in-out
          ${open ? "ml-64" : "ml-0"}
        `}
      >
        {/* HEADER */}
        <header className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <button
            onClick={() => setOpen(true)}
            className={`
              p-2 rounded-lg transition
              ${open ? "opacity-0 pointer-events-none" : "hover:bg-slate-800"}
            `}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6H21M3 12H21M3 18H21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <h1 className="text-xl font-bold">Dashboard</h1>
        </header>

        {/*Telegram Alert*/}
        <div className="px-6 pt-4">
          <TelegramAlert
            onLinkClick={() => setOpenTelegramDrawer(true)}
          />
        </div>

        {/* CONTENT */}
        <section className="p-6">
          <p className="text-slate-400">
            Welcome to FinBot Dashboard
          </p>
        </section>
      </main>

      {/*TELEGRAM LINK DRAWER */}
      <TelegramLinkDrawer
        open={openTelegramDrawer}
        onClose={() => setOpenTelegramDrawer(false)}
      />

      {/*ADD EXPENSE DRAWER */}
      <AddExpenseDrawer 
        open={openAddExpenseDrawer}
        onClose={() => setOpenAddExpenseDrawer(false)}
      />
    </div>
  );
};

export default Dashboard;