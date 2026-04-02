import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  RiShoppingBag3Line, 
  RiFileList3Line, 
  RiMoneyDollarCircleLine,
  RiArrowRightUpLine
} from 'react-icons/ri';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0
  });
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Date filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Setup default dates (last 7 days)
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch Stats
      const statsRes = await axios.get('http://localhost:5000/api/dashboard/stats', config);
      setStats(statsRes.data);

      // Fetch Sales Data
      let url = 'http://localhost:5000/api/dashboard/sales';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      
      const salesRes = await axios.get(url, config);
      setSalesData(salesRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchDashboardData();
    }
  }, [startDate, endDate]);

  const handleFilter = () => {
    fetchDashboardData();
  };

  if (loading && !salesData.length) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom Tooltip for Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          padding: '12px',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '12px' }}>{label}</p>
          <p style={{ color: 'var(--success)', fontWeight: '600', fontSize: '14px' }}>
            Sales: {formatCurrency(payload[0].value)}
          </p>
          {payload[1] && (
            <p style={{ color: 'var(--primary-light)', fontWeight: '600', fontSize: '14px', marginTop: '4px' }}>
              Orders: {payload[1].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening in your store.</p>
      </div>

      <div className="stat-cards">
        <div className="stat-card blue">
          <div className="stat-card-icon blue">
            <RiShoppingBag3Line />
          </div>
          <div className="stat-card-value">{stats.totalProducts}</div>
          <div className="stat-card-label">Total Products</div>
        </div>
        
        <div className="stat-card purple">
          <div className="stat-card-icon purple">
            <RiFileList3Line />
          </div>
          <div className="stat-card-value">{stats.totalOrders}</div>
          <div className="stat-card-label">Total Orders</div>
        </div>
        
        <div className="stat-card green">
          <div className="stat-card-icon green">
            <RiMoneyDollarCircleLine />
          </div>
          <div className="stat-card-value">{formatCurrency(stats.totalSales)}</div>
          <div className="stat-card-label">Total Sales</div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h3>Sales Analytics</h3>
          <div className="chart-filters">
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
            />
            <span style={{ color: 'var(--text-muted)' }}>to</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
            <button onClick={handleFilter}>Filter</button>
          </div>
        </div>

        <div style={{ width: '100%', height: 350 }}>
          {salesData.length > 0 ? (
            <ResponsiveContainer>
              <LineChart
                data={salesData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--text-muted)" 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => {
                    const date = new Date(val);
                    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                  }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="var(--text-muted)" 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
                />
                <YAxis 
                  yAxisId="right" orientation="right"
                  stroke="var(--text-muted)" 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  hide={true}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="sales" 
                  stroke="var(--success)" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--bg-card)', stroke: 'var(--success)', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: 'var(--success)', stroke: 'var(--bg-card)', strokeWidth: 2 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="var(--primary-light)" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
             <div className="empty-state">
               <RiArrowRightUpLine />
               <h3>No Data Available</h3>
               <p>No sales found for the selected date range.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
