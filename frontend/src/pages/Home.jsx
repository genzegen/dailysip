import Header from '../components/Header'
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
                            <li>Categories</li>
                            <li>Coffee</li>
                            <li>Tea</li>
                            <li>Mugs</li>
                        </ul>
                    </div>
                </div>
                <div className='product-section'></div>
            </div>
        </div>
        
    )
}