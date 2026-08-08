/* ==========================================================================
   G. Saravana Agro Clinic - Comprehensive Dynamic i18n Translation Engine
   Supports Complete DOM & Dynamic UI Translation (English <-> Tamil)
   Persistent LocalStorage, Live Toggle & TreeWalker Text Node Replacement
   ========================================================================== */

const TRANSLATIONS = {
  en: {
    nav_home: "Home",
    nav_about: "About Us",
    nav_products: "Products",
    nav_services: "Services",
    nav_offers: "Offers",
    nav_gallery: "Gallery",
    nav_reviews: "Reviews",
    nav_blog: "Blog",
    nav_contact: "Contact",
    nav_cart: "Cart",
    nav_wishlist: "Wishlist",
    nav_login: "Login",
    btn_shop: "Shop Now",
    btn_contact: "Contact Us",
    btn_buy: "Buy Now",
    btn_add_cart: "Add to Cart",
    cat_all: "All Products",
    cat_fertilizers: "Fertilizers",
    cat_organic: "Organic Fertilizers",
    cat_bio: "Bio Fertilizers",
    cat_seeds: "Seeds",
    cat_pesticides: "Pesticides",
    cat_growth: "Plant Growth Promoters",
    cat_equipment: "Farming Equipment"
  },
  ta: {
    nav_home: "முகப்பு",
    nav_about: "எங்களைப் பற்றி",
    nav_products: "பொருட்கள்",
    nav_services: "சேவைகள்",
    nav_offers: "சலுகைகள்",
    nav_gallery: "புகைப்படங்கள்",
    nav_reviews: "மதிப்புரைகள்",
    nav_blog: "வலைப்பதிவு",
    nav_contact: "தொடர்பு கொள்ள",
    nav_cart: "கூடை",
    nav_wishlist: "விருப்பப்பட்டியல்",
    nav_login: "உள்நுழைவு",
    btn_shop: "இப்பொழுதே வாங்க",
    btn_contact: "தொடர்பு கொள்ள",
    btn_buy: "இப்பொழுதே வாங்கு",
    btn_add_cart: "கூடையில் சேர்",
    cat_all: "அனைத்து பொருட்கள்",
    cat_fertilizers: "உரங்கள்",
    cat_organic: "இயற்கை உரங்கள்",
    cat_bio: "உயிர் உரங்கள்",
    cat_seeds: "விதைகள்",
    cat_pesticides: "பூச்சிக்கொல்லிகள்",
    cat_growth: "வளர்ச்சி ஊக்கிகள்",
    cat_equipment: "விவசாய கருவிகள்"
  }
};

