"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";

const ComparisonPanel = (
  { className, list, setList }: {
    className?: string;
    list: string[];
    setList: (list: string[]) => void;
  },
) => {
  if (list.length < 2) {
    setList([]);
    toast.error("Please provide at least two items to compare.");
    return;
  }
  return (
    <div
      className={`${className} flex items-center flex-col max-w-2xl w-full`}
    >
      <h2 className="text-2xl text-left w-full">Comparison panel:</h2>
      <p className="text-left w-full">Your list: {list.join(", ")}</p>
      <Button onClick={() => setList([])}>Reset List</Button>
    </div>
  );
};

export default ComparisonPanel;
