// src/app/product/[id]/ProductDetailClient.tsx
"use client";
import { useState } from "react";

export default function ProductDetailClient({ dish }) {
  // Your client-side logic here
  return (
    <div>
      <h1>{dish.name}</h1>
      {/* ...rest of your UI... */}
    </div>
  );
}