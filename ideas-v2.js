const TOTAL_IDEAS = 1_000_000;
const CATEGORIES = ['AI','Consumer','SaaS','Creator','Local'];
const CATEGORY_TOTAL = TOTAL_IDEAS / CATEGORIES.length;

const CATEGORY_MODELS = {
  AI:['$8/mo','$12/mo','$19/mo','Freemium','$2/use','$29/mo','$5/mo','$15/mo'],
  Consumer:['$3/mo','$5/mo','$8/mo','Freemium','$9 one-time','$2/mo','$12 one-time','$4/mo'],
  SaaS:['$12/mo','$19/mo','$29/mo','$49/mo','$79/mo','$99/mo','$9/mo','$39/mo'],
  Creator:['$5/mo','$9/mo','$12/mo','7% fee','Freemium','10% fee','$19/mo','$4/mo'],
  Local:['$19/mo','$29/mo','$49/mo','5% fee','Freemium','$9/mo','$39/mo','$59/mo']
};
const TREND_SIGNALS = ['Growing niche','Strong pain','Low-friction MVP','Clear ROI','Habit potential','Underserved market','Great wedge','Easy to explain'];
const ACCENTS = {AI:'135, 92, 255',Consumer:'98, 240, 181',SaaS:'109, 231, 255',Creator:'255, 121, 192',Local:'255, 169, 83'};
const BRAND_PREFIX = ['Nova','Pulse','Loop','Snap','Bright','Tiny','Mint','Echo','Flux','Orbit','Luma','Nudge','Pixel','Relay','Pocket','Signal','Drift','Forge','Spark','Scout','Clever','Quick','Quiet','Fresh','Kite','Bloom','Stack','Dash','Pebble','Wink','Lift','North'];
const BRAND_SUFFIX = ['Flow','Kit','Pilot','Lab','OS','Deck','Loop','Scout','Base','Beam','Path','Nest','Grid','Drop','Mate','Map','Lens','Dock','Wave','Stack','Sync','Spark','Box','Vault','Tap','Track','Bridge','Shift','Fox','Mint','Dash','Hub'];
const FUNCTION_SUFFIX = ['OS','Radar','Pilot','Kit','Flow','Desk','Engine','Tracker','Studio','Assistant','Hub','Vault'];

