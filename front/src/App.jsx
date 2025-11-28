import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";


import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

import AppLayout from "./ui/AppLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import RestaurantDetails from "./pages/RestaurantDetails";
import AttractionDetails from "./pages/AttractionDetails";
import RestaurantForm from "./pages/RestaurantForm";
import AttractionForm from "./pages/AttractionForm";
import DishForm from "./pages/DishForm";
import ParkForm from "./pages/ParkForm";
import ParkMapboxCreator from "./pages/ParkMapboxCreator";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

// CONFIGURACIÓN DEL STORE 
const store = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: false,
});

// COMPONENTE PARA PROTEGER RUTAS (Manual, para evitar errores de AuthOutlet)
const PrivateRoutes = () => {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider store={store}>
        <ReactQueryDevtools initialIsOpen={false} />

        <BrowserRouter>
          <Routes>
            {/* --- RUTAS PÚBLICAS --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* --- RUTAS PROTEGIDAS --- */}
            <Route element={<PrivateRoutes />}>
              <Route element={<AppLayout />}>
                <Route index element={<Navigate replace to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/park/new" element={<ParkForm />} />
                <Route path="/park/create-map" element={<ParkMapboxCreator />} />
                <Route path="/restaurant/new" element={<RestaurantForm />} />
                <Route path="/attraction/new" element={<AttractionForm />} />
                <Route path="/dish/new" element={<DishForm />} />
                <Route path="/dish/edit/:id" element={<DishForm />} />
                <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                <Route path="/attraction/:id" element={<AttractionDetails />} />
                <Route path="/restaurant/edit/:id" element={<RestaurantForm />} />
                <Route path="/attraction/edit/:id" element={<AttractionForm />} />
              </Route>

            </Route>
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              backgroundColor: "#fff",
              color: "grey",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
