const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const screens = { home: $('#screen-home'), signal: $('#screen-signal'), lobby: $('#screen-lobby'), game: $('#screen-game') };

const syncQuestions = [
  ['Идеальный вечер?', 'Фильм + еда дома', 'Куда-нибудь выбраться'],
  ['Отпуск мечты?', 'Море и ничего не делать', 'Город и приключения'],
  ['Что важнее в подарке?', 'Сюрприз', 'Точно угадать желание'],
  ['После спора лучше…', 'Сразу всё обсудить', 'Сначала остыть'],
  ['Воскресное утро?', 'Спать до победного', 'Встать и куда-то поехать'],
  ['Фильм на двоих?', 'Комедия', 'Триллер'],
  ['Ночной перекус?', 'Сладкое', 'Солёное'],
  ['Свидание?', 'Красиво и заранее', 'Спонтанно и странно'],
  ['Питомец?', 'Кот', 'Собака'],
  ['Если выиграть миллион?', 'Тратить на впечатления', 'Сохранить и вложить'],
  ['В поездке?', 'План на каждый день', 'Разберёмся на месте'],
  ['Сериал?', 'Растянуть на неделю', 'Посмотреть за ночь'],
  ['Романтика?', 'Свечи и ужин', 'Дурачиться до слёз'],
  ['Свободный час?', 'Полежать рядом', 'Пойти гулять'],
  ['Общая покупка?', 'Красивое', 'Практичное'],
  ['Главное в паре?', 'Похожесть', 'Дополнять друг друга']
];

const whoQuestions = [
  'Кто дольше выбирает, что посмотреть?', 'Кто первым предлагает заказать еду?',
  'Кто чаще говорит «я уже выхожу», ещё не выйдя?', 'Кто скорее заснёт во время фильма?',
  'Кто первым мирится после ссоры?', 'Кто чаще делает смешные фото второго?',
  'Кто больше любит спонтанные поездки?', 'Кто дольше собирается?',
  'Кто чаще говорит «давай ещё одну серию»?', 'Кто лучше помнит мелкие детали?',
  'Кто скорее потратит деньги на ерунду, но очень приятную?', 'Кто чаще крадёт одеяло?',
  'Кто первым начнёт танцевать на кухне?', 'Кто сильнее скучает, когда вы не рядом?',
  'Кто предложит самое безумное свидание?'
];

const flagQuestions = [
  'Проверять телефон партнёра без спроса', 'Отменить планы ради неожиданного свидания',
  'Не отвечать несколько часов, потому что хочется побыть одному', 'Дарить подарки без повода',
  'Спорить до тех пор, пока кто-то не признает поражение', 'Иметь отдельные хобби и проводить время порознь',
  'Помнить все важные даты', 'Писать бывшим «просто узнать как дела»',
  'Засыпать во время совместного фильма', 'Устраивать сюрприз-поездку, не говоря куда',
  'Рассказывать друзьям подробности ваших ссор', 'Просить прямо сказать, что хочется получить в подарок',
  'Проводить целый выходной каждый сам по себе', 'Смеяться над странными привычками друг друга'
];

const wouldQuestions = [
  ['Один идеальный отпуск в год', 'Много коротких поездок'],
  ['Всегда выбирать фильм тебе', 'Всегда выбирать еду партнёру'],
  ['Жить месяц у моря', 'Жить месяц в любимом мегаполисе'],
  ['Сюрприз на день рождения', 'Получить именно то, что загадал(а)'],
  ['Спонтанное свидание ночью', 'Красивое свидание, запланированное за неделю'],
  ['На неделю без соцсетей', 'На неделю без сериалов'],
  ['Каждый день готовить вместе', 'Каждый день заказывать что-то новое'],
  ['Выиграть путешествие', 'Выиграть деньги на общую мечту'],
  ['Смотреть старые фото', 'Снимать новые видео'],
  ['Переехать в новый город', 'Сделать идеальным нынешний дом'],
  ['Получать милые сообщения каждый день', 'Большой романтический сюрприз раз в месяц'],
  ['Знать все мысли партнёра на день', 'Дать ему читать все свои мысли на день'],
  ['Всегда приходить на 20 минут раньше', 'Всегда опаздывать на 10 минут'],
  ['Свидание без телефонов', 'Свидание, где вы снимаете всё подряд']
];

const dateIdeas = [
  'Ночной пикник с пледом и музыкой', 'Поехать в незнакомый город без плана', 'Домашний ресторан: приготовить друг другу блюдо',
  'Квест-комната на двоих', 'День без телефонов и соцсетей', 'Совместный мастер-класс',
  'Выбрать фильм друг другу вслепую', 'Прогулка с фото-челленджем', 'Снять смешной мини-фильм про ваш день',
  'Завтрак в новом месте рано утром'
];

const secretPrompts = [
  'Какое наше свидание ты бы повторил(а) прямо сейчас?', 'Куда бы ты сорвался/сорвалась со мной завтра без подготовки?',
  'Какая моя привычка кажется тебе самой милой?', 'Что нам обязательно надо сделать вдвоём в этом году?',
  'Какой идеальный ленивый день для нас?', 'За что ты чаще всего хочешь меня обнять?',
  'Что мы могли бы делать вместе каждую неделю и не устать?', 'Какой подарок от меня был бы идеальным без ограничения бюджета?',
  'В каком городе нам стоило бы пожить месяц?', 'Одно слово, которым ты бы описал(а) нас сейчас?'
];

const blitzPrompts = [
  'Назови еду, которую мы могли бы съесть прямо сейчас', 'Куда поедем, если завтра дадут два билета?',
  'Какое моё слово или фраза сразу вспоминается?', 'Какой фильм подходит нам по настроению?',
  'Что купить на миллион рублей первым делом?', 'Что ты выберешь: море, горы или большой город?',
  'Какой эмодзи лучше всего описывает меня сегодня?', 'Какой маленький сюрприз поднял бы тебе настроение?'
];

