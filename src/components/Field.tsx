import { clsx } from "clsx";

type FieldProps = {
  label: string;
  error?: string;
  className?: string;
} & (
  | (React.InputHTMLAttributes<HTMLInputElement> & { as?: "input" })
  | (React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" })
);

const base =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400";

export default function Field(props: FieldProps) {
  const { label, error, className, as = "input", ...rest } = props;

  return (
    <div className={clsx("space-y-1", className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          className={clsx(base, "resize-none", error && "border-red-500")}
          rows={3}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={clsx(base, error && "border-red-500")}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}