const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// Every advertised model and external resource must exist in the shipped assets.
const names = JSON.parse(source.match(/const names=(\[[^;]+\]);/)[1]);
const assetFiles = JSON.parse(source.match(/const assetFiles=({[^;]+});/)[1]);
for (const name of names) {
  const file = path.join(__dirname, '..', assetFiles[name]);
  const gltf = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const resource of [...(gltf.buffers || []), ...(gltf.images || [])]) {
    if (resource.uri && !resource.uri.startsWith('data:')) {
      assert.ok(fs.existsSync(path.resolve(path.dirname(file), decodeURIComponent(resource.uri))), `${name}: ${resource.uri}`);
    }
  }
}

// Exercise the actual recovery code with storage/timer/DOM boundaries replaced.
const block = source.slice(source.indexOf('const AUTOSAVE_KEY='), source.indexOf("$('save').onclick="));
async function recovery(initial) {
  let stored = initial, writes = 0, interval, onHide, failLoad = false;
  const elements = new Map();
  const context = vm.createContext({
    $: id => { if (!elements.has(id)) elements.set(id, {}); return elements.get(id); },
    localStorage: { getItem: () => stored, setItem: (_, value) => { stored = value; writes++; }, removeItem: () => { stored = null; } },
    setInterval: fn => { interval = fn; }, addEventListener: (_, fn) => { onHide = fn; },
    worldData: () => ({version: 6, objects: []}),
    loadWorld: async () => { if (failLoad) throw Error('load failed'); },
    confirm: () => true, Date, JSON
  });
  vm.runInContext(block, context);
  return { elements, tick: () => interval(), hide: () => onHide(), get stored() { return stored; }, get writes() { return writes; }, fail: () => { failLoad = true; } };
}
(async () => {
  const original = JSON.stringify({savedAt: 1000, world: {objects: [{name: 'Pine_1'}]}});
  const pending = await recovery(original);
  pending.tick(); pending.hide();
  assert.equal(pending.stored, original); assert.equal(pending.writes, 0);
  await pending.elements.get('autosaveRestore').onclick(); pending.tick();
  assert.equal(pending.writes, 1);
  const failed = await recovery(original); failed.fail();
  await failed.elements.get('autosaveRestore').onclick(); failed.tick();
  assert.equal(failed.stored, original);
  const malformed = await recovery('{broken'); malformed.tick(); malformed.hide();
  assert.equal(malformed.stored, '{broken');
  const fresh = await recovery(null); fresh.tick(); assert.equal(fresh.writes, 1);
  const deleted = await recovery(original); deleted.elements.get('autosaveDelete').onclick(); deleted.tick();
  assert.equal(deleted.writes, 1);
  console.log(`PASS: ${names.length} asset manifests/resources; recovery preservation, restore, failed restore, malformed storage, fresh save and explicit reset.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
