import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import GoalCard from "../components/GoalCard";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [enteringPanel, setEnteringPanel] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ==========================================
  // ENTER PANEL
  // ==========================================

  const handleEnterPanel = () => {
    if (enteringPanel) return;

    setEnteringPanel(true);

    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);
  };

  // ==========================================
  // PROFILE
  // ==========================================

  const getInitials = (name) => {
    if (!name) return "??";

    const parts = name.trim().split(" ");

    return parts.length >= 2
      ? parts[0][0] + parts[1][0]
      : name.slice(0, 2);
  };

  const savedProfile = JSON.parse(
    localStorage.getItem("userProfile") || "{}"
  );

  const userImage = savedProfile.image;
  const userName = savedProfile.name || "کاربر";

  return (
    <div
      className="
        min-h-screen
        bg-[#010509]
        text-white
        font-vazir
        relative
        overflow-x-hidden
        selection:bg-[#00f2ea]/30
      "
      dir="rtl"
    >

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

        {/* MAIN IMAGE */}

        <div
          className="
            absolute
            inset-0
            bg-no-repeat
            bg-cover
            bg-center-top
          "
          style={{
            backgroundImage:
              "url('/65b4dd3a-57d1-47d6-b89a-60419d1d0d93.png')",
            backgroundPosition: "center top",
          }}
        />

        {/* DARK OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-[#02070d]/5
            via-[#010509]/10
            to-[#010509]
          "
        />

        {/* SIDE DARKNESS */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(1,5,9,0.5)_75%,rgba(1,5,9,0.9)_100%)]
          "
        />

        {/* CENTER LIGHT */}

        <div
          className="
            absolute
            top-[5%]
            left-1/2
            -translate-x-1/2
            w-[700px]
            h-[450px]
            bg-[#00f2ea]/10
            blur-[140px]
            rounded-full
          "
        />

        {/* ORANGE LIGHT */}

        <div
          className="
            absolute
            bottom-[-15%]
            right-[-10%]
            w-[500px]
            h-[500px]
            bg-[#ff9d42]/[0.035]
            blur-[140px]
            rounded-full
          "
        />
      </div>

      {/* =====================================================
          PANEL ENTER ANIMATION
      ===================================================== */}

      {enteringPanel && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-[#010509]/90
            backdrop-blur-xl
            animate-[fadeIn_0.3s_ease-out]
          "
        >
          <div className="flex flex-col items-center">

            {/* APEX ICON */}

            <div
              className="
                relative
                w-20
                h-20
                rounded-3xl
                bg-[#00f2ea]
                flex
                items-center
                justify-center
                text-black
                shadow-[0_0_70px_rgba(0,242,234,0.6)]
                animate-pulse
              "
            >
              <svg
                className="w-10 h-10"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            {/* APEX */}

            <div
              className="
                mt-6
                text-2xl
                font-black
                tracking-[0.35em]
                text-white
              "
              dir="ltr"
            >
              APEX
            </div>

            {/* STATUS */}

            <div
              className="
                mt-4
                flex
                items-center
                gap-2
                text-sm
                text-[#00f2ea]
                font-medium
              "
            >
              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-[#00f2ea]
                  shadow-[0_0_12px_rgba(0,242,234,0.8)]
                  animate-pulse
                "
              />

              در حال ورود به پنل
            </div>

            {/* LOADING BAR */}

            <div
              className="
                mt-7
                w-48
                h-1
                rounded-full
                bg-white/10
                overflow-hidden
              "
            >
              <div
                className="
                  h-full
                  bg-[#00f2ea]
                  shadow-[0_0_15px_rgba(0,242,234,0.8)]
                  animate-[loading_1.2s_ease-in-out_forwards]
                "
              />
            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative z-10">

        {/* =====================================================
            NAVBAR
        ===================================================== */}

        <nav
          className={`
            fixed
            top-0
            right-0
            left-0
            z-50
            transition-all
            duration-300
            px-8
            ${
              scrolled
                ? "bg-[#020608]/75 backdrop-blur-xl py-4 border-b border-white/5"
                : "py-6"
            }
          `}
        >
          <div
            className="
              max-w-7xl
              mx-auto
              flex
              justify-between
              items-center
            "
          >

            {/* LOGO + PROFILE */}

            <div className="flex items-center gap-3">

              {/* PROFILE */}

              <Link
                to="/profile"
                className="
                  w-10
                  h-10
                  rounded-full
                  border-2
                  border-[#00f2ea]/40
                  hover:border-[#00f2ea]
                  hover:scale-110
                  hover:shadow-[0_0_20px_rgba(0,242,234,0.5)]
                  transition-all
                  duration-300
                  p-0.5
                  overflow-hidden
                  block
                  bg-[#020b10]
                "
              >
                {userImage ? (
                  <img
                    src={userImage}
                    alt="profile"
                    className="
                      w-full
                      h-full
                      rounded-full
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      w-full
                      h-full
                      bg-gradient-to-br
                      from-[#00f2ea]
                      to-[#00c2ff]
                      rounded-full
                      flex
                      items-center
                      justify-center
                      text-[10px]
                      font-black
                      text-black
                    "
                  >
                    {getInitials(userName)}
                  </div>
                )}
              </Link>

              {/* APEX */}

              <span
                className="
                  text-2xl
                  font-black
                  tracking-tighter
                  ltr
                "
              >
                Apex
              </span>

              {/* LIGHTNING */}

              <div
                className="
                  bg-[#00f2ea]
                  p-1.5
                  rounded-lg
                  text-black
                  shadow-[0_0_25px_rgba(0,242,234,0.45)]
                "
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

            </div>

            {/* NAV LINKS */}

            <div
              className="
                hidden
                md:flex
                items-center
                gap-12
                text-gray-400
                font-medium
                text-sm
              "
            >
              <a
                href="#features"
                className="
                  hover:text-[#00f2ea]
                  transition-colors
                "
              >
                امکانات
              </a>

              <a
                href="#pricing"
                className="
                  hover:text-[#00f2ea]
                  transition-colors
                "
              >
                قیمت‌ها
              </a>

              <a
                href="#about"
                className="
                  hover:text-[#00f2ea]
                  transition-colors
                "
              >
                درباره ما
              </a>
            </div>

            {/* LOGIN */}

            <button
              onClick={handleEnterPanel}
              disabled={enteringPanel}
              className="
                px-8
                py-3
                rounded-2xl
                border
                border-[#00f2ea]/40
                bg-[#02080d]/60
                backdrop-blur-md
                text-[#00f2ea]
                font-black
                text-sm
                shadow-[0_0_20px_rgba(0,242,234,0.05)]
                hover:bg-[#00f2ea]
                hover:text-black
                hover:border-[#00f2ea]
                hover:shadow-[0_0_30px_rgba(0,242,234,0.35)]
                transition-all
                duration-300
                active:scale-95
                disabled:opacity-70
                disabled:cursor-wait
              "
            >
              {enteringPanel
                ? "در حال ورود..."
                : "ورود به پنل"}
            </button>

          </div>
        </nav>

        {/* =====================================================
            HERO
        ===================================================== */}

        <main
          className="
            min-h-screen
            flex
            flex-col
            items-center
            justify-center
            text-center
            px-5
            pt-44
            pb-20
            relative
          "
        >

          {/* HERO LIGHT */}

          <div
            className="
              absolute
              top-[38%]
              left-1/2
              -translate-x-1/2
              -translate-y-1/2
              w-[600px]
              h-[260px]
              bg-[#00f2ea]/10
              blur-[110px]
              rounded-full
              pointer-events-none
            "
          />

          {/* TITLE */}

          <h1
            className="
              relative
              z-10
              text-5xl
              sm:text-6xl
              md:text-7xl
              lg:text-[76px]
              font-black
              mb-8
              leading-[1.15]
              tracking-tight
              drop-shadow-[0_5px_30px_rgba(0,0,0,0.8)]
              translate-y-8
            "
          >
            مرزهای پتانسیل خود را

            <br />

            <span
              className="
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-[#00f2ea]
                via-[#00e8ff]
                to-[#00c2ff]
                drop-shadow-[0_0_25px_rgba(0,242,234,0.25)]
              "
            >
              جابه‌جا کنید
            </span>
          </h1>

          {/* DESCRIPTION */}

          <p
            className="
              relative
              z-10
              text-gray-200
              text-base
              sm:text-lg
              md:text-xl
              max-w-2xl
              mb-12
              leading-[2]
              font-medium
              drop-shadow-[0_3px_15px_rgba(0,0,0,0.9)]
              translate-y-8
            "
          >
            با قدرت هوش مصنوعی Apex، برنامه‌ای کاملاً اختصاصی
            برای رشد فردی، سلامتی و مهارت‌های خود داشته باشید.
          </p>

          {/* BUTTONS */}

          <div
            className="
              relative
              z-10
              flex
              flex-col
              sm:flex-row
              gap-5
              items-center
              justify-center
              translate-y-8
            "
          >

            {/* START */}

            <button
              onClick={handleEnterPanel}
              disabled={enteringPanel}
              className="
                group
                min-w-[240px]
                bg-[#00e1e8]
                text-black
                font-black
                px-10
                py-5
                rounded-2xl
                text-lg
                shadow-[0_15px_45px_rgba(0,242,234,0.28)]
                hover:bg-[#19f5ed]
                hover:shadow-[0_20px_60px_rgba(0,242,234,0.5)]
                hover:-translate-y-1
                transition-all
                duration-300
                active:scale-95
                flex
                items-center
                justify-center
                gap-5
                disabled:opacity-70
                disabled:cursor-wait
              "
            >
              <span>
                {enteringPanel
                  ? "در حال ورود..."
                  : "رایگان شروع کنید"}
              </span>

              <span
                className="
                  text-xl
                  group-hover:-translate-x-2
                  transition-transform
                  duration-300
                "
              >
                ←
              </span>
            </button>

            {/* DEMO */}

            <button
              className="
                min-w-[200px]
                px-10
                py-5
                rounded-2xl
                border
                border-white/20
                bg-white/[0.035]
                backdrop-blur-xl
                text-white
                font-bold
                text-lg
                hover:border-[#00f2ea]/60
                hover:bg-[#00f2ea]/10
                hover:text-[#00f2ea]
                hover:shadow-[0_0_30px_rgba(0,242,234,0.12)]
                hover:-translate-y-1
                transition-all
                duration-300
                active:scale-95
              "
            >
              مشاهده دمو
            </button>

          </div>

        </main>

        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section
          id="features"
          className="
            max-w-7xl
            mx-auto
            px-6
            md:px-8
            py-32
            border-t
            border-white/5
            relative
          "
        >

          <div className="text-center mb-20">

            <h2
              className="
                text-4xl
                md:text-6xl
                font-black
                mb-6
              "
            >
              ویژگی‌های{" "}

              <span
                className="
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-r
                  from-[#00f2ea]
                  to-[#00c2ff]
                "
              >
                قدرتمند
              </span>
            </h2>

            <p className="text-gray-400 text-lg">
              ابزارهایی که کمکت می‌کنن به اهدافت برسی
              و هر روز بهتر از دیروز باشی
            </p>

          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >

            <FeatureCard
              icon="🧠"
              title="تحلیل شخصیت هوشمند"
              desc="با پاسخ به چند سوال ساده، پروفایل شخصیتی منحصر به‌فردت ساخته می‌شود."
              iconBg="bg-[#00f2ea]"
              hoverColor="hover:bg-[#00f2ea]/5 hover:border-[#00f2ea]/40"
            />

            <FeatureCard
              icon="🗓"
              title="برنامه‌ریزی شخصی‌سازی شده"
              desc="برنامه روزانه و هفتگی متناسب با سبک زندگی و اهدافت دریافت کن."
              iconBg="bg-[#ff7e42]"
              hoverColor="hover:bg-[#ff7e42]/5 hover:border-[#ff7e42]/40"
            />

            <FeatureCard
              icon="✅"
              title="چک‌لیست روزانه"
              desc="تسک‌هات رو کامل کن و مثل یک بازی، پیشرفتت رو ببین."
              iconBg="bg-[#22c55e]"
              hoverColor="hover:bg-[#22c55e]/5 hover:border-[#22c55e]/40"
            />

            <FeatureCard
              icon="📈"
              title="تحلیل پیشرفت"
              desc="نمودارها و گزارش‌های بصری از رشدت در طول زمان."
              iconBg="bg-[#a855f7]"
              hoverColor="hover:bg-[#a855f7]/5 hover:border-[#a855f7]/40"
            />

            <FeatureCard
              icon="⚡"
              title="کوچ تطبیق‌پذیر"
              desc="هوش مصنوعی بر اساس عملکردت، برنامه‌ها رو بهینه می‌کنه."
              iconBg="bg-[#eab308]"
              hoverColor="hover:bg-[#eab308]/5 hover:border-[#eab308]/40"
            />

            <FeatureCard
              icon="📥"
              title="خروجی حرفه‌ای"
              desc="دانلود کن و آفلاین استفاده کن. PDF برنامه‌هات رو حرفه‌ای داشته باش."
              iconBg="bg-[#f43f5e]"
              hoverColor="hover:bg-[#f43f5e]/5 hover:border-[#f43f5e]/40"
            />

          </div>
        </section>

        {/* =====================================================
            PRICING
        ===================================================== */}

        <section
          id="pricing"
          className="
            max-w-7xl
            mx-auto
            px-6
            md:px-8
            py-24
            border-t
            border-white/5
          "
        >

          <div className="text-center mb-12">

            <h2
              className="
                text-4xl
                md:text-5xl
                font-black
                mb-4
              "
            >
              طرح‌های هوشمند
            </h2>

            <p className="text-gray-400 text-lg">
              طرحی را انتخاب کن و مسیر رشدت را سریع‌تر کن
            </p>

          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
            "
          >

            {/* STANDARD */}

            <div
              className="
                group
                relative
                overflow-hidden
                bg-white/[0.035]
                backdrop-blur-2xl
                border
                border-white/[0.12]
                rounded-[2rem]
                p-8
                text-center
                shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.18)]
                hover:bg-white/[0.055]
                hover:border-white/[0.2]
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >

              {/* GLASS LIGHT */}

              <div
                className="
                  absolute
                  -top-20
                  left-1/2
                  -translate-x-1/2
                  w-40
                  h-40
                  bg-white/5
                  blur-3xl
                  rounded-full
                  pointer-events-none
                "
              />

              <div className="relative z-10">

                <p className="text-sm text-gray-300">
                  استاندارد
                </p>

                <p className="text-4xl font-black my-5">
                  ۰
                </p>

                <p className="text-xs text-gray-400">
                  برای شروع و تجربه اولیه
                </p>

                <div className="mt-7 pt-5 border-t border-white/[0.08]">
                  <button
                    onClick={handleEnterPanel}
                    className="
                      text-[#00f2ea]
                      font-bold
                      hover:text-white
                      transition-colors
                    "
                  >
                    جزئیات بیشتر ←
                  </button>
                </div>

              </div>
            </div>

            {/* PRO */}

            <div
              className="
                group
                relative
                overflow-hidden
                bg-[#00f2ea]/[0.055]
                backdrop-blur-2xl
                border
                border-[#00f2ea]/50
                rounded-[2rem]
                p-8
                text-center
                shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_50px_rgba(0,242,234,0.12)]
                hover:bg-[#00f2ea]/[0.08]
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >

              {/* GLOW */}

              <div
                className="
                  absolute
                  -top-24
                  left-1/2
                  -translate-x-1/2
                  w-48
                  h-48
                  bg-[#00f2ea]/10
                  blur-3xl
                  rounded-full
                  pointer-events-none
                "
              />

              <div className="relative z-10">

                <div
                  className="
                    inline-flex
                    px-4
                    py-1
                    rounded-full
                    bg-[#00f2ea]/10
                    border
                    border-[#00f2ea]/20
                    text-[#00f2ea]
                    text-xs
                    font-bold
                    mb-3
                  "
                >
                  محبوب
                </div>

                <p className="text-sm text-[#00f2ea] font-bold">
                  پرو
                </p>

                <p className="text-4xl font-black my-5 ltr">
                  19$
                </p>

                <p className="text-xs text-gray-300">
                  همه امکانات هوشمند
                </p>

                <div className="mt-7 pt-5 border-t border-[#00f2ea]/10">

                  <button
                    onClick={handleEnterPanel}
                    className="
                      w-full
                      bg-[#00e1e8]
                      text-black
                      py-3
                      rounded-xl
                      font-black
                      hover:bg-[#19f5ed]
                      hover:shadow-[0_0_25px_rgba(0,242,234,0.3)]
                      transition-all
                    "
                  >
                    انتخاب این طرح
                  </button>

                </div>

              </div>
            </div>

            {/* TEAM */}

            <div
              className="
                group
                relative
                overflow-hidden
                bg-white/[0.035]
                backdrop-blur-2xl
                border
                border-white/[0.12]
                rounded-[2rem]
                p-8
                text-center
                shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_60px_rgba(0,0,0,0.18)]
                hover:bg-white/[0.055]
                hover:border-white/[0.2]
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >

              <div
                className="
                  absolute
                  -top-20
                  left-1/2
                  -translate-x-1/2
                  w-40
                  h-40
                  bg-white/5
                  blur-3xl
                  rounded-full
                  pointer-events-none
                "
              />

              <div className="relative z-10">

                <p className="text-sm text-gray-300">
                  تیمی
                </p>

                <p className="text-4xl font-black my-5 ltr">
                  69$
                </p>

                <p className="text-xs text-gray-400">
                  مناسب برای تیم‌های کوچک
                </p>

                <div className="mt-7 pt-5 border-t border-white/[0.08]">

                  <button
                    onClick={handleEnterPanel}
                    className="
                      text-[#00f2ea]
                      font-bold
                      hover:text-white
                      transition-colors
                    "
                  >
                    جزئیات بیشتر ←
                  </button>

                </div>

              </div>
            </div>

          </div>
        </section>

        {/* =====================================================
            GOALS
        ===================================================== */}

        <section
          className="
            max-w-7xl
            mx-auto
            px-6
            md:px-8
            py-24
          "
        >

          <div className="text-center mb-16">

            <h2
              className="
                text-4xl
                md:text-5xl
                font-black
                mb-6
              "
            >
              برای هر{" "}

              <span className="text-[#00f2ea]">
                هدفی
              </span>{" "}

              آماده‌ایم
            </h2>

            <p className="text-gray-400 text-lg">
              هر مسیری که انتخاب کنی، ما کنارتیم تا بهش برسی
            </p>

          </div>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >

            <GoalCard
              icon="📚"
              title="بهبود تحصیلی"
              desc="برنامه‌ریزی درسی، تمرکز بیشتر، آمادگی امتحان"
              activeColor="hover:border-blue-500/50 hover:bg-blue-500/5"
              iconBg="bg-cyan-500"
            />

            <GoalCard
              icon="</>"
              title="یادگیری مهارت"
              desc="برنامه‌نویسی، زبان جدید، مهارت‌های دیجیتال"
              activeColor="hover:border-purple-500/50 hover:bg-purple-500/5"
              iconBg="bg-purple-500"
            />

            <GoalCard
              icon="💪"
              title="ورزش و سلامت"
              desc="تناسب اندام، ورزش منظم، زندگی سالم"
              activeColor="hover:border-green-500/50 hover:bg-green-500/5"
              iconBg="bg-green-500"
            />

            <GoalCard
              icon="👥"
              title="مهارت‌های اجتماعی"
              desc="اعتماد به نفس، ارتباط موثر، رهبری"
              activeColor="hover:border-orange-500/50 hover:bg-orange-500/5"
              iconBg="bg-orange-500"
            />

            <GoalCard
              icon="❤️"
              title="توسعه فردی"
              desc="خودشناسی، مدیریت استرس، نظم شخصی"
              activeColor="hover:border-pink-500/50 hover:bg-pink-500/5"
              iconBg="bg-pink-500"
            />

            <GoalCard
              icon="🎨"
              title="هنر و خلاقیت"
              desc="نقاشی، موسیقی، نویسندگی، طراحی"
              activeColor="hover:border-indigo-500/50 hover:bg-indigo-500/5"
              iconBg="bg-indigo-500"
            />

          </div>
        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section
          className="
            max-w-7xl
            mx-auto
            px-6
            md:px-8
            py-32
            relative
            overflow-hidden
          "
        >

          <div
            className="
              absolute
              top-1/2
              left-1/2
              -translate-x-1/2
              -translate-y-1/2
              w-[600px]
              h-[300px]
              bg-[#00f2ea]/10
              blur-[120px]
              rounded-full
              pointer-events-none
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              items-center
              text-center
            "
          >

            <div
              className="
                w-20
                h-20
                mb-10
                rounded-[2rem]
                bg-gradient-to-br
                from-[#00f2ea]
                to-[#ff9d42]
                p-[1px]
                shadow-[0_0_40px_rgba(0,242,234,0.3)]
              "
            >
              <div
                className="
                  w-full
                  h-full
                  bg-[#080c14]/70
                  backdrop-blur-xl
                  rounded-[2rem]
                  flex
                  items-center
                  justify-center
                  text-3xl
                "
              >
                ✨
              </div>
            </div>

            <h2
              className="
                text-4xl
                md:text-6xl
                font-black
                mb-6
                leading-tight
              "
            >
              آماده‌ای{" "}

              <span className="text-[#00f2ea]">
                نسخه بهتر
              </span>{" "}

              خودت بشی؟
            </h2>

            <p
              className="
                text-gray-400
                text-lg
                max-w-2xl
                mb-12
                leading-relaxed
              "
            >
              همین الان رایگان شروع کن و ببین چطور
              هوش مصنوعی می‌تونه کمکت کنه به اهدافت برسی
            </p>

            <button
              onClick={handleEnterPanel}
              disabled={enteringPanel}
              className="
                group
                relative
                px-12
                py-5
                bg-[#00f2ea]
                text-black
                font-black
                text-xl
                rounded-full
                shadow-[0_20px_40px_rgba(0,242,234,0.3)]
                hover:shadow-[0_25px_50px_rgba(0,242,234,0.5)]
                hover:-translate-y-1
                transition-all
                flex
                items-center
                gap-3
                disabled:opacity-70
              "
            >
              {enteringPanel
                ? "در حال ورود..."
                : "شروع سفر رشد"}

              <span
                className="
                  group-hover:-translate-x-2
                  transition-transform
                "
              >
                ←
              </span>
            </button>

          </div>
        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer
          id="about"
          className="
            w-full
            max-w-7xl
            mx-auto
            px-6
            md:px-8
            py-20
            border-t
            border-white/5
          "
        >

          <div
            className="
              flex
              flex-col
              md:flex-row
              justify-between
              items-center
              gap-12
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  bg-[#00f2ea]
                  p-2
                  rounded-xl
                  text-black
                  shadow-[0_0_20px_rgba(0,242,234,0.25)]
                "
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <span
                className="
                  text-2xl
                  font-black
                  font-vazir
                  ltr
                "
              >
                Apex
              </span>

            </div>

            <div
              className="
                flex
                gap-10
                text-gray-500
                font-bold
                text-sm
              "
            >

              <a
                href="#"
                className="
                  hover:text-[#00f2ea]
                  transition-all
                "
              >
                اینستاگرام
              </a>

              <a
                href="#"
                className="
                  hover:text-[#00f2ea]
                  transition-all
                "
              >
                تلگرام
              </a>

              <a
                href="#"
                className="
                  hover:text-[#00f2ea]
                  transition-all
                "
              >
                لینکدین
              </a>

            </div>

          </div>

          <p
            className="
              mt-12
              text-center
              text-gray-600
              text-[10px]
              tracking-widest
            "
            dir="ltr"
          >
            © 2026 Apex. ALL RIGHTS RESERVED.
          </p>

        </footer>

      </div>

      {/* =====================================================
          ANIMATION STYLES
      ===================================================== */}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes loading {
            0% {
              width: 0%;
            }

            100% {
              width: 100%;
            }
          }
        `}
      </style>

    </div>
  );
};

export default Home;