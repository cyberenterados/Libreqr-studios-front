// ==========================================
// 🎯 BATERÍA PUBLICITARIA: SLOT 5 (INTERSTICIAL / POPUNDER)
// ==========================================
const InterceptDownload = {
  // Maneja la retención visual en el generador (Modal y cuenta regresiva)
  trigger(onComplete, holdTimeSeconds = 5) {
    console.log(`🎯 [ADS] Detonando retención visual. Tiempo: ${holdTimeSeconds}s`);

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
      // Respaldo de emergencia si falla la UI
      if (typeof onComplete === 'function') onComplete();
    }
  }
};

// 💣 CARGA SILENCIOSA DE LA OJIVA ADSTERRA (Auto-ejecutable)
(function armarMisil() {
  try {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    // AQUÍ ESTÁ SU MUNICIÓN EXACTA DE ADSTERRA
    script.src = 'https://pl30551324.effectivecpmnetwork.com/92/1a/56/921a5674ddb35e0dd2b29bbfd20fb156.js';
    document.head.appendChild(script);
    console.log("🟢 [ADS] Ojiva Popunder (Adsterra) enclavada y lista para detonar.");
  } catch (e) {
    console.warn("🔴 [ADS] Falla al armar el misil Popunder.");
  }
})();

