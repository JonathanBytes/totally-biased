import { format } from "date-fns";

/**
 * Formats a date object into a readable string format
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Jan 15, 2025")
 */
export const formatItemDate = (date: Date): string => {
  return format(date, "MMM d, yyyy");
};

/**
 * Gets the date for a specific item from the list's itemDates object
 * @param itemDates - The itemDates object from the list
 * @param index - The index of the item
 * @returns The date object or null if no date exists
 */
export const getItemDate = (
  itemDates: { [key: string]: number } | undefined,
  index: number
): Date | null => {
  const dateTimestamp = itemDates?.[index.toString()];
  if (!dateTimestamp) return null;
  return new Date(dateTimestamp);
};

/**
 * Checks if an item is marked as completed
 * @param completedItems - Array of completed item indices
 * @param index - The index to check
 * @returns True if the item is completed
 */
export const isItemCompleted = (
  completedItems: number[] | undefined,
  index: number
): boolean => {
  return completedItems?.includes(index) || false;
};
