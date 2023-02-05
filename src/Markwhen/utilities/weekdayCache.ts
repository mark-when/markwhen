import type { DateTime } from "luxon";
import LRU from "lru-cache";
// @ts-ignore
import * as lxt from "luxon/src/impl/conversions.js";

export const useWeekdayCache = () => {
  const weekdayCache = new LRU<string, number>({ max: 300 });

  const getWeekday = (dateTime: DateTime): number => {
    const key = `${dateTime.year}-${dateTime.month}-${dateTime.day}`;
    const cached = weekdayCache.get(key);
    if (cached) {
      return cached;
    }
    const weekday = lxt.gregorianToWeek(dateTime);
    weekdayCache.set(key, weekday.weekday);
    return weekday;
  };

  return { getWeekday };
};
