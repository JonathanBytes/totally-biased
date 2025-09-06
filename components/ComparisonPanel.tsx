"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

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
  unfinishedState?: {
    items: string[];
    currentIndex: number;
    comparisonIndex: number;
    history: any[];
  };
  onRankingComplete: (rankedList: string[]) => void;
}) => {
  const [items, setItems] = useState(
    unfinishedState ? unfinishedState.items : [...list],
  );
  const [currentIndex, setCurrentIndex] = useState(
    unfinishedState ? unfinishedState.currentIndex : 1,
  );
  const [comparisonIndex, setComparisonIndex] = useState(
    unfinishedState ? unfinishedState.comparisonIndex : 0,
  );
  const [history, setHistory] = useState<any[]>(
    unfinishedState ? unfinishedState.history : [],
  );

  useEffect(() => {
    // This effect runs when the list from props changes, but not if we are restoring a session.
    if (!unfinishedState) {
      if (list.length === 1) {
        toast.error("Please provide at least two items to compare.");
        setList([]);
      } else {
        setItems([...list]);
        setCurrentIndex(1);
        setComparisonIndex(0);
        setHistory([]);
      }
    }
  }, [list, setList, unfinishedState]);

  useEffect(() => {
    // This effect saves the current state to localStorage on every change.
    const stateToSave = { items, currentIndex, comparisonIndex, history };
    localStorage.setItem("comparisonPanelState", JSON.stringify(stateToSave));
  }, [items, currentIndex, comparisonIndex, history]);

  const handleChoice = (winner: "itemToInsert" | "comparisonItem") => {
    setHistory([...history, { items, currentIndex, comparisonIndex }]);
    let newItems = [...items];
    if (winner === "itemToInsert") {
      if (comparisonIndex > 0) {
        setComparisonIndex(comparisonIndex - 1);
        return;
      } else {
        const [item] = newItems.splice(currentIndex, 1);
        newItems.splice(0, 0, item);
      }
    } else {
      // winner === "comparisonItem"
      const [item] = newItems.splice(currentIndex, 1);
      newItems.splice(comparisonIndex + 1, 0, item);
    }

    if (currentIndex + 1 >= newItems.length) {
      onRankingComplete(newItems);
    } else {
      setItems(newItems);
      setCurrentIndex(currentIndex + 1);
      setComparisonIndex(currentIndex);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setItems(lastState.items);
      setCurrentIndex(lastState.currentIndex);
      setComparisonIndex(lastState.comparisonIndex);
      setHistory(history.slice(0, -1));
    }
  };

  if (list.length < 2) {
    return null;
  }

  const itemToInsert = items[currentIndex];
  const comparisonItem = items[comparisonIndex];

  const progress = (currentIndex / items.length) * 100;

  return (
    <div
      className={`${className} flex items-center flex-col max-w-2xl w-full`}
    >
      <h2 className="text-2xl text-left w-full">Which one do you prefer?</h2>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-4">
        <div
          className="bg-purple-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
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
