
const FEEDBACK_COPY = {
  correct: [
    "答对啦，我就知道你会记得这段回忆 ♡",
    "这题记得很稳呀，小宝宝给你点个赞 ♡",
    "没错没错，这一页回忆你果然没有忘。"
  ],
  wrong: [
    "这题先记成差一点点想起来啦～",
    "宝宝再想一下，其实已经很接近啦 ♡",
    "没关系，这一页回忆我悄悄给你一点提示。"
  ]
};

const CONFIG = {
  startDate: "2025-03-12",
  drawCount: 10,
  requiredCorrect: 9,
  prizeText: "七夕礼物领取券",
  prizeNote: "（请凭截图领取）",
  letter: [
    "七夕快乐呀！",
    "我猜你现在应该正在地铁上看这封信。没想到一转眼，我们已经一起走过五百多个日子了，但我们的感情好像还是和刚在一起的时候一样好 (✿◡‿◡)。",
    "和宝宝在一起以后，大部分的时刻都是开心的。虽然我们偶尔也会争吵，会有不理解对方的时候，但好像也正是在这些争吵和磨合里，我们一点一点变得更了解彼此，也越来越知道应该怎样去爱对方。",
    "如果要让我用一个词来形容我们恋爱的第一年，我想应该是——甜蜜。",
    "我还记得刚在一起的时候，我们经常牵着手绕着上大散步，一走就是好久好久。明明只是很普通地见面、散步、聊天，每一次见到对方却都会特别开心。我们一起散步、一起玩、一起出去旅游，也一起留下了好多好多现在想起来还是会觉得很幸福的回忆。",
    "后来，我们一起进入了研究生生活，也一起从上大来到了北邮。和以前相比，我们的生活里不可避免地多了很多烦恼。聊天的话题也慢慢从“今天吃什么”“周末去哪里玩”，变成了学业、工作、未来，还有很多以前不会认真讨论的现实问题。",
    "所以如果要给今年的我们一个词，我想是——磨合。",
    "我们在磨合彼此的生活习惯，也在磨合彼此看待事情的方式和观念。有时候因为想法不一样，我们还是会吵架，也会有觉得对方“不理解我”的时候。但是很幸运的是，我们最后都会慢慢冷静下来，再去想一想对方为什么会这样说、为什么会这样想。",
    "可能这就是恋爱慢慢往前走的样子吧。",
    "从一开始只觉得和对方在一起很甜、很开心，到后来开始一起面对生活里的压力，一起讨论未来，也一起学着理解和包容彼此。",
    "这一年，我们身上都有学业和就业的压力，也都有各自焦虑和不开心的时候。但我觉得很好的一件事情是，不管发生什么，我们好像一直都在陪着对方，也一直在努力让自己和对方变得越来越好。",
    "在小宝宝眼里，宝宝一直都是一个积极、阳光、开朗、上进、可爱又优秀的人。希望你可以一直相信自己。因为在我眼里，宝宝真的很好很好。",
    "五百多天其实不算特别长，但也已经足够让我们一起经历很多事情了。从上大的校园，到北邮的生活，从最开始牵着手散步都会很开心的我们，到现在会一起聊工作、聊未来的我们，好像有一些东西变了，但又有一些东西一直都没有变。",
    "希望以后我们还可以一起走过很多很多个五百天。",
    "也希望不管以后我们在哪里，遇到什么事情，都还能像现在这样，吵完架也还是喜欢对方，有烦恼的时候还是愿意和对方说，开心的时候第一时间还是想分享给对方。",
    "最后，希望宝宝和小宝宝可以一直一直走下去。",
    "七夕快乐，宝宝。"
  ]
};

