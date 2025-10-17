import React, { MouseEventHandler, useState } from "react";
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
import { Check, CalendarPlus as CalendarIcon, GripVertical, Pencil, Trash2 as TrashIcon, CalendarX2 } from "lucide-react";
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
import { Trash2 } from "lucide-react";
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

function SortableItem({
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
}: ItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy");
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors w-full"
    >
      {/* Modo Editar: Handle */}
      {isEditMode && (
        <button
          ref={setActivatorNodeRef}
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing touch-none p-1 -m-1 flex-shrink-0"
          aria-label="Drag to reorder"
          style={{ touchAction: 'none' }}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      )}

      {/* Modo Normal: Checkbox */}
      {!isEditMode && (
        <button
          onClick={() => onToggleCompletion(index)}
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

      <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex-shrink-0">
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
            {formatDate(itemDate)}
            </span>
          )}
        </div>
      </div>

      {/* Modo Normal: Botones de fecha */}
      {!isEditMode && (
        <div className="flex items-center gap-1">
          <Popover
            open={openDatePickerId === index}
            onOpenChange={(open) => setOpenDatePickerId(open ? index : null)}
          >
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
                onSelect={(date) => onDateSelect(index, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Modo Editar: Botones de fecha y eliminar */}
      {isEditMode && (
        <div className="flex items-center gap-0.5">
          {itemDate && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onDateSelect(index, undefined)}
              title="Remove date"
            >
              <CalendarX2 className="h-3 w-3" />
            </Button>
          )}
          <Popover
            open={openDatePickerId === index}
            onOpenChange={(open) => setOpenDatePickerId(open ? index : null)}
          >
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
                onSelect={(date) => onDateSelect(index, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={() => onRemoveItem(index)}
            title="Delete item"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function AdvancedListCard({
  list,
  handleDelete,
}: AdvancedListCardProps) {
  const [openDatePickerId, setOpenDatePickerId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  // Optimistic state for instant UI updates
  const [optimisticItems, setOptimisticItems] = useState<string[]>(list.items);

  const toggleItemCompletion = useMutation(
    api.sortedLists.toggleItemCompletion
  );
  const updateItemDate = useMutation(api.sortedLists.updateItemDate);
  const reorderItems = useMutation(api.sortedLists.reorderItems);
  const removeItem = useMutation(api.sortedLists.removeItem);

  // Sensors configured for optimal mobile performance
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before activating
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms press delay for scrolling
        tolerance: 8, // 8px movement tolerance during delay
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sync optimistic state when list.items changes from server
  React.useEffect(() => {
    setOptimisticItems(list.items);
  }, [list.items]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = optimisticItems.indexOf(active.id as string);
      const newIndex = optimisticItems.indexOf(over.id as string);

      // Optimistic update: Update UI immediately
      const newItems = arrayMove(optimisticItems, oldIndex, newIndex);
      setOptimisticItems(newItems);

      // Then sync with database
      try {
        await reorderItems({ id: list._id, newOrder: newItems });
      } catch (error) {
        console.error("Error reordering items:", error);
        // Revert on error
        setOptimisticItems(list.items);
      }
    }
  };

  const handleToggleCompletion = async (itemIndex: number) => {
    try {
      await toggleItemCompletion({ id: list._id, itemIndex });
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const handleDateSelect = async (itemIndex: number, date: Date | undefined) => {
    try {
      if (date) {
        await updateItemDate({
          id: list._id,
          itemIndex,
          date: date.getTime(),
        });
      } else {
        // Remove date
        await updateItemDate({
          id: list._id,
          itemIndex,
          date: undefined,
        });
      }
      setOpenDatePickerId(null);
    } catch (error) {
      console.error("Error updating date:", error);
    }
  };

  const handleRemoveItem = async (itemIndex: number) => {
    try {
      // Optimistic update: remove item from local state immediately
      const newItems = optimisticItems.filter((_, index) => {
        const originalIndex = list.items.indexOf(optimisticItems[index]);
        return originalIndex !== itemIndex;
      });
      setOptimisticItems(newItems);

      // Sync with database
      await removeItem({ id: list._id, itemIndex });
    } catch (error) {
      console.error("Error removing item:", error);
      // Revert on error
      setOptimisticItems(list.items);
    }
  };

  const isItemCompleted = (index: number) => {
    return list.completedItems?.includes(index) || false;
  };

  const getItemDate = (index: number) => {
    const dateTimestamp = list.itemDates?.[index.toString()];
    if (!dateTimestamp) return null;
    return new Date(dateTimestamp);
  };

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
            onClick={() => setIsEditMode(!isEditMode)}
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
              <div className="space-y-2 w-full">
                {optimisticItems.map((item) => {
                  // Find the original index for completion/date state
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
                })}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="space-y-2 w-full">
            {optimisticItems.map((item) => {
              // Find the original index for completion/date state
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
            })}
          </div>
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
