const jsPsych = initJsPsych({
  on_finish: function () {
    // 實驗結束，Cognition.run 會自動儲存數據
  },
});

// ==========================================
// 0. 定義圖片素材與組別 (指定相對路徑)
// ==========================================
const img_logo = "images/logo.jpg"; // 品牌 LOGO

const pool_mascot = [
  "images/mascot_1.jpg",
  "images/mascot_2.jpg",
  "images/mascot_3.jpg",
]; // 吉祥物組
const pool_virtual = [
  "images/virtual_1.jpg",
  "images/virtual_2.jpg",
  "images/virtual_3.jpg",
]; // 虛擬角色組
const pool_human = [
  "images/human_1.jpg",
  "images/human_2.jpg",
  "images/human_3.jpg",
]; // 寫實真人組

// 對話情境圖
const chat_no_avatar = "images/chat_layout_none.jpg";
const chat_with_avatar = "images/chat_layout_avatar.jpg";

let timeline = [];

// ==========================================
// 0.5 預載所有圖片 (避免網頁載入延遲)
// ==========================================
let preload_images = [
  img_logo,
  chat_no_avatar,
  chat_with_avatar,
  ...pool_mascot,
  ...pool_virtual,
  ...pool_human,
];

let preload = {
  type: jsPsychPreload,
  images: preload_images,
};
timeline.push(preload); // 將預載任務排在時間軸的第一個

// ==========================================
// 1. 前導：情境說明與人口統計
// ==========================================
let intro_screen = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
        <h2>歡迎參與本研究</h2>
        <p align="left" style="max-width: 600px; margin: 0 auto;">
        Aethoria Infinite 是一家全球知名的娛樂科技公司，旗下擁有熱門的「賽博龐克動作遊戲」、「奇幻 MMORPG」與「AI 虛擬偶像」。<br><br>
        想像您是一位正在使用該公司旗下產品的用戶，您對公司即將舉辦的虛擬演唱會活動有些疑問，因此尋求客服協助。接下來，您將會看到與該客服的對話紀錄……
        </p><br>
    `, // [cite: 246, 247]
  choices: ["開始實驗"],
};
timeline.push(intro_screen);

let stage1_demographics = {
  type: jsPsychSurveyHtmlForm,
  preamble: "<h3>第一階段：基本資料</h3>", // [cite: 37]
  html: `
        <p>生理性別： <select name="gender" required><option value="">請選擇</option><option value="male">男</option><option value="female">女</option><option value="other">其他</option></select></p>
        <p>年齡層： <select name="age" required><option value="">請選擇</option><option value="under18">18歲以下</option><option value="18-24">18-24歲</option><option value="25-34">25-34歲</option><option value="35up">35歲以上</option></select></p>
        <p>您平時是否有遊玩電子遊戲或接觸 ACG（動漫/虛擬偶像/VTuber）文化的習慣？</p>
        <p><input type="radio" name="acg_habit" value="1" required> 1 (非常少) 
           <input type="radio" name="acg_habit" value="2"> 2 
           <input type="radio" name="acg_habit" value="3"> 3 
           <input type="radio" name="acg_habit" value="4"> 4 
           <input type="radio" name="acg_habit" value="5"> 5 (非常頻繁)</p>
    `, // [cite: 38, 39]
};
timeline.push(stage1_demographics);

// ==========================================
// 2. 階段二：無頭貼對話與量表
// ==========================================
// 量表選項 (1-5 或 1-7，此處以 5 點量表為例)
const likert_scale = ["非常不同意", "不同意", "普通", "同意", "非常同意"];

// 無頭貼專用題目 (排除 6-10 題) [cite: 13, 40]
const questions_no_avatar = [
  {
    prompt: "1. 這個客服讓我覺得有親切感。",
    name: "q1",
    labels: likert_scale,
    required: true,
  }, // [cite: 16]
  {
    prompt: "2. 這個客服的整體視覺形象讓人感到友善且容易親近。",
    name: "q2",
    labels: likert_scale,
    required: true,
  }, // [cite: 17]
  {
    prompt: "3. 我覺得這個客服是可信任的。",
    name: "q3",
    labels: likert_scale,
    required: true,
  }, // [cite: 19]
  {
    prompt: "4. 我覺得這個客服看起來很專業。",
    name: "q4",
    labels: likert_scale,
    required: true,
  }, // [cite: 20]
  {
    prompt: "5. 我願意向此客服提供更多個人問題及資訊。",
    name: "q5",
    labels: likert_scale,
    required: true,
  }, // [cite: 21]
  {
    prompt: "11. 我認為這個客服提升了我對此品牌的好感度。",
    name: "q11",
    labels: likert_scale,
    required: true,
  }, // [cite: 31]
  {
    prompt: "12. 這個客服的呈現方式，讓我對該品牌產生了正面的印象。",
    name: "q12",
    labels: likert_scale,
    required: true,
  }, // [cite: 32]
];

let stage2_chat = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<h3>第二階段</h3><p>請閱讀以下客服對話紀錄（目前系統無設置客服頭貼）：</p><img src="${chat_no_avatar}" class="chat-img"><br>`, // [cite: 40]
  choices: ["我已閱讀完畢，進入填答"],
};
timeline.push(stage2_chat);

