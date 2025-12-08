import React, { MouseEventHandler } from "react";
import { Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { CopyToClipboardButton } from "../CopyToClipboardButton";
import { ShareButton } from "../ShareButton";

interface AdvancedListCardFooterProps {
  items: string[];
  title: string;
  updatedAt: number;
  onDelete: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Footer component for the AdvancedListCard
 * Displays update time, copy, share, and delete actions
 */
export const AdvancedListCardFooter = React.memo<AdvancedListCardFooterProps>(
  function AdvancedListCardFooter({ items, title, updatedAt, onDelete }) {
    return (
      <div className="flex mt-4 w-full justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Updated: {formatRelativeTime(updatedAt)}
        </p>
        <div className="flex items-center">
          <CopyToClipboardButton
            textToCopy={items.join("\n")}
            variant="ghost"
            size="icon"
          />
          <ShareButton items={items} title={title} className="text-primary" />
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
                  This action cannot be undone. This will permanently delete
                  this <span className="font-bold">totally biased</span> list
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="dark:bg-red-450 dark:hover:bg-red-500 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }
);
