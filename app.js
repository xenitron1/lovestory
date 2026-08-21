const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const screens = {
  home: $('#screen-home'),
  signal: $('#screen-signal'),
  lobby: $('#screen-lobby'),
  game: $('#screen-game')
};

const syncQuestions = [
  ['Идеальный вечер?', 'Фильм + еда дома', 'Куда-нибудь выбраться'],
  ['Отпуск мечты?', 'Море и ничего не делать', 'Город и приключения'],
  ['Что важнее в подарке?', 'Сюрприз', 'Точно угадать желание'],
  ['В споре лучше…', 'Сразу всё обсудить', 'Сначала остыть'],
  ['Воскресное утро?', 'Спать до победного', 'Встать и куда-то поехать'],
  ['Фильм на двоих?', 'Комедия', 'Триллер'],
  ['Ночной перекус?', 'Сладкое', 'Солёное'],
  ['Свидание?', 'Красиво и заранее', 'Спонтанно и странно'],
  ['Питомец?', 'Кот', 'Собака'],
  ['Если выиграть миллион?', 'Потратить на впечатления', 'Сохранить и вложить'],
  ['В поездке?', 'План на каждый день', 'Разберёмся на месте'],
  ['Фото вместе?', 'Много-много', 'Несколько, но лучших'],
  ['Музыка в машине?', 'Подпевать', 'Слушать и кайфовать'],
  ['Сериал?', 'Растянуть на неделю', 'Посмотреть за ночь'],
  ['Сюрприз-поездка?', 'Да, вообще без деталей', 'Скажи хотя бы куда'],
  ['Романтика?', 'Свечи и красивый ужин', 'Дурачиться до слёз'],
  ['Если свободный час?', 'Полежать рядом', 'Пойти прогуляться'],
  ['Общая покупка?', 'Красивое', 'Практичное'],
  ['На спор?', 'Уступить ради мира', 'Доказать до конца'],
  ['Главное в паре?', 'Похожесть', 'Дополнять друг друга']
];

const whoQuestions = [
  'Кто дольше выбирает, что посмотреть?',
  'Кто первым предлагает заказать еду?',
  'Кто чаще говорит «я уже выхожу», ещё не выйдя?',
  'Кто скорее заснёт во время фильма?',
  'Кто первым мирится после ссоры?',
  'Кто чаще делает смешные фото второго?',
  'Кто больше любит спонтанные поездки?',
  'Кто дольше собирается?',
  'Кто чаще говорит «давай ещё одну серию»?',
  'Кто лучше помнит мелкие детали?',
  'Кто скорее потратит деньги на ерунду, но очень приятную?',
  'Кто чаще крадёт одеяло?',
  'Кто первым начнёт танцевать на кухне?',
  'Кто чаще оказывается прав в споре?',
  'Кто сильнее скучает, когда вы не рядом?',
  'Кто устроит сюрприз без повода?',
  'Кто скорее рассмеётся в неподходящий момент?',
  'Кто предложит самое безумное свидание?'
];

const secretPrompts = [
  'Какое наше свидание ты бы повторил(а) прямо сейчас?',
  'Куда бы ты сорвался/сорвалась со мной завтра без подготовки?',
  'Какая моя привычка кажется тебе самой милой?',
  'Какой фильм или сериал больше всего похож на наш вайб?',
  'Что нам обязательно надо сделать вдвоём в этом году?',
  'Какой идеальный ленивый день для нас?',
  'За что ты чаще всего хочешь меня обнять?',
  'Какую общую фотографию ты помнишь лучше всего?',
  'Что мы могли бы делать вместе каждую неделю и не устать?',
  'Какой подарок от меня был бы идеальным без ограничения бюджета?',
  'В каком городе нам стоило бы пожить месяц?',
  'Одно слово, которым ты бы описал(а) нас сейчас?'
];

const state = {
  role: null,
  name: '',
  names: { host: 'Игрок 1', guest: 'Игрок 2' },
  peer: null,
  channel: null,
  connected: false,
  demo: false,
  currentGame: null,
  game: null,
  timers: []
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2200);
}

