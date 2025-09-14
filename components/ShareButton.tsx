"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Share2, Users, Trophy, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonProps {
  items: string[];
  originalItems?: string[]; // Unsorted list for sharing to others
  title?: string;
  className?: string;
}

export function ShareButton({
  items,
  originalItems,
  title = "Totally Biased List",
  className,
}: ShareButtonProps) {
  const generateShareUrl = (
    itemsToShare: string[],
    isRanked: boolean = false
  ): string => {
    const baseUrl = window.location.origin;
    // Use Base64 encoding for shorter URLs
    const data = {
      items: itemsToShare,
      ranked: isRanked,
    };
    const jsonString = JSON.stringify(data);
    const base64Encoded = btoa(jsonString);
    // Make it URL-safe by replacing characters
    const urlSafeBase64 = base64Encoded
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    return `${baseUrl}#i=${urlSafeBase64}`;
  };

  const handleShare = async (
    itemsToShare: string[],
    isRanked: boolean,
    shareText: string
  ) => {
    const shareUrl = generateShareUrl(itemsToShare, isRanked);

    const shareData = {
      title: title,
      text: shareText,
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

  const handleShareForSorting = () => {
    const itemsToShare = originalItems || items;
    const shareText = originalItems
      ? "Try sorting this list yourself with Totally Biased!"
      : "Try re-sorting this ranked list with Totally Biased!";
    handleShare(itemsToShare, false, shareText);
  };

  const handleShareRanked = () => {
    handleShare(
      items,
      true,
      "Check out this ranked list I created with Totally Biased!"
    );
  };

  const handleSharePlainText = async () => {
    const plainText = items
      .map((item, index) => `${index + 1}. ${item}`)
      .join("\n");

    const shareData = {
      title: title,
      text: plainText,
    };

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        toast.success("Plain text shared successfully!");
      } catch {
        // User cancelled or error occurred, fallback to clipboard
        await copyPlainTextToClipboard(plainText);
      }
    } else {
      // Fallback to clipboard if Web Share API is not available
      await copyPlainTextToClipboard(plainText);
    }
  };

  const copyPlainTextToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Plain text copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy plain text to clipboard:", error);
      toast.error("Failed to copy text. Please copy manually.");
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          title="Share this list"
        >
          <Share2 className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="card backdrop-blur-[2px] bg-popover/50"
      >
        <DropdownMenuItem onClick={handleShareForSorting}>
          <Users className="size-4 mr-2" />
          Share for others to sort
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareRanked}>
          <Trophy className="size-4 mr-2" />
          Share ranked results
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSharePlainText}>
          <FileText className="size-4 mr-2" />
          Share as plain text
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ShareButton;