let currentLoveDays = 0;
let quiz = [];
let currentIndex = 0;
let score = 0;
let locked = false;
let hasDrawn = false;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeText(str) {
  return (str || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[，。！？、,.!?;；:：'"“”‘’·（）()]/g, "");
}

function containsAny(text, arr = []) {
  const input = normalizeText(text);
  return arr.some(item => input.includes(normalizeText(item)));
}

function containsAll(text, arr = []) {
  const input = normalizeText(text);
  return arr.every(item => input.includes(normalizeText(item)));
}

function calculateLoveDays() {
  const start = new Date(`${CONFIG.startDate}T00:00:00`);
  const now = new Date();
  const localToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const localStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  currentLoveDays = Math.floor((localToday - localStart) / 86400000) + 1;
  $("#loveDays").textContent = Math.max(currentLoveDays, 1);
  const y = localStart.getFullYear();
  const m = String(localStart.getMonth() + 1).padStart(2, "0");
  const d = String(localStart.getDate()).padStart(2, "0");
  $("#startDateText").textContent = `从 ${y}.${m}.${d} 开始，故事一直写到今天。`;
}

function getQuestionBank() {
  return [
    { id: 1, category: "时间线", type: "text", question: "我们正式在一起是哪一天？", validate: (ans) => containsAny(ans, ["2025年3月12日", "2025.3.12", "2025/3/12", "2025-3-12", "3月12日", "植树节"]), explanation: "答案是 2025 年 3 月 12 日，植树节。" },
    { id: 2, category: "时间线", type: "text", question: "今天是我们在一起的第多少天？", validate: (ans) => normalizeText(ans).includes(String(currentLoveDays)), explanation: `这题会自动更新，今天是第 ${currentLoveDays} 天。` },
    { id: 3, category: "时间线", type: "text", question: "小宝宝的生日是几月几号？", validate: (ans) => containsAny(ans, ["农历三月十九", "农历3月19", "三月十九", "3月19", "3.19"]), explanation: "小宝宝生日：农历三月十九。" },
    { id: 4, category: "时间线", type: "text", question: "宝宝的生日是几月几号？", validate: (ans) => containsAny(ans, ["农历十月二十七", "农历10月27", "十月二十七", "10月27", "10.27"]), explanation: "宝宝生日：农历十月二十七。" },
    { id: 5, category: "时间线", type: "text", question: "我们第一次见面是哪一天？", validate: (ans) => containsAny(ans, ["2024年11月6日", "2024.11.6", "2024/11/6", "11月6日"]), explanation: "第一次见面是 2024 年 11 月 6 日。" },
    { id: 6, category: "时间线", type: "text", question: "第一次见面的时候，小宝宝是什么发型、穿了什么？", validate: (ans) => containsAll(ans, ["马尾", "绿色冲锋衣", "黑色裤子"]), explanation: "是马尾、绿色冲锋衣、黑色裤子。" },
    { id: 7, category: "日常相处", type: "text", question: "谁是世界上第一可爱的？", validate: (ans) => containsAny(ans, ["小宝宝"]), explanation: "当然是小宝宝 ♡" },
    { id: 8, category: "日常相处", type: "text", question: "上大的还是小的？", validate: (ans) => containsAny(ans, ["上大的"]), explanation: "标准答案是：上大的。" },
    { id: 9, category: "夸夸小宝宝", type: "text", question: "请说出小宝宝的 5 个优点。", validate: (ans) => ans.trim().length >= 4, explanation: "这题只要认真写，小宝宝都给你过关。" },
    { id: 10, category: "喜好测试", type: "text", question: "小宝宝最喜欢什么？", validate: (ans) => containsAny(ans, ["宝宝"]), explanation: "当然最喜欢宝宝啦。" },
    { id: 11, category: "旅行回忆", type: "text", question: "我们大四那一年去了几个城市旅游？请写出地名。", validate: (ans) => containsAll(ans, ["厦门", "平潭", "景德镇", "开封"]), explanation: "是 4 个：厦门、平潭、景德镇、开封。" },
    { id: 12, category: "照片回忆", type: "image", image: "./assets/memories/q12.png", question: "还记得这束花吗？宝宝是在什么日子送给小宝宝的？", validate: (ans) => containsAny(ans, ["小宝宝的生日", "生日"]), explanation: "这束花对应的是小宝宝生日。" },
    { id: 13, category: "照片回忆", type: "image", image: "./assets/memories/q13.png", question: "这两只小熊叫什么名字？", validate: (ans) => containsAll(ans, ["一二", "布布"]), explanation: "它们叫一二和布布。" },
    { id: 14, category: "照片回忆", type: "image", image: "./assets/memories/q14.png", question: "这束花是宝宝什么时候送给小宝宝的？", validate: (ans) => containsAny(ans, ["表白", "宝宝向小宝宝表白"]), explanation: "这束花对应的是宝宝向小宝宝表白的时候。" },
    { id: 15, category: "照片回忆", type: "image", image: "./assets/memories/q15.png", question: "我们当时是在哪里吃的？", validate: (ans) => containsAny(ans, ["海底捞"]), explanation: "答案是海底捞。" },
    { id: 16, category: "照片回忆", type: "image", image: "./assets/memories/q16.png", question: "这个是我们在哪里做的呢？当时是白天还是晚上？", validate: (ans) => containsAll(ans, ["景德镇", "晚上"]), explanation: "是在景德镇，晚上做的。" },
    { id: 17, category: "照片回忆", type: "image", image: "./assets/memories/q17.png", question: "这束白玫瑰是宝宝在什么日子送给小宝宝的？", validate: (ans) => containsAny(ans, ["去年生日", "小宝宝生日", "生日"]), explanation: "这是宝宝在小宝宝去年生日送的白玫瑰。" },
    { id: 18, category: "照片回忆", type: "image", image: "./assets/memories/q18.png", question: "这束花背后对应的是什么日子？", validate: (ans) => containsAny(ans, ["本科毕业", "毕业"]), explanation: "这束花对应的是本科毕业。" },
    { id: 19, category: "照片回忆", type: "image", image: "./assets/memories/q19.png", question: "这两个是我们做什么体验时做出来的？", validate: (ans) => containsAny(ans, ["烧玻璃", "玻璃"]), explanation: "这两个是烧玻璃体验时做出来的。" },
    { id: 20, category: "照片回忆", type: "image", image: "./assets/memories/q20.png", question: "这张照片是我们在哪里拍的？", validate: (ans) => containsAny(ans, ["什刹海"]), explanation: "这张照片拍于什刹海。" },
    { id: 21, category: "照片回忆", type: "image", image: "./assets/memories/q21.png", question: "这张照片属于我们的哪一次旅行？", validate: (ans) => containsAny(ans, ["平潭"]), explanation: "这是平潭旅行的照片。" },
    { id: 22, category: "照片回忆", type: "image", image: "./assets/memories/q22.png", question: "这张照片是在庆祝我们在一起多少天？", validate: (ans) => normalizeText(ans).includes("200"), explanation: "这天是在庆祝我们在一起 200 天。" },
    { id: 23, category: "照片回忆", type: "image", image: "./assets/memories/q23.png", question: "这张照片是在哪里拍的？", validate: (ans) => containsAny(ans, ["北京环球", "北京环球影城", "环球影城"]), explanation: "这是在北京环球影城拍的。" },
    { id: 24, category: "照片回忆", type: "image", image: "./assets/memories/q24.png", question: "这段时间我们在干什么？这是在哪里？", validate: (ans) => (containsAny(ans, ["毕设", "做毕设"]) && containsAny(ans, ["上海大学", "上大草坪", "上海大学的草坪", "草坪"])), explanation: "答案是：陪小宝宝做毕设，在上海大学的草坪。" },
    { id: 25, category: "照片回忆", type: "image", image: "./assets/memories/q25.png", question: "这张照片拍摄的那一天，我们一起去了哪里、做了什么？", validate: (ans) => containsAny(ans, ["太仓"]), explanation: "答案是：去太仓出去玩。" },
    { id: 26, category: "日常相处", type: "text", question: "我们第一个情侣款的东西是什么？", validate: (ans) => containsAny(ans, ["咖啡手串", "咖啡豆", "咖啡串"]), explanation: "可接受答案：咖啡手串 / 咖啡豆 / 咖啡串。" }
  ];
}

function showScreen(name) {
  $$(".screen").forEach(el => el.classList.remove("active"));
  $(`#screen-${name}`).classList.add("active");
  const shell = $(".phone-shell");
  if (shell) shell.scrollTo({ top: 0, behavior: "smooth" });
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("show"), 2200);
}

function buildHeartProgress() {
  const wrap = $("#heartProgress");
  wrap.innerHTML = "";
  for (let i = 0; i < CONFIG.drawCount; i++) {
    const span = document.createElement("span");
    span.textContent = "♥";
    if (i < currentIndex) span.classList.add("done");
    wrap.appendChild(span);
  }
}

function startQuiz() {
  quiz = shuffle(getQuestionBank()).slice(0, CONFIG.drawCount);
  currentIndex = 0;
  score = 0;
  locked = false;
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  locked = false;
  const q = quiz[currentIndex];
  $("#currentNo").textContent = currentIndex + 1;
  $("#progressBar").style.width = `${((currentIndex + 1) / CONFIG.drawCount) * 100}%`;
  buildHeartProgress();
  $("#questionCategory").textContent = q.category || "回忆篇";
  $("#questionText").textContent = q.question;
  $("#answerInput").value = "";
  $("#answerInput").disabled = false;
  $("#submitAnswerBtn").disabled = false;

  const feedback = $("#feedback");
  feedback.classList.add("hidden");
  feedback.classList.remove("correct", "soft-wrong");
  $("#nextQuestionBtn").classList.add("hidden");

  const imageBox = $("#imageBox");
  imageBox.classList.add("hidden");
  if (q.type === "image" && q.image) {
    $("#questionImage").src = q.image;
    $("#questionImage").dataset.full = q.image;
    imageBox.classList.remove("hidden");
  }
}

function submitAnswer() {
  if (locked) return;
  const q = quiz[currentIndex];
  const val = $("#answerInput").value.trim();
  if (!val) {
    toast("先写一点答案再提交吧 ♡");
    return;
  }
  locked = true;
  const isCorrect = q.validate ? q.validate(val) : false;
  if (isCorrect) score++;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const prefix = isCorrect ? pick(FEEDBACK_COPY.correct) : pick(FEEDBACK_COPY.wrong);
  const feedback = $("#feedback");
  feedback.textContent = isCorrect
    ? `${prefix}${q.explanation ? ` 小提示：${q.explanation}` : ""}`
    : `${prefix}${q.explanation ? ` 我悄悄提醒你：${q.explanation}` : ""}`;
  feedback.classList.remove("hidden");
  feedback.classList.toggle("correct", isCorrect);
  feedback.classList.toggle("soft-wrong", !isCorrect);

  $("#answerInput").disabled = true;
  $("#submitAnswerBtn").disabled = true;
  const next = $("#nextQuestionBtn");
  next.textContent = currentIndex === CONFIG.drawCount - 1 ? "看看挑战结果 ♡" : "下一段回忆 →";
  next.classList.remove("hidden");
}

function nextQuestion() {
  if (currentIndex < CONFIG.drawCount - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  $("#finalScore").textContent = score;
  const pass = score >= CONFIG.requiredCorrect;
  if (pass) {
    $("#resultIcon").textContent = "💗";
    $("#resultTitle").textContent = "回忆验证成功";
    $("#resultCopy").textContent = "你把我们的回忆都好好地放在心里啦。接下来，继续拆开我给宝宝准备的小惊喜吧。";
    $("#resultActionBtn").textContent = "继续拆礼物 💌";
    $("#resultActionBtn").onclick = () => { burstHearts(18); showScreen("lottery"); };
    burstHearts(18);
  } else {
    $("#resultIcon").textContent = "🐻";
    $("#resultTitle").textContent = "只差一点点啦";
    $("#resultCopy").textContent = `这次想起了 ${score} 个答案。没关系，我们再一起慢慢回忆一次。`;
    $("#resultActionBtn").textContent = "再回忆一次 ♡";
    $("#resultActionBtn").onclick = startQuiz;
  }
  showScreen("result");
}

function drawPrize() {
  if (hasDrawn) return;
  hasDrawn = true;
  const btn = $("#drawBtn");
  btn.classList.add("drawing");
  btn.disabled = true;
  setTimeout(() => {
    $("#prizeText").textContent = CONFIG.prizeText;
    $("#prizeNote").textContent = CONFIG.prizeNote;
    $("#prizeCard").classList.remove("hidden");
    $("#toLetterBtn").classList.remove("hidden");
    burstHearts(24);
    btn.classList.remove("drawing");
  }, 950);
}

function renderLetter() {
  const body = $("#letterBody");
  body.innerHTML = "";
  CONFIG.letter.forEach(p => {
    const el = document.createElement("p");
    el.textContent = p;
    body.appendChild(el);
  });
  const now = new Date();
  $("#letterDate").textContent = `${now.getFullYear()} · 七夕`;
}

function openLetter() {
  const env = $("#envelopeBtn");
  if (env.classList.contains("open")) return;
  env.classList.add("open");
  $("#tapTip").textContent = "信已经打开啦 ♡";
  setTimeout(() => {
    renderLetter();
    $("#loveLetter").classList.remove("hidden");
    $("#ending").classList.remove("hidden");
    burstHearts(30);
    setTimeout(() => {
      const shell = $(".phone-shell");
      if (shell) shell.scrollTo({ top: shell.scrollHeight, behavior: "smooth" });
    }, 250);
  }, 850);
}

function burstHearts(count = 18) {
  const wrap = $("#floatingHearts");
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > .45 ? "♥" : "♡";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${12 + Math.random() * 16}px`;
    heart.style.setProperty("--dur", `${2.8 + Math.random() * 2.2}s`);
    heart.style.animationDelay = `${Math.random() * .45}s`;
    wrap.appendChild(heart);
    setTimeout(() => heart.remove(), 5800);
  }
}

function openImageModal(src) {
  if (!src) return;
  $("#modalImage").src = src;
  $("#imageModal").classList.remove("hidden");
}

function closeImageModal() {
  $("#imageModal").classList.add("hidden");
}

function resetExperience() {
  currentIndex = 0;
  score = 0;
  locked = false;
  hasDrawn = false;
  $("#prizeCard").classList.add("hidden");
  $("#toLetterBtn").classList.add("hidden");
  $("#drawBtn").disabled = false;
  $("#drawBtn").classList.remove("drawing");
  $("#envelopeBtn").classList.remove("open");
  $("#loveLetter").classList.add("hidden");
  $("#ending").classList.add("hidden");
  $("#tapTip").textContent = "轻轻点一下信封";
  showScreen("home");
}

document.addEventListener("DOMContentLoaded", () => {
  calculateLoveDays();
  $$("[data-go]").forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.go)));
  $("#startQuizBtn").addEventListener("click", startQuiz);
  $("#submitAnswerBtn").addEventListener("click", submitAnswer);
  $("#nextQuestionBtn").addEventListener("click", nextQuestion);
  $("#drawBtn").addEventListener("click", drawPrize);
  $("#toLetterBtn").addEventListener("click", () => showScreen("letter"));
  $("#envelopeBtn").addEventListener("click", openLetter);
  $("#replayBtn").addEventListener("click", resetExperience);
  $("#questionImage").addEventListener("click", () => openImageModal($("#questionImage").dataset.full));
  $("#closeImageModal").addEventListener("click", closeImageModal);
  $("#imageModalBackdrop").addEventListener("click", closeImageModal);
  $("#answerInput").addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") submitAnswer();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeImageModal();
  });
});
