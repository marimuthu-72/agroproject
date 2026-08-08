/* Admin Dashboard Logic & Auth Protection */

// Enforce Secure Admin Authentication Check for all Admin Pages
(async function checkAdminAuth() {
  const isLoginPage = window.location.pathname.endsWith('login.html');
  const token = localStorage.getItem('agri_admin_token');
  const isAuth = localStorage.getItem('agri_admin_authenticated') === 'true';

  if (!isLoginPage) {
    if (!token || !isAuth) {
      adminLogout();
      return;
    }

    try {
      const response = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        adminLogout();
      }
    } catch (e) {
      // If network offline or backend unreachable, verify token presence
      if (!token) adminLogout();
    }
  }
})();

function adminLogout() {
  localStorage.removeItem('agri_admin_authenticated');
  localStorage.removeItem('agri_admin_token');
  localStorage.removeItem('agri_admin_user');
  localStorage.removeItem('agri_user');
  localStorage.removeItem('agri_token');
  try { sessionStorage.clear(); } catch(e) {}
  try {
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  } catch(e) {}
  window.location.href = 'login.html';
}

// Seed default live orders only if never set
function getStoredLiveOrders() {
  let orders = [];
  try {
    const stored = localStorage.getItem('agri_orders');
    if (stored !== null) {
      return JSON.parse(stored);
    }
  } catch(e) {
    orders = [];
  }

  orders = [
    {
      id: 'ORD-9821',
      txnId: 'TXN_AGRI_982101',
      date: '2026-07-28',
      customerName: 'Ramanathan K.',
      customerPhone: '+91 98421 11223',
      customerEmail: 'ramanathan@farm.in',
      customerAddress: 'Main Canal Bank Road, Cheranmahadevi, Tirunelveli',
      items: [
        { name: 'NPK 19-19-19 Fertilizer', quantity: 2, price: 450 },
        { name: 'Vermicompost 50kg', quantity: 1, price: 650 }
      ],
      subtotal: 1550,
      gst: 78,
      deliveryCharge: 0,
      total: 1628,
      paymentMethod: 'Cash on Delivery (COD)',
      paymentStatus: 'PENDING_COD',
      orderStatus: 'Delivered'
    },
    {
      id: 'ORD-9822',
      txnId: 'TXN_AGRI_884920',
      date: '2026-07-29',
      customerName: 'Murugan P.',
      customerPhone: '+91 97890 54321',
      customerEmail: 'murugan@agri.com',
      customerAddress: 'Plot 4, Farm Road, Tirunelveli',
      items: [
        { name: '16L Battery Knapsack Sprayer', quantity: 1, price: 2850 }
      ],
      subtotal: 2850,
      gst: 143,
      deliveryCharge: 0,
      total: 2993,
      paymentMethod: 'Instant UPI (Google Pay)',
      paymentStatus: 'PAID',
      orderStatus: 'Processing'
    }
  ];
  localStorage.setItem('agri_orders', JSON.stringify(orders));
  return orders;
}

function clearAllOrders() {
  if (confirm('Do you want to clear demo orders and wait for real customer orders?')) {
    localStorage.setItem('agri_orders', '[]');
    renderAdminOrders();
    if (typeof agriApp !== 'undefined' && agriApp.showToast) {
      agriApp.showToast('Demo data cleared! System is ready for live customer orders.');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderAdminDashboard();
  renderAdminProducts();
  renderAdminOrders();
  renderAdminCustomers();
  renderAdminOffers();
});

async function renderAdminDashboard() {
  const products = agriApp.getProducts();
  const totalProducts = document.getElementById('admin-stat-products');
  const totalStock = document.getElementById('admin-stat-stock');

  if (totalProducts) totalProducts.textContent = products.length;
  if (totalStock) {
    const sum = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    totalStock.textContent = sum;
  }

  const orders = getStoredLiveOrders();
  const totalRev = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const revEl = document.getElementById('admin-stat-revenue');
  const ordEl = document.getElementById('stat-total-orders');

  if (revEl) {
    revEl.textContent = `₹${totalRev.toLocaleString('en-IN')}`;
  }
  if (ordEl) {
    ordEl.textContent = orders.length;
  }

  // Update Farmer Inquiries Count
  const inqEl = document.getElementById('admin-stat-inquiries');
  if (inqEl) {
    let count = 0;
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const inqs = await res.json();
        count = inqs.length;
      }
    } catch(e) {}
    if (count === 0) {
      try {
        const stored = JSON.parse(localStorage.getItem('agri_inquiries') || '[]');
        count = stored.length;
      } catch(e) {}
    }
    inqEl.textContent = count || 2;
  }
}

