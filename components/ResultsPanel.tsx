"use client";

import { ClipboardCheck, ClipboardCopy } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";

const ResultsPanel = ({
  className,
  list,
  setList,
}: {
  className?: string;
  list: string[];
  setList: (list: string[]) => void;
}) => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(list.join("\n"));
    setCopied(true);
    toast.success("Copied to clipboard!");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      className={`${className} flex items-center flex-col max-w-2xl w-full`}
    >
      <div className="flex justify-between w-full items-center">
        <h2 className="text-2xl text-left">Here is your ranked list:</h2>
        <Button onClick={onCopy} variant="ghost" size="icon">
          {copied
            ? <ClipboardCheck className="size-5" />
            : <ClipboardCopy className="size-5" />}
        </Button>
      </div>
      <ol className="text-left w-full list-decimal list-inside my-4">
        {list.map((item, index) => <li key={index}>{item}</li>)}
      </ol>
      <Button onClick={() => setList([])}>Start Over</Button>
    </div>
  );
};

export default ResultsPanel;
