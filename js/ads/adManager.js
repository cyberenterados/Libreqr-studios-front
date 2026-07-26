//(El General - Coordinador de Tropas)

// ==========================================
// 👑 AD MANAGER (GENERAL DE PUBLICIDAD)
// ==========================================
const AdManager = {
  init() {
    console.log("🛡️ [AD MANAGER] Desplegando unidades publicitarias...");
    if (typeof BannerTop !== 'undefined') BannerTop.init();
    if (typeof BannerSide !== 'undefined') BannerSide.init();
    if (typeof BannerMid !== 'undefined') BannerMid.init();
    if (typeof BannerBottom !== 'undefined') BannerBottom.init();
  },

  // Método público para llamar la retención de descarga desde main.js
  interceptDownload(callback, seconds = 15) {
    if (typeof InterceptDownload !== 'undefined') {
      InterceptDownload.trigger(callback, seconds);
    } else {
      if (typeof callback === 'function') callback();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AdManager.init();
});

