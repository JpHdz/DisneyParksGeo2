import { Outlet } from "react-router-dom";

import { useSelector } from "react-redux";

import { useCurrentUser } from "../features/authentication/useCurrentUser";
import SpinnerMini from "./SpinnerMini";
import Logout from "../features/authentication/Logout";

function AppLayout() {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  let { user, isLoading } = useCurrentUser();

  return (
    <>
      {isLoggedIn ? (
        <div className="absolute z-50 bg-blue-900/90 w-full flex justify-center align-middle gap-2">
          <img
            src="/disneylogo.svg"
            alt="DisneyLogo"
            className="mx-auto w-36 my-4"
          />
          <div className="absolute right-6 flex top-4 text-white font-bold gap-8">
            {isLoading ? <SpinnerMini /> : `${user.data.data.name}`}
            <Logout />
          </div>
        </div>
      ) : (
        ""
      )}
      <Outlet />
    </>
  );
}

export default AppLayout;
