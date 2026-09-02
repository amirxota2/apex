import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiMinus, FiPlus, FiUser, FiClock, FiEye, FiCalendar, FiBarChart2, FiStar } from "react-icons/fi";
import { Target, Flame, ClipboardCheck, Trophy } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import { userService } from "../services/userService";
import { authService } from "../services/authService";

const LEARNING_STYLE_OPTIONS = [
  ["visual", "بصری"],
  ["auditory", "شنیداری"],
  ["reading", "خواندن/نوشتن"],
  ["kinesthetic", "جنبشی"],
];

const GENDER_OPTIONS = [
  ["male", "مرد"],
  ["female", "زن"],
  ["other", "سایر"],
];

const toFormModel = (data) => ({
  name: data?.name || "",
  friendly_name: data?.friendly_name || "",
  learning_style: data?.learning_style || "",
  focus_span_minutes: data?.focus_span_minutes ?? "",
  coach_persona: data?.coach_persona || "",
  daily_screen_time: data?.daily_screen_time ?? "",
  age: data?.age ?? "",
  gender: data?.gender || "",
});

const formatWithUnit = (value, unit) => {
  if (value === null || value === undefined || value === "") return "—";
  return `${value} ${unit}`;
};

const fieldCardClass = (isActive) =>
  `group relative rounded-3xl border p-6 transition-all duration-300 ${
    isActive
      ? "border-[#00f2ea]/35 bg-[#111d33] shadow-[0_12px_40px_rgba(0,242,234,0.12)]"
      : "border-white/5 bg-[#121826] hover:border-white/15 hover:-translate-y-0.5"
  }`;

const FieldIcon = ({ icon: Icon }) => (
  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00f2ea]/10 text-[#00f2ea] shrink-0">
    <Icon size={16} />
  </span>
);

