import { ReactNode } from "react";
type Levels = "success" | "info" | "warning" | "error";

export default function Alert({
  level = "info",
  children,
}: {
  level: Levels;
  children: ReactNode;
}) {
  const levels = {
    success: {
      classes: "bg-emerald-900 text-emerald-200 border-emerald-700",
      icon: "check-circle",
    },
    info: {
      classes: "bg-sky-900 text-sky-200 border-sky-700",
      icon: "info-circle",
    },
    warning: {
      classes: "bg-yellow-900 text-yellow-200 border-yellow-700",
      icon: "exclamation-circle",
    },
    error: {
      classes: "bg-red-900 text-red-200 border-red-700",
      icon: "exclamation-triangle",
    },
  };

  return (
    <div
      className={`px-3 py-1 rounded-lg border-2 ${levels[level].classes} text-left flex items-center`}
    >
      <span>
        <i className={`fas fa-${levels[level].icon} inline mr-3 h-8 w-8`} />
      </span>
      <span>{children}</span>
    </div>
  );
}
