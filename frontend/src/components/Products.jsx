import '../styles/Products.css';

const productslist = [
  {
    id: 1,
    name: 'Morning Bundle',
    price: 1299,
  },
  {
    id: 2,
    name: 'Couples Date Bundle',
    price: 2999,
  },
  {
    id: 3,
    name: 'Tea Style Bundle',
    price: 999,
  },
  {
    id: 3,
    name: 'Tea Style Bundle',
    price: 999,
  },
  {
    id: 3,
    name: 'Tea Style Bundle',
    price: 999,
  },
  {
    id: 3,
    name: 'Tea Style Bundle',
    price: 999,
  },
  {
    id: 3,
    name: 'Tea Style Bundle',
    price: 999,
  },
  {
    id: 3,
    name: 'Tea Style Bundle',
    price: 999,
  },
  {
    id: 3,
    name: 'Tea Style Bundle',
    price: 999,
  },
  {
    id: 3,
    name: 'Tea Style Bundle',
    price: 999,
  },
  {
    id: 3,
    name: 'Tea Style Bundle',
    price: 999,
  },
  {
    id: 3,
    name: 'Tea Style Bundle',
    price: 999,
  },
  {
    id: 3,
    name: 'Tea Style Bundle',
    price: 999,
  },
  {
    id: 3,
    name: 'Tea Style Bundle',
    price: 999,
  },
]

export default function Products () {
  return(
    <div className="product-grid">
      {productslist.length > 0 ? (
          productslist.map(product => (
          <div key={product.id} className="product-card">
            <div className='product-img'></div>
            <div className='product-info'>
              <h3>{product.name}</h3>
              <p>Rs. {product.price}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No Products found.</p>
      )}
    </div>
  )
}