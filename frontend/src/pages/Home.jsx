import Header from '../components/Header'
import Products from '../components/Products'
import '../styles/Home.css'

export default function Home() {
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
                                <label>
                                    <input type="checkbox" style={{ marginRight: '0.8rem' }} />
                                    Coffee
                                </label>
                            </li>
                            <li className='tea-filter'>
                                <label>
                                    <input type="checkbox" style={{ marginRight: '0.8rem' }} />
                                    Tea
                                </label>
                            </li>
                            <li className='mugs-filter'>
                                <label>
                                    <input type="checkbox" style={{ marginRight: '0.8rem' }} />
                                    Mugs
                                </label>
                            </li>
                            <li className='packs-filter'>
                                <label>
                                    <input type="checkbox" style={{ marginRight: '0.8rem' }} />
                                    Packages
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='product-section'>
                    <div className='sort-section'>
                        <div className='sort-button'>
                            <span>Sort by:</span>
                            <select id="sort">
                                <option value="relevance">Relevance</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                                <option value="newest-arrivals">Newest Arrivals</option>
                            </select>
                        </div>
                        <p style={{ fontSize: '0.9rem', marginTop: '0' }}>Showing n Products</p>
                    </div>
                    <Products />
                    
                </div>
            </div>
        </div>
        
    )
}