"use client";

import { Button } from "./ui/button";
import { useComparison } from "@/lib/hooks/useComparison";
import { ComparisonPanelState } from "@/lib/types";
import { AnimatePresence } from "framer-motion";
import ComparisonButton from "./ComparisonButton";

const ComparisonPanel = ({
  className,
  list,
  setList,
  unfinishedState,
  onRankingComplete,
}: {
  className?: string;
  list: string[];
  setList: (list: string[]) => void;
  unfinishedState?: ComparisonPanelState;
  onRankingComplete: (rankedList: string[]) => void;
}) => {
  const {
    items,
    currentIndex,
    itemToInsert,
    comparisonItem,
    progress,
    history,
    handleChoice,
    handleUndo,
  } = useComparison(list, setList, onRankingComplete, unfinishedState);

  if (list.length < 2) {
    return null;
  }

  return (
    <div
      className={`${className} flex items-center flex-col max-w-2xl w-full md:min-w-[500px]`}
    >
      <h2 className="text-2xl text-left w-full font-serif">
        Which one do you prefer?
      </h2>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-4">
        <div
          className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-around w-full my-4">
        <AnimatePresence mode="wait">
          <ComparisonButton
            key={itemToInsert}
            onClick={() => handleChoice("itemToInsert")}
            itemKey={itemToInsert}
            direction="left"
          >
            {itemToInsert}
          </ComparisonButton>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <ComparisonButton
            key={comparisonItem}
            onClick={() => handleChoice("comparisonItem")}
            itemKey={comparisonItem}
            direction="right"
          >
            {comparisonItem}
          </ComparisonButton>
        </AnimatePresence>
      </div>
      <p className="text-left w-full">
        Sorted items: {items.slice(0, currentIndex).join(", ")}
      </p>
      <div className="flex gap-4 mt-4">
        <Button onClick={() => setList([])}>Reset List</Button>
        <Button onClick={handleUndo} disabled={history.length === 0}>
          Undo
        </Button>
      </div>
    </div>
  );
};

export default ComparisonPanel;
