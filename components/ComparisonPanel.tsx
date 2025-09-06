"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

const ComparisonPanel = ({
  className,
  list,
  setList,
  onRankingComplete,
}: {
  className?: string;
  list: string[];
  setList: (list: string[]) => void;
  onRankingComplete: (rankedList: string[]) => void;
}) => {
  const [items, setItems] = useState([...list]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [comparisonIndex, setComparisonIndex] = useState(0);

  useEffect(() => {
    if (list.length === 1) {
      toast.error("Please provide at least two items to compare.");
      setList([]);
    } else {
      setItems([...list]);
      setCurrentIndex(1);
      setComparisonIndex(0);
    }
  }, [list, setList]);

  const handleChoice = (winner: "itemToInsert" | "comparisonItem") => {
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

  if (list.length < 2) {
    return null;
  }

  const itemToInsert = items[currentIndex];
  const comparisonItem = items[comparisonIndex];

  return (
    <div
      className={`${className} flex items-center flex-col max-w-2xl w-full`}
    >
      <h2 className="text-2xl text-left w-full">Which one do you prefer?</h2>
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
      <Button onClick={() => setList([])} className="mt-4">
        Reset List
      </Button>
    </div>
  );
};

export default ComparisonPanel;

