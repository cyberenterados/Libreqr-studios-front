// ==========================================
// 🛡️ BATERÍA PUBLICITARIA: SLOT 4 (FOOTER)
// ==========================================
const BannerBottom = {
  slotId: 'ad-slot-bottom',

  init() {
    const container = document.getElementById(this.slotId);
    if (!container) return;

    // INYECCIÓN DE MUNICIÓN REAL: A-Ads (Bloque #2449491 - Adaptable)
    container.innerHTML = `
      <!-- BEGIN AADS AD UNIT 2449491 -->
      <div style="width: 100%; margin: auto; position: relative; z-index: 10;">
        <iframe data-aa='2449491' src='//acceptable.a-ads.com/2449491/?size=Adaptive'
                style='border:0; padding:0; width:100%; height:auto; min-height:90px; overflow:hidden; display:block; margin:auto;'>
        </iframe>
      </div>
      <!-- END AADS AD UNIT 2449491 -->
    `;
    
    console.log("🟢 [ADS] Slot 4 (Bottom) desplegado y armado con A-Ads.");
  }
};