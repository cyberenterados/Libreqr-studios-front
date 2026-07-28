// ==========================================
// 📢 BANNER TOP (728x90) ADSTERRA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('ad-banner-top');
  if (container) {
    // Inyectamos el iframe aislado
    container.innerHTML += `
      <iframe sandbox="allow-scripts allow-popups allow-same-origin" srcdoc="
        <html><head></head><body style='margin:0;padding:0;display:flex;justify-content:center;align-items:center;background:transparent;'>
          <script>
            atOptions = {
              'key' : 'fb4441ee10a2b52843e9600d293de6f1',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };
          </script>
          <script src='https://www.highperformanceformat.com/fb4441ee10a2b52843e9600d293de6f1/invoke.js'></script>
        </body></html>
      " style="width:728px; height:90px; border:none; overflow:hidden; position:relative; z-index:10;"></iframe>
    `;
  }
});

