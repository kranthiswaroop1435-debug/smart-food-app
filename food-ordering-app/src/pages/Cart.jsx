import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Cart.css';

// Cart/Order Page Component
// Displays cart items, delivery form, and order summary
const Cart = ({ cart, updateQuantity, clearCart }) => {
  const navigate = useNavigate();
  
  // State for delivery form
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    notes: ''
  });
  
  // State for form validation errors
  const [errors, setErrors] = useState({});
  
  // State for order processing
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 2.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate delivery form
  const validateForm = () => {
    const newErrors = {};
    
    if (!deliveryInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (deliveryInfo.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }
    
    // Phone number validation (basic)
    const phonePattern = /^[\d\s\-\+\(\)]{10,}$/;
    if (!deliveryInfo.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phonePattern.test(deliveryInfo.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!deliveryInfo.address.trim()) {
      newErrors.address = 'Delivery address is required';
    } else if (deliveryInfo.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // ✅ FIXED: Try multiple ways to get user_id
      let userId = localStorage.getItem('user_id');
      
      // Also try getting from 'user' object if stored that way
      if (!userId || userId === 'null' || userId === 'undefined') {
        const userObj = localStorage.getItem('user');
        if (userObj) {
          try {
            const parsed = JSON.parse(userObj);
            userId = parsed.id || parsed.user_id;
          } catch (e) {
            userId = null;
          }
        }
      }

      // If still no userId, use a fallback and continue
      if (!userId || userId === 'null' || userId === 'undefined') {
        // Don't block the order - just use a placeholder
        userId = 'guest-' + Date.now();
      }

      const orderId = generateOrderId();
      const orderTime = new Date().toISOString();
      const estimatedTime = getEstimatedTime();
      
      const orderDetails = {
        user_id: userId,
        full_name: deliveryInfo.fullName,
        phone_number: deliveryInfo.phoneNumber,
        delivery_address: deliveryInfo.address,
        delivery_notes: deliveryInfo.notes || '',
        total_amount: total,
        items: cart.map(item => ({
          food_name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to place order');
      }
      
      // Store order details for the success page
      localStorage.setItem('lastOrder', JSON.stringify({
        orderId: data.order_id || orderId,
        orderTime: orderTime,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        deliveryInfo: {
          ...deliveryInfo,
          estimatedTime: estimatedTime
        },
        totals: {
          subtotal,
          deliveryFee,
          tax,
          total
        }
      }));
      
      // Clear cart and navigate to success page
      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.message || 'There was an issue processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate estimated delivery time
  const getEstimatedTime = () => {
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 45 * 60000); // 45 minutes from now
    return deliveryTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Generate random order ID
  const generateOrderId = () => {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  // Format phone number input
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setDeliveryInfo(prev => ({
      ...prev,
      phoneNumber: formatted
    }));
    
    if (errors.phoneNumber) {
      setErrors(prev => ({
        ...prev,
        phoneNumber: ''
      }));
    }
  };

  return (
    <div className="cart-page">
      {/* Header */}
      <div className="cart-header">
        <div className="container">
          <Link to="/home" className="back-link">
            ← Back to Menu
          </Link>
          <h1>🛒 Your Cart</h1>
          <p>Review your order and add delivery details</p>
        </div>
      </div>

      <main className="cart-main">
        <div className="container">
          <div className="cart-layout">
            {/* Cart Items Section */}
            <section className="cart-items-section">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <span className="empty-cart-icon">🛒</span>
                  <h2>Your cart is empty</h2>
                  <p>Add some delicious items from our menu!</p>
                  <Link to="/home" className="btn btn-primary">
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <>
                  <div className="cart-items-header">
                    <h2>Order Items ({cart.length})</h2>
                    <button 
                      className="clear-cart-btn"
                      onClick={() => clearCart()}
                    >
                      Clear Cart
                    </button>
                  </div>
                  
                  <div className="cart-items-list">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item card">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="cart-item-image"
                        />
                        
                        <div className="cart-item-info">
                          <h3>{item.name}</h3>
                          <p className="cart-item-price">${item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <button
                              className="qty-btn minus"
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              className="qty-btn plus"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <span className="cart-item-total">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>

            {/* Delivery Form Section */}
            {cart.length > 0 && (
              <section className="delivery-section">
                <div className="delivery-form-container card">
                  <h2>📍 Delivery Details</h2>
                  
                  <form onSubmit={handleSubmit} className="delivery-form" noValidate>
                    {/* Full Name */}
                    <div className="input-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className={`input-field ${errors.fullName ? 'error' : ''}`}
                        placeholder="Enter your full name"
                        value={deliveryInfo.fullName}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                      />
                      {errors.fullName && (
                        <span className="error-message">{errors.fullName}</span>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="input-group">
                      <label htmlFor="phoneNumber">Phone Number *</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        className={`input-field ${errors.phoneNumber ? 'error' : ''}`}
                        placeholder="123-456-7890"
                        value={deliveryInfo.phoneNumber}
                        onChange={handlePhoneChange}
                        disabled={isProcessing}
                      />
                      {errors.phoneNumber && (
                        <span className="error-message">{errors.phoneNumber}</span>
                      )}
                    </div>

                    {/* Delivery Address */}
                    <div className="input-group">
                      <label htmlFor="address">Delivery Address *</label>
                      <textarea
                        id="address"
                        name="address"
                        className={`input-field ${errors.address ? 'error' : ''}`}
                        placeholder="Enter your complete delivery address"
                        rows="3"
                        value={deliveryInfo.address}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                      />
                      {errors.address && (
                        <span className="error-message">{errors.address}</span>
                      )}
                    </div>

                    {/* Delivery Notes (Optional) */}
                    <div className="input-group">
                      <label htmlFor="notes">Delivery Notes (Optional)</label>
                      <textarea
                        id="notes"
                        name="notes"
                        className="input-field"
                        placeholder="Any special instructions? (e.g., leave at door, call on arrival)"
                        rows="2"
                        value={deliveryInfo.notes}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                      />
                    </div>

                    {/* Privacy Notice */}
                    <div className="privacy-notice-form">
                      <p>🔒 Your information is secure. We only use it for delivery purposes.</p>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-large place-order-btn"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner"></span>
                          Processing Order...
                        </>
                      ) : (
                        `Place Order - $${total.toFixed(2)}`
                      )}
                    </button>
                  </form>
                </div>

                {/* Order Summary */}
                <div className="order-summary card">
                  <h3>Order Summary</h3>
                  
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="estimated-time">
                    <span className="time-icon">⏱️</span>
                    <span>Estimated delivery: {getEstimatedTime()}</span>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
