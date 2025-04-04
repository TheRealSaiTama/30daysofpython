import { dailyTips, DailyTip } from "../src/lib/daily-tips-content";

export async function getDailyTipContent(day: number): Promise<DailyTip | null> {
  if (day < 1 || day > 30) return null;
  return dailyTips.find(tip => tip.day === day) || null;
}