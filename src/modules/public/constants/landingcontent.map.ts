export type LandingFeature = {
  key: string; // i18n key suffix
  icon: string;
};

export type LandingStep = {
  key: string; // i18n key suffix
};

export const LANDING_FEATURES: LandingFeature[] = [
  { key: "employees", icon: "👥" },
  { key: "clients", icon: "🤝" },
  { key: "inventory", icon: "📦" },
  { key: "access", icon: "🔐" },
  { key: "customFields", icon: "⚙️" },
  { key: "scalable", icon: "🚀" },
];

export const LANDING_STEPS: LandingStep[] = [
  { key: "company" },
  { key: "modules" },
  { key: "grow" },
];
