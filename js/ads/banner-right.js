// ==========================================
// 🗼 FLANCO DERECHO: BANNER 160x300 ADSTERRA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('ad-sidebar-right');
  if (container) {
    container.innerHTML = `
      <!-- BEGIN AADS AD UNIT -->
      <div style="width: 100%; margin: auto; display: flex; justify-content: center; align-items: center;">
        <iframe data-aa='2449857' 
                src='https://acceptable.a-ads.com/2449857/?size=Adaptive'
                style='border:0; padding:0; width:100%; height:auto; min-height:300px; overflow:hidden; display: block; margin: auto;'
                sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-forms">
        </iframe>
      </div>
      <!-- END AADS AD UNIT -->
    `;
  }
});