const truths = [
  'Какой мой поступок тебя когда-то приятно удивил?', 'За что ты меня ценишь сильнее, чем обычно говоришь?',
  'Какое наше воспоминание ты бы сохранил(а) навсегда?', 'Когда ты понял(а), что со мной тебе действительно хорошо?',
  'Какая моя привычка иногда бесит, но без неё уже было бы странно?', 'Что ты хотел(а) бы чаще делать вместе?',
  'Какую мою черту ты бы хотел(а) забрать себе?', 'В каком месте ты особенно хочешь побывать со мной?',
  'Что я делаю лучше, чем сам(а) думаю?', 'Какой момент из нашей истории был самым смешным?'
];

const dares = [
  'За 20 секунд придумай рекламу партнёра как самого лучшего человека на планете.',
  'Изобрази без слов ваше первое или самое запоминающееся свидание.',
  'Скажи три комплимента подряд, не используя слова «красивый», «милый» и «люблю».',
  'Поставь песню, которая сейчас лучше всего подходит вашему вечеру.',
  'Сделай максимально серьёзное признание самым смешным голосом.',
  'Придумай вашему дуэту название музыкальной группы.',
  'За 30 секунд придумай идею самого странного свидания.',
  'Покажи предмет рядом с собой, который почему-то напоминает партнёра.',
  'Опиши ваши отношения тремя эмодзи и объясни выбор.',
  'Сделай скриншот этой игры и придумай к нему подпись как к афише фильма.'
];

const state = {
  role: null, name: '', names: { host: 'Игрок 1', guest: 'Игрок 2' },
  peer: null, channel: null, connected: false, demo: false,
  currentGame: null, game: null, timers: [], blitzInterval: null
};

function cleanName(v){ return (v || '').trim().slice(0,18) || 'Игрок'; }
function esc(v){ return String(v ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function otherRole(){ return state.role === 'host' ? 'guest' : 'host'; }
function showScreen(name){ Object.values(screens).forEach(s=>s.classList.remove('active')); screens[name].classList.add('active'); window.scrollTo({top:0,behavior:'smooth'}); }
function toast(text){ const el=$('#toast'); el.textContent=text; el.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove('show'),2200); }
function setStatus(ok,text){ state.connected=ok; $('#statusPill').classList.toggle('connected',ok); $('#statusText').textContent=text || (ok?'На связи':'Не подключено'); }
function progress(current,total){ return `<div class="progress-track"><div class="progress-fill" style="width:${Math.max(0,Math.min(100,((current)/total)*100))}%"></div></div>`; }

function sprinkle(count=3){
  const layer=$('#floatLayer');
  for(let i=0;i<count;i++){
    const el=document.createElement('span'); el.className='float-heart';
    el.textContent=['♥','✦','♡','✨'][Math.floor(Math.random()*4)];
    el.style.left=(8+Math.random()*84)+'vw'; el.style.setProperty('--dur',(4+Math.random()*3)+'s');
    el.style.setProperty('--drift',((-70+Math.random()*140))+'px'); el.style.animationDelay=(Math.random()*.3)+'s';
    layer.appendChild(el); setTimeout(()=>el.remove(),7500);
  }
}
function celebrate(count=38){
  const chars=['♥','✦','●','◆','★'];
  for(let i=0;i<count;i++){
    const el=document.createElement('span'); el.className='confetti'; el.textContent=chars[Math.floor(Math.random()*chars.length)];
    el.style.left=Math.random()*100+'vw'; el.style.setProperty('--x',(-120+Math.random()*240)+'px');
    el.style.setProperty('--r',(-540+Math.random()*1080)+'deg'); el.style.setProperty('--t',(1.7+Math.random()*1.6)+'s');
    el.style.color=[ '#47e7ff','#ff6cae','#5ff2ad','#ffd66d','#8aa0ff'][Math.floor(Math.random()*5)];
    document.body.appendChild(el); setTimeout(()=>el.remove(),3600);
  }
}

function addRipple(e){
  const btn=e.currentTarget; const rect=btn.getBoundingClientRect(); const dot=document.createElement('span'); dot.className='ripple';
  const size=Math.max(rect.width,rect.height); dot.style.width=dot.style.height=size+'px'; dot.style.left=(e.clientX-rect.left-size/2)+'px'; dot.style.top=(e.clientY-rect.top-size/2)+'px';
  btn.appendChild(dot); setTimeout(()=>dot.remove(),600);
}
document.addEventListener('pointerdown',e=>{ const btn=e.target.closest('.btn,.choice-btn,.rating-btn,.truth-mode'); if(btn) addRipple({currentTarget:btn,clientX:e.clientX,clientY:e.clientY}); });
setInterval(()=>{ if(!document.hidden && Math.random()>.35) sprinkle(1); },2200);

function encodeSignal(obj){ const bytes=new TextEncoder().encode(JSON.stringify(obj)); let binary=''; bytes.forEach(b=>binary+=String.fromCharCode(b)); return btoa(binary); }
function decodeSignal(text){ const binary=atob(text.trim()); const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0)); return JSON.parse(new TextDecoder().decode(bytes)); }
function waitIceComplete(pc){ if(pc.iceGatheringState==='complete')return Promise.resolve(); return new Promise(resolve=>{ const l=()=>{if(pc.iceGatheringState==='complete'){pc.removeEventListener('icegatheringstatechange',l);resolve();}}; pc.addEventListener('icegatheringstatechange',l); setTimeout(resolve,5200); }); }
function makePeer(){
  const pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]});
  pc.onconnectionstatechange=()=>{
    if(pc.connectionState==='connected' && state.channel?.readyState==='open') onConnected();
    if(['failed','disconnected','closed'].includes(pc.connectionState) && state.connected){setStatus(false,'Связь потеряна');toast('Соединение прервано');}
  };
  state.peer=pc; return pc;
}
function wireChannel(ch){ state.channel=ch; ch.onopen=onConnected; ch.onmessage=e=>{try{receive(JSON.parse(e.data));}catch(err){console.error(err)}}; ch.onclose=()=>setStatus(false,'Отключено'); }
function send(data){ if(state.demo) return demoRemote(data); if(state.channel?.readyState==='open') state.channel.send(JSON.stringify(data)); }
function onConnected(){ if(state.connected)return; setStatus(true,'На связи'); send({type:'profile',role:state.role,name:state.name}); sprinkle(8); setTimeout(enterLobby,180); }
function enterLobby(){ $('#meName').textContent=state.name; $('#partnerName').textContent=state.names[otherRole()]; showScreen('lobby'); }

