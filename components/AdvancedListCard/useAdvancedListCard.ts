import { useState, useEffect, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { AdvancedListItem } from "./types";

/**
 * Custom hook that manages all the state and handlers for the AdvancedListCard component
 * @param list - The advanced list item data
 * @returns Object containing state, handlers, and helper functions
 */
export const useAdvancedListCard = (list: AdvancedListItem) => {
  // Local state
  const [openDatePickerId, setOpenDatePickerId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [optimisticItems, setOptimisticItems] = useState<string[]>(list.items);
  const [optimisticCompletedItems, setOptimisticCompletedItems] = useState<number[]>(
    list.completedItems || []
  );

  // Mutations
  const toggleItemCompletion = useMutation(api.sortedLists.toggleItemCompletion);
  const updateItemDate = useMutation(api.sortedLists.updateItemDate);
  const reorderItems = useMutation(api.sortedLists.reorderItems);
  const removeItem = useMutation(api.sortedLists.removeItem);

  // Sync optimistic state when list changes from server
  useEffect(() => {
    setOptimisticItems(list.items);
  }, [list.items]);

  useEffect(() => {
    setOptimisticCompletedItems(list.completedItems || []);
  }, [list.completedItems]);

  // Handlers
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = optimisticItems.indexOf(active.id as string);
        const newIndex = optimisticItems.indexOf(over.id as string);

        const newItems = arrayMove(optimisticItems, oldIndex, newIndex);
        setOptimisticItems(newItems);

        try {
          await reorderItems({ id: list._id, newOrder: newItems });
        } catch (error) {
          console.error("Error reordering items:", error);
          setOptimisticItems(list.items);
        }
      }
    },
    [optimisticItems, list._id, list.items, reorderItems]
  );

  const handleToggleCompletion = useCallback(
    async (itemIndex: number) => {
      const isCurrentlyCompleted = optimisticCompletedItems.includes(itemIndex);
      const newCompletedItems = isCurrentlyCompleted
        ? optimisticCompletedItems.filter((idx) => idx !== itemIndex)
        : [...optimisticCompletedItems, itemIndex];
      
      setOptimisticCompletedItems(newCompletedItems);

      try {
        await toggleItemCompletion({ id: list._id, itemIndex });
      } catch (error) {
        console.error("Error toggling completion:", error);
        setOptimisticCompletedItems(list.completedItems || []);
      }
    },
    [list._id, optimisticCompletedItems, list.completedItems, toggleItemCompletion]
  );

  const handleDateSelect = useCallback(
    async (itemIndex: number, date: Date | undefined) => {
      try {
        await updateItemDate({
          id: list._id,
          itemIndex,
          date: date ? date.getTime() : undefined,
        });
        setOpenDatePickerId(null);
      } catch (error) {
        console.error("Error updating date:", error);
      }
    },
    [list._id, updateItemDate]
  );

  const handleRemoveItem = useCallback(
    async (itemIndex: number) => {
      try {
        const newItems = optimisticItems.filter((_, index) => {
          const originalIndex = list.items.indexOf(optimisticItems[index]);
          return originalIndex !== itemIndex;
        });
        setOptimisticItems(newItems);

        await removeItem({ id: list._id, itemIndex });
      } catch (error) {
        console.error("Error removing item:", error);
        setOptimisticItems(list.items);
      }
    },
    [optimisticItems, list.items, list._id, removeItem]
  );

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  // Helper functions
  const checkItemCompleted = useCallback(
    (index: number) => {
      return optimisticCompletedItems.includes(index);
    },
    [optimisticCompletedItems]
  );

  const getItemDateByIndex = useCallback(
    (index: number) => {
      const dateTimestamp = list.itemDates?.[index.toString()];
      if (!dateTimestamp) return null;
      return new Date(dateTimestamp);
    },
    [list.itemDates]
  );

  return {
    // State
    openDatePickerId,
    setOpenDatePickerId,
    isEditMode,
    optimisticItems,
    optimisticCompletedItems,

    // Handlers
    handleDragEnd,
    handleToggleCompletion,
    handleDateSelect,
    handleRemoveItem,
    toggleEditMode,

    // Helper functions
    checkItemCompleted,
    getItemDateByIndex,
  };
};
