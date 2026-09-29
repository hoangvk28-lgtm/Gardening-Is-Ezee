import { formatDate } from "@/lib/utils";

interface ArticleMetadataProps {
  author?: string;
  date?: string;
  readTime?: string;
  datePrefix?: string;
  className?: string;
}

export function ArticleMetadata({ author, date, readTime, datePrefix, className = "" }: ArticleMetadataProps) {
  const parts: React.ReactNode[] = [];
  if (author) parts.push(<span key="a">By {author}</span>);
  if (date)
    parts.push(
      <time key="d" dateTime={date}>
        {datePrefix ? `${datePrefix} ` : ""}
        {formatDate(date)}
      </time>
    );
  if (readTime) parts.push(<span key="r">{readTime.includes("read") ? readTime : `${readTime} read`}</span>);

  return (
    <p className={`flex flex-wrap items-center gap-x-2 text-sm leading-snug text-ink-secondary ${className}`}>
      {parts.map((p, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          {p}
          {i < parts.length - 1 && <span aria-hidden className="text-border-dark">·</span>}
        </span>
      ))}
    </p>
  );
}
