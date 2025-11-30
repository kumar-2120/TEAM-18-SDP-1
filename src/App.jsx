import React, { useState, useEffect } from 'react';
import './styles.css';

const AgriValueMarketplace = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [reviews, setReviews] = useState({}); 
  const [likedReviews, setLikedReviews] = useState([]); 
  const [ratingDrafts, setRatingDrafts] = useState({}); 
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [valueRequests, setValueRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [_toasts, setToasts] = useState([]);
  const [activeTrainingTab, setActiveTrainingTab] = useState('agricultural');
  const [deliveryFilter, setDeliveryFilter] = useState('active');
  const [farmerFormErrors, setFarmerFormErrors] = useState({});
  const [farmerMode, setFarmerMode] = useState('login');
  const [farmerForm, setFarmerForm] = useState({ username: '', password: '', confirmPassword: '', fullname: '', location: '', contact: '' });
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [deliveryPersons, setDeliveryPersons] = useState([
    { id: 'del-1', name: 'Raju', phone: '9000000001', region: 'Hyderabad' },
    { id: 'del-2', name: 'Lakshmi', phone: '9000000002', region: 'Vijayawada' },
    { id: 'del-3', name: 'Kumar', phone: '9000000003', region: 'Guntur' },
  ]);
  const [deliveryFilters, setDeliveryFilters] = useState({ status: 'all', myQueue: false });
  const [bulkSelection, setBulkSelection] = useState([]);
  const [podDraft, setPodDraft] = useState({ result: 'success', notes: '', photoUrl: '' });
  // Buyer order search state must be declared at top-level (not inside conditionals)
  const [orderSearchId, setOrderSearchId] = useState('');
  const [highlightId, setHighlightId] = useState(null);
  // Persist delivery dashboard random slice
  const [deliverySliceIds, setDeliverySliceIds] = useState([]);
  // Persist visibility of UPI banner in marketplace
  const [upiBannerHidden, setUpiBannerHidden] = useState(() => {
    try {
      return localStorage.getItem('upi_banner_hidden') === '1';
    } catch {
      return false;
    }
  });
  // Track buyer purchased products
  const [purchasedProducts, setPurchasedProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('agri_purchased') || '[]'); } catch { return []; }
  });
  // Track last placed order IDs to highlight in buyer-orders
  const [lastPlacedOrderIds, setLastPlacedOrderIds] = useState([]);

  useEffect(() => {
    if (highlightId) {
      try {
        const el = document.getElementById(`order-${highlightId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch {}
    }
  }, [highlightId]);

  // Compute and persist a random delivery selection up to 4 whenever filters or order set change
  useEffect(() => {
    try {
      const me = currentUser || {};
      const myId = me.id;
      const filteredAll = (orders || []).filter(o => {
        const statusOk = deliveryFilters.status === 'all' ? true : (o.status || 'processing') === deliveryFilters.status;
        const myQueueOk = deliveryFilters.myQueue ? (o.deliveryPersonId === myId) : true;
        return statusOk && myQueueOk;
      });
      const ids = filteredAll.map(o => o.id);
      const needsReseed = deliverySliceIds.length === 0 || !deliverySliceIds.every(id => ids.includes(id));
      if (needsReseed) {
        const arr = [...filteredAll];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        setDeliverySliceIds(arr.slice(0, 4).map(o => o.id));
      }
    } catch {}
  }, [deliveryFilters.status, deliveryFilters.myQueue, currentUser?.id, orders]);

  useEffect(() => {
    initializeSampleData();

    try {
      const persistedProducts = JSON.parse(localStorage.getItem('agri_products') || 'null');
      if (persistedProducts && Array.isArray(persistedProducts)) {
        if (persistedProducts.length > 0) {
          setProducts(persistedProducts);
        } else {
          restoreDefaultProducts(true);
        }
      } else if (persistedProducts) {
        setProducts(persistedProducts);
      }
      if (persistedProducts && Array.isArray(persistedProducts) && persistedProducts.length === 0) {
        setTimeout(() => restoreDefaultProducts(true), 0);
      }
    } catch (err) {
      console.warn('Failed to load persisted data', err);
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('agri_notifications', JSON.stringify(notifications)); } catch { void 0; }
  }, [notifications]);

  const addNotification = (farmerId, message, type = 'info') => {
    if (!farmerId) return;
    const n = { id: Date.now() + Math.floor(Math.random() * 1000), farmerId, message, type, createdAt: new Date().toISOString(), read: false };
    setNotifications(prev => [n, ...prev]);
  };

  const randomizeLocalFarmers = () => {
    const sampleFarmers = ['Ashish Verma','Ramesh Kumar','Sita Devi','Anil Sharma','Kavita Rao','Vikram Singh','Meera Patel','Suresh Reddy','Lakshmi Devi','Raju','Anita Sharma','Venkatesh','Uma Rao'];
    setProducts(prev => {
      const next = prev.map(p => {
        if (!p || typeof p.id !== 'number') return p;
        if (p.id === 1024) return { ...p, farmer: 'ashish verma' };
        if (p.id >= 1000) {
          const name = sampleFarmers[Math.floor(Math.random() * sampleFarmers.length)];
          return { ...p, farmer: name };
        }
        return p;
      });
      try { localStorage.setItem('agri_products', JSON.stringify(next)); } catch { void 0; }
      pushToast('Local farmer names randomized for demo.', 'success');
      return next;
    });
  };

  const pushToast = (message, type = 'info', timeout = 3500) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts(prev => [{ id, message, type }, ...prev]);

    try {
      const containerId = 'agri-toasts-root';
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.style.position = 'fixed';
        container.style.right = '18px';
        container.style.bottom = '18px';
        container.style.zIndex = '99999';
        document.body.appendChild(container);
      }
      const toastEl = document.createElement('div');
      toastEl.textContent = message;
      toastEl.style.background = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#333';
      toastEl.style.color = '#fff';
      toastEl.style.padding = '10px 12px';
      toastEl.style.borderRadius = '8px';
      toastEl.style.marginTop = '8px';
      toastEl.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
      container.prepend(toastEl);
      setTimeout(() => {
        try { container.removeChild(toastEl); } catch { void 0; }
      }, timeout);
    } catch { void 0; }

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, timeout);
  };

  const getRegionFromAddress = (addr = '') => {
    const s = (addr || '').toLowerCase();
    if (s.includes('hyderabad')) return 'Hyderabad';
    if (s.includes('vijayawada')) return 'Vijayawada';
    if (s.includes('guntur')) return 'Guntur';
    if (s.includes('vizag')) return 'Vizag';
    return 'General';
  };

  const openInMaps = (address) => {
    try {
      const q = encodeURIComponent(address || '');
      window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank', 'noopener');
    } catch { pushToast('Unable to open maps', 'error'); }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text || '');
      pushToast('Copied to clipboard', 'success');
    } catch { pushToast('Copy failed', 'error'); }
  };

  const initializeSampleData = () => {
    const localImageFiles = [
      'download (34).jpeg','download (35).jpeg','download (36).jpeg','download (37).jpeg','download (38).jpeg','download (39).jpeg','download (40).jpeg','download (41).jpeg','download (42).jpeg','download (43).jpeg','download (44).jpeg','download (46).jpeg','download (47).jpeg','download (48).jpeg','download (49).jpeg','download (50).jpeg','download (51).jpeg','download (52).jpeg','download (53).jpeg','download (54).jpeg','download (55).jpeg','download (56).jpeg','download (58).jpeg','download (59).jpeg','download (60).jpeg','download (61).jpeg','download (62).jpeg','download (63).jpeg','download (64).jpeg','download (65).jpeg','download (66).jpeg','download (67).jpeg','download (68).jpeg'
    ];

    const customNames = {
      1: 'Bay Leaves',
      2: 'Carom Seeds',
      3: 'Charoli',
      4: 'Soya Chunks',
      5: 'Soya Granules',
      6: 'Cumin Seeds',
      7: 'Mace',
      8: 'Coriander Powder',
      9: 'Coriander Seeds',
      10: 'Fenugreek Seeds',
      11: 'Star Anise',
      12: 'Wheat Grains',
      13: 'Corn Flour',
      14: 'Jowar Seeds',
      15: 'Cereal Grains',
      16: 'White Sorghum',
      17: 'Jowar Flour',
      18: 'Finger Millet',
      19: 'Finger Millet Flour',
      20: 'Cinnamon Flour',
      21: 'Chips',
      22: 'Coconut Dumplings',
      23: 'Rice Flour Crackers',
      24: 'Khaja',
      25: 'Shells',
      26: 'Savory Snacks',
      27: 'Sweet Shells',
      28: 'Chickpea Flour Droplets',
      29: 'Butter',
      30: 'Cow Ghee',
      31: 'Coffee Powder',
      32: 'Mango Pickles',
      33: 'Ginger Pickles'
    };

    const localProducts = localImageFiles.map((fname, idx) => {
      const displayIndex = idx + 1;
      const sampleFarmers = ['Ashish Verma','Ramesh Kumar','Sita Devi','Anil Sharma','Kavita Rao','Vikram Singh','Meera Patel','Suresh Reddy','Lakshmi Devi','Raju'];
      const sampleLocations = ['Guntur, Andhra Pradesh','Vijayawada, Andhra Pradesh','Nellore, Andhra Pradesh','Kurnool, Andhra Pradesh','Vizag, Andhra Pradesh','Tirupati, Andhra Pradesh','Guntur Rural','Kadapa, Andhra Pradesh','Anantapur, Andhra Pradesh','Ongole, Andhra Pradesh'];
      const computedFarmer = (1000 + idx) === 1024 ? 'ashish verma' : sampleFarmers[idx % sampleFarmers.length];
      const computedLocation = sampleLocations[idx % sampleLocations.length];
      return {
        id: 1000 + idx,
        name: customNames[displayIndex] || `Product ${displayIndex}`,
        quantity: 100 + (idx % 50),
        price: 50 + (idx % 200),
        image: `/images/${encodeURIComponent(fname)}`,
        location: computedLocation,
        contact: '',
        farmer: computedFarmer,
        status: 'approved',
        verified: true,
        verificationStatus: true,
        quality: 7 + (idx % 4) * 0.5,
        inMarketplace: true
      };
    });

    
    const fallbackSamples = [
      {
        id: 1,
        name: 'Organic Basmati Rice',
        quantity: 500,
        price: 80,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        location: 'Guntur, Andhra Pradesh',
        contact: '9876543210',
        farmer: 'Ravi Kumar',
        status: 'approved',
        verified: true,
        verificationStatus: true,
        quality: 8.5,
        inMarketplace: true
      },
      {
        id: 2,
        name: 'All Mix Spices',
        quantity: 200,
        price: 120,
        image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
        location: 'Nellore, Andhra Pradesh',
        contact: '9876543211',
        farmer: 'Lakshmi Devi',
        status: 'approved',
        verified: true,
        verificationStatus: true,
        quality: 9.2,
        inMarketplace: true
      }
      
    ];

    let allProducts = [...localProducts, ...fallbackSamples];

    
    const outOfStockCount = Math.min(5, allProducts.length);
    const chosen = new Set();
    while (chosen.size < outOfStockCount) {
      const r = Math.floor(Math.random() * allProducts.length);
      chosen.add(r);
    }
    allProducts = allProducts.map((p, idx) => ({ ...p, quantity: chosen.has(idx) ? 0 : p.quantity }));

    setProducts(allProducts);
    const reviewsMap = {};
    allProducts.forEach((prod) => {
      reviewsMap[prod.id] = [
        { id: `${prod.id}-r1`, author: 'Ravi Kumar', text: 'Good quality and fair price.', likes: Math.floor(Math.random() * 8) },
        { id: `${prod.id}-r2`, author: 'Anita Sharma', text: 'Quick delivery and well packaged.', likes: Math.floor(Math.random() * 5) }
      ];
    });
    setReviews(reviewsMap);
    setOrders([
      {
        id: 1001,
        productId: 1,
        quantity: 10,
        total: 800,
        buyerName: 'Suresh Reddy',
        address: 'Plot 45, Banjara Hills, Hyderabad',
        contact: '9988776655',
        status: 'shipped',
        deliveryPersonId: 'del-1',
        deliveryPersonName: 'Raju (del-1)',
        deliveredAt: null,
        deliveryResult: null
      },
      {
        id: 1002,
        productId: 2,
        quantity: 30,
        total: 1200,
        buyerName: 'jayanth Reddy',
        address: 'Plot 34, Kannur, Vijaywada',
        contact: '9088454355',
        status: 'processing',
        deliveryPersonId: 'del-2',
        deliveryPersonName: 'Lakshmi (del-2)',
        deliveredAt: null,
        deliveryResult: null
      },
      {
        id: 1003,
        productId: 3,
        quantity: 2,
        total: 500,
        buyerName: 'RAJU',
        address: 'Plot 2, Poranki, Vijaywada',
        contact: '9088485355',
        status: 'shipping',
        deliveryPersonId: 'del-1',
        deliveryPersonName: 'Raju (del-1)',
        deliveredAt: null,
        deliveryResult: null
      },
      {
      id: 1008,
        productId: 90,
        quantity: 3,
        total: 120,
        buyerName: 'Tauheed',
        address: '1-65, Railway colony, Guntakal',
        contact: '8936845355',
        status: 'Delivered',
        deliveryPersonId: 'del-2',
        deliveryPersonName: 'Lakshmi (del-2)',
        deliveredAt: new Date().toISOString(),
        deliveryResult: 'success'
      },
      {
        id: 1009,
        productId: 1000,
        quantity: 5,
        total: 250,
        buyerName: 'Priya Sharma',
        address: 'Plot 12, Jubilee Hills, Hyderabad',
        contact: '9876543210',
        status: 'shipped',
        deliveryPersonId: 'kumar',
        deliveryPersonName: 'Kumar',
        deliveredAt: null,
        deliveryResult: null
      },
      {
        id: 1010,
        productId: 1001,
        quantity: 8,
        total: 400,
        buyerName: 'Rajesh Kumar',
        address: 'H.No 45, Madhapur, Hyderabad',
        contact: '9988776655',
        status: 'processing',
        deliveryPersonId: 'kumar',
        deliveryPersonName: 'Kumar',
        deliveredAt: null,
        deliveryResult: null
      },
      {
        id: 1011,
        productId: 1002,
        quantity: 3,
        total: 180,
        buyerName: 'Anita Singh',
        address: 'Flat 201, Banjara Hills, Hyderabad',
        contact: '9876543211',
        status: 'shipped',
        deliveryPersonId: 'ravi',
        deliveryPersonName: 'Ravi',
        deliveredAt: null,
        deliveryResult: null
      },
      {
        id: 1012,
        productId: 1003,
        quantity: 12,
        total: 600,
        buyerName: 'Suresh Babu',
        address: 'Plot 67, Kondapur, Hyderabad',
        contact: '9123456789',
        status: 'processing',
        deliveryPersonId: 'amit',
        deliveryPersonName: 'Amit',
        deliveredAt: null,
        deliveryResult: null
      },
      {
        id: 1013,
        productId: 1004,
        quantity: 6,
        total: 300,
        buyerName: 'Meera Reddy',
        address: 'H.No 123, Gachibowli, Hyderabad',
        contact: '9987654321',
        status: 'delivered',
        deliveryPersonId: 'ravi',
        deliveryPersonName: 'Ravi',
        deliveredAt: new Date().toISOString(),
        deliveryResult: 'success'
      },
      {
        id: 1014,
        productId: 1005,
        quantity: 4,
        total: 200,
        buyerName: 'Vikram Sharma',
        address: 'Flat 45, Hitech City, Hyderabad',
        contact: '9111222333',
        status: 'shipped',
        deliveryPersonId: 'priya',
        deliveryPersonName: 'Priya',
        deliveredAt: null,
        deliveryResult: null
      }
    ]);
  };

  const restoreDefaultProducts = (silent = false) => {
    if (!silent && !confirm('Restore default marketplace products? This will replace current product list in the UI.')) return;

    const localImageFiles = [
      'download (34).jpeg','download (35).jpeg','download (36).jpeg','download (37).jpeg','download (38).jpeg','download (39).jpeg','download (40).jpeg','download (41).jpeg','download (42).jpeg','download (43).jpeg','download (44).jpeg','download (46).jpeg','download (47).jpeg','download (48).jpeg','download (49).jpeg','download (50).jpeg','download (51).jpeg','download (52).jpeg','download (53).jpeg','download (54).jpeg','download (55).jpeg','download (56).jpeg','download (58).jpeg','download (59).jpeg','download (60).jpeg','download (61).jpeg','download (62).jpeg','download (63).jpeg','download (64).jpeg','download (65).jpeg','download (66).jpeg','download (67).jpeg','download (68).jpeg'
    ];
    const customNames = {
      1: 'Bay Leaves',
      2: 'Carom Seeds',
      3: 'Charoli',
      4: 'Soya Chunks',
      5: 'Soya Granules',
      6: 'Cumin Seeds',
      7: 'Mace',
      8: 'Coriander Powder',
      9: 'Coriander Seeds',
      10: 'Fenugreek Seeds',
      11: 'Star Anise',
      12: 'Wheat Grains',
      13: 'Corn Flour',
      14: 'Jowar Seeds',
      15: 'Cereal Grains',
      16: 'White Sorghum',
      17: 'Jowar Flour',
      18: 'Finger Millet',
      19: 'Finger Millet Flour',
      20: 'Cinnamon Flour',
      21: 'Chips',
      22: 'Coconut Dumplings',
      23: 'Rice Flour Crackers',
      24: 'Khaja',
      25: 'Shells',
      26: 'Savory Snacks',
      27: 'Sweet Shells',
      28: 'Chickpea Flour Droplets',
      29: 'Butter',
      30: 'Cow Ghee',
      31: 'Coffee Powder',
      32: 'Mango Pickles',
      33: 'Ginger Pickles'
    };

    const localProducts = localImageFiles.map((fname, idx) => {
      const displayIndex = idx + 1;
      const sampleFarmers = ['Ashish Verma','Ramesh Kumar','Sita Devi','Anil Sharma','Kavita Rao','Vikram Singh','Meera Patel','Suresh Reddy','Lakshmi Devi','Raju'];
      const sampleLocations = ['Guntur, Andhra Pradesh','Vijayawada, Andhra Pradesh','Nellore, Andhra Pradesh','Kurnool, Andhra Pradesh','Vizag, Andhra Pradesh','Tirupati, Andhra Pradesh','Guntur Rural','Kadapa, Andhra Pradesh','Anantapur, Andhra Pradesh','Ongole, Andhra Pradesh'];
      const computedFarmer = (1000 + idx) === 1024 ? 'ashish verma' : sampleFarmers[idx % sampleFarmers.length];
      const computedLocation = sampleLocations[idx % sampleLocations.length];
      return {
        id: 1000 + idx,
        name: customNames[displayIndex] || `Product ${displayIndex}`,
        quantity: 100 + (idx % 50),
        price: 50 + (idx % 200),
        image: `/images/${encodeURIComponent(fname)}`,
        location: computedLocation,
        contact: '',
        farmer: computedFarmer,
        status: 'approved',
        verified: true,
        verificationStatus: true,
        quality: 7 + (idx % 4) * 0.5,
        inMarketplace: true
      };
    });

    const fallbackSamples = [
      {
        id: 1,
        name: 'Organic Basmati Rice',
        quantity: 500,
        price: 80,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
        location: 'Guntur, Andhra Pradesh',
        contact: '9876543210',
        farmer: 'Ravi Kumar',
        status: 'approved',
        verified: true,
        verificationStatus: true,
        quality: 8.5,
        inMarketplace: true
      },
      {
        id: 2,
        name: 'All Mix Spices',
        quantity: 200,
        price: 120,
        image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
        location: 'Nellore, Andhra Pradesh',
        contact: '9876543211',
        farmer: 'Lakshmi Devi',
        status: 'approved',
        verified: true,
        verificationStatus: true,
        quality: 9.2,
        inMarketplace: true
      }
    ];

    let allProducts = [...localProducts, ...fallbackSamples];

    const outOfStockCount = Math.min(5, allProducts.length);
    const chosen = new Set();
    while (chosen.size < outOfStockCount) {
      const r = Math.floor(Math.random() * allProducts.length);
      chosen.add(r);
    }
    allProducts = allProducts.map((p, idx) => ({ ...p, quantity: chosen.has(idx) ? 0 : p.quantity }));

    const reviewsMap = {};
    allProducts.forEach((prod) => {
      reviewsMap[prod.id] = [
        { id: `${prod.id}-r1`, author: 'Ravi Kumar', text: 'Good quality and fair price.', likes: Math.floor(Math.random() * 8) },
        { id: `${prod.id}-r2`, author: 'Anita Sharma', text: 'Quick delivery and well packaged.', likes: Math.floor(Math.random() * 5) }
      ];
    });

    setProducts(allProducts);
    setReviews(reviewsMap);
  try { localStorage.removeItem('agri_products'); } catch { void 0; }
  try { localStorage.setItem('agri_reviews', JSON.stringify(reviewsMap)); } catch { void 0; }
  };

  const getQualityLabel = (rating) => {
    if (rating <= 2) return '⭐ Poor';
    if (rating <= 4) return '⭐⭐ Average';
    if (rating <= 7) return '⭐⭐⭐ Good';
    if (rating <= 9) return '⭐⭐⭐⭐ Excellent';
    return '⭐⭐⭐⭐⭐ Outstanding';
  };

  
  const generateETA = () => {
    const r = Math.random();
    if (r < 0.4) {
      const hours = [2, 4, 6, 8];
      const h = hours[Math.floor(Math.random() * hours.length)];
      return `Within ${h} hours`;
    } else if (r < 0.85) {
      const days = [1, 2];
      const d = days[Math.floor(Math.random() * days.length)];
      return `${d} day${d > 1 ? 's' : ''}`;
    }
    return 'Within 12 hours';
  };

 
  let RZP_KEY = 'rzp_test_1234567890abcdef';
  try {
    if (import.meta && import.meta.env && import.meta.env.VITE_RAZORPAY_KEY_ID) {
      RZP_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
    }
  } catch {}
 

  const openRazorpayPayment = ({ amount, name, contact, notes, orderId, onSuccess, onDismiss }) => {
    try {
      if (typeof window === 'undefined') {
        pushToast('Payment not supported in this environment.', 'error');
        return;
      }
      const amt = Math.max(100, Math.round((amount || 0) * 100)); // Razorpay min = 100 paise (₹1)
      const isPlaceholderKey = !RZP_KEY || RZP_KEY === 'rzp_test_1234567890abcdef';
      if (!window.Razorpay || isPlaceholderKey) {
        pushToast('Payment setup incomplete. Configure Razorpay key and script.', 'error');
        return;
      }
      const options = {
        key: RZP_KEY,
        amount: amt,
        currency: 'INR',
        name: 'AgriValue',
        description: 'Order payment',
        notes: notes || {},
        prefill: { name: name || '', contact: contact || '' },
        theme: { color: '#667eea' },
        order_id: orderId || undefined,
        retry: { enabled: true, max_count: 1 },
        handler: function (response) {
          if (typeof onSuccess === 'function') onSuccess(response);
        },
        modal: {
          ondismiss: function () {
            pushToast('Payment cancelled.', 'info');
            if (typeof onDismiss === 'function') onDismiss();
          }
        }
      };
      const rzp = new window.Razorpay(options);
      if (typeof rzp.on === 'function') {
        rzp.on('payment.failed', function () {
          pushToast('Payment failed. Please try again.', 'error');
          if (typeof onDismiss === 'function') onDismiss();
        });
      }
      rzp.open();
    } catch (e) {
      pushToast('Payment error occurred. Please try again.', 'error');
    }
  };

  const handleImgError = (e, small = false) => {
    const placeholder = small ? 'https://via.placeholder.com/80' : 'https://via.placeholder.com/300x200';
    try {
      if (e.currentTarget.dataset.fallbackTried) {
        e.currentTarget.src = placeholder;
        return;
      }

      const seed = e.currentTarget.dataset.seed || e.currentTarget.dataset.id || '0';

      const src = e.currentTarget.getAttribute('src') || '';
      if (src.startsWith('/images/') || src.includes('/public/images/') || src.includes('/images%20')) {
        e.currentTarget.dataset.fallbackTried = '1';
        e.currentTarget.src = `https://images.unsplash.com/photo-1542831371-d531d36971e6?w=800&sig=${encodeURIComponent(seed)}`;
      } else {
        e.currentTarget.src = placeholder;
      }
    } catch {
      e.currentTarget.src = placeholder;
    }
  };

  const handleFarmerInput = (field, value) => {
    setFarmerForm(prev => ({ ...prev, [field]: value }));

    setFarmerFormErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleFarmerLogin = () => {
    const username = (farmerForm.username || '').trim();
    const password = (farmerForm.password || '').trim();
    const errors = {};
    if (!username) errors.username = 'Please enter your username (mobile number).';
    if (!password) errors.password = 'Please enter your password.';
    setFarmerFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    let farmers = [];
  try { farmers = JSON.parse(localStorage.getItem('agri_farmers') || '[]'); } catch { farmers = []; }
    const found = farmers.find(f => f.username === username);
    if (!found) {
      setFarmerFormErrors({ username: 'No account found for this username. Please register.' });
      return;
    }
    if (found.password !== password) {
      setFarmerFormErrors({ password: 'Incorrect password.' });
      return;
    }
    
    setCurrentUser(found);
    setCurrentPage('farmer-dashboard');
    pushToast(`Welcome back, ${found.fullname || found.username}!`, 'success');
  };

  const handleFarmerRegister = () => {
    const fullname = (farmerForm.fullname || '').trim();
    const password = (farmerForm.password || '').trim();
    const confirmPassword = (farmerForm.confirmPassword || '').trim();
    const location = (farmerForm.location || '').trim();
    const contact = (farmerForm.contact || '').trim();

    const errors = {};
    if (!fullname || fullname.length < 3) errors.fullname = 'Please enter your full name (at least 3 characters).';
    if (!/^[0-9]{10}$/.test(contact)) errors.contact = 'Please enter a valid 10-digit mobile number.';
    if (!location) errors.location = 'Please enter your village / district / state.';
    if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';

    setFarmerFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const username = contact;

    let farmers = [];
  try { farmers = JSON.parse(localStorage.getItem('agri_farmers') || '[]'); } catch { farmers = []; }
    if (farmers.find(f => f.username === username)) {
      setFarmerFormErrors({ contact: 'An account with this mobile number already exists. Please login.' });
      return;
    }

    const newFarmer = {
      id: Date.now(),
      username,
      password,
      fullname,
      location,
      contact,
      role: 'farmer',
      createdAt: new Date().toISOString()
    };
    farmers.push(newFarmer);
  try { localStorage.setItem('agri_farmers', JSON.stringify(farmers)); } catch { void 0; }
    setCurrentUser(newFarmer);
    setCurrentPage('farmer-dashboard');
    pushToast(`Registration successful — welcome, ${fullname}!`, 'success');
  };

    useEffect(() => {
  try { localStorage.setItem('agri_orders', JSON.stringify(orders)); } catch { void 0; }
    }, [orders]);

    useEffect(() => {
  try { localStorage.setItem('agri_currentUser', JSON.stringify(currentUser)); } catch { void 0; }
    }, [currentUser]);
    useEffect(() => {
  try { localStorage.setItem('agri_cart', JSON.stringify(cart)); } catch { void 0; }
    }, [cart]);

    useEffect(() => {
  try { localStorage.setItem('agri_reviews', JSON.stringify(reviews)); } catch { void 0; }
    }, [reviews]);

    useEffect(() => {
      try { localStorage.setItem('agri_purchased', JSON.stringify(purchasedProducts)); } catch { void 0; }
    }, [purchasedProducts]);

    useEffect(() => {
      const onKey = (e) => {
        if (e.key === 'Escape' && activeModal) {
          setActiveModal(null);
          setSelectedProduct(null);
        }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [activeModal]);

    useEffect(() => {
  try { localStorage.setItem('agri_valueRequests', JSON.stringify(valueRequests)); } catch { void 0; }
    }, [valueRequests]);

    useEffect(() => {
  try { localStorage.setItem('agri_products', JSON.stringify(products)); } catch { void 0; }
    }, [products]);

    useEffect(() => {
  try { localStorage.setItem('agri_liked', JSON.stringify(likedReviews)); } catch { void 0; }
    }, [likedReviews]);

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if ((product.quantity || 0) <= 0) {
      pushToast('This product is out of stock and cannot be added to cart.', 'error');
      return;
    }
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
      const maxQty = product.quantity || 0;
      if (existingItem.quantity >= maxQty) {
        pushToast('Maximum available quantity reached for this product.', 'info');
        return;
      }
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.min(item.quantity + 1, maxQty) }
          : item
      ));
    } else {
      const priceToUse = (product.discountedPrice !== undefined && product.discountedPrice !== null) ? product.discountedPrice : product.price;
      setCart([...cart, { productId, quantity: 1, price: priceToUse }]);
    }
    pushToast(product.name + ' added to cart!', 'success');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId, change) => {
    const item = cart.find(i => i.productId === productId);
    if (item) {
      const product = products.find(p => p.id === productId);
      const maxQty = product ? (product.quantity || 0) : Infinity;
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        const clamped = Math.min(newQuantity, maxQty);
        if (clamped !== newQuantity && change > 0) {
          pushToast('Cannot exceed available stock for this product.', 'info');
        }
        setCart(cart.map(i =>
          i.productId === productId ? { ...i, quantity: clamped } : i
        ));
      }
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    return sum + (item.quantity * (item.price || 0));
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (currentPage === 'landing') {
    return (
      <div className="body landing">
        <div className="landingBlobs" aria-hidden="true">
          <span className="blob blob1" />
          <span className="blob blob2" />
          <span className="blob blob3" />
        </div>
        <h1 className="animatedTitle">🌾 AgriValue 🌾</h1>
        <p className="tagline">Empowering Farmers, Enriching Rural Communities</p>
        <div className="roleButtons">
          {(() => {
            const roles = [
              { title: '👨‍🌾 Farmer', desc: 'Register and sell your agricultural products', page: 'farmer-auth' },
              { title: '🔍 Verification Employee', desc: 'Verify farmer registrations and products', page: 'employee-auth' },
              { title: '⭐ Quality Team', desc: 'Assess product quality standards', page: 'quality-auth' },
              { title: '⚙️ Admin', desc: 'Manage export/import operations', page: 'admin-auth' },
              { title: '🚚 Delivery Personel', desc: 'Manage product deliveries', page: 'delivery-auth' },
              { title: '🛒 Buyer', desc: 'Browse and purchase quality products', page: 'marketplace' },
              { title: '📚 Training Center', desc: 'Learn new skills and best practices', page: 'training' }
            ];
            const top = roles.slice(0,4);
            const bottom = roles.slice(4);
            return (
              <>
                <div className="topRow">
                  {top.map((role, i) => (
                    <button
                      key={i}
                      className="roleBtn frost"
                      onClick={() => setCurrentPage(role.page)}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <h3 className="roleTitle">{role.title}</h3>
                        <p className="roleDesc">{role.desc}</p>
                    </button>
                  ))}
                </div>
                <div className="bottomRow">
                  {bottom.map((role, i) => (
                    <button
                      key={i}
                      className="roleBtn frost"
                      onClick={() => setCurrentPage(role.page)}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <h3 className="roleTitle">{role.title}</h3>
                      <p className="roleDesc">{role.desc}</p>
                    </button>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    );
  }


  if (currentPage === 'farmer-auth') {
    return (
      <div className="body authPage">
        <div className="container compact" style={{maxWidth: '720px'}}>
          <div className="header">
            <h1 style={{color: '#667eea'}}>Farmer Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>

          <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
            <button className={`btn ${farmerMode === 'login' ? 'btnPrimary' : ''}`} onClick={() => setFarmerMode('login')}>Login</button>
            <button className={`btn ${farmerMode === 'register' ? 'btnPrimary' : ''}`} onClick={() => setFarmerMode('register')}>Register</button>
          </div>

          {farmerMode === 'login' ? (
            <div>
              <div className="formGroup">
                <label className="formLabel">Username (mobile number)</label>
                <input
                  type="text"
                  className="formInput"
                  value={farmerForm.username}
                  onChange={(e) => handleFarmerInput('username', e.target.value)}
                  placeholder="e.g. 9876543210"
                />
                {farmerFormErrors.username && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.username}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Password</label>
                <input
                  type="password"
                  className="formInput"
                  value={farmerForm.password}
                  onChange={(e) => handleFarmerInput('password', e.target.value)}
                  placeholder="Enter your password"
                />
                {farmerFormErrors.password && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.password}</div>}
              </div>
              <div style={{display: 'flex', gap: '8px', marginTop: '10px'}}>
                <button className="btn btnSuccess" onClick={handleFarmerLogin}>Login</button>
                <button className="btn" onClick={() => { setFarmerMode('register'); setFarmerFormErrors({}); }}>Go to Register</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="formGroup">
                <label className="formLabel">Full Name</label>
                <input
                  type="text"
                  className="formInput"
                  value={farmerForm.fullname}
                  onChange={(e) => handleFarmerInput('fullname', e.target.value)}
                  placeholder="Your full name"
                />
                {farmerFormErrors.fullname && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.fullname}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Password</label>
                <input
                  type="password"
                  className="formInput"
                  value={farmerForm.password}
                  onChange={(e) => handleFarmerInput('password', e.target.value)}
                  placeholder="Create a password (min 6 chars)"
                />
                {farmerFormErrors.password && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.password}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Confirm Password</label>
                <input
                  type="password"
                  className="formInput"
                  value={farmerForm.confirmPassword}
                  onChange={(e) => handleFarmerInput('confirmPassword', e.target.value)}
                  placeholder="Repeat your password"
                />
                {farmerFormErrors.confirmPassword && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.confirmPassword}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Location</label>
                <input
                  type="text"
                  className="formInput"
                  value={farmerForm.location}
                  onChange={(e) => handleFarmerInput('location', e.target.value)}
                  placeholder="Village, District, State"
                />
                {farmerFormErrors.location && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.location}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Mobile Number</label>
                <input
                  type="tel"
                  className="formInput"
                  value={farmerForm.contact}
                  onChange={(e) => handleFarmerInput('contact', e.target.value)}
                  placeholder="10-digit mobile number"
                />
                {farmerFormErrors.contact && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.contact}</div>}
              </div>
              <div style={{display: 'flex', gap: '8px', marginTop: '10px'}}>
                <button className="btn btnSuccess" onClick={handleFarmerRegister}>Register</button>
                <button className="btn" onClick={() => { setFarmerMode('login'); setFarmerFormErrors({}); }}>Back to Login</button>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  
  if (currentPage === 'farmer-dashboard') {
    const currentFarmerId = (currentUser?.fullname || currentUser?.name || currentUser?.username);
    const farmerProducts = products.filter(p => p.farmer === currentFarmerId);
    const farmerOrders = orders.filter(o => 
      products.some(p => p.id === o.productId && p.farmer === currentFarmerId)
    );

    return (
      <div className="body blurredPage" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Farmer Dashboard - {currentUser?.fullname || currentUser?.name || currentUser?.username}</h1>
            <button className="btn" onClick={() => { setCurrentPage('landing'); setCurrentUser(null); }}>Logout</button>
          </div>

          {/* Notifications for the logged-in farmer */}
          <div style={{marginTop: '12px', marginBottom: '12px'}}>
            {(() => {
              const myNotifs = notifications.filter(n => n.farmerId === currentFarmerId);
              const unread = myNotifs.filter(n => !n.read).length;
              return (
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                    <div style={{fontSize: '0.95rem'}}>{unread > 0 ? `🔔 ${unread} new notification${unread > 1 ? 's' : ''}` : 'No new notifications'}</div>
                    {myNotifs.length > 0 && (
                      <div>
                        <button className="btn" onClick={() => {
                          setNotifications(prev => prev.map(n => n.farmerId === currentFarmerId ? { ...n, read: true } : n));
                          pushToast('Marked notifications as read', 'info');
                        }}>Mark all read</button>
                      </div>
                    )}
                  </div>
                  <div>
                    {myNotifs.slice(0,6).map(n => (
                      <div key={n.id} style={{background: n.read ? '#f8f9fa' : '#fff7e6', padding: '8px', borderRadius: '6px', marginBottom: '6px'}}>
                        <div style={{fontSize: '0.95rem'}}>{n.message}</div>
                        <div style={{fontSize: '0.8rem', color: '#666'}}>{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                    {myNotifs.length === 0 && (
                      <div style={{color: '#666'}}>You have no notifications.</div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="tabContainer">
            {['products', 'orders', 'value-addition', 'financial'].map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'tabActive' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {activeTab === 'products' && (
            <div>
              <button 
                className="btn btnSecondary"
                style={{marginBottom: '20px'}}
                onClick={() => setActiveModal('add-product')}
              >
                + Add New Product
              </button>
              <div className="dashboardGrid">
                {farmerProducts.length === 0 ? (
                  <p>No products listed yet. Click "Add New Product" to get started!</p>
                ) : (
                  farmerProducts.map((p) => (
                    <div key={p.id} className="card">
                      <img
                        src={p.image || 'https://via.placeholder.com/300x200'}
                        alt={p.name}
                        className="productImage"
                        data-seed={p.id}
                        onError={(e) => handleImgError(e)}
                      />
                        <h3>{p.name}</h3>
                      <p><strong>Quantity:</strong> {p.quantity} kg</p>
                      <p><strong>Price:</strong> ₹{p.price}/kg</p>
                      <p><strong>Status:</strong> <span className={`statusBadge ${p.status === 'approved' ? 'statusApproved' : 'statusPending'}`}>{p.status.toUpperCase()}</span></p>
                      {p.quality && <p><strong>Quality:</strong> {getQualityLabel(p.quality)} ({p.quality}/10)</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2>Your Orders</h2>
              {farmerOrders.length === 0 ? (
                <p>No orders yet.</p>
              ) : (
                farmerOrders.map(o => {
                  const product = products.find(p => p.id === o.productId);
                  return (
                    <div key={o.id} className="productCard">
                      <h3>Order #{o.id}</h3>
                      <p><strong>Product:</strong> {product.name}</p>
                      <p><strong>Quantity:</strong> {o.quantity} kg</p>
                      <p><strong>Amount:</strong> ₹{o.total}</p>
                      <p><strong>Buyer:</strong> {o.buyerName}</p>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'value-addition' && (
            <div>
              <h2>🎯 Value Addition Services</h2>
              <p style={{marginBottom: '20px'}}>Transform your raw materials into high-value products!</p>
              <div className="dashboardGrid">
                {[
                  { name: 'Rice to Rice Flour', input: 'Rice', output: 'Rice Flour', increase: '40%', time: '2 days' },
                  { name: 'Turmeric to Powder', input: 'Fresh Turmeric', output: 'Turmeric Powder', increase: '60%', time: '5 days' }
                ].map((s, i) => (
                  <div key={i} className="card">
                    <h3>{s.name}</h3>
                    <p><strong>Input:</strong> {s.input}</p>
                    <p><strong>Output:</strong> {s.output}</p>
                    <p style={{color: '#28a745', fontWeight: 'bold'}}>📈 Value Increase: {s.increase}</p>
                    <p><strong>Processing Time:</strong> {s.time}</p>
                    <button
                      className="btn btnSecondary"
                      onClick={() => {
                        const farmerId = currentUser?.username || currentUser?.fullname || currentUser?.name || 'unknown';
                        const newReq = {
                          id: Date.now() + Math.floor(Math.random() * 1000),
                          serviceName: s.name,
                          input: s.input,
                          output: s.output,
                          increase: s.increase,
                          time: s.time,
                          farmerId,
                          farmerName: currentUser?.fullname || currentUser?.name || farmerId,
                          status: 'pending',
                          createdAt: new Date().toISOString()
                        };
                        setValueRequests(prev => [newReq, ...prev]);
                        pushToast('Request submitted — an admin will review and approve it shortly.', 'success');
                      }}
                    >
                      Request Service
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div>
              <h2>💰 Financial Support Options</h2>
              <div className="card">
                <h3>Instant Cash Option</h3>
                <p>Need immediate funds? Sell your products at current market rates for instant payment.</p>
                <ul style={{margin: '15px 0', paddingLeft: '20px'}}>
                  <li>Get 100% market value immediately</li>
                  <li>No waiting period</li>
                  <li>Quick transaction process</li>
                </ul>
                <div style={{marginTop: '12px'}}>
                  <button className="btn btnSecondary" onClick={() => {
                    const farmerId = currentUser?.username || currentUser?.fullname || currentUser?.name || 'unknown';
                    const newReq = {
                      id: Date.now() + Math.floor(Math.random() * 1000),
                      serviceType: 'financial',
                      serviceName: 'Instant Cash Option',
                      details: 'Request for immediate cash against listed products',
                      farmerId,
                      farmerName: currentUser?.fullname || currentUser?.name || farmerId,
                      status: 'pending',
                      createdAt: new Date().toISOString()
                    };
                    setValueRequests(prev => [newReq, ...prev]);
                    pushToast('Financial support request submitted — admin will review it shortly.', 'success');
                  }}>Request Instant Cash</button>
                </div>
              </div>
              <div className="card">
                <h3>Profit Sharing Model</h3>
                <p>List your products and earn market value + profit share after processing.</p>
                <ul style={{margin: '15px 0', paddingLeft: '20px'}}>
                  <li>Receive full market value</li>
                  <li>Additional 15-25% profit share</li>
                  <li>Payment after quality check and sale</li>
                </ul>
                <div style={{marginTop: '12px'}}>
                  <button className="btn btnSecondary" onClick={() => {
                    const farmerId = currentUser?.username || currentUser?.fullname || currentUser?.name || 'unknown';
                    const newReq = {
                      id: Date.now() + Math.floor(Math.random() * 1000),
                      serviceType: 'financial',
                      serviceName: 'Profit Sharing Model',
                      details: 'Request to enroll products into profit sharing model',
                      farmerId,
                      farmerName: currentUser?.fullname || currentUser?.name || farmerId,
                      status: 'pending',
                      createdAt: new Date().toISOString()
                    };
                    setValueRequests(prev => [newReq, ...prev]);
                    pushToast('Profit-sharing request submitted — admin will review it shortly.', 'success');
                  }}>Request Profit Sharing</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {activeModal === 'add-product' && (
          <div className="modal">
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <span 
                style={{float: 'right', fontSize: '1.5rem', cursor: 'pointer', color: '#999'}}
                onClick={() => setActiveModal(null)}
              >
                &times;
              </span>
              <h2>Add New Product</h2>
              <div className="formGroup">
                <label className="formLabel">Product Name</label>
                <input type="text" id="new-product-name" placeholder="e.g., Organic Rice" className="formInput" />
              </div>
              <div className="formGroup">
                <label className="formLabel">Quantity (kg)</label>
                <input type="number" id="new-product-quantity" placeholder="Available quantity" className="formInput" />
              </div>
              <div className="formGroup">
                <label className="formLabel">Price (₹/kg)</label>
                <input type="number" id="new-product-price" placeholder="Desired selling price" className="formInput" />
              </div>
              <div className="formGroup">
                <label className="formLabel">Image URL</label>
                <input type="text" id="new-product-image" placeholder="https://example.com/image.jpg" className="formInput" />
              </div>
              <div className="formGroup">
                <label className="formLabel">Location</label>
                <input type="text" id="new-product-location" placeholder="Farm address" className="formInput" />
              </div>
              <button 
                className="btn"
                onClick={() => {
                  const rawImage = document.getElementById('new-product-image').value || '';
                  const newProduct = {
                    id: Date.now(),
                    name: document.getElementById('new-product-name').value,
                    quantity: parseInt(document.getElementById('new-product-quantity').value),
                    price: parseInt(document.getElementById('new-product-price').value),
                    image: rawImage.trim() || 'https://via.placeholder.com/300x200',
                    location: document.getElementById('new-product-location').value,
                    farmer: (currentUser?.fullname || currentUser?.name || currentUser?.username),
                    status: 'pending',
                    verified: false,
                    quality: null
                  };
                  setProducts([...products, newProduct]);
                  setActiveModal(null);
                  pushToast('Product added successfully!', 'success');
                }}
              >
                Submit Product
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === 'marketplace') {
    const marketProducts = products.filter(p => p.inMarketplace);

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container market-compact">
          {!upiBannerHidden && (
            <div style={{
              background:'#f8d7da',
              color:'#721c24',
              border:'1px solid #f5c6cb',
              padding:'10px 12px',
              borderRadius:8,
              marginBottom:10,
              display:'flex',
              alignItems:'center',
              justifyContent:'space-between'
            }}>
              <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                <span aria-hidden="true">⚠️</span>
                <span>UPI payments are disabled. Please use Cash on Delivery.</span>
              </div>
              <button
                className="btn"
                onClick={() => {
                  try { localStorage.setItem('upi_banner_hidden', '1'); } catch {}
                  setUpiBannerHidden(true);
                }}
                aria-label="Hide UPI payment notice"
              >
                Hide
              </button>
            </div>
          )}
          <div className="header">
            <h1 style={{color: '#667eea'}}>🛒 Marketplace</h1>
            <div>
              {upiBannerHidden && (
                <button
                  className="btn btnSecondary"
                  style={{marginRight:'10px'}}
                  onClick={() => {
                    try { localStorage.removeItem('upi_banner_hidden'); } catch {}
                    setUpiBannerHidden(false);
                  }}
                  title="Show UPI payment notice again"
                >
                  Show UPI Notice
                </button>
              )}
              <button
                className="btn"
                style={{marginRight: '10px'}}
                onClick={() => setCurrentPage('buyer-orders')}
              >
                📦 My Orders
              </button>
              
              <button 
                className="btn btnSecondary"
                style={{marginRight: '10px'}}
                onClick={() => setActiveModal('cart')}
              >
                🛒 Cart ({cartCount})
              </button>
              <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
            </div>
          </div>
          <div className="marketplaceGrid">
              {marketProducts.length === 0 ? (
              <p style={{textAlign: 'center', padding: '40px'}}>No products available yet. Check back soon!</p>
            ) : (
              marketProducts.map((p) => (
                <div key={p.id} className="productCard" style={{overflow: 'hidden'}}>
                    <img
                      src={p.image || 'https://via.placeholder.com/300x200'}
                      alt={p.name}
                      className="productImage"
                      data-seed={p.id}
                      onError={(e) => handleImgError(e)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(p);
                        setActiveModal('image-view');
                      }}
                      style={{cursor: 'pointer'}}
                    />
                  <div style={{padding: '15px'}}>
                    <h3>{p.name}</h3>
                    <p style={{color: '#666', margin: '10px 0'}}>By {p.farmer}</p>
                    <div style={{color: '#ffa500', fontSize: '1.2rem'}}>{getQualityLabel(p.quality)}</div>
                    { (p.quantity || 0) > 0 ? (
                      <p style={{margin: '10px 0'}}><strong>Available:</strong> {p.quantity} kg</p>
                    ) : (
                      <p style={{margin: '10px 0', color: '#dc3545', fontWeight: '700'}}>Out of stock</p>
                    )}
                    <div style={{fontSize: '1.1rem', marginTop: '8px'}}>
                      {p.discountedPrice ? (
                        <div>
                          <span style={{textDecoration: 'line-through', color: '#999', marginRight: '8px'}}>₹{p.price}/kg</span>
                          <span style={{fontSize: '1.4rem', color: '#dc3545', fontWeight: '700'}}>₹{p.discountedPrice}/kg</span>
                        </div>
                      ) : (
                        <span style={{fontSize: '1.5rem', color: '#667eea', fontWeight: 'bold'}}>₹{p.price}/kg</span>
                      )}
                    </div>
                    <p style={{fontSize: '0.9rem', color: '#666'}}><strong>Location:</strong> {p.location}</p>
                    <button 
                      className="btn"
                      style={{width: '100%', marginTop: '10px'}}
                      onClick={() => addToCart(p.id)}
                      disabled={(p.quantity || 0) <= 0}
                    >
                      {(p.quantity || 0) <= 0 ? 'Out of stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {activeModal === 'cart' && (
          <div className="modal">
            <div className="modalContent cartModal" onClick={(e) => e.stopPropagation()}>
              <span 
                style={{float: 'right', fontSize: '1.5rem', cursor: 'pointer', color: '#999'}}
                onClick={() => setActiveModal(null)}
              >
                &times;
              </span>
              <h2>Shopping Cart</h2>
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
                  {cart.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div key={item.productId} style={{display: 'flex', gap: '15px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '10px', alignItems: 'center'}}>
                        <img
                          src={product.image || 'https://via.placeholder.com/80'}
                          alt={product.name}
                          style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px'}}
                          onError={(e) => handleImgError(e, true)}
                        />
                        <div style={{flex: 1}}>
                          <h3>{product.name}</h3>
                          <p>₹{item.price}/kg</p>
                          <div style={{marginTop: '10px'}}>
                            <button className="btn" style={{padding: '5px 10px', fontSize: '0.85rem'}} onClick={() => updateCartQuantity(item.productId, -1)}>-</button>
                            <span style={{margin: '0 10px'}}>{item.quantity} kg</span>
                            <button
                              className="btn"
                              style={{padding: '5px 10px', fontSize: '0.85rem'}}
                              onClick={() => updateCartQuantity(item.productId, 1)}
                              disabled={(product.quantity || 0) <= item.quantity}
                              title={(product.quantity || 0) <= item.quantity ? 'Max available reached' : ''}
                            >
                              +
                            </button>
                            {(product.quantity || 0) <= item.quantity && (
                              <span style={{marginLeft: 8, fontSize: '0.85rem', color: '#666'}}>Max available reached</span>
                            )}
                          </div>
                        </div>
                        <div style={{textAlign: 'right'}}>
                          <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>₹{(item.quantity * (item.price || 0)).toFixed(2)}</p>
                          <button 
                            className="btn btnDanger"
                            style={{padding: '5px 10px', fontSize: '0.85rem', marginTop: '10px'}}
                            onClick={() => removeFromCart(item.productId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{background: '#667eea', color: 'white', padding: '20px', borderRadius: '10px', marginTop: '20px'}}>
                    <h3>Total: ₹{cartTotal}</h3>
                    {/* Checkout note removed */}
                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                      <button
                        className="btn"
                        style={{flex: '1 1 220px', marginTop: '10px'}}
                        onClick={() => {
                          if (cart.length === 0) { pushToast('Your cart is already empty', 'info'); return; }
                          setCart([]);
                          pushToast('Cart cleared', 'info');
                        }}
                      >
                        Clear Cart
                      </button>
                    <button 
                      className="btn btnSuccess"
                      style={{flex: '2 1 320px', marginTop: '10px'}}
                      onClick={() => {
                        if (cart.length === 0) {
                          pushToast('Your cart is empty', 'error');
                          return;
                        }
                        setActiveModal('checkout');
                      }}
                    >
                      Proceed to Checkout
                    </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeModal === 'checkout' && (
          <div className="modal">
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <span 
                style={{float: 'right', fontSize: '1.5rem', cursor: 'pointer', color: '#999'}}
                onClick={() => setActiveModal(null)}
              >
                &times;
              </span>
              <h2>Checkout</h2>
              <p>Enter delivery details and payment method.</p>
              <div className="formGroup">
                <label className="formLabel">Full Name</label>
                <input type="text" id="checkout-name" className="formInput" defaultValue={currentUser?.fullname || currentUser?.name || currentUser?.username || ''} />
              </div>
              <div className="formGroup">
                <label className="formLabel">Delivery Address</label>
                <textarea id="checkout-address" className="formInput" rows={3} defaultValue={currentUser?.location || ''} />
              </div>
              <div className="formGroup">
                <label className="formLabel">Mobile Number</label>
                <input type="tel" id="checkout-mobile" className="formInput" defaultValue={currentUser?.contact || ''} placeholder="10 digit mobile number" />
              </div>
              <div className="formGroup">
                <label className="formLabel">Payment Method</label>
                <select id="checkout-payment" className="formInput" defaultValue="cod">
                  <option value="upi" disabled={!isPaymentReady}>UPI {isPaymentReady ? '' : '(disabled)'}</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
                {/* Payment configuration note removed */}
              </div>
              <button
                className="btn btnSuccess"
                onClick={() => {
                  const name = (document.getElementById('checkout-name').value || '').trim();
                  const address = (document.getElementById('checkout-address').value || '').trim();
                  const mobile = (document.getElementById('checkout-mobile').value || '').trim();
                  const payment = (document.getElementById('checkout-payment').value || 'cod');

                  if (!name || !address || !mobile) {
                    pushToast('Please fill name, address and mobile number', 'error');
                    return;
                  }
                  if (!/^[0-9]{10}$/.test(mobile)) {
                    pushToast('Please enter a valid 10-digit mobile number', 'error');
                    return;
                  }
                  if (payment === 'upi') {
                    if (!isPaymentReady) {
                      pushToast('UPI unavailable: set VITE_RAZORPAY_KEY_ID or use COD.', 'error');
                      return;
                    }
                    openRazorpayPayment({
                      amount: cartTotal,
                      name,
                      contact: mobile,
                      notes: { purpose: 'Cart payment' },
                      onSuccess: () => {
                        const deliveryPersons = ['del-1', 'del-2', 'del-3'];
                        const deliveryNames = ['Raju (del-1)', 'Lakshmi (del-2)', 'Kumar (del-3)'];
                        
                        const paidOrders = cart.map(item => {
                          const price = item.price || 0;
                          const randomDeliveryIndex = Math.floor(Math.random() * deliveryPersons.length);
                          return {
                            id: Date.now() + Math.floor(Math.random() * 1000) + item.productId,
                            productId: item.productId,
                            quantity: item.quantity,
                            total: (item.quantity || 0) * price,
                            buyerName: name,
                            buyerId: (currentUser?.username || currentUser?.contact || name),
                            address,
                            contact: mobile,
                            paymentMethod: 'upi',
                            paymentStatus: 'paid',
                            paymentAt: new Date().toISOString(),
                            deliveryPersonId: deliveryPersons[randomDeliveryIndex],
                            deliveryPersonName: deliveryNames[randomDeliveryIndex],
                            status: 'processing',
                            estimatedDelivery: generateETA(),
                            orderDate: new Date().toISOString(),
                            rating: null,
                            review: null
                          };
                        });
                        setOrders(prev => [...prev, ...paidOrders]);
                        setLastPlacedOrderIds(paidOrders.map(o => o.id));
                        // Record purchased products for buyer (UPI)
                        setPurchasedProducts(prev => {
                          const list = [...prev];
                          cart.forEach(item => {
                            const p = products.find(pp => pp.id === item.productId) || {};
                            list.push({
                              id: Date.now() + Math.floor(Math.random() * 1000) + item.productId,
                              productId: item.productId,
                              name: p.name,
                              image: p.image,
                              quantity: item.quantity,
                              price: item.price,
                              buyerId: (currentUser?.username || currentUser?.contact || name),
                              purchasedAt: new Date().toISOString()
                            });
                          });
                          return list;
                        });
                        setCart([]);
                        setActiveModal(null);
                        setCurrentUser(prev => ({ ...(prev || {}), name, contact: mobile, role: 'buyer' }));
                        setCurrentPage('buyer-orders');
                        pushToast('Payment successful. Order placed!', 'success');
                      }
                    });
                    return;
                  }

                  // Cash on Delivery path
                  const deliveryPersons = ['del-1', 'del-2', 'del-3'];
                  const deliveryNames = ['Raju (del-1)', 'Lakshmi (del-2)', 'Kumar (del-3)'];
                  
                  const newOrders = cart.map(item => {
                    const price = item.price || 0;
                    const randomDeliveryIndex = Math.floor(Math.random() * deliveryPersons.length);
                    return {
                      id: Date.now() + Math.floor(Math.random() * 1000) + item.productId,
                      productId: item.productId,
                      quantity: item.quantity,
                      total: (item.quantity || 0) * price,
                      buyerName: name,
                      buyerId: (currentUser?.username || currentUser?.contact || name),
                      address,
                      contact: mobile,
                      paymentMethod: 'cod',
                      paymentStatus: 'pending',
                      deliveryPersonId: deliveryPersons[randomDeliveryIndex],
                      deliveryPersonName: deliveryNames[randomDeliveryIndex],
                      status: 'processing',
                      estimatedDelivery: generateETA(),
                      orderDate: new Date().toISOString(),
                      rating: null,
                      review: null
                    };
                  });

                  setOrders(prev => [...prev, ...newOrders]);
                  setLastPlacedOrderIds(newOrders.map(o => o.id));
                  // Record purchased products for buyer (COD)
                  setPurchasedProducts(prev => {
                    const list = [...prev];
                    cart.forEach(item => {
                      const p = products.find(pp => pp.id === item.productId) || {};
                      list.push({
                        id: Date.now() + Math.floor(Math.random() * 1000) + item.productId,
                        productId: item.productId,
                        name: p.name,
                        image: p.image,
                        quantity: item.quantity,
                        price: item.price,
                        buyerId: (currentUser?.username || currentUser?.contact || name),
                        purchasedAt: new Date().toISOString()
                      });
                    });
                    return list;
                  });
                  setCart([]);
                  setActiveModal(null);
                  setCurrentUser(prev => ({ ...(prev || {}), name, contact: mobile, role: 'buyer' }));
                  setCurrentPage('buyer-orders');
                  pushToast('Order placed successfully! We will process your delivery shortly.', 'success');
                }}
              >
                Confirm Order
              </button>
            </div>
          </div>
        )}

        {activeModal === 'image-view' && selectedProduct && (
          <div className="modal">
            <div className="modalContent" onClick={(e) => e.stopPropagation()} style={{maxWidth: '900px'}}>
              <span 
                style={{float: 'right', fontSize: '1.5rem', cursor: 'pointer', color: '#999'}}
                onClick={() => { setActiveModal(null); setSelectedProduct(null); }}
              >
                &times;
              </span>
              <div style={{display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap'}}>
                <div style={{flex: '1 1 480px'}}>
                  <img
                    src={selectedProduct.image || 'https://via.placeholder.com/800x600'}
                    alt={selectedProduct.name}
                    style={{width: '100%', height: 'auto', borderRadius: '8px'}}
                    onError={(e) => handleImgError(e)}
                  />
                </div>
                <div style={{flex: '1 1 300px'}}>
                  <h2>{selectedProduct.name}</h2>
                  <p style={{color: '#666'}}><strong>Farmer:</strong> {selectedProduct.farmer}</p>
                  <p style={{color: '#666'}}><strong>Price:</strong> ₹{selectedProduct.price}/kg</p>
                  <p style={{color: '#666'}}><strong>Location:</strong> {selectedProduct.location}</p>
                </div>
              </div>

              <hr style={{margin: '20px 0'}} />
              <h3>Reviews</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {(reviews[selectedProduct.id] || []).map(r => (
                  <div key={r.id} style={{display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f9fa', padding: '10px', borderRadius: '8px'}}>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: 700}}>{r.author}</div>
                      <div style={{color: '#333'}}>{r.text}</div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <div style={{fontSize: '0.9rem'}}>{r.likes}</div>
                      <button
                        className="btn"
                        style={{padding: '6px 10px', fontSize: '0.9rem'}}
                        onClick={() => {
                          // toggle like
                          const liked = likedReviews.includes(r.id);
                          setReviews(prev => {
                            const copy = { ...prev };
                            copy[selectedProduct.id] = copy[selectedProduct.id].map(rv => rv.id === r.id ? { ...rv, likes: rv.likes + (liked ? -1 : 1) } : rv);
                            return copy;
                          });
                          setLikedReviews(prev => {
                            if (liked) return prev.filter(id => id !== r.id);
                            return [...prev, r.id];
                          });
                        }}
                      >
                        {likedReviews.includes(r.id) ? '♥ Liked' : '♡ Like'}
                      </button>
                    </div>
                  </div>
                ))}
                {(reviews[selectedProduct.id] || []).length === 0 && (
                  <p>No reviews yet for this product.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Training Page
  if (currentPage === 'training') {
    const courses = {
      agricultural: [
        { title: 'Organic Farming Basics', duration: '45 min', level: 'Beginner', videoUrl: 'https://www.youtube.com/results?search_query=organic+farming+basics' },
        { title: 'Soil Health Management', duration: '60 min', level: 'Intermediate', videoUrl: 'https://www.youtube.com/results?search_query=soil+health+management' }
      ],
      financial: [
        { title: 'Basic Accounting for Farmers', duration: '55 min', level: 'Beginner', videoUrl: 'https://www.youtube.com/results?search_query=basic+accounting+for+farmers' },
        { title: 'Loan Application Process', duration: '35 min', level: 'Beginner', videoUrl: 'https://www.youtube.com/results?search_query=loan+application+process+for+farmers' }
      ],
      'value-addition': [
        { title: 'Rice Processing Techniques', duration: '60 min', level: 'Intermediate', videoUrl: 'https://www.youtube.com/results?search_query=rice+processing+techniques' },
        { title: 'Making Spice Powders', duration: '45 min', level: 'Beginner', videoUrl: 'https://www.youtube.com/results?search_query=making+spice+powders' }
      ],
      digital: [
        { title: 'Online Marketing Basics', duration: '50 min', level: 'Beginner', videoUrl: 'https://www.youtube.com/results?search_query=online+marketing+for+farmers' },
        { title: 'Social Media for Farmers', duration: '45 min', level: 'Beginner', videoUrl: 'https://www.youtube.com/results?search_query=social+media+for+farmers' }
      ]
    };

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container buyerOrders">
          <div className="header">
            <h1 style={{color: '#667eea'}}>📚 Training & Development Center</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>

          <div className="tabContainer">
            {['agricultural', 'financial', 'value-addition', 'digital'].map(tab => (
              <button
                key={tab}
                className={`tab ${activeTrainingTab === tab ? 'tabActive' : ''}`}
                onClick={() => setActiveTrainingTab(tab)}
              >
                {tab.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="dashboardGrid">
            {courses[activeTrainingTab]?.map((c, i) => (
              <div 
                key={i} 
                className="trainingCard"
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => {
                  if (c.videoUrl) {
                    window.open(c.videoUrl, '_blank', 'noopener');
                  } else {
                    pushToast('No video available for this course', 'info');
                  }
                }}
                style={{cursor: c.videoUrl ? 'pointer' : 'default'}}
              >
                <h3>{c.title}</h3>
                <p>⏱️ Duration: {c.duration}</p>
                <p>📊 Level: {c.level}</p>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'10px'}}>
                  <span style={{color:'#555'}}>Click to watch →</span>
                  <button
                    className="btn btnPrimary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (c.videoUrl) {
                        window.open(c.videoUrl, '_blank', 'noopener');
                      } else {
                        pushToast('No video available for this course', 'info');
                      }
                    }}
                  >
                    Watch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Buyer Orders
  if (currentPage === 'buyer-orders') {
              {lastPlacedOrderIds && lastPlacedOrderIds.length > 0 && (
                <div style={{background:'#8cd69cff', color:'#1a73e8', padding:'8px 12px', borderRadius:8, marginBottom:10}}>
                  Order placed: {lastPlacedOrderIds.map(id => `#${id}`).join(', ')}
                </div>
              )}
    const currentBuyerName = (currentUser?.fullname || currentUser?.name || currentUser?.username || 'Guest');
    const currentBuyerId = (currentUser?.username || currentUser?.contact || currentBuyerName);
    // Include orders by buyerId or fallback to buyerName to avoid identity mismatch
    const myOrdersRaw = orders.filter(o => (
      (o.buyerId ? o.buyerId === currentBuyerId : false) || (o.buyerName === currentBuyerName)
    ));
    // Sort to always show buyer's recent orders on top
    const myOrders = [...myOrdersRaw].sort((a,b) => {
      const ta = a.orderDate ? new Date(a.orderDate).getTime() : 0;
      const tb = b.orderDate ? new Date(b.orderDate).getTime() : 0;
      return tb - ta;
    });
          {highlightId && (() => {
            const found = myOrders.find(o => o.id === highlightId);
            if (!found) return null;
            const product = products.find(p => p.id === found.productId) || {};
            return (
              <div className="productCard" style={{border:'2px solid #667eea', marginBottom: '14px'}}>
                <h3>Found Order #{found.id}</h3>
                <div style={{display:'flex', gap:'12px'}}>
                  <img
                    src={product.image || 'https://via.placeholder.com/300x200'}
                    alt={product.name}
                    className="productImage"
                    data-seed={product.id}
                    onError={(e) => handleImgError(e)}
                    style={{maxWidth:'220px'}}
                  />
                  <div style={{flex:1}}>
                    <p><strong>Product:</strong> {product.name}</p>
                    <p><strong>Quantity:</strong> {found.quantity} kg</p>
                    <p><strong>Amount:</strong> ₹{found.total}</p>
                    <p><strong>Status:</strong> {(found.status || 'processing').toUpperCase()}</p>
                    {found.estimatedDelivery && <p><strong>ETA:</strong> {found.estimatedDelivery}</p>}
                    <button className="btn" onClick={() => {
                      const el = document.getElementById(`order-${found.id}`);
                      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
                    }}>Scroll to Order</button>
                  </div>
                </div>
              </div>
            );
          })()}


    return (
      <div className="body blurredPage" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container">
          {/* Buyer orders payment banner removed */}
          <div className="header">
            <h1 style={{color: '#667eea'}}>📦 My Orders</h1>
            <div>
              <button className="btn" onClick={() => setCurrentPage('marketplace')}>← Back to Marketplace</button>
            </div>
          </div>

          {/* Buyer Orders search removed as requested */}

          {lastPlacedOrderIds && lastPlacedOrderIds.length > 0 && (
            <div style={{background:'#e8f0fe', color:'#1a73e8', padding:'8px 12px', borderRadius:8, marginBottom:10}}>
              Order placed: {lastPlacedOrderIds.map(id => `#${id}`).join(', ')}
            </div>
          )}

          {(() => {
            const unpaid = myOrders.filter(o => (o.paymentStatus || 'pending') !== 'paid');
            const paid = myOrders.filter(o => (o.paymentStatus || 'pending') === 'paid');
            const unpaidTotal = unpaid.reduce((s,o) => s + (o.total || 0), 0);
            const paidTotal = paid.reduce((s,o) => s + (o.total || 0), 0);
            return (
              <div style={{display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'12px'}}>
                <div style={{background:'#fff7e6', color:'#8a5a00', padding:'8px 12px', borderRadius:8}}>
                  Unpaid: {unpaid.length} orders — ₹{unpaidTotal}
                </div>
                <div style={{background:'#e6ffed', color:'#1f7a1f', padding:'8px 12px', borderRadius:8}}>
                  Paid: {paid.length} orders — ₹{paidTotal}
                </div>
              </div>
            );
          })()}

          {(() => {
            const mine = (purchasedProducts || []).filter(pp => pp.buyerId === currentBuyerId);
            if (mine.length === 0) return null;
            const recent = [...mine].sort((a,b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()).slice(0, 6);
            return (
              <div className="container compact" style={{marginTop:'6px', marginBottom:'14px', maxWidth:'720px', marginLeft:'auto', marginRight:'auto'}}>
                <h3 style={{color:'#667eea'}}>🛍️ Recently Purchased</h3>
                <div className="marketplaceGrid">
                  {recent.map(r => (
                    <div key={r.id} className="productCard" style={{padding:'12px', maxWidth:'260px'}}>
                      <img
                        src={r.image || 'https://via.placeholder.com/160'}
                        alt={r.name}
                        className="productImage"
                        onError={(e) => handleImgError(e, true)}
                        style={{maxWidth:'160px'}}
                      />
                      <div style={{padding:'10px'}}>
                        <h4>{r.name}</h4>
                        <p>Qty: {r.quantity} kg</p>
                        <p>Price: ₹{r.price}/kg</p>
                        <p style={{fontSize:'0.85rem', color:'#666'}}>Purchased: {new Date(r.purchasedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {myOrders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="ordersList">
              <h3>Active Orders</h3>
              {(myOrders.filter(o => o.status !== 'completed')).length === 0 ? (
                <p>No active orders.</p>
              ) : (
                myOrders.filter(o => o.status !== 'completed').map(o => {
                  const product = products.find(p => p.id === o.productId) || {};
                  return (
                    <div id={`order-${o.id}`} key={o.id} className="productCard" style={{border: (highlightId === o.id ? '2px solid #667eea' : undefined)}}>
                      <img
                        src={product.image || 'https://via.placeholder.com/300x200'}
                        alt={product.name}
                        className="productImage"
                        data-seed={product.id}
                        onError={(e) => handleImgError(e)}
                      />
                      <h3>Order #{o.id}</h3>
                      <p><strong>Product:</strong> {product.name}</p>
                      <p><strong>Quantity:</strong> {o.quantity} kg</p>
                      <p><strong>Amount:</strong> ₹{o.total}</p>
                      {product.farmer && <p><strong>Farmer:</strong> {product.farmer}</p>}
                      {product.location && <p><strong>Origin:</strong> {product.location}</p>}
                      <p><strong>Status:</strong> <span className={`statusBadge ${o.status === 'processing' ? 'statusPending' : o.status === 'shipped' ? 'statusApproved' : ''}`}>{o.status.toUpperCase()}</span></p>
                          {o.estimatedDelivery && <p><strong>ETA:</strong> {o.estimatedDelivery}</p>}
                          <p><strong>Payment:</strong> <span className={`statusBadge ${o.paymentStatus === 'paid' ? 'statusPaid' : 'statusPending'}`}>{(o.paymentStatus || 'pending').toUpperCase()}</span> {o.paymentMethod ? `(${o.paymentMethod.toUpperCase()})` : ''}</p>
                          {o.paymentStatus !== 'paid' && (
                            <div style={{marginTop: '8px'}}>
                              <button className="btn btnPrimary" disabled={!isPaymentReady} title={!isPaymentReady ? 'Configure Razorpay key to enable UPI payments' : ''} onClick={() => {
                                if (!isPaymentReady) { pushToast('UPI unavailable: set VITE_RAZORPAY_KEY_ID.', 'error'); return; }
                                openRazorpayPayment({
                                  amount: o.total || 0,
                                  name: currentBuyerName,
                                  contact: currentUser?.contact || o.contact,
                                  notes: { orderId: String(o.id) },
                                  onSuccess: () => {
                                    setOrders(prev => prev.map(ord => ord.id === o.id ? { ...ord, paymentStatus: 'paid', paymentAt: new Date().toISOString() } : ord));
                                    pushToast('Payment successful.', 'success');
                                  }
                                });
                              }}>
                                Pay Now
                              </button>
                            </div>
                          )}
                    </div>
                  );
                })
              )}

              <h3 style={{marginTop: '20px'}}>Past Orders</h3>
              {(myOrders.filter(o => o.status === 'completed')).length === 0 ? (
                <p>No past orders.</p>
              ) : (
                myOrders.filter(o => o.status === 'completed').map(o => {
                  const product = products.find(p => p.id === o.productId) || {};
                  return (
                    <div id={`order-${o.id}`} key={o.id} className="productCard" style={{border: (highlightId === o.id ? '2px solid #667eea' : undefined)}}>
                      <img
                        src={product.image || 'https://via.placeholder.com/300x200'}
                        alt={product.name}
                        className="productImage"
                        data-seed={product.id}
                        onError={(e) => handleImgError(e)}
                      />
                      <h3>Order #{o.id}</h3>
                      <p><strong>Product:</strong> {product.name}</p>
                      <p><strong>Quantity:</strong> {o.quantity} kg</p>
                      <p><strong>Amount:</strong> ₹{o.total}</p>
                      {product.farmer && <p><strong>Farmer:</strong> {product.farmer}</p>}
                      {product.location && <p><strong>Origin:</strong> {product.location}</p>}
                      <p><strong>Delivered:</strong> {o.deliveredAt ? new Date(o.deliveredAt).toLocaleString() : 'N/A'}</p>
                      <p><strong>Payment:</strong> <span className={`statusBadge ${o.paymentStatus === 'paid' ? 'statusPaid' : 'statusPending'}`}>{(o.paymentStatus || 'pending').toUpperCase()}</span> {o.paymentMethod ? `(${o.paymentMethod.toUpperCase()})` : ''}</p>
                      <p><strong>Result:</strong> {o.deliveryResult ? o.deliveryResult.toUpperCase() : 'N/A'}</p>
                      {o.rating ? (
                        <p><strong>Your Rating:</strong> {o.rating} / 5</p>
                      ) : (
                        (o.deliveryResult === 'success' || o.status === 'delivered' || o.status === 'completed') && (
                          <div style={{marginTop: '10px'}}>
                            <label className="formLabel">Rate your delivery</label>
                            <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px'}}>
                              {[1,2,3,4,5].map(star => (
                                <button
                                  key={star}
                                  className={`btn ${ratingDrafts[o.id] >= star ? 'btnPrimary' : ''}`}
                                  style={{padding: '6px 8px'}}
                                  onClick={() => setRatingDrafts(prev => ({ ...prev, [o.id]: star }))}
                                >
                                  {ratingDrafts[o.id] >= star ? '★' : '☆'}
                                </button>
                              ))}
                              <span style={{marginLeft: '8px'}}>{ratingDrafts[o.id] ? `${ratingDrafts[o.id]} / 5` : ''}</span>
                            </div>
                            <div style={{marginTop: '8px'}}>
                              <label className="formLabel">Write a short review (optional)</label>
                              <textarea
                                className="formInput"
                                rows={3}
                                value={reviewDrafts[o.id] || ''}
                                onChange={(e) => setReviewDrafts(prev => ({ ...prev, [o.id]: e.target.value }))}
                                placeholder="Share your experience..."
                              />
                            </div>
                            <div style={{marginTop: '8px'}}>
                              <button className="btn btnSuccess" onClick={() => {
                                const rating = ratingDrafts[o.id] || 0;
                                const reviewText = (reviewDrafts[o.id] || '').trim();
                                if (!rating || rating < 1 || rating > 5) { pushToast('Please select 1-5 stars', 'error'); return; }

                                setOrders(prev => prev.map(ord => ord.id === o.id ? { ...ord, rating, review: reviewText } : ord));
                                setReviews(prev => {
                                  const copy = { ...prev };
                                  const list = copy[o.productId] ? [...copy[o.productId]] : [];
                                  const newRev = { id: `${o.productId}-u-${Date.now()}`, author: (currentUser?.fullname || currentUser?.name || currentUser?.username || 'Buyer'), text: reviewText, likes: 0 };
                                  copy[o.productId] = [newRev, ...list];
                                  return copy;
                                });
                                // clear drafts
                                setRatingDrafts(prev => { const c = { ...prev }; delete c[o.id]; return c; });
                                setReviewDrafts(prev => { const c = { ...prev }; delete c[o.id]; return c; });
                                pushToast('Thanks for your feedback!', 'success');
                              }}>Submit Review & Rating</button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentPage === 'employee-auth') {
    return (
      <div className="body authPage">
        <div className="container compact">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Employee Verification Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div className="formGroup">
            <label className="formLabel">Employee ID</label>
            <input type="text" id="employee-id" placeholder="Enter your employee ID" className="formInput" />
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input type="password" id="employee-password" placeholder="Enter your password" className="formInput" />
          </div>
          <button 
            className="btn"
            onClick={() => {
              const id = document.getElementById('employee-id').value;
              if (id) {
                setCurrentUser({ id, role: 'employee' });
                setCurrentPage('employee-dashboard');
              } else {
                pushToast('Please enter employee ID', 'error');
              }
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === 'delivery-auth') {
    return (
      <div className="body authPage">
        <div className="container compact">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Delivery Personnel Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div className="formGroup">
            <label className="formLabel">Delivery ID</label>
            <input type="text" id="delivery-id" placeholder="e.g., del-1" className="formInput" />
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input type="password" id="delivery-password" placeholder="Enter your password" className="formInput" />
          </div>
          <button
            className="btn"
            onClick={() => {
              const idRaw = (document.getElementById('delivery-id').value || '').trim();
              const id = idRaw || `del-${Math.floor(Math.random()*1000)}`;
              const name = idRaw || 'Delivery User';
              const region = 'General';
              const phone = '0000000000';
              setCurrentUser({ id, role: 'delivery', name, contact: phone, region });
              setCurrentPage('delivery-dashboard');
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === 'employee-dashboard') {
    const pendingProducts = products.filter(p => !p.verified);

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
  <div className="container compact">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Verification Dashboard</h1>
            <button className="btn" onClick={() => { setCurrentPage('landing'); setCurrentUser(null); }}>Logout</button>
          </div>
          <h2>Pending Verifications</h2>
          {pendingProducts.length === 0 ? (
            <p>No products pending verification.</p>
          ) : (
            pendingProducts.map((p) => (
              <div key={p.id} className="productCard">
                <img
                  src={p.image || 'https://via.placeholder.com/300x200'}
                  alt={p.name}
                  className="productImage"
                  data-seed={p.id}
                  onError={(e) => handleImgError(e)}
                />
                <h3>{p.name}</h3>
                <p><strong>Farmer:</strong> {p.farmer}</p>
                <p><strong>Quantity:</strong> {p.quantity} kg</p>
                <p><strong>Location:</strong> {p.location}</p>
                <button 
                  className="btn"
                  style={{marginRight: '10px'}}
                  onClick={() => {
                    setProducts(products.map(prod => 
                      prod.id === p.id ? { ...prod, verified: true, verificationStatus: true, status: 'verified' } : prod
                    ));
                    pushToast('Product verified successfully!', 'success');
                  }}
                >
                  ✓ Verify
                </button>
                <button 
                  className="btn btnDanger"
                  onClick={() => {
                    setProducts(products.map(prod => 
                      prod.id === p.id ? { ...prod, verified: true, verificationStatus: false, status: 'rejected' } : prod
                    ));
                    pushToast('Product rejected!', 'info');
                  }}
                >
                  ✗ Reject
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (currentPage === 'delivery-dashboard') {
    const me = currentUser || {};
    const myId = me.id;
    const filtered = orders.filter(o => {
      const statusOk = deliveryFilters.status === 'all' ? true : (o.status || 'processing') === deliveryFilters.status;
      const myQueueOk = deliveryFilters.myQueue ? (o.deliveryPersonId === myId) : true;
      return statusOk && myQueueOk && deliverySliceIds.includes(o.id);
    });
    const overdue = filtered.filter(o => (o.estimatedDelivery || '').includes('hours') && (o.status !== 'delivered' && o.status !== 'completed'));

    const assignDriver = (orderId, driverId) => {
      const d = deliveryPersons.find(x => x.id === driverId) || {};
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryPersonId: d.id, deliveryPersonName: `${d.name} (${d.id})`, assignedAt: new Date().toISOString(), status: (o.status || 'processing') } : o));
      pushToast('Driver assigned', 'success');
    };

    const markOutForDelivery = (orderId) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'out-for-delivery', outForDeliveryAt: new Date().toISOString() } : o));
      pushToast('Marked out for delivery', 'info');
    };

    const markDelivered = (orderId) => {
      const { result, notes, photoUrl } = podDraft;
      if (!result) { pushToast('Select delivery result', 'error'); return; }
      setOrders(prev => prev.map(o => o.id === orderId ? {
        ...o,
        status: 'completed',
        deliveryResult: result,
        deliveryNotes: notes,
        podPhotoUrl: photoUrl,
        deliveredAt: result === 'success' ? new Date().toISOString() : o.deliveredAt || null,
        deliveryEvents: [
          ...(o.deliveryEvents || []),
          { type: result === 'success' ? 'delivered' : 'delivery-failed', at: new Date().toISOString(), notes }
        ]
      } : o));
      setPodDraft({ result: 'success', notes: '', photoUrl: '' });
      pushToast('Delivery updated', 'success');
    };

    const addEvent = (orderId, type, notes='') => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryEvents: [ ...(o.deliveryEvents || []), { type, at: new Date().toISOString(), notes } ] } : o));
      pushToast('Event logged', 'info');
    };

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container">
          <div className="header">
            <h1 style={{color: '#667eea'}}>🚚 Delivery Dashboard</h1>
            <div>
              <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
            </div>
          </div>

          <div style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'12px'}}>
            <select className="formInput" value={deliveryFilters.status} onChange={(e) => setDeliveryFilters(prev => ({ ...prev, status: e.target.value }))}>
              <option value="all">All</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
            </select>
            <label style={{display:'flex', alignItems:'center', gap:'6px'}}>
              <input type="checkbox" checked={deliveryFilters.myQueue} onChange={(e) => setDeliveryFilters(prev => ({ ...prev, myQueue: e.target.checked }))} />
              My Queue Only
            </label>
            <input
              type="text"
              className="formInput"
              placeholder="Search by Order ID or Buyer Name"
              value={orderSearchId}
              onChange={(e) => setOrderSearchId(e.target.value)}
              style={{maxWidth:'260px'}}
            />
            <button className="btn" onClick={() => {
              const term = (orderSearchId || '').trim().toLowerCase();
              if (!term) { pushToast('Enter search text', 'error'); return; }
              const idNum = parseInt(term);
              const match = filtered.find(o => (!Number.isNaN(idNum) && o.id === idNum) || (o.buyerName || '').toLowerCase().includes(term));
              if (!match) { pushToast('No matching order', 'info'); return; }
              const el = document.getElementById(`order-${match.id}`);
              if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
              setHighlightId(match.id);
            }}>Search</button>
            {highlightId && (
              <button className="btn" onClick={() => { setHighlightId(null); setOrderSearchId(''); }}>Clear</button>
            )}
          </div>

          {overdue.length > 0 && (
            <div style={{background:'#fff3cd', color:'#856404', padding:'8px 12px', borderRadius:8, marginBottom:10}}>
              Overdue Deliveries: {overdue.length}
            </div>
          )}

          {filtered.length === 0 ? (
            <p>No deliveries match filters.</p>
          ) : (
            filtered.map(o => {
              const product = products.find(p => p.id === o.productId) || {};
              const region = getRegionFromAddress(o.address);
              const suggestedDrivers = deliveryPersons.filter(d => d.region === region);

              const timeline = [
                { key: 'orderDate', label: 'Received', active: !!o.orderDate },
                { key: 'processing', label: 'Processing', active: (o.status === 'processing') },
                { key: 'shipped', label: 'Shipped', active: (o.status === 'shipped') },
                { key: 'out-for-delivery', label: 'Out for Delivery', active: (o.status === 'out-for-delivery') },
                { key: 'delivered', label: 'Delivered', active: (o.status === 'delivered' || o.status === 'completed') },
              ];

              return (
                <div key={o.id} className="productCard" style={{position:'relative'}}>
                  <div style={{display:'flex', gap:'15px'}}>
                    <img
                      src={product.image || 'https://via.placeholder.com/300x200'}
                      alt={product.name}
                      className="productImage"
                      data-seed={product.id}
                      onError={(e) => handleImgError(e)}
                      style={{maxWidth:'240px'}}
                    />
                    <div style={{flex:1}}>
                      <h3>Order #{o.id} — {product.name}</h3>
                      <p><strong>Buyer:</strong> {o.buyerName}</p>
                      <p><strong>Phone:</strong> {o.contact} <button className="btn" style={{padding:'4px 8px', fontSize:'0.8rem'}} onClick={() => copyToClipboard(o.contact)}>Copy</button> <a className="btn" style={{padding:'4px 8px', fontSize:'0.8rem'}} href={`tel:${o.contact}`}>Call</a></p>
                      <p><strong>Address:</strong> {o.address} <button className="btn" style={{padding:'4px 8px', fontSize:'0.8rem'}} onClick={() => openInMaps(o.address)}>Open in Maps</button></p>
                      <p><strong>Driver:</strong> {o.deliveryPersonName || 'Unassigned'}</p>
                      <p><strong>Region:</strong> {region}</p>

                      <div style={{display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'8px'}}>
                        <select className="formInput" onChange={(e) => assignDriver(o.id, e.target.value)} defaultValue="">
                          <option value="" disabled>Assign Driver</option>
                          {suggestedDrivers.concat(deliveryPersons.filter(d => !suggestedDrivers.some(s => s.id === d.id))).map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.region})</option>
                          ))}
                        </select>
                        <button className="btn" onClick={() => markOutForDelivery(o.id)}>Mark Out-for-Delivery</button>
                      </div>

                      <div style={{marginTop:'12px'}}>
                        <h4>Status Timeline</h4>
                        <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                          {timeline.map((t, i) => (
                            <span key={i} className={`statusBadge ${t.active ? 'statusApproved' : 'statusPending'}`}>{t.label}</span>
                          ))}
                        </div>
                      </div>

                      <div style={{marginTop:'12px'}}>
                        <h4>Proof of Delivery</h4>
                        <div className="formGroup">
                          <label className="formLabel">Result</label>
                          <select className="formInput" value={podDraft.result} onChange={(e) => setPodDraft(prev => ({ ...prev, result: e.target.value }))}>
                            <option value="success">Success</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>
                        <div className="formGroup">
                          <label className="formLabel">Notes</label>
                          <textarea className="formInput" rows={2} value={podDraft.notes} onChange={(e) => setPodDraft(prev => ({ ...prev, notes: e.target.value }))} />
                        </div>
                        <div className="formGroup">
                          <label className="formLabel">Photo URL (optional)</label>
                          <input type="text" className="formInput" value={podDraft.photoUrl} onChange={(e) => setPodDraft(prev => ({ ...prev, photoUrl: e.target.value }))} />
                        </div>
                        <button className="btn btnSuccess" onClick={() => {
                          if (o.paymentMethod === 'upi' && o.paymentStatus !== 'paid' && podDraft.result === 'success') { pushToast('Payment pending; cannot mark delivered.', 'error'); return; }
                          if (o.paymentMethod === 'cod' && podDraft.result === 'success') {
                            pushToast('Collect cash from buyer and confirm.', 'info');
                          }
                          markDelivered(o.id);
                        }}>Mark Delivered</button>
                      </div>

                      <div style={{marginTop:'12px'}}>
                        <h4>Exceptions</h4>
                        <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                          <button className="btn" onClick={() => addEvent(o.id, 'reschedule', 'Rescheduled with buyer')}>Reschedule</button>
                          <button className="btn" onClick={() => addEvent(o.id, 'failed-attempt', 'Attempted but failed')}>Failed Attempt</button>
                          <button className="btn" onClick={() => addEvent(o.id, 'address-issue', 'Address issue reported')}>Address Issue</button>
                          <button className="btn" onClick={() => addEvent(o.id, 'buyer-unreachable', 'Buyer unreachable')}>Buyer Unreachable</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  if (currentPage === 'quality-auth') {
    return (
      <div className="body authPage">
        <div className="container compact">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Quality Assurance Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div className="formGroup">
            <label className="formLabel">Team Member ID</label>
            <input type="text" id="quality-id" placeholder="Enter your team ID" className="formInput" />
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input type="password" id="quality-password" placeholder="Enter your password" className="formInput" />
          </div>
          <button 
            className="btn"
            onClick={() => {
              const id = document.getElementById('quality-id').value;
              if (id) {
                setCurrentUser({ id, role: 'quality' });
                setCurrentPage('quality-dashboard');
              } else {
                        pushToast('Please enter team member ID', 'error');
              }
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === 'quality-dashboard') {
    const verifiedProducts = products.filter(p => p.verified && p.verificationStatus && !p.quality);

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Quality Assessment Dashboard</h1>
            <button className="btn" onClick={() => { setCurrentPage('landing'); setCurrentUser(null); }}>Logout</button>
          </div>
          <div style={{background: '#f7fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
            <strong>Rating Scale:</strong> 0-2 (Poor) | 2.1-4 (Average) | 4.1-7 (Good) | 7.1-9 (Excellent) | 9.1-10 (Outstanding)
          </div>
          <h2>Products for Quality Rating</h2>
          {verifiedProducts.length === 0 ? (
            <p>No products pending quality assessment.</p>
          ) : (
            verifiedProducts.map((p) => (
              <div key={p.id} className="productCard">
                <img
                  src={p.image || 'https://via.placeholder.com/300x200'}
                  alt={p.name}
                  className="productImage"
                  data-seed={p.id}
                  onError={(e) => handleImgError(e)}
                />
                <h3>{p.name}</h3>
                <p><strong>Farmer:</strong> {p.farmer}</p>
                <p><strong>Quantity:</strong> {p.quantity} kg</p>
                <div className="formGroup">
                  <label className="formLabel">Quality Rating (0-10)</label>
                  <input 
                    type="number" 
                    id={`rating-${p.id}`}
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="Enter rating"
                    className="formInput"
                  />
                </div>
                <button 
                  className="btn"
                  onClick={() => {
                    const rating = parseFloat(document.getElementById(`rating-${p.id}`).value);
                    if (rating >= 0 && rating <= 10) {
                      setProducts(products.map(prod => 
                        prod.id === p.id ? { ...prod, quality: rating, status: 'approved' } : prod
                      ));
                      pushToast('Quality rating submitted successfully!', 'success');
                    } else {
                      pushToast('Please enter a valid rating between 0 and 10', 'error');
                    }
                  }}
                >
                  Submit Rating
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Admin Auth
  if (currentPage === 'admin-auth') {
    return (
      <div className="body authPage">
        <div className="container compact">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Admin Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div className="formGroup">
            <label className="formLabel">Admin Username</label>
            <input type="text" id="admin-username" placeholder="Enter admin username" className="formInput" />
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input type="password" id="admin-password" placeholder="Enter password" className="formInput" />
          </div>
          <button 
            className="btn"
            onClick={() => {
              const username = document.getElementById('admin-username').value;
              if (username) {
                setCurrentUser({ username, role: 'admin' });
                setCurrentPage('admin-dashboard');
              } else {
                pushToast('Please enter admin credentials', 'error');
              }
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (currentPage === 'admin-dashboard') {
    const pendingApproval = products.filter(p => p.status === 'approved' && !p.inMarketplace);
    const uniqueFarmers = new Set(products.map(p => p.farmer)).size;
    const pendingValueRequests = valueRequests.filter(r => r.status === 'pending');

    // compute sales summary (last 7 days)
    const paidOrders = orders.filter(o => (o.paymentStatus || '') === 'paid');
    const groupByDate = {};
    paidOrders.forEach(o => {
      const when = (o.paymentAt || o.orderDate || new Date().toISOString()).slice(0,10);
      groupByDate[when] = groupByDate[when] || { revenue: 0, orders: 0 };
      groupByDate[when].revenue += (o.total || 0);
      groupByDate[when].orders += 1;
    });
    const costRate = 0.7; // assume cost is 70% of revenue for a simple profit estimate
    const salesByDate = Object.keys(groupByDate).sort((a,b) => b.localeCompare(a)).slice(0,7).map(date => ({
      date,
      revenue: groupByDate[date].revenue,
      cost: +(groupByDate[date].revenue * costRate).toFixed(2),
      profit: +(groupByDate[date].revenue * (1 - costRate)).toFixed(2),
      orders: groupByDate[date].orders
    }));

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Admin Dashboard</h1>
            <button className="btn" onClick={() => { setCurrentPage('landing'); setCurrentUser(null); }}>Logout</button>
          </div>
          <div className="dashboardGrid">
            <div className="card">
              <h3>Total Products</h3>
              <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#667eea'}}>{products.length}</p>
            </div>
            <div className="card">
              <h3>Pending Approval</h3>
              <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#ffa500'}}>{pendingApproval.length}</p>
            </div>
            <div className="card">
              <h3>Active Farmers</h3>
              <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#28a745'}}>{uniqueFarmers}</p>
            </div>
            <div className="card">
              <h3>Total Orders</h3>
              <p style={{fontSize: '2rem', fontWeight: 'bold', color: '#764ba2'}}>{orders.length}</p>
            </div>
          </div>
          <div style={{marginTop: '20px'}}>
            <h3>Sales & Finance (recent days)</h3>
            {salesByDate.length === 0 ? (
              <p>No paid sales yet.</p>
            ) : (
              <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                {salesByDate.map(s => (
                  <div key={s.date} className="card" style={{minWidth: '180px'}}>
                    <h4>{s.date}</h4>
                    <p style={{margin: '6px 0'}}><strong>Revenue:</strong> ₹{s.revenue}</p>
                    <p style={{margin: '6px 0'}}><strong>Est. Cost:</strong> ₹{s.cost}</p>
                    <p style={{margin: '6px 0'}}><strong>Profit:</strong> ₹{s.profit}</p>
                    <p style={{margin: '6px 0', color: '#666'}}><small>{s.orders} orders</small></p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <h2 style={{marginTop: '30px'}}>Product Management</h2>
          <div style={{marginTop: 8, marginBottom: 12}}>
            <button className="btn" onClick={() => {
              if (!confirm('Randomize farmer names for local products? This will update product entries shown in the UI (keeps product 25 unchanged).')) return;
              randomizeLocalFarmers();
            }}>Randomize Local Farmers</button>
            <small style={{marginLeft: 12, color: '#666'}}>Use to generate demo farmer names for local products.</small>
          </div>
          {products.length === 0 ? (
            <p>No products in the system yet.</p>
          ) : (
            <div>
              <h3 style={{marginTop: '12px'}}>Pending Value-Addition Requests</h3>
              {pendingValueRequests.length === 0 ? (
                <p>No pending requests.</p>
              ) : (
                pendingValueRequests.map(r => (
                  <div key={r.id} style={{background: '#f8f9fa', padding: '10px', borderRadius: '8px', marginBottom: '8px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <strong>{r.serviceName}</strong> — {r.input} → {r.output} ({r.increase})
                        <div style={{fontSize: '0.9rem', color: '#666'}}>Requested by: {r.farmerName} • {new Date(r.createdAt).toLocaleString()}</div>
                      </div>
                      <div style={{display: 'flex', gap: '8px'}}>
                        <button className="btn btnSuccess" onClick={() => {
                            setValueRequests(prev => prev.map(v => v.id === r.id ? { ...v, status: 'approved', approvedAt: new Date().toISOString() } : v));
                            addNotification(r.farmerId, `Your request "${r.serviceName}" was approved.`, 'success');
                            pushToast('Request approved.', 'success');
                        }}>Approve</button>
                        <button className="btn btnDanger" onClick={() => {
                          setValueRequests(prev => prev.map(v => v.id === r.id ? { ...v, status: 'rejected', rejectedAt: new Date().toISOString() } : v));
                          addNotification(r.farmerId, `Your request "${r.serviceName}" was rejected.`, 'info');
                          pushToast('Request rejected.', 'info');
                        }}>Reject</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
          
              <h3 style={{marginTop: '18px'}}>Products</h3>
              <div className="adminGrid">
                {products.map((p) => (
                  <div key={p.id} className="productCard">
                    <img
                      src={p.image || 'https://via.placeholder.com/300x200'}
                      alt={p.name}
                      className="productImage"
                      data-seed={p.id}
                      onError={(e) => handleImgError(e)}
                    />
                    <h3>{p.name}</h3>
                    <p><strong>Farmer:</strong> {p.farmer}</p>
                    <p><strong>Quantity:</strong> {p.quantity} kg</p>
                    <p>
                      <strong>Price:</strong> ₹{p.price}/kg
                      {p.discountPercent ? (<span style={{color: '#dc3545', marginLeft: '8px'}}>({p.discountPercent}% off → ₹{(p.price * (1 - (p.discountPercent/100))).toFixed(2)}/kg)</span>) : null}
                    </p>
                    <p><strong>Status:</strong> <span className={`statusBadge ${p.status === 'approved' ? 'statusApproved' : p.status === 'verified' ? 'statusVerified' : 'statusPending'}`}>{p.status.toUpperCase()}</span></p>
                    <p><strong>Verified:</strong> {p.verified ? '✓ Yes' : '✗ No'}</p>
                    {p.quality ? (
                      <p><strong>Quality:</strong> {getQualityLabel(p.quality)} ({p.quality}/10)</p>
                    ) : (
                      <p><strong>Quality:</strong> Not rated yet</p>
                    )}
                    <div style={{display: 'flex', gap: '8px', marginTop: '8px'}}>
                      {p.status === 'approved' && !p.inMarketplace && (
                        <button 
                          className="btn btnSuccess"
                          style={{padding: '5px 10px', fontSize: '0.85rem'}}
                          onClick={() => {
                            setProducts(products.map(prod => prod.id === p.id ? { ...prod, inMarketplace: true } : prod));
                            pushToast('Product approved for marketplace!', 'success');
                          }}
                        >
                          ✓ Publish
                        </button>
                      )}
                      <button className="btn btnDanger" onClick={() => {
                        if (!confirm('Delete this product? This action cannot be undone.')) return;
                        setProducts(products.filter(prod => prod.id !== p.id));
                        pushToast('Product deleted.', 'info');
                      }}>Delete</button>
                      <div style={{display: 'flex', gap: '6px', alignItems: 'center'}}>
                        <input type="number" min={0} max={90} placeholder="% discount" defaultValue={p.discountPercent || ''} id={`disc-${p.id}`} className="formInput" style={{width: '80px'}} />
                        <button className="btn" onClick={() => {
                          const v = parseFloat(document.getElementById(`disc-${p.id}`).value || '0');
                          if (isNaN(v) || v < 0 || v > 90) { pushToast('Enter a valid discount percent (0-90)', 'error'); return; }
                          setProducts(products.map(prod => prod.id === p.id ? { ...prod, discountPercent: v, discountedPrice: +(prod.price * (1 - v/100)).toFixed(2) } : prod));
                          pushToast('Discount applied.', 'success');
                        }}>Apply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Delivery Auth
  if (currentPage === 'delivery-auth') {
    return (
      <div className="body authPage">
        <div className="container compact">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Delivery Personnel Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div className="formGroup">
            <label className="formLabel">Delivery Personnel ID</label>
            <input type="text" id="delivery-id" placeholder="Enter your ID" className="formInput" />
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input type="password" id="delivery-password" placeholder="Enter password" className="formInput" />
          </div>
          <button 
            className="btn"
            onClick={() => {
              const id = document.getElementById('delivery-id').value;
              if (id) {
                setCurrentUser({ id, role: 'delivery' });
                setCurrentPage('delivery-dashboard');
              } else {
                pushToast('Please enter delivery personnel ID', 'error');
              }
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Delivery Dashboard
  if (currentPage === 'delivery-dashboard') {
    // Normalize and compute active/past deliveries. When a delivery user is logged in, filter to their assignments.
    const normalize = (s) => (s || '').toLowerCase();
    const isActiveStatus = (s) => ['processing', 'shipped', 'shipping'].includes(normalize(s));
    const isPastStatus = (s) => ['delivered', 'completed'].includes(normalize(s));

    const isDeliveryPerson = currentUser && currentUser.role === 'delivery';
    
    // Auto-assign unassigned orders and create sample orders for any new delivery personnel ID
    if (isDeliveryPerson) {
      const unassignedOrders = orders.filter(o => !o.deliveryPersonId);
      if (unassignedOrders.length > 0) {
        setOrders(prev => prev.map(o => 
          !o.deliveryPersonId ? { ...o, deliveryPersonId: currentUser.id, deliveryPersonName: currentUser.id } : o
        ));
      }
      
      const userOrders = orders.filter(o => o.deliveryPersonId === currentUser.id);
      if (userOrders.length === 0) {
        const newOrders = [
          {
            id: Date.now() + 1,
            productId: 1000 + Math.floor(Math.random() * 10),
            quantity: 2 + Math.floor(Math.random() * 8),
            total: 150 + Math.floor(Math.random() * 300),
            buyerName: 'Sample Customer',
            address: 'Sample Address, Hyderabad',
            contact: '9876543210',
            status: 'shipped',
            deliveryPersonId: currentUser.id,
            deliveryPersonName: currentUser.id,
            deliveredAt: null,
            deliveryResult: null
          },
          {
            id: Date.now() + 2,
            productId: 1001 + Math.floor(Math.random() * 10),
            quantity: 3 + Math.floor(Math.random() * 7),
            total: 200 + Math.floor(Math.random() * 400),
            buyerName: 'Demo Buyer',
            address: 'Demo Location, Vijayawada',
            contact: '9988776655',
            status: 'processing',
            deliveryPersonId: currentUser.id,
            deliveryPersonName: currentUser.id,
            deliveredAt: null,
            deliveryResult: null
          }
        ];
        setOrders(prev => [...prev, ...newOrders]);
      }
    }
    
    const activeDeliveries = orders.filter(o => {
      const statusMatch = isActiveStatus(o.status);
      const assignmentMatch = !isDeliveryPerson || o.deliveryPersonId === currentUser.id;
      return statusMatch && assignmentMatch;
    });
    const pastDeliveries = orders.filter(o => {
      const statusMatch = isPastStatus(o.status) || (o.deliveryResult && o.deliveryResult.toLowerCase() === 'success');
      const assignmentMatch = !isDeliveryPerson || o.deliveryPersonId === currentUser.id;
      return statusMatch && assignmentMatch;
    });

    const activeCount = activeDeliveries.length;
    const pastCount = pastDeliveries.length;

    return (
      <div className="body" style={{minHeight: '100vh', padding: '20px'}}>
        <div className="container">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Delivery Dashboard</h1>
            <button className="btn" onClick={() => { setCurrentPage('landing'); setCurrentUser(null); }}>Logout</button>
          </div>

          <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
            <h3 style={{marginBottom: '10px'}}>Track Order</h3>
            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
              <input
                type="text"
                placeholder="Enter Order ID"
                id="trackOrderId"
                style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1}}
              />
              <button
                className="btn btnPrimary"
                onClick={() => {
                  const orderId = document.getElementById('trackOrderId').value;
                  if (!orderId) {
                    pushToast('Please enter an order ID', 'error');
                    return;
                  }
                  const order = orders.find(o => o.id.toString() === orderId.toString());
                  if (!order) {
                    pushToast('Order not found', 'error');
                    return;
                  }
                  const product = products.find(p => p.id === order.productId) || { name: 'Unknown' };
                  pushToast(`Order #${order.id}: ${product.name} - Status: ${order.status?.toUpperCase() || 'UNKNOWN'}`, 'success');
                }}
              >
                Track
              </button>
            </div>
          </div>

          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 6}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <strong>Deliveries</strong>
              <div style={{display: 'flex', gap: 8}}>
                <button className={`btn ${deliveryFilter === 'all' ? 'btnPrimary' : ''}`} onClick={() => setDeliveryFilter('all')}>All ({activeCount + pastCount})</button>
                <button className={`btn ${deliveryFilter === 'active' ? 'btnPrimary' : ''}`} onClick={() => setDeliveryFilter('active')}>Active ({activeCount})</button>
                <button className={`btn ${deliveryFilter === 'past' ? 'btnPrimary' : ''}`} onClick={() => setDeliveryFilter('past')}>Past ({pastCount})</button>
              </div>
            </div>
            <div style={{color: '#666'}}>{isDeliveryPerson ? `Showing deliveries for ${currentUser.id}` : ''}</div>
          </div>

          {(deliveryFilter === 'all' || deliveryFilter === 'active') && (
            <>
              <h2 style={{marginTop: 16}}>Today's Deliveries</h2>
              {activeDeliveries.length === 0 ? (
                <p>No deliveries scheduled for today.</p>
              ) : (
                activeDeliveries.map(o => {
                  const product = products.find(p => p.id === o.productId) || { name: 'Unknown', location: 'N/A' };
                  return (
                    <div key={o.id} className="card" style={{borderLeft: '4px solid #28a745', display: 'flex', gap: '15px', alignItems: 'flex-start'}}>
                      <img
                        src={product.image || 'https://via.placeholder.com/120x120'}
                        alt={product.name}
                        style={{width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0}}
                        onError={(e) => handleImgError(e, true)}
                      />
                      <div style={{flex: 1}}>
                        <h3>Order #{o.id}</h3>
                        <p><strong>Product:</strong> {product.name} ({o.quantity} kg)</p>
                        <p><strong>Pickup:</strong> {product.location}</p>
                        <p><strong>Delivery:</strong> {o.address}</p>
                        <p><strong>Customer:</strong> {o.buyerName} ({o.contact})</p>
                        <p><strong>Status:</strong> <span className="statusBadge" style={{background: '#fff3cd', color: '#856404'}}>{(o.status || '').toUpperCase()}</span></p>
                        {o.estimatedDelivery && <p><strong>ETA:</strong> {o.estimatedDelivery}</p>}
                        {o.status && o.status.toLowerCase() === 'shipped' && (
                          <button
                            className="btn btnSuccess"
                            style={{padding: '5px 10px', fontSize: '0.85rem', marginTop: '10px'}}
                            onClick={() => {
                              setOrders(prev => prev.map(order => order.id === o.id ? { ...order, status: 'delivered', deliveredAt: new Date().toISOString(), deliveryResult: 'success' } : order));
                              pushToast('Order marked as delivered!', 'success');
                            }}
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {(deliveryFilter === 'all' || deliveryFilter === 'past') && (
            <>
              <h2 style={{marginTop: 20}}>Past Deliveries</h2>
              {pastDeliveries.length === 0 ? (
                <p>No past deliveries.</p>
              ) : (
                pastDeliveries.map(o => {
                  const product = products.find(p => p.id === o.productId) || { name: 'Unknown', location: 'N/A' };
                  return (
                    <div key={o.id} className="card" style={{borderLeft: '4px solid #6c757d', display: 'flex', gap: '15px', alignItems: 'flex-start'}}>
                      <img
                        src={product.image || 'https://via.placeholder.com/120x120'}
                        alt={product.name}
                        style={{width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0}}
                        onError={(e) => handleImgError(e, true)}
                      />
                      <div style={{flex: 1}}>
                        <h3>Order #{o.id}</h3>
                        <p><strong>Product:</strong> {product.name} ({o.quantity} kg)</p>
                        <p><strong>Pickup:</strong> {product.location}</p>
                        <p><strong>Delivery:</strong> {o.address}</p>
                        <p><strong>Customer:</strong> {o.buyerName} ({o.contact})</p>
                        <p><strong>Status:</strong> <span className="statusBadge" style={{background: '#e9ecef', color: '#495057'}}>{(o.status || '').toUpperCase()}</span></p>
                        {o.deliveredAt && <p><strong>Delivered At:</strong> {new Date(o.deliveredAt).toLocaleString()}</p>}
                        <p><strong>Result:</strong> {o.deliveryResult ? o.deliveryResult.toUpperCase() : 'N/A'}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default AgriValueMarketplace;