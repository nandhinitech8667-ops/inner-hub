import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RiSearchLine, RiMapPinLine, RiBox3Line, RiTruckLine, RiCheckDoubleLine, RiUserLocationLine } from 'react-icons/ri';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Order status updated');
      
      // Update local state
      setOrders(orders.map(order => {
        if (order._id === id) {
          return {
            ...order,
            status: newStatus,
            trackingHistory: [...order.trackingHistory, { status: newStatus, date: new Date().toISOString() }]
          };
        }
        return order;
      }));
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };

  const toggleRow = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const statusOptions = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  // Filter orders
  const filteredOrders = orders.filter(order => 
    order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'Order Placed': return 'placed';
      case 'Packed': return 'packed';
      case 'Shipped': return 'shipped';
      case 'Out for Delivery': return 'out-for-delivery';
      case 'Delivered': return 'delivered';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed': return <RiBox3Line />;
      case 'Packed': return <RiBox3Line />;
      case 'Shipped': return <RiTruckLine />;
      case 'Out for Delivery': return <RiUserLocationLine />;
      case 'Delivered': return <RiCheckDoubleLine />;
      default: return <RiMapPinLine />;
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Orders & Tracking</h1>
        <p>Manage customer orders and update shipping status</p>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>All Orders ({filteredOrders.length})</h3>
          <div className="table-search">
            <RiSearchLine />
            <input 
              type="text" 
              placeholder="Search by Order ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Order ID / Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr>
                      <td>
                        <div style={{ fontWeight: '500', color: 'var(--primary-light)', fontSize: '13px' }}>
                          #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{order.user.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.user.email}</div>
                      </td>
                      <td>{order.products.reduce((acc, p) => acc + p.quantity, 0)} items</td>
                      <td style={{ fontWeight: '600' }}>{formatCurrency(order.totalAmount)}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          <span className="status-dot"></span>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <select 
                            className="status-select"
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => toggleRow(order._id)}
                          >
                            {expandedRow === order._id ? 'Hide' : 'Track'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expandable Tracking Details Row */}
                    {expandedRow === order._id && (
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        <td colSpan="6" style={{ padding: '0' }}>
                          <div className="tracking-timeline animate-fade-in" style={{ padding: '24px 32px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                              
                              {/* Left side: Tracking Timeline */}
                              <div>
                                <h4 style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tracking History</h4>
                                <div style={{ marginLeft: '10px' }}>
                                  {[...order.trackingHistory].reverse().map((track, i) => (
                                    <div key={i} className="timeline-item">
                                      <div className={`timeline-dot ${i === 0 ? 'active' : ''}`}></div>
                                      <div className="timeline-info">
                                        <div className="timeline-status" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                           {getStatusIcon(track.status)}
                                           {track.status}
                                        </div>
                                        <div className="timeline-date">{formatDate(track.date)}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Right side: Order Items */}
                              <div>
                                <h4 style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Items</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  {order.products.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                      <div>
                                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{item.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity} × {formatCurrency(item.price)}</div>
                                      </div>
                                      <div style={{ fontWeight: '600' }}>
                                        {formatCurrency(item.quantity * item.price)}
                                      </div>
                                    </div>
                                  ))}
                                  
                                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 12px 0', borderTop: '1px dashed var(--border)', marginTop: '8px' }}>
                                    <span style={{ fontWeight: '500' }}>Total Paid</span>
                                    <span style={{ fontWeight: '700', color: 'var(--primary-light)', fontSize: '16px' }}>{formatCurrency(order.totalAmount)}</span>
                                  </div>
                                </div>
                              </div>
                              
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <p>No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
