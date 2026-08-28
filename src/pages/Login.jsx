import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { isMockMode } from "../config/env";
import { authService } from "../services/authService";

const normalizePhone = (value) =>
  String(value || "")
    .trim()
    .replace(/[۰-۹]/g, (digit) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(digit)])
    .replace(/[٠-٩]/g, (digit) => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(digit)])
    .replace(/\s+/g, "");

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const [authMode, setAuthMode] = useState(isMockMode ? "password" : "google");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(isMockMode ? "test@example.com" : "");
  const [password, setPassword] = useState(isMockMode ? "password123" : "");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const completeLogin = useCallback((session) => {
    onLogin(session);
    navigate("/dashboard");
  }, [navigate, onLogin]);

  const handleGoogleCredential = useCallback(async (response) => {
    setLoading(true);
    setError("");
    try {
      if (!response?.credential) throw new Error("توکن ورود گوگل دریافت نشد.");
      completeLogin(await authService.loginWithGoogle(response.credential));
    } catch (loginError) {
      setError(loginError.message || "ورود با گوگل انجام نشد.");
    } finally {
      setLoading(false);
    }
  }, [completeLogin]);

  useEffect(() => {
    if (isMockMode || authMode !== "google") return undefined;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError("VITE_GOOGLE_CLIENT_ID برای ورود با گوگل تنظیم نشده است.");
      return undefined;
    }

    const renderButton = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({ client_id: clientId, callback: handleGoogleCredential });
      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline", size: "large", text: "continue_with", shape: "pill", width: 320,
      });
    };

    const existingScript = document.getElementById("google-oauth");
    if (existingScript) {
      renderButton();
      return undefined;
    }

    const script = document.createElement("script");
    script.id = "google-oauth";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    script.onerror = () => setError("بارگذاری سرویس گوگل انجام نشد.");
    document.body.appendChild(script);
    return () => script.remove();
  }, [authMode, handleGoogleCredential]);

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      completeLogin(await authService.login({ email, password, name }));
    } catch (loginError) {
      setError(loginError.message || "ورود انجام نشد.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSend = async () => {
    const normalizedPhone = normalizePhone(phone);
    if (!/^09\d{9}$/.test(normalizedPhone)) {
      setError("شماره موبایل باید مانند 09123456789 باشد.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await authService.sendOtp(normalizedPhone);
      setOtpSent(true);
      setInfo(result?.debug_code ? `کد آزمایشی: ${result.debug_code}` : "کد تایید ارسال شد.");
    } catch (sendError) {
      setError(sendError.message || "ارسال کد انجام نشد.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    setLoading(true);
    setError("");
    try {
      completeLogin(await authService.verifyOtp(normalizePhone(phone), code));
    } catch (verifyError) {
      setError(verifyError.message || "تایید کد انجام نشد.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubClick = () => {
    setError("");
    setInfo("ورود با گیت‌هاب به‌زودی فعال می‌شود.");
  };

  const inputBase =
    "w-full bg-[#0d121d] border-2 border-white/5 rounded-2xl py-4 pr-12 pl-4 outline-none focus:border-[#00f2ea]/50 transition-colors";

  return (
    <div className="min-h-screen bg-[#020608] text-white font-vazir relative overflow-hidden flex items-center justify-center p-6" dir="rtl">
      {/* پس‌زمینه نورانی برند (رنگ دست‌نخورده از نسخه اول) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#00f2ea]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#00c2ff]/10 rounded-full blur-[120px]" />
      </div>

      {/* کمان‌های دکوراتیو + ستاره‌های پخش‌شده روی کل صفحه (اضافه‌شده از نسخه بعدی) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute -bottom-24 -left-24 opacity-30" width="520" height="520" viewBox="0 0 520 520" fill="none">
          {[80, 160, 240, 320, 400].map((r) => (
            <circle key={r} cx="0" cy="520" r={r} stroke="white" strokeOpacity="0.14" fill="none" />
          ))}
        </svg>
        {[...Array(60)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              top: `${(i * 17) % 100}%`,
              left: `${(i * 29) % 100}%`,
              opacity: 0.12 + (i % 5) * 0.09,
            }}
          />
        ))}
      </div>

      {/* نشان انتزاعی قله - سیگنیچر برند apex، فقط در صفحه‌های بزرگ (لایه‌دار با ریبون نورانی، همون رنگ فیروزه‌ای نسخه اول) */}
      <div
        className="hidden lg:block fixed pointer-events-none"
        style={{ left: "calc(50% + 220px)", top: "50%", transform: "translateY(-50%)" }}
      >
        <div
          className="absolute rounded-full bg-[#00f2ea] opacity-20"
          style={{ width: "420px", height: "420px", left: "50%", top: "55%", transform: "translate(-50%, -50%)", filter: "blur(90px)" }}
        />
        <svg width="460" height="500" viewBox="0 0 200 200" fill="none" className="relative">
          <defs>
            <linearGradient id="sideLogoLeftFace" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#12222a" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#050a0d" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="sideLogoRightFace" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d1a1f" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#04080a" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="sideLogoSwoosh" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#00f2ea" stopOpacity="0.3" />
              <stop offset="55%" stopColor="#7dfff9" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
          </defs>

          <path d="M100 14 L15 178 L68 178 L100 95 Z" fill="url(#sideLogoLeftFace)" stroke="#00f2ea" strokeOpacity="0.5" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M100 14 L185 178 L132 178 L100 95 Z" fill="url(#sideLogoRightFace)" stroke="#00f2ea" strokeOpacity="0.5" strokeWidth="1.6" strokeLinejoin="round" />

          <path
            d="M38 172 C 66 152, 90 124, 106 98 C 114 85, 122 79, 150 84 L 152 94 C 128 90, 120 96, 110 112 C 96 136, 74 160, 46 182 Z"
            fill="url(#sideLogoSwoosh)" opacity="0.9"
          />

          <circle cx="100" cy="14" r="3" fill="#ffffff" />
        </svg>
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-xl"
      >
        ←
      </button>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            {/* آرم apex + هاله نور (هاله بیرون از SVG با CSS blur، چون داخل SVG توسط viewBox بریده می‌شد) */}
            <div className="relative mb-1 flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full bg-[#00f2ea] blur-3xl opacity-50" />
              <svg className="w-24 h-24 relative" viewBox="0 0 200 200" fill="none">
                <defs>
                  <linearGradient id="loginLogoLeftFace" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#12222a" />
                    <stop offset="100%" stopColor="#050a0d" />
                  </linearGradient>
                  <linearGradient id="loginLogoRightFace" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d1a1f" />
                    <stop offset="100%" stopColor="#04080a" />
                  </linearGradient>
                  <linearGradient id="loginLogoSwoosh" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00f2ea" stopOpacity="0.35" />
                    <stop offset="55%" stopColor="#7dfff9" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* فیس چپ و راست (بدنه سه‌بعدی مثلث با فضای خالی وسط) */}
                <path d="M100 14 L15 178 L68 178 L100 95 Z" fill="url(#loginLogoLeftFace)" stroke="#00f2ea" strokeOpacity="0.75" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M100 14 L185 178 L132 178 L100 95 Z" fill="url(#loginLogoRightFace)" stroke="#00f2ea" strokeOpacity="0.75" strokeWidth="2.5" strokeLinejoin="round" />

                {/* ریبون نورانی خمیده (پر، نه یک خط ساده) */}
                <path
                  d="M38 172 C 66 152, 90 124, 106 98 C 114 85, 122 79, 150 84 L 152 94 C 128 90, 120 96, 110 112 C 96 136, 74 160, 46 182 Z"
                  fill="url(#loginLogoSwoosh)"
                />

                {/* نقطه نورانی نوک قله */}
                <circle cx="100" cy="14" r="3.5" fill="#ffffff" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter ltr">apex</span>
            <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase ltr mt-1">Beyond your current self</p>
          </div>

          <h1 className="text-2xl font-black text-center mb-1">خوش برگشتی</h1>
          <p className="text-gray-500 text-center text-sm mb-8">
            {isMockMode ? "برای توسعهٔ رابط کاربری، ورود آزمایشی فعال است." : "وارد حساب کاربری‌ات شو"}
          </p>

          {!isMockMode && (
            <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-white/5 rounded-2xl">
              <button type="button" onClick={() => setAuthMode("google")} className={`py-2.5 rounded-xl text-sm font-bold transition-colors ${authMode === "google" ? "bg-[#00f2ea] text-black" : "text-gray-400 hover:text-white"}`}>گوگل</button>
              <button type="button" onClick={() => setAuthMode("otp")} className={`py-2.5 rounded-xl text-sm font-bold transition-colors ${authMode === "otp" ? "bg-[#00f2ea] text-black" : "text-gray-400 hover:text-white"}`}>پیامک</button>
            </div>
          )}

          {(isMockMode || authMode === "password") && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                <input id="apex-name-field" value={name} onChange={(event) => setName(event.target.value)} placeholder="نام نمایشی (اختیاری)" className={inputBase} />
              </div>

              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ایمیل" className={`${inputBase} ltr text-left`} />
              </div>

              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="رمز عبور"
                  className={`${inputBase} pl-12 ltr text-left`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {isMockMode && <p className="rounded-xl bg-[#00f2ea]/10 px-4 py-3 text-xs text-[#00f2ea]" dir="ltr">test@example.com / password123</p>}

              <div className="flex justify-start -mt-1">
                <button type="button" className="text-xs text-gray-500 hover:text-[#00f2ea] transition-colors">رمز عبور را فراموش کرده‌اید؟</button>
              </div>

              <button
                disabled={loading}
                className="w-full bg-[#00f2ea] text-black font-black py-4 rounded-2xl text-lg shadow-[0_10px_30px_rgba(0,242,234,0.25)] hover:shadow-[0_15px_40px_rgba(0,242,234,0.4)] transition-all disabled:opacity-60"
              >
                {loading ? "در حال ورود..." : "ورود به apex"}
              </button>
            </form>
          )}

          {!isMockMode && authMode === "google" && <div ref={googleButtonRef} className="flex justify-center" />}

          {!isMockMode && authMode === "otp" && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="شماره موبایل (09123456789)" className={`${inputBase} ltr text-left`} />
              </div>
              {otpSent && (
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                  <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="کد تایید" className={`${inputBase} ltr text-left`} />
                </div>
              )}
              <button type="button" onClick={otpSent ? handleOtpVerify : handleOtpSend} disabled={loading} className="w-full bg-[#00f2ea] text-black font-black py-4 rounded-2xl disabled:opacity-60">
                {otpSent ? "تایید و ورود" : "ارسال کد"}
              </button>
            </div>
          )}

          {(isMockMode || authMode === "password") && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500 whitespace-nowrap">یا ادامه با</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAuthMode("google")}
                  disabled={isMockMode}
                  className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-2xl py-3 hover:bg-white/10 transition-colors disabled:opacity-40"
                >
                  <FcGoogle className="w-5 h-5" />
                  <span className="text-sm font-bold">گوگل</span>
                </button>
                <button
                  type="button"
                  onClick={handleGithubClick}
                  className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-2xl py-3 hover:bg-white/10 transition-colors"
                >
                  <FaGithub className="w-5 h-5" />
                  <span className="text-sm font-bold">گیت‌هاب</span>
                </button>
              </div>
            </>
          )}

          {info && <p className="mt-5 text-center text-xs text-emerald-400">{info}</p>}
          {error && <p className="mt-5 text-center text-xs text-red-400">{error}</p>}

          <p className="mt-8 text-center text-sm text-gray-500">
            حساب کاربری نداری؟{" "}
            <button type="button" onClick={() => document.getElementById("apex-name-field")?.focus()} className="text-[#00f2ea] font-bold hover:underline">
              ثبت‌نام کن
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
