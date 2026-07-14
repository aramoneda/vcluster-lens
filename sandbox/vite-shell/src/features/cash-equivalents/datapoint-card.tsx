import type { DatapointCardProps } from "./types"

export function DatapointCard({
  label,
  value,
  emphasis = "brand",
  className,
}: DatapointCardProps) {
  return (
    <article
      className={[
        "ce-datapoint-card",
        "rounded-[var(--radius-s)] bg-[var(--color-surface-foreground)]",
        "p-6 flex flex-col gap-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="ce-datapoint-label">{label}</p>
      <p
        className={[
          "ce-datapoint-value",
          emphasis === "brand"
            ? "text-[var(--color-text-dark-accent)]"
            : "text-[var(--color-text-primary)]",
        ].join(" ")}
      >
        {value}
      </p>
    </article>
  )
}
