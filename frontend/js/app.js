/* ==========================================================================
   G. Saravana Agro Clinic - Core Application Engine & E-Commerce Workflow
   Features: Cart, Wishlist, Buy Now Direct Checkout, Card Form Validation,
   GST Calculation, Multi-Step Payment Processing, Toast Manager.
   ========================================================================== */

const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'NPK 19-19-19 Water Soluble Fertilizer 1kg',
    nameTa: 'NPK 19-19-19 நீரில் கரையும் உரம்',
    category: 'Fertilizers',
    price: 450,
    originalPrice: 550,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
    description: '100% water soluble complex fertilizer containing equal proportions of Nitrogen, Phosphorus, and Potassium for healthy crop foliage and root growth.',
    descriptionTa: 'தாவரங்களின் வேர் மற்றும் இலை வளர்ச்சிக்கு ஏற்ற சமச்சீர் ஊட்டச்சத்து உரம்.',
    stock: 150,
    isBestSeller: true
  },
  {
    id: 'prod-2',
    name: 'Pure Organic Vermicompost 50kg',
    nameTa: 'இயற்கை மண்புழு உரம் 50கிலோ',
    category: 'Organic Fertilizers',
    price: 650,
    originalPrice: 800,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
    description: 'Enriched organic vermicompost packed with essential micronutrients, earthworm casts, and natural soil microbes to boost fertility.',
    descriptionTa: 'மண்ணின் வளத்தை அதிகரிக்கும் இயற்கை கரிம மண்புழு உரம்.',
    stock: 80,
    isBestSeller: true
  },
  {
    id: 'prod-3',
    name: 'Azospirillum Bio-Fertilizer (1 Liter)',
    nameTa: 'அசோஸ்பைரில்லம் உயிர் உரம் (1 லிட்டர்)',
    category: 'Bio Fertilizers',
    price: 220,
    originalPrice: 280,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80',
    description: 'Liquid bio-fertilizer containing atmospheric nitrogen-fixing bacteria suitable for Paddy, Sugarcane, and Pulses.',
    descriptionTa: 'காற்றிலுள்ள நைட்ரஜனை நிலைநிறுத்தும் திரவ உயிர் உரம்.',
    stock: 120,
    isBestSeller: false
  },
  {
    id: 'prod-4',
    name: 'Hybrid Paddy Seeds (CO-51) 10kg',
    nameTa: 'வீரிய ஒட்டு நெல் விதை (CO-51) 10கிலோ',
    category: 'Seeds',
    price: 950,
    originalPrice: 1100,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'High-yielding 110-day short duration paddy seed variety with pest resistance and high grain quality.',
    descriptionTa: 'அதிக மகசூல் தரும் 110 நாள் குறுவை நெல் ரகம்.',
    stock: 60,
    isBestSeller: true
  },
  {
    id: 'prod-5',
    name: 'Bio-Neem Oil Pest Guard 1L',
    nameTa: 'இயற்கை வேப்ப எண்ணெய் பூச்சிகொல்லி 1லி',
    category: 'Pesticides',
    price: 380,
    originalPrice: 450,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=600&q=80',
    description: 'Cold-pressed natural neem oil with 10000 PPM Azadirachtin. Controls sucking pests, caterpillars, and aphids effectively.',
    descriptionTa: 'பூச்சிகளை கட்டுப்படுத்தும் இயற்கை வேப்ப எண்ணெய் சாறு.',
    stock: 90,
    isBestSeller: false
  },
  {
    id: 'prod-6',
    name: 'Humic Acid Growth Booster 500ml',
    nameTa: 'ஹியூமிக் அமிலம் தாவர வளர்ச்சி ஊக்கி',
    category: 'Plant Growth Promoters',
    price: 340,
    originalPrice: 400,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    description: 'Concentrated liquid humic & fulvic acid that enhances root proliferation, nutrient uptake, and crop yields.',
    descriptionTa: 'வேர் வளர்ச்சியை தூண்டும் ஹியூமிக் திரவம்.',
    stock: 110,
    isBestSeller: true
  },
  {
    id: 'prod-7',
    name: '16L Battery Operated Knapsack Sprayer',
    nameTa: '16 லிட்டர் பேட்டரி தெளிப்பான்',
    category: 'Farming Equipment',
    price: 2850,
    originalPrice: 3400,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    description: 'Heavy duty 12V 8Ah battery sprayer with stainless steel lance, dual nozzles, and comfortable shoulder padding.',
    descriptionTa: 'அதிநவீன 16 லிட்டர் பேட்டரி பம்புகள்.',
    stock: 35,
    isBestSeller: true
  },
  {
    id: 'prod-8',
    name: 'DAP (Di-Ammonium Phosphate) 50kg',
    nameTa: 'டி.ஏ.பி உரம் 50கிலோ',
    category: 'Fertilizers',
    price: 1350,
    originalPrice: 1500,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    description: 'High phosphorus fertilizer providing 18% Nitrogen and 46% Phosphate for strong root establishment.',
    descriptionTa: 'வேர் வளர்ச்சிக்கு அவசியமான பாஸ்பரஸ் சத்து உரம்.',
    stock: 200,
    isBestSeller: true
  }
];

