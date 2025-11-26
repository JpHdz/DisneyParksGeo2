import { useLogout } from "./useLogout";

function Logout() {
  const { logout, isLoading } = useLogout();

  return (
    <button
      onClick={logout}
      disabled={isLoading}
      className="w-full flex items-center gap-2  text-base"
    >
      <img src="/log-out-outline.svg" alt="Log out icon" className="w-8" />
      <span>{!isLoading ? "Cerrar Sesión" : "Cerrando Sesión"}</span>
    </button>
  );
}

export default Logout;
