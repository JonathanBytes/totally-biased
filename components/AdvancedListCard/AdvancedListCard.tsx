import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { AdvancedListCardProps } from "./types";
import { useAdvancedListCard } from "./useAdvancedListCard";
import { useDndSensors } from "./useDndSensors";
import { SortableItem } from "./SortableItem";
import { AdvancedListCardHeader } from "./AdvancedListCardHeader";
import { AdvancedListCardFooter } from "./AdvancedListCardFooter";

/**
 * Main AdvancedListCard component
 * Displays an advanced list with drag-and-drop, completion checkboxes, dates, and edit mode
 */
export function AdvancedListCard({ list, handleDelete }: AdvancedListCardProps) {
  const sensors = useDndSensors();
  
  const {
    openDatePickerId,
    setOpenDatePickerId,
    isEditMode,
    optimisticItems,
    handleDragEnd,
    handleToggleCompletion,
    handleDateSelect,
    handleRemoveItem,
    toggleEditMode,
    checkItemCompleted,
    getItemDateByIndex,
  } = useAdvancedListCard(list);

  // Render list items - memoized for performance
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
            completed={checkItemCompleted(originalIndex)}
            itemDate={getItemDateByIndex(originalIndex)}
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
      checkItemCompleted,
      getItemDateByIndex,
      handleToggleCompletion,
      handleDateSelect,
      handleRemoveItem,
      openDatePickerId,
      setOpenDatePickerId,
    ]
  );

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-300 bg-card/5 backdrop-blur-[2px] card">
      <AdvancedListCardHeader
        title={list.title}
        description={list.description}
        isEditMode={isEditMode}
        onToggleEditMode={toggleEditMode}
      />
      
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
        
        <AdvancedListCardFooter
          items={list.items}
          title={list.title}
          updatedAt={list.updatedAt}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
}

export default AdvancedListCard;
