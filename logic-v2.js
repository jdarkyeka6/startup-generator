const STORAGE_KEY='swipestart:v2';
const defaultState={filter:'All',index:0,saved:[],history:[],seen:0,streak:0,categorySaves:{},deckOrder:ideas.map(i=>i.id)};
let state=loadState();
let activeSheetId=null;
let toastTimer;

const $=id=>document.getElementById(id);
const cardStack=$('cardStack'), progressCount=$('progressCount'), progressTotal=$('progressTotal');
const saveStamp=$('saveStamp'), passStamp=$('passStamp'), savedGrid=$('savedGrid'), savedBadge=$('savedBadge');

function loadState(){try{return {...defaultState,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{return {...defaultState}}}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));updateStats()}
function ideaById(id){return ideas.find(i=>i.id===id)}
function baseDeck(){const ordered=state.deckOrder.map(ideaById).filter(Boolean);return state.filter==='All'?ordered:ordered.filter(i=>i.category===state.filter)}
function currentIdea(){return baseDeck()[state.index]}
function isSaved(id){return state.saved.includes(id)}

function renderDeck(){
  const deck=baseDeck();
  progressTotal.textContent=deck.length;
  progressCount.textContent=deck.length?Math.min(state.index+1,deck.length):0;
  if(!deck.length){cardStack.innerHTML=emptyMarkup('No ideas here','Try another category.');return}
  if(state.index>=deck.length){cardStack.innerHTML=emptyMarkup('Deck cleared','You judged every idea in this category. Shuffle or pick another filter.');return}
  cardStack.innerHTML=deck.slice(state.index,state.index+3).map(cardMarkup).join('');
  attachDrag(cardStack.querySelector('.idea-card'));
}

function cardMarkup(i){return `<article class="idea-card" data-id="${i.id}" style="--accent-rgb:${i.accent}">
  <div class="card-topline"><span class="category-badge">${i.category}</span><span class="idea-number">IDEA ${String(i.id).padStart(2,'0')}</span></div>
  <h2 class="idea-name">${i.name}</h2>
  <p class="idea-pitch">${i.pitch}</p>
  <div class="signal-row"><span class="signal-chip hot">↗ ${i.trend}</span><span class="signal-chip">MVP ${i.time}</span></div>
  <div class="metric-grid"><div class="metric"><small>Model</small><strong>${i.model}</strong></div><div class="metric"><small>Build</small><strong>${i.difficulty}</strong></div><div class="metric"><small>Score</small><strong>${i.score}/100</strong></div></div>
  <div class="tag-row">${i.tags.map(t=>`<span class="idea-tag">${t}</span>`).join('')}</div>
  <div class="card-bottom"><small>tap ⓘ for the full breakdown</small><div class="score">${i.score}<span>/100</span></div></div>
</article>`}
function emptyMarkup(title,body){return `<div class="empty-state"><strong>${title}</strong><span>${body}</span></div>`}

function swipe(direction,card=cardStack.querySelector('.idea-card')){
  const deck=baseDeck(); if(!card||state.index>=deck.length)return;
  const idea=deck[state.index], liked=direction==='right';
  state.history.push({ideaId:idea.id,index:state.index,liked,filter:state.filter});
  state.seen+=1; state.streak+=1;
  if(liked&&!isSaved(idea.id)){state.saved.unshift(idea.id);state.categorySaves[idea.category]=(state.categorySaves[idea.category]||0)+1}
  saveState();
  const x=liked?135:-135;
  card.style.transition='transform 250ms cubic-bezier(.2,.8,.2,1),opacity 220ms ease';
  card.style.transform=`translateX(${x}%) rotate(${liked?15:-15}deg)`;card.style.opacity='0';
  setTimeout(()=>{state.index+=1;saveState();renderDeck();renderSaved()},205);
  toast(liked?'Saved to your shortlist ♥':'Passed');
}

function undo(){const last=state.history.pop();if(!last){toast('Nothing to undo');return}if(last.filter!==state.filter){state.history.push(last);toast('Undo works inside the current filter');return}state.index=Math.max(0,last.index);state.seen=Math.max(0,state.seen-1);state.streak=Math.max(0,state.streak-1);if(last.liked){const idea=ideaById(last.ideaId);state.saved=state.saved.filter(id=>id!==last.ideaId);if(idea)state.categorySaves[idea.category]=Math.max(0,(state.categorySaves[idea.category]||0)-1)}saveState();renderDeck();renderSaved();toast('Undone')}

