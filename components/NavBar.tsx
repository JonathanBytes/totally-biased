"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";

// import {
//   NavigationMenu,
//   NavigationMenuLink,
// } from "@/components/ui/navigation-menu";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

// Define the props interface for the component
interface NavBarProps {
  // Optional className to extend styling
  className?: string;
  // UserButton if logged in
  userButton?: React.ReactNode;
  // Optional onClick handler
  onClick?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  className = "",
  onClick,
}) => {
  return (
    <div
      className={`${className} flex flex-wrap items-center justify-between relative p-4`}
      onClick={onClick}
    >
      <div className="flex-start">
        <Authenticated>
          <UserButton />
        </Authenticated>
        <Unauthenticated>
          <SignInButton>
            <Button className="cursor-pointer">
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
