import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Save or update comparison panel state for current user
export const saveState = mutation({
  args: {
    items: v.array(v.string()),
    currentIndex: v.number(),
    comparisonIndex: v.number(),
    history: v.array(
      v.object({
        items: v.array(v.string()),
        currentIndex: v.number(),
        comparisonIndex: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Check if user already has a state
    const existingState = await ctx.db
      .query("comparisonPanelStates")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (existingState) {
      // Update existing state
      return await ctx.db.patch(existingState._id, {
        items: args.items,
        currentIndex: args.currentIndex,
        comparisonIndex: args.comparisonIndex,
        history: args.history,
        updatedAt: Date.now(),
      });
    } else {
      // Create new state
      return await ctx.db.insert("comparisonPanelStates", {
        userId,
        items: args.items,
        currentIndex: args.currentIndex,
        comparisonIndex: args.comparisonIndex,
        history: args.history,
        updatedAt: Date.now(),
      });
    }
  },
});

// Get comparison panel state for current user
export const getState = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    return await ctx.db
      .query("comparisonPanelStates")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
  },
});

// Clear comparison panel state for current user
export const clearState = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingState = await ctx.db
      .query("comparisonPanelStates")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (existingState) {
      await ctx.db.delete(existingState._id);
      return true;
    }

    return false;
  },
});