function renderAdminProducts() {
  const tableBody = document.getElementById('admin-products-table');
  if (!tableBody) return;

  const products = agriApp.getProducts();
  const defaultImg = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';

  tableBody.innerHTML = products.map((p, idx) => {
    const imgSrc = (p.image && p.image.trim()) ? p.image : defaultImg;
    return `
    <tr>
      <td>${idx + 1}</td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <img src="${imgSrc}" onerror="this.onerror=null; this.src='${defaultImg}';" width="40" height="40" class="rounded-2" style="object-fit:cover;">
          <div>
            <div class="fw-bold">${p.name}</div>
            <small class="text-muted">${p.category}</small>
          </div>
        </div>
      </td>
      <td>₹${p.price}</td>
      <td>
        <span class="badge ${p.stock < 50 ? 'bg-danger' : 'bg-success'}">${p.stock} units</span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct('${p.id}')">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${p.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `;
  }).join('');
}

function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    let products = agriApp.getProducts();
    products = products.filter(p => p.id !== id);
    agriApp.saveProducts(products);
    agriApp.showToast('Product deleted successfully');
    renderAdminProducts();
    renderAdminDashboard();
  }
}

function editProduct(id) {
  const products = agriApp.getProducts();
  const product = products.find(p => p.id === id);
  if (!product) return;

  const idField = document.getElementById('edit-p-id');
  const nameField = document.getElementById('edit-p-name');
  const nameTaField = document.getElementById('edit-p-name-ta');
  const catField = document.getElementById('edit-p-cat');
  const priceField = document.getElementById('edit-p-price');
  const stockField = document.getElementById('edit-p-stock');
  const imgField = document.getElementById('edit-p-img');
  const descField = document.getElementById('edit-p-desc');

  if (idField) idField.value = product.id;
  if (nameField) nameField.value = product.name || '';
  if (nameTaField) nameTaField.value = product.nameTa || product.name || '';
  if (catField) catField.value = product.category || 'Fertilizers';
  if (priceField) priceField.value = product.price || 0;
  if (stockField) stockField.value = product.stock || 0;
  if (imgField) imgField.value = product.image || '';
  if (descField) descField.value = product.description || '';

  const modalEl = document.getElementById('editProductModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

function handleUpdateProduct(e) {
  e.preventDefault();
  const id = document.getElementById('edit-p-id').value;
  let products = agriApp.getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return;

  const cat = document.getElementById('edit-p-cat').value;
  const inputImg = document.getElementById('edit-p-img').value.trim();

  const finalImg = inputImg || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';
  const nameVal = document.getElementById('edit-p-name').value.trim();
  const nameTaVal = document.getElementById('edit-p-name-ta').value.trim() || nameVal;

  products[index] = {
    ...products[index],
    name: nameVal,
    nameTa: nameTaVal,
    category: cat,
    price: Number(document.getElementById('edit-p-price').value),
    originalPrice: Math.round(Number(document.getElementById('edit-p-price').value) * 1.2),
    stock: Number(document.getElementById('edit-p-stock').value),
    image: finalImg,
    description: document.getElementById('edit-p-desc').value.trim() || products[index].description
  };

  agriApp.saveProducts(products);
  agriApp.showToast(`Product "${nameVal}" updated successfully!`);

  const modalEl = document.getElementById('editProductModal');
  if (modalEl) {
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
  }

  renderAdminProducts();
}

async function renderAdminOrders() {
  const tableBody = document.getElementById('admin-orders-table');
  if (!tableBody) return;

  let orders = [];
  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const dbOrders = await res.json();
      if (Array.isArray(dbOrders) && dbOrders.length > 0) {
        orders = dbOrders.map(o => ({
          id: o.customOrderId || o.id,
          rawId: o.id,
          txnId: o.transactionId || o.razorpayPaymentId || 'TXN_AGRI_2026',
          date: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : 'Today',
          customerName: o.customerName || (o.shippingAddress ? o.shippingAddress.fullName : 'Valued Farmer'),
          customerPhone: o.customerPhone || (o.shippingAddress ? o.shippingAddress.phone : ''),
          customerEmail: o.customerEmail || '',
          customerAddress: typeof o.shippingAddress === 'object' ? `${o.shippingAddress.street || ''}, ${o.shippingAddress.city || ''}, ${o.shippingAddress.state || ''} ${o.shippingAddress.zipCode || ''}` : o.shippingAddress,
          items: Array.isArray(o.items) ? o.items.map(i => ({ name: i.name || i.product_name, quantity: i.quantity, price: i.price })) : [],
          subtotal: o.totalAmount,
          total: o.totalAmount,
          paymentMethod: o.paymentMethod || 'Online Payment',
          paymentStatus: (o.paymentStatus === 'Paid' || o.paymentStatus === 'PAID') ? 'PAID' : 'PENDING_COD',
          orderStatus: o.orderStatus || 'Pending',
          razorpayPaymentId: o.razorpayPaymentId || '',
          razorpayOrderId: o.razorpayOrderId || ''
        }));
      }
    }
  } catch (e) {
    console.warn('Backend fetch notice:', e.message);
  }

  if (orders.length === 0) {
    orders = getStoredLiveOrders();
  } else {
    localStorage.setItem('agri_orders', JSON.stringify(orders));
  }

  updateLiveOrderStats(orders);
  renderOrdersTableRows(orders);
}

