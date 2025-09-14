"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  items: string[];
  title?: string;
  className?: string;
}

export function ShareButton({
  items,
  title = "Totally Biased List",
  className,
}: ShareButtonProps) {
  const generateShareUrl = (items: string[]): string => {
    const baseUrl = window.location.origin;
    const encodedItems = encodeURIComponent(JSON.stringify(items));
    return `${baseUrl}#items=${encodedItems}`;
  };

  const handleShare = async () => {
    const shareUrl = generateShareUrl(items);

    const shareData = {
      title: title,
      text: "Check out this ranked list I created with Totally Biased!",
      url: shareUrl,
    };

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch {
        // User cancelled or error occurred, fallback to clipboard
        await copyToClipboard(shareUrl);
      }
    } else {
      // Fallback to clipboard if Web Share API is not available or data is not shareable
      await copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy link. Please copy manually.");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleShare}
      className={className}
      title="Share this list"
    >
      <Share2 className="size-4" />
    </Button>
  );
}

export default ShareButton;
