import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variants: Record<string, string> = {
  default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  success: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
  danger: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
};

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}