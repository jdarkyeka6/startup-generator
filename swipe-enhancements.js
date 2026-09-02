// SwipeStart interaction enhancements: locked discover viewport + swipe-up Maybe.
state.maybe = Array.isArray(state.maybe) ? state.maybe : [];
saveState();

const maybeStamp = document.createElement('div');
maybeStamp.className = 'swipe-stamp stamp-maybe';
maybeStamp.id = 'maybeStamp';
maybeStamp.textContent = 'MAYBE';
document.querySelector('.deck-wrap')?.appendChild(maybeStamp);

const fullscreenButton = $('fullscreenButton');
const fullscreenExitButton = $('fullscreenExitButton');

function setCardFullscreen(enabled){
  const discoverActive=document.getElementById('discoverScreen').classList.contains('active');
  const on=Boolean(enabled)&&discoverActive;
  document.body.classList.toggle('card-fullscreen',on);
  if(fullscreenButton){
    fullscreenButton.setAttribute('aria-pressed',String(on));
    fullscreenButton.setAttribute('aria-label',on?'Exit full screen card':'Make card full screen');
    fullscreenButton.title=on?'Exit full screen':'Full screen card';
  }
  if(fullscreenExitButton)fullscreenExitButton.setAttribute('aria-hidden',String(!on));
}

fullscreenButton?.addEventListener('click',()=>setCardFullscreen(!document.body.classList.contains('card-fullscreen')));
fullscreenExitButton?.addEventListener('click',()=>setCardFullscreen(false));

function isMaybe(id){return state.maybe.includes(id)}

swipe = function(direction,card=cardStack.querySelector('.idea-card')){
  const entry=currentEntry();
  if(!card||!entry)return;
  const idea=entry.idea;
  const action=direction==='right'?'saved':direction==='up'?'maybe':'passed';
  const savedAdded=action==='saved'&&!isSaved(idea.id);
  const maybeAdded=action==='maybe'&&!isSaved(idea.id)&&!isMaybe(idea.id);
  const removedFromMaybe=action==='saved'&&isMaybe(idea.id);

  state.history.push({ideaId:idea.id,position:currentPosition(),matchedPosition:entry.position,action,liked:action==='saved',savedAdded,maybeAdded,removedFromMaybe,filter:state.filter});
  if(state.history.length>100)state.history.shift();
  state.seen+=1;
  state.streak+=1;
  state.filterSeen[state.filter]=(state.filterSeen[state.filter]||0)+1;

  if(savedAdded){
    state.saved.unshift(idea.id);
    state.categorySaves[idea.category]=(state.categorySaves[idea.category]||0)+1;
  }
  if(removedFromMaybe)state.maybe=state.maybe.filter(id=>id!==idea.id);
  if(maybeAdded)state.maybe.unshift(idea.id);

  state.positions[state.filter]=(entry.position+1)%TOTAL_IDEAS;
  saveState();

  card.style.transition='transform 250ms cubic-bezier(.2,.8,.2,1),opacity 220ms ease';
  if(direction==='up') card.style.transform='translateY(-135%) scale(.96)';
  else {
    const liked=direction==='right';
    card.style.transform=`translateX(${liked?135:-135}%) rotate(${liked?15:-15}deg)`;
  }
  card.style.opacity='0';
  setTimeout(()=>{renderDeck();renderSaved()},205);
  toast(action==='saved'?'Saved to your shortlist ♥':action==='maybe'?'Added to Maybe ↑':'Passed');
};

undo = function(){
  const last=state.history.pop();
  if(!last){toast('Nothing to undo');return}
  if(last.filter!==state.filter){state.history.push(last);toast('Undo works inside the current filter');return}
  state.positions[state.filter]=last.position;
  state.filterSeen[state.filter]=Math.max(0,(state.filterSeen[state.filter]||0)-1);
  state.seen=Math.max(0,state.seen-1);
  state.streak=Math.max(0,state.streak-1);

  const action=last.action || (last.liked?'saved':'passed');
  const idea=ideaById(last.ideaId);
  if(action==='saved' && (last.savedAdded ?? last.liked)){
    state.saved=state.saved.filter(id=>id!==last.ideaId);
    if(idea)state.categorySaves[idea.category]=Math.max(0,(state.categorySaves[idea.category]||0)-1);
  }
  if(last.removedFromMaybe && !state.maybe.includes(last.ideaId))state.maybe.unshift(last.ideaId);
  if(action==='maybe' && (last.maybeAdded ?? true))state.maybe=state.maybe.filter(id=>id!==last.ideaId);

  saveState();renderDeck();renderSaved();toast('Undone');
};
$('undoButton').onclick=undo;

attachDrag = function(card){
  if(!card)return;
  let startX=0,startY=0,currentX=0,currentY=0,dragging=false;
  card.addEventListener('pointerdown',e=>{
    dragging=true;startX=e.clientX;startY=e.clientY;currentX=0;currentY=0;
    card.setPointerCapture(e.pointerId);card.style.transition='none';
  });
  card.addEventListener('pointermove',e=>{
    if(!dragging)return;
    currentX=e.clientX-startX;currentY=e.clientY-startY;
    const upward=Math.min(currentY,0);
    const horizontalDominant=Math.abs(currentX)>Math.abs(upward)*.85;
    if(horizontalDominant){
      card.style.transform=`translate(${currentX}px, ${upward*.12}px) rotate(${currentX/18}deg)`;
    }else{
      card.style.transform=`translate(${currentX*.12}px, ${upward}px) scale(${1-Math.min(Math.abs(upward)/1200,.035)})`;
    }
    const hs=Math.min(Math.abs(currentX)/105,1);
    const us=Math.min(Math.abs(upward)/105,1);
    saveStamp.style.opacity=currentX>0&&horizontalDominant?hs:0;
    passStamp.style.opacity=currentX<0&&horizontalDominant?hs:0;
    maybeStamp.style.opacity=!horizontalDominant&&upward<0?us:0;
  });
  const end=e=>{
    if(!dragging)return;
    dragging=false;saveStamp.style.opacity=0;passStamp.style.opacity=0;maybeStamp.style.opacity=0;
    if(card.hasPointerCapture(e.pointerId))card.releasePointerCapture(e.pointerId);
    const ax=Math.abs(currentX),up=-currentY;
    if(up>88 && up>ax*.9)swipe('up',card);
    else if(ax>88 && ax>Math.max(0,up)*.9)swipe(currentX>0?'right':'left',card);
    else {card.style.transition='transform 200ms cubic-bezier(.2,.8,.2,1)';card.style.transform='translate(0,0) rotate(0) scale(1)'}
    currentX=0;currentY=0;
  };
  card.addEventListener('pointerup',end);card.addEventListener('pointercancel',end);
};
renderDeck();

