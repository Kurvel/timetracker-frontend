import axios from "axios";

export const getAuthToken = () => {
  return window.localStorage.getItem("auth_token");
};

export const setAuthHeader = (token: string | null) => {
  if (token !== null) {
    window.localStorage.setItem("auth_token", token);
  } else {
    window.localStorage.removeItem("auth_token");
  }
};

axios.defaults.baseURL = "https://monkfish-app-ztbvn.ondigitalocean.app";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const request = (
  method: string,
  url: string,
  data: {
    login?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  }
) => {
  let headers = {};
  if (getAuthToken() !== null && getAuthToken() !== "null") {
    headers = { Authorization: `Bearer ${getAuthToken()}` };
  }

  return axios({
    method: method,
    url: url,
    headers: headers,
    data: data,
  });
};