let stage2_survey = {
  type: jsPsychSurveyLikert,
  preamble: "請根據剛才的客服對話體驗，回答以下問題：",
  questions: questions_no_avatar,
};
timeline.push(stage2_survey);

// ==========================================
// 3. 階段三：隨機有頭貼對話與完整量表
// ==========================================
// 完整 12 題量表
const questions_full = [
  ...questions_no_avatar.slice(0, 5), // 1-5題
  {
    prompt: "6. 這個客服讓我覺得不自然或怪異。",
    name: "q6",
    labels: likert_scale,
    required: true,
  }, // [cite: 23]
  {
    prompt: "7. 面對這個客服的呈現方式，會讓我感到有些不自在。",
    name: "q7",
    labels: likert_scale,
    required: true,
  }, // [cite: 24]
  {
    prompt: "8. 這個客服的頭貼會讓我分心，影響我閱讀對話框中的文字。",
    name: "q8",
    labels: likert_scale,
    required: true,
  }, // [cite: 25]
  {
    prompt: "9. 我認為這個頭貼符合我對該品牌的期待。",
    name: "q9",
    labels: likert_scale,
    required: true,
  }, // [cite: 27]
  {
    prompt: "10. 我認為這個頭貼的視覺設計，能準確傳達出該品牌的特色與定位。",
    name: "q10",
    labels: likert_scale,
    required: true,
  }, // [cite: 28]
  ...questions_no_avatar.slice(5), // 11-12題
];

// 隨機抽樣邏輯：從三個有頭貼組別中抽一張
const avatar_groups = [pool_mascot, pool_virtual, pool_human];
const random_group_idx = Math.floor(Math.random() * 3);
const stage3_avatar =
  avatar_groups[random_group_idx][Math.floor(Math.random() * 3)];

let stage3_chat = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `<h3>第三階段</h3><p>系統進行了更新，請閱讀以下帶有客服頭貼的對話紀錄：</p>
               <div style="position:relative; display:inline-block;">
                   <img src="${chat_with_avatar}" class="chat-img">
                   <img src="${stage3_avatar}" style="position:absolute; top:50px; left:20px; width:60px; height:60px; border-radius:50%;">
               </div><br>`,
  choices: ["我已閱讀完畢，進入填答"],
};
timeline.push(stage3_chat);

let stage3_survey = {
  type: jsPsychSurveyLikert,
  preamble: "請根據剛才帶有「客服頭貼」的對話體驗，回答以下問題：",
  questions: questions_full,
};
timeline.push(stage3_survey);

