const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const code=source.slice(source.indexOf('const history=[],redoHistory=[];'),source.indexOf('function refreshSelection()'));
const elements=new Map();let terrain=[0,0],paint={weights:[0,0]},water=[];
class Vec{constructor(x=0,y=0,z=0){Object.assign(this,{x,y,z})}clone(){return new Vec(this.x,this.y,this.z)}copy(v){Object.assign(this,v)}}
const object={position:new Vec(),rotation:{y:0},scale:{x:1,setScalar(x){this.x=x}}};
const context=vm.createContext({
 objects:[object],scene:{add(){},remove(){}},$:id=>{if(!elements.has(id))elements.set(id,{});return elements.get(id)},
 terrainHeights:()=>structuredClone(terrain),terrainPaintData:()=>structuredClone(paint),waterData:()=>structuredClone(water),
 restoreTerrain:data=>{terrain=structuredClone(data)},restoreTerrainPaint:data=>{paint=structuredClone(data)},restoreWater:data=>{water=structuredClone(data)},
 refreshWaterMeshes(){},rebuildIndex(){},choose(){},status(){},object
});
vm.runInContext(code,context);
vm.runInContext('remember();object.position.x=4;object.rotation.y=1;object.scale.setScalar(2);undo()',context);
assert.equal(object.position.x,0);assert.equal(object.rotation.y,0);assert.equal(object.scale.x,1);
vm.runInContext('redo()',context);assert.equal(object.position.x,4);assert.equal(object.scale.x,2);
vm.runInContext('remember();objects.length=0;undo()',context);assert.equal(context.objects.length,1);
vm.runInContext('redo()',context);assert.equal(context.objects.length,0);
vm.runInContext('undo();remember();object.position.x=9',context);assert.equal(elements.get('redo').disabled,true);
vm.runInContext('rememberTerrain(terrainHeights(),terrainPaintData())',context);terrain=[2,3];paint={weights:[.5,1]};
vm.runInContext('undo()',context);assert.deepEqual(terrain,[0,0]);assert.deepEqual(paint,{weights:[0,0]});
vm.runInContext('redo()',context);assert.deepEqual(terrain,[2,3]);assert.deepEqual(paint,{weights:[.5,1]});
vm.runInContext('history.push({objects:snapshot(),terrain:terrainHeights(),water:waterData(),paint:null})',context);
terrain=[-1,-2];water=[{type:'river'}];vm.runInContext('undo()',context);assert.deepEqual(water,[]);assert.deepEqual(terrain,[2,3]);
vm.runInContext('redo()',context);assert.deepEqual(water,[{type:'river'}]);assert.deepEqual(terrain,[-1,-2]);
console.log('PASS: transform, deletion, redo invalidation, terrain paint and river undo/redo.');