function attachDrag(card){if(!card)return;let startX=0,currentX=0,dragging=false;card.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;card.setPointerCapture(e.pointerId);card.style.transition='none'});card.addEventListener('pointermove',e=>{if(!dragging)return;currentX=e.clientX-startX;card.style.transform=`translateX(${currentX}px) rotate(${currentX/18}deg)`;const s=Math.min(Math.abs(currentX)/105,1);saveStamp.style.opacity=currentX>0?s:0;passStamp.style.opacity=currentX<0?s:0});const end=e=>{if(!dragging)return;dragging=false;saveStamp.style.opacity=0;passStamp.style.opacity=0;if(card.hasPointerCapture(e.pointerId))card.releasePointerCapture(e.pointerId);if(Math.abs(currentX)>88)swipe(currentX>0?'right':'left',card);else{card.style.transition='transform 200ms cubic-bezier(.2,.8,.2,1)';card.style.transform='translateX(0) rotate(0)'}currentX=0};card.addEventListener('pointerup',end);card.addEventListener('pointercancel',end)}

function renderSaved(){
  const q=$('savedSearch').value.trim().toLowerCase();
  const list=state.saved.map(ideaById).filter(Boolean).filter(i=>!q||`${i.name} ${i.pitch} ${i.tags.join(' ')}`.toLowerCase().includes(q));
  $('savedCount').textContent=state.saved.length;savedBadge.textContent=state.saved.length;
  if(!list.length){savedGrid.innerHTML=emptyMarkup(state.saved.length?'No matches':'No keepers yet',state.saved.length?'Try a different search.':'Swipe right on an idea and it will land here.');return}
  savedGrid.innerHTML=list.map(i=>`<article class="saved-card" data-open="${i.id}" style="--accent-rgb:${i.accent}"><div class="saved-card-head"><div><span class="category-badge">${i.category}</span><h3>${i.name}</h3></div><button class="remove-saved" data-remove="${i.id}" aria-label="Remove ${i.name}">×</button></div><p>${i.pitch}</p><div class="tag-row">${i.tags.map(t=>`<span class="idea-tag">${t}</span>`).join('')}<span class="saved-score">${i.score}/100</span></div></article>`).join('');
  document.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();removeSaved(Number(b.dataset.remove))}));
  document.querySelectorAll('[data-open]').forEach(c=>c.addEventListener('click',()=>openSheet(Number(c.dataset.open))))
}
function removeSaved(id){const i=ideaById(id);state.saved=state.saved.filter(x=>x!==id);if(i)state.categorySaves[i.category]=Math.max(0,(state.categorySaves[i.category]||0)-1);saveState();renderSaved();toast('Removed')}

function openSheet(id=currentIdea()?.id){const i=ideaById(id);if(!i)return;activeSheetId=i.id;const saved=isSaved(i.id);$('sheetContent').innerHTML=`<div style="--accent-rgb:${i.accent}"><div class="sheet-title-row"><div><span class="category-badge">${i.category}</span><h2>${i.name}</h2></div><div class="sheet-score">${i.score}</div></div><p class="sheet-description">${i.pitch}</p><div class="sheet-grid"><div class="sheet-block"><small>Business model</small><strong>${i.model}</strong></div><div class="sheet-block"><small>MVP time</small><strong>${i.time}</strong></div><div class="sheet-block"><small>Build difficulty</small><strong>${i.difficulty}</strong></div><div class="sheet-block"><small>Signal</small><strong>${i.trend}</strong></div></div><div class="why-card"><h4>Why it could work</h4><p>${i.why}</p></div><div class="sheet-actions"><button class="sheet-pass" id="sheetPass">Pass</button><button class="sheet-save" id="sheetSave">${saved?'Saved ✓':'Save idea'}</button></div></div>`;$('detailSheet').classList.add('open');$('detailSheet').setAttribute('aria-hidden','false');$('sheetBackdrop').hidden=false;$('sheetPass').onclick=()=>{closeSheet();if(currentIdea()?.id===i.id)swipe('left')};$('sheetSave').onclick=()=>{if(!isSaved(i.id)){state.saved.unshift(i.id);state.categorySaves[i.category]=(state.categorySaves[i.category]||0)+1;saveState();renderSaved();toast('Saved to your shortlist ♥')}closeSheet()}}
function closeSheet(){$('detailSheet').classList.remove('open');$('detailSheet').setAttribute('aria-hidden','true');$('sheetBackdrop').hidden=true;activeSheetId=null}

