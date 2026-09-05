import DashboardSidebar from "../components/DashboardSidebar";
import StatCard from "../components/StatCard";
import TaskItem from "../components/TaskItem";

const Dashboard = ({
  tasks,
  onToggleTask,
  isLoading,
  error,
  summary,
}) => {
  const completedCount = tasks.filter((task) => task.done).length;

  const progressPercent = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const weeklyProgress = summary?.weeklyProgress || [];

  // اگر API هنوز داده هفتگی نداد، داده نمایشی اولیه
  const chartData =
    weeklyProgress.length > 0
      ? weeklyProgress
      : [
          { day: "شنبه", value: 12 },
          { day: "یکشنبه", value: 24 },
          { day: "دوشنبه", value: 36 },
          { day: "سه‌شنبه", value: 32 },
          { day: "چهارشنبه", value: 47 },
          { day: "پنجشنبه", value: 49 },
          { day: "جمعه", value: 66 },
        ];

  const maxValue = 100;

  // =========================
  // CHART SIZE
  // =========================

  const chartWidth = 1000;
  const chartHeight = 360;

  const leftPadding = 75;
  const rightPadding = 30;
  const topPadding = 25;
  const bottomPadding = 55;

  const usableWidth =
    chartWidth - leftPadding - rightPadding;

  const usableHeight =
    chartHeight - topPadding - bottomPadding;

  const points = chartData.map((item, index) => {
    const x =
      leftPadding +
      (index / Math.max(chartData.length - 1, 1)) *
        usableWidth;

    const y =
      topPadding +
      usableHeight -
      (item.value / maxValue) * usableHeight;

    return {
      ...item,
      x,
      y,
    };
  });

  const linePath = points
    .map((point, index) =>
      index === 0
        ? `M ${point.x} ${point.y}`
        : `L ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath = `
    ${linePath}
    L ${points[points.length - 1]?.x || 0}
      ${chartHeight - bottomPadding}
    L ${points[0]?.x || 0}
      ${chartHeight - bottomPadding}
    Z
  `;

  const lastPoint =
    points[points.length - 1] || {
      x: 0,
      y: 0,
      value: 0,
    };

  return (
    <div
      className="
        min-h-screen
        text-white
        font-vazir
        p-4
        md:p-6
        relative
        overflow-x-hidden
      "
      dir="rtl"
      style={{
        backgroundColor: "#020712",

        /* =========================
           DASHBOARD BACKGROUND
        ========================== */
        backgroundImage:
          "url('/3910bbb5-eab4-488d-a501-a33f6e0fb086.png')",

        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >

      {/* =========================
          DARK OVERLAY
          فقط برای اینکه متن‌ها
          واضح‌تر دیده شوند
      ========================== */}

      <div
        className="
          fixed
          inset-0
          pointer-events-none
          bg-black/40
          z-0
        "
      />

      {/* =========================
          MAIN
      ========================== */}

      <div
        className="
          relative
          z-10
          max-w-[1400px]
          mx-auto
          grid
          grid-cols-1
          lg:grid-cols-12
          gap-6
        "
      >

        {/* =========================
            SIDEBAR
        ========================== */}

        <DashboardSidebar />

        {/* =========================
            MAIN CONTENT
        ========================== */}

        <div className="lg:col-span-10 space-y-6 min-w-0">

          {/* =========================
              LOADING / ERROR
          ========================== */}

          {(isLoading || error) && (
            <div
              className="
                rounded-2xl
                border
                border-white/[0.07]
                bg-[#07101d]/75
                backdrop-blur-xl
                px-4
                py-3
                text-xs
                text-gray-400
              "
            >
              {isLoading
                ? "در حال دریافت اطلاعات داشبورد..."
                : error}
            </div>
          )}

          {/* =========================
              STAT CARDS
          ========================== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <StatCard
              icon="🔥"
              label="روزهای متوالی"
              value={`${summary?.streakDays ?? 0} روز`}
              color="orange"
            />

            <StatCard
              icon="🏆"
              label="امتیاز کل"
              value={(summary?.totalScore ?? 0).toLocaleString(
                "fa-IR"
              )}
              color="yellow"
            />

            <StatCard
              icon="🎯"
              label="اهداف فعال"
              value={String(summary?.activeGoals ?? 0)}
              color="cyan"
            />

          </div>

          {/* =========================
              TASKS + WEEKLY
          ========================== */}

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-12
              gap-6
              items-start
            "
          >

            {/* ==================================================
                TODAY TASKS
            ================================================== */}

            <div
              className="
                lg:col-span-8
                rounded-[2rem]
                border
                border-white/[0.08]
                bg-[#07101d]/75
                backdrop-blur-xl
                p-5
                md:p-8
                shadow-[0_20px_80px_rgba(0,0,0,0.25)]
                min-w-0
                flex
                flex-col
              "
            >

              {/* Header */}

              <div
                className="
                  flex
                  justify-between
                  items-center
                  mb-6
                  shrink-0
                "
              >
                <h3 className="text-xl font-bold">
                  تسک‌های امروز
                </h3>

                <span className="text-gray-500 text-xs">
                  {completedCount} از {tasks.length} انجام شده
                </span>
              </div>

              {/* Progress */}

              <div className="mb-8 shrink-0">

                <div
                  className="
                    flex
                    justify-between
                    text-xs
                    font-bold
                    mb-2
                  "
                >
                  <span className="text-[#00f2ea]">
                    {progressPercent}%
                  </span>

                  <span className="text-gray-500 font-normal">
                    میزان پیشرفت
                  </span>
                </div>

                <div
                  className="
                    h-1.5
                    w-full
                    bg-white/[0.05]
                    rounded-full
                    overflow-hidden
                  "
                >
                  <div
                    className="
                      h-full
                      bg-[#00f2ea]
                      shadow-[0_0_15px_rgba(0,242,234,0.7)]
                      transition-all
                      duration-700
                    "
                    style={{
                      width: `${progressPercent}%`,
                    }}
                  />
                </div>

              </div>

              {/* Task List */}

              <div
                className="
                  min-h-0
                  max-h-[480px]
                  overflow-y-auto
                  overflow-x-hidden
                  pl-1
                  pr-1
                  space-y-3
                  scrollbar-thin
                  scrollbar-track-transparent
                  scrollbar-thumb-white/10
                  hover:scrollbar-thumb-[#00f2ea]/30
                "
              >

                {tasks.length ? (
                  tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={onToggleTask}
                    />
                  ))
                ) : (
                  <p
                    className="
                      rounded-2xl
                      border
                      border-dashed
                      border-white/10
                      px-4
                      py-8
                      text-center
                      text-sm
                      text-gray-500
                    "
                  >
                    تسکی برای نمایش وجود ندارد.
                  </p>
                )}

              </div>

            </div>

            {/* ==================================================
                WEEKLY PROGRESS
            ================================================== */}

            <div
              className="
                lg:col-span-4
                min-w-0
                space-y-4
              "
            >

              {/* =========================
                  WEEKLY CHART CARD
              ========================== */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[2rem]
                  border
                  border-[#00d9ff]/20
                  bg-[#06101c]/72
                  backdrop-blur-xl
                  p-5
                  md:p-7
                  shadow-[0_20px_80px_rgba(0,0,0,0.28)]
                "
              >

                {/* subtle glow */}

                <div
                  className="
                    absolute
                    -top-24
                    -right-24
                    w-48
                    h-48
                    rounded-full
                    bg-[#00eaff]/[0.05]
                    blur-3xl
                    pointer-events-none
                  "
                />

                {/* Title */}

                <div
                  className="
                    relative
                    flex
                    items-center
                    justify-between
                    mb-5
                  "
                >
                  <h3
                    className="
                      text-[20px]
                      md:text-[22px]
                      font-black
                      text-white
                    "
                  >
                    پیشرفت هفتگی
                  </h3>

                  <span
                    className="
                      text-[10px]
                      text-gray-500
                    "
                  >
                    هفته جاری
                  </span>
                </div>

                {/* =========================
                    CHART
                ========================== */}

                <div
                  className="
                    relative
                    w-full
                    overflow-hidden
                  "
                >

                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="
                      w-full
                      h-auto
                      overflow-visible
                    "
                    preserveAspectRatio="none"
                  >

                    {/* =========================
                        HORIZONTAL GRID
                    ========================== */}

                    {[0, 20, 40, 60, 80, 100].map(
                      (value) => {
                        const y =
                          topPadding +
                          usableHeight -
                          (value / 100) *
                            usableHeight;

                        return (
                          <g key={value}>

                            <line
                              x1={leftPadding}
                              x2={
                                chartWidth -
                                rightPadding
                              }
                              y1={y}
                              y2={y}
                              stroke="rgba(255,255,255,0.055)"
                              strokeWidth="2"
                            />

                            <text
                              x="5"
                              y={y + 5}
                              fill="rgba(255,255,255,0.48)"
                              fontSize="20"
                              fontFamily="Vazirmatn, sans-serif"
                            >
                              {value}%
                            </text>

                          </g>
                        );
                      }
                    )}

                    {/* =========================
                        AREA GRADIENT
                    ========================== */}

                    <defs>

                      <linearGradient
                        id="weeklyArea"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#00cfff"
                          stopOpacity="0.28"
                        />

                        <stop
                          offset="100%"
                          stopColor="#00cfff"
                          stopOpacity="0"
                        />
                      </linearGradient>

                      <filter
                        id="chartGlow"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                      >
                        <feGaussianBlur
                          stdDeviation="7"
                          result="blur"
                        />

                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>

                      </filter>

                    </defs>

                    {/* Area */}

                    <path
                      d={areaPath}
                      fill="url(#weeklyArea)"
                    />

                    {/* Glow line */}

                    <path
                      d={linePath}
                      fill="none"
                      stroke="#00cfff"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.18"
                      filter="url(#chartGlow)"
                    />

                    {/* Main line */}

                    <path
                      d={linePath}
                      fill="none"
                      stroke="#00cfff"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Points */}

                    {points.map((point, index) => (
                      <g key={index}>

                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="12"
                          fill="#00cfff"
                          opacity="0.15"
                        />

                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="5"
                          fill="#00cfff"
                          stroke="#06101c"
                          strokeWidth="3"
                        />

                      </g>
                    ))}

                    {/* Last value bubble */}

                    <g>

                      <rect
                        x={lastPoint.x - 38}
                        y={lastPoint.y - 58}
                        width="76"
                        height="42"
                        rx="10"
                        fill="#0878ad"
                        opacity="0.95"
                      />

                      <polygon
                        points={`
                          ${lastPoint.x - 8},
                          ${lastPoint.y - 16}
                          ${lastPoint.x + 8},
                          ${lastPoint.y - 16}
                          ${lastPoint.x},
                          ${lastPoint.y - 5}
                        `}
                        fill="#0878ad"
                      />

                      <text
                        x={lastPoint.x}
                        y={lastPoint.y - 31}
                        textAnchor="middle"
                        fill="white"
                        fontSize="21"
                        fontWeight="800"
                        fontFamily="Vazirmatn, sans-serif"
                      >
                        {lastPoint.value}%
                      </text>

                    </g>

                    {/* Day labels */}

                    {points.map((point, index) => (
                      <text
                        key={index}
                        x={point.x}
                        y={chartHeight - 12}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.48)"
                        fontSize="18"
                        fontFamily="Vazirmatn, sans-serif"
                      >
                        {point.day}
                      </text>
                    ))}

                  </svg>

                </div>

                {/* =========================
                    AVERAGE CARD
                ========================== */}

                <div
                  className="
                    mt-4
                    rounded-[1.3rem]
                    border
                    border-[#00d9ff]/15
                    bg-[#00eaff]/[0.045]
                    px-5
                    py-5
                    relative
                    overflow-hidden
                  "
                >

                  <div
                    className="
                      absolute
                      inset-0
                      bg-[radial-gradient(circle_at_80%_50%,rgba(0,242,234,0.08),transparent_55%)]
                      pointer-events-none
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-[11px]
                          text-gray-400
                          mb-2
                        "
                      >
                        میانگین هفتگی
                      </p>

                      <p
                        className="
                          text-3xl
                          font-black
                          text-white
                        "
                      >
                        {summary?.progress ??
                          Math.round(
                            chartData.reduce(
                              (sum, item) =>
                                sum + item.value,
                              0
                            ) / chartData.length
                          )}
                        %
                      </p>

                      <p
                        className="
                          text-[9px]
                          text-[#00f2ea]
                          mt-2
                        "
                      >
                        +۲٪ نسبت به هفته گذشته
                      </p>

                    </div>

                    {/* Circular progress */}

                    <div
                      className="
                        relative
                        w-[76px]
                        h-[76px]
                        rounded-full
                        flex
                        items-center
                        justify-center
                      "
                      style={{
                        background: `
                          conic-gradient(
                            #00eaff 0deg,
                            #00eaff 240deg,
                            rgba(255,255,255,0.06) 240deg,
                            rgba(255,255,255,0.06) 360deg
                          )
                        `,
                      }}
                    >

                      <div
                        className="
                          w-[60px]
                          h-[60px]
                          rounded-full
                          bg-[#07121e]
                          border
                          border-[#00eaff]/10
                          flex
                          items-center
                          justify-center
                          text-[#00eaff]
                          text-xl
                        "
                      >
                        ◉
                      </div>

                    </div>

                  </div>

                  <p
                    className="
                      relative
                      mt-3
                      text-[9px]
                      text-gray-500
                    "
                  >
                    پیشرفت شما ثبت و قابل پیگیری است ✨
                  </p>

                </div>

              </div>

              {/* =========================
                  TODAY RECOMMENDATION
              ========================== */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[2rem]
                  border
                  border-[#00d9ff]/20
                  bg-[#06101c]/72
                  backdrop-blur-xl
                  min-h-[190px]
                  p-6
                  shadow-[0_20px_70px_rgba(0,0,0,0.25)]
                "
              >

                {/* decorative glow */}

                <div
                  className="
                    absolute
                    -bottom-16
                    -left-12
                    w-44
                    h-44
                    rounded-full
                    bg-[#00d9ff]/[0.07]
                    blur-3xl
                  "
                />

                {/* title */}

                <div
                  className="
                    relative
                    flex
                    items-center
                    justify-between
                    mb-3
                  "
                >

                  <h3
                    className="
                      text-[15px]
                      md:text-[16px]
                      font-black
                    "
                  >
                    مسیر پیشنهادی امروز
                  </h3>

                  <span
                    className="
                      text-[#00eaff]
                      text-lg
                    "
                  >
                    ☆
                  </span>

                </div>

                <p
                  className="
                    relative
                    text-[11px]
                    text-gray-400
                    leading-7
                    mb-5
                  "
                >
                  تمرکز امروز روی پیشرفت در مهارت طراحی باشد.
                </p>

                {/* decorative path */}

                <div
                  className="
                    absolute
                    left-[-10px]
                    bottom-[-35px]
                    w-[210px]
                    h-[110px]
                    pointer-events-none
                  "
                >

                  <svg
                    viewBox="0 0 220 120"
                    className="w-full h-full"
                  >

                    <path
                      d="
                        M 10 95
                        C 45 80,
                          80 105,
                          90 75
                        C 100 45,
                          130 55,
                          125 35
                        C 120 15,
                          165 15,
                          195 8
                      "
                      fill="none"
                      stroke="#00d9ff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.8"
                    />

                    <path
                      d="
                        M 10 95
                        C 45 80,
                          80 105,
                          90 75
                        C 100 45,
                          130 55,
                          125 35
                        C 120 15,
                          165 15,
                          195 8
                      "
                      fill="none"
                      stroke="#00d9ff"
                      strokeWidth="12"
                      strokeLinecap="round"
                      opacity="0.08"
                    />

                  </svg>

                </div>

                {/* button */}

                <button
                  type="button"
                  className="
                    relative
                    mr-auto
                    block
                    w-[145px]
                    h-[43px]
                    rounded-full
                    border
                    border-[#00d9ff]/50
                    bg-[#04101a]/80
                    text-[#00eaff]
                    text-[11px]
                    font-bold
                    shadow-[0_0_20px_rgba(0,217,255,0.08)]
                    hover:bg-[#00d9ff]/10
                    hover:border-[#00eaff]
                    transition-all
                  "
                >
                  مشاهده مسیر
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;