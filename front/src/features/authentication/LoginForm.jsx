import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import SpinnerMini from "../../ui/SpinnerMini";
import { useLogin } from "./useLogin";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { login, isLoading } = useLogin();

  const onSubmit = (data) => {
    const { email, password } = data;

    if (!email || !password) return;
    login(
      { email, password },
      {
        onSettled: () => reset(),
      }
    );
  };

  const labelClasses = "mb-[1.2rem] text-[1.2rem] sm:text-base";
  const inputClasses =
    "w-full p-[0.8rem] rounded-xl outline-none border disabled:bg-gray-100";
  const errorClasses = "mt-4 text-[rgb(130,8,0)]";
  const sectionClasses = "flex flex-col mb-[2.8rem] xl:mb-[3.6rem]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      {/* Sección Email */}
      <div className={sectionClasses}>
        <label htmlFor="email" className={labelClasses}>
          Correo Electrónico
        </label>
        <input
          type="email"
          id="email"
          disabled={isLoading}
          className={inputClasses}
          {...register("email", {
            required: "El correo electrónico es obligatorio",
          })}
        />
        {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
      </div>

      {/* Sección Password */}
      <div className={sectionClasses}>
        <label htmlFor="password" className={labelClasses}>
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          disabled={isLoading}
          className={inputClasses}
          {...register("password", {
            required: "La contraseña es obligatoria",
          })}
        />
        {errors.password && (
          <p className={errorClasses}>{errors.password.message}</p>
        )}
      </div>

      {/* Botón Submit */}
      <button
        disabled={isLoading}
        className={`
          bg-blue-500 text-white rounded-md px-6 py-2  flex justify-center
        `}
      >
        {isLoading ? <SpinnerMini /> : "Iniciar Sesión"}
      </button>
    </form>
  );
}

export default LoginForm;