function updateStats(){
  $('savedMini').textContent=state.saved.length;$('seenMini').textContent=state.seen;$('streakMini').textContent=state.streak;
  $('statsSeen').textContent=state.seen;$('statsSaved').textContent=state.saved.length;$('statsRate').textContent=state.seen?`${Math.round(state.saved.length/state.seen*100)}%`:'0%';
  const top=Object.entries(state.categorySaves).sort((a,b)=>b[1]-a[1])[0];$('statsCategory').textContent=top&&top[1]>0?top[0]:'—';
  let title='Still calibrating',text='Swipe a few more ideas and your taste profile will appear here.';
  if(state.seen>=5){const rate=state.saved.length/state.seen;if(top?.[0]==='AI'){title='AI opportunist';text='You keep gravitating toward tools that compress work with software and automation.'}else if(top?.[0]==='SaaS'){title='Micro-SaaS hunter';text='You like focused products with clear recurring revenue and narrow problems.'}else if(top?.[0]==='Creator'){title='Creator economy brain';text='You are spotting products that help audiences, creators and content move faster.'}else if(top?.[0]==='Local'){title='Real-world fixer';text='You seem drawn to products that make nearby places and people work better.'}else if(top?.[0]==='Consumer'){title='Consumer instinct';text='You favour products that are simple to explain and useful immediately.'}else if(rate<.2){title='Ruthless filter';text='You are passing on almost everything. That can be a superpower if the few saves are strong.'}else{title='Balanced builder';text='You are saving selectively without filtering the world down to one category.'}}
  $('tasteTitle').textContent=title;$('tasteText').textContent=text
}

function switchScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.screen===id));if(id==='savedScreen')renderSaved();if(id==='statsScreen')updateStats();window.scrollTo({top:0,behavior:'smooth'})}
function setFilter(filter){state.filter=filter;state.index=0;state.history=[];document.querySelectorAll('.filter-chip').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));saveState();renderDeck()}
function shuffle(){state.deckOrder=[...ideas].sort(()=>Math.random()-.5).map(i=>i.id);state.index=0;state.history=[];state.streak=0;saveState();renderDeck();toast('Fresh deck shuffled ✦')}
function toast(msg){clearTimeout(toastTimer);$('toast').textContent=msg;$('toast').classList.add('show');toastTimer=setTimeout(()=>$('toast').classList.remove('show'),1300)}

$('passButton').onclick=()=>swipe('left');$('saveButton').onclick=()=>swipe('right');$('undoButton').onclick=undo;$('infoButton').onclick=()=>openSheet();$('shuffleButton').onclick=shuffle;$('profileButton').onclick=()=>switchScreen('statsScreen');$('brandButton').onclick=()=>switchScreen('discoverScreen');$('sheetBackdrop').onclick=closeSheet;$('savedSearch').addEventListener('input',renderSaved);
$('resetAllButton').onclick=()=>{if(confirm('Reset your saved ideas and stats?')){state={...defaultState,deckOrder:ideas.map(i=>i.id)};saveState();renderDeck();renderSaved();switchScreen('discoverScreen');toast('Reset complete')}};
document.querySelectorAll('.nav-item').forEach(n=>n.onclick=()=>switchScreen(n.dataset.screen));document.querySelectorAll('.filter-chip').forEach(b=>b.onclick=()=>setFilter(b.dataset.filter));
document.addEventListener('keydown',e=>{if($('detailSheet').classList.contains('open')){if(e.key==='Escape')closeSheet();return}if(!document.getElementById('discoverScreen').classList.contains('active'))return;if(e.key==='ArrowLeft')swipe('left');if(e.key==='ArrowRight')swipe('right');if(e.key==='ArrowUp')openSheet()});

renderDeck();renderSaved();updateStats();
