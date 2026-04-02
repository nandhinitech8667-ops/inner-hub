import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiFileListLine, RiArrowLeftLine, RiShoppingBagLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { useUserAuth } from '../context/UserAuthContext';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { authAxios } = useUserAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get('/user/orders');
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const map = {
      'Order Placed': 'placed',
      'Packed': 'packed',
      'Shipped': 'shipped',
      'Out for Delivery': 'out-for-delivery',
      'Delivered': 'delivered'
    };
    return map[status] || 'placed';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="orders-page animate-fade-in">
      <div className="orders-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <RiArrowLeftLine /> Home
        </button>
        <h1><RiFileListLine /> My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">📋</div>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders. Start shopping now!</p>
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: '16px' }}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div className="order-meta">
                  <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <div className={`status-badge ${getStatusClass(order.status)}`}>
                  <span className="status-dot"></span>
                  {order.status}
                </div>
              </div>

              <div className="order-card-body">
                {order.products.map((item, idx) => (
                  <div key={idx} className="order-product-row">
                    <div className="order-product-icon">
                      <RiShoppingBagLine />
                    </div>
                    <div className="order-product-info">
                      <span className="order-product-name">{item.name}</span>
                      <span className="order-product-meta">
                        Qty: {item.quantity} × ₹{Math.round(item.price).toLocaleString()}
                      </span>
                    </div>
                    <span className="order-product-total">
                      ₹{Math.round(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                {/* Tracking Timeline */}
                {order.trackingHistory && order.trackingHistory.length > 0 && (
                  <div className="order-tracking">
                    <h4>Tracking</h4>
                    <div className="order-timeline">
                      {order.trackingHistory.map((track, idx) => (
                        <div key={idx} className="order-timeline-item">
                          <div className={`timeline-dot ${idx === order.trackingHistory.length - 1 ? 'active' : ''}`}></div>
                          <div className="timeline-info">
                            <span className="timeline-status">{track.status}</span>
                            <span className="timeline-date">{formatDate(track.date)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="order-total-row">
                  <strong>Total Amount</strong>
                  <strong className="order-total-amount">₹{Math.round(order.totalAmount).toLocaleString()}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
