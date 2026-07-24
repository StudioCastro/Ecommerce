import { useEffect, useState } from "react";
import { api } from "../../services/api.js";

const emptyForm = {
  sku: "",
  name: "",
  description: "",
  price: "",
  category: "",
  brand: "",
  gallery: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    api
      .getProducts({ pageSize: 100 })
      .then((data) => setProducts(data.items))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      sku: "",
      name: p.name,
      description: p.description,
      price: String(p.price),
      category: p.category,
      brand: p.brand ?? "",
      gallery: p.gallery.join(", "),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        brand: form.brand || undefined,
      };

      if (editingId) {
        await api.updateProduct(editingId, payload);
      } else {
        await api.createProduct({
          ...payload,
          sku: form.sku,
          gallery: form.gallery
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        });
      }

      cancelEdit();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Remover este produto da loja?")) return;
    try {
      await api.deleteProduct(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="section-p1">
      <h2>Produtos</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "420px", marginBottom: "30px" }}
      >
        <h4>{editingId ? "Editar produto" : "Novo produto"}</h4>
        {error && <p className="coupon-msg">{error}</p>}
        {!editingId && (
          <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} required />
        )}
        <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
        <input
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Preço"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input name="category" placeholder="Categoria" value={form.category} onChange={handleChange} required />
        <input name="brand" placeholder="Marca" value={form.brand} onChange={handleChange} />
        {!editingId && (
          <input
            name="gallery"
            placeholder="URLs das imagens, separadas por vírgula"
            value={form.gallery}
            onChange={handleChange}
          />
        )}
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="normal" type="submit" disabled={saving}>
            {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Criar produto"}
          </button>
          {editingId && (
            <button type="button" className="normal" onClick={cancelEdit}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <table width="100%">
          <thead>
            <tr>
              <td>Produto</td>
              <td>Categoria</td>
              <td>Preço</td>
              <td>Ações</td>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>R${p.price.toFixed(2)}</td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button className="normal" onClick={() => startEdit(p)}>
                    Editar
                  </button>
                  <button className="normal" onClick={() => handleDelete(p.id)}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
