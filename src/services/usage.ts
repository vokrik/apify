import { dailyUsageUsd } from "@/data/usage";
import { NOW } from "@/data/user";

export type MonthUsage = {
  month: Date;
  totalUsd: number;
  daysInMonth: number;
  /** USD per day; days after today are absent. */
  daily: number[];
};

export function getCurrentMonthUsage(): MonthUsage {
  const daysInMonth = new Date(NOW.getFullYear(), NOW.getMonth() + 1, 0).getDate();
  return {
    month: NOW,
    totalUsd: dailyUsageUsd.reduce((sum, v) => sum + v, 0),
    daysInMonth,
    daily: dailyUsageUsd,
  };
}
