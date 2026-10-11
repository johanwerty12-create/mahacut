(() => {
  "use strict";
  const { escape: e, frame, fromSheet, bind } = window.CraftVisual;
  const profiles = window.THE_CRAFT_HAIRCUTS;
  const cuts = window.THE_CRAFT_WALKTHROUGHS;
  const root = document.getElementById('haircut-library-grid');
  const panel = document.getElementById('haircut-profile');
  let filter = 'beginner', search = '', selected = null, angle = 'side';
  const getCut = id => cuts.find(c => c.id === id);
  const finished = (cut, index) => cut.finishedVisuals?.[index] || fromSheet(cut, 16 + index);
  const stepVisual = (cut, n) => cut.steps[n].visual || fromSheet(cut, cut.steps[n].panel);
  const list = items => '<ul>' + items.map(s => '<li>' + e(s) + '</li>').join('') + '</ul>';
  function savedDrills() { try { return JSON.parse(localStorage.getItem('the-craft-progress-v2') || '{}').haircutDrills || []; } catch { return []; } }
  function renderCatalog() {
    const query = search.trim().toLowerCase();
    const items = profiles.filter(p => (filter === 'all' || p.group === filter) && [p.name, p.about, p.textures].join(' ').toLowerCase().includes(query));
    document.getElementById('library-result-count').textContent = items.length + ' ' + (items.length === 1 ? 'style' : 'styles') + ' · choose one to see the complete learning path';
    root.innerHTML = items.map(p => { const cut = getCut(p.id); return '<article class="haircut-library-card"><div class="library-card-photo">' + frame(finished(cut, 1), p.name + ' finished side view') + '</div><div class="library-card-copy"><span class="difficulty-badge difficulty-' + p.group + '">' + p.level + '</span><h3>' + e(p.name) + '</h3><p>' + e(p.about) + '</p><small>' + cut.steps.length + ' visual process steps</small><button class="button button-secondary" type="button" data-open-haircut="' + p.id + '">Explore this haircut <span aria-hidden="true">→</span></button></div></article>'; }).join('') || '<p class="library-empty">No styles match this search. Try a haircut name or clear the search.</p>';
    bind(root);
  }
  function renderAngle() {
    const cut = getCut(selected.id);
    const visual = angle === 'before' ? cut.beforeVisual || fromSheet(cut, 0) : finished(cut, { front: 0, side: 1, right: 2, back: 3 }[angle]);
    document.getElementById('profile-photo').innerHTML = frame(visual, selected.name + ' · ' + (angle === 'before' ? 'untouched starting length' : 'finished ' + angle + ' view'));
    panel.querySelectorAll('[data-profile-angle]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.profileAngle === angle)));
    document.getElementById('profile-photo-caption').textContent = angle === 'before' ? 'BEFORE · ORIGINAL LENGTH' : 'FINISHED · ' + (angle === 'side' ? 'LEFT SIDE' : angle.toUpperCase());
    bind(panel);
  }
  function renderProfile() {
    const p = selected, cut = getCut(p.id);
    const guide = cut.steps.findIndex(s => s.key === 'guide');
    const top = cut.steps.findIndex(s => s.key === 'top');
    const drills = [[guide, 'Read and rehearse the guide', cut.steps[guide].practice], [top, p.topGoal, cut.steps[top].practice]];
    const fadeLink = p.fadeTechnique ? '<a class="learning-path-link" href="fade-training.html?type=' + p.fadeTechnique + '&module=course"><span>FADE TECHNIQUE USED</span><strong>' + e(p.name) + ' · 30-step training →</strong></a>' : '';
    panel.innerHTML = '<header class="profile-heading"><div><p class="eyebrow">COMPLETE STYLE BRIEF</p><h2 id="haircut-profile-title" tabindex="-1">' + e(p.name) + '</h2></div><button class="button button-secondary" type="button" id="close-haircut-profile">← Back to styles</button></header><div class="profile-layout"><figure class="profile-visual"><div class="learning-choice-row profile-angles" role="group" aria-label="Haircut viewing angle">' + [['before', 'Before'], ['front', 'Front'], ['side', 'Left'], ['right', 'Right'], ['back', 'Back']].map(([id, label]) => '<button type="button" data-profile-angle="' + id + '" aria-pressed="false">' + label + '</button>').join('') + '</div><div id="profile-photo"></div><figcaption id="profile-photo-caption"></figcaption></figure><div class="profile-summary"><span class="difficulty-badge difficulty-' + p.group + '">' + p.level + '</span><h3>What is this haircut?</h3><p>' + e(p.about) + '</p><dl class="profile-facts"><div><dt>Approximate length</dt><dd>' + e(p.length) + '</dd></div><div><dt>Hair types and textures</dt><dd>' + e(p.textures) + '</dd></div><div><dt>Main practice goal</dt><dd>' + e(p.topGoal) + '</dd></div></dl><p class="learning-small-note">Length ranges describe examples, not universal specifications. Agree the result and test your own tools.</p><a class="button button-primary" href="haircut-patterns.html?walkthrough=' + p.id + '&step=1#cut-walkthrough">Learn the full ' + cut.steps.length + '-step process →</a>' + fadeLink + '</div></div><div class="profile-note-grid"><details class="learning-details" open><summary>Head shape and growth considerations</summary><p>' + e(p.headShapes) + '</p><p><strong>For this cut:</strong> ' + e(p.headNote) + '</p><p><strong>Fine or lighter-density hair:</strong> keep a conservative first length and inspect scalp visibility before taking more weight out.</p><a class="text-link" href="fade-training.html?module=head">Study seven head profiles and the landmarks →</a></details><details class="learning-details"><summary>Tools, common mistakes and beginner tips</summary><h4>Tools required</h4>' + list(p.tools) + '<h4>Common mistakes</h4>' + list(p.mistakes) + '<h4>Beginner tips</h4>' + list(p.tips) + '</details></div><section class="profile-practices"><p class="eyebrow">TWO SMALL DRILLS BEFORE A FULL CUT</p><h3>Quick Practice · ' + e(p.name) + '</h3><div class="learning-drill-grid">' + drills.map(([n, title, task], i) => '<article class="learning-drill-card">' + frame(stepVisual(cut, n), p.name + ' practice · ' + title) + '<div><h4>' + e(title) + '</h4><p>' + e(task) + '</p><a class="text-link" href="haircut-patterns.html?walkthrough=' + p.id + '&step=' + (n + 1) + '#cut-walkthrough">Open the matching step ' + (n + 1) + ' →</a><label class="learning-check"><input type="checkbox" data-haircut-drill="' + p.id + '-' + i + '"' + (savedDrills().includes(p.id + '-' + i) ? ' checked' : '') + '>I rehearsed this drill</label></div></article>').join('') + '</div></section><details class="learning-details"><summary>Final checklist · inspect before calling the cut complete</summary>' + list(p.checklist) + '</details>';
    renderAngle();
  }
  function open(id, scroll = true) {
    const profile = profiles.find(p => p.id === id);
    if (!profile || !getCut(id)) return;
    selected = profile; angle = 'side'; renderProfile();
    document.getElementById('haircut-catalog').hidden = true; panel.hidden = false;
    const url = new URL(location.href); url.searchParams.set('cut', id); history.replaceState({}, '', url);
    if (scroll) { panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); document.getElementById('haircut-profile-title').focus({ preventScroll: true }); }
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    if (button.dataset.catalogFilter) { filter = button.dataset.catalogFilter; document.querySelectorAll('[data-catalog-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); renderCatalog(); }
    if (button.dataset.openHaircut) open(button.dataset.openHaircut);
    if (button.dataset.profileAngle) { angle = button.dataset.profileAngle; renderAngle(); }
    if (button.id === 'close-haircut-profile') { panel.hidden = true; document.getElementById('haircut-catalog').hidden = false; const url = new URL(location.href); url.searchParams.delete('cut'); history.replaceState({}, '', url); document.getElementById('catalog-heading').scrollIntoView({ behavior: 'smooth' }); }
  });
  document.getElementById('haircut-search').addEventListener('input', event => { search = event.target.value; renderCatalog(); });
  panel.addEventListener('change', event => {
    const key = event.target.dataset.haircutDrill; if (!key) return;
    try { const state = JSON.parse(localStorage.getItem('the-craft-progress-v2') || '{}'); const values = new Set(Array.isArray(state.haircutDrills) ? state.haircutDrills : []); event.target.checked ? values.add(key) : values.delete(key); state.haircutDrills = [...values]; localStorage.setItem('the-craft-progress-v2', JSON.stringify(state)); }
    catch { event.target.checked = false; document.getElementById('profile-photo-caption').textContent = 'Progress could not save. Your practice notes are still available.'; }
  });
  renderCatalog(); open(new URLSearchParams(location.search).get('cut'), false);
})();
