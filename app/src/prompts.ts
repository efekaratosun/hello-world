import type { Category, Prompt, TimeOfDay } from './types';

type Raw = [text: string, category: Category, timeOfDay: TimeOfDay, depth: 1 | 2 | 3];

const RAW: Raw[] = [
  // Gün özeti
  ['Bugünü üç kelimeyle anlatsan hangileri olurdu?', 'ozet', 'aksam', 1],
  ['Bugün olan en sıradan şey neydi? Onu biraz anlat.', 'ozet', 'aksam', 1],
  ['Bugün bir film olsaydı, adı ne olurdu?', 'ozet', 'aksam', 1],
  ['Bugün planladığın gibi gitmeyen bir şey oldu mu?', 'ozet', 'aksam', 2],
  ['Bugünün en uzun beş dakikası hangisiydi?', 'ozet', 'aksam', 1],
  ['Bugün nerelerdeydin? Gün içindeki yolculuğunu anlat.', 'ozet', 'aksam', 1],
  ['Bugün ilk kez yaptığın bir şey var mı, ne kadar küçük olursa olsun?', 'ozet', 'aksam', 1],
  ['Bugünü yeniden yaşayabilsen neyi farklı yapardın?', 'ozet', 'aksam', 2],
  ['Bugün öğrendiğin bir şey ne oldu?', 'ozet', 'herhangi', 1],
  ['Şu an tam olarak neredesin ve etrafında ne var?', 'ozet', 'herhangi', 1],

  // Duygular
  ['Bugün seni en çok ne yordu?', 'duygu', 'aksam', 2],
  ['Şu an nasıl hissediyorsun? Bu hissin bir rengi olsa ne olurdu?', 'duygu', 'herhangi', 1],
  ['Bugün seni gülümseten bir an oldu mu?', 'duygu', 'aksam', 1],
  ['Bugün canını sıkan bir şeyi buraya bırakmak ister misin?', 'duygu', 'aksam', 2],
  ['Bugün kendini en rahat hissettiğin an hangisiydi?', 'duygu', 'aksam', 1],
  ['Son zamanlarda seni endişelendiren bir şey var mı?', 'duygu', 'herhangi', 3],
  ['Bugün kendinle gurur duyduğun bir an oldu mu?', 'duygu', 'aksam', 2],
  ['Bugün enerjin en yüksek ne zamandı, en düşük ne zaman?', 'duygu', 'aksam', 1],
  ['Bir süredir söylemek isteyip de söyleyemediğin bir şey var mı?', 'duygu', 'herhangi', 3],
  ['Bugün sabrını zorlayan bir şey oldu mu?', 'duygu', 'aksam', 2],

  // Şükran
  ['Bugün küçük de olsa iyi giden bir şey neydi?', 'sukran', 'aksam', 1],
  ['Bugün hayatını biraz kolaylaştıran bir şey ya da biri oldu mu?', 'sukran', 'aksam', 1],
  ['Sahip olduğun ve çoğu zaman fark etmediğin bir şey ne?', 'sukran', 'herhangi', 2],
  ['Bugün yediğin en güzel şey neydi?', 'sukran', 'aksam', 1],
  ['Hayatında olduğu için şanslı hissettiğin bir kişi kim?', 'sukran', 'herhangi', 2],
  ['Bu hafta seni mutlu eden üç küçük şey say.', 'sukran', 'herhangi', 1],
  ['Bugün kendine iyi davrandığın bir an oldu mu?', 'sukran', 'aksam', 2],

  // İnsanlar
  ['Bugün konuştuğun biri seni nasıl hissettirdi?', 'insanlar', 'aksam', 2],
  ['Bugün kimi özledin?', 'insanlar', 'herhangi', 2],
  ['Bugün birine yardım ettin mi ya da biri sana yardım etti mi?', 'insanlar', 'aksam', 1],
  ['Son zamanlarda haber almadığın ama aklına gelen biri var mı?', 'insanlar', 'herhangi', 2],
  ['Bugün duyduğun en ilginç cümle neydi? Kim söyledi?', 'insanlar', 'aksam', 1],
  ['Hayatındaki biri hakkında yeni fark ettiğin bir şey var mı?', 'insanlar', 'herhangi', 2],
  ['Birine teşekkür etmek isteseydin, bu kim olurdu ve neden?', 'insanlar', 'herhangi', 2],
  ['Bugün kimle en çok güldün?', 'insanlar', 'aksam', 1],

  // Duyular
  ['Bugün duyduğun bir ses ya da tattığın bir tat?', 'duyular', 'aksam', 1],
  ['Şu an pencereden dışarı baksan ne görürsün?', 'duyular', 'herhangi', 1],
  ['Bugün dinlediğin bir şarkı var mı? Sana ne hissettirdi?', 'duyular', 'aksam', 1],
  ['Bugün havayı nasıl buldun? Tenine nasıl geldi?', 'duyular', 'herhangi', 1],
  ['Bugün dikkatini çeken bir koku oldu mu?', 'duyular', 'aksam', 1],
  ['Bugün gördüğün güzel bir şeyi tarif et.', 'duyular', 'aksam', 1],
  ['Şu an bedeninde nasıl hissediyorsun? Yorgun, dinç, gergin?', 'duyular', 'herhangi', 1],

  // Gelecek
  ['Bugünden ne bekliyorsun?', 'gelecek', 'sabah', 1],
  ['Bugün mutlaka yapmak istediğin tek şey ne?', 'gelecek', 'sabah', 1],
  ['Yarın kendine küçük bir söz versen ne olurdu?', 'gelecek', 'aksam', 1],
  ['Bu hafta dört gözle beklediğin bir şey var mı?', 'gelecek', 'herhangi', 1],
  ['Bugün nasıl biri olmak istiyorsun?', 'gelecek', 'sabah', 2],
  ['Bir yıl sonra bu sayfayı okuyan sana ne söylemek istersin?', 'gelecek', 'herhangi', 2],
  ['Ertelediğin bir şey var mı? Neden?', 'gelecek', 'herhangi', 2],
  ['Bugün kendine ayıracağın küçük bir zaman olacak mı?', 'gelecek', 'sabah', 1],
  ['Bu sabah uyandığında aklındaki ilk şey neydi?', 'gelecek', 'sabah', 1],
  ['Dün geceki uykun nasıldı? Rüya gördün mü?', 'gelecek', 'sabah', 1],

  // Geçmiş
  ['Çocukken bu mevsimde ne yapmayı severdin?', 'gecmis', 'herhangi', 1],
  ['Bir yıl önce bugünlerde neyle uğraşıyordun?', 'gecmis', 'herhangi', 2],
  ['Bugün aklına gelen eski bir anı var mı?', 'gecmis', 'herhangi', 1],
  ['Geçmişteki kendine bir tavsiye verebilsen ne olurdu?', 'gecmis', 'herhangi', 3],
  ['Hayatında bir dönüm noktası olarak gördüğün bir an?', 'gecmis', 'herhangi', 3],
  ['En son ne zaman gerçekten çok güldün?', 'gecmis', 'herhangi', 1],

  // Derin
  ['Son zamanlarda fikrini değiştirdiğin bir konu var mı?', 'derin', 'herhangi', 3],
  ['Seni sen yapan şeylerden biri ne?', 'derin', 'herhangi', 3],
  ['Şu sıralar hayatında neyin daha fazla olmasını isterdin?', 'derin', 'herhangi', 2],
  ['Şu sıralar hayatında neyin daha az olmasını isterdin?', 'derin', 'herhangi', 2],
  ['Seni gerçekten dinlendiren şey ne?', 'derin', 'herhangi', 2],
  ['Kendinde değiştirmek istediğin küçük bir alışkanlık var mı?', 'derin', 'herhangi', 2],
  ['Bugün verdiğin bir kararı anlat. Nasıl karar verdin?', 'derin', 'aksam', 2],
  ['Şu an hayatında cevabını aradığın bir soru var mı?', 'derin', 'herhangi', 3],
];

