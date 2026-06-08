import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import './styles/index.css';

// Main App Component
// Manages global state and routing for the food ordering application
function App() {
  // State for cart items
  const [cart, setCart] = useState([]);
  
  // State for user authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing user session on mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
    
    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Handle login
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  // Add item to cart
  const addToCart = (item, quantityChange) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Item exists, update quantity
        const newQuantity = existingItem.quantity + quantityChange;
        
        if (newQuantity <= 0) {
          // Remove item if quantity is 0 or less
          return prevCart.filter(cartItem => cartItem.id !== item.id);
        }
        
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
      } else if (quantityChange > 0) {
        // Item doesn't exist, add it
        return [...prevCart, { ...item, quantity: quantityChange }];
      }
      
      return prevCart;
    });
  };

  // Update item quantity
  const updateQuantity = (itemId, quantityChange) => {
    setCart(prevCart => {
      return prevCart.map(cartItem => {
        if (cartItem.id === itemId) {
          const newQuantity = cartItem.quantity + quantityChange;
          
          if (newQuantity <= 0) {
            return null; // Will be filtered out
          }
          
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      }).filter(item => item !== null);
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/home" replace /> : 
              <Login onLogin={handleLogin} />
          } 
        />
        
        {/* Home/Menu Route */}
        <Route 
          path="/home" 
          element={
            isAuthenticated ? (
              <Home 
                cart={cart} 
                addToCart={addToCart} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        {/* Cart Route */}
        <Route 
          path="/cart" 
          element={
            isAuthenticated ? (
              <Cart 
                cart={cart} 
                updateQuantity={updateQuantity} 
                clearCart={clearCart}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        {/* Order Success Route */}
        <Route 
          path="/order-success" 
          element={
            isAuthenticated ? (
              <OrderSuccess />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        {/* Orders History Route */}
        <Route 
          path="/orders" 
          element={
            isAuthenticated ? (
              <Orders />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        {/* Fallback for unknown routes */}
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;