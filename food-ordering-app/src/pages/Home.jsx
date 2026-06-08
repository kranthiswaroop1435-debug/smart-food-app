import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { foodItems, foodCategories, getItemsByCategory } from '../data/foodData';
import './Home.css';

// Home/Menu Page Component
// Displays food items with category filtering and add to cart functionality
const Home = ({ cart, addToCart }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredItems, setFilteredItems] = useState(foodItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  // Get user info from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Filter items when category or search changes
  useEffect(() => {
    let items = getItemsByCategory(selectedCategory);
    
    // Apply search filter
    if (searchQuery.trim()) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredItems(items);
  }, [selectedCategory, searchQuery]);

  // Get cart item count for a specific item
  const getItemQuantity = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Calculate total cart items
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">Smart Food</span>
          </div>
          
          <div className="nav-search">
            <input
              type="text"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon"></span>
          </div>
          
          <div className="nav-actions">
            <Link to="/cart" className="cart-btn">
              <span className="cart-icon">🛒</span>
              {totalCartItems > 0 && (
                <span className="cart-badge">{totalCartItems}</span>
              )}
              <span className="cart-text">Cart</span>
            </Link>
            
            <div className="user-menu">
              <span className="user-name">
                {user?.name || 'User'}
              </span>
              <Link to="/orders" className="orders-link-btn" style={{ marginLeft: '12px', marginRight: '12px', color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '500' }}>
                Orders
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Delicious Food, Delivered Fast! </h1>
          <p>Order your favorite meals from the comfort of your home</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Category Filter */}
          <div className="category-section">
            <h2 className="section-title">Browse by Category</h2>
            <div className="category-filters">
              {foodCategories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'All' ? '🍴 All Items' : 
                   category === 'Pizza' ? '🍕 Pizza' :
                   category === 'Burgers' ? '🍔 Burgers' :
                   category === 'Chinese' ? '🥡 Chinese' :
                   category === 'Desserts' ? '🍰 Desserts' :
                   category === 'Beverages' ? '🥤 Beverages' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Food Items Grid */}
          <div className="food-section">
            <div className="section-header">
              <h2 className="section-title">
                {selectedCategory === 'All' ? 'All Menu Items' : selectedCategory}
              </h2>
              <span className="item-count">{filteredItems.length} items</span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="no-results">
                <span className="no-results-icon">😕</span>
                <h3>No items found</h3>
                <p>Try a different category or search term</p>
              </div>
            ) : (
              <div className="food-grid">
                {filteredItems.map((item) => (
                  <div key={item.id} className="food-card card">
                    {/* Food Image */}
                    <div className="food-image">
                      <img src={item.image} alt={item.name} loading="lazy" />
                      <div className="food-badges">
                        {item.vegetarian && (
                          <span className="badge vegetarian">🌱 Veg</span>
                        )}
                        {item.spicy && (
                          <span className="badge spicy">🌶️ Spicy</span>
                        )}
                      </div>
                    </div>

                    {/* Food Info */}
                    <div className="food-info">
                      <h3 className="food-name">{item.name}</h3>
                      <p className="food-description">{item.description}</p>
                      
                      <div className="food-footer">
                        <span className="food-price">${item.price.toFixed(2)}</span>
                        
                        <div className="quantity-controls">
                          {getItemQuantity(item.id) > 0 ? (
                            <div className="quantity-display">
                              <button
                                className="qty-btn minus"
                                onClick={() => addToCart(item, -1)}
                              >
                                −
                              </button>
                              <span className="qty-value">{getItemQuantity(item.id)}</span>
                              <button
                                className="qty-btn plus"
                                onClick={() => addToCart(item, 1)}
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-primary btn-small add-btn"
                              onClick={() => addToCart(item, 1)}
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 Smart Food Ordering System. All rights reserved.</p>
          <p className="footer-note">Built with React.js & Vite for educational purposes</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;