function receive(msg){
  if(!msg || typeof msg!=='object')return;
  switch(msg.type){
    case 'profile': state.names[msg.role]=cleanName(msg.name); if(state.connected)enterLobby(); break;
    case 'chat': addChat(msg.text,false,msg.name); break;
    case 'startGame': startGame(msg.game,false); break;
    case 'leaveGame': clearGameTimers(); state.currentGame=null; showScreen('lobby'); break;
    case 'pick': if(state.currentGame===msg.game && state.game){state.game.picks[msg.role]=msg.choice; resolvePick();} break;
    case 'nextRound': if(state.currentGame===msg.game) nextRound(false); break;
    case 'reactionArm': if(state.currentGame==='reaction') armReaction(msg.round,msg.delay,false); break;
    case 'reactionResult': if(state.currentGame==='reaction' && state.role==='host'){state.game.results[msg.role]=msg.time;maybeRevealReaction();} break;
    case 'reactionReveal': if(state.currentGame==='reaction') showReactionReveal(msg); break;
    case 'textSubmit': if(state.currentGame===msg.game){state.game.answers[msg.role]=msg.text; resolveTextRound();} break;
    case 'blitzArm': if(state.currentGame==='blitz') armBlitz(msg.round,false); break;
    case 'ratingSubmit': if(state.currentGame==='rating'){state.game.ratings[msg.role]=Number(msg.rating);resolveRating();} break;
    case 'truthCard': if(state.currentGame==='truthdare') showTruthCard(msg.mode,msg.text,msg.index,false); break;
  }
}

function demoRemote(msg){
  const later=(fn,t=420)=>setTimeout(fn,t);
  if(msg.type==='chat') return later(()=>addChat(['Я здесь 😄','Ого 😂','Ну это спорно!'][Math.floor(Math.random()*3)],false,state.names.guest),420);
  if(msg.type==='pick'){
    let choices=['a','b'];
    if(state.currentGame==='who') choices=['host','guest'];
    if(state.currentGame==='flags') choices=['green','red'];
    if(state.currentGame==='rps') choices=['rock','paper','scissors'];
    return later(()=>receive({type:'pick',game:state.currentGame,role:'guest',choice:choices[Math.floor(Math.random()*choices.length)]}),350+Math.random()*380);
  }
  if(msg.type==='reactionResult') return later(()=>receive({type:'reactionResult',role:'guest',time:Math.round(220+Math.random()*300)}),260);
  if(msg.type==='textSubmit'){
    const samples=['Ты 😄','К морю!','Пицца','Спонтанная поездка','😂','Что-нибудь вкусное'];
    return later(()=>receive({type:'textSubmit',game:state.currentGame,role:'guest',text:samples[Math.floor(Math.random()*samples.length)]}),450);
  }
  if(msg.type==='ratingSubmit') return later(()=>receive({type:'ratingSubmit',role:'guest',rating:1+Math.floor(Math.random()*5)}),380);
}

