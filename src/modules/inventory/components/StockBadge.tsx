import { useTranslation } from "react-i18next";

interface Props {
  stock: number;
}

export default function StockBadge({ stock }: Props) {
  const { t } = useTranslation();

  const empty = stock <= 0;

  return (
    <span
      className={`
        inline-flex items-center gap-2
        rounded-full px-2.5 py-1 text-xs font-medium
        ${empty ? "bg-red-500/10 text-red-700" : "bg-green-500/10 text-green-700"}
      `}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          empty ? "bg-red-600" : "bg-green-600"
        }`}
      />
      {empty ? t("inventory.stock.empty") : stock}
    </span>
  );
}
