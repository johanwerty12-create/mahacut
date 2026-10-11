(() => {
  'use strict';

  const base = { top: 34, crown: 31, leftSide: 30, rightSide: 30, back: 29, leftTemple: 27, rightTemple: 27, leftSideburn: 24, rightSideburn: 24, leftBehindEar: 27, rightBehindEar: 27, neckline: 24 };
  const makeTarget = values => ({ ...base, ...values });
  const styles = [
    { id:'buzz-cut', name:'Buzz Cut', level:'LEVEL 1 · BEGINNER', group:'uniform', shape:'oval', recommendedGuard:'#3', target:makeTarget({top:10,crown:10,leftSide:10,rightSide:10,back:10,leftTemple:10,rightTemple:10,leftSideburn:10,rightSideburn:10,leftBehindEar:10,rightBehindEar:10,neckline:10}), note:'One even length all around. No fade bands.' },
    { id:'crew-cut', name:'Crew Cut', level:'LEVEL 2 · BEGINNER', group:'short-top', shape:'square', recommendedGuard:'#3', target:makeTarget({top:25,crown:18,leftSide:9,rightSide:9,back:8,leftTemple:6,rightTemple:6,leftSideburn:5,rightSideburn:5,leftBehindEar:7,rightBehindEar:7,neckline:5}), note:'Short sides connect into a controlled, longer top.' },
    { id:'classic-taper', name:'Classic Taper', level:'LEVEL 3 · BEGINNER', group:'taper', shape:'oval', recommendedGuard:'#1', target:makeTarget({top:27,crown:21,leftSide:17,rightSide:17,back:16,leftTemple:8,rightTemple:8,leftSideburn:5,rightSideburn:5,leftBehindEar:12,rightBehindEar:12,neckline:5}), note:'Keep the side full; shorten only the temple, sideburn and neckline edges.' },
    { id:'low-taper', name:'Low Taper', level:'LEVEL 4 · BEGINNER', group:'taper', shape:'heart', recommendedGuard:'#1', target:makeTarget({top:30,crown:24,leftSide:20,rightSide:20,back:18,leftTemple:7,rightTemple:7,leftSideburn:4,rightSideburn:4,leftBehindEar:7,rightBehindEar:7,neckline:4}), note:'A compact edge taper with most of the side length preserved.' },
    { id:'low-fade', name:'Low Fade', level:'LEVEL 5 · BEGINNER', group:'fade', guidePhi:1.56, shape:'oval', recommendedGuard:'#0.5', target:makeTarget({top:32,crown:24,leftSide:13,rightSide:13,back:10,leftTemple:6,rightTemple:6,leftSideburn:3,rightSideburn:3,leftBehindEar:5,rightBehindEar:5,neckline:3}), note:'The blend stays low near the ears and neckline.' },
    { id:'mid-fade', name:'Mid Fade', level:'LEVEL 6 · INTERMEDIATE', group:'fade', guidePhi:1.32, shape:'square', recommendedGuard:'#0.5', target:makeTarget({top:29,crown:21,leftSide:9,rightSide:9,back:8,leftTemple:4,rightTemple:4,leftSideburn:2,rightSideburn:2,leftBehindEar:4,rightBehindEar:4,neckline:2}), note:'The transition sits around the middle of the sides.' },
    { id:'high-fade', name:'High Fade', level:'LEVEL 7 · ADVANCED', group:'fade', guidePhi:1.08, shape:'diamond', recommendedGuard:'#0.5', target:makeTarget({top:26,crown:17,leftSide:6,rightSide:6,back:5,leftTemple:3,rightTemple:3,leftSideburn:1,rightSideburn:1,leftBehindEar:3,rightBehindEar:3,neckline:1}), note:'The transition sits high near the temples; protect the top boundary.' },
    { id:'drop-fade', name:'Drop Fade', level:'LEVEL 8 · ADVANCED', group:'drop', guidePhi:1.34, shape:'round', recommendedGuard:'#0.5', target:makeTarget({top:30,crown:23,leftSide:9,rightSide:9,back:15,leftTemple:4,rightTemple:4,leftSideburn:2,rightSideburn:2,leftBehindEar:8,rightBehindEar:8,neckline:6}), note:'The transition curves down behind the ear toward the nape.' },
    { id:'taper-fade', name:'Taper Fade', level:'LEVEL 9 · INTERMEDIATE', group:'taper-fade', guidePhi:1.52, shape:'oblong', recommendedGuard:'#1', target:makeTarget({top:31,crown:24,leftSide:18,rightSide:18,back:16,leftTemple:5,rightTemple:5,leftSideburn:3,rightSideburn:3,leftBehindEar:7,rightBehindEar:7,neckline:3}), note:'A gradual fade is concentrated at the temples and neckline.' },
    { id:'textured-crop', name:'Textured Crop', level:'LEVEL 10 · INTERMEDIATE', group:'crop', shape:'square', recommendedGuard:'#2', target:makeTarget({top:18,crown:14,leftSide:7,rightSide:7,back:7,leftTemple:5,rightTemple:5,leftSideburn:4,rightSideburn:4,leftBehindEar:5,rightBehindEar:5,neckline:4}), note:'A short, textured top falls forward over tighter sides.' },
    { id:'french-crop', name:'French Crop', level:'LEVEL 11 · INTERMEDIATE', group:'crop', shape:'oblong', recommendedGuard:'#2', target:makeTarget({top:17,crown:13,leftSide:6,rightSide:6,back:6,leftTemple:4,rightTemple:4,leftSideburn:3,rightSideburn:3,leftBehindEar:4,rightBehindEar:4,neckline:3}), note:'Keep the top short and forward with a controlled fringe.' },
    { id:'ivy-league', name:'Ivy League', level:'LEVEL 12 · INTERMEDIATE', group:'short-top', shape:'diamond', recommendedGuard:'#2', target:makeTarget({top:24,crown:17,leftSide:9,rightSide:9,back:8,leftTemple:6,rightTemple:6,leftSideburn:5,rightSideburn:5,leftBehindEar:7,rightBehindEar:7,neckline:5}), note:'Retain enough front length to part and style naturally.' },
    { id:'side-part', name:'Side Part', level:'LEVEL 13 · INTERMEDIATE', group:'long-top', shape:'oval', recommendedGuard:'#2', target:makeTarget({top:36,crown:25,leftSide:13,rightSide:13,back:12,leftTemple:8,rightTemple:8,leftSideburn:6,rightSideburn:6,leftBehindEar:9,rightBehindEar:9,neckline:6}), note:'Shape both sides of the natural part while preserving movement.' },
    { id:'slick-back', name:'Slick Back', level:'LEVEL 14 · INTERMEDIATE', group:'long-top', shape:'oblong', recommendedGuard:'#2', target:makeTarget({top:44,crown:31,leftSide:16,rightSide:16,back:14,leftTemple:9,rightTemple:9,leftSideburn:7,rightSideburn:7,leftBehindEar:11,rightBehindEar:11,neckline:7}), note:'Keep front length and connect it through the crown for a backward sweep.' },
    { id:'scissor-over-comb', name:'Scissor Over Comb', level:'LEVEL 15 · INTERMEDIATE', group:'scissor', shape:'round', recommendedGuard:'#2', target:makeTarget({top:28,crown:20,leftSide:12,rightSide:12,back:11,leftTemple:8,rightTemple:8,leftSideburn:6,rightSideburn:6,leftBehindEar:9,rightBehindEar:9,neckline:6}), note:'Lift hair with the comb, then cut only what extends beyond its teeth.' },
    { id:'scissor-cut', name:'Scissor Cut', level:'LEVEL 16 · INTERMEDIATE', group:'scissor-cut', shape:'oval', recommendedGuard:'#2', target:makeTarget({top:35,crown:28,leftSide:24,rightSide:24,back:22,leftTemple:17,rightTemple:17,leftSideburn:14,rightSideburn:14,leftBehindEar:18,rightBehindEar:18,neckline:12}), note:'Use comb-guided sections to shape the top and sides while preserving a soft natural outline.' },
    { id:'skin-fade', name:'Skin / Bald Fade', level:'LEVEL 17 · ADVANCED', group:'skin', guidePhi:1.34, shape:'square', recommendedGuard:'No guard', target:makeTarget({top:31,crown:22,leftSide:5,rightSide:5,back:4,leftTemple:1,rightTemple:1,leftSideburn:0.5,rightSideburn:0.5,leftBehindEar:2,rightBehindEar:2,neckline:0.5}), note:'Advanced close work. Practice on a mannequin and learn under experienced supervision.' },
    { id:'burst-fade', name:'Burst Fade', level:'LEVEL 18 · ADVANCED', group:'burst', guidePhi:1.3, shape:'heart', recommendedGuard:'#0.5', target:makeTarget({top:31,crown:25,leftSide:13,rightSide:13,back:22,leftTemple:6,rightTemple:6,leftSideburn:3,rightSideburn:3,leftBehindEar:5,rightBehindEar:5,neckline:14}), note:'A rounded fade circles the ear; keep the back fuller.' },
    { id:'high-and-tight', name:'High and Tight', level:'LEVEL 19 · ADVANCED', group:'military', guidePhi:1.02, shape:'square', recommendedGuard:'#1', target:makeTarget({top:13,crown:10,leftSide:3,rightSide:3,back:3,leftTemple:2,rightTemple:2,leftSideburn:1,rightSideburn:1,leftBehindEar:2,rightBehindEar:2,neckline:1}), note:'Very short high sides meet a compact top cap.' },
    { id:'longer-textured-cut', name:'Longer Textured Cut', level:'LEVEL 20 · ADVANCED', group:'long-top', shape:'diamond', recommendedGuard:'#3', target:makeTarget({top:42,crown:33,leftSide:27,rightSide:27,back:27,leftTemple:22,rightTemple:22,leftSideburn:16,rightSideburn:16,leftBehindEar:23,rightBehindEar:23,neckline:14}), note:'Use small scissor sections to shape layers while keeping the natural perimeter.' },
    { id:'modern-pompadour', name:'Modern Pompadour', level:'LEVEL 21 · ADVANCED', group:'pompadour', shape:'oval', recommendedGuard:'#2', target:makeTarget({top:52,crown:29,leftSide:13,rightSide:13,back:12,leftTemple:8,rightTemple:8,leftSideburn:6,rightSideburn:6,leftBehindEar:9,rightBehindEar:9,neckline:6}), note:'Build a supported longer front and connect it into a shorter crown.' }
  ];

  const look = () => ({ id:'head-check', type:'look', title:'Read the head before cutting', copy:'Rotate the client and check the shape, growth direction and natural hairline before choosing your first pass.', views:['front','left','right','back'], hint:'Look for the crown swirl, temple corners and the length the client wants to keep.' });
  const cut = (id,title,copy,regions,tool='clipper',guard='#1',lever='closed',more={}) => ({ id,type:'cut',title,copy,regions,tool,guard,lever,passes:1,movement:'pass',...more });
  const finish = () => ({ id:'final-check', type:'inspect', title:'Inspect the finished shape', copy:'Rotate the client again. Compare both sides, the back, top and hairline with the requested style.', views:['front','left','right','back'], hint:'Small natural differences are normal. Review the shape before you finish.' });

  function stagesFor(style) {
    const lead = [look()];
    const end = [finish()];
    if (style.group === 'uniform') return [...lead,
      cut('buzz-top','Set the chosen length on top','Use one guard for the whole cut. Follow the local growth direction and let the guard do the work.',['top'],'clipper',style.recommendedGuard,'closed',{passes:2,movement:'pass'}),
      cut('buzz-left','Carry the same length through the left side','Keep the same guard. Reposition around the head rather than pushing against a growth swirl.',['leftSide'],'clipper',style.recommendedGuard,'closed',{passes:2}),
      cut('buzz-right','Match the right side','The opposite side should keep the same selected length. Check the silhouette as you move.',['rightSide'],'clipper',style.recommendedGuard,'closed',{passes:2}),
      cut('buzz-back','Even out the back','Follow the skull curve with overlapping guarded passes.',['back'],'clipper',style.recommendedGuard,'closed',{passes:2}),
      cut('buzz-edge','Clean the agreed neckline','Use a detail trimmer lightly along the natural neckline.',['neckline'],'trimmer','No guard','closed',{movement:'edge',passes:1})
    ,...end];

    if (style.id === 'classic-taper') return [...lead,
      cut('classic-side-length','Preserve the full side shape','Use a longer guard on each side and the back. Keep the weight; this is a taper, not a full-side fade.',['leftSide','rightSide','back'],'clipper','#4','open',{movement:'pass',passes:1}),
      cut('classic-temples','Build a soft temple blend','Start with a conservative short setting at the temple and flick away before the longer side.',['leftTemple','rightTemple'],'clipper','#1','half',{movement:'flick',phiRange:[1.02,1.42]}),
      cut('classic-sideburns','Narrow the sideburns','Blend only the short sideburn area into the full side. Keep the natural outline unless the client asks otherwise.',['leftSideburn','rightSideburn'],'clipper','#0.5','closed',{movement:'flick'}),
      cut('classic-nape','Taper the lower neckline','Keep the nape cleanup close to the neckline and leave the back full above it.',['neckline'],'clipper','#0.5','closed',{movement:'flick'}),
      cut('classic-connect','Check the weight connection','Lift a small section with the comb and remove only the visible excess.',['leftSide','rightSide'],'clipper','#2','open',{movement:'flick',requiresComb:true}),...end];

    if (style.id === 'low-taper') return [...lead,
      cut('lowtaper-temples','Place a low temple taper','Keep the blend compact at the temple corners; most of each side stays long.',['leftTemple','rightTemple'],'clipper','#0.5','closed',{movement:'flick',phiRange:[1.1,1.58]}),
      cut('lowtaper-sideburns','Reduce the sideburn edges','Blend the sideburn into the short temple area without carrying a short band across the side.',['leftSideburn','rightSideburn'],'clipper','#0.5','half',{movement:'flick'}),
      cut('lowtaper-behind-ear','Keep the taper low behind the ear','Follow the lower curve behind each ear. Preserve the fuller area above the small taper.',['leftBehindEar','rightBehindEar'],'clipper','#1','closed',{movement:'flick',phiRange:[1.48,1.82]}),
      cut('lowtaper-nape','Taper the nape edge','Work close to the neckline with a short flick; stop before the full back becomes a fade.',['neckline'],'clipper','#0.5','closed',{movement:'flick'}),
      cut('lowtaper-outline','Refine only the agreed outline','Use the detail trimmer lightly around the sideburn and neckline perimeter.',['leftSideburn','rightSideburn','neckline'],'trimmer','No guard','closed',{movement:'edge'}),...end];

    if (style.id === 'crew-cut') return [...lead,
      cut('crew-sides','Set the short sides','Use a guarded pass on the sides and back. Keep the top section protected and leave more length toward the front.',['leftSide','rightSide','back'],'clipper','#3','open',{movement:'pass',phiRange:[.94,2.04]}),
      cut('crew-back','Bring the back into the shorter profile','Use the next shorter setting on the back only. Follow the skull curve and compare the nape with both sides.',['back'],'clipper','#2','open',{movement:'flick',phiRange:[1.28,2.04]}),
      cut('crew-top-comb','Lift the top in narrow sections','Comb the top upward so the guide length is easy to see before cutting.',['top','crown'],'comb','—','—',{movement:'comb'}),
      cut('crew-top','Graduate the top from front to crown','Use short shear passes: retain a little more length at the front and reduce toward the crown.',['top','crown'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2}),
      cut('crew-connect','Connect the short side to the top','Use clipper-over-comb at the weight line; keep the clipper outside the comb.',['leftSide','rightSide'],'clipper','#2','open',{movement:'flick',requiresComb:true}),
      cut('crew-edge','Clean the natural perimeter','Detail around both temples and the neckline without pushing the hairline back.',['leftTemple','rightTemple','neckline'],'trimmer','No guard','closed',{movement:'edge'}),...end];

    if (style.id === 'ivy-league') return [...lead,
      cut('ivy-sides','Keep the sides neat and connected','Use a moderate guard on the sides and back; avoid taking the side as short as a high fade.',['leftSide','rightSide','back'],'clipper','#3','open',{movement:'pass'}),
      cut('ivy-part','Comb the top toward its natural part','Find the natural parting direction and keep the front long enough to move across it.',['top','crown'],'comb','—','—',{movement:'comb'}),
      cut('ivy-top','Shape a short, partable top','Use comb-guided shear sections. Keep extra length at the front and connect it through the crown.',['top','crown'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2}),
      cut('ivy-connect','Soften the upper weight line','Use small clipper-over-comb touches only where the top meets the side.',['leftSide','rightSide'],'clipper','#2','open',{movement:'flick',requiresComb:true}),
      cut('ivy-finish','Check the part and outline','Detail the agreed edges, then inspect the front fall and both profiles.',['leftTemple','rightTemple','neckline'],'trimmer','No guard','closed',{movement:'edge'}),...end];

    if (style.id === 'textured-crop' || style.id === 'french-crop') {
      const french=style.id==='french-crop';
      return [...lead,
        cut('crop-sides','Set the short sides and back','Use a guarded pass below the top boundary; keep the front section available for the crop shape.',['leftSide','rightSide','back'],'clipper','#3','open',{movement:'pass',phiRange:[.82,2.02]}),
        cut('crop-comb','Direct the top forward','Comb the top toward the forehead. Keep the comb close and move the hair in small sections.',['top','crown'],'comb','—','—',{movement:'comb'}),
        cut(french?'french-fringe':'textured-top',french?'Shape a clean, controlled fringe':'Add soft texture through the top','Use short shear touches. For a French crop, keep the fringe line intentional; for a textured crop, point the shears lightly into the ends.',['top','crown'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2}),
        cut('crop-connect','Connect the upper side','Lift small panels with the comb and clip only the hair extending beyond it.',['leftSide','rightSide'],'clipper','#2','open',{movement:'flick',requiresComb:true}),
        cut('crop-finish','Check fringe balance and edges','Compare the front fringe from straight on, then refine only the agreed outline.',['leftTemple','rightTemple','neckline'],'trimmer','No guard','closed',{movement:'edge'}),...end];
    }

    if (style.id === 'side-part' || style.id === 'slick-back' || style.id === 'longer-textured-cut') {
      const slick=style.id==='slick-back',textured=style.id==='longer-textured-cut';
      return [...lead,
        cut('long-side-shape',textured?'Preserve the natural side length':'Neaten the sides without removing the top length',textured?'Comb the sides into their fall and remove only the agreed excess. Keep the outline soft.':'Use a conservative guard on the sides and back; do not shorten the longer top.', ['leftSide','rightSide','back'],textured?'scissors':'clipper',textured?'—':'#3',textured?'—':'open',{movement:textured?'shear':'pass',requiresComb:textured,passes:textured?2:1}),
        cut('long-comb',slick?'Direct the top toward the back':textured?'Comb a narrow top section into its fall':'Establish the natural side part','Use the comb to direct the hair before shaping; follow the client’s natural growth and part.',['top','crown'],'comb','—','—',{movement:'comb'}),
        cut('long-top',slick?'Connect the front sweep through the crown':textured?'Shape soft layers with small shear sections':'Shape the top on both sides of the part','Cut small comb-guided sections and keep checking the front length before removing more.',['top','crown'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2}),
        cut('long-connect',textured?'Remove small side weight with shears':'Connect the side weight carefully',textured?'Comb a narrow panel out and trim only the ends beyond it. Keep the natural length and outline.':'Lift a narrow panel and make small clipper-over-comb corrections only where needed.',['leftSide','rightSide'],textured?'scissors':'clipper',textured?'—':'#2',textured?'—':'open',{movement:textured?'shear':'flick',requiresComb:true,shearLength:textured?24:undefined}),
        cut('long-finish','Keep the outline natural','Refine the agreed temple and neckline edges without creating a high contrast band.',['leftTemple','rightTemple','neckline'],'trimmer','No guard','closed',{movement:'edge'}),...end];
    }

    if (style.id === 'modern-pompadour') return [...lead,
      cut('pomp-sides','Set a neat supporting side length','Use a guarded pass on sides and back. Keep the top long and avoid cutting into the front profile.',['leftSide','rightSide','back'],'clipper','#4','open',{movement:'pass'}),
      cut('pomp-comb','Lift and direct the long front','Comb the front upward and back so the longer section is visible before shaping.',['top','crown'],'comb','—','—',{movement:'comb'}),
      cut('pomp-front','Preserve and shape the front height','Take small shear sections through the front. Check the silhouette often and keep more length than the crown.',['top'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2}),
      cut('pomp-crown','Connect the front into a shorter crown','Reduce the crown gradually with short shear-over-comb sections; avoid a sudden step behind the front.',['crown'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2}),
      cut('pomp-connect','Blend the supporting sides','Make small clipper-over-comb corrections at the side weight line.',['leftSide','rightSide'],'clipper','#3','open',{movement:'flick',requiresComb:true}),
      cut('pomp-finish','Inspect the front and outline','Compare the front silhouette and both profiles; detail only the agreed perimeter.',['leftTemple','rightTemple','neckline'],'trimmer','No guard','closed',{movement:'edge'}),...end];

    if (style.id === 'high-and-tight') return [...lead,
      cut('tight-sides','Create a short, high side shape','Work the high sides and back with a guarded pass, stopping at a clear top boundary.',['leftSide','rightSide','back'],'clipper','#2','open',{movement:'pass',phiRange:[.75,2.02]}),
      cut('tight-map','Check the high boundary before connecting','Follow the highlighted high edge on both sides. Keep the shape balanced rather than taking the line higher.',['leftSide','rightSide'],'clipper','#1','closed',{movement:'guide',guidePhi:1.02,guideTolerance:.24}),
      cut('tight-top','Set the compact top','Use a slightly longer guarded pass over the top and crown, keeping the top short and even.',['top','crown'],'clipper','#2','open',{movement:'pass',passes:2}),
      cut('tight-connect','Soften the boundary with a flick','Use a short upward flick just under the boundary; keep the small top cap intact.',['leftSide','rightSide'],'clipper','#2','half',{movement:'flick',phiRange:[.82,1.22]}),
      cut('tight-back','Match the short back','Follow the skull and keep the back length consistent with the side plan.',['back'],'clipper','#1','open',{movement:'pass'}),
      cut('tight-finish','Clean the natural outline','Use the trimmer only along the agreed temple and neckline edges.',['leftTemple','rightTemple','neckline'],'trimmer','No guard','closed',{movement:'edge'}),...end];

    if (style.group === 'taper') return [...lead,
      cut('taper-left-temple','Shape the left temple taper','Keep the short area small at the temple; preserve the surrounding side length.',['leftTemple'],'clipper','#0.5','closed',{passes:1,movement:'flick'}),
      cut('taper-right-temple','Balance the right temple','Match the taper height and keep the corner natural unless a sharper outline was requested.',['rightTemple'],'clipper','#0.5','closed',{passes:1,movement:'flick'}),
      cut('taper-sideburns','Refine both sideburns','Work just at the sideburn edges. Do not carry a short band across the whole side.',['leftSideburn','rightSideburn'],'trimmer','No guard','closed',{passes:1,movement:'edge'}),
      cut('taper-nape','Taper the neckline','Clean a small nape area and keep the back full above it.',['neckline'],'trimmer','No guard','closed',{movement:'edge'}),
      cut('taper-connect','Connect the top without hollowing the sides','Lift only a small amount with the comb and connect the weight line carefully.',['leftSide','rightSide'],'clipper',style.recommendedGuard,'open',{movement:'flick',requiresComb:true})
    ,...end];

    if (['fade','drop','taper-fade','skin','burst','military'].includes(style.group)) {
      const isTaperFade = style.group === 'taper-fade';
      const shortGuard = style.group === 'skin' ? 'No guard' : style.group === 'military' ? '#0.5' : '#0.5';
      const guidePhi = style.guidePhi || 1.4;
      const zone = isTaperFade ? ['leftTemple','rightTemple','neckline'] : ['leftSide','rightSide'];
      const baseFade = [
        cut('fade-bulk','Remove the planned bulk','Use a longer guard to reduce the lower side and back. Keep the transition boundary and longer top in mind.',['leftSide','rightSide','back'],'clipper','#3','open',{passes:1,movement:'pass',phiRange:[guidePhi,2.02],pattern:style.group}),
        cut('fade-map','Create the first guideline','Drag a narrow line at the selected height. This real guide gives the next length a boundary to blend into.',['leftSide','rightSide'],'clipper','#1','closed',{passes:1,movement:'guide',guidePhi,guideTolerance:0.2,pattern:style.group}),
        cut('fade-first-band','Set the shortest planned band','Stay below the guide. The shorter zone should remain inside the shape you mapped.',['leftSide','rightSide'],'clipper',shortGuard,'closed',{passes:1,movement:'pass',phiRange:[Math.min(1.9,guidePhi+0.05),2.02],pattern:style.group}),
        cut('fade-next-band','Build the neighboring length','Use a longer setting just above the short zone. Leave room to blend the two lengths.',['leftSide','rightSide'],'clipper','#1.5','half',{passes:1,movement:'flick',phiRange:[Math.max(0.72,guidePhi-0.28),guidePhi-0.06],pattern:style.group}),
        cut('fade-blend','Soften the visible transition','Move upward in a short pass, then lift the clipper away near the end. Do not chase the line higher.',['leftSide','rightSide'],'clipper','#1','half',{passes:1,movement:'flick',phiRange:[guidePhi-0.18,guidePhi+0.18],pattern:style.group}),
        cut('fade-connect','Connect the upper side','Use the comb to protect the longer weight. Cut only the hair that extends beyond it.',['leftSide','rightSide'],'clipper','#2','open',{movement:'flick',requiresComb:true,phiRange:[0.62,Math.max(0.8,guidePhi-0.16)],pattern:style.group}),
        cut('fade-back','Carry the shape through the back','Follow the skull curve. A drop fade dips lower behind the ear; a burst keeps a fuller back.',['back'],'clipper','#1.5','half',{movement:'flick',pattern:style.group}),
        cut('fade-detail','Detail the agreed edges','Use the trimmer with a light touch around the temples, sideburns and neckline.',['leftTemple','rightTemple','leftSideburn','rightSideburn','neckline'],'trimmer','No guard','closed',{movement:'edge',pattern:style.group})
      ];
      if (style.group === 'burst') baseFade.splice(1,1,cut('burst-arc','Trace the rounded guide around the ear','Drag a curved guide around the ear. Keep the back and nape outside the short arc.',['leftBehindEar','rightBehindEar'],'clipper','#1','closed',{movement:'guide',guidePhi,guideTolerance:0.28,pattern:'burst'}));
      if (style.group === 'taper-fade') return [...lead,
        cut('taperfade-temples','Set the small temple transition','Keep the short blend at the temple and sideburn. Most of the side stays full.',['leftTemple','rightTemple'],'clipper','#1','closed',{movement:'flick'}),
        cut('taperfade-nape','Blend only the neckline','Work the nape edge without carrying the fade across the full back.',['neckline'],'clipper','#0.5','closed',{movement:'flick'}),
        cut('taperfade-detail','Clean the outline','Use the trimmer only on the agreed temple, sideburn and neckline edges.',['leftTemple','rightTemple','leftSideburn','rightSideburn','neckline'],'trimmer','No guard','closed',{movement:'edge'}),
        cut('taperfade-connect','Keep the side weight connected','Use clipper-over-comb only where a visible weight line needs a small correction.',['leftSide','rightSide'],'clipper','#2','open',{movement:'flick',requiresComb:true}),...end];
      if (style.group === 'skin') baseFade.splice(3,0,cut('skin-plan','Practice the close finish on the model','Use short razor strokes on the lower fade area in this simulation. Real razor work needs trained supervision and appropriate skin preparation.',['leftSide','rightSide'],'razor','—','—',{movement:'edge',passes:1,pattern:'skin'}));
      if (style.group === 'military') baseFade.splice(5,0,cut('tight-top','Shape the short top cap','Keep the high boundary clear and use a conservative guard over the compact top.',['top'],'clipper','#2','open',{movement:'pass',passes:2}));
      return [...lead,...baseFade,...end];
    }

    if (style.group === 'scissor-cut') return [...lead,
      cut('scissor-top-comb','Comb the top into its natural fall','Work through a narrow top section. Let the comb show the direction and length before cutting.',['top','crown'],'comb','—','—',{movement:'comb'}),
      cut('scissor-top','Shape the top in small sections','Cut only the ends extending beyond the comb. Recheck the front length before taking more.',['top','crown'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2}),
      cut('scissor-left-comb','Lift the left side with the comb','Keep the comb close to the head and lift a small panel evenly.',['leftSide'],'comb','—','—',{movement:'comb'}),
      cut('scissor-left','Shape the left profile','Use short shear closures beyond the comb. Follow the head shape and retain the agreed weight.',['leftSide'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2}),
      cut('scissor-right-comb','Lift the right side with the comb','Repeat the same panel size and compare the profile with the left.',['rightSide'],'comb','—','—',{movement:'comb'}),
      cut('scissor-right','Balance the right profile','Remove only what extends beyond the comb, then compare both sides from the front.',['rightSide'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2}),
      cut('scissor-back-comb','Direct the back section','Comb the back down in its natural fall and keep the outline conservative.',['back'],'comb','—','—',{movement:'comb'}),
      cut('scissor-back','Refine the back outline','Use small shear cuts to connect the back without hollowing the occipital area.',['back'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2}),
      cut('scissor-finish','Check the perimeter','Use the trimmer only for the agreed neckline and temple cleanup.',['leftTemple','rightTemple','neckline'],'trimmer','No guard','closed',{movement:'edge'}),...end];

    const topSteps = [
      cut('side-bulk','Remove side bulk gradually','Start with a longer checked guard and preserve the top section.',['leftSide','rightSide','back'],'clipper','#3','open',{passes:1,movement:'pass'}),
      cut('top-section','Control the top with a comb','Comb a narrow section into its natural fall. This positions the hair; the comb does not cut it.',['top','crown'],'comb','—','—',{movement:'comb',passes:1}),
      cut('top-shear','Shape the top with shears','Position the comb or fingers, then cut only the hair extending beyond the control section.',['top','crown'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2}),
      cut('side-connect','Connect the top to the side','Use clipper-over-comb in small sections. Keep the clipper outside the comb.',['leftSide','rightSide'],'clipper','#2','open',{movement:'flick',requiresComb:true,passes:1}),
      cut('short-outline','Refine the outline','Use the trimmer for agreed edge cleanup around both ears and the neckline.',['leftTemple','rightTemple','leftSideburn','rightSideburn','neckline'],'trimmer','No guard','closed',{movement:'edge'})
    ];
    if (style.group === 'crop') topSteps.splice(2,1,cut('crop-top','Shape the forward top','Comb the top toward the forehead. Use controlled shear touches and protect the agreed fringe length.',['top','crown'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2}));
    if (style.group === 'scissor') topSteps.splice(0,1,cut('scissor-side','Set the sides with scissor-over-comb','Lift a small panel with the comb, then cut only the hair extending beyond it.',['leftSide','rightSide','back'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2}));
    if (style.group === 'long-top') topSteps.splice(0,1,cut('long-shape','Preserve and shape the long side','Comb the hair in natural fall. Remove only the length needed for the agreed outline.',['leftSide','rightSide'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:1}));
    if (style.group === 'pompadour') topSteps[2] = cut('pompadour-top','Build the longer front','Preserve the front length and connect toward the shorter crown using a visible shear guide.',['top','crown'],'scissors','—','—',{movement:'shear',requiresComb:true,passes:2});
    return [...lead,...topSteps,...end];
  }

  styles.forEach(style => {
    style.steps = stagesFor(style);
    for (const step of style.steps) {
      if (step.tool === 'scissors' && !Number.isFinite(step.shearLength)) {
        const lengths = step.regions.map(region => style.target[region] ?? style.target.top ?? 25);
        step.shearLength = Math.round(Math.max(8, ...lengths));
      }
    }
  });
  window.THE_CRAFT_SIM_3D = { styles, initialHairLength:22, guards:[['No guard',0.8],['#0.5',1.5],['#1',3],['#1.5',4.5],['#2',6],['#3',10],['#4',13]], leverOffsets:{closed:0,half:1.2,open:2.4} };
})();
