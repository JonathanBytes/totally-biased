"use client";

import { Authenticated, Unauthenticated } from "convex/react";

import { Button } from "./ui/button";
import { useState } from "react";
import Link from "next/link";
import SaveListDrawer from "./SaveListDrawer";
import { CopyToClipboardButton } from "./CopyToClipboardButton";

const ResultsPanel = ({
  className,
  list,
  setList,
  isSharedRankedList = false,
  onStartRanking,
}: {
  className?: string;
  list: string[];
  setList: (list: string[]) => void;
  isSharedRankedList?: boolean;
  onStartRanking?: () => void;
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div
      className={`${className} flex items-center flex-col max-w-2xl w-full md:min-w-[500px]}`}
    >
      <div className="flex justify-between w-full items-center flex-wrap gap-4">
        <h2 className="text-2xl text-left">
          {isSharedRankedList ? (
            <>
              Here is a <span className="font-bold">totally biased</span> list:
            </>
          ) : (
            <>
              Here is your <span className="font-bold">totally biased</span>{" "}
              list:
            </>
          )}
        </h2>
        <CopyToClipboardButton
          textToCopy={list.join("\n")}
          buttonText="Copy"
          variant="outline"
          size="sm"
          className="cursor-pointer bg-card/5 backdrop-blur-xs card"
        />
      </div>
      <ol className="text-left w-full list-decimal list-inside my-4">
        {list.map((item, index) => <li key={index}>{item}</li>)}
      </ol>
      <div className="flex gap-4 w-full justify-end flex-wrap">
        {isSharedRankedList && onStartRanking ? (
          <Button variant="default" size="sm" onClick={onStartRanking}>
            Rank this list
          </Button>
        ) : (
          <>
            <Authenticated>
              <SaveListDrawer
                list={list}
                isOpen={isDrawerOpen}
                onClose={() => {
                  setIsDrawerOpen(false);
                }}
                hideTrigger
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsDrawerOpen(true)}
              >
                Save list to your account
              </Button>
            </Authenticated>
            <Unauthenticated>
              <Link href="/sign-in?redirect_url=/lists">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    localStorage.setItem("unsavedList", JSON.stringify(list));
                  }}
                >
                  Save list to your account
                </Button>
              </Link>
            </Unauthenticated>
            <Button size="sm" onClick={() => setList([])}>
              Start Over
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;

