import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/SingleProduct.css'; 

const API_URL = import.meta.env.VITE_API_URL || ''; 

function toImageUrl(raw) {
  if (!raw) return "/no-image.svg";
  if (typeof raw !== "string") return "/no-image.svg";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return `${API_URL}${raw}`;
  return `${API_URL}/${raw}`;
}

export default function SingleProduct({ product, onBack }) {
  const navigate = useNavigate();
  const images = product.images?.length > 0
    ? product.images.map(img => toImageUrl(img.image))
    : ["/no-image.svg"];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/getstarted');
      return;
    }

    setAdding(true);
    try {
      // FIXED: Changed from /api/products/cart/add/ to /api/cart/add/
      const res = await fetch(`${API_URL}/api/cart/add/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ product: product.id, quantity })
      });

      if (res.ok) {
        alert("Added to cart!");
      } else {
        const data = await res.json();
        alert(data.detail || "Failed to add to cart.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
    setAdding(false);
  };

  return (
    <div className="single-product-container">
      <button className="back-btn" onClick={onBack}>← Back to Products</button>

      <div className="single-product-content">
        <div className="image-section">
          <img src={selectedImage} alt={product.name} className="main-product-image"/>
          <div className="thumbnail-row">
            {images.map((img, i) => (
              <img key={i} src={img} alt="thumbnail"
                className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="details">
          <h2>{product.name}</h2>
          <p className="price">Rs. {product.final_price ?? product.price}</p>
          {product.discount > 0 && (
            <p className="original-price-text">
              Original: <span className="original-price">Rs. {product.price}</span>  
              &nbsp;({product.discount}% OFF)
            </p>
          )}

          <div className="quantity">
            {product.quantity === 0 ? (
              <span className="stock-badge out-of-stock">Out of stock</span>
            ) : product.low_stock ? (
              <span className="stock-badge low-stock">Low stock 
                {product.quantity !== undefined && ` (${product.quantity} left)`}
              </span>
            ) : (
              <span className="stock-badge in-stock">In stock 
                {product.quantity !== undefined && ` (${product.quantity} available)`}
              </span>
            )}
          </div>

          {product.quantity > 0 && (
            <div className="quantity-selector">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}>+</button>
            </div>
          )}

          <p className="description">{product.description}</p>

          <div className="action-buttons">
            <button className="like-btn">♡ Like</button>
            <button className="cart-btn" 
              disabled={product.quantity === 0 || adding} 
              onClick={handleAddToCart}>
              {adding ? "Adding..." : "🛒 Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}