import React, { useState, useEffect } from 'react';
import './styles.css';

const AgriValueMarketplace = () => {
  // Core navigation & user
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  // Data collections
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  // UI state
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  // Reviews
  const [reviews, setReviews] = useState({});
  const [likedReviews, setLikedReviews] = useState([]);
  const [ratingDrafts, setRatingDrafts] = useState({});
  const [reviewDrafts, setReviewDrafts] = useState({});
  // Value addition requests
  const [valueRequests, setValueRequests] = useState([]);
  const VALUE_ADDITION_FACILITIES = [
    { id:'fac-1', name:'Spice Grinding Unit - Guntur', city:'Guntur', lat:16.3067, lon:80.4365 },
    { id:'fac-2', name:'Organic Packaging Center - Vijayawada', city:'Vijayawada', lat:16.5062, lon:80.6480 },
    { id:'fac-3', name:'Cold Storage Hub - Nellore', city:'Nellore', lat:14.4426, lon:79.9865 },
    { id:'fac-4', name:'Dry Processing Shed - Kurnool', city:'Kurnool', lat:15.8281, lon:78.0373 }
  ];
  // Notifications & toasts
  const [notifications, setNotifications] = useState([]);
  const [_toasts, setToasts] = useState([]);
  // Training tab
  const [activeTrainingTab, setActiveTrainingTab] = useState('agricultural');
  // Legacy delivery filter (kept for compatibility)
  const [deliveryFilter, setDeliveryFilter] = useState('active');
  // Farmer auth
  const [farmerFormErrors, setFarmerFormErrors] = useState({});
  const [farmerMode, setFarmerMode] = useState('login');
  const [farmerForm, setFarmerForm] = useState({ email: '', password: '', confirmPassword: '', fullname: '', location: '', contact: '' });
  // Admin auth (fixed credentials)
  const [adminName, setAdminName] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const FIXED_ADMIN_USER = 'kumarnagendramallela@gmail.com';
  const FIXED_ADMIN_PASS = 'KUMAR_Lohii@1916';
  // Admin dashboard credential view toggle
  const [adminCredView, setAdminCredView] = useState('farmers');
  // Buyer auth
  const [buyerMode, setBuyerMode] = useState('login');
  const [buyerForm, setBuyerForm] = useState({ email: '', password: '', confirmPassword: '', name: '' });
  const [buyerErrors, setBuyerErrors] = useState({});
  // Seeding tick
  const [adminSeedTick, setAdminSeedTick] = useState(0);
  // Delivery auth restricted
  const [deliveryId, setDeliveryId] = useState('');
  const [deliveryPass, setDeliveryPass] = useState('');
  const [deliveryErrors, setDeliveryErrors] = useState({});
  const DELIVERY_CREDENTIALS = {
    'vamsi': { password: 'Kumar@1621', name: 'Raju', phone: '9000000001', region: 'Hyderabad' },
    'sasidhar': { password: 'Low@1621', name: 'Lakshmi', phone: '9000000002', region: 'Vijayawada' },
    'pandu': { password: 'Thanu@16', name: 'Kumar', phone: '9000000003', region: 'Guntur' }
  };

  const [employeeId, setEmployeeId] = useState('');
  const [employeePass, setEmployeePass] = useState('');
  const [employeeErrors, setEmployeeErrors] = useState({});
  const EMPLOYEE_CREDENTIALS = {
    'ramu@emp.com': { password: 'Thanu@16', name: 'Verifier One' },
    'wealth@emp.com': { password: 'Loww@2007', name: 'Verifier Two' },
    'revese@emp.com': { password: 'Kumar@19', name: 'Verifier Three' }
  };

  const [qualityId, setQualityId] = useState('');
  const [qualityPass, setQualityPass] = useState('');
  const [qualityErrors, setQualityErrors] = useState({});
  const QUALITY_CREDENTIALS = {
    'qual-10': { password: 'Farmer@12', name: 'Quality Lead' },
    'qual-21': { password: 'Farmer@16', name: 'Quality Analyst' },
    'qual-32': { password: 'Farmer@21', name: 'Quality Officer' }
  };

  const generateCaptcha = () => {
    const a = 1 + Math.floor(Math.random() * 9);
    const b = 1 + Math.floor(Math.random() * 9);
    return { q: `${a} + ${b} = ?`, a: String(a + b) };
  };

  const [farmerCaptcha, setFarmerCaptcha] = useState(generateCaptcha());
  const [farmerCaptchaInput, setFarmerCaptchaInput] = useState('');

  const [buyerCaptcha, setBuyerCaptcha] = useState(generateCaptcha());
  const [buyerCaptchaInput, setBuyerCaptchaInput] = useState('');

  const [deliveryCaptcha, setDeliveryCaptcha] = useState(generateCaptcha());
  const [deliveryCaptchaInput, setDeliveryCaptchaInput] = useState('');

  const [qualityCaptcha, setQualityCaptcha] = useState(generateCaptcha());
  const [qualityCaptchaInput, setQualityCaptchaInput] = useState('');
  const isStrongPassword = (pwd) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]).{8,}$/.test(pwd || '');
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [deliveryPersons, setDeliveryPersons] = useState([
    { id: 'raju@gamil.com', name: 'Raju', phone: '9000000001', region: 'Hyderabad' },
    { id: 'Lakshmi@gmail.com', name: 'Lakshmi', phone: '9000000002', region: 'Vijayawada' },
    { id: 'kumar@gmail.com', name: 'Kumar', phone: '9000000003', region: 'Guntur' }
  ]);
  const [deliveryFilters, setDeliveryFilters] = useState({ status: 'all', myQueue: false });
  const [bulkSelection, setBulkSelection] = useState([]);
  const [podDraft, setPodDraft] = useState({ result: 'success', notes: '', photoUrl: '' });
  const [orderSearchId, setOrderSearchId] = useState('');
  const [highlightId, setHighlightId] = useState(null);
  const [deliverySliceIds, setDeliverySliceIds] = useState([]);
  const [upiBannerHidden, setUpiBannerHidden] = useState(() => {
    try { return localStorage.getItem('upi_banner_hidden') === '1'; } catch { return false; }
  });
  const [purchasedProducts, setPurchasedProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('agri_purchased') || '[]'); } catch { return []; }
  });
  const [lastPlacedOrderIds, setLastPlacedOrderIds] = useState([]);

  const [chats, setChats] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem('agri_chats') || '{}');
      return { delivery: raw.delivery || {}, farmer: raw.farmer || {} };
    } catch { return { delivery: {}, farmer: {} }; }
  });
  const [openOrderChats, setOpenOrderChats] = useState([]);
  const [openProductChats, setOpenProductChats] = useState([]);

  const [newProductImageData, setNewProductImageData] = useState(null);
  const [newProductGeo, setNewProductGeo] = useState(null);

  const [newProductValueAdd, setNewProductValueAdd] = useState(false);
  const [newProductValueAddService, setNewProductValueAddService] = useState('');
  const VALUE_ADD_SERVICES = [
    { name: 'Rice to Rice Flour', input: 'Rice', output: 'Rice Flour', increase: '40%', time: '2 days' },
    { name: 'Turmeric to Powder', input: 'Fresh Turmeric', output: 'Turmeric Powder', increase: '60%', time: '5 days' }
  ];

  const captureGeolocation = () => {
    if (!navigator.geolocation) {
      pushToast('Geolocation not supported', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setNewProductGeo({ latitude, longitude, accuracy, capturedAt: new Date().toISOString() });
        pushToast('Location captured', 'success');
      },
      () => pushToast('Location permission denied', 'error'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handleNewProductFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewProductImageData(e.target.result);
      pushToast('Image loaded', 'success');
    };
    reader.onerror = () => pushToast('Failed to read image', 'error');
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (highlightId) {
      try {
        const el = document.getElementById(`order-${highlightId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch {}
    }
  }, [highlightId]);


  useEffect(() => {
    try {
      setIsPaymentReady(true);
    } catch {}
  }, []);


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
    try { localStorage.setItem('agri_notifications', JSON.stringify(notifications)); } catch {}
  }, [notifications]);

  useEffect(() => {
    try { localStorage.setItem('agri_chats', JSON.stringify(chats)); } catch {}
  }, [chats]);


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

  const addNotification = (farmerId, message, type = 'info') => {
    const newNotif = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      farmerId,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const randomizeLocalFarmers = () => {
    const sampleFarmers = ['Ashish Verma','Ramesh Kumar','Sita Devi','Anil Sharma','Kavita Rao','Vikram Singh','Meera Patel','Suresh Reddy','Lakshmi Devi','Raju'];
    setProducts(prev => prev.map(p => {
      if (p.id >= 1000) {
        const newFarmer = sampleFarmers[Math.floor(Math.random() * sampleFarmers.length)];
        return { ...p, farmer: newFarmer };
      }
      return p;
    }));
    pushToast('Local product farmers randomized', 'info');
  };

  const pushToast = (message, type = 'info') => {
    const toast = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      message,
      type,
      createdAt: new Date().toISOString()
    };
    setToasts(prev => [toast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 4000);
  };

  const sendChatMessage = ({ threadType, key, text, fromRole, fromId }) => {
    const raw = (text || '').trim();
    if (!raw) { pushToast('Message cannot be blank', 'error'); return; }
    if (raw.length > 500) { pushToast('Message too long (max 500 chars)', 'error'); return; }
    const msg = raw;
    setChats(prev => {
      const copy = { ...prev };
      if (!copy[threadType]) copy[threadType] = {};
      const arr = copy[threadType][key] ? [...copy[threadType][key]] : [];
      arr.push({ id: Date.now() + Math.floor(Math.random()*1000), text: msg, fromRole, fromId, at: new Date().toISOString() });
      copy[threadType][key] = arr.slice(-100);
      return copy;
    });
  };

  const copyToClipboard = async (text) => {
    const value = text || '';
    // Attempt modern async clipboard first
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        pushToast('Copied to clipboard', 'success');
        return true;
      }
    } catch (err) {
      console.warn('Primary clipboard write failed:', err);
    }
    // Try creating a temporary selection input (execCommand)
    try {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.left = '0';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) {
        pushToast('Copied to clipboard', 'success');
        return true;
      }
    } catch (err) {
      console.warn('Textarea fallback failed:', err);
    }
    // Final minimal prompt fallback (some browsers allow this)
    try {
      const manual = window.prompt('Copy text manually (Ctrl+C):', value);
      if (manual !== null) {
        pushToast('Provided manual copy dialog', 'info');
      }
    } catch {}
    pushToast('Copy failed', 'error');
    return false;
  };

  const openInMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  const getRegionFromAddress = (address) => {
    const addr = (address || '').toLowerCase();
    if (addr.includes('hyderabad')) return 'Hyderabad';
    if (addr.includes('vijayawada')) return 'Vijayawada';
    if (addr.includes('guntur')) return 'Guntur';
    return 'Other';
  };
  const initializeSampleData = () => {
    const localImageFiles = [
      'download (34).jpeg','download (35).jpeg','download (36).jpeg','download (37).jpeg','download (38).jpeg','download (39).jpeg','download (40).jpeg','download (41).jpeg','download (42).jpeg','download (43).jpeg','download (44).jpeg','download (46).jpeg','download (47).jpeg','download (48).jpeg','download (49).jpeg','download (50).jpeg','download (51).jpeg','download (52).jpeg','download (53).jpeg','download (54).jpeg','download (55).jpeg','download (56).jpeg','download (58).jpeg','download (59).jpeg','download (60).jpeg','download (61).jpeg','download (62).jpeg','download (63).jpeg','download (64).jpeg','download (65).jpeg','download (66).jpeg','download (67).jpeg','download (68).jpeg'
    ];

    const customNames = {
      1: 'Bay Leaves', 2: 'Carom Seeds', 3: 'Charoli', 4: 'Soya Chunks', 5: 'Soya Granules', 6: 'Cumin Seeds', 7: 'Mace', 8: 'Coriander Powder',
      9: 'Coriander Seeds', 10: 'Fenugreek Seeds', 11: 'Star Anise', 12: 'Wheat Grains', 13: 'Corn Flour', 14: 'Jowar Seeds', 15: 'Cereal Grains',
      16: 'White Sorghum', 17: 'Jowar Flour', 18: 'Finger Millet', 19: 'Finger Millet Flour', 20: 'Cinnamon Flour', 21: 'Chips', 22: 'Coconut Dumplings',
      23: 'Rice Flour Crackers', 24: 'Khaja', 25: 'Shells', 26: 'Savory Snacks', 27: 'Sweet Shells', 28: 'Chickpea Flour Droplets', 29: 'Butter',
      30: 'Cow Ghee', 31: 'Coffee Powder', 32: 'Mango Pickles', 33: 'Ginger Pickles'
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
    const reviewsMap = generateReviewsForProducts(allProducts);
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
        buyerName: 'Jayanth Reddy',
        address: 'Plot 34, Kannur, Vijayawada',
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
        buyerName: 'Raju',
        address: 'Plot 2, Poranki, Vijayawada',
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
        status: 'delivered',
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

    const reviewsMap = generateReviewsForProducts(allProducts);

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

  // Generate 5-10 reviews per product leveraging quality rating for text context
  const generateReviewsForProducts = (productsList) => {
    const authors = ['Ravi Kumar','Anita Sharma','Suresh Reddy','Priya Singh','Deepak Verma','Lakshmi Devi','Arun Rao','Neha Patel','Vijay Kumar','Meera Joshi'];
    const phrases = [
      (name,label) => `Quality is ${label}. Very satisfied with ${name}.`,
      (name,label) => `Packaging was neat and ${label.toLowerCase()} quality in ${name}.`,
      (name,label) => `Received fresh and ${label.toLowerCase()} quality ${name}.`,
      (name,label) => `Price matches its ${label.toLowerCase()} performance.`,
      (name,label) => `Impressed by ${label.toLowerCase()} consistency of ${name}.`,
      (name,label) => `Delivery fast; ${label.toLowerCase()} quality maintained for ${name}.`
    ];
    const reviewsMap = {};
    productsList.forEach((prod) => {
      const quality = typeof prod.quality === 'number' ? prod.quality : (6 + Math.random() * 3);
      const labelFull = getQualityLabel(quality);
      const label = labelFull.replace(/^[⭐\s]+/, ''); // strip stars for sentence use
      const count = 5 + Math.floor(Math.random() * 6); // 5-10 reviews
      const arr = [];
      for (let i = 1; i <= count; i++) {
        const author = authors[(i + (prod.id % authors.length)) % authors.length];
        const makeText = phrases[(i + (prod.id % phrases.length)) % phrases.length];
        arr.push({
          id: `${prod.id}-r${i}`,
          author,
          text: makeText(prod.name, label),
          likes: Math.floor(Math.random() * 11),
          rating: Math.round((quality + (Math.random() * 0.6 - 0.3)) * 10) / 10
        });
      }
      reviewsMap[prod.id] = arr;
    });
    return reviewsMap;
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

  const ensureRazorpayScript = () => {
    if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
    if (window.Razorpay) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-rzp]');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Script load error')));
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.async = true;
      s.defer = true;
      s.dataset.rzp = '1';
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.head.appendChild(s);
    });
  };

  const openRazorpayPayment = ({ amount, name, contact, notes, orderId, onSuccess, onDismiss }) => {
    if (paymentBusy) { pushToast('Payment already in progress...', 'info'); return; }
    setPaymentBusy(true);
    const finish = () => setPaymentBusy(false);
    const startTs = Date.now();
    ensureRazorpayScript()
      .then(() => {
        const amt = Math.max(100, Math.round((amount || 0) * 100));
        const isPlaceholderKey = !RZP_KEY || RZP_KEY === 'rzp_test_1234567890abcdef';
        if (!window.Razorpay || isPlaceholderKey) {
          pushToast('Payment setup incomplete. Configure Razorpay key/env.', 'error');
          finish();
          return;
        }
        // Log initiation on order if available
        if (orderId) {
          setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentEvents: [ ...(o.paymentEvents||[]), { type:'initiated', at:new Date().toISOString(), amount: amt/100 } ] } : o));
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
          handler: (response) => {
            pushToast('Payment success', 'success');
            if (orderId) {
              setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus:'paid', paymentAt:new Date().toISOString(), paymentEvents:[ ...(o.paymentEvents||[]), { type:'success', at:new Date().toISOString(), ref: response.razorpay_payment_id } ] } : o));
            }
            if (typeof onSuccess === 'function') onSuccess(response);
            finish();
          },
          modal: {
            ondismiss: () => {
              pushToast('Payment window closed.', 'info');
              if (orderId) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentEvents:[ ...(o.paymentEvents||[]), { type:'cancelled', at:new Date().toISOString() } ] } : o));
              }
              if (typeof onDismiss === 'function') onDismiss();
              finish();
            }
          }
        };
        const rzp = new window.Razorpay(options);
        if (typeof rzp.on === 'function') {
          rzp.on('payment.failed', (resp) => {
            pushToast('Payment failed.', 'error');
            if (orderId) {
              setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentEvents:[ ...(o.paymentEvents||[]), { type:'failed', at:new Date().toISOString(), code: resp.error?.code } ] } : o));
            }
            if (typeof onDismiss === 'function') onDismiss();
            finish();
          });
        }
        rzp.open();
        // Safety timeout (e.g. user leaves open) after 5 minutes
        setTimeout(() => {
          if (paymentBusy) {
            pushToast('Payment session timed out.', 'warning');
            finish();
            if (orderId) {
              setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentEvents:[ ...(o.paymentEvents||[]), { type:'timeout', at:new Date().toISOString(), durationMs: Date.now()-startTs } ] } : o));
            }
          }
        }, 5 * 60 * 1000);
      })
      .catch(err => {
        pushToast('Unable to load payment module.', 'error');
        if (orderId) {
          setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentEvents:[ ...(o.paymentEvents||[]), { type:'script-error', at:new Date().toISOString(), msg: err.message } ] } : o));
        }
        finish();
      });
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
    const email = (farmerForm.email || '').trim().toLowerCase();
    const password = (farmerForm.password || '').trim();
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) errors.email = 'Please enter a valid email address.';
    if (!password) errors.password = 'Please enter your password.';
    setFarmerFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    let farmers = [];
    try { farmers = JSON.parse(localStorage.getItem('agri_farmers') || '[]'); } catch { farmers = []; }
    const found = farmers.find(f => f.username === email);
    if (!found) {
      setFarmerFormErrors({ email: 'No account found for this email. Please register.' });
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
    const email = (farmerForm.email || '').trim().toLowerCase();
    const password = (farmerForm.password || '').trim();
    const confirmPassword = (farmerForm.confirmPassword || '').trim();
    const location = (farmerForm.location || '').trim();
    const contact = (farmerForm.contact || '').trim();

    const errors = {};
    if (!fullname || fullname.length < 3) errors.fullname = 'Please enter your full name (at least 3 characters).';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Please enter a valid email address.';
    if (!location) errors.location = 'Please enter your village / district / state.';
    if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    if (contact && !/^[0-9]{10}$/.test(contact)) errors.contact = 'Please enter a valid 10-digit mobile number.';
    if (farmerCaptchaInput.trim() !== farmerCaptcha.a) errors.captcha = 'Incorrect answer to human check.';

    setFarmerFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const username = email;

    let farmers = [];
    try { farmers = JSON.parse(localStorage.getItem('agri_farmers') || '[]'); } catch { farmers = []; }
    if (farmers.find(f => f.username === username)) {
      setFarmerFormErrors({ email: 'An account with this email already exists. Please login.' });
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
    // Refresh CAPTCHA for next registration attempt
    setFarmerCaptcha(generateCaptcha());
    setFarmerCaptchaInput('');
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

  // Authentication handlers
  const handleLogin = (credentials) => {
    const user = { id: Date.now(), name: credentials?.name || credentials?.email || 'User', email: credentials?.email, role: 'user' };
    setIsAuthenticated(true);
    setCurrentUser(user);
    setCurrentPage('landing');
    return { success: true, user };
  };

  const handleRegister = (userData) => {
    const user = { id: Date.now(), name: userData?.name || userData?.email || 'User', email: userData?.email, role: 'user' };
    setIsAuthenticated(true);
    setCurrentUser(user);
    setCurrentPage('landing');
    return { success: true, user };
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('landing');
  };

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
              { title: '🛒 Buyer', desc: 'Login/Register then purchase products', page: 'buyer-auth' },
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

  else if (currentPage === 'buyer-auth') {
    const emailOk = (e) => /\S+@\S+\.\S+/.test((e||'').trim().toLowerCase());
    const setField = (k,v) => { setBuyerForm(prev => ({ ...prev, [k]: v })); setBuyerErrors(prev => ({ ...prev, [k]: undefined })); };

    const doLogin = () => {
      const email = (buyerForm.email||'').trim().toLowerCase();
      const password = (buyerForm.password||'').trim();
      const e = {};
      if (!emailOk(email)) e.email = 'Enter a valid email';
      if (!password) e.password = 'Enter password';
      setBuyerErrors(e); if (Object.keys(e).length) return;
      let buyers = [];
      try { buyers = JSON.parse(localStorage.getItem('agri_buyers')||'[]'); } catch { buyers = []; }
      const found = buyers.find(b => b.username === email);
      if (!found) { setBuyerErrors({ email: 'No account found. Please register.' }); return; }
      if (found.password !== password) { setBuyerErrors({ password: 'Incorrect password' }); return; }
      setCurrentUser({ id: found.id, role: 'buyer', name: found.name || found.username, username: found.username, contact: found.contact });
      setCurrentPage('marketplace');
      pushToast(`Welcome, ${found.name || found.username}!`, 'success');
    };

    const doRegister = () => {
      const email = (buyerForm.email||'').trim().toLowerCase();
      const password = (buyerForm.password||'').trim();
      const confirm = (buyerForm.confirmPassword||'').trim();
      const name = (buyerForm.name||'').trim();
      const e = {};
      if (!name || name.length < 2) e.name = 'Enter your name';
      if (!emailOk(email)) e.email = 'Enter a valid email';
      if (!password || password.length < 6) e.password = 'Min 6 characters';
      if (password !== confirm) e.confirmPassword = 'Passwords do not match';
      if (buyerCaptchaInput.trim() !== buyerCaptcha.a) e.captcha = 'Incorrect human check answer';
      setBuyerErrors(e); if (Object.keys(e).length) return;
      let buyers = [];
      try { buyers = JSON.parse(localStorage.getItem('agri_buyers')||'[]'); } catch { buyers = []; }
      if (buyers.find(b => b.username === email)) { setBuyerErrors({ email: 'Email already registered. Please login.' }); return; }
      const newBuyer = { id: Date.now(), username: email, password, name, role: 'buyer', createdAt: new Date().toISOString() };
      buyers.push(newBuyer);
      try { localStorage.setItem('agri_buyers', JSON.stringify(buyers)); } catch { void 0; }
      setCurrentUser({ id: newBuyer.id, role: 'buyer', name: newBuyer.name || newBuyer.username, username: newBuyer.username });
      setCurrentPage('marketplace');
      pushToast('Registration successful. Welcome!', 'success');
      setBuyerCaptcha(generateCaptcha());
      setBuyerCaptchaInput('');
    };

    return (
      <div className="body authPage">
        <div className="container compact" style={{maxWidth:'720px'}}>
          <div className="header">
            <h1 style={{color:'#667eea'}}>Buyer Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>

          <div style={{display:'flex', gap:'8px', marginBottom:'16px'}}>
            <button className={`btn ${buyerMode==='login' ? 'btnPrimary' : ''}`} onClick={()=>setBuyerMode('login')}>Login</button>
            <button className={`btn ${buyerMode==='register' ? 'btnPrimary' : ''}`} onClick={()=>setBuyerMode('register')}>Register</button>
          </div>

          {buyerMode==='login' ? (
            <div>
              <div className="formGroup">
                <label className="formLabel">Email</label>
                <input type="email" className="formInput" value={buyerForm.email} onChange={e=>setField('email', e.target.value)} placeholder="e.g. buyer@gmail.com" />
                {buyerErrors.email && <div style={{color:'#dc3545', marginTop:6}}>{buyerErrors.email}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Password</label>
                <input type="password" className="formInput" value={buyerForm.password} onChange={e=>setField('password', e.target.value)} placeholder="Enter your password" />
                {buyerErrors.password && <div style={{color:'#dc3545', marginTop:6}}>{buyerErrors.password}</div>}
              </div>
              <div style={{display:'flex', gap:'8px', marginTop:'10px'}}>
                <button className="btn btnSuccess" onClick={doLogin}>Login</button>
                <button className="btn" onClick={()=>{ setBuyerMode('register'); setBuyerErrors({}); }}>Go to Register</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="formGroup">
                <label className="formLabel">Name</label>
                <input type="text" className="formInput" value={buyerForm.name} onChange={e=>setField('name', e.target.value)} placeholder="Your name" />
                {buyerErrors.name && <div style={{color:'#dc3545', marginTop:6}}>{buyerErrors.name}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Email</label>
                <input type="email" className="formInput" value={buyerForm.email} onChange={e=>setField('email', e.target.value)} placeholder="e.g. buyer@gmail.com" />
                {buyerErrors.email && <div style={{color:'#dc3545', marginTop:6}}>{buyerErrors.email}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Password</label>
                <input type="password" className="formInput" value={buyerForm.password} onChange={e=>setField('password', e.target.value)} placeholder="Create a password (min 6 chars)" />
                {buyerErrors.password && <div style={{color:'#dc3545', marginTop:6}}>{buyerErrors.password}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Confirm Password</label>
                <input type="password" className="formInput" value={buyerForm.confirmPassword} onChange={e=>setField('confirmPassword', e.target.value)} placeholder="Repeat your password" />
                {buyerErrors.confirmPassword && <div style={{color:'#dc3545', marginTop:6}}>{buyerErrors.confirmPassword}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Human Check: {buyerCaptcha.q}</label>
                <div style={{display:'flex',gap:'8px'}}>
                  <input type="text" className="formInput" value={buyerCaptchaInput} onChange={e=>setBuyerCaptchaInput(e.target.value)} placeholder="Answer" />
                  <button type="button" className="btn" onClick={()=>{ setBuyerCaptcha(generateCaptcha()); setBuyerCaptchaInput(''); }}>↻</button>
                </div>
                {buyerErrors.captcha && <div style={{color:'#dc3545', marginTop:6}}>{buyerErrors.captcha}</div>}
              </div>
              <div style={{display:'flex', gap:'8px', marginTop:'10px'}}>
                <button className="btn btnSuccess" onClick={doRegister}>Register</button>
                <button className="btn" onClick={()=>{ setBuyerMode('login'); setBuyerErrors({}); }}>Back to Login</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }


  else if (currentPage === 'farmer-auth') {
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
                <label className="formLabel">Email</label>
                <input
                  type="email"
                  className="formInput"
                  value={farmerForm.email}
                  onChange={(e) => handleFarmerInput('email', e.target.value)}
                  placeholder="e.g. kumar@gmail.com"
                />
                {farmerFormErrors.email && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.email}</div>}
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
                <label className="formLabel">Mobile Number (optional)</label>
                <input
                  type="tel"
                  className="formInput"
                  value={farmerForm.contact}
                  onChange={(e) => handleFarmerInput('contact', e.target.value)}
                  placeholder="10-digit mobile number"
                />
                {farmerFormErrors.contact && <div style={{color: '#dc3545', fontSize: '0.9rem', marginTop: '6px'}}>{farmerFormErrors.contact}</div>}
              </div>
              <div className="formGroup">
                <label className="formLabel">Human Check: {farmerCaptcha.q}</label>
                <div style={{display:'flex',gap:'8px'}}>
                  <input type="text" className="formInput" value={farmerCaptchaInput} onChange={e=>setFarmerCaptchaInput(e.target.value)} placeholder="Answer" />
                  <button type="button" className="btn" onClick={()=>{ setFarmerCaptcha(generateCaptcha()); setFarmerCaptchaInput(''); }}>↻</button>
                </div>
                {farmerFormErrors.captcha && <div style={{color:'#dc3545', fontSize:'0.9rem', marginTop:'6px'}}>{farmerFormErrors.captcha}</div>}
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

  else if (currentPage === 'admin-auth') {
    const doLogin = () => {
      if (!adminName || !adminPass) { setAdminError('Enter admin email and password'); return; }
      if (adminName !== FIXED_ADMIN_USER || adminPass !== FIXED_ADMIN_PASS) {
        setAdminError('Invalid admin credentials');
        return;
      }
      setCurrentUser({ id: 'admin', role: 'admin', name: FIXED_ADMIN_USER });
      setCurrentPage('admin-dashboard');
    };
    return (
      <div className="body authPage">
        <div className="container compact" style={{maxWidth:'640px'}}>
          <div className="header">
            <h1 style={{color:'#667eea'}}>Admin Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div className="formGroup">
            <label className="formLabel">Admin Email</label>
            <input className="formInput" type="email" value={adminName} onChange={e=>setAdminName(e.target.value)} placeholder="Enter admin email" />
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input className="formInput" type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} placeholder="Enter password" />
          </div>
          {adminError && <div style={{color:'#dc3545', marginTop:6}}>{adminError}</div>}
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button className="btn btnSuccess" onClick={doLogin}>Login</button>
            <button className="btn" onClick={() => { setAdminName(''); setAdminPass(''); setAdminError(''); }}>Clear</button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard - view farmers and buyers including emails and passwords (demo only)
  else if (currentPage === 'admin-dashboard') {
    let farmers = [];
    try { farmers = JSON.parse(localStorage.getItem('agri_farmers') || '[]'); } catch { farmers = []; }
    let buyers = [];
    try { buyers = JSON.parse(localStorage.getItem('agri_buyers') || '[]'); } catch { buyers = []; }
    const seedDemoFarmers = () => {
      let list = [];
      try { list = JSON.parse(localStorage.getItem('agri_farmers') || '[]'); } catch { list = []; }
      if (list.length >= 12) { pushToast('Already have 12 or more farmers','info'); return; }
      const demoNames = [
        'Ravi Kumar','Lakshmi Devi','Suresh Reddy','Anita Sharma','Vikram Singh','Meera Patel',
        'Ashish Verma','Kavita Rao','Ramesh Kumar','Sita Devi','Anil Sharma','Uma Rao'
      ];
      const baseLocations = ['Guntur','Vijayawada','Nellore','Kurnool','Vizag','Tirupati','Kadapa','Anantapur','Ongole','Hyderabad','Warangal','Khammam'];
      for (let i = list.length; i < 12; i++) {
        const name = demoNames[i % demoNames.length];
        const email = name.toLowerCase().replace(/[^a-z]/g,'') + (i+1) + '@example.com';
        list.push({
          id: Date.now() + i,
          fullname: name,
          username: email,
          password: 'Farmer@' + String(1000 + i),
          location: baseLocations[i % baseLocations.length] + ', Andhra Pradesh',
          contact: '9' + String(900000000 + i).slice(1),
          role: 'farmer',
          createdAt: new Date().toISOString()
        });
      }
      try { localStorage.setItem('agri_farmers', JSON.stringify(list)); } catch { void 0; }
      setAdminSeedTick(t => t + 1);
      pushToast('Seeded demo farmers to reach 12','success');
    };
    // Reintroduced original dashboard analytics & product management data
    const pendingApproval = products.filter(p => p.status === 'approved' && !p.inMarketplace);
    // Active farmers now reflects registered farmers count (target: 12 demo + real)
    const uniqueFarmersCount = farmers.length;
    const pendingValueRequests = valueRequests.filter(r => r.status === 'pending');
    const inProgressValueRequests = valueRequests.filter(r => r.status === 'in-progress');
    const paidOrders = orders.filter(o => (o.paymentStatus || '') === 'paid');
    const groupByDate = {};
    paidOrders.forEach(o => {
      const when = (o.paymentAt || o.orderDate || new Date().toISOString()).slice(0,10);
      groupByDate[when] = groupByDate[when] || { revenue: 0, orders: 0 };
      groupByDate[when].revenue += (o.total || 0);
      groupByDate[when].orders += 1;
    });
    const costRate = 0.7;
    const salesByDate = Object.keys(groupByDate).sort((a,b) => b.localeCompare(a)).slice(0,7).map(date => ({
      date,
      revenue: groupByDate[date].revenue,
      cost: +(groupByDate[date].revenue * costRate).toFixed(2),
      profit: +(groupByDate[date].revenue * (1 - costRate)).toFixed(2),
      orders: groupByDate[date].orders
    }));
    return (
      <div className="body blurredPage" style={{minHeight:'100vh', padding:'20px'}}>
        <div className="container">
          <div className="header">
            <h1 style={{color:'#667eea'}}>Admin Dashboard</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div style={{display:'flex', gap:'10px', margin:'10px 0', flexWrap:'wrap'}}>
            <button className={`btn ${adminCredView==='farmers' ? 'btnPrimary' : ''}`} onClick={()=>setAdminCredView('farmers')}>Show Farmers Credentials</button>
            <button className={`btn ${adminCredView==='buyers' ? 'btnPrimary' : ''}`} onClick={()=>setAdminCredView('buyers')}>Show Buyers Credentials</button>
            <button className={`btn ${adminCredView==='employees' ? 'btnPrimary' : ''}`} onClick={()=>setAdminCredView('employees')}>Show Employee Credentials</button>
            <button className={`btn ${adminCredView==='delivery' ? 'btnPrimary' : ''}`} onClick={()=>setAdminCredView('delivery')}>Show Delivery Credentials</button>
            <button className={`btn ${adminCredView==='quality' ? 'btnPrimary' : ''}`} onClick={()=>setAdminCredView('quality')}>Show Quality Credentials</button>
            <button className="btn btnSecondary" onClick={seedDemoFarmers}>Ensure 12 Farmers</button>
          </div>
          {adminCredView === 'farmers' ? (
            <div className="card" style={{overflowX:'auto'}}>
              <h3>Registered Farmers</h3>
              {farmers.length === 0 ? (
                <p>No farmers registered.</p>
              ) : (
                <table style={{width:'100%', borderCollapse:'collapse'}}>
                  <thead>
                    <tr>
                      <th style={{textAlign:'left', padding:'8px'}}>Full Name</th>
                      <th style={{textAlign:'left', padding:'8px'}}>Email (Username)</th>
                      <th style={{textAlign:'left', padding:'8px'}}>Password</th>
                      <th style={{textAlign:'left', padding:'8px'}}>Location</th>
                      <th style={{textAlign:'left', padding:'8px'}}>Mobile</th>
                      <th style={{textAlign:'left', padding:'8px'}}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmers.map(f => (
                      <tr key={f.id} style={{borderTop:'1px solid #eee'}}>
                        <td style={{padding:'8px'}}>{f.fullname || ''}</td>
                        <td style={{padding:'8px'}}>{f.username || ''}</td>
                        <td style={{padding:'8px'}}>{f.password || ''}</td>
                        <td style={{padding:'8px'}}>{f.location || ''}</td>
                        <td style={{padding:'8px'}}>{f.contact || ''}</td>
                        <td style={{padding:'8px'}}>{f.createdAt ? new Date(f.createdAt).toLocaleString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : adminCredView === 'buyers' ? (
            <div className="card" style={{overflowX:'auto'}}>
              <h3>Registered Buyers</h3>
              {buyers.length === 0 ? (
                <p>No buyers registered.</p>
              ) : (
                <table style={{width:'100%', borderCollapse:'collapse'}}>
                  <thead>
                    <tr>
                      <th style={{textAlign:'left', padding:'8px'}}>Name</th>
                      <th style={{textAlign:'left', padding:'8px'}}>Email (Username)</th>
                      <th style={{textAlign:'left', padding:'8px'}}>Password</th>
                      <th style={{textAlign:'left', padding:'8px'}}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buyers.map(b => (
                      <tr key={b.id} style={{borderTop:'1px solid #eee'}}>
                        <td style={{padding:'8px'}}>{b.name || ''}</td>
                        <td style={{padding:'8px'}}>{b.username || ''}</td>
                        <td style={{padding:'8px'}}>{b.password || ''}</td>
                        <td style={{padding:'8px'}}>{b.createdAt ? new Date(b.createdAt).toLocaleString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : adminCredView === 'employees' ? (
            <div className="card" style={{overflowX:'auto'}}>
              <h3>Verification Employees</h3>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr>
                    <th style={{textAlign:'left', padding:'8px'}}>ID</th>
                    <th style={{textAlign:'left', padding:'8px'}}>Name</th>
                    <th style={{textAlign:'left', padding:'8px'}}>Password</th>
                    <th style={{textAlign:'left', padding:'8px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(EMPLOYEE_CREDENTIALS).map(([id, info]) => (
                    <tr key={id} style={{borderTop:'1px solid #eee'}}>
                      <td style={{padding:'8px'}}>{id}</td>
                      <td style={{padding:'8px'}}>{info.name}</td>
                      <td style={{padding:'8px'}}>{info.password}</td>
                      <td style={{padding:'8px'}}>
                        <button type="button" className="btn" style={{marginRight:'6px'}} onClick={async () => { const ok = await copyToClipboard(`${id} / ${info.password}`); if(!ok) pushToast('Unable to copy. Long press & select manually.', 'error'); }}>Copy</button>
                        <button type="button" className="btn btnPrimary" onClick={() => { addNotification(id, `Your credentials: ${id} / ${info.password}`, 'info'); pushToast(`Credentials sent to ${info.name}`, 'success'); }}>Send</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : adminCredView === 'delivery' ? (
            <div className="card" style={{overflowX:'auto'}}>
              <h3>Delivery Personnel Credentials</h3>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr>
                    <th style={{textAlign:'left', padding:'8px'}}>ID</th>
                    <th style={{textAlign:'left', padding:'8px'}}>Name</th>
                    <th style={{textAlign:'left', padding:'8px'}}>Region</th>
                    <th style={{textAlign:'left', padding:'8px'}}>Phone</th>
                    <th style={{textAlign:'left', padding:'8px'}}>Password</th>
                    <th style={{textAlign:'left', padding:'8px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(DELIVERY_CREDENTIALS).map(([id, info]) => (
                    <tr key={id} style={{borderTop:'1px solid #eee'}}>
                      <td style={{padding:'8px'}}>{id}</td>
                      <td style={{padding:'8px'}}>{info.name}</td>
                      <td style={{padding:'8px'}}>{info.region}</td>
                      <td style={{padding:'8px'}}>{info.phone}</td>
                      <td style={{padding:'8px'}}>{info.password}</td>
                      <td style={{padding:'8px'}}>
                        <button type="button" className="btn" style={{marginRight:'6px'}} onClick={async () => { const ok = await copyToClipboard(`${id} / ${info.password}`); if(!ok) pushToast('Unable to copy. Long press & select manually.', 'error'); }}>Copy</button>
                        <button type="button" className="btn btnPrimary" onClick={() => { addNotification(id, `Your credentials: ${id} / ${info.password}`, 'info'); pushToast(`Credentials sent to ${info.name}`, 'success'); }}>Send</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card" style={{overflowX:'auto'}}>
              <h3>Quality Team Credentials</h3>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr>
                    <th style={{textAlign:'left', padding:'8px'}}>ID</th>
                    <th style={{textAlign:'left', padding:'8px'}}>Name</th>
                    <th style={{textAlign:'left', padding:'8px'}}>Password</th>
                    <th style={{textAlign:'left', padding:'8px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(QUALITY_CREDENTIALS).map(([id, info]) => (
                    <tr key={id} style={{borderTop:'1px solid #eee'}}>
                      <td style={{padding:'8px'}}>{id}</td>
                      <td style={{padding:'8px'}}>{info.name}</td>
                      <td style={{padding:'8px'}}>{info.password}</td>
                      <td style={{padding:'8px'}}>
                        <button type="button" className="btn" style={{marginRight:'6px'}} onClick={async () => { const ok = await copyToClipboard(`${id} / ${info.password}`); if(!ok) pushToast('Unable to copy. Long press & select manually.', 'error'); }}>Copy</button>
                        <button type="button" className="btn btnPrimary" onClick={() => { addNotification(id, `Your credentials: ${id} / ${info.password}`, 'info'); pushToast(`Credentials sent to ${info.name}`, 'success'); }}>Send</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <hr style={{margin:'24px 0'}} />
          {/* Analytics Summary */}
          <div className="dashboardGrid">
            <div className="card"><h3>Total Products</h3><p style={{fontSize:'2rem',fontWeight:'bold',color:'#667eea'}}>{products.length}</p></div>
            <div className="card"><h3>Pending Marketplace</h3><p style={{fontSize:'2rem',fontWeight:'bold',color:'#ffa500'}}>{pendingApproval.length}</p></div>
            <div className="card"><h3>Active Farmers</h3><p style={{fontSize:'2rem',fontWeight:'bold',color:'#28a745'}}>{uniqueFarmersCount}</p></div>
            <div className="card"><h3>Total Orders</h3><p style={{fontSize:'2rem',fontWeight:'bold',color:'#764ba2'}}>{orders.length}</p></div>
          </div>
          <div style={{marginTop:'24px'}}>
            <h3>Sales & Finance (recent days)</h3>
            {salesByDate.length === 0 ? <p>No paid sales yet.</p> : (
              <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                {salesByDate.map(s => (
                  <div key={s.date} className="card" style={{minWidth:'180px'}}>
                    <h4>{s.date}</h4>
                    <p style={{margin:'6px 0'}}><strong>Revenue:</strong> ₹{s.revenue}</p>
                    <p style={{margin:'6px 0'}}><strong>Est. Cost:</strong> ₹{s.cost}</p>
                    <p style={{margin:'6px 0'}}><strong>Profit:</strong> ₹{s.profit}</p>
                    <p style={{margin:'6px 0',color:'#666'}}><small>{s.orders} orders</small></p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{marginTop:'24px'}}>
            <h3>Assign Drivers (Orders Pending Assignment)</h3>
            {orders.filter(o => !o.deliveryPersonId && ['processing','shipped','shipping','out-for-delivery'].includes((o.status||'').toLowerCase())).length === 0 ? (
              <p>No orders require driver assignment.</p>
            ) : (
              <div className="adminGrid">
                {orders.filter(o => !o.deliveryPersonId && ['processing','shipped','shipping','out-for-delivery'].includes((o.status||'').toLowerCase())).map(o => {
                  const product = products.find(p => p.id === o.productId) || { name: 'Unknown' };
                  return (
                    <div key={o.id} className="card" style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
                      <div style={{flex:1}}>
                        <h4>Order #{o.id} — {product.name}</h4>
                        <p><strong>Buyer:</strong> {o.buyerName}</p>
                        <p><strong>Address:</strong> {o.address}</p>
                        <p><strong>Status:</strong> {(o.status||'processing').toUpperCase()}</p>
                        <div style={{display:'flex',gap:'8px',alignItems:'center',marginTop:'8px',flexWrap:'wrap'}}>
                          <select className="formInput" defaultValue="" onChange={(e) => {
                            const driverId = e.target.value;
                            if (!driverId) return;
                            const d = deliveryPersons.find(x => x.id === driverId) || {};
                            setOrders(prev => prev.map(ord => ord.id === o.id ? { ...ord, deliveryPersonId: d.id, deliveryPersonName: `${d.name} (${d.id})`, assignedAt: new Date().toISOString(), status: (ord.status || 'processing') } : ord));
                            addNotification(driverId, `New order assigned: #${o.id} (${product.name})`, 'info');
                            pushToast(`Driver assigned to order #${o.id}`, 'success');
                          }}>
                            <option value="" disabled>Assign Driver</option>
                            {deliveryPersons.map(d => (
                              <option key={d.id} value={d.id}>{d.name} ({d.region})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <h2 style={{marginTop:'30px'}}>Product Management</h2>
          <div style={{marginTop:8, marginBottom:12}}>
            <button className="btn" onClick={() => { if (!confirm('Randomize farmer names for local products?')) return; randomizeLocalFarmers(); }}>Randomize Local Farmers</button>
            <small style={{marginLeft:12,color:'#666'}}>Demo-only randomization of local product farmer names.</small>
          </div>
          {products.length === 0 ? <p>No products yet.</p> : (
            <div className="adminGrid">
              {products.map(p => (
                <div key={p.id} className="productCard">
                  <img src={p.image || 'https://via.placeholder.com/300x200'} alt={p.name} className="productImage" data-seed={p.id} onError={e=>handleImgError(e)} />
                  <h3>{p.name}</h3>
                  <p><strong>Farmer:</strong> {p.farmer}</p>
                  <p><strong>Quantity:</strong> {p.quantity} kg</p>
                  <p><strong>Price:</strong> ₹{p.price}/kg {p.discountPercent ? (<span style={{color:'#dc3545',marginLeft:8}}>({p.discountPercent}% → ₹{(p.price * (1 - p.discountPercent/100)).toFixed(2)}/kg)</span>) : null}</p>
                  <p><strong>Status:</strong> <span className={`statusBadge ${p.status === 'approved' ? 'statusApproved' : p.status === 'verified' ? 'statusVerified' : 'statusPending'}`}>{p.status.toUpperCase()}</span></p>
                  <p><strong>Verified:</strong> {p.verified ? '✓ Yes' : '✗ No'}</p>
                  <p><strong>Quality:</strong> {p.quality ? `${getQualityLabel(p.quality)} (${p.quality}/10)` : 'Not rated'}</p>
                  {(!p.verified) && (
                    <div className="card" style={{padding:'8px', marginTop:'8px'}}>
                      <div style={{fontWeight:'bold', marginBottom:6}}>Assign Verification Employee</div>
                      <div style={{display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap'}}>
                        <select className="formInput" value={p.assignedEmployeeId || ''} onChange={(e) => {
                          const eid = e.target.value || null;
                          setProducts(products.map(prod => prod.id === p.id ? { ...prod, assignedEmployeeId: eid } : prod));
                          if (eid) { addNotification(eid, `New product assigned for verification: ${p.name}`, 'info'); pushToast(`Assigned ${p.name} to ${eid} (employee)`, 'success'); }
                        }}>
                          <option value="">Assign employee...</option>
                          {Object.keys(EMPLOYEE_CREDENTIALS).map(id => (
                            <option key={id} value={id}>{id} — {EMPLOYEE_CREDENTIALS[id].name}</option>
                          ))}
                        </select>
                        {p.assignedEmployeeId && <span style={{color:'#666'}}>Assigned to: {p.assignedEmployeeId}</span>}
                      </div>
                    </div>
                  )}
                  {(p.verified && !p.quality) && (
                    <div className="card" style={{padding:'8px', marginTop:'8px'}}>
                      <div style={{fontWeight:'bold', marginBottom:6}}>Assign Quality Team</div>
                      <div style={{display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap'}}>
                        <select className="formInput" value={p.assignedQualityId || ''} onChange={(e) => {
                          const qid = e.target.value || null;
                          setProducts(products.map(prod => prod.id === p.id ? { ...prod, assignedQualityId: qid } : prod));
                          if (qid) { addNotification(qid, `Product ready for quality assessment: ${p.name}`, 'info'); pushToast(`Assigned ${p.name} to ${qid} (quality)`, 'success'); }
                        }}>
                          <option value="">Assign quality user...</option>
                          {Object.keys(QUALITY_CREDENTIALS).map(id => (
                            <option key={id} value={id}>{id} — {QUALITY_CREDENTIALS[id].name}</option>
                          ))}
                        </select>
                        {p.assignedQualityId && <span style={{color:'#666'}}>Assigned to: {p.assignedQualityId}</span>}
                      </div>
                    </div>
                  )}
                  <div style={{display:'flex',gap:'8px',marginTop:'8px',flexWrap:'wrap'}}>
                    {p.status === 'approved' && !p.inMarketplace && (
                      <button className="btn btnSuccess" style={{padding:'5px 10px',fontSize:'0.85rem'}} onClick={() => { setProducts(products.map(prod => prod.id === p.id ? { ...prod, inMarketplace: true } : prod)); pushToast('Product published to marketplace','success'); }}>✓ Publish</button>
                    )}
                    <button className="btn btnDanger" style={{padding:'5px 10px',fontSize:'0.85rem'}} onClick={() => { if (!confirm('Delete this product?')) return; setProducts(products.filter(prod => prod.id !== p.id)); pushToast('Product deleted','info'); }}>Delete</button>
                    <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                      <input type="number" min={0} max={90} placeholder="%" defaultValue={p.discountPercent || ''} id={`disc-${p.id}`} className="formInput" style={{width:'70px'}} />
                      <button className="btn" style={{padding:'5px 10px',fontSize:'0.75rem'}} onClick={() => { const v = parseFloat(document.getElementById(`disc-${p.id}`).value || '0'); if (isNaN(v)||v<0||v>90){ pushToast('Enter discount 0-90','error'); return; } setProducts(products.map(prod => prod.id===p.id?{...prod, discountPercent:v, discountedPrice:+(prod.price*(1-v/100)).toFixed(2)}:prod)); pushToast('Discount applied','success'); }}>Apply</button>
                      {/* Validation improved: blank/whitespace and NaN handled above */}
                    </div>
                      <div style={{marginTop:'8px'}}>
                        <button className="btn" onClick={()=>setOpenProductChats(prev=>prev.includes(p.id)? prev.filter(id=>id!==p.id): [...prev,p.id])}>{openProductChats.includes(p.id)?'Hide Chat':'Chat with Farmer'}</button>
                        {openProductChats.includes(p.id) && (
                          <div className="card" style={{marginTop:'8px'}}>
                            <h4>Farmer Chat</h4>
                            <div style={{maxHeight:'140px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'6px',marginBottom:'8px'}}>
                              {(chats.farmer?.[p.id]||[]).map(m => (
                                <div key={m.id} style={{background:m.fromRole==='admin'? '#e8f0fe':'#f1f3f4',padding:'6px 8px',borderRadius:'6px'}}>
                                  <strong>{m.fromRole==='admin'?'You':'Farmer'}:</strong> {m.text}
                                  <div style={{fontSize:'0.65rem',color:'#666'}}>{new Date(m.at).toLocaleTimeString()}</div>
                                </div>
                              ))}
                              {(chats.farmer?.[p.id]||[]).length===0 && <div style={{color:'#666'}}>No messages yet.</div>}
                            </div>
                            <div style={{display:'flex',gap:'6px'}}>
                              <input type="text" id={`chat-input-admin-${p.id}`} className="formInput" placeholder="Type a message" />
                              <button className="btn btnSuccess" onClick={()=>{ const el=document.getElementById(`chat-input-admin-${p.id}`); const txt=(el?.value||''); if(el) el.value=''; sendChatMessage({threadType:'farmer', key:p.id, text:txt, fromRole:'admin', fromId:currentUser?.username||'admin'}); }}>Send</button>
                            </div>
                          </div>
                        )}
                      </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <h3 style={{marginTop:'30px'}}>Pending Value-Addition Requests</h3>
          {pendingValueRequests.length === 0 ? <p>No pending requests.</p> : (
            pendingValueRequests.map(r => (
              <div key={r.id} style={{background:'#f8f9fa',padding:'10px',borderRadius:'8px',marginBottom:'8px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <strong>{r.serviceName}</strong> — {r.input} → {r.output} ({r.increase}) {r.productId ? <span style={{color:'#667eea'}}>• Product #{r.productId}</span> : ''}
                    <div style={{fontSize:'0.9rem',color:'#666'}}>Requested by: {r.farmerName} • {new Date(r.createdAt).toLocaleString()}</div>
                    {r.facilityId && (
                      <div style={{fontSize:'0.75rem',color:'#333'}}>Assigned: {VALUE_ADDITION_FACILITIES.find(f=>f.id===r.facilityId)?.name || r.facilityId}</div>
                    )}
                  </div>
                  <div style={{display:'flex',gap:'8px'}}>
                    <button className="btn btnSuccess" onClick={() => { setValueRequests(prev => prev.map(v => v.id === r.id ? { ...v, status:'approved', approvedAt:new Date().toISOString() } : v)); addNotification(r.farmerId, `Your request "${r.serviceName}" was approved.`, 'success'); pushToast('Request approved','success'); }}>Approve</button>
                    <button className="btn btnDanger" onClick={() => { setValueRequests(prev => prev.map(v => v.id === r.id ? { ...v, status:'rejected', rejectedAt:new Date().toISOString() } : v)); addNotification(r.farmerId, `Your request "${r.serviceName}" was rejected.`, 'info'); pushToast('Request rejected','info'); }}>Reject</button>
                    <select className="formInput" style={{minWidth:'160px'}} value={r.facilityId||''} onChange={(e)=>{ const fid=e.target.value; setValueRequests(prev=>prev.map(v=>v.id===r.id?{...v, facilityId:fid}:v)); }}>
                      <option value="">Assign Facility...</option>
                      {VALUE_ADDITION_FACILITIES.map(f=> <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                    <button className="btn" onClick={()=>{ if(!r.facilityId){ pushToast('Assign facility first','error'); return;} setValueRequests(prev=>prev.map(v=>v.id===r.id?{...v,status:'in-progress', startedAt:new Date().toISOString() }:v)); addNotification(r.farmerId, `Value-addition for \"${r.serviceName}\" started at facility.`, 'info'); pushToast('Marked in-progress','success'); }}>Start</button>
                  </div>
                </div>
              </div>
            ))
          )}
          <h3 style={{marginTop:'30px'}}>In-Progress Value-Addition</h3>
          {inProgressValueRequests.length === 0 ? <p>No active processing.</p> : (
            inProgressValueRequests.map(r => (
              <div key={r.id} style={{background:'#fff3cd',padding:'10px',borderRadius:'8px',marginBottom:'8px',border:'1px solid #ffeeba'}}>
                <strong>{r.serviceName}</strong> — {r.input} → {r.output} {r.productId ? <span style={{color:'#667eea'}}>• Product #{r.productId}</span> : ''}
                <div style={{fontSize:'0.85rem',color:'#555'}}>Started: {new Date(r.startedAt).toLocaleString()} • Facility: {VALUE_ADDITION_FACILITIES.find(f=>f.id===r.facilityId)?.name || r.facilityId || 'N/A'}</div>
                <div style={{display:'flex',gap:'8px',marginTop:'6px'}}>
                  <button className="btn btnSuccess" onClick={()=>{ setValueRequests(prev=>prev.map(v=>v.id===r.id?{...v,status:'completed', completedAt:new Date().toISOString() }:v)); addNotification(r.farmerId, `Value-addition for \"${r.serviceName}\" completed.`,'success'); pushToast('Marked completed','success'); }}>Complete</button>
                  <button className="btn btnDanger" onClick={()=>{ if(!confirm('Cancel this in-progress value-addition?')) return; setValueRequests(prev=>prev.map(v=>v.id===r.id?{...v,status:'cancelled', cancelledAt:new Date().toISOString() }:v)); addNotification(r.farmerId, `Value-addition for \"${r.serviceName}\" was cancelled.`,'info'); pushToast('Cancelled','info'); }}>Cancel</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
  
  else if (currentPage === 'farmer-dashboard') {
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
                      <div style={{marginTop:'8px'}}>
                        <button className="btn" onClick={()=>setOpenProductChats(prev=>prev.includes(p.id)? prev.filter(id=>id!==p.id): [...prev,p.id])}>{openProductChats.includes(p.id)?'Hide Chat':'Chat with Admin'}</button>
                        {openProductChats.includes(p.id) && (
                          <div className="card" style={{marginTop:'8px'}}>
                            <h4>Product Chat</h4>
                            <div style={{maxHeight:'140px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'6px',marginBottom:'8px'}}>
                              {(chats.farmer?.[p.id]||[]).map(m => (
                                <div key={m.id} style={{background:m.fromRole==='farmer'? '#e8f0fe':'#f1f3f4',padding:'6px 8px',borderRadius:'6px'}}>
                                  <strong>{m.fromRole==='farmer'?'You':'Admin'}:</strong> {m.text}
                                  <div style={{fontSize:'0.65rem',color:'#666'}}>{new Date(m.at).toLocaleTimeString()}</div>
                                </div>
                              ))}
                              {(chats.farmer?.[p.id]||[]).length===0 && <div style={{color:'#666'}}>No messages yet.</div>}
                            </div>
                            <div style={{display:'flex',gap:'6px'}}>
                              <input type="text" id={`chat-input-farmer-${p.id}`} className="formInput" placeholder="Type a message" />
                              <button className="btn btnSuccess" onClick={()=>{ const el=document.getElementById(`chat-input-farmer-${p.id}`); const txt=(el?.value||''); if(el) el.value=''; sendChatMessage({threadType:'farmer', key:p.id, text:txt, fromRole:'farmer', fromId:currentFarmerId}); }}>Send</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2>Your Orders</h2>
              {myOrders.filter(o=>o.status!=='completed').length===0 ? <p>No active orders.</p> : (
                myOrders.filter(o=>o.status!=='completed').map(o => {
                  const product = products.find(p=>p.id===o.productId)||{};
                  const hasChat = !!o.deliveryPersonId;
                  const expanded = openOrderChats.includes(o.id);
                  return (
                    <div id={`order-${o.id}`} key={o.id} className="productCard" style={{border: highlightId===o.id?'2px solid #667eea':undefined}}>
                      <img src={product.image||'https://via.placeholder.com/260x180'} alt={product.name} className="productImage" onError={e=>handleImgError(e)} />
                      <h3>Order #{o.id}</h3>
                      <p><strong>Product:</strong> {product.name}</p>
                      <p><strong>Quantity:</strong> {o.quantity} kg</p>
                      <p><strong>Amount:</strong> ₹{o.total}</p>
                      <p><strong>Status:</strong> {(o.status||'processing').toUpperCase()}</p>
                      <p><strong>Payment:</strong> {(o.paymentStatus||'pending').toUpperCase()} {o.paymentMethod?`(${o.paymentMethod.toUpperCase()})`:''}</p>
                      {o.estimatedDelivery && <p><strong>ETA:</strong> {o.estimatedDelivery}</p>}
                      {o.paymentStatus!=='paid' && (
                        <button className="btn btnPrimary" disabled={!isPaymentReady} title={!isPaymentReady?'UPI disabled':''} onClick={()=>{
                          if(!isPaymentReady){pushToast('UPI unavailable.','error');return;}
                          openRazorpayPayment({amount:o.total||0,name:currentBuyerName,contact:currentUser?.contact||'',notes:{orderId:String(o.id)},orderId:o.id,onSuccess:()=>{setOrders(prev=>prev.map(ord=>ord.id===o.id?{...ord,paymentStatus:'paid',paymentAt:new Date().toISOString()}:ord)); pushToast('Payment successful','success');}});
                        }}>Pay Now</button>
                      )}
                      {hasChat && (
                        <div style={{marginTop:'10px'}}>
                          <button className="btn" onClick={()=>setOpenOrderChats(prev=>prev.includes(o.id)? prev.filter(id=>id!==o.id): [...prev,o.id])}>{expanded? 'Hide Chat':'Chat with Delivery'}</button>
                          {expanded && (
                            <div className="card" style={{marginTop:'8px'}}>
                              <h4>Delivery Chat</h4>
                              <div style={{maxHeight:'150px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'6px',marginBottom:'8px'}}>
                                {(chats.delivery?.[o.id]||[]).map(m => (
                                  <div key={m.id} style={{background:m.fromRole==='buyer'?'#e8f0fe':'#f1f3f4',padding:'6px 8px',borderRadius:'6px'}}>
                                    <strong>{m.fromRole==='buyer'?'You':'Delivery'}:</strong> {m.text}
                                    <div style={{fontSize:'0.65rem',color:'#666'}}>{new Date(m.at).toLocaleTimeString()}</div>
                                  </div>
                                ))}
                                {(chats.delivery?.[o.id]||[]).length===0 && <div style={{color:'#666'}}>No messages yet.</div>}
                              </div>
                              <div style={{display:'flex',gap:'6px'}}>
                                <input type="text" id={`chat-input-buyer-${o.id}`} className="formInput" placeholder="Type a message" />
                                <button className="btn btnSuccess" onClick={()=>{ const el=document.getElementById(`chat-input-buyer-${o.id}`); const txt=(el?.value||''); if(el) el.value=''; sendChatMessage({threadType:'delivery', key:o.id, text:txt, fromRole:'buyer', fromId:currentBuyerId}); }}>Send</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
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
              <hr style={{margin:'28px 0'}} />
              <h3>Your Requests & Processing Status</h3>
              {valueRequests.filter(r=>r.farmerId === (currentUser?.username || currentUser?.fullname || currentUser?.name)).length === 0 ? (
                <p style={{marginTop:'10px'}}>No requests submitted yet.</p>
              ) : (
                valueRequests.filter(r=>r.farmerId === (currentUser?.username || currentUser?.fullname || currentUser?.name)).map(r => (
                  <div key={r.id} style={{background:'#f8f9fa',padding:'10px',borderRadius:'8px',marginBottom:'8px'}}>
                    <strong>{r.serviceName}</strong>
                    <div style={{fontSize:'0.8rem',color:'#555'}}>Status: <span style={{fontWeight:'bold'}}>{r.status}</span>{r.status==='in-progress' && r.facilityId ? ` @ ${VALUE_ADDITION_FACILITIES.find(f=>f.id===r.facilityId)?.name}`:''}{r.status==='completed' && r.completedAt ? ` • Completed ${new Date(r.completedAt).toLocaleString()}`:''}</div>
                    {r.startedAt && <div style={{fontSize:'0.7rem',color:'#666'}}>Started: {new Date(r.startedAt).toLocaleString()}</div>}
                    {r.facilityId && <div style={{fontSize:'0.7rem',color:'#666'}}>Facility City: {VALUE_ADDITION_FACILITIES.find(f=>f.id===r.facilityId)?.city}</div>}
                  </div>
                ))
              )}
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
                <label className="formLabel">Product Image (Geotagged)</label>
                <input type="file" id="new-product-image-file" accept="image/*" className="formInput" onChange={(e)=>handleNewProductFile(e.target.files?.[0])} />
                <div style={{marginTop:6,display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  <button type="button" className="btn btnSecondary" onClick={captureGeolocation}>Capture Location</button>
                  <button type="button" className="btn" onClick={()=>{ setNewProductImageData(null); setNewProductGeo(null); }}>Reset Media</button>
                </div>
                {newProductImageData && (
                  <div style={{marginTop:10}}>
                    <img src={newProductImageData} alt="Preview" style={{maxWidth:'100%',maxHeight:'160px',borderRadius:6,objectFit:'cover'}} />
                  </div>
                )}
                {newProductGeo && (
                  <small style={{display:'block',marginTop:6,color:'#666'}}>Location: {newProductGeo.latitude.toFixed(5)}, {newProductGeo.longitude.toFixed(5)} (±{Math.round(newProductGeo.accuracy)}m)</small>
                )}
                {!newProductGeo && <small style={{display:'block',marginTop:6,color:'#666'}}>Optional: capture geolocation to geotag product.</small>}
              </div>
              <div className="formGroup" style={{marginTop: '10px'}}>
                <label className="formLabel" style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <input type="checkbox" checked={newProductValueAdd} onChange={e=>{ setNewProductValueAdd(e.target.checked); if(!e.target.checked){ setNewProductValueAddService(''); } }} />
                  Request Value-Addition Service for this product
                </label>
                {newProductValueAdd && (
                  <div style={{marginTop:'8px'}}>
                    <select className="formInput" value={newProductValueAddService} onChange={e=>setNewProductValueAddService(e.target.value)}>
                      <option value="">Select a service...</option>
                      {VALUE_ADD_SERVICES.map(s=> <option key={s.name} value={s.name}>{s.name} ({s.increase})</option>)}
                    </select>
                    <small style={{display:'block',marginTop:6,color:'#666'}}>A request will be submitted to admin once product is added.</small>
                  </div>
                )}
              </div>
              <div className="formGroup">
                <label className="formLabel">Location</label>
                <input type="text" id="new-product-location" placeholder="Farm address" className="formInput" />
              </div>
              <button 
                className="btn"
                onClick={() => {
                  const nameEl = document.getElementById('new-product-name');
                  const qtyEl = document.getElementById('new-product-quantity');
                  const priceEl = document.getElementById('new-product-price');
                  const locEl = document.getElementById('new-product-location');
                  const name = (nameEl?.value || '').trim();
                  const qty = parseFloat((qtyEl?.value || '').trim());
                  const price = parseFloat((priceEl?.value || '').trim());
                  if (!name) { pushToast('Product name required','error'); return; }
                  if (!Number.isFinite(qty) || qty <= 0) { pushToast('Quantity must be > 0','error'); return; }
                  if (!Number.isFinite(price) || price <= 0) { pushToast('Price must be > 0','error'); return; }
                  if (qty > 100000) { pushToast('Quantity too large','error'); return; }
                  if (price > 100000) { pushToast('Price too large','error'); return; }
                  const newId = Date.now();
                  const newProduct = {
                    id: newId,
                    name,
                    quantity: qty,
                    price,
                    image: newProductImageData || 'https://via.placeholder.com/300x200',
                    mediaType: 'image',
                    geo: newProductGeo || null,
                    location: (locEl?.value || '').trim(),
                    farmer: (currentUser?.fullname || currentUser?.name || currentUser?.username),
                    status: 'pending',
                    verified: false,
                    verificationStatus: null,
                    assignedEmployeeId: null,
                    assignedQualityId: null,
                    quality: null
                  };
                  setProducts([...products, newProduct]);
                  if (newProductValueAdd && newProductValueAddService) {
                    const svc = VALUE_ADD_SERVICES.find(s=>s.name===newProductValueAddService);
                    const farmerId = currentUser?.username || currentUser?.fullname || currentUser?.name || 'unknown';
                    const newReq = {
                      id: newId + Math.floor(Math.random()*1000),
                      productId: newId,
                      serviceName: svc?.name || newProductValueAddService,
                      input: svc?.input,
                      output: svc?.output,
                      increase: svc?.increase,
                      time: svc?.time,
                      farmerId,
                      farmerName: currentUser?.fullname || currentUser?.name || farmerId,
                      status: 'pending',
                      createdAt: new Date().toISOString()
                    };
                    setValueRequests(prev => [newReq, ...prev]);
                    pushToast('Value-add request submitted with product.', 'success');
                  }
                  setActiveModal(null);
                  setNewProductImageData(null);
                  setNewProductGeo(null);
                  setNewProductValueAdd(false);
                  setNewProductValueAddService('');
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

  else if (currentPage === 'marketplace') {
    const marketProducts = products.filter(p => p.inMarketplace);
    return (
      <div className="body" style={{minHeight:'100vh',padding:'20px'}}>
        <div className="container market-compact">
          {!upiBannerHidden && (
            <div style={{background:'#f8d7da',color:'#721c24',border:'1px solid #f5c6cb',padding:'10px 12px',borderRadius:8,marginBottom:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <span aria-hidden="true">⚠️</span>
                <span>UPI payments are disabled. Please use Cash on Delivery.</span>
              </div>
              <button className="btn" onClick={() => { try { localStorage.setItem('upi_banner_hidden','1'); } catch {}; setUpiBannerHidden(true); }}>Hide</button>
            </div>
          )}
          <div className="header">
            <h1 style={{color:'#667eea'}}>🛒 Marketplace</h1>
            <div>
              {upiBannerHidden && (
                <button className="btn btnSecondary" style={{marginRight:'10px'}} onClick={() => { try { localStorage.removeItem('upi_banner_hidden'); } catch {}; setUpiBannerHidden(false); }}>Show UPI Notice</button>
              )}
              <button className="btn" style={{marginRight:'10px'}} onClick={() => setCurrentPage('buyer-orders')}>📦 My Orders</button>
              <button className="btn btnSecondary" style={{marginRight:'10px'}} onClick={() => setActiveModal('cart')}>🛒 Cart ({cart.reduce((a,c)=>a+(c.quantity||0),0)})</button>
              <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
            </div>
          </div>
          <div className="marketplaceGrid">
            {marketProducts.length === 0 ? (
              <p style={{textAlign:'center',padding:'40px'}}>No products available yet. Check back soon!</p>
            ) : (
              marketProducts.map(p => (
                <div key={p.id} className="productCard" style={{overflow:'hidden'}}>
                  {p.mediaType === 'pdf' && /\.pdf(\?|$)/i.test(p.image || '') ? (
                    <div style={{width:'100%',height:'180px',background:'#f5f5f5',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',cursor:'pointer'}} onClick={e => { e.stopPropagation(); setSelectedProduct(p); setActiveModal('image-view'); }}>
                      <span style={{fontSize:'2.5rem'}}>📄</span>
                      <span style={{marginTop:'4px',fontSize:'0.85rem'}}>PDF Document</span>
                    </div>
                  ) : (
                    <img src={p.image || 'https://via.placeholder.com/300x200'} alt={p.name} className="productImage" data-seed={p.id} onError={e => handleImgError(e)} onClick={e => { e.stopPropagation(); setSelectedProduct(p); setActiveModal('image-view'); }} style={{cursor:'pointer'}} />
                  )}
                  <div style={{padding:'15px'}}>
                    <h3>{p.name}</h3>
                    <p style={{color:'#666',margin:'10px 0'}}>By {p.farmer}</p>
                    <div style={{color:'#ffa500',fontSize:'1.2rem'}}>{getQualityLabel(p.quality)}</div>
                    {(p.quantity||0) > 0 ? <p style={{margin:'10px 0'}}><strong>Available:</strong> {p.quantity} kg</p> : <p style={{margin:'10px 0',color:'#dc3545',fontWeight:700}}>Out of stock</p>}
                    <div style={{fontSize:'1.1rem',marginTop:'8px'}}>
                      {p.discountedPrice ? (
                        <div>
                          <span style={{textDecoration:'line-through',color:'#999',marginRight:'8px'}}>₹{p.price}/kg</span>
                          <span style={{fontSize:'1.4rem',color:'#dc3545',fontWeight:700}}>₹{p.discountedPrice}/kg</span>
                        </div>
                      ) : (
                        <span style={{fontSize:'1.5rem',color:'#667eea',fontWeight:'bold'}}>₹{p.price}/kg</span>
                      )}
                    </div>
                    <p style={{fontSize:'0.9rem',color:'#666'}}><strong>Location:</strong> {p.location}</p>
                    <button className="btn" style={{width:'100%',marginTop:'10px'}} disabled={(p.quantity||0)<=0} onClick={()=>addToCart(p.id)}>{(p.quantity||0)<=0?'Out of stock':'Add to Cart'}</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {activeModal === 'cart' && (
          <div className="modal">
            <div className="modalContent cartModal" onClick={e => e.stopPropagation()}>
              <span style={{float:'right',fontSize:'1.5rem',cursor:'pointer',color:'#999'}} onClick={()=>setActiveModal(null)}>&times;</span>
              <h2>Shopping Cart</h2>
              {cart.length === 0 ? <p>Your cart is empty</p> : (
                <>
                  {cart.map(item => {
                    const product = products.find(p => p.id === item.productId) || {};
                    return (
                      <div key={item.productId} style={{display:'flex',gap:'15px',background:'#f8f9fa',padding:'15px',borderRadius:'8px',marginBottom:'10px',alignItems:'center'}}>
                        <img src={product.image || 'https://via.placeholder.com/80'} alt={product.name} style={{width:'80px',height:'80px',objectFit:'cover',borderRadius:'8px'}} onError={e=>handleImgError(e,true)} />
                        <div style={{flex:1}}>
                          <h3>{product.name}</h3>
                          <p>₹{item.price}/kg</p>
                          <div style={{marginTop:'10px'}}>
                            <button className="btn" style={{padding:'5px 10px',fontSize:'0.85rem'}} onClick={()=>updateCartQuantity(item.productId,-1)}>-</button>
                            <span style={{margin:'0 10px'}}>{item.quantity} kg</span>
                            <button className="btn" style={{padding:'5px 10px',fontSize:'0.85rem'}} disabled={(product.quantity||0)<=item.quantity} title={(product.quantity||0)<=item.quantity?'Max available reached':''} onClick={()=>updateCartQuantity(item.productId,1)}>+</button>
                            {(product.quantity||0)<=item.quantity && <span style={{marginLeft:8,fontSize:'0.85rem',color:'#666'}}>Max available reached</span>}
                          </div>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <p style={{fontSize:'1.2rem',fontWeight:'bold'}}>₹{(item.quantity*(item.price||0)).toFixed(2)}</p>
                          <button className="btn btnDanger" style={{padding:'5px 10px',fontSize:'0.85rem',marginTop:'10px'}} onClick={()=>removeFromCart(item.productId)}>Remove</button>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{background:'#667eea',color:'white',padding:'20px',borderRadius:'10px',marginTop:'20px'}}>
                    <h3>Total: ₹{cart.reduce((a,c)=>a+((c.quantity||0)*(c.price||0)),0)}</h3>
                    <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                      <button className="btn" style={{flex:'1 1 220px',marginTop:'10px'}} onClick={()=>{ if(cart.length===0){pushToast('Your cart is already empty','info');return;} setCart([]); pushToast('Cart cleared','info'); }}>Clear Cart</button>
                      <button className="btn btnSuccess" style={{flex:'2 1 320px',marginTop:'10px'}} onClick={()=>{ if(cart.length===0){pushToast('Your cart is empty','error');return;} setActiveModal('checkout'); }}>Proceed to Checkout</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeModal === 'checkout' && (
          <div className="modal">
            <div className="modalContent" onClick={e=>e.stopPropagation()}>
              <span style={{float:'right',fontSize:'1.5rem',cursor:'pointer',color:'#999'}} onClick={()=>setActiveModal(null)}>&times;</span>
              <h2>Checkout</h2>
              <p>Enter delivery details and payment method.</p>
              <div className="formGroup"><label className="formLabel">Full Name</label><input type="text" id="checkout-name" className="formInput" defaultValue={currentUser?.fullname || currentUser?.name || currentUser?.username || ''} /></div>
              <div className="formGroup"><label className="formLabel">Delivery Address</label><textarea id="checkout-address" className="formInput" rows={3} defaultValue={currentUser?.location || ''} /></div>
              <div className="formGroup"><label className="formLabel">Mobile Number</label><input type="tel" id="checkout-mobile" className="formInput" defaultValue={currentUser?.contact || ''} placeholder="10 digit mobile number" /></div>
              <div className="formGroup"><label className="formLabel">Payment Method</label><select id="checkout-payment" className="formInput" defaultValue="cod"><option value="upi" disabled={!isPaymentReady}>UPI {isPaymentReady?'':'(disabled)'}</option><option value="cod">Cash on Delivery</option></select></div>
              <button className="btn btnSuccess" onClick={()=>{
                const name=(document.getElementById('checkout-name').value||'').trim();
                const address=(document.getElementById('checkout-address').value||'').trim();
                const mobile=(document.getElementById('checkout-mobile').value||'').trim();
                const payment=(document.getElementById('checkout-payment').value||'cod');
                if(!name||!address||!mobile){pushToast('Please fill name, address and mobile number','error');return;}
                if(!/^[0-9]{10}$/.test(mobile)){pushToast('Enter valid 10-digit mobile','error');return;}
                const deliveryIds=['del-1','del-2','del-3'];
                const deliveryNames=['Raju (del-1)','Lakshmi (del-2)','Kumar (del-3)'];
                const makeOrder=item=>{const price=item.price||0;const rnd=Math.floor(Math.random()*deliveryIds.length);return {id:Date.now()+Math.floor(Math.random()*1000)+item.productId,productId:item.productId,quantity:item.quantity,total:(item.quantity||0)*price,buyerName:name,buyerId:(currentUser?.username||currentUser?.contact||name),address,contact:mobile,paymentMethod:payment,paymentStatus: payment==='upi'?'paid':'pending',paymentAt: payment==='upi'?new Date().toISOString():undefined,deliveryPersonId:deliveryIds[rnd],deliveryPersonName:deliveryNames[rnd],status:'processing',estimatedDelivery:generateETA(),orderDate:new Date().toISOString(),rating:null,review:null};};
                const newOrders=cart.map(makeOrder);
                setOrders(prev=>[...prev,...newOrders]);
                setLastPlacedOrderIds(newOrders.map(o=>o.id));
                setPurchasedProducts(prev=>{const list=[...prev]; cart.forEach(item=>{const prod=products.find(pp=>pp.id===item.productId)||{}; list.push({id:Date.now()+Math.floor(Math.random()*1000)+item.productId,productId:item.productId,name:prod.name,image:prod.image,quantity:item.quantity,price:item.price,buyerId:(currentUser?.username||currentUser?.contact||name),purchasedAt:new Date().toISOString()});}); return list;});
                setCart([]); setActiveModal(null); setCurrentUser(prev=>({...(prev||{}),name,contact:mobile,role:'buyer'})); setCurrentPage('buyer-orders'); pushToast('Order placed successfully!','success');PurchasedProducts(prev=>{const list=[...prev]; cart.forEach(item=>{const prod=products.find(pp=>pp.id===item.productId)||{}; list.push({id:Date.now()+Math.floor(Math.random()*1000)+item.productId,productId:item.productId,name:prod.name,image:prod.image,quantity:item.quantity,price:item.price,buyerId:(currentUser?.username||currentUser?.contact||name),purchasedAt:new Date().toISOString()});}); return list;});
                setCart([]); setActiveModal(null); setCurrentUser(prev=>({...(prev||{}),name,contact:mobile,role:'buyer'})); setCurrentPage('buyer-orders'); pushToast('Order placed successfully!','success');
              }}>Confirm Order</button>
            </div>
          </div>
        )}

        {activeModal === 'image-view' && selectedProduct && (
          <div className="modal">
            <div className="modalContent" onClick={e=>e.stopPropagation()} style={{maxWidth:'900px'}}>
              <span style={{float:'right',fontSize:'1.5rem',cursor:'pointer',color:'#999'}} onClick={()=>{ setActiveModal(null); setSelectedProduct(null); }}>&times;</span>
              <div style={{display:'flex',gap:'20px',alignItems:'flex-start',flexWrap:'wrap'}}>
                <div style={{flex:'1 1 480px'}}>
                  <img src={selectedProduct.image || 'https://via.placeholder.com/800x600'} alt={selectedProduct.name} style={{width:'100%',height:'auto',borderRadius:'8px'}} onError={e=>handleImgError(e)} />
                </div>
                <div style={{flex:'1 1 300px'}}>
                  <h2>{selectedProduct.name}</h2>
                  <p style={{color:'#666'}}><strong>Farmer:</strong> {selectedProduct.farmer}</p>
                  <p style={{color:'#666'}}><strong>Price:</strong> ₹{selectedProduct.price}/kg</p>
                  <p style={{color:'#666'}}><strong>Location:</strong> {selectedProduct.location}</p>
                </div>
              </div>
              <hr style={{margin:'20px 0'}} />
              <h3>Reviews</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                {(reviews[selectedProduct.id]||[]).map(r=> (
                  <div key={r.id} style={{display:'flex',alignItems:'center',gap:'10px',background:'#f8f9fa',padding:'10px',borderRadius:'8px'}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700}}>{r.author}</div>
                      <div style={{color:'#333'}}>{r.text}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <div style={{fontSize:'0.9rem'}}>{r.likes}</div>
                      <button className="btn" style={{padding:'6px 10px',fontSize:'0.9rem'}} onClick={()=>{ const liked=likedReviews.includes(r.id); setReviews(prev=>{const copy={...prev}; copy[selectedProduct.id]=copy[selectedProduct.id].map(rv=>rv.id===r.id?{...rv,likes:rv.likes+(liked?-1:1)}:rv); return copy;}); setLikedReviews(prev=> liked? prev.filter(id=>id!==r.id): [...prev,r.id]); }}>{likedReviews.includes(r.id)?'♥ Liked':'♡ Like'}</button>
                    </div>
                  </div>
                ))}
                {(reviews[selectedProduct.id]||[]).length === 0 && <p>No reviews yet for this product.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Training Page
  else if (currentPage === 'training') {
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

  
  else if (currentPage === 'buyer-orders') {
    const currentBuyerName = (currentUser?.fullname || currentUser?.name || currentUser?.username || 'Guest');
    const currentBuyerId = (currentUser?.username || currentUser?.contact || currentUser?.email || 'guest');
    const myOrders = orders.filter(o => o.buyerId === currentBuyerId || o.buyerName === currentBuyerName);
    return (
      <div className="body" style={{minHeight:'100vh',padding:'20px'}}>
        <div className="container compact">
          <div className="header">
            <h1 style={{color:'#667eea'}}>📦 My Orders</h1>
            <div>
              <button className="btn" style={{marginRight:'10px'}} onClick={()=>setCurrentPage('marketplace')}>🛒 Marketplace</button>
              <button className="btn" onClick={()=>setCurrentPage('landing')}>← Back</button>
            </div>
          </div>
          {lastPlacedOrderIds.length>0 && (
            <div style={{background:'#e8f0fe',color:'#1a73e8',padding:'8px 12px',borderRadius:8,marginBottom:12}}>
              Recent order IDs: {lastPlacedOrderIds.map(id=>`#${id}`).join(', ')}
            </div>
          )}
          {myOrders.length === 0 ? <p>No orders yet.</p> : (
            <div className="ordersList">
              <h3>Active Orders</h3>
              {myOrders.filter(o=>o.status!=='completed').length===0 ? <p>No active orders.</p> : (
                myOrders.filter(o=>o.status!=='completed').map(o => {
                  const product = products.find(p=>p.id===o.productId)||{};
                  return (
                    <div id={`order-${o.id}`} key={o.id} className="productCard" style={{border: highlightId===o.id?'2px solid #667eea':undefined}}>
                      <img src={product.image||'https://via.placeholder.com/260x180'} alt={product.name} className="productImage" onError={e=>handleImgError(e)} />
                      <h3>Order #{o.id}</h3>
                      <p><strong>Product:</strong> {product.name}</p>
                      <p><strong>Quantity:</strong> {o.quantity} kg</p>
                      <p><strong>Amount:</strong> ₹{o.total}</p>
                      <p><strong>Status:</strong> {(o.status||'processing').toUpperCase()}</p>
                      <p><strong>Payment:</strong> {(o.paymentStatus||'pending').toUpperCase()} {o.paymentMethod?`(${o.paymentMethod.toUpperCase()})`:''}</p>
                      {o.estimatedDelivery && <p><strong>ETA:</strong> {o.estimatedDelivery}</p>}
                      {o.paymentStatus!=='paid' && (
                        <button className="btn btnPrimary" disabled={!isPaymentReady} title={!isPaymentReady?'UPI disabled':''} onClick={()=>{
                          if(!isPaymentReady){pushToast('UPI unavailable.','error');return;}
                          openRazorpayPayment({amount:o.total||0,name:currentBuyerName,contact:currentUser?.contact||'',notes:{orderId:String(o.id)},onSuccess:()=>{setOrders(prev=>prev.map(ord=>ord.id===o.id?{...ord,paymentStatus:'paid',paymentAt:new Date().toISOString()}:ord)); pushToast('Payment successful','success');}});
                        }}>Pay Now</button>
                      )}
                    </div>
                  );
                })
              )}
              <h3 style={{marginTop:'20px'}}>Past Orders</h3>
              {myOrders.filter(o=>o.status==='completed').length===0 ? <p>No past orders.</p> : (
                myOrders.filter(o=>o.status==='completed').map(o => {
                  const product = products.find(p=>p.id===o.productId)||{};
                  const hasChat = !!o.deliveryPersonId;
                  const expanded = openOrderChats.includes(o.id);
                  return (
                    <div id={`order-${o.id}`} key={o.id} className="productCard" style={{border: highlightId===o.id?'2px solid #667eea':undefined}}>
                      <img src={product.image||'https://via.placeholder.com/260x180'} alt={product.name} className="productImage" onError={e=>handleImgError(e)} />
                      <h3>Order #{o.id}</h3>
                      <p><strong>Product:</strong> {product.name}</p>
                      <p><strong>Quantity:</strong> {o.quantity} kg</p>
                      <p><strong>Amount:</strong> ₹{o.total}</p>
                      <p><strong>Delivered:</strong> {o.deliveredAt? new Date(o.deliveredAt).toLocaleString():'N/A'}</p>
                      <p><strong>Payment:</strong> {(o.paymentStatus||'pending').toUpperCase()} {o.paymentMethod?`(${o.paymentMethod.toUpperCase()})`:''}</p>
                      <p><strong>Result:</strong> {o.deliveryResult? o.deliveryResult.toUpperCase():'N/A'}</p>
                      {o.rating ? <p><strong>Your Rating:</strong> {o.rating} / 5</p> : (o.deliveryResult==='success' || o.status==='delivered' || o.status==='completed') && (
                        <div style={{marginTop:'10px'}}>
                          <label className="formLabel">Rate delivery</label>
                          <div style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'6px'}}>
                            {[1,2,3,4,5].map(star => (
                              <button key={star} className={`btn ${ratingDrafts[o.id] >= star ? 'btnPrimary' : ''}`} style={{padding:'6px 8px'}} onClick={()=>setRatingDrafts(prev=>({...prev,[o.id]:star}))}>{ratingDrafts[o.id] >= star ? '★':'☆'}</button>
                            ))}
                            <span style={{marginLeft:'8px'}}>{ratingDrafts[o.id]?`${ratingDrafts[o.id]} / 5`:''}</span>
                          </div>
                          <div style={{marginTop:'8px'}}>
                            <textarea className="formInput" rows={3} value={reviewDrafts[o.id]||''} onChange={e=>setReviewDrafts(prev=>({...prev,[o.id]:e.target.value}))} placeholder="Share your experience..." />
                          </div>
                          <button className="btn btnSuccess" style={{marginTop:'8px'}} onClick={()=>{ const rating=ratingDrafts[o.id]||0; const reviewText=(reviewDrafts[o.id]||'').trim(); if(!rating){pushToast('Select 1-5 stars','error'); return;} setOrders(prev=>prev.map(ord=>ord.id===o.id?{...ord,rating,review:reviewText}:ord)); setReviews(prev=>{const copy={...prev}; const list=copy[o.productId]? [...copy[o.productId]]: []; const newRev={id:`${o.productId}-u-${Date.now()}`,author:currentBuyerName,text:reviewText,likes:0}; copy[o.productId]=[newRev,...list]; return copy;}); setRatingDrafts(prev=>{const c={...prev}; delete c[o.id]; return c;}); setReviewDrafts(prev=>{const c={...prev}; delete c[o.id]; return c;}); pushToast('Feedback saved','success'); }}>Submit Review & Rating</button>
                        </div>
                      )}
                      {hasChat && (
                        <div style={{marginTop:'10px'}}>
                          <button className="btn" onClick={()=>setOpenOrderChats(prev=>prev.includes(o.id)? prev.filter(id=>id!==o.id): [...prev,o.id])}>{expanded? 'Hide Chat':'Chat with Delivery'}</button>
                          {expanded && (
                            <div className="card" style={{marginTop:'8px'}}>
                              <h4>Delivery Chat</h4>
                              <div style={{maxHeight:'140px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'6px',marginBottom:'8px'}}>
                                {(chats.delivery?.[o.id]||[]).map(m => (
                                  <div key={m.id} style={{background:m.fromRole==='buyer'?'#e8f0fe':'#f1f3f4',padding:'6px 8px',borderRadius:'6px'}}>
                                    <strong>{m.fromRole==='buyer'?'You':'Delivery'}:</strong> {m.text}
                                    <div style={{fontSize:'0.65rem',color:'#666'}}>{new Date(m.at).toLocaleTimeString()}</div>
                                  </div>
                                ))}
                                {(chats.delivery?.[o.id]||[]).length===0 && <div style={{color:'#666'}}>No messages yet.</div>}
                              </div>
                              <div style={{display:'flex',gap:'6px'}}>
                                <input type="text" id={`chat-input-buyer-${o.id}`} className="formInput" placeholder="Type a message" />
                                <button className="btn btnSuccess" onClick={()=>{ const el=document.getElementById(`chat-input-buyer-${o.id}`); const txt=(el?.value||''); if(el) el.value=''; sendChatMessage({threadType:'delivery', key:o.id, text:txt, fromRole:'buyer', fromId:currentBuyerId}); }}>Send</button>
                              </div>
                            </div>
                          )}
                        </div>
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

  else if (currentPage === 'employee-auth') {
    const loginEmployee = () => {
      const id = (employeeId || '').trim();
      const pass = (employeePass || '').trim();
      const errs = {};
      if (!id) errs.id = 'Enter employee ID';
      if (!pass) errs.password = 'Enter password';
      if (pass && !isStrongPassword(pass)) errs.password = 'Weak password (need upper/lower/digit/special 8+)';
      const creds = EMPLOYEE_CREDENTIALS[id];
      if (id && !creds) errs.id = 'Unknown employee ID';
      if (creds && pass && pass !== creds.password) errs.password = 'Incorrect password';
      setEmployeeErrors(errs);
      if (Object.keys(errs).length) return;
      setCurrentUser({ id, role: 'employee', name: creds.name });
      pushToast(`Welcome, ${creds.name}!`, 'success');
      setCurrentPage('employee-dashboard');
    };
    return (
      <div className="body authPage">
        <div className="container compact">
          <div className="header">
            <h1 style={{color:'#667eea'}}>Employee Verification Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div className="formGroup">
            <label className="formLabel">Employee ID</label>
            <input
              type="text"
              className="formInput"
              placeholder={`e.g., ${Object.keys(EMPLOYEE_CREDENTIALS)[0]}`}
              value={employeeId}
              onChange={e => { setEmployeeId(e.target.value); setEmployeeErrors(prev => ({ ...prev, id: undefined })); }}
            />
            {employeeErrors.id && <div style={{color:'#dc3545',marginTop:6,fontSize:'0.85rem'}}>{employeeErrors.id}</div>}
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input
              type="password"
              className="formInput"
              placeholder="Enter strong password"
              value={employeePass}
              onChange={e => { setEmployeePass(e.target.value); setEmployeeErrors(prev => ({ ...prev, password: undefined })); }}
            />
            {employeeErrors.password && <div style={{color:'#dc3545',marginTop:6,fontSize:'0.85rem'}}>{employeeErrors.password}</div>}
            <small style={{display:'block',marginTop:4,color:'#666'}}>8+ chars with A-Z, a-z, 0-9 & special char</small>
          </div>
          <div style={{display:'flex',gap:'10px',marginTop:'10px'}}>
            <button className="btn btnSuccess" onClick={loginEmployee}>Login</button>
            <button className="btn" onClick={() => { setEmployeeId(''); setEmployeePass(''); setEmployeeErrors({}); }}>Clear</button>
          </div>
          <div style={{marginTop:'14px',fontSize:'0.75rem',color:'#666'}}>
            Allowed IDs: {Object.keys(EMPLOYEE_CREDENTIALS).join(', ')}
          </div>
          {/* Demo credentials removed from UI for security. */}
        </div>
      </div>
    );
  }

  else if (currentPage === 'delivery-auth') {
    const attemptLogin = () => {
      const errors = {};
      const id = (deliveryId || '').trim();
      const pass = (deliveryPass || '').trim();
      if (!id) errors.id = 'Enter delivery ID';
      if (!pass) errors.password = 'Enter password';
      if (pass && !isStrongPassword(pass)) errors.password = 'Password must be 8+ chars incl. upper, lower, digit & special';
      const creds = DELIVERY_CREDENTIALS[id];
      if (id && !creds) errors.id = 'Unknown delivery ID';
      if (creds && pass && pass !== creds.password) errors.password = 'Incorrect password';
      if (deliveryCaptchaInput.trim() !== deliveryCaptcha.a) errors.captcha = 'Incorrect human check answer';
      setDeliveryErrors(errors);
      if (Object.keys(errors).length) return;
      setCurrentUser({ id, role: 'delivery', name: creds.name, contact: creds.phone, region: creds.region });
      pushToast(`Welcome, ${creds.name}!`, 'success');
      setCurrentPage('delivery-dashboard');
      setDeliveryCaptcha(generateCaptcha());
      setDeliveryCaptchaInput('');
    };
    return (
      <div className="body authPage">
        <div className="container compact">
          <div className="header">
            <h1 style={{color: '#667eea'}}>Delivery Personnel Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div className="formGroup">
            <label className="formLabel">Delivery ID</label>
            <input
              type="text"
              className="formInput"
              placeholder="e.g., vamsi"
              value={deliveryId}
              onChange={e => { setDeliveryId(e.target.value); setDeliveryErrors(prev => ({ ...prev, id: undefined })); }}
            />
            {deliveryErrors.id && <div style={{color:'#dc3545',marginTop:6,fontSize:'0.85rem'}}>{deliveryErrors.id}</div>}
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input
              type="password"
              className="formInput"
              placeholder="Enter strong password"
              value={deliveryPass}
              onChange={e => { setDeliveryPass(e.target.value); setDeliveryErrors(prev => ({ ...prev, password: undefined })); }}
            />
            {deliveryErrors.password && <div style={{color:'#dc3545',marginTop:6,fontSize:'0.85rem'}}>{deliveryErrors.password}</div>}
            <small style={{display:'block',marginTop:4,color:'#666'}}>Format: 8+ chars with A-Z, a-z, 0-9 & special char</small>
          </div>
          <div className="formGroup">
            <label className="formLabel">Human Check: {deliveryCaptcha.q}</label>
            <div style={{display:'flex',gap:'8px'}}>
              <input type="text" className="formInput" value={deliveryCaptchaInput} onChange={e=>setDeliveryCaptchaInput(e.target.value)} placeholder="Answer" />
              <button type="button" className="btn" onClick={()=>{ setDeliveryCaptcha(generateCaptcha()); setDeliveryCaptchaInput(''); }}>↻</button>
            </div>
            {deliveryErrors.captcha && <div style={{color:'#dc3545',marginTop:6,fontSize:'0.85rem'}}>{deliveryErrors.captcha}</div>}
          </div>
          <div style={{display:'flex',gap:'10px',marginTop:'10px'}}>
            <button className="btn btnSuccess" onClick={attemptLogin}>Login</button>
            <button className="btn" onClick={() => { setDeliveryId(''); setDeliveryPass(''); setDeliveryErrors({}); }}>Clear</button>
          </div>

        </div>
      </div>
    );
  }

  else if (currentPage === 'employee-dashboard') {
    const meId = currentUser?.id;
    const pendingProducts = products.filter(p => !p.verified && p.assignedEmployeeId === meId);

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
    const myNotifications = (notifications || []).filter(n => n.farmerId === myId).slice(0, 10);
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

          {myNotifications.length > 0 && (
            <div className="card" style={{marginBottom:'12px'}}>
              <h3>Notifications</h3>
              <ul style={{listStyle:'none', padding:0, margin:0}}>
                {myNotifications.map(n => (
                  <li key={n.id} style={{borderTop:'1px solid #eee', padding:'8px 0', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span>{n.message}</span>
                    <span style={{color:'#666', fontSize:'0.85rem'}}>{new Date(n.createdAt).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
                <div id={`order-${o.id}`} key={o.id} className="productCard" style={{position:'relative', border: highlightId===o.id ? '2px solid #667eea' : undefined}}>
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

  else if (currentPage === 'quality-auth') {
    const loginQuality = () => {
      const id = (qualityId || '').trim();
      const pass = (qualityPass || '').trim();
      const errs = {};
      if (!/^qual-\d+$/.test(id)) errs.id = 'ID must be qual-<number>';
      if (!pass) errs.password = 'Enter password';
      if (pass && !isStrongPassword(pass)) errs.password = 'Weak password';
      const creds = QUALITY_CREDENTIALS[id];
      if (!errs.id && !creds) errs.id = 'Unknown quality ID';
      if (creds && pass && pass !== creds.password) errs.password = 'Incorrect password';
      if (qualityCaptchaInput.trim() !== qualityCaptcha.a) errs.captcha = 'Incorrect human check answer';
      setQualityErrors(errs);
      if (Object.keys(errs).length) return;
      setCurrentUser({ id, role: 'quality', name: creds.name });
      pushToast(`Welcome, ${creds.name}!`, 'success');
      setCurrentPage('quality-dashboard');
      setQualityCaptcha(generateCaptcha());
      setQualityCaptchaInput('');
    };
    return (
      <div className="body authPage">
        <div className="container compact">
          <div className="header">
            <h1 style={{color:'#667eea'}}>Quality Team Portal</h1>
            <button className="btn" onClick={() => setCurrentPage('landing')}>← Back</button>
          </div>
          <div className="formGroup">
            <label className="formLabel">Quality Team ID</label>
            <input
              type="text"
              className="formInput"
              placeholder="e.g., qual-1"
              value={qualityId}
              onChange={e => { setQualityId(e.target.value); setQualityErrors(prev => ({ ...prev, id: undefined })); }}
            />
            {qualityErrors.id && <div style={{color:'#dc3545',marginTop:6,fontSize:'0.85rem'}}>{qualityErrors.id}</div>}
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <input
              type="password"
              className="formInput"
              placeholder="Enter strong password"
              value={qualityPass}
              onChange={e => { setQualityPass(e.target.value); setQualityErrors(prev => ({ ...prev, password: undefined })); }}
            />
            {qualityErrors.password && <div style={{color:'#dc3545',marginTop:6,fontSize:'0.85rem'}}>{qualityErrors.password}</div>}
            <small style={{display:'block',marginTop:4,color:'#666'}}>8+ chars with A-Z, a-z, 0-9 & special char</small>
          </div>
          <div className="formGroup">
            <label className="formLabel">Human Check: {qualityCaptcha.q}</label>
            <div style={{display:'flex',gap:'8px'}}>
              <input type="text" className="formInput" value={qualityCaptchaInput} onChange={e=>setQualityCaptchaInput(e.target.value)} placeholder="Answer" />
              <button type="button" className="btn" onClick={()=>{ setQualityCaptcha(generateCaptcha()); setQualityCaptchaInput(''); }}>↻</button>
            </div>
            {qualityErrors.captcha && <div style={{color:'#dc3545',marginTop:6,fontSize:'0.85rem'}}>{qualityErrors.captcha}</div>}
          </div>
          <div style={{display:'flex',gap:'10px',marginTop:'10px'}}>
            <button className="btn btnSuccess" onClick={loginQuality}>Login</button>
            <button className="btn" onClick={() => { setQualityId(''); setQualityPass(''); setQualityErrors({}); }}>Clear</button>
          </div>

        </div>
      </div>
    );
  }

  else if (currentPage === 'quality-dashboard') {
    const meId = currentUser?.id;
    const verifiedProducts = products.filter(p => p.verified && p.verificationStatus && !p.quality && p.assignedQualityId === meId);

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

  // (Removed duplicate admin-auth and metrics dashboard to avoid conflicts)

  // Delivery Dashboard (first occurrence)
  else if (currentPage === 'delivery-dashboard') {
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
                        <div style={{display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'10px'}}>
                          <select className="formInput" onChange={(e) => assignDriver(o.id, e.target.value)} defaultValue="">
                            <option value="" disabled>Assign Driver</option>
                            {deliveryPersons.map(d => (
                              <option key={d.id} value={d.id}>{d.name} ({d.region})</option>
                            ))}
                          </select>
                          <button className="btn" onClick={() => markOutForDelivery(o.id)}>Mark Out-for-Delivery</button>
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

                        <div style={{marginTop:'12px'}}>
                          <h4>Proof of Delivery</h4>
                          <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'8px', maxWidth:'420px'}}>
                            <div>
                              <label className="formLabel">Result</label>
                              <div style={{display:'flex', gap:'8px'}}>
                                <label style={{display:'flex', alignItems:'center', gap:'6px'}}>
                                  <input type="radio" name={`result-${o.id}`} checked={podDraft.result==='success'} onChange={()=>setPodDraft(prev=>({...prev, result:'success'}))} /> Success
                                </label>
                                <label style={{display:'flex', alignItems:'center', gap:'6px'}}>
                                  <input type="radio" name={`result-${o.id}`} checked={podDraft.result==='failed'} onChange={()=>setPodDraft(prev=>({...prev, result:'failed'}))} /> Failed
                                </label>
                              </div>
                            </div>
                            <div>
                              <label className="formLabel">Notes</label>
                              <input type="text" className="formInput" value={podDraft.notes} onChange={(e)=>setPodDraft(prev=>({...prev, notes:e.target.value}))} placeholder="Optional delivery notes" />
                            </div>
                            <div>
                              <label className="formLabel">Photo URL (optional)</label>
                              <input type="text" className="formInput" value={podDraft.photoUrl} onChange={(e)=>setPodDraft(prev=>({...prev, photoUrl:e.target.value}))} placeholder="Link to proof-of-delivery photo" />
                            </div>
                          </div>
                          <button className="btn btnSuccess" style={{marginTop:'10px'}} onClick={() => markDelivered(o.id)}>Mark Delivered</button>
                        </div>
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

  // Toast notifications display
  const toastDisplay = _toasts.length > 0 && (
    <div style={{position:'fixed',top:'20px',right:'20px',zIndex:9999,display:'flex',flexDirection:'column',gap:'8px'}}>
      {_toasts.map(toast => (
        <div key={toast.id} style={{background: toast.type==='success'?'#d4edda': toast.type==='error'?'#f8d7da': toast.type==='warning'?'#fff3cd':'#d1ecf1', color: toast.type==='success'?'#155724': toast.type==='error'?'#721c24': toast.type==='warning'?'#856404':'#0c5460', padding:'12px 16px', borderRadius:'6px', border:`1px solid ${toast.type==='success'?'#c3e6cb': toast.type==='error'?'#f5c6cb': toast.type==='warning'?'#ffeaa7':'#bee5eb'}`, maxWidth:'300px', wordWrap:'break-word'}}>
          {toast.message}
        </div>
      ))}
    </div>
  );

  // Declare pageContent variable
  let pageContent = null;

  if (currentPage === 'landing') {
    pageContent = (
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
              { title: '👨🌾 Farmer', desc: 'Register and sell your agricultural products', page: 'farmer-auth' },
              { title: '🔍 Verification Employee', desc: 'Verify farmer registrations and products', page: 'employee-auth' },
              { title: '⭐ Quality Team', desc: 'Assess product quality standards', page: 'quality-auth' },
              { title: '⚙️ Admin', desc: 'Manage export/import operations', page: 'admin-auth' },
              { title: '🚚 Delivery Personel', desc: 'Manage product deliveries', page: 'delivery-auth' },
              { title: '🛒 Buyer', desc: 'Login/Register then purchase products', page: 'buyer-auth' },
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

  // Default fallback
  if (!pageContent) {
    pageContent = <div>Page not found</div>;
  }

  return (
    <>
      {toastDisplay}
      {pageContent}
    </>
  );
};

export default AgriValueMarketplace;