const BROKERS = [
  { name: 'RU', url: 'wss://demo.elxmqtt.com:8567/mqtt', options: { username: 'demo', password: 'demo12345' } },
  { name: 'EMQX', url: 'wss://broker.emqx.io:8084/mqtt' },
  { name: 'Mosquitto', url: 'wss://test.mosquitto.org:8081/mqtt' }
];
const PROTOCOL = 'duo-ru-4';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const $ = s => document.querySelector(s);
const state = {
  role: null, code: '', room: '', key: null, clients: [], connected: new Set(),
  peerSeen: 0, hostId: '', deviceId: crypto.randomUUID(), version: 0,
  game: null, localGameId: null, peerGameId: null, remoteSnapshot: null,
  answers: {}, handled: new Set(), timers: [], lastSnapshotAt: 0,
  advanceTimer: null
};

const GAMES = [
  {id:'wave',icon:'💞',name:'На одной волне',desc:'Выберите ответы и проверьте совпадение',color:'#ff4fa3',questions:[
    ['Идеальный вечер вдвоём?',['Фильм и плед','Прогулка','Игры до ночи','Вкусный ужин']],
    ['Куда сорваться на выходные?',['Море','Большой город','Домик в лесу','Остаться дома']],
    ['Что важнее прямо сейчас?',['Объятия','Смешной разговор','Вкусная еда','Совместный план']]
  ]},
  {id:'who',icon:'😈',name:'Кто из нас?',desc:'Честное голосование друг за друга',color:'#ff7c59',questions:[
    ['Кто дольше выбирает фильм?',['Я','Ты']],['Кто первым идёт мириться?',['Я','Ты']],['Кто устроит спонтанное приключение?',['Я','Ты']]
  ]},
  {id:'either',icon:'↔️',name:'Что выберешь?',desc:'Дилеммы без правильного ответа',color:'#7c6cff',questions:[
    ['Выберите одно',['Путешествовать весь год','Дом мечты']],['Что звучит лучше?',['Знать мысли друг друга','Всегда смешить друг друга']],['Свидание мечты',['Рассвет у моря','Ночной мегаполис']]
  ]},
  {id:'flags',icon:'🚩',name:'Красный или зелёный?',desc:'Оценивайте ситуации в отношениях',color:'#3fe0aa',questions:[
    ['Пишет «я дома», даже если устал',['🟢 Зелёный','🔴 Красный']],['Смотрит вашу общую серию без тебя',['🟢 Простительно','🔴 Предательство']],['Помнит твой заказ в кафе',['🟢 Зелёный','🔴 Это база']]
  ]},
  {id:'rps',icon:'✊',name:'Камень · ножницы',desc:'Классическая дуэль до трёх побед',color:'#ffbf47',questions:[
    ['Ваш ход',['✊ Камень','✌️ Ножницы','✋ Бумага']],['Ваш ход',['✊ Камень','✌️ Ножницы','✋ Бумага']],['Ваш ход',['✊ Камень','✌️ Ножницы','✋ Бумага']]
  ]},
  {id:'date',icon:'⭐',name:'Рейтинг свиданий',desc:'Найдите идею, которая нравится обоим',color:'#58e6ff',questions:[
    ['Оцените идею: приготовить новое блюдо',['1','2','3','4','5']],['Оцените идею: ночная прогулка',['1','2','3','4','5']],['Оцените идею: день без телефонов',['1','2','3','4','5']]
  ]},
  {id:'truth',icon:'🎭',name:'Правда или вызов',desc:'Тёплые вопросы и весёлые задания',color:'#e879f9',questions:[
    ['Выберите',['Правда','Вызов']],['Выберите',['Правда','Вызов']],['Выберите',['Правда','Вызов']]
  ]},
  {id:'dream',icon:'🌙',name:'Наше будущее',desc:'Сравните ваши маленькие мечты',color:'#8b9dff',questions:[
    ['Какой общий план хочется осуществить первым?',['Путешествие','Обустроить дом','Новое хобби','Большая покупка']],['Где встретить следующий Новый год?',['Дома','В поездке','С друзьями','Вдвоём']],['Какой питомец ваш?',['Кот','Собака','Оба','Пока никакой']]
  ]},
  {id:'food',icon:'🍓',name:'Вкусный выбор',desc:'Решите, что съесть на свидании',color:'#fb7185',questions:[
    ['Заказываем сейчас',['Пицца','Суши','Бургеры','Домашнее']],['Десерт',['Торт','Мороженое','Фрукты','Без десерта']],['Напиток',['Кофе','Чай','Лимонад','Какао']]
  ]},
  {id:'memory',icon:'📸',name:'Помнишь нас?',desc:'Сравните любимые моменты',color:'#34d399',questions:[
    ['Самое приятное время вместе',['Утро','День','Вечер','Ночь']],['Что чаще всего вспоминается?',['Первая встреча','Смешной случай','Поездка','Тихий вечер']],['Лучший общий кадр',['Селфи','Случайное фото','Фото из поездки','Ещё не сняли']]
  ]}
];

