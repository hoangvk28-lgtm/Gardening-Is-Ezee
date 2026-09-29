// Grammatical section headings for buying guides, derived from the guide's
// topic ("Best Office Chairs Under $300" → "an office chair under $300").
// Guides can override any heading via the `sectionHeadings` data export.

export interface GuideSectionHeadings {
  howWeChose: string;
  whatToLookFor: string;
  howToChoose: string;
}

// Plural-only nouns that have no natural singular in a heading.
const PLURALIA = /^(glasses|headphones|earbuds|earphones|scissors|pliers|tongs|shorts|pants|speakers?|supplies|essentials|accessories|electronics|goods)$/i;
const PREPOSITION = /\s+(under|for|with|in|on|to|from|without|by|and|vs\.?|that)\s+/i;

const IRREGULAR: Record<string, string> = {
  mice: "mouse", shelves: "shelf", knives: "knife", feet: "foot", people: "person", children: "child",
  leaves: "leaf", halves: "half", wolves: "wolf", series: "series", species: "species",
};

function isPluralWord(word: string): boolean {
  return IRREGULAR[word.toLowerCase()] !== undefined || (/s$/i.test(word) && !/(ss|us|is)$/i.test(word));
}

function singularizeWord(word: string): string {
  const irregular = IRREGULAR[word.toLowerCase()];
  if (irregular) return word[0] === word[0].toUpperCase() ? irregular[0].toUpperCase() + irregular.slice(1) : irregular;
  if (/ies$/i.test(word) && word.length > 4) return word.replace(/ies$/i, "y");
  if (/(ches|shes|xes|sses|zzes)$/i.test(word)) return word.replace(/es$/i, "");
  if (/s$/i.test(word) && !/(ss|us|is)$/i.test(word)) return word.replace(/s$/i, "");
  return word;
}

/** Article for a phrase, by sound rather than spelling for common cases. */
export function indefiniteArticle(phrase: string): "a" | "an" {
  const first = phrase.trim().split(/\s+/)[0] ?? "";
  if (/^[0-9]/.test(first)) return /^(8|11|18|80|800)(\b|[^0-9])/.test(first) ? "an" : "a";
  // Acronyms read letter by letter: "an LED", "an SSD", "a USB".
  if (/^[A-Z0-9]{2,}$/.test(first.replace(/[-/].*$/, ""))) return /^[AEFHILMNORSX]/.test(first) ? "an" : "a";
  if (/^(uni|use|usu|uti|eu|one|once)/i.test(first)) return "a";
  if (/^(hour|honest|honor|heir)/i.test(first)) return "an";
  return /^[aeiou]/i.test(first) ? "an" : "a";
}

export interface GuideTopic {
  /** "Office Chairs Under $300" — null when the title isn't a "Best X" topic. */
  plural: string | null;
  /** "Office Chair Under $300" — null for plural-only topics or non-"Best X" titles. */
  singular: string | null;
}

export function guideTopic(breadcrumbTitle: string): GuideTopic {
  const m = breadcrumbTitle.trim().match(/^(?:the\s+)?best\s+(.+)$/i);
  if (!m) return { plural: null, singular: null };
  const plural = m[1].replace(/\s+(in|for)\s+20\d\d$/i, "").trim();
  const split = plural.search(PREPOSITION);
  const head = split === -1 ? plural : plural.slice(0, split);
  const tail = split === -1 ? "" : plural.slice(split);
  const words = head.split(/\s+/);
  const last = words[words.length - 1];
  if (PLURALIA.test(last)) return { plural, singular: null };
  // Title already singular ("Best Mesh Office Chair"): no plural form to use.
  if (!isPluralWord(last)) return { plural: null, singular: plural };
  words[words.length - 1] = singularizeWord(last);
  return { plural, singular: words.join(" ") + tail };
}

export function guideSectionHeadings(
  breadcrumbTitle: string,
  overrides?: Partial<GuideSectionHeadings>
): GuideSectionHeadings {
  const { plural, singular } = guideTopic(breadcrumbTitle);
  const defaults: GuideSectionHeadings = singular
    ? {
        howWeChose: "How We Built This Shortlist",
        whatToLookFor: `What Matters Before You Choose ${indefiniteArticle(singular)} ${singular}`,
        howToChoose: `Match ${indefiniteArticle(singular)} ${singular} to Your Garden or Yard`,
      }
    : plural
    ? {
        howWeChose: "How We Built This Shortlist",
        whatToLookFor: `What Matters When Comparing ${plural}`,
        howToChoose: `Match ${plural} to Your Garden or Yard`,
      }
    : { howWeChose: "How We Built This Shortlist", whatToLookFor: "What Matters Before You Choose", howToChoose: "Match the Tool to the Job" };
  return { ...defaults, ...overrides };
}
