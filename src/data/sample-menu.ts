export interface MenuItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  sizeOptions: SizeOption[];
  defaultSizeIndex: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface SizeOption {
  size: string;
  price: number;
  portionInfo: string;
}

export const categories: Category[] = [
  {
    id: "rice",
    name: "Rice Dishes",
    description: "Authentic Nigerian rice specialties",
    imageUrl: "/images/dishes/jollofmeal.png"
  },
  {
    id: "soups-stews",
    name: "Soups & Stews",
    description: "Traditional Nigerian soups and stews",
    imageUrl: "/images/dishes/egusi1.png"
  },
  {
    id: "proteins",
    name: "Protein Dishes",
    description: "Variety of peppered meats and fish",
    imageUrl: "/images/dishes/Turkey.png"
  },
  {
    id: "sides",
    name: "Side Dishes",
    description: "Delicious sides including plantain and beans",
    imageUrl: "/images/dishes/beans_dodo.jpeg"
  },
  {
    id: "snacks",
    name: "Snacks & Pastries",
    description: "Nigerian snacks and pastries",
    imageUrl: "/images/dishes/tk-meatpie.png"
  },
  {
    id: "platters",
    name: "Fish Platters",
    description: "Special fish platters",
    imageUrl: "/images/dishes/tkfish3.png"
  }
];

