import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

interface ListItem {
  _id: string;
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
  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{list.title}</CardTitle>
        {list.description && (
          <CardDescription>{list.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ol className="space-y-2">
          {list.items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="flex h-6 w-6 items-center justify-center rounded-full p-0"
              >
                {index + 1}
              </Badge>
              <span className="text-md">{item}</span>
            </li>
          ))}
        </ol>
        <div className="flex justify-end mt-4">
          <p className="text-xs text-muted-foreground">
            Updated: {formatRelativeTime(list.updatedAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ListCard;
