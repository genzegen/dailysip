import '../styles/Instagram.css';
import post1 from '../assets/instagram/post1.png';
import post2 from '../assets/instagram/post2.png';
import post3 from '../assets/instagram/post3.png';

const posts = [post1, post2, post3];

export default function Instagram() {
  return (
    <div className="instagram-section" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        }}>
      <h2 style={{ margin: '1rem' }}>Follow Us On Instagram</h2>
      <p>@dailysips</p>
      <div className="instagram-grid">
        {posts.map((post, index) => (
          <div className="instagram-post" key={index}>
            <div className="instagram-post-header">
              <img src={post1} className="profile" alt="profile" />
              <span className="username">dailysips</span>
              <span className="menu">•••</span>
            </div>
            <div className="instagram-post-image">
              <img src={post} alt={`Post ${index + 1}`} />
            </div>
            <div className="instagram-post-actions">
              <span>♡ 💬 ➤</span>
              <span>🔖</span>
            </div>
            <div className="instagram-post-caption">
              <span className="caption-username">dailysips</span>
              Discover your next sip 🍵
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