function setStatus(connected, text) {
  state.connected = connected;
  $('#statusPill').classList.toggle('connected', connected);
  $('#statusText').textContent = text || (connected ? 'Соединено' : 'Не подключено');
}

function cleanName(v) {
  return (v || '').trim().slice(0, 18) || 'Игрок';
}

function encodeSignal(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

function decodeSignal(text) {
  const binary = atob(text.trim());
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function waitIceComplete(pc) {
  if (pc.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise(resolve => {
    const listener = () => {
      if (pc.iceGatheringState === 'complete') {
        pc.removeEventListener('icegatheringstatechange', listener);
        resolve();
      }
    };
    pc.addEventListener('icegatheringstatechange', listener);
    setTimeout(resolve, 5000);
  });
}

function makePeer() {
  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  });
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'connected' && state.channel?.readyState === 'open') onConnected();
    if (['failed', 'disconnected', 'closed'].includes(pc.connectionState) && state.connected) {
      setStatus(false, 'Связь потеряна');
      toast('Соединение прервано');
    }
  };
  state.peer = pc;
  return pc;
}

function wireChannel(channel) {
  state.channel = channel;
  channel.onopen = onConnected;
  channel.onmessage = e => {
    try { receive(JSON.parse(e.data)); } catch (err) { console.error(err); }
  };
  channel.onclose = () => setStatus(false, 'Отключено');
}

function send(data) {
  if (state.demo) return demoRemote(data);
  if (state.channel?.readyState === 'open') state.channel.send(JSON.stringify(data));
}

function onConnected() {
  if (state.connected) return;
  setStatus(true, 'На связи');
  send({ type: 'profile', role: state.role, name: state.name });
  setTimeout(() => enterLobby(), 220);
}

function enterLobby() {
  $('#meName').textContent = state.name;
  $('#partnerName').textContent = state.names[state.role === 'host' ? 'guest' : 'host'];
  showScreen('lobby');
}

function receive(msg) {
  if (!msg || typeof msg !== 'object') return;
  switch (msg.type) {
    case 'profile':
      state.names[msg.role] = cleanName(msg.name);
      if (state.connected) enterLobby();
      break;
    case 'chat':
      addChat(msg.text, false, msg.name);
      break;
    case 'startGame':
      startGame(msg.game, false);
      break;
    case 'leaveGame':
      clearGameTimers();
      state.currentGame = null;
      showScreen('lobby');
      break;
    case 'roundPick':
      if (!state.game || state.currentGame !== msg.game) return;
      state.game.picks[msg.role] = msg.choice;
      resolvePickRound();
      break;
    case 'nextRound':
      if (state.currentGame === msg.game) nextRound(false);
      break;
    case 'reactionArm':
      if (state.currentGame === 'reaction') armReaction(msg.round, msg.delay, false);
      break;
    case 'reactionResult':
      if (state.currentGame === 'reaction' && state.role === 'host') {
        state.game.results[msg.role] = msg.time;
        maybeRevealReaction();
      }
      break;
    case 'reactionReveal':
      if (state.currentGame === 'reaction') showReactionReveal(msg);
      break;
    case 'secretSubmit':
      if (state.currentGame === 'secret') {
        state.game.answers[msg.role] = msg.text;
        resolveSecretRound();
      }
      break;
    default: break;
  }
}

function demoRemote(msg) {
  // A tiny fake partner so every game can be previewed on one device.
  if (msg.type === 'startGame') return;
  if (msg.type === 'chat') return setTimeout(() => addChat('Я тут 😄', false, state.names.guest), 500);
  if (msg.type === 'roundPick') {
    const choices = state.currentGame === 'who' ? ['host', 'guest'] : ['a', 'b'];
    setTimeout(() => receive({ type: 'roundPick', game: state.currentGame, role: 'guest', choice: choices[Math.floor(Math.random()*choices.length)] }), 450);
  }
  if (msg.type === 'reactionResult') {
    setTimeout(() => receive({ type: 'reactionResult', role: 'guest', time: Math.round(245 + Math.random()*220) }), 350);
  }
  if (msg.type === 'secretSubmit') {
    const samples = ['Ты + вкусная еда + никаких планов 😌', 'Куда-нибудь к морю', 'Твой смех', 'Сделать что-то совершенно спонтанное'];
    setTimeout(() => receive({ type: 'secretSubmit', role: 'guest', text: samples[Math.floor(Math.random()*samples.length)] }), 550);
  }
}

