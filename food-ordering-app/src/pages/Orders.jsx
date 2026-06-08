import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Orders.css';

// Order History Page Component
const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        navigate('/');
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/api/orders/${user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="container">
          <Link to="/home" className="back-link">
            ← Back to Menu
          </Link>
          <h1>📦 Order History</h1>
          <p>Review your past orders</p>
        </div>
      </div>

      <main className="orders-main">
        <div className="container">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="empty-orders card" style={{ color: '#e74c3c' }}>
              <h2>Error Loading Orders</h2>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-orders card">
              <h2>No orders found</h2>
              <p>You haven't placed any orders yet.</p>
              <Link to="/home" className="btn btn-primary mt-4">
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order, index) => (
                <div key={order.id || order.orderId || index} className="order-card card">
                  <div className="order-card-header">
                    <div className="order-id">
                      <span className="label">Order ID</span>
                      <span className="value">{order.id || order.orderId}</span>
                    </div>
                    <div className="order-date">
                      <span className="label">Date</span>
                      <span className="value">{formatTime(order.created_at || order.orderTime)}</span>
                    </div>
                    <div className="order-total">
                      <span className="label">Total</span>
                      <span className="value">
                        ${(order.total_amount || order.totals?.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-card-body">
                    <div className="order-items-list">
                      <h4>Items</h4>
                      <ul>
                        {(order.items || []).map((item, idx) => (
                          <li key={idx}>
                            <span className="item-qty">{item.quantity}x</span>
                            <span className="item-name">{item.food_name || item.name}</span>
                            <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="order-delivery-info">
                      <h4>Delivered To</h4>
                      <p><strong>{order.full_name || order.deliveryInfo?.fullName}</strong></p>
                      <p>{order.delivery_address || order.deliveryInfo?.address}</p>
                      <p>{order.phone_number || order.deliveryInfo?.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;