function randomCode(n=10){const a=new Uint8Array(n);crypto.getRandomValues(a);return [...a].map(v=>ALPHABET[v%ALPHABET.length]).join('')}
function normalizeCode(v){return v.toUpperCase().replace(/[^A-Z2-9]/g,'').replace(/[IO01]/g,'').slice(0,10)}
function prettyCode(v){return v.length>5?v.slice(0,5)+'-'+v.slice(5):v}
async function sha(text){return new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))}
async function roomSetup(code){state.code=normalizeCode(code);const digest=await sha(PROTOCOL+':'+state.code);state.room=[...digest.slice(0,12)].map(x=>x.toString(16).padStart(2,'0')).join('');state.key=await crypto.subtle.importKey('raw',digest,'AES-GCM',false,['encrypt','decrypt'])}
async function seal(obj){const iv=crypto.getRandomValues(new Uint8Array(12));const raw=new TextEncoder().encode(JSON.stringify(obj));const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},state.key,raw));const all=new Uint8Array(iv.length+encrypted.length);all.set(iv);all.set(encrypted,iv.length);return btoa(String.fromCharCode(...all))}
async function open(payload){const all=Uint8Array.from(atob(payload),c=>c.charCodeAt(0));const raw=await crypto.subtle.decrypt({name:'AES-GCM',iv:all.slice(0,12)},state.key,all.slice(12));return JSON.parse(new TextDecoder().decode(raw))}
const topic=kind=>`duoru/${PROTOCOL}/${state.room}/${kind}`;

function connectAll(){
  disconnectAll();setConnectStatus('Ищем лучший канал…');
  BROKERS.forEach((b,index)=>{
    const client=mqtt.connect(b.url,{...b.options,clientId:'duo_'+state.deviceId.replaceAll('-','').slice(0,16)+'_'+index,clean:true,connectTimeout:7000,reconnectPeriod:2500,keepalive:18,protocolVersion:4});
    client.__name=b.name;
    client.on('connect',()=>{state.connected.add(b.name);client.subscribe([topic('event'),topic('state')],{qos:1});updateConnection();setTimeout(handshake,250)});
    client.on('message',async(t,p)=>{try{await receive(t,await open(p.toString()))}catch{}});
    const offline=()=>{state.connected.delete(b.name);updateConnection()};
    client.on('offline',offline);client.on('close',offline);client.on('error',()=>{});
    state.clients.push(client);
  });
  state.timers.push(setInterval(()=>{if(state.role==='host'&&state.game)publishSnapshot();handshake()},2500));
  state.timers.push(setInterval(checkPeer,1500));
}
function disconnectAll(){state.clients.forEach(c=>{try{c.end(true)}catch{}});state.clients=[];state.connected.clear();state.timers.forEach(clearInterval);state.timers=[]}
async function publish(kind,obj,retain=false){const packet={...obj,protocol:PROTOCOL,id:obj.id||crypto.randomUUID(),sender:state.deviceId,ts:Date.now()};const body=await seal(packet);let sent=0;state.clients.forEach(c=>{if(c.connected){sent++;c.publish(topic(kind),body,{qos:1,retain})}});return sent}
function handshake(){
  if(!state.code)return;
  publish('event',{type:'hello',role:state.role,version:state.version,gameId:state.localGameId});
  if(state.role==='guest'&&state.localGameId&&state.answers.guest!==undefined&&state.game){
    publish('event',{type:'answer',gameId:state.localGameId,round:state.game.round,answer:state.answers.guest})
  }
}
function checkPeer(){if(!state.code)return;const alive=Date.now()-state.peerSeen<7000;updateConnection(alive);if(!alive&&state.connected.size)setConnectStatus('Канал работает. Ждём второго игрока…')}
function updateConnection(peerAlive=Date.now()-state.peerSeen<7000){const badge=$('#connectionBadge');const span=badge.querySelector('span');if(peerAlive){badge.classList.remove('muted');span.textContent='На связи'}else{badge.classList.add('muted');span.textContent=state.connected.size?`Канал: ${state.connected.size}/${BROKERS.length}`:'Переподключение…'}}
async function receive(t,msg){
  if(msg.protocol!==PROTOCOL||msg.sender===state.deviceId)return;
  state.peerSeen=Date.now();
  if(msg.type==='hello'){
    state.peerGameId=msg.gameId||null;
    if(state.role==='host'&&state.localGameId&&state.peerGameId===state.localGameId){
      ensureHostGame(state.localGameId);publishSnapshot()
    }else if(state.role==='guest')publish('event',{type:'hello-ack',role:'guest',gameId:state.localGameId});
    enterLobbyIfNeeded();refreshWaiting();return
  }
  if(msg.type==='hello-ack'){state.peerGameId=msg.gameId||null;enterLobbyIfNeeded();refreshWaiting();return}
  if(state.handled.has(msg.id))return;state.handled.add(msg.id);if(state.handled.size>400)state.handled.delete(state.handled.values().next().value);
  if(msg.type==='game-presence'){
    state.peerGameId=msg.gameId||null;
    if(state.role==='host'&&state.localGameId&&state.peerGameId===state.localGameId){
      ensureHostGame(state.localGameId);publishSnapshot()
    }
    refreshWaiting();return
  }
  if(msg.type==='answer'&&state.role==='host'&&state.localGameId===msg.gameId){
    ensureHostGame(msg.gameId);applyAnswer('guest',msg.answer,msg.round);return
  }
  if(msg.type==='snapshot'&&state.role==='guest'){
    state.remoteSnapshot=msg;
    if(state.localGameId!==msg.game?.id||msg.version<state.version)return;
    if(msg.version===state.version&&state.game?.session&&state.game.session===msg.game?.session)return;
    const pending=state.game&&msg.game&&state.game.id===msg.game.id&&state.game.round===msg.game.round?state.answers.guest:undefined;
    state.version=msg.version;state.game=msg.game;state.answers=msg.answers||{};
    if(pending!==undefined&&state.answers.guest===undefined){
      state.answers.guest=pending;
      publish('event',{type:'answer',gameId:state.localGameId,round:state.game.round,answer:pending})
    }
    state.lastSnapshotAt=Date.now();renderGame()
  }
}
function enterLobbyIfNeeded(){if(!state.game&&$('#screen-connect').classList.contains('active'))show('lobby')}
function snapshot(){return {type:'snapshot',version:state.version,game:state.game,answers:state.answers}}
function publishSnapshot(){if(state.role==='host')publish('state',snapshot(),true)}

