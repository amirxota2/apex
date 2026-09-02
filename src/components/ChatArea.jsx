import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Menu,
  Plus,
  Mic,
  Sparkles,
  User,
} from "lucide-react";

const ChatArea = ({
  messages,
  onSendMessage,
  isTyping,
  onToggleNavPanel,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  const handleSubmit = () => {
    const trimmed = input.trim();

    if (!trimmed) return;

    onSendMessage(trimmed);
    setInput("");
  };

  const suggestions = [
    "کمکم کن برنامه امروزمو بچینم",
    "برای تمرکز چی کار کنم؟",
    "یه برنامه شروع سریع بده",
  ];

  const hasText = input.trim().length > 0;

  return (
    <div
      className="
        relative flex h-full min-h-0 w-full flex-1 flex-col
        overflow-hidden
        bg-[#050505]
        text-white
      "
    >
      {/* ================= HEADER ================= */}

      <div
        className="
          relative flex h-14 min-h-14 shrink-0
          items-center justify-center
          border-b border-white/[0.06]
          bg-[#050505]
        "
      >
        <span className="text-sm font-semibold tracking-wide text-white">
          Apex
        </span>

        <button
          type="button"
          onClick={onToggleNavPanel}
          className="
            absolute right-3 sm:right-5
            flex h-9 w-9 items-center justify-center
            rounded-xl
            text-gray-500
            transition-all duration-200
            hover:bg-white/[0.06]
            hover:text-white
            active:scale-95
          "
          aria-label="باز کردن منوی پنل"
        >
          <Menu size={19} />
        </button>
      </div>

      {/* ================= MESSAGES ================= */}

      <div
        className="
          relative min-h-0 flex-1
          overflow-y-auto
          overflow-x-hidden
          px-3 py-4
          sm:px-5
          lg:px-8
        "
      >
        {messages.length === 0 ? (
          <div
            className="
              flex min-h-full
              items-center justify-center
              text-center
              px-2
            "
          >
            <div className="w-full max-w-3xl">

              {/* Title */}

              <h2
                className="
                  mb-5
                  text-2xl
                  font-black
                  leading-relaxed
                  tracking-tight
                  text-white
                  sm:text-3xl
                  md:text-4xl
                "
              >
                چطور می‌تونم کمکت کنم؟
              </h2>

              {/* Suggestions */}

              <div
                className="
                  flex flex-wrap
                  items-center
                  justify-center
                  gap-2
                "
              >
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => onSendMessage(suggestion)}
                    className="
                      rounded-full
                      border border-white/[0.10]
                      bg-[#151515]
                      px-4 py-2.5
                      text-xs
                      text-gray-300
                      shadow-[0_2px_10px_rgba(0,0,0,0.2)]
                      transition-all duration-200
                      hover:border-white/[0.18]
                      hover:bg-[#1c1c1c]
                      hover:text-white
                      active:scale-95
                      sm:text-sm
                    "
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="
              mx-auto
              w-full
              max-w-3xl
              space-y-5
              pb-6
            "
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`
                  flex w-full
                  ${
                    msg.role === "user"
                      ? "flex-row-reverse gap-3"
                      : "justify-start"
                  }
                `}
              >
                {/* User Icon */}

                {msg.role === "user" && (
                  <div
                    className="
                      flex h-8 w-8
                      shrink-0
                      items-center justify-center
                      rounded-full
                      bg-[#1684ff]/15
                      text-[#1684ff]
                    "
                  >
                    <User size={15} />
                  </div>
                )}

                {/* Message */}

                <div
                  className={`
                    max-w-[82%]
                    break-words
                    rounded-2xl
                    px-4 py-3
                    text-sm
                    leading-7
                    sm:max-w-[75%]
                    sm:px-5
                    sm:py-3.5
                    ${
                      msg.role === "user"
                        ? "bg-[#1684ff] text-white"
                        : "border border-white/[0.06] bg-[#111111] text-gray-200"
                    }
                  `}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing */}

            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="
                    rounded-2xl
                    border border-white/[0.06]
                    bg-[#111111]
                    px-4 py-3
                    text-sm
                    text-gray-400
                  "
                >
                  در حال فکر کردن...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ================= COMPOSER ================= */}

      <div
        className="
          relative shrink-0
          border-t border-white/[0.05]
          bg-[#050505]
          px-3 py-3
          sm:px-5
          sm:py-4
        "
      >
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-3xl
            items-center
            gap-2
            rounded-[22px]
            border border-white/[0.10]
            bg-[#151515]
            px-2
            py-2
            shadow-[0_8px_35px_rgba(0,0,0,0.35)]
            transition-all duration-200
            focus-within:border-white/[0.18]
          "
          dir="ltr"
        >
          {/* PLUS */}

          <button
            type="button"
            className="
              flex h-10 w-10
              shrink-0
              items-center justify-center
              rounded-full
              text-gray-300
              transition-all
              hover:bg-white/[0.08]
              hover:text-white
              active:scale-95
            "
            aria-label="افزودن"
          >
            <Plus size={21} strokeWidth={1.8} />
          </button>

          {/* INPUT */}

          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="پیام خودت را بنویس..."
            rows={1}
            className="
              min-h-[40px]
              max-h-28
              min-w-0
              flex-1
              resize-none
              overflow-y-auto
              bg-transparent
              px-1
              py-2
              text-right
              text-sm
              text-white
              outline-none
              placeholder:text-gray-500
              sm:text-base
            "
            dir="rtl"
          />

          {/* THINK */}

          <button
            type="button"
            className="
              hidden
              shrink-0
              items-center
              gap-2
              rounded-full
              px-3
              py-2
              text-sm
              text-gray-400
              transition-all
              hover:bg-white/[0.06]
              hover:text-white
              sm:flex
            "
          >
            <Sparkles size={17} />
            <span>Think</span>
          </button>

          {/* MICROPHONE */}

          <button
            type="button"
            className="
              hidden
              h-10 w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              text-gray-300
              transition-all
              hover:bg-white/[0.08]
              hover:text-white
              sm:flex
            "
            aria-label="میکروفون"
          >
            <Mic size={19} />
          </button>

          {/* SEND / VOICE */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasText}
            className={`
              flex
              h-11 w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              transition-all duration-200
              ${
                hasText
                  ? `
                    bg-[#1684ff]
                    text-white
                    shadow-[0_0_20px_rgba(22,132,255,0.35)]
                    hover:bg-[#2b91ff]
                    hover:shadow-[0_0_25px_rgba(22,132,255,0.45)]
                    active:scale-90
                  `
                  : `
                    bg-[#1684ff]
                    text-white
                    opacity-90
                  `
              }
            `}
            aria-label="ارسال پیام"
          >
            {hasText ? (
              <ArrowUp size={20} strokeWidth={2.2} />
            ) : (
              <div className="flex items-center gap-[2px]">
                <span className="h-3 w-[2px] rounded-full bg-white/80" />
                <span className="h-5 w-[2px] rounded-full bg-white" />
                <span className="h-3 w-[2px] rounded-full bg-white/80" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;