import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Info } from "lucide-react";

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
  const [listType, setListType] = useState<"basic" | "advanced">("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createList = useMutation(api.sortedLists.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createList({
        title,
        description,
        items: list,
        listType,
      });
      setTitle("");
      setDescription("");
      setListType("basic");
      toast.success("List saved successfully!");
      localStorage.removeItem("unsavedList");
      closeDrawer();
    } catch (error) {
      console.error("Error saving list:", error);
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("maximum of")) {
        toast.error("You have reached the maximum number of saved lists.");
      } else {
        toast.error("Failed to save list. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
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
      <div className="space-y-3">
        <Label>List Type</Label>
        <TooltipProvider>
          <RadioGroup
            value={listType}
            onValueChange={(value) =>
              setListType(value as "basic" | "advanced")
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="basic" id="basic" />
              <Label htmlFor="basic" className="font-normal cursor-pointer">
                Basic List
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    A simple ranked list to view and share. Perfect for sharing
                    your totally biased opinions!
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="advanced" />
              <Label htmlFor="advanced" className="font-normal cursor-pointer">
                Advanced List
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    A powerful checklist where you can mark items as completed,
                    add dates, and reorder items as needed.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </RadioGroup>
        </TooltipProvider>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save List"}
      </Button>
    </form>
  );
};

export default SaveListForm;