function maybeCardMarkup(i){
  return `<article class="saved-card maybe-card" style="--accent-rgb:${i.accent}"><div class="saved-card-head"><div data-open="${i.id}"><span class="category-badge">${i.category}</span><h3>${i.name}</h3></div><button class="remove-saved" data-remove-maybe="${i.id}" aria-label="Remove ${i.name} from Maybe">×</button></div><p data-open="${i.id}">${i.pitch}</p><div class="maybe-actions"><button data-open="${i.id}">Details</button><button class="promote-maybe" data-promote="${i.id}">Save ♥</button></div></article>`;
}

renderSaved = function(){
  state.maybe = Array.isArray(state.maybe) ? state.maybe : [];
  const q=$('savedSearch').value.trim().toLowerCase();
  const matches=i=>!q||`${i.name} ${i.pitch} ${i.tags.join(' ')}`.toLowerCase().includes(q);
  const savedList=state.saved.map(ideaById).filter(Boolean).filter(matches);
  const maybeList=state.maybe.map(ideaById).filter(Boolean).filter(matches);
  $('savedCount').textContent=state.saved.length.toLocaleString();
  savedBadge.textContent=state.saved.length.toLocaleString();

  const savedMarkup=savedList.length?savedList.map(i=>`<article class="saved-card" data-open="${i.id}" style="--accent-rgb:${i.accent}"><div class="saved-card-head"><div><span class="category-badge">${i.category}</span><h3>${i.name}</h3></div><button class="remove-saved" data-remove="${i.id}" aria-label="Remove ${i.name}">×</button></div><p>${i.pitch}</p><div class="tag-row">${i.tags.map(t=>`<span class="idea-tag">${t}</span>`).join('')}<span class="saved-score">${i.score}/100</span></div></article>`).join(''):emptyMarkup(state.saved.length?'No saved matches':'No saved ideas yet',state.saved.length?'Try a different search.':'Swipe right to save an idea.');
  const maybeMarkup=maybeList.length?maybeList.map(maybeCardMarkup).join(''):emptyMarkup(state.maybe.length?'No Maybe matches':'Your Maybe pile is empty',state.maybe.length?'Try a different search.':'Swipe up when an idea is interesting but not an instant yes.');
  savedGrid.innerHTML=`<div class="saved-section-label"><span>SAVED</span><strong>${state.saved.length}</strong></div>${savedMarkup}<div class="saved-section-label maybe-label"><span>MAYBE</span><strong>${state.maybe.length}</strong></div>${maybeMarkup}`;

  document.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();removeSaved(Number(b.dataset.remove))}));
  document.querySelectorAll('[data-remove-maybe]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();state.maybe=state.maybe.filter(id=>id!==Number(b.dataset.removeMaybe));saveState();renderSaved();toast('Removed from Maybe')}));
  document.querySelectorAll('[data-promote]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const id=Number(b.dataset.promote);const i=ideaById(id);state.maybe=state.maybe.filter(x=>x!==id);if(!isSaved(id)){state.saved.unshift(id);if(i)state.categorySaves[i.category]=(state.categorySaves[i.category]||0)+1}saveState();renderSaved();toast('Moved to Saved ♥')}));
  document.querySelectorAll('[data-open]').forEach(c=>c.addEventListener('click',()=>openSheet(Number(c.dataset.open))));
};
renderSaved();

const originalSwitchScreen=switchScreen;
switchScreen=function(id){
  if(id!=='discoverScreen')setCardFullscreen(false);
  document.body.classList.toggle('discover-locked',id==='discoverScreen');
  originalSwitchScreen(id);
};
document.body.classList.toggle('discover-locked',document.getElementById('discoverScreen').classList.contains('active'));

$('resetAllButton').onclick=()=>{
  if(confirm('Reset your saved ideas, Maybe pile and stats?')){
    state={...defaultState,positions:freshPositions(),filterSeen:freshFilterSeen(),maybe:[]};
    saveState();renderDeck();renderSaved();switchScreen('discoverScreen');toast('Reset complete');
  }
};

// Keyboard parity for desktop testing: ↑ = Maybe, F = full screen card, I = details.
document.addEventListener('keydown',e=>{
  if($('detailSheet').classList.contains('open'))return;
  if(!document.getElementById('discoverScreen').classList.contains('active'))return;
  if(e.key==='ArrowUp'){
    e.preventDefault();
    e.stopImmediatePropagation();
    swipe('up');
    return;
  }
  if(e.key.toLowerCase()==='f'){
    e.preventDefault();
    setCardFullscreen(!document.body.classList.contains('card-fullscreen'));
    return;
  }
  if(e.key.toLowerCase()==='i')openSheet();
},{capture:true});
