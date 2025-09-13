import React, { MouseEventHandler } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CopyToClipboardButton } from "./CopyToClipboardButton";

interface ListItem {
  _id: Id<"sortedLists">;
  _creationTime: number;
  title: string;
  description?: string | undefined;
  items: string[];
  updatedAt: number;
  userId: string;
}

interface ListCardProps {
  list: ListItem;
}

export function ListCard({ list }: ListCardProps) {
  const deleteList = useMutation(api.sortedLists.deleteList);

  const handleDelete = () => {
    deleteList({ id: list._id });
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-300 bg-card/5 backdrop-blur-[2px] card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-serif">{list.title}</CardTitle>
            {list.description && (
              <CardDescription>{list.description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2">
          {list.items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="h-6 w-6 rounded-full p-0"
              >
                {index + 1}
              </Badge>
              <span className="text-md">{item}</span>
            </li>
          ))}
        </ol>
        <div className="flex mt-4 w-full justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Updated: {formatRelativeTime(list.updatedAt)}
          </p>
          <div className="flex items-center">
            <CopyToClipboardButton
              textToCopy={list.items.join("\n")}
              variant="ghost"
              size="icon"
            />
            <AlertComponent handleDelete={handleDelete} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ListCard;

interface AlertComponentProps {
  handleDelete: MouseEventHandler<HTMLButtonElement>;
}

const AlertComponent = ({ handleDelete }: AlertComponentProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this{" "}
            <span className="font-bold">totally biased</span>list from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="dark:bg-red-450 dark:hover:bg-red-500 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
