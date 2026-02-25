export const categories = ['All','Protein','Grains & Carbs','North Indian','South Indian','Street Food','Chinese/Momos','Breads','Fruits','Snacks','Beverages','Veggies','Meats'];

export type FoodItem = {
  name: string;
  em: string;
  p: number;
  c: number;
  fat: number;
  k: number;
  f: number;
  mode: 'gram' | 'count' | 'ml';
  unit?: string;
  cat: string;
  veg: 'Veg' | 'Egg' | 'Non-Veg';
  tip?: string;
};

export const foodData: FoodItem[] = [
  // AV'S STAPLES
  {name:"Rajma (Cooked)", em:"🫘", p:8.7, c:22, fat:0.5, k:127, f:6.4, mode:'gram', cat:'Protein', veg:'Veg', tip:"Rajma is good in protein and complex carbs for steady energy."},
  {name:"Milk (Buffalo/Full)", em:"🥛", p:3.8, c:5, fat:6, k:100, f:0, mode:'ml', cat:'Beverages', veg:'Veg', tip:"High calcium and quality protein. Essential for bone health."},
  {name:"Milk (High Prot/Fortified)", em:"🥛", p:8.0, c:4, fat:1.5, k:70, f:0, mode:'ml', cat:'Beverages', veg:'Veg', tip:"Excellent low-fat protein source for muscle recovery."},
  {name:"Oats (Raw)", em:"🥣", p:13, c:68, fat:6.5, k:389, f:10, mode:'gram', cat:'Grains & Carbs', veg:'Veg', tip:"Complex carbs with high fiber. Keeps you full for hours."},
  {name:"Bananas", em:"🍌", p:1.1, c:23, fat:0.3, k:89, f:2.6, mode:'count', unit:'banana', cat:'Fruits', veg:'Veg', tip:"Bananas are high in potassium which helps in providing energy."},
  {name:"Boiled Egg (Whole)", em:"🥚", p:6.3, c:0.6, fat:5.3, k:78, f:0, mode:'count', unit:'egg', cat:'Protein', veg:'Egg', tip:"Gold standard of protein. Yolk provides healthy essential fats."},
  {name:"Egg White", em:"⚪", p:3.6, c:0.2, fat:0.1, k:17, f:0, mode:'count', unit:'egg', cat:'Protein', veg:'Egg', tip:"Pure lean protein with almost zero fat or carbs."},
  {name:"Yoghurt (Plain)", em:"🥣", p:5, c:4.7, fat:3.3, k:61, f:0, mode:'gram', cat:'Protein', veg:'Veg', tip:"Great source of slow-digesting casein and gut-friendly probiotics."},
  {name:"Whey Protein", em:"🥤", p:24, c:3, fat:1.5, k:120, f:0, mode:'count', unit:'scoop', cat:'Protein', veg:'Veg', tip:"Fast-absorbing pure protein ideal for immediate post-workout recovery."},
  
  // HEROES & MEATS
  {name:"Chickpeas (Chole)", em:"🥣", p:9, c:27, fat:2.6, k:164, f:8, mode:'gram', cat:'Protein', veg:'Veg', tip:"Incredible plant protein and very high in dietary fiber."},
  {name:"Chicken Breast", em:"🍗", p:31, c:0, fat:3.6, k:165, f:0, mode:'gram', cat:'Meats', veg:'Non-Veg', tip:"Chicken is high in lean protein. Excellent for muscle building."},
  {name:"Paneer (Raw)", em:"🧀", p:18, c:1.2, fat:20, k:265, f:0, mode:'gram', cat:'Protein', veg:'Veg', tip:"High in protein but also high in fat. Great for bulk/keto."},
  {name:"Fish (Tuna/Rohu)", em:"🐟", p:22, c:0, fat:12, k:200, f:0, mode:'gram', cat:'Meats', veg:'Non-Veg', tip:"Packed with protein and healthy Omega-3 fats for brain health."},
  {name:"Soya Chunks", em:"🟤", p:52, c:33, fat:0.5, k:345, f:13, mode:'gram', cat:'Protein', veg:'Veg', tip:"Highest plant protein density. Extremely cheap and low fat."},
  {name:"Mutton Curry", em:"🍲", p:20, c:10, fat:25, k:350, f:1, mode:'count', unit:'bowl', cat:'Meats', veg:'Non-Veg', tip:"High in protein and iron, but very high in fat. Eat in moderation."},
  {name:"Goat Meat (Lean)", em:"🥩", p:25, c:0, fat:3, k:143, f:0, mode:'gram', cat:'Meats', veg:'Non-Veg', tip:"Very high quality protein, iron, and zinc. Lean cuts are healthy."},
  {name:"Pork (Lean)", em:"🥓", p:27, c:0, fat:4, k:143, f:0, mode:'gram', cat:'Meats', veg:'Non-Veg', tip:"High in protein and B-vitamins. Choose lean cuts to avoid excess fat."},
  {name:"Crab (Meat)", em:"🦀", p:19, c:0, fat:1.5, k:83, f:0, mode:'gram', cat:'Meats', veg:'Non-Veg', tip:"Extremely low calorie and low fat protein source."},

  // GRAINS & BREADS
  {name:"Wheat Flour (Atta)", em:"🌾", p:12, c:72, fat:1.7, k:340, f:11, mode:'gram', cat:'Breads', veg:'Veg', tip:"Standard Indian staple. Better fiber than refined maida."},
  {name:"Roti (Wheat)", em:"🫓", p:3, c:15, fat:0.4, k:85, f:2.5, mode:'count', unit:'roti', cat:'Breads', veg:'Veg', tip:"Great complex carb source for daily energy."},
  {name:"White Rice (Cooked)", em:"🍚", p:2.7, c:28, fat:0.3, k:130, f:0.4, mode:'gram', cat:'Grains & Carbs', veg:'Veg', tip:"Fast-digesting carbs. Perfect immediately after a workout."},
  {name:"Brown Rice (Cooked)", em:"🍚", p:2.6, c:23, fat:0.9, k:111, f:1.8, mode:'gram', cat:'Grains & Carbs', veg:'Veg', tip:"Lower glycemic index than white rice. Sustained energy."},
  {name:"Bajra (Millet)", em:"🥣", p:11, c:73, fat:5, k:360, f:1.3, mode:'gram', cat:'Grains & Carbs', veg:'Veg', tip:"Warm grain, high in iron and energy."},
  {name:"Ragi", em:"🌾", p:7.3, c:72, fat:1.3, k:330, f:11.5, mode:'gram', cat:'Grains & Carbs', veg:'Veg', tip:"Exceptional calcium content for bone strength."},
  {name:"Brown Bread", em:"🍞", p:2.5, c:14, fat:1, k:75, f:1.5, mode:'count', unit:'slice', cat:'Breads', veg:'Veg', tip:"Quick carb source. Check label for 100% whole wheat."},

  // DALS
  {name:"Toor Dal (Cooked)", em:"🥣", p:7.2, c:20, fat:0.5, k:120, f:4.5, mode:'count', unit:'bowl', cat:'Protein', veg:'Veg', tip:"Classic daily protein. Best absorbed when combined with rice/roti."},
  {name:"Moong Dal (Cooked)", em:"🥣", p:6.8, c:18, fat:0.4, k:105, f:4.2, mode:'count', unit:'bowl', cat:'Protein', veg:'Veg', tip:"Lightest on the stomach and very easy to digest."},
  {name:"Masoor Dal (Cooked)", em:"🥣", p:9, c:22, fat:0.5, k:130, f:5.5, mode:'count', unit:'bowl', cat:'Protein', veg:'Veg', tip:"Cooks fast and packs a great protein punch."},
  
  // NORTH & SOUTH INDIAN
  {name:"Dal Makhani", em:"🥘", p:11, c:35, fat:15, k:400, f:8, mode:'count', unit:'bowl', cat:'North Indian', veg:'Veg', tip:"Delicious but high in fat and calories due to cream/butter."},
  {name:"Chole Bhature", em:"🥟", p:16.5, c:85, fat:30, k:700, f:8, mode:'count', unit:'plate', cat:'North Indian', veg:'Veg', tip:"Extremely high in fat, refined carbs, and calories. Treat meal."},
  {name:"Dosa (Plain)", em:"🥞", p:3.5, c:30, fat:2, k:160, f:1, mode:'count', unit:'dosa', cat:'South Indian', veg:'Veg', tip:"Fermented batter is excellent for gut health."},
  {name:"Idli (2pcs)", em:"⚪", p:3.5, c:25, fat:0.5, k:120, f:1, mode:'count', unit:'plate', cat:'South Indian', veg:'Veg', tip:"Steamed, oil-free, and gut-friendly carb source."},
  {name:"Chicken Curry", em:"🥘", p:16, c:5, fat:10, k:180, f:1, mode:'gram', cat:'North Indian', veg:'Non-Veg', tip:"Classic protein source. Macros vary heavily depending on the oil used in gravy."},
  
  // REGIONAL BREADS
  {name:"White Bread (Sliced)", em:"🍞", p:9, c:50.5, fat:3, k:265, f:2, mode:'gram', cat:'Breads', veg:'Veg', tip:"Refined maida flour, soft and fluffy."},
  {name:"Multigrain Bread", em:"🍞", p:11, c:42.5, fat:4, k:250, f:7, mode:'gram', cat:'Breads', veg:'Veg', tip:"Mix of wheat, oats, seeds, barley. Higher fiber."},
  {name:"Naan", em:"🫓", p:10, c:49, fat:6, k:290, f:2, mode:'gram', cat:'North Indian', veg:'Veg', tip:"Leavened, tandoor-baked maida bread."},
  {name:"Paratha (Plain)", em:"🫓", p:7, c:45.2, fat:14, k:335, f:7, mode:'gram', cat:'North Indian', veg:'Veg', tip:"Layered, griddled wheat bread. Calorie dense."},
  
  // PROTEINS & DAIRY
  {name:"Coconut Milk", em:"🥥", p:3, c:5, fat:21, k:221, f:0.5, mode:'ml', cat:'Beverages', veg:'Veg', tip:"High in MCT fats and calories, use sparingly."},
  {name:"Curd (Full Fat)", em:"🥛", p:4, c:4, fat:3, k:59, f:0, mode:'gram', cat:'Protein', veg:'Veg', tip:"Great natural probiotic for gut health and digestion."},
  {name:"Peanuts (Roasted)", em:"🥜", p:26, c:16, fat:49, k:609, f:8, mode:'gram', cat:'Snacks', veg:'Veg', tip:"High protein and high healthy fats. Extremely calorie dense."},
  {name:"Cheddar Cheese", em:"🧀", p:25, c:1.5, fat:33, k:403, f:0, mode:'gram', cat:'Protein', veg:'Veg', tip:"High protein and calcium, but very calorie-dense."},
  {name:"Greek Yoghurt", em:"🥛", p:10, c:4, fat:4, k:92, f:0, mode:'gram', cat:'Protein', veg:'Veg', tip:"Incredible low-calorie, high-protein snack."},
  
  // VEGETABLES & LEGUMES
  {name:"Aloo (Boiled Potato)", em:"🥔", p:2, c:17, fat:0.1, k:77, f:2, mode:'gram', cat:'Veggies', veg:'Veg', tip:"Great complex carb and highly satiating. High potassium."},
  {name:"Palak (Spinach Cooked)", em:"🥬", p:3, c:4, fat:0.5, k:32, f:2, mode:'gram', cat:'Veggies', veg:'Veg', tip:"Super low calorie, packed with iron and micronutrients."},
  {name:"Kala Chana (Boiled)", em:"🫘", p:19, c:61, fat:6, k:374, f:12, mode:'gram', cat:'Protein', veg:'Veg', tip:"High fiber complex carb source. Great sustained energy."},
  {name:"Kabuli Chana (Boiled)", em:"🫘", p:19, c:61, fat:6, k:374, f:17, mode:'gram', cat:'Protein', veg:'Veg', tip:"Superior fiber for digestion, forms a complete protein with rice."}
];

