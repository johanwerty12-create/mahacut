(() => {
  "use strict";
  const cuts = window.THE_CRAFT_WALKTHROUGHS;
  const definitions = [
    ['consultation', 'Listen before you choose a fade', 'Ask what should stay long, how the hair is worn, and what the person liked or disliked about previous cuts.', 'Comb + mirror', 'The request comes before a guard number.', 'Say the plan back in one clear sentence.'],
    ['desired-fade', 'Confirm shape and finish separately', 'Agree the fade shape, top length, and whether the lowest area should retain stubble or reach skin.', 'Reference + mirror', 'Low, mid and high describe placement; skin describes a finish.', 'Name the placement and finish without treating them as the same choice.'],
    ['placement', 'Choose the transition placement', 'Trace the intended placement with a comb before cutting. Compare it from the side and back.', 'Cutting comb', 'The planned transition follows a head curve, rather than a ruler.', 'Trace the planned boundary on a mannequin.'],
    ['analysis', 'Read the head contour', 'Locate the temples, parietal ridge, occipital projection and apex. Read the overall profile without prescribing a cut from its label.', 'Hands + comb, with permission', 'Where does the side turn toward the top?', 'Point to the ridge, apex and occipital area.'],
    ['texture', 'Read the actual hair texture', 'Comb a small section and observe straightness, wave, curl and spring-back in natural fall.', 'Cutting comb', 'A curl can look longer when stretched than after release.', 'Release a combed section and describe the change.'],
    ['density', 'Check density and scalp visibility', 'Part a small section in even light. Notice fuller and lighter areas before selecting the first length.', 'Comb + good light', 'A darker patch may reflect density rather than an unblended line.', 'Compare two nearby areas before changing a setting.'],
    ['growth', 'Find the direction of growth', 'Comb the sides and back in natural fall, then gently across growth to expose direction changes.', 'Cutting comb', 'Tool direction may change around a swirl; the chosen length does not have to.', 'Trace growth directions on a mannequin.'],
    ['crown', 'Inspect the crown swirl', 'Separate the crown with a comb and find where the hair turns. Preserve enough length for it to settle.', 'Cutting comb', 'The crown must be checked before top length is removed.', 'Name the swirl direction and an area to preserve.'],
    ['temple-check', 'Read the temple corners', 'Expose the natural temple corner and compare the sideburn on both sides. Confirm the intended outline.', 'Comb + mirror', 'Natural corners and sideburns may differ; do not cut them back to chase perfect symmetry.', 'Locate both temple corners with tools off.'],
    ['neckline-check', 'Inspect the natural neckline', 'Look at nape growth and the occipital curve from behind. Agree a natural or defined neckline.', 'Comb + hand mirror', 'Do not choose a neckline before seeing natural growth.', 'Describe the original outline without cutting.'],
    ['tools', 'Prepare the clipper and compatible guards', 'Set a clean station, inspect the blade and guard fit, and test a conservative setting on a training swatch.', 'Clean clipper, compatible guards, comb, cape', 'Check the maker’s lever range, guard fit and cleaning directions.', 'Name each tool and the first tested setting.'],
    ['section', 'Section and protect the longer top', 'Make clean partings above the working side and secure the top comfortably. Keep the ears, eyes and neck protected.', 'Sectioning comb + clips', 'The parting follows this head and the top length you agreed.', 'Create a clean horseshoe section without pulling.'],
    ['initial-length', 'Reveal the working zone and reduce excess', 'Comb out the side and remove excess conservatively before setting the short guide. Keep enough hair for the planned connection.', 'Longer tested guard + comb', 'Long starting hair needs controlled bulk removal; do not jump straight to a finished fade.', 'Rehearse one longer guarded pass, then brush and inspect.'],
    ['guide', 'Establish the first narrow guideline', 'Place a small, visible first guide at the agreed boundary. Check the opposite side and back before extending it.', 'Clipper + checked setting', 'A working guide is temporary; its location controls the shape.', 'Mark a narrow guide on a mannequin first.'],
    ['first-length', 'Create the shortest planned area', 'Work below the guide in small panels using the setting tested for the chosen finish. Keep tools clear of ears and irritated skin.', 'Checked lower setting; supervised close work', 'The lowest area remains inside its planned zone.', 'Start guarded on a mannequin and keep the zone small.'],
    ['transition', 'Begin the first controlled blend', 'Use light upward-and-outward passes at the edge of the shorter area. Brush away cut hair between passes.', 'Clipper + tested neighboring length', 'Lift away at the head curve; pressure is not a blending tool.', 'Repeat three slow flick-out passes, then stop.'],
    ['lever', 'Change one lever position at a time', 'Pause clear of the head, move the lever through a small tested range, and return to one visible boundary.', 'Adjustable clipper + compatible guard', 'Closed leaves the shortest blade setting; opening generally leaves more length. Exact ranges vary.', 'With tools off, identify closed, halfway and open.'],
    ['blend', 'Soften the first remaining guide', 'Use a tested intermediate setting at the edge of the line, brush clean, and inspect before another small pass.', 'Clipper lever or intermediate guard', 'Work at the line without widening or raising the entire transition.', 'Soften one short mannequin section and compare before/after.'],
    ['next-length', 'Build the next longer guideline', 'Set a longer working length above the first zone while leaving enough room to connect to the fuller hair.', 'Next longer compatible guard', 'The next band should support the shape; it is not a fixed universal width.', 'Name the two neighboring lengths before making a pass.'],
    ['second-blend', 'Join the next length gradually', 'Work at the boundary between the neighboring lengths with a light outward motion and frequent brushing.', 'Clipper + tested intermediate setting', 'The actual hair must progress from shortest through transition toward longer hair.', 'Compare the boundary in even light before changing tools.'],
    ['guard-changes', 'Move through the guards deliberately', 'Switch off or keep the tool safely clear while changing attachments, seat each guard securely, and test one change at a time.', 'Compatible guard set', 'Guard labels are references. Blade, lever, brand and texture affect the actual result.', 'Attach, check and name the new guard before cutting.'],
    ['lower-blend', 'Refine the lower transition', 'Inspect the lowest boundary and make only small controlled corrections. Keep the planned base area from creeping higher.', 'Checked lower or intermediate setting', 'Skin-to-stubble work is a separate supervised skill, not a mandatory beginner finish.', 'Use a guarded shadow-fade drill before close work.'],
    ['middle-blend', 'Refine the middle transition', 'Brush the middle zone, check whether a darker patch is density or length, and refine only the boundary that needs it.', 'Clipper + comb', 'Do not remove a whole patch because it looks darker.', 'Point to one boundary before repeating a pass.'],
    ['upper-blend', 'Connect the upper weight line', 'Lift a small amount of upper-side hair with a comb and connect it to the retained weight above. Comb control needs practice.', 'Comb + clipper or shears', 'The ridge changes the tool angle. Preserve the chosen silhouette.', 'Rehearse a shallow comb lift with the tool off.'],
    ['symmetry', 'Compare both sides before correcting', 'Use front and profile views to compare placement, sideburn endpoints and retained weight on the actual head.', 'Mirror + brush', 'Visual balance respects natural asymmetry and the request.', 'List one side-to-side difference without cutting it away.'],
    ['back', 'Blend around the back curve', 'Check the occipital projection and connect the back to both sides in small panels. Keep the agreed curve visible.', 'Clipper + comb + hand mirror', 'The back is a separate working area, not an afterthought.', 'Trace the back connection with a comb.'],
    ['top', 'Connect and shape the longer top', 'Carry a visible top guide through small sections and connect the upper side. Release the hair to check its natural fall.', 'Shears + cutting comb', 'Do not raise the fade into the top while trying to connect it.', 'Trim a conservative top guide on a mannequin.'],
    ['finish', 'Detail the temples and neckline', 'Check the sideburns, protected ear area and nape. Refine only the natural or defined outline that was agreed.', 'Detail trimmer or guarded clipper + comb', 'A sharper line-up is optional. Never push the natural corner back by assumption.', 'Rehearse a safe outline path with tools off.'],
    ['inspection', 'Inspect and make small corrections', 'Brush loose hair away, inspect front, both sides, back and crown, and confirm comfort before one final small correction.', 'Brush + mirror', 'Stop when the agreed shape is complete; repeated cutting can move the fade.', 'Name one area that matches the plan and one to recheck.'],
    ['complete', 'Review the complete transformation', 'Compare the untouched starting length with the finished top, sides and back. Explain the placement and the length progression.', 'Mirror + service cleanup', 'Shortest → transition → longer. The chosen shape decides where this progression sits.', 'Review all finished angles, then save the lesson as complete.']
  ];
  const typeIds = ['low-fade', 'mid-fade', 'high-fade', 'drop-fade', 'burst-fade', 'taper-fade', 'skin-fade'];
  window.THE_CRAFT_FADE_COURSES = typeIds.map(id => {
    const cut = cuts.find(c => c.id === id);
    if (!cut) return null;
    const profile = cut.profile;
    const before = window.CraftVisual.fromSheet(cut, 0);
    const finished = [16, 17, 18, 19].map(n => window.CraftVisual.fromSheet(cut, n));
    const steps = definitions.map(([key, title, detail, tool, focus, practice], index) => ({ key, title, detail, tool, focus, practice, stage: index < 6 ? 'PLAN' : index < 12 ? 'READ + PREPARE' : index < 18 ? 'SET THE BASE' : index < 24 ? 'BUILD + BLEND' : 'CONNECT + FINISH', action: [detail, practice], view: 'TRAINING ACTION', panel: index, visual: window.CraftVisual.fromAsset(id + '-phase-' + (Math.floor(index / 6) + 1), index % 6), imageAlt: cut.name + ' fade course, step ' + (index + 1) + ': ' + title }));
    if (id === 'low-fade') steps[12].visual = window.CraftVisual.fromSheet(cut, 3);
    const modify = (n, title, detail, focus) => Object.assign(steps[n], { title, detail, focus, action: [detail, steps[n].practice], imageAlt: cut.name + ' training action: ' + title });
    modify(2, 'Choose the ' + cut.name.toLowerCase() + ' placement', profile.about + ' Trace the complete planned boundary before cutting.', profile.headNote);
    if (id === 'drop-fade') {
      modify(13, 'Set the guide with a dip behind the ear', 'Trace a controlled downward curve behind the ear and continue it toward the nape. Compare the curve on both sides before cutting.', 'Do not straighten the dropped back section.');
      modify(25, 'Keep the drop while blending the back', 'Follow the dipped guide around the occipital curve with small guarded panels. Preserve the extra back weight above it.', 'A blend must preserve the dropped silhouette.');
    }
    if (id === 'burst-fade') {
      modify(12, 'Reveal the ear-centered burst zone', 'Reduce excess inside the planned semicircle around the ear while retaining the longer back and nape.', 'The working zone radiates around the ear.');
      modify(13, 'Set a rounded guide around the ear', 'Compare both ear-centered arcs. Keep the guideline separate from the retained back hair.', 'A burst is not a band across the entire side and nape.');
      modify(21, 'Refine the short area beside the ear', 'Protect the ear and refine the lower arc in short controlled passes. Preserve the longer hair behind the arc.', 'Keep the ear visible and protected.');
      modify(25, 'Connect the burst to the retained back', 'Refine where the ear arc meets longer back hair, then inspect the natural nape without fading its length away.', 'The longer back is part of the finished burst shape.');
    }
    if (id === 'taper-fade') {
      modify(12, 'Isolate the temple and nape working areas', 'Expose small temple/sideburn and nape panels. Leave the full side outside the shortest zone.', 'There is no broad band across the side.');
      modify(13, 'Set separate temple and nape guides', 'Map each edge area independently and keep both guides small and low. Compare sideburn endpoints before shortening.', 'Close edge work must not spread into the fuller side.');
      modify(18, 'Add the longer edge length locally', 'Work a tested longer length just above the small edge guide. Keep the surrounding full side intact.', 'The taper remains concentrated at the outline.');
      modify(25, 'Blend only the nape edge at the back', 'Check the small nape transition into the fuller back. Do not create a full-back fade while connecting it.', 'Most back length remains above the edge.');
    }
    if (id === 'skin-fade') {
      modify(14, 'Create the bare area with supervision', 'A trained barber uses suitable close tools below the planned guide on healthy skin, checks blade heat, and avoids pressure or repeated irritation.', 'Start with guarded mannequin work before a real skin-close service.');
      modify(21, 'Connect bare skin into short stubble', 'Refine the skin-to-stubble boundary with a tested tool sequence under supervision. A shaver and a bare clipper blade leave different finishes.', 'Do not use zero-gapping as a shortcut or keep rubbing irritated skin.');
    }
    steps.forEach((s, i) => { s.next = steps[i + 1]?.title || 'Compare all finished angles and save your progress.'; });
    const course = { id, name: cut.name, level: cut.level, group: cut.group, profile, before, finished, steps, checklist: profile.checklist };
    // The full-cut player and fade page share exactly the same thirty actions and images.
    cut.originalSteps = cut.steps; cut.beforeVisual = before; cut.finishedVisuals = finished; cut.steps = steps;
    cut.finalViews = ['Front', 'Left side', 'Right side', 'Back'].map((label, i) => ({ id: ['front', 'left', 'right', 'back'][i], label, panel: 100 + i }));
    cut.processOverview = [0, 11, 12, 13, 17, 25, 27, 29].map((step, i) => ({ step, label: ['Before + plan', 'Section', 'Remove length', 'Guide', 'Blend', 'Back', 'Detail', 'After'][i] }));
    return course;
  }).filter(Boolean);
  window.THE_CRAFT_FADE_DRILLS = [
    ['grip', 'Clipper grip', 'low-fade', 14, 'Hold the clipper with a relaxed wrist and keep fingers clear of the working blade. Rehearse with tools off first.'],
    ['lever', 'Lever control', 'low-fade', 16, 'Identify closed, halfway and open with the tool off; then test one change on a swatch.'],
    ['guards', 'Guard changes', 'low-fade', 20, 'Seat a compatible guard securely and name its label before one mannequin pass.'],
    ['first-guide', 'Create a guideline', 'low-fade', 13, 'Mark a narrow low guide on a mannequin before using a guarded clipper.'],
    ['erase-guide', 'Remove a guideline', 'low-fade', 17, 'Soften one neighboring-length boundary without raising the planned transition.'],
    ['flick', 'Flick-out motion', 'low-fade', 15, 'Repeat three slow upward-and-outward passes, then brush and inspect.'],
    ['small-blend', 'Blend a small section', 'low-fade', 19, 'Work one short boundary between two tested lengths and stop to compare.'],
    ['low', 'Map a low fade', 'low-fade', 29, 'Trace the low transition around the ears and nape; begin guarded on a mannequin.'],
    ['mid', 'Map a mid fade', 'mid-fade', 29, 'Compare the middle transition with the skull curve before marking a mannequin guide.'],
    ['high', 'Map a high fade', 'high-fade', 29, 'Mark the high transition while keeping a protected top boundary. Practice under guidance.'],
    ['ear', 'Blend around the ear', 'burst-fade', 21, 'Rehearse the rounded ear area with tools off, then practice a guarded arc on a mannequin.'],
    ['nape', 'Blend the neckline', 'taper-fade', 25, 'Keep a small nape taper below the fuller back; do not spread the edge upward.'],
    ['symmetry', 'Check symmetry', 'low-fade', 24, 'Compare placement and retained weight from front and both profiles before correcting.'],
    ['detail', 'Final detailing', 'low-fade', 27, 'Rehearse the agreed outline safely, protect the ear, and keep natural temple corners.']
  ].map(([id, title, type, step, task]) => ({ id, title, type, step, task }));
})();
