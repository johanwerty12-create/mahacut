(() => {
  'use strict';
  const cuts = window.THE_CRAFT_WALKTHROUGHS || [];
  const simulatorCourses = window.THE_CRAFT_SIMULATOR_COURSES || [];
  const catalog = [
    ['buzz-cut', 'Buzz Cut', 'Beginner'], ['crew-cut', 'Crew Cut / Short Top', 'Next step'],
    ['classic-taper', 'Classic Taper', 'Beginner'], ['low-taper', 'Low Taper', 'Beginner'],
    ['low-fade', 'Low Fade', 'Beginner'], ['mid-fade', 'Mid Fade', 'Next step'],
    ['high-fade', 'High Fade', 'Advanced'], ['drop-fade', 'Drop Fade', 'Advanced'],
    ['burst-fade', 'Burst Fade', 'Advanced'], ['skin-fade', 'Skin Fade', 'Advanced']
  ];
  const viewNames = { front: 'Front', side: 'Side profile', left: 'Left side', right: 'Right side', back: 'Back' };
  const areaNames = {
    top: 'Top', crown: 'Crown', parietal: 'Upper side', 'fade-zone': 'Fade area',
    temple: 'Temple', sideburn: 'Sideburn', 'behind-ear': 'Behind ear', neckline: 'Neckline', back: 'Back',
    side: 'Side', 'left-side': 'Side', 'right-side': 'Side'
  };
  const sidePoints = [['top', 52, 19], ['crown', 39, 22], ['parietal', 51, 36], ['side', 60, 47], ['fade-zone', 59, 51], ['temple', 73, 39], ['sideburn', 75, 59], ['behind-ear', 82, 50], ['neckline', 50, 82], ['back', 29, 51]];
  const mapPoints = {
    side: sidePoints,
    left: sidePoints,
    right: sidePoints.map(([id, x, y]) => [id, 100 - x, y]),
    front: [['top', 50, 19], ['left-side', 29, 53], ['temple', 33, 40], ['parietal', 39, 35], ['fade-zone', 30, 56], ['right-side', 71, 53], ['sideburn', 69, 59], ['neckline', 50, 82]],
    back: [['top', 50, 19], ['crown', 50, 29], ['parietal', 33, 39], ['back', 50, 52], ['fade-zone', 50, 61], ['left-side', 27, 49], ['right-side', 73, 49], ['behind-ear', 76, 49], ['neckline', 50, 81]]
  };
  const drills = [
    { id: 'top', title: 'Find the top', copy: 'The top is the hair above the sides. Tap its marker on the head.', photo: 0, view: 'front' },
    { id: 'side', title: 'Find the side', copy: 'The side runs from the temple toward the area above the ear. Tap the marked side.', photo: 4, view: 'side' },
    { id: 'temple', title: 'Find the temple', copy: 'The temple is the front corner of the hair above the sideburn. Tap the marked corner.', photo: 10, view: 'side' },
    { id: 'sideburn', title: 'Find the sideburn', copy: 'The sideburn is the short strip of hair in front of the ear. Tap its marker.', photo: 10, view: 'side' },
    { id: 'neckline', title: 'Find the neckline', copy: 'The neckline is where the hair ends at the nape. Tap the marked area at the back.', photo: 12, view: 'back' },
    { id: 'crown', title: 'Find the crown', copy: 'The crown is near the top-back of the head, where a swirl or growth change often appears.', photo: 1, view: 'back' },
    { id: 'fade-zone', title: 'Find a fade area', copy: 'A fade changes from shorter to longer across part of the side or back. Tap the highlighted working band.', photo: 6, view: 'side' },
    { id: 'clippers', title: 'Identify the clipper', copy: 'Clippers remove and control larger amounts of hair. Find the powered cutting tool in the photo.', type: 'tool', answer: 'clippers', image: ['clipper-system', 3], options: [['comb', 'Comb'], ['clippers', 'Clippers'], ['scissors', 'Shears']] },
    { id: 'guards', title: 'Match guard to length', copy: 'A guard keeps the blade farther from the head. A higher number generally leaves more hair. Which example leaves the most?', type: 'guard', answer: '#3', image: ['clipper-system', 4], options: [['#0.5', '#0.5'], ['#1', '#1'], ['#3', '#3']] },
    { id: 'lever', title: 'Learn the lever', copy: 'Closed generally cuts shorter; open generally leaves a little more length. Which position leaves more?', type: 'lever', answer: 'Open', image: ['clipper-system', 1], options: [['Closed', 'Closed'], ['Half open', 'Half open'], ['Open', 'Open']] },
    { id: 'flick', title: 'Practice flick-out', copy: 'Start close to the hair, move upward, then gradually away at the end of the pass. Follow START to LIFT AWAY.', type: 'motion', image: ['low-fade-phase-3', 2] },
    { id: 'clipper-comb', title: 'Learn clipper-over-comb', copy: 'The comb lifts a small amount of hair. The clipper stays outside the comb and cuts only what extends past its teeth.', type: 'technique', answer: 'comb-first', image: ['low-fade-phase-4', 4], options: [['clipper-first', 'Clipper first'], ['comb-first', 'Comb lifts; clipper follows'], ['press', 'Press the blade into the head']] },
    { id: 'scissor-comb', title: 'Learn scissor-over-comb', copy: 'The comb lifts a small section. Shears cut only the hair extending beyond the comb, with fingers clear of the blades.', type: 'technique', answer: 'comb-first', image: ['clipper-system', 9], options: [['scissors-first', 'Open shears first'], ['comb-first', 'Comb lifts; shears cut'], ['press', 'Press shears against the skin']] }
  ];
  const toolNames = { clippers: 'Clippers', comb: 'Cutting comb', scissors: 'Shears', trimmer: 'Detail trimmer', razor: 'Razor', spray: 'Spray bottle', cape: 'Cape', mirror: 'Brush + mirror' };
  const toolDescriptions = {
    clippers: 'A powered clipper removes hair in controlled sections. A fitted guard keeps the blade farther from the head.',
    comb: 'A comb positions and lifts hair so you can see the section and control what is cut.',
    scissors: 'Shears shape longer sections. Control a small amount of hair and keep fingers clear of the blades.',
    trimmer: 'A detail trimmer refines an agreed outline. Keep it controlled around ears and skin.',
    razor: 'A razor is a specialist finishing tool; this beginner lesson does not ask you to use one.',
    spray: 'A spray bottle lightly dampens hair so it can be combed and sectioned.',
    cape: 'A cape keeps loose hair off clothing and helps the person stay comfortable.',
    mirror: 'A mirror helps you confirm the plan and compare the shape from more than one angle.'
  };
  const helpText = {
    side: 'The side runs from the temple down toward the hair above and behind the ear.',
    'fade-zone': 'The fade area is where the hair changes gradually from shorter to longer across the side or back.',
    parietal: 'The parietal ridge is the widest part of the head where the sides begin to curve toward the top.',
    temple: 'The temple is the front corner of the hair above the sideburn. Keep natural corners unless a different shape is agreed.',
    sideburn: 'The sideburn is the narrow strip of hair in front of the ear.',
    'behind-ear': 'The area behind the ear needs a clear view and gentle control. Keep the ear protected and the cutting tool clear of skin.',
    neckline: 'The neckline is the natural hair edge at the back of the neck.',
    crown: 'The crown is the area near the top-back of the head, where hair often changes growth direction.',
    top: 'The top is the hair above the sides. It may be clipped, combed or protected while the sides are worked.',
    clippers: 'Clippers are powered cutting tools. A guard or blade setting controls how close they cut; follow the maker instructions.',
    '0.5': 'A #0.5 guard is a short attachment. It generally leaves less hair than a higher-numbered guard; brands vary.',
    guard: 'A guard is the comb-like attachment on the clipper. Its teeth keep the blade at a distance from the hair.',
    lever: 'The lever changes blade position. Closed generally cuts shorter than open, but its range varies by clipper.',
    flick: 'Flick out means moving upward and gradually away at the end of a pass. Rehearse slowly on a mannequin first.'
  };
  const skillLinks = {
    'first guideline': 'fade-practice:Creating the first guideline', blend: 'fade-practice:Removing guidelines',
    transition: 'fade-practice:Blending into longer hair', guards: 'clipper-control:Guard changes',
    lever: 'clipper-control:Lever control', symmetry: 'fade-practice:Checking symmetry',
    temple: 'taper-practice:Temple taper', sideburn: 'taper-practice:Sideburn taper',
    neckline: 'taper-practice:Neck taper', scissors: 'scissor-practice:Basic cutting',
    section: 'scissor-practice:Sectioning', top: 'scissor-practice:Connecting sections',
    finish: 'finishing:Final balance check', inspect: 'finishing:Brush and inspect',
    setup: 'foundation:Station setup', grip: 'foundation:Clipper grip'
  };
  const $ = id => document.getElementById(id);
  const courseFor = id => simulatorCourses.find(item => item.id === id);
  const setup = $('simulator-setup'), learn = $('sim-learn-first'), game = $('simulator-game'), cards = $('simulator-cut-choices');
  const storageKey = 'the-craft-progress-v2';
  let mode = 'guided', cut = null, course = null, step = 0, decisionIndex = 0;
  let warmStep = 0, warmSolved = false, warmArmed = false;
  let solved = false, stageSolved = false, hint = false, zoomed = false, movementArmed = false;
  let viewOverride = null, inspectionDone = new Set(), mistakeLog = [];
  let correct = 0, mistakes = 0, toolErrors = 0, guardErrors = 0, areaErrors = 0;
  let toolCorrect = 0, guardCorrect = 0, areaCorrect = 0, timerOne = 0, timerTwo = 0;
  let feedback = '', biggestMistake = '';

  function readState() {
    try { const value = JSON.parse(localStorage.getItem(storageKey) || '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
    catch { return {}; }
  }
  function saveState(change) {
    try { const state = readState(); change(state); localStorage.setItem(storageKey, JSON.stringify(state)); return true; }
    catch { return false; }
  }
  const completed = () => new Set(Array.isArray(readState().simulatorCompleted) ? readState().simulatorCompleted : []);
  const esc = value => window.CraftVisual.escape(value);
  const profileFor = id => window.THE_CRAFT_HAIRCUTS?.find(item => item.id === id);
  const stepsFor = () => course?.steps || cut?.steps || [];
  const dataFor = id => cuts.find(item => item.id === id);

  function buildCards() {
    const saved = readState(), done = completed(), firstLessonDone = done.size > 0, inProgress = saved.simulatorInProgress;
    const selectedMode = document.querySelector('[name="sim-mode"]:checked')?.value || 'guided';
    document.querySelectorAll('[name="sim-mode"]').forEach(input => { input.disabled = input.value !== 'guided' && !firstLessonDone; });
    cards.innerHTML = catalog.map(([id, name, level], index) => {
      const data = dataFor(id); if (!data) return '';
      const prerequisite = index > 0 ? catalog[index - 1] : null;
      const previousDone = !prerequisite || done.has(prerequisite[0]);
      const locked = !previousDone;
      const visual = data.finishedVisuals?.[1] || window.CraftVisual.fromSheet(data, 17);
      const totalSteps = courseFor(id)?.steps.length || data.steps.length;
      const canResume = inProgress?.id === id && inProgress.courseVersion === 2;
      const hintText = locked ? 'Complete ' + prerequisite[1] + ' to unlock this lesson.' : canResume ? 'Resume at step ' + (inProgress.step + 1) + ' of ' + totalSteps : done.has(id) ? 'Completed · practice again' : index === 0 ? 'Begin here · even length before fades' : 'Continue your learning path';
      const group = profileFor(id)?.group || (level === 'Advanced' ? 'advanced' : level === 'Next step' ? 'next' : 'beginner');
      return '<button type="button" class="sim-cut-card" data-sim-cut="' + id + '"' + (locked ? ' disabled aria-disabled="true"' : '') + '>' +
        '<span class="sim-card-meta"><span class="difficulty-badge difficulty-' + group + '">' + esc(level) + '</span>' + (done.has(id) ? '<span class="sim-complete-mark">Completed ✓</span>' : '') + '</span>' +
        window.CraftVisual.frame(visual, name + ' finished haircut training reference', 'sim-card-frame') +
        '<span class="sim-card-copy"><strong>' + esc(name) + '</strong><small>' + esc(hintText) + '</small></span></button>';
    }).join('');
    window.CraftVisual.bind(cards);
    $('sim-unlock-note').textContent = firstLessonDone
      ? 'Guided gives you the answer step by step. Practice keeps some cues. Challenge removes most cues and tracks your choices.'
      : 'Start with Guided. Practice and Challenge unlock after your first haircut.';
  }

  function learnFirstDone() { return Boolean(readState().simulatorLearnFirst); }
  function showStart() {
    if (learnFirstDone()) { learn.hidden = true; setup.hidden = false; buildCards(); return; }
    setup.hidden = true; game.hidden = true; learn.hidden = false;
    warmStep = Math.min(drills.length - 1, Number(readState().simulatorLearnFirstStep) || 0);
    warmSolved = false; renderWarmup();
  }
  function learnVisual(item) {
    const buzz = dataFor('buzz-cut');
    if (item.image) return window.CraftVisual.fromAsset(item.image[0], item.image[1]);
    return window.CraftVisual.fromSheet(dataFor('low-fade') || buzz, item.photo);
  }
  function learnArea(item) {
    const visuals = item.id === 'neckline' ? [['neckline', 52, 80]] : item.id === 'crown' ? [['crown', 50, 26]] : item.view === 'front' ? [['top', 52, 18]] : item.id === 'temple' ? [['temple', 75, 38]] : item.id === 'sideburn' ? [['sideburn', 75, 59]] : item.id === 'fade-zone' ? [['fade-zone', 59, 51]] : [['side', 78, 52]];
    return visuals.map(([area, x, y]) => '<button class="sim-hotspot sim-learn-hotspot is-target" type="button" data-warm-area="' + area + '" style="--hot-x:' + x + '%;--hot-y:' + y + '%" aria-label="Tap the ' + esc(areaNames[area] || area) + '"><span aria-hidden="true"></span><b>' + esc(areaNames[area] || area) + '</b></button>').join('');
  }
  function referencePhoto(key, alt, className = '') {
    const visual = window.CraftVisual.fromAsset('clipper-system', key);
    return window.CraftVisual.frame(visual, alt, className);
  }
  function bindImages(root) {
    window.CraftVisual.bind(root);
    root.querySelectorAll('.sim-direct-reference').forEach(image => {
      if (image.dataset.learningBound) return;
      image.dataset.learningBound = 'true';
      image.addEventListener('error', () => {
        const fallback = document.createElement('div');
        fallback.className = 'story-image-fallback'; fallback.setAttribute('role', 'img');
        fallback.textContent = 'This tool photo could not load. Use the written tool description to continue.';
        image.replaceWith(fallback);
      }, { once: true });
    });
  }
  function warmupMotion() {
    return '<div class="sim-motion-overlay is-demo"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="warm-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="currentColor"></path></marker></defs><path d="M72 74 C68 62 61 47 55 31" marker-end="url(#warm-arrow)"></path></svg><button type="button" class="sim-motion-pin sim-motion-start" data-warm-motion="start" style="--pin-x:72%;--pin-y:74%" aria-label="Start the clipper motion">START</button><button type="button" class="sim-motion-pin sim-motion-end" data-warm-motion="end" style="--pin-x:55%;--pin-y:31%" aria-label="Finish by lifting away">LIFT AWAY</button></div>';
  }
  function renderWarmup() {
    if (warmStep >= drills.length) { finishWarmup(); return; }
    const item = drills[warmStep];
    $('sim-learn-counter').textContent = (warmStep + 1) + ' of ' + drills.length;
    $('sim-learn-progress-fill').style.width = (warmStep / drills.length * 100) + '%';
    const progress = $('sim-learn-progress-fill').closest('[role="progressbar"]');
    progress.setAttribute('aria-valuenow', warmStep);
    $('sim-learn-kicker').textContent = 'EXERCISE ' + (warmStep + 1) + ' OF ' + drills.length;
    $('sim-learn-step-title').textContent = item.title;
    $('sim-learn-copy').textContent = item.copy;
    $('sim-learn-next').disabled = !warmSolved;
    $('sim-learn-next').textContent = warmStep === drills.length - 1 ? 'Start the Buzz Cut lesson' : 'Next exercise';
    $('sim-learn-feedback').classList.remove('has-error', 'is-correct');
    $('sim-learn-feedback').textContent = 'Take your time. You can retry as often as you need.';
    const frame = window.CraftVisual.frame(learnVisual(item), item.title + ' · real haircut or tool training photograph', 'sim-learn-frame');
    const overlay = item.type === 'motion' ? warmupMotion() : item.type ? '' : learnArea(item);
    $('sim-learn-image').innerHTML = frame + overlay;
    $('sim-learn-image').classList.toggle('sim-warm-motion', item.type === 'motion');
    $('sim-learn-caption').textContent = item.type ? (item.type === 'technique' ? 'REAL CUTTING TECHNIQUE · TRAINING REFERENCE' : 'REAL TOOL PHOTO · TRAINING REFERENCE') : viewNames[item.view] + ' VIEW · TAP THE MARKED AREA';
    const control = $('sim-learn-control');
    if (item.type === 'tool' || item.type === 'guard' || item.type === 'lever' || item.type === 'technique') {
      const prompt = item.type === 'tool' ? 'Which tool is shown?' : item.type === 'guard' ? 'Which guard usually leaves the most hair?' : item.type === 'lever' ? 'Which position leaves a little more length?' : 'What leads the movement?';
      control.innerHTML = '<p class="sim-control-prompt">' + prompt + '</p>' + warmChoices(item.options, item.answer) + (item.type === 'guard' ? '<details class="sim-help"><summary>? What is a guard?</summary><p>A guard is the clipper attachment with teeth. Guard lengths vary by clipper system.</p></details>' : item.type === 'lever' ? '<details class="sim-help"><summary>? What does the lever do?</summary><p>Closed generally cuts shorter; open generally leaves a little more length. The range depends on the clipper.</p></details>' : item.type === 'technique' ? '<details class="sim-help"><summary>? Why start with the comb?</summary><p>The comb lifts and controls the hair. The cutting tool works outside it and only removes hair that extends beyond the comb.</p></details>' : '');
    }
    else if (item.type === 'motion') control.innerHTML = '<p class="sim-control-prompt">Try it with your finger or mouse.</p>Drag START toward LIFT AWAY, or tap both in order.';
    else control.innerHTML = '<p class="sim-control-prompt">Tap the highlighted ' + esc(areaNames[item.id].toLowerCase()) + ' on the photo.</p><details class="sim-help"><summary>? What is this area?</summary><p>' + esc(helpText[item.id] || 'A named area used to describe where a barber is working.') + '</p></details>';
    window.CraftVisual.bind(control);
    window.CraftVisual.bind($('sim-learn-image'));
  }
  function warmChoices(options, answer) {
    return '<div class="sim-warm-choices">' + options.map(([value, label]) => '<button type="button" class="sim-warm-choice' + (value === answer ? ' is-recommended' : '') + '" data-warm-choice="' + esc(value) + '">' + esc(label) + '</button>').join('') + '</div>';
  }
  function warmSuccess(message) {
    if (warmSolved) return;
    warmSolved = true;
    $('sim-learn-feedback').textContent = message;
    $('sim-learn-feedback').classList.remove('has-error');
    $('sim-learn-feedback').classList.add('is-correct');
    const progress = $('sim-learn-progress-fill').closest('[role="progressbar"]');
    progress.setAttribute('aria-valuenow', warmStep + 1);
    $('sim-learn-progress-fill').style.width = ((warmStep + 1) / drills.length * 100) + '%';
    $('sim-learn-next').disabled = false;
    $('sim-learn-next').focus({ preventScroll: true });
    saveState(state => { state.simulatorLearnFirstStep = warmStep + 1; });
  }
  function warmWrong(message) {
    $('sim-learn-feedback').textContent = message;
    $('sim-learn-feedback').classList.add('has-error');
  }
  function finishWarmup() {
    saveState(state => { state.simulatorLearnFirst = true; state.simulatorLearnFirstStep = drills.length; });
    learn.hidden = true; setup.hidden = false; buildCards();
    $('simulator-setup').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function expectedTool(s) {
    const primary = (s.tool || '').toLowerCase();
    if (Object.hasOwn(toolNames, primary)) return primary;
    if (/shear|scissor/.test(primary)) return 'scissors';
    if (/trimmer/.test(primary)) return 'trimmer';
    if (/razor|shav/.test(primary)) return 'razor';
    if (/clipper|guard/.test(primary)) return 'clippers';
    if (/cape/.test(primary)) return 'cape';
    if (/brush|mirror|reference/.test(primary)) return 'mirror';
    if (/spray|water/.test(primary)) return 'spray';
    if (/comb/.test(primary)) return 'comb';
    const text = ((s.title || '') + ' ' + (s.key || '')).toLowerCase();
    if (/shear|scissor/.test(text)) return 'scissors';
    if (/trimmer/.test(text)) return 'trimmer';
    if (/razor|shav/.test(text)) return 'razor';
    if (/clipper|guard|fade/.test(text)) return 'clippers';
    if (/cape/.test(text)) return 'cape';
    if (/brush|mirror|reference|inspection|complete/.test(text)) return 'mirror';
    if (/spray|water/.test(text)) return 'spray';
    if (/comb|section|analysis|texture|density|growth|crown|temple-check|neckline-check|placement|desired-fade|consultation/.test(text)) return 'comb';
    return cut.id === 'crew-cut' ? 'scissors' : 'clippers';
  }
  function guardFor(s, index) {
    if (Object.hasOwn(s, 'guard')) return s.guard;
    if (!['clippers', 'trimmer'].includes(expectedTool(s))) return null;
    const values = { 'initial-length': '#3', 'first-length': '#1', 'lower-blend': '#0.5', 'middle-blend': '#1.5', 'upper-blend': '#2', 'second-blend': '#1.5', 'next-length': '#1.5' };
    if (s.key === 'guard-changes') return ['#0.5', '#1', '#1.5', '#2', '#3'][index % 5];
    if (course && values[s.key]) return values[s.key];
    if (cut.kind === 'uniform' && ['initial-length', 'first-length', 'next-length', 'top'].includes(s.key)) return '#3';
    return null;
  }
  function leverFor(s) {
    if (Object.hasOwn(s, 'lever')) return s.lever;
    if (!course) return null;
    if (['lever', 'blend', 'second-blend', 'lower-blend'].includes(s.key)) return 'Half open';
    return null;
  }
  function targetFor(s) {
    if (s.targetArea) return s.targetArea;
    const key = s.key || '', words = ((s.title || '') + ' ' + (s.detail || '')).toLowerCase();
    if (key === 'back' || key === 'neckline-check' || /nape|neckline/.test(words)) return 'neckline';
    if (key === 'ears' || /behind the ear|around the ear/.test(words)) return 'behind-ear';
    if (key === 'symmetry') return 'left-side';
    if (key === 'temple-check' || /temple/.test(words) || key === 'temples') return 'temple';
    if (/sideburn/.test(words)) return 'sideburn';
    if (key === 'crown' || /crown/.test(words) && ['analysis', 'growth'].includes(key)) return 'crown';
    if (key === 'top' || key === 'section' || key === 'initial-length' && ['scissor-cut', 'crew-cut'].includes(cut.id)) return 'top';
    if (['analysis', 'growth', 'texture', 'density'].includes(key)) return 'parietal';
    if (['placement', 'guide', 'initial-length', 'first-length', 'transition', 'lower-blend', 'middle-blend', 'upper-blend', 'second-blend', 'blend', 'lever', 'next-length', 'guard-changes'].includes(key)) {
      if (cut.id === 'low-taper' || cut.id === 'classic-taper') return /nape|back/.test(words) ? 'neckline' : 'sideburn';
      return 'fade-zone';
    }
    if (key === 'finish' || key === 'finish-line' || key === 'temples') return 'sideburn';
    if (key === 'inspection' || key === 'complete' || key === 'before' || key === 'consultation' || key === 'tools') return 'left-side';
    if (cut.id === 'buzz-cut') return key === 'top' ? 'top' : 'left-side';
    if (cut.id === 'low-taper' || cut.id === 'classic-taper') return 'sideburn';
    if (cut.id === 'crew-cut') return 'top';
    return /fade|blend|guideline/.test(words) ? 'fade-zone' : 'left-side';
  }
  function viewFor(area, s) { return s?.view || (area === 'neckline' || area === 'back' ? 'back' : area === 'left-side' ? 'left' : area === 'right-side' ? 'right' : 'side'); }
  function current() {
    const s = stepsFor()[step], target = targetFor(s);
    return { ...s, target, view: viewFor(target, s), tool: expectedTool(s), guard: guardFor(s, step), lever: leverFor(s) };
  }
  function requiresMove(s) {
    if (Object.hasOwn(s, 'requiresMovement')) return s.requiresMovement;
    if (!['clippers', 'scissors', 'trimmer'].includes(s.tool)) return false;
    return !['before', 'analysis', 'consultation', 'desired-fade', 'placement', 'texture', 'density', 'growth', 'crown', 'temple-check', 'neckline-check', 'tools', 'section', 'symmetry', 'inspection', 'complete'].includes(s.key);
  }
  function decisionFlow(s) { return s.inspectionRules ? ['inspection'] : [...(s.knowledgeCheck ? ['observe'] : []), 'tool', ...(s.guard ? ['guard'] : []), ...(s.lever ? ['lever'] : []), 'area', ...(requiresMove(s) ? ['move'] : [])]; }
  function stageNow(s) { return decisionFlow(s)[decisionIndex]; }
  function simpleArea(s) { return areaNames[s.target] || 'marked area'; }
  function coordinatesFor(s, view = s.view) {
    for (const [id, x, y] of mapPoints[view] || mapPoints.side) if (id === s.target) return { x, y: id === 'fade-zone' && s.guideHeight ? s.guideHeight : y };
    return { x: 58, y: 52 };
  }
  function needsZoom(s) { return ['temple', 'sideburn', 'behind-ear', 'neckline'].includes(s.target) || s.key === 'ears' || s.key === 'temple-check' || s.key === 'neckline-check'; }
  function svgMotion(s, idPrefix) {
    const point = coordinatesFor(s), x1 = Math.max(14, Math.min(85, point.x - 4)), y1 = Math.max(25, Math.min(84, point.y + 16));
    const type = s.movementType || 'flick-out';
    const startX = type === 'clipper-over-comb' || type === 'scissor-over-comb' ? Math.max(14, point.x - 14) : x1;
    const startY = type === 'clipper-over-comb' || type === 'scissor-over-comb' ? Math.max(20, point.y - 3) : y1;
    const endX = type === 'straight-pass' ? x1 : Math.max(14, Math.min(85, point.x + (point.x > 55 ? -12 : 12)));
    const endY = type === 'outline' ? Math.min(84, point.y + 8) : type === 'straight-pass' ? Math.max(16, y1 - 29) : Math.max(14, y1 - 27);
    const startLabel = type === 'clipper-over-comb' || type === 'scissor-over-comb' ? 'COMB LIFT' : 'START';
    const endLabel = type === 'clipper-over-comb' ? 'CLIPPER FOLLOWS' : type === 'scissor-over-comb' ? 'SHEARS CUT' : type === 'outline' ? 'TRACE EDGE' : type === 'straight-pass' ? 'END PASS' : 'LIFT AWAY';
    const path = type === 'outline' ? 'M' + startX + ' ' + startY + ' Q' + (startX + 9) + ' ' + (startY - 8) + ' ' + endX + ' ' + endY : 'M' + startX + ' ' + startY + ' C' + (startX - 2) + ' ' + (startY - 10) + ' ' + (endX + 5) + ' ' + (endY + 7) + ' ' + endX + ' ' + endY;
    return '<div class="sim-motion-overlay sim-motion-' + type + (hint || mode === 'guided' ? ' is-demo' : '') + '"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="' + idPrefix + '-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="currentColor"></path></marker></defs><path d="' + path + '" marker-end="url(#' + idPrefix + '-arrow)"></path></svg><button type="button" class="sim-motion-pin sim-motion-start" data-move-role="start" style="--pin-x:' + startX + '%;--pin-y:' + startY + '%" aria-label="Start the ' + esc(type.replaceAll('-', ' ')) + ' movement">' + startLabel + '</button><button type="button" class="sim-motion-pin sim-motion-end" data-move-role="end" style="--pin-x:' + endX + '%;--pin-y:' + endY + '%" aria-label="Finish the ' + esc(type.replaceAll('-', ' ')) + ' movement">' + endLabel + '</button></div>';
  }
  function guideOverlay(s) {
    if (!['mapGuide', 'guide', 'lower', 'nextBand', 'blend', 'dropGuide', 'burstGuide', 'burstSide'].includes(s.key) && !(s.key === 'bulk' && s.guideHeight)) return '';
    const y = s.guideHeight || 51, isDrop = s.guideStyle === 'drop-fade', isBurst = s.guideStyle === 'burst-fade', isTaper = ['low-taper', 'classic-taper'].includes(s.guideStyle);
    const d = isBurst ? 'M70 31 C86 36 91 50 82 64 C79 69 76 72 70 74' : isDrop ? 'M24 ' + (y - 4) + ' Q50 ' + (y - 9) + ' 67 ' + (y + 5) + ' Q77 ' + (y + 15) + ' 87 ' + (y + 7) : isTaper ? 'M70 49 Q78 51 83 60 M37 75 Q50 80 63 75' : 'M24 ' + (y + 5) + ' Q50 ' + y + ' 75 ' + (y - 6);
    const label = isBurst ? 'ROUNDED EAR GUIDE' : isDrop ? 'DROPPED BACK GUIDE' : isTaper ? 'EDGE-ONLY TAPER' : 'PLANNED TRANSITION';
    return '<svg class="sim-guide-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="' + label + '"><path d="' + d + '"></path><text x="8" y="' + Math.max(10, y - 5) + '">' + label + '</text></svg>';
  }
  function renderImage(s) {
    const stage = stageNow(s), activeView = viewOverride || s.view, preview = Boolean(viewOverride && !s.inspectionRules && viewOverride !== s.view);
    const loc = coordinatesFor(s, activeView), spotlight = !preview && !stageSolved && ((stage === 'area' && mode !== 'challenge') || hint);
    const points = mapPoints[activeView] || mapPoints.side;
    const frame = window.CraftVisual.frame(visualFor(s, activeView, preview), cut.name + ' · ' + s.title + ' · ' + (preview ? 'finished-shape reference' : 'training photograph'), 'sim-main-frame');
    const tags = points.map(([id, x, y]) => {
      const name = areaNames[id] || id.replaceAll('-', ' '), target = id === s.target;
      const active = target && spotlight && stage !== 'move';
      const upNext = !preview && target && stage !== 'area' && stage !== 'inspection' && !hint && mode !== 'challenge';
      const activeY = id === 'fade-zone' && s.guideHeight ? s.guideHeight : y;
      return '<button type="button" class="sim-hotspot' + (active ? ' is-target' : '') + (upNext ? ' is-up-next' : '') + (target && stage === 'area' ? ' is-clickable' : '') + '" data-sim-area="' + id + '" aria-label="' + (target && spotlight ? 'Highlighted ' : '') + esc(name) + ' area"' + ((preview || stage !== 'area' || stageSolved) ? ' disabled aria-disabled="true"' : '') + ' style="--hot-x:' + x + '%;--hot-y:' + activeY + '%"><span aria-hidden="true"></span><b>' + esc(name) + '</b></button>';
    }).join('');
    const zoomClass = zoomed && !preview && needsZoom(s) ? ' is-zoomed' : '';
    const image = '<div class="sim-image-layer' + zoomClass + '" style="--focus-x:' + loc.x + '%;--focus-y:' + loc.y + '%">' + frame + tags + (!preview && (mode !== 'challenge' || hint) ? guideOverlay(s) : '') + (stage === 'move' && !preview && (mode !== 'challenge' || hint) ? svgMotion(s, 'cut-motion') : '') + '</div>' + (zoomed && !preview && needsZoom(s) ? '<button type="button" id="sim-full-head" class="sim-full-head">↙ Back to full head</button>' : '');
    $('sim-image-wrap').innerHTML = image;
    $('sim-image-wrap').classList.toggle('action-confirmed', stageSolved || solved);
    $('sim-image-wrap').classList.toggle('is-focused', zoomed && needsZoom(s));
    $('sim-visual-caption').textContent = preview ? 'FINISHED SHAPE REFERENCE · ' + viewNames[activeView].toUpperCase() : (step === 0 ? 'BEFORE · STARTING LENGTH' : 'TRAINING PHOTO · ' + (s.stage || 'CUTTING ACTION')) + ' · ' + (zoomed && needsZoom(s) ? simpleArea(s).toUpperCase() + ' DETAIL' : viewNames[activeView].toUpperCase());
    $('sim-view-map').innerHTML = [['front', 'Front'], ['left', 'Left'], ['right', 'Right'], ['back', 'Back']].map(([view, label]) => '<button type="button" class="sim-map-point' + (activeView === view ? ' is-current' : '') + '" data-sim-view="' + view + '" aria-pressed="' + (activeView === view) + '">' + label + '</button>').join('') + '<span class="sim-view-location">' + (preview ? 'FINISHED-STYLE REFERENCE' : 'ACTION VIEW · AUTO-SELECTED') + '</span>';
    window.CraftVisual.bind($('sim-image-wrap'));
  }
  function visualFor(s, view = s.view, preview = false) {
    const panelByView = { front: 0, left: 1, right: 2, back: 3 };
    if (s.inspectionRules || preview) return cut.finishedVisuals?.[panelByView[view]] || window.CraftVisual.fromSheet(cut, 16 + panelByView[view]);
    if (step === 0) return cut.beforeVisual || window.CraftVisual.fromSheet(cut, 0);
    if (s.visual?.region) return s.visual;
    const panel = s.panel ?? Math.min(15, Math.round((step / Math.max(1, stepsFor().length - 1)) * 15));
    return window.CraftVisual.fromSheet(cut, Math.max(0, Math.min(cut.panelRegions.length - 1, panel)));
  }
  function optionButtons(kind, options, expected) {
    return '<div class="sim-decision-options" role="group" aria-label="Choose ' + kind + '">' + options.map(([value, label]) => {
      const recommended = value === expected && (mode === 'guided' || hint);
      return '<button type="button" class="sim-decision-option' + (recommended ? ' is-recommended' : '') + '" data-sim-choice="' + esc(value) + '">' + esc(label) + (recommended ? '<small>Suggested</small>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function referenceCard(kind, s) {
    let visual = null, alt = '', body = '';
    if (kind === 'tool') {
      if (s.tool === 'clippers') { visual = window.CraftVisual.fromAsset('clipper-system', 3); alt = 'Clipper at work beside a protected ear'; }
      else if (s.tool === 'scissors' || s.tool === 'comb') return '<div class="sim-reference-card"><img class="sim-direct-reference" src="assets/practice/shear-guide.webp" alt="Barber shears and cutting comb held for a haircutting lesson" loading="lazy" decoding="async"><span>TOOL REFERENCE · shears and comb</span></div>';
      else if (['cape', 'mirror', 'spray'].includes(s.tool)) return '<div class="sim-reference-card"><img class="sim-direct-reference" src="assets/practice/station.webp" alt="Prepared barber station showing a mirror, cape, tools and spray bottle" loading="lazy" decoding="async"><span>TOOL REFERENCE · ' + esc(toolNames[s.tool]) + '</span></div>';
      else { visual = visualFor(s); alt = cut.name + ' training photograph showing the current service'; }
    } else if (kind === 'guard') { visual = window.CraftVisual.fromAsset('clipper-system', 4); alt = 'Real clipper guard comb attached to a clipper'; }
    else if (kind === 'lever') { visual = window.CraftVisual.fromAsset('clipper-system', 1); alt = 'Clipper lever close-up'; }
    if (visual) body = window.CraftVisual.frame(visual, alt, 'sim-reference-frame');
    const helpKey = kind === 'guard' ? 'guard' : kind === 'lever' ? 'lever' : s.tool;
    return '<div class="sim-reference-card">' + body + '<span>' + (kind === 'tool' ? 'TOOL · ' + esc(toolNames[s.tool] || 'training tool') : kind === 'guard' ? 'REAL CLIPPER GUARD · REFERENCE' : 'REAL CLIPPER LEVER · REFERENCE') + '</span><details class="sim-help"><summary>? What is this?</summary><p>' + esc(helpText[helpKey] || 'Use the tool shown for this action. Keep it controlled and follow the maker guidance.') + (kind === 'guard' ? ' This guard number is a training example, not a universal cutting formula. Check the clipper maker’s chart; results vary.' : '') + '</p></details></div>';
  }
  function toolOptions(expected) {
    const peers = expected === 'clippers' || expected === 'trimmer' ? ['comb', 'scissors'] : expected === 'scissors' ? ['comb', 'clippers'] : expected === 'comb' ? ['clippers', 'scissors'] : ['comb', 'clippers'];
    return [expected, ...peers].map(id => [id, toolNames[id] || id]);
  }
  function guardOptions(value) {
    const all = ['#0.5', '#1', '#1.5', '#2', '#3'];
    if (value === 'No guard') return [['No guard', 'No guard'], ['#0.5', '#0.5'], ['#1', '#1']];
    const at = Math.max(0, all.indexOf(value));
    return all.slice(Math.max(0, at - 1), Math.min(all.length, at + 2)).map(guard => [guard, guard]);
  }
  function renderDecision(s) {
    const stage = stageNow(s), area = simpleArea(s), controls = $('sim-choice-controls');
    let title = '', instruction = '', html = '', next = '';
    const reveal = mode !== 'challenge' || hint;
    if (stage === 'observe') {
      title = 'Read the head before cutting'; instruction = s.knowledgeCheck.prompt;
      html = optionButtons('an observation', s.knowledgeCheck.options, s.knowledgeCheck.answer);
      if (s.key === 'analysis') {
        const shapes = ['oval', 'round', 'square', 'oblong', 'diamond', 'heart'];
        html += '<details class="sim-analysis-reference"><summary>Open head-shape and hair checklist</summary><p>Common shape words: oval, round, square, oblong, diamond and heart. They are visual notes, not haircut rules.</p><div class="sim-analysis-shapes">' + shapes.map(shape => '<figure><img src="assets/head-shapes/' + shape + '.webp" alt="' + shape + ' head-shape haircutting reference" loading="lazy" decoding="async"><figcaption>' + shape + '</figcaption></figure>').join('') + '</div><p>Also check straight, wavy or curly texture; fine or coarse strands; overall density; and growth changes such as cowlicks, crown direction, temple growth and the hairline.</p></details>';
      }
      next = 'Combine the request, head contour, hair texture and growth before you cut.';
    } else if (stage === 'inspection') {
      const doneCount = inspectionDone.size;
      title = 'Inspect the finished haircut'; instruction = 'Review each view against the agreed shape. Mark all eight checks before finishing.';
      html = '<div class="sim-inspect-progress">' + doneCount + ' of ' + s.inspectionRules.length + ' checks reviewed</div><div class="sim-inspect-list">' + s.inspectionRules.map(item => '<button type="button" class="sim-inspect-check' + (inspectionDone.has(item.id) ? ' is-checked' : '') + '" data-inspect-id="' + item.id + '" data-inspect-view="' + item.view + '"' + (inspectionDone.has(item.id) ? ' disabled' : '') + '><strong>' + (inspectionDone.has(item.id) ? '✓ ' : '') + esc(item.label) + '</strong><span>' + esc(item.question) + '</span>' + (inspectionDone.has(item.id) ? '<small>Reviewed</small>' : '<small>Inspect this view →</small>') + '</button>').join('') + '</div>';
      next = doneCount === s.inspectionRules.length ? 'All angles reviewed. Finish when you are ready.' : 'Choose an angle, inspect the real training photo, then continue to the next check.';
    } else if (stage === 'tool') {
      title = 'Choose the tool'; instruction = reveal ? 'Use ' + (toolNames[s.tool] || s.tool) + ' for this action.' : 'Choose the tool that fits this action. Use Show me if you want the answer revealed.';
      const toolPurpose = toolDescriptions[s.tool] || 'Use this tool only for the area and action agreed in this lesson.';
      const explanation = reveal ? '<p class="sim-tool-purpose"><strong>What it does:</strong> ' + esc(toolPurpose) + '</p>' : '<details class="sim-help"><summary>? What does this tool do?</summary><p>' + esc(toolPurpose) + '</p></details>';
      html = (reveal ? referenceCard('tool', s) + explanation : explanation) + optionButtons('a tool', toolOptions(s.tool), s.tool); next = 'Choose the tool before moving on.';
    } else if (stage === 'guard') {
      title = 'Choose a guard'; instruction = reveal ? 'This training step uses ' + s.guard + '. A guard changes how much length the clipper leaves.' : 'Recall the tested length for this step. Use Show me if you need a reminder.';
      html = (reveal ? referenceCard('guard', s) : '') + optionButtons('a guard', guardOptions(s.guard), s.guard); next = 'Choose the training reference guard.';
    } else if (stage === 'lever') {
      title = 'Set the lever'; instruction = reveal ? s.lever + ' is the reference position for this pass.' : 'Recall the lever position for this pass. Use Show me for a demonstration.';
      html = '<div class="sim-lever-choices">' + ['Closed', 'Half open', 'Open'].map((label, i) => '<button type="button" class="sim-lever-choice' + ((mode === 'guided' || hint) && label === s.lever ? ' is-recommended' : '') + '" data-sim-choice="' + label + '">' + referencePhoto(i, 'Clipper lever position · ' + label, 'sim-lever-photo') + '<strong>' + label + '</strong><small>' + (i === 0 ? 'Cuts shorter' : i === 1 ? 'Middle setting' : 'Leaves more') + '</small></button>').join('') + '</div><details class="sim-help"><summary>? What does this do?</summary><p>' + esc(helpText.lever) + '</p></details>';
      next = 'Pick the lever position shown for this pass.';
    } else if (stage === 'area') {
      title = 'Find the working area'; instruction = mode === 'challenge' && !hint ? 'Choose where this action belongs on the head. Use Show me if you would like a reveal.' : 'Tap the highlighted ' + area.toLowerCase() + ' on the photo.';
      html = '<div class="sim-area-prompt"><span>WORKING AREA</span><strong>' + esc(area) + '</strong><details class="sim-help"><summary>? What is this area?</summary><p>' + esc(helpText[s.target] || helpText[area.toLowerCase()] || 'This is the part of the head where this step happens.') + '</p></details></div>';
      next = mode === 'challenge' && !hint ? 'Choose the area you think belongs to this action.' : 'Tap the highlighted area to continue.';
    } else {
      title = 'Make the movement'; instruction = reveal ? s.movementInstruction || 'Start close to the hair. Move through the section with control, then finish clear of the head.' : 'Recall the movement for this step. Use Show me if you want to watch the guide.';
      const help = s.movementType === 'clipper-over-comb' ? 'Lift hair with the comb first. Keep the clipper outside the comb and cut only the hair beyond its teeth.' : s.movementType === 'scissor-over-comb' || s.movementType === 'scissor-cut' ? 'Use the comb or fingers to control a small section. Keep fingers clear and close the shears only when the cutting section is stable.' : s.movementType === 'straight-pass' ? 'An even pass follows the local growth and head curve. Reposition around a crown swirl instead of pressing harder.' : s.movementType === 'outline' ? 'Keep the outline path short, visible and agreed. Use a light touch around ears, temples and neckline.' : helpText.flick;
      const endLabel = !reveal ? 'FINISH MOVE' : s.movementType === 'clipper-over-comb' ? 'CLIPPER FOLLOWS' : s.movementType === 'scissor-over-comb' || s.movementType === 'scissor-cut' ? 'SHEARS CUT' : s.movementType === 'outline' ? 'TRACE EDGE' : s.movementType === 'straight-pass' ? 'END PASS' : 'LIFT AWAY';
      html = '<p class="sim-move-copy">' + (reveal ? 'Follow the labelled path on the real-photo guide.' : 'Choose the movement you remember; Show me can reveal the path.') + ' Tap START, then complete it. This screen teaches decisions, not tool handling.</p><div class="sim-motion-buttons"><button type="button" data-move-role="start">START HERE</button><span aria-hidden="true">→</span><button type="button" data-move-role="end">' + endLabel + '</button></div>' + (reveal ? '<details class="sim-help"><summary>? What does this technique mean?</summary><p>' + esc(help) + '</p></details>' : '');
      next = reveal ? 'Follow the labelled movement from start to finish.' : 'Use the movement you remember, or reveal the guide.';
    }
    const showGuide = hint ? '<aside class="sim-show-guide-summary"><strong>Now you try</strong><span>Tool: ' + esc(toolNames[s.tool] || s.tool) + ' · Guard: ' + esc(s.guard || 'not used') + ' · Lever: ' + esc(s.lever || 'not used') + '</span><span>Area: ' + esc(area) + ' · Goal: ' + esc(s.expectedResult || 'understand the planned shape') + '</span></aside>' : '';
    controls.innerHTML = showGuide + '<div class="sim-decision-card"><p class="sim-decision-kicker">' + esc(title.toUpperCase()) + '</p><p class="sim-decision-prompt">' + esc(instruction) + '</p>' + html + '</div>';
    bindImages(controls);
    $('sim-up-next').innerHTML = '<span>' + (stageSolved ? '✓ DONE' : 'YOUR NEXT ACTION') + '</span><strong>' + esc(stageSolved ? (stage === 'move' ? 'Movement complete' : title + ' complete') : next) + '</strong>' + (stage === 'area' ? '<small>Area: ' + esc(area) + '</small>' : '');
    $('sim-next').disabled = !stageSolved;
    const flow = decisionFlow(s), finalChoice = decisionIndex === flow.length - 1;
    $('sim-next').textContent = stageSolved ? (stage === 'inspection' ? 'Finish haircut →' : finalChoice ? 'Complete this haircut step →' : 'Next: ' + decisionTitle(flow[decisionIndex + 1]) + ' →') : 'Continue';
  }
  function decisionTitle(stage) { return ({ observe: 'read the head and hair', inspection: 'inspect every finish angle', tool: 'choose the tool', guard: 'choose the guard', lever: 'set the lever', area: 'find the area', move: 'practice the movement' })[stage] || 'continue'; }
  function render() {
    if (!cut) return;
    if (step >= stepsFor().length) { finish(); return; }
    solved = stageSolved = false; decisionIndex = 0; hint = false; movementArmed = false; zoomed = true; viewOverride = null;
    const s = current(), steps = stepsFor();
    $('sim-title').textContent = cut.name;
    $('sim-level').textContent = course?.level || (profileFor(cut.id)?.level || 'Beginner') + ' · HAIRCUT PRACTICE';
    $('sim-counter').textContent = 'Step ' + (step + 1) + ' / ' + steps.length;
    $('sim-progress-fill').style.width = ((step + 1) / steps.length * 100) + '%';
    const progress = $('sim-progress-fill').closest('[role="progressbar"]');
    progress.setAttribute('aria-valuemax', steps.length); progress.setAttribute('aria-valuenow', step + 1);
    $('sim-mistakes').textContent = mode === 'challenge' ? 'Misses: ' + mistakes : (mistakes ? 'Retries: ' + mistakes : 'Retries welcome');
    $('sim-step-kicker').textContent = (s.stage || 'CUTTING PROCESS') + ' · STEP ' + (step + 1) + ' OF ' + steps.length;
    $('sim-step-title').textContent = simpleStepTitle(s);
    $('sim-step-what').textContent = simpleStepCopy(s);
    $('sim-step-why').textContent = s.purpose || s.focus || s.practice || 'Work slowly and check the head shape before moving on.';
    const challengeBlind = mode === 'challenge' && !hint;
    $('sim-fact-tool').textContent = challengeBlind ? 'Choose from memory' : toolNames[s.tool] || s.tool || 'Observe first';
    $('sim-fact-guard').textContent = challengeBlind ? 'Recall the tested length' : s.guard || 'Not used in this step';
    $('sim-fact-lever').textContent = challengeBlind ? 'Recall the position' : s.lever || 'Not used in this step';
    $('sim-fact-area').textContent = challengeBlind ? 'Identify it on the head' : simpleArea(s);
    $('sim-fact-movement').textContent = challengeBlind ? 'Recall the technique' : s.movementInstruction || 'Observe and check the marked area';
    $('sim-fact-goal').textContent = challengeBlind ? 'Match the planned haircut shape' : s.expectedResult || course?.shortArea || 'Understand the shape before continuing.';
    $('sim-common-mistake-copy').textContent = s.commonMistakes || s.practice || 'Change one thing at a time, then inspect before continuing.';
    $('sim-practice-link').href = practiceUrl(s);
    $('sim-feedback').textContent = mode === 'guided' ? 'I’ll point out the recommended answer. Choose one thing at a time.' : mode === 'practice' ? 'Choose one thing at a time. Show me is available whenever you need it.' : 'Choose one thing at a time. Show me is available; Challenge records retries.';
    $('sim-feedback').classList.remove('has-error', 'is-correct');
    $('sim-idle-help').hidden = true;
    $('sim-show-me').textContent = 'Show me';
    $('sim-play-area').hidden = false; $('sim-finish').hidden = true;
    renderDecision(s); renderImage(s); startHelpTimer();
  }
  function simpleStepTitle(s) {
    const names = {
      before: 'Study the starting hair', analysis: 'Read the head and hair', section: 'Protect the longer hair',
      'initial-length': 'Choose a safe starting length', guide: 'Map the first guideline', 'first-length': 'Create the shortest planned area',
      'next-length': 'Set the next longer area', transition: 'Begin the transition', blend: 'Soften the visible line',
      'second-blend': 'Connect the neighboring lengths', 'lower-blend': 'Refine the lower transition',
      'middle-blend': 'Check the middle transition', 'upper-blend': 'Connect to the longer hair',
      'guard-changes': 'Change guards carefully', lever: 'Adjust one lever position', symmetry: 'Compare both sides',
      back: 'Follow the back curve', top: 'Connect the top', temples: 'Refine the temples', ears: 'Work safely around the ear',
      finish: 'Finish the agreed outline', inspection: 'Inspect from every side', complete: 'Review the finished haircut',
      consultation: 'Hear the request before cutting', 'desired-fade': 'Agree on the shape and finish', placement: 'Choose where the transition sits',
      texture: 'Notice how the hair moves', density: 'Check how full the hair is', growth: 'Find the natural growth direction',
      crown: 'Find the crown swirl', 'temple-check': 'Check the temple corners', 'neckline-check': 'Check the natural neckline',
      tools: 'Prepare clean tools and guards'
    };
    return names[s.key] || s.title;
  }
  function simpleStepCopy(s) {
    const text = (s.detail || '').trim();
    return text.length > 235 ? text.slice(0, 232).replace(/\s+\S*$/, '') + '…' : text;
  }
  function skillFor(s) {
    const key = s.key || '';
    if (key.includes('temple')) return skillLinks.temple;
    if (key.includes('neck') || key === 'back') return skillLinks.neckline;
    if (key === 'section') return skillLinks.section;
    if (key === 'top') return skillLinks.top;
    if (key === 'inspection' || key === 'complete') return skillLinks.inspect;
    if (key === 'symmetry') return skillLinks.symmetry;
    if (key === 'lever') return skillLinks.lever;
    if (key.includes('guard')) return skillLinks.guards;
    if (key === 'guide') return skillLinks['first guideline'];
    if (key.includes('blend') || key === 'transition') return skillLinks.blend;
    if (['initial-length', 'first-length', 'next-length'].includes(key)) return cut.id === 'scissor-cut' ? skillLinks.scissors : skillLinks.grip;
    if (cut.id === 'scissor-cut') return skillLinks.scissors;
    if (cut.id.includes('taper')) return skillLinks.temple;
    if (key === 'finish') return skillLinks.finish;
    return skillLinks.grip;
  }
  function practiceUrl(s) { return 'practice.html?skill=' + encodeURIComponent(skillFor(s)) + '#quick-practice-heading'; }
  function startHelpTimer() {
    window.clearTimeout(timerOne); window.clearTimeout(timerTwo);
    timerOne = window.setTimeout(() => {
      if (!stageSolved && !solved) { $('sim-idle-help').hidden = false; }
    }, 9000);
    timerTwo = window.setTimeout(() => {
      if (!stageSolved && !solved && !hint) showMe(true);
    }, 18000);
  }
  function showMe(automatic = false) {
    hint = true;
    const s = current();
    $('sim-show-me').textContent = 'Guide shown ✓';
    $('sim-feedback').textContent = 'Here it is: ' + decisionTitle(stageNow(s)) + '. Look for the suggested choice, then take your time.';
    $('sim-feedback').classList.remove('has-error');
    if (stageNow(s) === 'area') $('sim-up-next').innerHTML = '<span>LOOK HERE</span><strong>' + esc(simpleArea(s)) + '</strong><small>Tap the glowing label on the photo.</small>';
    if (stageNow(s) === 'move') $('sim-image-wrap').classList.add('sim-show-motion');
    renderDecision(s); renderImage(s);
    if (automatic) $('sim-show-me').textContent = 'Need help? · guide is on';
  }
  function recordMistake(message, kind) {
    mistakes++;
    if (kind === 'tool') toolErrors++;
    if (kind === 'guard' || kind === 'lever') guardErrors++;
    if (kind === 'area') areaErrors++;
    mistakeLog.push({ step: step + 1, title: simpleStepTitle(current()), kind: kind || 'decision', message });
    biggestMistake = message;
    $('sim-mistakes').textContent = mode === 'challenge' ? 'Misses: ' + mistakes : 'Retries: ' + mistakes;
    $('sim-feedback').textContent = 'Almost! ' + message;
    $('sim-feedback').classList.remove('is-correct'); $('sim-feedback').classList.add('has-error');
  }
  function decisionCorrect(message) {
    if (stageSolved || solved) return;
    const completedDecision = stageNow(current());
    stageSolved = true; correct++;
    if (completedDecision === 'tool') toolCorrect++;
    if (completedDecision === 'guard' || completedDecision === 'lever') guardCorrect++;
    if (completedDecision === 'area') areaCorrect++;
    $('sim-feedback').textContent = message;
    $('sim-feedback').classList.remove('has-error'); $('sim-feedback').classList.add('is-correct');
    const finalChoice = decisionIndex === decisionFlow(current()).length - 1;
    if (finalChoice) {
      solved = true;
      const isLastStep = step === stepsFor().length - 1;
      $('sim-up-next').innerHTML = '<span>✓ STEP COMPLETE</span><strong>' + (isLastStep ? 'Review the finished cut' : 'Ready for the next part') + '</strong><small>Continue when you’re ready.</small>';
      $('sim-next').textContent = isLastStep ? 'Finish haircut →' : 'Continue to next haircut step →';
    } else {
      $('sim-up-next').innerHTML = '<span>✓ DONE</span><strong>' + esc(decisionTitle(stageNow(current()))).replace(/^./, first => first.toUpperCase()) + ' complete</strong><small>Continue when you’re ready.</small>';
      $('sim-next').textContent = 'Next: ' + decisionTitle(decisionFlow(current())[decisionIndex + 1]) + ' →';
    }
    $('sim-next').disabled = false;
    $('sim-image-wrap').classList.add('action-confirmed');
    window.clearTimeout(timerOne); window.clearTimeout(timerTwo); $('sim-idle-help').hidden = true;
    if (stageNow(current()) === 'area') renderImage(current());
  }
  function handleChoice(value) {
    if (stageSolved || solved) return;
    const s = current(), stage = stageNow(s);
    if (stage === 'observe') {
      if (value !== s.knowledgeCheck.answer) return recordMistake('Use the person’s request and actual hair together. A shape label alone does not choose the cut.', 'observation');
      return decisionCorrect(s.knowledgeCheck.explanation);
    }
    if (stage === 'tool') {
      if (value !== s.tool) return recordMistake('Use ' + (toolNames[s.tool] || s.tool) + ' for this action. The other tool is made for a different job.', 'tool');
      return decisionCorrect('Correct. ' + (toolNames[s.tool] || s.tool) + ' is the tool for this step.');
    }
    if (stage === 'guard') {
      if (value !== s.guard) return recordMistake('This practice checkpoint uses ' + s.guard + '. A different guard changes the length; real tools vary, so test the maker’s chart on a mannequin.', 'guard');
      return decisionCorrect('Good. ' + s.guard + ' is the reference guard for this training pass.');
    }
    if (stage === 'lever') {
      if (value !== s.lever) return recordMistake('This pass uses ' + s.lever.toLowerCase() + '. Closed generally cuts shorter; open generally leaves a little more.', 'lever');
      return decisionCorrect('Good. You set the lever to ' + s.lever.toLowerCase() + '.');
    }
  }
  function handleArea(area) {
    const s = current();
    if (stageNow(s) !== 'area' || stageSolved || solved) return;
    if (area !== s.target) {
      const message = area === 'top' && s.target === 'fade-zone' ? 'This pass stays below the longer top, inside the planned fade area.' : area === 'neckline' && s.target === 'fade-zone' ? 'The planned transition is on the side for this pass, above the neckline.' : 'The ' + (areaNames[area] || area.replaceAll('-', ' ')).toLowerCase() + ' is close by. This step happens at the ' + simpleArea(s).toLowerCase() + '.';
      return recordMistake(message, 'area');
    }
    decisionCorrect('That’s the ' + simpleArea(s).toLowerCase() + '. The target highlight has cleared.');
  }
  function handleInspection(id) {
    const s = current(), item = s.inspectionRules?.find(rule => rule.id === id);
    if (!item || inspectionDone.has(id)) return;
    viewOverride = item.view;
    inspectionDone.add(id);
    const complete = inspectionDone.size === s.inspectionRules.length;
    $('sim-feedback').textContent = item.label + ' view selected. ' + item.question + (complete ? ' All angles are now reviewed.' : ' Review it, then select the next check.');
    $('sim-feedback').classList.remove('has-error'); $('sim-feedback').classList.add('is-correct');
    if (complete) { stageSolved = solved = true; $('sim-next').disabled = false; $('sim-next').textContent = 'Finish haircut →'; }
    renderImage(s); renderDecision(s);
  }
  function moveReady(message = 'Nice movement. You moved upward and lifted away instead of pressing into the head.') {
    if (stageNow(current()) !== 'move' || stageSolved || solved) return;
    movementArmed = false; decisionCorrect(message);
  }
  function advance() {
    if (!stageSolved) return;
    const flow = decisionFlow(current());
    if (decisionIndex < flow.length - 1) {
      decisionIndex++; stageSolved = false; hint = false; movementArmed = false;
      $('sim-feedback').textContent = 'Now ' + decisionTitle(flow[decisionIndex]) + '. One step at a time.';
      $('sim-feedback').classList.remove('is-correct', 'has-error');
      renderDecision(current()); renderImage(current()); startHelpTimer();
      return;
    }
    solved = true;
    const nextStep = step + 1;
    $('sim-next').disabled = false;
    $('sim-next').textContent = nextStep === stepsFor().length ? 'Finish haircut →' : 'Continue to next haircut step →';
    $('sim-feedback').textContent = 'Step complete. ' + (current().focus || current().practice || 'Move on when you are ready.');
    $('sim-up-next').innerHTML = '<span>✓ STEP COMPLETE</span><strong>' + (nextStep === stepsFor().length ? 'Review the finished cut' : 'Ready for the next part') + '</strong><small>Your progress is saved when the haircut is complete.</small>';
    window.clearTimeout(timerOne); window.clearTimeout(timerTwo); $('sim-idle-help').hidden = true;
  }

  function score() {
    const total = correct + mistakes;
    const accuracy = Math.round(correct / Math.max(1, total) * 100);
    const tool = toolCorrect + toolErrors ? Math.round(toolCorrect / (toolCorrect + toolErrors) * 100) : null;
    const guard = guardCorrect + guardErrors ? Math.round(guardCorrect / (guardCorrect + guardErrors) * 100) : null;
    const area = areaCorrect + areaErrors ? Math.round(areaCorrect / (areaCorrect + areaErrors) * 100) : null;
    const metrics = [accuracy, tool, guard, area].filter(value => value !== null);
    return { accuracy, tool, guard, area, overall: Math.round(metrics.reduce((sum, value) => sum + value, 0) / metrics.length) };
  }
  function finish() {
    const done = completed(); done.add(cut.id);
    const result = score(), count = stepsFor().length;
    saveState(state => { state.simulatorCompleted = [...done]; state.simulatorScores ||= {}; state.simulatorScores[cut.id] = { ...result, mistakes, mode, biggestMistake, mistakeLog }; if (state.simulatorInProgress?.id === cut.id) delete state.simulatorInProgress; });
    const index = catalog.findIndex(item => item[0] === cut.id), nextCut = catalog[index + 1];
    $('sim-play-area').hidden = true; $('sim-finish').hidden = false;
    const photos = cut.finishedVisuals || [16, 17, 18, 19].map(panel => window.CraftVisual.fromSheet(cut, panel));
    const review = [['front', 'Front', 0], ['left', 'Left side', 1], ['right', 'Right side', 2], ['back', 'Back', 3]];
    const learned = [...new Set((course?.skills || stepsFor().map(item => item.technique)).filter(Boolean))];
    const practiceLinks = [...new Map(mistakeLog.map(item => [item.title, item])).values()];
    const mistakeItems = mistakeLog.map(item => '<li><strong>Step ' + item.step + ' · ' + esc(item.title) + '</strong><span>' + esc(item.message) + '</span></li>').join('');
    const needsPractice = practiceLinks.length ? practiceLinks.map(item => '<li><span>' + esc(item.title) + '</span><a href="' + practiceUrl(stepsFor()[item.step - 1] || stepsFor()[0]) + '">Practice this skill →</a></li>').join('') : '<li><span>No decision retries were recorded.</span><a href="' + practiceUrl(stepsFor()[count - 1]) + '">Choose a skill to refine →</a></li>';
    $('sim-finish').innerHTML = '<div class="sim-finish-heading"><p class="eyebrow">' + (mode === 'challenge' ? 'CHALLENGE COMPLETE' : mode === 'practice' ? 'PRACTICE COMPLETE' : 'GUIDED LESSON COMPLETE') + '</p><h3>Your finished haircut</h3><p>' + esc(cut.name) + ' · ' + esc(course?.family || 'shape and finish') + ' · ' + count + ' steps completed. All eight final checks were reviewed.</p></div>' +
      '<div class="sim-finish-layout"><div class="sim-finish-visual">' + window.CraftVisual.frame(photos[1], cut.name + ' · finished left-side view', 'sim-finish-image') + '<div class="simulator-finish-angles" role="group" aria-label="Review this haircut from four angles">' + review.map(([id, label, panel]) => '<button type="button" data-finish-angle="' + id + '" data-panel="' + panel + '" aria-pressed="' + (id === 'left') + '">' + label + '</button>').join('') + '</div></div><div class="sim-results"><div class="sim-result-title"><div><span>DECISION ACCURACY</span><strong class="sim-score">' + result.overall + '<small> / 100</small></strong></div><b class="sim-rating">' + (result.overall >= 90 ? 'Clear choices' : result.overall >= 75 ? 'Good practice' : 'Keep learning') + '</b></div><div class="sim-score-grid">' + [['Choices', result.accuracy], ['Tool', result.tool], ['Guard / lever', result.guard], ['Working area', result.area]].map(([label, value]) => '<div><span>' + label + '</span><strong>' + (value === null ? '—' : value + '%') + '</strong></div>').join('') + '</div><p class="sim-score-feedback">This score reflects the choices made in the simulator. It does not grade hands-on haircutting or replace a trainer’s inspection.</p><p><strong>Retries:</strong> ' + mistakes + ' · ' + esc(mode) + ' mode</p><section class="sim-finish-learning"><h4>Techniques covered</h4><ul>' + learned.map(item => '<li>' + esc(item) + '</li>').join('') + '</ul><h4>Practice next</h4><ul class="sim-practice-next-list">' + needsPractice + '</ul></section>' + (mistakeItems ? '<details class="sim-mistake-review"><summary>Review ' + mistakes + ' practice note' + (mistakes === 1 ? '' : 's') + '</summary><ol>' + mistakeItems + '</ol></details>' : '') + '<p class="learning-small-note">' + (nextCut ? 'Next on your learning path: ' + esc(nextCut[1]) : 'You reached the end of this learning path. Practice a cut again at any time.') + '</p><a class="learning-path-link" href="' + practiceUrl(stepsFor()[count - 1]) + '"><span>QUICK PRACTICE</span><strong>Rehearse the skill from your last step →</strong></a><div class="sim-finish-actions"><button type="button" class="button button-primary" id="sim-restart">Practice this cut again</button><button type="button" class="button button-secondary" id="sim-another">Choose another haircut</button></div></div></div>';
    window.CraftVisual.bind($('sim-finish'));
  }
  function start(id) {
    cut = dataFor(id); if (!cut) return;
    course = courseFor(id) || null;
    const saved = readState().simulatorInProgress;
    const resume = saved?.id === id && saved.mode === mode && saved.courseVersion === 2 ? saved : null;
    step = resume ? Math.max(0, Math.min(stepsFor().length - 1, Number(resume.step) || 0)) : 0;
    correct = resume?.correct || 0; mistakes = resume?.mistakes || 0; toolErrors = resume?.toolErrors || 0; guardErrors = resume?.guardErrors || 0; areaErrors = resume?.areaErrors || 0;
    toolCorrect = resume?.toolCorrect || 0; guardCorrect = resume?.guardCorrect || 0; areaCorrect = resume?.areaCorrect || 0;
    mistakeLog = Array.isArray(resume?.mistakeLog) ? resume.mistakeLog : []; inspectionDone = new Set(); viewOverride = null;
    feedback = biggestMistake = ''; setup.hidden = true; learn.hidden = true; game.hidden = false;
    render(); $('sim-title').focus({ preventScroll: true }); game.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function changeMode(value) {
    mode = value; buildCards();
  }

  cards.addEventListener('click', event => { const button = event.target.closest('[data-sim-cut]'); if (button && !button.disabled) start(button.dataset.simCut); });
  document.querySelectorAll('[name="sim-mode"]').forEach(input => input.addEventListener('change', () => { if (!input.disabled) changeMode(input.value); }));
  $('sim-learn-next').addEventListener('click', () => { if (!warmSolved) return; warmStep++; warmSolved = false; if (warmStep >= drills.length) return finishWarmup(); renderWarmup(); });
  $('sim-learn-skip').addEventListener('click', () => finishWarmup());
  $('sim-learn-image').addEventListener('click', event => {
    const area = event.target.closest('[data-warm-area]'); if (area && !warmSolved) warmSuccess('That’s the ' + areaNames[area.dataset.warmArea].toLowerCase() + '. You’ll see this label again as you work.');
    const motion = event.target.closest('[data-warm-motion]');
    if (motion && !warmSolved) { if (motion.dataset.warmMotion === 'start') { warmArmed = true; warmWrong('Good start. Now finish at Lift away.'); } else if (warmArmed) { warmArmed = false; warmSuccess('Nice. The clipper lifts away at the end of the pass.'); } else warmWrong('Start at Start here, then move to Lift away.'); }
  });
  $('sim-learn-control').addEventListener('click', event => {
    const choice = event.target.closest('[data-warm-choice]'); if (choice && !warmSolved) {
      const item = drills[warmStep];
      if (choice.dataset.warmChoice === item.answer) {
        const success = item.type === 'guard' ? 'Right. A higher guard number generally leaves more length; this is an approximate comparison.' : item.type === 'lever' ? 'Right. Open generally leaves a little more length than closed.' : item.type === 'technique' ? 'Right. The comb controls the hair first; the cutting tool follows it.' : 'Right. You identified the tool used for this action.';
        warmSuccess(success);
      } else {
        const correction = item.type === 'guard' ? 'Almost. Compare the labels: a higher guard generally leaves more hair.' : item.type === 'lever' ? 'Almost. Open generally leaves a little more length.' : item.type === 'technique' ? 'Start by lifting and controlling the hair with the comb. Keep the cutting tool outside it.' : 'Almost. Look for the powered cutting tool with the blade at the top.';
        warmWrong(correction);
      }
    }
  });
  $('sim-image-wrap').addEventListener('click', event => {
    const area = event.target.closest('[data-sim-area]'); if (area) handleArea(area.dataset.simArea);
  });
  $('sim-choice-controls').addEventListener('click', event => {
    const check = event.target.closest('[data-inspect-id]'); if (check) return handleInspection(check.dataset.inspectId);
    const option = event.target.closest('[data-sim-choice]'); if (option) handleChoice(option.dataset.simChoice);
  });
  $('sim-view-map').addEventListener('click', event => {
    const button = event.target.closest('[data-sim-view]'); if (!button || !cut) return;
    const selected = button.dataset.simView, s = current();
    viewOverride = selected === s.view && !s.inspectionRules ? null : selected;
    renderImage(s);
  });
  document.addEventListener('click', event => {
    const movement = event.target.closest('[data-move-role]'); if (!movement || stageNow(current()) !== 'move' || stageSolved) return;
    if (movement.dataset.moveRole === 'start') { movementArmed = true; $('sim-feedback').textContent = 'Good start. Now move or tap the end point, Lift away.'; $('sim-feedback').classList.remove('has-error'); }
    else if (movementArmed) moveReady();
    else { $('sim-feedback').textContent = 'Start at the lower point, then move upward and away.'; $('sim-feedback').classList.add('has-error'); }
  });
  document.addEventListener('pointerdown', event => {
    if (event.target.closest('[data-warm-motion="start"]')) warmArmed = true;
    if (event.target.closest('[data-move-role="start"]')) { movementArmed = true; }
  });
  document.addEventListener('pointerup', event => {
    if (warmArmed && event.target.closest('[data-warm-motion="end"]')) { warmArmed = false; warmSuccess('You followed the pass upward and finished by lifting away.'); }
    if (movementArmed && event.target.closest('[data-move-role="end"]')) moveReady('You followed the pass upward and finished by lifting away.');
  });
  $('sim-show-me').addEventListener('click', () => showMe());
  $('sim-idle-show').addEventListener('click', () => showMe());
  $('sim-next').addEventListener('click', () => {
    if (!stageSolved) return;
    if (solved) {
      const nextStep = step + 1;
      if (nextStep < stepsFor().length) saveState(state => { state.simulatorInProgress = { id: cut.id, step: nextStep, mode, courseVersion: 2, correct, mistakes, toolErrors, guardErrors, areaErrors, toolCorrect, guardCorrect, areaCorrect, mistakeLog }; });
      step++; render(); $('sim-step-title').focus({ preventScroll: true });
    }
    else advance();
  });
  $('sim-image-wrap').addEventListener('click', event => {
    const button = event.target.closest('#sim-full-head'); if (button) { zoomed = false; renderImage(current()); }
  });
  $('sim-back').addEventListener('click', () => { window.clearTimeout(timerOne); window.clearTimeout(timerTwo); game.hidden = true; cut = course = null; setup.hidden = false; buildCards(); setup.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  $('sim-finish').addEventListener('click', event => {
    const angle = event.target.closest('[data-finish-angle]');
    if (angle) {
      const panel = Number(angle.dataset.panel), visual = cut.finishedVisuals?.[panel] || window.CraftVisual.fromSheet(cut, 16 + panel);
      const frame = $('sim-finish').querySelector('.sim-finish-image');
      frame.outerHTML = window.CraftVisual.frame(visual, cut.name + ' · finished ' + angle.dataset.finishAngle + ' view', 'sim-finish-image');
      $('sim-finish').querySelectorAll('[data-finish-angle]').forEach(button => button.setAttribute('aria-pressed', String(button === angle)));
      window.CraftVisual.bind($('sim-finish'));
    }
    if (event.target.closest('#sim-restart')) start(cut.id);
    if (event.target.closest('#sim-another')) $('sim-back').click();
  });
  $('simulator-game').addEventListener('keydown', event => {
    if (event.target.matches('input, button, select')) return;
    if ((event.key === 'ArrowRight' || event.key === 'Enter') && stageSolved) $('sim-next').click();
    if (event.key === 'ArrowLeft' && decisionIndex > 0 && !solved) { decisionIndex--; stageSolved = false; hint = false; renderDecision(current()); renderImage(current()); }
  });
  window.addEventListener('storage', event => { if (event.key === storageKey) { if (!learnFirstDone()) showStart(); else if (game.hidden) buildCards(); } });

  showStart();
})();
