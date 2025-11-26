import { getCookie } from "../utils/getCookie";
import apiConnectionString from "./apiConnectionString";

export async function login({ email, password }) {
  try {
    let res = await fetch(`${apiConnectionString}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error("Correo o Contraseña invalidos");
      // return throw new Error();
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function signup({
  name,
  lastName,
  email,
  password,
  passwordConfirm,
}) {
  try {
    let res = await fetch(`${apiConnectionString}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        lastName,
        email,
        password,
        passwordConfirm,
      }),
    });
    if (!res.ok)
      throw new Error(
        "Correo, Contraseña, Confirmar Contraseña, Nombre o Apellido invalidos"
      );
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function logout() {
  try {
    let res = await fetch(`${apiConnectionString}/users/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer: ${getCookie("_auth")}`,
      },
    });
    if (!res.ok) {
      throw new Error("Error al cerrar sesion");
    }
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function updateMyPassword({
  passwordCurrent,
  password,
  passwordConfirm,
}) {
  try {
    let res = await fetch(`${apiConnectionString}/users/updateMyPassword`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer: ${getCookie("_auth")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        passwordCurrent,
        password,
        passwordConfirm,
      }),
    });
    if (!res.ok) {
      throw new Error("Error al actualizar tu contraseña!");
    }
    const data = res.json();
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function getCurrentUser() {
  try {
    let res = await fetch(`${apiConnectionString}/users/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer: ${getCookie("_auth")}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error al Obtener usuario");
    }
    const data = res.json();
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function forgotMyPassword({ email }) {
  try {
    let res = await fetch(`${apiConnectionString}/users/forgotMyPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    if (!res.ok) {
      throw new Error("No existe ningun usuario con ese correo!");
    }
    const data = res.json();
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function resetMyPassword({ id, password, passwordConfirm }) {
  console.log(id);
  try {
    let res = await fetch(`${apiConnectionString}/users/resetPassword/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        passwordConfirm,
      }),
    });
    if (!res.ok) {
      throw new Error("Hubo algun problema en actualizar tu contraseña!");
    }
    const data = res.json();
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}
