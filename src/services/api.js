const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api/v1";

let accessToken = null;
export function setAccessToken(token) {
  accessToken = token;
}

async function request(path, { method = "GET", body, retry = true } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  // Access token expirado: tenta renovar via cookie de refresh e repete a chamada uma vez.
  if (res.status === 401 && retry && path !== "/auth/refresh") {
    try {
      const refreshed = await request("/auth/refresh", { method: "POST", retry: false });
      accessToken = refreshed.accessToken;
      return request(path, { method, body, retry: false });
    } catch {
      accessToken = null;
      throw new Error("Sessão expirada. Faça login novamente.");
    }
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || `Erro ${res.status} ao acessar a API.`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? `?${query}` : ""}`);
  },
  getProductBySlug(slug) {
    return request(`/products/${slug}`);
  },

  register(data) {
    return request("/auth/register", { method: "POST", body: data });
  },
  login(data) {
    return request("/auth/login", { method: "POST", body: data });
  },
  refreshSession() {
    return request("/auth/refresh", { method: "POST", retry: false });
  },
  logout() {
    return request("/auth/logout", { method: "POST", retry: false });
  },
  me() {
    return request("/auth/me");
  },

  getAddresses() {
    return request("/addresses");
  },
  createAddress(data) {
    return request("/addresses", { method: "POST", body: data });
  },

  createOrder(data) {
    return request("/orders", { method: "POST", body: data });
  },
  getOrders() {
    return request("/orders");
  },
  getOrder(id) {
    return request(`/orders/${id}`);
  },

  createProduct(data) {
    return request("/products", { method: "POST", body: data });
  },
  updateProduct(id, data) {
    return request(`/products/${id}`, { method: "PUT", body: data });
  },
  deleteProduct(id) {
    return request(`/products/${id}`, { method: "DELETE" });
  },

  getAdminOrders() {
    return request("/admin/orders");
  },
  updateOrderStatus(id, data) {
    return request(`/admin/orders/${id}`, { method: "PATCH", body: data });
  },

  sendContact(data) {
    return request("/contact", { method: "POST", body: data });
  },
  subscribeNewsletter(email) {
    return request("/newsletter", { method: "POST", body: { email } });
  },
};
