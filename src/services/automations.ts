import { automations } from "@/data/automations";
import type { Automation, PricingModel } from "@/data/types";

export function getAutomations(): Automation[] {
  return automations;
}

export const pricingLabel: Record<PricingModel, string> = {
  PAY_PER_USAGE: "Pay per usage",
  PAY_PER_EVENT: "Pay per event",
  RENTAL: "Rental",
  FREE: "Free",
};