async function hostFlow(){
  state.name=cleanName($('#playerName').value); state.role='host'; state.names.host=state.name; state.demo=false;
  showSignal('СОЗДАТЕЛЬ','Создаём код для подключения…','<div class="notice">Подготавливаем прямое соединение между двумя браузерами…</div>');
  try{ const pc=makePeer(); const ch=pc.createDataChannel('duo',{ordered:true}); wireChannel(ch); const offer=await pc.createOffer(); await pc.setLocalDescription(offer); await waitIceComplete(pc); renderHostSignal(encodeSignal(pc.localDescription)); }
  catch(e){console.error(e);showSignal('ОШИБКА','Не удалось создать подключение','<div class="notice">Обновите страницу. Для удалённой игры нужен современный браузер и HTTPS.</div>');}
}
function renderHostSignal(code){
  showSignal('СОЗДАТЕЛЬ','Отправь этот код девушке',`
    <div class="signal-block"><div class="signal-label"><span>Код подключения</span><span>Шаг 1 из 2</span></div><textarea id="offerOut" class="textarea" readonly></textarea><div class="signal-actions"><button id="copyOffer" class="btn primary" type="button">Скопировать код</button></div></div>
    <div class="signal-block"><div class="signal-label"><span>Вставь её ответный код</span><span>Шаг 2 из 2</span></div><textarea id="answerIn" class="textarea" placeholder="Она пришлёт ответный код — вставь его сюда"></textarea><div class="signal-actions"><button id="finishHost" class="btn secondary" type="button">Подключиться</button></div></div>`);
  $('#offerOut').value=code; $('#copyOffer').onclick=()=>copyText(code); $('#finishHost').onclick=async()=>{try{await state.peer.setRemoteDescription(decodeSignal($('#answerIn').value));toast('Код принят. Соединяемся…')}catch{toast('Похоже, код вставлен не полностью')}};
}
function joinFlow(){
  state.name=cleanName($('#playerName').value); state.role='guest'; state.names.guest=state.name; state.demo=false;
  showSignal('ПОДКЛЮЧЕНИЕ','Вставь код, который тебе прислали',`<div class="signal-block"><div class="signal-label"><span>Код создателя</span><span>Шаг 1 из 2</span></div><textarea id="offerIn" class="textarea" placeholder="Вставь сюда длинный код"></textarea><div class="signal-actions"><button id="makeAnswer" class="btn primary" type="button">Принять код</button></div></div><div id="answerBlock"></div>`);
  $('#makeAnswer').onclick=createAnswer;
}
async function createAnswer(){
  try{ const pc=makePeer(); pc.ondatachannel=e=>wireChannel(e.channel); await pc.setRemoteDescription(decodeSignal($('#offerIn').value)); const ans=await pc.createAnswer(); await pc.setLocalDescription(ans); await waitIceComplete(pc); const code=encodeSignal(pc.localDescription);
    $('#answerBlock').innerHTML=`<div class="signal-block"><div class="signal-label"><span>Отправь этот код обратно</span><span>Шаг 2 из 2</span></div><textarea id="answerOut" class="textarea" readonly></textarea><div class="signal-actions"><button id="copyAnswer" class="btn secondary" type="button">Скопировать ответ</button></div><p class="hint">После того как создатель вставит этот код у себя, вы подключитесь автоматически.</p></div>`;
    $('#answerOut').value=code; $('#copyAnswer').onclick=()=>copyText(code);
  }catch(e){console.error(e);toast('Не получилось прочитать код. Проверь, что он вставлен целиком');}
}
function showSignal(eyebrow,title,html){$('#signalEyebrow').textContent=eyebrow;$('#signalTitle').textContent=title;$('#signalContent').innerHTML=html;showScreen('signal');}
async function copyText(text){try{await navigator.clipboard.writeText(text);toast('Скопировано')}catch{toast('Выдели код и скопируй вручную')}}
function startDemo(){state.demo=true;state.role='host';state.name=cleanName($('#playerName').value||'Ты');state.names.host=state.name;state.names.guest='Виртуальный партнёр';setStatus(true,'Демо');sprinkle(8);enterLobby();}
function addChat(text,mine,name){const t=(text||'').trim();if(!t)return;const box=document.createElement('div');box.className='chat-msg'+(mine?' mine':'');box.textContent=mine?t:`${name||'Партнёр'}: ${t}`;$('#chatMessages').appendChild(box);$('#chatMessages').scrollTop=$('#chatMessages').scrollHeight;}

function startGame(game,broadcast=true){
  clearGameTimers(); state.currentGame=game; state.game={round:0,picks:{},score:0,scores:{host:0,guest:0},answers:{},results:{},ratings:{},bestDates:[],truthIndex:0};
  if(broadcast)send({type:'startGame',game}); showScreen('game');
  if(game==='sync') setupBinary('✦ СОВПАДЕНИЯ','На одной волне');
  else if(game==='who') setupBinary('✦ ГОЛОСОВАНИЕ','Кто из нас?');
  else if(game==='flags') setupBinary('🚩 МНЕНИЯ','Красный или зелёный?');
  else if(game==='would') setupBinary('↔️ ДИЛЕММЫ','Что бы ты выбрал?');
  else if(game==='rps') setupRps();
  else if(game==='reaction') setupReaction();
  else if(game==='rating') setupRating();
  else if(game==='secret') setupTextGame('🔐 СЕКРЕТЫ','Секретный ответ');
  else if(game==='blitz') setupBlitz();
  else if(game==='truthdare') setupTruthDare();
}

