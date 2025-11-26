import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login as LoginAPI } from "../../services/apiAuth";
import toast from "react-hot-toast";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../context/authentication/userSlice";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const signIn = useSignIn();
  const dispatch = useDispatch();
  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: ({ email, password }) => LoginAPI({ email, password }),
    onSuccess: (user) => {
      console.log(user);
      queryClient.setQueryData([`me`], user);
      signIn({
        auth: {
          token: user.token,
          type: "Bearer",
        },
      });
      toast.success("Bienvenido De Nuevo");
      dispatch(loginSuccess(user));
      navigate("/home");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Correo o la contraseña son invalidos!");
    },
  });
  return { login, isLoading };
}