// ==========================================
// 4. 階段四：必要性提問與動態排序
// ==========================================
let stage4_necessity = {
  type: jsPsychSurveyHtmlForm,
  preamble: "<h3>第四階段</h3>",
  html: `
        <p>我認為客服系統的頭貼有存在的必要：</p>
        <p><input type="radio" name="necessity" value="yes" required> 是 <input type="radio" name="necessity" value="no"> 否</p>
        <p>原因（非必填）：<br><textarea name="reason" rows="3" cols="50"></textarea></p>
    `, // [cite: 42, 43]
};
timeline.push(stage4_necessity);

// 核心演算法：抽取 4 張頭貼，同組不超過 2 張 [cite: 48]
let all_avatars = [];
pool_mascot.forEach((img) => all_avatars.push({ path: img, group: "mascot" }));
pool_virtual.forEach((img) =>
  all_avatars.push({ path: img, group: "virtual" }),
);
pool_human.forEach((img) => all_avatars.push({ path: img, group: "human" }));

let selected_4_avatars = [];
let valid_combo = false;

while (!valid_combo) {
  let shuffled = jsPsych.randomization.shuffle(all_avatars);
  let sample = shuffled.slice(0, 4); // 抽 4 張

  let counts = { mascot: 0, virtual: 0, human: 0 };
  sample.forEach((item) => {
    counts[item.group]++;
  });

  // 條件：同一組別的頭貼不抽超過 2 張 [cite: 48]
  if (counts.mascot <= 2 && counts.virtual <= 2 && counts.human <= 2) {
    selected_4_avatars = sample.map((item) => item.path);
    valid_combo = true;
  }
}

// 加入品牌 LOGO 湊齊 5 張並打亂順序 [cite: 46, 47]
let final_5_avatars = [img_logo, ...selected_4_avatars];
final_5_avatars = jsPsych.randomization.shuffle(final_5_avatars);

// 將圖片轉為 HTML 標籤供拖曳套件使用
let rank_choices = final_5_avatars.map(
  (img) => `<img src="${img}" class="rank-img">`,
);

let stage4_rank1 = {
  type: jsPsychHtmlRankOrder,
  stimulus: `
        <p>無論您前一題的答案為何，若未來系統全面導入頭貼，請對以下選項進行偏好排序：</p>
        <p style="color:#A020F0; font-weight:bold;">【排序一：品牌契合度】</p>
        <p>請根據 Aethoria Infinite 作為一家「娛樂科技大廠」的品牌背景，將以下五個客服頭貼，依據「最符合該品牌形象」到「最不符合」進行名次排序。</p>
    `, // [cite: 44, 50]
  choices: rank_choices,
  labels: ["1 (最符合)", "2", "3", "4", "5 (最不符合)"], // [cite: 50]
};
timeline.push(stage4_rank1);

let stage4_rank2 = {
  type: jsPsychHtmlRankOrder,
  stimulus: `
        <p style="color:#00FFFF; font-weight:bold; background-color:#333; display:inline-block; padding:5px;">【排序二：安心與信任感】</p>
        <p>請想像您目前在該系統遇到了「帳號儲值失敗」或「演唱會票務異常」的緊急問題需要協助。請將以下五個客服頭貼，依據「最能讓您感到安心、且最願意向其諮詢」的程度進行名次排序。</p>
    `, // [cite: 51]
  choices: rank_choices,
  labels: ["1 (最安心)", "2", "3", "4", "5 (最不安心)"], // [cite: 51]
};
timeline.push(stage4_rank2);

// ==========================================
// 5. 結束畫面
// ==========================================
let end_screen = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    "<p>問卷已結束，非常感謝您的參與！您的回覆對本研究有極大的幫助。資料已安全送出，現在可以關閉分頁。</p>",
  choices: "NO_KEYS",
};
timeline.push(end_screen);

jsPsych.run(timeline);
