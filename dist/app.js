const body = document.body;
const stage = document.querySelector('.story-stage');
const track = document.querySelector('.story-track');
const afterCopy = document.querySelector('.next-copy');
const motionButton = document.querySelector('.motion-button');
const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
let motionOff = systemMotion.matches;
let frame = 0;
const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
function paintStory() {
  frame = 0;
  if (!stage || !track) return;
  const span = track.offsetHeight - stage.offsetHeight;
  const progress = motionOff || span <= 0 ? 0 : clamp(-track.getBoundingClientRect().top / span);
  const linear = clamp((progress - .14) / .55);
  const mix = linear * linear * (3 - 2 * linear);
  stage.style.setProperty('--progress', progress.toFixed(4));
  stage.style.setProperty('--mix', mix.toFixed(4));
  afterCopy.style.visibility = mix > .1 && !motionOff ? 'visible' : 'hidden';
  const counter = document.querySelector('.scene-current');
  if (counter) counter.textContent = mix > .5 ? '02' : '01';
}
function queuePaint() { if (!frame) frame = requestAnimationFrame(paintStory); }
function setMotion(off) {
  off = off || systemMotion.matches;
  motionOff = off;
  body.classList.toggle('motion-off', off);
  motionButton?.setAttribute('aria-pressed', String(off));
  if (motionButton) { motionButton.disabled = systemMotion.matches; motionButton.textContent = systemMotion.matches ? '端末の設定で静止表示' : off ? '動きを再開する' : '動きを止める'; }
  paintStory();
}
motionButton?.addEventListener('click', () => setMotion(!motionOff));
systemMotion.addEventListener('change', e => setMotion(e.matches));
addEventListener('scroll', queuePaint, { passive: true });
addEventListener('resize', queuePaint, { passive: true });
addEventListener('load', paintStory);
setMotion(motionOff);

// Faces remain HTML text. Only the currently exposed face is in the accessibility tree.
for (const card of document.querySelectorAll('.person-card')) {
  const front = card.querySelector('.card-front');
  const back = card.querySelector('.card-back');
  const title = front.querySelector('strong').textContent.replace('。', '');
  let timer;
  card.addEventListener('click', () => {
    clearTimeout(timer);
    const flipped = card.getAttribute('aria-expanded') !== 'true';
    front.hidden = false;
    back.hidden = false;
    front.setAttribute('aria-hidden', String(flipped));
    back.setAttribute('aria-hidden', String(!flipped));
    card.classList.toggle('is-flipped', flipped);
    card.setAttribute('aria-expanded', String(flipped));
    if (flipped) card.setAttribute('aria-describedby', back.id); else card.removeAttribute('aria-describedby');
    card.setAttribute('aria-label', `${title}の、${flipped ? '得意なことに戻る' : '手伝ってほしいことを見る'}`);
    timer = setTimeout(() => { front.hidden = flipped; back.hidden = !flipped; }, motionOff ? 0 : 670);
  });
}

const menu = document.querySelector('#menu');
const menuButton = document.querySelector('.menu-button');
let scrollBeforeDialog = 0;
function openDialog(dialog) {
  scrollBeforeDialog = scrollY;
  dialog.showModal();
  body.style.overflow = 'hidden';
}
function closeDialog(dialog) { dialog.close(); }
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.addEventListener('close', () => {
    body.style.overflow = '';
    if (dialog === menu) menuButton?.setAttribute('aria-expanded', 'false');
  });
  dialog.addEventListener('click', e => { if (e.target === dialog) closeDialog(dialog); });
}
if (menu && menuButton) {
  menu.setAttribute('aria-label', 'サイトメニュー');
  menuButton.addEventListener('click', () => { openDialog(menu); menuButton.setAttribute('aria-expanded', 'true'); });
  document.querySelector('.close-menu').addEventListener('click', () => closeDialog(menu));
  for (const link of menu.querySelectorAll('a')) link.addEventListener('click', () => closeDialog(menu));
}

const joinDialog = document.querySelector('#join-dialog');
const joinContent = {
  family: {
    kicker: 'FOR YOU & YOUR FAMILY',
    title: 'どんな一日なら、\n出かけたくなりますか。',
    intro: '過ごしたい時間も、少し気がかりなことも。ご本人とご家族の声を、場所づくりの出発点にしたいと考えています。',
    questions: ['好きなこと、またやってみたいことは？', 'どんな人と、どんな時間を過ごしたいですか？', '安心して通うために、必要なことは？'],
  },
  neighbor: {
    kicker: 'FOR NEIGHBORS & STUDENTS',
    title: 'あなたの「好き」を、\n少し持ち寄って。',
    intro: 'ゲーム、会話、ものづくり。得意なことでも、これから教わりたいことでも。無理のない関わり方を一緒に考えます。',
    questions: ['一緒にやってみたいことは？', 'できる日、できる時間はどのくらい？', '参加するうえで、気になることは？'],
  },
  partner: {
    kicker: 'FOR OUR FUTURE PARTNERS',
    title: 'この場所らしさを、\n一緒につくる。',
    intro: '現場、地域、制度、事業。それぞれの経験を持ち寄り、理念が続く仕組みへ育てたい。率直な意見も聞かせてください。',
    questions: ['あなたの経験を生かせそうなところは？', '現場で実現するには、何を確かめる必要がありますか？', '責任、時間、報酬など、関わるために必要な条件は？'],
  },
};
if (joinDialog) {
  joinDialog.setAttribute('aria-labelledby', 'join-dialog-title');
  joinDialog.querySelector('.dialog-title').id = 'join-dialog-title';
  for (const button of document.querySelectorAll('[data-dialog]')) button.addEventListener('click', () => {
    const content = joinContent[button.dataset.dialog];
    joinDialog.querySelector('.dialog-kicker').textContent = content.kicker;
    joinDialog.querySelector('.dialog-title').textContent = content.title;
    joinDialog.querySelector('.dialog-intro').textContent = content.intro;
    const list = joinDialog.querySelector('.dialog-questions');
    list.replaceChildren(...content.questions.map(text => { const item = document.createElement('li'); item.textContent = text; return item; }));
    openDialog(joinDialog);
  });
  for (const button of joinDialog.querySelectorAll('.close-join,.dialog-done')) button.addEventListener('click', () => closeDialog(joinDialog));
}