function updateLiveOrderStats(orders) {
  const totalOrdersEl = document.getElementById('stat-total-orders');
  const pendingOrdersEl = document.getElementById('stat-pending-orders');
  const shippedOrdersEl = document.getElementById('stat-shipped-orders');
  const totalRevenueEl = document.getElementById('admin-stat-revenue');

  const totalCount = orders.length;
  const pendingCount = orders.filter(o => (o.orderStatus || 'Pending').toLowerCase().includes('pending')).length;
  const shippedCount = orders.filter(o => (o.orderStatus || '').toLowerCase().includes('shipped')).length;
  const revSum = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  if (totalOrdersEl) totalOrdersEl.textContent = totalCount;
  if (pendingOrdersEl) pendingOrdersEl.textContent = pendingCount;
  if (shippedOrdersEl) shippedOrdersEl.textContent = shippedCount;
  if (totalRevenueEl) totalRevenueEl.textContent = `₹${revSum.toLocaleString('en-IN')}`;
}

function renderOrdersTableRows(orders) {
  const tableBody = document.getElementById('admin-orders-table');
  if (!tableBody) return;

  if (orders.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">No live customer orders found. Click "Simulate Live Order" to add test orders.</td></tr>`;
    return;
  }

  tableBody.innerHTML = orders.map(o => {
    const custName = o.customerName || o.customer || 'Valued Farmer';
    const phone = o.customerPhone || '+91 98421 11223';
    const itemCount = Array.isArray(o.items) ? o.items.reduce((acc, i) => acc + (i.quantity || 1), 0) : (o.items || 1);
    const itemNames = Array.isArray(o.items) ? o.items.map(i => `${i.name} (x${i.quantity})`).join(', ') : 'Agricultural Supplies';
    const currentStatus = o.orderStatus || 'Pending';
    const isPaid = o.paymentStatus === 'PAID' || (o.paymentMethod && !o.paymentMethod.includes('COD'));

    return `
      <tr>
        <td class="fw-bold text-success">${o.id}</td>
        <td>
          <div class="fw-bold">${custName}</div>
          <small class="text-muted"><i class="fa-solid fa-phone me-1"></i>${phone}</small>
        </td>
        <td>
          <div class="fw-semibold text-truncate" style="max-width:180px;" title="${itemNames}">${itemNames}</div>
          <small class="badge bg-light text-dark border">${itemCount} items</small>
        </td>
        <td class="fw-bold text-success fs-6">₹${o.total}</td>
        <td>
          <span class="badge ${isPaid ? 'bg-success' : 'bg-warning text-dark'}">
            ${isPaid ? '<i class="fa-solid fa-check-circle me-1"></i> Paid Online' : '<i class="fa-solid fa-money-bill me-1"></i> COD Pending'}
          </span>
          <div class="small text-muted" style="font-size:0.75rem;">${o.paymentMethod || 'Online Payment'}</div>
          ${o.razorpayPaymentId ? `<div class="small text-success" style="font-size:0.7rem;">ID: ${o.razorpayPaymentId}</div>` : ''}
        </td>
        <td>
          <span class="badge ${getStatusBadgeClass(currentStatus)} px-2 py-1 rounded-pill">
            ${currentStatus}
          </span>
        </td>
        <td><small class="text-muted">${o.date || 'Today'}</small></td>
        <td>
          <select class="form-select form-select-sm fw-bold border-success" onchange="updateLiveOrderStatus('${o.id}', this.value)">
            <option value="Pending" ${currentStatus==='Pending'?'selected':''}>Pending</option>
            <option value="Processing" ${currentStatus==='Processing'?'selected':''}>Processing</option>
            <option value="Shipped" ${currentStatus==='Shipped'?'selected':''}>Shipped (In Transit)</option>
            <option value="Delivered" ${currentStatus==='Delivered'||currentStatus==='Completed'?'selected':''}>Delivered</option>
            <option value="Cancelled" ${currentStatus==='Cancelled'?'selected':''}>Cancelled</option>
          </select>
        </td>
        <td>
          <button type="button" class="btn btn-sm btn-outline-success rounded-circle" onclick="viewAdminOrderDetails('${o.id}')" title="View Details & Invoice">
            <i class="fa-solid fa-eye"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function getStatusBadgeClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('completed') || s.includes('delivered')) return 'bg-success';
  if (s.includes('shipped')) return 'bg-primary';
  if (s.includes('processing')) return 'bg-info text-dark';
  if (s.includes('cancelled')) return 'bg-danger';
  return 'bg-warning text-dark';
}

async function updateLiveOrderStatus(orderId, newStatus) {
  try {
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
  } catch (e) {}

  let orders = getStoredLiveOrders();
  const idx = orders.findIndex(o => o.id === orderId || o.rawId == orderId);
  if (idx > -1) {
    orders[idx].orderStatus = newStatus;
    localStorage.setItem('agri_orders', JSON.stringify(orders));
    if (typeof agriApp !== 'undefined' && agriApp.showToast) {
      agriApp.showToast(`Order #${orderId} status updated to: ${newStatus}`);
    }
  }
  renderAdminOrders();
}

