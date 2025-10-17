import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new sorted list
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    items: v.array(v.string()),
    listType: v.union(v.literal("basic"), v.literal("advanced")),
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
      listType: args.listType,
      completedItems: args.listType === "advanced" ? [] : undefined,
      itemDates: args.listType === "advanced" ? {} : undefined,
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

// Convert a basic list to advanced
export const convertToAdvanced = mutation({
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
      throw new Error("Not authorized to modify this list");
    }

    if (list.listType === "advanced") {
      throw new Error("List is already advanced");
    }

    await ctx.db.patch(args.id, {
      listType: "advanced",
      completedItems: [],
      itemDates: {},
      updatedAt: Date.now(),
    });
  },
});

// Toggle item completion (advanced lists only)
export const toggleItemCompletion = mutation({
  args: {
    id: v.id("sortedLists"),
    itemIndex: v.number(),
  },
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
      throw new Error("Not authorized to modify this list");
    }

    if (list.listType !== "advanced") {
      throw new Error("Only advanced lists support completion tracking");
    }

    const completedItems = list.completedItems || [];
    const index = completedItems.indexOf(args.itemIndex);

    if (index > -1) {
      // Item is completed, remove it
      completedItems.splice(index, 1);
    } else {
      // Item is not completed, add it
      completedItems.push(args.itemIndex);
    }

    await ctx.db.patch(args.id, {
      completedItems,
      updatedAt: Date.now(),
    });
  },
});

// Update item date (advanced lists only)
export const updateItemDate = mutation({
  args: {
    id: v.id("sortedLists"),
    itemIndex: v.number(),
    date: v.optional(v.number()), // timestamp, undefined to remove
  },
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
      throw new Error("Not authorized to modify this list");
    }

    if (list.listType !== "advanced") {
      throw new Error("Only advanced lists support dates");
    }

    const itemDates = (list.itemDates as Record<string, number>) || {};

    if (args.date === undefined) {
      // Remove the date
      delete itemDates[args.itemIndex.toString()];
    } else {
      // Set or update the date
      itemDates[args.itemIndex.toString()] = args.date;
    }

    await ctx.db.patch(args.id, {
      itemDates: itemDates,
      updatedAt: Date.now(),
    });
  },
});

// Reorder items (advanced lists only)
export const reorderItems = mutation({
  args: {
    id: v.id("sortedLists"),
    newOrder: v.array(v.string()),
  },
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
      throw new Error("Not authorized to modify this list");
    }

    if (list.listType !== "advanced") {
      throw new Error("Only advanced lists support reordering");
    }

    if (args.newOrder.length !== list.items.length) {
      throw new Error("New order must contain all items");
    }

    // Verify all items are present
    const oldItemsSet = new Set(list.items);
    const newItemsSet = new Set(args.newOrder);
    if (oldItemsSet.size !== newItemsSet.size) {
      throw new Error("Items mismatch");
    }
    for (const item of args.newOrder) {
      if (!oldItemsSet.has(item)) {
        throw new Error("Items mismatch");
      }
    }

    // Remap completedItems and itemDates to match new order
    const newCompletedItems: number[] = [];
    const newItemDates: Record<string, number> = {};

    // Create a mapping from old item to old index
    const oldItemToIndex = new Map<string, number>();
    list.items.forEach((item, index) => {
      oldItemToIndex.set(item, index);
    });

    // For each item in the new order, check if it was completed or had a date
    args.newOrder.forEach((item, newIndex) => {
      const oldIndex = oldItemToIndex.get(item);
      if (oldIndex !== undefined) {
        // Check if this item was completed at its old position
        if (list.completedItems?.includes(oldIndex)) {
          newCompletedItems.push(newIndex);
          console.log(`Item "${item}" was completed at old index ${oldIndex}, now at ${newIndex}`);
        }
        // Check if this item had a date at its old position
        const itemDatesObj = list.itemDates as Record<string, number> | undefined;
        const oldDate = itemDatesObj?.[oldIndex.toString()];
        if (oldDate !== undefined) {
          newItemDates[newIndex.toString()] = oldDate;
          console.log(`Item "${item}" had date at old index ${oldIndex}, now at ${newIndex}`);
        }
      }
    });

    console.log('Old items:', list.items);
    console.log('New items:', args.newOrder);
    console.log('Old completedItems:', list.completedItems);
    console.log('New completedItems:', newCompletedItems);
    console.log('Old itemDates:', list.itemDates);
    console.log('New itemDates:', newItemDates);

    await ctx.db.patch(args.id, {
      items: args.newOrder,
      completedItems: newCompletedItems,
      itemDates: newItemDates,
      updatedAt: Date.now(),
    });
  },
});

// Remove an item from a list
export const removeItem = mutation({
  args: { id: v.id("sortedLists"), itemIndex: v.number() },
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
      throw new Error("Not authorized to modify this list");
    }

    // Remove the item at the specified index
    const newItems = list.items.filter((_, index) => index !== args.itemIndex);

    // Update completedItems: remove the index and adjust remaining indices
    const newCompletedItems = (list.completedItems || [])
      .filter(index => index !== args.itemIndex)
      .map(index => index > args.itemIndex ? index - 1 : index);

    // Update itemDates: remove the date and adjust remaining indices
    const oldItemDates = list.itemDates as Record<string, number> | undefined;
    const newItemDates: Record<string, number> = {};
    
    if (oldItemDates) {
      Object.entries(oldItemDates).forEach(([indexStr, date]) => {
        const index = parseInt(indexStr);
        if (index !== args.itemIndex) {
          const newIndex = index > args.itemIndex ? index - 1 : index;
          newItemDates[newIndex.toString()] = date;
        }
      });
    }

    await ctx.db.patch(args.id, {
      items: newItems,
      completedItems: newCompletedItems,
      itemDates: newItemDates,
      updatedAt: Date.now(),
    });
  },
});
