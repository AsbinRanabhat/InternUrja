import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const limit = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = search
          ? `https://dummyjson.com/products/search?q=${search}`
          : `https://dummyjson.com/products?limit=${limit}&skip=${page * limit}`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("Something went wrong");
        }

        const data = await res.json();
        console.log(data)
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, page]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product Store</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
      />

      {/* States */}
      {loading && <p>The product are loading</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Products */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
            <img src={p.thumbnail} alt={p.title} width="100%" />
            <h3>{p.title}</h3>
            <p>${p.price}</p>
            <p><b>Rating:</b> {p.rating}</p>
            <p>{p.category}</p>
            <p>Availability: {p.stock}</p>
            <p>Brand: {p.brand}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!search && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
            Prev
          </button>

          <span> Page {page + 1} </span>

          <button onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}

export default App;
