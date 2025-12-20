import { useState } from "react";
import { X, Download, FileText, Calendar, ChevronDown } from "lucide-react";
import { useExpenseStore } from "../../store/expenseStore";
import { useAuthStore } from "../../store/authStore";

const ReportDrawer = ({ open, onClose }) => {
  const currentYear = new Date().getFullYear();
  //previous 5 years option
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore();
  const { downloadReport } = useExpenseStore();

  const handleDownload = async () => {
    setLoading(true);
    const success = await downloadReport(month, year, token);
    setLoading(false);
    if (success) onClose();
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* DRAWER */}
      <div
        className={`
        fixed inset-x-0 bottom-0 z-50 w-full 
        bg-[#0F1219] border-t border-white/10 
        rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.6)] 
        transform transition-transform duration-300 ease-out 
        ${open ? "translate-y-0" : "translate-y-[120%]"}
      `}
      >
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-linear-to-r from-blue-300 to-purple-500 rounded-full"></div>
        </div>

        <div className="p-6 pb-10 max-w-lg mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/5">
                <FileText size={24} className="text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Monthly Statement
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Export your expenses as PDF
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white border border-transparent hover:border-white/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* CONTROLS */}
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Year Dropdown */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Year
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 group-hover:text-blue-400 transition-colors">
                    <Calendar size={16} />
                  </div>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-[#1A1F2E] border border-white/10 text-white font-medium rounded-xl py-3.5 pl-10 pr-8 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer hover:bg-[#23293A]"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-600">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Month Dropdown */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
                  Month
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 group-hover:text-blue-400 transition-colors">
                    <FileText size={16} />{" "}
                    {/* Changed Icon slightly for variety */}
                  </div>
                  <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="w-full bg-[#1A1F2E] border border-white/10 text-white font-medium rounded-xl py-3.5 pl-10 pr-8 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer hover:bg-[#23293A]"
                  >
                    {months.map((m, idx) => (
                      <option key={idx} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-600">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/*Download Button */}
            <button
              onClick={handleDownload}
              disabled={loading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed border border-white/10"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download Statement
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportDrawer;
