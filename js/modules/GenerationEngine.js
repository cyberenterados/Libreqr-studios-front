// ==========================================
// 👑 GENERATION ENGINE V3.1 (A-ADS + MONETAG UNIFICADO)
// Camuflado como motor de renderizado para evadir radares
// ==========================================

const GenerationEngine = {
  // ----------------------------------------
  // 🖼️ ESCUADRÓN 1: BANNERS ESTÁTICOS (A-ADS)
  // ----------------------------------------
  deployStaticNodes() {
    console.log("🛡️ [GENERATION ENGINE] Desplegando nodos estáticos de interfaz...");

    // Telemetría separada:
    // 2450912 -> Banners Horizontales (Top & Bottom)
    // 2450911 -> Flancos Verticales (Left & Right)
    const renderUnits = [
      { id: 'partner-dock-top', unit: '2450912', width: '70%' },
      { id: 'partner-dock-bottom', unit: '2450912', width: '70%' },
      { id: 'partner-dock-left', unit: '2450911', width: '100%' },
      { id: 'partner-dock-right', unit: '2450911', width: '100%' }
    ];

    renderUnits.forEach(node => {
      const container = document.getElementById(node.id);
      if (container) {
        container.innerHTML = `
          <div style="width: 100%; margin: auto; display: flex; justify-content: center; align-items: center; position: relative; z-index: 90;">
            <iframe data-aa='${node.unit}' src='https://acceptable.a-ads.com/${node.unit}/?size=Adaptive'
                    style='border:0; padding:0; width:${node.width}; height:auto; min-height:90px; overflow:hidden; display: block; margin: auto;'
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
    maxDailyImpacts: 3,        // Máximo de impactos por día[cite: 9]
    cooldownMinutes: 2         // Minutos de espera entre cada impacto[cite: 9]
  },

  canTriggerOverlay() {
    const now = new Date(); //[cite: 9]
    const todayStr = now.toISOString().split('T')[0]; //[cite: 9]
    const storedData = JSON.parse(localStorage.getItem('bunker_monetag_telemetry')) || { date: todayStr, count: 0, lastFired: 0 }; //[cite: 9]

    if (storedData.date !== todayStr) { //[cite: 9]
      storedData.date = todayStr; //[cite: 9]
      storedData.count = 0; //[cite: 9]
    }

    if (storedData.count >= this.monetagConfig.maxDailyImpacts) { //[cite: 9]
      console.log(`🛡️ [OVERLAY] Límite diario alcanzado (${storedData.count}/${this.monetagConfig.maxDailyImpacts}). Fuego retenido.`); //[cite: 9]
      return false; //[cite: 9]
    }

    const minutesSinceLast = (now.getTime() - storedData.lastFired) / (1000 * 60); //[cite: 9]
    if (minutesSinceLast < this.monetagConfig.cooldownMinutes) { //[cite: 9]
      console.log(`⏱️ [OVERLAY] Armas enfriando. Faltan ${(this.monetagConfig.cooldownMinutes - minutesSinceLast).toFixed(1)} min.`); //[cite: 9]
      return false; //[cite: 9]
    }

    storedData.count += 1; //[cite: 9]
    storedData.lastFired = now.getTime(); //[cite: 9]
    localStorage.setItem('bunker_monetag_telemetry', JSON.stringify(storedData)); //[cite: 9]
    
    return true; //[cite: 9]
  },

  triggerOverlayModule() {
    if (this.canTriggerOverlay()) {
      console.log("💥 [OVERLAY] Desplegando Escudo Vignette (Superposición). Impacto inminente.");
      
      const script = document.createElement('script'); //[cite: 9]
      script.dataset.zone = '11520148'; //[cite: 9]
      script.src = 'https://n6wxm.com/vignette.min.js'; //[cite: 9]
      
      const target = document.body || document.documentElement; //[cite: 9]
      target.appendChild(script); //[cite: 9]
    }
  },

  // ----------------------------------------
  // 🎯 ESCUADRÓN 3: INTERCEPTOR INVISIBLE
  // ----------------------------------------
  interceptAction(callback, actionName = "Operación") { //[cite: 9]
    console.log(`🎯 [OPERACIÓN] Ejecutando acción: ${actionName}`); //[cite: 9]
    
    this.triggerOverlayModule();

    if (typeof callback === 'function') { //[cite: 9]
      setTimeout(() => { //[cite: 9]
        callback(); //[cite: 9]
      }, 500); //[cite: 9]
    }
  },

  init() {
    this.deployStaticNodes();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  GenerationEngine.init();
});

