import { Link } from "react-router-dom";
import LoginForm from "../features/authentication/LoginForm";

function Login() {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br  via-white to-purple-50">
      {/* Columna Izquierda (Formulario) */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-12 lg:w-1/2 xl:px-24 relative z-10">
        <div className="absolute top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-blue-100/50 blur-3xl -z-10"></div>

        <div className="mx-auto w-full max-w-[48rem] py-32">
          <div className="mb-10 flex flex-col gap-3 text-center lg:text-left">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-500">
              Bienvenido de nuevo
            </span>
            <h1 className="font-serif text-[3.5rem] leading-tight font-bold text-blue-900 drop-shadow-sm">
              Continúa la Magia
            </h1>
            <p className="text-[1.2rem] text-slate-500 font-medium">
              Accede a tu cuenta y comienza a explorar.
            </p>
          </div>

          {/* Formulario envuelto en un estilo limpio */}
          <div className="backdrop-blur-sm">
            <LoginForm />
          </div>

          {/* Link Alternativo */}
          <div className="mt-10 flex flex-col items-center justify-center gap-2 border-t border-slate-200 pt-6 text-[1rem] sm:flex-row">
            <span className="text-slate-500">¿Aún no tienes tu pase?</span>
            <Link
              to="/signup"
              className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all"
            >
              Crea tu cuenta ahora
            </Link>
          </div>
        </div>
      </div>

      {/* Columna Derecha con Imagen */}
      <div className="hidden lg:block lg:w-1/2 relative bg-blue-900 overflow-hidden">
        {/* Overlay degradado para que el texto resalte y se sienta integrado */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent z-10"></div>

        <img
          src="/login.jpg"
          alt="Login Background"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[10s] hover:scale-105"
        />

        {/* Texto flotante sobre la imagen (opcional, estilo portada de película) */}
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
          <h2 className="font-serif text-4xl font-bold mb-4">
            La aventura te espera.
          </h2>
          <p className="text-blue-100 text-lg">
            Prepárate para vivir momentos inolvidables en el lugar más feliz del
            mundo.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
