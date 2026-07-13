 import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api/v1' });

function App() {
  // Navigation & Auth States
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Core App States
  const [restaurants, setRestaurants] = useState([]);
  const [aiPicks, setAiPicks] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]); // Added to track actual items for AI Cart Optimizer
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [aiPreference, setAiPreference] = useState('rating');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState(null); // Tracks the AI cart upsell recommendation

  // Fetch real data or fall back seamlessly
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/restaurants');
        if (response.data && response.data.data && response.data.data.length > 0) {
          setRestaurants(response.data.data);
        } else {
          setRestaurants(mockRestaurants);
        }
      } catch (err) {
        console.log("Database disconnected/empty, active mockup layer online.");
        setRestaurants(mockRestaurants);
      }
    };
    fetchData();
  }, []);

  // Filter and sort for search queries and AI picks with Semantic AI Mapping
  useEffect(() => {
    let query = searchQuery.toLowerCase().trim();
    if (query === 'diet' || query === 'healthy' || query === 'low cal') {
      query = 'salad';
    } else if (query === 'spicy' || query === 'indian' || query === 'rice') {
      query = 'biryani';
    } else if (query === 'heavy' || query === 'cheat day' || query === 'junk') {
      query = 'burger';
    } else if (query === 'sweet' || query === 'dessert') {
      query = 'cake';
    }

    let filtered = restaurants.filter(r => 
      r.name.toLowerCase().includes(query) ||
      r.cuisine.toLowerCase().includes(query)
    );

    if (filtered.length > 0) {
      if (aiPreference === 'rating') {
        filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      } else if (aiPreference === 'speed') {
        filtered.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
      }
      setAiPicks(filtered.slice(0, 3));
    } else {
      setAiPicks([]);
    }
  }, [restaurants, aiPreference, searchQuery]);

  // NEW FEATURE: Real-time AI Cart Companion/Upsell Engine
  useEffect(() => {
    if (cartItems.length > 0) {
      const lastItem = cartItems[cartItems.length - 1].name.toLowerCase();
      // Behavioral Association Rule Mining emulation
      if (lastItem.includes("biryani") || lastItem.includes("dosa") || lastItem.includes("roll")) {
        setAiRecommendation({ name: "Chocolate Fudge Lava Cake", price: 129, reason: "89% of foodies pair hot entrees with a sweet dessert!" });
      } else if (lastItem.includes("combo") || lastItem.includes("fries")) {
        setAiRecommendation({ name: "Premium Signature Combo Upgrade", price: 299, reason: "Unlock dynamic value clustering by bundling your sides!" });
      } else {
        setAiRecommendation({ name: "House Loaded Fries", price: 149, reason: "Highly rated side dish that perfectly complements your meal velocity." });
      }
    } else {
      setAiRecommendation(null);
    }
  }, [cartItems]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setUserEmail(loginForm.email || 'intern@perpex.com');
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setLoginForm({ email: '', password: '' });
  };

  const addToCart = (item) => {
    setCartCount(prev => prev + 1);
    setCartItems(prev => [...prev, item]);
  };

  // Filter final lists according to user text input
  const visibleRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Header Bar */}
      <header style={styles.header}>
        <h1 style={styles.logo} onClick={() => setCurrentPage('home')}>🍔 FoodExpress Pro AI</h1>
        
        {currentPage === 'home' && (
          <div style={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="🔍 Search cuisines (e.g., Biryani, Pizza, Dosa, Burger)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        )}

        <div style={styles.navLinks}>
          <span style={styles.aiBadge}>AI Engine Active</span>
          {currentPage === 'home' && <div style={styles.cartBadge}>Cart ({cartCount})</div>}
          
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={styles.userTag}>👤 {userEmail.split('@')[0]}</span>
              <button style={styles.authBtn} onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button 
              style={styles.authBtn} 
              onClick={() => setCurrentPage(currentPage === 'home' ? 'login' : 'home')}
            >
              {currentPage === 'home' ? 'Login' : 'Back Home'}
            </button>
          )}
        </div>
      </header>

      {/* RENDER LOGIN PAGE */}
      {currentPage === 'login' && (
        <div style={styles.loginContainer}>
          <form style={styles.loginCard} onSubmit={handleLoginSubmit}>
            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Secure User Login</h2>
            <div style={styles.inputGroup}>
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="enter your email..."
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                style={styles.inputField} 
              />
            </div>
            <div style={styles.inputGroup}>
              <label>Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                style={styles.inputField} 
              />
            </div>
            <button type="submit" style={styles.submitBtn}>Authenticate Profile</button>
          </form>
        </div>
      )}

      {/* RENDER HOME PAGE */}
      {currentPage === 'home' && (
        <>
          {/* AI Panel */}
          <div style={styles.aiSection}>
            <div style={styles.aiHeaderRow}>
              <div>
                <h2 style={styles.aiTitle}>✨ AI Personal Picks For You</h2>
                <span style={styles.aiSubtag}>Dynamic multi-variate sorting optimization</span>
              </div>
              <div style={styles.filterGroup}>
                <button 
                  style={aiPreference === 'rating' ? styles.activeFilterBtn : styles.filterBtn}
                  onClick={() => setAiPreference('rating')}
                >⭐ Top Rated</button>
                <button 
                  style={aiPreference === 'speed' ? styles.activeFilterBtn : styles.filterBtn}
                  onClick={() => setAiPreference('speed')}
                >⏱️ Fastest</button>
              </div>
            </div>
            
            {aiPicks.length === 0 ? <p style={{color: '#888'}}>No smart recommendations match your search text.</p> : (
              <div style={styles.aiGrid}>
                {aiPicks.map((r) => (
                  <div key={`ai-${r.id || r._id}`} style={styles.aiCard} onClick={() => setSelectedRestaurant(r)}>
                    <div style={styles.aiRibbon}>Smart Match</div>
                    <img src={r.image} alt={r.name} style={styles.aiCardImage} />
                    <div style={styles.cardBody}>
                      <h3 style={styles.resHeading}>{r.name}</h3>
                      <p style={styles.cuisine}>{r.cuisine}</p>
                      <div style={styles.metaRow}>
                        <span style={styles.rating}>⭐ {r.rating}</span>
                        <span>⏱️ {r.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr style={styles.divider} />

          {/* Core Explorer Grid */}
          <h2 style={styles.title}>Explore All Restaurants</h2>
          {visibleRestaurants.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>
              <h3>No restaurants match "{searchQuery}"</h3>
              <p>Try searching for options like Pizza, Burger, Biryani, Dosa, or Salad!</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {visibleRestaurants.map((r) => (
                <div key={r.id || r._id} style={styles.card}>
                  <img src={r.image} alt={r.name} style={styles.cardImage} />
                  <div style={styles.cardBody}>
                    <h3 style={styles.resHeading}>{r.name}</h3>
                    <p style={styles.cuisine}>{r.cuisine}</p>
                    <div style={styles.metaRow}>
                      <span style={styles.rating}>⭐ {r.rating}</span>
                      <span>{r.deliveryTime}</span>
                    </div>
                    <button style={styles.viewButton} onClick={() => setSelectedRestaurant(r)}>View Menu</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Menu Modal Layer */}
          {selectedRestaurant && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2>{selectedRestaurant.name} - Menu</h2>
                  <button style={styles.closeBtn} onClick={() => setSelectedRestaurant(null)}>✕</button>
                </div>

                {/* AI CART OPTIMIZER BANNER DISPLAY */}
                {aiRecommendation && (
                  <div style={styles.aiUpsellBanner}>
                    <div>
                      <span style={styles.aiUpsellBadge}>🔮 AI Smart Recommendation</span>
                      <h4 style={{ margin: '4px 0 2px 0', color: '#0d47a1' }}>{aiRecommendation.name} (₹{aiRecommendation.price})</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: '#555', italic: 'true' }}>{aiRecommendation.reason}</p>
                    </div>
                    <button style={styles.aiAddBtn} onClick={() => addToCart({ name: aiRecommendation.name, price: aiRecommendation.price })}>
                      Add Companion
                    </button>
                  </div>
                )}

                <div style={styles.menuList}>
                  {mockMenu.map((item) => (
                    <div key={item.id} style={styles.menuItem}>
                      <div>
                        <h4>{item.name}</h4>
                        <span style={{color: '#e44d26'}}>₹{item.price}</span>
                      </div>
                      <button style={styles.addBtn} onClick={() => addToCart(item)}>Add</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const mockRestaurants = [
  { 
    id: 1, 
    name: "The Pizza Haven", 
    cuisine: "Italian, Pizzas, Fast Food", 
    rating: "4.5", 
    deliveryTime: "25 mins", 
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" 
  },
  { 
    id: 2, 
    name: "Burger Bistro", 
    cuisine: "American, Fast Food, Burgers", 
    rating: "4.3", 
    deliveryTime: "20 mins", 
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" 
  },
  { 
    id: 3, 
    name: "Spice Symphony", 
    cuisine: "North Indian, Chinese, Curry", 
    rating: "4.1", 
    deliveryTime: "35 mins", 
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500" 
  },
  { 
    id: 4, 
    name: "Green Garden Salad", 
    cuisine: "Healthy Food, Salads, Juices", 
    rating: "4.6", 
    deliveryTime: "15 mins", 
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500" 
  },
  { 
    id: 5, 
    name: "Royal Biryani House", 
    cuisine: "Mughlai, Hyderabadi Biryani, North Indian", 
    rating: "4.7", 
    deliveryTime: "30 mins", 
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500" 
  },
  { 
    id: 6, 
    name: "The Dessert Oasis", 
    cuisine: "Desserts, Waffles, Ice Cream, Cakes", 
    rating: "4.4", 
    deliveryTime: "22 mins", 
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500" 
  },
  { 
    id: 7, 
    name: "Dakshin Delights", 
    cuisine: "South Indian, Dosa, Idli, Veg", 
    rating: "4.2", 
    deliveryTime: "18 mins", 
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500" 
  }
];

const mockMenu = [
  { id: 101, name: "Premium Signature Combo", price: 299 },
  { id: 102, name: "Chef's Special Roll", price: 189 },
  { id: 103, name: "House Loaded Fries", price: 149 },
  { id: 104, name: "Special Dum Biryani", price: 249 },
  { id: 105, name: "Masala Dosa Classic", price: 99 },
  { id: 106, name: "Chocolate Fudge Lava Cake", price: 129 }
];

const styles = {
  container: { fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', paddingBottom: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 40px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  logo: { margin: 0, fontSize: '24px', color: '#e44d26', fontWeight: '700', cursor: 'pointer' },
  searchContainer: { flex: '0 1 450px', margin: '0 20px' },
  searchInput: { width: '100%', padding: '10px 16px', borderRadius: '24px', border: '1px solid #ccc', outline: 'none', fontSize: '14px' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '20px' },
  aiBadge: { backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '6px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' },
  cartBadge: { backgroundColor: '#e44d26', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontWeight: '600' },
  authBtn: { backgroundColor: '#fff', border: '1px solid #333', color: '#333', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
  userTag: { fontWeight: 'bold', color: '#0d47a1', fontSize: '14px' },
  loginContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' },
  loginCard: { backgroundColor: '#fff', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' },
  inputField: { padding: '10px 14px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' },
  submitBtn: { width: '100%', backgroundColor: '#e44d26', color: '#fff', border: 'none', padding: '12px 0', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
  aiSection: { margin: '30px 40px 10px 40px', padding: '20px', backgroundColor: '#fff', borderRadius: '16px', borderLeft: '5px solid #0d47a1', boxShadow: '0 4px 20px rgba(13,71,161,0.08)' },
  aiHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  aiTitle: { margin: 0, color: '#0d47a1' },
  aiSubtag: { fontSize: '12px', color: '#777' },
  filterGroup: { display: 'flex', gap: '10px' },
  filterBtn: { backgroundColor: '#f0f2f5', border: 'none', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer' },
  activeFilterBtn: { backgroundColor: '#0d47a1', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer' },
  aiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
  aiCard: { position: 'relative', backgroundColor: '#fcfdff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e3f2fd', cursor: 'pointer' },
  aiRibbon: { position: 'absolute', top: '10px', left: '10px', backgroundColor: '#0d47a1', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  aiCardImage: { width: '100%', height: '140px', objectFit: 'cover' },
  divider: { margin: '40px 40px', border: '0', borderTop: '1px solid #e0e0e0' },
  title: { padding: '0 40px 10px 40px', margin: 0, color: '#333' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', padding: '20px 40px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  cardImage: { width: '100%', height: '180px', objectFit: 'cover' },
  cardBody: { padding: '15px' },
  resHeading: { margin: '0 0 5px 0', fontSize: '18px', color: '#222' },
  cuisine: { color: '#666', fontSize: '13px', margin: '5px 0 10px 0' },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  rating: { backgroundColor: '#48c479', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '12px' },
  viewButton: { width: '100%', backgroundColor: '#fff', border: '1px solid #e44d26', color: '#e44d26', padding: '8px 0', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#fff', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '500px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' },
  menuList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  menuItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' },
  addBtn: { backgroundColor: '#e44d26', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
  
  // AI Upsell UI Layout Style
  aiUpsellBanner: { backgroundColor: '#f0f7ff', border: '1px dashed #0d47a1', borderRadius: '8px', padding: '12px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  aiUpsellBadge: { backgroundColor: '#0d47a1', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', display: 'inline-block' },
  aiAddBtn: { backgroundColor: '#0d47a1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }
};

export default App;