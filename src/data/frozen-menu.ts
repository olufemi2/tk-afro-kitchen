export interface FrozenMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  servings: string;
  storageInfo: string;
  category: string;
}

export const frozenCategories = [
  {
    id: "soups-stews",
    name: "Soups & Stews",
    description: "Traditional Nigerian soups and stews, frozen for convenience"
  },
  {
    id: "rice-dishes",
    name: "Rice Dishes",
    description: "Pre-cooked Nigerian rice dishes, ready to heat and serve"
  },
  {
    id: "sauces",
    name: "Sauces",
    description: "Authentic Nigerian sauces perfect for any meal"
  }
];

export const frozenItems: FrozenMenuItem[] = [
  {
    id: "jollof-rice-frozen",
    name: "Frozen Jollof Rice",
    description: "Authentic Nigerian party-style Jollof with perfectly balanced smoky flavors. Made with premium long-grain rice, rich tomato sauce, and our special blend of spices. Simply heat and enjoy our most popular rice dish without the cooking time.",
    price: 15.99,
    imageUrl: "/images/frozen/jollof_rice.jpeg",
    servings: "Serves 2-3 people",
    storageInfo: "Keep frozen. Can be stored for up to 3 months.",
    category: "Rice Dishes"
  },
  {
    id: "fried-rice-frozen",
    name: "Frozen Nigerian Fried Rice",
    description: "Vibrant and colorful Nigerian-style fried rice, packed with mixed vegetables, protein, and authentic seasoning. Our frozen fried rice maintains its distinct flavor profile and delivers the perfect balance of savory and aromatic tastes in every bite.",
    price: 15.99,
    imageUrl: "/images/frozen/friedrice.jpeg",
    servings: "Serves 2-3 people",
    storageInfo: "Keep frozen. Can be stored for up to 3 months.",
    category: "Rice Dishes"
  },
  {
    id: "egusi-soup-frozen",
    name: "Frozen Egusi Soup",
    description: "Our premier Egusi soup features ground melon seeds simmered to perfection with spinach, assorted meats, and authentic spices. This protein-rich Nigerian classic pairs beautifully with any swallow and delivers a thick, hearty consistency with every spoonful.",
    price: 18.99,
    imageUrl: "/images/frozen/egusi_soup.jpeg",
    servings: "Serves 3-4 people",
    storageInfo: "Keep frozen. Can be stored for up to 3 months.",
    category: "Soups & Stews"
  },
  {
    id: "efo-riro-frozen",
    name: "Frozen Efo Riro",
    description: "Premium spinach stew simmered with bell peppers, locust beans, and a rich assortment of fish and meat. This nutrient-dense Nigerian favorite features our secret blend of spices for an authentic taste profile that perfectly balances heat and flavor.",
    price: 17.99,
    imageUrl: "/images/frozen/efo-riro.jpeg",
    servings: "Serves 3-4 people",
    storageInfo: "Keep frozen. Can be stored for up to 3 months.",
    category: "Soups & Stews"
  },
  {
    id: "ofada-sauce-frozen",
    name: "Frozen Ofada Sauce",
    description: "This bold and distinctively flavored sauce combines scotch bonnet peppers, fermented locust beans, and bell peppers with premium cuts of meat. A spicy, aromatic delight that pairs perfectly with ofada rice for an authentic southwestern Nigerian dining experience.",
    price: 16.99,
    imageUrl: "/images/frozen/ofada-sauce.jpeg",
    servings: "Serves 3-4 people",
    storageInfo: "Keep frozen. Can be stored for up to 3 months.",
    category: "Sauces"
  },
  {
    id: "ayamase-sauce-frozen",
    name: "Frozen Ayamase Sauce",
    description: "Our signature green pepper sauce ('designer stew') features a perfect blend of green bell peppers, scotch bonnets, and caramelized onions. Slow-cooked with tender assorted meats, this moderately spicy sauce delivers complex, layered flavors that elevate any rice dish.",
    price: 16.99,
    imageUrl: "/images/frozen/ayamase_sauce.jpeg",
    servings: "Serves 3-4 people",
    storageInfo: "Keep frozen. Can be stored for up to 3 months.",
    category: "Sauces"
  },
  {
    id: "ogbono-soup-frozen",
    name: "Frozen Ogbono Soup",
    description: "A luxurious soup made from ground ogbono seeds that creates a distinct, silky texture. Enriched with palm oil, vegetables, and premium meats, our Ogbono soup offers a unique 'draw' consistency and rich umami flavor that pairs wonderfully with any swallow.",
    price: 18.99,
    imageUrl: "/images/frozen/ogbono.jpeg",
    servings: "Serves 3-4 people",
    storageInfo: "Keep frozen. Can be stored for up to 3 months.",
    category: "Soups & Stews"
  },
  {
    id: "seafood-okra-frozen",
    name: "Frozen Seafood Okra Soup",
    description: "A coastal Nigerian delicacy featuring tender okra simmered with a premium seafood medley of prawns, fish, and crab. The natural thickening properties of okra create a silky texture while our blend of traditional spices delivers a perfectly balanced flavor profile.",
    price: 19.99,
    imageUrl: "/images/frozen/seafood_okra.jpeg",
    servings: "Serves 3-4 people",
    storageInfo: "Keep frozen. Can be stored for up to 3 months.",
    category: "Soups & Stews"
  },
  {
    id: "assorted-stew-frozen",
    name: "Frozen Assorted Meat Stew",
    description: "Our versatile tomato-based stew features a rich variety of premium meats slow-cooked to tender perfection. The deep, robust flavors develop from our special cooking technique, creating a versatile sauce that complements rice dishes, yam, plantain, and more.",
    price: 17.99,
    imageUrl: "/images/frozen/assorted_stew.jpeg",
    servings: "Serves 3-4 people",
    storageInfo: "Keep frozen. Can be stored for up to 3 months.",
    category: "Soups & Stews"
  },
  {
    id: "turkey-stew-frozen",
    name: "Frozen Turkey Stew",
    description: "A celebratory stew featuring succulent turkey pieces simmered in a rich tomato and bell pepper base. This festive Nigerian favorite is infused with aromatic herbs and spices, creating a luxurious sauce that's perfect for special occasions or an elevated weeknight meal.",
    price: 18.99,
    imageUrl: "/images/frozen/turkey_stew.jpeg",
    servings: "Serves 3-4 people",
    storageInfo: "Keep frozen. Can be stored for up to 3 months.",
    category: "Soups & Stews"
  },
  {
    id: "fish-stew-frozen",
    name: "Frozen Fish Stew",
    description: "A delicate yet flavor-rich stew made with carefully selected fish fillets simmered in a fragrant tomato and herb base. This lighter option offers the perfect balance of flaky fish texture and aromatic spices for a truly authentic Nigerian seafood experience.",
    price: 17.99,
    imageUrl: "/images/frozen/fishstew.jpeg",
    servings: "Serves 3-4 people",
    storageInfo: "Keep frozen. Can be stored for up to 3 months.",
    category: "Soups & Stews"
  },
  {
    id: "chicken-stew-frozen",
    name: "Frozen Chicken Stew",
    description: "Tender chicken pieces slow-cooked in our signature tomato and pepper base with traditional Nigerian herbs and spices. This comforting, versatile stew showcases perfectly balanced flavors that complement everything from rice and pasta to plantains and potatoes.",
    price: 16.99,
    imageUrl: "/images/frozen/chicken-stew.jpeg",
    servings: "Serves 3-4 people",
    storageInfo: "Keep frozen. Can be stored for up to 3 months.",
    category: "Soups & Stews"
  }
];