function filterLiveOrders() {
  const searchTxt = (document.getElementById('order-search-input')?.value || '').toLowerCase();
  const statusVal = document.getElementById('order-status-filter')?.value || 'ALL';
  const paymentVal = document.getElementById('order-payment-filter')?.value || 'ALL';

  let orders = getStoredLiveOrders();

  if (searchTxt) {
    orders = orders.filter(o => 
      (o.id && o.id.toLowerCase().includes(searchTxt)) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchTxt)) ||
      (o.customerPhone && o.customerPhone.includes(searchTxt))
    );
  }

  if (statusVal !== 'ALL') {
    orders = orders.filter(o => (o.orderStatus || 'Pending').toLowerCase().includes(statusVal.toLowerCase()));
  }

  if (paymentVal !== 'ALL') {
    if (paymentVal === 'PAID') {
      orders = orders.filter(o => o.paymentStatus === 'PAID' || (o.paymentMethod && !o.paymentMethod.includes('COD')));
    } else if (paymentVal === 'COD') {
      orders = orders.filter(o => o.paymentStatus === 'PENDING_COD' || (o.paymentMethod && o.paymentMethod.includes('COD')));
    }
  }

  renderOrdersTableRows(orders);
}

function viewAdminOrderDetails(orderId) {
  const orders = getStoredLiveOrders();
  const o = orders.find(item => item.id === orderId);
  if (!o) return;

  const titleEl = document.getElementById('modal-order-title');
  const bodyEl = document.getElementById('modal-order-body');
  if (!titleEl || !bodyEl) return;

  titleEl.textContent = `Tax Invoice & Order Details #${o.id}`;

  const isPaid = o.paymentStatus === 'PAID' || (o.paymentMethod && !o.paymentMethod.includes('COD'));
  const itemsList = Array.isArray(o.items) ? o.items : [];

  bodyEl.innerHTML = `
    <div class="row g-3 mb-4">
      <div class="col-md-6">
        <label class="small text-uppercase text-muted fw-bold">Customer & Shipping Details</label>
        <div class="fw-bold fs-5 text-success">${o.customerName || 'Valued Farmer'}</div>
        <div class="small text-dark"><i class="fa-solid fa-phone me-1"></i> Phone: ${o.customerPhone || '+91 98421 11223'}</div>
        <div class="small text-dark"><i class="fa-solid fa-envelope me-1"></i> Email: ${o.customerEmail || 'N/A'}</div>
        <div class="small text-muted"><i class="fa-solid fa-location-dot me-1"></i> Address: ${o.customerAddress || 'Cheranmahadevi, Tirunelveli'}</div>
      </div>
      <div class="col-md-6 text-md-end">
        <label class="small text-uppercase text-muted fw-bold">Payment & Invoice Info</label>
        <div><span class="badge ${isPaid ? 'bg-success' : 'bg-warning text-dark'} fs-6">${isPaid ? 'PAID ONLINE' : 'CASH ON DELIVERY'}</span></div>
        <div class="small text-muted mt-1">Payment Method: <strong>${o.paymentMethod || 'Online'}</strong></div>
        <div class="small text-muted">Transaction ID: <strong>${o.txnId || 'TXN_AGRI_2026'}</strong></div>
        <div class="small text-muted">Order Date: ${o.date || 'Today'}</div>
      </div>
    </div>

    <div class="card p-3 border mb-3">
      <h6 class="fw-bold mb-2 text-success">Purchased Farm Supplies</h6>
      <table class="table table-sm table-bordered m-0">
        <thead class="table-light">
          <tr>
            <th>Product Name</th>
            <th class="text-center">Qty</th>
            <th class="text-end">Price</th>
            <th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList.length > 0 ? itemsList.map(i => `
            <tr>
              <td>${i.name}</td>
              <td class="text-center">${i.quantity}</td>
              <td class="text-end">₹${i.price}</td>
              <td class="text-end fw-bold">₹${i.price * i.quantity}</td>
            </tr>
          `).join('') : `<tr><td colspan="4" class="text-center">Custom Agricultural Supplies</td></tr>`}
        </tbody>
      </table>
    </div>

    <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 border">
      <div>
        <span class="fw-bold">Total Order Value (incl. GST):</span>
      </div>
      <div class="d-flex align-items-center gap-3">
        <span class="fw-bold fs-3 text-success">₹${o.total}</span>
        <button class="btn btn-sm btn-outline-secondary fw-bold" onclick="window.print()"><i class="fa-solid fa-print me-1"></i> Print Invoice</button>
      </div>
    </div>
  `;

  const modalEl = document.getElementById('orderDetailsModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

function simulateNewOrder() {
  let orders = getStoredLiveOrders();
  const newId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
  const newTxn = 'TXN_AGRI_' + Math.floor(100000 + Math.random() * 900000);

  const sampleCustomers = [
    { name: 'Kaliappan Farmer', phone: '+91 98765 11002', location: 'Ambasamudram' },
    { name: 'Sundaram Agriculture', phone: '+91 94421 88776', location: 'Cheranmahadevi' },
    { name: 'Meenakshi Farm Organic', phone: '+91 97880 44332', location: 'Tirunelveli' }
  ];
  const randCust = sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)];

  const newOrder = {
    id: newId,
    txnId: newTxn,
    date: new Date().toISOString().split('T')[0],
    customerName: randCust.name,
    customerPhone: randCust.phone,
    customerEmail: 'farmer@agriclinic.com',
    customerAddress: `Main Field Road, ${randCust.location}, Tirunelveli`,
    items: [
      { name: 'NPK 19-19-19 Water Soluble Fertilizer', quantity: 2, price: 450 },
      { name: 'Bio-Neem Oil Pest Guard 1L', quantity: 1, price: 380 }
    ],
    subtotal: 1280,
    gst: 64,
    deliveryCharge: 0,
    total: 1344,
    paymentMethod: 'Instant UPI (Google Pay)',
    paymentStatus: 'PAID',
    orderStatus: 'Pending'
  };

  orders.unshift(newOrder);
  localStorage.setItem('agri_orders', JSON.stringify(orders));

  if (typeof agriApp !== 'undefined' && agriApp.showToast) {
    agriApp.showToast(`New Live Order ${newId} Received from ${randCust.name}!`);
  }

  renderAdminOrders();
}

