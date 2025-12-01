import '../styles/SingleProduct.css';

export default function SingleProduct({ product, onBack }) {
  return (
    <div className="single-product-container">
      <button className="back-btn" onClick={onBack}>← Back to Products</button>

      <div className="single-product-content">
        <img
          src={`http://localhost:8000${product.image}`}
          alt={product.name}
          className="product-image"
        />

        <div className="details">
          <h2>{product.name}</h2>
          <p className="price">Rs. {product.price}</p>

          {/* Quantity Section */}
          <p className="quantity">
            <strong>Available:</strong> {product.quantity > 0 ? product.quantity : 'Out of Stock'}
          </p>

          <p className="description">{product.description}</p>

          <div className="action-buttons">
            <button className="like-btn">♡ Like</button>
            <button
              className="cart-btn"
              disabled={product.quantity === 0}
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
