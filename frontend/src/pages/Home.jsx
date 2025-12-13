import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Products from '../components/Products';
import SingleProduct from '../components/SingleProduct';
import '../styles/Home.css';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [sortOption, setSortOption] = useState("relevance");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedTag, setSelectedTag] = useState("");
    const [appliedTag, setAppliedTag] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const location = useLocation();

    // SEO: page title for shop
    useEffect(() => {
        document.title = 'Shop Coffee & Tea – dailySips';
    }, []);

    // Sync searchTerm with ?search= query param
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('search') || "";
        setSearchTerm(q);
    }, [location.search]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (appliedTag) params.append('tag', appliedTag);

        const queryString = params.toString();
        // FIXED: Changed from /api/products/ to /api/
        const url = queryString
            ? `${API_URL}/api/?${queryString}`
            : `${API_URL}/api/`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error(err));
    }, [appliedTag, searchTerm]);

    const handleCategoryChange = (tag) => {
        setSelectedTag((prev) => (prev === tag ? "" : tag));
    };

    const handleApplyFilters = () => {
        setAppliedTag(selectedTag);
    };

    const handleClearFilters = () => {
        setSelectedTag("");
        setAppliedTag("");
    };

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
                {/* Only show filter section if no product is selected */}
                {!selectedProduct && (
                <div className='filter-section'>
                    <div className='filter-heading' style={{
                    height: '8vh',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    gap: '1rem'
                    }}>
                    <h1>Filters</h1>
                    <button className='filter-clear-btn' onClick={handleClearFilters}>Clear filters</button>
                    </div>
                    <div className='filter-list'>
                    <ul>
                        <li style={{ fontWeight: '600', fontSize: '1.2rem' }}>Categories</li>
                        <li>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedTag === 'coffee'}
                                    onChange={() => handleCategoryChange('coffee')}
                                />{' '}
                                Coffee
                            </label>
                        </li>
                        <li>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedTag === 'tea'}
                                    onChange={() => handleCategoryChange('tea')}
                                />{' '}
                                Tea
                            </label>
                        </li>
                        <li>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedTag === 'cups'}
                                    onChange={() => handleCategoryChange('cups')}
                                />{' '}
                                Cups
                            </label>
                        </li>
                        <li>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedTag === 'packages'}
                                    onChange={() => handleCategoryChange('packages')}
                                />{' '}
                                Packages
                            </label>
                        </li>
                    </ul>
                    <div className='apply-filters' onClick={handleApplyFilters}>Apply filters</div>
                    </div>
                </div>
                )}

                {/* PRODUCT SECTION */}
                <div className='product-section'>
                {!selectedProduct ? (
                    <>
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
                    </>
                ) : (
                    <SingleProduct
                    product={selectedProduct}
                    onBack={() => setSelectedProduct(null)}
                    />
                )}
                </div>
            </div>
        </div>
    );
}