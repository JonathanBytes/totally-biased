import React, { MouseEventHandler, useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Check,
  CalendarPlus as CalendarIcon,
  GripVertical,
  Pencil,
  Trash2 as TrashIcon,
  CalendarX2,
  Trash2,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CopyToClipboardButton } from "./CopyToClipboardButton";
import { ShareButton } from "./ShareButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

interface AdvancedListItem {
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

export type { AdvancedListItem };

interface AdvancedListCardProps {
  list: AdvancedListItem;
  handleDelete: MouseEventHandler<HTMLButtonElement>;
}

interface ItemProps {
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

// Utility function for date formatting
const formatItemDate = (date: Date): string => {
  return format(date, "MMM d, yyyy");
};

// Memoized SortableItem component for better performance
const SortableItem = React.memo<ItemProps>(function SortableItem({
  id,
  item,
  index,
  completed,
  itemDate,
  isEditMode,
  onToggleCompletion,
  onDateSelect,
  onRemoveItem,
  openDatePickerId,
  setOpenDatePickerId,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }),
    [transform, transition, isDragging]
  );

  const handleToggle = useCallback(() => {
    onToggleCompletion(index);
  }, [onToggleCompletion, index]);

  const handleDateRemove = useCallback(() => {
    onDateSelect(index, undefined);
  }, [onDateSelect, index]);

  const handleRemove = useCallback(() => {
    onRemoveItem(index);
  }, [onRemoveItem, index]);

  const handleDateChange = useCallback(
    (date: Date | undefined) => {
      onDateSelect(index, date);
    },
    [onDateSelect, index]
  );

  const handlePopoverChange = useCallback(
    (open: boolean) => {
      setOpenDatePickerId(open ? index : null);
    },
    [setOpenDatePickerId, index]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors w-full"
    >
      {/* Edit Mode: Drag Handle */}
      {isEditMode && (
        <button
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing touch-none p-1 -m-1 flex-shrink-0"
          aria-label="Drag to reorder"
          style={{ touchAction: "none" }}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      )}

      {/* Normal Mode: Checkbox */}
      {!isEditMode && (
        <button
          onClick={handleToggle}
          className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            completed
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground hover:border-primary"
          }`}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed && <Check className="h-3 w-3" />}
        </button>
      )}

      <Badge
        variant="outline"
        className="h-6 w-6 rounded-full p-0 flex-shrink-0"
      >
        {index + 1}
      </Badge>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2 flex-wrap break-words">
          <span
            className={`text-md break-words ${
              completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {item}
          </span>
          {itemDate && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              {formatItemDate(itemDate)}
            </span>
          )}
        </div>
      </div>

      {/* Normal Mode: Date Button */}
      {!isEditMode && (
        <div className="flex items-center gap-1">
          <Popover open={openDatePickerId === index} onOpenChange={handlePopoverChange}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 px-2 ${itemDate ? "text-primary" : ""}`}
                title={itemDate ? "Change date" : "Add date"}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={itemDate || undefined}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Edit Mode: Date and Delete Buttons */}
      {isEditMode && (
        <div className="flex items-center gap-0.5">
          {itemDate && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={handleDateRemove}
              title="Remove date"
            >
              <CalendarX2 className="h-3 w-3" />
            </Button>
          )}
          <Popover open={openDatePickerId === index} onOpenChange={handlePopoverChange}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 p-0 ${itemDate ? "text-primary" : ""}`}
                title={itemDate ? "Change date" : "Add date"}
              >
                <CalendarIcon className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={itemDate || undefined}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={handleRemove}
            title="Delete item"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
});

export function AdvancedListCard({
  list,
  handleDelete,
}: AdvancedListCardProps) {
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

  // Sensors configured for optimal mobile performance
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sync optimistic state when list.items changes from server
  useEffect(() => {
    setOptimisticItems(list.items);
  }, [list.items]);

  // Sync optimistic completed items when list.completedItems changes from server
  useEffect(() => {
    setOptimisticCompletedItems(list.completedItems || []);
  }, [list.completedItems]);

  // Memoized handlers for better performance
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = optimisticItems.indexOf(active.id as string);
        const newIndex = optimisticItems.indexOf(over.id as string);

        // Optimistic update
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
      // Optimistic update: Toggle completion immediately in UI
      const isCurrentlyCompleted = optimisticCompletedItems.includes(itemIndex);
      const newCompletedItems = isCurrentlyCompleted
        ? optimisticCompletedItems.filter((idx) => idx !== itemIndex)
        : [...optimisticCompletedItems, itemIndex];
      
      setOptimisticCompletedItems(newCompletedItems);

      try {
        await toggleItemCompletion({ id: list._id, itemIndex });
      } catch (error) {
        console.error("Error toggling completion:", error);
        // Revert on error
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
        // Optimistic update
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
  const isItemCompleted = useCallback(
    (index: number) => {
      return optimisticCompletedItems.includes(index);
    },
    [optimisticCompletedItems]
  );

  const getItemDate = useCallback(
    (index: number) => {
      const dateTimestamp = list.itemDates?.[index.toString()];
      if (!dateTimestamp) return null;
      return new Date(dateTimestamp);
    },
    [list.itemDates]
  );

  // Render list items
  const renderItems = useMemo(
    () =>
      optimisticItems.map((item) => {
        const originalIndex = list.items.indexOf(item);
        return (
          <SortableItem
            key={item}
            id={item}
            item={item}
            index={originalIndex}
            completed={isItemCompleted(originalIndex)}
            itemDate={getItemDate(originalIndex)}
            isEditMode={isEditMode}
            onToggleCompletion={handleToggleCompletion}
            onDateSelect={handleDateSelect}
            onRemoveItem={handleRemoveItem}
            openDatePickerId={openDatePickerId}
            setOpenDatePickerId={setOpenDatePickerId}
          />
        );
      }),
    [
      optimisticItems,
      list.items,
      isEditMode,
      isItemCompleted,
      getItemDate,
      handleToggleCompletion,
      handleDateSelect,
      handleRemoveItem,
      openDatePickerId,
    ]
  );

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-300 bg-card/5 backdrop-blur-[2px] card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-serif">{list.title}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                Advanced
              </Badge>
            </div>
            {list.description && (
              <CardDescription>{list.description}</CardDescription>
            )}
          </div>
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={toggleEditMode}
            className="ml-2"
          >
            <Pencil className="h-4 w-4 mr-1" />
            {isEditMode ? "Done" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditMode ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={optimisticItems}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 w-full">{renderItems}</div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="space-y-2 w-full">{renderItems}</div>
        )}
        <div className="flex mt-4 w-full justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Updated: {formatRelativeTime(list.updatedAt)}
          </p>
          <div className="flex items-center">
            <CopyToClipboardButton
              textToCopy={list.items.join("\n")}
              variant="ghost"
              size="icon"
            />
            <ShareButton
              items={list.items}
              title={list.title}
              className="text-primary"
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="size-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this <span className="font-bold">totally biased</span> list
                    from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="dark:bg-red-450 dark:hover:bg-red-500 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdvancedListCard;
