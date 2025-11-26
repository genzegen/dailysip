import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Products from '../components/Products';
import '../styles/Home.css';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [sortOption, setSortOption] = useState("relevance");

    useEffect(() => {
        fetch("http://localhost:8000/api/products/")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error(err));
    }, []);

    // Sorting logic
    const sortedProducts = [...products].sort((a, b) => {
        if (sortOption === 'price-low-high') return a.price - b.price;
        if (sortOption === 'price-high-low') return b.price - a.price;
        if (sortOption === 'newest-arrivals') return new Date(b.id) - new Date(a.id);
    });

    return (
        <div>
            <Header />
            <div className='home-container'>
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
                            <li className='coffee-filter'>
                                <label><input type="checkbox" style={{ marginRight: '0.8rem' }} />Coffee</label>
                            </li>
                            <li className='tea-filter'>
                                <label><input type="checkbox" style={{ marginRight: '0.8rem' }} />Tea</label>
                            </li>
                            <li className='mugs-filter'>
                                <label><input type="checkbox" style={{ marginRight: '0.8rem' }} />Mugs</label>
                            </li>
                            <li className='packs-filter'>
                                <label><input type="checkbox" style={{ marginRight: '0.8rem' }} />Packages</label>
                            </li>
                        </ul>
                        <div className='apply-filters'>Apply filters</div>
                    </div>
                </div>

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

                    {/* Send sorted products as props */}
                    <Products productslist={sortedProducts} />
                </div>
            </div>
        </div>
    );
}
