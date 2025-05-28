module.exports = {
  url: "https://fiammanda.ddns.net",
  lang: "zh",
  title: "紧急飞毯",
  description: "一个基于 notion 的日常记录",
  author: "fiammanda",
  type: {
    "过了": "life",
    "尝了": "food",
    "去了": "event",
    "扫了": "novel",
    "读了": "book",
    "看了": "show",
    "玩了": "game",
  },
  rate: {
    "追读": `<span class="journal-rate" data-icon="star-fill">追读</span>`,
    "还想": `<span class="journal-rate" data-icon="star-fill">还想</span>`,
    "凑合": `<span class="journal-rate" data-icon="star_half">凑合</span>`,
    "放弃": `<span class="journal-rate" data-icon="star">放弃</span>`,
  },
  revalidate: 600
};

/*
rm -rf .git
git init
git remote add origin https://github.com/fiammanda/notion.git
git add .
git commit -m "initial commit"
git push -f origin main
*/
