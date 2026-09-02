import { NavLink } from "react-router-dom";
import {
  Bot,
  ClipboardList,
  LayoutDashboard,
  Target,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";

const AiNavPanel = ({
  isOpen,
  onClose,
}) => {
  const linkBase =
    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200";

  const active =
    "bg-white/[0.08] text-white border border-white/[0.12]";

  const idle =
    "text-gray-400 border border-transparent hover:border-white/[0.07] hover:bg-white/[0.04] hover:text-white";

  return (
    <>
      {/* OVERLAY */}

      <button
        type="button"
        onClick={onClose}
        aria-label="بستن منو"
        className={`
          fixed
          inset-0
          z-[100]
          bg-black/65
          backdrop-blur-[2px]
          transition-opacity
          duration-300
          ${
            isOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* PANEL */}

      <aside
        dir="rtl"
        className={`
          fixed
          right-0
          top-0
          z-[110]
          flex
          h-[100dvh]
          w-[300px]
          max-w-[88vw]
          flex-col
          border-l
          border-white/[0.08]
          bg-[#0b0b0b]
          p-4
          shadow-[-25px_0_70px_rgba(0,0,0,0.55)]
          transition-transform
          duration-300
          ease-out

          ${
            isOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-[#171717]
                text-sm
                font-black
              "
            >
              A
            </div>

            <p className="text-sm font-bold text-white">
              Apex
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-white/[0.08]
              bg-white/[0.03]
              text-gray-400
              transition
              hover:bg-white/[0.07]
              hover:text-white
            "
          >
            <X size={17} />
          </button>
        </div>

        {/* LINKS */}

        <nav className="space-y-1.5">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? active : idle
              }`
            }
          >
            <LayoutDashboard size={17} />
            داشبورد
          </NavLink>

          <NavLink
            to="/goals"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? active : idle
              }`
            }
          >
            <Target size={17} />
            اهداف
          </NavLink>

          <NavLink
            to="/tasks"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? active : idle
              }`
            }
          >
            <ClipboardList size={17} />
            چک‌لیست
          </NavLink>

          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? active : idle
              }`
            }
          >
            <UserRound size={17} />
            پروفایل
          </NavLink>

          <NavLink
            to="/growth"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? active : idle
              }`
            }
          >
            <TrendingUp size={17} />
            تحلیل رشد
          </NavLink>

          <NavLink
            to="/ai"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkBase} ${
                isActive ? active : idle
              }`
            }
          >
            <Bot size={17} />
            صفحه AI
          </NavLink>
        </nav>

        {/* FOOTER */}

        <div className="mt-auto border-t border-white/[0.06] pt-4">
          <p className="px-2 text-[10px] text-gray-600">
            دسترسی سریع به صفحات پنل
          </p>
        </div>
      </aside>
    </>
  );
};

export default AiNavPanel;