const CATALOG = {
AI:{
 audiences:['freelancers','students','founders','sales teams','support teams','recruiters','researchers','teachers','parents','real-estate agents','accountants','e-commerce sellers','developers','designers','podcasters','video editors','marketers','consultants','law firms','small agencies','property managers','event teams','remote teams','job seekers'],
 problems:['proposal writing','research synthesis','competitor tracking','lead qualification','support triage','candidate screening','document search','lesson planning','calendar chaos','listing creation','expense cleanup','pricing research','QA testing','feedback organisation','voice-note clutter','content repurposing','copy variants','client updates','contract review prep','project handoffs','repetitive admin','meeting follow-up','knowledge loss','job applications'],
 mechanisms:['private copilot','browser extension','email agent','local-first assistant','voice assistant','document workspace','calendar agent','inbox bot','mobile scanner','desktop helper','Slack bot','research agent','workflow recorder','smart search layer','meeting sidekick','form-filling agent'],
 twists:['works without setup','only learns from approved data','runs on a five-minute daily ritual','shows every source it used','has a one-button mode','focuses on one job only','turns output into a checklist','asks before taking actions','works from screenshots','is built for tiny teams','has no dashboard','summarizes everything into one page'],
 outcomes:['save hours each week','reduce missed follow-ups','find answers instantly','make messy work feel obvious','cut repetitive clicks','turn chaos into a queue','make decisions faster','keep context from disappearing']
},
Consumer:{
 audiences:['renters','families','students','travellers','online shoppers','new drivers','pet owners','roommates','home cooks','gym beginners','busy parents','concert fans','book lovers','casual gamers','people moving house','commuters','budget travellers','teenagers','remote workers','new homeowners','gift buyers','sports fans','people with side projects','friend groups'],
 problems:['shared expenses','household chores','study planning','trip planning','return deadlines','car maintenance reminders','pet care reminders','shared expenses','meal decisions','habit drop-off','household scheduling','event coordination','reading backlog','game backlog','moving checklists','commute uncertainty','packing lists','weekend indecision','digital clutter','home maintenance','gift planning','fixture planning','tiny recurring errands','group availability'],
 mechanisms:['mobile companion','shared checklist','smart reminder app','photo-first planner','one-screen dashboard','group planner','map-based tool','simple tracker','widget-first app','private timeline','micro-journal','decision helper','household board','shared calendar','offline planner','notification assistant'],
 twists:['takes under ten seconds a day','has zero account setup','works offline','is designed for two people','uses photos instead of typing','resets every Monday','turns tasks into tiny streaks','has a family mode','never sends spammy notifications','shows one decision at a time','is deliberately simple','can be shared with a link'],
 outcomes:['make daily life less annoying','prevent wasted money','reduce decision fatigue','keep everyone in sync','turn forgotten tasks into automatic wins','make planning feel lightweight','help people finish what they start','replace five messy notes apps']
},
SaaS:{
 audiences:['freelancers','small agencies','indie founders','consultants','design studios','bookkeepers','property managers','repair shops','small clinics','tutors','event planners','photographers','recruiters','law firms','marketing teams','software teams','coaches','local service businesses','e-commerce brands','nonprofits','construction teams','virtual assistants','B2B sales teams','customer-success teams'],
 problems:['client status updates','asset approvals','proposal tracking','client updates','invoice chasing','renewal tracking','onboarding chaos','document collection','appointment follow-up','lesson scheduling','vendor management','asset approvals','lead handoff','contract reminders','recurring reports','support handoffs','testimonial collection','client portals','inventory alerts','donor follow-up','capacity planning','meeting action items','simple CRM overload','feedback loops'],
 mechanisms:['tiny web dashboard','client portal','email-native workflow','shared inbox layer','single-purpose CRM','approval board','automated digest','status page','form-to-workflow tool','lightweight tracker','browser sidebar','report generator','renewal calendar','simple pipeline','template workspace','no-code automation'],
 twists:['does one job exceptionally well','replaces a spreadsheet','needs no onboarding call','has flat pricing','is built for teams under ten','works from email first','ships with opinionated defaults','has no custom fields','takes five minutes to set up','exports everything cleanly','has a client-facing mode','never becomes an enterprise suite'],
 outcomes:['save billable hours','make revenue less leaky','reduce client confusion','replace spreadsheet glue','speed up approvals','surface work that is stuck','make recurring work automatic','give small teams enterprise-grade clarity without enterprise bloat']
},
Creator:{
 audiences:['YouTubers','streamers','podcasters','newsletter writers','TikTok creators','indie musicians','photographers','designers','course creators','small influencers','writers','video editors','artists','community owners','game streamers','voice actors','fitness creators','food creators','travel creators','student creators','meme pages','indie filmmakers','educators','review channels'],
 problems:['content backlog','live clip discovery','episode planning','issue planning','posting consistency','release planning','asset organisation','portfolio updates','launch planning','brand deal admin','draft organisation','edit pipeline','commission tracking','community prompts','stream clip discovery','audio reel organisation','program planning','recipe content planning','trip content planning','study content planning','posting consistency','project planning','lesson repurposing','review backlog'],
 mechanisms:['creator dashboard','clip workspace','content calendar','sponsor CRM','idea inbox','media kit builder','mobile capture app','collab board','asset vault','launch checklist','audience portal','series planner','analytics digest','brief generator','portfolio builder','drop storefront'],
 twists:['feels more like a notes app than software','is designed for one creator','has a public share mode','works from the camera roll','keeps every brand deal in one timeline','starts with templates instead of blank pages','has a Sunday planning ritual','turns comments into an idea queue','requires no analytics jargon','works well on a phone','prioritises unfinished work','keeps the interface intentionally tiny'],
 outcomes:['ship more consistently','lose fewer good ideas','make sponsorships easier to manage','turn one piece of content into many','keep creative work organised without killing the vibe','reduce creator admin','make launches less chaotic','show fans a cleaner experience']
},
Local:{
 audiences:['cafes','gyms','apartment buildings','sports clubs','barbers','salons','tutors','repair shops','local restaurants','dog walkers','community groups','markets','small retailers','tradies','music venues','dance studios','medical practices','schools','neighbourhood groups','food trucks','cleaners','local photographers','co-working spaces','kids activity providers'],
 problems:['wait times','membership reminders','notice boards','last-minute cancellations','appointment gaps','appointment gaps','lesson scheduling','repair status updates','queue management','repeat bookings','community lending','event attendance','local discovery','walk-in demand','event attendance','class availability','appointment gaps','family notices','neighbour updates','pickup coordination','roster changes','booking deposits','membership reminders','class availability'],
 mechanisms:['QR-first app','live queue board','booking widget','neighbourhood board','simple loyalty pass','SMS-first tool','availability map','local marketplace','digital noticeboard','waitlist manager','shared calendar','request portal','pickup tracker','membership wallet','referral card','micro-directory'],
 twists:['works without downloading an app','can be opened from a QR code','is free for customers','is designed for one suburb','needs no POS integration','has a giant simple display mode','uses SMS for everything important','works for walk-ins first','can be managed from a phone','has no social feed','takes one minute to set up','is useful with only ten users'],
 outcomes:['fill empty capacity','reduce no-shows','make neighbourhood coordination easier','turn walk-ins into repeat customers','help nearby people discover useful things','make queues less painful','keep local communities informed','replace paper signs and messy group chats']
}};

