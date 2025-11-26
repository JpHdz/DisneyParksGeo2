import { Link } from "react-router-dom";
import SignUpForm from "./../features/authentication/SignUpForm";

function Signup() {
  return (
    // Fondo general con un degradado sutil
    <div className="flex min-h-screen w-full bg-gradient-to-br  via-white to-blue-50">
      {/* Columna Izquierda (Formulario) */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-12 lg:w-1/2 xl:px-24 relative z-10">
        {/* Decoración de fondo sutil */}
        <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl -z-10"></div>

        <div className="mx-auto w-full max-w-[48rem]">
          {/* Encabezado */}
          <div className="mb-10 flex flex-col gap-3 text-center lg:text-left">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-500">
              Comienza aquí
            </span>
            <h1 className="font-serif text-[3.5rem] leading-tight font-bold text-blue-900 drop-shadow-sm">
              Tu Aventura <br />
              <span className="text-blue-600">Empieza Hoy</span>
            </h1>
            <p className="text-[1.6rem] text-slate-500 font-medium">
              Regístrate para encontrar informacion util para tu viaaje.
            </p>
          </div>

          {/* Formulario */}
          <div className="backdrop-blur-sm">
            <SignUpForm />
          </div>

          {/* Link Alternativo */}
          <div className="mt-10 flex flex-col items-center justify-center gap-2 border-t border-slate-200 pt-6 text-[1.4rem] sm:flex-row">
            <span className="text-slate-500">¿Ya eres parte del club?</span>
            <Link
              to="/login"
              className="font-bold text-blue-600 hover:text-indigo-800 hover:underline transition-all"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>

      {/* Columna Derecha con Imagen */}
      <div className="hidden lg:block lg:w-1/2 relative bg-indigo-900 overflow-hidden">
        {/* Overlay con un tono más violeta/mágico */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/40 to-transparent z-10"></div>

        <img
          src="/signup.jpg"
          alt="Signup Background"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[10s] hover:scale-105"
        />

        {/* Texto inspirador sobre la imagen */}
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
          <h2 className="font-serif text-4xl font-bold mb-4">
            La magia comienza contigo.
          </h2>
          <p className="text-indigo-100 text-lg">
            Encuentra Informacion de tus parques favoritos{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
