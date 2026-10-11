const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),write=(p,s)=>fs.writeFileSync(p,s);
const scripts=['haircut-patterns-data.js','haircut-walkthroughs-data.js','assets/new-image-manifest.js','learning-visuals.js','haircut-library-data.js','haircut-library-process.js','fade-training-data.js','lessons.js','app.js'].map(p=>`  <script src="${p}" defer></script>`).join('\n');
let home=read('index.html');
const nav=home.match(/<header class="site-header">[\s\S]*?<\/header>/)[0].replace(' aria-current="page"','').replace('href="#course-path"','href="index.html#course-path"').replace('<a href="haircut-patterns.html">Patterns</a>','<a href="haircuts.html">Haircuts</a>\n      <a href="fade-training.html">Fade course</a>');
const footer=home.match(/<footer[\s\S]*?<\/footer>/)[0];
for(const p of ['index.html','lesson.html','practice.html','quick-reference.html','haircut-patterns.html','haircuts.html','fade-training.html']){
 let s=read(p);
 if(s.includes('<!-- LEARNING_SCRIPTS -->'))s=s.replace('<!-- LEARNING_SCRIPTS -->',scripts).replace('<!-- SHARED_HEADER -->',nav).replace('<!-- SHARED_FOOTER -->',footer);
 else{s=s.replace(/  <script src="haircut-patterns-data.js" defer><\/script>[\s\S]*?  <script src="app.js" defer><\/script>/,scripts);s=s.replace(/<header class="site-header">[\s\S]*?<\/header>/,nav);if(!s.includes('href="learning.css"'))s=s.replace('<link rel="stylesheet" href="styles.css">','<link rel="stylesheet" href="styles.css">\n  <link rel="stylesheet" href="learning.css">');}
 s=s.replace(`<a href="${p}">`,`<a href="${p}" aria-current="page">`);
 write(p,s);
}
let s=read('app.js').replace('return { lessons: [...new Set(savedLessons)]','return { ...saved, lessons: [...new Set(savedLessons)]');
s=s.replace('const region = cutStep && cut.panelRegions[cutStep.panel];','const visual = cutStep && (cutStep.visual || window.CraftVisual.fromSheet(cut, cutStep.panel));\n      const region = visual && visual.region;');
const start=s.indexOf('      const practiceFrame ='),end=s.indexOf('\n',start);
s=s.slice(0,start)+`      const practiceFrame = cutStep ? window.CraftVisual.frame(visual, cutStep.imageAlt, 'practice-process-frame').replace('<div ', '<div data-process-cut="' + escapeHTML(cut.id) + '" data-process-step="' + cutStepIndex + '" ').replace('<img ', '<img data-practice-image ') : '';`+s.slice(end);
write('app.js',s);
s=read('haircut-patterns.js').replace('next: "Next step", advanced: "Advanced"','next: "Intermediate", advanced: "Challenge"');
s=s.replace('    const panel = cut.steps[step] ? cut.steps[step].panel : step;','    const visual = (step >= 100 ? cut.finishedVisuals?.[step - 100] : cut.steps[step]?.visual);\n    if (visual) return window.CraftVisual.frame(visual, alt, className);\n    const panel = cut.steps[step] ? cut.steps[step].panel : step;');
s=s.replace('walkthroughs.filter((cut) => !validIds.has(cut.id))','walkthroughs.filter((cut) => !validIds.has(cut.id)).slice(0, 4)');
s=s.replace('["beginner", "next", "advanced"].map((group)', '["beginner", "next", "advanced"].filter(group => patterns.some(p => p.group === group)).map((group)');
write('haircut-patterns.js',s);
s=read('haircut-library-process.js').replace('    cut.name = profile.name; cut.level = profile.level; cut.group = profile.group; cut.profile = profile;','    cut.name = profile.name; cut.level = profile.level; cut.group = profile.group; cut.profile = profile;\n    const pattern = window.THE_CRAFT_PATTERNS.find(p => p.id === profile.id);\n    if (pattern) { pattern.group = profile.group; pattern.difficulty = profile.level; }');write('haircut-library-process.js',s);
s=read('haircut-patterns.html').replace('All 16 steps · jump to a specific action','All steps · jump to a specific action');
s=s.replace('<div class="additional-cut-grid"', '<p><a class="text-link" href="haircuts.html">Explore all 22 haircut styles and their learning paths →</a></p><div class="additional-cut-grid"');write('haircut-patterns.html',s);
const entry='<section class="learning-entry-links page-width" aria-label="Complete visual training"><a class="learning-entry-link" href="haircuts.html"><p class="eyebrow">22 STYLES · THREE LEARNING LEVELS</p><h2>Choose your next haircut.</h2><p>Compare the starting hair and finished angles, then learn the tools, head considerations and complete process.</p><strong>Explore the Haircut Library →</strong></a><a class="learning-entry-link" href="fade-training.html"><p class="eyebrow">TOOLS · SHAPE · THIRTY VISIBLE ACTIONS</p><h2>Learn how to do a fade.</h2><p>Study the lever and guards, follow seven fade processes, and build control with fourteen focused drills.</p><strong>Open the fade course →</strong></a></section>';
s=read('index.html');if(!s.includes('22 STYLES · THREE'))s=s.replace('<section class="resume-wrap',entry+'\n    <section class="resume-wrap');write('index.html',s);
s=read('practice.html');if(!s.includes('Fourteen focused fade drills'))s=s.replace('<main id="main">','<main id="main"><aside class="page-width learning-safety"><strong>Fourteen focused fade drills</strong> · Practice tool control, guides and shape using matching process images. <a class="text-link" href="fade-training.html?module=practice">Open Fade Quick Practice →</a></aside>');write('practice.html',s);
console.log('Shared navigation, scripts, visuals and progress integration complete.');
