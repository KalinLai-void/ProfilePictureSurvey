var jsPsychSortableHtml = window.jsPsychSortableHtml;
var jsPsych = initJsPsych({
  on_finish: function () {
    // 實驗結束
  },
});

// ==========================================
// 0. 定義圖片素材與組別 (全部改用 var)
// ==========================================
var img_logo = "images/logo.jpg";
var pool_mascot = [
  "images/mascot_1.jpg",
  "images/mascot_2.jpg",
  "images/mascot_3.jpg",
];
var pool_virtual = [
  "images/virtual_1.jpg",
  "images/virtual_2.jpg",
  "images/virtual_3.jpg",
];
var pool_human = [
  "images/human_1.jpg",
  "images/human_2.jpg",
  "images/human_3.jpg",
];
var chat_no_avatar = "images/chat_layout_none.jpg";
var chat_with_avatar = "images/chat_layout_avatar.jpg";

var timeline = [];

// ==========================================
// 0.5 預載所有圖片
// ==========================================
var preload = {
  type: jsPsychPreload,
  images: [
    img_logo,
    chat_no_avatar,
    chat_with_avatar,
    ...pool_mascot,
    ...pool_virtual,
    ...pool_human,
  ],
};
timeline.push(preload);

// ==========================================
// 1. 前導：情境說明與人口統計
// ==========================================
var stage1_demographics = {
  type: jsPsychSurveyHtmlForm,
  preamble: "<h3>第一階段：基本資料</h3>",
  html: `
        <p>生理性別： <select name="gender" required><option value="">請選擇</option><option value="male">男</option><option value="female">女</option><option value="other">其他</option></select></p>
        <p>年齡層： <select name="age" required><option value="">請選擇</option><option value="under18">18歲以下</option><option value="18-24">18-24歲</option><option value="25-34">25-34歲</option><option value="35up">35歲以上</option></select></p>
        <p>您平時是否有遊玩電子遊戲或接觸 ACG（動漫/虛擬偶像/VTuber）文化的習慣？</p>
        <p><input type="radio" name="acg_habit" value="1" required> 1 (非常少) 
           <input type="radio" name="acg_habit" value="2"> 2 
           <input type="radio" name="acg_habit" value="3"> 3 
           <input type="radio" name="acg_habit" value="4"> 4 
           <input type="radio" name="acg_habit" value="5"> 5 (非常頻繁)</p>
    `,
};
timeline.push(stage1_demographics);

