var jsPsych = initJsPsych({
  show_progress_bar: true,
  auto_update_progress_bar: true,
  message_progress_bar: "問卷進度",
  on_finish: function () {
    console.log(jsPsych.data.get().json());

    var displayElement = jsPsych.getDisplayElement();
    displayElement.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; color: #e0e0e0; font-family: 'Helvetica Neue', Arial, sans-serif;">
        <h1 style="color: #00e5ff; margin-bottom: 10px;">✅ 資料已成功送出！</h1>
        <p style="font-size: 18px; margin-bottom: 10px;">非常感謝您的參與，您的回覆對本研究非常有幫助。</p>
        <div style="margin-top: 20px; padding: 15px 30px; background-color: #2b2b30; border-radius: 8px; border: 1px solid #444;">
          <p style="color: #fff; font-size: 16px; margin: 0;">您現在可以安全地關閉此網頁分頁。</p>
        </div>
      </div>
    `;
  },
});

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

function flattenResponseData(data) {
  if (!data.response) {
    return;
  }

  Object.keys(data.response).forEach(function (key) {
    var value = data.response[key];
    data[key] = Array.isArray(value) ? value.join(",") : value;
  });
}

function enableBackgroundValidation() {
  var form = document.querySelector("#jspsych-survey-html-form");
  var warning = document.createElement("p");
  var occupationSelect = document.querySelector('select[name="occupation"]');
  var occupationOtherField = document.querySelector("#occupation-other-field");
  var occupationOtherInput = document.querySelector(
    'input[name="occupation_other"]',
  );
  var backgroundOtherBox = document.querySelector(
    'input[name="related_background"][value="other"]',
  );
  var backgroundOtherField = document.querySelector(
    "#related-background-other-field",
  );
  var backgroundOtherInput = document.querySelector(
    'input[name="related_background_other"]',
  );
  var noneBox = document.querySelector(
    'input[name="related_background"][value="none"]',
  );
  var boxes = Array.from(
    document.querySelectorAll('input[name="related_background"]'),
  );
  var selectedBackgroundInput = document.querySelector(
    'input[name="related_background_selected"]',
  );

  warning.className = "form-warning";
  warning.textContent = "請至少勾選一項相關背景。";
  warning.hidden = true;
  if (form) {
    form.appendChild(warning);
  }

  function updateOccupationOtherField() {
    var shouldShow = occupationSelect && occupationSelect.value === "other";

    if (occupationOtherField) {
      occupationOtherField.hidden = !shouldShow;
    }

    if (occupationOtherInput) {
      occupationOtherInput.required = shouldShow;
      if (!shouldShow) {
        occupationOtherInput.value = "";
      }
    }
  }

  if (occupationSelect) {
    occupationSelect.addEventListener("change", updateOccupationOtherField);
    updateOccupationOtherField();
  }

  function updateSelectedBackgroundValue() {
    var selectedValues = boxes
      .filter(function (item) {
        return item.checked;
      })
      .map(function (item) {
        return item.value;
      });

    if (selectedBackgroundInput) {
      selectedBackgroundInput.value = selectedValues.join(",");
    }
  }

  function updateBackgroundOtherField() {
    var shouldShow = backgroundOtherBox && backgroundOtherBox.checked;

    if (backgroundOtherField) {
      backgroundOtherField.hidden = !shouldShow;
    }

    if (backgroundOtherInput) {
      backgroundOtherInput.required = shouldShow;
      if (!shouldShow) {
        backgroundOtherInput.value = "";
      }
    }
  }

  boxes.forEach(function (box) {
    box.addEventListener("change", function () {
      if (box === noneBox && box.checked) {
        boxes.forEach(function (otherBox) {
          if (otherBox !== noneBox) {
            otherBox.checked = false;
          }
        });
      } else if (box.checked && noneBox) {
        noneBox.checked = false;
      }

      warning.hidden = boxes.some(function (item) {
        return item.checked;
      });
      updateBackgroundOtherField();
      updateSelectedBackgroundValue();
    });
  });

  updateBackgroundOtherField();
  updateSelectedBackgroundValue();

  if (form) {
    form.addEventListener(
      "submit",
      function (event) {
        var hasBackground = boxes.some(function (item) {
          return item.checked;
        });
        if (!hasBackground) {
          event.preventDefault();
          event.stopImmediatePropagation();
          warning.hidden = false;
        } else {
          updateSelectedBackgroundValue();
        }
      },
      true,
    );
  }
}

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
  preamble: "<h2>基本資料</h2>",
  html: `
    <div class="form-panel">
      <label>生理性別
        <select name="gender" required>
          <option value="">請選擇</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">其他 / 不想透露</option>
        </select>
      </label>

      <label>年齡
        <select name="age" required>
          <option value="">請選擇</option>
          <option value="under18">18歲以下</option>
          <option value="18-24">18-24歲</option>
          <option value="25-29">25-29歲</option>
          <option value="30-34">30-34歲</option>
          <option value="35-39">35-39歲</option>
          <option value="40-44">40-44歲</option>
          <option value="45up">45歲以上</option>
        </select>
      </label>

      <label>職業 / 身份
        <select name="occupation" required>
          <option value="">請選擇</option>
          <option value="student">學生</option>
          <option value="employee">上班族</option>
          <option value="freelancer">自由職業者</option>
          <option value="unemployed">未就業 / 待業</option>
          <option value="other">其他</option>
        </select>
      </label>

      <label id="occupation-other-field" class="conditional-field" hidden>請填寫其他職業 / 身分
        <input type="text" name="occupation_other">
      </label>

      <fieldset class="checkbox-options">
        <legend>相關背景 （可複選）</legend>
        <label><input type="checkbox" name="related_background" value="design_visual_ux"> 設計 / 視覺 / UX 相關</label>
        <label><input type="checkbox" name="related_background" value="tech_it_ai"> 資訊 / 科技 / AI 相關</label>
        <label><input type="checkbox" name="related_background" value="game_anime_content"> 遊戲 / 動漫 / 內容創作相關</label>
        <label><input type="checkbox" name="related_background" value="none"> 無相關</label>
        <label><input type="checkbox" name="related_background" value="other"> 其他</label>
      </fieldset>

      <label id="related-background-other-field" class="conditional-field" hidden>請填寫其他相關背景
        <input type="text" name="related_background_other">
      </label>

      <fieldset class="score-options">
        <legend>平時有遊玩電子遊戲或接觸 ACG（動漫/虛擬偶像/VTuber）文化的習慣</legend>
        <label><input type="radio" name="game_acg_frequency" value="1" required> 非常不符合我</label>
        <label><input type="radio" name="game_acg_frequency" value="2"> 不符合我</label>
        <label><input type="radio" name="game_acg_frequency" value="3"> 一般</label>
        <label><input type="radio" name="game_acg_frequency" value="4"> 符合我</label>
        <label><input type="radio" name="game_acg_frequency" value="5"> 非常符合我</label>
      </fieldset>

      <fieldset class="score-options">
        <legend>平時使用聊天機器人的頻率如何？</legend>
        <label><input type="radio" name="chatbot_frequency" value="1" required> 非常不頻繁</label>
        <label><input type="radio" name="chatbot_frequency" value="2"> 不頻繁</label>
        <label><input type="radio" name="chatbot_frequency" value="3"> 一般</label>
        <label><input type="radio" name="chatbot_frequency" value="4"> 頻繁</label>
        <label><input type="radio" name="chatbot_frequency" value="5"> 非常頻繁</label>
      </fieldset>
    </div>
  `,
  button_label: "下一步",
  data: { stage: "demographics_and_prior_knowledge" },
  on_load: enableBackgroundValidation,
  on_finish: flattenResponseData,
});

timeline.push({
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <section class="experiment-copy">
      <h2>前導情境</h2>
      <p><strong>Aethoria Infinite</strong> 是一家全球知名的<strong>娛樂科技公司</strong>，旗下擁有熱門的「<strong>賽博龐克動作遊戲</strong>」、「<strong>奇幻 MMORPG</strong>」與「<strong>AI 虛擬偶像</strong>」。</p>
      <p>想像您是一位正在<strong>使用該公司旗下產品的用戶</strong>，您對公司即將舉辦的<strong>虛擬演唱會活動</strong>有些疑問，因此 <strong>尋求客服協助</strong>。接下來，您將會看到與該客服的<strong>對話紀錄</strong>……</p>
    </section>
  `,
  choices: ["下一步"],
  data: { stage: "scenario_intro" },
});

var likertScale = ["非常不同意", "不同意", "普通", "同意", "非常同意"];

var baseScaleQuestions = [
  {
    prompt: "1. 這個客服/聊天機器人讓我覺得有親切感。",
    name: "q1_closeness",
  },
  {
    prompt: "2. 這個客服/聊天機器人的整體視覺形象讓人感到友善且容易親近。",
    name: "q2_friendly_visual",
  },
  {
    prompt: "3. 我覺得這個客服/聊天機器人是可信任的。",
    name: "q3_trustworthy",
  },
  {
    prompt: "4. 我覺得這個客服/聊天機器人看起來很專業。",
    name: "q4_professional",
  },
  {
    prompt: "5. 我願意向此客服/聊天機器人提供更多個人問題及資訊。",
    name: "q5_disclose_information",
  },
  {
    prompt: "6. 這個客服/聊天機器人讓我覺得不自然或怪異。",
    name: "q6_unnatural",
  },
  {
    prompt: "7. 面對這個客服/聊天機器人的呈現方式，會讓我感到有些不自在。",
    name: "q7_uncomfortable",
  },
];

var avatarOnlyScaleQuestions = [
  {
    prompt:
      "8. 這個客服/聊天機器人的頭貼會讓我分心，影響我閱讀對話框中的文字。",
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
    prompt: "11. 我認為這個客服/聊天機器人提升了我對此品牌的好感度。",
    name: "q11_brand_preference",
  },
  {
    prompt: "12. 這個客服/聊天機器人的呈現方式，讓我對該品牌產生了正面的印象。",
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
    <h2>無頭貼對話內容</h2>
    <div class="stimulus-frame">
      <img src="${chatNoAvatar}" alt="沒頭貼的對話內容">
    </div>
    <p>請觀看對話內容，並填寫以下實驗設計的量表</p>
  `,
  questions: withScale(noAvatarScaleQuestions),
  button_label: "下一步",
  data: { stage: "no_avatar_rating", avatar_condition: "none" },
  on_finish: flattenResponseData,
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
    <h2>有頭貼對話內容</h2>
    <div class="chat-composite">
      <img class="chat-layout" src="${chatWithAvatar}" alt="有頭貼的對話內容">
      <img class="chat-avatar" src="${selectedAvatar}" alt="客服頭貼">
    </div>
    <p>請觀看對話內容，並填寫以下實驗設計的量表</p>
  `,
  questions: withScale(avatarScaleQuestions),
  button_label: "下一步",
  data: {
    stage: "avatar_rating",
    avatar_condition: selectedAvatarGroup,
    avatar_condition_label: groupLabels[selectedAvatarGroup],
    avatar_path: selectedAvatar,
  },
  on_finish: flattenResponseData,
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
  flattenResponseData(data);

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
    <h2>指標偏好排序</h2>
  `,
  html: `
    <div class="ranking-grid">
      <section>
        <p>請根據 Aethoria Infinite 作為一家<strong>「娛樂科技大廠」</strong>的品牌背景，將以下五個客服頭貼，<strong>依據「最符合該品牌形象」到「最不符合」進行名次排序</strong>。</p>
        <p>（1為最符合；5為最不符合）</p>
        ${rankingRows("brand_fit_rank", "brand_fit")}
      </section>

      <section>
        <p>請想像您目前在該系統遇到了「帳號儲值失敗」或「演唱會票務異常」的<strong>緊急問題需要協助</strong>。請將以下五個客服頭貼，<strong>依據「最能讓您感到安心、且最願意向其諮詢」的程度進行名次排序</strong>。</p>
        <p>（1為最安心；5為最不安心）</p>
        ${rankingRows("trust_rank", "trust")}
      </section>
    </div>
    <p id="ranking-warning" class="ranking-warning"></p>
  `,
  button_label: "下一步",
  data: Object.assign({ stage: "avatar_ranking" }, buildRankingTrialData()),
  on_load: enableRankingValidation,
  on_finish: addRankingResponseMetadata,
});

timeline.push({
  type: jsPsychSurveyHtmlForm,
  preamble: "<h2>頭貼必要性</h2>",
  html: `
    <div class="form-panel">
      <fieldset class="binary-options">
        <legend>你認為客服系統/聊天機器人的頭貼是否有存在的必要？</legend>
        <label><input type="radio" name="avatar_necessity" value="yes" required> 是</label>
        <label><input type="radio" name="avatar_necessity" value="no"> 否</label>
      </fieldset>

      <label>（非必填）請說明客服/聊天機器人的頭貼是否影響你對品牌的印象或互動意願？
        <textarea name="avatar_interaction_reason" rows="4"></textarea>
      </label>
      <label>（非必填）請說明你將不同客服/聊天機器人的頭貼進行排序時的考量因素，例如親切感、信任感、專業感、品牌契合度或其他原因。
        <textarea name="avatar_ranking_reason" rows="4"></textarea>
      </label>
    </div>
  `,
  button_label: "下一步",
  data: { stage: "avatar_necessity" },
  on_finish: flattenResponseData,
});

timeline.push({
  type: jsPsychHtmlButtonResponse, // 改用這個，避免 form 攔截 submit 事件導致卡死
  stimulus: `
    <section class="completion-screen" style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #2563eb; font-size: 24px; margin-bottom: 16px;">問卷填寫完畢</h2>
      <p style="margin-bottom: 8px;">感謝您的填答，您已完成所有問卷內容。</p>
      <p style="margin-bottom: 8px;">請按下下方按鈕送出資料並結束問卷。</p>
      <p style="color: #6b7280; font-size: 14px; margin-top: 16px;">送出後若畫面變空白，代表資料已成功送出，您可以安心關閉此頁面。</p>
    </section>
  `,
  choices: ["送出並結束問卷"],
  data: { stage: "completion_confirmation" },
});

jsPsych.run(timeline);
