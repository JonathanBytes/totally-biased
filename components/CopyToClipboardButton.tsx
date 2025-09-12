"use client";

import { useState } from "react";
import { ClipboardCheck, ClipboardCopy } from "lucide-react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";

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

  const onCopy = () => {
    navigator.clipboard.writeText(textToCopy);
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

