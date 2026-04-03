import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get product from location state or localStorage
  const selectedProduct = location.state?.selectedProduct || null;
  const productData = location.state?.product || null;
  const product =
    selectedProduct ||
    productData ||
    JSON.parse(localStorage.getItem("checkoutProduct"));

  // State Management
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  // Payment method specific states
  const [showUPIDetails, setShowUPIDetails] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedTenure, setSelectedTenure] = useState('');
  const [upiVpa, setUpiVpa] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    address: '',
    locality: '',
    city: '',
    state: '',
    type: 'home'
  });
  const [addressErrors, setAddressErrors] = useState({});

  // Payment methods with Flipkart's exact design
  const paymentMethods = [
    { 
      id: 'COD', 
      name: 'Cash on Delivery', 
      icon: '💵',
      description: 'Pay with cash when you receive your order',
      value: 'cod'
    },
    { 
      id: 'CARD', 
      name: 'Credit / Debit Card', 
      icon: '💳',
      description: 'Visa, MasterCard, Maestro, RuPay',
      value: 'card'
    },
    { 
      id: 'UPI', 
      name: 'UPI', 
      icon: '📱',
      description: 'Google Pay, PhonePe, Paytm, BHIM UPI',
      value: 'upi'
    },
    { 
      id: 'NETBANKING', 
      name: 'Net Banking', 
      icon: '🏦',
      description: 'All major banks',
      value: 'netbanking'
    },
    { 
      id: 'WALLET', 
      name: 'Wallet', 
      icon: '👛',
      description: 'Paytm, Amazon Pay, Mobikwik',
      value: 'wallet'
    },
    { 
      id: 'EMI', 
      name: 'EMI (Easy EMI)', 
      icon: '📅',
      description: 'No Cost EMI available on select cards',
      value: 'emi'
    }
  ];

  // Card types for card payment
  const cardTypes = [
    { id: 'visa', name: 'Visa', icon: '💳' },
    { id: 'mastercard', name: 'MasterCard', icon: '💳' },
    { id: 'rupay', name: 'RuPay', icon: '💳' },
    { id: 'amex', name: 'American Express', icon: '💳' }
  ];

  // Banks for net banking
  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 
    'Kotak Mahindra Bank', 'Yes Bank', 'Bank of Baroda', 'Punjab National Bank',
    'Canara Bank', 'Union Bank of India', 'IDFC First Bank', 'IndusInd Bank'
  ];

  // UPI apps
  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: '📱' },
    { id: 'phonepe', name: 'PhonePe', icon: '📱' },
    { id: 'paytm', name: 'Paytm', icon: '📱' },
    { id: 'bhim', name: 'BHIM UPI', icon: '📱' },
    { id: 'amazon', name: 'Amazon Pay', icon: '📱' }
  ];

  // EMI tenures
  const emiTenures = [
    { months: 3, interest: 0, emi: 'No Cost EMI' },
    { months: 6, interest: 0, emi: 'No Cost EMI' },
    { months: 9, interest: 8, emi: 'Low Cost EMI' },
    { months: 12, interest: 12, emi: 'Low Cost EMI' }
  ];

  // Redirect if no product
  useEffect(() => {
    if (!product) {
      toast.error('No product selected for checkout');
      setTimeout(() => navigate(-1), 2000);
    }
  }, [product, navigate]);

  if (!product) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>🛒</div>
          <h2 style={styles.emptyTitle}>No Product Selected</h2>
          <p style={styles.emptyText}>Please select a product to checkout</p>
          <button onClick={() => navigate(-1)} style={styles.emptyButton}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Extract product details
  const productItem = product.productId || product;
  const quantity = product.quantity || 1;
  const subtotal = productItem.price ? productItem.price * quantity : 0;
  const deliveryCharge = 40;
  const discount = subtotal > 1000 ? Math.floor(subtotal * 0.1) : subtotal > 500 ? Math.floor(subtotal * 0.05) : 0;
  const totalAmount = subtotal - discount + (subtotal > 500 ? 0 : deliveryCharge) - couponDiscount;

  // Load saved addresses
  useEffect(() => {
    const loadAddresses = () => {
      try {
        const stored = localStorage.getItem('userAddresses');
        if (stored) {
          setSavedAddresses(JSON.parse(stored));
        } else {
          const demoAddresses = [
            {
              id: 'addr1',
              name: 'John Doe',
              phone: '9876543210',
              pincode: '560001',
              address: '42, Brigade Road',
              locality: 'Brigade Road',
              city: 'Bangalore',
              state: 'Karnataka',
              type: 'home',
              isDefault: true
            },
            {
              id: 'addr2',
              name: 'Jane Smith',
              phone: '9988776655',
              pincode: '400001',
              address: '15, Marine Drive',
              locality: 'Churchgate',
              city: 'Mumbai',
              state: 'Maharashtra',
              type: 'work',
              isDefault: false
            }
          ];
          setSavedAddresses(demoAddresses);
          localStorage.setItem('userAddresses', JSON.stringify(demoAddresses));
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      }
    };
    loadAddresses();
  }, []);

  // Set default selected address
  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId) {
      const defaultAddr = savedAddresses.find(addr => addr.isDefault);
      setSelectedAddressId(defaultAddr?.id || savedAddresses[0].id);
    }
  }, [savedAddresses, selectedAddressId]);

  const validateAddressForm = () => {
    const errors = {};
    if (!newAddress.name.trim()) errors.name = 'Enter full name';
    if (!newAddress.phone.trim()) errors.phone = 'Enter 10-digit mobile number';
    else if (!/^\d{10}$/.test(newAddress.phone)) errors.phone = 'Enter valid 10-digit number';
    if (!newAddress.pincode.trim()) errors.pincode = 'Enter 6-digit pincode';
    else if (!/^\d{6}$/.test(newAddress.pincode)) errors.pincode = 'Enter valid pincode';
    if (!newAddress.address.trim()) errors.address = 'Enter address';
    if (!newAddress.city.trim()) errors.city = 'Enter city';
    if (!newAddress.state.trim()) errors.state = 'Enter state';
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAddress = () => {
    if (!validateAddressForm()) return;
    const newAddr = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: savedAddresses.length === 0
    };
    const updated = [...savedAddresses, newAddr];
    setSavedAddresses(updated);
    localStorage.setItem('userAddresses', JSON.stringify(updated));
    setSelectedAddressId(newAddr.id);
    setShowAddressForm(false);
    setNewAddress({ name: '', phone: '', pincode: '', address: '', locality: '', city: '', state: '', type: 'home' });
    toast.success('Address saved successfully!');
  };

  const handleDeleteAddress = (id) => {
    const updated = savedAddresses.filter(addr => addr.id !== id);
    setSavedAddresses(updated);
    localStorage.setItem('userAddresses', JSON.stringify(updated));
    if (selectedAddressId === id && updated.length > 0) {
      setSelectedAddressId(updated[0].id);
    } else if (updated.length === 0) {
      setSelectedAddressId('');
    }
    toast.info('Address removed');
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE50' && !couponApplied) {
      setCouponDiscount(50);
      setCouponApplied(true);
      toast.success('Coupon applied! You saved ₹50');
    } else if (couponCode.toUpperCase() === 'FLAT100' && !couponApplied && totalAmount > 500) {
      setCouponDiscount(100);
      setCouponApplied(true);
      toast.success('Coupon applied! You saved ₹100');
    } else if (couponApplied) {
      toast.error('Coupon already applied');
    } else {
      toast.error('Invalid coupon code. Try SAVE50 or FLAT100');
    }
  };

  const validatePaymentDetails = () => {
    if (selectedPaymentMethod === 'CARD') {
      if (!cardDetails.number || cardDetails.number.length < 16) {
        toast.error('Please enter valid card number');
        return false;
      }
      if (!cardDetails.expiry) {
        toast.error('Please enter expiry date');
        return false;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        toast.error('Please enter valid CVV');
        return false;
      }
      if (!cardDetails.name) {
        toast.error('Please enter cardholder name');
        return false;
      }
    }
    
    if (selectedPaymentMethod === 'UPI' && !upiVpa) {
      toast.error('Please enter UPI VPA');
      return false;
    }
    
    if (selectedPaymentMethod === 'NETBANKING' && !selectedBank) {
      toast.error('Please select a bank');
      return false;
    }
    
    if (selectedPaymentMethod === 'EMI' && !selectedTenure) {
      toast.error('Please select EMI tenure');
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }
    
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!validatePaymentDetails()) {
      return;
    }

    // Get payment method details
    const paymentMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
    
    setIsPlacingOrder(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success with payment method
      toast.success(`Order placed successfully via ${paymentMethod?.name}! 🎉`);
      
      // Store order details in localStorage for orders page
      const orderDetails = {
        id: Date.now(),
        product: productItem,
        quantity,
        subtotal,
        discount,
        deliveryCharge: subtotal > 500 ? 0 : deliveryCharge,
        couponDiscount,
        totalAmount,
        paymentMethod: paymentMethod?.value,
        paymentMethodName: paymentMethod?.name,
        address: savedAddresses.find(addr => addr.id === selectedAddressId),
        orderDate: new Date().toISOString(),
        status: 'Confirmed',
        orderId: 'OD' + Date.now()
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      localStorage.setItem('userOrders', JSON.stringify([orderDetails, ...existingOrders]));
      
      // Clear checkout product
      localStorage.removeItem('checkoutProduct');
      
      navigate('/orders');
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);

  return (
    <div style={styles.container}>
      {/* Header - Flipkart style */}
      {/* <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoArea}>
            <span style={styles.logo}>Flipkart</span>
            <span style={styles.logoPlus}>Plus</span>
          </div>
          <div style={styles.checkoutBadge}>Checkout</div>
        </div>
      </div> */}

      <div style={styles.mainContent}>
        <div style={styles.twoColumnLayout}>
          {/* Left Column - Address and Payment */}
          <div style={styles.leftColumn}>
            {/* Delivery Address Section */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Delivery Address</h2>
                <button onClick={() => setShowAddressForm(!showAddressForm)} style={styles.addButton}>
                  + ADD NEW ADDRESS
                </button>
              </div>
              <div style={styles.cardBody}>
                {savedAddresses.length === 0 && !showAddressForm && (
                  <div style={styles.emptyAddressState}>
                    <p>No saved addresses</p>
                    <button onClick={() => setShowAddressForm(true)} style={styles.linkButton}>
                      Add new address
                    </button>
                  </div>
                )}

                {!showAddressForm && savedAddresses.length > 0 && (
                  <div>
                    {savedAddresses.map(addr => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        style={{
                          ...styles.addressCard,
                          ...(selectedAddressId === addr.id ? styles.addressCardSelected : {})
                        }}
                      >
                        <div style={styles.addressRadio}>
                          <div style={{
                            ...styles.radioCircle,
                            ...(selectedAddressId === addr.id ? styles.radioSelected : {})
                          }}>
                            {selectedAddressId === addr.id && <div style={styles.radioInner} />}
                          </div>
                        </div>
                        <div style={styles.addressDetails}>
                          <div style={styles.addressNameRow}>
                            <span style={styles.addressName}>{addr.name}</span>
                            {addr.isDefault && <span style={styles.defaultBadge}>DEFAULT</span>}
                            <span style={styles.addressType}>
                              {addr.type === 'home' ? '🏠 Home' : '🏢 Work'}
                            </span>
                          </div>
                          <div style={styles.addressPhone}>{addr.phone}</div>
                          <div style={styles.addressFull}>
                            {addr.address}, {addr.locality && `${addr.locality}, `}{addr.city}, {addr.state} - {addr.pincode}
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                          style={styles.removeButton}
                        >
                          REMOVE
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Address Form */}
                {showAddressForm && (
                  <div style={styles.addressForm}>
                    <h3 style={styles.formTitle}>Add a new address</h3>
                    <div style={styles.formGrid}>
                      <div>
                        <input
                          type="text"
                          placeholder="Name*"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                          style={styles.input}
                        />
                        {addressErrors.name && <span style={styles.errorText}>{addressErrors.name}</span>}
                      </div>
                      <div>
                        <input
                          type="tel"
                          placeholder="10-digit mobile number*"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                          style={styles.input}
                        />
                        {addressErrors.phone && <span style={styles.errorText}>{addressErrors.phone}</span>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Pincode*"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                          style={styles.input}
                        />
                        {addressErrors.pincode && <span style={styles.errorText}>{addressErrors.pincode}</span>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Locality"
                          value={newAddress.locality}
                          onChange={(e) => setNewAddress({...newAddress, locality: e.target.value})}
                          style={styles.input}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <textarea
                          placeholder="Address (Area and Street)*"
                          rows="2"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                          style={styles.textarea}
                        />
                        {addressErrors.address && <span style={styles.errorText}>{addressErrors.address}</span>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="City/District*"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          style={styles.input}
                        />
                        {addressErrors.city && <span style={styles.errorText}>{addressErrors.city}</span>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="State*"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          style={styles.input}
                        />
                        {addressErrors.state && <span style={styles.errorText}>{addressErrors.state}</span>}
                      </div>
                    </div>
                    <div style={styles.addressTypeToggle}>
                      <label style={styles.radioLabel}>
                        <input
                          type="radio"
                          name="addressType"
                          value="home"
                          checked={newAddress.type === 'home'}
                          onChange={() => setNewAddress({...newAddress, type: 'home'})}
                        />
                        <span>Home</span>
                      </label>
                      <label style={styles.radioLabel}>
                        <input
                          type="radio"
                          name="addressType"
                          value="work"
                          checked={newAddress.type === 'work'}
                          onChange={() => setNewAddress({...newAddress, type: 'work'})}
                        />
                        <span>Work</span>
                      </label>
                    </div>
                    <div style={styles.formActions}>
                      <button onClick={() => setShowAddressForm(false)} style={styles.cancelButton}>
                        Cancel
                      </button>
                      <button onClick={handleAddAddress} style={styles.saveButton}>
                        Save and Deliver Here
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Options - Flipkart Style */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Choose a payment method</h2>
              </div>
              <div style={styles.paymentMethodsContainer}>
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => {
                      setSelectedPaymentMethod(method.id);
                      // Reset additional states when changing payment method
                      setShowUPIDetails(false);
                      setSelectedCardType('');
                      setSelectedBank('');
                      setSelectedTenure('');
                      setUpiVpa('');
                    }}
                    style={{
                      ...styles.paymentMethodCard,
                      ...(selectedPaymentMethod === method.id ? styles.paymentMethodSelected : {})
                    }}
                  >
                    <div style={styles.paymentMethodRadio}>
                      <div style={{
                        ...styles.radioOuter,
                        ...(selectedPaymentMethod === method.id ? styles.radioOuterSelected : {})
                      }}>
                        {selectedPaymentMethod === method.id && <div style={styles.radioInner} />}
                      </div>
                    </div>
                    <div style={styles.paymentMethodIcon}>{method.icon}</div>
                    <div style={styles.paymentMethodContent}>
                      <div style={styles.paymentMethodName}>{method.name}</div>
                      <div style={styles.paymentMethodDescription}>{method.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional details based on selected payment method */}
              {selectedPaymentMethod === 'UPI' && (
                <div style={styles.paymentDetails}>
                  <div style={styles.paymentDetailsTitle}>Select UPI App</div>
                  <div style={styles.upiAppsGrid}>
                    {upiApps.map(app => (
                      <button
                        key={app.id}
                        style={styles.upiAppButton}
                        onClick={() => {
                          toast.info(`Opening ${app.name}...`);
                          setShowUPIDetails(true);
                        }}
                      >
                        {app.icon} {app.name}
                      </button>
                    ))}
                  </div>
                  <div style={styles.upiInput}>
                    <input
                      type="text"
                      placeholder="Enter VPA (example@upi)"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      style={styles.input}
                    />
                    <button style={styles.verifyButton}>Verify</button>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'CARD' && (
                <div style={styles.paymentDetails}>
                  <div style={styles.paymentDetailsTitle}>Card Details</div>
                  <div style={styles.cardTypes}>
                    {cardTypes.map(card => (
                      <button
                        key={card.id}
                        onClick={() => setSelectedCardType(card.id)}
                        style={{
                          ...styles.cardTypeButton,
                          ...(selectedCardType === card.id ? styles.cardTypeSelected : {})
                        }}
                      >
                        {card.icon} {card.name}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Card Number"
                    maxLength="16"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    style={styles.input}
                  />
                  <div style={styles.cardRow}>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      style={{...styles.input, width: '48%'}}
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength="4"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      style={{...styles.input, width: '48%'}}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                    style={styles.input}
                  />
                  <div style={styles.secureNote}>
                    🔒 Your transaction is secure with 128-bit encryption
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'NETBANKING' && (
                <div style={styles.paymentDetails}>
                  <div style={styles.paymentDetailsTitle}>Select Your Bank</div>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select Bank</option>
                    {banks.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  <div style={styles.bankLogos}>
                    {banks.slice(0, 4).map(bank => (
                      <div key={bank} style={styles.bankChip}>{bank.split(' ')[0]}</div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'WALLET' && (
                <div style={styles.paymentDetails}>
                  <div style={styles.paymentDetailsTitle}>Select Wallet</div>
                  <div style={styles.walletGrid}>
                    <div style={styles.walletOption}>
                      <span>💰</span>
                      <span>Paytm</span>
                    </div>
                    <div style={styles.walletOption}>
                      <span>📱</span>
                      <span>Amazon Pay</span>
                    </div>
                    <div style={styles.walletOption}>
                      <span>👛</span>
                      <span>Mobikwik</span>
                    </div>
                    <div style={styles.walletOption}>
                      <span>💳</span>
                      <span>Freecharge</span>
                    </div>
                  </div>
                  <div style={styles.walletBalance}>
                    Available balance: ₹0.00
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'EMI' && (
                <div style={styles.paymentDetails}>
                  <div style={styles.paymentDetailsTitle}>EMI Options</div>
                  <select style={styles.select}>
                    <option>Select Card</option>
                    <option>HDFC Bank Cards (No Cost EMI available)</option>
                    <option>ICICI Bank Cards (No Cost EMI available)</option>
                    <option>SBI Cards (No Cost EMI available)</option>
                    <option>Axis Bank Cards (No Cost EMI available)</option>
                    <option>Kotak Bank Cards (No Cost EMI available)</option>
                  </select>
                  <select
                    style={{...styles.select, marginTop: '12px'}}
                    value={selectedTenure}
                    onChange={(e) => setSelectedTenure(e.target.value)}
                  >
                    <option value="">Select Tenure</option>
                    {emiTenures.map(tenure => (
                      <option key={tenure.months} value={tenure.months}>
                        {tenure.months} Months - {tenure.emi} 
                        {tenure.interest > 0 && ` (${tenure.interest}% interest)`}
                      </option>
                    ))}
                  </select>
                  {selectedTenure && (
                    <div style={styles.emiCalculation}>
                      <div>Monthly EMI: ₹{Math.ceil(totalAmount / selectedTenure)}</div>
                      <div>Total Interest: ₹0 (No Cost EMI)</div>
                    </div>
                  )}
                </div>
              )}

              {selectedPaymentMethod === 'COD' && (
                <div style={styles.codInfo}>
                  <div style={styles.codIcon}>💰</div>
                  <div style={styles.codText}>
                    Pay with cash when your order is delivered
                  </div>
                  <div style={styles.codNote}>
                    Maximum order value for COD is ₹50,000
                  </div>
                </div>
              )}
            </div>

            {/* Selected Payment Method Info Bar */}
            {selectedPaymentMethod && (
              <div style={styles.selectedPaymentInfo}>
                <div style={styles.selectedPaymentBadge}>
                  <span>✓ You will pay via: </span>
                  <strong>
                    {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                  </strong>
                </div>
              </div>
            )}

            {/* Order Summary - Product Details */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Order Summary</h2>
              </div>
              <div style={styles.orderItem}>
                <img
                  src={productItem.images?.[0] || productItem.image || "https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/placeholder_400x400_3.svg"}
                  alt={productItem.name}
                  style={styles.productImage}
                />
                <div style={styles.orderItemDetails}>
                  <div style={styles.productName}>{productItem.name}</div>
                  <div style={styles.productMeta}>
                    <span>Quantity: {quantity}</span>
                    <span style={styles.productPrice}>₹{productItem.price}</span>
                  </div>
                  {productItem.seller && <div style={styles.sellerInfo}>Seller: {productItem.seller}</div>}
                  <div style={styles.deliveryDate}>
                    Delivery by {new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString()} | Free
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Price Details */}
          <div style={styles.rightColumn}>
            <div style={styles.priceCard}>
              <div style={styles.priceHeader}>PRICE DETAILS</div>
              <div style={styles.priceRow}>
                <span>Price ({quantity} item)</span>
                <span>₹{subtotal}</span>
              </div>
              <div style={styles.priceRow}>
                <span>Discount</span>
                <span style={styles.greenText}>- ₹{discount}</span>
              </div>
              <div style={styles.priceRow}>
                <span>Delivery Charges</span>
                <span style={subtotal > 500 ? styles.greenText : {}}>
                  {subtotal > 500 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              
              {/* Coupon Section */}
              <div style={styles.couponSection}>
                <input
                  type="text"
                  placeholder="Apply Coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  style={styles.couponInput}
                />
                <button onClick={applyCoupon} style={styles.applyButton}>
                  APPLY
                </button>
              </div>
              {couponApplied && (
                <div style={styles.couponApplied}>
                  🎉 Coupon {couponCode} applied: - ₹{couponDiscount}
                </div>
              )}

              <div style={styles.totalRow}>
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
              <div style={styles.savingsText}>
                🎉 You saved ₹{discount + (subtotal > 500 ? deliveryCharge : 0) + couponDiscount} on this order
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                style={{
                  ...styles.placeOrderButton,
                  ...(isPlacingOrder ? styles.buttonDisabled : {})
                }}
              >
                {isPlacingOrder ? 'PLACING ORDER...' : 'PLACE ORDER'}
              </button>
              <div style={styles.secureText}>
                Safe & Secure Payment • Easy Returns • 100% Authentic
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Styles - Flipkart inspired
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f1f3f6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
  },
  header: {
    backgroundColor: '#2874f0',
    padding: '12px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  logoArea: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '2px'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    fontStyle: 'italic'
  },
  logoPlus: {
    fontSize: '14px',
    color: '#ffe500',
    fontWeight: '500'
  },
  checkoutBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '4px 12px',
    borderRadius: '20px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500'
  },
  mainContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '20px'
  },
  twoColumnLayout: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  leftColumn: {
    flex: '2',
    minWidth: '280px'
  },
  rightColumn: {
    flex: '1',
    minWidth: '280px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    marginBottom: '16px',
    boxShadow: '0 1px 1px rgba(0,0,0,0.05)'
  },
  cardHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#212121',
    margin: 0
  },
  addButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#2874f0',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  cardBody: {
    padding: '20px'
  },
  addressCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  addressCardSelected: {
    borderColor: '#2874f0',
    backgroundColor: '#f8faff'
  },
  addressRadio: {
    paddingTop: '2px'
  },
  radioCircle: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid #c2c2c2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioSelected: {
    borderColor: '#2874f0'
  },
  radioInner: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#2874f0'
  },
  addressDetails: {
    flex: 1
  },
  addressNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '6px'
  },
  addressName: {
    fontWeight: '500',
    fontSize: '14px',
    color: '#212121'
  },
  defaultBadge: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#388e3c',
    backgroundColor: '#e8f5e9',
    padding: '2px 8px',
    borderRadius: '12px'
  },
  addressType: {
    fontSize: '12px',
    color: '#878787'
  },
  addressPhone: {
    fontSize: '13px',
    color: '#878787',
    marginBottom: '4px'
  },
  addressFull: {
    fontSize: '13px',
    color: '#878787',
    lineHeight: '1.4'
  },
  removeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#2874f0',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  addressForm: {
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '20px'
  },
  formTitle: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '16px',
    color: '#212121'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  errorText: {
    fontSize: '11px',
    color: '#ff6161',
    marginTop: '4px',
    display: 'block'
  },
  addressTypeToggle: {
    display: 'flex',
    gap: '24px',
    marginTop: '16px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    cursor: 'pointer'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px',
    marginTop: '20px'
  },
  cancelButton: {
    padding: '8px 20px',
    backgroundColor: 'transparent',
    border: '1px solid #c2c2c2',
    borderRadius: '2px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  saveButton: {
    padding: '8px 20px',
    backgroundColor: '#2874f0',
    border: 'none',
    borderRadius: '2px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#ffffff',
    cursor: 'pointer'
  },
  paymentMethodsContainer: {
    padding: '8px 0'
  },
  paymentMethodCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderBottom: '1px solid #f0f0f0'
  },
  paymentMethodSelected: {
    backgroundColor: '#f8faff'
  },
  paymentMethodRadio: {
    paddingTop: '2px'
  },
  radioOuter: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid #c2c2c2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioOuterSelected: {
    borderColor: '#2874f0'
  },
  paymentMethodIcon: {
    fontSize: '24px',
    width: '32px'
  },
  paymentMethodContent: {
    flex: 1
  },
  paymentMethodName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#212121'
  },
  paymentMethodDescription: {
    fontSize: '12px',
    color: '#878787',
    marginTop: '2px'
  },
  paymentDetails: {
    padding: '20px',
    borderTop: '1px solid #f0f0f0',
    backgroundColor: '#fafafa'
  },
  paymentDetailsTitle: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '16px',
    color: '#212121'
  },
  upiAppsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '12px',
    marginBottom: '16px'
  },
  upiAppButton: {
    padding: '10px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s'
  },
  upiInput: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px'
  },
  verifyButton: {
    padding: '10px 20px',
    backgroundColor: '#2874f0',
    border: 'none',
    borderRadius: '4px',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500'
  },
  cardTypes: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap'
  },
  cardTypeButton: {
    padding: '8px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s'
  },
  cardTypeSelected: {
    borderColor: '#2874f0',
    backgroundColor: '#e8f0fe',
    color: '#2874f0'
  },
  cardRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px'
  },
  secureNote: {
    marginTop: '12px',
    fontSize: '11px',
    color: '#388e3c',
    textAlign: 'center'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff'
  },
  bankLogos: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
    flexWrap: 'wrap'
  },
  bankChip: {
    padding: '6px 12px',
    backgroundColor: '#f0f0f0',
    borderRadius: '20px',
    fontSize: '11px',
    color: '#666'
  },
  walletGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '12px',
    marginBottom: '16px'
  },
  walletOption: {
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    fontSize: '12px'
  },
  walletBalance: {
    fontSize: '12px',
    color: '#ff6161',
    textAlign: 'center',
    marginTop: '12px'
  },
  emiCalculation: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#e8f5e9',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#2e7d32'
  },
  codInfo: {
    padding: '20px',
    textAlign: 'center',
    borderTop: '1px solid #f0f0f0'
  },
  codIcon: {
    fontSize: '48px',
    marginBottom: '12px'
  },
  codText: {
    fontSize: '14px',
    color: '#212121',
    marginBottom: '8px'
  },
  codNote: {
    fontSize: '11px',
    color: '#878787'
  },
  selectedPaymentInfo: {
    marginBottom: '16px'
  },
  selectedPaymentBadge: {
    backgroundColor: '#e8f5e9',
    padding: '12px 16px',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#2e7d32'
  },
  orderItem: {
    display: 'flex',
    gap: '16px',
    padding: '20px',
    borderBottom: '1px solid #f0f0f0'
  },
  productImage: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    backgroundColor: '#f8f8f8'
  },
  orderItemDetails: {
    flex: 1
  },
  productName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#212121',
    marginBottom: '8px'
  },
  productMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    color: '#878787'
  },
  productPrice: {
    fontWeight: '500',
    color: '#212121'
  },
  sellerInfo: {
    fontSize: '12px',
    color: '#878787',
    marginTop: '8px'
  },
  deliveryDate: {
    fontSize: '12px',
    color: '#388e3c',
    marginTop: '8px'
  },
  priceCard: {
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: '80px'
  },
  priceHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '16px',
    fontWeight: '500',
    color: '#878787'
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 20px',
    fontSize: '14px',
    color: '#212121'
  },
  greenText: {
    color: '#388e3c'
  },
  couponSection: {
    display: 'flex',
    padding: '12px 20px',
    borderTop: '1px solid #f0f0f0',
    borderBottom: '1px solid #f0f0f0',
    gap: '12px'
  },
  couponInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #e0e0e0',
    borderRadius: '2px',
    fontSize: '13px',
    outline: 'none'
  },
  applyButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#2874f0',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer'
  },
  couponApplied: {
    padding: '8px 20px',
    fontSize: '12px',
    color: '#388e3c',
    backgroundColor: '#e8f5e9'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 20px',
    fontSize: '18px',
    fontWeight: '500',
    borderTop: '1px solid #e0e0e0',
    marginTop: '8px'
  },
  savingsText: {
    padding: '8px 20px',
    fontSize: '13px',
    color: '#388e3c',
    backgroundColor: '#f0faf0',
    margin: '0 20px 16px 20px',
    borderRadius: '2px'
  },
  placeOrderButton: {
    margin: '0 20px 16px 20px',
    width: 'calc(100% - 40px)',
    padding: '14px',
    backgroundColor: '#fb641b',
    border: 'none',
    borderRadius: '2px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  secureText: {
    textAlign: 'center',
    padding: '0 20px 20px 20px',
    fontSize: '11px',
    color: '#878787'
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f1f3f6'
  },
  emptyCard: {
    textAlign: 'center',
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '4px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#212121'
  },
  emptyText: {
    color: '#878787',
    marginBottom: '24px'
  },
  emptyButton: {
    padding: '10px 24px',
    backgroundColor: '#2874f0',
    border: 'none',
    borderRadius: '2px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  linkButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#2874f0',
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '8px'
  },
  emptyAddressState: {
    textAlign: 'center',
    padding: '24px',
    color: '#878787'
  }
};

export default CheckoutPage;