function hash32(x){x=Number(x)>>>0;x^=x>>>16;x=Math.imul(x,0x7feb352d);x^=x>>>15;x=Math.imul(x,0x846ca68b);x^=x>>>16;return x>>>0}
function pick(arr,seed){return arr[seed%arr.length]}
function titleCase(text){return text.replace(/\b\w/g,c=>c.toUpperCase())}
function shortProblem(text){return titleCase(text.split(' ').slice(0,2).join(' ')).replace(/[^A-Za-z0-9 ]/g,'')}
function nameFor(id,category,audience,problem,mechanism){const h=hash32(id*2654435761),style=h%5;if(style===0)return pick(BRAND_PREFIX,h>>>3)+pick(BRAND_SUFFIX,h>>>11);if(style===1)return `${shortProblem(problem)} ${pick(FUNCTION_SUFFIX,h>>>7)}`;if(style===2)return `${titleCase(audience.split(' ')[0])} ${pick(FUNCTION_SUFFIX,h>>>9)}`;if(style===3)return pick(BRAND_PREFIX,h>>>5)+pick(['ly','io','ify','ora','let','wise','base','lane'],h>>>13);return titleCase(mechanism.split(' ').slice(0,2).join(' '))}
function difficultyFor(seed){return ['Easy','Easy','Medium','Medium','Medium','Hard'][seed%6]}
function timeFor(difficulty,seed){const sets={Easy:['3 days','5 days','1 week','10 days'],Medium:['2 weeks','3 weeks','4 weeks','5 weeks'],Hard:['6 weeks','8 weeks','10 weeks','12 weeks']};return pick(sets[difficulty],seed>>>4)}
function trendFor(seed){return pick(TREND_SIGNALS,seed>>>8)}
function scoreFor(seed,difficulty){let score=64+(seed%31);if(difficulty==='Easy')score+=2;if(difficulty==='Hard')score-=2;return Math.max(55,Math.min(96,score))}

