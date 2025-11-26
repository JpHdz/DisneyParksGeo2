export function getCookie(name) {
  const value = `; ${document.cookie}`; // Prepend a semicolon to help with parsing
  const parts = value.split(`; ${name}=`); // Split based on the cookie name
  if (parts.length === 2) {
    return parts.pop().split(";").shift(); // Return the cookie value
  }
  return null; // Return null if the cookie does not exist
}
