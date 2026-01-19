export function normalizeCustomFields(
  input?: Record<string, unknown> | Array<{ key: string; value: unknown }>
): Record<string, unknown> {
  if (!input) return {};

  // Ya es objeto → OK
  if (!Array.isArray(input)) {
    return input;
  }

  // Es array → convertir a objeto
  return input.reduce<Record<string, unknown>>((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}
