import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">Tkafro</span>
        </Link>

        {/* Search Bar - Hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <Input
            type="search"
            placeholder="Search for dishes..."
            className="w-full"
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/menu" className="text-sm font-medium">
              Menu
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About
            </Link>
          </nav>

          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Button>
        </div>
      </div>
      
      {/* Mobile Search - Shown below header on mobile */}
      <div className="md:hidden p-4 border-t">
        <Input
          type="search"
          placeholder="Search for dishes..."
          className="w-full"
        />
      </div>
    </header>
  );
} 