import { List } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { TableOfContents } from "@/components/blog/TableOfContents";

export function MobileToc() {
  return (
    <Drawer>
      <DrawerTrigger
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 lg:hidden"
        aria-label="Open table of contents"
      >
        <List size={20} aria-hidden />
      </DrawerTrigger>
      <DrawerContent className="lg:hidden">
        <DrawerHeader>
          <DrawerTitle className="font-semibold">Table of contents</DrawerTitle>
        </DrawerHeader>
        <div className="max-h-[60vh] overflow-y-auto px-4 pb-6">
          <TableOfContents />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
