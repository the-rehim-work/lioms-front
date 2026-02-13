import { useTheme } from "../theme/theme.store";

export default function Dashboard() {
  const { toggle } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <button
        onClick={toggle}
        className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded"
      >
        Toggle Theme
      </button>

      <h1 className="text-3xl mt-6">Dashboard</h1>
    </div>
  );
}