function renderAdminCustomers() {
  const tableBody = document.getElementById('admin-customers-table');
  if (!tableBody) return;

  const defaultCustomers = [
    { name: 'Ramanathan K.', email: 'ramanathan@farm.in', phone: '+91 98421 11223', location: 'Thanjavur, TN' },
    { name: 'Murugan P.', email: 'murugan@agri.com', phone: '+91 97890 54321', location: 'Coimbatore, TN' },
    { name: 'Selvi V.', email: 'selvi.v@greenfield.org', phone: '+91 94432 99881', location: 'Madurai, TN' }
  ];

  let storedCustomers = [];
  try {
    storedCustomers = JSON.parse(localStorage.getItem('agri_customers') || '[]');
  } catch(e) {
    storedCustomers = [];
  }

  const customers = storedCustomers.length > 0 ? storedCustomers : defaultCustomers;

  tableBody.innerHTML = customers.map((c, i) => `
    <tr>
      <td>${i + 1}</td>
      <td class="fw-bold text-success">${c.name || 'Anonymous Farmer'}</td>
      <td>${c.email || 'N/A'}</td>
      <td>${c.phone || 'N/A'}</td>
      <td>${c.location || c.address || 'Cheranmahadevi'}</td>
    </tr>
  `).join('');
}

/* ==========================================================================
   PROMO COUPON & OFFERS MANAGER
   ========================================================================== */
