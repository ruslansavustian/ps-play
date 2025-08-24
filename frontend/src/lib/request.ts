import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",

  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (request: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error: any) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error: any) => {
    console.log("Request error details:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
    });

    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      const responseData = error.response.data;
      const errorTitle =
        responseData?.title || responseData?.type || responseData?.error || "";
      if (errorTitle === "expired_token") {
        return _doRefreshToken(originalRequest);
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

const _doRefreshToken = async (originalRequest: any) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const uuid = localStorage.getItem("uuid");

    const { data } = await axiosInstance.post("/tokens/refresh", {
      refreshToken,
      uuid,
    });

    const token = `Bearer ${data.token}`;

    await storeToken(data);
    axiosInstance.defaults.headers.common["Authorization"] = token;
    originalRequest.headers.Authorization = token;

    return axiosInstance.request(originalRequest);
  } catch (error) {
    console.log("error", error);
    localStorage.removeItem("token");
    // For now, just remove the router redirect since we're not implementing refresh tokens yet
    return Promise.reject(error);
  }
};

function storeToken(data: any) {
  // Store tokens in localStorage
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
}

export default axiosInstance;