async function hostFlow() {
  state.name = cleanName($('#playerName').value);
  state.role = 'host';
  state.names.host = state.name;
  state.demo = false;
  showSignal('СОЗДАТЕЛЬ', 'Создаём код для подключения…', '<div class="notice">Подготавливаю прямое соединение…</div>');
  try {
    const pc = makePeer();
    const channel = pc.createDataChannel('couple-arcade', { ordered: true });
    wireChannel(channel);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await waitIceComplete(pc);
    const code = encodeSignal(pc.localDescription);
    renderHostSignal(code);
  } catch (e) {
    console.error(e);
    showSignal('ОШИБКА', 'Не удалось создать подключение', `<div class="notice">Попробуйте обновить страницу. Для удалённой игры нужен современный браузер и HTTPS.</div>`);
  }
}

function renderHostSignal(code) {
  showSignal('СОЗДАТЕЛЬ', 'Отправь этот код девушке', `
    <div class="signal-block">
      <div class="signal-label"><span>Код подключения</span><span>Шаг 1 из 2</span></div>
      <textarea id="offerOut" class="textarea code-box" readonly></textarea>
      <div class="signal-actions"><button id="copyOffer" class="btn primary" type="button">Скопировать код</button></div>
    </div>
    <div class="signal-block">
      <div class="signal-label"><span>Вставь её ответный код</span><span>Шаг 2 из 2</span></div>
      <textarea id="answerIn" class="textarea code-box" placeholder="Она пришлёт тебе код — вставь его сюда"></textarea>
      <div class="signal-actions"><button id="finishHost" class="btn secondary" type="button">Подключиться</button></div>
    </div>`);
  $('#offerOut').value = code;
  $('#copyOffer').onclick = () => copyText(code);
  $('#finishHost').onclick = async () => {
    try {
      const answer = decodeSignal($('#answerIn').value);
      await state.peer.setRemoteDescription(answer);
      toast('Ответ принят. Соединяемся…');
    } catch (e) { toast('Похоже, ответный код вставлен не полностью'); }
  };
}

function joinFlow() {
  state.name = cleanName($('#playerName').value);
  state.role = 'guest';
  state.names.guest = state.name;
  state.demo = false;
  showSignal('ПОДКЛЮЧЕНИЕ', 'Вставь код, который тебе прислали', `
    <div class="signal-block">
      <div class="signal-label"><span>Код создателя</span><span>Шаг 1 из 2</span></div>
      <textarea id="offerIn" class="textarea code-box" placeholder="Вставь сюда длинный код"></textarea>
      <div class="signal-actions"><button id="makeAnswer" class="btn primary" type="button">Принять код</button></div>
    </div>
    <div id="answerBlock"></div>`);
  $('#makeAnswer').onclick = createAnswer;
}

async function createAnswer() {
  try {
    const offer = decodeSignal($('#offerIn').value);
    const pc = makePeer();
    pc.ondatachannel = e => wireChannel(e.channel);
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await waitIceComplete(pc);
    const code = encodeSignal(pc.localDescription);
    $('#answerBlock').innerHTML = `
      <div class="signal-block">
        <div class="signal-label"><span>Отправь этот код обратно</span><span>Шаг 2 из 2</span></div>
        <textarea id="answerOut" class="textarea code-box" readonly></textarea>
        <div class="signal-actions"><button id="copyAnswer" class="btn secondary" type="button">Скопировать ответ</button></div>
        <p class="hint">После того как создатель вставит этот код у себя, вы подключитесь автоматически.</p>
      </div>`;
    $('#answerOut').value = code;
    $('#copyAnswer').onclick = () => copyText(code);
  } catch (e) {
    console.error(e);
    toast('Не получилось прочитать код. Проверь, что он вставлен целиком');
  }
}

