export interface SizeOption {
  size: 'small' | 'regular' | 'large' | 'family' | 'party' | 'single' | 'box' | 'pack';
  price: number;
  portionInfo: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  sizeOptions: SizeOption[];
  defaultSizeIndex: number;
  price: number;
  sizes?: {
    small: { price: number; portionInfo: string };
    regular: { price: number; portionInfo: string };
    large: { price: number; portionInfo: string };
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export const categories: Category[] = [
  {
    id: "soups",
    name: "Soups",
    description: "Traditional Nigerian soups and stews",
    imageUrl: "/images/dishes/egusi1.png"
  },
  {
    id: "swallows",
    name: "Swallows & Soups",
    description: "Traditional Nigerian swallows with delicious soups",
    imageUrl: "/images/dishes/amala_ewedu.jpeg"
  },
  {
    id: "rice",
    name: "Rice",
    description: "Flavorful Nigerian rice specialties",
    imageUrl: "/images/dishes/jollofmeal.png"
  },
  {
    id: "meats",
    name: "Meats",
    description: "Premium meat and protein dishes",
    imageUrl: "/images/dishes/Turkey.png"
  },
  {
    id: "snacks",
    name: "Snacks & Small Chops",
    description: "Delicious Nigerian snacks and appetizers",
    imageUrl: "/images/dishes/tk-meatpie.png"
  }
];

export const featuredDishes: MenuItem[] = [
  {
    id: "jolof-rice-special",
    name: "Special Jollof Rice",
    description: "Premium jollof rice cooked with the finest ingredients and served with assorted vegetables",
    imageUrl: "/images/dishes/jolofrice.png",
    category: "Rice",
    price: 14.99,
    sizes: {
      small: { 
        price: 12.99,
        portionInfo: "Perfect for one person"
      },
      regular: { 
        price: 14.99,
        portionInfo: "Serves 1-2 people"
      },
      large: { 
        price: 17.99,
        portionInfo: "Great for sharing (2-3 people)"
      }
    },
    sizeOptions: [
      {
        size: "regular",
        price: 12.99,
        portionInfo: "Serves 1-2"
      },
      {
        size: "large",
        price: 19.99,
        portionInfo: "Serves 2-3"
      },
      {
        size: "family",
        price: 29.99,
        portionInfo: "Serves 4-5"
      }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "yam-porridge",
    name: "Yam Porridge (Asaro)",
    description: "Creamy yam porridge cooked with palm oil, peppers, and assorted seasonings",
    imageUrl: "/images/dishes/Yam porridge_(Asaro).jpg",
    category: "Others",
    sizeOptions: [
      { size: "regular", price: 13.99, portionInfo: "Single portion" },
      { size: "large", price: 21.99, portionInfo: "Serves 2-3" },
      { size: "family", price: 31.99, portionInfo: "Serves 4-5" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "beans-dodo",
    name: "Beans & Dodo",
    description: "Nigerian beans served with fried plantain (dodo)",
    imageUrl: "/images/dishes/beans_dodo.jpeg",
    category: "Others",
    sizeOptions: [
      { size: "regular", price: 12.99, portionInfo: "Single portion" },
      { size: "large", price: 20.99, portionInfo: "Serves 2-3" },
      { size: "family", price: 29.99, portionInfo: "Serves 4-5" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "egusi-soup",
    name: "Egusi Soup",
    description: "Rich melon seed soup with assorted meat and vegetables",
    imageUrl: "/images/dishes/egusi1.png",
    category: "Soups",
    sizeOptions: [
      { size: "regular", price: 15.99, portionInfo: "Single portion" },
      { size: "large", price: 24.99, portionInfo: "Serves 2-3" },
      { size: "family", price: 34.99, portionInfo: "Serves 4-5" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "efo-riro",
    name: "Efo Riro",
    description: "Rich and nutritious Nigerian spinach stew with assorted meat and fish",
    imageUrl: "/images/dishes/efo-riro.png",
    category: "Soups",
    sizeOptions: [
      { size: "regular", price: 14.99, portionInfo: "Single portion" },
      { size: "large", price: 23.99, portionInfo: "Serves 2-3" },
      { size: "family", price: 33.99, portionInfo: "Serves 4-5" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "ayamase-stew",
    name: "Ayamase Stew",
    description: "Spicy green pepper stew with assorted meats, a true Nigerian delicacy",
    imageUrl: "/images/dishes/ayamase.png",
    category: "Soups",
    sizeOptions: [
      { size: "regular", price: 15.99, portionInfo: "Single portion" },
      { size: "large", price: 24.99, portionInfo: "Serves 2-3" },
      { size: "family", price: 34.99, portionInfo: "Serves 4-5" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "amala-ewedu",
    name: "Amala & Ewedu",
    description: "Smooth yam flour swallow served with ewedu soup",
    imageUrl: "/images/dishes/amala_ewedu.jpeg",
    category: "Swallows",
    sizeOptions: [
      { size: "regular", price: 13.99, portionInfo: "Single portion" },
      { size: "large", price: 21.99, portionInfo: "Serves 2" },
      { size: "family", price: 31.99, portionInfo: "Serves 3-4" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "iyan-eforiro",
    name: "Pounded Yam & Efo Riro",
    description: "Smooth pounded yam served with delicious efo riro soup",
    imageUrl: "/images/dishes/Iyan-eforirio.jpg",
    category: "Swallows",
    sizeOptions: [
      { size: "regular", price: 14.99, portionInfo: "Single portion" },
      { size: "large", price: 22.99, portionInfo: "Serves 2" },
      { size: "family", price: 32.99, portionInfo: "Serves 3-4" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "assorted-fish",
    name: "Assorted Fish",
    description: "Selection of perfectly seasoned and fried fish",
    imageUrl: "/images/dishes/assorted_fish.jpg",
    category: "Meats",
    sizeOptions: [
      { size: "regular", price: 16.99, portionInfo: "2 pieces" },
      { size: "large", price: 25.99, portionInfo: "4 pieces" },
      { size: "party", price: 39.99, portionInfo: "8 pieces" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "peppered-turkey",
    name: "Peppered Turkey",
    description: "Spicy grilled turkey in our special pepper sauce",
    imageUrl: "/images/dishes/Turkey.png",
    category: "Meats",
    sizeOptions: [
      { size: "regular", price: 15.99, portionInfo: "4 pieces" },
      { size: "large", price: 24.99, portionInfo: "8 pieces" },
      { size: "party", price: 39.99, portionInfo: "15 pieces" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "peppered-snails",
    name: "Peppered Snails",
    description: "Grilled snails in spicy pepper sauce",
    imageUrl: "/images/dishes/peppered_snails.jpeg",
    category: "Meats",
    sizeOptions: [
      { size: "regular", price: 18.99, portionInfo: "4 pieces" },
      { size: "large", price: 29.99, portionInfo: "8 pieces" },
      { size: "party", price: 45.99, portionInfo: "12 pieces" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "meat-pie",
    name: "Nigerian Meat Pie",
    description: "Flaky pastry filled with seasoned minced meat and vegetables",
    imageUrl: "/images/dishes/meat-pie.jpeg",
    category: "Snacks",
    sizeOptions: [
      { size: "single", price: 3.99, portionInfo: "1 piece" },
      { size: "box", price: 19.99, portionInfo: "6 pieces" },
      { size: "pack", price: 35.99, portionInfo: "12 pieces" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "moi-moi",
    name: "Moi Moi",
    description: "Steamed bean pudding made from peeled beans, peppers, and spices",
    imageUrl: "/images/dishes/moi-moi.png",
    category: "Snacks",
    sizeOptions: [
      { size: "single", price: 4.99, portionInfo: "1 piece" },
      { size: "pack", price: 22.99, portionInfo: "5 pieces" },
      { size: "party pack", price: 39.99, portionInfo: "10 pieces" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "tk-special-fish",
    name: "TK Special Fish",
    description: "Premium fish marinated in traditional spices and slow-cooked to perfection",
    imageUrl: "/images/dishes/tkfish3.png",
    category: "Meats",
    sizeOptions: [
      { size: "regular", price: 19.99, portionInfo: "1 whole fish" },
      { size: "large", price: 29.99, portionInfo: "2 whole fish" },
      { size: "party", price: 49.99, portionInfo: "4 whole fish" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "nigerian-meat-stew",
    name: "Traditional Meat Stew",
    description: "Rich and hearty Nigerian meat stew with tender beef in a flavorful tomato base",
    imageUrl: "/images/dishes/meat-stew.png",
    category: "Soups",
    sizeOptions: [],
    defaultSizeIndex: 0
  },
  {
    id: "tk-puff-puff",
    name: "Nigerian Puff Puff",
    description: "Fluffy, deep-fried Nigerian dough balls with a perfectly sweet taste",
    imageUrl: "/images/dishes/tk-puff-puff.png",
    category: "Snacks",
    sizeOptions: [
      { size: "small", price: 4.99, portionInfo: "6 pieces" },
      { size: "medium", price: 8.99, portionInfo: "12 pieces" },
      { size: "large", price: 15.99, portionInfo: "24 pieces" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "african-grilled-chicken",
    name: "African Grilled Chicken",
    description: "Tender chicken pieces marinated in a blend of African spices and perfectly grilled",
    imageUrl: "/images/dishes/chicken.png",
    category: "Meats",
    sizeOptions: [
      { size: "regular", price: 16.99, portionInfo: "2 pieces (quarter chicken)" },
      { size: "large", price: 25.99, portionInfo: "4 pieces (half chicken)" },
      { size: "party", price: 39.99, portionInfo: "8 pieces (whole chicken)" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "nigerian-chin-chin",
    name: "Nigerian Chin Chin",
    description: "Crunchy, sweet fried pastry snack, perfect with tea or as a dessert",
    imageUrl: "/images/dishes/chin-chin.jpg",
    category: "Snacks",
    sizeOptions: [],
    defaultSizeIndex: 0
  },
  {
    id: "assorted-okro",
    name: "Assorted Okro Soup",
    description: "Delicious okro soup cooked with various meats and seafood for a rich flavor",
    imageUrl: "/images/dishes/assorted-okro.jpeg",
    category: "Soups",
    sizeOptions: [
      { size: "regular", price: 15.99, portionInfo: "Single portion" },
      { size: "large", price: 24.99, portionInfo: "Serves 2-3" },
      { size: "family", price: 34.99, portionInfo: "Serves 4-5" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "puff-puff-meat-pie-combo",
    name: "Puff Puff & Meat Pie Combo",
    description: "The perfect snack combination of sweet puff puff and savory meat pie",
    imageUrl: "/images/dishes/puff-puff-meat-pie.jpeg",
    category: "Snacks",
    sizeOptions: [
      { size: "regular", price: 8.99, portionInfo: "2 pieces each" },
      { size: "large", price: 15.99, portionInfo: "4 pieces each" },
      { size: "party", price: 29.99, portionInfo: "8 pieces each" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "seafood-okro",
    name: "Seafood Okro Soup",
    description: "Luxurious okro soup made with premium seafood including prawns, fish and crab",
    imageUrl: "/images/dishes/seafood-okro.png",
    category: "Soups",
    sizeOptions: [
      { size: "regular", price: 17.99, portionInfo: "Single portion" },
      { size: "large", price: 26.99, portionInfo: "Serves 2-3" },
      { size: "family", price: 36.99, portionInfo: "Serves 4-5" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "classic-jollof",
    name: "Classic Jollof Rice",
    description: "Traditional Nigerian jollof rice cooked to perfection with the classic recipe",
    imageUrl: "/images/dishes/Jollof.jpeg",
    category: "Rice",
    sizeOptions: [
      { size: "regular", price: 11.99, portionInfo: "Single portion" },
      { size: "large", price: 18.99, portionInfo: "Serves 2-3" },
      { size: "party", price: 28.99, portionInfo: "Serves 4-6" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "assorted-stew",
    name: "Assorted Meat Stew",
    description: "Rich stew featuring an assortment of Nigerian meats in a flavorful tomato base",
    imageUrl: "/images/dishes/assorted-stew.jpeg",
    category: "Soups",
    sizeOptions: [
      { size: "regular", price: 16.99, portionInfo: "Single portion" },
      { size: "large", price: 25.99, portionInfo: "Serves 2-3" },
      { size: "family", price: 35.99, portionInfo: "Serves 4-5" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "classic-egusi",
    name: "Classic Egusi Soup",
    description: "Traditional Nigerian egusi soup made with ground melon seeds and assorted meat",
    imageUrl: "/images/dishes/egusi.png",
    category: "Soups",
    sizeOptions: [
      { size: "regular", price: 15.99, portionInfo: "Single portion" },
      { size: "large", price: 24.99, portionInfo: "Serves 2-3" },
      { size: "family", price: 34.99, portionInfo: "Serves 4-5" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "assorted-beef-fish",
    name: "Assorted Beef & Fish",
    description: "Selection of premium beef cuts and fish, perfectly seasoned and prepared",
    imageUrl: "/images/dishes/Assorted_beef_fish.jpg",
    category: "Meats",
    sizeOptions: [
      { size: "regular", price: 18.99, portionInfo: "4 pieces" },
      { size: "large", price: 27.99, portionInfo: "8 pieces" },
      { size: "party", price: 42.99, portionInfo: "12 pieces" }
    ],
    defaultSizeIndex: 0
  }
];
