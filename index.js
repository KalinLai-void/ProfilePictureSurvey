var jsPsych = initJsPsych({
  show_progress_bar: true,
  auto_update_progress_bar: true,
  message_progress_bar: "實驗進度",
  on_finish: function () {
    jsPsych.setProgressBar(1);
    console.log(jsPsych.data.get().json());
    showCompletionScreen();
    [100, 500, 1000, 2000].forEach(function (delay) {
      setTimeout(showCompletionScreen, delay);
    });
  },
});

function showCompletionScreen() {
  var content = document.querySelector("#jspsych-content");
  var display = document.querySelector(".jspsych-display-element");
  var existingOverlay = document.querySelector("#completion-overlay");
  var html = `
    <section class="completion-screen">
      <h2>問卷填寫完畢</h2>
      <p>感謝您的填答，資料已成功送出。</p>
      <p>您現在可以安心關閉此頁面。</p>
    </section>
  `;

  if (!existingOverlay) {
    var overlay = document.createElement("div");
    overlay.id = "completion-overlay";
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
  }

  if (content) {
    content.innerHTML = html;
  } else if (display) {
    display.innerHTML = '<div id="jspsych-content">' + html + "</div>";
  }
}

var imgLogo = "images/logo.jpg";
var chatNoAvatar = "images/chat_layout_none.jpg";
var chatWithAvatar = "images/chat_layout_avatar.jpg";

var avatarPools = {
  mascot: ["images/mascot_1.jpg", "images/mascot_2.jpg", "images/mascot_3.jpg"],
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
  preamble: "<h2>第一階段：基本資料調查</h2>",
  html: `
    <div class="form-panel">
      <label>生理性別
        <select name="gender" required>
          <option value="">請選擇</option>
          <option value="male">男</option>
          <option value="female">女</option>
        </select>
      </label>

      <label>年齡層
        <select name="age" required>
          <option value="under18">18歲以下</option>
          <option value="18-24">18-24歲</option>
          <option value="25-29">25-29歲</option>
          <option value="30-34">30-34歲</option>
          <option value="35-39">35-39歲</option>
          <option value="40-44">40-44歲</option>
          <option value="45up">45歲以上</option>
        </select>
      </label>

      <fieldset class="score-options">
        <legend>我平時是否有遊玩電子遊戲或接觸 ACG（動漫/虛擬偶像/VTuber）文化的習慣？</legend>
        <label><input type="radio" name="acg_habit" value="1" required> 非常不符合我</label>
        <label><input type="radio" name="acg_habit" value="2"> 不符合我</label>
        <label><input type="radio" name="acg_habit" value="3"> 普通</label>
        <label><input type="radio" name="acg_habit" value="4"> 符合我</label>
        <label><input type="radio" name="acg_habit" value="5"> 非常符合我</label>
      </fieldset>
    </div>
  `,
  button_label: "下一步",
  data: { stage: "demographics_and_prior_knowledge" },
});

timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <section class="experiment-copy">
      <h2>前導情境</h2>
      <p>Aethoria Infinite 是一家全球知名的娛樂科技公司，旗下擁有熱門的「賽博龐克動作遊戲」、「奇幻 MMORPG」與「AI 虛擬偶像」。</p>
      <p>想像您是一位正在使用該公司旗下產品的用戶，您對公司即將舉辦的虛擬演唱會活動有些疑問，因此 尋求客服協助。接下來，您將會看到與該客服的對話紀錄……</p>
    </section>
  `,
  choices: ["下一步"],
  data: { stage: "scenario_intro" },
});

var likertScale = ["非常不同意", "不同意", "普通", "同意", "非常同意"];

var baseScaleQuestions = [
  {
    prompt: "1. 這個客服讓我覺得有親切感。",
    name: "q1_closeness",
  },
  {
    prompt: "2. 這個客服的整體視覺形象讓人感到友善且容易親近。",
    name: "q2_friendly_visual",
  },
  {
    prompt: "3. 我覺得這個客服是可信任的。",
    name: "q3_trustworthy",
  },
  {
    prompt: "4. 我覺得這個客服看起來很專業。",
    name: "q4_professional",
  },
  {
    prompt: "5. 我願意向此客服提供更多個人問題及資訊。",
    name: "q5_disclose_information",
  },
  {
    prompt: "6. 這個客服讓我覺得不自然或怪異。",
    name: "q6_unnatural",
  },
  {
    prompt: "7. 面對這個客服的呈現方式，會讓我感到有些不自在。",
    name: "q7_uncomfortable",
  },
];

var avatarOnlyScaleQuestions = [
  {
    prompt: "8. 這個客服的頭貼會讓我分心，影響我閱讀對話框中的文字。",
    name: "q8_avatar_distraction",
  },
  {
    prompt: "9. 我認為這個頭貼符合我對該品牌的期待。",
    name: "q9_avatar_brand_expectation",
  },
  {
    prompt: "10. 我認為這個頭貼的視覺設計，能準確傳達出該品牌的特色與定位。",
    name: "q10_avatar_brand_positioning",
  },
];

var outcomeScaleQuestions = [
  {
    prompt: "11. 我認為這個客服提升了我對此品牌的好感度。",
    name: "q11_brand_preference",
  },
  {
    prompt: "12. 這個客服的呈現方式，讓我對該品牌產生了正面的印象。",
    name: "q12_positive_brand_impression",
  },
];

var noAvatarScaleQuestions = baseScaleQuestions.concat(outcomeScaleQuestions);
var avatarScaleQuestions = baseScaleQuestions.concat(
  avatarOnlyScaleQuestions,
  outcomeScaleQuestions,
);

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
    <h2>第二階段：無頭貼對話內容</h2>
    <p>先讓受試者觀看一次沒頭貼的對話內容，並讓受試者填寫實驗設計的量表</p>
    <div class="stimulus-frame">
      <img src="${chatNoAvatar}" alt="沒頭貼的對話內容">
    </div>
  `,
  questions: withScale(noAvatarScaleQuestions),
  button_label: "下一步",
  data: { stage: "no_avatar_rating", avatar_condition: "none" },
});

var selectedAvatarItem = jsPsych.randomization.sampleWithoutReplacement(
  allAvatars,
  1,
)[0];
var selectedAvatarGroup = selectedAvatarItem.group;
var selectedAvatar = selectedAvatarItem.path;

timeline.push({
  type: jsPsychSurveyLikert,
  preamble: `
    <h2>第三階段：有頭貼對話內容</h2>
    <p>從非品牌LOGO的有頭貼組，抽出一張照片做為頭貼，並讓受試者觀看這個頭貼的對話內容，再讓受試者填寫實驗設計的量表</p>
    <div class="chat-composite">
      <img class="chat-layout" src="${chatWithAvatar}" alt="有頭貼的對話內容">
      <img class="chat-avatar" src="${selectedAvatar}" alt="客服頭貼">
    </div>
  `,
  questions: withScale(avatarScaleQuestions),
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
  preamble: "<h2>第四階段：頭貼必要性</h2>",
  html: `
    <div class="form-panel">
      <fieldset class="binary-options">
        <legend>我認為客服系統的頭貼有存在的必要（是/否）</legend>
        <label><input type="radio" name="avatar_necessity" value="yes" required> 是</label>
        <label><input type="radio" name="avatar_necessity" value="no"> 否</label>
      </fieldset>

      <label>原因（非必填）
        <textarea name="avatar_necessity_reason" rows="4"></textarea>
      </label>
    </div>
  `,
  button_label: "下一步",
  data: { stage: "avatar_necessity" },
});

function pickRankingImages() {
  var groups = jsPsych.randomization.shuffle(Object.keys(avatarPools));
  var doubledGroup = groups[0];
  var selectedItems = [];

  groups.forEach(function (group) {
    var available = avatarPools[group]
      .filter(function (path) {
        return path !== selectedAvatar;
      })
      .map(function (path) {
        return { path: path, group: group, label: groupLabels[group] };
      });

    var sampleSize = group === doubledGroup ? 2 : 1;
    selectedItems = selectedItems.concat(
      jsPsych.randomization.sampleWithoutReplacement(available, sampleSize),
    );
  });

  return jsPsych.randomization.shuffle(
    [{ path: imgLogo, group: "brand_logo", label: "品牌LOGO" }].concat(
      selectedItems,
    ),
  );
}

var rankingImages = pickRankingImages();

function rankingSelect(name, rankSet) {
  return `
    <select name="${name}" data-rank-set="${rankSet}" required>
      <option value="">請選擇</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
  `;
}

