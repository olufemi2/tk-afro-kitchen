"use client";
import { useState } from "react";
import type { MenuItem } from "@/data/sample-menu"; // <-- Import the type

type ProductDetailClientProps = {
  dish: MenuItem;
};

export default function ProductDetailClient({ dish }: ProductDetailClientProps) {
  // Your client-side logic here
  return (
    <div>
      <h1>{dish.name}</h1>
      {/* ...rest of your UI... */}
    </div>
  );
}