export const isAuthenticated = () => {
  return localStorage.getItem("user") ? true : false;
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