export const featuredDishes: MenuItem[] = [
  // Rice Dishes
  {
    id: "jollof-rice",
    name: "Jollof Rice",
    description: "Our signature Jollof rice cooked with rich tomato sauce and aromatic spices",
    imageUrl: "/images/dishes/Jollof.jpeg",
    category: "Rice Dishes",
    sizeOptions: [
      { size: "2L", price: 30, portionInfo: "2 Litres" },
      { size: "4L", price: 50, portionInfo: "4 Litres" },
      { size: "half-cooler", price: 90, portionInfo: "Half Cooler" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "peppered-fried-rice",
    name: "Peppered Fried Rice",
    description: "Flavorful fried rice with a perfect blend of peppers and seasonings",
    imageUrl: "/images/dishes/friedrice.jpg",
    category: "Rice Dishes",
    sizeOptions: [
      { size: "2L", price: 40, portionInfo: "2 Litres" },
      { size: "4L", price: 60, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "peppered-coconut-rice",
    name: "Peppered Coconut Rice",
    description: "Aromatic coconut rice with a perfect blend of peppers",
    imageUrl: "/images/dishes/jollofmeal.png",
    category: "Rice Dishes",
    sizeOptions: [
      { size: "2L", price: 45, portionInfo: "2 Litres" },
      { size: "4L", price: 70, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "peppered-native-rice",
    name: "Peppered Native Rice",
    description: "Traditional Nigerian native rice with peppered sauce",
    imageUrl: "/images/dishes/pepperednativerice.jpg",
    category: "Rice Dishes",
    sizeOptions: [
      { size: "2L", price: 35, portionInfo: "2 Litres" },
      { size: "4L", price: 55, portionInfo: "4 Litres" },
      { size: "half-cooler", price: 95, portionInfo: "Half Cooler" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "ofada-rice",
    name: "Ofada Rice",
    description: "Traditional Nigerian brown rice variety",
    imageUrl: "/images/dishes/jollofmeal.png",
    category: "Rice Dishes",
    sizeOptions: [
      { size: "2L", price: 40, portionInfo: "2 Litres" },
      { size: "4L", price: 70, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },

  // Protein Dishes
  {
    id: "peppered-beef-chicken",
    name: "Peppered Beef and Chicken",
    description: "Perfectly seasoned combination of beef and chicken",
    imageUrl: "/images/dishes/chicken.png",
    category: "Protein Dishes",
    sizeOptions: [
      { size: "2L", price: 55, portionInfo: "2 Litres" },
      { size: "4L", price: 85, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "peppered-assorted-meat",
    name: "Peppered Assorted Meat",
    description: "Mix of various meats in pepper sauce",
    imageUrl: "/images/dishes/assorted-meat stew.jpg",
    category: "Protein Dishes",
    sizeOptions: [
      { size: "2L", price: 60, portionInfo: "2 Litres" },
      { size: "4L", price: 90, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "peppered-beef-fish",
    name: "Peppered Beef and Fish",
    description: "Perfectly seasoned beef and fish in pepper sauce",
    imageUrl: "/images/dishes/peppered_fish.jpg",
    category: "Protein Dishes",
    sizeOptions: [
      { size: "2L", price: 65, portionInfo: "2 Litres" },
      { size: "4L", price: 95, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "peppered-beef-turkey",
    name: "Peppered Beef and Turkey",
    description: "Combination of beef and turkey in pepper sauce",
    imageUrl: "/images/dishes/Turkey.png",
    category: "Protein Dishes",
    sizeOptions: [
      { size: "2L", price: 60, portionInfo: "2 Litres" },
      { size: "4L", price: 90, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "peppered-beef",
    name: "Peppered Beef Only",
    description: "Premium beef in pepper sauce",
    imageUrl: "/images/dishes/Assortedmeat.png",
    category: "Protein Dishes",
    sizeOptions: [
      { size: "2L", price: 70, portionInfo: "2 Litres" },
      { size: "4L", price: 105, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "peppered-chicken-hard",
    name: "Peppered Chicken Hard",
    description: "Hard chicken in pepper sauce",
    imageUrl: "/images/dishes/chicken.png",
    category: "Protein Dishes",
    sizeOptions: [
      { size: "2L", price: 50, portionInfo: "2 Litres" },
      { size: "4L", price: 80, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "peppered-grilled-chicken",
    name: "Peppered Grilled Soft Chicken",
    description: "Grilled soft chicken in pepper sauce",
    imageUrl: "/images/dishes/softchicken.jpg",
    category: "Protein Dishes",
    sizeOptions: [
      { size: "2L", price: 50, portionInfo: "2 Litres" },
      { size: "4L", price: 80, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "turkey-wings",
    name: "Turkey Wings",
    description: "Seasoned and grilled turkey wings",
    imageUrl: "/images/dishes/Turkey.png",
    category: "Protein Dishes",
    sizeOptions: [
      { size: "2L", price: 55, portionInfo: "2 Litres" },
      { size: "4L", price: 85, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "peppered-goat",
    name: "Peppered Goat Meat",
    description: "Premium goat meat in pepper sauce",
    imageUrl: "/images/dishes/pepperedgoatmeat.jpeg",
    category: "Protein Dishes",
    sizeOptions: [
      { size: "2L", price: 70, portionInfo: "2 Litres" },
      { size: "4L", price: 105, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "peppered-fish",
    name: "Peppered Fish",
    description: "Fish in pepper sauce",
    imageUrl: "/images/dishes/peppered_fish.jpg",
    category: "Protein Dishes",
    sizeOptions: [
      { size: "2L", price: 60, portionInfo: "2 Litres" },
      { size: "4L", price: 90, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },

  // Soups and Stews
  {
    id: "assorted-stew",
    name: "Assorted Stew",
    description: "Rich stew with assorted meat",
    imageUrl: "/images/dishes/assorted-stew.jpeg",
    category: "Soups & Stews",
    sizeOptions: [
      { size: "2L", price: 60, portionInfo: "2 Litres" },
      { size: "4L", price: 90, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "chicken-stew",
    name: "Chicken Stew",
    description: "Rich stew with chicken",
    imageUrl: "/images/dishes/chicken-stew.png",
    category: "Soups & Stews",
    sizeOptions: [
      { size: "2L", price: 50, portionInfo: "2 Litres" },
      { size: "4L", price: 80, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "fish-stew",
    name: "Fish Stew",
    description: "Rich stew with fish",
    imageUrl: "/images/dishes/Fish-stew.png",
    category: "Soups & Stews",
    sizeOptions: [
      { size: "2L", price: 60, portionInfo: "2 Litres" },
      { size: "4L", price: 90, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "efo-riro",
    name: "Efo Riro",
    description: "Rich and nutritious Nigerian spinach stew",
    imageUrl: "/images/dishes/efo-riro.jpg",
    category: "Soups & Stews",
    sizeOptions: [
      { size: "2L", price: 60, portionInfo: "2 Litres" },
      { size: "4L", price: 90, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "efo-riro-fish",
    name: "Efo Riro with Fish",
    description: "Spinach stew with fish",
    imageUrl: "/images/dishes/eforiro-with-assortedmeat.jpg",
    category: "Soups & Stews",
    sizeOptions: [
      { size: "2L", price: 60, portionInfo: "2 Litres" },
      { size: "4L", price: 90, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "egusi-soup",
    name: "Egusi Soup",
    description: "Rich melon seed soup",
    imageUrl: "/images/dishes/egusi1.png",
    category: "Soups & Stews",
    sizeOptions: [
      { size: "2L", price: 65, portionInfo: "2 Litres" },
      { size: "4L", price: 100, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "okra-soup",
    name: "Assorted Okra Soup",
    description: "Okra soup with assorted meat",
    imageUrl: "/images/dishes/assorted-okro.jpg",
    category: "Soups & Stews",
    sizeOptions: [
      { size: "2L", price: 60, portionInfo: "2 Litres" },
      { size: "4L", price: 90, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "seafood-okra",
    name: "Seafood Okra Soup",
    description: "Okra soup with seafood",
    imageUrl: "/images/dishes/seafood-okro.jpg",
    category: "Soups & Stews",
    sizeOptions: [
      { size: "2L", price: 70, portionInfo: "2 Litres" },
      { size: "4L", price: 105, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "ayamase",
    name: "Ayamase Sauce",
    description: "Spicy green pepper sauce",
    imageUrl: "/images/dishes/ayamase.jpg",
    category: "Soups & Stews",
    sizeOptions: [
      { size: "2L", price: 65, portionInfo: "2 Litres" },
      { size: "4L", price: 100, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "ofada-sauce",
    name: "Ofada Sauce",
    description: "Traditional sauce for Ofada rice",
    imageUrl: "/images/dishes/ofada_sauce.jpg",
    category: "Soups & Stews",
    sizeOptions: [
      { size: "2L", price: 65, portionInfo: "2 Litres" },
      { size: "4L", price: 100, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "ogbono-soup",
    name: "Ogbono Soup",
    description: "Traditional Nigerian Ogbono soup",
    imageUrl: "/images/dishes/ogbono soup.jpeg",
    category: "Soups & Stews",
    sizeOptions: [
      { size: "2L", price: 60, portionInfo: "2 Litres" },
      { size: "4L", price: 90, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "fish-pepper-soup",
    name: "Fish Pepper Soup",
    description: "Spicy Nigerian fish pepper soup",
    imageUrl: "/images/dishes/fishpeppersoup.jpg",
    category: "Soups & Stews",
    sizeOptions: [
      { size: "2L", price: 60, portionInfo: "2 Litres" },
      { size: "4L", price: 90, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },

  // Side Dishes
  {
    id: "dodo-gizzards",
    name: "Dodo Gizzards",
    description: "Fried plantain with gizzards",
    imageUrl: "/images/dishes/dodogizzard.jpeg",
    category: "Side Dishes",
    sizeOptions: [
      { size: "2L", price: 60, portionInfo: "2 Litres" },
      { size: "4L", price: 90, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "assorted-pepper-soup",
    name: "Assorted Pepper Soup",
    description: "Spicy pepper soup with assorted meat",
    imageUrl: "/images/dishes/psoup.png",
    category: "Side Dishes",
    sizeOptions: [
      { size: "2L", price: 55, portionInfo: "2 Litres" },
      { size: "4L", price: 85, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "fish-pepper-soup",
    name: "Fish Pepper Soup",
    description: "Spicy pepper soup with fish",
    imageUrl: "/images/dishes/fishpeppersoup.jpg",
    category: "Side Dishes",
    sizeOptions: [
      { size: "2L", price: 50, portionInfo: "2 Litres" },
      { size: "4L", price: 80, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "plantain",
    name: "Plantain",
    description: "Fried plantain (Dodo)",
    imageUrl: "/images/dishes/dodo.png",
    category: "Side Dishes",
    sizeOptions: [
      { size: "2L", price: 40, portionInfo: "2 Litres" },
      { size: "4L", price: 70, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "ewa-agoyin",
    name: "Ewa Agoyin and Sauce",
    description: "Mashed beans with special sauce",
    imageUrl: "/images/dishes/aganyin.png",
    category: "Side Dishes",
    sizeOptions: [
      { size: "2L", price: 60, portionInfo: "2 Litres" },
      { size: "4L", price: 90, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "yam-porridge",
    name: "Yam Porridge (Asaro)",
    description: "Creamy yam porridge cooked with palm oil and peppers",
    imageUrl: "/images/dishes/Yam porridge_(Asaro).jpg",
    category: "Side Dishes",
    sizeOptions: [
      { size: "2L", price: 50, portionInfo: "2 Litres" },
      { size: "4L", price: 80, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "beans-porridge",
    name: "Beans Porridge",
    description: "Nigerian style beans porridge",
    imageUrl: "/images/dishes/beans_porridge.jpg",
    category: "Side Dishes",
    sizeOptions: [
      { size: "2L", price: 50, portionInfo: "2 Litres" },
      { size: "4L", price: 80, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "beans-dodo",
    name: "Beans & Dodo",
    description: "Nigerian beans served with fried plantain",
    imageUrl: "/images/dishes/beans_dodo.jpeg",
    category: "Side Dishes",
    sizeOptions: [
      { size: "2L", price: 50, portionInfo: "2 Litres" },
      { size: "4L", price: 80, portionInfo: "4 Litres" }
    ],
    defaultSizeIndex: 0
  },

  // Snacks and Pastries
  {
    id: "meat-pies",
    name: "Meat Pies",
    description: "Nigerian style meat pies",
    imageUrl: "/images/dishes/meat-pie.jpeg",
    category: "Snacks & Pastries",
    sizeOptions: [
      { size: "pack", price: 20, portionInfo: "Pack of 10" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "sausage-rolls",
    name: "Sausage Rolls",
    description: "Nigerian style sausage rolls",
    imageUrl: "/images/dishes/sausageroll.jpeg",
    category: "Snacks & Pastries",
    sizeOptions: [
      { size: "pack", price: 20, portionInfo: "Pack of 10" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "chicken-pies",
    name: "Chicken Pies",
    description: "Nigerian style chicken pies",
    imageUrl: "/images/dishes/tk-meatpie.png",
    category: "Snacks & Pastries",
    sizeOptions: [
      { size: "pack", price: 20, portionInfo: "Pack of 10" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "fish-pies",
    name: "Fish Pies",
    description: "Nigerian style fish pies",
    imageUrl: "/images/dishes/tk-meatpie.png",
    category: "Snacks & Pastries",
    sizeOptions: [
      { size: "pack", price: 20, portionInfo: "Pack of 10" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "puff-puff",
    name: "Puff Puff",
    description: "Nigerian deep-fried dough balls",
    imageUrl: "/images/dishes/tk-puff-puff.png",
    category: "Snacks & Pastries",
    sizeOptions: [
      { size: "tray", price: 40, portionInfo: "Full Tray" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "mix-and-match",
    name: "Mix and Match",
    description: "Assorted Nigerian snacks",
    imageUrl: "/images/dishes/puff-puff-meat-pie.jpeg",
    category: "Snacks & Pastries",
    sizeOptions: [
      { size: "tray", price: 50, portionInfo: "Full Tray" }
    ],
    defaultSizeIndex: 0
  },

  // Fish Platters
  {
    id: "tilapia-platter",
    name: "Tilapia Fish Platter",
    description: "Grilled Tilapia fish platter with sides",
    imageUrl: "/images/dishes/tkfish3.png",
    category: "Fish Platters",
    sizeOptions: [
      { size: "combo", price: 30, portionInfo: "Combo Platter" }
    ],
    defaultSizeIndex: 0
  },
  {
    id: "croker-platter",
    name: "Croker Fish Platter",
    description: "Grilled Croker fish platter with sides",
    imageUrl: "/images/dishes/assorted_fish.jpg",
    category: "Fish Platters",
    sizeOptions: [
      { size: "combo", price: 35, portionInfo: "Combo Platter" }
    ],
    defaultSizeIndex: 0
  }
];

export const menuGroups = [
  {
    id: "chicken-dishes",
    name: "Chicken Dishes",
    description: "Our signature chicken dishes in various styles",
    imageUrl: "/images/dishes/chicken.png",
    menuOptions: [
      {
        id: "peppered-beef-chicken",
        name: "Peppered Beef and Chicken",
        description: "Perfectly seasoned combination of beef and chicken",
        imageUrl: "/images/dishes/chicken.png",
        sizeOptions: [
          { size: "2L", price: 55, portionInfo: "2 Litres" },
          { size: "4L", price: 85, portionInfo: "4 Litres" }
        ]
      },
      {
        id: "peppered-chicken-hard",
        name: "Peppered Chicken Hard",
        description: "Hard chicken in pepper sauce",
        imageUrl: "/images/dishes/chicken.png",
        sizeOptions: [
          { size: "2L", price: 50, portionInfo: "2 Litres" },
          { size: "4L", price: 80, portionInfo: "4 Litres" }
        ]
      },
      {
        id: "peppered-grilled-soft-chicken",
        name: "Peppered Grilled Soft Chicken",
        description: "Grilled soft chicken in pepper sauce",
        imageUrl: "/images/dishes/softchicken.jpg",
        sizeOptions: [
          { size: "2L", price: 50, portionInfo: "2 Litres" },
          { size: "4L", price: 80, portionInfo: "4 Litres" }
        ]
      },
      {
        id: "chicken-stew",
        name: "Chicken Stew",
        description: "Traditional chicken stew",
        imageUrl: "/images/dishes/chicken-stew.png",
        sizeOptions: [
          { size: "2L", price: 50, portionInfo: "2 Litres" },
          { size: "4L", price: 80, portionInfo: "4 Litres" }
        ]
      }
    ]
  },
  {
    id: "snacks-pastries",
    name: "Snacks & Pastries",
    description: "Nigerian snacks and pastries",
    imageUrl: "/images/dishes/tk-meatpie.png",
    menuOptions: [
      {
        id: "meat-pies",
        name: "Meat Pies",
        description: "Nigerian style meat pies",
        imageUrl: "/images/dishes/meat-pie.jpeg",
        sizeOptions: [
          { size: "pack", price: 20, portionInfo: "Pack of 10" }
        ]
      },
      {
        id: "chicken-pies",
        name: "Chicken Pies",
        description: "Nigerian style chicken pies",
        imageUrl: "/images/dishes/tk-meatpie.png",
        sizeOptions: [
          { size: "pack", price: 20, portionInfo: "Pack of 10" }
        ]
      },
      // ... other snacks and pastries ...
    ]
  }
];
