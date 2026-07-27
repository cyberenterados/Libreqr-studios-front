// ==========================================
// 🗼 FLANCO IZQUIERDO: BANNER 160x300 ADSTERRA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('ad-sidebar-left');
  if (container) {
    container.innerHTML = `
      <iframe srcdoc="
        <html><head></head><body style='margin:0;padding:0;display:flex;justify-content:center;align-items:center;background:transparent;'>
          <script>
            atOptions = {
              'key' : '66462f3e9f2f0df3cc7aac33a01a2845',
              'format' : 'iframe',
              'height' : 300,
              'width' : 160,
              'params' : {}
            };
          </script>
          <script src='https://www.highperformanceformat.com/66462f3e9f2f0df3cc7aac33a01a2845/invoke.js'></script>
        </body></html>
      " style="width:160px; height:300px; border:none; overflow:hidden;"></iframe>
    `;
  }
});

