import clsx from "clsx";

interface Props {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: "primary" | "green" | "blue" | "gray";
}

export default function StatCard({
  label,
  value,
  icon,
  accent = "primary",
}: Props) {
  return (
    <div
      className={clsx(
        "rounded-xl border bg-(--bg-surface) p-5 flex items-center justify-between",
        "hover:shadow-sm transition"
      )}
    >
      <div>
        <p className="text-xs uppercase tracking-wide text-(--text-secondary)">
          {label}
        </p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </div>

      {icon && (
        <div
          className={clsx(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            accent === "primary" && "bg-(--color-primary)/10 text-(--color-primary)",
            accent === "green" && "bg-green-500/10 text-green-600",
            accent === "blue" && "bg-blue-500/10 text-blue-600",
            accent === "gray" && "bg-gray-500/10 text-gray-600"
          )}
        >
          {icon}
        </div>
      )}
    </div>
  );
}
