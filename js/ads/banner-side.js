//(Slot 2 - Lateral / Skyscraper)

// ==========================================
// 🛡️ BATERÍA PUBLICITARIA: SLOT 2 (LATERAL)
// ==========================================
const BannerSide = {
  slotId: 'ad-slot-side',

  init() {
    const container = document.getElementById(this.slotId);
    if (!container) return;

    container.innerHTML = `
      <div class="w-full flex justify-center items-center p-2 bg-[#0a0a0a] border border-[#002200] rounded text-center min-h-[250px] md:min-h-[600px]">
        <!-- PLACEHOLDER / SCRIPT RED PUBLICITARIA -->
        <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">[ SLOT 2 SIDE ]</span>
      </div>
    `;
    console.log("🟢 [ADS] Slot 2 (Side) desplegado en posición.");
  }
};

