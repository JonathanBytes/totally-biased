import React from "react";
import { Pencil } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdvancedListCardHeaderProps {
  title: string;
  description?: string;
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

/**
 * Header component for the AdvancedListCard
 * Displays title, description, badge, and edit mode toggle button
 */
export const AdvancedListCardHeader = React.memo<AdvancedListCardHeaderProps>(
  function AdvancedListCardHeader({
    title,
    description,
    isEditMode,
    onToggleEditMode,
  }) {
    return (
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-serif">{title}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                Advanced
              </Badge>
            </div>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={onToggleEditMode}
            className="ml-2"
          >
            <Pencil className="h-4 w-4 mr-1" />
            {isEditMode ? "Done" : "Edit"}
          </Button>
        </div>
      </CardHeader>
    );
  }
);
