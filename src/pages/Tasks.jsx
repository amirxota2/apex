import DashboardSidebar from "../components/DashboardSidebar";
import TaskItem from "../components/TaskItem";

const Tasks = ({ tasks, onToggleTask, isLoading, error }) => {
  const completedCount = tasks.filter((task) => task.done).length;

  const progressPercent = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

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
        backgroundImage:
          "url('/3910bbb5-eab4-488d-a501-a33f6e0fb086.png')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* =========================================
          DARK OVERLAY
          فقط برای اینکه متن و پنل‌ها خوانا بمانند
      ========================================== */}
      <div
        className="
          fixed
          inset-0
          pointer-events-none
          bg-[#020712]/45
          z-0
        "
      />

      {/* =========================================
          MAIN CONTENT
      ========================================== */}
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
        {/* =========================================
            SIDEBAR
        ========================================== */}

        <DashboardSidebar />

        {/* =========================================
            TASKS CONTENT
        ========================================== */}

        <div className="lg:col-span-10">
          {/* =========================================
              LOADING / ERROR
          ========================================== */}

          {(isLoading || error) && (
            <div
              className="
                bg-[#0d121d]/75
                backdrop-blur-xl
                border
                border-white/5
                rounded-2xl
                px-4
                py-3
                text-xs
                text-gray-400
                mb-6
              "
            >
              {isLoading ? "در حال دریافت تسک‌ها..." : error}
            </div>
          )}

          {/* =========================================
              MAIN TASK PANEL
          ========================================== */}

          <div
            className="
              bg-[#0d121d]/75
              backdrop-blur-xl
              border
              border-white/5
              rounded-[2rem]
              p-8
              shadow-2xl
            "
          >
            {/* =========================================
                HEADER
            ========================================== */}

            <div
              className="
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-6
                mb-8
              "
            >
              <div>
                <h2 className="text-2xl font-black">
                  همه تسک‌ها
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  {completedCount} از {tasks.length} انجام شده
                </p>
              </div>

              {/* =========================================
                  PROGRESS
              ========================================== */}

              <div className="min-w-[200px]">
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
                    bg-white/5
                    rounded-full
                    overflow-hidden
                  "
                >
                  <div
                    className="
                      h-full
                      bg-[#00f2ea]
                      shadow-[0_0_15px_rgba(0,242,234,0.6)]
                      transition-all
                      duration-700
                    "
                    style={{
                      width: `${progressPercent}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* =========================================
                TASK LIST
            ========================================== */}

            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggleTask}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;