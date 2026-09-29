import { clsx, scoreToBarColor, scoreToColor, scoreToLabel } from "@/lib/utils";
import type { ProductScore } from "@/data/products";

interface ScoreBarProps {
  label: string;
  score: number;
  showLabel?: boolean;
  compact?: boolean;
}

export function ScoreBar({
  label,
  score,
  showLabel = true,
  compact = false,
}: ScoreBarProps) {
  const pct = (score / 10) * 100;

  return (
    <div className={clsx("flex items-center", compact ? "gap-2" : "gap-3")}>
      <span
        className={clsx(
          "text-ink-secondary shrink-0",
          compact ? "text-xs w-20" : "text-sm w-28"
        )}
      >
        {label}
      </span>
      <div
        className={clsx(
          "flex-1 bg-border rounded-full overflow-hidden",
          compact ? "h-1.5" : "h-2"
        )}
      >
        <div
          className={clsx("h-full rounded-full transition-all", scoreToBarColor(score))}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={10}
        />
      </div>
      <span
        className={clsx(
          "font-semibold tabular-nums shrink-0",
          compact ? "text-xs w-6" : "text-sm w-8",
          scoreToColor(score)
        )}
      >
        {score.toFixed(1)}
      </span>
      {showLabel && !compact && (
        <span className="text-xs text-ink-muted hidden sm:block w-20">
          {scoreToLabel(score)}
        </span>
      )}
    </div>
  );
}

interface ScoreCardProps {
  scores: ProductScore;
}

const SCORE_ROWS: { key: keyof ProductScore; label: string }[] = [
  { key: "valueForMoney",  label: "Value for Money" },
  { key: "buildQuality",   label: "Build Quality" },
  { key: "easeOfUse",      label: "Ease of Use" },
  { key: "smallSpaceFit",  label: "Small-Space Fit" },
  { key: "buyerFeedback",  label: "Documentation Quality" },
];

export function ScoreCard({ scores }: ScoreCardProps) {
  return (
    <div className="bg-white rounded-card border border-border p-5">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
        <span className="text-sm font-semibold text-ink-secondary uppercase tracking-wide">
          Overall Score
        </span>
        <div className="flex items-baseline gap-1">
          <span
            className={clsx(
              "text-3xl font-bold tabular-nums",
              scoreToColor(scores.overall)
            )}
          >
            {scores.overall.toFixed(1)}
          </span>
          <span className="text-sm text-ink-muted">/10</span>
        </div>
      </div>
      <div className="flex flex-col gap-3.5">
        {SCORE_ROWS.map(({ key, label }) => (
          <ScoreBar key={key} label={label} score={scores[key]} />
        ))}
      </div>
    </div>
  );
}