function showSignal(eyebrow, title, html) {
  $('#signalEyebrow').textContent = eyebrow;
  $('#signalTitle').textContent = title;
  $('#signalContent').innerHTML = html;
  showScreen('signal');
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Скопировано');
  } catch {
    toast('Выдели код и скопируй вручную');
  }
}

function startDemo() {
  state.demo = true;
  state.role = 'host';
  state.name = cleanName($('#playerName').value || 'Ты');
  state.names.host = state.name;
  state.names.guest = 'Виртуальный партнёр';
  setStatus(true, 'Демо');
  enterLobby();
}

function addChat(text, mine, name) {
  const clean = (text || '').trim();
  if (!clean) return;
  const box = document.createElement('div');
  box.className = `chat-msg${mine ? ' mine' : ''}`;
  box.textContent = mine ? clean : `${name || 'Партнёр'}: ${clean}`;
  $('#chatMessages').appendChild(box);
  $('#chatMessages').scrollTop = $('#chatMessages').scrollHeight;
}

function startGame(game, broadcast = true) {
  clearGameTimers();
  state.currentGame = game;
  state.game = { round: 0, picks: {}, score: 0, scores: {host:0, guest:0}, answers: {}, results: {} };
  if (broadcast) send({ type: 'startGame', game });
  showScreen('game');

  if (game === 'sync') setupPickGame('НА ОДНОЙ ВОЛНЕ', 'На одной волне', syncQuestions.length);
  if (game === 'who') setupPickGame('КТО ИЗ НАС?', 'Кто из нас?', whoQuestions.length);
  if (game === 'reaction') setupReaction();
  if (game === 'secret') setupSecret();
}

function setupPickGame(kicker, title, total) {
  $('#gameKicker').textContent = kicker;
  $('#gameTitle').textContent = title;
  $('#roundBadge').textContent = `1 / ${total}`;
  renderPickRound();
}

function renderPickRound() {
  const game = state.currentGame;
  const i = state.game.round;
  const isSync = game === 'sync';
  const total = isSync ? syncQuestions.length : whoQuestions.length;
  if (i >= total) return finishPickGame();
  state.game.picks = {};
  $('#roundBadge').textContent = `${i + 1} / ${total}`;

  const q = isSync ? syncQuestions[i][0] : whoQuestions[i];
  const aLabel = isSync ? syncQuestions[i][1] : state.names.host;
  const bLabel = isSync ? syncQuestions[i][2] : state.names.guest;
  const aValue = isSync ? 'a' : 'host';
  const bValue = isSync ? 'b' : 'guest';

  $('#gameArea').innerHTML = `
    <div class="panel game-panel">
      <div class="prompt">${escapeHtml(q)}</div>
      <div class="choice-grid">
        <button class="choice-btn" data-choice="${aValue}" type="button">${escapeHtml(aLabel)}</button>
        <button class="choice-btn" data-choice="${bValue}" type="button">${escapeHtml(bLabel)}</button>
      </div>
      <div id="waiting" class="waiting">Выбери ответ. Партнёр увидит только результат.</div>
      <div id="revealBox"></div>
    </div>`;

  $$('.choice-btn').forEach(btn => btn.onclick = () => makePick(btn.dataset.choice));
}

function makePick(choice) {
  if (state.game.picks[state.role]) return;
  state.game.picks[state.role] = choice;
  $$('.choice-btn').forEach(b => {
    b.disabled = true;
    b.classList.toggle('selected', b.dataset.choice === choice);
  });
  $('#waiting').textContent = 'Ответ принят. Ждём партнёра…';
  send({ type: 'roundPick', game: state.currentGame, role: state.role, choice });
  resolvePickRound();
}