export const PROMPTS: Prompt[] = RAW.map(([text, category, timeOfDay, depth], i) => ({
  id: `p${String(i + 1).padStart(3, '0')}`,
  text,
  category,
  timeOfDay,
  depth,
}));

export const FOLLOW_UPS = [
  'Biraz daha anlatır mısın?',
  'Bu sana neden önemli geldi?',
  'O an aklından neler geçti?',
  'Bunu düşündüğünde şimdi ne hissediyorsun?',
];

export function currentTimeOfDay(date = new Date()): Exclude<TimeOfDay, 'herhangi'> {
  const h = date.getHours();
  return h >= 4 && h < 12 ? 'sabah' : 'aksam';
}

/**
 * Bağlama uygun bir soru seçer:
 * - günün saatine uyan sorular (ya da "herhangi")
 * - yakın zamanda sorulmuş olanlardan kaçınır
 * - uzun aradan sonra hafif (depth 1) sorularla başlar
 */
export function pickPrompt(opts: {
  recentIds: string[];
  daysSinceLastEntry: number | null;
  excludeId?: string;
  date?: Date;
}): Prompt {
  const tod = currentTimeOfDay(opts.date);
  const recent = new Set(opts.recentIds);
  const easyOnly = opts.daysSinceLastEntry === null || opts.daysSinceLastEntry >= 3;

  const filters: ((p: Prompt) => boolean)[] = [
    (p) => (p.timeOfDay === tod || p.timeOfDay === 'herhangi') && !recent.has(p.id) && (!easyOnly || p.depth === 1),
    (p) => (p.timeOfDay === tod || p.timeOfDay === 'herhangi') && !recent.has(p.id),
    (p) => p.timeOfDay === tod || p.timeOfDay === 'herhangi',
    () => true,
  ];

  for (const f of filters) {
    const pool = PROMPTS.filter((p) => f(p) && p.id !== opts.excludeId);
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
  }
  return PROMPTS[0];
}