// Comprehensive Bidirectional Translation Dictionary (English <-> Tamil)
const DOM_TRANSLATE_MAP = {
  // Navigation & Headers
  "Home": "முகப்பு",
  "About Us": "எங்களைப் பற்றி",
  "Products": "பொருட்கள்",
  "Services": "சேவைகள்",
  "Offers": "சலுகைகள்",
  "Gallery": "புகைப்படங்கள்",
  "Reviews": "மதிப்புரைகள்",
  "Blog": "வலைப்பதிவு",
  "Contact": "தொடர்பு கொள்ள",
  "Cart": "கூடை",
  "Wishlist": "விருப்பப்பட்டியல்",
  "Login": "உள்நுழைவு",
  "User Login": "பயனர் உள்நுழைவு",
  "Admin Login": "அட்மின் உள்நுழைவு",
  "User / Farmer Login": "விவசாயி / பயனர் உள்நுழைவு",
  "Admin Portal Login": "அட்மின் போர்டல் உள்நுழைவு",
  "Return to Cart": "கூடைக்குத் திரும்புக",
  "Return to Store": "கடைக்குத் திரும்புக",
  "Admin Portal": "அட்மின் தளம்",
  "Agro Clinic Secure Checkout": "அக்ரோ கிளினிக் பாதுகாப்பான செக்அவுட்",
  "Theme": "தீம்",
  "Shop Products": "பொருட்களை வாங்க",
  "Shop Now": "இப்பொழுதே வாங்க",
  "Admin Entrance": "அட்மின் நுழைவு",
  "256-Bit SSL Encrypted Amazon-Grade Checkout": "256-பிட் SSL பாதுகாப்பான ஆன்லைன் கட்டணம்",

  // Topbar Helpline
  "Main Road, Cheranmahadevi, Tirunelveli, TN | Helpline & WhatsApp: +91 63791 20465": "பிரதான சாலை, சேரன்மகாதேவி, திருநெல்வேலி, தமிழ்நாடு | உதவி எண்: +91 63791 20465",
  
  // Hero & Badges
  "#1 Trusted Agricultural Store": "#1 நம்பகமான விவசாய கடை",
  "Your Trusted Agriculture Partner": "உங்கள் நம்பகமான விவசாய உர பங்குதாரர்",
  "Your Trusted Agriculture Fertilizer Partner": "உங்கள் நம்பகமான விவசாய உர பங்குதாரர்",
  "Quality Fertilizers, Certified Hybrid Seeds, Bio-Pesticides & Expert Farming Solutions tailored for maximum crop yield in Cheranmahadevi & Tirunelveli.": "தரமான உரங்கள், சான்றளிக்கப்பட்ட வீரிய விதைகள், உயிர் பூச்சிக்கொல்லிகள் & விவசாய தீர்வுகள்.",
  "Quality Fertilizers, Certified Hybrid Seeds, Bio-Pesticides & Expert Farming Solutions tailored for maximum crop yield.": "தரமான உரங்கள், சான்றளிக்கப்பட்ட வீரிய விதைகள், உயிர் பூச்சிக்கொல்லிகள் & விவசாய தீர்வுகள்.",

  // Statistics
  "Years Experience": "ஆண்டுகள் அனுபவம்",
  "Happy Farmers": "மகிழ்ச்சியான விவசாயிகள்",
  "Agri Products": "விவசாய பொருட்கள்",
  "Door Delivery": "வீட்டு விநியோகம்",

  // Section Headings & Badges
  "Top Selling Fertilizers & Inputs": "சிறந்த விற்பனை உரங்கள் & பொருட்கள்",
  "Our Expert Agriculture Services": "எங்களின் நிபுணர் விவசாய சேவைகள்",
  "1. Customer & Delivery Address": "1. வாடிக்கையாளர் & விநியோக முகவரி",
  "2. Payment Options": "2. கட்டண முறைகள்",
  "Order Summary": "ஆர்டர் சுருக்கம்",
  "STEP 1 OF 2": "படி 1 / 2",
  "STEP 2 OF 2": "படி 2 / 2",

  // Services
  "Soil Testing & Health Cards": "மண் பரிசோதனை & அட்டட்டை",
  "Digital soil testing for NPK levels, pH balance, and organic carbon count to suggest exact fertilizer dosing.": "NPK அளவுகள், pH காரத்தன்மை மற்றும் கரிம கார்பன் எண்ணிக்கையை கணக்கிடும் டிஜிட்டல் மண் பரிசோதனை.",
  "Crop Advisory": "பயிர் ஆலோசனை",
  "Personalized seasonal crop protection advice from senior agronomists to double harvest output.": "மகசூலை அதிகரிக்க மூத்த விவசாய விஞ்ஞானிகளின் பிரத்யேக பருவகால பயிர் பாதுகாப்பு ஆலோசனைகள்.",
  "Express Door Delivery": "விரைவு கதவு விநியோகம்",
  "Safe, fast tractor and truck delivery directly to your farmland across all surrounding rural sectors.": "உங்கள் விவசாய நிலத்திற்கு டிராக்டர் மற்றும் டிரக் மூலம் பாதுகாப்பான, விரைவான விநியோகம்.",

  // Offers Section
  "Get Flat 15% OFF on Organic Fertilizers & Seeds!": "இயற்கை உரங்கள் & விதைகளுக்கு 15% தள்ளுபடி பெறுங்கள்!",
  "Use promo code KISAAN15 at checkout. Offer valid for this harvesting season.": "KISAAN15 கூப்பனைப் பயன்படுத்தவும். இந்த அறுவடைப் பருவத்திற்கு மட்டுமே செல்லுபடியாகும்.",
  "Claim Discount Now": "தள்ளுபடியைப் பெறுங்கள்",

  // Product Categories
  "All Products": "அனைத்து பொருட்கள்",
  "Fertilizers": "உரங்கள்",
  "Organic Fertilizers": "இயற்கை உரங்கள்",
  "Bio Fertilizers": "உயிர் உரங்கள்",
  "Seeds": "விதைகள்",
  "Pesticides": "பூச்சிக்கொல்லிகள்",
  "Plant Growth Promoters": "வளர்ச்சி ஊக்கிகள்",
  "Farming Equipment": "விவசாய கருவிகள்",

  // Form Field Labels (Checkout & Contact & Auth)
  "FULL NAME *": "முழு பெயர் *",
  "Full Name *": "முழு பெயர் *",
  "MOBILE PHONE NUMBER *": "அலைபேசி எண் *",
  "Mobile Phone Number *": "அலைபேசி எண் *",
  "EMAIL ADDRESS *": "மின்னஞ்சல் முகவரி *",
  "Email Address *": "மின்னஞ்சல் முகவரி *",
  "DELIVERY ADDRESS (STREET / LAND PLOT) *": "விநியோக முகவரி (தெரு / நிலம்) *",
  "Delivery Address (Street / Land Plot) *": "விநியோக முகவரி (தெரு / நிலம்) *",
  "DISTRICT *": "மாவட்டம் *",
  "District *": "மாவட்டம் *",
  "STATE *": "மாநிலம் *",
  "State *": "மாநிலம் *",
  "PINCODE *": "அஞ்சல் குறியீடு *",
  "Pincode *": "அஞ்சல் குறியீடு *",

  // Payment Options
  "Instant UPI (Google Pay, PhonePe, Paytm)": "உடனடி UPI (கூகிள் பே, போன்பே, பேடிஎம்)",
  "Credit Card": "கிரெடிட் கார்டு",
  "Debit Card (All Banks & RuPay)": "டெபிட் கார்டு (அனைத்து வங்கிகள் & ரூபே)",
  "Net Banking": "நெட் பேங்கிங்",
  "Cash on Delivery (COD)": "நேரடி பணக் கட்டணம் (COD)",
  "Fastest": "மிக விரைவானது",
  "Pay at Farm": "நிலத்தில் செலுத்தலாம்",
  "Direct Bank Transfer": "நேரடி வங்கி பரிமாற்றம்",
  "RuPay / Visa / Master": "ரூபே / விசா / மாஸ்டர்",
  "Enter your UPI ID / VPA": "உங்கள் UPI ID / VPA ஐ உள்ளிடவும்",
  "Verify VPA": "VPA சரிபார்",
  "Verified Merchant: G. Saravana Agro Clinic": "சரிபார்க்கப்பட்ட வணிகர்: ஜி. சரவணா அக்ரோ கிளினிக்",
  "Secure Card Details": "பாதுகாப்பான கார்டு விவரங்கள்",
  "Card Holder Name *": "கார்டு வைத்திருப்பவர் பெயர் *",
  "Card Number (16 Digits) *": "கார்டு எண் (16 எண்கள்) *",
  "Expiry Date (MM/YY) *": "காலாவதி தேதி (MM/YY) *",
  "CVV / CVC (3 Digits) *": "CVV / CVC (3 எண்கள்) *",
  "Select Your Bank": "உங்கள் வங்கியைத் தேர்ந்தெடுக்கவும்",
  "Cash on Delivery Selected:": "நேரடி பணக் கட்டணம் தேர்ந்தெடுக்கப்பட்டது:",
  "Place Order Now": "இப்போது ஆர்டர் செய்யுங்கள்",

  // Buttons & Actions
  "Buy": "வாங்கு",
  "Buy Now": "இப்பொழுதே வாங்கு",
  "Add to Cart": "கூடையில் சேர்",
  "View Details": "விவரங்களைப் பார்க்க",
  "Apply Coupon": "கூப்பனைப் பயன்படுத்து",
  "Proceed to Checkout": "செக்அவுட்டிற்கு தொடரவும்",
  "Proceed to Pay": "பணம் செலுத்த தொடரவும்",
  "View Order History": "ஆர்டர் வரலாற்றைப் பார்க்க",
  "Download / Print Tax Invoice": "வரி இன்வாய்ஸை பதிவிறக்கம் செய்ய",
  "Clear Cart": "கூடையை காலியாக்கு",
  "Submit": "சமர்ப்பி",
  "Save Details": "விவரங்களை சேமி",

  // Footer & Links
  "Quick Links": "விரைவு இணைப்புகள்",
  "Customer Care": "வாடிக்கையாளர் சேவை",
  "Newsletter": "செய்திமடல்",
  "Subscribe": "சந்தா சேர",
  "All Rights Reserved.": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
  "Empowering farmers with high-potency chemical, bio, and organic fertilizers, premium seeds, and modern farming technology since 2011.": "2011 முதல் விவசாயிகள் மற்றும் விவசாய நிலங்களின் வளத்தை அதிகரிக்கும் நம்பகமான மையம்."
};