function resolvePickRound() {
  if (!state.game?.picks.host || !state.game?.picks.guest) return;
  const same = state.game.picks.host === state.game.picks.guest;
  const isSync = state.currentGame === 'sync';
  if (same) state.game.score++;

  const i = state.game.round;
  const labels = isSync
    ? { a: syncQuestions[i][1], b: syncQuestions[i][2] }
    : { host: state.names.host, guest: state.names.guest };
  const hostChoice = labels[state.game.picks.host];
  const guestChoice = labels[state.game.picks.guest];

  $('#waiting').textContent = '';
  $('#revealBox').innerHTML = `
    <div class="reveal ${same ? 'good' : 'bad'}">
      <strong>${same ? (isSync ? 'Совпадение 💞' : 'Единогласны 😏') : 'Разошлись во мнениях 😄'}</strong>
      <div class="score-row">
        <span class="score-chip">${escapeHtml(state.names.host)}: ${escapeHtml(hostChoice)}</span>
        <span class="score-chip">${escapeHtml(state.names.guest)}: ${escapeHtml(guestChoice)}</span>
      </div>
      <div class="next-wrap">${state.role === 'host' ? '<button id="nextRoundBtn" class="btn primary" type="button">Следующий вопрос</button>' : '<span class="hint">Следующий вопрос запускает создатель игры</span>'}</div>
    </div>`;
  if (state.role === 'host') $('#nextRoundBtn').onclick = () => nextRound(true);
}

function nextRound(broadcast = true) {
  state.game.round++;
  if (broadcast) send({ type: 'nextRound', game: state.currentGame });
  if (state.currentGame === 'sync' || state.currentGame === 'who') renderPickRound();
  if (state.currentGame === 'secret') renderSecretRound();
  if (state.currentGame === 'reaction') renderReactionReady();
}

function finishPickGame() {
  const total = state.currentGame === 'sync' ? syncQuestions.length : whoQuestions.length;
  const score = state.game.score;
  let title, text, emoji;
  if (score >= total * .75) { emoji = '💘'; title = 'Вы подозрительно синхронны'; text = `${score} совпадений из ${total}. Это уже почти чит-код.`; }
  else if (score >= total * .45) { emoji = '✨'; title = 'Хороший баланс'; text = `${score} совпадений из ${total}. Где-то одна волна, где-то прекрасный хаос.`; }
  else { emoji = '😈'; title = 'С вами точно не скучно'; text = `${score} совпадений из ${total}. Зато спорить вам есть о чём.`; }
  $('#roundBadge').textContent = 'Финиш';
  $('#gameArea').innerHTML = finishHtml(emoji, title, text);
  wireFinishButtons();
}

function setupReaction() {
  $('#gameKicker').textContent = '⚡ ДУЭЛЬ';
  $('#gameTitle').textContent = 'Дуэль реакции';
  $('#roundBadge').textContent = '1 / 5';
  state.game.scores = { host: 0, guest: 0 };
  renderReactionReady();
}

function renderReactionReady() {
  const r = state.game.round;
  if (r >= 5) return finishReaction();
  state.game.results = {};
  $('#roundBadge').textContent = `${r + 1} / 5`;
  $('#gameArea').innerHTML = `
    <div class="panel game-panel">
      <div class="prompt">Раунд ${r + 1}</div>
      <p class="subprompt">После старта не нажимайте ничего, пока экран не станет зелёным.</p>
      <div class="reaction-stage"><div class="reaction-wait"><strong>Готовы?</strong>${state.role === 'host' ? 'Запусти раунд, когда оба готовы.' : 'Создатель игры сейчас запустит раунд.'}</div></div>
      <div class="next-wrap">${state.role === 'host' ? '<button id="armBtn" class="btn primary" type="button">Запустить раунд</button>' : ''}</div>
      <div class="score-row"><span class="score-chip">${escapeHtml(state.names.host)}: ${state.game.scores.host}</span><span class="score-chip">${escapeHtml(state.names.guest)}: ${state.game.scores.guest}</span></div>
    </div>`;
  if (state.role === 'host') $('#armBtn').onclick = () => {
    const delay = 1800 + Math.round(Math.random() * 2800);
    armReaction(r, delay, true);
  };
}

