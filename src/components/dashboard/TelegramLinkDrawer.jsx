import { X, Copy, Send, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import FinBotLogo from "../../assets/FinBotLogo.png";

/* Device based Telegram link */
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

  const isLinked = !!user?.telegramChatId;
  const telegramLink = getTelegramLink();

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  /* Polling backend until linked  , we will check if the user had linked his telegram or not after each interval until linked */
  useEffect(() => {
    let interval;
    if (open && code && !isLinked) {
      interval = setInterval(() => refreshUser(), 3000);
    }
    return () => clearInterval(interval);
  }, [open, code, isLinked, refreshUser]);

  /* Success detection */
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

  if (!open) return null;

  /* Generate linking code */
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
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/50 z-40" />

      {/* DRAWER */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-[75vh] bg-slate-900 border-t border-slate-800 rounded-t-2xl animate-slideUp">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800">
          <h2 className="text-lg font-bold">Link Telegram Bot</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* LOGO */}
          <div className="flex justify-center">
            <img src={FinBotLogo} alt="FinBot" className="h-14" />
          </div>

          {/* SUCCESS STATE */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <CheckCircle size={60} className="text-green-500" />
              <h3 className="text-xl font-semibold">Linked Successfully</h3>
              <p className="text-slate-400 text-sm text-center">
                Telegram bot is now connected to your account.
              </p>
            </div>
          ) : (
            <>
              {/* STEP 1 */}
              <div className="space-y-2">
                <h3 className="font-semibold">
                  <span className="text-slate-400">Step 1:</span> Generate
                  linking code
                </h3>
                <p className="text-sm text-slate-400">
                  Generate a unique code to link your Telegram account.
                </p>
                <button
                  onClick={generateCode}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate Linking Code"}
                </button>
              </div>

              {/* STEP 2 */}
              {code && (
                <div className="space-y-2">
                  <h3 className="font-semibold">
                    <span className="text-slate-400">Step 2:</span> Copy the
                    command
                  </h3>
                  <p className="text-sm text-slate-400">
                    Copy this command. You will paste it inside Telegram.
                  </p>
                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3">
                    <code className="flex-1 text-blue-400 text-sm">
                      {linkCommand}
                    </code>
                    <button
                      onClick={copyCommand}
                      className="p-2 rounded-lg hover:bg-slate-700"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {code && (
                <div className="space-y-2">
                  <h3 className="font-semibold">
                    <span className="text-slate-400">Step 3:</span> Open
                    Telegram & send command
                  </h3>
                  <p className="text-sm text-slate-400">
                    Open FinBot on Telegram, paste the command and send it.
                    Linking will complete automatically.
                  </p>
                  <a
                    href={telegramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700"
                  >
                    <Send size={16} />
                    Open FinBot on Telegram
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TelegramLinkDrawer;