function startGame(gameId){
  if(!GAMES.some(g=>g.id===gameId))return;
  state.localGameId=gameId;state.answers={};
  if(state.role==='host')ensureHostGame(gameId);
  else if(state.remoteSnapshot?.game?.id===gameId){
    state.version=state.remoteSnapshot.version;state.game=state.remoteSnapshot.game;state.answers=state.remoteSnapshot.answers||{}
  }else state.game={id:gameId,session:null,round:0,revealed:false};
  show('game');renderGame();
  publish('event',{type:'game-presence',gameId});
  if(state.role==='host')publishSnapshot()
}
function ensureHostGame(gameId){
  if(state.game?.id===gameId&&state.game.session)return;
  state.version++;state.game={id:gameId,session:crypto.randomUUID(),round:0,revealed:false};state.answers={}
}
function leaveGame(){
  clearTimeout(state.advanceTimer);state.advanceTimer=null;
  state.localGameId=null;state.game=null;state.answers={};show('lobby');
  publish('event',{type:'game-presence',gameId:null})
}
function refreshWaiting(){if(state.localGameId&&state.game&&!state.game.session)renderGame()}
function choose(answer){
  if(!state.game||state.game.revealed)return;
  const round=state.game.round;
  if(state.role==='host')applyAnswer('host',answer,round);
  else{state.answers={...state.answers,guest:answer};renderGame();publish('event',{type:'answer',gameId:state.localGameId,round,answer});}
}
function applyAnswer(who,answer,round){
  if(round!==state.game.round||state.answers[who]!==undefined)return;state.answers[who]=answer;state.version++;
  if(state.answers.host!==undefined&&state.answers.guest!==undefined)state.game.revealed=true;
  renderGame();publishSnapshot();
  if(state.game.revealed&&state.role==='host')scheduleNextRound();
}
function scheduleNextRound(){
  if(state.advanceTimer)return;
  state.advanceTimer=setTimeout(()=>{
    state.advanceTimer=null;
    if(state.role!=='host'||!state.game?.revealed)return;
    const game=GAMES.find(g=>g.id===state.game.id);
    if(state.game.round+1<game.questions.length){
      state.version++;state.game.round++;state.game.revealed=false;state.answers={};renderGame();publishSnapshot()
    }
  },2200)
}
function nextRound(){
  if(state.role!=='host')return toast('Следующий раунд запускает создатель комнаты');
  const game=GAMES.find(g=>g.id===state.game.id);
  if(state.game.round+1>=game.questions.length)return leaveGame();
  state.version++;state.game.round++;state.game.revealed=false;state.answers={};renderGame();publishSnapshot();
}

