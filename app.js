(() => {
  "use strict";

  const STORAGE_KEY = "the-craft-progress-v2";
  const lessons = Array.isArray(window.THE_CRAFT_LESSONS) ? window.THE_CRAFT_LESSONS : [];
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  const patterns = Array.isArray(window.THE_CRAFT_PATTERNS) ? window.THE_CRAFT_PATTERNS : [];
  const patternIds = new Set(patterns.map((pattern) => pattern.id));
  const walkthroughs = Array.isArray(window.THE_CRAFT_WALKTHROUGHS) ? window.THE_CRAFT_WALKTHROUGHS : [];
  const walkthroughIds = new Set(walkthroughs.map((cut) => cut.id));
  const dayPlan = [
    { title: "Set up and clean", goal: "Know where your tools belong.", task: "Lay out your clipper, guards, comb, shears, and a clean cape. Read the care notes for your tools and disinfectant.", focus: "Separate clean items from used items. Learn the full disinfectant contact time.", time: "10 min" },
    { title: "Practice the consultation", goal: "Agree on a clear, realistic cut.", task: "Role-play a consultation. Ask what should stay, how the person styles their hair, and how often they want a trim.", focus: "Repeat the length and outline plan in plain language before you start.", time: "10 min" },
    { title: "Map the head", goal: "Find three landmarks.", task: "On a mannequin or willing practice partner, find the temple corners, parietal ridge, and occipital bone. Ask before touching.", focus: "Follow the curve of the head rather than making a flat line.", time: "15 min" },
    { title: "Section the hair", goal: "Make clean, repeatable sections.", task: "Comb the hair in its natural direction. Make a horseshoe parting around the top and clip the top away.", focus: "Keep sections similar in size and do not pull the hair painfully tight.", time: "15 min" },
    { title: "Learn your clipper", goal: "Feel the tool without rushing.", task: "With a guard attached, practice even clipper passes on a mannequin or swatch. Compare the lever positions on the same area.", focus: "Light pressure, a relaxed wrist, and a small scooping motion.", time: "15 min" },
    { title: "Compare guard lengths", goal: "See what your own guards leave.", task: "Use a training swatch or mannequin. Record which guard and lever position you used, then compare the result.", focus: "Guard numbers vary by system. Start longer; do not guess on a person.", time: "15 min" },
    { title: "Rest and review", goal: "Let the movement settle.", task: "Take a rest from cutting. Look over your notes and name one movement that feels more controlled than it did on day 1.", focus: "Rest is part of learning. Do not rush into a harder style.", time: "10 min" },
    { title: "Mark fade bands", goal: "Understand fade height and spacing.", task: "On a mannequin, use a washable pencil to mark a low first guide and two slightly higher bands. Do not cut yet.", focus: "Keep the first guide low and the bands narrow and even.", time: "15 min" },
    { title: "Practice the fade strokes", goal: "Make light, repeatable passes.", task: "With guards attached, practice each marked band separately. Change one setting at a time and brush loose hair away.", focus: "Flick out as the head curves. Do not use pressure to erase a line.", time: "20 min" },
    { title: "Connect two bands", goal: "Blend without raising the shape.", task: "On the mannequin, soften the edge between two neighboring bands with a practiced guard or lever position. Stop and reassess if the blend creeps higher.", focus: "Check your setting first. Use the blade corner with a light hand.", time: "20 min" },
    { title: "Practice a scissor guide", goal: "Keep a steady section and guide.", task: "Away from a person, practice your shear grip. On a mannequin, take small, even sections and trim a conservative guide.", focus: "Keep fingers clear of the blade. Account for curl and spring-back.", time: "15 min" },
    { title: "Check the finish", goal: "Notice balance from every side.", task: "Use a hand mirror to inspect the mannequin from front, both sides, and back. Point out the areas you would check before detailing.", focus: "Ask before defining a real person's neckline or edges.", time: "15 min" },
    { title: "Repeat your hardest drill", goal: "Improve one specific movement.", task: "Choose the note from your last practice and repeat only that drill. Keep the setup and tools the same so you can compare.", focus: "Choose control and clean sections over speed.", time: "20 min" },
    { title: "Review and plan the next cut", goal: "Turn practice into a useful next step.", task: "Write one thing that went well, one thing to improve, and one drill for next time. Save photos only with permission.", focus: "Repeat the basics before attempting razor work, designs, or complex blends.", time: "15 min" }
  ];
  const headShapes = [
    { id: "oval", name: "Oval", image: "assets/head-shapes/oval.webp", cue: "The outline often looks gently rounded, with the forehead and jaw in a fairly balanced proportion.", consider: "Notice how the blend travels over the parietal ridge and how much length remains above it. The label is a visual prompt, not a prescription." },
    { id: "round", name: "Round", image: "assets/head-shapes/round.webp", cue: "The outline can look softer through the sides, with a rounded crown and jawline.", consider: "Watch for the point where the head curves outward. A clipper pass that ignores this curve can leave a visible shelf." },
    { id: "square", name: "Square", image: "assets/head-shapes/square.webp", cue: "The temples, sides, or jaw may read as more angular or broad in profile.", consider: "Follow the actual skull curve instead of drawing a straight guide from the label. Check the temple and occipital area." },
    { id: "oblong", name: "Oblong / long", image: "assets/head-shapes/oblong.webp", cue: "The visible profile may appear longer from the top of the head toward the chin.", consider: "Observe how the top length and side transition balance each other in the requested cut; do not assume one fixed proportion." },
    { id: "diamond", name: "Diamond", image: "assets/head-shapes/diamond.webp", cue: "The outline may look fuller around the cheek or parietal area and narrower near the forehead or jaw.", consider: "Track where the skull is widest before you set a blend. Check both sides and the back because widths can vary." },
    { id: "heart", name: "Heart", image: "assets/head-shapes/heart.webp", cue: "The forehead or temple region may appear broader than the lower face in this example.", consider: "Pay attention to the temple corners and the way the chosen outline sits around them. Confirm the requested style with the client." },
    { id: "triangle", name: "Triangle", image: "assets/head-shapes/triangle.webp", cue: "The lower side or jaw area may appear broader than the temple area in this example.", consider: "Notice changes in width from the temple to the nape and adjust your visual balance to the real head, hair, and request." }
  ];
  const practiceHeadChecks = {
    1: { shape: "oval", hair: "Dense curls · photographic example", area: "Temple, nape, and clean tool station", pattern: "classic-taper", image: "assets/practice/station.webp", alt: "Clean barber station with clipper, guards, comb, shears, cape, and disinfectant arranged for a beginner setup drill.", caption: "Setup study · organize tools before practice.", visual: "Study the low-fade reference portrait for the profile shape; use the station image for today's setup task.", look: ["Notice the crown and side profile before planning a cut.", "Locate the temple and nape without changing the requested outline.", "Keep clean tools and used tools separate."], goal: "Name one head landmark, then set up and sanitize your practice area.", mistake: "Starting with the clipper before the station is clean or the plan is agreed." },
    2: { shape: "round", hair: "Dense curls · note curl direction and growth", area: "Temple corners, sideburns, and neckline", pattern: "low-fade", image: "assets/barber-head-shape.jpg", alt: "Barber consulting and studying the side profile and natural growth before a haircut.", caption: "Consultation study · agree on the outline and the amount to remove.", visual: "The portrait is one low-fade example. Ask what the person wants to keep and how they style it.", look: ["Find the widest curve instead of assuming a round label predicts the cut.", "Ask what should stay around the sideburn and neckline.", "Repeat the plan and length in plain language."], goal: "Confirm the intended side length, outline, and transition before touching tools.", mistake: "Treating a profile label as a haircut recommendation instead of listening to the person." },
    3: { shape: "square", hair: "Dense curls · check visible density and spring", area: "Temple, parietal ridge, and occipital bone", pattern: "low-fade", image: "assets/barber-head-shape.jpg", alt: "Barber's hand follows the head curve while locating landmarks before cutting.", caption: "Landmark study · feel only with permission; read the profile visually first.", visual: "Use the low-fade portrait to find where the skull changes direction before mapping a guide.", look: ["Temple: the side meets the forehead.", "Parietal ridge: the head starts curving toward the top.", "Occipital bone: the back of the skull projects before the nape."], goal: "Point out three landmarks and trace the head curve without making a flat guide.", mistake: "Setting a level line that cuts across a change in skull shape." },
    4: { shape: "oblong", hair: "Dense curls · observe natural fall before sectioning", area: "Top-to-side parting above the parietal ridge", pattern: "crew-cut", image: "assets/practice/sectioning.webp", alt: "Barber creates a clean horseshoe section with a comb, clipping longer top hair away from the sides.", caption: "Sectioning study · make the top and side panels easy to see.", visual: "The reference low fade shows one profile; section the mannequin according to its own growth and requested top length.", look: ["Follow the parietal curve rather than a ruler-straight part.", "Keep sections consistent in width.", "Observe the longer top separately from the shorter side."], goal: "Create a clean horseshoe section and keep the top secured without pulling.", mistake: "Making the part too low, uneven, or tight enough to tug the hair." },
    5: { shape: "diamond", hair: "Dense curls · note how texture hides or reveals a line", area: "Lower side and around the ear", pattern: "low-fade", image: "assets/barber-low-fade.jpg", alt: "Barber uses a guarded clipper with a light flicking motion at the lower side of a low fade.", caption: "Clipper control study · observe hand angle and light pressure.", visual: "Compare the short area with the fuller hair above; hair texture affects how clearly a guide appears.", look: ["Let the head curve guide the clipper path.", "Keep the guard attached for this practice.", "Lift the clipper away at the end of each pass."], goal: "Repeat slow, guarded passes on a mannequin or training swatch with a relaxed wrist.", mistake: "Pressing harder or repeatedly digging into a visible line." },
    6: { shape: "heart", hair: "Training swatch · compare your own texture", area: "One small side panel, away from the top", pattern: "buzz-cut", image: "assets/practice/guard-lengths.webp", alt: "Cleanly arranged numbered clipper guards step from short to longer lengths on a barber station.", caption: "Guard study · compare the result on your own system.", visual: "A one-length buzz cut is a useful guard comparison example; guard numbers are approximate and vary by clipper system.", look: ["Read the guard label before attaching it.", "Record the guard and lever position used.", "Compare short and long results on the same swatch."], goal: "Test one conservative guard setting and note the result instead of guessing on a person.", mistake: "Assuming one guard number leaves an identical length on every clipper or hair type." },
    7: { shape: "triangle", hair: "Dense curls · note density and natural growth", area: "Sideburn and neckline outline", pattern: "classic-taper", image: "assets/patterns/classic-taper-side.webp", alt: "Side view of a classic taper, with most side length preserved and a subtle shorter transition at the outline.", caption: "Classic taper reference · the change remains close to the edges.", visual: "Rest and name where this subtle taper changes length; compare it with a full-side fade before your next drill.", look: ["A taper tightens mainly around the sideburns and neckline.", "Most side hair stays fuller.", "A rest day is useful when movement needs time to settle."], goal: "Review your notes and describe one controlled movement without cutting.", mistake: "Rushing to a harder blend before the basic movement feels steady." },
    8: { shape: "triangle", hair: "Dense curls · identify the head's widest point", area: "Low guide near the ears and neckline", pattern: "low-fade", image: "assets/patterns/low-fade-side.webp", alt: "Side profile of a low fade showing a low transition around the ear and longer hair above.", caption: "Low-fade map · the shorter transition stays near the lower side.", visual: "Trace where the low band wraps around the head; the skull's shape affects the path, not the goal height.", look: ["The low transition stays by the ears and neckline.", "The blend wraps around the back.", "Fuller hair remains above the transition."], goal: "Mark three light practice bands on a mannequin before using clippers.", mistake: "Lifting the first guide as you follow a head that curves outward." },
    9: { shape: "round", hair: "Dense curls · observe direction and visible density", area: "Low band and the curve above the parietal ridge", pattern: "low-fade", image: "assets/barber-low-fade.jpg", alt: "Barber makes a light outward clipper stroke while blending a low fade around the side.", caption: "Stroke study · notice how the clipper flicks away from the head.", visual: "Read the low fade as a gradual change from shorter low sides to longer hair above.", look: ["Use light, repeatable passes.", "Flick away as the head curves outward.", "Brush loose hair away to see the transition."], goal: "Practice separate guarded passes on each marked band, then pause and inspect.", mistake: "Using pressure to erase a line and accidentally raising the blend." },
    10: { shape: "oval", hair: "Dense curls · note how the blend reads across texture", area: "Boundary between two neighboring fade bands", pattern: "mid-fade", image: "assets/patterns/mid-fade-side.webp", alt: "Side profile of a mid fade, with its gradual short-to-long transition placed around the middle of the sides.", caption: "Mid-fade reference · the transition sits higher than a low fade.", visual: "Compare the adjacent length zones while keeping the intended mid-height transition in view.", look: ["A mid fade begins around the middle of the sides.", "Work only at the boundary between neighboring zones.", "Check the opposite side before changing the shape."], goal: "Soften one neighboring band on a mannequin, then stop and compare both sides.", mistake: "Working too high and making the blend broader than the plan." },
    11: { shape: "oblong", hair: "Mannequin hair · note curl and spring-back", area: "Top sections held at a steady guide", pattern: "crew-cut", image: "assets/practice/shear-guide.webp", alt: "Barber demonstrates careful scissor-over-comb technique on mannequin hair, with the comb protecting the working area.", caption: "Shear guide study · keep fingers clear and remove small amounts.", visual: "The short-top example has a controlled transition at the side; today's drill is about a safe, even scissor guide.", look: ["Take similar-size sections.", "Account for curl and spring-back after release.", "Keep fingers clear and use a conservative guide."], goal: "Rehearse grip, then trim small mannequin sections to one clear guide.", mistake: "Taking large sections or cutting before checking the natural fall." },
    12: { shape: "square", hair: "Dense curls · check edge growth and neckline pattern", area: "Sideburn, ear edge, and nape", pattern: "low-taper", image: "assets/patterns/low-taper-back.webp", alt: "Back view of a low taper showing a small, soft change near the neckline while the sides remain full.", caption: "Low-taper finish reference · only the lower outline tightens.", visual: "A finish check includes the head curve and natural hairline; ask permission before defining any edge.", look: ["Inspect front, both sides, and back.", "The low taper stays close to the neckline and sideburn.", "Respect natural growth and the agreed outline."], goal: "Use a hand mirror to list areas to check before detailing a mannequin.", mistake: "Assuming both sides or the natural hairline are perfectly symmetrical." },
    13: { shape: "diamond", hair: "Your mannequin or swatch · observe its actual texture", area: "The one movement you found hardest", pattern: "low-fade", image: "assets/patterns/low-fade-side.webp", alt: "Side view of a low fade shown as a sample reference for repeating one focused drill.", caption: "Sample low-fade frame · repeat your own selected drill and notes.", visual: "This reference gives a consistent shape to compare; choose the real tool movement you found hardest.", look: ["Keep your setup and tool settings the same.", "Practice one movement only.", "Compare control and placement, not speed."], goal: "Repeat one focused movement and write what changed from the last attempt.", mistake: "Changing multiple settings at once, making the result hard to compare." },
    14: { shape: "heart", hair: "Your next practice subject · check density, texture, and growth", area: "Consultation, head landmarks, and chosen outline", pattern: "classic-taper", image: "assets/patterns/classic-taper-front.webp", alt: "Front view of a classic taper with a natural outline and fuller hair retained on the sides.", caption: "Classic taper overview · use as a discussion example, not a universal recommendation.", visual: "Plan around bone landmarks, hair density, texture, growth direction, and the person's requested style.", look: ["Name one thing that went well.", "Pick one skill to improve next.", "Save reference photos only with permission."], goal: "Write one win, one improvement, and the next small drill to practice.", mistake: "Treating a profile shape as a rule about which styles someone should wear." }
  };
  const practiceCutSteps = {
    1: { id: "classic-taper", key: "analysis" }, 2: { id: "low-fade", key: "analysis" }, 3: { id: "low-fade", key: "analysis" }, 4: { id: "crew-cut", key: "section" },
    5: { id: "low-fade", key: "first-length" }, 6: { id: "buzz-cut", key: "first-length" }, 7: { id: "classic-taper", key: "inspection" }, 8: { id: "low-fade", key: "guide" },
    9: { id: "low-fade", key: "transition" }, 10: { id: "mid-fade", key: "blend" }, 11: { id: "scissor-cut", key: "guide" }, 12: { id: "low-taper", key: "inspection" },
    13: { id: "low-fade", key: "transition" }, 14: { id: "classic-taper", key: "complete" }
  };
  let state = readState();
  let toastTimer;

  function readState() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      const savedLessons = Array.isArray(saved.lessons) ? saved.lessons.filter((id) => lessonIds.has(id)) : [];
      const savedDays = Array.isArray(saved.days) ? saved.days.filter((day) => Number.isInteger(day) && day >= 1 && day <= 14) : [];
      const savedPatterns = Array.isArray(saved.patterns) ? saved.patterns.filter((id) => patternIds.has(id)) : [];
      const savedWalkthroughs = Array.isArray(saved.walkthroughs) ? saved.walkthroughs.filter((id) => walkthroughIds.has(id)) : [];
      return { ...saved, lessons: [...new Set(savedLessons)], days: [...new Set(savedDays)], patterns: [...new Set(savedPatterns)], walkthroughs: [...new Set(savedWalkthroughs)] };
    } catch {
      return { lessons: [], days: [], patterns: [], walkthroughs: [] };
    }
  }

  function saveState() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
      state = { ...(stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {}), ...state };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      showToast("Progress works for this visit, but this browser could not save it.");
      return false;
    }
  }

  function showToast(message) {
    let toast = document.getElementById("site-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "site-toast";
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.append(toast);
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      const replacements = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };
      return replacements[character];
    });
  }

  function listMarkup(items, className) {
    return "<ul class=\"" + className + "\">" + items.map((item) => "<li>" + escapeHTML(item) + "</li>").join("") + "</ul>";
  }

  function renderSteps(items) {
    return "<ol class=\"step-list\">" + items.map((step) => "<li><div><strong>" + escapeHTML(step[0]) + "</strong><p>" + escapeHTML(step[1]) + "</p></div></li>").join("") + "</ol>";
  }

  function sectionMarkup(number, label, heading, content) {
    return "<section class=\"lesson-section\"><header class=\"section-heading-small\"><span class=\"section-number\">" + number + "</span><div><p class=\"eyebrow\">" + label + "</p><h2>" + heading + "</h2></div></header>" + content + "</section>";
  }

  function renderFadePhoto() {
    return "<figure class=\"fade-lesson-visual\"><img class=\"fade-photo\" src=\"assets/barber-low-fade.jpg\" width=\"1536\" height=\"1024\" alt=\"Close view of a barber using a clipper to shape a low fade around the client's side and back, with the hair blending from short near the ear to longer above.\" loading=\"lazy\" decoding=\"async\"><figcaption>Study how the fade follows the head curve. Keep your pressure light and flick the clipper away as it leaves the head.</figcaption></figure>";
  }

  function renderLesson() {
    const id = new URLSearchParams(window.location.search).get("lesson");
    const lesson = lessons.find((item) => item.id === id);
    const layout = document.getElementById("lesson-layout");
    const error = document.getElementById("lesson-error");
    if (!lesson || !layout) {
      if (layout) layout.hidden = true;
      if (error) error.hidden = false;
      document.title = "Lesson not found — The Craft";
      return;
    }

    const index = lessons.indexOf(lesson);
    document.title = "Lesson " + String(index + 1).padStart(2, "0") + ": " + lesson.title + " — The Craft";
    document.getElementById("breadcrumb-current").textContent = "Lesson " + (index + 1);
    document.getElementById("lesson-eyebrow").textContent = "LESSON " + String(index + 1).padStart(2, "0") + " / " + lesson.eyebrow.toUpperCase();
    document.getElementById("lesson-title").textContent = lesson.title;
    document.getElementById("lesson-intro").textContent = lesson.intro;
    document.getElementById("lesson-duration").textContent = lesson.time;
    document.getElementById("lesson-step-count").textContent = lesson.steps.length + " STEPS";
    document.getElementById("lesson-outcomes").innerHTML = lesson.learn.map((item) => "<li>" + escapeHTML(item) + "</li>").join("");
    document.getElementById("lesson-tools").innerHTML = lesson.tools.map((item) => "<li>" + escapeHTML(item) + "</li>").join("");

    const visual = lesson.id === "fade" ? renderFadePhoto() + '<a class="learning-path-link" href="fade-training.html"><span>CONTINUE INTO COMPLETE VISUAL TRAINING</span><strong>How to Do a Fade · tools, head analysis, 30 steps and Quick Practice →</strong></a>' : "";
    const steps = "<section class=\"lesson-section\"><header class=\"section-heading-small\"><span class=\"section-number\">1</span><div><p class=\"eyebrow\">THE METHOD</p><h2>Step by step</h2></div></header>" + visual + renderSteps(lesson.steps) + "</section>";
    const review = "<div class=\"two-col-notes\"><section class=\"lesson-section\"><h2>What to look for</h2>" + listMarkup(lesson.look, "note-list") + "</section><section class=\"lesson-section\"><h2>Common mistakes</h2>" + listMarkup(lesson.mistakes, "note-list") + "</section></div>";
    const tip = "<aside class=\"tip-card\"><p class=\"eyebrow\">A USEFUL TIP</p><p>" + escapeHTML(lesson.tip) + "</p></aside>";
    const practice = "<article class=\"practice-drill\"><div><p class=\"eyebrow\">PRACTICE THIS / " + escapeHTML(lesson.time).toUpperCase() + "</p><h2>One useful repetition</h2><p>" + escapeHTML(lesson.practice) + "</p></div><span class=\"drill-mark\" aria-hidden=\"true\">↻</span></article>";
    document.getElementById("lesson-sections").innerHTML = steps + review + tip + practice;
    document.getElementById("safety-copy").textContent = lesson.safety;

    const quizOptions = lesson.question.options.map((option, optionIndex) => "<label class=\"quiz-option\"><input type=\"radio\" name=\"answer\" value=\"" + optionIndex + "\"><span>" + escapeHTML(option) + "</span></label>").join("");
    document.getElementById("quiz-question").textContent = lesson.question.prompt;
    document.getElementById("quiz-options").innerHTML = quizOptions;

    const currentIsComplete = state.lessons.includes(lesson.id);
    const completeButton = document.getElementById("complete-lesson");
    const completeCopy = document.getElementById("complete-copy");
    completeButton.disabled = currentIsComplete;
    completeButton.innerHTML = currentIsComplete ? "Lesson complete <span aria-hidden=\"true\">✓</span>" : "Mark lesson complete <span aria-hidden=\"true\">✓</span>";
    completeCopy.textContent = currentIsComplete ? "Saved on this device. Choose the next lesson below when you are ready." : "Mark it complete after you have worked through the steps and practice drill.";
    completeButton.onclick = () => {
      if (state.lessons.includes(lesson.id)) return;
      state.lessons.push(lesson.id);
      saveState();
      updateProgress();
      completeButton.disabled = true;
      completeButton.innerHTML = "Lesson complete <span aria-hidden=\"true\">✓</span>";
      completeCopy.textContent = "Saved on this device. Choose the next lesson below when you are ready.";
      showToast("Lesson " + String(index + 1).padStart(2, "0") + " complete. Your progress is saved.");
    };

    const previous = lessons[index - 1];
    const next = lessons[index + 1];
    const previousLink = document.getElementById("previous-lesson");
    const nextLink = document.getElementById("next-lesson");
    previousLink.href = previous ? "lesson.html?lesson=" + encodeURIComponent(previous.id) : "index.html#course-path";
    document.getElementById("previous-title").textContent = previous ? previous.title : "Course overview";
    nextLink.href = next ? "lesson.html?lesson=" + encodeURIComponent(next.id) : "practice.html";
    document.getElementById("next-title").textContent = next ? next.title : "Start the practice plan";
    document.querySelector(".lesson-next-prev .nav-caption")?.replaceChildren(document.createTextNode(previous ? "PREVIOUS LESSON" : "COURSE OVERVIEW"));

    const map = document.getElementById("lesson-map");
    map.innerHTML = lessons.map((item, itemIndex) => {
      const done = state.lessons.includes(item.id);
      const current = item.id === lesson.id;
      const status = done ? "Complete" : current ? "Current lesson" : "Lesson " + (itemIndex + 1);
      return "<li><a href=\"lesson.html?lesson=" + encodeURIComponent(item.id) + "\"" + (current ? " aria-current=\"step\"" : "") + (done ? " class=\"is-done\"" : "") + " aria-label=\"" + status + ": " + escapeHTML(item.title) + "\"><span class=\"map-number\" aria-hidden=\"true\">" + (done ? "✓" : String(itemIndex + 1).padStart(2, "0")) + "</span><span>" + escapeHTML(item.title) + "</span></a></li>";
    }).join("");
    updateSideProgress();

    document.getElementById("lesson-quiz").onsubmit = (event) => {
      event.preventDefault();
      const selected = new FormData(event.currentTarget).get("answer");
      const feedback = document.getElementById("quiz-feedback");
      if (selected === null) {
        feedback.textContent = "Choose an answer, then check it.";
        feedback.className = "quiz-feedback is-incorrect";
        return;
      }
      const correct = Number(selected) === lesson.question.answer;
      feedback.textContent = (correct ? "That is right. " : "Not quite. ") + lesson.question.explanation;
      feedback.className = "quiz-feedback " + (correct ? "is-correct" : "is-incorrect");
    };
  }

  function updateSideProgress() {
    const count = state.lessons.length;
    const countNode = document.getElementById("side-lesson-count");
    const fill = document.getElementById("side-progress-fill");
    const bar = fill?.closest('[role="progressbar"]');
    if (countNode) countNode.textContent = String(count);
    if (fill) fill.style.width = (count / 8 * 100) + "%";
    if (bar) bar.setAttribute("aria-valuenow", String(count));
  }

  function updateHome() {
    if (!lessons.length) return;
    const done = new Set(state.lessons);
    const completedCount = done.size;
    const next = lessons.find((lesson) => !done.has(lesson.id));
    const startButton = document.getElementById("start-button");
    const continueButton = document.getElementById("continue-button");
    const continueMessage = document.getElementById("continue-message");
    const count = document.getElementById("lesson-count");
    const percent = document.getElementById("progress-percent");
    const fill = document.getElementById("progress-fill");
    const bar = fill?.closest('[role="progressbar"]');
    const reset = document.getElementById("reset-progress");

    if (count) count.textContent = completedCount + " of 8 lessons complete";
    if (percent) percent.textContent = Math.round(completedCount / 8 * 100) + "%";
    if (fill) fill.style.width = (completedCount / 8 * 100) + "%";
    if (bar) bar.setAttribute("aria-valuenow", String(completedCount));
    if (reset) reset.hidden = completedCount === 0 && state.days.length === 0 && state.patterns.length === 0 && state.walkthroughs.length === 0;

    if (next) {
      const link = "lesson.html?lesson=" + encodeURIComponent(next.id);
      const number = lessons.indexOf(next) + 1;
      if (continueButton) {
        continueButton.href = link;
        continueButton.innerHTML = (completedCount ? "Continue lesson " : "Start lesson ") + number + " <span aria-hidden=\"true\">→</span>";
      }
      if (startButton) {
        startButton.href = link;
        startButton.innerHTML = completedCount ? "Continue learning <span aria-hidden=\"true\">→</span>" : "Start the course <span aria-hidden=\"true\">→</span>";
      }
      if (continueMessage) continueMessage.textContent = completedCount ? "Pick up with lesson " + number + ": " + next.title + "." : "Start with a clean setup, then move through one practical skill at a time.";
    } else {
      if (continueButton) {
        continueButton.href = "practice.html";
        continueButton.innerHTML = "Open the practice plan <span aria-hidden=\"true\">→</span>";
      }
      if (startButton) {
        startButton.href = "practice.html";
        startButton.innerHTML = "Keep practicing <span aria-hidden=\"true\">→</span>";
      }
      if (continueMessage) continueMessage.textContent = "You have completed all eight lessons. Build your confidence with another focused practice session.";
    }

    document.querySelectorAll("[data-course-card]").forEach((card) => {
      const id = card.dataset.courseCard;
      const status = card.querySelector("[data-lesson-status]");
      const lesson = lessons.find((item) => item.id === id);
      if (!lesson || !status) return;
      const current = next && next.id === id;
      const isDone = done.has(id);
      card.classList.toggle("is-next", Boolean(current));
      card.classList.toggle("is-complete", isDone);
      status.textContent = isDone ? "DONE" : current ? "NEXT UP" : lesson.time.replace(/\s+minutes?$/i, " min").toUpperCase();
      card.setAttribute("aria-label", "Lesson " + String(lessons.indexOf(lesson) + 1).padStart(2, "0") + (isDone ? ", complete: " : current ? ", next: " : ": ") + lesson.title);
    });
  }

  function renderPractice() {
    const weekOne = document.getElementById("week-one");
    const weekTwo = document.getElementById("week-two");
    if (!weekOne || !weekTwo) return;

    function dayCard(day, index) {
      const done = state.days.includes(day);
      const item = dayPlan[index];
      const checkData = practiceHeadChecks[day];
      const shape = headShapes.find((entry) => entry.id === checkData.shape);
      const pattern = patterns.find((entry) => entry.id === checkData.pattern);
      const patternName = pattern ? pattern.name : "Technique study";
      const placement = pattern ? pattern.starts : "Tool control and setup";
      const cutLink = practiceCutSteps[day];
      const cut = cutLink && walkthroughs.find((entry) => entry.id === cutLink.id);
      const cutStepIndex = cut ? cut.steps.findIndex((step) => step.key === cutLink.key) : -1;
      const cutStep = cut && cut.steps[cutStepIndex];
      const cutHref = cut && cutStep ? "haircut-patterns.html?walkthrough=" + encodeURIComponent(cut.id) + "&step=" + (cutStepIndex + 1) + "#cut-walkthrough" : "";
      const visual = cutStep && (cutStep.visual || window.CraftVisual.fromSheet(cut, cutStep.panel));
      const region = visual && visual.region;
      const practiceFrame = cutStep ? window.CraftVisual.frame(visual, cutStep.imageAlt, 'practice-process-frame').replace('<div ', '<div data-process-cut="' + escapeHTML(cut.id) + '" data-process-step="' + cutStepIndex + '" ').replace('<img ', '<img data-practice-image ') : '';
      const facts = "<dl class=\"practice-facts\"><div><dt>Technique</dt><dd>" + escapeHTML(item.title) + "</dd></div><div><dt>Head shape</dt><dd>" + escapeHTML(shape.name) + "</dd></div><div><dt>Hair type</dt><dd>" + escapeHTML(cut ? cut.hairType : checkData.hair) + "</dd></div><div><dt>Key area</dt><dd>" + escapeHTML(checkData.area) + "</dd></div><div class=\"practice-fact-pattern\"><dt>Pattern example</dt><dd>" + escapeHTML(cut ? cut.name + " · " + cut.zones : patternName + " · " + placement) + "</dd></div><div class=\"practice-fact-goal\"><dt>Today's goal</dt><dd>" + escapeHTML(item.goal) + "</dd></div></dl>";
      const details = "<details class=\"practice-drill-details\"><summary>Open the visual practice drill</summary><div class=\"day-detail\"><div class=\"practice-study-grid\"><figure class=\"practice-study-figure\">" + practiceFrame + "<figcaption>" + escapeHTML(cut.name + " · step " + (cutStepIndex + 1) + ": " + cutStep.title) + "</figcaption></figure><figure class=\"practice-study-figure shape-study-figure\"><img data-practice-image src=\"" + escapeHTML(shape.image) + "\" width=\"1122\" height=\"1402\" alt=\"Realistic " + escapeHTML(shape.name.toLowerCase()) + " head-profile example with a consistent low fade, shown for observing skull shape and landmarks.\" loading=\"lazy\" decoding=\"async\"><figcaption>Head-shape study · " + escapeHTML(shape.name) + " profile, shown with the same low-fade example.</figcaption></figure></div><p class=\"practice-visual-note\"><strong>Visual cue:</strong> " + escapeHTML("Study this exact process stage: " + cutStep.title + ". The second portrait is a separate head-profile comparison; observe the real subject before planning.") + "</p><div class=\"practice-two-notes\"><section><p class=\"eyebrow\">WHAT TO NOTICE</p>" + listMarkup(checkData.look, "practice-look-list") + "</section><section><p class=\"eyebrow\">HEAD SHAPE CHECK</p><p><strong>Profile cue:</strong> " + escapeHTML(shape.cue) + "</p><p><strong>How it affects this practice:</strong> " + escapeHTML(shape.consider) + "</p><p><strong>Hair to observe:</strong> " + escapeHTML(cut ? cut.hairType : checkData.hair) + ". Read the actual density, texture, and growth direction; this portrait is one consistent comparison example.</p></section></div><div class=\"practice-two-notes practice-action-notes\"><section><p class=\"eyebrow\">PRACTICE GOAL</p><p>" + escapeHTML(checkData.goal) + "</p></section><section class=\"practice-mistake\"><p class=\"eyebrow\">COMMON MISTAKE</p><p>" + escapeHTML(checkData.mistake) + "</p></section></div><div class=\"practice-task-copy\"><p><strong>Task:</strong> " + escapeHTML(item.task) + "</p><p><strong>Focus:</strong> " + escapeHTML(item.focus) + "</p>" + (cutStep ? "<a class=\"practice-cut-link\" href=\"" + escapeHTML(cutHref) + "\"><span>FULL HAIRCUT WALKTHROUGH</span><strong>" + escapeHTML(cut.name) + " · step " + String(cutStepIndex + 1).padStart(2, "0") + ": " + escapeHTML(cutStep.title) + "</strong><span aria-hidden=\"true\">Open this visual step →</span></a>" : "") + "</div></div></details>";
      const check = "<label class=\"day-check\"><input type=\"checkbox\" data-practice-day=\"" + day + "\"" + (done ? " checked" : "") + "><span>" + (done ? "Day complete" : "Mark day complete") + "</span></label>";
      return "<article class=\"day-card" + (done ? " is-done" : "") + "\" data-day-card=\"" + day + "\"><div class=\"day-card-top\"><span>DAY " + String(day).padStart(2, "0") + " · " + escapeHTML(shape.name.toUpperCase()) + " PROFILE</span><span class=\"day-duration\">" + escapeHTML(item.time) + "</span></div><h3>" + escapeHTML(item.title) + "</h3>" + facts + details + check + "</article>";
    }

    weekOne.innerHTML = dayPlan.slice(0, 7).map((item, index) => dayCard(index + 1, index)).join("");
    weekTwo.innerHTML = dayPlan.slice(7).map((item, index) => dayCard(index + 8, index + 7)).join("");
    renderHeadShapeExplorer();
    document.querySelectorAll("[data-practice-image]").forEach(bindPracticeImageFallback);

    document.querySelectorAll("[data-practice-day]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const day = Number(checkbox.dataset.practiceDay);
        if (checkbox.checked && !state.days.includes(day)) state.days.push(day);
        if (!checkbox.checked) state.days = state.days.filter((item) => item !== day);
        saveState();
        updatePractice();
        updateHome();
        const card = checkbox.closest(".day-card");
        if (card) card.classList.toggle("is-done", checkbox.checked);
        const text = checkbox.parentElement.querySelector("span");
        if (text) text.textContent = checkbox.checked ? "Day complete" : "Mark day complete";
      });
    });

    setupWeekTabs();
    const resetButton = document.getElementById("reset-practice");
    if (resetButton) resetButton.onclick = () => {
      if (!window.confirm("Reset all 14 practice checkmarks?")) return;
      state.days = [];
      saveState();
      renderPractice();
      updatePractice();
      updateHome();
      showToast("Practice checkmarks have been reset.");
    };
    updatePractice();
  }

  function renderHeadShapeExplorer() {
    const root = document.getElementById("head-shape-explorer");
    if (!root) return;
    root.innerHTML = "<details class=\"shape-explorer\"><summary><span><span class=\"eyebrow\">OBSERVE, THEN PLAN</span><strong>Head Shape Explorer</strong><small>Compare seven profile cues and find the practice drills that use each one.</small></span><span class=\"shape-explorer-toggle\" aria-hidden=\"true\">+</span></summary><div class=\"shape-explorer-body\"><p class=\"shape-guidance\">These are visual tendencies, not strict categories or haircut rules. A real head can combine traits. Always consider bone landmarks, actual density and texture, growth direction or cowlicks, and the style the person asked for. The portraits use the same low-fade example so you can compare head profiles without changing the haircut.</p><div class=\"shape-selector\" role=\"group\" aria-label=\"Choose a head profile example\">" + headShapes.map((shape) => "<button class=\"shape-choice\" type=\"button\" data-shape-choice=\"" + escapeHTML(shape.id) + "\" aria-pressed=\"false\"><img src=\"" + escapeHTML(shape.image) + "\" width=\"1122\" height=\"1402\" alt=\"\" loading=\"lazy\" decoding=\"async\"><span>" + escapeHTML(shape.name) + "</span></button>").join("") + "</div><div id=\"shape-selected-result\" class=\"shape-selected-result\" aria-live=\"polite\"></div><section class=\"shape-compare\" aria-labelledby=\"shape-compare-heading\"><div><p class=\"eyebrow\">SAME CUT, DIFFERENT PROFILE</p><h3 id=\"shape-compare-heading\">One low fade, three head shapes</h3><p>Notice how the same low transition follows a different skull curve. The style stays the same; the head profile changes.</p></div><div class=\"shape-compare-grid\">" + ["round", "square", "oblong"].map((id) => { const shape = headShapes.find((entry) => entry.id === id); return "<figure><img src=\"" + escapeHTML(shape.image) + "\" width=\"1122\" height=\"1402\" alt=\"" + escapeHTML(shape.name) + " profile wearing the same low-fade reference cut.\" loading=\"lazy\" decoding=\"async\"><figcaption>" + escapeHTML(shape.name) + " · same low fade</figcaption></figure>"; }).join("") + "</div></section><section class=\"landmark-guide\" aria-labelledby=\"landmark-heading\"><div><p class=\"eyebrow\">A QUICK HEAD MAP</p><h3 id=\"landmark-heading\">Landmarks to notice</h3></div><dl><div><dt>Temple</dt><dd>Where the side meets the forehead.</dd></div><div><dt>Parietal ridge</dt><dd>The curve where the side starts turning toward the top.</dd></div><div><dt>Occipital bone</dt><dd>The projection at the back of the skull above the nape.</dd></div><div><dt>Apex and crown</dt><dd>The highest area and the crown's natural growth pattern.</dd></div><div><dt>Sideburn and neckline</dt><dd>Edges that follow the person's natural growth and agreed outline.</dd></div></dl></section></div></details>";
    root.querySelectorAll("img").forEach(bindPracticeImageFallback);
    const factorGuide = document.createElement("section");
    factorGuide.className = "shape-factor-guide";
    factorGuide.setAttribute("aria-labelledby", "shape-factor-heading");
    factorGuide.innerHTML = "<div class=\"shape-factor-intro\"><p class=\"eyebrow\">PLAN THE WHOLE CUT</p><h3 id=\"shape-factor-heading\">A profile is one clue</h3></div><ul>" + [
      ["Head shape", "Read the overall profile."],
      ["Bone landmarks", "Find temples, ridge, and occipital area."],
      ["Density", "Notice how much hair fills each zone."],
      ["Texture", "Watch curl, wave, straightness, and spring."],
      ["Growth", "Check crown direction and cowlicks."],
      ["Requested cut", "Agree on length and outline first."]
    ].map((factor) => "<li><strong>" + escapeHTML(factor[0]) + "</strong><span>" + escapeHTML(factor[1]) + "</span></li>").join("") + "</ul>";
    root.querySelector(".shape-selector")?.before(factorGuide);
    const explorer = root.querySelector(".shape-explorer");
    explorer?.addEventListener("toggle", () => {
      if (explorer.open) root.querySelectorAll(".shape-choice img").forEach((image) => { image.loading = "eager"; });
    });
    renderShapeExplorerResult("oval");
    root.querySelectorAll("[data-shape-choice]").forEach((button) => {
      button.addEventListener("click", () => renderShapeExplorerResult(button.dataset.shapeChoice));
    });
    root.querySelectorAll("[data-open-practice]").forEach((button) => {
      button.addEventListener("click", () => openPracticeDay(Number(button.dataset.openPractice)));
    });
  }

  function renderShapeExplorerResult(shapeId) {
    const root = document.getElementById("head-shape-explorer");
    const result = document.getElementById("shape-selected-result");
    const shape = headShapes.find((entry) => entry.id === shapeId) || headShapes[0];
    if (!root || !result) return;
    root.querySelectorAll("[data-shape-choice]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.shapeChoice === shape.id)));
    const days = Object.keys(practiceHeadChecks).map(Number).filter((day) => practiceHeadChecks[day].shape === shape.id);
    result.innerHTML = "<article class=\"shape-result-card\"><figure><img src=\"" + escapeHTML(shape.image) + "\" width=\"1122\" height=\"1402\" alt=\"Realistic " + escapeHTML(shape.name.toLowerCase()) + " side-profile example with a low fade and visible temple, ear, side, crown, and neckline.\" loading=\"lazy\" decoding=\"async\"><figcaption>Profile reference · same low-fade example</figcaption></figure><div class=\"shape-result-copy\"><p class=\"eyebrow\">PROFILE STUDY</p><h3>" + escapeHTML(shape.name) + " profile</h3><p>" + escapeHTML(shape.cue) + "</p><p>" + escapeHTML(shape.consider) + "</p><h4>Practice with this profile cue</h4><div class=\"shape-practice-links\">" + days.map((day) => "<button type=\"button\" data-open-practice=\"" + day + "\"><span>DAY " + String(day).padStart(2, "0") + "</span>" + escapeHTML(dayPlan[day - 1].title) + " <span aria-hidden=\"true\">→</span></button>").join("") + "</div><p class=\"shape-photo-note\">The hair in these study photos is one consistent curl-and-low-fade example. Check the actual person's hair and request during practice.</p></div></article>";
    result.querySelectorAll("img").forEach(bindPracticeImageFallback);
    result.querySelectorAll("[data-open-practice]").forEach((button) => button.addEventListener("click", () => openPracticeDay(Number(button.dataset.openPractice))));
  }

  function bindPracticeImageFallback(image) {
    image.onerror = () => {
      const fallback = document.createElement("div");
      fallback.className = "practice-image-fallback";
      fallback.setAttribute("role", "img");
      fallback.setAttribute("aria-label", "Practice reference image unavailable. Use the written visual cue and landmark notes.");
      fallback.textContent = "Reference image unavailable · use the study notes below";
      image.replaceWith(fallback);
    };
  }

  function openPracticeDay(day) {
    const tab = document.getElementById(day <= 7 ? "week-tab-one" : "week-tab-two");
    if (tab) {
      tab.click();
      const card = document.querySelector("[data-day-card='" + day + "']");
      const details = card?.querySelector(".practice-drill-details");
      if (details) details.open = true;
      card?.scrollIntoView({ behavior: "smooth", block: "center" });
      details?.querySelector("summary")?.focus({ preventScroll: true });
    }
  }

  function setupWeekTabs() {
    const tabs = [...document.querySelectorAll(".week-tab")];
    if (!tabs.length) return;
    const activate = (selectedTab, focusTab) => {
      tabs.forEach((tab) => {
        const isSelected = tab === selectedTab;
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute("aria-controls"));
        if (panel) panel.hidden = !isSelected;
      });
      if (focusTab) selectedTab.focus();
    };
    tabs.forEach((tab, index) => {
      tab.onclick = () => activate(tab, false);
      tab.onkeydown = (event) => {
        let targetIndex = index;
        if (event.key === "ArrowRight") targetIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") targetIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") targetIndex = 0;
        else if (event.key === "End") targetIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        activate(tabs[targetIndex], true);
      };
    });
  }

  function updatePractice() {
    const count = state.days.length;
    const counter = document.getElementById("practice-count");
    const fill = document.getElementById("practice-progress-fill");
    const bar = fill?.closest('[role="progressbar"]');
    const reset = document.getElementById("reset-practice");
    const encouragement = document.getElementById("practice-encouragement");
    if (counter) counter.textContent = count + " of 14";
    if (fill) fill.style.width = (count / 14 * 100) + "%";
    if (bar) bar.setAttribute("aria-valuenow", String(count));
    if (reset) reset.hidden = count === 0;
    if (encouragement) encouragement.textContent = count === 14 ? "All days complete. Keep the fundamentals in your regular practice." : count === 0 ? "Start with a clean setup. Come back tomorrow and pick up where you left off." : "Good practice builds one skill at a time. Your next unchecked day is ready when you are.";
    const firstWeek = state.days.filter((day) => day <= 7).length;
    const secondWeek = state.days.filter((day) => day > 7).length;
    const firstCount = document.getElementById("week-one-count");
    const secondCount = document.getElementById("week-two-count");
    if (firstCount) firstCount.textContent = firstWeek + " / 7 complete";
    if (secondCount) secondCount.textContent = secondWeek + " / 7 complete";
    document.querySelectorAll(".week-tab[role=tab]").forEach((tab) => {
      const week = tab.id === "week-tab-one" ? 1 : 2;
      const count = week === 1 ? firstWeek : secondWeek;
      tab.setAttribute("aria-label", "Week " + week + ", " + count + " of 7 practice days complete");
    });
  }

  function initializeReferenceSearch() {
    const input = document.getElementById("reference-search");
    if (!input) return;
    const cards = [...document.querySelectorAll("[data-reference-card]")];
    const clear = document.getElementById("clear-search");
    const status = document.getElementById("search-status");
    const noResults = document.getElementById("no-results");
    function filter() {
      const query = input.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const matches = (card.dataset.search + " " + card.textContent).toLowerCase().includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      if (status) status.textContent = query ? visible + " of " + cards.length + " guides" : cards.length + " quick guides";
      if (noResults) noResults.hidden = visible !== 0;
      if (clear) clear.hidden = query.length === 0;
    }
    input.addEventListener("input", filter);
    clear?.addEventListener("click", () => {
      input.value = "";
      filter();
      input.focus();
    });
  }

  function initializeReset() {
    const reset = document.getElementById("reset-progress");
    reset?.addEventListener("click", () => {
      if (!window.confirm("Reset course lessons, practice days, pattern checks, and completed full-cut lessons saved on this device?")) return;
      state = { lessons: [], days: [], patterns: [], walkthroughs: [] };
      saveState();
      updateProgress();
      showToast("Course, practice, and pattern progress has been reset.");
    });
  }

  function updateProgress() {
    updateHome();
    updateSideProgress();
    updatePractice();
  }

  function initializeMenu() {
    const button = document.querySelector(".menu-button");
    const header = document.querySelector(".site-header");
    const nav = document.getElementById("primary-nav");
    if (!button || !header || !nav) return;
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      header.classList.toggle("nav-open", open);
    });
    nav.addEventListener("click", (event) => {
      if (!(event.target instanceof Element) || !event.target.closest("a")) return;
      button.setAttribute("aria-expanded", "false");
      header.classList.remove("nav-open");
    });
  }

  function refreshPage() {
    updateProgress();
    if (document.body.dataset.page === "lesson") renderLesson();
  }

  initializeMenu();
  initializeReset();
  if (document.body.dataset.page === "home") updateHome();
  if (document.body.dataset.page === "lesson") renderLesson();
  if (document.body.dataset.page === "practice") renderPractice();
  if (document.body.dataset.page === "reference") initializeReferenceSearch();

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    state = readState();
    refreshPage();
  });
})();