class AgriStore {
  constructor() {
    try {
      this.cart = JSON.parse(localStorage.getItem('agri_cart') || '[]');
    } catch(e) {
      this.cart = [];
    }
    try {
      this.wishlist = JSON.parse(localStorage.getItem('agri_wishlist') || '[]');
    } catch(e) {
      this.wishlist = [];
    }
    this.lang = localStorage.getItem('agri_lang') || 'en';
    this.isDarkMode = localStorage.getItem('agri_dark') === 'true';
    try {
      this.user = JSON.parse(localStorage.getItem('agri_user') || 'null');
    } catch(e) {
      this.user = null;
    }
    
    try {
      const stored = localStorage.getItem('agri_products');
      if (!stored || JSON.parse(stored).length === 0) {
        localStorage.setItem('agri_products', JSON.stringify(MOCK_PRODUCTS));
      }
    } catch(e) {
      localStorage.setItem('agri_products', JSON.stringify(MOCK_PRODUCTS));
    }
    
    this.init();
  }

  init() {
    this.applyDarkMode();
    this.updateCounters();
    this.initNavbarListeners();
    this.initUserSessionUI();

    if (typeof applyLanguageTranslations === 'function') {
      applyLanguageTranslations(this.lang);
    }
  }

  getProducts() {
    return JSON.parse(localStorage.getItem('agri_products') || '[]');
  }

  saveProducts(products) {
    localStorage.setItem('agri_products', JSON.stringify(products));
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('agri_dark', this.isDarkMode);
    this.applyDarkMode();
  }

