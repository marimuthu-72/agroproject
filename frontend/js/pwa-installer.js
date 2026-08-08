/* ==========================================================================
   G. Saravana Agro Clinic - PWA Registration & Install Manager
   ========================================================================== */

(function () {
  let deferredPrompt = null;

  // 1. Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('[PWA] Service Worker registered:', reg.scope))
        .catch((err) => console.error('[PWA] Service Worker registration failed:', err));
    });
  }

  // 2. Network Status Monitor
  window.addEventListener('online', () => {
    if (window.agriStore) {
      window.agriStore.showToast(
        window.agriStore.lang === 'ta' ? 'இணைய இணைப்பு மீண்டும் கிடைத்தது!' : 'Back Online! Connection restored.',
        'success'
      );
    }
  });

  window.addEventListener('offline', () => {
    if (window.agriStore) {
      window.agriStore.showToast(
        window.agriStore.lang === 'ta' ? 'ஆஃப்லைன் பயன்முறை: சேமிக்கப்பட்ட பக்கங்கள் செயல்படுகின்றன.' : 'Offline Mode: Browsing cached catalog.',
        'warning'
      );
    }
  });

  // 3. PWA Install Prompt Listener
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showPwaInstallBanner();
  });

  // Check if running as Installed PWA / Standalone App
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isStandalone) {
    document.documentElement.classList.add('in-pwa-mode');
  }

  // 4. Create and Show Custom Install Banner
  function showPwaInstallBanner() {
    if (document.getElementById('pwa-install-banner') || isStandalone) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="pwa-banner-content">
        <img src="/icons/icon-192.png" alt="Agri App Logo" class="pwa-banner-icon" />
        <div class="pwa-banner-text">
          <strong id="pwa-title">Install G. Saravana Agro Clinic App</strong>
          <span id="pwa-subtitle">Get fast offline access & mobile ordering!</span>
        </div>
      </div>
      <div class="pwa-banner-actions">
        <button id="pwa-install-btn" class="btn btn-primary btn-sm">📱 Install App</button>
        <button id="pwa-close-btn" class="btn-close-pwa" aria-label="Close">&times;</button>
      </div>
    `;

    document.body.prepend(banner);

    // Install Button Handler
    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] Install prompt outcome: ${outcome}`);
      deferredPrompt = null;
      banner.remove();
    });

    // Close Banner Handler
    document.getElementById('pwa-close-btn').addEventListener('click', () => {
      banner.remove();
      localStorage.setItem('agri_pwa_dismissed', 'true');
    });
  }

  // Render header install button if navbar element exists
  document.addEventListener('DOMContentLoaded', () => {
    const navRight = document.querySelector('.nav-right') || document.querySelector('.nav-actions');
    if (navRight && !document.getElementById('pwa-nav-btn') && !isStandalone) {
      const installNavBtn = document.createElement('button');
      installNavBtn.id = 'pwa-nav-btn';
      installNavBtn.className = 'btn btn-outline-primary btn-sm pwa-nav-btn';
      installNavBtn.innerHTML = '<span>📱</span> <span class="pwa-nav-text">App</span>';
      installNavBtn.title = 'Install Mobile App';
      installNavBtn.addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
        } else {
          alert(window.agriStore?.lang === 'ta' 
            ? 'செயலியை நிறுவ: உலாவியின் "முகப்புத் திரையில் சேர்" தேர்வை பயன்படுத்தவும்.'
            : 'To install Agri App, use your browser menu: "Add to Home Screen" or "Install App".'
          );
        }
      });
      navRight.insertBefore(installNavBtn, navRight.firstChild);
    }
  });

})();
