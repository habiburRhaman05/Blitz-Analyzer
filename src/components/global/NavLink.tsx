"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends Omit<LinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  children?: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, href, exact = false, ...props }, ref) => {
    const pathname = usePathname();

    // Logic to determine if the link is active
    // exact=true: matches only the specific path
    // exact=false: matches the start of the path (useful for nested routes)
    const isActive = exact 
      ? pathname === href 
      : pathname.startsWith(href.toString());

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(
          className,
          isActive && (activeClassName || "text-primary font-semibold")
        )}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };