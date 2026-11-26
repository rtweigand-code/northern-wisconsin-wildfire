/* Starter app: source classifications only; no composite scores or invented summaries. */
(() => {
  'use strict';
  const records = window.COMMUNITIES || [];
  const $ = id => document.getElementById(id);
  const typeNames = {T:'Town',C:'City',V:'Village'};
  const colors = {'Very High':'#b93d36',High:'#de8c2d',Concern:'#778994'};
  let view, layer, selectionLayer, Graphic, allGraphics = [], selectedId;
  const normalize = value => value.toLowerCase().replace(/saint/g,'st').replace(/[^a-z0-9]/g,'');
  [...new Set(records.map(r=>r.county))].sort().forEach(county=>{
    const option = document.createElement('option'); option.value=county; option.textContent=county; $('county').append(option);
  });
  function filtered() {
    const q=normalize($('search').value);
    return records.filter(r=>(!q||normalize(r.name).includes(q))&&(!$('county').value||r.county===$('county').value)&&(!$('risk').value||r.risk===$('risk').value));
  }
  function select(record, zoom=true) {
    selectedId=record.id;
    $('communityName').textContent=record.name;
    $('location').textContent=`${typeNames[record.type] || record.type} · ${record.county} County`;
    $('classification').textContent=record.risk;
    $('classification').style.color=colors[record.risk];
    $('matchNote').textContent=record.note || '';
    document.querySelectorAll('.result').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.id)===record.id)));
    if(selectionLayer && Graphic){
      selectionLayer.visible=$('points').checked;
      selectionLayer.removeAll();
      selectionLayer.add(new Graphic({geometry:{type:'point',longitude:record.longitude,latitude:record.latitude},symbol:{type:'simple-marker',size:19,color:[0,0,0,0],outline:{color:'#113d4e',width:2.5}}}));
    }
    if(view&&zoom)view.goTo({center:[record.longitude,record.latitude],zoom:10}).catch(error=>{if(error.name!=='AbortError')console.warn(error);});
  }
  function render() {
    const matches=filtered(), ids=new Set(matches.map(r=>r.id));
    $('count').textContent=`${matches.length} matching communities${matches.length>50?' · first 50 listed':''}`;
    $('results').replaceChildren();
    matches.slice().sort((a,b)=>a.name.localeCompare(b.name)||a.county.localeCompare(b.county)).slice(0,50).forEach(record=>{
      const button=document.createElement('button');button.type='button';button.className='result';button.dataset.id=record.id;button.setAttribute('aria-pressed',String(record.id===selectedId));
      const name=document.createElement('span');name.textContent=record.name;
      const meta=document.createElement('small');meta.textContent=`${typeNames[record.type]} · ${record.county} · ${record.risk}`;
      button.append(name,meta);button.addEventListener('click',()=>select(record));$('results').append(button);
    });
    if(!matches.length)$('results').textContent='No communities match. Try a different name or filter.';
    if(layer){layer.removeAll();layer.addMany(allGraphics.filter(g=>ids.has(g.attributes.id)));}
    if(selectionLayer){selectionLayer.visible=$('points').checked&&ids.has(selectedId);}
  }
  ['search','county','risk'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',render));
  $('points').addEventListener('change',()=>{if(layer)layer.visible=$('points').checked;render();});
  $('reset').addEventListener('click',()=>{
    $('search').value='';$('county').value='';$('risk').value='';render();
    if(view)view.goTo({center:[-90,45.5],zoom:7}).catch(()=>{});
  });
  render();
  if(typeof window.require!=='function'){
    $('status').textContent='Map library unavailable. Check your internet connection. Community search still works.';return;
  }
  window.require(['esri/Map','esri/Basemap','esri/layers/TileLayer','esri/views/MapView','esri/layers/GraphicsLayer','esri/Graphic'],
    (Map,Basemap,TileLayer,MapView,GraphicsLayer,ArcGraphic)=>{
      Graphic=ArcGraphic;
      const basemap=new Basemap({baseLayers:[new TileLayer({url:'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer'})],referenceLayers:[new TileLayer({url:'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer'})]});
      layer=new GraphicsLayer({title:'DNR community classifications'});selectionLayer=new GraphicsLayer({title:'Selected community'});
      const map=new Map({basemap,layers:[layer,selectionLayer]});
      view=new MapView({container:'viewDiv',map,center:[-90,45.5],zoom:7,popupEnabled:false});
      allGraphics=records.map(record=>new Graphic({geometry:{type:'point',longitude:record.longitude,latitude:record.latitude},attributes:{id:record.id},symbol:{type:'simple-marker',size:8,color:colors[record.risk],outline:{color:'#ffffff',width:.8}}}));
      render();
      view.on('click',async event=>{
        try{const hit=await view.hitTest(event,{include:layer});const result=hit.results.find(r=>r.type==='graphic'&&r.graphic.layer===layer);if(result)select(records.find(r=>r.id===result.graphic.attributes.id),false);}catch(error){console.warn(error);}
      });
      view.when(()=>{$('status').textContent='Select a community to explore its DNR classification.';},()=>{$('status').textContent='Map could not load. Check your internet connection. Community search still works.';});
      basemap.baseLayers.forEach(base=>base.load().catch(()=>{$('status').textContent='Basemap unavailable. Community search and details remain available.';}));
    },()=>{$('status').textContent='Map modules could not load. Community search still works.';});
})();