export const avTimelineData = [
  { time: "Morning", title: "Protein + Oat Shake", desc: "High protein start", macros: "40g P, 50g C, 5g F, 405 kcal" },
  { time: "Lunch", title: "Rajma Chawal", desc: "200g Rice & 30g Rajma", macros: "15g P, 70g C, 4g F, 376 kcal" },
  { time: "Evening", title: "High Prot Milk + Bananas", desc: "20g Prot milk + 3 Bananas", macros: "23g P, 90g C, 3g F, 479 kcal" },
  { time: "Post-Workout", title: "8 Eggs", desc: "6 whole eggs + 2 egg whites", macros: "44g P, 3g C, 30g F, 458 kcal" },
  { time: "Late Night", title: "Yoghurt Shake", desc: "Slow digesting casein", macros: "12g P, 25g C, 3g F, 175 kcal" },
  { time: "Pre-Sleep", title: "Protein + Oat Shake", desc: "Final macro hit", macros: "40g P, 50g C, 5g F, 405 kcal" }
];

export const avBaseline = { p: 174, c: 288, fat: 50, k: 2298 };

export const budgetPlans: Record<string, {title: string, desc: string, cost: string, macros: string}[]> = {
  'Veg': [
    { title: "Under ₹120/Day", desc: "Soya Chunks (50g), Milk (500ml), Toor Dal (2 bowls), Peanuts (30g), Curd (100g)", cost: "₹120", macros: "~60g-70g P" },
    { title: "Under ₹200/Day", desc: "Paneer (200g), Soya Chunks (40g), Milk (500ml), Dal + Rice, Whey Sachet", cost: "₹200", macros: "~110g+ P" }
  ],
  'Egg': [
    { title: "Under ₹120/Day", desc: "6 Whole Eggs, Soya Chunks (30g), Milk (250ml), Dal + Rice & 2 Bananas", cost: "₹120", macros: "~75g P" },
    { title: "Under ₹200/Day", desc: "10 Eggs (2 whole, 8 whites), Chicken Breast (100g), Oats + Milk, Bread/Roti", cost: "₹200", macros: "~100g+ P" }
  ],
  'Non-Veg': [
    { title: "Under ₹120/Day", desc: "Chicken Breast (150g), 2 Eggs, Dal + Rice, Seasonal Fruit", cost: "₹120", macros: "~70g-80g P" },
    { title: "Under ₹200/Day", desc: "Chicken Breast (250g), 4 Eggs, Curd, Rice/Roti", cost: "₹200", macros: "~115g+ P" }
  ]
};

export const timingPlans: Record<string, {time: string, title: string, desc: string}[]> = {
  'All': [
    { time: "Breakfast", title: "Complex Carbs + Primary Protein", desc: "Oats/Toast + Primary Protein source." },
    { time: "Lunch", title: "Balanced Meal", desc: "Dal/Meat + Grain + Fiber (Salad)." },
    { time: "Pre-Workout", title: "Energy Boost", desc: "Fast carbs (Banana) + Coffee for energy." },
    { time: "Post-Workout", title: "Fast Recovery", desc: "Fastest absorbing protein (Whey/Egg whites/Lean meat)." },
    { time: "Dinner", title: "Lean & Low Carb", desc: "Low carb, lean protein (Paneer/Fish/Bhurji)." }
  ]
};

export type MealItem = {
  id: number;
  name: string;
  em: string;
  qtyStr: string;
  p: number;
  c: number;
  fat: number;
  k: number;
  f: number;
};

export type DailyLogEntry = {
  time: string;
  items: string;
  p: number;
  c: number;
  k: number;
};
