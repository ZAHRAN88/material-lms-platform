import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hour${Math.floor(diffMinutes / 60) !== 1 ? 's' : ''} ago`;
  if (diffMinutes < 2880) return "Yesterday";
  if (diffMinutes < 10080) return `${Math.floor(diffMinutes / 1440)} days ago`;
  if (diffMinutes < 43200) return `${Math.floor(diffMinutes / 10080)} weeks ago`;
  if (diffMinutes < 525600) return `${Math.floor(diffMinutes / 43200)} months ago`;
  return `${Math.floor(diffMinutes / 525600)} years ago`;
}