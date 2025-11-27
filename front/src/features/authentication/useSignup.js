import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { signup as SignupAPI } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signupSuccess } from "../../context/authentication/userSlice";

export function useSignup() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const signIn = useSignIn();
  const dispatch = useDispatch();
  const { mutate: signup, isPending: isLoading } = useMutation({
    mutationFn: ({ name, lastName, email, password, passwordConfirm }) =>
      SignupAPI({ name, lastName, email, password, passwordConfirm }),
    onSuccess: (user) => {
      queryClient.setQueryData([`me`], user);
      signIn({
        auth: {
          token: user.token,
          type: "Bearer",
        },
      });
      toast.success("Cuenta Creada Exitosamente!");
      dispatch(signupSuccess(user));
      navigate("/home");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Alguno de los datos ingresados ha sido invalido!");
    },
  });
  return { signup, isLoading };
}
