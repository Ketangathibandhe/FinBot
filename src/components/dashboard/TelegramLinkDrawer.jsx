import { X, Copy, Send, CheckCircle, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

const getTelegramLink = () => {
  if (window.innerWidth < 768) {
    return "https://t.me/FinBot_00_bot";
  }
  return "https://web.telegram.org/k/#@FinBot_00_bot";
};

const TelegramLinkDrawer = ({ open, onClose }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  const [code, setCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const isLinked = !!user?.telegramChatId;
  const telegramLink = getTelegramLink();

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  useEffect(() => {
    let interval;
    if (open && code && !isLinked) {
      interval = setInterval(() => refreshUser(), 3000);
    }
    return () => clearInterval(interval);
  }, [open, code, isLinked, refreshUser]);

  useEffect(() => {
    if (isLinked && open && code) {
      setIsSuccess(true);
      setCode(null);

      const timer = setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isLinked, open, code, onClose]);

  const generateCode = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/profile/generate-code",
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCode(res.data.code);
    } catch {
      alert("Failed to generate code. Please re-login.");
    } finally {
      setLoading(false);
    }
  };

  const linkCommand = code ? `/start ${code}` : "";

  const copyCommand = async () => {
    await navigator.clipboard.writeText(linkCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div 
        onClick={onClose} 
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300 ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`} 
      />

      <div className={`
        fixed inset-x-0 bottom-0 z-50 w-full 
        bg-[#0F1219] border-t border-white/10 
        rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.6)] 
        transform transition-transform duration-300 ease-out 
        ${open ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"}
      `}>
        
        <div className="w-full flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-gray-700/50 rounded-full"></div>
        </div>

        <div className="p-6 pb-10 max-w-lg mx-auto min-h-[50vh]">
          
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/5">
                    <MessageCircle size={24} className="text-blue-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Connect Telegram</h2>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Receive instant expense alerts</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition text-gray-400 hover:text-white border border-transparent hover:border-white/10">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            
            {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-fadeIn">
                    <div className="p-4 bg-green-500/10 rounded-full border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <CheckCircle size={48} className="text-green-500" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white">Linked Successfully!</h3>
                        <p className="text-gray-400 text-sm mt-1">
                            Your Telegram bot is now connected.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Step 1: Get Code</label>
                    </div>
                    
                    {!code ? (
                        <button
                            onClick={generateCode}
                            disabled={loading}
                            className="w-full py-4 bg-[#1A1F2E] border border-white/10 hover:border-blue-500/50 hover:bg-[#23293A] text-white rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <span className="group-hover:text-blue-400 transition-colors">Generate Linking Code</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="space-y-3 animate-fadeIn">
                             <div className="bg-[#1A1F2E] border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Your Linking Command</p>
                                    <code className="text-blue-400 font-mono text-lg font-bold tracking-wide">
                                        {linkCommand}
                                    </code>
                                </div>
                                <button
                                    onClick={copyCommand}
                                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                                >
                                    {copied ? <CheckCircle size={20} className="text-green-500"/> : <Copy size={20} />}
                                </button>
                            </div>
                            
                            <div className="pt-4">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1 block mb-3">Step 2: Activate Bot</label>
                                <a
                                    href={telegramLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-white/10"
                                >
                                    <Send size={20} />
                                    Open Telegram & Paste
                                </a>
                                <p className="text-center text-xs text-gray-500 mt-3">
                                    Paste the copied command into the bot chat to finish.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                </>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default TelegramLinkDrawer;