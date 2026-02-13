import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const client = axios.create({
  baseURL: import.meta.env.DEV
    ? import.meta.env.VITE_DEV_API_URL
    : import.meta.env.VITE_PROD_API_URL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;
    const { accessToken, refreshToken, setTokens, logout } =
      useAuthStore.getState();

    if (!accessToken || !refreshToken) {
      logout();
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (!refreshPromise) {
      refreshPromise = axios
        .post<{ accessToken: string; refreshToken: string; expireDate: string }>(
          `${import.meta.env.REACT_APP_DEV_API_URL}accounts/Refresh`,
          { accessToken, refreshToken }
        )
        .then((res) => {
          setTokens(res.data.accessToken, res.data.refreshToken);
          return res.data.accessToken;
        })
        .catch(() => {
          logout();
          window.location.href = "/";
          return "";
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newToken = await refreshPromise;
    if (!newToken) return Promise.reject(error);

    original.headers.Authorization = `Bearer ${newToken}`;
    return client(original);
  }
);

export default client;