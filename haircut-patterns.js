(() => {
  "use strict";
  const STORAGE_KEY = "the-craft-progress-v2";
  const patterns = Array.isArray(window.THE_CRAFT_PATTERNS) ? window.THE_CRAFT_PATTERNS : [];
  const walkthroughs = Array.isArray(window.THE_CRAFT_WALKTHROUGHS) ? window.THE_CRAFT_WALKTHROUGHS : [];
  const validIds = new Set(patterns.map((pattern) => pattern.id));
  const slideNames = ["Finished", "Side", "Back", "Pattern", "Notice", "Practice"];
  const slideViews = ["front", "side", "back", "side", "side", "front"];
  const groupNames = { beginner: "Beginner", next: "Intermediate", advanced: "Challenge" };
  const photoViewNames = { front: "front three-quarter view", side: "left-side profile", back: "back view" };
  const guidePaths = {
    "low-fade": "M 13 43 C 28 43 35 41 45 38 C 57 35 68 33 80 31",
    "mid-fade": "M 13 37 C 28 37 37 34 47 31 C 59 28 69 26 80 24",
    "high-fade": "M 13 31 C 28 31 38 28 48 25 C 60 22 70 21 80 19",
    "drop-fade": "M 80 32 C 66 31 56 33 48 39 C 41 44 39 49 31 48 C 24 47 18 43 14 40",
    "crew-cut": "M 15 43 C 30 42 39 39 49 35 C 60 31 70 30 81 28"
  };
  const observationPoints = {
    "low-taper": [[77, 39], [23, 47], [53, 20]],
    "low-fade": [[76, 33], [48, 39], [24, 44]],
    "mid-fade": [[75, 26], [47, 34], [24, 43]],
    "high-fade": [[75, 20], [46, 28], [24, 40]],
    "drop-fade": [[76, 32], [39, 46], [55, 19]],
    "classic-taper": [[76, 37], [23, 47], [52, 20]],
    "buzz-cut": [[55, 20], [42, 37], [70, 25]],
    "crew-cut": [[71, 29], [48, 37], [25, 44]]
  };
  const progressNote = document.getElementById("pattern-progress-note");
  const groupRoot = document.getElementById("pattern-groups");
  const viewer = document.getElementById("pattern-lesson");
  const artStage = document.getElementById("pattern-diagram-stage");
  const legend = document.getElementById("pattern-diagram-caption");
  const copyStage = document.getElementById("pattern-slide-copy");
  const walkthroughPlayer = document.getElementById("cut-walkthrough");
  const walkthroughGrid = document.getElementById("additional-cut-grid");
  const focusedLessonSections = [
    document.querySelector(".pattern-progress"),
    document.querySelector(".pattern-selector"),
    document.querySelector(".additional-cut-section"),
    document.querySelector(".pattern-safety"),
    document.getElementById("pattern-reference")
  ].filter(Boolean);
  let currentPattern = null;
  let currentWalkthrough = null;
  let currentCutStep = 0;
  let currentFinalView = "front";
  let currentSlide = 0;
  let currentView = "front";
  let understood = readUnderstood();
  let completedWalkthroughs = readCompletedWalkthroughs();

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      const replacements = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };
      return replacements[character];
    });
  }
  function readSavedState() {
    try {
      const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch { return {}; }
  }
  function readUnderstood() {
    const saved = readSavedState();
    const values = Array.isArray(saved.patterns) ? saved.patterns.filter((id) => validIds.has(id)) : [];
    return new Set(values);
  }
  function readCompletedWalkthroughs() {
    const saved = readSavedState();
    const values = Array.isArray(saved.walkthroughs) ? saved.walkthroughs.filter((id) => walkthroughs.some((cut) => cut.id === id)) : [];
    return new Set(values);
  }
  function saveUnderstood(id, isUnderstood) {
    try {
      const saved = readSavedState();
      const values = new Set(Array.isArray(saved.patterns) ? saved.patterns.filter((item) => validIds.has(item)) : []);
      if (isUnderstood) values.add(id);
      else values.delete(id);
      saved.patterns = [...values];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      return true;
    } catch { return false; }
  }
  function saveWalkthroughCompletion(id, isComplete) {
    try {
      const saved = readSavedState();
      const values = new Set(Array.isArray(saved.walkthroughs) ? saved.walkthroughs.filter((item) => walkthroughs.some((cut) => cut.id === item)) : []);
      if (isComplete) values.add(id);
      else values.delete(id);
      saved.walkthroughs = [...values];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      completedWalkthroughs = readCompletedWalkthroughs();
      renderCards();
      renderAdditionalWalkthroughs();
      return true;
    } catch { return false; }
  }
  function updateProgress() {
    const count = understood.size;
    const countNode = document.getElementById("pattern-progress-count");
    const fill = document.getElementById("pattern-progress-fill");
    const bar = fill && fill.closest('[role="progressbar"]');
    if (countNode) countNode.textContent = count + " of " + patterns.length;
    if (fill) fill.style.width = (count / Math.max(patterns.length, 1) * 100) + "%";
    if (bar) bar.setAttribute("aria-valuenow", String(count));
    if (progressNote) progressNote.textContent = count === patterns.length && count > 0 ? "All eight checks are saved on this device." : "Your checks save on this device.";
    updateCardStates();
  }

  function overlayMarkup(pattern, type, view) {
    if (view !== "side" || type === "none") return "";
    if (type === "pattern") {
      if (pattern.kind === "uniform") return "";
      if (pattern.kind === "taper" || pattern.kind === "classic") {
        return '<svg class="photo-annotation photo-annotation-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M 78 34 C 76 38 74 42 75 46 M 17 47 C 21 47 25 45 29 42" class="photo-edge-guide"/></svg>';
      }
      const path = guidePaths[pattern.id] || "M 13 40 C 30 39 42 36 55 33 C 65 30 73 28 80 26";
      return '<svg class="photo-annotation" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="' + path + '" class="photo-transition-guide"/><circle cx="48" cy="38" r="1.35" class="photo-guide-anchor"/></svg>';
    }
    if (type === "observations") {
      const points = observationPoints[pattern.id] || [[75, 32], [45, 40], [25, 45]];
      return '<svg class="photo-annotation photo-observation-markers" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + points.map(([x, y], index) => '<g><circle cx="' + x + '" cy="' + y + '" r="2.35"/><text x="' + x + '" y="' + (y + 0.84) + '">0' + (index + 1) + "</text></g>").join("") + "</svg>";
    }
    return "";
  }
  function photoMarkup(pattern, view, options = {}) {
    const image = pattern.images && pattern.images[view];
    if (!image) return '<div class="photo-unavailable">Reference photo unavailable.</div>';
    const altPrefix = pattern.name + " haircut, " + (photoViewNames[view] || "reference view");
    const alt = altPrefix + ". " + (view === "back" ? pattern.backNote : pattern.description);
    const classes = "haircut-photo" + (options.compact ? " is-compact" : "");
    const loading = options.eager ? "eager" : "lazy";
    return '<div class="' + classes + '"><img data-haircut-photo src="' + escapeHTML(image) + '" alt="' + escapeHTML(alt) + '" width="1122" height="1402" loading="' + loading + '" decoding="async">' + overlayMarkup(pattern, options.overlay || "none", view) + "</div>";
  }
  function attachPhotoFallback(scope) {
    if (!scope) return;
    scope.querySelectorAll("img[data-haircut-photo]").forEach((image) => {
      image.addEventListener("error", () => {
        const fallback = document.createElement("div");
        fallback.className = "photo-unavailable";
        fallback.textContent = "The reference photo could not load. Use the lesson notes below to study this pattern.";
        image.replaceWith(fallback);
      }, { once: true });
    });
  }
  function cardMarkup(pattern) {
    const completed = understood.has(pattern.id);
    const cutDone = completedWalkthroughs.has(pattern.id);
    return '<article class="pattern-card' + (completed ? " is-understood" : "") + '" data-pattern-card="' + escapeHTML(pattern.id) + '"><div class="pattern-card-art">' + photoMarkup(pattern, "side", { compact: true, eager: pattern.group === "beginner" }) + '</div><div class="pattern-card-body"><div class="pattern-card-top"><span class="difficulty-badge difficulty-' + escapeHTML(pattern.group) + '">' + escapeHTML(pattern.difficulty) + '</span><span class="understood-mark" data-pattern-state="' + escapeHTML(pattern.id) + '"' + (completed ? "" : " hidden") + ">✓ Understood</span></div><h4>" + escapeHTML(pattern.name) + '</h4><p class="pattern-card-description">' + escapeHTML(pattern.description) + '</p><dl class="pattern-card-facts"><div><dt>Short area</dt><dd>' + escapeHTML(pattern.starts) + '</dd></div><div><dt>Length idea</dt><dd>' + escapeHTML(pattern.length) + '</dd></div></dl>' + (cutDone ? '<p class="pattern-walkthrough-status">✓ Full cut walked through</p>' : "") + '<button class="button button-secondary pattern-open-button" type="button" data-open-pattern="' + escapeHTML(pattern.id) + '">Learn this pattern</button></div></article>';
  }
  function frameMarkup(cut, step, className, alt) {
    const visual = (step >= 100 ? cut.finishedVisuals?.[step - 100] : cut.steps[step]?.visual);
    if (visual) return window.CraftVisual.frame(visual, alt, className);
    const panel = cut.steps[step] ? cut.steps[step].panel : step;
    const columns = cut.sheetColumns || 4;
    const rows = cut.sheetRows || 3;
    const imageWidth = cut.imageWidth || 1536;
    const imageHeight = cut.imageHeight || 1024;
    const region = cut.panelRegions[panel];
    if (!region) return window.CraftVisual.frame(null, alt, className);
    const ratio = (region.width / region.height).toFixed(4) + " / 1";
    return '<div class="story-frame ' + className + '" data-sheet-columns="' + columns + '" data-sheet-rows="' + rows + '" data-panel="' + panel + '" style="--sheet-cols:' + (imageWidth / region.width) + ';--sheet-rows:' + (imageHeight / region.height) + ';--frame-x:-' + (region.x / region.width * 100) + '%;--frame-y:-' + (region.y / region.height * 100) + '%;--frame-ar:' + ratio + '"><img src="' + escapeHTML(cut.asset) + '" width="' + imageWidth + '" height="' + imageHeight + '" alt="' + escapeHTML(alt) + '" loading="lazy" decoding="async"></div>';
  }
  function renderAdditionalWalkthroughs() {
    if (!walkthroughGrid) return;
    const extraCuts = walkthroughs.filter((cut) => !validIds.has(cut.id)).slice(0, 4);
    walkthroughGrid.innerHTML = extraCuts.map((cut) => '<article class="additional-cut-card"><div class="additional-cut-card-art">' + frameMarkup(cut, cut.steps.length - 1, "additional-cut-frame", cut.name + " finished reference") + '</div><div class="additional-cut-card-copy"><div><span class="difficulty-badge difficulty-' + escapeHTML(cut.group) + '">' + escapeHTML(cut.level) + '</span>' + (completedWalkthroughs.has(cut.id) ? '<span class="walkthrough-done-badge">✓ Walked through</span>' : "") + '</div><h3>' + escapeHTML(cut.name) + '</h3><p>' + escapeHTML(cut.zones) + '</p><button class="button button-secondary" type="button" data-open-cut="' + escapeHTML(cut.id) + '">Learn every step <span aria-hidden="true">→</span></button></div></article>').join("");
    walkthroughGrid.querySelectorAll("img").forEach((image) => attachStoryFallback(image));
  }
  function renderCards() {
    if (!groupRoot) return;
    groupRoot.innerHTML = ["beginner", "next", "advanced"].filter(group => patterns.some(p => p.group === group)).map((group) => {
      const items = patterns.filter((pattern) => pattern.group === group);
      return '<section class="pattern-tier" aria-labelledby="tier-' + group + '"><header class="pattern-tier-heading"><h3 id="tier-' + group + '">' + groupNames[group] + '</h3><span>' + items.length + (items.length === 1 ? " pattern" : " patterns") + '</span></header><div class="pattern-card-grid">' + items.map(cardMarkup).join("") + "</div></section>";
    }).join("");
    attachPhotoFallback(groupRoot);
  }
  function updateCardStates() {
    document.querySelectorAll("[data-pattern-card]").forEach((card) => {
      const done = understood.has(card.dataset.patternCard);
      card.classList.toggle("is-understood", done);
      const mark = card.querySelector("[data-pattern-state]");
      if (mark) mark.hidden = !done;
    });
  }
  function slideText(pattern, index) {
    if (index === 0) {
      return '<p class="slide-kicker">01 / FULL HAIRCUT</p><h3>What is the overall shape?</h3><p>' + escapeHTML(pattern.description) + '</p><div class="slide-highlight"><strong>Short area</strong><span>' + escapeHTML(pattern.shortest) + "</span></div>";
    }
    if (index === 1) {
      return '<p class="slide-kicker">02 / SIDE VIEW</p><h3>Where does the side change?</h3><p>' + escapeHTML(pattern.starts) + ". " + escapeHTML(pattern.length) + '</p><div class="slide-highlight"><strong>Look for</strong><span>' + escapeHTML(pattern.kind === "uniform" ? "A chosen even length; a fade is not required." : "Follow the hair from the shortest area into longer hair.") + "</span></div>";
    }
    if (index === 2) {
      return '<p class="slide-kicker">03 / BACK VIEW</p><h3>What happens at the neckline?</h3><p>' + escapeHTML(pattern.backNote) + '</p><div class="slide-highlight"><strong>Observe</strong><span>Trace the shape from behind the ears into the nape.</span></div>';
    }
    if (index === 3) {
      if (pattern.kind === "uniform") {
        return '<p class="slide-kicker">04 / PATTERN EXPLANATION</p><h3>One length can be the whole pattern.</h3><p>A buzz cut does not need a fade. Look for an even chosen length over the top, sides, and back.</p><div class="photo-zone-key single"><span><b>SAME LENGTH</b>' + escapeHTML(pattern.guard) + "</span></div>";
      }
      const viewNote = currentView === "side"
        ? "Use the fine guide on the photo to locate the pattern. It follows the hair shape; it is not a cutting line."
        : "Select Side to see the transition guide. Compare this angle to understand how the shape wraps around the head.";
      return '<p class="slide-kicker">04 / PATTERN EXPLANATION</p><h3>Read the shorter-to-longer change.</h3><p>' + viewNote + '</p><div class="photo-zone-key"><span><b>SHORT</b>' + escapeHTML(pattern.shortest) + '</span><span><b>TRANSITION</b>' + escapeHTML(pattern.starts) + '</span><span><b>LONGER</b>' + escapeHTML(pattern.length) + '</span></div><div class="slide-guard-note"><strong>Guard idea</strong><span>' + escapeHTML(pattern.guard) + "</span></div>";
    }
    if (index === 4) {
      const viewNote = currentView === "side"
        ? "Side view: numbered markers match these three observations."
        : "Select Side to see the numbered markers; compare this angle to see how the shape wraps around.";
      return '<p class="slide-kicker">05 / BEGINNER OBSERVATION</p><h3>What should you notice?</h3><ol class="photo-observation-list">' + pattern.notices.map((point, pointIndex) => '<li><span>0' + (pointIndex + 1) + "</span><p>" + escapeHTML(point) + "</p></li>").join("") + '</ol><p class="slide-photo-hint">' + viewNote + "</p>";
    }
    const isUnderstood = understood.has(pattern.id);
    return '<p class="slide-kicker">06 / PRACTICE</p><h3>Practice this pattern.</h3><p>' + escapeHTML(pattern.practice) + '</p><ol class="practice-checklist"><li>Identify the transition height.</li><li>Identify the shortest area.</li><li>Find where longer hair begins.</li><li>Compare both sides and the back.</li><li>Rehearse the movement slowly.</li></ol><label class="understood-check"><input id="pattern-understood" type="checkbox"' + (isUnderstood ? " checked" : "") + '><span>I understand this pattern</span></label>';
  }
  function captionText(pattern, view, slide) {
    if (slide === 0) return "Finished-cut reference, front three-quarter view.";
    if (slide === 1) return pattern.kind === "uniform" ? "Short hair is kept even around the side; the outline is a separate choice." : "Side profile: " + pattern.starts + ".";
    if (slide === 2) return "Back view. " + pattern.backNote;
    if (slide === 3) return pattern.kind === "uniform" ? "The same short length continues around the head; there is no fade transition." : view === "side" ? "The fine guide is an observation aid only; notice the length change in the hair itself." : "Select Side to see the transition guide; compare the shape in this angle.";
    if (slide === 4) return view === "side" ? "The numbered markers connect the photo to the three things to notice." : "Select Side to see the numbered markers for these observations.";
    return "Finished reference for practice review.";
  }
  function renderPhotoStage() {
    if (!currentPattern || !artStage) return;
    let overlay = "none";
    if (currentSlide === 3) overlay = "pattern";
    if (currentSlide === 4) overlay = "observations";
    artStage.innerHTML = photoMarkup(currentPattern, currentView, { overlay: overlay, eager: true });
    attachPhotoFallback(artStage);
    if (legend) legend.textContent = captionText(currentPattern, currentView, currentSlide);
    document.querySelectorAll("[data-photo-view]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.photoView === currentView));
    });
  }
  function renderSlideSteps() {
    const root = document.getElementById("pattern-slide-steps");
    if (!root) return;
    root.innerHTML = slideNames.map((name, index) => '<button type="button" data-slide-index="' + index + '"' + (index === currentSlide ? ' aria-current="step"' : "") + ' aria-label="Go to slide ' + (index + 1) + ": " + name + '"><span>0' + (index + 1) + "</span><span>" + name + "</span></button>").join("");
  }
  function showSlide(index) {
    if (!currentPattern || index < 0 || index >= slideNames.length) return;
    currentSlide = index;
    currentView = slideViews[index];
    const title = document.getElementById("pattern-lesson-title");
    const badge = document.getElementById("pattern-level-badge");
    const position = document.getElementById("pattern-viewer-position");
    const summary = document.getElementById("pattern-lesson-summary");
    if (title) title.textContent = currentPattern.name;
    if (badge) {
      badge.className = "difficulty-badge difficulty-" + currentPattern.group;
      badge.textContent = currentPattern.difficulty;
    }
    if (position) position.textContent = groupNames[currentPattern.group].toUpperCase() + " PATTERN";
    if (summary) summary.textContent = currentPattern.description;
    if (copyStage) copyStage.innerHTML = slideText(currentPattern, currentSlide);
    renderPhotoStage();
    const counter = document.getElementById("pattern-slide-counter");
    if (counter) counter.textContent = (currentSlide + 1) + " / " + slideNames.length;
    const previous = document.getElementById("pattern-previous");
    const next = document.getElementById("pattern-next");
    if (previous) previous.disabled = currentSlide === 0;
    if (next) {
      next.disabled = currentSlide === slideNames.length - 1;
      next.textContent = currentSlide === slideNames.length - 1 ? "End of lesson" : "Next →";
    }
    renderSlideSteps();
    if (currentSlide === slideNames.length - 1) {
      const checkbox = document.getElementById("pattern-understood");
      checkbox?.addEventListener("change", () => {
        const ok = saveUnderstood(currentPattern.id, checkbox.checked);
        if (!ok) {
          checkbox.checked = !checkbox.checked;
          if (progressNote) progressNote.textContent = "This browser could not save the check. Try again when storage is available.";
          return;
        }
        understood = readUnderstood();
        updateProgress();
      });
    }
  }
  function selectPattern(id, options = {}) {
    const pattern = patterns.find((item) => item.id === id);
    if (!pattern || !viewer) return;
    currentPattern = pattern;
    currentSlide = 0;
    currentWalkthrough = null;
    if (walkthroughPlayer) walkthroughPlayer.hidden = true;
    viewer.hidden = false;
    showSlide(0);
    if (options.updateUrl !== false) {
      const url = new URL(window.location.href);
      url.searchParams.set("pattern", pattern.id);
      url.searchParams.delete("walkthrough");
      url.searchParams.delete("step");
      url.hash = "pattern-lesson";
      window.history.replaceState({}, "", url);
    }
    if (options.scroll) requestAnimationFrame(() => {
      viewer.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("pattern-lesson-title")?.focus({ preventScroll: true });
    });
  }
  function closeLesson() {
    if (viewer) viewer.hidden = true;
    if (walkthroughPlayer) walkthroughPlayer.hidden = true;
    currentPattern = null;
    currentWalkthrough = null;
    const url = new URL(window.location.href);
    url.searchParams.delete("pattern");
    url.searchParams.delete("walkthrough");
    url.searchParams.delete("step");
    url.hash = "";
    window.history.replaceState({}, "", url);
    document.getElementById("pattern-selector-title")?.focus({ preventScroll: true });
  }
  function changePhotoView(view) {
    if (!currentPattern || !["front", "side", "back"].includes(view)) return;
    currentView = view;
    if (copyStage && (currentSlide === 3 || currentSlide === 4)) copyStage.innerHTML = slideText(currentPattern, currentSlide);
    renderPhotoStage();
  }
  function renderCutStepRail() {
    const root = document.getElementById("cut-step-rail");
    if (!root || !currentWalkthrough) return;
    root.innerHTML = currentWalkthrough.steps.map((step, index) => '<button type="button" data-cut-step="' + index + '"' + (index === currentCutStep ? ' aria-current="step"' : "") + ' aria-label="Open step ' + (index + 1) + ': ' + escapeHTML(step.title) + '"><span>' + String(index + 1).padStart(2, "0") + '</span><small>' + escapeHTML(step.stage.split(" + ")[0]) + '</small></button>').join("");
  }
  function renderProcessOverview() {
    const root = document.getElementById("cut-process-overview");
    if (!root || !currentWalkthrough) return;
    const cut = currentWalkthrough;
    const active = cut.processOverview.filter((item) => item.step <= currentCutStep).at(-1);
    root.innerHTML = cut.processOverview.map((item) => '<button type="button" data-process-step="' + item.step + '"' + (item === active ? ' aria-current="step"' : '') + ' aria-label="' + escapeHTML(item.label + ': open step ' + (item.step + 1)) + '">' + frameMarkup(cut, item.step, "process-thumbnail", cut.name + " · " + item.label) + '<span><small>' + String(item.step + 1).padStart(2, "0") + '</small>' + escapeHTML(item.label) + '</span></button>').join("");
    root.querySelectorAll("img").forEach(attachStoryFallback);
  }
  function renderCutStep() {
    if (!currentWalkthrough || !walkthroughPlayer) return;
    const cut = currentWalkthrough;
    const step = cut.steps[currentCutStep];
    const done = completedWalkthroughs.has(cut.id);
    const title = document.getElementById("cut-walkthrough-title");
    const summary = document.getElementById("cut-walkthrough-summary");
    const level = document.getElementById("cut-walkthrough-level");
    const kicker = document.getElementById("cut-step-kicker");
    const stepTitle = document.getElementById("cut-step-title");
    const detail = document.getElementById("cut-step-detail");
    const actions = document.getElementById("cut-step-actions");
    const focus = document.getElementById("cut-step-focus-copy");
    const practice = document.getElementById("cut-step-practice-copy");
    const counter = document.getElementById("cut-step-counter");
    const position = document.getElementById("cut-step-position");
    const progressFill = document.getElementById("cut-step-progress-fill");
    const progressBar = progressFill && progressFill.closest('[role="progressbar"]');
    const completionStatus = document.getElementById("cut-completion-status");
    const previous = document.getElementById("cut-step-previous");
    const next = document.getElementById("cut-step-next");
    const completionLabel = document.getElementById("cut-complete-label");
    const completionToggle = document.getElementById("cut-complete-toggle");
    if (title) title.textContent = cut.name + " · full haircut process";
    let related = document.getElementById('cut-related-path');
    if (!related) { related = document.createElement('p'); related.id = 'cut-related-path'; summary.after(related); }
    related.innerHTML = '<a class="text-link" href="haircuts.html?cut=' + cut.id + '">Style brief · tools, head considerations and practice →</a>' + (cut.profile?.fadeTechnique ? ' · <a class="text-link" href="fade-training.html?module=course&type=' + cut.profile.fadeTechnique + '">Fade technique used · full course →</a>' : '');
    if (summary) summary.textContent = "Follow the same client from untouched hair to the finished cut. Choose a stage below, then work through the smaller steps.";
    if (level) {
      level.className = "difficulty-badge difficulty-" + cut.group;
      level.textContent = cut.level;
    }
    if (kicker) kicker.textContent = "STEP " + String(currentCutStep + 1).padStart(2, "0") + " · " + step.stage;
    if (stepTitle) stepTitle.textContent = step.title;
    if (detail) detail.textContent = step.detail;
    if (actions) actions.innerHTML = step.action.map((item) => "<li>" + escapeHTML(item) + "</li>").join("");
    if (focus) focus.textContent = step.focus;
    if (practice) practice.textContent = step.practice;
    document.getElementById("cut-step-tool").textContent = step.tool;
    document.getElementById("cut-step-next-copy").textContent = cut.steps[currentCutStep + 1]?.title || step.next;
    const changes = document.getElementById("cut-what-changed");
    changes.hidden = currentCutStep !== cut.steps.length - 1;
    document.getElementById("cut-what-changed-list").innerHTML = cut.whatChanged.map((item) => '<div><dt>' + escapeHTML(item.label) + '</dt><dd>' + escapeHTML(item.text) + '</dd></div>').join("");
    if (counter) counter.textContent = "Step " + (currentCutStep + 1) + " of " + cut.steps.length;
    if (position) position.textContent = (currentCutStep + 1) + " / " + cut.steps.length;
    if (progressFill) progressFill.style.width = ((currentCutStep + 1) / cut.steps.length * 100) + "%";
    if (progressBar) {
      progressBar.setAttribute("aria-valuemax", String(cut.steps.length));
      progressBar.setAttribute("aria-valuenow", String(currentCutStep + 1));
      progressBar.setAttribute("aria-label", cut.name + " walkthrough progress");
    }
    if (completionStatus) completionStatus.textContent = done ? "✓ Saved as complete" : cut.steps.length + " visual stages";
    if (previous) previous.disabled = currentCutStep === 0;
    if (next) {
      next.disabled = currentCutStep === cut.steps.length - 1;
      next.textContent = currentCutStep === cut.steps.length - 1 ? "End of walkthrough" : "Next step →";
    }
    if (completionLabel) completionLabel.hidden = currentCutStep !== cut.steps.length - 1;
    if (completionToggle) completionToggle.checked = done;
    const stage = document.getElementById("cut-step-visual");
    if (stage) {
      const finalView = currentCutStep === cut.steps.length - 1 ? cut.finalViews.find((item) => item.id === currentFinalView) : null;
      stage.innerHTML = (finalView ? '<div class="cut-final-views" role="group" aria-label="Finished haircut angle">' + cut.finalViews.map((item) => '<button type="button" data-final-view="' + item.id + '" aria-pressed="' + (item.id === currentFinalView) + '">' + item.label + '</button>').join("") + '</div>' : '') + frameMarkup(cut, finalView ? finalView.panel : currentCutStep, "cut-step-image", finalView ? cut.name + " finished · " + finalView.label : step.imageAlt);
      const image = stage.querySelector("img");
      if (image) {
        image.loading = "eager";
        image.fetchPriority = "high";
        attachStoryFallback(image);
      }
      const caption = document.createElement("figcaption");
      caption.id = "cut-step-caption";
      caption.innerHTML = '<span>' + escapeHTML(step.stage.replaceAll("+", "·") + " · " + (finalView ? finalView.label : step.view)) + '</span><strong>' + String(currentCutStep + 1).padStart(2, "0") + ' / ' + String(cut.steps.length).padStart(2, "0") + '</strong>';
      stage.append(caption);
      if (currentCutStep === cut.steps.length - 1) {
        const comparison = document.createElement("details");
        comparison.className = "cut-before-after";
        comparison.innerHTML = '<summary>Compare the start with the finished shape</summary><div class="cut-before-after-grid"><figure>' + frameMarkup(cut, 0, "cut-before-after-frame", cut.name + " before the haircut") + '<figcaption>BEFORE · STEP 01</figcaption></figure><figure>' + frameMarkup(cut, cut.steps.length - 1, "cut-before-after-frame", cut.name + " finished shape") + '<figcaption>FINISHED · STEP ' + String(cut.steps.length).padStart(2, "0") + '</figcaption></figure></div>';
        stage.append(comparison);
        comparison.querySelectorAll("img").forEach((image) => attachStoryFallback(image));
      }
    }
    renderCutStepRail();
    renderProcessOverview();
  }
  function attachStoryFallback(image) {
    const setFrameRatio = () => {
      const frame = image.closest(".story-frame");
      if (frame && image.naturalWidth && image.naturalHeight && !frame.style.getPropertyValue("--frame-ar")) frame.style.setProperty("--frame-ar", ((image.naturalWidth * Number(frame.dataset.sheetRows || 3)) / (image.naturalHeight * Number(frame.dataset.sheetColumns || 4))).toFixed(4) + " / 1");
    };
    if (image.complete && image.naturalWidth) setFrameRatio();
    else image.addEventListener("load", setFrameRatio, { once: true });
    image.addEventListener("error", () => {
      const fallback = document.createElement("div");
      fallback.className = "story-image-fallback";
      fallback.setAttribute("role", "img");
      fallback.textContent = "This training image could not load. Continue with the step actions and practice cue below.";
      image.replaceWith(fallback);
    }, { once: true });
  }
  function launchCutWalkthrough(id, stepIndex = 0, options = {}) {
    const cut = walkthroughs.find((entry) => entry.id === id);
    if (!cut || !walkthroughPlayer) return;
    currentCutStep = Math.max(0, Math.min(cut.steps.length - 1, stepIndex));
    currentFinalView = "front";
    if (validIds.has(cut.id)) {
      if (!currentPattern || currentPattern.id !== cut.id) selectPattern(cut.id, { updateUrl: false, scroll: false });
    } else {
      currentPattern = null;
    }
    if (viewer) viewer.hidden = true;
    focusedLessonSections.forEach((section) => { section.hidden = true; });
    document.querySelector(".pattern-page")?.classList.add("is-walkthrough-open");
    currentWalkthrough = cut;
    walkthroughPlayer.hidden = false;
    renderCutStep();
    if (options.updateUrl !== false) {
      const url = new URL(window.location.href);
      if (validIds.has(cut.id)) url.searchParams.set("pattern", cut.id);
      else url.searchParams.delete("pattern");
      url.searchParams.set("walkthrough", cut.id);
      url.searchParams.set("step", String(currentCutStep + 1));
      url.hash = "cut-walkthrough";
      window.history.replaceState({}, "", url);
    }
    if (options.scroll) requestAnimationFrame(() => {
      walkthroughPlayer.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("cut-walkthrough-title")?.focus({ preventScroll: true });
    });
  }
  function moveCutStep(nextStep) {
    if (!currentWalkthrough || nextStep < 0 || nextStep >= currentWalkthrough.steps.length) return;
    currentCutStep = nextStep;
    renderCutStep();
    const url = new URL(window.location.href);
    url.searchParams.set("walkthrough", currentWalkthrough.id);
    url.searchParams.set("step", String(currentCutStep + 1));
    url.hash = "cut-walkthrough";
    window.history.replaceState({}, "", url);
  }
  function closeCutWalkthrough() {
    if (walkthroughPlayer) walkthroughPlayer.hidden = true;
    focusedLessonSections.forEach((section) => { section.hidden = false; });
    document.querySelector(".pattern-page")?.classList.remove("is-walkthrough-open");
    if (currentPattern && viewer) viewer.hidden = false;
    currentWalkthrough = null;
    const url = new URL(window.location.href);
    url.searchParams.delete("walkthrough");
    url.searchParams.delete("step");
    url.hash = currentPattern ? "pattern-lesson" : "";
    window.history.replaceState({}, "", url);
    const target = currentPattern ? document.getElementById("pattern-lesson-title") : document.getElementById("additional-cut-title");
    target?.focus({ preventScroll: true });
    (currentPattern ? viewer : walkthroughGrid)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function renderComparisonPhoto(pattern, view) {
    return '<div class="comparison-photo">' + photoMarkup(pattern, view, { compact: true }) + "</div>";
  }
  function renderReferences() {
    const heightRoot = document.getElementById("height-comparison");
    if (heightRoot) {
      const notes = {
        "low-fade": "Blend stays low around the ears and neckline.",
        "mid-fade": "Blend begins around the middle of the sides.",
        "high-fade": "Blend starts much higher on the sides."
      };
      heightRoot.innerHTML = ["low-fade", "mid-fade", "high-fade"].map((id) => {
        const pattern = patterns.find((item) => item.id === id);
        return '<article class="height-card"><div class="height-card-art">' + renderComparisonPhoto(pattern, "side") + '</div><div><p class="eyebrow">' + pattern.name.replace(" Fade", "").toUpperCase() + " FADE</p><p>" + notes[id] + "</p></div></article>";
      }).join("");
      attachPhotoFallback(heightRoot);
    }
    const taperFadeRoot = document.getElementById("taper-fade-comparison");
    if (taperFadeRoot) {
      const pairs = [
        { id: "classic-taper", label: "Classic taper", note: "Hair stays fuller across the sides; shortening gathers around the temples and neckline." },
        { id: "low-fade", label: "Low fade", note: "The shorter blend extends farther across the sides and back." }
      ];
      taperFadeRoot.innerHTML = pairs.map((pair) => {
        const pattern = patterns.find((item) => item.id === pair.id);
        return '<article class="taper-fade-card"><div class="taper-fade-art">' + renderComparisonPhoto(pattern, "side") + '</div><div><h3>' + pair.label + '</h3><p>' + pair.note + "</p></div></article>";
      }).join("");
      attachPhotoFallback(taperFadeRoot);
    }
    const mapStage = document.getElementById("beginner-map-stage");
    const lowFade = patterns.find((item) => item.id === "low-fade");
    if (mapStage && lowFade) {
      mapStage.innerHTML = photoMarkup(lowFade, "side", { overlay: "pattern", compact: true });
      attachPhotoFallback(mapStage);
    }
  }

  groupRoot?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-open-pattern]");
    if (button) selectPattern(button.dataset.openPattern, { scroll: true });
  });
  walkthroughGrid?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-open-cut]");
    if (button) launchCutWalkthrough(button.dataset.openCut, 0, { scroll: true });
  });
  document.getElementById("open-full-cut")?.addEventListener("click", () => {
    if (currentPattern) launchCutWalkthrough(currentPattern.id, 0, { scroll: true });
  });
  document.getElementById("close-full-cut")?.addEventListener("click", closeCutWalkthrough);
  document.getElementById("cut-step-previous")?.addEventListener("click", () => moveCutStep(currentCutStep - 1));
  document.getElementById("cut-step-next")?.addEventListener("click", () => moveCutStep(currentCutStep + 1));
  document.getElementById("cut-step-rail")?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-cut-step]");
    if (button) moveCutStep(Number(button.dataset.cutStep));
  });
  document.getElementById("cut-complete-toggle")?.addEventListener("change", (event) => {
    if (!currentWalkthrough) return;
    const input = event.currentTarget;
    if (!saveWalkthroughCompletion(currentWalkthrough.id, input.checked)) {
      input.checked = !input.checked;
      const status = document.getElementById("cut-completion-status");
      if (status) status.textContent = "Could not save yet. Try again when browser storage is available.";
      return;
    }
    renderCutStep();
  });
  document.getElementById("cut-process-overview")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-process-step]");
    if (button) moveCutStep(Number(button.dataset.processStep));
  });
  document.getElementById("cut-step-visual")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-final-view]");
    if (!button || !currentWalkthrough) return;
    currentFinalView = button.dataset.finalView;
    renderCutStep();
    document.querySelector('[data-final-view="' + currentFinalView + '"]')?.focus({ preventScroll: true });
  });
  document.getElementById("pattern-previous")?.addEventListener("click", () => showSlide(currentSlide - 1));
  document.getElementById("pattern-next")?.addEventListener("click", () => showSlide(currentSlide + 1));
  document.getElementById("close-pattern-lesson")?.addEventListener("click", closeLesson);
  document.querySelectorAll("[data-photo-view]").forEach((button) => button.addEventListener("click", () => changePhotoView(button.dataset.photoView)));
  document.getElementById("pattern-slide-steps")?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("[data-slide-index]");
    if (button) showSlide(Number(button.dataset.slideIndex));
  });
  document.addEventListener("keydown", (event) => {
    if (walkthroughPlayer && !walkthroughPlayer.hidden && !event.altKey && !event.ctrlKey && !event.metaKey) {
      if (event.target instanceof HTMLElement && (event.target.matches("input, textarea, select") || event.target.isContentEditable)) return;
      if (event.key === "ArrowLeft" && currentCutStep > 0) {
        event.preventDefault();
        moveCutStep(currentCutStep - 1);
      } else if (event.key === "ArrowRight" && currentWalkthrough && currentCutStep < currentWalkthrough.steps.length - 1) {
        event.preventDefault();
        moveCutStep(currentCutStep + 1);
      }
      return;
    }
    if (!viewer || viewer.hidden || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target instanceof HTMLElement && (event.target.matches("input, textarea, select") || event.target.isContentEditable)) return;
    if (event.key === "ArrowLeft" && currentSlide > 0) {
      event.preventDefault();
      showSlide(currentSlide - 1);
    } else if (event.key === "ArrowRight" && currentSlide < slideNames.length - 1) {
      event.preventDefault();
      showSlide(currentSlide + 1);
    }
  });
  let touchStart = null;
  artStage?.addEventListener("touchstart", (event) => {
    if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  artStage?.addEventListener("touchend", (event) => {
    if (!touchStart || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.25) showSlide(currentSlide + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });
  const cutStage = document.getElementById("cut-step-visual");
  let cutTouchStart = null;
  cutStage?.addEventListener("touchstart", (event) => {
    if (event.touches.length === 1) cutTouchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  cutStage?.addEventListener("touchend", (event) => {
    if (!cutTouchStart || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - cutTouchStart.x;
    const dy = event.changedTouches[0].clientY - cutTouchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.2) moveCutStep(currentCutStep + (dx < 0 ? 1 : -1));
    cutTouchStart = null;
  }, { passive: true });
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    understood = readUnderstood();
    completedWalkthroughs = readCompletedWalkthroughs();
    renderCards();
    updateProgress();
    if (currentPattern && currentSlide === slideNames.length - 1) showSlide(currentSlide);
    if (currentWalkthrough) renderCutStep();
    renderAdditionalWalkthroughs();
  });
  renderCards();
  renderAdditionalWalkthroughs();
  renderReferences();
  updateProgress();
  const requestedPattern = new URLSearchParams(window.location.search).get("pattern");
  const requestParams = new URLSearchParams(window.location.search);
  const requestedCut = requestParams.get("walkthrough");
  if (validIds.has(requestedPattern)) selectPattern(requestedPattern, { updateUrl: false, scroll: !requestedCut });
  const requestedStep = Number(requestParams.get("step")) - 1;
  if (walkthroughs.some((cut) => cut.id === requestedCut)) launchCutWalkthrough(requestedCut, Number.isFinite(requestedStep) ? requestedStep : 0, { updateUrl: false, scroll: true });
})();
