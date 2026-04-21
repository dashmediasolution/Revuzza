"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MapPin, 
  Check, 
  ChevronsUpDown, 
  Loader2,
  X,
  Navigation
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { identifySearchIntent } from "@/lib/search-action";
import { useAutoLocation } from "@/lib/hooks/use-auto-location"; 
import { TranslatableText } from "@/components/shared/translatable-text";
import { useTranslation } from "@/components/shared/translation-context";
import { translateContent } from "@/lib/translation-action";

interface SearchBarProps {
  className?: string;
  locations: string[]; 
}

export function SearchBar({ className, locations }: SearchBarProps) {
  const router = useRouter();
  
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = React.useTransition();

  const [hasInteracted, setHasInteracted] = useState(false);
  const detectedCity = useAutoLocation();

  const useTranslatedPlaceholder = (text: string) => {
    const { targetLang } = useTranslation();
    const [translated, setTranslated] = useState(text);

    useEffect(() => {
      if (targetLang === 'en') {
        setTranslated(text);
        return;
      }
      let isMounted = true;
      translateContent(text, targetLang).then((res) => {
        if (isMounted && res.translation) setTranslated(res.translation);
      });
      return () => { isMounted = false; };
    }, [targetLang, text]);

    return translated;
  };

  const queryPlaceholder = useTranslatedPlaceholder("Search for companies, categories...");
  const locationSearchPlaceholder = useTranslatedPlaceholder("Search locations...");

  useEffect(() => {
    if (detectedCity && !location && !hasInteracted) {
      const match = locations.find(dbLoc => 
        dbLoc.toLowerCase().includes(detectedCity.toLowerCase())
      );
      if (match) {
        setLocation(match);
      }
    }
  }, [detectedCity, location, locations, hasInteracted]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !location.trim()) return;

    startTransition(async () => {
      const cleanLocation = location.split(',')[0].trim();

      try {
        const redirectPath = await identifySearchIntent({ 
            query, 
            location: cleanLocation ,
            userRegion: detectedCity
        });

        if (redirectPath) {
          router.push(redirectPath);
        } else {
          const params = new URLSearchParams();
          if (query) params.set("query", query);
          if (cleanLocation) params.set("loc", cleanLocation); 
          router.push(`/search?${params.toString()}`);
        }
      } catch (error) {
        console.error("Search failed", error);
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (cleanLocation) params.set("loc", cleanLocation);
        router.push(`/search?${params.toString()}`);
      }
    });
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className={cn(
        "flex flex-col md:flex-row items-center bg-white p-2 rounded-none border border-gray-100 mx-auto gap-2 md:gap-0 shadow-sm",
        className
      )}
    >
      
      {/* Query Input - ✅ Search Icon Removed */}
      <div className="relative w-full md:flex-1">
        <Input 
          id="search-query"
          placeholder={queryPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 px-6 h-12 text-base bg-transparent rounded-none text-gray-900 placeholder:text-gray-500"
          disabled={isPending}
        />
      </div>

      <div className="hidden md:block w-[1px] h-8 bg-gray-200 mx-2" />

      {/* Location Dropdown */}
      <div className="relative w-full md:w-[200px]">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between border-0 shadow-none h-12 text-base font-normal px-4 hover:bg-gray-50 text-gray-700"
            >
              {location ? (
                <div className="flex items-center gap-2 truncate">
                   <MapPin className="h-4 w-4 text-[#0ABED6] shrink-0" />
                   <span className="truncate">{location}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                   {!detectedCity ? <Navigation className="h-3 w-3 animate-pulse" /> : null}
                   <span><TranslatableText text="Select Location" /></span>
                </div>
              )}
              
              {location ? (
                 <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        setLocation("");
                        setHasInteracted(true); 
                    }}
                    className="ml-2 hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                 >
                    <X className="h-3 w-3 text-gray-400" />
                 </div>
              ) : (
                 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </Button>
          </PopoverTrigger>
          
          <PopoverContent className="w-[240px] p-0 rounded-none" align="start">
            <Command>
              <CommandInput placeholder={locationSearchPlaceholder} />
              <CommandList>
                <CommandEmpty>
                    <TranslatableText text="No locations found." />
                </CommandEmpty>
                <CommandGroup>
                  {locations.map((loc) => (
                    <CommandItem
                      key={loc}
                      value={loc}
                      onSelect={() => {
                        setLocation(loc); 
                        setHasInteracted(true); 
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          location === loc ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {loc}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* ✅ Search Button - Magnifying Glass icon replaces text */}
      <Button 
        type="submit" 
        size="icon" 
        disabled={isPending}
        className="w-full md:w-14 rounded-sm bg-[#0ABED6] hover:bg-[#0ABED6]/80 text-white h-12 shadow-sm transition-all"
      >
        {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" /> 
        ) : (
            <Search className="h-5 w-5" />
        )}
      </Button>

    </form>
  );
}