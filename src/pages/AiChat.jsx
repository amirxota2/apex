import { useState, useCallback, useEffect } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatArea from "../components/ChatArea";
import AiNavPanel from "../components/AiNavPanel";
import { authService } from "../services/authService";
import { planService } from "../services/planService";

const generateId = () =>
  Math.random().toString(36).substring(2, 10);

const AiChat = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messagesBySession, setMessagesBySession] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navPanelOpen, setNavPanelOpen] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: "کاربر آزمایشی",
    image: null,
  });

  useEffect(() => {
    const syncProfile = () => {
      const saved = localStorage.getItem("userProfile");

      if (saved) {
        try {
          const data = JSON.parse(saved);

          setUserProfile({
            name: data.name || "کاربر آزمایشی",
            image: data.image || null,
          });
        } catch (error) {
          console.error("Profile error:", error);
        }
      }
    };

    syncProfile();

    window.addEventListener("storage", syncProfile);

    return () => {
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  const handleDeleteSession = useCallback(
    (id) => {
      setSessions((prev) =>
        prev.filter((session) => session.id !== id)
      );

      setMessagesBySession((prev) => {
        const nextMessages = { ...prev };
        delete nextMessages[id];
        return nextMessages;
      });

      if (activeSessionId === id) {
        setActiveSessionId(null);
      }
    },
    [activeSessionId]
  );

  const handleNewChat = useCallback(() => {
    const id = generateId();

    setSessions((prev) => [
      {
        id,
        title: "گفتگوی جدید",
        timestamp: new Date(),
      },
      ...prev,
    ]);

    setActiveSessionId(id);

    setMessagesBySession((prev) => ({
      ...prev,
      [id]: [],
    }));

    setSidebarOpen(false);
  }, []);

  const buildAssistantText = (payload) => {
    if (!payload) return "";

    if (typeof payload === "string") {
      return payload;
    }

    if (payload.message) return payload.message;
    if (payload.detail) return payload.detail;
    if (payload.text) return payload.text;
    if (payload.response) return payload.response;

    return "";
  };

  const handleSendMessage = useCallback(
    async (content) => {
      if (!content.trim()) return;

      let sessionId = activeSessionId;

      if (!sessionId) {
        const id = generateId();

        setSessions((prev) => [
          {
            id,
            title:
              content.length > 20
                ? `${content.substring(0, 20)}...`
                : content,
            timestamp: new Date(),
          },
          ...prev,
        ]);

        setActiveSessionId(id);

        setMessagesBySession((prev) => ({
          ...prev,
          [id]: [],
        }));

        sessionId = id;
      }

      const currentSessionId = sessionId;

      const userMsg = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessagesBySession((prev) => ({
        ...prev,
        [currentSessionId]: [
          ...(prev[currentSessionId] || []),
          userMsg,
        ],
      }));

      setIsTyping(true);

      try {
        if (!authService.isAuthenticated()) {
          throw new Error(
            "برای استفاده از AI باید وارد شوید."
          );
        }

        const result = await planService.generatePlan({
          prompt: content,
        });

        const reply =
          buildAssistantText(result) ||
          "پاسخی دریافت شد. در حال آماده‌سازی است.";

        const aiMsg = {
          id: generateId(),
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        };

        setMessagesBySession((prev) => ({
          ...prev,
          [currentSessionId]: [
            ...(prev[currentSessionId] || []),
            aiMsg,
          ],
        }));
      } catch (error) {
        const aiMsg = {
          id: generateId(),
          role: "assistant",
          content:
            error.message ||
            "خطا در ارتباط با سرویس AI",
          timestamp: new Date(),
        };

        setMessagesBySession((prev) => ({
          ...prev,
          [currentSessionId]: [
            ...(prev[currentSessionId] || []),
            aiMsg,
          ],
        }));
      } finally {
        setIsTyping(false);
      }
    },
    [activeSessionId]
  );

  const activeMessages =
    activeSessionId &&
    messagesBySession[activeSessionId]
      ? messagesBySession[activeSessionId]
      : [];

  return (
    <div
      dir="ltr"
      className="
        fixed
        inset-0
        flex
        w-full
        overflow-hidden
        bg-[#02070c]
        text-white
      "
    >
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          width: 100%;
          height: 100%;
          margin: 0;
          overflow: hidden;
        }

        .ai-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .ai-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .ai-scrollbar::-webkit-scrollbar-thumb {
          background: #182733;
          border-radius: 999px;
        }

        .ai-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #234050;
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          scrollbar-width: none;
        }
      `}</style>

      {/* MOBILE BACKDROP */}

      <div
        onClick={() => setSidebarOpen(false)}
        className={`
          fixed
          inset-0
          z-40
          bg-black/75
          backdrop-blur-sm
          transition-opacity
          duration-300
          md:hidden
          ${
            sidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      {/* SIDEBAR */}

      <aside
        className={`
          fixed
          left-0
          top-0
          bottom-0
          z-50
          flex
          flex-col
          bg-[#03080d]
          border-r
          border-cyan-400/[0.08]
          transition-all
          duration-300
          ease-out

          ${
            sidebarOpen
              ? "w-[285px]"
              : "w-[76px]"
          }

          max-md:w-[285px]
          max-md:max-w-[86vw]

          ${
            sidebarOpen
              ? "max-md:translate-x-0"
              : "max-md:-translate-x-full"
          }
        `}
      >

        {/* SIDEBAR HEADER */}

        <div
          className={`
            h-[86px]
            shrink-0
            border-b
            border-cyan-400/[0.08]
            flex
            items-center
            ${
              sidebarOpen
                ? "justify-between px-5"
                : "justify-center"
            }
          `}
        >
          <button
            type="button"
            onClick={() =>
              setSidebarOpen((prev) => !prev)
            }
            className="
              group
              relative
              shrink-0
              h-14
              w-14
              rounded-2xl
              border
              border-cyan-400/[0.12]
              bg-[#071019]
              flex
              items-center
              justify-center
              overflow-hidden
              transition-all
              duration-200
              hover:border-cyan-400/30
              hover:bg-[#0b1720]
              hover:shadow-[0_0_25px_rgba(0,210,255,0.10)]
              hover:scale-[1.03]
              active:scale-95
            "
          >
            <img
              src="/apex-logo-new-cropped.svg.png"
              alt="APEX"
              className="
                h-11
                w-11
                object-contain
              "
            />
          </button>

          {sidebarOpen && (
            <div
              dir="rtl"
              className="
                flex
                flex-col
                items-end
                min-w-0
                ml-3
              "
            >
              <span
                className="
                  text-sm
                  font-bold
                  text-white
                  truncate
                "
              >
                {userProfile.name}
              </span>

              <span
                className="
                  mt-1
                  text-[10px]
                  text-cyan-400
                "
              >
                Apex AI
              </span>
            </div>
          )}
        </div>

        {/* CHAT SIDEBAR */}

        <div
          className="
            flex-1
            min-h-0
            overflow-y-auto
            ai-scrollbar
            px-2
          "
        >
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onNewChat={handleNewChat}
            onSelectSession={(id) => {
              setActiveSessionId(id);
              setSidebarOpen(false);
            }}
            onDeleteSession={handleDeleteSession}
            isOpen={sidebarOpen}
          />
        </div>

        {/* اینجا عمداً footer حذف شده */}
      </aside>

      {/* MAIN */}

      <main
        className={`
          flex
          min-w-0
          flex-1
          flex-col
          h-full
          overflow-hidden
          transition-all
          duration-300

          ${
            sidebarOpen
              ? "md:ml-[285px]"
              : "md:ml-[76px]"
          }
        `}
        dir="rtl"
      >
        <ChatArea
          messages={activeMessages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          onToggleNavPanel={() =>
            setNavPanelOpen((prev) => !prev)
          }
        />
      </main>

      <AiNavPanel
        isOpen={navPanelOpen}
        onClose={() => setNavPanelOpen(false)}
      />
    </div>
  );
};

export default AiChat;