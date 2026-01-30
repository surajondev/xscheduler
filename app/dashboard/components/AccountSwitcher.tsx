"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDashboard } from "../context/DashboardContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function AccountSwitcher() {
  const { accounts, activeAccountId, switchAccount, twitterUsername } =
    useDashboard();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If we have accounts but no active account id, try to set from local storage or first account
    if (accounts.length > 0 && !activeAccountId) {
      const storedId = localStorage.getItem("social_account_id");
      if (storedId) {
        switchAccount(storedId);
      } else {
        switchAccount(accounts[0].id);
      }
    }
  }, [accounts, activeAccountId, switchAccount]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {activeAccountId
            ? accounts.find((account) => account.id === activeAccountId)?.name
            : "Select Account"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search account..." />
          <CommandList>
            <CommandEmpty>No account found.</CommandEmpty>
            <CommandGroup heading="Accounts">
              {accounts.map((account) => (
                <CommandItem
                  key={account.id}
                  value={account.name}
                  onSelect={() => {
                    switchAccount(account.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      activeAccountId === account.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {account.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  // Assuming there is a route or modal to add new account
                  // For now, maybe redirect to settings or just log
                  console.log("Add new account clicked");
                }}
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Account
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
