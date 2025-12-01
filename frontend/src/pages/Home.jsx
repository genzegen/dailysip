import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Products from '../components/Products';
import SingleProduct from '../components/SingleProduct';
import '../styles/Home.css';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [sortOption, setSortOption] = useState("relevance");
    const [selectedProduct, setSelectedProduct] = useState(null); // Added missing state

    useEffect(() => {
        fetch("http://localhost:8000/api/products/")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error(err));
    }, []);

    const sortedProducts = [...products].sort((a, b) => {
        if (sortOption === 'price-low-high') return a.price - b.price;
        if (sortOption === 'price-high-low') return b.price - a.price;
        if (sortOption === 'newest-arrivals') return b.id - a.id;
        return 0;
    });

    return (
        <div>
            <Header />
            <div className='home-container'>
                {/* FILTER SECTION */}
                <div className='filter-section'>
                    <div className='filter-heading' style={{
                        height: '8vh',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        gap: '1rem'
                    }}>
                        <h1>Filters</h1>
                        <button className='filter-clear-btn'>Clear filters</button>
                    </div>
                    <div className='filter-list'>
                        <ul>
                            <li style={{ fontWeight: '600', fontSize: '1.2rem' }}>Categories</li>
                            <li><label><input type="checkbox" /> Coffee</label></li>
                            <li><label><input type="checkbox" /> Tea</label></li>
                            <li><label><input type="checkbox" /> Mugs</label></li>
                            <li><label><input type="checkbox" /> Packages</label></li>
                        </ul>
                        <div className='apply-filters'>Apply filters</div>
                    </div>
                </div>

                {selectedProduct ? (
                    <SingleProduct product={selectedProduct} onBack={() => setSelectedProduct(null)} />
                ) : (
                    <>
                        {/* PRODUCT SECTION */}
                        <div className='product-section'>
                            <div className='sort-section'>
                                <div className='sort-button'>
                                    <span>Sort by:</span>
                                    <select
                                        id="sort"
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                    >
                                        <option value="relevance">Relevance</option>
                                        <option value="price-low-high">Price: Low to High</option>
                                        <option value="price-high-low">Price: High to Low</option>
                                        <option value="newest-arrivals">Newest Arrivals</option>
                                    </select>
                                </div>
                                <p style={{ fontSize: '0.9rem', marginTop: '0' }}>
                                    Showing {sortedProducts.length} Products
                                </p>
                            </div>
                            <Products
                                productslist={sortedProducts}
                                onProductClick={setSelectedProduct}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
