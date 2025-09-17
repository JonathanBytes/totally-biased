"use client";

import ListCard from "@/components/ListCard";
import { api } from "../../convex/_generated/api";
import { Authenticated, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import SaveListDrawer from "@/components/SaveListDrawer";
import { BreadcrumbSchema } from "@/components/BreadcrumbSchema";

const ListPage = () => {
  const breadcrumbItems = [
    { name: "Home", url: "https://rank.jonathanbytes.com" },
    { name: "My Lists" },
  ];

  return (
    <div>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Authenticated>
        <Content />
      </Authenticated>
    </div>
  );
};

export default ListPage;

function Content() {
  const lists = useQuery(api.sortedLists.getForCurrentUserByUpdatedAt);
  const [unsavedList, setUnsavedList] = useState<string[] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const storedList = localStorage.getItem("unsavedList");
    if (storedList) {
      setUnsavedList(JSON.parse(storedList));
      setIsDrawerOpen(true);
    }
  }, []);

  if (!lists) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {unsavedList && (
        <SaveListDrawer
          list={unsavedList}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            localStorage.removeItem("unsavedList");
          }}
          hideTrigger
        />
      )}
      <ul className="flex flex-wrap gap-4 justify-center items-center max-w-5xl">
        {lists.map((list) => (
          <li key={list._id} className="min-w-[250px]">
            <ListCard list={list} />
          </li>
        ))}
      </ul>
    </div>
  );
}