function armReaction(round, delay, broadcast) {
  if (broadcast) send({ type: 'reactionArm', round, delay });
  clearGameTimers();
  state.game.results = {};
  const stage = $('.reaction-stage');
  stage.classList.remove('go', 'early');
  stage.innerHTML = `<div class="reaction-wait"><strong>Не нажимай…</strong>Жди зелёный сигнал.</div>`;
  $('.next-wrap').innerHTML = '';
  let live = false;
  let start = 0;

  const earlyHandler = () => {
    if (!live) {
      clearGameTimers();
      const time = 9999;
      state.game.results[state.role] = time;
      send({ type: 'reactionResult', role: state.role, time });
      stage.classList.add('early');
      stage.innerHTML = `<div class="reaction-wait"><strong>Слишком рано 😅</strong>Этот раунд почти наверняка у партнёра.</div>`;
      stage.onclick = null;
      if (state.role === 'host') maybeRevealReaction();
    }
  };
  stage.onclick = earlyHandler;

  const t = setTimeout(() => {
    live = true;
    start = performance.now();
    stage.onclick = null;
    stage.classList.add('go');
    stage.innerHTML = `<button class="reaction-button" type="button">ЖМИ!</button>`;
    $('.reaction-button').onclick = () => {
      const time = Math.round(performance.now() - start);
      state.game.results[state.role] = time;
      send({ type: 'reactionResult', role: state.role, time });
      stage.classList.remove('go');
      stage.innerHTML = `<div class="reaction-wait"><strong>${time} мс</strong>Ждём результат партнёра…</div>`;
      if (state.role === 'host') maybeRevealReaction();
    };
  }, delay);
  state.timers.push(t);
}

function maybeRevealReaction() {
  if (state.role !== 'host') return;
  const a = state.game.results.host;
  const b = state.game.results.guest;
  if (a == null || b == null) return;
  let winner = 'draw';
  if (a < b) winner = 'host';
  if (b < a) winner = 'guest';
  if (winner !== 'draw') state.game.scores[winner]++;
  const msg = { type: 'reactionReveal', host: a, guest: b, winner, scores: state.game.scores, round: state.game.round };
  send(msg);
  showReactionReveal(msg);
}

function showReactionReveal(msg) {
  state.game.scores = msg.scores;
  const nice = v => v >= 9000 ? 'фальстарт' : `${v} мс`;
  const winnerText = msg.winner === 'draw' ? 'Ничья!' : `Раунд за ${state.names[msg.winner]} ⚡`;
  const stage = $('.reaction-stage');
  if (!stage) return;
  stage.classList.remove('go', 'early');
  stage.innerHTML = `<div class="reaction-wait"><strong>${escapeHtml(winnerText)}</strong>${escapeHtml(state.names.host)} — ${nice(msg.host)} · ${escapeHtml(state.names.guest)} — ${nice(msg.guest)}</div>`;
  $('.score-row').innerHTML = `<span class="score-chip">${escapeHtml(state.names.host)}: ${msg.scores.host}</span><span class="score-chip">${escapeHtml(state.names.guest)}: ${msg.scores.guest}</span>`;
  $('.next-wrap').innerHTML = state.role === 'host' ? '<button id="reactionNext" class="btn primary" type="button">Следующий раунд</button>' : '<span class="hint">Ждём следующий раунд…</span>';
  if (state.role === 'host') $('#reactionNext').onclick = () => {
    state.game.round++;
    send({ type: 'nextRound', game: 'reaction' });
    renderReactionReady();
  };
}

function finishReaction() {
  const { host, guest } = state.game.scores;
  const winner = host === guest ? null : host > guest ? 'host' : 'guest';
  const title = winner ? `Побеждает ${state.names[winner]}!` : 'Идеальная ничья!';
  const text = `${state.names.host}: ${host} · ${state.names.guest}: ${guest}`;
  $('#roundBadge').textContent = 'Финиш';
  $('#gameArea').innerHTML = finishHtml('🏁', title, text);
  wireFinishButtons();
}

function setupSecret() {
  $('#gameKicker').textContent = '🔐 СЕКРЕТЫ';
  $('#gameTitle').textContent = 'Секретный ответ';
  $('#roundBadge').textContent = `1 / ${secretPrompts.length}`;
  renderSecretRound();
}

