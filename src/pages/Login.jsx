import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Github,
} from "lucide-react";

import { authService } from "../services/authService";
import { isMockMode } from "../config/env";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState(
    isMockMode ? "test@example.com" : ""
  );
  const [password, setPassword] = useState(
    isMockMode ? "password123" : ""
  );

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const session = await authService.login({
        email,
        password,
        name,
      });

      if (onLogin) {
        onLogin(session);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.message ||
          "ورود انجام نشد. اطلاعات وارد شده را بررسی کنید."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleGithubLogin = () => {
    console.log("GitHub login clicked");
  };

  return (
    <div
      dir="rtl"
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        overflow-y-auto
        bg-[#02070d]
        text-white
      "
      style={{
        fontFamily:
          "'Vazirmatn', 'IRANSans', Tahoma, Arial, sans-serif",
      }}
    >
      {/* =====================================================
          BACKGROUND
          ===================================================== */}

      <div
        className="
          fixed
          inset-0
          z-0
          bg-[#02070d]
          bg-cover
          bg-center
          bg-no-repeat
        "
        style={{
          backgroundImage: "url('/apex-login-bg.png')",
        }}
      />

      {/* =====================================================
          DARK OVERLAY
          ===================================================== */}

      <div
        className="
          fixed
          inset-0
          z-[1]
          pointer-events-none
        "
        style={{
          background: `
            linear-gradient(
              90deg,
              rgba(2,7,13,0.08) 0%,
              rgba(2,7,13,0.00) 45%,
              rgba(2,7,13,0.08) 100%
            )
          `,
        }}
      />

      {/* =====================================================
          APEX BRAND UNDER BIG LOGO - RIGHT SIDE
          فقط موقعیت این بخش تغییر کرده
          ===================================================== */}

      <div
        className="
          hidden
          lg:flex

          fixed
          z-[5]

          right-[13.5%]
          top-[76%]

          w-[360px]

          flex-col
          items-center
          justify-center

          pointer-events-none

          text-center

          select-none
        "
      >
        {/* APEX */}

        <div
          dir="ltr"
          className="
            text-[30px]

            font-black

            leading-none

            tracking-[0.30em]

            text-cyan-300

            drop-shadow-[0_0_7px_rgba(0,220,255,0.95)]
            drop-shadow-[0_0_18px_rgba(0,180,255,0.70)]
            drop-shadow-[0_0_35px_rgba(0,130,255,0.35)]
          "
        >
          APEX
        </div>

        {/* NEW GENERATION PLATFORM */}

        <div
          dir="ltr"
          className="
            mt-[10px]

            text-[7px]

            tracking-[0.43em]

            text-[#7d8997]

            uppercase

            drop-shadow-[0_0_8px_rgba(0,180,255,0.22)]
          "
        >
          NEW GENERATION PLATFORM
        </div>

        {/* HEARTBEAT */}

        <div
          className="
            relative

            mt-[10px]

            w-[155px]
            h-[21px]

            flex
            items-center
            justify-center

            overflow-visible
          "
        >
          <svg
            viewBox="0 0 180 30"
            className="
              w-full
              h-full

              overflow-visible

              drop-shadow-[0_0_5px_rgba(0,220,255,0.95)]
              drop-shadow-[0_0_12px_rgba(0,200,255,0.55)]
              drop-shadow-[0_0_25px_rgba(0,180,255,0.25)]
            "
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main heartbeat line */}

            <path
              d="
                M0 15
                H48
                L58 15
                L64 12
                L70 18
                L76 15
                H83
                L88 15
                L93 4
                L99 26
                L105 15
                H112
                L118 15
                L124 12
                L130 18
                L136 15
                H180
              "
              stroke="rgba(0,220,255,0.90)"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glow */}

            <path
              d="
                M0 15
                H48
                L58 15
                L64 12
                L70 18
                L76 15
                H83
                L88 15
                L93 4
                L99 26
                L105 15
                H112
                L118 15
                L124 12
                L130 18
                L136 15
                H180
              "
              stroke="rgba(0,220,255,0.25)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* =====================================================
          BACK BUTTON
          ===================================================== */}

      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="بازگشت"
        className="
          fixed
          z-50

          top-7
          right-7

          w-14
          h-14

          rounded-full

          flex
          items-center
          justify-center

          bg-[#07101a]/60
          backdrop-blur-xl

          border
          border-white/[0.09]

          text-white/80

          hover:text-white
          hover:bg-[#091521]/80
          hover:border-cyan-300/30

          hover:shadow-[0_0_25px_rgba(0,200,255,0.12)]

          transition-all
          duration-200

          shadow-[0_0_25px_rgba(0,0,0,0.25)]
        "
      >
        <ArrowLeft
          size={22}
          strokeWidth={1.5}
        />
      </button>

      {/* =====================================================
          MAIN
          ===================================================== */}

      <main
        className="
          relative
          z-10

          min-h-screen
          w-full

          flex
          items-center

          px-4
          py-6

          lg:block
        "
      >
        {/* ===================================================
            LOGIN CARD
            =================================================== */}

        <section
          className="
            relative

            w-full
            max-w-[460px]

            mx-auto

            lg:absolute
            lg:left-[19.7%]
            lg:top-1/2
            lg:-translate-y-1/2

            rounded-[22px]

            bg-[#07121d]/[0.84]

            backdrop-blur-[25px]

            border
            border-white/[0.10]

            px-[24px]
            py-[18px]

            shadow-[0_30px_90px_rgba(0,0,0,0.65)]

            overflow-hidden
          "
        >
          {/* INNER BLUE ATMOSPHERE */}

          <div
            className="
              pointer-events-none

              absolute
              inset-0

              rounded-[22px]

              shadow-[inset_0_0_45px_rgba(0,170,255,0.035)]
            "
          />

          {/* TOP BLUE LINE */}

          <div
            className="
              absolute

              top-0
              left-1/2

              -translate-x-1/2

              w-[160px]

              h-[1px]

              bg-cyan-200/80

              rounded-full

              shadow-[0_0_8px_rgba(0,220,255,1),0_0_22px_rgba(0,180,255,0.8),0_0_45px_rgba(0,150,255,0.35)]
            "
          />

          {/* LEFT BLUE EDGE LIGHT */}

          <div
            className="
              pointer-events-none

              absolute
              left-0
              top-[70px]

              w-[1px]
              h-[310px]

              bg-cyan-300/20

              shadow-[0_0_12px_rgba(0,210,255,0.8),0_0_30px_rgba(0,180,255,0.35)]
            "
          />

          {/* RIGHT BLUE EDGE LIGHT */}

          <div
            className="
              pointer-events-none

              absolute
              right-0
              top-[100px]

              w-[1px]
              h-[310px]

              bg-cyan-300/15

              shadow-[0_0_12px_rgba(0,210,255,0.7),0_0_30px_rgba(0,180,255,0.3)]
            "
          />

          {/* =================================================
              SYSTEM ONLINE
              ================================================= */}

          <div
            className="
              relative

              flex
              justify-center

              mb-[12px]
            "
          >
            <div
              dir="ltr"
              className="
                h-[25px]

                px-[15px]

                rounded-full

                flex
                items-center
                justify-center
                gap-[7px]

                border
                border-cyan-300/20

                bg-[#07141e]/80

                text-[7px]

                font-bold

                tracking-[0.12em]

                text-cyan-300

                shadow-[0_0_18px_rgba(0,200,255,0.08)]
              "
            >
              <span
                className="
                  w-[5px]
                  h-[5px]

                  rounded-full

                  bg-cyan-300

                  shadow-[0_0_8px_rgba(0,240,255,1),0_0_15px_rgba(0,200,255,0.8)]
                "
              />

              SYSTEM ONLINE
            </div>
          </div>

          {/* =================================================
              SMALL LOGO
              ================================================= */}

          <div
            className="
              relative

              flex
              flex-col
              items-center

              mb-[14px]
            "
          >
            <div
              className="
                absolute

                top-[10px]

                w-[65px]
                h-[50px]

                rounded-full

                bg-cyan-400/[0.11]

                blur-[24px]

                pointer-events-none
              "
            />

            <div
              className="
                absolute

                top-[17px]

                w-[40px]
                h-[35px]

                rounded-full

                bg-cyan-300/[0.10]

                blur-[15px]

                pointer-events-none
              "
            />

            <img
              src="/apex-logo-new-cropped.svg.png"
              alt="APEX Logo"
              className="
                relative
                z-10

                w-[55px]
                h-[65px]

                object-contain

                drop-shadow-[0_0_7px_rgba(0,220,255,0.90)]
                drop-shadow-[0_0_17px_rgba(0,180,255,0.55)]
                drop-shadow-[0_0_30px_rgba(0,130,255,0.28)]
              "
            />
          </div>

          {/* =================================================
              TITLE
              ================================================= */}

          <div
            className="
              relative

              flex
              justify-center
            "
          >
            <div
              className="
                absolute

                left-1/2
                top-1/2

                -translate-x-1/2
                -translate-y-1/2

                w-[270px]
                h-[55px]

                rounded-full

                bg-white/[0.055]

                blur-[27px]

                pointer-events-none
              "
            />

            <div
              className="
                absolute

                left-1/2
                top-1/2

                -translate-x-1/2
                -translate-y-1/2

                w-[220px]
                h-[38px]

                bg-cyan-300/[0.035]

                blur-[20px]

                pointer-events-none
              "
            />

            <h1
              className="
                relative
                z-10

                text-center

                text-[34px]

                leading-[1.2]

                font-black

                tracking-[-0.05em]

                text-white

                mb-[1px]

                drop-shadow-[0_0_5px_rgba(255,255,255,0.35)]
                drop-shadow-[0_0_15px_rgba(255,255,255,0.18)]
              "
            >
              خوش برگشتی
            </h1>
          </div>

          {/* SUBTITLE */}

          <p
            className="
              text-center

              text-[10px]

              leading-[1.7]

              text-[#929ba7]

              mb-[8px]
            "
          >
            برای توسعه رابط کاربری،{" "}
            <span
              className="
                text-cyan-300

                drop-shadow-[0_0_7px_rgba(0,220,255,0.55)]
              "
            >
              ورود آزمایشی
            </span>{" "}
            فعال است.
          </p>

          {/* BLUE DIVIDER */}

          <div
            className="
              flex
              items-center
              justify-center

              mb-[12px]
            "
          >
            <div
              className="
                relative

                w-[125px]

                h-px

                bg-cyan-300/45

                shadow-[0_0_8px_rgba(0,220,255,0.75),0_0_20px_rgba(0,200,255,0.35)]
              "
            >
              <span
                className="
                  absolute

                  left-1/2
                  top-1/2

                  -translate-x-1/2
                  -translate-y-1/2

                  w-[5px]
                  h-[5px]

                  rounded-full

                  bg-cyan-200

                  shadow-[0_0_7px_rgba(0,240,255,1),0_0_16px_rgba(0,200,255,0.8)]
                "
              />
            </div>
          </div>

          {/* =================================================
              FORM
              ================================================= */}

          <form
            onSubmit={handleLogin}
            className="space-y-[8px]"
          >
            {/* NAME */}

            <div className="relative group">
              <div
                className="
                  pointer-events-none

                  absolute
                  right-[14px]
                  -top-[7px]

                  z-20

                  px-[8px]
                  py-[2px]

                  rounded-[5px]

                  bg-[#07121d]

                  border
                  border-cyan-300/20

                  text-[7px]

                  text-cyan-300

                  opacity-0
                  group-hover:opacity-100
                  focus-within:opacity-100

                  translate-y-[3px]
                  group-hover:translate-y-0
                  focus-within:translate-y-0

                  shadow-[0_0_15px_rgba(0,200,255,0.12)]

                  transition-all
                  duration-200
                "
              >
                نام نمایشی
              </div>

              <User
                size={16}
                strokeWidth={1.5}
                className="
                  absolute
                  right-[15px]
                  top-1/2
                  -translate-y-1/2

                  text-[#718093]

                  pointer-events-none
                  z-10

                  group-hover:text-cyan-300
                  group-focus-within:text-cyan-300

                  transition-colors
                "
              />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام نمایشی (اختیاری)"
                className="
                  w-full
                  h-[48px]

                  rounded-[13px]

                  bg-[#06101a]/75

                  border
                  border-white/[0.095]

                  text-white
                  text-[11px]

                  placeholder:text-[#687483]

                  pr-[44px]
                  pl-4

                  outline-none

                  hover:border-cyan-300/25

                  focus:border-cyan-300/50

                  focus:bg-[#08131e]

                  hover:shadow-[0_0_18px_rgba(0,200,255,0.06)]
                  focus:shadow-[0_0_25px_rgba(0,200,255,0.12)]

                  transition-all
                  duration-200
                "
              />
            </div>

            {/* EMAIL */}

            <div className="relative group">
              <div
                className="
                  pointer-events-none

                  absolute
                  right-[14px]
                  -top-[7px]

                  z-20

                  px-[8px]
                  py-[2px]

                  rounded-[5px]

                  bg-[#07121d]

                  border
                  border-cyan-300/20

                  text-[7px]

                  text-cyan-300

                  opacity-0

                  group-hover:opacity-100
                  focus-within:opacity-100

                  translate-y-[3px]

                  group-hover:translate-y-0
                  focus-within:translate-y-0

                  shadow-[0_0_15px_rgba(0,200,255,0.12)]

                  transition-all
                  duration-200
                "
              >
                ایمیل
              </div>

              <Mail
                size={16}
                strokeWidth={1.5}
                className="
                  absolute
                  right-[15px]
                  top-1/2
                  -translate-y-1/2

                  text-[#718093]

                  pointer-events-none
                  z-10

                  group-hover:text-cyan-300
                  group-focus-within:text-cyan-300

                  transition-colors
                "
              />

              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ایمیل"
                dir="ltr"
                className="
                  w-full
                  h-[48px]

                  rounded-[13px]

                  bg-[#06101a]/75

                  border
                  border-white/[0.095]

                  text-white
                  text-[11px]

                  placeholder:text-[#687483]

                  pr-[44px]
                  pl-4

                  outline-none

                  text-left

                  hover:border-cyan-300/25

                  focus:border-cyan-300/50

                  focus:bg-[#08131e]

                  hover:shadow-[0_0_18px_rgba(0,200,255,0.06)]
                  focus:shadow-[0_0_25px_rgba(0,200,255,0.12)]

                  transition-all
                  duration-200
                "
              />
            </div>

            {/* PASSWORD */}

            <div className="relative group">
              <div
                className="
                  pointer-events-none

                  absolute
                  right-[14px]
                  -top-[7px]

                  z-20

                  px-[8px]
                  py-[2px]

                  rounded-[5px]

                  bg-[#07121d]

                  border
                  border-cyan-300/20

                  text-[7px]

                  text-cyan-300

                  opacity-0

                  group-hover:opacity-100
                  focus-within:opacity-100

                  translate-y-[3px]

                  group-hover:translate-y-0
                  focus-within:translate-y-0

                  shadow-[0_0_15px_rgba(0,200,255,0.12)]

                  transition-all
                  duration-200
                "
              >
                رمز عبور
              </div>

              <Lock
                size={16}
                strokeWidth={1.5}
                className="
                  absolute
                  right-[15px]
                  top-1/2
                  -translate-y-1/2

                  text-[#718093]

                  pointer-events-none
                  z-10

                  group-hover:text-cyan-300
                  group-focus-within:text-cyan-300

                  transition-colors
                "
              />

              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور"
                dir="ltr"
                className="
                  w-full
                  h-[48px]

                  rounded-[13px]

                  bg-[#06101a]/75

                  border
                  border-white/[0.095]

                  text-white
                  text-[11px]

                  placeholder:text-[#687483]

                  pr-[44px]
                  pl-[44px]

                  outline-none

                  text-left

                  hover:border-cyan-300/25

                  focus:border-cyan-300/50

                  focus:bg-[#08131e]

                  hover:shadow-[0_0_18px_rgba(0,200,255,0.06)]
                  focus:shadow-[0_0_25px_rgba(0,200,255,0.12)]

                  transition-all
                  duration-200
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                aria-label={
                  showPassword
                    ? "مخفی کردن رمز"
                    : "نمایش رمز"
                }
                className="
                  absolute

                  left-[15px]
                  top-1/2

                  -translate-y-1/2

                  text-[#718093]

                  hover:text-cyan-300

                  transition-colors

                  z-20
                "
              >
                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>

            {/* TEST LOGIN */}

            <div
              dir="ltr"
              className="
                w-full

                h-[36px]

                rounded-[10px]

                flex
                items-center

                px-[14px]

                bg-white/[0.035]

                border
                border-white/[0.065]

                text-[9px]

                text-[#bbc2cc]

                shadow-[inset_0_0_18px_rgba(255,255,255,0.008)]
              "
            >
              test@example.com / password123
            </div>

            {/* FORGOT PASSWORD */}

            <div
              className="
                flex
                justify-start

                pt-[1px]
              "
            >
              <button
                type="button"
                className="
                  text-[9px]

                  text-[#697482]

                  hover:text-cyan-300

                  transition-colors
                "
              >
                رمز عبور را فراموش کرده‌اید؟
              </button>
            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
                group

                relative

                w-full

                h-[50px]

                rounded-[13px]

                bg-white

                text-[#07101a]

                font-black

                text-[13px]

                flex
                items-center
                justify-center

                shadow-[0_7px_20px_rgba(255,255,255,0.08),0_8px_35px_rgba(0,190,255,0.12)]

                hover:bg-[#f7fcff]

                hover:shadow-[0_10px_30px_rgba(255,255,255,0.10),0_12px_45px_rgba(0,200,255,0.24)]

                active:scale-[0.99]

                transition-all

                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "در حال ورود..."
                : "ورود به APEX"}

              {!loading && (
                <ArrowLeft
                  size={18}
                  strokeWidth={2}
                  className="
                    absolute

                    left-[16px]

                    group-hover:-translate-x-1

                    transition-transform
                  "
                />
              )}
            </button>
          </form>

          {/* =================================================
              SOCIAL DIVIDER
              ================================================= */}

          <div
            className="
              flex
              items-center

              gap-3

              my-[12px]
            "
          >
            <div
              className="
                flex-1
                h-px
                bg-white/[0.065]
              "
            />

            <span
              className="
                text-[8px]

                text-[#687382]

                whitespace-nowrap
              "
            >
              یا ادامه با
            </span>

            <div
              className="
                flex-1
                h-px
                bg-white/[0.065]
              "
            />
          </div>

          {/* =================================================
              GOOGLE + GITHUB
              ================================================= */}

          <div
            className="
              grid
              grid-cols-2

              gap-[8px]
            "
          >
            {/* GOOGLE */}

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="
                h-[40px]

                rounded-[10px]

                border
                border-white/[0.075]

                bg-white/[0.025]

                flex
                items-center
                justify-center

                gap-[7px]

                text-[#d7dce2]

                text-[10px]

                font-bold

                hover:bg-white/[0.055]

                hover:border-cyan-300/20

                hover:text-white

                transition-all

                active:scale-[0.98]
              "
            >
              <span
                dir="ltr"
                className="
                  flex
                  items-center
                  justify-center

                  w-[21px]
                  h-[21px]

                  rounded-full

                  text-[12px]

                  font-bold

                  bg-white

                  text-[#4285F4]

                  shadow-[0_0_8px_rgba(255,255,255,0.08)]
                "
              >
                G
              </span>

              <span>
                Google
              </span>
            </button>

            {/* GITHUB */}

            <button
              type="button"
              onClick={handleGithubLogin}
              className="
                h-[40px]

                rounded-[10px]

                border
                border-white/[0.075]

                bg-white/[0.025]

                flex
                items-center
                justify-center

                gap-[7px]

                text-[#d7dce2]

                text-[10px]

                font-bold

                hover:bg-white/[0.055]

                hover:border-cyan-300/20

                hover:text-white

                transition-all

                active:scale-[0.98]
              "
            >
              <Github
                size={16}
                strokeWidth={1.8}
              />

              <span>
                GitHub
              </span>
            </button>
          </div>

          {/* =================================================
              ERROR
              ================================================= */}

          {error && (
            <div
              className="
                mt-[8px]

                rounded-[9px]

                border
                border-red-400/10

                bg-red-400/[0.04]

                px-3
                py-2

                text-center

                text-[9px]

                text-red-400
              "
            >
              {error}
            </div>
          )}

          {/* =================================================
              REGISTER
              ================================================= */}

          <p
            className="
              mt-[11px]

              text-center

              text-[9px]

              text-[#697482]
            "
          >
            حساب کاربری نداری؟{" "}

            <button
              type="button"
              onClick={() => {}}
              className="
                text-white

                font-bold

                hover:text-cyan-300

                transition-colors
              "
            >
              ثبت‌نام کن
            </button>
          </p>
        </section>
      </main>
    </div>
  );
};

export default Login;