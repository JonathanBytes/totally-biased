"use client";

import React, { useState } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface SetupPanelProps {
  className?: string;
  list: string[];
  setList: (list: string[]) => void;
}

const SetupPanel: React.FC<SetupPanelProps> = (
  { className, list, setList },
) => {
  const [inputValue, setInputValue] = useState<string>("");

  function handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const input = event.target.value;
    setInputValue(input);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      handleStartClick();
    }
  }

  function handleStartClick() {
    const processedItems = inputValue.split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((item) =>
        item.split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );

    // Remove duplicates (case-insensitive)
    const uniqueItemsMap = new Map();
    processedItems.forEach((item) => {
      const lowerItem = item.toLowerCase();
      if (!uniqueItemsMap.has(lowerItem)) {
        uniqueItemsMap.set(lowerItem, item);
      }
    });

    const uniqueItems = Array.from(uniqueItemsMap.values());
    console.log("Parsed items:", uniqueItems);

    if (uniqueItems.length < 2) {
      toast.error("Please provide at least two unique items to compare.");
      setList([]);
    } else {
      setList(uniqueItems);
    }
  }

  return (
    <div className={`${className} flex items-center flex-col max-w-2xl`}>
      <p className="text-left w-full">
        Totally biased is a{" "}
        <span className="font-mono text-sm dark:bg-neutral-700 dark:text-neutral-300 bg-cyan-400 text-neutral-700 rounded px-1 size-0.5">
          subjective sort
        </span>{" "}
        app to rank by taste, bias, and gut instinct. The list should be
        separated by comas (<span className="font-extrabold px-1">,</span>){" "}
        or by new lines.
      </p>
      <div className="w-4/5 mt-4">
        <Label htmlFor="item-list" className="mb-2">
          Type your list to rank
        </Label>
        <Textarea
          className="mb-2"
          id="item-list"
          placeholder={list.length > 0 ? `${list}` : `Apple, Banana, Orange`}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="flex justify-end">
          <Button className="w-fit" type="submit" onClick={handleStartClick}>
            Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetupPanel;
