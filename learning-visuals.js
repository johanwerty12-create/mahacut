(() => {
  "use strict";
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function frame(visual, alt, className = "") {
    if (!visual || !visual.region || !visual.region.width || !visual.region.height) return '<div class="story-image-fallback" role="img">This illustration is unavailable. Use the action and observation notes.</div>';
    const r = visual.region;
    return '<div class="story-frame ' + className + '" data-visual-asset="' + escape(visual.asset) + '" style="--sheet-cols:' + visual.width / r.width + ';--sheet-rows:' + visual.height / r.height + ';--frame-x:-' + r.x / r.width * 100 + '%;--frame-y:-' + r.y / r.height * 100 + '%;--frame-ar:' + r.width / r.height + ' / 1"><img src="' + escape(visual.asset) + '" width="' + visual.width + '" height="' + visual.height + '" alt="' + escape(alt) + '" loading="lazy" decoding="async"></div>';
  }
  function fromSheet(cut, panel) {
    return { asset: cut.asset, width: cut.imageWidth, height: cut.imageHeight, region: cut.panelRegions[panel] };
  }
  function fromAsset(key, panel) {
    const a = window.THE_CRAFT_NEW_ASSETS?.[key];
    return a ? { asset: a.asset, width: a.width, height: a.height, region: a.regions[panel] } : null;
  }
  function bind(root = document) {
    root.querySelectorAll('.story-frame img').forEach(img => {
      if (img.dataset.learningBound) return;
      img.dataset.learningBound = "true";
      img.addEventListener('error', () => {
        const fallback = document.createElement('div');
        fallback.className = 'story-image-fallback'; fallback.setAttribute('role', 'img');
        fallback.textContent = 'The training illustration could not load. Continue with the action and observation notes.';
        img.replaceWith(fallback);
      }, { once: true });
    });
  }
  window.CraftVisual = { escape, frame, fromSheet, fromAsset, bind };
})();
