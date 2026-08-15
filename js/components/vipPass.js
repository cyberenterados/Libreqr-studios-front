/**
 * ============================================================================
 * 🎫 SALVOCONDUCTO VIP (MOTOR DE VERIFICACIÓN)
 * ============================================================================
 */
const VIPPassEngine = (() => {
  // Ajuste a la URL de su servidor en Render
  const BACKEND_URL = 'https://libreqr-studios-back.onrender.com/api/vip/verify'; 
  let isActive = false;

  const init = () => {
    const btn = document.getElementById('btn-redeem-vip');
    if(btn) btn.addEventListener('click', handleRedeem);
    
    // Si recargó la página y tiene sesión local de VIP, comprobar silenciosamente
    const savedEmail = sessionStorage.getItem('bunker_vip_email');
    if(savedEmail) verifyWithServer(savedEmail, true);
  };

  const handleRedeem = async () => {
    const emailInput = document.getElementById('input-vip-email').value;
    const msgBox = document.getElementById('vip-status-msg');
    
    if(!emailInput.includes('@')) {
      msgBox.textContent = '>_ ERROR: Coordenadas de email inválidas.';
      msgBox.className = "text-[10px] font-mono mt-2 text-red-500 block";
      return;
    }

    msgBox.textContent = '>_ ESTABLECIENDO CONEXIÓN SEGURA...';
    msgBox.className = "text-[10px] font-mono mt-2 text-[#00FF00] block animate-pulse";

    await verifyWithServer(emailInput, false);
  };

  const verifyWithServer = async (email, isSilent) => {
    const msgBox = document.getElementById('vip-status-msg');
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.valid) {
        isActive = true;
        sessionStorage.setItem('bunker_vip_email', email); // Sesión temporal
        
        if(msgBox) {
          msgBox.textContent = `>_ ACCESO CONCEDIDO. ${data.remainingHours}HS RESTANTES.`;
          msgBox.className = "text-[10px] font-mono mt-2 text-[#00FF00] block";
        }
        
        // Destruir modal de bloqueo y liberar UI
        setTimeout(() => {
          const modal = document.getElementById('modal-antiblock'); // Ajuste al ID de su modal
          if(modal) modal.classList.add('hidden');
        }, 1500);

      } else {
        isActive = false;
        sessionStorage.removeItem('bunker_vip_email');
        if(!isSilent && msgBox) {
          msgBox.textContent = `>_ ${data.msg}`;
          msgBox.className = "text-[10px] font-mono mt-2 text-yellow-500 block";
        }
      }
    } catch (err) {
      if(!isSilent && msgBox) {
        msgBox.textContent = '>_ ERROR DE COMUNICACIÓN CON EL BÚNKER.';
        msgBox.className = "text-[10px] font-mono mt-2 text-red-500 block";
      }
    }
  };

  const hasAccess = () => isActive;

  return { init, hasAccess };
})();

// Ignición al cargar
document.addEventListener('DOMContentLoaded', VIPPassEngine.init);