  applyDarkMode() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  // ADD TO CART
  addToCart(productId, quantity = 1, showToastMsg = true) {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = this.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity });
    }

    localStorage.setItem('agri_cart', JSON.stringify(this.cart));
    this.updateCounters();
    if (showToastMsg) {
      const prodName = this.lang === 'ta' ? (product.nameTa || product.name) : product.name;
      this.showToast(this.lang === 'ta' ? `"${prodName}" கூடையில் சேர்க்கப்பட்டது!` : `Added "${prodName}" to Cart!`, 'success');
    }
  }

  // BUY NOW WORKFLOW DIRECT REDIRECT
  buyNow(productId, quantity = 1) {
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if product already in cart, update quantity or add it
    const existingIndex = this.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity });
    }

    localStorage.setItem('agri_cart', JSON.stringify(this.cart));
    this.updateCounters();
    
    // Redirect straight to checkout
    window.location.href = 'checkout.html';
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    localStorage.setItem('agri_cart', JSON.stringify(this.cart));
    this.updateCounters();
    this.showToast(this.lang === 'ta' ? `கூடையில் இருந்து நீக்கப்பட்டது` : `Item removed from Cart`, 'info');
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const item = this.cart.find(i => i.id === productId);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('agri_cart', JSON.stringify(this.cart));
      this.updateCounters();
    }
  }

  getCartSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getGSTAmount(subtotal, rate = 0.05) {
    return Math.round(subtotal * rate);
  }

  getDeliveryCharge(subtotal) {
    return subtotal >= 1000 || subtotal === 0 ? 0 : 50;
  }

  getGrandTotal(subtotal, couponDiscount = 0) {
    const gst = this.getGSTAmount(subtotal);
    const delivery = this.getDeliveryCharge(subtotal);
    return Math.max(0, subtotal + gst + delivery - couponDiscount);
  }

  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    const products = this.getProducts();
    const product = products.find(p => p.id === productId);

    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.showToast(this.lang === 'ta' ? `விருப்பப்பட்டியலிலிருந்து நீக்கப்பட்டது` : `Removed from Wishlist`, 'info');
    } else {
      this.wishlist.push(productId);
      if (product) {
        const prodName = this.lang === 'ta' ? (product.nameTa || product.name) : product.name;
        this.showToast(this.lang === 'ta' ? `"${prodName}" விருப்பப்பட்டியலில் சேர்க்கப்பட்டது!` : `Added "${prodName}" to Wishlist!`, 'success');
      }
    }

    localStorage.setItem('agri_wishlist', JSON.stringify(this.wishlist));
    this.updateCounters();
  }

  updateCounters() {
    const cartBadges = document.querySelectorAll('#cart-count-badge, .cart-count-badge');
    const wishlistBadges = document.querySelectorAll('#wishlist-count-badge, .wishlist-count-badge');
    
    const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);

    cartBadges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    });

    wishlistBadges.forEach(badge => {
      badge.textContent = this.wishlist.length;
      badge.style.display = this.wishlist.length > 0 ? 'inline-flex' : 'none';
    });
  }

  showToast(message, type = 'success') {
    let container = document.getElementById('agri-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'agri-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-agri';
    
    const iconClass = type === 'success' ? 'fa-circle-check text-warning' : type === 'info' ? 'fa-circle-info text-info' : 'fa-triangle-exclamation text-danger';
    
    toast.innerHTML = `
      <i class="fa-solid ${iconClass} fs-5"></i>
      <div style="flex-grow:1; font-weight:600;">${message}</div>
      <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#ffffff; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  initNavbarListeners() {
    const darkToggles = document.querySelectorAll('#dark-mode-toggle, .dark-mode-toggle');
    darkToggles.forEach(btn => {
      btn.addEventListener('click', () => this.toggleDarkMode());
    });

    window.addEventListener('languageChanged', (e) => {
      this.lang = e.detail ? e.detail.lang : (localStorage.getItem('agri_lang') || 'en');
      if (typeof renderProducts === 'function') renderProducts();
      if (typeof renderHomeProducts === 'function') renderHomeProducts();
    });
  }

  initUserSessionUI() {
    const user = this.user;
    const loginNavBtns = document.querySelectorAll('.nav-login-btn');
    const userProfileDropdowns = document.querySelectorAll('.user-profile-dropdown');

    if (user && (user.name || user.email)) {
      loginNavBtns.forEach(btn => btn.style.display = 'none');
      userProfileDropdowns.forEach(el => {
        el.style.display = 'inline-flex';
        const nameLabel = el.querySelector('.user-nav-name');
        if (nameLabel) nameLabel.textContent = user.name || user.email;
      });
    } else {
      loginNavBtns.forEach(btn => btn.style.display = 'inline-flex');
      userProfileDropdowns.forEach(el => el.style.display = 'none');
    }
  }

  requireAuth() {
    const user = localStorage.getItem('agri_user');
    const token = localStorage.getItem('agri_token');
    if (!user && !token) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  logoutUser() {
    // 1. Remove all auth & user specific localStorage keys
    localStorage.removeItem('agri_user');
    localStorage.removeItem('agri_token');
    localStorage.removeItem('agri_cart');
    localStorage.removeItem('agri_wishlist');
    localStorage.removeItem('agri_orders');
    localStorage.removeItem('agri_profile');
    localStorage.removeItem('agri_admin_authenticated');

    // 2. Clear SessionStorage completely
    try {
      sessionStorage.clear();
    } catch(e) {}

    // 3. Clear auth cookies
    try {
      document.cookie.split(";").forEach(c => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    } catch(e) {}

    // 4. Clear internal memory state
    this.user = null;
    this.cart = [];
    this.wishlist = [];

    // 5. Update UI
    this.updateCounters();
    this.initUserSessionUI();

    // 6. Notify and redirect to Login page
    this.showToast('Logged out successfully. Redirecting to Login...', 'info');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 500);
  }

  openQuickView(productId) {
    const products = this.getProducts();
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    const modalTitle = document.getElementById('qv-title');
    const modalImg = document.getElementById('qv-img');
    const modalCategory = document.getElementById('qv-category');
    const modalPrice = document.getElementById('qv-price');
    const modalOriginal = document.getElementById('qv-original');
    const modalDesc = document.getElementById('qv-desc');
    const modalAddBtn = document.getElementById('qv-add-btn');
    const modalBuyBtn = document.getElementById('qv-buy-btn');

    const name = this.lang === 'ta' ? (p.nameTa || p.name) : p.name;
    const desc = this.lang === 'ta' ? (p.descriptionTa || p.description) : p.description;

    if (modalTitle) modalTitle.textContent = name;
    if (modalImg) modalImg.src = p.image;
    if (modalCategory) modalCategory.textContent = p.category;
    if (modalPrice) modalPrice.textContent = `₹${p.price}`;
    if (modalOriginal) modalOriginal.textContent = p.originalPrice ? `₹${p.originalPrice}` : '';
    if (modalDesc) modalDesc.textContent = desc;

    if (modalAddBtn) {
      modalAddBtn.onclick = () => {
        this.addToCart(p.id, 1);
        const modalEl = document.getElementById('quickViewModal');
        if (modalEl && typeof bootstrap !== 'undefined') {
          const instance = bootstrap.Modal.getInstance(modalEl);
          if (instance) instance.hide();
        }
      };
    }

    if (modalBuyBtn) {
      modalBuyBtn.onclick = () => {
        this.buyNow(p.id, 1);
      };
    }

    const modalEl = document.getElementById('quickViewModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
}

// Global Card Formatting & Helper Functions
function formatCardNumber(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  let parts = [];
  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.substring(i, i + 4));
  }
  input.value = parts.join(' ');
}

function formatCardExpiry(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) {
    input.value = v.substring(0, 2) + '/' + v.substring(2, 4);
  } else {
    input.value = v;
  }
}

function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (input && icon) {
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'fa-solid fa-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'fa-solid fa-eye';
    }
  }
}

// Global App Instance
const agriApp = new AgriStore();
window.agriStore = agriApp;

