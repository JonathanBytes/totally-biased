"use client";

import { Button } from "./ui/button";
import { useComparison } from "@/lib/hooks/useComparison";
import { ComparisonPanelState } from "@/lib/types";

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
        >
        </div>
      </div>
      <div className="flex justify-around w-full my-4">
        <Button
          onClick={() => handleChoice("itemToInsert")}
          className="w-2/5 h-24 text-xl whitespace-normal break-words"
        >
          {itemToInsert}
        </Button>
        <Button
          onClick={() => handleChoice("comparisonItem")}
          className="w-2/5 h-24 text-xl whitespace-normal break-words"
        >
          {comparisonItem}
        </Button>
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
