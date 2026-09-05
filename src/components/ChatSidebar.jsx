import {
  MessageSquare,
  Plus,
  Trash2,
} from "lucide-react";

const ChatSidebar = ({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  isOpen,
}) => {
  return (
    <div
      dir="rtl"
      className="
        py-4
        space-y-2
      "
    >

      {/* ================= NEW CHAT ================= */}

      <button
        type="button"
        onClick={onNewChat}
        title={
          !isOpen
            ? "گفتگوی جدید"
            : undefined
        }
        className={`
          group
          flex
          items-center
          justify-center
          rounded-2xl
          border
          border-cyan-400/[0.10]
          bg-[#071018]
          text-white
          transition-all
          duration-200

          hover:bg-[#0a151e]
          hover:border-cyan-400/25
          hover:shadow-[0_0_25px_rgba(0,210,255,0.06)]

          ${
            isOpen
              ? "w-full gap-3 px-4 py-3"
              : "mx-auto h-12 w-12"
          }
        `}
      >
        <Plus
          size={18}
          strokeWidth={1.8}
          className="
            text-gray-400
            group-hover:text-cyan-300
            transition-colors
          "
        />

        {isOpen && (
          <span
            className="
              text-sm
              font-medium
            "
          >
            گفتگوی جدید
          </span>
        )}
      </button>

      {/* ================= HISTORY ================= */}

      {isOpen && (
        <div
          className="
            px-2
            pt-5
            pb-2
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <span className="text-[11px] text-gray-600">
              تاریخچه
            </span>

            <span
              className="
                h-1
                w-1
                rounded-full
                bg-cyan-400
              "
            />
          </div>
        </div>
      )}

      {/* ================= EMPTY ================= */}

      {sessions.length === 0 && isOpen && (
        <div
          className="
            mt-10
            px-3
            text-center
          "
        >
          <div
            className="
              mx-auto
              mb-3
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-cyan-400/[0.07]
              bg-cyan-400/[0.025]
            "
          >
            <MessageSquare
              size={17}
              className="text-gray-600"
            />
          </div>

          <p
            className="
              text-xs
              text-gray-600
            "
          >
            گفتگویی ثبت نشده است.
          </p>
        </div>
      )}

      {/* ================= SESSIONS ================= */}

      <div className="space-y-1">
        {sessions.map((session) => {
          const active =
            activeSessionId === session.id;

          return (
            <div
              key={session.id}
              onClick={() =>
                onSelectSession(session.id)
              }
              title={
                !isOpen
                  ? session.title
                  : undefined
              }
              className={`
                group
                flex
                cursor-pointer
                items-center
                rounded-xl
                transition-all
                duration-200

                ${
                  isOpen
                    ? "gap-3 px-3 py-3"
                    : "mx-auto h-11 w-11 justify-center"
                }

                ${
                  active
                    ? `
                      border
                      border-cyan-400/[0.16]
                      bg-cyan-400/[0.06]
                      text-white
                      shadow-[0_0_20px_rgba(0,210,255,0.04)]
                    `
                    : `
                      border
                      border-transparent
                      text-gray-500
                      hover:bg-white/[0.035]
                      hover:text-gray-300
                    `
                }
              `}
            >
              <MessageSquare
                size={15}
                strokeWidth={1.8}
                className={`
                  shrink-0
                  ${
                    active
                      ? "text-cyan-400"
                      : "text-gray-600"
                  }
                `}
              />

              {isOpen && (
                <>
                  <span
                    className="
                      flex-1
                      min-w-0
                      truncate
                      text-sm
                    "
                  >
                    {session.title}
                  </span>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteSession(
                        session.id
                      );
                    }}
                    className="
                      shrink-0
                      rounded-lg
                      p-1.5
                      text-gray-600
                      opacity-0
                      group-hover:opacity-100
                      hover:bg-red-500/10
                      hover:text-red-400
                      transition-all
                    "
                    aria-label="حذف گفتگو"
                  >
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;