function renderGrid(){$('#gameGrid').innerHTML=GAMES.map(g=>`<button class="game-card" data-game="${g.id}" style="--glow:${g.color}"><span class="icon">${g.icon}</span><h3>${g.name}</h3><p>${g.desc}</p></button>`).join('')}
function renderGame(){
  if(!state.game)return;const g=GAMES.find(x=>x.id===state.game.id);if(!g)return;
  const [question,choices]=g.questions[state.game.round];$('#roundLabel').textContent=`${g.name} · ${state.game.round+1}/${g.questions.length}`;
  const mine=state.answers[state.role],both=state.game.revealed;
  let extra='';
  if(both){const same=state.answers.host===state.answers.guest;extra=`<div class="result-pair"><div class="answer-box"><span>Создатель</span><strong>${escapeHtml(state.answers.host)}</strong></div><div class="answer-box"><span>Второй игрок</span><strong>${escapeHtml(state.answers.guest)}</strong></div></div><div class="result-title">${same?'💞 Совпало!':'✨ Интересно!'}</div>`;if(same)confetti()
  }
  $('#gameStage').innerHTML=`<div class="prompt-card"><div class="big-icon">${g.icon}</div><h2>${question}</h2><div class="choices">${choices.map(c=>`<button class="choice ${mine===c?'selected':''}" data-answer="${escapeAttr(c)}" ${mine!==undefined?'disabled':''}>${c}</button>`).join('')}</div>${extra}</div>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function escapeAttr(s){return escapeHtml(s).replace(/'/g,'&#39;')}
function show(name){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));$('#screen-'+name).classList.add('active');if(name==='lobby'){$('#lobbyCode').textContent=prettyCode(state.code);renderGrid()}}
function setConnectStatus(text,error=false){const el=$('#connectStatus');el.textContent=text;el.classList.toggle('error',error)}
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1900)}
function confetti(){const root=$('#confetti');for(let i=0;i<24;i++){const e=document.createElement('i');e.style.left=Math.random()*100+'vw';e.style.background=['#ff4fa3','#8b5cf6','#58e6ff','#ffd166'][i%4];e.style.setProperty('--x',(Math.random()*160-80)+'px');e.style.animationDelay=Math.random()*.5+'s';root.append(e);setTimeout(()=>e.remove(),3000)}}
async function createRoom(){state.role='host';await roomSetup(randomCode());state.version=0;state.game=null;state.localGameId=null;state.answers={};$('#createPane').hidden=false;$('#joinPane').hidden=true;$('#roomCode').textContent=prettyCode(state.code);show('connect');connectAll()}
function joinScreen(){disconnectAll();state.role='guest';state.code='';$('#createPane').hidden=true;$('#joinPane').hidden=false;$('#joinCode').value='';setConnectStatus('');show('connect');setTimeout(()=>$('#joinCode').focus(),250)}
async function joinRoom(e){e.preventDefault();const code=normalizeCode($('#joinCode').value);if(code.length!==10)return setConnectStatus('Код должен содержать 10 символов',true);state.role='guest';await roomSetup(code);state.version=0;state.game=null;state.localGameId=null;state.answers={};setConnectStatus('Подключаемся…');connectAll()}
function home(){disconnectAll();Object.assign(state,{role:null,code:'',room:'',key:null,peerSeen:0,game:null,localGameId:null,peerGameId:null,remoteSnapshot:null,answers:{},version:0});show('home');updateConnection(false)}
async function copyCode(){if(!state.code)return;try{await navigator.clipboard.writeText(state.code);toast('Код скопирован')}catch{toast(prettyCode(state.code))}}

document.addEventListener('click',e=>{
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(action==='create')createRoom();if(action==='join')joinScreen();if(action==='home')home();if(action==='copy-code')copyCode();
  if(action==='leave-game')leaveGame();
  if(action==='next')nextRound();
  const game=e.target.closest('[data-game]')?.dataset.game;if(game)startGame(game);
  const answer=e.target.closest('[data-answer]')?.dataset.answer;if(answer!==undefined)choose(answer);
});
$('#joinPane').addEventListener('submit',joinRoom);
$('#joinCode').addEventListener('input',e=>{const n=normalizeCode(e.target.value);e.target.value=prettyCode(n)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state.code){state.clients.forEach(c=>{if(!c.connected)try{c.reconnect()}catch{}});handshake()}});
window.addEventListener('online',()=>{state.clients.forEach(c=>{if(!c.connected)try{c.reconnect()}catch{}})});
window.addEventListener('beforeunload',disconnectAll);
renderGrid();updateConnection(false);

export { normalizeCode, prettyCode, randomCode };
