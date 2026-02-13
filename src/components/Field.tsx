import { clsx } from "clsx";

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  error?: string;
  as?: "input" | "textarea";
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400";

export default function Field({ label, error, as = "input", className, onChange, ...rest }: FieldProps) {
  return (
    <div className={clsx("space-y-1", className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      {as === "textarea" ? (
        <textarea
          className={clsx(inputClass, "min-h-20 resize-y", error && "border-red-500")}
          value={rest.value as string}
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
          rows={3}
        />
      ) : (
        <input
          className={clsx(inputClass, error && "border-red-500")}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          {...rest}
        />
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}