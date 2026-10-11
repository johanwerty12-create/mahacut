(() => {
  "use strict";

  window.THE_CRAFT_PATTERNS = [
    {
      id: "low-taper",
      name: "Low Taper",
      images: { front: "assets/patterns/low-taper-front.webp", side: "assets/patterns/low-taper-side.webp", back: "assets/patterns/low-taper-back.webp" },
      backNote: "Only the lower nape edge tightens; most hair above it stays full.",
      difficulty: "Beginner",
      group: "beginner",
      kind: "taper",
      description: "A small, neat change around the temples and neckline. Most of the sides keep their length.",
      starts: "Sideburns, temples, and neckline",
      shortest: "At the edges only",
      length: "Longer sides; a small, softer edge",
      guard: "Use a longer setting above; shorten cautiously at the outline.",
      practice: "On a mannequin, mark just the temple and neckline areas. Rehearse a light outward flick there, keeping the rest of the side untouched.",
      notices: [
        "The change stays close to the outline.",
        "Most of the side above the ear keeps its length.",
        "Compare both temples and the neckline for balance."
      ]
    },
    {
      id: "low-fade",
      name: "Low Fade",
      images: { front: "assets/patterns/low-fade-front.webp", side: "assets/patterns/low-fade-side.webp", back: "assets/patterns/low-fade-back.webp" },
      backNote: "The blend wraps around low near the nape and joins fuller hair above.",
      difficulty: "Beginner",
      group: "beginner",
      kind: "fade",
      description: "The shorter area stays low by the ears and neckline, then blends gradually into longer hair.",
      starts: "Low around the ears and neckline",
      shortest: "Lower sides and back",
      length: "Short low → gradually longer above",
      guard: "Move from shorter to longer guards in small, tested steps.",
      practice: "On a mannequin, mark a low transition line. Practice three controlled, guarded passes that flick out before the line rises.",
      notices: [
        "The transition stays in the lower part of the sides.",
        "The blend wraps around the back instead of stopping at the ear.",
        "The top and upper sides remain longer."
      ]
    },
    {
      id: "mid-fade",
      name: "Mid Fade",
      images: { front: "assets/patterns/mid-fade-front.webp", side: "assets/patterns/mid-fade-side.webp", back: "assets/patterns/mid-fade-back.webp" },
      backNote: "A short-to-long blend sits across the middle of the back, above the nape and below the crown.",
      difficulty: "Next step",
      group: "next",
      kind: "fade",
      description: "The gradual shorter-to-longer blend sits around the middle of the sides and continues around the head.",
      starts: "Around the middle of the sides",
      shortest: "Lower sides and back",
      length: "Short low → blend through mid-side → longer top",
      guard: "Use neighboring, tested guard lengths; change one setting at a time.",
      practice: "Draw a mid-height guide on a mannequin. Rehearse a steady pass on one panel, then compare its height with the other side.",
      notices: [
        "The guide sits higher than a low fade.",
        "The blend still follows the curve around the head.",
        "Watch that the upper edge does not creep into the top."
      ]
    },
    {
      id: "high-fade",
      name: "High Fade",
      images: { front: "assets/patterns/high-fade-front.webp", side: "assets/patterns/high-fade-side.webp", back: "assets/patterns/high-fade-back.webp" },
      backNote: "The blend starts high across the rear, leaving fuller hair mainly near the crown.",
      difficulty: "Advanced",
      group: "advanced",
      kind: "fade",
      description: "The transition begins much higher on the sides, leaving a smaller area of longer hair above it.",
      starts: "High on the sides, near the temples",
      shortest: "Lower sides and back; the blend begins higher",
      length: "Short low → blend starts high → longer hair remains on top",
      guard: "Map the height first; use only settings you have tested on a mannequin.",
      practice: "On a mannequin, mark the high transition and trace the shape without cutting. Leave skin-close work for supervised practice.",
      notices: [
        "The transition is clearly higher than a mid fade.",
        "Less of the side remains at its longer length.",
        "A high guide is hard to lower again, so map before cutting."
      ]
    },
    {
      id: "buzz-cut",
      name: "Buzz Cut",
      images: { front: "assets/patterns/buzz-cut-front.webp", side: "assets/patterns/buzz-cut-side.webp", back: "assets/patterns/buzz-cut-back.webp" },
      backNote: "The same short length continues over the back; a fade band is not required.",
      difficulty: "Beginner",
      group: "beginner",
      kind: "uniform",
      description: "A short, even length is cut across the top and sides. A buzz cut does not need a fade.",
      starts: "One chosen guard across the cut",
      shortest: "The same chosen length throughout",
      length: "One even length; no fade progression",
      guard: "Choose one conservative, tested guard. Guard numbers vary by clipper.",
      practice: "On a mannequin, use one conservative guard and follow the growth direction in slow, even passes. Brush away loose hair and inspect before repeating.",
      notices: [
        "The top and sides stay close to one length.",
        "The head shape and growth direction affect the result.",
        "A clean outline is separate from a fade."
      ]
    },
    {
      id: "crew-cut",
      name: "Crew Cut / Short Top",
      images: { front: "assets/patterns/crew-cut-front.webp", side: "assets/patterns/crew-cut-side.webp", back: "assets/patterns/crew-cut-back.webp" },
      backNote: "The back tapers up from the neckline into shorter sides while the top remains longer.",
      difficulty: "Next step",
      group: "next",
      kind: "crew",
      description: "The sides are kept short and the top is left a little longer, often shaped with a comb and shears.",
      starts: "Lower sides and back; top stays longer",
      shortest: "Lower sides, with extra length on top",
      length: "Short sides → soft connection → longer top",
      guard: "Use guarded clipper work on the sides; set the top length separately.",
      practice: "On a mannequin, section off the top. Practice clipper control on one side panel without changing the guide at the top.",
      notices: [
        "The top is longer than the sides.",
        "The connection sits near the upper side of the head.",
        "Comb control helps keep the top shape even."
      ]
    },
    {
      id: "classic-taper",
      name: "Classic Taper",
      images: { front: "assets/patterns/classic-taper-front.webp", side: "assets/patterns/classic-taper-side.webp", back: "assets/patterns/classic-taper-back.webp" },
      backNote: "The back stays full above a neat, localized taper at the nape.",
      difficulty: "Beginner",
      group: "beginner",
      kind: "classic",
      description: "Length reduces gradually down the sides and back, while the temples and neckline finish neatly.",
      starts: "Gradually through the sides; neatest at temples and neckline",
      shortest: "Near the sideburns and neckline",
      length: "Longer upper sides → steadily shorter toward the edges",
      guard: "Work through longer, tested settings first; do not assume one universal sequence.",
      practice: "On a mannequin, map a broad change from upper side to neckline. Practice light passes and compare the length from front to back.",
      notices: [
        "The change extends farther up the side than a low taper.",
        "The lower edge is neat without removing the whole side.",
        "The top and sides meet in a gradual, balanced shape."
      ]
    },
    {
      id: "drop-fade",
      name: "Drop Fade",
      images: { front: "assets/patterns/drop-fade-front.webp", side: "assets/patterns/drop-fade-side.webp", back: "assets/patterns/drop-fade-back.webp" },
      backNote: "The fade curves lower behind the ears and rises toward the center back.",
      difficulty: "Advanced",
      group: "advanced",
      kind: "drop",
      description: "A fade whose transition curves down behind the ear, following the back curve of the head.",
      starts: "On the sides, then dips behind the ear toward the back",
      shortest: "Lower sides and back beneath the curved blend",
      length: "Short low → curved blend → longer hair above and on top",
      guard: "Map both sides of the curve; use tested guards and supervised practice.",
      practice: "On a mannequin, draw the curve from temple to the area behind the ear. Rehearse the changing height before attempting any cut.",
      notices: [
        "The guide is curved, not level around the head.",
        "It dips lower behind the ear toward the back.",
        "Compare the curve on both sides before cutting."
      ]
    }
  ];
})();
