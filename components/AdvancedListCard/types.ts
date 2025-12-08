import { Id } from "@/convex/_generated/dataModel";
import { MouseEventHandler } from "react";

export interface AdvancedListItem {
  _id: Id<"sortedLists">;
  _creationTime: number;
  title: string;
  description?: string | undefined;
  items: string[];
  listType: "advanced";
  completedItems?: number[] | undefined;
  itemDates?:
    | {
        [key: string]: number;
      }
    | undefined;
  updatedAt: number;
  userId: string;
}

export interface AdvancedListCardProps {
  list: AdvancedListItem;
  handleDelete: MouseEventHandler<HTMLButtonElement>;
}

export interface SortableItemProps {
  id: string;
  item: string;
  index: number;
  completed: boolean;
  itemDate: Date | null;
  isEditMode: boolean;
  onToggleCompletion: (index: number) => void;
  onDateSelect: (index: number, date: Date | undefined) => void;
  onRemoveItem: (index: number) => void;
  openDatePickerId: number | null;
  setOpenDatePickerId: (id: number | null) => void;
}
