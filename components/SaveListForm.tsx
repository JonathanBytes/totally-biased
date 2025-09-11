import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const SaveListForm = ({
  list,
  closeDrawer,
}: {
  list: string[];
  closeDrawer: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createList = useMutation(api.sortedLists.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createList({
        title,
        description,
        items: list,
      });
      setTitle("");
      setDescription("");
      toast.success("List saved successfully!");
      closeDrawer();
    } catch (error) {
      console.error("Error saving list:", error);
      toast.error("Failed to save list.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Ranked List"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add some details about your list..."
          className="min-h-[100px]"
        />
      </div>
      <Button type="submit" className="w-full">
        Save List
      </Button>
    </form>
  );
};

export default SaveListForm;
