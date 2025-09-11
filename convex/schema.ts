import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Your existing tables would be here

  // Table for sorted lists
  sortedLists: defineTable({
    // User who created this list
    userId: v.string(),
    // Name/title of the list
    title: v.string(),
    // Description (optional)
    description: v.optional(v.string()),
    // The actual sorted items (limited to 100 items)
    items: v.array(v.string()),
    // Last updated timestamp
    updatedAt: v.number(),
  }),

  // Table for in-progress comparison panel state
  comparisonPanelStates: defineTable({
    // User who owns this state
    userId: v.string(),
    // Current items being sorted
    items: v.array(v.string()),
    // Current item index
    currentIndex: v.number(),
    // Comparison item index
    comparisonIndex: v.number(),
    // History of previous states during the sorting process
    history: v.array(
      v.object({
        items: v.array(v.string()),
        currentIndex: v.number(),
        comparisonIndex: v.number(),
      })
    ),
    // Last updated timestamp
    updatedAt: v.number(),
  }),
});