function getStoredCoupons() {
  let coupons = [];
  try {
    const stored = localStorage.getItem('agri_coupons');
    if (stored !== null) {
      return JSON.parse(stored);
    }
  } catch(e) {
    coupons = [];
  }

  coupons = [
    {
      id: 'c-1',
      code: 'KISAAN15',
      type: 'percentage',
      value: 15,
      minOrder: 0,
      description: 'Flat 15% discount on Vermicompost, Bio Fertilizers & Seeds',
      status: 'Active'
    },
    {
      id: 'c-2',
      code: 'FREEDEL',
      type: 'free_shipping',
      value: 0,
      minOrder: 1000,
      description: 'Free doorstep tractor delivery on orders above ₹1,000',
      status: 'Active'
    },
    {
      id: 'c-3',
      code: 'SPRAYER500',
      type: 'fixed',
      value: 500,
      minOrder: 2000,
      description: '₹500 instant discount on 16L Battery Knapsack Sprayer',
      status: 'Active'
    },
    {
      id: 'c-4',
      code: 'AGRO10',
      type: 'percentage',
      value: 10,
      minOrder: 500,
      description: 'Flat 10% discount on all agricultural products',
      status: 'Active'
    }
  ];

  localStorage.setItem('agri_coupons', JSON.stringify(coupons));
  return coupons;
}

function saveCoupons(coupons) {
  localStorage.setItem('agri_coupons', JSON.stringify(coupons));
}

