import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { R } from "./routes";

const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_API_URL
  : import.meta.env.VITE_PROD_API_URL;

const client = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

const ENTITY_MAP: Record<string, string> = {
  companies: "Company",
  plans: "Plan",
  states: "State",
  details: "Detail",
  functionalfields: "FunctionalField",
  projects: "Project",
  projectcompanies: "ProjectCompany",
  projectdetails: "ProjectDetail",
  projectfiles: "ProjectFile",
  projectstates: "ProjectState",
  projectdetailcompanies: "ProjectDetailCompany",
  projectdetailcompanystates: "ProjectDetailCompanyState",
  projectdetailcompanyyears: "ProjectDetailCompanyYear",
};

const SKIP_WRAP: string[] = [
  "projects/summaries/filter",
  "projectstates/degrade",
];

function resolveEntity(url: string): string | null {
  const clean = url.replace(/^\//, "").toLowerCase();
  if (SKIP_WRAP.some((p) => clean.startsWith(p))) return null;
  const seg = clean.split("/")[0];
  return ENTITY_MAP[seg] ?? null;
}

function isFormData(data: unknown): boolean {
  return typeof FormData !== "undefined" && data instanceof FormData;
}

function extractIdFromUrl(url: string): number | undefined {
  const parts = url.split("/");
  const last = parts[parts.length - 1];
  const num = Number(last);
  return Number.isFinite(num) ? num : undefined;
}

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (
    config.data &&
    !isFormData(config.data) &&
    (config.method === "post" || config.method === "put") &&
    config.url
  ) {
    const entity = resolveEntity(config.url);
    if (entity) {
      const isUpdate = config.method === "put";
      const dtoKey = `${entity}${isUpdate ? "Put" : "Post"}DTO`;

      if (!(dtoKey in config.data)) {
        if (isUpdate) {
          const id = config.data.id ?? extractIdFromUrl(config.url);
          config.data = { id, [`${entity}PutDTO`]: { id, ...config.data } };
        } else {
          config.data = { [`${entity}PostDTO`]: config.data };
        }
      }
    }
  }

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
          `${baseURL}/${R.auth.refresh}`,
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

export { baseURL };
export default client;