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
import { Check, Calendar as CalendarIcon, GripVertical, X } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
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

interface SortableItemProps {
  id: string;
  item: string;
  index: number;
  visualIndex: number;
  completed: boolean;
  itemDate: Date | null;
  onToggleCompletion: (index: number) => void;
  onDateSelect: (index: number, date: Date | undefined) => void;
  openDatePickerId: number | null;
  setOpenDatePickerId: (id: number | null) => void;
}

function SortableItem({
  id,
  item,
  index,
  visualIndex,
  completed,
  itemDate,
  onToggleCompletion,
  onDateSelect,
  openDatePickerId,
  setOpenDatePickerId,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM d, yyyy");
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors"
    >
      <button
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing touch-none p-2 -m-2 flex-shrink-0"
        aria-label="Drag to reorder"
        style={{ touchAction: 'none' }}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
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
      <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex-shrink-0">
        {visualIndex + 1}
      </Badge>
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-start gap-2 flex-wrap break-words">
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
      <div className="flex items-center gap-1">
        {itemDate && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onDateSelect(index, undefined)}
            title="Remove date"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
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
    </div>
  );
}

export function AdvancedListCard({
  list,
  handleDelete,
}: AdvancedListCardProps) {
  const [openDatePickerId, setOpenDatePickerId] = useState<number | null>(null);

  const toggleItemCompletion = useMutation(
    api.sortedLists.toggleItemCompletion
  );
  const updateItemDate = useMutation(api.sortedLists.updateItemDate);
  const reorderItems = useMutation(api.sortedLists.reorderItems);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleToggleCompletion = async (itemIndex: number) => {
    try {
      await toggleItemCompletion({ id: list._id, itemIndex });
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = list.items.indexOf(active.id as string);
      const newIndex = list.items.indexOf(over.id as string);

      const newItems = arrayMove(list.items, oldIndex, newIndex);

      try {
        await reorderItems({ id: list._id, newOrder: newItems });
      } catch (error) {
        console.error("Error reordering items:", error);
      }
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

  const isItemCompleted = (index: number) => {
    return list.completedItems?.includes(index) || false;
  };

  const getItemDate = (index: number) => {
    const dateTimestamp = list.itemDates?.[index.toString()];
    if (!dateTimestamp) return null;
    return new Date(dateTimestamp);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 bg-card/5 backdrop-blur-[2px] card">
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
        </div>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={list.items} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 w-full">
              {list.items.map((item, index) => (
                <SortableItem
                  key={item}
                  id={item}
                  item={item}
                  index={index}
                  visualIndex={index}
                  completed={isItemCompleted(index)}
                  itemDate={getItemDate(index)}
                  onToggleCompletion={handleToggleCompletion}
                  onDateSelect={handleDateSelect}
                  openDatePickerId={openDatePickerId}
                  setOpenDatePickerId={setOpenDatePickerId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
