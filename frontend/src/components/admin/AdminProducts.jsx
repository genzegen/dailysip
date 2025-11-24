import { useState } from "react";
import '../../styles/AdminProducts.css';

export default function AdminProducts() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
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

    const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data for file upload
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("discount", product.discount || "");
    formData.append("tags", product.tags.join(",")); // convert array → string

    if (product.image) {
        formData.append("image", product.image); // file
    }

    try {
        const response = await fetch("http://localhost:8000/api/products/", {
        method: "POST",
        body: formData,
        });

        if (response.ok) {
        alert("Product added successfully!");
        setProduct({
            name: "",
            description: "",
            price: "",
            discount: "",
            tags: [],
            image: null,
            imagePreview: null,
        });
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
      <h1 className="admin-products-title">Add Products</h1>
      <p className="admin-products-subtitle">
        Manage product listings, inventory, and details here.
      </p>

      <form className="admin-products-form" onSubmit={handleSubmit}>
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
                id="imageInput"
              />
              {!product.imagePreview ? (
                <div
                  className="image-upload-placeholder"
                  onClick={() => document.getElementById('imageInput').click()}
                >
                    Click to upload image
                </div>
              ) : (
                <img
                  src={product.imagePreview}
                  alt="Preview"
                  className="image-preview"
                  onClick={() => document.getElementById('imageInput').click()}
                />
              )}
            </label>
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

        <button type="submit" className="admin-products-submit">
          Add Product
        </button>
      </form>
    </div>
  );
}
