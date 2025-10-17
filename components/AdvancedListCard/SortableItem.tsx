import React, { useCallback, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Check,
  CalendarPlus as CalendarIcon,
  GripVertical,
  Trash2 as TrashIcon,
  CalendarX2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { SortableItemProps } from "./types";
import { formatItemDate } from "./utils";

/**
 * Memoized SortableItem component for rendering individual list items
 * Optimized for performance with React.memo and useCallback hooks
 */
export const SortableItem = React.memo<SortableItemProps>(function SortableItem({
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
