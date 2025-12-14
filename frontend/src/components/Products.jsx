import '../styles/Products.css';
import SingleProduct from './SingleProduct'; // optional, if you only need product list, can remove

const API_URL = import.meta.env.VITE_API_URL || '';

function toImageUrl(raw) {
  if (!raw) return "/no-image.svg";
  if (typeof raw !== "string") return "/no-image.svg";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return `${API_URL}${raw}`;
  return `${API_URL}/${raw}`;
}

export default function Products({ productslist, onProductClick }) {
  return (
    <div className="product-grid">
      {productslist && productslist.length > 0 ? (
        productslist.map((product) => {
          const firstImage =
            product.images && product.images.length > 0
              ? toImageUrl(product.images[0].image)
              : "/no-image.svg";

          return (
            <div
              key={product.id}
              className="product-card"
              onClick={() => onProductClick(product)} // send selection to Home
              style={{ cursor: "pointer" }}
            >
              <div className="product-img">
                <img src={firstImage} alt={product.name} />
                {product.discount && (
                  <span className="discount-badge">{product.discount}% OFF</span>
                )}
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>

                <p>
                  {product.discount ? (
                    <>
                      <span className="discounted-price">Rs. {product.price}</span>
                      <span className="original-price">
                        &nbsp;Rs.{" "}
                        {(
                          Number(product.price) /
                          (1 + Number(product.discount) / 100)
                        ).toFixed(0)}
                      </span>
                    </>
                  ) : (
                    <span
                      style={{
                        color: "#1a751a",
                        fontWeight: "bold",
                        fontSize: "1.3rem",
                      }}
                    >
                      Rs. {product.price}
                    </span>
                  )}
                </p>

                {product.out_of_stock ? (
                  <span className="stock-pill out">Out of stock</span>
                ) : product.low_stock ? (
                  <span className="stock-pill low">Low stock</span>
                ) : null}
              </div>
            </div>
          );
        })
      ) : (
        <p>No Products found.</p>
      )}
    </div>
  );
}