function binaryMeta(game){
  if(game==='sync') return {total:syncQuestions.length,prompt:i=>syncQuestions[i][0],choices:i=>[['a',syncQuestions[i][1]],['b',syncQuestions[i][2]]],match:true};
  if(game==='who') return {total:whoQuestions.length,prompt:i=>whoQuestions[i],choices:()=>[['host',state.names.host],['guest',state.names.guest]],match:true};
  if(game==='flags') return {total:flagQuestions.length,prompt:i=>flagQuestions[i],choices:()=>[['green','🟢 Зелёный флаг'],['red','🔴 Красный флаг']],match:true};
  if(game==='would') return {total:wouldQuestions.length,prompt:i=>'Что бы ты выбрал(а)?',sub:i=>wouldQuestions[i],choices:i=>[['a',wouldQuestions[i][0]],['b',wouldQuestions[i][1]]],match:true};
}
function setupBinary(kicker,title){$('#gameKicker').textContent=kicker;$('#gameTitle').textContent=title;renderBinaryRound();}
function renderBinaryRound(){
  const meta=binaryMeta(state.currentGame),i=state.game.round;if(i>=meta.total)return finishBinary(meta.total);state.game.picks={};$('#roundBadge').textContent=`${i+1} / ${meta.total}`;
  const choices=meta.choices(i); const extra=state.currentGame==='would'?`<p class="subprompt">Выберите вариант, который вам ближе. Ответ партнёра скрыт до раскрытия.</p>`:'';
  $('#gameArea').innerHTML=`<div class="panel game-panel"><div class="prompt">${esc(meta.prompt(i))}</div>${extra}<div class="choice-grid">${choices.map(([v,l])=>`<button class="choice-btn" data-choice="${v}" type="button">${esc(l)}</button>`).join('')}</div><div id="waiting" class="waiting">Сделай выбор — партнёр увидит его только после своего ответа.</div><div id="revealBox"></div>${progress(i,meta.total)}</div>`;
  $$('.choice-btn').forEach(b=>b.onclick=()=>makePick(b.dataset.choice));
}
function makePick(choice){
  if(state.game.picks[state.role]!=null)return; state.game.picks[state.role]=choice;
  $$('.choice-btn').forEach(b=>{b.disabled=true;b.classList.toggle('selected',b.dataset.choice===choice)}); $('#waiting').textContent='Ответ принят. Ждём партнёра…';
  send({type:'pick',game:state.currentGame,role:state.role,choice}); resolvePick();
}
function labelForChoice(game,choice){
  const i=state.game.round;
  if(game==='sync') return choice==='a'?syncQuestions[i][1]:syncQuestions[i][2];
  if(game==='who') return state.names[choice];
  if(game==='flags') return choice==='green'?'🟢 Зелёный':'🔴 Красный';
  if(game==='would') return choice==='a'?wouldQuestions[i][0]:wouldQuestions[i][1];
  if(game==='rps') return ({rock:'✊ Камень',paper:'✋ Бумага',scissors:'✌️ Ножницы'})[choice];
  return choice;
}
function resolvePick(){
  if(!state.game?.picks || state.game.picks.host==null || state.game.picks.guest==null)return;
  if(state.currentGame==='rps')return resolveRps();
  const a=state.game.picks.host,b=state.game.picks.guest,match=a===b;if(match){state.game.score++;sprinkle(4)}
  $('#waiting').textContent='';
  $('#revealBox').innerHTML=`<div class="reveal ${match?'match':''}"><div class="reveal-title">${match?'Совпали ✦':'Разные ответы — интересно'}</div><div class="answer-row"><span class="answer-pill">${esc(state.names.host)}: ${esc(labelForChoice(state.currentGame,a))}</span><span class="answer-pill">${esc(state.names.guest)}: ${esc(labelForChoice(state.currentGame,b))}</span></div><div class="next-wrap">${state.role==='host'?'<button id="nextBtn" class="btn primary" type="button">Следующий раунд</button>':'<span class="hint">Следующий раунд запускает создатель</span>'}</div></div>`;
  if(state.role==='host')$('#nextBtn').onclick=()=>nextRound(true);
}
function nextRound(broadcast=true){if(broadcast)send({type:'nextRound',game:state.currentGame});state.game.round++; if(['sync','who','flags','would'].includes(state.currentGame))renderBinaryRound(); else if(state.currentGame==='rps')renderRpsRound(); else if(state.currentGame==='rating')renderRatingRound(); else if(state.currentGame==='secret')renderTextRound(); else if(state.currentGame==='blitz')renderBlitzReady(); else if(state.currentGame==='reaction')renderReactionReady();}
function finishBinary(total){
  const pct=Math.round(state.game.score/total*100); let emoji='✨',title='У вас свой вайб'; if(pct>=80){emoji='💞';title='Вы буквально на одной волне'} else if(pct<45){emoji='😈';title='С вами точно не скучно'}
  $('#roundBadge').textContent='Финиш'; $('#gameArea').innerHTML=finishHtml(emoji,title,`${state.game.score} совпадений из ${total} • ${pct}%`); celebrate(28); wireFinish();
}

function setupRps(){ $('#gameKicker').textContent='⚡ ДУЭЛЬ';$('#gameTitle').textContent='Камень · ножницы · бумага';renderRpsRound(); }
function renderRpsRound(){ if(state.game.scores.host>=5 || state.game.scores.guest>=5)return finishRps(); state.game.picks={}; $('#roundBadge').textContent=`${state.game.scores.host} : ${state.game.scores.guest}`;
  $('#gameArea').innerHTML=`<div class="panel game-panel"><div class="prompt">Выбирай тайно</div><p class="subprompt">Первый до 5 побед. Выбор партнёра откроется только когда выберут оба.</p><div class="choice-grid triple"><button class="choice-btn" data-choice="rock"><span class="big-emoji">✊</span>Камень</button><button class="choice-btn" data-choice="scissors"><span class="big-emoji">✌️</span>Ножницы</button><button class="choice-btn" data-choice="paper"><span class="big-emoji">✋</span>Бумага</button></div><div id="waiting" class="waiting">Сделай ход.</div><div id="revealBox"></div><div class="score-row"><span class="score-chip">${esc(state.names.host)}: ${state.game.scores.host}</span><span class="score-chip">${esc(state.names.guest)}: ${state.game.scores.guest}</span></div></div>`;
  $$('.choice-btn').forEach(b=>b.onclick=()=>makePick(b.dataset.choice));
}
function rpsWinner(a,b){if(a===b)return'draw';if((a==='rock'&&b==='scissors')||(a==='scissors'&&b==='paper')||(a==='paper'&&b==='rock'))return'host';return'guest';}
function resolveRps(){const a=state.game.picks.host,b=state.game.picks.guest;if(!a||!b)return;const w=rpsWinner(a,b);if(w!=='draw'){state.game.scores[w]++;sprinkle(3)}$('#waiting').textContent='';
  const title=w==='draw'?'Ничья!':`Раунд за ${esc(state.names[w])}`;
  $('#revealBox').innerHTML=`<div class="reveal"><div class="reveal-title">${title}</div><div class="answer-row"><span class="answer-pill">${esc(state.names.host)}: ${labelForChoice('rps',a)}</span><span class="answer-pill">${esc(state.names.guest)}: ${labelForChoice('rps',b)}</span></div><div class="next-wrap">${state.role==='host'?'<button id="rpsNext" class="btn primary">Ещё раунд</button>':'<span class="hint">Ждём следующий раунд…</span>'}</div></div>`;
  $('.score-row').innerHTML=`<span class="score-chip">${esc(state.names.host)}: ${state.game.scores.host}</span><span class="score-chip">${esc(state.names.guest)}: ${state.game.scores.guest}</span>`;
  if(state.role==='host')$('#rpsNext').onclick=()=>nextRound(true);
}
function finishRps(){const {host,guest}=state.game.scores,w=host>guest?'host':'guest';$('#roundBadge').textContent='Финиш';$('#gameArea').innerHTML=finishHtml('🏆',`${state.names[w]} побеждает!`,`${host} : ${guest}`);celebrate();wireFinish();}

