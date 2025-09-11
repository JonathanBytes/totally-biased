"use client";

import { Authenticated, Unauthenticated } from "convex/react";

import { ClipboardCheck, ClipboardCopy } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import SaveListDrawer from "./SaveListDrawer";

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
      className={`${className} flex items-center flex-col max-w-2xl w-full md:min-w-[500px]`}
    >
      <div className="flex justify-between w-full items-center flex-wrap gap-4">
        <h2 className="text-2xl text-left">Here is your ranked list:</h2>
        <Button onClick={onCopy} variant="outline" size="sm">
          {copied ? (
            <ClipboardCheck className="size-4" />
          ) : (
            <ClipboardCopy className="size-4" />
          )}{" "}
          Copy
        </Button>
      </div>
      <ol className="text-left w-full list-decimal list-inside my-4">
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
      <div className="flex gap-4 w-full justify-end">
        <Authenticated>
          <SaveListDrawer list={list} />
        </Authenticated>
        <Unauthenticated>
          {/* This should store the list while the user logs in or signs up, currently deletes the list*/}
          <Link href="/login">
            <Button variant="secondary" size="sm">
              Save list to your account
            </Button>
          </Link>
        </Unauthenticated>
        <Button size="sm" onClick={() => setList([])}>
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default ResultsPanel;
