import { X, Send } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

const TelegramAlert = ({ onLinkClick }) => {
  const { user } = useAuthStore();
  const [dismissed, setDismissed] = useState(false);

  const isTelegramLinked = !!user?.telegramChatId;

  // if Telegram is linked
  if (isTelegramLinked || dismissed) return null;

  return (
    <div className="mb-4 rounded-xl border border-blue-500/30 bg-[#050505]/60 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-[0_0_15px_rgba(59,130,246,0.15)]">
      {/* left */}
      <div className="flex items-center gap-3 text-blue-200 text-sm">
        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
            <Send size={18} />
        </div>
        <span>
          Link your Telegram Bot to unlock full potential of{" "}
          <span className="font-bold text-white tracking-wide">FinBot</span>
        </span>
      </div>

      {/* right */}
      <div className="flex items-center gap-3">
        <button
          onClick={onLinkClick}
          className="text-xs font-bold px-4 py-2 rounded-lg
                     bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-500/20"
        >
          Link Now
        </button>

        <button  //button to close notification alert
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default TelegramAlert;