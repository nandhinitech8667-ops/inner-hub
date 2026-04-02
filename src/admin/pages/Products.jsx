import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RiEditBoxLine, RiDeleteBinLine, RiSearchLine, RiAddLine } from 'react-icons/ri';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product deleted successfully');
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        console.error('Error deleting product:', err);
        toast.error('Failed to delete product');
      }
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Products</h1>
          <p>Manage your store inventory</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/admin/products/add')}
        >
          <RiAddLine style={{ fontSize: '18px' }} />
          Add Product
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>All Products ({filteredProducts.length})</h3>
          <div className="table-search">
            <RiSearchLine />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Discount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="product-cell">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} className="product-thumb" />
                        ) : (
                          <div className="product-thumb"></div>
                        )}
                        <span className="product-name">{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td style={{ fontWeight: '600' }}>{formatCurrency(product.price)}</td>
                    <td>
                      <span style={{ color: product.stock < 10 ? 'var(--warning)' : 'inherit', fontWeight: product.stock < 10 ? '600' : 'normal' }}>
                        {product.stock} units
                      </span>
                    </td>
                    <td>{product.discount > 0 ? `${product.discount}%` : '-'}</td>
                    <td>
                      <div className="action-btns">
                        <button 
                          className="btn-icon edit" 
                          title="Edit"
                          onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                        >
                          <RiEditBoxLine />
                        </button>
                        <button 
                          className="btn-icon delete" 
                          title="Delete"
                          onClick={() => handleDelete(product._id)}
                        >
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    <p>No products found</p>
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

export default Products;
