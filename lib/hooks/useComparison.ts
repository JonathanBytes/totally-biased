import { useState, useEffect } from "react";
import { toast } from "sonner";
import { HistoryItem, ComparisonPanelState } from "@/lib/types";

export const useComparison = (
  list: string[],
  setList: (list: string[]) => void,
  onRankingComplete: (rankedList: string[]) => void,
  unfinishedState?: ComparisonPanelState,
) => {
  const [items, setItems] = useState(
    unfinishedState ? unfinishedState.items : [...list],
  );
  const [currentIndex, setCurrentIndex] = useState(
    unfinishedState ? unfinishedState.currentIndex : 1,
  );
  const [comparisonIndex, setComparisonIndex] = useState(
    unfinishedState ? unfinishedState.comparisonIndex : 0,
  );
  const [history, setHistory] = useState<HistoryItem[]>(
    unfinishedState ? unfinishedState.history : [],
  );

  useEffect(() => {
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
    const stateToSave = { items, currentIndex, comparisonIndex, history };
    localStorage.setItem("comparisonPanelState", JSON.stringify(stateToSave));
  }, [items, currentIndex, comparisonIndex, history]);

  const handleChoice = (winner: "itemToInsert" | "comparisonItem") => {
    setHistory([...history, { items, currentIndex, comparisonIndex }]);
    const newItems = [...items];
    if (winner === "itemToInsert") {
      if (comparisonIndex > 0) {
        setComparisonIndex(comparisonIndex - 1);
        return;
      } else {
        const [item] = newItems.splice(currentIndex, 1);
        newItems.splice(0, 0, item);
      }
    } else {
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

  return {
    items,
    currentIndex,
    itemToInsert: items[currentIndex],
    comparisonItem: items[comparisonIndex],
    progress: items.length > 0 ? (currentIndex / items.length) * 100 : 0,
    history,
    handleChoice,
    handleUndo,
  };
};
