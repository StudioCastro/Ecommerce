import { useEffect, useState } from "react";
import { api } from "../services/api.js";

// O catálogo é pequeno (16 produtos), então busca tudo de uma vez com
// pageSize alto e deixa filtro/paginação continuarem client-side, como já era.
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getProducts({ pageSize: 100 })
      .then((data) => {
        if (active) setProducts(data.items);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { products, loading, error };
}

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setProduct(null);
    setError(null);
    api
      .getProductBySlug(slug)
      .then((data) => {
        if (active) setProduct(data);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return { product, loading, error };
}
