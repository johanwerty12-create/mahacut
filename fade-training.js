(() => {
  "use strict";
  const { escape: e, frame, fromAsset, bind } = window.CraftVisual;
  const courses = window.THE_CRAFT_FADE_COURSES;
  const drills = window.THE_CRAFT_FADE_DRILLS;
  const KEY = 'the-craft-progress-v2';
  const query = new URLSearchParams(location.search);
  let course = courses.find(c => c.id === query.get('type')) || courses[0];
  let step = Math.max(0, Math.min(29, (Number(query.get('step')) || 1) - 1));
  let module = 'start', toolIndex = 0, guideIndex = 0, headIndex = 0, finalAngle = -1, drillFilter = 'control';
  function state() { try { const value = JSON.parse(localStorage.getItem(KEY) || '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; } catch { return {}; } }
  function save(change) { try { const s = state(); change(s); localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch { const note = document.getElementById('fade-save-note'); if (note) note.textContent = 'This browser could not save progress. You can still use every lesson.'; return false; } }
  const list = values => '<ul>' + values.map(v => '<li>' + e(v) + '</li>').join('') + '</ul>';
  const picture = (visual, alt) => frame(visual, alt, 'learning-main-frame');
  function goModule(id, update = true) {
    if (!['start', 'tools', 'guidelines', 'head', 'course', 'practice'].includes(id)) id = 'start';
    module = id;
    document.querySelectorAll('[data-learning-panel]').forEach(p => p.hidden = p.dataset.learningPanel !== id);
    document.querySelectorAll('[data-module]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.module === id)));
    document.querySelector('.learning-page').classList.toggle('is-course-open', id === 'course');
    if (id === 'course') renderCourse();
    if (id === 'tools') renderTools();
    if (id === 'guidelines') renderGuidelines();
    if (id === 'head') renderHead();
    if (id === 'practice') renderDrills();
    if (update) updateUrl();
  }
  function updateUrl() { const u = new URL(location.href); u.searchParams.set('module', module); u.searchParams.set('type', course.id); if (module === 'course') u.searchParams.set('step', step + 1); else u.searchParams.delete('step'); history.replaceState({}, '', u); }
  function comparison(ids, notes) {
    return '<div class="learning-comparison-grid">' + ids.map((id, i) => { const c = courses.find(x => x.id === id); return '<article>' + picture(c.finished[1], c.name + ' finished profile for comparison') + '<div><h4>' + e(c.name) + '</h4><p>' + e(notes[i]) + '</p><a class="text-link" href="fade-training.html?type=' + id + '&module=course">Learn this process →</a></div></article>'; }).join('') + '</div>';
  }
  function renderOverview() {
    document.getElementById('fade-overview').innerHTML = '<div class="fade-intro-layout"><div>' + picture(courses[0].steps[29].visual, 'Finished low fade showing the lower short area and longer hair above') + '</div><div class="fade-intro-copy"><p class="eyebrow">SHORTEST → TRANSITION → LONGER</p><h3>The lengths change gradually.</h3><p>The short area, its transition and the longer hair above form one connected shape. A darker area can be density or a remaining length step; inspect before cutting more.</p><a class="button button-primary" href="fade-training.html?module=course&type=low-fade">Start the 30-step low-fade process →</a><a class="text-link" href="haircuts.html">Explore all 22 haircut styles →</a></div></div><details class="learning-details" open><summary>Placement · low, mid and high</summary>' + comparison(['low-fade', 'mid-fade', 'high-fade'], ['Stays lower around the ears and neckline; retains more side weight above.', 'Moves toward the middle of the sides; compare it with the widest skull curve.', 'Starts higher on the sides; removes more side weight while protecting the top.']) + '</details><details class="learning-details"><summary>Shape · low, drop, burst and taper</summary>' + comparison(['low-fade', 'drop-fade', 'burst-fade', 'taper-fade'], ['Choose when a lower side transition is requested.', 'Choose when the transition should dip behind the ear toward the back.', 'Choose when an ear-centered arc and longer back are requested.', 'In this course, a closer temple and nape taper with the full side preserved. Agree the meaning of the term first.']) + '</details><details class="learning-details"><summary>Finish · shadow versus skin / bald</summary><div class="learning-comparison-grid finish-comparison"><article>' + picture(courses[0].steps[29].visual, 'Shadow-fade example retaining short hair at the lower side') + '<div><h4>Shadow finish</h4><p>Short hair remains at the base. A useful first guarded mannequin exercise.</p></div></article><article>' + picture(courses.find(c => c.id === 'skin-fade').finished[1], 'Skin or bald fade example with bare lower skin and gradual stubble above') + '<div><h4>Skin / bald finish</h4><p>Common names for a bare-skin base that joins into stubble. This close work needs training and suitable skin.</p></div></article></div><p class="learning-small-note">Skin describes the finish, not a required height. Not every low, mid or high fade must reach skin.</p></details><details class="learning-details"><summary>Taper versus fade · how much of the side changes?</summary>' + comparison(['taper-fade', 'low-fade'], ['Shortening is concentrated at the sideburns, temples and nape; most side hair stays full.', 'The shorter-to-longer change extends farther across the sides and back.']) + '</details>';
    bind(document.getElementById('fade-overview'));
  }
  const tools = [
    ['Closed', 'Shortest base-blade setting', 'Closing the lever gives the shortest setting for that blade. It does not guarantee bare skin or one universal millimetre value.'],
    ['Half open', 'An intermediate tested position', 'An intermediate lever position can bridge neighboring lengths. Not every clipper has the same detents or range.'],
    ['Fully open', 'Longer base-blade setting', 'Opening generally leaves more length. Test its overlap with the next guard instead of assuming exact equivalence.'],
    ['No guard', 'Base blade only · close-work reference', 'A bare clipper blade still has its own cutting range. It is not the same as a foil shaver; begin with guarded mannequin drills.'],
    ['#0.5', '≈ 1.5 mm · lower transition reference', 'A common short intermediate attachment. Use only where it bridges two tested lengths on your own system.'],
    ['#1', '≈ 3 mm · short guarded length', 'A common short length for a guarded working zone. Placement and finish determine its role.'],
    ['#1.5', '≈ 4.5 mm · intermediate attachment', 'Often helps connect neighboring guarded lengths, when compatible with the blade and system.'],
    ['#2', '≈ 6 mm · medium-short reference', 'Can establish a fuller side length or a higher transition. It is not always a fixed middle band.'],
    ['#3', '≈ 10 mm · longer side / bulk reference', 'Useful for retaining side weight or conservative bulk reduction before a shorter setting, depending on the plan.'],
    ['Attach a guard', 'Seat it and check the fit', 'Use a compatible attachment, keep the tool off or safely clear, and check the guard is secure before a pass.'],
    ['Flick out', 'Light pressure, lift away', 'Follow the head curve and lift outward at the end of a controlled pass. Pressing harder is not the way to erase a line.'],
    ['Brush and inspect', 'See the actual boundary', 'Brush loose hair away and use even light before deciding whether the area needs another pass.']
  ];
  function miniLesson(rootId, entries, index, visual, attr) {
    const item = entries[index];
    document.getElementById(rootId).innerHTML = '<div class="learning-choice-grid" role="group" aria-label="Choose a teaching view">' + entries.map((x, n) => '<button type="button" ' + attr + '="' + n + '" aria-pressed="' + (n === index) + '">' + e(x[0]) + '</button>').join('') + '</div><div class="learning-lesson-layout"><div>' + picture(visual, item[0] + ': ' + item[1]) + '</div><article class="learning-lesson-copy"><p class="eyebrow">' + (index + 1) + ' / ' + entries.length + '</p><h3>' + e(item[0]) + '</h3><strong>' + e(item[1]) + '</strong><p>' + e(item[2]) + '</p><p class="learning-small-note">Use the actual hair and your tested settings. The illustration is a teaching reference.</p></article></div>';
    bind(document.getElementById(rootId));
  }
  function renderTools() { miniLesson('clipper-lessons', tools, toolIndex, fromAsset('clipper-system', toolIndex), 'data-tool-index'); }
  const guides = [
    ['First guideline', 'The first short boundary', 'Set a narrow reference at the chosen placement before widening any work.', 13],
    ['Second guideline', 'The next longer working length', 'Build the next length above the first while leaving room for the longer hair.', 18],
    ['Third / upper guide', 'The upper connection checkpoint', 'Connect toward the retained weight above. This is a learning checkpoint, not a mandatory third band of fixed width.', 23],
    ['Transition area', 'Real hair changes from short to longer', 'Notice the shorter zone below, the working boundary, and the visibly fuller hair above.', 15],
    ['Weight line', 'Where fuller hair meets the shorter side', 'Read the visible upper weight before using a tested longer length. Avoid removing the entire dark patch.', 22],
    ['Remove a guideline', 'Small correction at one boundary', 'Use a tested intermediate setting, brush and inspect; stop before the fade rises.', 17],
    ['Join longer hair', 'Connect the top separately', 'Carry small section guides into the top and release the hair to check natural fall.', 26]
  ];
  function renderGuidelines() { miniLesson('guideline-lesson', guides, guideIndex, course.steps[guides[guideIndex][3]].visual, 'data-guide-index'); }
  const heads = [
    ['oval', 'Oval', 'A gently rounded overall profile. Locate the actual ridge and occipital curve rather than assuming a perfectly balanced head.'],
    ['round', 'Round', 'Notice where the sides curve outward. Compare retained side weight and top height without prescribing a high fade from the label.'],
    ['square', 'Square', 'Angular temple or skull changes need small tool-angle adjustments. A straight ruler line may ignore the real contour.'],
    ['oblong', 'Oblong / long', 'Compare the overall length of the profile with the agreed top and side balance; the request decides the silhouette.'],
    ['diamond', 'Diamond', 'Notice the widest area and the narrower zones around it. Check side weight from the front and the back.'],
    ['heart', 'Heart', 'Read temple width and the natural corners. Avoid pushing the outline back to fit an imagined ideal.'],
    ['triangle', 'Triangular', 'Compare changes in width from temples toward the jaw and nape. Follow the skull you can actually see and feel.']
  ];
  function renderHead() {
    const h = heads[headIndex];
    document.getElementById('fade-head-study').innerHTML = '<div class="learning-choice-grid head-profile-choices" role="group" aria-label="Choose a head profile">' + heads.map((x, n) => '<button type="button" data-head-index="' + n + '" aria-pressed="' + (n === headIndex) + '">' + x[1] + '</button>').join('') + '</div><div class="head-study-layout"><figure><img class="learning-head-photo" src="assets/head-shapes/' + h[0] + '.webp" width="1122" height="1402" alt="' + e(h[1]) + ' profile example wearing the same low-fade study cut" loading="lazy"><figcaption>' + h[1] + ' profile · same low-fade study example</figcaption></figure><article><h3>' + h[1] + ' profile</h3><p>' + e(h[2]) + '</p><p><strong>For the ' + e(course.name.toLowerCase()) + ':</strong> ' + e(course.profile.headNote) + '</p><h4>Hair changes the approach</h4>' + list(['Texture: account for curl spring-back and natural fall.', 'Density: compare lighter and fuller areas before removing more hair.', 'Growth: change travel direction around the crown without guessing a new length.', 'Requested cut: confirm the side shape, top length and finish first.']) + '</article></div><details class="learning-details" open><summary>Landmarks to locate before cutting</summary><dl class="landmark-learning-grid">' + [['Temples and sideburns', 'Natural front-side corners and the edge beside the ear.'], ['Parietal ridge', 'Where the side starts turning toward the top; adjust the tool angle gradually.'], ['Occipital bone', 'The projection at the back above the nape; inspect the back connection separately.'], ['Crown', 'The swirl and changes in growth direction; preserve settling length.'], ['Apex', 'The highest area of the head; a reference for sectioning and top balance.'], ['Neckline', 'The natural nape growth and agreed outline.']].map(([label, note]) => '<div><dt>' + label + '</dt><dd>' + note + '</dd></div>').join('') + '</dl></details><a class="button button-secondary" href="fade-training.html?module=course&type=' + course.id + '&step=4">See the head analysis in this process →</a>';
    document.querySelector('.learning-head-photo').addEventListener('error', event => { event.target.replaceWith(Object.assign(document.createElement('p'), { textContent: 'Profile illustration unavailable. Continue with the landmark notes.' })); }, { once: true });
  }
  function renderCourse() {
    const s = course.steps[step];
    const type = document.getElementById('fade-course-type');
    type.innerHTML = courses.map(c => '<option value="' + c.id + '">' + e(c.name) + ' · ' + c.level + '</option>').join(''); type.value = course.id;
    document.getElementById('fade-step-select').innerHTML = course.steps.map((x, n) => '<option value="' + n + '"' + (n === step ? ' selected' : '') + '>' + (n + 1) + ' · ' + e(x.title) + '</option>').join('');
    document.getElementById('fade-phase-nav').innerHTML = ['Plan', 'Read + prepare', 'Set the base', 'Build + blend', 'Connect + finish'].map((label, n) => '<button type="button" data-fade-phase="' + n * 6 + '"' + (Math.floor(step / 6) === n ? ' aria-current="step"' : '') + '><small>' + String(n * 6 + 1).padStart(2, '0') + '–' + String(n * 6 + 6).padStart(2, '0') + '</small>' + label + '</button>').join('');
    document.getElementById('fade-course-counter').textContent = 'Step ' + (step + 1) + ' / 30';
    document.getElementById('fade-course-fill').style.width = ((step + 1) / 30 * 100) + '%';
    document.querySelector('.fade-course-progress [role="progressbar"]').setAttribute('aria-valuenow', step + 1);
    const final = step === 29;
    const visual = final && finalAngle >= 0 ? course.finished[finalAngle] : s.visual;
    const angles = final ? '<div class="learning-choice-row final-angle-row" role="group" aria-label="Finished haircut angle">' + ['Three-quarter', 'Front', 'Left', 'Right', 'Back'].map((label, n) => '<button type="button" data-fade-angle="' + (n - 1) + '" aria-pressed="' + (finalAngle === n - 1) + '">' + label + '</button>').join('') + '</div>' : '';
    const checked = (state().fadeChecks?.[course.id] || []).includes(step);
    document.getElementById('fade-active-lesson').innerHTML = '<div class="learning-lesson-layout fade-course-layout"><div class="learning-visual-column">' + angles + '<figure class="learning-course-figure" id="fade-active-visual">' + picture(visual, final && finalAngle >= 0 ? course.name + ' finished ' + ['front', 'left', 'right', 'back'][finalAngle] + ' view' : s.imageAlt) + '<figcaption>' + e(course.name + ' · ' + s.stage) + '<strong>' + (step + 1) + ' / 30</strong></figcaption></figure><div class="learning-step-controls"><button class="button button-secondary" type="button" id="fade-previous"' + (step === 0 ? ' disabled' : '') + '>← Previous</button><span>' + (step + 1) + ' / 30</span><button class="button button-primary" type="button" id="fade-next"' + (final ? ' disabled' : '') + '>' + (final ? 'Finished' : 'Next →') + '</button></div></div><article class="learning-lesson-copy"><p class="eyebrow">' + e(s.stage) + ' · ' + course.level + '</p><h3>' + e(s.title) + '</h3><p>' + e(s.detail) + '</p><dl class="learning-cues"><div><dt>Tool</dt><dd>' + e(s.tool) + '</dd></div><div><dt>Watch</dt><dd>' + e(s.focus) + '</dd></div><div><dt>Practice</dt><dd>' + e(s.practice) + '</dd></div><div><dt>Next</dt><dd>' + e(s.next) + '</dd></div></dl><label class="learning-check"><input id="fade-step-understood" type="checkbox"' + (checked ? ' checked' : '') + '>I understand this action</label><a class="text-link" href="haircuts.html?cut=' + course.id + '">Open the haircut brief and final checks →</a></article></div>';
    document.getElementById('fade-final-review').hidden = !final;
    document.getElementById('fade-completion-label').hidden = !final;
    document.getElementById('fade-course-complete').checked = (state().fadeCourses || []).includes(course.id);
    if (final) {
      document.getElementById('fade-before-after').innerHTML = '<div class="learning-before-after"><figure>' + picture(course.before, course.name + ' untouched starting length') + '<figcaption>Before · original length</figcaption></figure><figure>' + picture(s.visual, course.name + ' finished transformation') + '<figcaption>After · finished shape</figcaption></figure></div>';
      document.getElementById('fade-final-checklist').innerHTML = course.checklist.map(x => '<li>' + e(x) + '</li>').join('');
    }
    bind(document.getElementById('fade-course'));
    const img = document.querySelector('#fade-active-visual img'); if (img) { img.loading = 'eager'; img.fetchPriority = 'high'; }
    const visualRoot = document.getElementById('fade-active-visual'); let touch = null;
    visualRoot.addEventListener('touchstart', ev => { if (ev.touches.length === 1) touch = { x: ev.touches[0].clientX, y: ev.touches[0].clientY }; }, { passive: true });
    visualRoot.addEventListener('touchend', ev => { if (!touch || ev.changedTouches.length !== 1) return; const dx = ev.changedTouches[0].clientX - touch.x, dy = ev.changedTouches[0].clientY - touch.y; touch = null; if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) moveStep(step + (dx < 0 ? 1 : -1)); }, { passive: true });
  }
  function moveStep(n) { if (n < 0 || n > 29) return; step = n; finalAngle = -1; renderCourse(); updateUrl(); }
  function renderDrills() {
    const categories = { control: ['grip', 'lever', 'guards', 'flick'], blend: ['first-guide', 'erase-guide', 'small-blend', 'ear', 'nape'], shape: ['low', 'mid', 'high', 'symmetry', 'detail'] };
    const selected = drillFilter === 'all' ? drills : drills.filter(d => categories[drillFilter].includes(d.id));
    document.getElementById('fade-drills').innerHTML = selected.map(d => { const c = courses.find(x => x.id === d.type), s = c.steps[d.step]; return '<article class="learning-drill-card">' + picture(s.visual, d.title + ' practice reference: ' + s.title) + '<div><p class="eyebrow">' + e(c.name) + ' · STEP ' + (d.step + 1) + '</p><h3>' + e(d.title) + '</h3><p>' + e(d.task) + '</p><a class="text-link" href="fade-training.html?module=course&type=' + d.type + '&step=' + (d.step + 1) + '">Open this exact action →</a><label class="learning-check"><input type="checkbox" data-fade-drill="' + d.id + '"' + ((state().fadeDrills || []).includes(d.id) ? ' checked' : '') + '>I rehearsed this drill</label></div></article>'; }).join(''); bind(document.getElementById('fade-drills'));
  }
  document.addEventListener('click', ev => {
    const b = ev.target.closest('button'); if (!b) return;
    if (b.dataset.module) goModule(b.dataset.module);
    if (b.dataset.toolIndex !== undefined) { toolIndex = +b.dataset.toolIndex; renderTools(); }
    if (b.dataset.guideIndex !== undefined) { guideIndex = +b.dataset.guideIndex; renderGuidelines(); }
    if (b.dataset.headIndex !== undefined) { headIndex = +b.dataset.headIndex; renderHead(); }
    if (b.dataset.fadePhase !== undefined) moveStep(+b.dataset.fadePhase);
    if (b.dataset.fadeAngle !== undefined) { finalAngle = +b.dataset.fadeAngle; renderCourse(); document.querySelector('[data-fade-angle="' + finalAngle + '"]').focus({ preventScroll: true }); }
    if (b.id === 'fade-previous') moveStep(step - 1);
    if (b.id === 'fade-next') moveStep(step + 1);
    if (b.dataset.drillFilter) { drillFilter = b.dataset.drillFilter; document.querySelectorAll('[data-drill-filter]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); renderDrills(); }
  });
  document.addEventListener('change', ev => {
    const input = ev.target;
    if (input.id === 'fade-course-type') { course = courses.find(c => c.id === input.value) || courses[0]; step = 0; finalAngle = -1; renderCourse(); updateUrl(); }
    if (input.id === 'fade-step-select') moveStep(+input.value);
    if (input.id === 'fade-step-understood') { if (!save(s => { s.fadeChecks ||= {}; const v = new Set(s.fadeChecks[course.id] || []); input.checked ? v.add(step) : v.delete(step); s.fadeChecks[course.id] = [...v]; })) input.checked = !input.checked; }
    if (input.id === 'fade-course-complete' || input.dataset.fadeDrill) { const key = input.dataset.fadeDrill ? 'fadeDrills' : 'fadeCourses', value = input.dataset.fadeDrill || course.id; if (!save(s => { const v = new Set(Array.isArray(s[key]) ? s[key] : []); input.checked ? v.add(value) : v.delete(value); s[key] = [...v]; })) input.checked = !input.checked; }
  });
  document.addEventListener('keydown', ev => {
    if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.target.matches('input, textarea, select') || ev.target.isContentEditable) return;
    const d = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
    if (module === 'course') { ev.preventDefault(); moveStep(step + d); }
    if (module === 'tools') { ev.preventDefault(); toolIndex = Math.max(0, Math.min(tools.length - 1, toolIndex + d)); renderTools(); }
    if (module === 'guidelines') { ev.preventDefault(); guideIndex = Math.max(0, Math.min(guides.length - 1, guideIndex + d)); renderGuidelines(); }
  });
  renderOverview(); goModule(query.get('module') || (query.has('type') ? 'course' : 'start'), false);
})();
