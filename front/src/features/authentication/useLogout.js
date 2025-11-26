import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { logout as logoutAPI } from "../../services/apiAuth";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../context/authentication/userSlice";

export function useLogout() {
  const signOut = useSignOut();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      queryClient.removeQueries();
      signOut();
      toast.success("Sesion Cerrada");
      dispatch(logoutSuccess());
      navigate("/home");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error al Cerrar Sesion");
    },
  });
  return { logout, isLoading };
}
