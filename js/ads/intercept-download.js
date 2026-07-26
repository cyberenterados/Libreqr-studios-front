//(Slot 5 - Operación Intersticial / Pop-under en Descarga)

// ==========================================
// 🎯 BATERÍA PUBLICITARIA: SLOT 5 (INTERSTICIAL DE DESCARGA)
// ==========================================
const InterceptDownload = {
  // Dispara el pop-under o banner de alta rentabilidad durante la retención de descarga
  trigger(onComplete, holdTimeSeconds = 15) {
    console.log(`🎯 [ADS] Detonando Intersticial de Descarga. Retención: ${holdTimeSeconds}s`);

    // 1. Ejecutar Pop-under o código especial de red (Adsterra / PropellerAds / etc.)
    this.executePopUnderScript();

    // 2. Interfaz de retención visual para el usuario civil
    const modalAd = document.getElementById('modal-ad');
    const adCountdown = document.getElementById('ad-countdown');

    if (modalAd && adCountdown) {
      modalAd.classList.remove('hidden');
      let secondsLeft = holdTimeSeconds;
      adCountdown.textContent = secondsLeft < 10 ? `0${secondsLeft}` : `${secondsLeft}`;

      const timer = setInterval(() => {
        secondsLeft--;
        adCountdown.textContent = secondsLeft < 10 ? `0${secondsLeft}` : `${secondsLeft}`;

        if (secondsLeft <= 0) {
          clearInterval(timer);
          modalAd.classList.add('hidden');
          if (typeof onComplete === 'function') onComplete();
        }
      }, 1000);
    } else {
      // Si el modal no está en el DOM, ejecuta la descarga directamente
      if (typeof onComplete === 'function') onComplete();
    }
  },

  executePopUnderScript() {
    // Aquí inyectaremos el script On-Click o Pop-under de la red cuando activemos los anuncios reales.
  }
};

