import { useState } from "react";
import {
  Menu,
  Home,
  Target,
  ClipboardList,
  User,
  ChartNoAxesCombined,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { authService } from "../services/authService";
import AiNavPanel from "./AiNavPanel";

const DashboardSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // =========================
  // NAV LINK STYLES
  // =========================

  const linkBase =
    "flex items-center justify-between gap-4 w-full h-[54px] px-4 rounded-xl text-[15px] transition-all duration-200";

  const active =
    "bg-[#00f2ea]/10 text-[#00f2ea] font-bold shadow-[0_0_22px_rgba(0,242,234,0.06)]";

  const idle =
    "text-gray-400 hover:text-white hover:bg-white/[0.045]";

  return (
    <>
      {/* =========================
          MOBILE MENU BUTTON
      ========================== */}

      <div className="lg:hidden fixed right-4 top-4 z-40">
        <button
          type="button"
          aria-label="باز کردن منوی پنل"
          onClick={() => setMobileOpen(true)}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-[#0d121d]/95
            text-gray-200
            shadow-[0_0_25px_rgba(0,0,0,0.35)]
            transition-all
            hover:bg-white/10
            hover:text-[#00f2ea]
          "
        >
          <Menu size={20} />
        </button>
      </div>

      {/* =========================
          MOBILE PANEL
      ========================== */}

      <AiNavPanel
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}

      <aside
        className="
          hidden
          lg:flex
          lg:flex-col
          lg:col-span-2
          lg:sticky
          lg:top-4
          lg:self-start
          lg:h-[calc(100vh-32px)]
          lg:min-h-[620px]
        "
      >
        {/* =========================
            SIDEBAR BOX
        ========================== */}

        <div
          className="
            w-full
            max-w-[220px]
            h-full
            rounded-[20px]
            border
            border-white/[0.09]
            bg-[#080d15]/90
            backdrop-blur-xl
            shadow-[0_15px_55px_rgba(0,0,0,0.28)]
            flex
            flex-col
            px-4
            py-5
            overflow-hidden
          "
        >
          {/* =========================
              LOGO
          ========================== */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-2.5
              mb-8
              px-1
              flex-shrink-0
            "
          >
            {/* Apex */}

            <span
              className="
                text-[19px]
                font-black
                italic
                tracking-[-0.5px]
                text-white
                ltr
              "
            >
              Apex
            </span>

            {/* A Logo */}

            <div
              className="
                w-10
                h-10
                rounded-[10px]
                bg-[#00f2ea]
                flex
                items-center
                justify-center
                text-black
                text-[17px]
                font-black
                shadow-[0_0_20px_rgba(0,242,234,0.32)]
                flex-shrink-0
              "
            >
              A
            </div>
          </div>

          {/* =========================
              NAVIGATION
          ========================== */}

          <nav className="flex flex-col gap-1.5 flex-shrink-0">
            {/* Dashboard */}

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : idle}`
              }
            >
              <span>داشبورد</span>

              <Home
                size={20}
                strokeWidth={1.7}
              />
            </NavLink>

            {/* Goals */}

            <NavLink
              to="/goals"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : idle}`
              }
            >
              <span>اهداف</span>

              <Target
                size={20}
                strokeWidth={1.7}
              />
            </NavLink>

            {/* Tasks */}

            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : idle}`
              }
            >
              <span>چک‌لیست</span>

              <ClipboardList
                size={20}
                strokeWidth={1.7}
              />
            </NavLink>

            {/* Profile */}

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : idle}`
              }
            >
              <span>پروفایل</span>

              <User
                size={20}
                strokeWidth={1.7}
              />
            </NavLink>

            {/* Growth */}

            <NavLink
              to="/growth"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : idle}`
              }
            >
              <span>تحلیل رشد</span>

              <ChartNoAxesCombined
                size={20}
                strokeWidth={1.7}
              />
            </NavLink>

            {/* AI */}

            <NavLink
              to="/ai"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : idle}`
              }
            >
              <span>استفاده از AI</span>

              <Bot
                size={20}
                strokeWidth={1.7}
              />
            </NavLink>
          </nav>

          {/* =========================
              BOTTOM SECTION
          ========================== */}

          <div className="mt-auto pt-5 flex-shrink-0">
            {/* Divider */}

            <div
              className="
                w-full
                h-px
                bg-white/[0.055]
                mb-4
              "
            />

            {/* Settings */}

            <button
              type="button"
              className="
                flex
                items-center
                justify-between
                gap-4
                w-full
                h-[54px]
                px-4
                rounded-xl
                text-[15px]
                text-gray-400
                hover:text-white
                hover:bg-white/[0.045]
                transition-all
              "
            >
              <span>تنظیمات</span>

              <Settings
                size={20}
                strokeWidth={1.7}
              />
            </button>

            {/* Logout */}

            <button
              type="button"
              onClick={() => {
                authService.logout();
                window.location.href = "/";
              }}
              className="
                flex
                items-center
                justify-between
                gap-4
                w-full
                h-[54px]
                px-4
                rounded-xl
                text-[15px]
                font-medium
                text-red-400/80
                hover:text-red-400
                hover:bg-red-400/[0.05]
                transition-all
              "
            >
              <span>خروج از پنل</span>

              <LogOut
                size={20}
                strokeWidth={1.7}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;