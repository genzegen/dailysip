import '../styles/Products.css';

export default function Products({ productslist }) {
  return (
    <div className="product-grid">
      {productslist && productslist.length > 0 ? (
        productslist.map(product => (
          <div key={product.id} className="product-card">
            <div className='product-img'>
              <img
                src={`http://localhost:8000${product.image}`}
                alt={product.name}
              />

              {product.discount && (
                <span className="discount-badge">{product.discount}% OFF</span>
              )}
            </div>

            <div className='product-info'>
              <h3>{product.name}</h3>
              <p>
                {product.discount && !isNaN(product.discount) ? (
                  <>
                    <span className="discounted-price">Rs. {product.price}</span>
                    <span className="original-price">
                      &nbsp;Rs. {(
                        Number(product.price) / (1 + Number(product.discount) / 100)
                      ).toFixed(0)}
                    </span>
                  </>
                ) : (
                  <span style={{ color: '#d32f2f', fontWeight: '600', fontSize: '1.2rem' }}>
                    Rs. {product.price}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No Products found.</p>
      )}
    </div>
  );
}
