/**
 * ============================================================================
 * 🛡️ ESCUDO DEFLECTOR (MODO EMBOSCADA TÁCTICA)
 * ============================================================================
 */
const LayoutOptimizer = {
  checkUIIntegrity() {
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

  async verifyNetworkNodes() {
    try {
      await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      return false; 
    } catch (error) {
      return true; 
    }
  },

  async analyzeEnvironment() {
    const [domBlocked, networkBlocked] = await Promise.all([
      this.checkUIIntegrity(),
      this.verifyNetworkNodes()
    ]);
    return domBlocked || networkBlocked;
  },

  showAlert() {
    const modal = document.getElementById('modal-antiblock');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  },

  hideAlert() {
    const modal = document.getElementById('modal-antiblock');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }
};

// ==========================================
// 🚀 INICIO SILENCIOSO (SIN MODAL AUTOMÁTICO)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Escaneo silencioso en segundo plano
  window.isBunkerShieldActive = await LayoutOptimizer.analyzeEnvironment();
  
  if (window.isBunkerShieldActive) {
    console.log("🟡 [RADAR] Enemigo detectado. Esperando a que el objetivo intente generar el QR para emboscar.");
  }

  // 2. Configurar botón de reintento del modal
  const btnRetry = document.getElementById('btn-retry-antiblock');
  if (btnRetry) {
    btnRetry.addEventListener('click', async () => {
      btnRetry.innerText = "⏳ REESCANANADO NODO...";
      const stillBlocked = await LayoutOptimizer.analyzeEnvironment();
      
      if (!stillBlocked) {
        LayoutOptimizer.hideAlert();
        window.isBunkerShieldActive = false;
        alert("🟢 ESCUDO DESACTIVADO: Acceso concedido al Búnker.");
      } else {
        alert("🔴 ALERTA: El bloqueador sigue activo. Por favor despliéguelo para continuar.");
      }
      btnRetry.innerText = "🔄 REINTENTAR ESCANEO DE BÚNKER";
    });
  }
});