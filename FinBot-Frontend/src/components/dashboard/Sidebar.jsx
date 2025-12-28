import { Home, PlusCircle, Send, FileText, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Sidebar = ({
  open,
  setOpen,
  onLinkClick,
  onAddExpenseClick,
  onReportClick,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const isTelegramLinked = !!user?.telegramChatId;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-screen w-64
        bg-slate-900/95 backdrop-blur-xl
        border-r border-slate-800
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800">
        <span className="ml-2 text-2xl font-bold bg-linear-to-r from-blue-300 to-purple-600 bg-clip-text text-transparent">
          FinBot
        </span>
        <button
          onClick={() => setOpen(false)}
          className="p-2 rounded-lg hover:bg-slate-800 transition"
        >
          <X size={18} color="white"/>
        </button>
      </div>

      <nav className="p-3 space-y-1 text-slate-300">
        <MenuItem
          icon={<Home size={18} />}
          label="Home"
          onClick={() => navigate("/")}
        />

        <MenuItem
          icon={<PlusCircle size={18} />}
          label="Add Expense"
          onClick={() => {
            setOpen(false);
            onAddExpenseClick();
          }}
        />

        <MenuItem
          icon={<Send size={18} />}
          label="Link TelegramBot"
          onClick={() => {
            setOpen(false);
            onLinkClick();
          }}
        />

        <MenuItem
          icon={<FileText size={18} />}
          label="Reports"
          onClick={() => {
            setOpen(false);
            onReportClick();
          }}
        />
      </nav>

      <div className="absolute bottom-4 left-0 w-full px-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-2">
          <div className="px-3 py-2 rounded-lg border border-slate-800">
            <p className="text-sm font-semibold text-white">
              {user?.name ? `${user.name}'s` : "User's"}
            </p>
            <p className="text-xs text-slate-400">Personal Dashboard</p>
          </div>

          <div className="flex items-center px-3 py-2 rounded-lg border border-slate-800 text-slate-300">
            <span>TelegramBot</span>
            <div className="ml-auto relative flex items-center justify-center">
              <span
                className={`absolute inline-flex h-4 w-4 rounded-full ${
                  isTelegramLinked ? "bg-green-500/40" : "bg-red-500/40"
                } animate-ping`}
              />
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  isTelegramLinked ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>
          </div>

          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg
                       border border-slate-800
                       text-red-400 hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </div>
        </div>
      </div>
    </aside>
  );
};

const MenuItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 cursor-pointer"
  >
    {icon}
    {label}
  </div>
);

export default Sidebar;
