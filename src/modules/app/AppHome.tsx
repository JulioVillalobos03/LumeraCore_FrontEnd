import { useAuth } from "../../auth/useAuth";

export default function AppHome() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-heading">Bienvenido, {user?.name}</h1>
      <button
        onClick={logout}
        className="bg-(--blue-dark) text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
