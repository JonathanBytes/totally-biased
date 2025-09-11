import SaveListForm from "./SaveListForm";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";

import { useState } from "react";

const SaveListDrawer = ({ list }: { list: string[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="secondary" size="sm">
          Save list to your account
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Save Your List</DrawerTitle>
            <DrawerDescription>
              Save your ranked list to access it later.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <SaveListForm list={list} closeDrawer={() => setOpen(false)} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SaveListDrawer;
