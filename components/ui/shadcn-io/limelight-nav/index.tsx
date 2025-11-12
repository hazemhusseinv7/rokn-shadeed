"use client";

import React, { useState, useRef, useLayoutEffect, cloneElement } from "react";
import Link from "next/link";
import ChangeLang from "@/components/ChangeLang";
import ChangeTheme from "@/components/ChangeTheme";
import { cn } from "@/lib/utils";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import { MdOutlineMarkChatRead } from "react-icons/md";
import { CgFileDocument } from "react-icons/cg";

export type NavItem = {
  id: string | number;
  icon: React.ReactElement;
  label?: string;
  onClick?: () => void;
  link: string;
};

const defaultNavItems: NavItem[] = [
  { id: "search", icon: <PiMagnifyingGlassBold />, label: "Search", link: "#" },
  {
    id: "contact-us",
    icon: <MdOutlineMarkChatRead />,
    label: "Contact us",
    link: "#",
  },
  {
    id: "blog",
    icon: <CgFileDocument />,
    label: "Blog",
    link: "#",
  },
];

export type LimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

/**
 * An adaptive-width navigation bar with a "limelight" effect that highlights the active item.
 */
export const LimelightNav = ({
  items = defaultNavItems,
  defaultActiveIndex = 0,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
}: LimelightNavProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (items.length === 0) return;

    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];

    if (limelight && activeItem) {
      const newLeft =
        activeItem.offsetLeft +
        activeItem.offsetWidth / 2 -
        limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;

      if (!isReady) {
        setTimeout(() => setIsReady(true), 50);
      }
    }
  }, [activeIndex, isReady, items]);

  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    setActiveIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav
      className={cn(
        // "bg-card rounded-lg border px-2",
        "text-foreground relative inline-flex h-16 items-center px-2",
        className,
      )}
    >
      {items.map(({ id, icon, label, link, onClick }, index) => (
        <Link
          href={link}
          key={id}
          ref={(el) => {
            navItemRefs.current[index] = el;
          }}
          className={cn(
            "relative z-20 flex h-full cursor-pointer items-center justify-center p-5",
            iconContainerClassName,
          )}
          onClick={() => handleItemClick(index, onClick)}
          aria-label={label}
        >
          {cloneElement(icon as React.ReactElement<any>, {
            className: cn(
              "size-6 transition-opacity duration-100 ease-in-out",
              activeIndex === index ? "opacity-100" : "opacity-40",
              (icon.props as any)?.className || "",
              iconClassName || "",
            ),
          })}
        </Link>
      ))}
      <ChangeLang />
      <ChangeTheme />
      <div
        ref={limelightRef}
        className={cn(
          "bg-primary absolute top-0 z-10 h-[5px] w-11 rounded-full shadow-[0_50px_15px_var(--primary)]",
          isReady ? "transition-[left] duration-400 ease-in-out" : "",
          limelightClassName,
        )}
        style={{ left: "-999px" }}
      >
        <div className="from-primary/30 pointer-events-none absolute top-[5px] left-[-30%] h-14 w-[160%] bg-linear-to-b to-transparent [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)]" />
      </div>
    </nav>
  );
};