var intro_screen = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
        <h2>歡迎參與本研究</h2>
        <p align="left" style="max-width: 600px; margin: 0 auto;">
        Aethoria Infinite 是一家全球知名的娛樂科技公司，旗下擁有熱門的「賽博龐克動作遊戲」、「奇幻 MMORPG」與「AI 虛擬偶像」。<br><br>
        想像您是一位正在使用該公司旗下產品的用戶，您對公司即將舉辦的虛擬演唱會活動有些疑問，因此尋求客服協助。接下來，您將會看到與該客服的對話紀錄……
        </p><br>
    `,
  choices: ["開始實驗"],
};
timeline.push(intro_screen);

// ==========================================
// 2. 階段二：無頭貼對話與量表
// ==========================================
var likert_scale = ["非常不同意", "不同意", "普通", "同意", "非常同意"];
var questions_no_avatar = [
  {
    prompt: "1. 這個客服讓我覺得有親切感。",
    name: "q1",
    labels: likert_scale,
    required: true,
  },
  {
    prompt: "2. 這個客服的整體視覺形象讓人感到友善且容易親近。",
    name: "q2",
    labels: likert_scale,
    required: true,
  },
  {
    prompt: "3. 我覺得這個客服是可信任的。",
    name: "q3",
    labels: likert_scale,
    required: true,
  },
  {
    prompt: "4. 我覺得這個客服看起來很專業。",
    name: "q4",
    labels: likert_scale,
    required: true,
  },
  {
    prompt: "5. 我願意向此客服提供更多個人問題及資訊。",
    name: "q5",
    labels: likert_scale,
    required: true,
  },
  {
    prompt: "11. 我認為這個客服提升了我對此品牌的好感度。",
    name: "q11",
    labels: likert_scale,
    required: true,
  },
  {
    prompt: "12. 這個客服的呈現方式，讓我對該品牌產生了正面的印象。",
    name: "q12",
    labels: likert_scale,
    required: true,
  },
];

var stage2_combined = {
  type: jsPsychSurveyLikert,
  preamble: `
    <h3>第二階段</h3>
    <p>請閱讀以下客服對話紀錄，並根據體驗回答下方問題：</p>
    <div style="margin-bottom: 20px;">
        <img src="${chat_no_avatar}" style="max-width: 80vw; max-height: 40vh; border: 1px solid #ddd; border-radius: 8px;">
    </div>
  `,
  questions: questions_no_avatar,
  button_label: "送出",
};

timeline.push(stage2_combined);

// ==========================================
// 3. 階段三：隨機有頭貼對話與完整量表
// ==========================================
var questions_full = [
  ...questions_no_avatar.slice(0, 5),
  {
    prompt: "6. 這個客服讓我覺得不自然或怪異。",
    name: "q6",
    labels: likert_scale,
    required: true,
  },
  {
    prompt: "7. 面對這個客服的呈現方式，會讓我感到有些不自在。",
    name: "q7",
    labels: likert_scale,
    required: true,
  },
  {
    prompt: "8. 這個客服的頭貼會讓我分心，影響我閱讀對話框中的文字。",
    name: "q8",
    labels: likert_scale,
    required: true,
  },
  {
    prompt: "9. 我認為這個頭貼符合我對該品牌的期待。",
    name: "q9",
    labels: likert_scale,
    required: true,
  },
  {
    prompt: "10. 我認為這個頭貼的視覺設計，能準確傳達出該品牌的特色與定位。",
    name: "q10",
    labels: likert_scale,
    required: true,
  },
  ...questions_no_avatar.slice(5),
];

var avatar_groups = [pool_mascot, pool_virtual, pool_human];
var random_group_idx = Math.floor(Math.random() * 3);
var stage3_avatar =
  avatar_groups[random_group_idx][Math.floor(Math.random() * 3)];

var stage3_combined = {
  type: jsPsychSurveyLikert,
  preamble: `
    <h3>第三階段</h3>
    <p>系統進行了更新，請閱讀以下帶有客服頭貼的對話紀錄，並回答下方問題：</p>
    <div style="position:relative; display:inline-block; margin-bottom: 20px;">
        <img src="${chat_with_avatar}" style="max-width: 80vw; max-height: 40vh; border: 1px solid #ddd; border-radius: 8px;">
        <img src="${stage3_avatar}" style="position:absolute; top:20px; left:10px; width:50px; height:50px; border-radius:50%; border: 2px solid white;">
    </div>
  `,
  questions: questions_full,
  button_label: "送出",
};

timeline.push(stage3_combined);

// ==========================================
// 4. 階段四：必要性提問與動態排序
// ==========================================
var stage4_necessity = {
  type: jsPsychSurveyHtmlForm,
  preamble: "<h3>第四階段</h3>",
  html: `
        <p>我認為客服系統的頭貼有存在的必要：</p>
        <p><input type="radio" name="necessity" value="yes" required> 是 <input type="radio" name="necessity" value="no"> 否</p>
        <p>原因（非必填）：<br><textarea name="reason" rows="3" cols="50"></textarea></p>
    `,
};
timeline.push(stage4_necessity);

// 核心抽樣演算法
var all_avatars = [];
pool_mascot.forEach((img) => all_avatars.push({ path: img, group: "mascot" }));
pool_virtual.forEach((img) =>
  all_avatars.push({ path: img, group: "virtual" }),
);
pool_human.forEach((img) => all_avatars.push({ path: img, group: "human" }));

var selected_4_avatars = [];
var valid_combo = false;

while (!valid_combo) {
  var shuffled = jsPsych.randomization.shuffle(all_avatars);
  var sample = shuffled.slice(0, 4);

  var counts = { mascot: 0, virtual: 0, human: 0 };
  sample.forEach((item) => {
    counts[item.group]++;
  });

  if (counts.mascot <= 2 && counts.virtual <= 2 && counts.human <= 2) {
    selected_4_avatars = sample.map((item) => item.path);
    valid_combo = true;
  }
}

var final_5_avatars = [img_logo, ...selected_4_avatars];
final_5_avatars = jsPsych.randomization.shuffle(final_5_avatars);

// 排序 1 拖曳版 (使用 SortableHtml 外掛)
var stage4_rank1 = {
  type: jsPsychSortableHtml,
  stimulus: `
        <p style="color:#A020F0; font-weight:bold;">【排序一：品牌契合度】</p>
        <p>請將以下圖片拖曳排序（最符合放最上方）：</p>
    `,
  button_label: "確認排序",
  options: final_5_avatars.map(
    (img, idx) =>
      `<img src="${img}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">`,
  ),
  on_finish: function (data) {
    // Cognition.run 會自動記錄 data.order，即為排序後的陣列索引
  },
};
timeline.push(stage4_rank1);

// 排序 2 拖曳版
var stage4_rank2 = {
  type: jsPsychSortableHtml,
  stimulus: `
        <p style="color:#00FFFF; font-weight:bold; background-color:#333; display:inline-block; padding:5px;">【排序二：安心與信任感】</p>
        <p>請將以下圖片拖曳排序（最讓您感到安心放最上方）：</p>
    `,
  button_label: "完成送出",
  options: final_5_avatars.map(
    (img, idx) =>
      `<img src="${img}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">`,
  ),
};
timeline.push(stage4_rank2);

// ==========================================
// 5. 結束畫面
// ==========================================
var end_screen = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<p>問卷已結束，非常感謝您的參與！您的回覆對本研究有極大的幫助。資料已安全送出，現在可以關閉分頁。</p>",
  choices: "NO_KEYS",
};
timeline.push(end_screen);

jsPsych.run(timeline);
