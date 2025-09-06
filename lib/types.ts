export type HistoryItem = {
  items: string[];
  currentIndex: number;
  comparisonIndex: number;
};

export type ComparisonPanelState = {
  items: string[];
  currentIndex: number;
  comparisonIndex: number;
  history: HistoryItem[];
};
