var jsPsych = initJsPsych({
  show_progress_bar: true,
  auto_update_progress_bar: true,
  message_progress_bar: "實驗進度",
  on_finish: function () {
    console.log(jsPsych.data.get().json());
  },
});

var imgLogo = "images/logo.jpg";
var chatNoAvatar = "images/chat_layout_none.jpg";
var chatWithAvatar = "images/chat_layout_avatar.jpg";

var avatarPools = {
  mascot: [
    "images/mascot_1.jpg",
    "images/mascot_2.jpg",
    "images/mascot_3.jpg",
  ],
  virtual: [
    "images/virtual_1.jpg",
    "images/virtual_2.jpg",
    "images/virtual_3.jpg",
  ],
  human: ["images/human_1.jpg", "images/human_2.jpg", "images/human_3.jpg"],
};

var groupLabels = {
  mascot: "吉祥物型頭像",
  virtual: "虛擬角色型頭像",
  human: "真人型頭像",
};

var allAvatars = Object.keys(avatarPools).flatMap(function (group) {
  return avatarPools[group].map(function (path) {
    return { path: path, group: group, label: groupLabels[group] };
  });
});

var timeline = [];

timeline.push({
  type: jsPsychPreload,
  images: [
    imgLogo,
    chatNoAvatar,
    chatWithAvatar,
    avatarPools.mascot,
    avatarPools.virtual,
    avatarPools.human,
  ].flat(),
});

timeline.push({
  type: jsPsychSurveyHtmlForm,
  preamble: "<h2>基本資料</h2><p>請先填寫以下資料。所有資料僅供課程研究分析使用。</p>",
  html: `
    <div class="form-panel">
      <label>生理性別
        <select name="gender" required>
          <option value="">請選擇</option>
          <option value="male">男</option>
          <option value="female">女</option>
          <option value="other">其他 / 不便透露</option>
        </select>
      </label>

      <label>年齡
        <select name="age" required>
          <option value="">請選擇</option>
          <option value="under18">18 歲以下</option>
          <option value="18-24">18-24 歲</option>
          <option value="25-34">25-34 歲</option>
          <option value="35up">35 歲以上</option>
        </select>
      </label>

      <fieldset>
        <legend>你平常接觸 ACG、動漫、遊戲、VTuber 或虛擬角色相關內容的頻率為何？</legend>
        <label><input type="radio" name="acg_habit" value="1" required> 1 非常少</label>
        <label><input type="radio" name="acg_habit" value="2"> 2</label>
        <label><input type="radio" name="acg_habit" value="3"> 3</label>
        <label><input type="radio" name="acg_habit" value="4"> 4</label>
        <label><input type="radio" name="acg_habit" value="5"> 5 非常頻繁</label>
      </fieldset>
    </div>
  `,
  button_label: "下一步",
  data: { stage: "demographics" },
});

timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <section class="experiment-copy">
      <h2>情境說明</h2>
      <p>
        請想像你正在瀏覽一款名為 <strong>Aethoria Infinite</strong> 的線上遊戲。
        這是一款結合奇幻世界、冒險任務與 AI 客服系統的 MMORPG。遊戲官方網站提供
        聊天式客服介面，協助玩家處理帳號、任務、儲值與遊戲設定等問題。
      </p>
      <p>
        接下來你會看到兩種客服聊天介面：一種沒有顯示客服頭像，另一種有顯示客服頭像。
        請依照你看到的畫面，評估你對這個客服介面的感受。
      </p>
    </section>
  `,
  choices: ["開始實驗"],
  data: { stage: "intro" },
});

var likertScale = [
  "非常不同意",
  "不同意",
  "普通",
  "同意",
  "非常同意",
];

var sharedQuestions = [
  {
    prompt: "1. 我認為這個客服介面看起來是友善的。",
    name: "friendly",
  },
  {
    prompt: "2. 我認為這個客服介面能讓我感到安心。",
    name: "comfort",
  },
  {
    prompt: "3. 我認為這個客服介面是值得信任的。",
    name: "trust",
  },
  {
    prompt: "4. 我願意向這個客服介面詢問遊戲相關問題。",
    name: "willing_to_ask",
  },
  {
    prompt: "5. 我認為這個客服介面符合 Aethoria Infinite 的遊戲形象。",
    name: "brand_fit",
  },
];

var avatarQuestions = [
  {
    prompt: "6. 我認為客服頭像讓這個介面更有親近感。",
    name: "avatar_closeness",
  },
  {
    prompt: "7. 我認為客服頭像讓我更容易理解客服代表的存在。",
    name: "avatar_presence",
  },
  {
    prompt: "8. 我認為客服頭像能提升我對客服介面的信任感。",
    name: "avatar_trust",
  },
  {
    prompt: "9. 我認為這個客服頭像適合用於遊戲官方客服。",
    name: "avatar_official_fit",
  },
  {
    prompt: "10. 我認為這個客服頭像會影響我對遊戲品牌的印象。",
    name: "avatar_brand_effect",
  },
];

var overallQuestions = [
  {
    prompt: "11. 整體而言，我喜歡這個客服介面的視覺呈現。",
    name: "overall_like",
  },
  {
    prompt: "12. 整體而言，我認為這個客服介面能提升遊戲官方的專業感。",
    name: "overall_professional",
  },
];

function withScale(questions) {
  return questions.map(function (question) {
    return Object.assign({}, question, {
      labels: likertScale,
      required: true,
    });
  });
}

timeline.push({
  type: jsPsychSurveyLikert,
  preamble: `
    <h2>客服介面評估：無頭像版本</h2>
    <p>請觀察下方沒有客服頭像的聊天介面，並回答後續題目。</p>
    <div class="stimulus-frame">
      <img src="${chatNoAvatar}" alt="無頭像聊天介面">
    </div>
  `,
  questions: withScale(sharedQuestions.concat(overallQuestions)),
  button_label: "下一步",
  data: { stage: "no_avatar_rating", avatar_condition: "none" },
});

var selectedAvatarGroup = jsPsych.randomization.sampleWithoutReplacement(
  Object.keys(avatarPools),
  1,
)[0];
var selectedAvatar = jsPsych.randomization.sampleWithoutReplacement(
  avatarPools[selectedAvatarGroup],
  1,
)[0];

timeline.push({
  type: jsPsychSurveyLikert,
  preamble: `
    <h2>客服介面評估：有頭像版本</h2>
    <p>請觀察下方含有客服頭像的聊天介面，並回答後續題目。</p>
    <div class="chat-composite">
      <img class="chat-layout" src="${chatWithAvatar}" alt="有頭像聊天介面">
      <img class="chat-avatar" src="${selectedAvatar}" alt="客服頭像">
    </div>
  `,
  questions: withScale(sharedQuestions.concat(avatarQuestions, overallQuestions)),
  button_label: "下一步",
  data: {
    stage: "avatar_rating",
    avatar_condition: selectedAvatarGroup,
    avatar_condition_label: groupLabels[selectedAvatarGroup],
    avatar_path: selectedAvatar,
  },
});

timeline.push({
  type: jsPsychSurveyHtmlForm,
  preamble: "<h2>頭像必要性評估</h2>",
  html: `
    <div class="form-panel">
      <fieldset>
        <legend>你認為遊戲官方客服介面需要放置客服頭像嗎？</legend>
        <label><input type="radio" name="avatar_necessity" value="yes" required> 需要</label>
        <label><input type="radio" name="avatar_necessity" value="no"> 不需要</label>
        <label><input type="radio" name="avatar_necessity" value="unsure"> 不確定</label>
      </fieldset>

      <label>請簡短說明原因
        <textarea name="avatar_necessity_reason" rows="4" placeholder="請輸入你的想法"></textarea>
      </label>
    </div>
  `,
  button_label: "下一步",
  data: { stage: "avatar_necessity" },
});

function pickRankingImages() {
  var validSample = null;

  while (!validSample) {
    var sample = jsPsych.randomization.sampleWithoutReplacement(allAvatars, 4);
    var counts = sample.reduce(function (result, item) {
      result[item.group] = (result[item.group] || 0) + 1;
      return result;
    }, {});

    var maxCount = Math.max.apply(null, Object.values(counts));
    if (maxCount <= 2) {
      validSample = sample;
    }
  }

  return jsPsych.randomization.shuffle(
    [{ path: imgLogo, group: "official_logo", label: "官方 Logo" }].concat(
      validSample,
    ),
  );
}

var rankingImages = pickRankingImages();

function rankingSelect(name) {
  return `
    <select name="${name}" required>
      <option value="">請選擇</option>
      <option value="1">1 最適合</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5 最不適合</option>
    </select>
  `;
}

function rankingRows(prefix) {
  return rankingImages
    .map(function (item, index) {
      return `
        <div class="ranking-row">
          <img src="${item.path}" alt="${item.label}">
          <span>${item.label}</span>
          ${rankingSelect(prefix + "_" + index)}
        </div>
      `;
    })
    .join("");
}

timeline.push({
  type: jsPsychSurveyHtmlForm,
  preamble: `
    <h2>頭像排序任務</h2>
    <p>
      下方包含 Aethoria Infinite 官方 Logo 與四個候選客服頭像。
      請依照兩個標準分別排序，1 代表最適合，5 代表最不適合。
    </p>
  `,
  html: `
    <div class="ranking-grid">
      <section>
        <h3>標準一：最適合代表遊戲官方客服</h3>
        ${rankingRows("official_fit_rank")}
      </section>

      <section>
        <h3>標準二：最能讓你感到信任與安心</h3>
        ${rankingRows("trust_rank")}
      </section>
    </div>
  `,
  button_label: "送出",
  data: {
    stage: "avatar_ranking",
    ranking_images: rankingImages.map(function (item) {
      return item.path;
    }),
    ranking_groups: rankingImages.map(function (item) {
      return item.group;
    }),
  },
});

timeline.push({
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <section class="experiment-copy">
      <h2>實驗結束</h2>
      <p>感謝你的填答。你的回覆已完成記錄，請依照研究者或課程平台的指示關閉此頁面。</p>
    </section>
  `,
  choices: "NO_KEYS",
  data: { stage: "end" },
});

jsPsych.run(timeline);
