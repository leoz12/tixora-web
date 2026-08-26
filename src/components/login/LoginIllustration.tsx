import { cn } from "@/lib/utils";

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function MusicIcon() {
  return (
    <svg {...ICON_PROPS} className="h-full w-full">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg {...ICON_PROPS} className="h-full w-full">
      <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4M17 5h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg {...ICON_PROPS} className="h-full w-full">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <path d="M12 17v5M9 22h6" />
    </svg>
  );
}

function ClapperIcon() {
  return (
    <svg {...ICON_PROPS} className="h-full w-full">
      <path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Z" />
      <path d="M4 8l1.5-4h13L20 8" />
      <path d="M8 4l1.5 4M13 4l1.5 4" />
    </svg>
  );
}

function MusicScene() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-blue-800 to-blue-600">
      <span className="absolute -top-2 left-[16%] h-[140%] w-6 -rotate-[14deg] bg-white/15" />
      <span className="absolute -top-2 left-[46%] h-[140%] w-6 rotate-[6deg] bg-white/15" />
      <span className="absolute -top-2 left-[74%] h-[140%] w-6 -rotate-[8deg] bg-white/15" />
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-blue-950" />
    </div>
  );
}

function SportsScene() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-green-700 to-green-800">
      <span className="absolute left-[14%] top-[8%] h-[46%] w-[3px] bg-white/50">
        <span className="absolute -left-[7px] -top-[6px] h-[10px] w-[16px] rounded-[50%] bg-white/70 blur-[2px]" />
      </span>
      <span className="absolute right-[14%] top-[8%] h-[46%] w-[3px] bg-white/50">
        <span className="absolute -left-[7px] -top-[6px] h-[10px] w-[16px] rounded-[50%] bg-white/70 blur-[2px]" />
      </span>
      <div className="absolute inset-x-[-10%] bottom-0 h-[42%] rounded-t-[50%] bg-green-950/80" />
    </div>
  );
}

function ComedyScene() {
  return (
    <div className="absolute inset-0 bg-ink-900">
      <div
        className="absolute left-1/2 top-[-10%] h-[130%] w-[70%] -translate-x-1/2"
        style={{
          background:
            "conic-gradient(from 210deg at 50% -20%, transparent 0deg, rgba(255,255,255,0.22) 40deg, transparent 80deg)",
        }}
      />
      <span className="absolute bottom-1.5 left-1/2 h-8 w-[3px] -translate-x-1/2 bg-ink-500">
        <span className="absolute -left-[2.5px] -top-[7px] h-2 w-2 rounded-full bg-ink-400" />
      </span>
    </div>
  );
}

function CinemaScene() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-[#4a3a63] to-[#b3623a]">
      <div className="absolute left-[22%] top-[14%] h-[34%] w-[56%] rounded-sm bg-white/85 shadow-[0_0_16px_4px_rgba(255,255,255,0.35)]" />
      <div className="absolute inset-x-0 bottom-0 h-[30%]">
        <span className="absolute bottom-1 left-[14%] h-[7px] w-4 rounded-sm bg-blue-950" />
        <span className="absolute bottom-1 left-[38%] h-[7px] w-4 rounded-sm bg-blue-950" />
        <span className="absolute bottom-1 left-[62%] h-[7px] w-4 rounded-sm bg-blue-950" />
        <span className="absolute bottom-1 left-[82%] h-[7px] w-4 rounded-sm bg-blue-950" />
      </div>
    </div>
  );
}

interface TicketConfig {
  key: string;
  accent: string;
  iconBg: string;
  kicker: string;
  title: string;
  date: string;
  venue: string;
  icon: React.ReactNode;
  scene: React.ReactNode;
}

