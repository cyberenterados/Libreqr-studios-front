// ==========================================
// 📡 TELEMETRY ENGINE - BÚNKER LIBREQR (FRONTEND)
// Motor de Rastreo Civil en Vivo (OP-#XXXX)
// ==========================================
const TelemetryEngine = (() => {
  const API_URL = 'https://libreqr-studios-back.onrender.com/api/health';
  let currentOpId = null;
  let stepCounter = 1;

  // Generar ID único de operación (Ej: OP-#8942)
  const generateOpId = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `OP-#${rand}`;
  };

  // Extraer metadata del entorno civil
  const getMetadata = () => {
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    return {
      dispositivo: isMobile ? 'Móvil' : 'Escritorio',
      navegador: navigator.userAgentData ? navigator.userAgentData.brands[0]?.brand : 'Navegador Web',
      pantalla: `${window.innerWidth}x${window.innerHeight}`,
      idioma: navigator.language || 'es'
    };
  };

  // Enviar paquete asíncrono (sendBeacon para cero latencia)
  const sendPayload = (endpoint, payload) => {
    const url = `${API_URL}/${endpoint}`;
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  };

  // Iniciar Sesión de Operación al entrar
  const init = () => {
    currentOpId = generateOpId();
    stepCounter = 1;

    const payload = {
      id_operacion: currentOpId,
      metadata_entorno: getMetadata(),
      primer_evento: {
        paso: stepCounter++,
        timestamp: new Date().toISOString(),
        accion: 'INGRESO_SITIO',
        detalles: { url: window.location.href }
      }
    };

    sendPayload('iniciar', payload);
    console.log(`📡 [TELEMETRÍA] Radar enlazado. Operación: ${currentOpId}`);
  };

  // Disparar evento de interacción en vivo
  const trackEvent = (accion, detalles = {}) => {
    if (!currentOpId) return;

    const payload = {
      id_operacion: currentOpId,
      evento: {
        paso: stepCounter++,
        timestamp: new Date().toISOString(),
        accion: accion,
        detalles: detalles
      }
    };

    sendPayload('evento', payload);
  };

  return {
    init,
    trackEvent,
    getOpId: () => currentOpId
  };
})();

// Autoejecución al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  TelemetryEngine.init();
});