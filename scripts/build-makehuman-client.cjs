const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourceFile = path.join(root, 'assets', 'character', 'makehuman-base.obj');
const outputFile = path.join(root, 'assets', 'character', 'makehuman-client-data.js');
const vertices = [];
const bodyTriangles = [];
const eyeTriangles = [];
let group = '';

for (const line of fs.readFileSync(sourceFile, 'utf8').split(/\r?\n/)) {
  if (line.startsWith('v ')) {
    const [, x, y, z] = line.trim().split(/\s+/);
    vertices.push([Number(x), Number(y), Number(z)]);
  } else if (line.startsWith('g ')) {
    group = line.slice(2).trim();
  } else if (line.startsWith('f ') && (group === 'body' || group === 'helper-l-eye' || group === 'helper-r-eye')) {
    const face = line.slice(2).trim().split(/\s+/).map(part => Number(part.split('/')[0]) - 1);
    const destination = group === 'body' ? bodyTriangles : eyeTriangles;
    for (let i = 1; i < face.length - 1; i++) {
      const triangle = [face[0], face[i], face[i + 1]];
      const centerY = triangle.reduce((sum, index) => sum + vertices[index][1], 0) / 3;
      if (group !== 'body' || centerY >= 5) destination.push(triangle);
    }
  }
}

const used = [...new Set([...bodyTriangles, ...eyeTriangles].flat())].sort((a, b) => a - b);
const remap = new Map(used.map((index, packed) => [index, packed]));
const packedVertices = new Float32Array(used.length * 3);
used.forEach((index, i) => packedVertices.set(vertices[index], i * 3));
const bodyIndices = new Uint16Array(bodyTriangles.flatMap(triangle => triangle.map(index => remap.get(index))));
const eyeIndices = new Uint16Array(eyeTriangles.flatMap(triangle => triangle.map(index => remap.get(index))));
const base64 = typed => Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength).toString('base64');

const payload = {
  vertexCount: used.length,
  bodyIndexCount: bodyIndices.length,
  eyeIndexCount: eyeIndices.length,
  vertices: base64(packedVertices),
  bodyIndices: base64(bodyIndices),
  eyeIndices: base64(eyeIndices)
};
fs.writeFileSync(outputFile, `/* MakeHuman hm08 body/eye subset; source asset CC0. See README.md. */\nwindow.THE_CRAFT_HUMAN_CLIENT=${JSON.stringify(payload)};\n`);
console.log(`Wrote ${outputFile} (${fs.statSync(outputFile).size} bytes; ${used.length} vertices).`);
