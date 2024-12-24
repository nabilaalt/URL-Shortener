import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}



export function getISOWeekYear(date) {
  const dateObject = new Date(date);
  const year = dateObject.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const weekDay = firstDayOfYear.getDay();
  
  // Adjust to start week on Monday (ISO standard)
  const isoFirstDay = new Date(year, 0, (weekDay <= 4 ? 1 - weekDay : 8 - weekDay));
  const diff = dateObject - isoFirstDay + 86400000;
  const dayOfWeek = isoFirstDay.getUTCDay() || 7;
  
  // ISO Week Calculation
  const week = Math.ceil((diff / 86400000 + dayOfWeek - 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}
