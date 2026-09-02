import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { isMockMode } from "../config/env";
import { authService } from "../services/authService";

const normalizePhone = (value) =>
  String(value || "")
    .trim()
    .replace(/[۰-۹]/g, (digit) =>
      "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(digit)]
    )
    .replace(/[٠-٩]/g, (digit) =>
      "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(digit)]
    )
    .replace(/\s+/g, "");

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);

  const [authMode, setAuthMode] = useState(
    isMockMode ? "password" : "google"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState(
    isMockMode ? "test@example.com" : ""
  );
  const [password, setPassword] = useState(
    isMockMode ? "password123" : ""
  );
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* =========================================================
     LOGIN COMPLETE
  ========================================================= */

  const completeLogin = useCallback(
    (session) => {
      onLogin(session);
      navigate("/dashboard");
    },
    [navigate, onLogin]
  );

  /* =========================================================
     GOOGLE LOGIN
  ========================================================= */

  const handleGoogleCredential = useCallback(
    async (response) => {
      setLoading(true);
      setError("");

      try {
        if (!response?.credential) {
          throw new Error(
            "توکن ورود گوگل دریافت نشد."
          );
        }

        const session =
          await authService.loginWithGoogle(
            response.credential
          );

        completeLogin(session);
      } catch (loginError) {
        setError(
          loginError.message ||
            "ورود با گوگل انجام نشد."
        );
      } finally {
        setLoading(false);
      }
    },
    [completeLogin]
  );

  useEffect(() => {
    if (
      isMockMode ||
      authMode !== "google"
    ) {
      return undefined;
    }

    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setError(
        "VITE_GOOGLE_CLIENT_ID برای ورود با گوگل تنظیم نشده است."
      );

      return undefined;
    }

    const renderButton = () => {
      if (
        !window.google?.accounts?.id ||
        !googleButtonRef.current
      ) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential,
      });

      googleButtonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          width: 320,
        }
      );
    };

    const existingScript =
      document.getElementById(
        "google-oauth"
      );

    if (existingScript) {
      renderButton();
      return undefined;
    }

    const script =
      document.createElement("script");

    script.id = "google-oauth";
    script.src =
      "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = renderButton;

    script.onerror = () => {
      setError(
        "بارگذاری سرویس گوگل انجام نشد."
      );
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [
    authMode,
    handleGoogleCredential,
  ]);

  /* =========================================================
     PASSWORD LOGIN
  ========================================================= */

  const handlePasswordLogin = async (
    event
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const session =
        await authService.login({
          email,
          password,
          name,
        });

      completeLogin(session);
    } catch (loginError) {
      setError(
        loginError.message ||
          "ورود انجام نشد."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SEND OTP
  ========================================================= */

  const handleOtpSend = async () => {
    const normalizedPhone =
      normalizePhone(phone);

    if (
      !/^09\d{9}$/.test(
        normalizedPhone
      )
    ) {
      setError(
        "شماره موبایل باید مانند 09123456789 باشد."
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      const result =
        await authService.sendOtp(
          normalizedPhone
        );

      setOtpSent(true);

      setInfo(
        result?.debug_code
          ? `کد آزمایشی: ${result.debug_code}`
          : "کد تایید ارسال شد."
      );
    } catch (sendError) {
      setError(
        sendError.message ||
          "ارسال کد انجام نشد."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     VERIFY OTP
  ========================================================= */

  const handleOtpVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const session =
        await authService.verifyOtp(
          normalizePhone(phone),
          code
        );

      completeLogin(session);
    } catch (verifyError) {
      setError(
        verifyError.message ||
          "تایید کد انجام نشد."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     GITHUB
  ========================================================= */

  const handleGithubClick = () => {
    setError("");

    setInfo(
      "ورود با گیت‌هاب به‌زودی فعال می‌شود."
    );
  };

  /* =========================================================
     INPUT STYLE
  ========================================================= */

  const inputBase = `
    w-full
    bg-[#0b1019]
    border-2
    border-white/[0.07]
    rounded-2xl
    py-4
    pr-12
    pl-4
    outline-none
    text-white
    placeholder:text-gray-600
    focus:border-white/20
    focus:bg-[#0d131e]
    transition-all
  `;

  return (
    <div
      className="
        min-h-screen
        bg-[#05080e]
        text-white
        font-vazir
        relative
        overflow-hidden
        flex
        items-center
        justify-center
        p-4
        sm:p-6
      "
      dir="rtl"
    >

      {/* =====================================================
          DARK BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none">

        {/* نور بسیار ظریف بالای صفحه */}
        <div
          className="
            absolute
            top-[-20%]
            left-1/2
            -translate-x-1/2
            w-[700px]
            sm:w-[1000px]
            h-[500px]
            sm:h-[700px]
            rounded-full
            blur-[150px]
            opacity-30
          "
          style={{
            background:
              "radial-gradient(circle, rgba(36,65,95,0.28) 0%, rgba(12,25,40,0.14) 45%, transparent 72%)",
          }}
        />

        {/* نور خیلی ظریف سمت راست */}
        <div
          className="
            absolute
            right-[-15%]
            top-[25%]
            w-[500px]
            h-[500px]
            rounded-full
            blur-[150px]
            opacity-20
          "
          style={{
            background:
              "radial-gradient(circle, rgba(38,72,105,0.22), transparent 70%)",
          }}
        />

        {/* نور پایین */}
        <div
          className="
            absolute
            bottom-[-25%]
            left-[-15%]
            w-[500px]
            h-[500px]
            rounded-full
            blur-[160px]
            opacity-20
          "
          style={{
            background:
              "radial-gradient(circle, rgba(30,52,75,0.20), transparent 70%)",
          }}
        />
      </div>

      {/* =====================================================
          GRID BACKGROUND
      ====================================================== */}

      <div
        className="
          fixed
          inset-0
          pointer-events-none
          opacity-[0.16]
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.035) 1px,
              transparent 1px
            )
          `,
          backgroundSize:
            "68px 68px",
        }}
      />

      {/* =====================================================
          STARS
      ====================================================== */}

      <div
        className="
          fixed
          inset-0
          pointer-events-none
          overflow-hidden
        "
      >
        {[...Array(55)].map(
          (_, i) => (
            <span
              key={i}
              className="
                absolute
                rounded-full
                bg-white
              "
              style={{
                width: `${1 + (i % 2)}px`,
                height: `${1 + (i % 2)}px`,
                top: `${(i * 17) % 100}%`,
                left: `${(i * 29) % 100}%`,
                opacity:
                  0.08 +
                  (i % 4) * 0.06,
              }}
            />
          )
        )}
      </div>

      {/* =====================================================
          DECORATIVE ARCS
      ====================================================== */}

      <svg
        className="
          fixed
          -bottom-28
          -left-28
          opacity-[0.13]
          pointer-events-none
        "
        width="520"
        height="520"
        viewBox="0 0 520 520"
        fill="none"
      >
        {[80, 160, 240, 320, 400].map(
          (r) => (
            <circle
              key={r}
              cx="0"
              cy="520"
              r={r}
              stroke="white"
              strokeOpacity="0.18"
              fill="none"
            />
          )
        )}
      </svg>

      {/* =====================================================
          APEX LOGO - DESKTOP
      ====================================================== */}

      <div
        className="
          hidden
          lg:block
          fixed
          pointer-events-none
          z-[1]
        "
        style={{
          left: "calc(50% + 230px)",
          top: "50%",
          transform:
            "translateY(-50%)",
          width: "460px",
          height: "500px",
        }}
      >

        {/* Logo glow */}
        <div
          className="
            absolute
            rounded-full
            pointer-events-none
          "
          style={{
            width: "400px",
            height: "400px",
            left: "50%",
            top: "50%",
            transform:
              "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(85,105,150,0.16) 0%, rgba(40,55,85,0.08) 42%, transparent 72%)",
            filter:
              "blur(40px)",
          }}
        />

        {/* APEX LOGO */}
        <img
          src="/apex-logo-new-cropped.svg.png"
          alt="APEX"
          draggable="false"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-contain
          "
          style={{
            /*
             * لوگو دیگر grayscale نیست.
             * رنگ اصلی تصویر حفظ می‌شود و
             * فقط کمی روشن‌تر و واضح‌تر شده.
             */
            filter: `
              brightness(1.18)
              saturate(1.08)
              contrast(1.08)
              drop-shadow(
                0 0 12px
                rgba(100,120,180,0.20)
              )
              drop-shadow(
                0 0 35px
                rgba(55,75,120,0.14)
              )
            `,
            opacity: 0.96,
          }}
        />
      </div>

      {/* =====================================================
          BACK BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={() =>
          navigate(-1)
        }
        className="
          absolute
          top-4
          right-4
          sm:top-6
          sm:right-6
          z-30
          w-10
          h-10
          flex
          items-center
          justify-center
          rounded-full
          bg-white/[0.035]
          border
          border-white/[0.07]
          text-white/60
          hover:text-white
          hover:bg-white/[0.07]
          transition-all
          text-xl
        "
      >
        ←
      </button>

      {/* =====================================================
          LOGIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
        "
      >

        {/* ===================================================
            LOGIN CARD
        ==================================================== */}

        <div
          className="
            relative
            rounded-3xl
            p-6
            sm:p-8
            md:p-10
            overflow-hidden
            bg-[#080d14]/90
            border
            border-white/[0.09]
            shadow-[0_25px_100px_rgba(0,0,0,0.55)]
            backdrop-blur-2xl
          "
        >

          {/* Card top glow */}
          <div
            className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2
              w-72
              h-24
              blur-[70px]
              opacity-20
              pointer-events-none
            "
            style={{
              background:
                "rgba(95,115,150,0.35)",
            }}
          />

          {/* =================================================
              SMALL LOGO
          ================================================== */}

          <div
            className="
              relative
              flex
              flex-col
              items-center
              mb-8
            "
          >

            <div
              className="
                relative
                mb-1
                flex
                items-center
                justify-center
              "
            >

              {/* Logo glow */}
              <div
                className="
                  absolute
                  w-28
                  h-28
                  rounded-full
                  blur-3xl
                  opacity-25
                "
                style={{
                  background:
                    "rgba(90,110,170,0.55)",
                }}
              />

              {/* APEX LOGO */}
              <img
                src="/apex-logo-new-cropped.svg.png"
                alt="APEX"
                draggable="false"
                className="
                  w-20
                  h-20
                  sm:w-24
                  sm:h-24
                  relative
                  object-contain
                "
                style={{
                  /*
                   * پررنگ و واضح
                   * بدون فیروزه‌ای
                   */
                  filter: `
                    brightness(1.20)
                    saturate(1.10)
                    contrast(1.10)
                    drop-shadow(
                      0 0 10px
                      rgba(100,120,180,0.28)
                    )
                    drop-shadow(
                      0 0 25px
                      rgba(65,85,140,0.16)
                    )
                  `,
                  opacity: 1,
                }}
              />
            </div>

            {/* APEX */}
            <span
              className="
                text-2xl
                font-black
                tracking-tighter
                ltr
                text-white
              "
            >
              APEX
            </span>

            {/* Subtitle */}
            <p
              className="
                text-[10px]
                tracking-[0.3em]
                text-gray-500
                uppercase
                ltr
                mt-1
              "
            >
              Beyond your current self
            </p>
          </div>

          {/* =================================================
              TITLE
          ================================================== */}

          <h1
            className="
              text-2xl
              font-black
              text-center
              mb-1
            "
          >
            خوش برگشتی
          </h1>

          <p
            className="
              text-gray-500
              text-center
              text-sm
              mb-8
            "
          >
            {isMockMode
              ? "برای توسعهٔ رابط کاربری، ورود آزمایشی فعال است."
              : "وارد حساب کاربری‌ات شو"}
          </p>

          {/* =================================================
              AUTH MODE
          ================================================== */}

          {!isMockMode && (
            <div
              className="
                grid
                grid-cols-2
                gap-2
                mb-6
                p-1
                bg-white/[0.035]
                border
                border-white/[0.05]
                rounded-2xl
              "
            >
              <button
                type="button"
                onClick={() =>
                  setAuthMode("google")
                }
                className={`
                  py-2.5
                  rounded-xl
                  text-sm
                  font-bold
                  transition-all
                  ${
                    authMode === "google"
                      ? "bg-white text-black shadow-lg"
                      : "text-gray-500 hover:text-white"
                  }
                `}
              >
                گوگل
              </button>

              <button
                type="button"
                onClick={() =>
                  setAuthMode("otp")
                }
                className={`
                  py-2.5
                  rounded-xl
                  text-sm
                  font-bold
                  transition-all
                  ${
                    authMode === "otp"
                      ? "bg-white text-black shadow-lg"
                      : "text-gray-500 hover:text-white"
                  }
                `}
              >
                پیامک
              </button>
            </div>
          )}

          {/* =================================================
              PASSWORD FORM
          ================================================== */}

          {(isMockMode ||
            authMode === "password") && (
            <form
              onSubmit={
                handlePasswordLogin
              }
              className="space-y-4"
            >

              {/* Name */}
              <div className="relative">
                <User
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    w-5
                    h-5
                    text-gray-600
                    pointer-events-none
                  "
                />

                <input
                  id="apex-name-field"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="نام نمایشی (اختیاری)"
                  className={inputBase}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    w-5
                    h-5
                    text-gray-600
                    pointer-events-none
                  "
                />

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="ایمیل"
                  className={`
                    ${inputBase}
                    ltr
                    text-left
                  `}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    w-5
                    h-5
                    text-gray-600
                    pointer-events-none
                  "
                />

                <input
                  required
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="رمز عبور"
                  className={`
                    ${inputBase}
                    pl-12
                    ltr
                    text-left
                  `}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-600
                    hover:text-white
                    transition-colors
                  "
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Mock information */}
              {isMockMode && (
                <p
                  className="
                    rounded-xl
                    bg-white/[0.035]
                    border
                    border-white/[0.06]
                    px-4
                    py-3
                    text-xs
                    text-gray-400
                  "
                  dir="ltr"
                >
                  test@example.com /
                  password123
                </p>
              )}

              {/* Forgot password */}
              <div
                className="
                  flex
                  justify-start
                  -mt-1
                "
              >
                <button
                  type="button"
                  className="
                    text-xs
                    text-gray-600
                    hover:text-white
                    transition-colors
                  "
                >
                  رمز عبور را فراموش کرده‌اید؟
                </button>
              </div>

              {/* Login button */}
              <button
                disabled={loading}
                className="
                  w-full
                  bg-white
                  text-black
                  font-black
                  py-4
                  rounded-2xl
                  text-lg
                  shadow-[0_10px_35px_rgba(255,255,255,0.08)]
                  hover:bg-gray-100
                  hover:shadow-[0_15px_45px_rgba(255,255,255,0.12)]
                  transition-all
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {loading
                  ? "در حال ورود..."
                  : "ورود به APEX"}
              </button>
            </form>
          )}

          {/* =================================================
              GOOGLE LOGIN
          ================================================== */}

          {!isMockMode &&
            authMode === "google" && (
              <div
                ref={
                  googleButtonRef
                }
                className="
                  flex
                  justify-center
                "
              />
            )}

          {/* =================================================
              OTP LOGIN
          ================================================== */}

          {!isMockMode &&
            authMode === "otp" && (
              <div className="space-y-4">

                {/* Phone */}
                <div className="relative">
                  <User
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      w-5
                      h-5
                      text-gray-600
                      pointer-events-none
                    "
                  />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                      )
                    }
                    placeholder="شماره موبایل (09123456789)"
                    className={`
                      ${inputBase}
                      ltr
                      text-left
                    `}
                  />
                </div>

                {/* Code */}
                {otpSent && (
                  <div className="relative">
                    <Lock
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        w-5
                        h-5
                        text-gray-600
                        pointer-events-none
                      "
                    />

                    <input
                      value={code}
                      onChange={(event) =>
                        setCode(
                          event.target.value
                        )
                      }
                      placeholder="کد تایید"
                      className={`
                        ${inputBase}
                        ltr
                        text-left
                      `}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={
                    otpSent
                      ? handleOtpVerify
                      : handleOtpSend
                  }
                  disabled={loading}
                  className="
                    w-full
                    bg-white
                    text-black
                    font-black
                    py-4
                    rounded-2xl
                    hover:bg-gray-100
                    transition-all
                    disabled:opacity-50
                  "
                >
                  {otpSent
                    ? "تایید و ورود"
                    : "ارسال کد"}
                </button>
              </div>
            )}

          {/* =================================================
              SOCIAL BUTTONS
          ================================================== */}

          {(isMockMode ||
            authMode === "password") && (
            <>
              <div
                className="
                  flex
                  items-center
                  gap-3
                  my-6
                "
              >
                <div
                  className="
                    flex-1
                    h-px
                    bg-white/[0.08]
                  "
                />

                <span
                  className="
                    text-xs
                    text-gray-600
                    whitespace-nowrap
                  "
                >
                  یا ادامه با
                </span>

                <div
                  className="
                    flex-1
                    h-px
                    bg-white/[0.08]
                  "
                />
              </div>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                "
              >

                {/* Google */}
                <button
                  type="button"
                  onClick={() =>
                    setAuthMode("google")
                  }
                  disabled={isMockMode}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-white/[0.035]
                    border
                    border-white/[0.08]
                    rounded-2xl
                    py-3
                    hover:bg-white/[0.07]
                    hover:border-white/[0.14]
                    transition-all
                    disabled:opacity-40
                  "
                >
                  <FcGoogle className="w-5 h-5" />

                  <span
                    className="
                      text-sm
                      font-bold
                    "
                  >
                    گوگل
                  </span>
                </button>

                {/* Github */}
                <button
                  type="button"
                  onClick={
                    handleGithubClick
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-white/[0.035]
                    border
                    border-white/[0.08]
                    rounded-2xl
                    py-3
                    hover:bg-white/[0.07]
                    hover:border-white/[0.14]
                    transition-all
                  "
                >
                  <FaGithub className="w-5 h-5" />

                  <span
                    className="
                      text-sm
                      font-bold
                    "
                  >
                    گیت‌هاب
                  </span>
                </button>
              </div>
            </>
          )}

          {/* =================================================
              INFO
          ================================================== */}

          {info && (
            <p
              className="
                mt-5
                text-center
                text-xs
                text-emerald-400
              "
            >
              {info}
            </p>
          )}

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <p
              className="
                mt-5
                text-center
                text-xs
                text-red-400
              "
            >
              {error}
            </p>
          )}

          {/* =================================================
              REGISTER
          ================================================== */}

          <p
            className="
              mt-8
              text-center
              text-sm
              text-gray-600
            "
          >
            حساب کاربری نداری؟{" "}
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById(
                    "apex-name-field"
                  )
                  ?.focus()
              }
              className="
                text-white
                font-bold
                hover:text-gray-300
                hover:underline
                transition-colors
              "
            >
              ثبت‌نام کن
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;