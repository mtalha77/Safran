import { ValidationError } from "@/backend/errors";
import {
  boolean,
  integerInRange,
  isEmail,
  nonNegativeNumber,
  optionalText,
  requiredText,
  text,
} from "@/backend/validation/primitives";
import type { OpeningHoursInput, RestaurantSettingsInput } from "@/backend/types";

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

function parseTime(value: unknown): string | null {
  const parsed = text(value, 5);
  if (!parsed) return null;
  if (!TIME.test(parsed)) {
    throw new ValidationError("time_invalid", "Bitte Zeiten als HH:MM angeben.");
  }
  return parsed;
}

export function parseRestaurantSettings(
  input: Record<string, unknown>,
): RestaurantSettingsInput {
  const email = optionalText(input.email, 254);
  if (email && !isEmail(email)) {
    throw new ValidationError("email_invalid", "Bitte eine gültige E-Mail angeben.");
  }

  return {
    restaurantName: requiredText(
      input.restaurantName,
      120,
      "restaurant_name_required",
      "Der Restaurantname ist erforderlich.",
    ),
    email,
    phone: optionalText(input.phone, 40),
    address: optionalText(input.address, 300),
    deliveryMinimum: nonNegativeNumber(
      input.deliveryMinimum,
      "minimum_invalid",
      "Mindestbestellwerte dürfen nicht negativ sein.",
    ),
    pickupMinimum: nonNegativeNumber(
      input.pickupMinimum,
      "minimum_invalid",
      "Mindestbestellwerte dürfen nicht negativ sein.",
    ),
    deliveryFee: nonNegativeNumber(
      input.deliveryFee,
      "fee_invalid",
      "Die Liefergebühr darf nicht negativ sein.",
    ),
    pickupEnabled: boolean(input.pickupEnabled),
    deliveryEnabled: boolean(input.deliveryEnabled),
    minimumNoticeMinutes: integerInRange(
      input.minimumNoticeMinutes,
      0,
      600,
      "notice_invalid",
      "Die Vorlaufzeit muss zwischen 0 und 600 Minuten liegen.",
    ),
  };
}

/**
 * Rejects windows that end before they start, which the database also refuses
 * via check constraints.
 */
export function parseOpeningHours(
  input: ReadonlyArray<Record<string, unknown>>,
): OpeningHoursInput {
  return input.map((day, index) => {
    const isClosed = boolean(day.isClosed);
    const lunchOpens = isClosed ? null : parseTime(day.lunchOpens);
    const lunchCloses = isClosed ? null : parseTime(day.lunchCloses);
    const dinnerOpens = isClosed ? null : parseTime(day.dinnerOpens);
    const dinnerCloses = isClosed ? null : parseTime(day.dinnerCloses);

    const pairs: Array<[string | null, string | null]> = [
      [lunchOpens, lunchCloses],
      [dinnerOpens, dinnerCloses],
    ];
    for (const [start, end] of pairs) {
      if ((start && !end) || (!start && end) || (start && end && start >= end)) {
        throw new ValidationError(
          "hours_invalid",
          "Öffnungszeiten müssen ein gültiges Start- und Endzeitpaar bilden.",
        );
      }
    }

    return {
      weekday: integerInRange(
        day.weekday ?? index,
        0,
        6,
        "weekday_invalid",
        "Ungültiger Wochentag.",
      ),
      isClosed,
      lunchOpens,
      lunchCloses,
      dinnerOpens,
      dinnerCloses,
    };
  });
}
