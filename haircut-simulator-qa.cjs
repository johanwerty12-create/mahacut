const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('haircut-simulator-3d-data.js', 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context, { filename: 'haircut-simulator-3d-data.js' });
const GAME = context.window.THE_CRAFT_SIM_3D;
assert.ok(GAME, 'simulator style data exports');
assert.equal(GAME.styles.length, 21, 'all haircut choices are present');
assert.equal(new Set(GAME.styles.map(style => style.id)).size, 21, 'style IDs are unique');
assert.deepEqual(Array.from(GAME.guards, ([name]) => name), ['No guard', '#0.5', '#1', '#1.5', '#2', '#3', '#4']);

const validTools = new Set(['clipper', 'trimmer', 'razor', 'scissors', 'comb']);
const signatures = new Set();
for (const style of GAME.styles) {
  assert.ok(style.steps.length >= 6, `${style.id} has an ordered learning workflow`);
  assert.equal(style.steps[0].type, 'look', `${style.id} begins with assessment`);
  assert.equal(style.steps.at(-1).type, 'inspect', `${style.id} ends with inspection`);
  assert.equal(style.steps.at(-1).views.includes('back'), true, `${style.id} includes final rear inspection`);
  assert.equal(new Set(style.steps.map(step => step.id)).size, style.steps.length, `${style.id} step IDs are unique`);
  const cuts = style.steps.filter(step => step.type === 'cut');
  assert.ok(cuts.length >= 4, `${style.id} has enough hands-on work`);
  const signature = JSON.stringify({ group: style.group, guidePhi: style.guidePhi, targets: style.target, cuts: cuts.map(step => [step.id, step.tool, step.guard, step.lever, step.movement, step.regions, step.guidePhi, step.phiRange, step.requiresComb, step.shearLength]) });
  signatures.add(signature);
  for (const step of cuts) {
    assert.ok(validTools.has(step.tool), `${style.id}/${step.id} uses a simulator tool`);
    assert.ok(step.regions.length, `${style.id}/${step.id} teaches a visible region`);
    if (step.tool === 'clipper') {
      assert.ok(GAME.guards.some(([name]) => name === step.guard), `${style.id}/${step.id} has a known guard`);
      assert.ok(['closed', 'half', 'open'].includes(step.lever), `${style.id}/${step.id} has a valid lever`);
    }
    if (step.tool === 'scissors') assert.ok(step.shearLength >= 8 && step.shearLength <= 60, `${style.id}/${step.id} has a reachable shear length`);
    if (step.movement === 'guide') assert.ok(Number.isFinite(step.guidePhi), `${style.id}/${step.id} marks a guide height`);
    if (step.requiresComb) assert.ok(['clipper', 'scissors'].includes(step.tool), `${style.id}/${step.id} requires a cutting tool after comb positioning`);
  }
  const greatestTarget = Math.max(...Object.values(style.target));
  assert.ok(Math.max(GAME.initialHairLength, Math.min(60, Math.ceil(greatestTarget + 4))) > greatestTarget, `${style.id} starts with enough hair for its longest target`);
}
assert.equal(signatures.size, GAME.styles.length, 'each style has a distinct process or target shape');

const html = fs.readFileSync('haircut-simulator.html', 'utf8');
const runtime = fs.readFileSync('haircut-simulator-3d.js', 'utf8');
const characterScript = fs.readFileSync('assets/character/makehuman-client-data.js', 'utf8');
const characterContext = { window: {} };
vm.createContext(characterContext);
vm.runInContext(characterScript, characterContext, { filename: 'assets/character/makehuman-client-data.js' });
const character = characterContext.window.THE_CRAFT_HUMAN_CLIENT;
assert.ok(character, 'the licensed 3D client asset is bundled for file: and HTTP use');
assert.ok(character.vertexCount > 4000 && character.vertexCount < 10000, 'the upper-body client asset stays compact');
assert.ok(character.bodyIndexCount > 20000 && character.eyeIndexCount >= 600, 'body and eye geometry are included');
assert.ok(characterScript.length < 200000, 'the compressed human geometry remains lightweight');
const decodeAsset = (data, Type) => {
  const bytes = Buffer.from(data, 'base64');
  return new Type(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
};
const clientPositions = decodeAsset(character.vertices, Float32Array);
const bodyIndices = decodeAsset(character.bodyIndices, Uint16Array);
const eyeIndices = decodeAsset(character.eyeIndices, Uint16Array);
assert.equal(clientPositions.length, character.vertexCount * 3, 'client vertex payload has complete XYZ coordinates');
assert.equal(bodyIndices.length, character.bodyIndexCount, 'body triangle index count matches its payload');
assert.equal(eyeIndices.length, character.eyeIndexCount, 'eye triangle index count matches its payload');
assert.ok([...clientPositions].every(Number.isFinite), 'client geometry has no invalid coordinates');
assert.ok([...bodyIndices, ...eyeIndices].every(index => index < character.vertexCount), 'all client indices resolve to a vertex');
assert.ok(html.indexOf('makehuman-client-data.js') < html.indexOf('haircut-simulator-3d.js'), 'the head asset loads before the simulator renderer');
assert.ok(fs.readFileSync('assets/character/README.md', 'utf8').includes('CC0'), 'the third-party model license is documented');
for (const id of ['barber-canvas', 'style-select', 'pause-game', 'resume-game', 'reset-cut', 'retry-step', 'guard-options', 'lever-options', 'shear-length', 'result-panel']) {
  assert.ok(html.includes(`id="${id}"`), `HTML contains ${id}`);
}
assert.ok(html.includes('max="60"'), 'shear range covers long-top target lengths');
assert.ok(runtime.includes("canvas.addEventListener('contextmenu',event=>event.preventDefault())"), 'simulator blocks the browser context menu');
assert.ok(runtime.includes("s.tool!=='scissors'||!Number.isFinite(s.shearLength)||shearLength===s.shearLength"), 'guided shears validate the active cutting length');
assert.ok(runtime.includes("if(toolActive&&(currentTool==='clipper'||currentTool==='trimmer')"), 'active clippers and trimmers cut through the contact loop');
assert.ok(runtime.includes('const sourceRegions=info.changedRegions'), 'guided passes only validate regions where hair changed');
assert.ok(runtime.includes("info.cutCells<2||!combContact"), 'guided passes require a new localized hair change');
assert.ok(runtime.includes('function prepareGuidedCutStep(step)'), 'guided steps hand off the correct tool and recommended setup');
assert.ok(runtime.includes('function hairShellOffset(length)') && runtime.includes('function hairSurfaceOffset(length,clearance=.002)'), 'visible shell and tool-contact heights share one hair surface model');
assert.ok(runtime.includes('hairSurfaceOffset(sampleHair(theta,phi))'), 'the tool ray lands at the rendered fiber surface');
assert.ok(runtime.includes('releaseClippings(to.theta,to.phi,changed,contactLengthBefore)'), 'cut clippings originate at the hair length before the pass');
assert.ok(runtime.includes("s?.type==='inspect'"), 'final inspection guidance does not ask learners to pick up a stale tool');
assert.ok(runtime.includes("const key='craft-sim-progress-v2'"), 'measured session progress is saved per style');

assert.ok(fs.readFileSync('server.cjs', 'utf8').includes(".listen(8000, '127.0.0.1'"), 'the local HTTP server is configured');
console.log(`PASS: ${GAME.styles.length} haircut plans, simulator controls and workflow rules; licensed client asset (${character.vertexCount} vertices) is compact and structurally valid.`);
