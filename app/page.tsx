"use client";

import { useEffect, useState } from "react";

import SetupPanel from "@/components/SetupPanel";
import ComparisonPanel from "@/components/ComparisonPanel";
import ResultsPanel from "@/components/ResultsPanel";
import { decodeSharedList } from "@/lib/shareLink";

export default function Home() {
  type HistoryItem = {
    items: string[];
    currentIndex: number;
    comparisonIndex: number;
  };

  type ComparisonPanelState = {
    items: string[];
    currentIndex: number;
    comparisonIndex: number;
    history: HistoryItem[];
  };

  const [list, setList] = useState<string[]>([]);
  const [isRanked, setIsRanked] = useState(false);
  const [isSharedRankedList, setIsSharedRankedList] = useState(false);
  const [unfinishedComparison, setUnfinishedComparison] = useState<
    ComparisonPanelState | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [urlItems, setUrlItems] = useState<string[]>([]);

  /* eslint-disable react-hooks/set-state-in-effect -- one-time mount read of browser-only state (URL hash, localStorage); must run after hydration */
  useEffect(() => {
    // Check for URL parameters
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      // Support new shorter format (#i=)
      if (hash.startsWith("#i=")) {
        try {
          const shared = decodeSharedList(hash.substring(3)); // Remove "#i="
          if (shared) {
            setUrlItems(shared.items);
            if (shared.ranked) {
              setList(shared.items);
              setIsRanked(true);
              setIsSharedRankedList(true);
            }
          }
        } catch (e) {
          console.error("Failed to parse items from URL", e);
        }
      }
    }

    // Check localStorage for unfinished comparison on mount
    const raw = localStorage.getItem("comparisonPanelState");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ComparisonPanelState;
        setUnfinishedComparison(parsed);
        setList(parsed.items);
      } catch (e) {
        console.error(
          "Failed to parse comparisonPanelState from localStorage",
          e
        );
        localStorage.removeItem("comparisonPanelState");
      }
    }

    setIsLoading(false);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSetList = (newList: string[]) => {
    setList(newList);
    setUrlItems([]);
    setIsRanked(false);
    setIsSharedRankedList(false);
    setUnfinishedComparison(undefined);
    localStorage.removeItem("comparisonPanelState");
  };

  const handleRankingComplete = (rankedList: string[]) => {
    setList(rankedList);
    setIsRanked(true);
    setIsSharedRankedList(false);
    setUnfinishedComparison(undefined);
    localStorage.removeItem("comparisonPanelState");
  };

  const handleStartRankingSharedList = () => {
    // Keep the items but allow user to rank them
    setIsRanked(false);
    setIsSharedRankedList(false);
    // The list items are already set, just need to start comparison
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  let currentPanel;
  if (isRanked) {
    currentPanel = (
      <ResultsPanel
        list={list}
        setList={handleSetList}
        isSharedRankedList={isSharedRankedList}
        onStartRanking={handleStartRankingSharedList}
      />
    );
  } else if (unfinishedComparison) {
    currentPanel = (
      <ComparisonPanel
        list={unfinishedComparison.items}
        setList={handleSetList}
        unfinishedState={unfinishedComparison}
        onRankingComplete={handleRankingComplete}
      />
    );
  } else if (urlItems.length > 0) {
    currentPanel = <SetupPanel setList={handleSetList} urlItems={urlItems} />;
  } else if (list.length === 0) {
    currentPanel = <SetupPanel setList={handleSetList} urlItems={urlItems} />;
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
      <section>
        <h1 className="text-7xl font-bold text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-cyan-500">
            Totally biased
          </span>
        </h1>
      </section>
      <section>{currentPanel}</section>
    </>
  );
}
