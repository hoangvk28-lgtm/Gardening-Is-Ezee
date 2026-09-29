import { markdownToHtml } from "@/lib/markdown";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/**
 * Single pass over all section bodies:
 * - Converts markdown to HTML if needed
 * - Injects id="" into every H2/H3 that lacks one
 * - Collects TOC items in document order
 * Returns processed HTML bodies and the TOC list.
 */
export function processGuideContent(
  sections: Array<{ heading: string; body: string }>
): { toc: TocItem[]; processedBodies: string[] } {
  const seen = new Map<string, number>();
  const toc: TocItem[] = [];

  const processedBodies = sections.map((section) => {
    const html = markdownToHtml(section.body);

    return html.replace(
      /<h([23])([^>]*)>([\s\S]*?)<\/h[23]>/gi,
      (_match, rawLevel, attrs, inner) => {
        if (/\bid=/.test(attrs)) return _match;
        const text = stripTags(inner).trim();
        if (!text) return _match;
        let id = slugify(text);
        if (!id) return _match;
        const count = seen.get(id) ?? 0;
        seen.set(id, count + 1);
        if (count > 0) id = `${id}-${count}`;
        const level = parseInt(rawLevel, 10) as 2 | 3;
        toc.push({ id, text, level });
        return `<h${rawLevel}${attrs} id="${id}">${inner}</h${rawLevel}>`;
      }
    );
  });

  return { toc, processedBodies };
}
