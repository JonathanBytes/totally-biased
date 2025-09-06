"use client";

import { Button } from "./ui/button";

const ResultsPanel = ({
  className,
  list,
  setList,
}: {
  className?: string;
  list: string[];
  setList: (list: string[]) => void;
}) => {
  return (
    <div
      className={`${className} flex items-center flex-col max-w-2xl w-full`}
    >
      <h2 className="text-2xl text-left w-full">
        Here is your ranked list:
      </h2>
      <ol className="text-left w-full list-decimal list-inside my-4">
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
      <Button onClick={() => setList([])}>Start Over</Button>
    </div>
  );
};

export default ResultsPanel;