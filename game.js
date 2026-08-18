(() => {
  "use strict";

  const GAME_TIME = 60;
  const NEXT_DELAY = 420;

  const titleScreen = document.getElementById("titleScreen");
  const gameScreen = document.getElementById("gameScreen");
  const resultScreen = document.getElementById("resultScreen");

  const homeBtn = document.getElementById("homeBtn");
  const startBtn = document.getElementById("startBtn");
  const returnBtn = document.getElementById("returnBtn");
  const stampBtn = document.getElementById("stampBtn");
  const resultButtons = document.getElementById("resultButtons");
  const shareButton = document.getElementById("shareButton");
  const registerButton = document.getElementById("registerButton");
  const retryButton = document.getElementById("retryButton");
  const arcadeButton = document.getElementById("arcadeButton");

  const timeValue = document.getElementById("timeValue");
  const processedValue = document.getElementById("processedValue");

  const documentCard = document.getElementById("documentCard");
  const docNo = document.getElementById("docNo");
  const docTitle = document.getElementById("docTitle");
  const fieldItem = document.getElementById("fieldItem");
  const fieldQty = document.getElementById("fieldQty");
  const fieldPrice = document.getElementById("fieldPrice");
  const fieldReason = document.getElementById("fieldReason");
  const fieldPerson = document.getElementById("fieldPerson");

  const stampTarget = document.getElementById("stampTarget");
  const judgeText = document.getElementById("judgeText");
  const impactBurst = document.getElementById("impactBurst");
  const returnBurst = document.getElementById("returnBurst");
  const last15 = document.getElementById("last15");
  const hippo = document.getElementById("hippo");

  const resultProcessed = document.getElementById("resultProcessed");
  const resultRank = document.getElementById("resultRank");
  const resultComment = document.getElementById("resultComment");

  const bgm = document.getElementById("bgm");
  const stampSe = document.getElementById("stampSe");
  const returnSe = document.getElementById("returnSe");
  const missSe = document.getElementById("missSe");

  const GAME_ID = "game66";
  const GAME_TITLE = "決裁ポン！";
  const GAME_URL = "https://afoolhippo.github.io/game66/";
  const ARCADE_URL = "https://afoolhippo.github.io/home/?skipTitle=1";

  const SUPABASE_URL =
    "https://gmncxnybsovlallxgnkd.supabase.co";

  const SUPABASE_ANON_KEY =
    "sb_publishable_ly3h5OhL8HDSHhYdmJq_Fw_9pG3mhla";

  const kabaDb = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  let gameTimer = null;
  let endAt = 0;
  let playing = false;
  let locked = false;

  let docCount = 0;
  let processed = 0;
  let misses = 0;
  let currentDoc = null;
  let deck = [];
  let last15Shown = false;
  let currentRankTitle = "慎重係長";
  let scoreRegistered = false;
  let resultButtonsTimer = null;

  const normalDocs = [
    {
      title: "備品購入伺",
      item: "ノートパソコン",
      qty: "3台",
      price: "240,000円",
      reason: "業務用機器更新のため",
      person: "総務課　鈴木"
    },
    {
      title: "消耗品購入伺",
      item: "コピー用紙",
      qty: "10箱",
      price: "18,000円",
      reason: "在庫補充のため",
      person: "庶務課　田中"
    },
    {
      title: "備品購入伺",
      item: "事務用イス",
      qty: "4脚",
      price: "52,000円",
      reason: "老朽化した備品更新のため",
      person: "施設課　佐藤"
    },
    {
      title: "物品購入伺",
      item: "ボールペン",
      qty: "30本",
      price: "3,600円",
      reason: "事務用品補充のため",
      person: "総務課　伊藤"
    },
    {
      title: "印刷製本伺",
      item: "案内チラシ",
      qty: "500部",
      price: "22,000円",
      reason: "イベント周知のため",
      person: "広報課　中村"
    },
    {
      title: "修繕伺",
      item: "会議室エアコン",
      qty: "1台",
      price: "86,000円",
      reason: "故障修理のため",
      person: "施設課　小林"
    },
    {
      title: "備品購入伺",
      item: "書類整理棚",
      qty: "2台",
      price: "31,000円",
      reason: "保管スペース確保のため",
      person: "庶務課　加藤"
    },
    {
      title: "消耗品購入伺",
      item: "封筒",
      qty: "200枚",
      price: "4,800円",
      reason: "郵送業務に使用するため",
      person: "総務課　吉田"
    },
    {
      title: "物品購入伺",
      item: "電卓",
      qty: "5台",
      price: "7,500円",
      reason: "窓口業務で使用するため",
      person: "市民課　松本"
    }
  ];

  const badDocs = [
    {
      title: "備品購入伺",
      item: "ノートパソコン",
      qty: "3杯",
      price: "240,000円",
      reason: "業務用機器更新のため",
      person: "総務課　鈴木"
    },
    {
      title: "消耗品購入伺",
      item: "コピー用紙",
      qty: "5匹",
      price: "9,000円",
      reason: "在庫補充のため",
      person: "庶務課　田中"
    },
    {
      title: "備品購入伺",
      item: "事務用イス",
      qty: "4脚",
      price: "52,000円",
      reason: "なんとなく",
      person: "施設課　佐藤"
    },
    {
      title: "物品購入伺",
      item: "ホワイトボード",
      qty: "1台",
      price: "15,000円",
      reason: "ノリで",
      person: "企画課　高橋"
    },
    {
      title: "備品購入伺",
      item: "シュレッダー",
      qty: "1台",
      price: "38,000円",
      reason: "欲しかったから",
      person: "総務課　伊藤"
    },
    {
      title: "消耗品購入伺",
      item: "付せん",
      qty: "たくさん",
      price: "6,000円",
      reason: "事務用品補充のため",
      person: "広報課　中村"
    },
    {
      title: "印刷製本伺",
      item: "案内パンフレット",
      qty: "気持ち多め",
      price: "45,000円",
      reason: "来庁者配布のため",
      person: "広報課　小林"
    },
    {
      title: "備品購入伺",
      item: "プリンター",
      qty: "1台",
      price: "だいたい5万円",
      reason: "故障したため",
      person: "施設課　加藤"
    },
    {
      title: "消耗品購入伺",
      item: "クリアファイル",
      qty: "100枚",
      price: "いっぱい",
      reason: "資料整理に使用するため",
      person: "庶務課　吉田"
    },
    {
      title: "備品購入伺",
      item: "デスクライト",
      qty: "3台",
      price: "12,000円",
      reason: "執務環境改善のため",
      person: "どこかの課　鈴木"
    },
    {
      title: "修繕伺",
      item: "事務室ドア",
      qty: "1か所",
      price: "33,000円",
      reason: "開閉不良のため",
      person: "たぶん総務課　田中"
    },
    {
      title: "物品購入伺",
      item: "収納ケース",
      qty: "あるだけ",
      price: "20,000円",
      reason: "書類整理のため",
      person: "庶務課　佐藤"
    },
    {
      title: "備品購入伺",
      item: "会議用モニター",
      qty: "2台",
      price: "おまかせ",
      reason: "会議で使用するため",
      person: "企画課　高橋"
    },
    {
      title: "消耗品購入伺",
      item: "養生テープ",
      qty: "そこそこ",
      price: "4,200円",
      reason: "作業用に使用するため",
      person: "施設課　中村"
    }
  ];

  function showScreen(screen) {
    [titleScreen, gameScreen, resultScreen].forEach(s => s.classList.remove("active"));
    screen.classList.add("active");

    if (screen === gameScreen) {
      homeBtn.classList.remove("hidden");
    } else {
      homeBtn.classList.add("hidden");
    }
  }

  function shuffle(array) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // 10件につき正常7・不備3を基本にする。
  function buildDeck() {
    const normals = shuffle(normalDocs);
    const bads = shuffle(badDocs);

    const block = [];
    for (let i = 0; i < 7; i++) {
      block.push({ ...normals[i % normals.length], shouldApprove: true });
    }
    for (let i = 0; i < 3; i++) {
      block.push({ ...bads[i % bads.length], shouldApprove: false });
    }

    let mixed = shuffle(block);

    // 不備3連続を避ける簡易調整。
    for (let i = 2; i < mixed.length; i++) {
      if (
        !mixed[i].shouldApprove &&
        !mixed[i - 1].shouldApprove &&
        !mixed[i - 2].shouldApprove
      ) {
        const swapIndex = mixed.findIndex((d, idx) => idx > i && d.shouldApprove);
        if (swapIndex !== -1) {
          [mixed[i], mixed[swapIndex]] = [mixed[swapIndex], mixed[i]];
        }
      }
    }

    return mixed;
  }

  function safePlay(audio, volume = 1) {
    if (!audio) return;
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch (_) {}
  }

  function startBgm() {
    try {
      bgm.volume = 0.36;
      bgm.currentTime = 0;
      bgm.play().catch(() => {});
    } catch (_) {}
  }

  function stopBgm() {
    try {
      bgm.pause();
      bgm.currentTime = 0;
    } catch (_) {}
  }

  function pullDocument() {
    if (deck.length === 0) {
      deck = buildDeck();
    }

    currentDoc = deck.shift();
    docCount++;

    docNo.textContent = `No.${String(docCount).padStart(3, "0")}`;
    docTitle.textContent = currentDoc.title;
    fieldItem.textContent = currentDoc.item;
    fieldQty.textContent = currentDoc.qty;
    fieldPrice.textContent = currentDoc.price;
    fieldReason.textContent = currentDoc.reason;
    fieldPerson.textContent = currentDoc.person;

    stampTarget.classList.remove("show");
    impactBurst.classList.remove("show");
    returnBurst.classList.remove("show");
    documentCard.className = "document-card enter";

    hippo.classList.remove("panic");
    hippo.classList.add("thinking");

    locked = false;
  }

  function resetGame() {
    clearInterval(gameTimer);

    playing = true;
    locked = false;
    docCount = 0;
    processed = 0;
    misses = 0;
    last15Shown = false;
    currentRankTitle = "慎重係長";
    scoreRegistered = false;
    clearTimeout(resultButtonsTimer);
    registerButton.disabled = false;
    registerButton.textContent = "記録を登録";
    resultButtons.classList.add("hidden");
    deck = buildDeck();

    timeValue.textContent = GAME_TIME;
    processedValue.textContent = "0";

    judgeText.className = "judge-text";
    judgeText.textContent = "";
    stampTarget.classList.remove("show");
    impactBurst.classList.remove("show");
    returnBurst.classList.remove("show");
    last15.classList.remove("show");

    endAt = performance.now() + GAME_TIME * 1000;

    pullDocument();
    startBgm();

    gameTimer = setInterval(updateTimer, 100);
  }

  function startGame() {
    showScreen(gameScreen);
    resetGame();
  }

  function updateTimer() {
    if (!playing) return;

    const remainMs = Math.max(0, endAt - performance.now());
    const remainSec = Math.ceil(remainMs / 1000);
    timeValue.textContent = remainSec;

    if (!last15Shown && remainMs > 0 && remainMs <= 15000) {
      last15Shown = true;
      last15.classList.remove("show");
      void last15.offsetWidth;
      last15.classList.add("show");
    }

    if (remainMs <= 0) {
      finishGame();
    }
  }

  function getRankTitle(score) {
    if (score >= 18) return "爆速係長";
    if (score >= 14) return "敏腕係長";
    return "慎重係長";
  }

  function showResultButtonsLater() {
    clearTimeout(resultButtonsTimer);
    resultButtons.classList.add("hidden");

    resultButtonsTimer = setTimeout(() => {
      resultButtons.classList.remove("hidden");
    }, 1500);
  }

  function finishGame() {
    if (!playing) return;

    playing = false;
    locked = true;
    clearInterval(gameTimer);
    stopBgm();

    currentRankTitle = getRankTitle(processed);
    resultProcessed.textContent = processed;
    resultRank.textContent = currentRankTitle;

    if (currentRankTitle === "爆速係長") {
      resultComment.textContent = "決裁が速すぎます、係長！";
    } else if (currentRankTitle === "敏腕係長") {
      resultComment.textContent = "今日もよくさばきました。";
    } else {
      resultComment.textContent = "じっくり確認、慎重派です。";
    }

    setTimeout(() => {
      showScreen(resultScreen);
      showResultButtonsLater();
    }, 180);
  }

  function flashJudge(text, kind) {
    judgeText.textContent = text;
    judgeText.className = "judge-text";
    void judgeText.offsetWidth;
    judgeText.className = `judge-text ${kind}`;
  }

  function vibrate(pattern) {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (_) {}
    }
  }

  function handleCorrectApprove() {
    processed++;
    processedValue.textContent = processed;

    flashJudge("決裁！", "approve");

    stampTarget.classList.remove("show");
    impactBurst.classList.remove("show");
    documentCard.classList.remove("stamp-shock");

    void stampTarget.offsetWidth;
    stampTarget.classList.add("show");
    impactBurst.classList.add("show");
    documentCard.classList.add("stamp-shock");

    safePlay(stampSe, 0.9);
    vibrate(26);

    setTimeout(() => {
      if (!playing) return;
      documentCard.classList.remove("stamp-shock");
      documentCard.classList.add("leave-right");

      setTimeout(() => {
        if (playing) pullDocument();
      }, NEXT_DELAY);
    }, 900);
  }

  function handleCorrectReturn() {
    processed++;
    processedValue.textContent = processed;

    flashJudge("差し戻し！", "return");

    returnBurst.classList.remove("show");
    documentCard.classList.remove("return-shock");

    void returnBurst.offsetWidth;
    returnBurst.classList.add("show");
    documentCard.classList.add("return-shock");

    safePlay(returnSe, 0.72);
    vibrate([14, 22, 14]);

    setTimeout(() => {
      if (!playing) return;
      documentCard.classList.remove("return-shock");
      documentCard.classList.add("leave-left");

      setTimeout(() => {
        if (playing) pullDocument();
      }, NEXT_DELAY);
    }, 900);
  }

  function handleMiss(action) {
    misses++;

    flashJudge("ミス！", "miss");

    hippo.classList.remove("thinking");
    hippo.classList.remove("panic");
    void hippo.offsetWidth;
    hippo.classList.add("panic");

    documentCard.classList.remove("return-shock");
    void documentCard.offsetWidth;
    documentCard.classList.add("return-shock");

    safePlay(missSe, 0.55);
    vibrate([40, 30, 40]);

    setTimeout(() => {
      if (!playing) return;
      documentCard.classList.remove("return-shock");
      documentCard.classList.add(action === "approve" ? "leave-right" : "leave-left");

      setTimeout(() => {
        if (playing) pullDocument();
      }, NEXT_DELAY);
    }, 720);
  }

  function judge(action) {
    if (!playing || locked || !currentDoc) return;

    locked = true;

    const choseApprove = action === "approve";
    const isCorrect = choseApprove === currentDoc.shouldApprove;

    if (isCorrect) {
      if (choseApprove) {
        handleCorrectApprove();
      } else {
        handleCorrectReturn();
      }
    } else {
      handleMiss(action);
    }
  }

  function backToTitle() {
    playing = false;
    locked = true;
    clearInterval(gameTimer);
    stopBgm();
    showScreen(titleScreen);
  }

  function shareResult() {
    const text =
      `決裁ポン！で遊びました！🦛\n\n` +
      `正しく処理した書類：${processed}件\n\n` +
      `書類を見極めて、ヒッポ印をポン！\n` +
      `あなたは何件さばける？\n\n` +
      `#カバゲーセン\n` +
      `#決裁ポン`;

    const shareUrl =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(text) +
      "&url=" +
      encodeURIComponent(GAME_URL);

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  async function registerScore() {
    if (scoreRegistered) {
      alert("この記録は登録済みです");
      return;
    }

    const nickname = prompt(
      "ニックネームを入力してね",
      "匿名カバ"
    );

    if (!nickname) return;

    registerButton.disabled = true;
    registerButton.textContent = "登録中...";

    const { error } = await kabaDb
      .from("kaba_scores")
      .insert({
        game_id: GAME_ID,
        game_title: GAME_TITLE,
        nickname: nickname,
        rank_title: currentRankTitle,
        score: processed
      });

    if (error) {
      console.error(error);
      registerButton.disabled = false;
      registerButton.textContent = "記録を登録";
      alert("登録に失敗しました");
      return;
    }

    scoreRegistered = true;
    registerButton.textContent = "登録済み";
    registerButton.disabled = true;
    alert("記録を登録しました！");
  }

  function goToArcade() {
    window.location.href = ARCADE_URL;
  }

  startBtn.addEventListener("click", startGame);
  stampBtn.addEventListener("click", () => judge("approve"));
  returnBtn.addEventListener("click", () => judge("return"));
  retryButton.addEventListener("click", backToTitle);
  homeBtn.addEventListener("click", backToTitle);
  shareButton.addEventListener("click", shareResult);
  registerButton.addEventListener("click", registerScore);
  arcadeButton.addEventListener("click", goToArcade);

  document.addEventListener("contextmenu", e => e.preventDefault());

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && playing) {
      updateTimer();
    }
  });

  resultButtons.classList.add("hidden");
  showScreen(titleScreen);
})();