function setupReaction(){ $('#gameKicker').textContent='⚡ ДУЭЛЬ';$('#gameTitle').textContent='Реакция';state.game.scores={host:0,guest:0};renderReactionReady(); }
function renderReactionReady(){const r=state.game.round;if(r>=5)return finishReaction();state.game.results={};$('#roundBadge').textContent=`${r+1} / 5`;
  $('#gameArea').innerHTML=`<div class="panel game-panel"><div class="prompt">Раунд ${r+1}</div><p class="subprompt">Не нажимайте ничего, пока поле не станет зелёным.</p><div class="reaction-stage"><div class="reaction-wait"><strong>Готовы?</strong>${state.role==='host'?'Запусти раунд, когда оба готовы.':'Создатель игры сейчас запустит раунд.'}</div></div><div class="next-wrap">${state.role==='host'?'<button id="armBtn" class="btn primary">Запустить</button>':''}</div><div class="score-row"><span class="score-chip">${esc(state.names.host)}: ${state.game.scores.host}</span><span class="score-chip">${esc(state.names.guest)}: ${state.game.scores.guest}</span></div></div>`;
  if(state.role==='host')$('#armBtn').onclick=()=>armReaction(r,1700+Math.round(Math.random()*2800),true);
}
function armReaction(round,delay,broadcast){if(broadcast)send({type:'reactionArm',round,delay});clearGameTimers();state.game.results={};const stage=$('.reaction-stage');stage.className='reaction-stage';stage.innerHTML='<div class="reaction-wait"><strong>Не нажимай…</strong>Жди зелёный сигнал.</div>';$('.next-wrap').innerHTML='';let live=false,start=0;
  stage.onclick=()=>{if(!live){clearGameTimers();const time=9999;state.game.results[state.role]=time;send({type:'reactionResult',role:state.role,time});stage.classList.add('early');stage.innerHTML='<div class="reaction-wait"><strong>Слишком рано 😅</strong>Фальстарт.</div>';stage.onclick=null;if(state.role==='host')maybeRevealReaction();}};
  const t=setTimeout(()=>{live=true;start=performance.now();stage.onclick=null;stage.classList.add('go');stage.innerHTML='<button class="reaction-button">ЖМИ!</button>';$('.reaction-button').onclick=()=>{const time=Math.round(performance.now()-start);state.game.results[state.role]=time;send({type:'reactionResult',role:state.role,time});stage.className='reaction-stage';stage.innerHTML=`<div class="reaction-wait"><strong>${time} мс</strong>Ждём партнёра…</div>`;if(state.role==='host')maybeRevealReaction();};},delay);state.timers.push(t);
}
function maybeRevealReaction(){if(state.role!=='host')return;const a=state.game.results.host,b=state.game.results.guest;if(a==null||b==null)return;let winner='draw';if(a<b)winner='host';if(b<a)winner='guest';if(winner!=='draw')state.game.scores[winner]++;const msg={type:'reactionReveal',host:a,guest:b,winner,scores:state.game.scores};send(msg);showReactionReveal(msg);}
function showReactionReveal(msg){state.game.scores=msg.scores;const nice=v=>v>=9000?'фальстарт':`${v} мс`;const stage=$('.reaction-stage');if(!stage)return;stage.className='reaction-stage';stage.innerHTML=`<div class="reaction-wait"><strong>${msg.winner==='draw'?'Ничья!':`Раунд за ${esc(state.names[msg.winner])} ⚡`}</strong>${esc(state.names.host)} — ${nice(msg.host)} · ${esc(state.names.guest)} — ${nice(msg.guest)}</div>`;$('.score-row').innerHTML=`<span class="score-chip">${esc(state.names.host)}: ${msg.scores.host}</span><span class="score-chip">${esc(state.names.guest)}: ${msg.scores.guest}</span>`;$('.next-wrap').innerHTML=state.role==='host'?'<button id="reactionNext" class="btn primary">Следующий раунд</button>':'<span class="hint">Ждём следующий раунд…</span>';if(state.role==='host')$('#reactionNext').onclick=()=>nextRound(true);}
function finishReaction(){const{host,guest}=state.game.scores;const w=host===guest?null:(host>guest?'host':'guest');$('#roundBadge').textContent='Финиш';$('#gameArea').innerHTML=finishHtml('⚡',w?`${state.names[w]} быстрее!`:'Идеальная ничья!',`${state.names.host}: ${host} · ${state.names.guest}: ${guest}`);celebrate();wireFinish();}

