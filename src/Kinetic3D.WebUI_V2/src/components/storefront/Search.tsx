"use client";

import { useState, useEffect, useRef } from "react";
import { SearchIcon, X } from "lucide-react";
import { Meilisearch } from "meilisearch";
import Image from "next/image";
import Link from "next/link";

const client = new Meilisearch({
  host: "http://localhost:7700",
  // no api key for local development
});

interface SearchResult {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.trim().length === 0) {
        setResults([]);
        return;
      }
      try {
        const index = client.index("products");
        const searchRes = await index.search(query, { limit: 6 });
        setResults(searchRes.hits as SearchResult[]);
      } catch (err) {
        console.error("Search error:", err);
      }
    };
    
    const debounce = setTimeout(search, 200);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-foreground hover:text-color-cyan transition-colors"
        aria-label="Search"
      >
        <SearchIcon className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative z-10 w-full bg-background border-b border-white/10 p-4">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <SearchIcon className="w-6 h-6 text-foreground/50" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-xl text-foreground placeholder-foreground/50 focus:outline-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-foreground hover:text-color-orange transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="relative z-10 w-full max-w-4xl mx-auto mt-4 px-4">
              <div className="bg-background border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                {results.map((result) => (
                  <Link
                    href={`/products/${result.id}`}
                    key={result.id}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded overflow-hidden flex-shrink-0 relative">
                      {result.imageUrl ? (
                        <Image src={result.imageUrl} alt={result.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/10" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{result.name}</h4>
                      <p className="text-color-cyan">${result.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
