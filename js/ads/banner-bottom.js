// ==========================================
// 📢 BANNER BOTTOM (728x90) ADSTERRA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('ad-banner-bottom');
  if (container) {
    // Inyectamos el iframe aislado
    container.innerHTML += `
      <!-- BEGIN AADS AD UNIT 2449861 -->
        <div id="frame" style="width: 100%;margin: auto;position: relative; z-index: 99998;">
          <iframe data-aa='2449861' src='//acceptable.a-ads.com/2449861/?size=Adaptive'
            style='border:0; padding:0; width:70%; height:auto; overflow:hidden;display: block;margin: auto'></iframe>
        </div>
      <!-- END AADS AD UNIT 2449861 -->
    `;
  }
});

