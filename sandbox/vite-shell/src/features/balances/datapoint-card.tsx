import type { BalancesDatapointCardProps } from "./types"

export function BalancesDatapointCard({
  label,
  value,
  emphasis = "brand",
  className,
}: BalancesDatapointCardProps) {
  return (
    <article
      className={[
        "bal-datapoint-card",
        "rounded-[var(--radius-s)] bg-[var(--color-surface-foreground)]",
        "p-6 flex flex-col gap-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="bal-datapoint-label">{label}</p>
      <p
        className={[
          "bal-datapoint-value",
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
