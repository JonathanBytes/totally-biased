"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";

// import {
//   NavigationMenu,
//   NavigationMenuLink,
// } from "@/components/ui/navigation-menu";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import Link from "next/link";
import { Home, List, LogIn } from "lucide-react";

// Define the props interface for the component
interface NavBarProps {
  // Optional className to extend styling
  className?: string;
  // UserButton if logged in
  userButton?: React.ReactNode;
  // Optional onClick handler
  onClick?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ className = "", onClick }) => {
  return (
    <div
      className={`${className} flex flex-wrap items-center justify-between relative mt-2 p-4 max-w-3xl w-full`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-start">
        <Link href="/" className="inline-flex">
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <Home className="size-4" />
          </Button>
        </Link>
        <Authenticated>
          <div className="flex items-center gap-4">
            <UserButton />
            <Link href="/lists">
              <Button className="cursor-pointer" variant="outline" size="sm">
                <List className="size-4" />
                My Lists
              </Button>
            </Link>
          </div>
        </Authenticated>
        <Unauthenticated>
          <SignInButton>
            <Button
              variant="default"
              className="h-fit py-0.5 border-2 border-neutral-900 hover:border-neutral-700 dark:border-neutral-400 cursor-pointer flex items-center justify-center gap-2"
              size="sm"
            >
              <LogIn />
              Sign In
            </Button>
          </SignInButton>
        </Unauthenticated>
      </div>
      {/* <NavigationMenu className="gap-4"> */}
      {/*   <NavigationMenuLink href="/">Home</NavigationMenuLink> */}
      {/*   <NavigationMenuLink href="/app">App</NavigationMenuLink> */}
      {/* </NavigationMenu> */}
      <div className="flex-end">
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavBar;
