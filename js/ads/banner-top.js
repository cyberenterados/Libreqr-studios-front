//(Slot 1 - Cabecera / Leaderboard)

// ==========================================
// 🛡️ BATERÍA PUBLICITARIA: SLOT 1 (CABECERA)
// ==========================================
const BannerTop = {
  slotId: 'ad-slot-top',

  init() {
    const container = document.getElementById(this.slotId);
    if (!container) return;

    // INYECCIÓN DE CÓDIGO PUBLICITARIO (Reemplazar con el script de la red elegida)
    container.innerHTML = `
      <div class="w-full flex justify-center items-center p-2 bg-[#0a0a0a] border border-[#002200] rounded text-center min-h-[90px]">
        <!-- PLACEHOLDER / SCRIPT RED PUBLICITARIA -->
        <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">[ ESPACIO PUBLICITARIO RESERVADO - SLOT 1 TOP ]</span>
      </div>
    `;
    console.log("🟢 [ADS] Slot 1 (Top) desplegado en posición.");
  }
};

