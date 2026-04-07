export interface TestItem {
  slug: string;
  file: string;
  name: { ua: string; en: string };
  category: string;
}

export interface Category {
  key: string;
  name: { ua: string; en: string };
}

export const categories: Category[] = [
  { key: "all", name: { ua: "Всі", en: "All" } },
  { key: "children", name: { ua: "Діти", en: "Children" } },
  { key: "young_riders", name: { ua: "Юнаки", en: "Young Riders" } },
  { key: "juniors", name: { ua: "Юніори", en: "Juniors" } },
  { key: "u25", name: { ua: "U25", en: "U25" } },
  { key: "small_medium", name: { ua: "Малий / Середній", en: "Small / Medium" } },
  { key: "grand_prix", name: { ua: "Великий приз", en: "Grand Prix" } },
  { key: "young_horses", name: { ua: "Молоді коні", en: "Young Horses" } },
  { key: "open_class", name: { ua: "Відкритий клас", en: "Open Class" } },
];

export const tests: TestItem[] = [
  // Children
  { slug: "dity-poperednij-a", file: "dity-poperednij-a.pdf", name: { ua: "Діти — Попередній Приз А", en: "Children — Preliminary Test A" }, category: "children" },
  { slug: "dity-poperednij-b", file: "dity-poperednij-b.pdf", name: { ua: "Діти — Попередній Приз В", en: "Children — Preliminary Test B" }, category: "children" },
  { slug: "dity-osobystyj", file: "dity-osobystyj.pdf", name: { ua: "Діти — Особистий Приз", en: "Children — Individual Test" }, category: "children" },
  { slug: "dity-komandnyj", file: "dity-komandnyj.pdf", name: { ua: "Діти — Командний Приз", en: "Children — Team Test" }, category: "children" },

  // Young Riders
  { slug: "junaky-poperednij", file: "junaky-poperednij.pdf", name: { ua: "Юнаки — Попередній Приз", en: "Young Riders — Preliminary Test" }, category: "young_riders" },
  { slug: "junaky-osobystyj", file: "junaky-osobystyj.pdf", name: { ua: "Юнаки — Особистий Приз", en: "Young Riders — Individual Test" }, category: "young_riders" },
  { slug: "junaky-komandnyj", file: "junaky-komandnyj.pdf", name: { ua: "Юнаки — Командний Приз", en: "Young Riders — Team Test" }, category: "young_riders" },
  { slug: "kjur-junaky", file: "kjur-junaky.pdf", name: { ua: "Юнаки — КЮР", en: "Young Riders — Freestyle" }, category: "young_riders" },

  // Juniors
  { slug: "juniory-poperednij", file: "juniory-poperednij.pdf", name: { ua: "Юніори — Попередній Приз", en: "Juniors — Preliminary Test" }, category: "juniors" },
  { slug: "juniory-osobystyj", file: "juniory-osobystyj.pdf", name: { ua: "Юніори — Особистий Приз", en: "Juniors — Individual Test" }, category: "juniors" },
  { slug: "juniory-komandnyj", file: "juniory-komandnyj.pdf", name: { ua: "Юніори — Командний Приз", en: "Juniors — Team Test" }, category: "juniors" },
  { slug: "kjur-juniory", file: "kjur-juniory.pdf", name: { ua: "Юніори — КЮР", en: "Juniors — Freestyle" }, category: "juniors" },

  // U25
  { slug: "velykyj-pryz-16-25", file: "velykyj-pryz-16-25.pdf", name: { ua: "Великий Приз — Юніори 16-25 років", en: "Grand Prix — Juniors 16-25 Years" }, category: "u25" },

  // Small & Medium
  { slug: "malyj-pryz", file: "malyj-pryz.pdf", name: { ua: "Малий Приз", en: "Prix St. Georges" }, category: "small_medium" },
  { slug: "serednij-pryz-a", file: "serednij-pryz-a.pdf", name: { ua: "Середній Приз А", en: "Intermediate I A" }, category: "small_medium" },
  { slug: "serednij-pryz-b", file: "serednij-pryz-b.pdf", name: { ua: "Середній Приз В", en: "Intermediate I B" }, category: "small_medium" },
  { slug: "serednij-pryz-1", file: "serednij-pryz-1.pdf", name: { ua: "Середній Приз 1", en: "Intermediate II" }, category: "small_medium" },
  { slug: "serednij-pryz-2", file: "serednij-pryz-2.pdf", name: { ua: "Середній Приз 2", en: "Intermediate II — Test 2" }, category: "small_medium" },
  { slug: "kjur-serednij-1", file: "kjur-serednij-1.pdf", name: { ua: "КЮР Середнього Призу 1", en: "Intermediate I Freestyle" }, category: "small_medium" },
  { slug: "kjur-sp-ab", file: "kjur-sp-ab.pdf", name: { ua: "КЮР СП А/В", en: "Prix St. Georges Freestyle A/B" }, category: "small_medium" },

  // Grand Prix
  { slug: "velykyj-pryz", file: "velykyj-pryz.pdf", name: { ua: "Великий Приз", en: "Grand Prix" }, category: "grand_prix" },
  { slug: "velykyj-pryz-skorochenyj", file: "velykyj-pryz-skorochenyj.pdf", name: { ua: "Великий Приз Скорочений", en: "Grand Prix Short" }, category: "grand_prix" },
  { slug: "velykyj-pryz-specialnyj", file: "velykyj-pryz-specialnyj.pdf", name: { ua: "Великий Приз Спеціальний", en: "Grand Prix Special" }, category: "grand_prix" },
  { slug: "kjur-velykyj-pryz", file: "kjur-velykyj-pryz.pdf", name: { ua: "КЮР Великого Призу", en: "Grand Prix Freestyle" }, category: "grand_prix" },

  // Young Horses
  { slug: "koni-4-roky", file: "koni-4-roky.pdf", name: { ua: "Тест для коней 4 років", en: "4-Year-Old Test" }, category: "young_horses" },
  { slug: "koni-5-poperednij", file: "koni-5-poperednij.pdf", name: { ua: "Коні 5 років — Попередній", en: "5-Year-Old — Preliminary" }, category: "young_horses" },
  { slug: "koni-5-finalnyj", file: "koni-5-finalnyj.pdf", name: { ua: "Коні 5 років — Фінальний", en: "5-Year-Old — Final" }, category: "young_horses" },
  { slug: "koni-6-poperednij", file: "koni-6-poperednij.pdf", name: { ua: "Коні 6 років — Попередній", en: "6-Year-Old — Preliminary" }, category: "young_horses" },
  { slug: "koni-6-finalnyj", file: "koni-6-finalnyj.pdf", name: { ua: "Коні 6 років — Фінальний", en: "6-Year-Old — Final" }, category: "young_horses" },
  { slug: "koni-7-poperednij", file: "koni-7-poperednij.pdf", name: { ua: "Коні 7 років — Попередній", en: "7-Year-Old — Preliminary" }, category: "young_horses" },
  { slug: "koni-7-finalnyj", file: "koni-7-finalnyj.pdf", name: { ua: "Коні 7 років — Фінальний", en: "7-Year-Old — Final" }, category: "young_horses" },

  // Open Class
  { slug: "af-1", file: "af-1.pdf", name: { ua: "AF-1", en: "AF-1" }, category: "open_class" },
  { slug: "af-2", file: "af-2.pdf", name: { ua: "AF-2", en: "AF-2" }, category: "open_class" },
  { slug: "af-2-eng", file: "af-2-eng.pdf", name: { ua: "AF-2 (English)", en: "AF-2 (English)" }, category: "open_class" },
  { slug: "af-3", file: "af-3.pdf", name: { ua: "AF-3", en: "AF-3" }, category: "open_class" },
  { slug: "af-3-eng", file: "af-3-eng.pdf", name: { ua: "AF-3 (English)", en: "AF-3 (English)" }, category: "open_class" },
  { slug: "challenge-e", file: "challenge-e.pdf", name: { ua: "Challenge E", en: "Challenge E" }, category: "open_class" },
  { slug: "l-5", file: "l-5.pdf", name: { ua: "L-5", en: "L-5" }, category: "open_class" },
  { slug: "l-5-eng", file: "l-5-eng.pdf", name: { ua: "L-5 (English)", en: "L-5 (English)" }, category: "open_class" },
  { slug: "l-6", file: "l-6.pdf", name: { ua: "L-6", en: "L-6" }, category: "open_class" },
  { slug: "l-6-eng", file: "l-6-eng.pdf", name: { ua: "L-6 (English)", en: "L-6 (English)" }, category: "open_class" },
  { slug: "m-4", file: "m-4.pdf", name: { ua: "M-4", en: "M-4" }, category: "open_class" },
  { slug: "m-4-eng", file: "m-4-eng.pdf", name: { ua: "M-4 (English)", en: "M-4 (English)" }, category: "open_class" },
  { slug: "m-5", file: "m-5.pdf", name: { ua: "M-5", en: "M-5" }, category: "open_class" },
  { slug: "m-5-eng", file: "m-5-eng.pdf", name: { ua: "M-5 (English)", en: "M-5 (English)" }, category: "open_class" },
];

export function isAvailable(_slug: string): boolean {
  return true;
}

export function getTestBySlug(slug: string): TestItem | undefined {
  return tests.find((t) => t.slug === slug);
}
