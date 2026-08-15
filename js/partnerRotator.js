/**
 * ============================================================================
 * 🛡️ PROTOCOLO FIRST-PARTY: PARTNER ROTATOR & ECOSYSTEM
 * ============================================================================
 * Módulo nativo independiente para rotación de afiliados e infraestructura.
 * Blindado contra bloqueadores por nomenclatura neutral.
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
      copy: "Servidores virtuales ultrarrápidos y hosting sin límites de transferencia. Calidad Data Center.",
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
      copy: "¿Necesitas desarrollo a medida? Webs, apps y plataformas de alta velocidad en Buenos Aires.",
      link: "https://manuexplora-studios.vercel.app/",
      icon: "🚀",
      badgeText: "STUDIO CENTRAL"
    }
  ];

  let leftIndex = 0;
  let rightIndex = 0;

  const renderCardHTML = (data) => `
    <a href="${data.link}" target="_blank" rel="noopener noreferrer nofollow" 
       class="block w-full max-w-[200px] bg-[#050505] border border-[#003300] hover:border-[#00FF00] rounded p-4 text-left transition-all duration-500 shadow-[0_0_10px_rgba(0,0,0,0.8)] hover:shadow-[0_0_15px_rgba(0,255,0,0.25)] group mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-2xl grayscale group-hover:grayscale-0 transition-all duration-300">${data.icon}</span>
        <span class="text-[9px] bg-[#002200] text-[#00FF00] border border-[#00FF00]/40 px-1.5 py-0.5 rounded font-mono font-bold">
          ${data.badgeText}
        </span>
      </div>
      <h4 class="text-[#00FF00] font-bold text-xs uppercase tracking-wider mb-1 font-mono group-hover:text-white transition-colors">
        >_ ${data.title}
      </h4>
      <p class="text-gray-400 text-[10px] font-mono leading-relaxed mb-3 group-hover:text-gray-200">
        ${data.copy}
      </p>
      <div class="text-[9px] text-[#00FF00] opacity-60 group-hover:opacity-100 flex items-center gap-1 uppercase tracking-widest font-mono">
        <span>[ EXPLORAR RECURSO ] ↗</span>
      </div>
    </a>
  `;

  const renderBottomFallback = () => `
    <div class="w-full max-w-[1200px] flex flex-col md:flex-row gap-6 justify-between items-center bg-[#0a0a0a] border border-[#003300] rounded p-6 shadow-[0_0_15px_rgba(0,255,0,0.1)]">
      <div class="flex-1 text-center md:text-left border-b md:border-b-0 md:border-r border-[#003300] pb-4 md:pb-0 md:pr-6">
        <span class="text-xs text-[#00FF00] font-mono uppercase tracking-widest block mb-1">>_ INFRAESTRUCTURA DEL BÚNKER</span>
        <h4 class="text-white text-sm md:text-base font-bold mb-1">Despliega tus proyectos en la Nube</h4>
        <p class="text-gray-400 text-xs font-mono mb-3">Aprovecha $200 USD de crédito en DigitalOcean o servidores ilimitados en InterServer.</p>
        <div class="flex flex-wrap gap-2 justify-center md:justify-start">
          <a href="https://m.do.co/c/f4fdfe96ed4c" target="_blank" rel="noopener noreferrer nofollow" class="border border-[#00FF00] bg-[#001100] text-[#00FF00] text-xs font-bold py-1.5 px-3 rounded hover:bg-[#00FF00] hover:text-black transition-colors font-mono">
            ☁️ DigitalOcean ($200 Gratis)
          </a>
          <a href="https://www.interserver.net/webhosting/?id=517869" target="_blank" rel="noopener noreferrer nofollow" class="border border-gray-700 text-gray-300 text-xs font-bold py-1.5 px-3 rounded hover:border-[#00FF00] hover:text-[#00FF00] transition-colors font-mono">
            🖥️ InterServer Hosting
          </a>
        </div>
      </div>
      <div class="flex-1 text-center md:text-left pt-2 md:pt-0 md:pl-6">
        <span class="text-xs text-[#00FF00] font-mono uppercase tracking-widest block mb-1">>_ PROTOCOLO DE SOSTENIMIENTO</span>
        <h4 class="text-white text-sm md:text-base font-bold mb-1">LibreQR es 100% Libre y Privado</h4>
        <p class="text-gray-400 text-xs font-mono mb-3">Si usas bloqueador de anuncios y te sirvió la herramienta, apoya los servidores invitándonos un café.</p>
        <a href="https://ko-fi.com/manuexplora" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 border border-[#00FF00] bg-[#002200] text-[#00FF00] text-xs font-bold py-2 px-5 rounded hover:bg-[#00FF00] hover:text-black transition-all shadow-[0_0_10px_rgba(0,255,0,0.2)] font-mono">
          ☕ INVITAR UN CAFÉ EN KO-FI
        </a>
      </div>
    </div>
  `;

  const startRotation = () => {
    const leftContainer = document.getElementById('ad-sidebar-left');
    const rightContainer = document.getElementById('ad-sidebar-right');

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
    console.log("⚡ [SISTEMA] PartnerRotator: Desplegando recomendaciones nativas.");
    startRotation();

    const bottomContainer = document.getElementById('ad-banner-bottom');
    if (bottomContainer) {
      bottomContainer.innerHTML = renderBottomFallback();
    }
  };

  // 🚀 AUTO-IGNICIÓN: Si a los 800ms los anuncios están bloqueados/vacíos, se activa solo
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      const leftContainer = document.getElementById('ad-sidebar-left');
      if (leftContainer && leftContainer.children.length === 0) {
        deploy();
      }
    }, 800);
  });

  return { deploy };
})();