function setupRating(){ $('#gameKicker').textContent='⭐ ПЛАНЫ';$('#gameTitle').textContent='Рейтинг свиданий';renderRatingRound(); }
function renderRatingRound(){const i=state.game.round;if(i>=dateIdeas.length)return finishRating();state.game.ratings={};$('#roundBadge').textContent=`${i+1} / ${dateIdeas.length}`;
  $('#gameArea').innerHTML=`<div class="panel game-panel"><div class="prompt">${esc(dateIdeas[i])}</div><p class="subprompt">Насколько тебе хочется устроить такое свидание?</p><div class="ratings">${[1,2,3,4,5].map(n=>`<button class="rating-btn" data-rating="${n}"><strong>${n}</strong>${n===1?'не моё':n===5?'хочу!':''}</button>`).join('')}</div><div id="waiting" class="waiting">Поставь оценку от 1 до 5.</div><div id="revealBox"></div>${progress(i,dateIdeas.length)}</div>`;
  $$('.rating-btn').forEach(b=>b.onclick=()=>submitRating(Number(b.dataset.rating)));
}
function submitRating(r){if(state.game.ratings[state.role]!=null)return;state.game.ratings[state.role]=r;$$('.rating-btn').forEach(b=>{b.disabled=true;b.classList.toggle('selected',Number(b.dataset.rating)===r)});$('#waiting').textContent='Оценка принята. Ждём партнёра…';send({type:'ratingSubmit',role:state.role,rating:r});resolveRating();}
function resolveRating(){const a=state.game.ratings.host,b=state.game.ratings.guest;if(a==null||b==null)return;const avg=(a+b)/2,diff=Math.abs(a-b);if(avg>=4)state.game.bestDates.push({idea:dateIdeas[state.game.round],avg});if(diff<=1)sprinkle(3);$('#waiting').textContent='';
  $('#revealBox').innerHTML=`<div class="reveal ${diff===0?'match':''}"><div class="reveal-title">${diff===0?'Одинаковая оценка ✦':avg>=4?'Похоже, стоит попробовать':'Мнения разделились'}</div><div class="rating-reveal"><div class="rating-card">${esc(state.names.host)}<strong>${a}★</strong></div><div class="rating-card">${esc(state.names.guest)}<strong>${b}★</strong></div></div><div class="next-wrap">${state.role==='host'?'<button id="ratingNext" class="btn primary">Следующая идея</button>':'<span class="hint">Ждём следующую идею…</span>'}</div></div>`;if(state.role==='host')$('#ratingNext').onclick=()=>nextRound(true);
}
function finishRating(){const top=state.game.bestDates.sort((x,y)=>y.avg-x.avg)[0];$('#roundBadge').textContent='Финиш';$('#gameArea').innerHTML=finishHtml('🌙','Ваш план на свидание найден',top?`Попробуйте: «${top.idea}». Эта идея получила один из лучших общих рейтингов.`:'У вас разные вкусы — значит, можно по очереди выбирать свидания.');celebrate(32);wireFinish();}

function setupTextGame(kicker,title){$('#gameKicker').textContent=kicker;$('#gameTitle').textContent=title;renderTextRound();}
function renderTextRound(){const i=state.game.round;if(i>=secretPrompts.length)return finishTextGame();state.game.answers={};$('#roundBadge').textContent=`${i+1} / ${secretPrompts.length}`;
  $('#gameArea').innerHTML=`<div class="panel game-panel"><div class="prompt">${esc(secretPrompts[i])}</div><p class="subprompt">Ответ партнёра откроется только после того, как ответят оба.</p><form id="textForm" class="secret-form"><textarea id="textInput" class="textarea secret-input" maxlength="260" placeholder="Твой секретный ответ…"></textarea><button class="btn primary" type="submit">Зафиксировать ответ</button></form><div id="waiting" class="waiting"></div><div id="revealBox"></div>${progress(i,secretPrompts.length)}</div>`;
  $('#textForm').onsubmit=e=>{e.preventDefault();submitText($('#textInput').value.trim());};
}
function submitText(text){if(!text)return toast('Сначала напиши ответ');if(state.game.answers[state.role])return;state.game.answers[state.role]=text;$('#textInput').disabled=true;$('#textForm button').disabled=true;$('#waiting').textContent='Ответ спрятан 🔐 Ждём партнёра…';send({type:'textSubmit',game:state.currentGame,role:state.role,text});resolveTextRound();}
function resolveTextRound(){const a=state.game?.answers.host,b=state.game?.answers.guest;if(!a||!b)return;$('#waiting').textContent='';$('#revealBox').innerHTML=`<div class="secret-cards"><div class="secret-card"><span>${esc(state.names.host)}</span><strong>${esc(a)}</strong></div><div class="secret-card"><span>${esc(state.names.guest)}</span><strong>${esc(b)}</strong></div></div><div class="next-wrap">${state.role==='host'?'<button id="textNext" class="btn primary">Следующая тема</button>':'<span class="hint">Ждём следующую тему…</span>'}</div>`;sprinkle(2);if(state.role==='host')$('#textNext').onclick=()=>nextRound(true);}
function finishTextGame(){ $('#roundBadge').textContent='Финиш';$('#gameArea').innerHTML=finishHtml('💌','Десять маленьких открытий','Теперь у вас точно есть несколько новых тем, идей и поводов улыбнуться.');celebrate(30);wireFinish(); }

