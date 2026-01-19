import PublicNavbar from "./PublicNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-(--bg-app)">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold max-w-2xl">
          Manage your company with clarity and control
        </h1>

        <p className="mt-6 text-(--text-secondary) max-w-xl">
          Lumera is a modern ERP designed to help teams manage employees,
          operations and growth from one place.
        </p>

        <div className="mt-10">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-(--color-primary) text-white px-6 py-3 rounded-lg"
          >
            Get started
          </a>
        </div>
      </main>
    </div>
  );
}
