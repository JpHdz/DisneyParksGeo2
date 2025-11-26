import { useState } from "react";
import { useForm } from "react-hook-form";
import SpinnerMini from "../../ui/SpinnerMini";
import { useSignup } from "./useSignup";

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const password = watch("password");
  const { signup, isLoading } = useSignup();

  const onSubmit = (data) => {
    const { name, email, password, passwordConfirm } = data;
    if (!name || !email || !password || !passwordConfirm) return;
    signup(
      { name, email, password, passwordConfirm },
      {
        onSettled: () => reset(),
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-hidden w-full text-sm "
    >
      <div
        className=" transition-transform duration-500 w-full flex flex-col gap-2"
      >
        <div className="w-full box-border">
          <div className="mb-5 flex flex-col">
            <label htmlFor="name" className="mb-3">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              disabled={isLoading}
              {...register("name", {
                required: "El nombre completo es obligatorio",
              })}
              className="p-3 rounded-xl outline-none border border-gray-300 w-full"
            />
            {errors.name && (
              <p className="mt-2 text-red-700">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-5 flex flex-col">
            <label htmlFor="email" className="mb-3">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              disabled={isLoading}
              {...register("email", {
                required: "El correo electrónico es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "El formato del correo no es válido",
                },
              })}
              className="p-3 rounded-xl outline-none border border-gray-300 w-full"
            />
            {errors.email && (
              <p className="mt-2 text-red-700">{errors.email.message}</p>
            )}
          </div>
        
        </div>
        <div className="w-full box-border">
          <div className="mb-5 flex flex-col">
            <label htmlFor="password" className="mb-3">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              disabled={isLoading}
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "Debe tener al menos 8 caracteres",
                },
              })}
              className="p-3 rounded-xl outline-none border border-gray-300 w-full"
            />
            {errors.password && (
              <p className="mt-2 text-red-700">{errors.password.message}</p>
            )}
          </div>
          <div className="mb-5 flex flex-col">
            <label htmlFor="passwordConfirm" className="mb-3">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="passwordConfirm"
              disabled={isLoading}
              {...register("passwordConfirm", {
                required: "Confirme su contraseña",
                validate: (value) =>
                  value === password || "Las contraseñas no coinciden",
              })}
              className="p-3 rounded-xl outline-none border border-gray-300 w-full"
            />
            {errors.passwordConfirm && (
              <p className="mt-2 text-red-700">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>
        </div>
        <div>
          
          <div className="flex items-center mt-5 justify-self-center">
            <input
              type="checkbox"
              id="terms"
              {...register("terms", {
                required: "Debe aceptar los términos",
              })}
              className="mr-3"
            />
            <label htmlFor="terms" className="m-0">
              Acepto todos los términos y condiciones
            </label>
          </div>
          {errors.terms && (
            <p className="mt-2 text-red-700">{errors.terms.message}</p>
          )}
          <div className="flex flex-col gap-2 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white py-2 px-6 rounded-xl w-full text-center flex justify-center justify-items-center"
            >
              {isLoading ? <SpinnerMini /> : "Registrarse"}
            </button>
              </div>
          </div>
      </div>
    </form>
  );
}

export default SignupForm;