function renderAdminOffers() {
  const tableBody = document.getElementById('admin-offers-table');
  if (!tableBody) return;

  const coupons = getStoredCoupons();
  if (coupons.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No promotional coupons created yet. Click "+ Add New Coupon" to create one.</td></tr>`;
    return;
  }

  tableBody.innerHTML = coupons.map(c => {
    let discountStr = '';
    if (c.type === 'percentage') discountStr = `${c.value}% OFF`;
    else if (c.type === 'fixed') discountStr = `₹${c.value} OFF`;
    else if (c.type === 'free_shipping') discountStr = `Free Delivery`;

    const isActive = c.status === 'Active';

    return `
      <tr>
        <td class="fw-bold text-success font-heading fs-6">${c.code}</td>
        <td><span class="badge bg-success-subtle text-success border border-success px-3 py-2 fs-6 fw-bold">${discountStr}</span></td>
        <td>${c.minOrder > 0 ? '₹' + c.minOrder : 'No Minimum'}</td>
        <td class="small text-secondary max-w-300">${c.description}</td>
        <td><span class="status-pill ${isActive ? 'success' : 'danger'}">${c.status}</span></td>
        <td class="text-end">
          <button class="btn btn-sm ${isActive ? 'btn-outline-warning' : 'btn-outline-success'} rounded-pill me-1" onclick="toggleCouponStatus('${c.code}')">
            <i class="fa-solid fa-${isActive ? 'pause' : 'play'} me-1"></i>${isActive ? 'Disable' : 'Enable'}
          </button>
          <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="deleteCoupon('${c.code}')" title="Delete Coupon">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddCouponModal() {
  document.getElementById('coupon-id').value = '';
  document.getElementById('coupon-code').value = '';
  document.getElementById('coupon-type').value = 'percentage';
  document.getElementById('coupon-val').value = '15';
  document.getElementById('coupon-min').value = '0';
  document.getElementById('coupon-desc').value = '';
  document.getElementById('coupon-status').value = 'Active';
  toggleDiscountValueInput();

  const modalEl = document.getElementById('couponModal');
  if (modalEl && typeof bootstrap !== 'undefined') {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

function toggleDiscountValueInput() {
  const type = document.getElementById('coupon-type')?.value;
  const valWrapper = document.getElementById('discount-val-wrapper');
  const valLabel = document.getElementById('discount-val-label');
  const valInput = document.getElementById('coupon-val');

  if (!valWrapper || !valInput) return;

  if (type === 'free_shipping') {
    valWrapper.style.display = 'none';
    valInput.value = '0';
    valInput.removeAttribute('required');
  } else {
    valWrapper.style.display = 'block';
    valInput.setAttribute('required', 'true');
    if (type === 'percentage') {
      valLabel.textContent = 'Discount Percentage (%) *';
      valInput.placeholder = 'e.g. 15';
    } else {
      valLabel.textContent = 'Discount Amount (₹) *';
      valInput.placeholder = 'e.g. 500';
    }
  }
}

function saveCouponForm(event) {
  event.preventDefault();
  const code = document.getElementById('coupon-code').value.trim().toUpperCase();
  const type = document.getElementById('coupon-type').value;
  const value = Number(document.getElementById('coupon-val').value || 0);
  const minOrder = Number(document.getElementById('coupon-min').value || 0);
  const desc = document.getElementById('coupon-desc').value.trim();
  const status = document.getElementById('coupon-status').value;

  if (!code) return;

  let coupons = getStoredCoupons();
  const existingIdx = coupons.findIndex(c => c.code === code);

  const newCoupon = {
    id: existingIdx > -1 ? coupons[existingIdx].id : 'c-' + Date.now(),
    code,
    type,
    value: type === 'free_shipping' ? 0 : value,
    minOrder,
    description: desc,
    status
  };

  if (existingIdx > -1) {
    coupons[existingIdx] = newCoupon;
  } else {
    coupons.unshift(newCoupon);
  }

  saveCoupons(coupons);

  const modalEl = document.getElementById('couponModal');
  if (modalEl && typeof bootstrap !== 'undefined') {
    const instance = bootstrap.Modal.getInstance(modalEl);
    if (instance) instance.hide();
  }

  renderAdminOffers();
  if (typeof agriApp !== 'undefined' && agriApp.showToast) {
    agriApp.showToast(`Coupon "${code}" saved successfully!`, 'success');
  }
}

function toggleCouponStatus(code) {
  let coupons = getStoredCoupons();
  const coupon = coupons.find(c => c.code === code);
  if (!coupon) return;

  coupon.status = coupon.status === 'Active' ? 'Inactive' : 'Active';
  saveCoupons(coupons);
  renderAdminOffers();
  if (typeof agriApp !== 'undefined' && agriApp.showToast) {
    agriApp.showToast(`Coupon "${code}" is now ${coupon.status}`, 'info');
  }
}

function deleteCoupon(code) {
  if (!confirm(`Are you sure you want to delete coupon code "${code}"?`)) return;

  let coupons = getStoredCoupons();
  coupons = coupons.filter(c => c.code !== code);
  saveCoupons(coupons);
  renderAdminOffers();
  if (typeof agriApp !== 'undefined' && agriApp.showToast) {
    agriApp.showToast(`Coupon "${code}" deleted`, 'warning');
  }
}
