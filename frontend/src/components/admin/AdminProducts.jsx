import { useEffect, useState } from "react";
import '../../styles/AdminProducts.css';

export default function AdminProducts() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("quantity", product.quantity);
    formData.append("price", product.price);
    formData.append("discount", product.discount || "");
    formData.append("tags", product.tags.join(","));
    if (product.image) {
      formData.append("image", product.image);
    }

    try {
      const response = await fetch(`http://localhost:8000/api/products/${editingProduct.id}/update/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        alert("Product updated successfully!");
        setEditingProduct(null);
        setProduct({
          name: "",
          description: "",
          quantity: "",
          price: "",
          discount: "",
          tags: [],
          image: null,
          imagePreview: null,
        });
        setShowAddProduct(false);
        fetchProducts(); // refresh list
      } else {
        alert("Error updating product");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/products/");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    discount: "",
    tags: [],
    image: null,
    imagePreview: null,
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({
        ...product,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      console.log("Deleting product with id:", id);
      const response = await fetch(`http://localhost:8000/api/products/${id}/delete/`, {
        method: "DELETE",
        headers: {
          'Authorization': 'Token ${token}'
        }
      });

      if (response.ok) {
        alert("Product deleted successfully!");
        fetchProducts(); // refresh product list after deletion
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Something went wrong");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("quantity", product.quantity);
    formData.append("price", product.price);
    formData.append("discount", product.discount || "");
    formData.append("tags", product.tags.join(","));
    if (product.image) {
      formData.append("image", product.image);
    }

    try {
      const response = await fetch("http://localhost:8000/api/products/create/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Product added successfully!");
        setProduct({
          name: "",
          description: "",
          price: "",
          quantity: "",
          discount: "",
          tags: [],
          image: null,
          imagePreview: null,
        });
        fetchProducts(); // 🔄 Reload product list after adding
      } else {
        alert("Error adding product");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="admin-products-container">
      {showAddProduct && (
        <div className="addProduct ${editingProduct ? 'editing' : ''}">
          <div className="topAdminArea">
            <div className="topAdminAreaLeft">
              <h1 className="admin-products-title">Manage Products</h1>
              <p className="admin-products-subtitle">
                Manage product listings, inventory, and details here.
              </p>
            </div>

            <button
              type="button"
              className="cancel-edit-btn"
              onClick={() => {
              setEditingProduct(null);
              setProduct({
                name: "",
                description: "",
                quantity: "",
                price: "",
                discount: "",
                tags: [],
                image: null,
                imagePreview: null,
              });
              setShowAddProduct(false);
              }}
              >
                Cancel
            </button>
          </div>

          <form className="admin-products-form" onSubmit={editingProduct ? handleEdit : handleSubmit}>
            <div className="admin-products-row">
              {/* Left Column */}
              <div className="admin-products-col-left">
                <label>
                  Product Name:
                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </label>

                <label className="image-label">
                  Product Image:
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  {!product.imagePreview ? (
                    <div className="image-upload-placeholder">
                      Click to upload image
                    </div>
                  ) : (
                    <img
                      src={product.imagePreview}
                      alt="Preview"
                      className="image-preview"
                    />
                  )}
                </label>

                <button type="submit" className="admin-products-submit">
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>

              </div>

              {/* Right Column */}
              <div className="admin-products-col-right">
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows={6}
                  />
                </label>

                  <label>
                  Quantity:
                  <input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    onChange={handleChange}
                    placeholder="Enter product quantity"
                    required
                  />
                </label>

                <label>
                  Price:
                  <div className="price-input-wrapper">
                    <span className="price-indicator">Rs.</span>
                    <input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      placeholder="Enter product price"
                      required
                    />
                  </div>
                </label>

                <label>
                  Discount / Sale (Optional):
                  <input
                    type="text"
                    name="discount"
                    value={product.discount}
                    onChange={handleChange}
                    placeholder="e.g., 20% off"
                  />
                </label>

                <label>Tags (Select all that apply):</label>
                <div className="tag-checkbox-group">
                {["cups", "coffee", "tea", "packages"].map((tag) => (
                    <label key={tag} className="tag-checkbox">
                    <input
                        type="checkbox"
                        value={tag}
                        checked={product.tags.includes(tag)}
                        onChange={(e) => {
                        const updatedTags = e.target.checked
                            ? [...product.tags, tag]
                            : product.tags.filter((t) => t !== tag);
                        setProduct({ ...product, tags: updatedTags });
                        }}
                    />
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </label>
                ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {!showAddProduct && (
        <div className="productList">
          <div className="productList">
            <div className="addProductButton" onClick={() => setShowAddProduct(true)}>
              Add New Products
            </div>
            <table className="product-list-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Discount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img src={p.image} alt={p.name} />
                    </td>
                    <td>{p.name}</td>
                    <td>Rs. {p.price}</td>
                    <td>{p.quantity}</td>
                    <td>{p.discount || "-"}</td>
                    <td className="product-list-actions">
                      <button className="edit-btn" onClick={() => {
                        setEditingProduct(p);
                        setProduct({
                          name: p.name,
                          description: p.description,
                          quantity: p.quantity,
                          price: p.price,
                          discount: p.discount,
                          tags: p.tags,
                          image: null,
                          imagePreview: p.image,
                        });
                        setShowAddProduct(true);
                      }}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
