document.addEventListener('DOMContentLoaded', () => {
  // === ESTADO GLOBAL ===
  let currentType = 'url';
  let qrEngine = null; // Instancia del generador
  let currentPayload = ''; // Datos del QR
  let isSpamFlagged = false;

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

  // === FLUJO DE GENERACIÓN (BOTÓN PRINCIPAL) ===
  document.getElementById('btn-generate').addEventListener('click', () => {
    currentPayload = extractPayload();
    if (!currentPayload) return;

    const modalAd = document.getElementById('modal-ad');
    const adZone = document.getElementById('ad-zone');
    const adCountdown = document.getElementById('ad-countdown');
    const downloadZone = document.getElementById('download-zone'); // Del modal viejo, lo ocultamos

    // 1. Mostrar anuncio interstitial
    modalAd.classList.remove('hidden');
    adZone.classList.remove('hidden');
    if (downloadZone) downloadZone.classList.add('hidden');

    let seconds = 3; // Tiempo rápido para pruebas, en prod poner 5 o 10
    adCountdown.textContent = `0${seconds}`;

    const timer = setInterval(() => {
      seconds--;
      adCountdown.textContent = `0${seconds}`;
      if (seconds <= 0) {
        clearInterval(timer);
        modalAd.classList.add('hidden'); // Cierra publicidad
        
        // 2. Transición a Estación de Diseño
        inputZone.classList.add('hidden');
        customZone.classList.remove('hidden');
        
        // 3. Renderizar Canvas en vivo
        initLiveCanvas(currentPayload);
      }
    }, 1000);
  });

  // === INICIALIZAR LIBRERÍA QR STYLING ===
  function initLiveCanvas(data) {
    const previewContainer = document.getElementById('qr-live-preview');
    previewContainer.innerHTML = ''; // Limpiar lienzo

    qrEngine = new QRCodeStyling({
      width: 250, // Tamaño visual en pantalla
      height: 250,
      type: "canvas",
      data: data,
      dotsOptions: { color: "#000000", type: "square" },
      backgroundOptions: { color: "#ffffff" },
      imageOptions: { crossOrigin: "anonymous", margin: 10, imageSize: 0.3 }
    });

    qrEngine.append(previewContainer);
  }

  // === CONTROLES DE DISEÑO EN VIVO ===

  // 1. Chips de Color
  const colorChips = document.querySelectorAll('.color-chip');
  colorChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      // Efecto visual activo
      colorChips.forEach(c => c.classList.remove('ring-2', 'ring-[#00FF00]'));
      chip.classList.add('ring-2', 'ring-[#00FF00]');
      
      const hex = chip.dataset.color;
      document.getElementById('custom-color-picker').value = hex;
      if (qrEngine) qrEngine.update({ dotsOptions: { color: hex } });
    });
  });

  // Color Picker Libre
  document.getElementById('custom-color-picker').addEventListener('input', (e) => {
    colorChips.forEach(c => c.classList.remove('ring-2', 'ring-[#00FF00]'));
    if (qrEngine) qrEngine.update({ dotsOptions: { color: e.target.value } });
  });

  // 2. Formas de Módulos
  const shapeBtns = document.querySelectorAll('.shape-btn');
  shapeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shapeBtns.forEach(b => {
        b.classList.remove('bg-[#00FF00]', 'text-black', 'font-bold');
      });
      btn.classList.add('bg-[#00FF00]', 'text-black', 'font-bold');
      
      const shape = btn.dataset.shape;
      if (qrEngine) qrEngine.update({ dotsOptions: { type: shape } });
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
      }
    };
    reader.readAsDataURL(file);
  });

  btnClearLogo.addEventListener('click', () => {
    logoInput.value = '';
    btnClearLogo.classList.add('hidden');
    if (qrEngine) qrEngine.update({ image: '' }); // Quita la imagen
  });

  // === DESCARGA EN ALTA RESOLUCIÓN HD/4K + TELEMETRÍA DE CONTEO (+1) ===
  function executeDownload(extension) {
    if (!qrEngine) return;
    const size = parseInt(document.getElementById('download-resolution').value);
    
    // Configurar temporalmente el tamaño gigante en memoria para exportar
    qrEngine.update({
      width: size,
      height: size
    });

    qrEngine.download({
      name: `LibreQR_${Date.now()}`,
      extension: extension // "png" o "jpeg"
    }).then(() => {
      // Restaurar tamaño visual para que no se rompa la web
      qrEngine.update({ width: 250, height: 250 });
      
      // 🟢 AVISAR AL BÚNKER DE LA NUEVA DESCARGA (+1)
      try {
        fetch(`${API_BASE_URL}/stats/increment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }).catch(e => console.warn("Telemetría de conteo en segundo plano silenciada."));
      } catch (err) {
        // Ignorar para no bloquear la UI
      }

      // Abrir modal de Feedback post-descarga
      document.getElementById('modal-feedback').classList.remove('hidden');
    });
  }

  document.getElementById('btn-download-png').addEventListener('click', () => executeDownload('png'));
  document.getElementById('btn-download-jpg').addEventListener('click', () => executeDownload('jpeg'));

  // === FLUJO DEL MODAL DE FEEDBACK (Votar y Cerrar) ===
  const emojiBtns = document.querySelectorAll('#emoji-picker span');
  const btnCloseFeedback = document.getElementById('btn-close-feedback');
  let selectedRating = 5; // Default 5 stars

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

  // === (NUEVO) ENVÍO DE TELEMETRÍA AL BACKEND ===
  async function submitFeedback() {
    const comment = document.getElementById('feedback-text').value.trim();
    const btnSend = document.getElementById('btn-send-feedback');
    
    // Desactivar botón para evitar doble envío (Anti-Spam de interfaz)
    btnSend.disabled = true;
    btnSend.innerHTML = "ENVIANDO DATOS...";

    // Generar un Token de Descarga Único para esta sesión
    const downloadToken = `QR_SESSION_${Date.now().toString(36)}_${Math.random().toString(36).substr(2)}`;

    const payload = {
      rating: selectedRating,
      comment: comment,
      downloadToken: downloadToken
    };

    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        console.log("🟢 [TELEMETRÍA] Datos cifrados y guardados en la base principal.");
      } else {
        console.warn("⚠️ [ALERTA DE BÚNKER] Mensaje del servidor:", data.message);
      }
    } catch (error) {
      console.error("🔴 [FALLA DE ENLACE] No se pudo contactar al servidor:", error);
    }
    
    // Cerrar modal y reiniciar
    document.getElementById('modal-feedback').classList.add('hidden');
    alert("¡Búnker agradece su telemetría! El QR está asegurado en su dispositivo.");
    location.reload(); 
  }

  // === (NUEVO) CARGAR TELEMETRÍA PÚBLICA EN EL FOOTER ===
  async function loadPublicFeedback() {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/public`);
      const data = await response.json();

      if (data.success && data.reviews.length > 0) {
        const ticker = document.getElementById('feedback-ticker');
        if (ticker) {
          ticker.innerHTML = ''; // Limpiar textos falsos de prueba

          data.reviews.forEach(review => {
            // Asignar emoji según el rating
            const emojis = ['🤬', '🙁', '😐', '😊', '🚀'];
            const ratingEmoji = emojis[review.rating - 1] || '🚀';
            
            // Formatear hora de la operación (Hora de Buenos Aires)
            const dateObj = new Date(review.createdAt);
            const timeString = dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

            const reviewHTML = `
              <div class="border-l-2 border-[#00FF00] pl-3 py-2 bg-[#0a0a0a] mb-2 rounded shadow-[0_0_5px_rgba(0,255,0,0.1)]">
                <p class="text-[10px] opacity-60 mb-1">Telemetría de las ${timeString} | Nivel: ${ratingEmoji}</p>
                <p class="text-xs text-gray-300">"${review.comment || 'Operación silenciosa. Sin reporte de texto.'}"</p>
              </div>
            `;
            ticker.innerHTML += reviewHTML;
          });
        }
      }
    } catch (error) {
      console.error("🔴 [RADAR OFFLINE] No se pudieron cargar las opiniones de la comunidad.");
    }
  }

  // Ejecutar el radar al iniciar la web
  loadPublicFeedback();
});