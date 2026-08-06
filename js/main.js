document.addEventListener('DOMContentLoaded', () => {
  // === ESTADO GLOBAL ===
  let currentType = 'url';
  let qrEngine = null; // Instancia del generador
  let currentPayload = ''; // Datos del QR
  let isSpamFlagged = false;
  
  // Banderas para publicidad UX amigable (Solo saltan 1 vez por sesión)
  let hasSeenColorAd = false;
  let hasSeenShapeAd = false;

  // === ELEMENTOS DEL DOM ===
  const inputZone = document.getElementById('input-zone');
  const customZone = document.getElementById('customization-zone');
  const inputArea = document.getElementById('input-area');
  const typeButtons = document.querySelectorAll('#type-selector button');
  
  // === ENLACE DE COMUNICACIÓN CON EL BÚNKER (API) ===
  const API_BASE_URL = 'https://libreqr-studios-back.onrender.com/api';
  
  // === INICIALIZAR FORMULARIO POR DEFECTO ===
  renderFormInputs('url');

  // === SELECTOR MODULAR DE FORMATOS ===
  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => {
        b.classList.remove('active', 'bg-[#001100]');
      });
      btn.classList.add('active', 'bg-[#001100]');
      currentType = btn.dataset.type;
      renderFormInputs(currentType);
      
      // 🟢 TELEMETRÍA: CAMBIO DE FORMATO
      if (typeof TelemetryEngine !== 'undefined') {
        TelemetryEngine.trackEvent('SELECCIONAR_FORMATO', { formato: currentType });
      }
    });
  });

  function renderFormInputs(type) {
    const templates = {
      url: `<input type="url" id="qr-data" placeholder="https://www.cyberenterados.com" class="w-full p-4 bg-black border border-[#00FF00] text-[#00FF00] font-mono rounded">`,
      text: `<textarea id="qr-data" maxlength="300" rows="4" placeholder="Escribe tu mensaje (Máx 300 chars, sin links)..." class="w-full p-3 bg-black border border-[#00FF00] text-[#00FF00] font-mono rounded"></textarea>`,
      maps: `<input type="url" id="qr-data" placeholder="Enlace de Google Maps o Coordenadas..." class="w-full p-4 bg-black border border-[#00FF00] text-[#00FF00] font-mono rounded">`,
      wifi: `
        <input type="text" id="wifi-ssid" placeholder="Nombre de la Red (SSID)" class="w-full p-3 mb-2 bg-black border border-[#00FF00] text-[#00FF00] font-mono rounded">
        <input type="password" id="wifi-pass" placeholder="Contraseña (Opcional)" class="w-full p-3 mb-2 bg-black border border-[#00FF00] text-[#00FF00] font-mono rounded">
        <select id="wifi-type" class="w-full p-3 bg-black border border-[#00FF00] text-[#00FF00] font-mono rounded">
          <option value="WPA">Seguridad WPA/WPA2/WPA3</option>
          <option value="WEP">Seguridad WEP</option>
          <option value="nopass">Red Abierta (Sin Clave)</option>
        </select>`,
      vcard: `
        <input type="text" id="vcard-name" placeholder="Nombre Completo" class="w-full p-3 mb-2 bg-black border border-[#00FF00] text-[#00FF00] font-mono rounded">
        <input type="tel" id="vcard-phone" placeholder="Teléfono" class="w-full p-3 mb-2 bg-black border border-[#00FF00] text-[#00FF00] font-mono rounded">
        <input type="email" id="vcard-email" placeholder="Correo Electrónico" class="w-full p-3 mb-2 bg-black border border-[#00FF00] text-[#00FF00] font-mono rounded">
        <input type="text" id="vcard-company" placeholder="Empresa / Organización" class="w-full p-3 bg-black border border-[#00FF00] text-[#00FF00] font-mono rounded">`
    };
    inputArea.innerHTML = `<label class="block text-sm mb-2 opacity-80">>_ INGRESA LOS DATOS</label>` + templates[type];
  }

  // === ESCUDO REGEX (FRONTEND) ===
  function detectSpamFrontend(text) {
    const urlPattern = /(https?:\/\/|www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i;
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
    return urlPattern.test(text) || emailPattern.test(text);
  }

  // === GESTOR DE DATOS ===
  function extractPayload() {
    isSpamFlagged = false;
    if (currentType === 'url' || currentType === 'maps') {
      const val = document.getElementById('qr-data').value.trim();
      if (!val) { alert('⛔ Búnker informa: El enlace está vacío.'); return null; }
      return val;
    }
    if (currentType === 'text') {
      const val = document.getElementById('qr-data').value.trim();
      if (!val) { alert('⛔ Búnker informa: El texto está vacío.'); return null; }
      if (detectSpamFrontend(val)) {
        alert('⚠️ [ALERTA DE SEGURIDAD]: Detectamos un enlace o correo. Por favor, usa el formato correspondiente o retíralo.');
      }
      return val;
    }
    if (currentType === 'wifi') {
      const ssid = document.getElementById('wifi-ssid').value.trim();
      const pass = document.getElementById('wifi-pass').value.trim();
      const type = document.getElementById('wifi-type').value;
      if (!ssid) { alert('⛔ Búnker informa: Falla SSID de red.'); return null; }
      return `WIFI:S:${ssid};T:${type};P:${pass};;`;
    }
    if (currentType === 'vcard') {
      const name = document.getElementById('vcard-name').value.trim();
      const phone = document.getElementById('vcard-phone').value.trim();
      const email = document.getElementById('vcard-email').value.trim();
      const org = document.getElementById('vcard-company').value.trim();
      if (!name) { alert('⛔ Búnker informa: Se requiere un nombre para la vCard.'); return null; }
      return `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nTEL:${phone}\nEMAIL:${email}\nORG:${org}\nEND:VCARD`;
    }
    return null;
  }

  // === ZONA 2: PEAJE INICIAL (BOTÓN GENERAR) ===
  document.getElementById('btn-generate').addEventListener('click', async () => {
    currentPayload = extractPayload();
    if (!currentPayload) return;

    // 🟢 TELEMETRÍA: INTENTO DE GENERACIÓN
    if (typeof TelemetryEngine !== 'undefined') {
      TelemetryEngine.trackEvent('DISPARAR_GENERACION', { tipo: currentType });
    }

    try {
      if (typeof AntiBlockManager !== 'undefined') {
        const isAdBlockerPresent = await AntiBlockManager.isAdBlockActive();
        if (isAdBlockerPresent) {
          AntiBlockManager.showWarningModal();
          return;
        }
      }
    } catch (e) {
      console.warn("⚠️ Radar Anti-AdBlock offline. Permitiendo paso...");
    }

    console.log("🟢 Conexión limpia (AdBlock Desactivado). Generando QR...");

    const modalAd = document.getElementById('modal-ad');
    const adCountdown = document.getElementById('ad-countdown');

    modalAd.classList.remove('hidden');

    let seconds = 10; // Tiempo de peaje
    adCountdown.textContent = seconds < 10 ? `0${seconds}` : seconds;

    const timer = setInterval(() => {
      seconds--;
      adCountdown.textContent = seconds < 10 ? `0${seconds}` : seconds;
      if (seconds <= 0) {
        clearInterval(timer);
        modalAd.classList.add('hidden');
        inputZone.classList.add('hidden');
        customZone.classList.remove('hidden');
        initLiveCanvas(currentPayload);
      }
    }, 1000);
  });

  // === INICIALIZAR LIBRERÍA QR STYLING ===
  function initLiveCanvas(data) {
    const previewContainer = document.getElementById('qr-live-preview');
    previewContainer.innerHTML = ''; 

    qrEngine = new QRCodeStyling({
      width: 250, 
      height: 250,
      margin: 5, // >_ CIRUGÍA: ZONA DE SILENCIO (Quiet Zone) APLICADA
      type: "canvas",
      data: data,
      dotsOptions: { color: "#000000", type: "square" },
      backgroundOptions: { color: "#ffffff" },
      imageOptions: { crossOrigin: "anonymous", margin: 10, imageSize: 0.3 }
    });

    qrEngine.append(previewContainer);
  }

  // === ZONA 3: ESTACIÓN DE DISEÑO (MODALES INTERSTITIALES CONTROLADOS) ===

  // Función que dispara el Modal de Diseño de 10s (Evita popunders invasivos)
  function triggerDesignAd(moduleName, callback) {
    const modal = document.getElementById('modal-design-ad');
    const countdownEl = document.getElementById('design-ad-countdown');
    
    modal.classList.remove('hidden');
    
    let seconds = 10;
    countdownEl.textContent = seconds < 10 ? `0${seconds}` : seconds;
    
    const timer = setInterval(() => {
      seconds--;
      countdownEl.textContent = seconds < 10 ? `0${seconds}` : seconds;
      if (seconds <= 0) {
        clearInterval(timer);
        modal.classList.add('hidden');
        callback(); // Ejecuta el cambio de color o forma
      }
    }, 1000);
  }

  // Función comodín para los Direct Links (Se conectará luego con el AdManager)
  function tryTriggerDirectLink() {
    if (typeof triggerAdsterraDirectLink === 'function') {
      triggerAdsterraDirectLink();
    }
  }

  // 1. Chips de Color
  const colorChips = document.querySelectorAll('.color-chip');
  colorChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const hex = chip.dataset.color;
      
      const applyColor = () => {
        tryTriggerDirectLink(); // [NODO DE INYECCIÓN - DIRECT LINK]
        colorChips.forEach(c => c.classList.remove('ring-2', 'ring-[#00FF00]'));
        chip.classList.add('ring-2', 'ring-[#00FF00]');
        document.getElementById('custom-color-picker').value = hex;
        if (qrEngine) qrEngine.update({ dotsOptions: { color: hex } });
        
        // 🟢 TELEMETRÍA: COLOR APLICADO
        if (typeof TelemetryEngine !== 'undefined') {
          TelemetryEngine.trackEvent('PERSONALIZAR_COLOR', { hex: hex });
        }
      };

      if (!hasSeenColorAd) {
        hasSeenColorAd = true;
        triggerDesignAd("COLOR", applyColor);
      } else {
        applyColor(); // Si ya vio el anuncio, cambia libremente
      }
    });
  });

  // Color Picker Libre
  document.getElementById('custom-color-picker').addEventListener('input', (e) => {
    colorChips.forEach(c => c.classList.remove('ring-2', 'ring-[#00FF00]'));
    if (qrEngine) qrEngine.update({ dotsOptions: { color: e.target.value } });
    
    // 🟢 TELEMETRÍA: COLOR LIBRE
    if (typeof TelemetryEngine !== 'undefined') {
      TelemetryEngine.trackEvent('PERSONALIZAR_COLOR_LIBRE', { hex: e.target.value });
    }
  });

  // 2. Formas de Módulos
  const shapeBtns = document.querySelectorAll('.shape-btn');
  shapeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const shape = btn.dataset.shape;
      
      const applyShape = () => {
        tryTriggerDirectLink(); // [NODO DE INYECCIÓN - DIRECT LINK]
        shapeBtns.forEach(b => b.classList.remove('bg-[#00FF00]', 'text-black', 'font-bold'));
        btn.classList.add('bg-[#00FF00]', 'text-black', 'font-bold');
        if (qrEngine) qrEngine.update({ dotsOptions: { type: shape } });
        
        // 🟢 TELEMETRÍA: FORMA APLICADA
        if (typeof TelemetryEngine !== 'undefined') {
          TelemetryEngine.trackEvent('PERSONALIZAR_FORMA', { forma: shape });
        }
      };

      if (!hasSeenShapeAd) {
        hasSeenShapeAd = true;
        triggerDesignAd("ESTRUCTURA", applyShape);
      } else {
        applyShape(); // Si ya vio el anuncio, cambia libremente
      }
    });
  });

  // 3. Subida de Logo (Filtro 2MB)
  const logoInput = document.getElementById('logo-upload');
  const btnClearLogo = document.getElementById('btn-clear-logo');
  
  logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('⛔ Archivo demasiado grande. Límite máximo: 2MB.');
      logoInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Img = event.target.result;
      if (qrEngine) {
        // hideBackgroundDots hace que el QR quite los puntos detrás del logo
        qrEngine.update({ 
          image: base64Img, 
          imageOptions: { hideBackgroundDots: true, imageSize: 0.3, margin: 10 } 
        });
        btnClearLogo.classList.remove('hidden');
        
        // 🟢 TELEMETRÍA: LOGO SUBIDO
        if (typeof TelemetryEngine !== 'undefined') {
          TelemetryEngine.trackEvent('CARGAR_LOGO_PERSONALIZADO', { sizeMB: (file.size / 1024 / 1024).toFixed(2) });
        }
      }
    };
    reader.readAsDataURL(file);
  });

  btnClearLogo.addEventListener('click', () => {
    logoInput.value = '';
    btnClearLogo.classList.add('hidden');
    if (qrEngine) qrEngine.update({ image: '' }); 
  });

  // === DESCARGA EN ALTA RESOLUCIÓN HD/4K ===
  function executeDownload(extension) {
    if (!qrEngine) return;
    
    // Aquí el usuario ya interactuó suficiente, le damos el QR sin más anuncios.
    tryTriggerDirectLink(); // [NODO DE INYECCIÓN - DIRECT LINK]

    const size = parseInt(document.getElementById('download-resolution').value);
    
    qrEngine.update({ width: size, height: size });

    qrEngine.download({
      name: `LibreQR_${Date.now()}`,
      extension: extension 
    }).then(() => {
      qrEngine.update({ width: 250, height: 250 }); // Restaurar vista
      
      // 🟢 TELEMETRÍA GLOBAL DE LA DESCARGA
      if (typeof TelemetryEngine !== 'undefined') {
        TelemetryEngine.trackEvent('EXPORTAR_DOCUMENTO', { formato: extension, resolucion: size });
      }

      // 🟢 AVISAR AL BÚNKER DE LA NUEVA DESCARGA (+1)
      try {
        fetch(`${API_BASE_URL}/stats/increment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }).catch(e => console.warn("Telemetría silenciosa."));
      } catch (err) {}

      document.getElementById('modal-feedback').classList.remove('hidden');
    });
  }

  document.getElementById('btn-download-png').addEventListener('click', () => executeDownload('png'));
  document.getElementById('btn-download-jpg').addEventListener('click', () => executeDownload('jpeg'));

  // === FLUJO DEL MODAL DE FEEDBACK ===
  const emojiBtns = document.querySelectorAll('#emoji-picker span');
  const btnCloseFeedback = document.getElementById('btn-close-feedback');
  let selectedRating = 5;

  emojiBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      emojiBtns.forEach(b => b.classList.remove('scale-125', 'ring-2', 'ring-[#00FF00]', 'rounded-full', 'grayscale-0'));
      emojiBtns.forEach(b => b.classList.add('grayscale'));
      
      btn.classList.remove('grayscale');
      btn.classList.add('scale-125', 'ring-2', 'ring-[#00FF00]', 'rounded-full', 'grayscale-0');
      
      selectedRating = btn.dataset.val;
      btnCloseFeedback.innerHTML = `✖ Cerrar (${btn.innerHTML})`;
    });
  });

  document.getElementById('btn-send-feedback').addEventListener('click', submitFeedback);
  btnCloseFeedback.addEventListener('click', submitFeedback);

  // === ENVÍO DE TELEMETRÍA AL BACKEND ===
  async function submitFeedback() {
    const comment = document.getElementById('feedback-text').value.trim();
    const btnSend = document.getElementById('btn-send-feedback');
    
    btnSend.disabled = true;
    btnSend.innerHTML = "ENVIANDO DATOS...";

    const downloadToken = `QR_SESSION_${Date.now().toString(36)}_${Math.random().toString(36).substr(2)}`;
    const payload = { rating: selectedRating, comment: comment, downloadToken: downloadToken };

    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) console.log("🟢 [TELEMETRÍA] Guardada en base principal.");
    } catch (error) {}
    
    document.getElementById('modal-feedback').classList.add('hidden');
    alert("¡Búnker agradece su telemetría! El QR está asegurado en su dispositivo.");
    location.reload(); 
  }

  // === CARGAR TELEMETRÍA PÚBLICA EN FOOTER ===
  async function loadPublicFeedback() {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/public`);
      const data = await response.json();

      if (data.success && data.reviews.length > 0) {
        const ticker = document.getElementById('feedback-ticker');
        if (ticker) {
          ticker.innerHTML = '';
          data.reviews.forEach(review => {
            const emojis = ['🤬', '🙁', '😐', '😊', '🚀'];
            const ratingEmoji = emojis[review.rating - 1] || '🚀';
            const dateObj = new Date(review.createdAt);
            const timeString = dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

            ticker.innerHTML += `
              <div class="border-l-2 border-[#00FF00] pl-3 py-2 bg-[#0a0a0a] mb-2 rounded shadow-[0_0_5px_rgba(0,255,0,0.1)]">
                <p class="text-[10px] opacity-60 mb-1">Telemetría de las ${timeString} | Nivel: ${ratingEmoji}</p>
                <p class="text-xs text-gray-300">"${review.comment || 'Operación silenciosa. Sin reporte de texto.'}"</p>
              </div>
            `;
          });
        }
      }
    } catch (error) {}
  }
  loadPublicFeedback();
});

