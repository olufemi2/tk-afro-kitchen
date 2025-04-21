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
    imageUrl: "/images/dishes/jollofmeal.png"
  },
  {
    id: "soups-stews",
    name: "Soups & Stews",
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
    id: "proteins",
    name: "Proteins & Sides",
    description: "Delicious proteins and side dishes",
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
    id: "jollof-rice",
    name: "Jollof Rice",
    description: "Our signature Jollof rice cooked with rich tomato sauce and aromatic spices",
    price: 12.99,
    imageUrl: "/images/dishes/jollofmeal.png",
    category: "Main Dishes"
  },
  {
    id: "yam-porridge",
    name: "Yam Porridge (Asaro)",
    description: "Creamy yam porridge cooked with palm oil, peppers, and assorted seasonings",
    price: 11.99,
    imageUrl: "/images/dishes/Yam porridge_(Asaro).jpg",
    category: "Main Dishes"
  },
  {
    id: "beans-dodo",
    name: "Beans & Dodo",
    description: "Nigerian beans served with fried plantain (dodo)",
    price: 10.99,
    imageUrl: "/images/dishes/beans_dodo.jpeg",
    category: "Main Dishes"
  },
  {
    id: "egusi-soup",
    name: "Egusi Soup",
    description: "Rich melon seed soup with assorted meat and vegetables",
    price: 15.99,
    imageUrl: "/images/dishes/egusi1.png",
    category: "Soups & Stews"
  },
  {
    id: "efo-riro",
    name: "Efo Riro",
    description: "Rich and nutritious Nigerian spinach stew with assorted meat and fish",
    price: 14.99,
    imageUrl: "/images/dishes/efo-riro.png",
    category: "Soups & Stews"
  },
  {
    id: "ayamase-stew",
    name: "Ayamase Stew",
    description: "Spicy green pepper stew with assorted meats, a true Nigerian delicacy",
    price: 15.99,
    imageUrl: "/images/dishes/ayamase.png",
    category: "Soups & Stews"
  },
  {
    id: "amala-ewedu",
    name: "Amala & Ewedu",
    description: "Smooth yam flour swallow served with ewedu soup",
    price: 13.99,
    imageUrl: "/images/dishes/amala_ewedu.jpeg",
    category: "Swallows"
  },
  {
    id: "iyan-eforiro",
    name: "Pounded Yam & Efo Riro",
    description: "Smooth pounded yam served with delicious efo riro soup",
    price: 14.99,
    imageUrl: "/images/dishes/Iyan-eforirio.jpg",
    category: "Swallows"
  },
  {
    id: "assorted-fish",
    name: "Assorted Fish",
    description: "Selection of perfectly seasoned and fried fish",
    price: 16.99,
    imageUrl: "/images/dishes/assorted_fish.jpg",
    category: "Proteins"
  },
  {
    id: "peppered-turkey",
    name: "Peppered Turkey",
    description: "Spicy grilled turkey in our special pepper sauce",
    price: 15.99,
    imageUrl: "/images/dishes/Turkey.png",
    category: "Proteins"
  },
  {
    id: "peppered-snails",
    name: "Peppered Snails",
    description: "Grilled snails in spicy pepper sauce",
    price: 18.99,
    imageUrl: "/images/dishes/peppered_snails.jpeg",
    category: "Proteins"
  },
  {
    id: "meat-pie",
    name: "Nigerian Meat Pie",
    description: "Flaky pastry filled with seasoned minced meat and vegetables",
    price: 3.99,
    imageUrl: "/images/dishes/meat-pie.jpeg",
    category: "Snacks"
  },
  {
    id: "moi-moi",
    name: "Moi Moi",
    description: "Steamed bean pudding made from peeled beans, peppers, and spices",
    price: 4.99,
    imageUrl: "/images/dishes/moi-moi.png",
    category: "Snacks"
  },
  {
    id: "tk-special-fish",
    name: "TK Special Fish",
    description: "Premium fish marinated in traditional spices and slow-cooked to perfection",
    price: 17.99,
    imageUrl: "/images/dishes/tkfish3.png",
    category: "Proteins"
  },
  {
    id: "nigerian-meat-stew",
    name: "Traditional Meat Stew",
    description: "Rich and hearty Nigerian meat stew with tender beef in a flavorful tomato base",
    price: 14.99,
    imageUrl: "/images/dishes/meat-stew.png",
    category: "Soups & Stews"
  },
  {
    id: "tk-puff-puff",
    name: "Nigerian Puff Puff",
    description: "Fluffy, deep-fried Nigerian dough balls with a perfectly sweet taste",
    price: 4.99,
    imageUrl: "/images/dishes/tk-puff-puff.png",
    category: "Snacks"
  },
  {
    id: "african-grilled-chicken",
    name: "African Grilled Chicken",
    description: "Tender chicken pieces marinated in a blend of African spices and perfectly grilled",
    price: 15.99,
    imageUrl: "/images/dishes/chicken.png",
    category: "Proteins"
  },
  {
    id: "nigerian-chin-chin",
    name: "Nigerian Chin Chin",
    description: "Crunchy, sweet fried pastry snack, perfect with tea or as a dessert",
    price: 3.99,
    imageUrl: "/images/dishes/chin-chin.jpg",
    category: "Snacks"
  }
];
