import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Product, CreateProductInput, ProductStatus } from "./types";
import { resolveErrorKey } from "../../utils/handleError";
import {
  listProducts,
  createProduct,
  updateProduct,
  changeProductStatus,
  getProduct,
} from "../../api/products.api";

import Spinner from "../../components/common/Spinner";
import ProductFormModal from "./ProductFormModal";

type Mode = "create" | "edit";

export default function ProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [selected, setSelected] = useState<Product | null>(null);

  /* ======================
     LOAD PRODUCTS
     ====================== */
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listProducts();
      setRows(data);
    } catch (e) {
      setError(t(resolveErrorKey(e)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  /* ======================
     CREATE / UPDATE
     ====================== */
  const handleSubmit = async (payload: CreateProductInput) => {
    setError(null);

    try {
      if (mode === "create") {
        await createProduct(payload);
      }

      if (mode === "edit" && selected) {
        await updateProduct(selected.id, payload);
      }

      await load();
    } catch (e) {
      setError(t(resolveErrorKey(e)));
      throw e;
    }
  };

  const openEdit = async (p: Product) => {
  try {
    const full = await getProduct(p.id); // 🔥 TRAE custom_fields
    setSelected(full);
    setMode("edit");
    setOpen(true);
  } catch (e) {
    setError(t(resolveErrorKey(e)));
  }
};

  /* ======================
     TOGGLE STATUS
     ====================== */
  const toggleStatus = async (p: Product) => {
    const next: ProductStatus =
      p.status === "active" ? "inactive" : "active";

    // optimistic UI
    setRows((prev) =>
      prev.map((r) => (r.id === p.id ? { ...r, status: next } : r))
    );

    try {
      await changeProductStatus(p.id, next); // 👈 AQUÍ ESTÁ LA CLAVE
    } catch {
      // rollback
      setRows((prev) =>
        prev.map((r) => (r.id === p.id ? { ...r, status: p.status } : r))
      );
    }
  };


  /* ======================
     TABLE
     ====================== */
  const table = useMemo(() => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      );
    }

    return (
      <div className="overflow-auto rounded-xl border bg-(--bg-surface)">
        <table className="w-full text-sm">
          <thead className="text-left text-(--text-secondary)">
            <tr className="border-b">
              <th className="p-4">{t("products.columns.name")}</th>
              <th className="p-4">SKU</th>
              <th className="p-4">{t("products.columns.price")}</th>
              <th className="p-4">{t("products.columns.status")}</th>
              <th className="p-4 text-right">{t("products.columns.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((p) => (
              <tr
                key={p.id}
                className="border-b last:border-b-0 hover:bg-(--bg-app)/50"
              >
                {/* NAME */}
                <td className="p-4 font-medium">
                  <button
                    onClick={() => navigate(`/app/products/${p.id}`)}
                    className="hover:underline text-left"
                  >
                    {p.name}
                  </button>
                </td>

                {/* SKU */}
                <td className="p-4 text-xs">{p.sku ?? "-"}</td>

                {/* PRICE */}
                <td className="p-4">${p.price}</td>

                {/* STATUS BADGE */}
                <td className="p-4">
                  <span
                    className={`
                      inline-flex items-center gap-2
                      rounded-full px-2.5 py-1 text-xs font-medium
                      ${p.status === "active"
                        ? "bg-green-500/10 text-green-700"
                        : "bg-gray-500/10 text-gray-700"
                      }
                    `}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${p.status === "active" ? "bg-green-600" : "bg-gray-500"
                        }`}
                    />
                    {t(`products.status.${p.status}`)}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-3">
                    {/* EDIT (corporativo) */}
                    <button
                      onClick={() => openEdit(p)}
                      className="
                        text-sm font-medium
                        text-(--text-secondary)
                        hover:text-(--text-primary)
                        transition
                      "
                    >
                      {t("products.actions.edit")}
                    </button>

                    {/* TOGGLE SWITCH (mismo que employees) */}
                    <button
                      onClick={() => void toggleStatus(p)}
                      className={`
                        relative inline-flex h-6 w-11 items-center
                        rounded-full transition-colors duration-200
                        ${p.status === "active" ? "bg-green-500" : "bg-gray-300"}
                      `}
                      aria-label="Toggle product status"
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white
                          transition-transform duration-200
                          ${p.status === "active" ? "translate-x-6" : "translate-x-1"}
                        `}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="p-6 text-sm text-(--text-secondary)">
            {t("products.empty")}
          </div>
        )}
      </div>
    );
  }, [loading, rows, t, navigate]);

  /* ======================
     RENDER
     ====================== */
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-heading">{t("products.title")}</h1>
          <p className="text-sm text-(--text-secondary)">
            {t("products.subtitle")}
          </p>
        </div>

        <button
          onClick={() => {
            setMode("create");
            setSelected(null);
            setOpen(true);
          }}
          className="
            bg-(--color-primary) text-white
            px-4 py-2 rounded-lg text-sm
            hover:opacity-90 transition
          "
        >
          {t("products.create")}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="
            rounded-lg border px-4 py-3 text-sm
            border-(--color-primary)/30
            bg-(--color-primary)/5
          "
        >
          {error}
        </div>
      )}

      {/* Table */}
      {table}

      {/* Modal */}
      <ProductFormModal
        open={open}
        mode={mode}
        initial={selected}
        onClose={() => {
          setOpen(false);
          setSelected(null);
          setMode("create");
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
