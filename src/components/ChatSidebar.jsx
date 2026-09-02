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
      {/* ===============================
          NEW CHAT
      =============================== */}

      <button
        type="button"
        onClick={onNewChat}
        title={!isOpen ? "گفتگوی جدید" : undefined}
        className={`
          group
          flex
          items-center
          justify-center
          rounded-2xl
          border
          border-white/[0.08]
          bg-[#111111]
          text-white
          transition-all
          duration-200

          hover:bg-[#181818]
          hover:border-white/[0.15]

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
            text-gray-300
            group-hover:text-white
            transition-colors
          "
        />

        {isOpen && (
          <span className="text-sm font-medium">
            گفتگوی جدید
          </span>
        )}
      </button>

      {/* ===============================
          HISTORY
      =============================== */}

      {isOpen && (
        <div className="px-2 pt-4 pb-2">
          <p className="text-[11px] text-gray-600">
            تاریخچه
          </p>
        </div>
      )}

      {/* ===============================
          EMPTY
      =============================== */}

      {sessions.length === 0 && isOpen && (
        <div
          className="
            mt-8
            px-3
            text-center
          "
        >
          <div
            className="
              mx-auto
              mb-3
              h-10
              w-10
              rounded-xl
              bg-white/[0.025]
              border
              border-white/[0.06]
              flex
              items-center
              justify-center
            "
          >
            <MessageSquare
              size={17}
              className="text-gray-600"
            />
          </div>

          <p className="text-xs text-gray-600">
            گفتگویی ثبت نشده است.
          </p>
        </div>
      )}

      {/* ===============================
          SESSIONS
      =============================== */}

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
                items-center
                cursor-pointer
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
                    ? "bg-white/[0.08] border border-white/[0.10] text-white"
                    : "border border-transparent text-gray-500 hover:bg-white/[0.04] hover:text-gray-300"
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
                      ? "text-white"
                      : "text-gray-500"
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
                      onDeleteSession(session.id);
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