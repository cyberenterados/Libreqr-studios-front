// ==========================================
// 👑 AD MANAGER (GENERAL DE PUBLICIDAD UNIFICADO)
// ==========================================

const AdManager = {
  // ----------------------------------------
  // 🖼️ ESCUADRÓN 1: BANNERS ESTÁTICOS
  // ----------------------------------------
  init() {
    console.log("🛡️ [AD MANAGER] Desplegando unidades publicitarias estáticas...");
    if (typeof BannerTop !== 'undefined') BannerTop.init();
    if (typeof BannerSide !== 'undefined') BannerSide.init(); // Flancos
    if (typeof BannerMid !== 'undefined') BannerMid.init();
    if (typeof BannerBottom !== 'undefined') BannerBottom.init();
  },

  interceptDownload(callback, seconds = 5) {
    if (typeof InterceptDownload !== 'undefined') {
      InterceptDownload.trigger(callback, seconds);
    } else {
      if (typeof callback === 'function') callback();
    }
  },

  // ----------------------------------------
  // ⚡ ESCUADRÓN 2: DIRECT LINKS (LÍMITE DIARIO)
  // ----------------------------------------
  directLinkURL: "https://www.effectivecpmnetwork.com/ncxfjzveik?key=8961b6510ea880dc0263707e4f3e1591",
  
  maxClicksPerDay: 2,

  canTriggerAd() {
    const today = new Date().toISOString().split('T')[0]; // Ej: "2026-07-27"
    const storedData = JSON.parse(localStorage.getItem('bunker_ad_telemetry')) || {};

    if (storedData.date !== today) {
      storedData.date = today;
      storedData.clicks = 0;
    }

    if (storedData.clicks >= this.maxClicksPerDay) {
      console.log(`🛡️ [ADS] Límite diario alcanzado (${this.maxClicksPerDay}/${this.maxClicksPerDay}). Fuego retenido.`);
      return false;
    }

    storedData.clicks += 1;
    localStorage.setItem('bunker_ad_telemetry', JSON.stringify(storedData));
    console.log(`💥 [ADS] Disparo publicitario ejecutado (${storedData.clicks}/${this.maxClicksPerDay}).`);
    
    return true;
  },

  fireDirectLink() {
    if (this.canTriggerAd()) {
      window.open(this.directLinkURL, '_blank');
    }
  }
};

// Enlace global para que main.js pueda detonar el Direct Link
window.triggerAdsterraDirectLink = function() {
  AdManager.fireDirectLink();
};

// Arrancar sistema de banners al cargar la base
document.addEventListener('DOMContentLoaded', () => {
  AdManager.init();
});