function rankingRows(prefix, rankSet) {
  return rankingImages
    .map(function (item, index) {
      return `
        <div class="ranking-row">
          <img src="${item.path}" alt="${item.label}">
          ${rankingSelect(prefix + "_" + index, rankSet)}
        </div>
      `;
    })
    .join("");
}

function buildRankingTrialData() {
  var data = {};

  rankingImages.forEach(function (item, index) {
    data["ranking_item_" + index + "_path"] = item.path;
    data["ranking_item_" + index + "_group"] = item.group;
    data["ranking_item_" + index + "_label"] = item.label;
  });

  return data;
}

function addRankingResponseMetadata(data) {
  var response = data.response || {};
  var rankSets = [
    { key: "brand_fit", prefix: "brand_fit_rank" },
    { key: "trust", prefix: "trust_rank" },
  ];

  rankSets.forEach(function (rankSet) {
    rankingImages.forEach(function (item, index) {
      var rank = response[rankSet.prefix + "_" + index];

      data[rankSet.key + "_item_" + index + "_rank"] = rank;

      if (rank) {
        data[rankSet.key + "_rank_" + rank + "_path"] = item.path;
        data[rankSet.key + "_rank_" + rank + "_group"] = item.group;
        data[rankSet.key + "_rank_" + rank + "_label"] = item.label;
      }
    });
  });
}

function enableRankingValidation() {
  var form = document.querySelector("#jspsych-survey-html-form");
  var button = document.querySelector(
    "#jspsych-survey-html-form-next, #jspsych-survey-html-form input[type='submit'], #jspsych-survey-html-form button[type='submit']",
  );
  var warning = document.querySelector("#ranking-warning");
  var rankSets = ["brand_fit", "trust"];

  function validateSet(rankSet) {
    var selects = Array.from(
      document.querySelectorAll('select[data-rank-set="' + rankSet + '"]'),
    );
    var values = selects.map(function (select) {
      return select.value;
    });
    var complete = values.every(Boolean);
    var unique = new Set(values).size === values.length;
    return complete && unique;
  }

  function validateAllRankSets() {
    return rankSets.every(validateSet);
  }

  function updateButtonState() {
    var valid = validateAllRankSets();
    if (button) {
      button.disabled = !valid;
    }
    if (warning) {
      warning.textContent = valid
        ? ""
        : "請確認兩個排序指標都已選完 1 到 5，且同一個排序指標內不要重複名次。";
    }
    return valid;
  }

  document.querySelectorAll("select[data-rank-set]").forEach(function (select) {
    select.addEventListener("change", updateButtonState);
  });

  if (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!validateAllRankSets()) {
          event.preventDefault();
          event.stopImmediatePropagation();
          updateButtonState();
        }
      },
      true,
    );
  }

  updateButtonState();
}

timeline.push({
  type: jsPsychSurveyHtmlForm,
  preamble: `
    <h2>第四階段：排序</h2>
    <p>無論您前一題的答案為何，若未來系統全面導入頭貼，請對以下選項進行偏好排序...</p>
  `,
  html: `
    <p class="ranking-note">
      五個頭貼包括品牌LOGO一張，以及剩下四張從非品牌LOGO的有頭貼組抽選；同一組別的頭貼不抽超過2張。
    </p>
    <div class="ranking-grid">
      <section>
        <p>請根據 Aethoria Infinite 作為一家「娛樂科技大廠」的品牌背景，將以下五個客服頭貼，依據「最符合該品牌形象」到「最不符合」進行名次排序。</p>
        <p>（1為最符合；5為最不符合）</p>
        ${rankingRows("brand_fit_rank", "brand_fit")}
      </section>

      <section>
        <p>請想像您目前在該系統遇到了「帳號儲值失敗」或「演唱會票務異常」的緊急問題需要協助。請將以下五個客服頭貼，依據「最能讓您感到安心、且最願意向其諮詢」的程度進行名次排序。</p>
        <p>（1為最安心；5為最不安心）</p>
        ${rankingRows("trust_rank", "trust")}
      </section>
    </div>
    <p id="ranking-warning" class="ranking-warning"></p>
  `,
  button_label: "送出",
  data: Object.assign({ stage: "avatar_ranking" }, buildRankingTrialData()),
  on_load: enableRankingValidation,
  on_finish: addRankingResponseMetadata,
});

jsPsych.run(timeline);
