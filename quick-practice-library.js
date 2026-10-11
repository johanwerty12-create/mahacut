(() => {
  'use strict';
  const categories = [
    { id: 'foundation', name: 'Foundation', note: 'Set up safely, identify the tool, and rehearse comfortable hand positions before turning a tool on.' },
    { id: 'clipper-control', name: 'Clipper Control', note: 'Learn one lever or movement at a time. Keep the tool off while changing guards and settings.' },
    { id: 'fade-practice', name: 'Fade Practice', note: 'Read the placement and length changes. Practice a narrow section and stop to brush and inspect.' },
    { id: 'taper-practice', name: 'Taper Practice', note: 'Keep the working area local to the temple, sideburn or nape while retaining fuller side hair.' },
    { id: 'scissor-practice', name: 'Scissor Practice', note: 'Keep fingers clear, use small sections and close the shears before repositioning.' },
    { id: 'finishing', name: 'Finishing', note: 'Work only to the agreed outline, protect skin, and compare both sides before a correction.' }
  ];
  const drills = [
    ['foundation','Station setup','Lay out and check a clean cape, working clipper, guards, comb, shears, brush and mirror in their order of use.','Reset the station three times without mixing clean and used tools.','low-fade','tools'],
    ['foundation','Tool identification','Name the clipper, lever, guard, comb, shears and brush. Point out where each tool contacts hair.','Identify six tools and explain their purpose without switching them on.','low-fade','tools'],
    ['foundation','Clipper grip','Hold the clipper lightly with a steady wrist. Rehearse a short upward path and lift away at the end.','Repeat six slow, tool-off paths while keeping the wrist relaxed.','low-fade','initial-length'],
    ['foundation','Comb grip','Rehearse holding the comb comfortably and feeding a short section without pulling the scalp.','Comb four small side sections in natural fall.','low-fade','top'],
    ['foundation','Scissor grip','Place thumb and ring finger comfortably in the shears; open and close with controlled thumb movement.','Open and close slowly ten times, with blades aimed away from skin.','scissor-cut','top'],
    ['foundation','Safe tool handling','Rehearse changing position with shears closed; protect the ear and keep the clipper path controlled.','Practice a safe reposition six times with tools off.','low-fade','finish'],
    ['clipper-control','Clipper closed','On the actual tool, identify the closed lever position and listen or feel for the detent without cutting.','Find and name the shortest lever position five times with the tool off.','low-fade','lever','tool',0],
    ['clipper-control','Clipper half-open','Move to a comfortable middle lever position; not every model has the same detents.','Find your middle position five times; record your tool model.','low-fade','lever','tool',1],
    ['clipper-control','Clipper fully open','Identify your clipper’s open lever position and compare it with the maker’s guidance.','Find the open position five times with the tool off.','low-fade','lever','tool',2],
    ['clipper-control','Lever control','Change one lever position at a time. Compare only on a mannequin swatch and brush before judging.','Rehearse closed → middle → open, then return to the recorded start.','low-fade','lever','tool',1],
    ['clipper-control','Guard changes','Switch off or move the blade safely clear; seat a compatible guard and check its fit.','Attach, check and identify three guards before a mannequin pass.','low-fade','guard-changes','tool',9],
    ['clipper-control','Clipper movement','Follow a mannequin’s surface with light pressure. Reposition instead of forcing the blade.','Repeat six short upward motions on one small area, then stop.','low-fade','first-length'],
    ['clipper-control','Flick-out motion','Practice an upward path that gradually leaves the head at the end; avoid digging in or rocking sharply.','Make six slow flick-out passes on a guarded mannequin area.','low-fade','transition',10],
    ['clipper-control','Creating even passes','Use overlapping, repeatable passes at one tested setting, then brush away loose hair.','Cover a small mannequin panel twice and inspect for skipped patches.','low-fade','second-blend'],
    ['fade-practice','Creating the first guideline','Map a narrow first boundary at the chosen fade height; look from the side and back before cutting.','Trace one planned guide with a comb before a guarded mannequin pass.','low-fade','guide'],
    ['fade-practice','Creating the second guideline','Build the next longer working zone above the first; leave room to connect the lengths.','Mark the first two lengths and explain where the blend will sit.','low-fade','next-length'],
    ['fade-practice','Creating the third guideline','Treat the upper connection as a checkpoint, not a mandatory fixed band. Preserve the chosen top silhouette.','Point to the upper weight line on both sides before any pass.','low-fade','upper-blend'],
    ['fade-practice','Removing guidelines','Work only at a remaining boundary. Brush and inspect before changing the lever or guard.','Practice one tiny neighboring-length correction; stop and compare.','low-fade','blend'],
    ['fade-practice','Blending short hair','Read the lowest short area against its neighboring length; use low pressure and small movement.','Work one narrow short transition area on a mannequin.','low-fade','lower-blend'],
    ['fade-practice','Blending into longer hair','Connect the upper side gradually without taking the transition into the longer top.','Comb up the edge of the longer area and identify a small connection zone.','low-fade','top'],
    ['fade-practice','Working with different guards','Use compatible attachments and test actual lengths on your own system; labels are approximate.','Compare three labeled guards on swatches and record the outcome.','low-fade','guard-changes'],
    ['fade-practice','Checking symmetry','Compare guide height, sideburn endpoints and retained weight from front and both profiles.','Inspect three mirror views and list one difference before correcting.','low-fade','symmetry'],
    ['fade-practice','Blending around the ear','Protect the ear and follow its curve with small sections; keep a burst shape localized if requested.','Trace the ear path with tools off, then rehearse a guarded arc on a mannequin.','burst-fade','lower-blend'],
    ['fade-practice','Blending the neckline','Read natural nape growth and connect the planned back shape without raising the fade.','Rehearse a short nape section and compare it in a hand mirror.','taper-fade','back'],
    ['taper-practice','Temple taper','Set a small working area at the temple and preserve the fuller side above.','Outline the planned temple area on both sides before a guarded pass.','taper-fade','initial-length'],
    ['taper-practice','Sideburn taper','Compare natural sideburn growth and agree the endpoint before shortening.','Map each sideburn and compare endpoints from the front.','taper-fade','guide'],
    ['taper-practice','Neck taper','Keep the taper concentrated at the nape edge and preserve back length above it.','Trace a small neckline taper zone with a comb.','taper-fade','back'],
    ['taper-practice','Connecting the taper','Join temple and nape edge work into fuller side hair without making a broad side band.','Point to the retained side between the two tapered areas.','taper-fade','middle-blend'],
    ['taper-practice','Cleaning the edges','Follow the agreed natural edge and protect the skin; a sharp lineup is optional.','Rehearse a safe temple and nape path with the tool off.','taper-fade','finish'],
    ['scissor-practice','Basic cutting','Comb into natural fall, set a guide and remove a small agreed amount with fingertips clear.','Cut three small mannequin sections and release each to check length.','scissor-cut','initial-length'],
    ['scissor-practice','Point cutting','Use small controlled tips at the ends only where soft texture is requested.','Practice six shallow tip touches on a mannequin swatch.','scissor-cut','top'],
    ['scissor-practice','Blunt cutting','Set a clear guide and cut an even line with relaxed fingers and a stable comb.','Cut three narrow sections to one conservative guide and cross-check.','scissor-cut','guide'],
    ['scissor-practice','Scissor over comb','Use a shallow, controlled comb lift and cut only hair that extends beyond it.','Practice six steady comb lifts with shears closed before rehearsing a cut.','scissor-over-comb','transition'],
    ['scissor-practice','Comb control','Keep comb teeth steady, follow the skull, and feed small sections without pulling.','Lift and release six neighboring sections to the same reference.','scissor-over-comb','first-length'],
    ['scissor-practice','Sectioning','Make clean partings and secure only the hair that should stay out of the working area.','Create a horseshoe section, release it and repeat three times.','scissor-cut','section'],
    ['scissor-practice','Removing bulk','Check density and natural fall; remove a conservative amount from an agreed area.','Lift one section, name what can be removed, then preserve the guide.','longer-textured-cut','initial-length'],
    ['scissor-practice','Connecting sections','Carry the guide into neighboring sections and cross-check the shape after release.','Connect four small sections, then compare both sides.','scissor-cut','next-length'],
    ['scissor-practice','Texturing','Add texture only after the length and density are checked; avoid removing weight blindly.','Choose three ends for a shallow texture touch and inspect the released fall.','textured-crop','top'],
    ['finishing','Line-up planning','Agree whether a sharper outline is wanted; preserve natural corners unless the person asks otherwise.','Trace the planned front edge with a comb before switching on a trimmer.','low-fade','finish'],
    ['finishing','Temple detail','Protect the ear and compare the natural temple corners before a small detail pass.','Practice positioning with tools off; inspect both corners from the front.','low-fade','finish'],
    ['finishing','Sideburn balance','Compare length, angle and endpoint against the request and natural growth.','Check both sideburns from the front before any correction.','classic-taper','temples'],
    ['finishing','Neckline cleanup','Follow natural growth or the agreed shape and keep the nape comfortable.','Rehearse the outline from the back using a hand mirror.','low-taper','finish'],
    ['finishing','Brush and inspect','Remove loose hair and inspect in even light before deciding whether a correction is needed.','Check front, left, right, back and crown in sequence.','low-fade','inspection'],
    ['finishing','Final balance check','Compare the finished side, top and back to the consultation plan; stop when it matches.','Name one thing to retain and one area to check again before cleanup.','classic-taper','complete']
  ].map(([category,title,task,reps,cut,key,visualMode,toolIndex])=>({category,title,task,reps,cut,key,...(visualMode==='tool'?{toolIndex}: {})}));
  const data = drills;
  const byCategory = Object.fromEntries(categories.map(c=>[c.id,data.filter(d=>d.category===c.id)]));
  const root=document.getElementById('quick-practice-drills'),filters=document.getElementById('quick-practice-categories');
  if(!root||!filters)return;
  let selected='foundation',query='';
  function progress(){try{const x=JSON.parse(localStorage.getItem('the-craft-progress-v2')||'{}');return x&&typeof x==='object'&&!Array.isArray(x)&&Array.isArray(x.quickPractice)?new Set(x.quickPractice):new Set();}catch{return new Set();}}
  function setProgress(key,checked){try{const s=JSON.parse(localStorage.getItem('the-craft-progress-v2')||'{}');const state=s&&typeof s==='object'&&!Array.isArray(s)?s:{};const done=new Set(Array.isArray(state.quickPractice)?state.quickPractice:[]);checked?done.add(key):done.delete(key);state.quickPractice=[...done];localStorage.setItem('the-craft-progress-v2',JSON.stringify(state));return true;}catch{return false;}}
  function paintProgress(){const n=progress().size,total=data.length;document.getElementById('quick-practice-count').textContent=n+' of '+total+' complete';document.getElementById('quick-practice-fill').style.width=(n/total*100)+'%';document.querySelector('.quick-practice-meter [role=progressbar]').setAttribute('aria-valuenow',n);}
  function visualFor(d){
    if(Number.isInteger(d.toolIndex))return window.CraftVisual.fromAsset('clipper-system',d.toolIndex);
    const cut=window.THE_CRAFT_WALKTHROUGHS.find(c=>c.id===d.cut);if(!cut)return null;
    const index=cut.steps.findIndex(s=>s.key===d.key);if(index<0)return window.CraftVisual.fromSheet(cut,Math.min(16,cut.panelRegions.length-1));const step=cut.steps[index];return step.visual||window.CraftVisual.fromSheet(cut,cut.panelRegions[step.panel]?step.panel:Math.min(16,cut.panelRegions.length-1));
  }
  function render(){
    filters.innerHTML=categories.map(c=>'<button type="button" data-quick-category="'+c.id+'" aria-pressed="'+(selected===c.id)+'">'+c.name+' <span>'+byCategory[c.id].length+'</span></button>').join('');
    const active=categories.find(c=>c.id===selected);document.getElementById('quick-practice-category-note').textContent=active.note;
    const done=progress(),items=(byCategory[selected]||[]).filter(d=>(d.title+' '+d.task).toLowerCase().includes(query));
    root.innerHTML=items.map(d=>{const key=d.category+':'+d.title,visual=visualFor(d),cut=window.THE_CRAFT_WALKTHROUGHS.find(c=>c.id===d.cut),n=cut.steps.findIndex(s=>s.key===d.key);return '<article class="quick-practice-drill"><div class="quick-practice-image">'+window.CraftVisual.frame(visual,d.title+' · '+cut.name+' matching process action')+'</div><div class="quick-practice-drill-copy"><p class="eyebrow">'+active.name.toUpperCase()+' · '+escape(d.cut)+'</p><h3>'+escape(d.title)+'</h3><p>'+escape(d.task)+'</p><p class="quick-practice-reps"><strong>Rehearse:</strong> '+escape(d.reps)+'</p><a class="text-link" href="haircut-patterns.html?walkthrough='+encodeURIComponent(cut.id)+'&step='+(n+1)+'#cut-walkthrough">Open matching '+escape(cut.name)+' step '+(n+1)+' →</a><label class="learning-check"><input type="checkbox" data-quick-drill="'+escape(key)+'"'+(done.has(key)?' checked':'')+'>I practiced this skill</label></div></article>';}).join('')||'<p class="library-empty">No drills match this search. Try another word or clear the search.</p>';
    window.CraftVisual.bind(root);paintProgress();
  }
  function escape(v){return window.CraftVisual.escape(v);}
  filters.addEventListener('click',event=>{const b=event.target.closest('[data-quick-category]');if(!b)return;selected=b.dataset.quickCategory;render();filters.querySelector('[data-quick-category="'+selected+'"]').focus();});
  document.getElementById('quick-practice-search').addEventListener('input',ev=>{query=ev.target.value.trim().toLowerCase();render();});
  root.addEventListener('change',ev=>{const input=ev.target.closest('[data-quick-drill]');if(!input)return;const key=input.dataset.quickDrill;if(!setProgress(key,input.checked)){input.checked=!input.checked;return;}paintProgress();});
  window.addEventListener('storage',ev=>{if(ev.key==='the-craft-progress-v2')paintProgress();});
  const requested = new URLSearchParams(window.location.search).get('skill');
  if (requested) {
    const [category, title] = requested.split(':');
    if (categories.some(item => item.id === category)) {
      selected = category;
      query = (title || '').trim().toLowerCase();
      document.getElementById('quick-practice-search').value = title || '';
    }
  }
  render();
})();
