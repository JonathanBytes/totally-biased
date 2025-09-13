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

    const userLists = await ctx.db
      .query("sortedLists")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    const MAX_LISTS_PER_USER = 10;

    if (userLists.length >= MAX_LISTS_PER_USER) {
      throw new Error(
        `You have reached the maximum of ${MAX_LISTS_PER_USER} saved lists.`,
      );
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
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    // Sort by updatedAt descending (last updated first)
    return lists.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

// Delete a sorted list
export const deleteList = mutation({
  args: { id: v.id("sortedLists") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const list = await ctx.db.get(args.id);

    if (list === null) {
      throw new Error("List not found");
    }

    if (list.userId !== identity.subject) {
      throw new Error("Not authorized to delete this list");
    }

    await ctx.db.delete(args.id);
  },
});