const NumberStepper = ({ value, onChange, step, min = 0, unitLabel }) => {
  const decrease = () => {
    const current = Number(value);
    const safeCurrent = Number.isFinite(current) ? current : 0;
    onChange(Math.max(min, safeCurrent - step));
  };

  const increase = () => {
    const current = Number(value);
    const safeCurrent = Number.isFinite(current) ? current : 0;
    onChange(Math.max(min, safeCurrent + step));
  };

  return (
    <div className="mt-3 rounded-2xl border border-[#00f2ea]/25 bg-[#0f1728] p-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={decrease}
          className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10"
          aria-label="کاهش مقدار"
        >
          <FiMinus className="mx-auto" />
        </button>

        <div className="flex-1 rounded-xl border border-white/10 bg-[#080f1f] px-3 py-1.5">
          <input
            type="number"
            value={value}
            min={min}
            step={step}
            onChange={(e) => onChange(e.target.value)}
            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none w-full bg-transparent text-center text-lg font-black tracking-wide text-white outline-none"
            style={{ MozAppearance: "textfield" }}
          />
        </div>

        <button
          type="button"
          onClick={increase}
          className="h-9 w-9 rounded-xl border border-[#00f2ea]/35 bg-[#00f2ea]/10 text-[#00f2ea] hover:bg-[#00f2ea]/20"
          aria-label="افزایش مقدار"
        >
          <FiPlus className="mx-auto" />
        </button>
      </div>

      <p className="mt-2 text-[11px] text-gray-500">
        گام تغییر: {step} {unitLabel}
      </p>
    </div>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [bio, setBio] = useState(() => localStorage.getItem("profileBio") || "");
  const [editingBio, setEditingBio] = useState(false);

  // عکس آواتار - همون کلید localStorage که بقیه سایت (مثل نوار بالای صفحه اصلی) استفاده می‌کنه
  const [avatarImage, setAvatarImage] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userProfile") || "{}").image || null;
    } catch {
      return null;
    }
  });
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("لطفاً یک فایل تصویری انتخاب کنید.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result;

      setAvatarImage(dataUrl);

      const saved = JSON.parse(localStorage.getItem("userProfile") || "{}");
      localStorage.setItem(
        "userProfile",
        JSON.stringify({ ...saved, image: dataUrl })
      );

      window.dispatchEvent(new Event("profileUpdate"));
    };

    reader.readAsDataURL(file);

    // امکان انتخاب دوباره همان عکس
    event.target.value = "";
  };

  useEffect(() => {
    localStorage.setItem("profileBio", bio);
  }, [bio]);

  // آمار زیر پروفایل - فعلاً نمایشی/ثابت هستن چون بک‌اند فعلی endpoint جداگانه‌ای براشون نداره
  const stats = [
    { label: "اهداف تکمیل‌شده", value: 12, icon: Target },
    { label: "روزهای متوالی", value: 7, icon: Flame },
    { label: "وظایف انجام‌شده", value: 34, icon: ClipboardCheck },
    { label: "امتیاز کل", value: 1250, icon: Trophy },
  ];

  const getInitials = (name) => {
    const trimmed = (name || "").trim();
    if (!trimmed) return "A";
    const parts = trimmed.split(" ");
    return (parts.length >= 2 ? parts[0][0] + parts[1][0] : trimmed.slice(0, 2)).toUpperCase();
  };

  useEffect(() => {
    const token = authService.isAuthenticated() ? "session" : "";
    if (!token) {
      setError("برای مشاهدهٔ پروفایل لطفاً وارد شوید.");
      return;
    }

    let ignore = false;
    setIsLoading(true);
    setError("");

    userService
      .getProfile()
      .then((data) => {
        if (!ignore) {
          setProfile(data || null);
          setForm(toFormModel(data));
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "خطا در دریافت پروفایل");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const learningStyleLabel = useMemo(() => {
    const map = {
      visual: "بصری",
      auditory: "شنیداری",
      reading: "خواندن/نوشتن",
      kinesthetic: "جنبشی",
    };
    if (!profile || !profile.learning_style) return "—";
    return map[profile.learning_style] || profile.learning_style;
  }, [profile]);

  const genderLabel = useMemo(() => {
    const map = {
      male: "مرد",
      female: "زن",
      other: "سایر",
    };
    if (!profile || !profile.gender) return "—";
    return map[profile.gender] || profile.gender;
  }, [profile]);

  const handleChange = (key) => (next) => {
    const value = next?.target ? next.target.value : next;
    setForm((s) => ({ ...s, [key]: value }));
  };

  const openFieldEditor = (field) => {
    setEditing(true);
    setEditingField(field);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditingField(null);
    setForm(toFormModel(profile));
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    const token = authService.isAuthenticated() ? "session" : "";
    if (!token) {
      setError("برای ذخیره تغییرات لطفاً وارد شوید.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    const buildPayload = (includeGender) => ({
      ...(form.name ? { name: form.name } : {}),
      ...(form.friendly_name ? { friendly_name: form.friendly_name } : {}),
      ...(form.learning_style ? { learning_style: form.learning_style } : {}),
      ...(form.focus_span_minutes !== "" ? { focus_span_minutes: Number(form.focus_span_minutes) } : {}),
      ...(form.coach_persona ? { coach_persona: form.coach_persona } : {}),
      ...(form.daily_screen_time !== "" ? { daily_screen_time: Number(form.daily_screen_time) } : {}),
      ...(form.age !== "" ? { age: Number(form.age) } : {}),
      ...(includeGender && form.gender ? { gender: form.gender } : {}),
    });

    try {
      let successMessage = "پروفایل با موفقیت به‌روزرسانی شد";
      let payload = buildPayload(true);
      let updated;

      try {
        updated = await userService.updateProfile(payload);
      } catch (firstError) {
        if (!("gender" in payload)) {
          throw firstError;
        }
        const fallbackPayload = buildPayload(false);
        if (Object.keys(fallbackPayload).length === 0) {
          setSuccess("فیلد جنسیت در API فعلی پشتیبانی نمی‌شود.");
          setEditing(false);
          setEditingField(null);
          setForm(toFormModel(profile));
          window.setTimeout(() => setSuccess(""), 2500);
          return;
        }
        updated = await userService.updateProfile(fallbackPayload);
        payload = fallbackPayload;
        successMessage = "پروفایل ذخیره شد. فیلد جنسیت فعلاً در API پشتیبانی نمی‌شود.";
      }

      setSuccess(successMessage);

      const nextProfile = updated ? { ...(profile || {}), ...updated } : { ...(profile || {}), ...payload };

      setProfile(nextProfile);
      setForm(toFormModel(nextProfile));
      setEditing(false);
      setEditingField(null);
      window.setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      setError(err.message || "خطا در ذخیره پروفایل");
    } finally {
      setIsSaving(false);
    }
  };

  const isEditingField = (key) => editing && editingField === key;

  return (
    <div className="min-h-screen bg-[#080c14] text-white font-vazir p-4 md:p-6" dir="rtl">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <DashboardSidebar />

        <div className="lg:col-span-10">
          <div className="relative bg-[#0d121d] border border-white/5 rounded-[2rem] p-6 md:p-10 shadow-2xl overflow-hidden">
            {/* نشان apex - همان عکس خودت، با هاله نور سفید و فیروزه‌ای */}
            <div className="hidden md:block pointer-events-none select-none absolute -top-8 left-0 w-60 lg:w-80 opacity-95">
              <div
                className="absolute rounded-full"
                style={{
                  width: "300px",
                  height: "260px",
                  left: "48%",
                  top: "52%",
                  transform: "translate(-50%, -50%)",
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.34) 0%, rgba(220,250,255,0.20) 22%, rgba(0,242,234,0.16) 42%, transparent 70%)",
                  filter: "blur(38px)",
                }}
              />
              <div
                className="absolute rounded-full bg-white/25"
                style={{
                  width: "180px",
                  height: "180px",
                  left: "50%",
                  top: "45%",
                  transform: "translate(-50%, -50%)",
                  filter: "blur(75px)",
                }}
              />
              <img
                src="/apex-logo-new-cropped.svg.png"
                alt=""
                className="relative w-full h-auto opacity-95 drop-shadow-[0_0_28px_rgba(255,255,255,0.32)]"
              />
            </div>

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                {/* آواتار بزرگ + بج ویرایش نام + بج دوربین */}
                <div className="relative shrink-0">
                  <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#00f2ea]/40 bg-[#00f2ea]/10 text-2xl md:text-3xl font-black text-[#00f2ea] shadow-[0_0_25px_rgba(0,242,234,0.15)]">
                    {avatarImage ? (
                      <img src={avatarImage} alt="آواتار" className="h-full w-full object-cover" />
                    ) : (
                      getInitials(profile?.friendly_name || profile?.name)
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing((prev) => !prev)}
                    aria-label="ویرایش پروفایل"
                    className="absolute -bottom-1 -left-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#00f2ea] text-black shadow-lg hover:brightness-110 transition-all"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <label
                    htmlFor="profile-image-upload"
                    aria-label="انتخاب عکس پروفایل"
                    title="انتخاب عکس پروفایل از کامپیوتر"
                    className="absolute -top-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#0d121d] border border-[#00f2ea]/40 text-[#00f2ea] shadow-lg hover:bg-[#00f2ea]/10 transition-all"
                  >
                    <FiEdit2 size={14} />
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-1">
                  <h2 className="text-xl md:text-2xl font-black mb-1">
                    سلام، {profile?.friendly_name || profile?.name || "کاربر"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditing((prev) => !prev)}
                    className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500 hover:text-[#00f2ea] transition-colors"
                  >
                    <FiEdit2 size={12} />
                    ویرایش سریع و دقیق اطلاعات
                  </button>
                </div>
              </div>

              {editing ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10"
                  >
                    لغو
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-2xl bg-[#00f2ea] text-black font-black hover:brightness-110 disabled:opacity-60"
                  >
                    {isSaving ? "در حال ذخیره..." : "ذخیره"}
                  </button>
                </div>
              ) : null}
            </div>

            {(isLoading || error || success) && (
              <div
                className={`mt-6 rounded-2xl px-4 py-3 text-xs border ${
                  error
                    ? "bg-red-500/10 border-red-500/25 text-red-200"
                    : success
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-200"
                    : "bg-[#121826] border-white/5 text-gray-400"
                }`}
              >
                {isLoading ? "در حال دریافت اطلاعات پروفایل..." : error || success}
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={fieldCardClass(isEditingField("name"))}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FieldIcon icon={FiUser} />
                    <p className="text-xs text-gray-400">نام</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openFieldEditor("name")}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ✎
                  </button>
                </div>
                {isEditingField("name") ? (
                  <input
                    value={form.name}
                    onChange={handleChange("name")}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-[#0f1728] px-3 py-2.5 text-lg font-bold outline-none focus:border-[#00f2ea]/40"
                  />
                ) : (
                  <p className="text-lg font-bold mt-3">{profile?.name || "—"}</p>
                )}
              </div>

              <div className={fieldCardClass(isEditingField("friendly_name"))}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FieldIcon icon={FiUser} />
                    <p className="text-xs text-gray-400">نام نمایشی</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openFieldEditor("friendly_name")}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ✎
                  </button>
                </div>
                {isEditingField("friendly_name") ? (
                  <input
                    value={form.friendly_name}
                    onChange={handleChange("friendly_name")}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-[#0f1728] px-3 py-2.5 text-lg font-bold outline-none focus:border-[#00f2ea]/40"
                  />
                ) : (
                  <p className="text-lg font-bold mt-3">{profile?.friendly_name || "—"}</p>
                )}
              </div>

              <div className={fieldCardClass(isEditingField("learning_style"))}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FieldIcon icon={FiEye} />
                    <p className="text-xs text-gray-400">سبک یادگیری</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openFieldEditor("learning_style")}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ✎
                  </button>
                </div>
                {isEditingField("learning_style") ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {LEARNING_STYLE_OPTIONS.map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((s) => ({ ...s, learning_style: value }))}
                        className={`rounded-xl px-3 py-1.5 text-sm border transition-colors ${
                          form.learning_style === value
                            ? "border-[#00f2ea] bg-[#00f2ea] text-black font-bold"
                            : "border-white/10 bg-white/5 text-gray-200 hover:border-[#00f2ea]/40"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg font-bold mt-3">{learningStyleLabel}</p>
                )}
              </div>

              <div className={fieldCardClass(isEditingField("focus_span_minutes"))}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FieldIcon icon={FiClock} />
                    <p className="text-xs text-gray-400">مدت تمرکز (دقیقه)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openFieldEditor("focus_span_minutes")}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ✎
                  </button>
                </div>
                {isEditingField("focus_span_minutes") ? (
                  <NumberStepper
                    value={form.focus_span_minutes}
                    onChange={handleChange("focus_span_minutes")}
                    step={5}
                    unitLabel="دقیقه"
                  />
                ) : (
                  <p className="text-lg font-bold mt-3">{formatWithUnit(profile?.focus_span_minutes, "دقیقه")}</p>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className={fieldCardClass(isEditingField("coach_persona"))}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FieldIcon icon={FiStar} />
                    <p className="text-xs text-gray-400">شخصیت کوچ</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openFieldEditor("coach_persona")}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ✎
                  </button>
                </div>
                {isEditingField("coach_persona") ? (
                  <input
                    value={form.coach_persona}
                    onChange={handleChange("coach_persona")}
                    className="mt-3 w-full rounded-xl border border-white/10 bg-[#0f1728] px-3 py-2.5 text-lg font-bold outline-none focus:border-[#00f2ea]/40"
                  />
                ) : (
                  <p className="text-lg font-bold mt-3">{profile?.coach_persona || "—"}</p>
                )}
              </div>

              <div className={fieldCardClass(isEditingField("daily_screen_time"))}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FieldIcon icon={FiBarChart2} />
                    <p className="text-xs text-gray-400">میانگین استفاده (ساعت)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openFieldEditor("daily_screen_time")}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ✎
                  </button>
                </div>
                {isEditingField("daily_screen_time") ? (
                  <NumberStepper
                    value={form.daily_screen_time}
                    onChange={handleChange("daily_screen_time")}
                    step={1}
                    unitLabel="ساعت"
                  />
                ) : (
                  <p className="text-lg font-bold mt-3">{formatWithUnit(profile?.daily_screen_time, "ساعت")}</p>
                )}
              </div>

              <div className={fieldCardClass(isEditingField("age"))}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FieldIcon icon={FiCalendar} />
                    <p className="text-xs text-gray-400">سن</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openFieldEditor("age")}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ✎
                  </button>
                </div>
                {isEditingField("age") ? (
                  <NumberStepper value={form.age} onChange={handleChange("age")} step={1} unitLabel="سال" />
                ) : (
                  <p className="text-lg font-bold mt-3">{profile?.age ?? "—"}</p>
                )}
              </div>

              <div className={fieldCardClass(isEditingField("gender"))}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FieldIcon icon={FiUser} />
                    <p className="text-xs text-gray-400">جنسیت</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openFieldEditor("gender")}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ✎
                  </button>
                </div>
                {isEditingField("gender") ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {GENDER_OPTIONS.map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((s) => ({ ...s, gender: value }))}
                        className={`rounded-xl px-3 py-1.5 text-sm border transition-colors ${
                          form.gender === value
                            ? "border-[#00f2ea] bg-[#00f2ea] text-black font-bold"
                            : "border-white/10 bg-white/5 text-gray-200 hover:border-[#00f2ea]/40"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg font-bold mt-3">{genderLabel}</p>
                )}
              </div>
            </div>

            {/* درباره شما - فقط لوکال ذخیره می‌شه چون API فعلی فیلد بیو نداره */}
            <div className="mt-6 rounded-3xl border border-white/5 bg-[#121826] p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBio((prev) => !prev)}
                    aria-label="ویرایش بیو"
                    className="text-gray-400 hover:text-white"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <p className="text-sm font-bold">درباره شما</p>
                </div>
              </div>
              {editingBio ? (
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  onBlur={() => setEditingBio(false)}
                  autoFocus
                  rows={3}
                  placeholder="درباره خودتان بنویسید..."
                  className="w-full resize-none rounded-2xl border border-[#00f2ea]/30 bg-[#0f1728] px-4 py-3 text-sm text-gray-200 outline-none focus:border-[#00f2ea]/60"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingBio(true)}
                  className="w-full rounded-2xl border border-white/5 bg-[#0f1728] px-4 py-3 text-right text-sm text-gray-500 hover:border-white/15 transition-colors"
                >
                  {bio || "درباره خودتان بنویسید..."}
                </button>
              )}
            </div>

            {/* آمار سریع - نمایشی، فعلاً بدون اتصال به API */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-3xl border border-white/5 bg-[#121826] p-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#00f2ea]/10 text-[#00f2ea]">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-lg font-black leading-none">{value.toLocaleString("fa-IR")}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Profile;
 