/**
 * 内置表情词库。随插件打包，不联网、不依赖系统表情面板。
 *
 * k = 检索关键词，全部小写。同时给英文词和拼音，这样「xiao」「smile」「haha」
 * 都能找到 😄。顺序即默认排序：常用的排前面，空查询时先显示它们。
 */
export interface EmojiEntry {
  e: string;
  k: string[];
}

export const EMOJI: EmojiEntry[] = [
  // —— 笑与开心 ——
  { e: "😀", k: ["grin", "smile", "xiao", "kaixin", "haha"] },
  { e: "😄", k: ["smile", "happy", "xiao", "kaixin", "gaoxing"] },
  { e: "😁", k: ["beam", "grin", "xiao", "leya", "kaixin"] },
  { e: "😆", k: ["laugh", "xiao", "daxiao", "haha"] },
  { e: "😅", k: ["sweat", "laugh", "hanxiao", "wunai", "ganga"] },
  { e: "🤣", k: ["rofl", "lol", "xiao", "penxiao", "xiaocry"] },
  { e: "😂", k: ["joy", "tears", "xiaoku", "xiao", "ku"] },
  { e: "🙂", k: ["slight", "smile", "weixiao", "xiao"] },
  { e: "🙃", k: ["upside", "flip", "wunai", "daozhe"] },
  { e: "😉", k: ["wink", "zhayan", "meiyan"] },
  { e: "😊", k: ["blush", "smile", "weixiao", "haixiu", "kaixin"] },
  { e: "😇", k: ["angel", "halo", "tianshi", "wugu"] },
  { e: "🥲", k: ["tear", "smile", "hanlei", "qiangxiao"] },
  { e: "🥹", k: ["holding", "tears", "gandong", "renzhu"] },

  // —— 爱与喜欢 ——
  { e: "🥰", k: ["love", "hearts", "xihuan", "ai", "taoxin"] },
  { e: "😍", k: ["heart", "eyes", "ai", "xihuan", "aixin"] },
  { e: "🤩", k: ["star", "struck", "xingxingyan", "chongbai", "wow"] },
  { e: "😘", k: ["kiss", "blow", "feiwen", "qin", "wen"] },
  { e: "😗", k: ["kiss", "qin", "wen"] },
  { e: "😚", k: ["kiss", "qin", "wen", "haixiu"] },

  // —— 俏皮 ——
  { e: "😋", k: ["yum", "tasty", "haochi", "chan", "tian"] },
  { e: "😛", k: ["tongue", "tushe", "guilian"] },
  { e: "😜", k: ["wink", "tongue", "tushe", "tiaopi", "guilian"] },
  { e: "🤪", k: ["zany", "crazy", "fengle", "guilian", "shagua"] },
  { e: "😝", k: ["tongue", "squint", "tushe", "tiaopi"] },
  { e: "🤑", k: ["money", "qian", "caimi", "faca"] },
  { e: "🤗", k: ["hug", "yongbao", "baobao"] },

  // —— 沉默与思考 ——
  { e: "🤭", k: ["oops", "giggle", "wuzui", "touxiao"] },
  { e: "🤫", k: ["shush", "quiet", "anjing", "xu", "bieshuo"] },
  { e: "🤔", k: ["think", "hmm", "sikao", "xiang", "yiwen"] },
  { e: "🤨", k: ["raised", "brow", "huaiyi", "tiaomei"] },
  { e: "😐", k: ["neutral", "mianwubiaoqing", "wuyu"] },
  { e: "😑", k: ["expressionless", "wuyu", "mianwubiaoqing"] },
  { e: "😶", k: ["silent", "nomouth", "wuyan", "bushuohua"] },
  { e: "😏", k: ["smirk", "dexiao", "jianxiao", "huaixiao"] },
  { e: "😒", k: ["unamused", "wuyu", "buman", "baiyan"] },
  { e: "🙄", k: ["roll", "eyes", "baiyan", "wunai"] },
  { e: "😬", k: ["grimace", "ganga", "yingxiao"] },
  { e: "🤥", k: ["lie", "pinocchio", "shuohuang", "chesuang"] },

  // —— 累与困 ——
  { e: "😌", k: ["relieved", "shifu", "anxin", "manzu"] },
  { e: "😔", k: ["pensive", "shiluo", "nanguo", "youshang"] },
  { e: "😪", k: ["sleepy", "kun", "xiang shui"] },
  { e: "😴", k: ["sleep", "zzz", "shuijiao", "kun"] },
  { e: "🥱", k: ["yawn", "dahaqian", "kun", "wuliao"] },

  // —— 不适与震惊 ——
  { e: "😷", k: ["mask", "kouzhao", "shengbing", "gaomao"] },
  { e: "🤒", k: ["fever", "fashao", "shengbing", "bing"] },
  { e: "🤕", k: ["bandage", "shoushang", "baozha"] },
  { e: "🤢", k: ["nausea", "exin", "xiang tu"] },
  { e: "🤮", k: ["vomit", "outu", "tu", "exin"] },
  { e: "🤧", k: ["sneeze", "penti", "ganmao"] },
  { e: "🥵", k: ["hot", "re", "zhongshu"] },
  { e: "🥶", k: ["cold", "leng", "dongjiang"] },
  { e: "🥴", k: ["woozy", "yun", "he zui", "hutu"] },
  { e: "😵", k: ["dizzy", "yun", "kunhuo"] },
  { e: "🤯", k: ["mind", "blown", "zhenjing", "baozha", "wow"] },

  // —— 酷与伪装 ——
  { e: "🥳", k: ["party", "celebrate", "qingzhu", "kuaile", "shengri"] },
  { e: "😎", k: ["cool", "sunglasses", "ku", "moji"] },
  { e: "🤓", k: ["nerd", "shudai", "xueba", "yanjing"] },
  { e: "🧐", k: ["monocle", "shencha", "yanjiu", "kan"] },
  { e: "🤠", k: ["cowboy", "niuzai", "maoxian"] },

  // —— 难过 ——
  { e: "😕", k: ["confused", "kunhuo", "nanguo"] },
  { e: "🙁", k: ["frown", "buxingfu", "nanguo"] },
  { e: "😮", k: ["open", "mouth", "zhangzui", "jingya", "wow"] },
  { e: "😯", k: ["hushed", "jingya", "e"] },
  { e: "😲", k: ["astonished", "zhenjing", "jingya", "wow"] },
  { e: "😳", k: ["flushed", "haixiu", "lianhong", "ganga"] },
  { e: "🥺", k: ["pleading", "kelian", "qiuqiu", "wuqu"] },
  { e: "😨", k: ["fearful", "haipa", "kongju"] },
  { e: "😰", k: ["anxious", "jiaolv", "jinzhang", "haipa"] },
  { e: "😥", k: ["sad", "relieved", "nanguo", "shiluo"] },
  { e: "😢", k: ["cry", "ku", "liulei", "nanguo", "shangxin"] },
  { e: "😭", k: ["sob", "loud", "cry", "daku", "ku", "shangxin"] },
  { e: "😱", k: ["scream", "jianjiao", "kongju", "haipa"] },
  { e: "😞", k: ["disappointed", "shiwang", "nanguo"] },
  { e: "😓", k: ["downcast", "sweat", "hanyan", "leile"] },
  { e: "😩", k: ["weary", "leile", "beng kui"] },
  { e: "😫", k: ["tired", "leile", "shoubuliao"] },

  // —— 生气 ——
  { e: "😤", k: ["triumph", "buman", "shengqi", "aoman"] },
  { e: "😠", k: ["angry", "shengqi", "nu"] },
  { e: "😡", k: ["rage", "shengqi", "baonu", "nu"] },
  { e: "🤬", k: ["cursing", "maren", "baocu", "shengqi"] },

  // —— 其他脸 ——
  { e: "💀", k: ["skull", "kulou", "si", "wanle"] },
  { e: "💩", k: ["poop", "bianbian", "shi", "lajji"] },
  { e: "🤡", k: ["clown", "xiaochou", "shazi"] },
  { e: "👻", k: ["ghost", "gui", "wanjie", "haipa"] },
  { e: "👽", k: ["alien", "waixingren", "ufo"] },
  { e: "🤖", k: ["robot", "jiqiren", "ai", "bot"] },
  { e: "😈", k: ["devil", "huai", "emo", "huaixiao"] },
  { e: "🎃", k: ["pumpkin", "halloween", "nangua", "wanshengjie"] },

  // —— 手势 ——
  { e: "👍", k: ["thumbsup", "good", "zan", "dianzan", "bang", "hao"] },
  { e: "👎", k: ["thumbsdown", "cha", "bu hao", "diffren"] },
  { e: "👌", k: ["ok", "keyi", "meiwenti", "hao"] },
  { e: "✌️", k: ["victory", "peace", "ye", "shengli"] },
  { e: "🤞", k: ["crossed", "fingers", "qiqiu", "haoyun", "zhufu"] },
  { e: "🤝", k: ["handshake", "woshou", "hezuo", "chengjiao"] },
  { e: "🙏", k: ["pray", "thanks", "baituo", "qiqiu", "ganxie", "xiexie"] },
  { e: "👏", k: ["clap", "gu zhang", "pengchang", "bang"] },
  { e: "🙌", k: ["raise", "hands", "wansui", "qingzhu", "taibang"] },
  { e: "👋", k: ["wave", "hi", "bye", "zhaoshou", "nihao", "zaijian"] },
  { e: "🤙", k: ["callme", "liulian", "dadianhua"] },
  { e: "💪", k: ["muscle", "strong", "jiayou", "liliang", "qiang"] },
  { e: "🫡", k: ["salute", "jingli", "shoudao", "zunming"] },
  { e: "🫶", k: ["heart", "hands", "bixin", "ai", "xihuan"] },
  { e: "👉", k: ["right", "point", "zhi", "youbian"] },
  { e: "👈", k: ["left", "point", "zhi", "zuobian"] },
  { e: "☝️", k: ["up", "point", "zhi", "diyi"] },
  { e: "👇", k: ["down", "point", "zhi", "xiamian"] },
  { e: "✊", k: ["fist", "quantou", "jiayou"] },
  { e: "👊", k: ["punch", "quantou", "peng"] },
  { e: "🤛", k: ["fist", "left", "quantou"] },
  { e: "🖐", k: ["hand", "shou", "wu"] },
  { e: "🤚", k: ["raised", "hand", "shou", "ting"] },

  // —— 人 ——
  { e: "🙋", k: ["raise", "hand", "juhhou", "wo", "tiwen"] },
  { e: "🙆", k: ["ok", "gesture", "keyi", "tongguo"] },
  { e: "🙅", k: ["no", "buxing", "jujue", "cha"] },
  { e: "🤷", k: ["shrug", "wunai", "bu zhidao", "suibian"] },
  { e: "🤦", k: ["facepalm", "wunai", "fuemian", "wuyu"] },
  { e: "🙇", k: ["bow", "jugong", "daoqian", "baituo"] },
  { e: "💁", k: ["info", "jieshao", "fuwu"] },
  { e: "🧑‍💻", k: ["coder", "dev", "chengxuyuan", "xie daima", "gongzuo"] },
  { e: "👶", k: ["baby", "baobao", "yinger"] },
  { e: "🧓", k: ["old", "laoren", "changbei"] },

  // —— 心与情绪符号 ——
  { e: "❤️", k: ["heart", "red", "ai", "aixin", "xihuan", "xin"] },
  { e: "🧡", k: ["orange", "heart", "chengxin", "aixin", "xin"] },
  { e: "💛", k: ["yellow", "heart", "huangxin", "aixin", "xin"] },
  { e: "💚", k: ["green", "heart", "lvxin", "aixin", "xin"] },
  { e: "💙", k: ["blue", "heart", "lanxin", "aixin", "xin"] },
  { e: "💜", k: ["purple", "heart", "zixin", "aixin", "xin"] },
  { e: "🖤", k: ["black", "heart", "heixin", "xin"] },
  { e: "🤍", k: ["white", "heart", "baixin", "xin"] },
  { e: "💔", k: ["broken", "heart", "shixin", "xinsui", "shanxin"] },
  { e: "💕", k: ["two", "hearts", "ai", "xin", "lianai"] },
  { e: "💖", k: ["sparkling", "heart", "shanshan", "ai", "xin"] },
  { e: "💯", k: ["hundred", "perfect", "manfen", "yibai", "zan"] },
  { e: "💢", k: ["anger", "shengqi", "nu"] },
  { e: "💥", k: ["boom", "baozha", "peng"] },
  { e: "✨", k: ["sparkles", "shanguang", "xingxing", "piaoliang", "xin"] },
  { e: "💫", k: ["dizzy", "xuanyun", "xingxing"] },
  { e: "💦", k: ["sweat", "han", "shui"] },
  { e: "💤", k: ["zzz", "shuijiao", "kun"] },
  { e: "💬", k: ["speech", "duihua", "liaotian", "shuohua"] },
  { e: "💭", k: ["thought", "xiang", "sikao", "paopao"] },

  // —— 动物 ——
  { e: "🐶", k: ["dog", "gou", "goudog", "xiaogou"] },
  { e: "🐱", k: ["cat", "mao", "xiaomao", "miao"] },
  { e: "🐭", k: ["mouse", "laoshu", "shu"] },
  { e: "🐰", k: ["rabbit", "tuzi", "tu"] },
  { e: "🦊", k: ["fox", "huli"] },
  { e: "🐻", k: ["bear", "xiong"] },
  { e: "🐼", k: ["panda", "xiongmao"] },
  { e: "🐨", k: ["koala", "kaola"] },
  { e: "🐯", k: ["tiger", "laohu", "hu"] },
  { e: "🦁", k: ["lion", "shizi"] },
  { e: "🐷", k: ["pig", "zhu", "xiaozhu"] },
  { e: "🐸", k: ["frog", "qingwa", "wa"] },
  { e: "🐵", k: ["monkey", "houzi", "hou"] },
  { e: "🐔", k: ["chicken", "ji"] },
  { e: "🐧", k: ["penguin", "qie"] },
  { e: "🐦", k: ["bird", "niao"] },
  { e: "🦅", k: ["eagle", "ying"] },
  { e: "🐝", k: ["bee", "mifeng", "feng"] },
  { e: "🦋", k: ["butterfly", "hudie"] },
  { e: "🐌", k: ["snail", "woniu", "man"] },
  { e: "🐢", k: ["turtle", "wugui", "gui", "man"] },
  { e: "🐍", k: ["snake", "she", "python"] },
  { e: "🐙", k: ["octopus", "zhangyu"] },
  { e: "🐳", k: ["whale", "jingyu", "jing"] },
  { e: "🐬", k: ["dolphin", "haitun"] },
  { e: "🐟", k: ["fish", "yu"] },
  { e: "🦄", k: ["unicorn", "dujiaoshou"] },
  { e: "🐴", k: ["horse", "ma"] },
  { e: "🐮", k: ["cow", "niu"] },
  { e: "🐑", k: ["sheep", "yang"] },
  { e: "🐘", k: ["elephant", "daxiang", "xiang"] },

  // —— 自然与天气 ——
  { e: "🌸", k: ["blossom", "yinghua", "hua", "chuntian"] },
  { e: "🌹", k: ["rose", "meigui", "hua"] },
  { e: "🌻", k: ["sunflower", "xiangrikui", "hua"] },
  { e: "🌷", k: ["tulip", "yujinxiang", "hua"] },
  { e: "🌱", k: ["seedling", "faya", "miao", "chengzhang"] },
  { e: "🌲", k: ["tree", "shu", "song"] },
  { e: "🍀", k: ["clover", "siyecao", "haoyun"] },
  { e: "🍁", k: ["maple", "fengye", "qiutian"] },
  { e: "🌊", k: ["wave", "lang", "hai", "shui"] },
  { e: "🔥", k: ["fire", "hot", "huo", "re", "huobao", "rimen", "bang"] },
  { e: "⭐", k: ["star", "xing", "xingxing", "shoucang"] },
  { e: "🌟", k: ["glow", "star", "xingxing", "shanguang"] },
  { e: "🌈", k: ["rainbow", "caihong"] },
  { e: "☀️", k: ["sun", "taiyang", "qingtian"] },
  { e: "🌙", k: ["moon", "yueliang", "wanan", "ye"] },
  { e: "☁️", k: ["cloud", "yun", "yintian"] },
  { e: "🌧", k: ["rain", "yu", "xiayu"] },
  { e: "❄️", k: ["snow", "xue", "xuehua", "leng", "dongtian"] },
  { e: "⚡", k: ["lightning", "shandian", "dian", "kuai"] },

  // —— 食物与饮品 ——
  { e: "🍎", k: ["apple", "pingguo"] },
  { e: "🍌", k: ["banana", "xiangjiao"] },
  { e: "🍓", k: ["strawberry", "caomei"] },
  { e: "🍉", k: ["watermelon", "xigua", "chigua"] },
  { e: "🍇", k: ["grapes", "putao"] },
  { e: "🍊", k: ["orange", "juzi", "cheng"] },
  { e: "🥑", k: ["avocado", "niuyouguo"] },
  { e: "🍞", k: ["bread", "mianbao"] },
  { e: "🍔", k: ["burger", "hanbao"] },
  { e: "🍟", k: ["fries", "shutiao"] },
  { e: "🍕", k: ["pizza", "bisa"] },
  { e: "🌮", k: ["taco", "juanbing"] },
  { e: "🍜", k: ["noodles", "mian", "lamian", "chi"] },
  { e: "🍚", k: ["rice", "mifan", "fan", "chi"] },
  { e: "🍣", k: ["sushi", "shousi"] },
  { e: "🥟", k: ["dumpling", "jiaozi"] },
  { e: "🍰", k: ["cake", "dangao", "tiandian"] },
  { e: "🎂", k: ["birthday", "cake", "shengri", "dangao"] },
  { e: "🍫", k: ["chocolate", "qiaokeli"] },
  { e: "🍦", k: ["icecream", "bingqilin"] },
  { e: "☕", k: ["coffee", "kafei", "tixing"] },
  { e: "🍵", k: ["tea", "cha", "lvcha"] },
  { e: "🍺", k: ["beer", "pijiu", "he"] },
  { e: "🍷", k: ["wine", "hongjiu", "jiu"] },
  { e: "🥂", k: ["cheers", "ganbei", "qingzhu"] },
  { e: "🧋", k: ["boba", "naicha", "zhenzhu"] },

  // —— 工作与物件 ——
  { e: "💻", k: ["laptop", "diannao", "gongzuo", "bijiben"] },
  { e: "📱", k: ["phone", "shouji"] },
  { e: "⌨️", k: ["keyboard", "jianpan", "daza"] },
  { e: "🖥", k: ["monitor", "xianshiqi", "diannao"] },
  { e: "📷", k: ["camera", "xiangji", "paizhao"] },
  { e: "🎧", k: ["headphone", "erji", "yinyue"] },
  { e: "🎵", k: ["music", "yinyue", "ge"] },
  { e: "📚", k: ["books", "shu", "dushu", "xuexi"] },
  { e: "📖", k: ["book", "shu", "yuedu", "dushu"] },
  { e: "📝", k: ["memo", "biji", "xie", "jilu"] },
  { e: "✏️", k: ["pencil", "qianbi", "xie"] },
  { e: "📌", k: ["pin", "tuding", "zhiding", "biaoji"] },
  { e: "📎", k: ["clip", "huiwenzhen", "fujian"] },
  { e: "🔗", k: ["link", "lianjie", "url"] },
  { e: "🔍", k: ["search", "sousuo", "cha", "fangdajing"] },
  { e: "🔒", k: ["lock", "suo", "anquan", "jiami"] },
  { e: "🔑", k: ["key", "yaoshi", "miyao"] },
  { e: "💡", k: ["idea", "bulb", "dianzi", "lingqan", "xiangfa"] },
  { e: "🔔", k: ["bell", "tixing", "lingdang", "tongzhi"] },
  { e: "📣", k: ["announce", "xuanbu", "laba", "tongzhi"] },
  { e: "📅", k: ["calendar", "rili", "riqi", "anpai"] },
  { e: "⏰", k: ["alarm", "naozhong", "shijian", "tixing"] },
  { e: "⏳", k: ["hourglass", "shalou", "dengdai", "shijian"] },
  { e: "💰", k: ["money", "qian", "jinqian", "shouru"] },
  { e: "💳", k: ["card", "yinhangka", "zhifu", "xiaofei"] },
  { e: "🎁", k: ["gift", "liwu", "jingxi"] },
  { e: "🏆", k: ["trophy", "jiangbei", "diyi", "shengli"] },
  { e: "🎯", k: ["target", "mubiao", "bazi", "jingzhun"] },
  { e: "🚀", k: ["rocket", "huojian", "fashe", "shangxian", "kuai"] },
  { e: "🛠", k: ["tools", "gongju", "xiufu", "weihu"] },
  { e: "🧪", k: ["test", "shiyan", "shiguan", "ceshi"] },
  { e: "🐛", k: ["bug", "chongzi", "quexian", "wenti"] },
  { e: "⚙️", k: ["gear", "chilun", "shezhi", "peizhi"] },
  { e: "📦", k: ["package", "baoguo", "fabu", "xiangzi"] },
  { e: "🗑", k: ["trash", "lajitong", "shanchu"] },

  // —— 符号 ——
  { e: "✅", k: ["check", "yes", "wancheng", "duigou", "tongguo", "hao"] },
  { e: "❌", k: ["cross", "no", "cuowu", "cha", "shibai"] },
  { e: "⚠️", k: ["warning", "jinggao", "zhuyi", "weixian"] },
  { e: "❓", k: ["question", "wenhao", "yiwen"] },
  { e: "❗", k: ["exclaim", "gantanhao", "zhuyi"] },
  { e: "🚫", k: ["forbidden", "jinzhi", "buxing"] },
  { e: "➡️", k: ["right", "arrow", "jiantou", "you"] },
  { e: "⬅️", k: ["left", "arrow", "jiantou", "zuo"] },
  { e: "⬆️", k: ["up", "arrow", "jiantou", "shang"] },
  { e: "⬇️", k: ["down", "arrow", "jiantou", "xia"] },
  { e: "🔄", k: ["refresh", "shuaxin", "xunhuan", "tongbu"] },
  { e: "➕", k: ["plus", "jia", "xinzeng"] },
  { e: "➖", k: ["minus", "jian", "shanchu"] },
  { e: "🆕", k: ["new", "xin", "zuixin"] },
  { e: "©️", k: ["copyright", "banquan"] },
  { e: "™️", k: ["trademark", "shangbiao"] }
];

/**
 * 按关键词检索。前缀命中排在包含命中之前；同档内保持词库原始顺序，
 * 所以常用表情总是先出现。空查询返回最前面的若干个。
 */
export function searchEmoji(query: string, limit: number): EmojiEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return EMOJI.slice(0, limit);

  const prefix: EmojiEntry[] = [];
  const contains: EmojiEntry[] = [];

  for (const entry of EMOJI) {
    if (entry.k.some((word) => word.startsWith(q))) prefix.push(entry);
    else if (entry.k.some((word) => word.includes(q))) contains.push(entry);
    if (prefix.length >= limit) break;
  }

  return [...prefix, ...contains].slice(0, limit);
}
