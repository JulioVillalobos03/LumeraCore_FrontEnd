import { useEffect, useState } from "react";
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
import ProductsTable from "./components/ProductsTable";

type Mode = "create" | "edit";

export default function ProductsPage() {
  const { t } = useTranslation();

  const [rows, setRows] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [selected, setSelected] = useState<Product | null>(null);

  /* ======================
     LOAD
     ====================== */
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await listProducts());
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
  const onSubmit = async (payload: CreateProductInput) => {
    setError(null);
    try {
      if (mode === "create") {
        await createProduct(payload);
      } else if (selected) {
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
      const full = await getProduct(p.id);
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

    setRows((prev) =>
      prev.map((r) => (r.id === p.id ? { ...r, status: next } : r))
    );

    try {
      await changeProductStatus(p.id, next);
    } catch {
      setRows((prev) =>
        prev.map((r) => (r.id === p.id ? { ...r, status: p.status } : r))
      );
    }
  };

  /* ======================
     RENDER
     ====================== */
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
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
          className="bg-(--color-primary) text-white px-4 py-2 rounded-lg"
        >
          {t("products.create")}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border px-4 py-3 text-sm border-(--color-primary)/30 bg-(--color-primary)/5">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <Spinner />
      ) : (
        <ProductsTable
          rows={rows}
          onEdit={openEdit}
          onToggleStatus={toggleStatus}
        />
      )}

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
        onSubmit={onSubmit}
      />
    </div>
  );
}
