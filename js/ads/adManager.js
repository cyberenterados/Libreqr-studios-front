// ==========================================
// 👑 AD MANAGER V3.0 (A-ADS + MONETAG AUTÓNOMO)
// ==========================================

const AdManager = {
  // ----------------------------------------
  // 🖼️ ESCUADRÓN 1: BANNERS ESTÁTICOS (A-ADS)
  // ----------------------------------------
  deployAAds() {
    console.log("🛡️ [AD MANAGER] Desplegando unidades A-Ads estáticas...");

    const adUnits = [
      { id: 'ad-banner-top', unit: '2449861', width: '70%' },
      { id: 'ad-banner-bottom', unit: '2449861', width: '70%' },
      { id: 'ad-sidebar-left', unit: '2449857', width: '100%' },
      { id: 'ad-sidebar-right', unit: '2449857', width: '100%' }
    ];

    adUnits.forEach(ad => {
      const container = document.getElementById(ad.id);
      if (container) {
        container.innerHTML = `
          <div style="width: 100%; margin: auto; display: flex; justify-content: center; align-items: center; position: relative; z-index: 90;">
            <iframe data-aa='${ad.unit}' src='https://acceptable.a-ads.com/${ad.unit}/?size=Adaptive'
                    style='border:0; padding:0; width:${ad.width}; height:auto; min-height:90px; overflow:hidden; display: block; margin: auto;'
                    sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-forms">
            </iframe>
          </div>
        `;
      }
    });
  },

  // ----------------------------------------
  // ⚡ ESCUADRÓN 2: MONETAG INTERSTITIAL (CON ESCUDO COOLDOWN)
  // ----------------------------------------
  monetagConfig: {
    maxDailyImpacts: 3,        // Máximo de anuncios por día
    cooldownMinutes: 2         // Minutos de espera entre cada anuncio (Reducido a 2 para más agresividad controlada)
  },

  canTriggerMonetag() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const storedData = JSON.parse(localStorage.getItem('bunker_monetag_telemetry')) || { date: todayStr, count: 0, lastFired: 0 };

    if (storedData.date !== todayStr) {
      storedData.date = todayStr;
      storedData.count = 0;
    }

    if (storedData.count >= this.monetagConfig.maxDailyImpacts) {
      console.log(`🛡️ [MONETAG] Límite diario alcanzado (${storedData.count}/${this.monetagConfig.maxDailyImpacts}). Fuego retenido.`);
      return false;
    }

    const minutesSinceLast = (now.getTime() - storedData.lastFired) / (1000 * 60);
    if (minutesSinceLast < this.monetagConfig.cooldownMinutes) {
      console.log(`⏱️ [MONETAG] Armas enfriando. Faltan ${(this.monetagConfig.cooldownMinutes - minutesSinceLast).toFixed(1)} min.`);
      return false;
    }

    storedData.count += 1;
    storedData.lastFired = now.getTime();
    localStorage.setItem('bunker_monetag_telemetry', JSON.stringify(storedData));
    
    return true;
  },

  triggerMonetagAd() {
    if (this.canTriggerMonetag()) {
      console.log("💥 [MONETAG] Desplegando Escudo Vignette (Superposición). Impacto inminente.");
      
      // Armado táctico del script extraído de Monetag
      const script = document.createElement('script');
      script.dataset.zone = '11520148';
      script.src = 'https://n6wxm.com/vignette.min.js';
      
      // Inyección en el DOM para detonar la superposición
      const target = document.body || document.documentElement;
      target.appendChild(script);
    }
  },

  // ----------------------------------------
  // 🎯 ESCUADRÓN 3: INTERCEPTOR INVISIBLE (NUEVO)
  // ----------------------------------------
  interceptAction(callback, actionName = "Operación") {
    console.log(`🎯 [OPERACIÓN] Ejecutando acción: ${actionName}`);
    
    // 1. Detonamos Monetag (Si el cooldown lo permite)
    this.triggerMonetagAd();

    // 2. Ejecutamos la acción real del usuario (Generar o Descargar)
    // Usamos un micro-retraso de 500ms para asegurar que Monetag inyecte su UI primero.
    if (typeof callback === 'function') {
      setTimeout(() => {
        callback();
      }, 500);
    }
  },

  init() {
    this.deployAAds();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AdManager.init();
});