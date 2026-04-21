"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Tag } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";

// Helper to extract a "Keyword" from a title
function extractKeyword(title: string) {
  const stopWords = ["the", "and", "for", "with", "that", "this", "from", "your", "best", "top", "how"];
  // 1. Remove special chars & split
  const words = title.replace(/[^\w\s]/gi, '').split(' ');
  
  // 2. Find the first "meaningful" word (longer than 3 chars, not a stop word)
  const keyword = words.find(w => w.length > 3 && !stopWords.includes(w.toLowerCase()));
  
  // 3. Fallback to the longest word if nothing found
  if (!keyword) {
      return words.sort((a, b) => b.length - a.length)[0];
  }
  
  return keyword; // Capitalize or keep as is
}

interface UpdatesSearchProps {
  latestTitles: string[]; // We only need titles to generate pills
}

export function UpdatesSearch({ latestTitles }: UpdatesSearchProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  
  const currentQuery = searchParams.get("q")?.toString() || "";
  const [inputValue, setInputValue] = useState(currentQuery);

  // Sync internal state with URL params (handling back/forward navigation)
  useEffect(() => {
    setInputValue(currentQuery);
  }, [currentQuery]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    replace(`${window.location.pathname}?${params.toString()}`);
  }, 300);

  // Manual Trigger (for Pills)
  const triggerSearch = (term: string) => {
    setInputValue(term); // Update UI immediately
    handleSearch(term);  // Trigger URL update
  };

  const clearSearch = () => {
    setInputValue("");
    handleSearch("");
  };

  // Generate Unique Keywords from Latest 5 Titles
  const keywords = Array.from(new Set(latestTitles.map(extractKeyword))).filter(Boolean).slice(0, 5);

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search articles by title..." 
          className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        {inputValue && (
            <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
                <X className="h-4 w-4" />
            </button>
        )}
      </div>
      
      {/* Dynamic Pills */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs text-gray-400 font-medium mr-1">Trending:</span>
        
        {/* "All" Button */}
        <Button 
            variant={!currentQuery ? "default" : "ghost"} 
            size="sm" 
            onClick={clearSearch}
            className={`rounded-full px-4 h-7 text-xs font-bold transition-all ${!currentQuery ? "bg-[#0ABED6] hover:bg-[#09A8BD] text-white" : "bg-gray-50 hover:bg-gray-100 text-gray-600"}`}
        >
            All
        </Button>

        {/* Generated Keywords */}
        {keywords.map((word, i) => {
            const isActive = currentQuery.toLowerCase().includes(word.toLowerCase());
            return (
                <Button 
                    key={i}
                    variant="ghost" 
                    size="sm" 
                    onClick={() => triggerSearch(word)}
                    className={`rounded-full px-4 h-7 text-xs font-bold transition-all border ${
                        isActive 
                        ? "bg-blue-50 text-blue-600 border-blue-100" 
                        : "bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                >
                    {word}
                </Button>
            );
        })}
      </div>
    </div>
  );
}