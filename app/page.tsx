"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

import SetupPanel from "@/components/SetupPanel";
import ComparisonPanel from "@/components/ComparisonPanel";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Home() {
  const [list, setList] = useState<string[]>([]);
  let currentPanel;
  if (list.length === 0) {
    currentPanel = <SetupPanel list={list} setList={setList} />;
  } else {
    currentPanel = <ComparisonPanel list={list} setList={setList} />;
  }

  return (
    <>
      <Authenticated>
        <p>Authenticated</p>
        <Content />
      </Authenticated>
      <Unauthenticated>
        <p>Unauthenticated</p>
      </Unauthenticated>
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

function Content() {
  const messages = useQuery(api.messages.getForCurrentUser);
  return <div>Authenticated content: {messages?.length}</div>;
}