function ideaById(id){
 id=Math.max(1,Math.min(TOTAL_IDEAS,Math.trunc(Number(id)||1)));
 const categoryIndex=(id-1)%CATEGORIES.length,category=CATEGORIES[categoryIndex],data=CATALOG[category],q=Math.floor((id-1)/CATEGORIES.length);
 const COMBO_SPACE=24*16*12*8*8;let combo=(Math.imul(q,7919)+(categoryIndex+1)*104729)%COMBO_SPACE;
 const audienceIndex=combo%24;combo=Math.floor(combo/24);const mechanismIndex=combo%16;combo=Math.floor(combo/16);const twistIndex=combo%12;combo=Math.floor(combo/12);const outcomeIndex=combo%8;combo=Math.floor(combo/8);const modelIndex=combo%8;
 const seed=hash32(q^hash32((categoryIndex+1)*0x9e3779b1)),audience=data.audiences[audienceIndex],problem=data.problems[audienceIndex],mechanism=data.mechanisms[mechanismIndex],twist=data.twists[twistIndex],outcome=data.outcomes[outcomeIndex];
 const difficulty=difficultyFor(hash32(seed^0x66778899)),time=timeFor(difficulty,hash32(seed^0x778899aa)),model=CATEGORY_MODELS[category][modelIndex],score=scoreFor(hash32(seed^0x99aabbcc),difficulty),name=nameFor(id,category,audience,problem,mechanism);
 const pitchTemplates=[`A ${mechanism} for ${audience} that tackles ${problem}, ${twist}, and aims to ${outcome}.`,`${titleCase(audience)} use a ${mechanism} to fix ${problem}. The hook: it ${twist} so they can ${outcome}.`,`Turn ${problem} into a simple workflow for ${audience} with a ${mechanism} that ${twist}.`,`A focused ${mechanism} built for ${audience}: solve ${problem}, keep it lightweight, and ${outcome}.`];
 const whyTemplates=[`The pain is frequent, the target user is easy to describe, and the first version can stay narrow. ${titleCase(twist)} gives it a clear wedge instead of becoming another giant all-in-one product.`,`This has a concrete before-and-after: ${problem} is messy today, while the product promises to ${outcome}. A small MVP could test willingness to use it quickly.`,`The strongest angle is focus. By building specifically for ${audience} and centring the product on ${problem}, it can be useful before it needs a huge network or feature set.`,`It can start as a tiny utility and grow only if people keep coming back. The ${mechanism} format also makes the value easy to demo in a short video or landing page.`];
 return {id,name,pitch:pick(pitchTemplates,hash32(seed^0xaabbccdd)),category,model,difficulty,time,score,trend:trendFor(hash32(seed^0xbbccddee)),tags:[category,titleCase(audience.split(' ').slice(0,2).join(' ')),titleCase(mechanism.split(' ').slice(0,2).join(' '))],accent:ACCENTS[category],why:pick(whyTemplates,hash32(seed^0xccddeeff))};
}

const PERMUTATION_MULTIPLIERS=[7919,104729,15485863,32452843,49979687,67867967,86028121,104395301].map(n=>n%TOTAL_IDEAS).filter(n=>n%2===1&&n%5!==0);
function catalogIdAt(position,shuffleSeed=1){const p=((Math.trunc(position)%TOTAL_IDEAS)+TOTAL_IDEAS)%TOTAL_IDEAS,s=hash32(shuffleSeed||1),a=PERMUTATION_MULTIPLIERS[s%PERMUTATION_MULTIPLIERS.length],b=hash32(s^0x5bd1e995)%TOTAL_IDEAS;return ((Math.imul(p,a)+b)%TOTAL_IDEAS+TOTAL_IDEAS)%TOTAL_IDEAS+1}
function ideaEntryAt(startPosition=0,shuffleSeed=1,filter='All'){let position=((Math.trunc(startPosition)%TOTAL_IDEAS)+TOTAL_IDEAS)%TOTAL_IDEAS;for(let checked=0;checked<TOTAL_IDEAS;checked++){const id=catalogIdAt(position,shuffleSeed),idea=ideaById(id);if(filter==='All'||idea.category===filter)return{idea,position};position=(position+1)%TOTAL_IDEAS}return null}
function ideaSequence(startPosition=0,shuffleSeed=1,filter='All',count=3){const out=[];let position=startPosition;while(out.length<count){const entry=ideaEntryAt(position,shuffleSeed,filter);if(!entry)break;out.push(entry);position=(entry.position+1)%TOTAL_IDEAS}return out}
function ideaCountForFilter(filter){return filter==='All'?TOTAL_IDEAS:CATEGORY_TOTAL}
