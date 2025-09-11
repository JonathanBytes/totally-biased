import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new sorted list
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    items: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    if (args.items.length > 100) {
      throw new Error("List cannot contain more than 100 items");
    }

    return await ctx.db.insert("sortedLists", {
      userId: identity.subject,
      title: args.title,
      description: args.description,
      items: args.items,
      updatedAt: Date.now(),
    });
  },
});

// Get all sorted lists for the current user
export const getForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("sortedLists")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      // By default Convex always returns documents ordered by _creationTime. (newest first in this case)
      .order("desc")
      .collect();
  },
});

// Get all sorted lists for the current user, ordered by updatedAt
export const getForCurrentUserByUpdatedAt = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const lists = await ctx.db
      .query("sortedLists")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .collect();

    // Sort by updatedAt descending (last updated first)
    return lists.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});
