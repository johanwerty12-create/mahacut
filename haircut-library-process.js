(() => {
  "use strict";
  const cuts = window.THE_CRAFT_WALKTHROUGHS;
  const profiles = window.THE_CRAFT_HAIRCUTS;
  const find = id => cuts.find(c => c.id === id);
  for (const profile of profiles) {
    let cut = find(profile.id);
    if (!cut) {
      const long = profile.kind === 'long';
      const crop = profile.kind === 'crop';
      const seedId = long ? 'scissor-cut' : profile.kind === 'taper' ? 'low-taper' : profile.kind === 'fade' ? 'low-fade' : profile.kind === 'classic' ? 'classic-taper' : 'crew-cut';
      const seed = find(seedId);
      const a = window.THE_CRAFT_NEW_ASSETS?.[profile.id];
      if (!a) continue;
      cut = { ...seed, id: profile.id, name: profile.name, kind: profile.kind, asset: a.asset, imageWidth: a.width, imageHeight: a.height, panelRegions: a.regions, zones: profile.about, hairType: profile.textures + ' · training illustration', longHairJourney: long, steps: seed.steps.map(s => ({ ...s, action: [...s.action] })), profile };
      const set = (n, title, detail, actions, focus) => Object.assign(cut.steps[n], { title, detail, action: actions, focus, practice: 'Rehearse this action slowly on a mannequin, then explain what changed.', imageAlt: profile.name + ' process stage ' + (n + 1) + ': ' + title });
      set(1, 'Agree the ' + profile.name.toLowerCase() + ' plan', profile.about + ' ' + profile.headNote, ['Confirm the length, outline and daily styling routine.', 'Read actual texture, density, crown growth and head landmarks.'], profile.headNote);
      set(2, long ? 'Divide the whole head into controlled sections' : 'Protect the longer top before working the sides', long ? 'Use clean sections around the crown, sides and back. Keep unworked length out of the shear path.' : 'Make a clean horseshoe parting and secure the top comfortably above the working side.', ['Comb in natural fall before sectioning.', 'Secure each section without pulling and expose only the working panel.'], 'The section follows this head and requested shape.');
      if (long) {
        set(3, 'Remove the first excess length conservatively', 'Release a small section, agree the amount to trim, and leave extra for natural wave or curl spring-back.', ['Comb the section into its natural fall.', 'Trim only the agreed ends with fingers clear of the blades.'], 'Longer hair remains visibly present; this is not a short clipper cut.');
        set(4, 'Establish a visible shear guide', 'Choose one small reference section. The released length should still support the longer textured outline.', ['Hold a small steady section.', 'Cut conservatively and release it to check the fall.'], 'A section guide replaces a clipper fade band.');
        set(5, 'Carry the guide into the next layer', 'Include a piece of the guide in each new section and maintain a deliberate elevation.', ['Keep the guide visible.', 'Use similar section widths and close shears when repositioning.'], 'Do not over-direct every section to one point.');
        set(6, 'Connect adjacent sections without losing length', 'Work through narrow neighboring sections, preserving the agreed perimeter and natural movement.', ['Bring the last guide into view.', 'Comb down and compare the released lengths.'], 'The outline must remain long enough after release.');
        set(7, 'Build the layers around the head curve', 'Follow the actual skull with controlled section angles; retain length around the ears and nape.', ['Work one small panel at a time.', 'Compare the crown, sides and back as the shape develops.'], 'Layering redistributes weight without creating a fade.');
        set(8, 'Cross-check the layers in a new direction', 'Comb across the original section direction and refine only obvious longer areas.', ['Compare neighboring lengths.', 'Correct a small amount, then release the hair.'], 'Cross-checking is a separate action from adding texture.');
        for (const n of [10, 11, 12, 13]) cut.steps[n].tool = 'Shears + cutting comb · blades closed while repositioning';
        set(12, 'Connect the back while retaining the nape', 'Comb the back into natural fall and connect the layers over the occipital curve without removing the requested perimeter.', ['Keep the nape outline visible.', 'Release and compare both back sections.'], 'The neckline stays longer and natural.');
        set(13, 'Refine movement with small shear touches', 'Finish the agreed outline with comb protection. Add only conservative texture to the ends after checking density.', ['Keep shears away from skin.', 'Avoid deep bulk removal in fine or springy hair.'], 'No mandatory trimmer line-up belongs in this long layered example.');
      }
      const topDetails = {
        'textured-crop': 'Carry short guided top sections, then soften the forward fringe with small, controlled touches. Check density before adding texture.',
        'french-crop': 'Shape the top to fall forward and set the agreed fringe in its natural fall. Check dry length before refining a clear front outline.',
        'ivy-league': 'Keep the front a little longer than the crown so the short top can part naturally. Carry the guide backward without removing all front weight.',
        'side-part': 'Find the natural part and shape the top in small sections on both sides of it. Preserve enough length to move with growth.',
        'slick-back': 'Retain front length and connect toward the crown so the top can sweep backward. Inspect the cut without product hiding the shape.',
        'modern-pompadour': 'Build a supported longer front and connect it into a shorter crown. Cross-check the unstyled cut before lifting and sweeping the front backward.',
        'high-and-tight': 'Shape a compact short top cap and preserve its boundary above the very close high sides. Check crown growth before shortening again.',
        'longer-textured-cut': 'Shape the crown and top through small guided layers. Release each section to check movement, density and spring-back.'
      };
      set(9, profile.topGoal, topDetails[profile.id] || 'Shape the agreed top with small sections and keep it connected to the chosen side silhouette.', ['Carry a visible guide through small sections.', 'Release the hair and cross-check its natural fall.'], profile.tips[0]);
      if (profile.id === 'burst-fade') {
        set(4, 'Trace the ear-centered burst arc', 'Keep the guide rounded around the ear while the back and nape stay outside the fade zone.', ['Compare the arc around both ears.', 'Preserve the longer back and mark the boundary before cutting.'], 'A burst follows the ear, not a full band around the head.');
        set(12, 'Refine the retained back and natural nape', 'Check where the burst meets the longer back. Tidy the perimeter without fading away the retained nape.', ['Use a mirror to check the back silhouette.', 'Keep the ear arc distinct from the longer back.'], profile.headNote);
      }
      cut.whatChanged = [{ label: 'Length', text: profile.length }, { label: 'Shape', text: profile.about }, { label: 'Top', text: profile.topGoal }, { label: 'Head and growth', text: profile.headNote }, { label: 'Connection', text: long ? 'Guided shear sections connect layers while retaining length.' : 'The side length connects to the requested top without changing the plan.' }, { label: 'Temples', text: 'Natural temple corners and sideburn balance are checked.' }, { label: 'Neckline', text: profile.id === 'burst-fade' || long ? 'The longer nape is retained and refined.' : 'The agreed nape outline is cleaned with controlled tools.' }, { label: 'Finish', text: 'Front, both sides and back are compared with the starting state.' }];
      cut.steps[15].detail = profile.about + ' Review all four finished angles and compare them with the untouched starting length.';
      cut.steps.forEach((s, n) => { s.next = cut.steps[n + 1]?.title || 'Review every finished angle and the final checklist.'; });
      cuts.push(cut);
    }
    cut.name = profile.name; cut.level = profile.level; cut.group = profile.group; cut.profile = profile;
    const pattern = window.THE_CRAFT_PATTERNS.find(p => p.id === profile.id);
    if (pattern) { pattern.group = profile.group; pattern.difficulty = profile.level; }
  }
})();
