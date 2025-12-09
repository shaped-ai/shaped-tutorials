"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ShoppingCartSidebar } from "@/components/ShoppingCartSidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";

export default function Home() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestedItems, setSuggestedItems] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  function getProductImageUrl(item_id: number) {
    const IMAGE_BUCKET_BASE_URL =
      "https://h-and-m-images.s3.us-east-2.amazonaws.com";
    const PREFIX = item_id.toString().substring(0, 2);
    console.log(PREFIX, item_id);
    return `${IMAGE_BUCKET_BASE_URL}/0${PREFIX}/0${item_id.toString()}.jpg`;
  }

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => [...prev, product]);
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Fetch suggested items based on cart contents
  useEffect(() => {
    async function fetchSuggestedItems() {
      // Only fetch if there are items in the cart
      if (cartItems.length === 0) {
        setSuggestedItems([]);
        return;
      }

      setLoadingSuggestions(true);
      try {
        // Extract article_ids from cart items
        const interactions = cartItems.map((item) => String(item.article_id));
        
        const response = await fetch("/api/similar_items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ interactions }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch suggested items");
        }

        const data = await response.json();
        // Limit to first 5 suggested items
        setSuggestedItems(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (error) {
        console.error("Error fetching suggested items:", error);
        // Fallback to empty array on error
        setSuggestedItems([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }

    fetchSuggestedItems();
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 pr-96">
        {/* Top Section */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-4xl font-bold tracking-tight">
              BUY YOUR CLOTHES HERE
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover our curated collection of premium fashion items. Browse
              through our selection of clothing, accessories, and footwear. <br/><strong>Click an item to add it to your cart.</strong>
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Learn more"
              >
                <InfoIcon className="h-4 w-4" />
                <span>Learn More</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Fashion catalog powered by Shaped</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h3 className="mb-2 font-semibold">About the demo</h3>
                  <p className="text-muted-foreground text-sm">
                    This is an example site powered by the Shaped relevance
                    store. Items are populated from the publicly-available H&M
                    Products dataset.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Why it works</h3>
                  <p className="text-muted-foreground text-sm">
                    A Shaped engine looks at the current logged-in user, their transaction history, and then chooses a set of items to suggest to them. 

                    The engine combines transaction history with semantic information about each item, and which customers bought it - to learn about its popularity.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Retrieval stage</h3>
                  <p className="text-muted-foreground text-sm">
                    Each component on the page is fetching items from a Shaped
                    engine using a specific retrieval query. The catalog
                    frontpage gets popular items using a popular items retriever
                    The shopping cart shows similar items to the ones in your
                    cart, using similarity search
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Build your own</h3>
                  <p className="text-muted-foreground text-sm">
                    Use our quickstart to start building a retrieval engine today.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                image={getProductImageUrl(product.article_id)}
                title={product.prod_name}
                price={"10"}
                onClick={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}
      </main>
      <ShoppingCartSidebar
        cartItems={cartItems}
        suggestedItems={suggestedItems}
        getProductImageUrl={getProductImageUrl}
        onRemoveItem={handleRemoveFromCart}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
