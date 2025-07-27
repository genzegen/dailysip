import '../styles/Products.css'

const products = [
  {
    name: 'Espresso Beans',
    price: '12.99',
  },
  {
    name: 'Green Tea Pack',
    price: '9.50',
  },
  {
    name: 'Custom Mug',
    price: '7.25',
  },
  {
    name: 'Coffee Bundle',
    price: '24.99',
  },
];

export default function Products() {
    return(
        <div className='product-grid'>
            {products.map((product, index) => (
                <div className='product-card' key={index}>
                    {/* <img src={product.image} alt={product.name} /> */}
                    <div className='product-info'>
                        <h3>{product.name}</h3>
                        <p>Rs. {product.price}</p>
                    </div>
                </div>
            ))} 
        </div>
    );
}