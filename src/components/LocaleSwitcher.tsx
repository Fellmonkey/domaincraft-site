"use client";

import { CheckIcon, LanguagesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export interface LocaleOption {
  code: string;
  label: string;
  href: string;
}

export default function LocaleSwitcher({
  lang,
  currentLabel,
  options
}: {
  lang: string;
  currentLabel: string;
  options: LocaleOption[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={currentLabel}>
          <LanguagesIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((opt) => (
          <DropdownMenuItem key={opt.code} asChild>
            <a href={opt.href}>
              <span className="flex w-5 justify-center">
                {opt.code === lang ? <CheckIcon /> : null}
              </span>
              {opt.label}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}