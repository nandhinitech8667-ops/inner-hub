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

  // 🔥 FETCH ORDERS
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await authAxios.get('/user/orders');
      setOrders(res.data || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 STATUS CLASS
  const getStatusClass = (status) => {
    const map = {
      'placed': 'placed',
      'packed': 'packed',
      'shipped': 'shipped',
      'out_for_delivery': 'out-for-delivery',
      'delivered': 'delivered'
    };
    return map[status?.toLowerCase()] || 'placed';
  };

  // 🔥 DATE FORMAT
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('en-IN');
  };

  // 🔄 LOADING
  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h3>Loading Orders...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => navigate('/')} style={{ padding: "6px 10px" }}>
          <RiArrowLeftLine /> Home
        </button>
        <h2><RiFileListLine /> My Orders</h2>
      </div>

      {/* EMPTY */}
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h3>No orders yet</h3>
          <button onClick={() => navigate('/')} style={{ marginTop: "10px" }}>
            Start Shopping
          </button>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={styles.card}>
            
            {/* HEADER */}
            <div style={styles.cardHeader}>
              <div>
                <strong>Order #{order._id?.slice(-6)}</strong>
                <p style={{ fontSize: "12px" }}>{formatDate(order.createdAt)}</p>
              </div>

              <span style={{
                padding: "5px 10px",
                borderRadius: "5px",
                background: "#eee"
              }}>
                {order.status}
              </span>
            </div>

            {/* PRODUCTS */}
            {(order.products || []).map((item, idx) => (
              <div key={idx} style={styles.productRow}>
                <RiShoppingBagLine />
                <div style={{ flex: 1 }}>
                  <p>{item?.name || "Product"}</p>
                  <small>
                    Qty: {item?.quantity || 1} × ₹{item?.price || 0}
                  </small>
                </div>
                <strong>
                  ₹{(item?.price || 0) * (item?.quantity || 1)}
                </strong>
              </div>
            ))}

            {/* TRACKING */}
            <div style={{ marginTop: "10px" }}>
              <h4>Tracking</h4>

              {(order.trackingHistory || []).length === 0 ? (
                <p style={{ fontSize: "12px" }}>Tracking not available</p>
              ) : (
                (order.trackingHistory || []).map((track, i) => (
                  <div key={i} style={styles.timelineItem}>
                    <div style={styles.dot}></div>
                    <div>
                      <p>{track.status}</p>
                      <small>{formatDate(track.date)}</small>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* TOTAL */}
            <div style={styles.total}>
              <strong>Total</strong>
              <strong>₹{order.totalAmount || 0}</strong>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

// 🎨 STYLES
const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
    background: "#fff"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  },
  productRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    padding: "8px 0"
  },
  timelineItem: {
    display: "flex",
    gap: "10px",
    marginBottom: "8px"
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "green",
    marginTop: "5px"
  },
  total: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    borderTop: "1px solid #eee",
    paddingTop: "10px"
  }
};

export default OrdersPage;