const CINEMA: TicketConfig = {
  key: "cinema",
  accent: "text-ink-700",
  iconBg: "bg-surface-sunken",
  kicker: "Cinema",
  title: "Movies Under the Stars",
  date: "Oct 02",
  venue: "Rooftop Park",
  icon: <ClapperIcon />,
  scene: <CinemaScene />,
};
const COMEDY: TicketConfig = {
  key: "comedy",
  accent: "text-blue-700",
  iconBg: "bg-blue-50",
  kicker: "Comedy",
  title: "Stand-Up Saturdays",
  date: "Jul 05",
  venue: "The Attic Club",
  icon: <MicIcon />,
  scene: <ComedyScene />,
};
const SPORTS: TicketConfig = {
  key: "sports",
  accent: "text-green-700",
  iconBg: "bg-green-50",
  kicker: "Sports",
  title: "Championship Finals",
  date: "Sep 14",
  venue: "Main Stadium",
  icon: <TrophyIcon />,
  scene: <SportsScene />,
};
const MUSIC: TicketConfig = {
  key: "music",
  accent: "text-amber-700",
  iconBg: "bg-amber-50",
  kicker: "Admit one",
  title: "Summer Live Fest",
  date: "Aug 20",
  venue: "GBK Arena",
  icon: <MusicIcon />,
  scene: <MusicScene />,
};

function Ticket({
  ticket,
  widthClass,
  x,
  y,
  rotate,
  z,
  floatDuration,
  floatDelay,
}: {
  ticket: TicketConfig;
  widthClass: string;
  x: number;
  y: number;
  rotate: number;
  z: number;
  floatDuration: number;
  floatDelay: number;
}) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotate}deg)`,
        zIndex: z,
      }}
    >
      <div
        style={{
          animation: `float ${floatDuration}s ease-in-out infinite ${floatDelay}s`,
        }}
      >
        <div className={cn("rounded-2xl bg-white p-3.5 shadow-2xl", widthClass)}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p
                className={cn(
                  "text-[9px] font-bold uppercase tracking-wide",
                  ticket.accent,
                )}
              >
                {ticket.kicker}
              </p>
              <p className="mt-0.5 text-[13px] font-extrabold leading-tight text-ink-900">
                {ticket.title}
              </p>
            </div>
            <div
              className={cn(
                "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full p-1.5",
                ticket.iconBg,
                ticket.accent,
              )}
            >
              {ticket.icon}
            </div>
          </div>
          <div className="relative my-2.5 h-[70px] overflow-hidden rounded-lg">
            {ticket.scene}
          </div>
          <div className="flex items-center justify-between text-[9.5px] font-semibold text-ink-500">
            <span className="font-bold text-ink-900">{ticket.date}</span>
            <span>{ticket.venue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginIllustration({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-xl items-center justify-center">
      {/* ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/30 blur-3xl" />
      </div>

      {/* floating chip: date */}
      <div className="absolute left-2 top-2 z-10 hidden animate-[float_5s_ease-in-out_infinite] items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm sm:flex">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
        </svg>
        <span className="text-xs font-semibold text-ink-900">Sat, 20 Sep</span>
      </div>

      {/* floating chip: location */}
      <div className="absolute bottom-2 right-2 z-10 hidden animate-[float_6s_ease-in-out_infinite_0.5s] items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm sm:flex">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <span className="text-xs font-semibold text-ink-900">Jakarta</span>
      </div>

      {variant === "desktop" ? (
        <>
          <Ticket ticket={CINEMA} widthClass="w-[150px]" x={-130} y={-45} rotate={-14} z={1} floatDuration={6.4} floatDelay={0.2} />
          <Ticket ticket={COMEDY} widthClass="w-[150px]" x={-70} y={50} rotate={-7} z={2} floatDuration={5.6} floatDelay={0.4} />
          <Ticket ticket={SPORTS} widthClass="w-[150px]" x={125} y={15} rotate={14} z={2} floatDuration={6} floatDelay={0.7} />
          <Ticket ticket={MUSIC} widthClass="w-44" x={0} y={-10} rotate={3} z={4} floatDuration={5} floatDelay={0} />
        </>
      ) : (
        <>
          <Ticket ticket={SPORTS} widthClass="w-[130px]" x={68} y={12} rotate={13} z={1} floatDuration={6} floatDelay={0.4} />
          <Ticket ticket={MUSIC} widthClass="w-[150px]" x={-30} y={-6} rotate={-4} z={2} floatDuration={5} floatDelay={0} />
        </>
      )}

      {/* confetti dots */}
      <span className="absolute left-6 bottom-8 h-2.5 w-2.5 rounded-full bg-amber-400" />
      <span className="absolute right-8 bottom-16 h-2 w-2 rounded-full bg-green-400" />
      <span className="absolute right-2 top-4 h-2 w-2 rounded-full bg-white/80" />
      <span className="absolute left-10 top-2 h-1.5 w-1.5 rounded-full bg-white/70" />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
