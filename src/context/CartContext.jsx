import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useUserAuth } from './UserAuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isUserAuthenticated, authAxios } = useUserAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isUserAuthenticated) {
      setCartItems([]);
      return;
    }
    try {
      setCartLoading(true);
      const res = await authAxios.get('/user/cart');
      setCartItems(res.data.items || []);
    } catch (error) {
      console.error('Fetch cart error:', error);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  }, [isUserAuthenticated, authAxios]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await authAxios.post('/user/cart', { productId, quantity });
    setCartItems(res.data.cart.items || []);
    return res.data;
  };

  const updateQuantity = async (itemId, quantity) => {
    const res = await authAxios.put(`/user/cart/${itemId}`, { quantity });
    setCartItems(res.data.cart.items || []);
    return res.data;
  };

  const removeItem = async (itemId) => {
    const res = await authAxios.delete(`/user/cart/${itemId}`);
    setCartItems(res.data.cart.items || []);
    return res.data;
  };

  const clearLocalCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartLoading,
      fetchCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearLocalCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