// Build Tamil to English reverse dictionary
const REVERSE_TRANSLATE_MAP = {};
for (const [enKey, taVal] of Object.entries(DOM_TRANSLATE_MAP)) {
  REVERSE_TRANSLATE_MAP[taVal] = enKey;
}

// 1. Get current language from LocalStorage
function getCurrentLanguage() {
  return localStorage.getItem('agri_lang') || 'en';
}

// 2. Set & apply language
function setLanguage(lang) {
  localStorage.setItem('agri_lang', lang);
  applyLanguageTranslations(lang);
}

// 3. Translation Helper Function: t(textOrKey)
function t(textOrKey) {
  const currentLang = getCurrentLanguage();
  if (currentLang === 'en') {
    return REVERSE_TRANSLATE_MAP[textOrKey] || textOrKey;
  } else {
    return DOM_TRANSLATE_MAP[textOrKey] || textOrKey;
  }
}

// 4. Core Translation Function for DOM
function applyLanguageTranslations(lang) {
  if (!lang) lang = getCurrentLanguage();
  localStorage.setItem('agri_lang', lang);
  
  const isTamil = (lang === 'ta');
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  const mapToUse = isTamil ? DOM_TRANSLATE_MAP : REVERSE_TRANSLATE_MAP;

  // A. Explicit data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        const icon = el.querySelector('i');
        if (icon) {
          el.innerHTML = icon.outerHTML + ' ' + dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    }
  });

  // B. Full Page Text Node Translator via TreeWalker
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_SKIP;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_SKIP;
        const tag = parent.tagName.toLowerCase();
        if (tag === 'script' || tag === 'style' || tag === 'code' || tag === 'noscript') return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach(node => {
    const originalText = node.nodeValue.trim();
    if (mapToUse[originalText]) {
      node.nodeValue = node.nodeValue.replace(originalText, mapToUse[originalText]);
    }
  });

  // C. Translate Input Placeholders
  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
    const p = el.placeholder.trim();
    if (mapToUse[p]) {
      el.placeholder = mapToUse[p];
    }
  });

  // D. Update Language Toggle Buttons across the UI
  document.querySelectorAll('#lang-toggle, .lang-toggle').forEach(langBtn => {
    langBtn.innerHTML = isTamil 
      ? '<i class="fa-solid fa-language me-1"></i> English / தமிழ்' 
      : '<i class="fa-solid fa-language me-1"></i> தமிழ் / EN';
  });

  // E. Dispatch Custom Event for dynamic components (Product list, Cart, Admin)
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// 5. Global Toggle Function
function toggleLanguage() {
  const current = getCurrentLanguage();
  const next = (current === 'en') ? 'ta' : 'en';
  setLanguage(next);
  
  if (typeof agriApp !== 'undefined' && agriApp.showToast) {
    agriApp.lang = next;
    agriApp.showToast(next === 'ta' ? 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது' : 'English language selected');
  }

  if (typeof renderProducts === 'function') renderProducts();
  if (typeof renderHomeProducts === 'function') renderHomeProducts();
  if (typeof renderCart === 'function') renderCart();
  if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
}

// 6. Auto-initialize and Document-Level Delegation
function initLangEngine() {
  const currentLang = getCurrentLanguage();
  applyLanguageTranslations(currentLang);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLangEngine);
} else {
  initLangEngine();
}

// Single document-level event listener for reliable language toggle
document.addEventListener('click', (e) => {
  const toggleBtn = e.target.closest('#lang-toggle, .lang-toggle');
  if (toggleBtn) {
    e.preventDefault();
    toggleLanguage();
  }
});
