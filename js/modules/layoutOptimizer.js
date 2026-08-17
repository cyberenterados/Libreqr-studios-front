// ==========================================
// 🛡️ MOTOR ANTI-ADBLOCKER (TÁCTICAS 1 + 2 + 3)
// ==========================================

const AntiBlockManager = {
  
  // 1. SONDA DE TRAMPA DOM (TÁCTICA 1)
  checkDOMHoneypot() {
    return new Promise((resolve) => {
      const bait = document.createElement('div');
      bait.className = 'adsbox ad-zone ad-banner promo-banner GoogleAdSens';
      bait.style.position = 'absolute';
      bait.style.left = '-9999px';
      bait.style.width = '1px';
      bait.style.height = '1px';
      document.body.appendChild(bait);

      window.setTimeout(() => {
        const isBlocked = bait.offsetHeight === 0 || 
                          bait.clientHeight === 0 || 
                          window.getComputedStyle(bait).getPropertyValue('display') === 'none' ||
                          bait.offsetParent === null;
        bait.remove();
        resolve(isBlocked);
      }, 100);
    });
  },

  // 2. SONDA DE RED FETCH (TÁCTICA 2)
  async checkNetworkFetch() {
    try {
      // Intentamos hacer un ping silencioso a un servidor conocido de anuncios
      await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      return false; // Red limpia, no hay bloqueo
    } catch (error) {
      return true; // La petición falló porque el AdBlock cortó la conexión
    }
  },

  // 3. ESCANEO COMBINADO
  async isAdBlockActive() {
    const [domBlocked, networkBlocked] = await Promise.all([
      this.checkDOMHoneypot(),
      this.checkNetworkFetch()
    ]);

    return domBlocked || networkBlocked;
  },

  // 4. DESPLIEGUE DEL MODAL DE ALERTA (TÁCTICA 3)
  showWarningModal() {
    const modal = document.getElementById('modal-antiblock');
    if (modal) {
      modal.classList.remove('hidden');
    }
  },

  hideWarningModal() {
    const modal = document.getElementById('modal-antiblock');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
};

// Configurar botón de reintento
document.addEventListener('DOMContentLoaded', () => {
  const btnRetry = document.getElementById('btn-retry-antiblock');
  if (btnRetry) {
    btnRetry.addEventListener('click', async () => {
      btnRetry.innerText = "⏳ REESCANANADO NODO...";
      const blocked = await AntiBlockManager.isAdBlockActive();
      
      if (!blocked) {
        AntiBlockManager.hideWarningModal();
        alert("🟢 ESCUDO DESACTIVADO: Acceso concedido al Búnker.");
      } else {
        alert("🔴 ALERTA: El bloqueador sigue activo. Por favor despliéguelo para continuar.");
      }
      btnRetry.innerText = "🔄 REINTENTAR ESCANEO DE BÚNKER";
    });
  }
});

