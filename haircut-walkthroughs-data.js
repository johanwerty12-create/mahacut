(() => {
  "use strict";

  const baseStages = [
    { stage: "BEFORE + PLAN", title: "Prepare the station and agree the shape", action: ["Set a clean station, cape, mirror, and tools before starting.", "Confirm the top length, side shape, outline, and amount to remove in plain language."], focus: "The reference is a conversation starter. Confirm the result with the person before touching their hair.", practice: "Say the plan back in one sentence before picking up a tool." },
    { stage: "HEAD + HAIR", title: "Read the head, hair, and natural growth", action: ["Assess texture, density, curl pattern, growth direction, cowlicks, and current length in good light.", "Locate the temples, parietal ridge, crown, occipital area, and neckline; note how the skull curves."], focus: "A head-shape label never prescribes a cut. Work with this person's growth, head, and request.", practice: "On a mannequin, point to each landmark and trace the planned silhouette without cutting." },
    { stage: "SECTION + PROTECT", title: "Section the hair you plan to keep", action: ["Comb the hair in its natural fall, then secure only the sections that must stay out of the tool path.", "Keep the partings clean and comfortable; do not pull hair tightly."], focus: "Protecting longer hair makes the working area easier to see and prevents accidental removal.", practice: "Rehearse the section and clip placement on a mannequin before switching on the clipper." },
    { stage: "START LENGTH", title: "Choose a conservative starting length", action: ["Begin longer than the target and test the chosen setting on a mannequin or swatch.", "Brush the area clean and check the result before shortening any more."], focus: "Guard numbers vary between tool systems. Record the actual guard and lever position you tested.", practice: "Write down the starting setting and compare its result with the agreed plan." },
    { stage: "BASE SHAPE", title: "Establish the first controlled shape", action: ["Keep the first work area small and follow the head's curve rather than a flat line.", "Brush loose hair away and check the shape from the side and back before repeating a pass."], focus: "A small, controlled starting shape is easier to adjust than a broad section cut too short.", practice: "Mark the planned area on a mannequin and rehearse one light pass without widening it." },
    { stage: "MAP THE GUIDE", title: "Map the guide for this haircut", action: ["Mark the intended boundary lightly; shape it to the skull and agreed result.", "Check both sides and the back before cutting to the guide."], focus: "A guide is a visual reference, not a fixed measurement. Use the real head and requested shape.", practice: "Trace the guide with a comb or washable pencil before using a cutting tool." },
    { stage: "TOOL + SETTING", title: "Check the tool and its setting", action: ["Seat the guard securely and check the clipper maker's range and lever positions.", "Change one setting at a time and keep a note of what you used."], focus: "Start with a setting you have tested. Do not assume another clipper leaves the same length.", practice: "Name the tool, guard, and lever position before making each practice pass." },
    { stage: "CONTROLLED CUT", title: "Use a light, controlled cutting motion", action: ["Keep a relaxed grip and steady wrist; work in small, repeatable sections.", "Use light pressure and a practiced outward motion; keep guards attached during this drill."], focus: "Follow the head surface and hair growth. Reposition instead of pressing harder to chase a line.", practice: "Repeat one slow pass on a mannequin, then stop and inspect before continuing." },
    { stage: "REFINE + BLEND", title: "Refine the transition without moving it", action: ["Work only at the boundary between neighboring lengths; adjust one lever or guard step at a time.", "Brush the hair away, step back, and inspect before another light pass."], focus: "A fade transitions across the side and back; a taper stays near the edges. Some cuts need no blend.", practice: "Rehearse one boundary at a time. Stop if the transition grows higher or wider than planned." },
    { stage: "TOP + CONNECT", title: "Shape and connect the top", action: ["Use small comb, clipper, or scissor sections only where the plan calls for them.", "Keep a clear guide, remove a little first, and cross-check the natural fall."], focus: "The top and sides should meet the chosen silhouette; do not remove top length by assumption.", practice: "Practice the comb or scissor movement on a mannequin with shears closed while repositioning." },
    { stage: "DETAIL + OUTLINE", title: "Check temples, ears, and neckline", action: ["Compare the temples, sideburns, around-ear area, and neckline with the agreed outline.", "Keep the ear protected and the tool in a clear, controlled path; ask before sharpening edges."], focus: "A sharp line-up is optional. Preserve the natural outline unless the person asks for a sharper finish.", practice: "On a mannequin, identify each edge and rehearse the safest hand and tool position." },
    { stage: "FINAL + AFTER", title: "Inspect the finish from every side", action: ["Brush away loose hair and check the front, both profiles, and back in even light.", "Ask the person to review comfort and shape; clean and disinfect tools after the service."], focus: "Compare with the agreed plan, not a different head or an idealized photo.", practice: "Name one thing that matches the plan and one controlled drill to repeat next time." }
  ];

  const stageOverrides = {
    fade: {
      5: { stage: "MAP FADE GUIDE", title: "Map the fade height and curve", action: ["Place the low, mid, high, or dropped guide where agreed; keep the line narrow.", "View it from the side and back so it follows the skull instead of a ruler."] },
      6: { title: "Select tested guards for each band", action: ["Choose a longer guard above the shortest zone and confirm it against your clipper chart.", "Attach the guard firmly and test the lever before approaching the head."] },
      7: { title: "Build the first fade bands", action: ["Work below the planned guide in short sections with the guard attached.", "Flick away at the end of each pass and brush loose hair away between bands."] },
      8: { title: "Use the lever to soften one line", action: ["Move the lever one small step at a time and work at the edge of the visible line.", "Use a practiced blade corner lightly, then brush and reassess before another pass."] },
      9: { title: "Keep the longer top connected", action: ["Comb the top in its natural fall and take only the agreed amount with shears.", "Soften the upper connection without raising the fade into the top."] }
    },
    taper: {
      4: { stage: "PRESERVE SIDE FULLNESS", title: "Keep the side full above the edge", action: ["Use a longer tested setting through any agreed side clean-up.", "Keep the shortest area at the temple, sideburn, and neckline only."] },
      5: { stage: "MAP EDGE GUIDE", title: "Map a small temple and nape guide", action: ["Mark only the agreed edge areas; do not draw a band across the full side.", "Check the temple and neckline separately before removing any length."] },
      6: { title: "Start with a longer guard at the edge", action: ["Test a familiar longer setting and work toward the edge gradually.", "Keep the guard seated and change one setting at a time."] },
      7: { title: "Taper only the agreed edge", action: ["Use small, light guarded flicks beside the sideburn and temple.", "Keep most side hair untouched and full."] },
      8: { title: "Soften the tiny edge transition", action: ["Use the lever or blade corner only at the short edge after mannequin practice.", "Stop before the taper spreads across the side."] }
    },
    uniform: {
      2: { stage: "GROWTH + TEST AREA", title: "Find growth changes before choosing a pass", action: ["Brush against growth around the crown to reveal swirls and longer patches.", "A uniform buzz needs no large sectioning; protect the eyes and ears."] },
      3: { stage: "ONE-LENGTH START", title: "Choose one even starting length", action: ["Select one conservative guard that has been tested on a swatch or mannequin.", "Confirm that one length—not a fade—is the agreed result."] },
      4: { stage: "EVEN BASE", title: "Establish one length across a small area", action: ["Use the same checked setting on a small top and side area.", "Brush and compare before covering the full head."] },
      5: { stage: "NO FADE GUIDE", title: "Plan even coverage, not a fade line", action: ["Keep the chosen length consistent across the top and sides.", "Mark only areas to recheck; a buzz cut does not require a transition band."] },
      6: { title: "Use one checked guard setting", action: ["Attach the chosen guard securely and verify the clipper is clean and controlled.", "Keep the same lever position unless the tool maker or practice plan calls for a change."] },
      8: { stage: "EVEN COVERAGE", title: "Check coverage instead of blending", action: ["Brush away loose hair and compare the top, sides, crown, and back at the same length.", "Repeat one light pass only where hair still sits longer."] },
      9: { stage: "CROWN + GROWTH", title: "Follow the crown's growth pattern", action: ["Change travel direction around the swirl while keeping the same length setting.", "Do not create a short-to-long band while checking coverage."] }
    },
    crew: {
      4: { title: "Keep weight for the short top", action: ["Set the side length below the parietal ridge with the agreed top still visible.", "Leave enough side weight to connect a short top without creating a shelf."] },
      5: { title: "Map the side connection", action: ["Plan a modest blend or taper only if it is part of the agreed crew cut.", "Keep the top short but longer than the side; avoid an unintended high fade."] },
      8: { title: "Connect the side without removing top weight", action: ["Soften only the planned boundary between side and top.", "Check the profile before moving upward."] },
      9: { title: "Shape a short, guided top", action: ["Take small sections and carry the previous guide forward.", "Leave a little extra, then cross-check the top in its natural fall."] }
    },
    classic: {
      4: { title: "Set a full, classic side shape", action: ["Use a longer setting through the side and back where requested.", "Keep the shortest work near the temple, sideburn, and nape."] },
      5: { title: "Map a subtle edge taper", action: ["Limit the guide to the temple and neckline where agreed.", "Do not create a broad fade line across the side."] },
      8: { title: "Blend softly into the fuller side", action: ["Keep the transition gradual and the side visibly fuller than a fade.", "Use comb control only after practicing it on a mannequin."] }
    },
    short: {
      4: { title: "Set the short back-and-side weight", action: ["Choose a tested length through the sides and back.", "Leave a clear connection to the longer top instead of erasing all the weight."] },
      5: { title: "Mark the planned weight line", action: ["Keep the connection where it suits the top length and the person's request.", "A short back and sides does not need a fade."] },
      8: { title: "Soften only the planned connection", action: ["Use practised comb control or small scissor sections at the weight line.", "Keep the surrounding side length instead of chasing a perfect blur."] }
    },
    scissor: {
      3: { stage: "SET STARTING LENGTH", title: "Agree how much length to keep", action: ["Comb the hair in its natural fall before selecting a small first trim.", "Account for curl spring-back and how the hair will be worn."] },
      4: { stage: "SET SCISSOR GUIDE", title: "Establish a conservative scissor guide", action: ["Take a small section and comb it in its natural fall.", "Remove only a little beyond the guide with fingers outside the blade path."] },
      5: { stage: "GUIDED SECTIONS", title: "Carry the guide through clean sections", action: ["Bring a piece of the previous guide into each new section.", "Keep the section size, finger angle, and elevation steady."] },
      6: { stage: "SHEAR + COMB", title: "Cut a small section with comb control", action: ["Comb a narrow section into position and keep fingers clear of the shears.", "Close the shears only when the cutting section is stable and visible."] },
      7: { stage: "MEASURED SCISSOR WORK", title: "Move through the shape gradually", action: ["Cut small sections against the guide instead of removing a large area at once.", "Comb the hair down to check the actual result between passes."] },
      8: { stage: "CROSS-CHECK", title: "Cross-check length without a clipper blend", action: ["Comb the hair in another direction and compare for longer areas.", "Refine only the small amount needed to connect the silhouette."] },
      10: { stage: "SCISSOR DETAIL", title: "Refine edges with safe scissor work", action: ["Lift the hair away from skin with a comb around ears and nape.", "Keep the shears closed while combing or repositioning."] }
    },
    "scissor-over-comb": {
      4: { title: "Preserve enough side length to connect", action: ["Choose the section and amount of weight to remove before lifting the comb.", "Keep the longer top clipped clear and visible."] },
      5: { stage: "MAP COMB GUIDE", title: "Set the first comb angle", action: ["Place the comb shallowly along a narrow side panel and check the guide.", "Keep the comb angle appropriate to the head curve."] },
      6: { stage: "COMB + SHEAR CONTROL", title: "Check comb and shear position", action: ["Insert the comb steadily and keep it between the shears and skin.", "Cut only hair that projects beyond the comb teeth."] },
      7: { title: "Work short overlapping comb sections", action: ["Move through small panels so the length changes gradually.", "Keep your free hand clear of the shears and check the contour often."] },
      8: { title: "Change the comb angle gradually", action: ["Follow the parietal and temple curves with small angle changes.", "Do not scoop too deeply or remove a large patch at once."] },
      9: { title: "Connect into the longer top", action: ["Refine the upper side with short, controlled comb lifts.", "Preserve enough weight for the chosen silhouette; advanced movement needs supervision."] },
      10: { stage: "EAR + NECK DETAIL", title: "Detail with the comb protecting the skin", action: ["Keep the comb between shears and skin around the ear and neckline.", "Ask before sharpening the outline."] }
    }
  };

  const defaultViews = ["FRONT 3/4", "SIDE PROFILE", "SIDE + CROWN", "SIDE PROFILE", "SIDE PROFILE", "SIDE DETAIL", "TOOL CLOSE-UP", "CUTTING ACTION", "SIDE TRANSITION", "TOP + SIDE", "NECK / EDGE", "FINISHED 3/4"];

  const cuts = [
    {
      id: "low-taper", name: "Low Taper", level: "Beginner", group: "beginner", kind: "taper", asset: "assets/walkthroughs/12-step/low-taper.jpg",
      zones: "A small change at the temples, sideburns, and neckline; most side length remains.",
      views: ["FRONT 3/4", "SIDE PROFILE", "BACK + TOP", "SIDE PROFILE", "SIDE SHAPE", "TEMPLE", "GUARD CLOSE-UP", "TEMPLE ACTION", "EDGE BLEND", "TOP + SIDE", "NECKLINE", "FINISHED 3/4"],
      details: [
        "Before the taper, confirm what stays full and set out clean tools.",
        "Check wavy density, cowlicks, temple corners, parietal ridge, crown, occipital curve, and nape.",
        "Pin only the top you need out of the way; leave the side length visible.",
        "Begin with the longer surrounding length; do not remove broad side bulk.",
        "Keep the side silhouette full and plan a small temple and neckline clean-up.",
        "Trace a subtle guide at the sideburn and nape instead of across the whole side.",
        "Choose a tested longer guard and check the adjustable lever before starting.",
        "Use a light guarded flick only at the temple and sideburn edge.",
        "Soften the tiny edge into fuller hair without expanding the taper.",
        "Connect the wavy top with small comb-and-shear sections only where needed.",
        "Check the natural temple line, sideburn balance, and neckline from side and back.",
        "Inspect both profiles and the back; confirm the sides still look full."
      ],
      overrides: {
        7: { action: ["Place small, light guarded passes only at the agreed temple and sideburn edge.", "Keep the clipper moving away from the edge; do not carry the short zone across the side."] },
        8: { action: ["Use a familiar lever step or blade corner to soften the small edge after mannequin practice.", "Stop as soon as the short area joins the fuller side."] },
        11: { focus: "A low taper keeps its shape close to the edge. A broad short band would change it into a fade.", practice: "Compare the finished side with the before view and point to the small edge-only change." }
      }
    },
    {
      id: "low-fade", name: "Low Fade", level: "Beginner", group: "beginner", kind: "fade", longHairJourney: true, asset: "assets/walkthroughs/12-step/low-fade.jpg",
      zones: "A gradual transition stays low near the ears and neckline, with longer hair above.",
      views: ["FRONT 3/4", "SIDE + LANDMARKS", "SECTION + BACK", "LOWER SIDE", "SIDE SHAPE", "LOW GUIDE", "GUARD CLOSE-UP", "SIDE ACTION", "LEVER CLOSE-UP", "TOP + SCISSORS", "NECK + TEMPLE", "FINISHED 3/4"],
      details: [
        "Begin with long natural curls. Protect the length that the person wants to keep before removing anything.",
        "Read curl density and growth, then find the temple, parietal ridge, crown, occipital area, and neckline.",
        "Use a horseshoe parting to clip the retained top curls securely above the working area.",
        "Remove only the agreed lower-side bulk; leave the top length intact while the base develops.",
        "Establish the side shape below the agreed low transition; keep the upper side full.",
        "Map a narrow low guide around the ear and neckline; check the curve behind the head.",
        "Test a familiar guard above the shortest area; record the actual clipper and lever setting.",
        "Build small guarded bands below the low guide with light outward strokes.",
        "Soften a remaining line with one lever change at a time; brush and check before another pass.",
        "Shape the retained top with small scissor sections and connect it without raising the fade.",
        "Inspect the temple and sideburn, then the natural neckline from the back; ask before sharpening.",
        "Compare front, side, and back with the plan; confirm long curls remain above the low blend."
      ],
      overrides: {
        3: { stage: "REMOVE AGREED BULK", title: "Remove bulk without cutting the top short", action: ["Use controlled scissor-over-comb or a tested long guard only in the agreed lower-side area.", "Brush away loose hair and keep the retained top clipped clear."] },
        5: { focus: "Low describes where the short-to-long transition sits. Keep it around the lower side, ears, and neckline.", practice: "On a mannequin, trace the low guide from temple around behind the ear toward the nape." },
        11: { focus: "The result keeps longer curls above a low, gradual transition. Check from more than one angle before cleanup.", practice: "Compare the first and final panels. Name what changed on the side and what length stayed on top." }
      }
    },
    {
      id: "mid-fade", name: "Mid Fade", level: "Next step", group: "next", kind: "fade", asset: "assets/walkthroughs/12-step/mid-fade.jpg",
      zones: "The transition sits around the middle of the sides and wraps naturally around the back.",
      details: [
        "Agree that a mid-height transition is wanted and prepare the tools and cape.",
        "Check hair texture, crown growth, parietal ridge, temple, and occipital curve before choosing the line.",
        "Secure the top above the working area and create even side panels.",
        "Choose and test the longer starting setting on a mannequin before approaching the side.",
        "Establish a conservative side base near the middle height without moving toward the top.",
        "Map the mid guide around each side and back; compare both profiles before cutting.",
        "Choose checked guards for adjacent bands and write down lever positions.",
        "Work the lower bands in small, guarded passes that follow the head curve.",
        "Use small lever changes at the line edge; brush and inspect instead of pressing harder.",
        "Connect the upper side to the longer top without removing the weight above the guide.",
        "Check the temple, ear, sideburn, and neckline against the agreed outline.",
        "Compare both sides and the rear; confirm the transition stays at mid height."
      ],
      overrides: {
        5: { focus: "A mid fade begins higher than a low fade but stays below the upper ridge. The actual skull curve sets the path.", practice: "Draw the same mid-height guide on both sides of a mannequin and compare from the back." },
        8: { action: ["Adjust one lever step while working at the edge of a visible line.", "Stop and brush the area before deciding whether another pass is needed."] }
      }
    },
    {
      id: "high-fade", name: "High Fade", level: "Advanced", group: "advanced", kind: "fade", asset: "assets/walkthroughs/12-step/high-fade.jpg",
      zones: "The transition starts high on the sides, leaving less length below the top.",
      details: [
        "Review how much side length the person is willing to lose; a high guide is hard to lower later.",
        "Study the skull curve, density, temple, parietal ridge, and crown growth from several angles.",
        "Secure the top and mark matching high boundaries on both sides before cutting.",
        "Test the conservative first setting on a mannequin; do not begin with skin-close work.",
        "Build a high side shape only inside the agreed outline, protecting the longer top.",
        "Map the high boundary above the temple and check the silhouette from front, profile, and back.",
        "Verify each guard and lever position; leave bare-blade work to experienced supervision.",
        "Make narrow, controlled passes below the line and flick out before reaching the retained top.",
        "Refine small bands one setting at a time without pushing the high boundary upward.",
        "Connect the top carefully, preserving enough length for the selected finish.",
        "Ask before defining edges; protect ears and leave close trimmer work to a skilled barber.",
        "Inspect the high shape from every side and stop if the guide is higher than agreed."
      ],
      overrides: {
        5: { focus: "High describes a higher transition, not a fixed ruler line. This shape removes more side length and is difficult to undo.", practice: "On a mannequin, trace and review the high boundary from front, side, and back before any cutting." },
        6: { focus: "Do not attempt a skin-close blend on a person as a first exercise. Practice with a mannequin and an experienced barber.", practice: "Rehearse the guard and lever changes on a swatch; ask for supervision before close work." },
        11: { focus: "A high transition is a significant change. Compare the agreed height and ask an experienced barber to review it.", practice: "Describe where you would stop and get supervision before practicing this advanced blend." }
      }
    },
    {
      id: "drop-fade", name: "Drop Fade", level: "Advanced", group: "advanced", kind: "fade", asset: "assets/walkthroughs/12-step/drop-fade.jpg",
      zones: "The transition curves lower behind the ear before meeting the back.",
      details: [
        "Agree on the curved drop behind the ear and prepare a clear reference before cutting.",
        "Read curl growth, crown, parietal ridge, ear position, and occipital contour on both sides.",
        "Secure the top and keep the curve visible behind the ear and toward the neckline.",
        "Test a longer guard on a mannequin and keep the first live area conservative.",
        "Establish a side base that leaves room for the planned curve at the back.",
        "Draw the guide from the temple, then let it dip behind the ear toward the nape.",
        "Check guards and lever travel; use a clipper setting already tested on a swatch.",
        "Work narrow bands along the curve with light passes and a steady camera-side check.",
        "Blend the changing height gradually; do not flatten the low point behind the ear.",
        "Connect the upper side to the top while preserving the curved back silhouette.",
        "Inspect the temple, ear, and nape; compare the drop shape from behind.",
        "Review both profiles and the back so the transition drops evenly with the head."
      ],
      overrides: {
        5: { focus: "The guide is curved: it drops behind the ear before reaching the back. It is not a straight level band.", practice: "Trace the curve on a mannequin from temple to behind ear to nape, then compare the opposite side." },
        8: { action: ["Blend in short sections while following the changing height behind the ear.", "Brush the hair away and check the drop from the back before continuing."] },
        11: { view: "BACK + BOTH SIDES", focus: "The defining feature is the lower curve behind the ear. Check the back, not only the near-side profile.", practice: "Point to the low point of the curve and compare both sides from behind." }
      }
    },
    {
      id: "buzz-cut", name: "Buzz Cut", level: "Beginner", group: "beginner", kind: "uniform", asset: "assets/walkthroughs/12-step/buzz-cut.jpg",
      zones: "One chosen length runs across the top and sides; a fade is optional, not required.",
      details: [
        "Set up a clean station and confirm one even length with no fade unless requested.",
        "Notice the crown swirl, density, hairline, and growth direction around the whole head.",
        "Brush the hair against growth in a small test area; no large section is needed.",
        "Choose one longer guard and test it on a mannequin or swatch before starting.",
        "Confirm that the top and sides will keep the same chosen length.",
        "Use a small test strip as the reference; do not create a fade guideline.",
        "Attach the same checked guard securely and verify the clipper setting.",
        "Make steady, overlapping passes with the guard flat to the head surface.",
        "Brush and inspect for longer patches; do not blend a band into a fade.",
        "Change pass direction around the crown while keeping the same chosen length.",
        "Tidy the natural sideburn and neckline only by agreement; avoid a new fade.",
        "Check top, sides, crown, and back in even light for consistent coverage."
      ],
      overrides: {
        2: { stage: "GROWTH + TEST AREA", title: "Check growth before an even-length pass" },
        5: { stage: "EVEN-LENGTH GUIDE", title: "Use one test strip, not a fade line", action: ["Take one small test strip to verify the chosen guard.", "Keep the intended length uniform across top and sides."] },
        8: { stage: "COVERAGE CHECK", title: "Correct longer patches without making a fade" },
        9: { stage: "CROWN + GROWTH", title: "Follow the crown while keeping one length" },
        11: { title: "Check even coverage from every angle", focus: "A buzz cut can be one even length with no fade. The result should follow the crown and cowlicks.", practice: "Compare the test strip with the top, sides, crown, and back; name any longer patch to recheck." }
      }
    },
    {
      id: "crew-cut", name: "Crew Cut", level: "Next step", group: "next", kind: "crew", asset: "assets/walkthroughs/12-step/crew-cut.jpg",
      zones: "Shorter sides meet a short, guided top with enough weight to keep its shape.",
      details: [
        "Agree how short the top should sit and whether the sides taper or use a modest fade.",
        "Check hair density, crown, head curve, and growth direction before setting the top guide.",
        "Create a horseshoe section so the top and sides can be shaped separately.",
        "Test a conservative side guard and choose a slightly longer guided top length.",
        "Establish side length while keeping enough weight near the upper ridge.",
        "Map the connection height only if a fade or taper is part of the chosen crew cut.",
        "Choose checked side guards and set the top guide with comb or shears.",
        "Work the sides in small panels; preserve the planned weight near the top.",
        "Blend or taper only as requested; avoid a dark shelf or an unintended high fade.",
        "Shape the short top with a steady guide and cross-check its natural fall.",
        "Detail around the ear and neckline without changing the top-to-side balance.",
        "Inspect the short top from front and profile, then compare both side connections."
      ],
      overrides: {
        5: { title: "Map only the chosen side transition", focus: "A crew cut can use a taper, fade, or classic side. Match the map to the consultation.", practice: "Show where the top length ends and the side transition begins on a mannequin." },
        9: { title: "Shape the short top with a steady guide", action: ["Take small top sections and carry the previous guide forward.", "Leave a little extra and cross-check from front and side."] }
      }
    },
    {
      id: "classic-taper", name: "Classic Taper", level: "Beginner", group: "beginner", kind: "classic", asset: "assets/walkthroughs/12-step/classic-taper.jpg",
      zones: "The sides stay full; shortening gathers gradually near the temples and neckline.",
      details: [
        "Agree on a tidy classic outline and how much length should remain on the sides.",
        "Read wavy growth, density, temple corners, parietal ridge, crown, and nape.",
        "Section the top only as needed and leave the fuller sides available to guide the shape.",
        "Test a longer starting guard to maintain a classic side silhouette.",
        "Establish the fuller side length before refining the edges.",
        "Map a small temple and nape taper; do not create a full-side fade line.",
        "Check longer guards and lever positions that preserve the requested fullness.",
        "Work the side gradually and keep the shortest area near the outline.",
        "Soften the taper into the side while leaving visible fullness above it.",
        "Connect the top with a comb and guide; avoid a hard shelf at the ridge.",
        "Clean the neckline and sideburn conservatively, matching the natural outline.",
        "Compare front, side, and back; confirm the sides remain fuller than a fade."
      ],
      overrides: {
        5: { title: "Map a small temple-and-nape taper", focus: "Shortening gathers around sideburns and neckline. A classic taper does not fade the whole side.", practice: "Point to the two edge areas and trace the fuller side between them." },
        8: { title: "Blend softly and keep side fullness", action: ["Use light comb or clipper control at the edge of the taper.", "Stop before the shorter area spreads across the whole side."] }
      }
    },
    {
      id: "short-back-sides", name: "Short Back & Sides", level: "Beginner", group: "beginner", kind: "short", asset: "assets/walkthroughs/12-step/short-back-sides.jpg",
      zones: "Shorter back and sides connect to the chosen top without requiring a fade.",
      details: [
        "Agree how short the back and sides should be and how the top is worn day to day.",
        "Read the parietal ridge, occipital area, crown, density, and direction of growth.",
        "Create a horseshoe parting and clip the top without pulling.",
        "Test a conservative guard around the ear before shortening a larger panel.",
        "Set the side length and keep a visible weight line to connect to the top.",
        "Mark the planned connection height; do not assume a fade is wanted.",
        "Choose an even guard for the side panel and confirm it fits your clipper system.",
        "Work with the head curve around the ear and neckline in narrow sections.",
        "Soften a bulky connection with comb control only where the shape calls for it.",
        "Shape the top with a guide and connect it to the chosen side weight.",
        "Detail the natural sideburn and neckline without pushing the side shorter.",
        "Check the weight line, crown, and balance from front, profile, and back."
      ],
      overrides: {
        5: { title: "Mark the planned connection, not a fade line", focus: "The main teaching shape is a shorter side with a visible, controlled connection to the longer top.", practice: "Trace the weight line around the head and compare both sides before cutting." },
        8: { title: "Soften the weight line only where needed" }
      }
    },
    {
      id: "scissor-cut", name: "Scissor Cut", level: "Next step", group: "next", kind: "scissor", asset: "assets/walkthroughs/12-step/scissor-cut.jpg",
      zones: "Section guides and shears shape the length; clipper work is optional by request.",
      details: [
        "Set up clean shears, comb, cape, and mirror; agree on the length to keep.",
        "Assess natural fall, density, texture, cowlicks, and curl spring-back before selecting a guide.",
        "Divide the hair into neat sections that follow the head and secure what is out of the way.",
        "Comb a small section down and choose a conservative first trim.",
        "Set a clear guide with fingers or a comb, keeping fingers outside the blade path.",
        "Take the same size section and bring a piece of the previous guide forward.",
        "Cut only the planned ends with controlled shears; reposition with blades closed.",
        "Repeat consistent sections while maintaining finger angle and elevation.",
        "Cross-check in another direction and correct only the small areas that sit longer.",
        "Shape the top in short guided sections, respecting natural fall and texture.",
        "Comb hair away from ears and neckline; keep shears controlled and away from skin.",
        "Let hair fall naturally and inspect front, sides, back, and top before cleanup."
      ],
      overrides: {
        3: { stage: "STARTING LENGTH", title: "Choose the amount to trim conservatively" },
        5: { stage: "SET SHEAR GUIDE", title: "Establish the first scissor guide" },
        6: { stage: "GUIDED SECTION", title: "Carry the guide through a narrow section" },
        7: { stage: "SCISSOR ACTION", title: "Cut small sections with a steady hand" },
        8: { stage: "CROSS-CHECK", title: "Refine the length without a clipper blend" },
        9: { stage: "TOP SHAPING", title: "Shape the top by following the guide" },
        10: { stage: "SCISSOR DETAIL", title: "Detail the outline with comb protection" }
      }
    },
    {
      id: "scissor-over-comb", name: "Scissor Over Comb", level: "Advanced", group: "advanced", kind: "scissor-over-comb", asset: "assets/walkthroughs/12-step/scissor-over-comb.jpg",
      zones: "Small comb lifts reduce and connect side length without a fixed guard.",
      details: [
        "Prepare clean comb and shears, then agree how much side weight to remove.",
        "Study the skull curve, growth direction, density, crown, and parietal ridge.",
        "Clip longer top hair away and begin with a narrow side panel.",
        "Set a conservative starting length that leaves enough hair for comb control.",
        "Define the first side connection in a small, visible panel.",
        "Place a shallow comb angle along the head to establish the first guide.",
        "Keep the comb between shears and skin; cut only hair projecting beyond its teeth.",
        "Move through short overlapping sections with a steady comb lift.",
        "Change the comb angle gradually around the temple and parietal curve.",
        "Connect the upper side into the longer top without removing a large patch.",
        "Detail around the ear and neckline with the comb protecting the skin.",
        "Check the contour from several views; supervised practice is recommended."
      ],
      overrides: {
        5: { stage: "SET COMB GUIDE", title: "Set a shallow first comb angle" },
        6: { stage: "COMB + SHEAR CONTROL", title: "Position comb and shears safely" },
        7: { stage: "SHORT OVERLAPPING SECTIONS", title: "Work in small, even comb lifts" },
        8: { stage: "FOLLOW THE HEAD CURVE", title: "Adjust the comb angle gradually" },
        9: { stage: "CONNECT THE TOP", title: "Connect without removing a large area" }
      }
    }
  ];

  const wideSheets = new Set(["crew-cut", "short-back-sides", "scissor-cut", "scissor-over-comb"]);
  // Measured panel boundaries: generated contact sheets have slightly uneven rows.
  const sheetGuides = {
    "low-taper": [[308, 617, 922, 1229], [250, 505, 738]],
    "low-fade": [[308, 614, 922, 1229], [251, 498, 739]],
    "mid-fade": [[305, 617, 921, 1232], [253, 510, 756]],
    "high-fade": [[305, 615, 922, 1232], [259, 511, 754]],
    "drop-fade": [[307, 615, 922, 1229], [256, 512, 764]],
    "buzz-cut": [[307, 616, 923, 1230], [246, 491, 738]],
    "crew-cut": [[322, 650, 973, 1297], [238, 485, 703]],
    "classic-taper": [[308, 615, 923, 1230], [252, 503, 741]],
    "short-back-sides": [[323, 651, 969, 1299], [242, 486, 727]],
    "scissor-cut": [[324, 653, 971, 1299], [241, 481, 706]],
    "scissor-over-comb": [[326, 647, 972, 1296], [243, 484, 713]]
  };
  function panelRegions(cut) {
    const [xLines, yLines] = sheetGuides[cut.id];
    const xs = [0, ...xLines, wideSheets.has(cut.id) ? 1619 : 1536];
    const ys = [0, ...yLines, wideSheets.has(cut.id) ? 971 : 1024];
    return Array.from({ length: 20 }, (_, panel) => {
      const col = panel % 5, row = Math.floor(panel / 5);
      return { x: xs[col] + 4, y: ys[row] + 4, width: xs[col + 1] - xs[col] - 8, height: ys[row + 1] - ys[row] - 8 };
    });
  }
  const sequence = [0, 1, 2, 3, 5, 6, 6, 7, 8, 9, 10, 10, 10, 10, 11, 11];
  const keys = ["before", "analysis", "section", "initial-length", "guide", "first-length", "next-length", "transition", "blend", "top", "temples", "ears", "back", "finish", "inspection", "complete"];
  const hairTypes = { "low-taper": "Dense wavy hair", "classic-taper": "Straight to wavy hair", "low-fade": "Dense curly hair", "mid-fade": "Dense curly hair", "high-fade": "Dense textured hair", "drop-fade": "Dense curly hair", "buzz-cut": "Short dense hair", "crew-cut": "Straight to wavy hair", "short-back-sides": "Straight to wavy hair", "scissor-cut": "Medium-length wavy hair", "scissor-over-comb": "Straight to wavy hair" };
  window.THE_CRAFT_WALKTHROUGHS = cuts.map((cut) => ({
    ...cut,
    asset: "assets/walkthroughs/full-process/" + cut.id + ".jpg",
    sheetColumns: 5,
    sheetRows: 4,
    panelRegions: panelRegions(cut),
    imageWidth: wideSheets.has(cut.id) ? 1619 : 1536,
    imageHeight: wideSheets.has(cut.id) ? 971 : 1024,
    hairType: hairTypes[cut.id] + " · illustrated training example",
    alt: "Continuous illustrated haircut sequence with sixteen process stages and four finished angles of the same client.",
    finalViews: ["Front", "Left side", "Right side", "Back"].map((label, index) => ({ id: ["front", "left", "right", "back"][index], label, panel: 16 + index })),
    processOverview: [0, 2, 3, 4, 8, 12, 13, 15].map((step, index) => ({ step, label: ["Before", "Section", "Remove length", cut.kind === "uniform" ? "Even base" : "Guide", cut.kind === "uniform" ? "Coverage" : cut.kind.startsWith("scissor") ? "Cross-check" : "Blend", "Detail", "Finish", "After"][index] })),
    whatChanged: [
      { label: "Length", text: cut.kind === "uniform" ? "Longer, uneven starting hair becomes one checked length across the head." : "Unworked length is reduced in stages while the agreed top length stays protected." },
      { label: "Shape", text: cut.zones },
      { label: "Transition", text: cut.kind === "fade" ? "The short-to-long change wraps across the side and back at the chosen height." : ["taper", "classic"].includes(cut.kind) ? "The shortening stays close to the sideburns and neckline, with fuller sides above." : cut.kind === "uniform" ? "No fade band is added to this one-length example." : "The side and top connect according to the chosen shape." },
      { label: "Blend", text: cut.kind === "uniform" ? "Coverage is checked for missed longer patches." : cut.kind.startsWith("scissor") ? "Small guided sections connect the lengths without a fixed guard recipe." : "Visible working boundaries are softened without moving the planned shape." },
      { label: "Top", text: cut.kind === "uniform" ? "The top uses the same checked setting as the sides." : "The top is shaped separately and cross-checked in its natural fall." },
      { label: "Temples", text: "Sideburn balance and the natural temple corners are checked from both profiles." },
      { label: "Neckline", text: "The back contour and nape are cleaned to the agreed natural outline." },
      { label: "Finish", text: "Loose hair is brushed away and front, both sides, and back are reviewed." }
    ],
    steps: sequence.map((sourceIndex, index) => {
      const shear = cut.kind.startsWith("scissor");
      const uniform = cut.kind === "uniform";
      const edge = ["taper", "classic"].includes(cut.kind);
      const stage = { ...baseStages[sourceIndex], ...(stageOverrides[cut.kind]?.[sourceIndex] || {}), ...(cut.overrides?.[sourceIndex] || {}) };
      let detail = cut.details[sourceIndex];
      let tool = shear ? "Shears + cutting comb" : "Guarded clipper + cutting comb";
      let view = stage.view || cut.views?.[sourceIndex] || defaultViews[sourceIndex];
      const replace = (values) => { Object.assign(stage, values); if (values.detail) detail = values.detail; };
      if (index === 0) {
        replace({ stage: "BEFORE", title: "See the untouched starting length", detail: "Study the same client before any length is removed. Notice the longer sides, top, and unfinished outline.", action: ["Record the starting outline and where the hair looks fullest.", "Name what the requested cut should keep and what should become shorter."], focus: "This is the starting state. Compare it with the final front, side, and back views later.", practice: "Describe the starting length in three areas: top, sides, and back." });
        tool = "Mirror + comb · cutting tools off"; view = "BEFORE · THREE-QUARTER";
      }
      if (index === 1) {
        replace({ stage: "CONSULT + ANALYZE", title: "Agree the plan and read this head", detail: "Set a clean station, cape the client comfortably, and agree the amount to remove. Read the actual skull curve, density, texture, growth, and crown before cutting." });
        stage.action = ["Confirm the top length, side shape, and natural or defined outline.", "Locate temples, parietal ridge, occipital area, crown, and nape; check growth and comfort."]; tool = "Clean station + cape + comb";
      }
      if (index === 2) tool = "Sectioning comb + clips";
      if (index === 3) {
        replace({ stage: "REMOVE STARTING LENGTH", title: shear ? "Remove the first conservative amount" : "Reduce the unworked length gradually", detail: shear ? "Lift a small section and remove only the agreed excess. Keep enough length to build the guide and check the natural fall." : edge ? "Reduce only the agreed excess with a conservative setting. Preserve the fuller side silhouette before tightening the edges." : "Begin with a longer tested setting and remove excess in small panels. The working shape is still rough; the blend comes later.", action: ["Check the amount to remove before the first pass or snip.", "Brush or comb the section down and compare with the untouched hair."], focus: "A rough, partly shortened panel is expected here. Do not chase the finished look yet." });
      }
      if (index === 4) stage.stage = uniform ? "EVEN BASE" : shear ? "FIRST SHEAR GUIDE" : edge ? "EDGE GUIDE" : "FIRST GUIDE";
      if (index === 5) {
        stage.stage = shear ? "FIRST GUIDED SECTION" : "FIRST CHECKED LENGTH";
        stage.title = shear ? "Cut the first section against the guide" : uniform ? "Keep the chosen guard consistent" : "Work the first checked length";
        detail = shear ? "Carry a visible piece of the guide into a small section. Cut only the hair beyond that reference." : "Use the setting tested for this zone, attach the guard firmly, and make a small controlled pass. Numbers alone do not predict the result on every tool or texture.";
      }
      if (index === 6) {
        replace({ stage: uniform ? "SAME LENGTH · NEXT AREA" : shear ? "NEXT GUIDED SECTION" : "NEXT LONGER LENGTH", title: uniform ? "Carry the same setting into the next area" : shear ? "Carry the guide into the next section" : "Connect the next length above the short zone", detail: uniform ? "Keep the guard and lever unchanged while moving into an adjacent panel. Brush away cut hair so missed patches remain visible." : shear ? "Include a piece of the previous section as your reference. Keep the section width and comb angle consistent." : edge ? "Use the tested longer setting just above the small edge area. Stop before the taper spreads into the full side." : "Work the next tested length above the shorter zone. Keep the band narrow and leave the longer hair above protected.", action: [uniform ? "Check the same guard is still seated securely." : shear ? "Bring the previous guide into view before each snip." : "Name the new guard and lever position before cutting.", "Work one small adjacent area, brush clean, and compare the length change."], focus: uniform ? "The setting stays the same; only the working area changes." : "A visible length step is useful while building the shape. Blend it after the placement is checked." });
      }
      if (index === 7) stage.stage = uniform ? "CONTROLLED COVERAGE" : shear ? "BUILD THE SHEAR SHAPE" : "BUILD THE TRANSITION";
      if (index === 8) stage.stage = uniform ? "CHECK COVERAGE" : shear ? "CROSS-CHECK" : "BLEND THE GUIDE";
      if (index === 9) tool = uniform ? "Same checked guard + brush" : "Shears + comb · agreed top guide";
      if (index === 10) {
        replace({ stage: "TEMPLES + SIDEBURNS", title: "Refine the temples and sideburns", detail: "Comb the temple hair into natural fall and compare the sideburns. Refine only the agreed edge; preserve the natural corners.", action: ["Compare both profiles before defining an edge.", "Keep the tool controlled and remove only a small visible amount."], focus: "Temple corners and sideburn lengths can differ naturally. Confirm the intended balance.", practice: "Point to the two sideburn endpoints on a mannequin before detailing." }); view = "TEMPLE DETAIL";
      }
      if (index === 11) {
        replace({ stage: "AROUND THE EAR", title: "Clean around the ear with control", detail: "Move hair away from the ear so the cutting path is visible. Reposition with the cutting tool clear of the skin.", action: ["Protect the ear and keep the comb or guard in a clear path.", "Use short, deliberate movements; stop if the working area is obscured."], focus: "The ear is protected throughout the action. A neat outline does not require cutting into the natural hairline.", practice: "Rehearse the hand and comb position with tools off or shears closed." }); view = "EAR DETAIL";
      }
      if (index === 12) {
        replace({ stage: "BACK + NECKLINE", title: "Follow the back curve into the nape", detail: edge ? "Check the fuller back above the small nape taper. Clean only the agreed neckline without raising the taper." : uniform ? "Inspect the occipital curve for missed patches at the same setting, then tidy the agreed natural neckline." : "Check the occipital curve and the connection at the back. Refine the nape to the agreed outline without raising the transition.", action: ["Use a mirror to compare the back with both side connections.", "Brush clean and preserve the natural neckline unless a different outline was agreed."], focus: "The back is its own inspection area. Side balance alone does not confirm a finished cut.", practice: "Trace the occipital curve and neckline on a mannequin." }); view = "BACK + NAPE";
      }
      if (index === 13) {
        replace({ stage: "OPTIONAL EDGE FINISH", title: shear ? "Finish the natural outline with shears" : "Finish only the outline that was agreed", detail: "A sharper line-up is optional. Keep the natural outline when that is the plan, and remove only stray hair that interrupts the agreed finish.", action: ["Ask before changing temple corners or defining a sharper hairline.", "Keep the final touch small; do not cut farther back to chase symmetry."], focus: "This stage refines an agreed outline. It does not make a line-up mandatory.", practice: "Describe natural versus defined edges before rehearsing the tool position." }); tool = shear ? "Shears + protective comb" : "Detail trimmer or guarded clipper · optional"; view = "OUTLINE FINISH";
      }
      if (index === 14) { stage.stage = "FINAL INSPECTION"; tool = "Brush + hand mirror"; view = "MIRROR CHECK"; }
      if (index === 15) {
        replace({ stage: "COMPLETE HAIRCUT", title: "Review the finished cut from four angles", detail: "Compare the same client with the starting image. Switch between front, left, right, and back, then explain what changed in the length and shape.", action: ["Check the silhouette, top connection, both temples, and neckline.", "Confirm the agreed result and comfort; clean and disinfect the tools."], focus: cut.zones, practice: "Name one visible change and one movement to rehearse next. Mark complete after reviewing every angle." }); tool = "Mirror + brush · service cleanup"; view = "FINISHED THREE-QUARTER";
      }
      return {
        key: keys[index],
        stage: stage.stage,
        title: stage.title,
        detail,
        action: stage.action,
        focus: stage.focus,
        practice: stage.practice,
        tool,
        next: index === 15 ? "Review all four angles, compare before and after, then save your progress." : keys[index + 1].replaceAll("-", " "),
        view,
        panel: index,
        imageAlt: view + " image for step " + (index + 1) + " of " + cut.name + ": " + detail
      };
    })
  }));
})();
