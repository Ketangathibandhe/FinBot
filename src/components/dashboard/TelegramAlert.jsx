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
    <div className="mb-4 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 flex items-center justify-between">
      {/* left */}
      <div className="flex items-center gap-3 text-blue-200 text-sm">
        <Send size={18} />
        <span>
          Link your Telegram Bot to unlock full potential of{" "}
          <span className="font-semibold text-white">FinBot</span>
        </span>
      </div>

      {/* right */}
      <div className="flex items-center gap-3">
        <button
          onClick={onLinkClick}
          className="text-sm px-3 py-1.5 rounded-lg
                     bg-blue-600 hover:bg-blue-700 text-white transition"
        >
          Link Now
        </button>

        <button  //button to close notification alert
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg hover:bg-white/10 transition"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default TelegramAlert;
