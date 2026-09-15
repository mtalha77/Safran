import type { Locale } from "@/lib/i18n/messages";

/**
 * German words that appear inside otherwise international dish names, such as
 * "Veggie Samosa (2 Stück)" or "Tandoori Crevetten". Whole words only, so
 * "Brot" is never mistaken for "Rot" and "Chapati Roti" survives untouched.
 * Anything not listed here (Pakora, Safran, Masala …) is left alone.
 */
const GERMAN_DISH_WORDS: Array<[RegExp, string]> = [
  [/\bMineralwasser\b/giu, "Mineral Water"],
  [/\bApfelschorle\b/giu, "Apple Spritzer"],
  [/\bHausgemachtes\b/giu, "Homemade"],
  [/\bVorspeisen\b/giu, "Appetizers"],
  [/\bGemischter\b/giu, "Mixed"],
  [/\bMinzsauce\b/giu, "Mint Sauce"],
  [/\bCrevetten\b/giu, "Prawns"],
  [/\bEistee\b/giu, "Iced Tea"],
  [/\bPfirsich\b/giu, "Peach"],
  [/\bZitrone\b/giu, "Lemon"],
  [/\bGemüse\b/giu, "Vegetable"],
  [/\bSpezial\b/giu, "Special"],
  [/\bSpinat\b/giu, "Spinach"],
  [/\bPoulet\b/giu, "Chicken"],
  [/\bNudeln\b/giu, "Noodles"],
  [/\bSalzig\b/giu, "Salty"],
  [/\bStück\b/giu, "pcs"],
  [/\bSalat\b/giu, "Salad"],
  [/\bRolle\b/giu, "Roll"],
  [/\bMilch\b/giu, "Milk"],
  [/\bLamm\b/giu, "Lamb"],
  [/\bFisch\b/giu, "Fish"],
  [/\bVegi\b/giu, "Veggie"],
  [/\bSaft\b/giu, "Juice"],
  [/\bRot\b/giu, "Red"],
];

function translateDishWords(name: string): string {
  return GERMAN_DISH_WORDS.reduce(
    (result, [pattern, english]) => result.replace(pattern, english),
    name,
  );
}

/**
 * Dishes are stored under a single name, and the printed menu writes bilingual
 * dishes as "Deutsch / English" (for example "Gemüse Pakora / Vegetable
 * Pakora"). Show the side that matches the active locale, then translate any
 * German words left in a name that has no English half.
 */
export function localizedDishName(name: string, locale: Locale): string {
  const parts = name.split("/");
  const [german, english] =
    parts.length === 2 ? parts.map((part) => part.trim()) : [name, ""];

  if (locale !== "en") return german || name;
  return english || translateDishWords(german || name);
}

/**
 * Categories keep the German name in `title` and the English one in `subtitle`,
 * so each locale gets one heading instead of both languages stacked.
 */
export function localizedCategoryTitle(
  title: string,
  subtitle: string | null | undefined,
  locale: Locale,
): string {
  const english = subtitle?.trim();
  return locale === "en" && english ? english : title;
}