function setupBlitz(){ $('#gameKicker').textContent='⏱️ БЛИЦ';$('#gameTitle').textContent='Ответ за 5 секунд';renderBlitzReady(); }
function renderBlitzReady(){const i=state.game.round;if(i>=blitzPrompts.length)return finishBlitz();state.game.answers={};$('#roundBadge').textContent=`${i+1} / ${blitzPrompts.length}`;
  $('#gameArea').innerHTML=`<div class="panel game-panel"><div class="prompt">Раунд ${i+1}</div><p class="subprompt">После старта у обоих будет только 5 секунд.</p><div class="truth-card"><div class="truth-icon">⏱️</div><div class="truth-label">БЛИЦ</div><strong>${esc(blitzPrompts[i])}</strong></div><div class="next-wrap">${state.role==='host'?'<button id="blitzStart" class="btn primary">Запустить 5 секунд</button>':'<span class="hint">Создатель запустит таймер…</span>'}</div></div>`;
  if(state.role==='host')$('#blitzStart').onclick=()=>armBlitz(i,true);
}
function armBlitz(round,broadcast){if(broadcast)send({type:'blitzArm',round});clearGameTimers();state.game.answers={};let left=5;
  $('#gameArea').innerHTML=`<div class="panel game-panel"><div class="timer-ring" style="--pct:100%"><strong id="timerNum">5</strong></div><div class="prompt">${esc(blitzPrompts[state.game.round])}</div><form id="blitzForm" class="secret-form"><input id="blitzInput" class="input big-input" maxlength="100" autocomplete="off" placeholder="Пиши первое, что пришло в голову…"><button class="btn primary">Ответить</button></form><div id="waiting" class="waiting"></div><div id="revealBox"></div></div>`;
  setTimeout(()=>$('#blitzInput')?.focus(),50);
  $('#blitzForm').onsubmit=e=>{e.preventDefault();const t=$('#blitzInput').value.trim()||'…';submitBlitz(t);};
  state.blitzInterval=setInterval(()=>{left--;const n=$('#timerNum'),ring=$('.timer-ring');if(n)n.textContent=left;if(ring)ring.style.setProperty('--pct',(left/5*100)+'%');if(left<=0){clearInterval(state.blitzInterval);state.blitzInterval=null;if(!state.game.answers[state.role])submitBlitz('Не успел(а) 😅');}},1000);
}
function submitBlitz(text){if(state.game.answers[state.role])return;state.game.answers[state.role]=text;if($('#blitzInput'))$('#blitzInput').disabled=true;if($('#blitzForm button'))$('#blitzForm button').disabled=true;$('#waiting').textContent='Готово! Ждём второй ответ…';send({type:'textSubmit',game:'blitz',role:state.role,text});resolveTextRound();}
function finishBlitz(){ $('#roundBadge').textContent='Финиш';$('#gameArea').innerHTML=finishHtml('🔥','Блиц пройден','В первом ответе часто прячется самое смешное. Теперь можно поспорить, чей был лучше.');celebrate(34);wireFinish(); }

function setupTruthDare(){ $('#gameKicker').textContent='🎭 ВЕЧЕРИНКА';$('#gameTitle').textContent='Правда или вызов';$('#roundBadge').textContent='∞';renderTruthChooser(); }
function renderTruthChooser(){
  $('#gameArea').innerHTML=`<div class="panel game-panel"><div class="prompt">Что выбираете?</div><p class="subprompt">Карточку выбирает создатель комнаты, и она мгновенно появляется у обоих.</p>${state.role==='host'?`<div class="truth-controls"><button class="truth-mode" data-mode="truth"><span>💬</span>Правда</button><button class="truth-mode" data-mode="dare"><span>🎯</span>Вызов</button><button class="truth-mode" data-mode="random"><span>🎲</span>Случайно</button></div>`:'<div class="truth-card"><div class="truth-icon">🎭</div><div class="truth-label">ЖДЁМ</div><strong>Создатель выбирает следующую карточку…</strong></div>'}</div>`;
  if(state.role==='host')$$('.truth-mode').forEach(b=>b.onclick=()=>drawTruthCard(b.dataset.mode,true));
}
function drawTruthCard(mode,broadcast){if(mode==='random')mode=Math.random()<.5?'truth':'dare';const list=mode==='truth'?truths:dares;const index=Math.floor(Math.random()*list.length),text=list[index];if(broadcast)send({type:'truthCard',mode,text,index});showTruthCard(mode,text,index,true);}
function showTruthCard(mode,text,index,local){
  $('#gameArea').innerHTML=`<div class="panel game-panel"><div class="truth-card"><div class="truth-icon">${mode==='truth'?'💬':'🎯'}</div><div class="truth-label">${mode==='truth'?'ПРАВДА':'ВЫЗОВ'}</div><strong>${esc(text)}</strong></div><div class="next-wrap">${state.role==='host'?'<button id="truthNext" class="btn primary">Следующая карточка</button>':'<span class="hint">Когда будете готовы, создатель откроет следующую.</span>'}</div></div>`;sprinkle(2);if(state.role==='host')$('#truthNext').onclick=renderTruthChooser;
}

function finishHtml(emoji,title,text){return `<div class="panel game-panel finish"><div class="finish-emoji">${emoji}</div><h3>${esc(title)}</h3><p>${esc(text)}</p><div class="signal-actions" style="justify-content:center"><button id="playAgainBtn" class="btn primary">Сыграть ещё раз</button><button id="toLobbyBtn" class="btn ghost">Другие игры</button></div></div>`;}
function wireFinish(){ $('#playAgainBtn').onclick=()=>startGame(state.currentGame,true); $('#toLobbyBtn').onclick=leaveGame; }
function leaveGame(){clearGameTimers();send({type:'leaveGame'});state.currentGame=null;showScreen('lobby');}
function clearGameTimers(){state.timers.forEach(clearTimeout);state.timers=[];if(state.blitzInterval){clearInterval(state.blitzInterval);state.blitzInterval=null;}}
function disconnect(){clearGameTimers();try{state.channel?.close()}catch{}try{state.peer?.close()}catch{}state.peer=null;state.channel=null;state.connected=false;state.demo=false;state.role=null;setStatus(false,'Не подключено');$('#chatMessages').innerHTML='';showScreen('home');}

$('#hostBtn').onclick=hostFlow;$('#joinBtn').onclick=joinFlow;$('#demoBtn').onclick=startDemo;$('#brandBtn').onclick=()=>state.connected?showScreen('lobby'):showScreen('home');$$('[data-back="home"]').forEach(b=>b.onclick=disconnect);$('#disconnectBtn').onclick=disconnect;$('#gameBackBtn').onclick=leaveGame;$$('.game-card').forEach(card=>card.onclick=()=>startGame(card.dataset.game,true));
$('#chatForm').onsubmit=e=>{e.preventDefault();const text=$('#chatInput').value.trim();if(!text)return;addChat(text,true,state.name);send({type:'chat',text,name:state.name});$('#chatInput').value='';};
window.addEventListener('beforeunload',()=>{try{state.channel?.close();state.peer?.close()}catch{}});
