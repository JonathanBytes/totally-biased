"use client";

import { useState } from "react";
import React from "react";
import { ClipboardCheck, ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

interface CopyToClipboardButtonProps extends Omit<ButtonProps, "onClick"> {
  textToCopy: string;
  buttonText?: string;
}

export function CopyToClipboardButton({
  textToCopy,
  buttonText,
  ...props
}: CopyToClipboardButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error("Failed to copy. Please copy manually.");
      return;
    }
    toast.success("Copied to clipboard!");
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Button
      {...props}
      onClick={onCopy}
    >
      {copied
        ? <ClipboardCheck className="size-4" />
        : <ClipboardCopy className="size-4" />}
      {buttonText && <span>{buttonText}</span>}
    </Button>
  );
}