function renderSecretRound() {
  const i = state.game.round;
  if (i >= secretPrompts.length) return finishSecret();
  state.game.answers = {};
  $('#roundBadge').textContent = `${i + 1} / ${secretPrompts.length}`;
  $('#gameArea').innerHTML = `
    <div class="panel game-panel">
      <div class="prompt">${escapeHtml(secretPrompts[i])}</div>
      <p class="subprompt">Пишите одновременно. Ответ партнёра откроется только после того, как ответят оба.</p>
      <form id="secretForm" class="secret-form">
        <textarea id="secretInput" class="textarea secret-input" maxlength="260" placeholder="Твой секретный ответ…"></textarea>
        <button class="btn primary" type="submit">Зафиксировать ответ</button>
      </form>
      <div id="secretStatus" class="waiting"></div>
      <div id="secretReveal"></div>
    </div>`;
  $('#secretForm').onsubmit = e => {
    e.preventDefault();
    const text = $('#secretInput').value.trim();
    if (!text) return toast('Сначала напиши ответ');
    state.game.answers[state.role] = text;
    $('#secretInput').disabled = true;
    $('#secretForm button').disabled = true;
    $('#secretStatus').textContent = 'Ответ спрятан 🔐 Ждём партнёра…';
    send({ type: 'secretSubmit', role: state.role, text });
    resolveSecretRound();
  };
}

function resolveSecretRound() {
  const a = state.game?.answers.host;
  const b = state.game?.answers.guest;
  if (!a || !b) return;
  $('#secretStatus').textContent = '';
  $('#secretReveal').innerHTML = `
    <div class="secret-cards">
      <div class="secret-card"><span>${escapeHtml(state.names.host)}</span><strong>${escapeHtml(a)}</strong></div>
      <div class="secret-card"><span>${escapeHtml(state.names.guest)}</span><strong>${escapeHtml(b)}</strong></div>
    </div>
    <div class="next-wrap">${state.role === 'host' ? '<button id="secretNext" class="btn primary" type="button">Следующая тема</button>' : '<span class="hint">Следующую тему запускает создатель</span>'}</div>`;
  if (state.role === 'host') $('#secretNext').onclick = () => nextRound(true);
}

function finishSecret() {
  $('#roundBadge').textContent = 'Финиш';
  $('#gameArea').innerHTML = finishHtml('💌', 'Двенадцать маленьких признаний', 'Кажется, теперь у вас появилось несколько новых идей для свиданий и разговоров.');
  wireFinishButtons();
}

function finishHtml(emoji, title, text) {
  return `<div class="panel game-panel finish"><div class="finish-emoji">${emoji}</div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p><div class="signal-actions" style="justify-content:center"><button id="playAgainBtn" class="btn primary" type="button">Сыграть ещё раз</button><button id="toLobbyBtn" class="btn ghost" type="button">Другие игры</button></div></div>`;
}

function wireFinishButtons() {
  $('#playAgainBtn').onclick = () => startGame(state.currentGame, true);
  $('#toLobbyBtn').onclick = leaveGame;
}

function leaveGame() {
  clearGameTimers();
  send({ type: 'leaveGame' });
  state.currentGame = null;
  showScreen('lobby');
}

function clearGameTimers() {
  state.timers.forEach(clearTimeout);
  state.timers = [];
}

function disconnect() {
  clearGameTimers();
  try { state.channel?.close(); } catch {}
  try { state.peer?.close(); } catch {}
  state.peer = null; state.channel = null; state.connected = false; state.demo = false; state.role = null;
  setStatus(false, 'Не подключено');
  $('#chatMessages').innerHTML = '';
  showScreen('home');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

$('#hostBtn').onclick = hostFlow;
$('#joinBtn').onclick = joinFlow;
$('#demoBtn').onclick = startDemo;
$('#brandBtn').onclick = () => state.connected ? showScreen('lobby') : showScreen('home');
$$('[data-back="home"]').forEach(b => b.onclick = disconnect);
$('#disconnectBtn').onclick = disconnect;
$('#gameBackBtn').onclick = leaveGame;
$$('.game-card').forEach(card => card.onclick = () => startGame(card.dataset.game, true));
$('#chatForm').onsubmit = e => {
  e.preventDefault();
  const text = $('#chatInput').value.trim();
  if (!text) return;
  addChat(text, true, state.name);
  send({ type: 'chat', text, name: state.name });
  $('#chatInput').value = '';
};

window.addEventListener('beforeunload', () => {
  try { state.channel?.close(); state.peer?.close(); } catch {}
});
