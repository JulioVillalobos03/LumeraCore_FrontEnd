import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <header className="w-full bg-(--bg-surface)">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="font-bold text-lg text-(--blue-dark)">
          Lumera
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#product" className="hover:text-(--color-primary)">Product</a>
          <a href="#features" className="hover:text-(--color-primary)">Features</a>
          <a href="#marketplace" className="hover:text-(--color-primary)">Marketplace</a>
          <a href="#company" className="hover:text-(--color-primary)">Company</a>
        </nav>

        {/* Login */}
        <Link
          to="/login"
          className="text-sm font-medium hover:text-(--color-primary)"
        >
          Log in →
        </Link>
      </div>
    </header>
  );
}
