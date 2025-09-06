"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useState } from "react";

import SetupPanel from "@/components/SetupPanel";
import ComparisonPanel from "@/components/ComparisonPanel";
import ResultsPanel from "@/components/ResultsPanel";
// import { Authenticated, Unauthenticated } from "convex/react";

export default function Home() {
  type ComparisonPanelState = {
    items: string[];
    currentIndex: number;
    comparisonIndex: number;
    history: any[];
  };

  const [list, setList] = useState<string[]>([]);
  const [isRanked, setIsRanked] = useState(false);
  const [unfinishedComparison, setUnfinishedComparison] = useState<
    ComparisonPanelState | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("comparisonPanelState");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ComparisonPanelState;
        setUnfinishedComparison(parsed);
        setList(parsed.items);
      } catch (e) {
        console.error(
          "Failed to parse comparisonPanelState from localStorage",
          e,
        );
        localStorage.removeItem("comparisonPanelState");
      }
    }
    setIsLoading(false);
  }, []);

  const handleSetList = (newList: string[]) => {
    setList(newList);
    setIsRanked(false);
    setUnfinishedComparison(undefined);
    localStorage.removeItem("comparisonPanelState");
  };

  const handleRankingComplete = (rankedList: string[]) => {
    setList(rankedList);
    setIsRanked(true);
    setUnfinishedComparison(undefined);
    localStorage.removeItem("comparisonPanelState");
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  let currentPanel;
  if (isRanked) {
    currentPanel = <ResultsPanel list={list} setList={handleSetList} />;
  } else if (unfinishedComparison) {
    currentPanel = (
      <ComparisonPanel
        list={unfinishedComparison.items}
        setList={handleSetList}
        unfinishedState={unfinishedComparison}
        onRankingComplete={handleRankingComplete}
      />
    );
  } else if (list.length === 0) {
    currentPanel = <SetupPanel list={list} setList={handleSetList} />;
  } else {
    currentPanel = (
      <ComparisonPanel
        list={list}
        setList={handleSetList}
        onRankingComplete={handleRankingComplete}
      />
    );
  }

  return (
    <>
      {/* <Authenticated> */}
      {/*   <p>Authenticated</p> */}
      {/*   <Content /> */}
      {/* </Authenticated> */}
      {/* <Unauthenticated> */}
      {/*   <p>Unauthenticated</p> */}
      {/* </Unauthenticated> */}
      <main className="flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-7xl font-bold text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-cyan-500">
            Totally biased
          </span>
        </h1>
        {currentPanel}
      </main>
    </>
  );
}

// function Content() {
//   const messages = useQuery(api.messages.getForCurrentUser);
//   return <div>Authenticated content: {messages?.length}</div>;
// }
