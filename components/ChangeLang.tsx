"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";

import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

import { FaEarthAfrica } from "react-icons/fa6";
import { cn } from "@/lib/utils";

const ChangeLang = ({ className }: { className?: string }) => {
  const [isPending, startTransition] = useTransition();

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const handleLanguageChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale },
      );
    });
  };

  return (
    <Dropdown className={cn(className, "min-w-24")}>
      <DropdownTrigger>
        <Button
          className="max-w-12 min-w-0 bg-transparent"
          endContent={!isPending && <FaEarthAfrica className="size-4" />}
          isLoading={isPending}
          aria-label="Change Language"
        />
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        selectionMode="single"
        variant="flat"
        selectedKeys={[locale]}
        onAction={(key) => handleLanguageChange(key as string)}
      >
        <DropdownItem key="en">EN</DropdownItem>
        <DropdownItem key="ar">AR</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ChangeLang;
