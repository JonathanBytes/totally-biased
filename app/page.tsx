"use client";

import { useEffect, useState } from "react";

import SetupPanel from "@/components/SetupPanel";
import ComparisonPanel from "@/components/ComparisonPanel";
import ResultsPanel from "@/components/ResultsPanel";

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
  const [unfinishedComparison, setUnfinishedComparison] = useState<
    ComparisonPanelState | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [urlItems, setUrlItems] = useState<string[]>([]);

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
          e
        );
        localStorage.removeItem("comparisonPanelState");
      }
    }

    // Check for URL parameters
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      // Support new shorter format (#i=)
      if (hash.startsWith("#i=")) {
        try {
          const encodedItems = hash.substring(3); // Remove "#i="
          // Convert URL-safe Base64 back to regular Base64
          const base64 = encodedItems.replace(/-/g, "+").replace(/_/g, "/");
          // Add padding if needed
          const paddedBase64 =
            base64 + "=".repeat((4 - (base64.length % 4)) % 4);
          const jsonString = atob(paddedBase64);
          const decodedData = JSON.parse(jsonString);

          // Handle format with ranked flag
          if (
            typeof decodedData === "object" &&
            decodedData.items &&
            Array.isArray(decodedData.items)
          ) {
            if (decodedData.items.length > 0) {
              setUrlItems(decodedData.items);
              setList(decodedData.items);
              if (decodedData.ranked) {
                setIsRanked(true);
              }
            }
          }
        } catch (e) {
          console.error("Failed to parse items from URL", e);
        }
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
