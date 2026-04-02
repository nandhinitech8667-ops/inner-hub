import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RiImageAddLine, RiCloseLine } from 'react-icons/ri';

const AddEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    discount: '0'
  });
  
  // Array of base64 strings
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const product = res.data;
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description,
        category: product.category,
        stock: product.stock.toString(),
        discount: product.discount.toString()
      });
      setImages(product.images || []);
    } catch (err) {
      console.error('Error fetching product for edit:', err);
      toast.error('Failed to load product details');
      navigate('/admin/products');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Convert image to Base64
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Check limit
    if (images.length + files.length > 5) {
      toast.warning('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      // Check file size (limit 2MB per image)
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 2MB`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || formData.price === '' || !formData.description || !formData.category || formData.stock === '') {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        category: formData.category,
        stock: Number(formData.stock),
        discount: Number(formData.discount),
        images: images
      };

      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/products/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/products', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product added successfully!');
      }
      
      navigate('/admin/products');
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} product:`, err);
      toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} product`);
    } finally {
      setLoading(false);
    }
  };

  // Common e-commerce categories
  const categories = [
    'Electronics', 'Mobiles', 'Fashion', 'Home & Furniture', 
    'Appliances', 'Toys & Baby', 'Beauty & Personal Care', 'Sports'
  ];

  if (fetching) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
        <p>{isEditMode ? 'Update the details of your product' : 'Create a stunning product listing for your store'}</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form-grid">
          
          <div className="form-group full-width">
            <label>Product Images (Max 5, &lt;2MB each)</label>
            
            <div className="image-upload-area" onClick={() => document.getElementById('imageUpload').click()}>
              <RiImageAddLine className="image-upload-icon" />
              <p className="image-upload-text">Drag & drop your images here or <span>browse files</span></p>
              <p className="image-upload-hint">Upload high-quality images for better sales.</p>
              <input 
                type="file" 
                id="imageUpload" 
                hidden 
                multiple 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {images.length > 0 && (
              <div className="image-previews">
                {images.map((img, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={img} alt={`Preview ${index}`} />
                    <button 
                      type="button" 
                      className="image-preview-remove"
                      onClick={() => removeImage(index)}
                    >
                      <RiCloseLine />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="name">Product Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Apple iPhone 15 Pro Max"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Selling Price (₹) *</label>
            <input 
              type="number" 
              id="price" 
              name="price" 
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="discount">Discount (%)</label>
            <input 
              type="number" 
              id="discount" 
              name="discount" 
              min="0"
              max="100"
              value={formData.discount}
              onChange={handleChange}
              placeholder="e.g. 10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select 
              id="category" 
              name="category" 
              value={formData.category}
              onChange={handleChange}
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="stock">Inventory Stock *</label>
            <input 
              type="number" 
              id="stock" 
              name="stock" 
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Available quantity"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Product Description *</label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description highlighting key features..."
            />
          </div>

          <div className="form-group full-width" style={{ marginTop: '16px', display: 'flex', gap: '12px', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/admin/products')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (isEditMode ? 'Updating...' : 'Creating Product...') : (isEditMode ? 'Update Product' : 'Publish Product')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEditProduct;
