/**
 * Lightweight markdown-to-HTML converter for guide section bodies.
 * Handles headings, tables, lists, bold/italic, inline code, and links.
 * Returns HTML unchanged if the input already starts with an HTML tag.
 */

export function markdownToHtml(text: string): string {
  if (!text) return "";
  if (text.trim().startsWith("<")) return text; // already HTML

  const lines = text.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // H3
    if (/^### /.test(line)) {
      out.push(`<h3>${inlineMd(line.slice(4).trim())}</h3>`);
      i++; continue;
    }
    // H2
    if (/^## /.test(line)) {
      out.push(`<h2>${inlineMd(line.slice(3).trim())}</h2>`);
      i++; continue;
    }
    // H1
    if (/^# /.test(line)) {
      out.push(`<h1>${inlineMd(line.slice(2).trim())}</h1>`);
      i++; continue;
    }

    // Markdown table block
    if (/^\|/.test(line)) {
      const block: string[] = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        block.push(lines[i]);
        i++;
      }
      out.push(tableToHtml(block));
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(`<li>${inlineMd(lines[i].slice(2).trim())}</li>`);
        i++;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${inlineMd(lines[i].replace(/^\d+\. /, "").trim())}</li>`);
        i++;
      }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // Blockquote
    if (/^> /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^> /.test(lines[i])) {
        items.push(inlineMd(lines[i].slice(2).trim()));
        i++;
      }
      out.push(`<blockquote><p>${items.join(" ")}</p></blockquote>`);
      continue;
    }

    // Horizontal rule
    if (/^(---+|\*\*\*+)$/.test(line.trim())) {
      out.push("<hr>");
      i++; continue;
    }

    // Empty line — skip
    if (!line.trim()) {
      i++; continue;
    }

    // Paragraph: accumulate consecutive non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^[#>]/.test(lines[i]) &&
      !/^\|/.test(lines[i]) &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !/^(---+|\*\*\*+)$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length) {
      out.push(`<p>${inlineMd(paraLines.join(" "))}</p>`);
    }
  }

  return out.join("\n");
}

function inlineMd(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:0.5rem;margin:1rem 0">')
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function tableToHtml(lines: string[]): string {
  // Filter out the separator row (e.g. |---|:---:|---:|)
  const dataLines = lines.filter(l => !/^\|[\s\-:|]+\|$/.test(l.trim()));
  if (!dataLines.length) return "";

  const parseRow = (row: string): string[] =>
    row.split("|").slice(1, -1).map(c => c.trim());

  const [header, ...body] = dataLines;
  const headerCells = parseRow(header);
  const thead = `<thead><tr>${headerCells.map(c => `<th>${inlineMd(c)}</th>`).join("")}</tr></thead>`;
  const tbody = body
    .map(row => `<tr>${parseRow(row).map(c => `<td>${inlineMd(c)}</td>`).join("")}</tr>`)
    .join("");

  return `<table>${thead}<tbody>${tbody}</tbody></table>`;
}
