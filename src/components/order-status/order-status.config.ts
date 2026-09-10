import type {
  CustomerOrderStage,
  ProgressStage,
} from "./order-status.adapter";

export type StageCopy = {
  title: string;
  message: string;
  /** Concise accessible name for the illustration. */
  ariaLabel: string;
  /** Longer description for screen readers. */
  ariaDescription: string;
  progressLabel: string;
};

/**
 * Customer-facing German copy. Kept here so scenes and progress never
 * duplicate switch statements.
 */
export const STAGE_COPY: Record<CustomerOrderStage, StageCopy> = {
  confirmed: {
    title: "Bestellung bestätigt",
    message: "Das Restaurant hat Ihre Bestellung erhalten und angenommen.",
    ariaLabel: "Bestellschein wird bestätigt",
    ariaDescription:
      "Ein Bestellschein rutscht aus dem Drucker und wird mit einem Häkchen bestätigt.",
    progressLabel: "Bestätigt",
  },
  preparing: {
    title: "Ihr Gericht nimmt Form an",
    message: "Die Küche bereitet Ihre Bestellung frisch zu.",
    ariaLabel: "Koch bereitet das Essen zu",
    ariaDescription:
      "Ein Koch rührt in einem Topf, Dampf steigt auf, die Küche ist in Bewegung.",
    progressLabel: "Zubereitung",
  },
  ready: {
    title: "Verpackt und bereit",
    message: "Ihr Essen ist fertig und wartet auf Abholung oder den Fahrer.",
    ariaLabel: "Essen ist verpackt und versiegelt",
    ariaDescription:
      "Teller und Töpfe gleiten in eine Safran-Papiertüte; die Tüte wird versiegelt.",
    progressLabel: "Bereit",
  },
  delivering: {
    title: "Ihre Bestellung ist unterwegs",
    message: "Der Fahrer ist mit Ihrer Bestellung auf dem Weg zu Ihnen.",
    ariaLabel: "Liefer-Scooter unterwegs",
    ariaDescription:
      "Ein Safran-Lieferscooter macht ein Wheelie; die Box hinten zeigt das Restaurant-Motiv.",
    progressLabel: "Unterwegs",
  },
  completed: {
    title: "Zugestellt — guten Appetit",
    message: "Ihre Bestellung ist angekommen. Geniessen Sie Ihre Mahlzeit.",
    ariaLabel: "Bestellung zugestellt",
    ariaDescription:
      "Die Safran-Tüte fährt zur Haustür; die Tür öffnet sich, die Tüte verschwindet hinein, die Tür schliesst sich.",
    progressLabel: "Abgeschlossen",
  },
  cancelled: {
    title: "Bestellung storniert",
    message: "Diese Bestellung wurde storniert. Bei Fragen melden Sie sich gerne bei uns.",
    ariaLabel: "Bestellung storniert",
    ariaDescription: "Ruhige Darstellung einer stornierten Bestellung.",
    progressLabel: "Storniert",
  },
  unknown: {
    title: "Status wird geladen",
    message: "Der aktuelle Status konnte nicht eindeutig erkannt werden.",
    ariaLabel: "Status unbekannt",
    ariaDescription: "Neutrale Darstellung, während der Status geklärt wird.",
    progressLabel: "Unbekannt",
  },
};

export const PROGRESS_LABELS: Record<ProgressStage, string> = {
  confirmed: STAGE_COPY.confirmed.progressLabel,
  preparing: STAGE_COPY.preparing.progressLabel,
  ready: STAGE_COPY.ready.progressLabel,
  delivering: STAGE_COPY.delivering.progressLabel,
  completed: STAGE_COPY.completed.progressLabel,
};

export const SCENE_TRANSITION_MS = 220;
