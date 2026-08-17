/**
 * ============================================================================
 * 🛡️ PROTOCOLO FIRST-PARTY: PARTNER ROTATOR & ECOSYSTEM
 * Blindado contra bloqueadores. Inyecta afiliados propios en los 4 flancos.
 * ============================================================================
 */

const PartnerRotator = (() => {
  const ROTATION_INTERVAL = 8000; // 8 segundos

  // 🗼 FLANCO IZQUIERDO: Infraestructura Cloud
  const leftArtillery = [
    {
      title: "DigitalOcean Cloud",
      copy: "Despliega servidores y apps en la nube con $200 USD de crédito gratis para iniciar.",
      link: "https://m.do.co/c/f4fdfe96ed4c",
      icon: "☁️",
      badgeText: "$200 USD FREE"
    },
    {
      title: "InterServer VPS",
      copy: "Servidores virtuales ultrarrápidos y hosting sin límites de transferencia.",
      link: "https://www.interserver.net/r/517869",
      icon: "🖥️",
      badgeText: "ALTO RENDIMIENTO"
    }
  ];

  // 🗼 FLANCO DERECHO: Hosting & Proyectos
  const rightArtillery = [
    {
      title: "InterServer Webhosting",
      copy: "¿Creando tu web o tienda online? Hospedaje confiable con soporte 24/7 y SSL incluido.",
      link: "https://www.interserver.net/webhosting/?id=517869",
      icon: "⚡",
      badgeText: "HOSTING GLOBAL"
    },
    {
      title: "ManuExplora-Studios",
      copy: "¿Necesitas desarrollo a medida? Webs, apps y plataformas de alta velocidad.",
      link: "https://manuexplora-studios.vercel.app/",
      icon: "🚀",
      badgeText: "STUDIO CENTRAL"
    }
  ];

  // 📢 FLANCO SUPERIOR (Nuevo Banner Horizontal)
  const renderTopBanner = () => `
    <div class="w-full bg-[#050505] border border-[#003300] rounded p-4 flex flex-col md:flex-row items-center justify-between transition-all duration-500 hover:border-[#00FF00] hover:shadow-[0_0_15px_rgba(0,255,0,0.2)] relative overflow-hidden group">
      
      <div class="flex items-center gap-4 mb-3 md:mb-0 relative z-10">
        <span class="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">☁️</span>
        <div class="text-left font-mono">
          <span class="text-[9px] text-[#00FF00] font-bold bg-[#002200] px-2 py-0.5 rounded border border-[#00FF00] uppercase tracking-widest inline-block mb-1 animate-pulse">>_ RECURSO RECOMENDADO</span>
          <h4 class="text-white text-sm md:text-base font-bold">Inicia en la nube con DigitalOcean</h4>
          <p class="text-gray-400 text-xs hidden md:block mt-1">Obtén $200 USD de crédito gratuito durante 60 días para desplegar tus proyectos.</p>
        </div>
      </div>
      <a href="https://m.do.co/c/f4fdfe96ed4c" target="_blank" rel="noopener noreferrer nofollow" class="relative z-10 whitespace-nowrap border border-[#00FF00] bg-[#001100] text-[#00FF00] px-6 py-3 text-xs md:text-sm font-bold font-mono rounded hover:bg-[#00FF00] hover:text-black transition-all shadow-[0_0_10px_rgba(0,255,0,0.3)]">
        [ RECLAMAR $200 USD ] ↗
      </a>
    </div>
  `;

  // 📢 FLANCO INFERIOR (Fallback Horizontal Extendido)
  const renderBottomFallback = () => `
    <div class="w-full flex flex-col md:flex-row gap-6 justify-between items-center bg-[#050505] border border-[#003300] rounded p-6 transition-all hover:border-[#00FF00] hover:shadow-[0_0_15px_rgba(0,255,0,0.1)]">
      <div class="flex-1 text-center md:text-left border-b md:border-b-0 md:border-r border-[#003300] pb-4 md:pb-0 md:pr-6">
        <span class="text-xs text-[#00FF00] font-mono uppercase tracking-widest block mb-1">>_ INFRAESTRUCTURA DEL BÚNKER</span>
        <h4 class="text-white text-sm md:text-base font-bold mb-1">Despliega tus proyectos en la Nube</h4>
        <p class="text-gray-400 text-xs font-mono mb-4">Aprovecha $200 USD de crédito en DigitalOcean o servidores ilimitados en InterServer.</p>
        <div class="flex flex-wrap gap-3 justify-center md:justify-start">
          <a href="https://m.do.co/c/f4fdfe96ed4c" target="_blank" rel="noopener noreferrer nofollow" class="border border-[#00FF00] bg-[#001100] text-[#00FF00] text-[10px] md:text-xs font-bold py-2 px-4 rounded hover:bg-[#00FF00] hover:text-black transition-colors font-mono">
            ☁️ DIGITALOCEAN
          </a>
          <a href="https://www.interserver.net/webhosting/?id=517869" target="_blank" rel="noopener noreferrer nofollow" class="border border-gray-700 text-gray-300 text-[10px] md:text-xs font-bold py-2 px-4 rounded hover:border-[#00FF00] hover:text-[#00FF00] transition-colors font-mono">
            🖥️ INTERSERVER
          </a>
        </div>
      </div>
      <div class="flex-1 text-center md:text-left pt-2 md:pt-0 md:pl-6">
        <span class="text-xs text-[#00FF00] font-mono uppercase tracking-widest block mb-1">>_ PROTOCOLO DE SOSTENIMIENTO</span>
        <h4 class="text-white text-sm md:text-base font-bold mb-1">LibreQR es 100% Libre y Privado</h4>
        <p class="text-gray-400 text-xs font-mono mb-4">Si usas bloqueador de anuncios y te sirvió la herramienta, apoya los servidores invitándonos un café.</p>
        <a href="https://ko-fi.com/manuexplora" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 border border-[#00FF00] bg-[#002200] text-[#00FF00] text-xs font-bold py-2 px-5 rounded hover:bg-[#00FF00] hover:text-black transition-all shadow-[0_0_10px_rgba(0,255,0,0.3)] font-mono">
          ☕ INVITAR UN CAFÉ EN KO-FI
        </a>
      </div>
    </div>
  `;

  // 🗼 TARJETAS VERTICALES
  const renderCardHTML = (data) => `
    <a href="${data.link}" target="_blank" rel="noopener noreferrer nofollow" 
       class="block w-full max-w-[200px] bg-[#050505] border border-[#003300] hover:border-[#00FF00] rounded p-4 text-left transition-all duration-500 shadow-[0_0_10px_rgba(0,0,0,0.8)] hover:shadow-[0_0_15px_rgba(0,255,0,0.25)] group mb-4 relative overflow-hidden">
      <div class="absolute inset-0 bg-[#00FF00] opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
      <div class="flex items-center justify-between mb-3 relative z-10">
        <span class="text-3xl grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">${data.icon}</span>
        <span class="text-[9px] bg-[#002200] text-[#00FF00] border border-[#00FF00]/40 px-1.5 py-0.5 rounded font-mono font-bold">
          ${data.badgeText}
        </span>
      </div>
      <h4 class="text-[#00FF00] font-bold text-xs uppercase tracking-wider mb-2 font-mono group-hover:text-white transition-colors relative z-10">
        >_ ${data.title}
      </h4>
      <p class="text-gray-400 text-[10px] font-mono leading-relaxed mb-4 group-hover:text-gray-200 relative z-10">
        ${data.copy}
      </p>
      <div class="text-[9px] text-[#00FF00] opacity-60 group-hover:opacity-100 flex items-center gap-1 uppercase tracking-widest font-mono relative z-10">
        <span>[ EXPLORAR ] ↗</span>
      </div>
    </a>
  `;

  let leftIndex = 0;
  let rightIndex = 0;

  const startRotation = () => {
    const topContainer = document.getElementById('partner-dock-top');
    const bottomContainer = document.getElementById('partner-dock-bottom');
    const leftContainer = document.getElementById('partner-dock-left');
    const rightContainer = document.getElementById('partner-dock-right');

    if (topContainer) topContainer.innerHTML = renderTopBanner();
    if (bottomContainer) bottomContainer.innerHTML = renderBottomFallback();
    if (leftContainer) leftContainer.innerHTML = renderCardHTML(leftArtillery[leftIndex]);
    if (rightContainer) rightContainer.innerHTML = renderCardHTML(rightArtillery[rightIndex]);

    setInterval(() => {
      leftIndex = (leftIndex + 1) % leftArtillery.length;
      rightIndex = (rightIndex + 1) % rightArtillery.length;

      if (leftContainer) leftContainer.innerHTML = renderCardHTML(leftArtillery[leftIndex]);
      if (rightContainer) rightContainer.innerHTML = renderCardHTML(rightArtillery[rightIndex]);
    }, ROTATION_INTERVAL);
  };

  const deploy = () => {
    console.log("⚡ [SISTEMA] Ecosistema Nativo Activado: Cubriendo los 4 flancos publicitarios.");
    startRotation();
  };

  // 🚀 AUTO-IGNICIÓN: Integración inteligente con el Escudo Anti-AdBlock
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      // 1. Preguntamos al radar global si detectó un escudo enemigo (Brave/Adblock)
      const isBlockedByRadar = window.isBunkerShieldActive;
      
      // 2. Verificamos visualmente si A-Ads falló al inyectar el iframe (altura colapsada)
      const leftContainer = document.getElementById('partner-dock-left');
      const isAAdsMissing = leftContainer && leftContainer.offsetHeight < 50;

      if (isBlockedByRadar || isAAdsMissing) {
        // Purgamos la basura invisible que haya podido dejar A-Ads
        ['partner-dock-top', 'partner-dock-bottom', 'partner-dock-left', 'partner-dock-right'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = '';
        });
        
        // ¡Fuego a discreción!
        deploy();
      }
    }, 1200); // Retraso estratégico para darle tiempo a A-Ads y al escáner de red
  });

  return { deploy };
})();

