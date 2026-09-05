import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Menu,
  Plus,
  Mic,
  Sparkles,
  User,
  ShieldCheck,
  Zap,
  Headphones,
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
    "کمکم کن برنامه امروزم رو بچینم",
    "برای تمرکز چی کار کنم؟",
    "یه برنامه شروع سریع بده",
  ];

  const hasText = input.trim().length > 0;

  return (
    <div
      className="
        relative
        flex
        h-full
        min-h-0
        w-full
        flex-1
        flex-col
        overflow-hidden

        bg-[#02070d]
        text-white
      "
    >
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.32]

            bg-[linear-gradient(rgba(19,111,145,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(19,111,145,0.10)_1px,transparent_1px)]
            bg-[size:64px_64px]

            [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)]
          "
        />

        {/* Main blue glow */}

        <div
          className="
            absolute
            left-[18%]
            top-[30%]
            h-[500px]
            w-[500px]

            -translate-x-1/2
            -translate-y-1/2

            rounded-full

            bg-cyan-400/[0.045]
            blur-[100px]
          "
        />

        {/* Right glow */}

        <div
          className="
            absolute
            right-[3%]
            top-[30%]
            h-[420px]
            w-[420px]

            rounded-full

            bg-cyan-400/[0.035]
            blur-[100px]
          "
        />

        {/* Tiny stars */}

        <span className="absolute left-[28%] top-[18%] h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
        <span className="absolute left-[47%] top-[25%] h-1.5 w-1.5 rounded-full bg-cyan-300/80 shadow-[0_0_14px_#22d3ee]" />
        <span className="absolute right-[22%] top-[22%] h-1 w-1 rounded-full bg-cyan-300/70 shadow-[0_0_10px_#22d3ee]" />
        <span className="absolute right-[13%] top-[48%] h-1 w-1 rounded-full bg-cyan-300/60 shadow-[0_0_10px_#22d3ee]" />
        <span className="absolute left-[9%] top-[37%] h-1 w-1 rounded-full bg-cyan-300/50 shadow-[0_0_10px_#22d3ee]" />

      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className="
          relative
          z-20

          flex
          h-14
          min-h-14
          shrink-0
          items-center
          justify-center

          border-b
          border-cyan-400/[0.07]

          bg-[#02070d]/80
          backdrop-blur-md
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              text-[13px]
              font-black
              tracking-[0.25em]
              text-white
            "
          >
            APEX
          </span>

          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-cyan-400

              shadow-[0_0_10px_rgba(34,211,238,0.9)]
            "
          />
        </div>

        {/* MENU */}

        <button
          type="button"
          onClick={onToggleNavPanel}
          className="
            absolute
            right-4
            sm:right-6

            flex
            h-9
            w-9
            items-center
            justify-center

            rounded-xl

            border
            border-white/[0.06]

            text-gray-500

            transition-all
            duration-200

            hover:border-cyan-400/[0.15]
            hover:bg-cyan-400/[0.05]
            hover:text-cyan-300

            active:scale-95
          "
          aria-label="باز کردن منوی پنل"
        >
          <Menu size={19} />
        </button>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          relative
          z-10

          min-h-0
          flex-1

          overflow-y-auto
          overflow-x-hidden

          px-4
          sm:px-8
          lg:px-12

          ai-scrollbar
        "
      >
        {messages.length === 0 ? (
          /* =================================================
             HERO
          ================================================= */

          <div
            className="
              mx-auto
              flex
              min-h-full
              w-full
              max-w-[1450px]

              flex-col
              justify-center

              py-8
              lg:py-10
            "
          >
            {/* SYSTEM ONLINE */}

            <div
              className="
                flex
                justify-end

                mb-5
                sm:mb-7
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2

                  rounded-full

                  border
                  border-cyan-400/20

                  bg-cyan-400/[0.035]

                  px-4
                  py-2

                  text-[9px]
                  font-medium
                  tracking-[0.16em]
                  text-cyan-300

                  shadow-[0_0_25px_rgba(34,211,238,0.04)]
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-cyan-400

                    shadow-[0_0_9px_rgba(34,211,238,1)]
                  "
                />

                SYSTEM ONLINE
              </div>
            </div>

            {/* HERO GRID */}

            <div
              className="
                grid
                w-full
                items-center

                gap-8

                lg:grid-cols-[1fr_1fr]
                lg:gap-6
              "
            >
              {/* ===============================
                  LOGO SIDE
              =============================== */}

              <div
                className="
                  relative
                  flex
                  min-h-[330px]
                  items-center
                  justify-center

                  lg:min-h-[430px]
                "
              >
                {/* Orbit */}

                <div
                  className="
                    absolute
                    h-[280px]
                    w-[280px]

                    rounded-full

                    border
                    border-cyan-400/[0.12]

                    lg:h-[400px]
                    lg:w-[400px]
                  "
                />

                <div
                  className="
                    absolute
                    h-[230px]
                    w-[360px]

                    rotate-[-18deg]

                    rounded-[50%]

                    border
                    border-cyan-400/[0.10]

                    lg:h-[300px]
                    lg:w-[480px]
                  "
                />

                {/* Glow */}

                <div
                  className="
                    absolute
                    h-[280px]
                    w-[280px]

                    rounded-full

                    bg-cyan-400/[0.08]

                    blur-[70px]

                    lg:h-[400px]
                    lg:w-[400px]
                  "
                />

                {/* Logo */}

                <img
                  src="/apex-logo-new-cropped.svg.png"
                  alt="APEX AI"
                  className="
                    relative
                    z-10

                    w-[245px]
                    max-w-[70%]

                    object-contain

                    drop-shadow-[0_0_18px_rgba(0,200,255,0.75)]
                    drop-shadow-[0_0_55px_rgba(0,180,255,0.28)]

                    lg:w-[390px]
                  "
                />

                {/* Small blue point */}

                <span
                  className="
                    absolute
                    bottom-[12%]
                    right-[23%]

                    h-2
                    w-2

                    rounded-full

                    bg-cyan-300

                    shadow-[0_0_18px_rgba(34,211,238,1)]
                  "
                />
              </div>

              {/* ===============================
                  TEXT SIDE
              =============================== */}

              <div
                dir="rtl"
                className="
                  flex
                  flex-col
                  items-start

                  text-right

                  lg:items-start
                "
              >
                {/* Small label */}

                <div
                  className="
                    mb-4

                    flex
                    items-center
                    gap-2

                    text-[10px]
                    font-medium
                    tracking-[0.18em]
                    text-cyan-400
                  "
                >
                  <span className="h-px w-7 bg-cyan-400/50" />

                  APEX INTELLIGENCE
                </div>

                {/* Title */}

                <h1
                  className="
                    max-w-[650px]

                    text-4xl
                    font-black
                    leading-[1.35]

                    tracking-tight

                    text-white

                    sm:text-5xl
                    lg:text-[62px]
                    xl:text-[70px]
                  "
                >
                  چطور می‌تونم
                  <br />

                  <span
                    className="
                      text-cyan-300

                      drop-shadow-[0_0_20px_rgba(34,211,238,0.16)]
                    "
                  >
                    کمکت کنم؟
                  </span>
                </h1>

                {/* Description */}

                <p
                  className="
                    mt-5

                    max-w-[560px]

                    text-sm
                    leading-8

                    text-gray-400

                    sm:text-base
                  "
                >
                  با هوش مصنوعی Apex ایده‌هات رو
                  <br className="hidden sm:block" />
                  به برنامه‌های واقعی و قابل اجرا تبدیل کن.
                </p>

                {/* Suggestions */}

                <div
                  className="
                    mt-7

                    flex
                    max-w-[650px]
                    flex-wrap

                    gap-2
                  "
                >
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() =>
                        onSendMessage(suggestion)
                      }
                      className="
                        rounded-full

                        border
                        border-white/[0.09]

                        bg-[#081019]/80

                        px-4
                        py-2.5

                        text-xs
                        text-gray-400

                        backdrop-blur-sm

                        transition-all
                        duration-200

                        hover:border-cyan-400/25
                        hover:bg-cyan-400/[0.05]
                        hover:text-cyan-200

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

            {/* =================================================
                FEATURES
            ================================================= */}

            <div
              className="
                mt-8

                border-t
                border-cyan-400/[0.08]

                pt-7

                sm:mt-10
              "
            >
              <div
                className="
                  grid

                  grid-cols-1

                  gap-5

                  sm:grid-cols-3
                "
              >
                {/* SECURITY */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-3

                    sm:justify-start
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center

                      rounded-xl

                      border
                      border-cyan-400/10

                      bg-cyan-400/[0.035]
                    "
                  >
                    <ShieldCheck
                      size={19}
                      className="text-cyan-400"
                    />
                  </div>

                  <div dir="rtl">
                    <p
                      className="
                        text-xs
                        font-bold
                        text-gray-200
                      "
                    >
                      امنیت بالا
                    </p>

                    <p
                      className="
                        mt-1
                        text-[10px]
                        text-gray-600
                      "
                    >
                      محافظت از اطلاعات شما
                    </p>
                  </div>
                </div>

                {/* SPEED */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-3

                    sm:justify-center
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center

                      rounded-xl

                      border
                      border-cyan-400/10

                      bg-cyan-400/[0.035]
                    "
                  >
                    <Zap
                      size={19}
                      className="text-cyan-400"
                    />
                  </div>

                  <div dir="rtl">
                    <p
                      className="
                        text-xs
                        font-bold
                        text-gray-200
                      "
                    >
                      عملکرد سریع
                    </p>

                    <p
                      className="
                        mt-1
                        text-[10px]
                        text-gray-600
                      "
                    >
                      پاسخ‌های سریع و دقیق
                    </p>
                  </div>
                </div>

                {/* SUPPORT */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-3

                    sm:justify-end
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center

                      rounded-xl

                      border
                      border-cyan-400/10

                      bg-cyan-400/[0.035]
                    "
                  >
                    <Headphones
                      size={19}
                      className="text-cyan-400"
                    />
                  </div>

                  <div dir="rtl">
                    <p
                      className="
                        text-xs
                        font-bold
                        text-gray-200
                      "
                    >
                      پشتیبانی ۲۴/۷
                    </p>

                    <p
                      className="
                        mt-1
                        text-[10px]
                        text-gray-600
                      "
                    >
                      همیشه در کنار شما
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* =================================================
             MESSAGES
          ================================================= */

          <div
            className="
              mx-auto
              w-full
              max-w-4xl

              space-y-5

              py-6
              pb-10
            "
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`
                  flex
                  w-full

                  ${
                    msg.role === "user"
                      ? "flex-row-reverse gap-3"
                      : "justify-start"
                  }
                `}
              >
                {/* USER ICON */}

                {msg.role === "user" && (
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center

                      rounded-full

                      border
                      border-cyan-400/15

                      bg-cyan-400/[0.07]

                      text-cyan-300
                    "
                  >
                    <User size={15} />
                  </div>
                )}

                {/* MESSAGE */}

                <div
                  className={`
                    max-w-[82%]

                    break-words

                    rounded-2xl

                    px-4
                    py-3

                    text-sm
                    leading-7

                    sm:max-w-[75%]
                    sm:px-5

                    ${
                      msg.role === "user"
                        ? `
                          bg-cyan-500
                          text-white
                          shadow-[0_0_25px_rgba(6,182,212,0.12)]
                        `
                        : `
                          border
                          border-cyan-400/[0.08]
                          bg-[#071019]
                          text-gray-200
                        `
                    }
                  `}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* TYPING */}

            {isTyping && (
              <div className="flex justify-start">
                <div
                  className="
                    flex
                    items-center
                    gap-2

                    rounded-2xl

                    border
                    border-cyan-400/[0.08]

                    bg-[#071019]

                    px-4
                    py-3

                    text-sm
                    text-gray-500
                  "
                >
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-cyan-400
                      animate-pulse
                    "
                  />

                  در حال فکر کردن...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* =================================================
          COMPOSER
      ================================================= */}

      <div
        className="
          relative
          z-20

          shrink-0

          border-t
          border-cyan-400/[0.07]

          bg-[#02070d]/90

          px-3
          py-3

          backdrop-blur-xl

          sm:px-5
          sm:py-4
        "
      >
        <div
          className="
            mx-auto

            flex
            w-full
            max-w-4xl

            items-center
            gap-2

            rounded-[24px]

            border
            border-cyan-400/[0.12]

            bg-[#071019]/90

            px-2
            py-2

            shadow-[0_10px_50px_rgba(0,0,0,0.35)]

            transition-all
            duration-300

            focus-within:border-cyan-400/25
            focus-within:shadow-[0_0_35px_rgba(34,211,238,0.06)]
          "
          dir="ltr"
        >
          {/* PLUS */}

          <button
            type="button"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center

              rounded-full

              text-gray-500

              transition-all

              hover:bg-cyan-400/[0.06]
              hover:text-cyan-300

              active:scale-95
            "
            aria-label="افزودن"
          >
            <Plus size={21} strokeWidth={1.8} />
          </button>

          {/* INPUT */}

          <textarea
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
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

              placeholder:text-gray-600

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
              text-gray-500

              transition-all

              hover:bg-cyan-400/[0.05]
              hover:text-cyan-300

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
              h-10
              w-10
              shrink-0

              items-center
              justify-center

              rounded-full

              text-gray-500

              transition-all

              hover:bg-cyan-400/[0.06]
              hover:text-cyan-300

              sm:flex
            "
            aria-label="میکروفون"
          >
            <Mic size={19} />
          </button>

          {/* SEND */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasText}
            className={`
              flex
              h-11
              w-11
              shrink-0

              items-center
              justify-center

              rounded-full

              transition-all
              duration-200

              ${
                hasText
                  ? `
                    bg-cyan-500
                    text-white

                    shadow-[0_0_25px_rgba(6,182,212,0.30)]

                    hover:bg-cyan-400
                    hover:shadow-[0_0_30px_rgba(6,182,212,0.42)]

                    active:scale-90
                  `
                  : `
                    bg-cyan-500/90
                    text-white
                  `
              }
            `}
            aria-label="ارسال پیام"
          >
            {hasText ? (
              <ArrowUp
                size={20}
                strokeWidth={2.2}
              />
            ) : (
              <div
                className="
                  flex
                  items-center
                  gap-[2px]
                "
              >
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