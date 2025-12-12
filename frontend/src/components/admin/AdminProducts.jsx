import { useEffect, useState } from "react";
import '../../styles/AdminProducts.css';

export default function AdminProducts() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    discount: "",
    tags: [],
    images: [],
    imagePreviews: [],
    finalPrice: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/products/", {
        credentials: "include",
      });
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

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("quantity", product.quantity);
    formData.append("price", product.price);
    formData.append("discount", product.discount || "");
    formData.append("tags", Array.isArray(product.tags) ? product.tags.join(",") : "");

    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${editingProduct.id}/update/`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

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
          images: [],
          imagePreviews: [],
          finalPrice: "",
        });
        setShowAddProduct(false);
        fetchProducts();
      } else {
        let msg = "Error updating product";
        try {
          const data = await response.json();
          msg = data.detail || JSON.stringify(data);
        } catch (_) {
          const text = await response.text();
          if (text) msg = text;
        }
        alert(msg);
      }
    } catch (error) {
      console.error("Error:", error);
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
    formData.append("tags", Array.isArray(product.tags) ? product.tags.join(",") : "");

    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        formData.append("images", img);
      });
    }

    try {
      const response = await fetch("http://localhost:8000/api/products/create/", {
        method: "POST",
        body: formData,
        credentials: "include",
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
          images: [],
          imagePreviews: [],
          finalPrice: "",
        });
        fetchProducts();
        setShowAddProduct(false);
      } else {
        let msg = "Error adding product";
        try {
          const data = await response.json();
          msg = data.detail || JSON.stringify(data);
        } catch (_) {
          const text = await response.text();
          if (text) msg = text;
        }
        alert(msg);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${id}/delete/`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Product deleted successfully!");
        fetchProducts();
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Something went wrong");
    }
  };

  const handleChange = (e) => {
    const updated = { ...product, [e.target.name]: e.target.value };

    // 🔥 auto-calc final price
    if (updated.price && updated.discount) {
      updated.finalPrice = (
        updated.price -
        updated.price * (updated.discount / 100)
      ).toFixed(2);
    } else {
      updated.finalPrice = updated.price;
    }

    setProduct(updated);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) {
      setProduct({
        ...product,
        images: files,
        imagePreviews: files.map(f => URL.createObjectURL(f)),
      });
    }
  };

  const parseTags = (tags) => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === "string") return tags.split(",").filter((t) => t.trim());
    return [];
  };

  return (
    <div className="admin-products-container">
      {showAddProduct && (
        <div className={`addProduct ${editingProduct ? "editing" : ""}`}>
          <div className="topAdminArea">
            <div className="topAdminAreaLeft">
              <h1 className="admin-products-title">Manage Products</h1>
              <p className="admin-products-subtitle">
                Manage product listings, inventory, and details here.
              </p>
            </div>
          </div>

          <form
            className="admin-products-form"
            onSubmit={editingProduct ? handleEdit : handleSubmit}
          >
            <div className="admin-products-row">
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
                  Product Images (Multiple):
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  
                  {product.imagePreviews && product.imagePreviews.length > 0 ? (
                    <div className="image-preview-container">
                      {product.imagePreviews.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="image-preview"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="image-upload-placeholder">
                      Click to upload images (multiple allowed)
                    </div>
                  )}
                </label>

                <div className="addCancelButton">
                  <button type="submit" className="admin-products-submit">
                    {editingProduct ? "Save Changes" : "Add Product"}
                  </button>

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
                        images: [],           // ✅ Reset images
                        imagePreviews: [],    // ✅ Reset previews
                        finalPrice: "",
                      });
                      setShowAddProduct(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div className="admin-products-col-right">
                <label>
                  Description:
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Enter product description"
                  />
                </label>

                <label>
                  Quantity:
                  <input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    onChange={handleChange}
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
                      required
                    />
                  </div>
                </label>

                <label>
                  Discount / Sale (%):
                  <input
                    type="number"
                    name="discount"
                    value={product.discount}
                    onChange={handleChange}
                  />
                </label>

                {/* NEW FINAL PRICE PREVIEW */}
                {product.finalPrice && (
                  <p className="discount-preview">
                    Final Price: <strong>Rs. {product.finalPrice}</strong>
                  </p>
                )}

                <label>Tags:</label>
                <div className="tag-checkbox-group">
                  {["cups", "coffee", "tea", "packages"].map((tag) => (
                    <label key={tag} className="tag-checkbox">
                      <input
                        type="checkbox"
                        value={tag}
                        checked={Array.isArray(product.tags) && product.tags.includes(tag)}
                        onChange={(e) => {
                          const currentTags = Array.isArray(product.tags)
                            ? product.tags
                            : [];
                          const updated = e.target.checked
                            ? [...currentTags, tag]
                            : currentTags.filter((t) => t !== tag);
                          setProduct({ ...product, tags: updated });
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
          <div className="addProductButton" onClick={() => setShowAddProduct(true)}>
            Add New Products
          </div>

          <div className="table-wrapper">
            <table className="product-list-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>

                  {/* UPDATED PRICE COLUMN */}
                  <th>Price</th>

                  <th>Quantity</th>
                  <th>Discount</th>
                  <th>Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    {/* IMAGE COLUMN - UPDATED */}
                    <td>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img
                          src={
                            p.images && p.images.length > 0
                              ? (p.images[0].image?.startsWith("http")
                                  ? p.images[0].image
                                  : `http://localhost:8000${p.images[0].image}`
                                )
                              : (p.image
                                  ? (p.image.startsWith("http")
                                      ? p.image
                                      : `http://localhost:8000${p.image}`
                                    )
                                  : "https://via.placeholder.com/80"
                                )
                          }
                          alt={p.name}
                        />
                        {p.images && p.images.length > 1 && (
                          <span style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}>
                            +{p.images.length - 1}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>{p.name}</td>

                    {/* PRICE COLUMN */}
                    <td>
                      {p.discount ? (
                        <>
                          <span className="price-old">Rs. {p.price}</span>
                          <br />
                          <span className="price-new">
                            Rs. {(
                              p.price -
                              p.price * (p.discount / 100)
                            ).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <>Rs. {p.price}</>
                      )}
                    </td>

                    <td>{p.quantity}</td>
                    <td>{p.discount || "-"}</td>

                    <td>
                      {parseTags(p.tags).length > 0
                        ? parseTags(p.tags)
                            .map((tag) => tag.charAt(0).toUpperCase() + tag.slice(1))
                            .join(", ")
                        : "-"}
                    </td>

                    {/* ACTION BUTTONS */}
                    <td className="product-list-actions">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          const tags = parseTags(p.tags);
                          setEditingProduct(p);

                          const final = p.discount
                            ? (p.price - p.price * (p.discount / 100)).toFixed(2)
                            : p.price;

                          setProduct({
                            name: p.name,
                            description: p.description,
                            quantity: p.quantity,
                            price: p.price,
                            discount: p.discount || "",
                            tags: tags,
                            images: [],
                            imagePreviews: p.images?.map(img => 
                              img.image?.startsWith("http") 
                                ? img.image 
                                : `http://localhost:8000${img.image}`
                            ) || [],
                            finalPrice: final,
                          });
                          setShowAddProduct(true);
                        }}
                      >
                        Edit
                      </button>

                      <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                        Delete
                      </button>
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
