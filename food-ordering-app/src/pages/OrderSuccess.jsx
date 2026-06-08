import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

// Order Success Page Component
// Displays order confirmation with summary and estimated delivery time
const OrderSuccess = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [countdown, setCountdown] = useState(45);

  useEffect(() => {
    // Retrieve order details from localStorage
    const savedOrder = localStorage.getItem('lastOrder');
    
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      // If no order found, redirect to home
      navigate('/home');
    }

    // Countdown timer for delivery
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [navigate]);

  if (!order) {
    return (
      <div className="order-success-page">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatPhoneNumber = (phone) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  return (
    <div className="order-success-page">
      <div className="container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <span className="checkmark">✓</span>
          </div>
          <h1>Order Placed Successfully!</h1>
          <p className="success-subtitle">
            Thank you for your order. We're preparing your delicious meal!
          </p>
        </div>

        {/* Order Confirmation Card */}
        <div className="confirmation-card card">
          <div className="card-header">
            <div className="order-id">
              <span className="label">Order ID</span>
              <span className="value">{order.orderId}</span>
            </div>
            <div className="order-time">
              <span className="label">Order Time</span>
              <span className="value">{formatTime(order.orderTime)}</span>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="delivery-info-section">
            <h3>📍 Delivery Information</h3>
            <div className="delivery-info-grid">
              <div className="info-item">
                <span className="info-label">Delivering to</span>
                <span className="info-value">{order.deliveryInfo.fullName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone Number</span>
                <span className="info-value">{formatPhoneNumber(order.deliveryInfo.phoneNumber)}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Delivery Address</span>
                <span className="info-value">{order.deliveryInfo.address}</span>
              </div>
              {order.deliveryInfo.notes && (
                <div className="info-item full-width">
                  <span className="info-label">Delivery Notes</span>
                  <span className="info-value">{order.deliveryInfo.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-section">
            <h3>📋 Order Summary</h3>
            <div className="order-items-list">
              {order.items.map((item) => (
                <div key={item.id} className="order-item-row">
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">× {item.quantity}</span>
                  </div>
                  <span className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${order.totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Delivery Fee</span>
                <span>${order.totals.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (8%)</span>
                <span>${order.totals.tax.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${order.totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="delivery-eta-section">
            <div className="eta-badge">
              <span className="eta-icon">🚴</span>
              <div className="eta-info">
                <span className="eta-label">Estimated Delivery</span>
                <span className="eta-time">
                  {order.deliveryInfo.estimatedTime} ({countdown} min)
                </span>
              </div>
            </div>
            <p className="eta-note">
              Our delivery partner will arrive within the estimated time window.
              You'll receive updates on your phone.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link to="/home" className="btn btn-primary btn-large">
            🍽️ Order More Food
          </Link>
          <button 
            className="btn btn-outline btn-large"
            onClick={() => window.print()}
          >
            📄 Print Receipt
          </button>
        </div>

        {/* Thank You Message */}
        <div className="thank-you-section">
          <p className="thank-you-text">
            🎉 We hope you enjoy your meal! Thank you for choosing Smart Food.
          </p>
          <p className="feedback-text">
            Your feedback helps us improve. Share your experience with us!
          </p>
        </div>

        {/* Footer */}
        <footer className="success-footer">
          <p>Need help? Contact our support team at support@smartfood.com</p>
          <p className="privacy-footer">
            🔒 Your order information is secure and will be deleted after delivery.
          </p>
        </footer>
      </div>

      {/* Confetti Animation */}
      <div className="confetti-container">
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
      </div>
    </div>
  );
};

export default OrderSuccess;