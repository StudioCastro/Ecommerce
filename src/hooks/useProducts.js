import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { products as staticProducts, getProductBySlug as getStaticProductBySlug } from "../data/products.js";

// O catálogo é pequeno (16 produtos), então busca tudo de uma vez com
// pageSize alto e deixa filtro/paginação continuarem client-side, como já era.
//
// Quando a API não responde (ex: site publicado no GitHub Pages, sem backend
// hospedado), cai para o catálogo estático em src/data/products.js — mesmo
// shape retornado pela API — pra o catálogo aparecer pra qualquer visitante.
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getProducts({ pageSize: 100 })
      .then((data) => {
        if (active) setProducts(data.items);
      })
      .catch(() => {
        if (active) setProducts(staticProducts);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { products, loading };
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
      .catch(() => {
        const fallback = getStaticProductBySlug(slug);
        if (!active) return;
        if (fallback) setProduct(fallback);
        else setError("Produto não encontrado.");
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
