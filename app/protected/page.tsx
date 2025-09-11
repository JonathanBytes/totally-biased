"use client";

import { useConvexAuth } from "convex/react";

export default function ProtectedPage() {
  const isAuth = useConvexAuth();
  console.log("isAuth", isAuth);
  return (
    <div>
      <h1>Protected Page</h1>
    </div>
  );
}
