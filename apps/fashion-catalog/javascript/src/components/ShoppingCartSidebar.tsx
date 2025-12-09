"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  article_id: number;
  prod_name: string;
  [key: string]: any;
}

interface ShoppingCartSidebarProps {
  cartItems: Product[];
  suggestedItems: Product[];
  getProductImageUrl: (item_id: number) => string;
  onRemoveItem: (index: number) => void;
  onAddToCart: (product: Product) => void;
}

export function ShoppingCartSidebar({
  cartItems,
  suggestedItems,
  getProductImageUrl,
  onRemoveItem,
  onAddToCart,
}: ShoppingCartSidebarProps) {
  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-lg overflow-y-auto z-50">
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
        
        {/* Cart Items */}
        <div className="space-y-4 mb-8 flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-muted-foreground text-sm">Your cart is empty</p>
          ) : (
            cartItems.map((item, index) => (
              <Card key={index} className="flex gap-3 p-3 items-center flex-row hover:shadow-lg transition-shadow duration-200">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={getProductImageUrl(item.article_id)}
                    alt={item.prod_name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <CardContent className="p-0 flex-1 flex items-center">
                  <p className="text-sm font-medium">{item.prod_name}</p>
                </CardContent>
                <button
                  onClick={() => onRemoveItem(index)}
                  className="flex-shrink-0 p-2 hover:bg-accent rounded transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              </Card>
            ))
          )}
        </div>

        {/* Total Price */}
        {cartItems.length > 0 && (
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-bold">$30</span>
            </div>
          </div>
        )}

        {/* Suggested Items */}
        {suggestedItems.length > 0 && (
          <div className="border-t pt-6 mt-auto flex-shrink-0" style={{ maxHeight: "30vh" }}>
            <h3 className="text-lg font-semibold mb-4">Suggested Items</h3>
            <div className="space-y-3 overflow-y-auto" style={{ maxHeight: "calc(30vh - 3rem)" }}>
              {suggestedItems.map((item, index) => (
                <Card 
                  key={index} 
                  className="flex gap-3 p-3 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => onAddToCart(item)}
                >
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={getProductImageUrl(item.article_id)}
                      alt={item.prod_name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <CardContent className="p-0 flex-1 flex items-center">
                    <p className="text-sm font-medium">{item.prod_name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

