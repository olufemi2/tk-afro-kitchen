export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export const categories = [
  {
    id: "main-dishes",
    name: "Main Dishes",
    description: "Hearty and filling Nigerian main courses",
    imageUrl: "https://placehold.co/800x600/333/FFF?text=Main+Dishes"
  },
  {
    id: "soups-stews",
    name: "Soups & Stews",
    description: "Traditional Nigerian soups and stews",
    imageUrl: "https://placehold.co/800x600/333/FFF?text=Soups+and+Stews"
  },
  {
    id: "sides",
    name: "Side Dishes",
    description: "Perfect accompaniments to your main course",
    imageUrl: "https://placehold.co/800x600/333/FFF?text=Side+Dishes"
  }
];

export const featuredDishes: MenuItem[] = [
  {
    id: "jollof-rice",
    name: "Jollof Rice",
    description: "Flavorful rice cooked in tomato sauce with aromatic spices",
    price: 12.99,
    imageUrl: "https://placehold.co/800x800/333/FFF?text=Jollof+Rice",
    category: "Main Dishes"
  },
  {
    id: "egusi-soup",
    name: "Egusi Soup",
    description: "Rich soup made with ground melon seeds, vegetables, and assorted meat",
    price: 15.99,
    imageUrl: "https://placehold.co/800x800/333/FFF?text=Egusi+Soup",
    category: "Soups & Stews"
  },
  {
    id: "pounded-yam",
    name: "Pounded Yam",
    description: "Smooth, stretchy dough made from yam, perfect with soups",
    price: 8.99,
    imageUrl: "https://placehold.co/800x800/333/FFF?text=Pounded+Yam",
    category: "Side Dishes"
  }
]; 