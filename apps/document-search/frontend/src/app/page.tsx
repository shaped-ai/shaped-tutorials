"use client"

import * as React from "react"
import { Search, Loader2, Clock, User, ArrowUpRight } from "lucide-react"
import { FloatingButtons } from "@/components/FloatingButtons"
import debounce from "lodash/debounce"

interface MainImage {
  fileId: string
  url: string
  alt: string | null
}

interface ResultMetadata {
  item_id: string
  created_at: string
  created_at_datetime: string
  author: string
  categories: string
  chunk_metadata: string | null
  content: string
  featured: string
  main_image: string | null
  name: string
  popular: string
  article_id: string
  read_length_in_mins: string
  release_date: string
  roles: string | null
  slug: string
  updated_at: string
  url: string
}

interface SearchResult {
  id: string
  score: number
  metadata: ResultMetadata
}

function parseMainImage(imageStr: string | null): MainImage | null {
  if (!imageStr) return null
  try {
    return JSON.parse(imageStr)
  } catch {
    return null
  }
}

function stripLeadingPunctuation(text: string): string {
  return text.replace(/^[\s.,;:!?'"()\-–—]+/, "")
}

function ResultCard({ result }: { result: SearchResult }) {
  const mainImage = parseMainImage(result.metadata.main_image)
  const content = result.metadata.content ? stripLeadingPunctuation(result.metadata.content) : null
  
  return (
    <a
      href={result.metadata.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-slate-900/60 border border-slate-700/40 rounded-xl sm:rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:bg-slate-900/80 active:bg-slate-900/90 transition-all duration-300"
    >
      {mainImage && (
        <div className="relative h-36 sm:h-44 overflow-hidden">
          <img 
            src={mainImage.url} 
            alt={mainImage.alt || result.metadata.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        </div>
      )}
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          {result.metadata.categories.split(" ").slice(0, 2).map((cat) => (
            <span key={cat} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-cyan-500/10 text-cyan-400 text-[10px] sm:text-xs rounded-md">
              {cat}
            </span>
          ))}
          {result.metadata.featured === "True" && (
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-amber-500/20 text-amber-400 text-[10px] sm:text-xs rounded-md">
              Featured
            </span>
          )}
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-1.5 sm:mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
          {result.metadata.name}
          <ArrowUpRight className="inline-block ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="truncate max-w-[100px] sm:max-w-none">{result.metadata.author}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {result.metadata.read_length_in_mins} min
          </span>
        </div>
        {content && (
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {content}
          </p>
        )}
      </div>
    </a>
  )
}

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Debounced search function
  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query.trim()) {
          setResults([])
          setHasSearched(false)
          return
        }

        setIsLoading(true)
        setHasSearched(true)
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          const data = await response.json()
          setResults(data.results || [])
        } catch (error) {
          console.error("Search failed:", error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      }, 300),
    []
  )

  // Trigger debounced search on query change
  React.useEffect(() => {
    debouncedSearch(searchQuery)
    return () => debouncedSearch.cancel()
  }, [searchQuery, debouncedSearch])

  // Focus input on mount
  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-x-hidden">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjI4MzEiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptLTYgMGgtNHYyaDR2LTJ6bTEyLTZ2LTRoLTJ2NGgyek0yNCAzNGgydi00aC0ydjR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 pointer-events-none" />
      
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 pb-24 sm:pb-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent mb-2 sm:mb-4 tracking-tight leading-tight">
            Articles by Shaped
          </h1>
          <p className="text-slate-400 text-sm sm:text-lg max-w-md mx-auto leading-relaxed px-2">
            Look up RecSys and machine learning content from Tullie and the Shaped team.
          </p>
        </div>

        {/* Search Bar */}
        <div className="sticky top-2 sm:top-4 z-20 mb-6 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-12 sm:pr-14 bg-slate-900/90 border border-slate-700/50 rounded-xl sm:rounded-2xl text-base sm:text-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-xl transition-all duration-300 shadow-xl shadow-black/20"
            />
            {isLoading && (
              <Loader2 className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-cyan-400 animate-spin" />
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4 sm:space-y-6">
          {isLoading && results.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 animate-spin mx-auto mb-3 sm:mb-4" />
              <p className="text-slate-400 text-sm sm:text-base">Searching...</p>
            </div>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 text-slate-600" />
              </div>
              <p className="text-slate-400 text-base sm:text-lg">No articles found</p>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">Try a different search term</p>
            </div>
          )}

          {!hasSearched && !isLoading && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 text-slate-600" />
              </div>
              <p className="text-slate-400 text-base sm:text-lg">Start typing to search</p>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">Find articles about recommendations, ML, and more</p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-xs sm:text-sm">
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                {results.map((result) => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <FloatingButtons />
    </div>
  )
}
