"use client";

import ListCard from "@/components/ListCard";
import { api } from "../../convex/_generated/api";
import { useQuery, Authenticated } from "convex/react";

const ListPage = () => {
  return (
    <div>
      <h1>List page</h1>
      <Authenticated>
        <Content />
      </Authenticated>
    </div>
  );
};

export default ListPage;

function Content() {
  const lists = useQuery(api.sortedLists.getForCurrentUserByUpdatedAt);
  console.log("lists", lists);
  if (!lists) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h2>Your lists:</h2>
      <ul className="flex flex-wrap gap-4 justify-center">
        {lists.map((list) => (
          <li key={list._id} className="min-w-[300px] ">
            <ListCard list={list} />
          </li>
        ))}
      </ul>
    </div>
  );
}
