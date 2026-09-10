import {
  isProgressStage,
  progressStagesFor,
  type CustomerOrderStage,
} from "./order-status.adapter";
import { PROGRESS_LABELS } from "./order-status.config";

export function OrderProgress({
  stage,
  fulfillmentType,
}: {
  stage: CustomerOrderStage;
  fulfillmentType?: string | null;
}) {
  const steps = progressStagesFor(fulfillmentType);
  const currentIndex = isProgressStage(stage) ? steps.indexOf(stage) : -1;

  if (stage === "cancelled") return null;

  return (
    <ol
      className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2"
      aria-label="Bestellfortschritt"
    >
      {steps.map((step, index) => {
        const isCurrent = index === currentIndex;
        const isDone = currentIndex >= 0 && index < currentIndex;
        const isUpcoming = currentIndex >= 0 && index > currentIndex;

        return (
          <li
            key={step}
            className="relative flex min-w-0 flex-1 items-start gap-3 sm:flex-col sm:items-center sm:text-center"
            aria-current={isCurrent ? "step" : undefined}
          >
            {index < steps.length - 1 ? (
              <span
                aria-hidden
                className={`absolute top-3 left-[calc(50%+0.75rem)] hidden h-px w-[calc(100%-1.5rem)] sm:block ${
                  isDone ? "bg-sage" : "bg-ink/10"
                }`}
              />
            ) : null}
            <span
              className={`relative z-[1] mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                isDone
                  ? "border-sage bg-sage text-white"
                  : isCurrent
                    ? "border-sage bg-gold text-ink"
                    : "border-ink/15 bg-white text-muted"
              }`}
              aria-hidden
            >
              {isDone ? "✓" : index + 1}
            </span>
            <span
              className={`min-w-0 text-sm leading-snug ${
                isCurrent
                  ? "font-semibold text-ink"
                  : isUpcoming
                    ? "text-muted"
                    : "text-ink/80"
              }`}
            >
              {PROGRESS_LABELS[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
