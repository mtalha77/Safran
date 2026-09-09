export type MenuItem = {
  number: number;
  name: string;
  descriptionDe?: string;
  descriptionEn?: string;
  price: number;
};

export type MenuCategory = {
  id: string;
  title: string;
  subtitle?: string;
  noteDe?: string;
  noteEn?: string;
  items: MenuItem[];
};

export const menuCategories: MenuCategory[] = [
  {
    id: "vorspeisen",
    title: "Vorspeisen",
    subtitle: "Starters",
    items: [
      { number: 1, name: "Veggie Samosa (2 Stück)", descriptionDe: "Gemüse-Samosa mit Chutney", descriptionEn: "Vegetable samosa with chutney", price: 7.9 },
      { number: 2, name: "Veggie-Rolle (3 Stück)", descriptionDe: "Knusprige Frühlingsrollen gefüllt mit Gemüse und serviert mit Minzsauce oder süßer Chilisauce", descriptionEn: "Crispy spring rolls filled with vegetables and served with mint sauce or sweet chili sauce.", price: 7.9 },
      { number: 3, name: "Gemüse Pakora / Vegetable Pakora", descriptionDe: "Diverses frittiertes Gemüse nach Bombay Art", descriptionEn: "Assorted deep-fried vegetables, Bombay style", price: 8.5 },
      { number: 4, name: "Paneer Pakora", descriptionDe: "Käse in Kichererbsenmehl frittiert mit Mango-Sauce", descriptionEn: "Cheese deep-fried in chickpea flour with mango sauce", price: 8.9 },
      { number: 5, name: "Poulet Pakora / Chicken Pakora", descriptionDe: "Knochenlose Hühnerstücke mit Chutney und Joghurt", descriptionEn: "Boneless chicken pieces with chutney and yogurt", price: 11.9 },
      { number: 6, name: "Fish Pakora", descriptionDe: "Kleine Fischstücke frittiert in Kichererbsenmehl", descriptionEn: "Small pieces of fish deep-fried in chickpea flour", price: 11.9 },
      { number: 7, name: "Crevetten-Pakora / Shrimp Pakora", descriptionDe: "Zubereitet nach nordindischer Art", descriptionEn: "Prepared in the North Indian style", price: 14.9 },
      { number: 8, name: "Safran Mixed Vorspeisen / Saffron Mixed Appetizers", descriptionDe: "Fisch, Poulet, Crevetten, Gemüse und Paneer in Kichererbsenmehl", descriptionEn: "Fish, chicken, shrimp, vegetables, and paneer in chickpea flour", price: 20.9 },
      { number: 9, name: "Samosa Chaat", descriptionDe: "Zubereitet mit Kichererbsen, Zwiebeln, Tomaten, Gurken, Karotten, Kartoffeln und 2 Veggie-Samosas mit mild gewürzter Sauce.", descriptionEn: "Prepared with chickpeas, onions, tomatoes, cucumbers, carrots, and potatoes, 2 veg samosas with a mild spiced sauce", price: 9.9 },
      { number: 10, name: "Pappadom (3 Stück)", descriptionDe: "Mit Minzsauce", descriptionEn: "With mint sauce", price: 5.9 },
    ],
  },
  {
    id: "tandoori",
    title: "Tandoori-Grillvorspeisen",
    subtitle: "From the Clay Oven",
    items: [
      { number: 11, name: "Tandoori Chicken Tikka", descriptionDe: "Pouletfilet mit Joghurt, Safran, Zitrone und indischen Gewürzen", descriptionEn: "Chicken fillet with yogurt, saffron, lemon, and Indian spices", price: 28.9 },
      { number: 12, name: "Tandoori Fish Tikka", descriptionDe: "Marinierter Fisch mit Joghurt, Zitrone und indischen Gewürzen", descriptionEn: "Marinated fish with yogurt, lemon, and Indian spices", price: 29.9 },
      { number: 13, name: "Tandoori Lamb Tikka", descriptionDe: "Mariniertes Lammfilet mit Joghurt und indischen Gewürzen", descriptionEn: "Marinated lamb fillet with yogurt and Indian spices", price: 28.9 },
      { number: 14, name: "Tandoori Crevetten", descriptionDe: "Im Tandoor grillierte Crevetten", descriptionEn: "Tandoor-grilled prawns", price: 28.9 },
      { number: 15, name: "Safran Tandoori Mix Grill", descriptionDe: "Poulet, Lamm, Fisch und Crevetten", descriptionEn: "Chicken, lamb, fish, and shrimp", price: 31.9 },
    ],
  },
  {
    id: "salate",
    title: "Salate",
    subtitle: "Salad",
    items: [
      { number: 16, name: "Green Salad", descriptionDe: "Frische Eisbergsalatblätter, Gurke und grüne Oliven mit French- oder Italian-Dressing", descriptionEn: "Fresh iceberg lettuce leaf, cucumber, green olive with French or Italian dressing", price: 6.9 },
      { number: 17, name: "Gemischter Salat", descriptionDe: "Eisbergsalat, Tomaten, Gurken, Mais, Karotten, Oliven und Zitrone mit French- oder Italian-Dressing", descriptionEn: "Iceberg lettuce, tomatoes, cucumbers, corn, carrot, olive, lemon with French or Italian dressing", price: 8 },
      { number: 18, name: "Chicken Tikka Salad", descriptionDe: "Eisbergsalat, Tomaten, Gurken und Zwiebeln mit Chicken-Tikka-Stücken, serviert mit Minzsauce oder scharfer Chilisauce.", descriptionEn: "Iceberg lettuce, tomatoes, cucumbers, and onions with chicken tikka pieces, served with mint sauce or hot chili sauce", price: 9.9 },
    ],
  },
  {
    id: "brot",
    title: "Brot",
    subtitle: "Breads from the Oven",
    items: [
      { number: 19, name: "Plain Naan", price: 4.5 },
      { number: 20, name: "Butter Naan", price: 5.9 },
      { number: 21, name: "Garlic Naan", descriptionDe: "Zubereitet mit Knoblauch", descriptionEn: "Prepared with garlic", price: 5.9 },
      { number: 22, name: "Chili Naan", price: 6.9 },
      { number: 23, name: "Safran-Kashmiri Naan", descriptionDe: "Zubereitet mit Rosinen, Mandeln, Kokosnuss und Trockenfrüchten", descriptionEn: "Prepared with raisins, almonds, coconut, and dried fruits", price: 6.9 },
      { number: 24, name: "Cheese Naan", price: 6.5 },
      { number: 25, name: "Chapati Roti (2 Stück)", descriptionDe: "Fladenbrot mit Ruchmehl, in der Pfanne mit Butter zubereitet", descriptionEn: "Flatbread made with Ruchmehl, prepared in a pan with butter", price: 6.9 },
      { number: 26, name: "Gobi Paratha", descriptionDe: "Fladenbrot aus Weißmehl, gefüllt mit Blumenkohl und in der Pfanne mit Butter zubereitet", descriptionEn: "Flatbread made with white flour, filled with cauliflower, pan-fried in butter", price: 7.9 },
      { number: 27, name: "Onion Paratha (2 Stück)", descriptionDe: "Fladenbrot aus Weißmehl, gefüllt mit Zwiebeln und in der Pfanne mit Butter zubereitet", descriptionEn: "Flatbread made with white flour and filled with onions, pan-fried in butter", price: 7.9 },
    ],
  },
  {
    id: "vegetarisch",
    title: "Vegetarische Gerichte",
    subtitle: "Vegetarian Specialities",
    noteDe: "Alle Gerichte werden mit einer Portion Basmatireis serviert.",
    noteEn: "All dishes are served with a portion of basmati rice.",
    items: [
      { number: 28, name: "Aloo Matar", descriptionDe: "Grüne Erbsen und Kartoffeln zubereitet mit Currysauce", descriptionEn: "Green peas and potatoes prepared with curry sauce", price: 20.9 },
      { number: 29, name: "Safran Punjabi Dal", descriptionDe: "Indische Linsen zubereitet mit Butter, Zwiebeln und indischen Gewürzen", descriptionEn: "Indian lentils prepared with butter, onions, and Indian spices", price: 19.9 },
      { number: 30, name: "Mixed Vegetable Curry", descriptionDe: "Gemischtes Gemüse zubereitet in Butter mit indischen Gewürzen", descriptionEn: "Mixed vegetables prepared in butter with Indian spices", price: 18.9 },
      { number: 31, name: "Channa Masala", descriptionDe: "Getrocknete Kichererbsen zubereitet mit indischen Gewürzen", descriptionEn: "Dried chickpeas prepared with Indian spices", price: 20.9 },
      { number: 32, name: "Matar Paneer", descriptionDe: "Hausgemachter indischer Käse zubereitet mit Erbsen und würziger Sauce", descriptionEn: "Homemade Indian cheese prepared with peas and a spicy sauce", price: 22.9 },
      { number: 33, name: "Palak Paneer", descriptionDe: "Hausgemachter indischer Käse zubereitet mit Spinat und indischen Gewürzen", descriptionEn: "Homemade Indian cheese prepared with spinach and Indian spices", price: 22.9 },
      { number: 34, name: "Paneer Jalfrezi", descriptionDe: "Rahmkäse zubereitet mit Zwiebeln, Paprika, Knoblauch, Ingwer und Currysauce", descriptionEn: "Cream cheese prepared with onions, bell peppers, garlic, ginger, and curry sauce", price: 22.9 },
      { number: 35, name: "Bombay Potato", descriptionDe: "Kartoffeln zubereitet mit frischem Koriander und Ingwer-Knoblauchsauce", descriptionEn: "Potatoes prepared with fresh coriander and ginger-garlic sauce", price: 22.9 },
      { number: 36, name: "Kadai Paneer", descriptionDe: "Paneer und Paprika gekocht in einer würzigen Masala", descriptionEn: "Paneer and bell peppers cooked in a spicy masala", price: 22.9 },
      { number: 37, name: "Mango Gemüse Curry", descriptionDe: "Frisches Gemüse mit hausgemachter Mango-, Ingwer- und Knoblauchsauce", descriptionEn: "Fresh vegetables with homemade mango, ginger, and garlic sauce", price: 22.9 },
      { number: 38, name: "Butter Paneer Masala", descriptionDe: "Hausgemachter indischer Käse zubereitet in Buttersauce", descriptionEn: "Homemade Indian cheese prepared in a butter sauce", price: 22.9 },
      { number: 39, name: "Aloo Gobi Masala", descriptionDe: "Blumenkohl und Kartoffeln zubereitet mit Kräutern und Gewürzen", descriptionEn: "Cauliflower and potatoes prepared with herbs and spices", price: 21.9 },
      { number: 40, name: "Bhindi Masala", descriptionDe: "Gebratene und gekochte Okras mit Zwiebeln und indischen Gewürzen", descriptionEn: "Sautéed and cooked okra with onions and Indian spices", price: 22.9 },
      { number: 41, name: "Hausgemachtes Paneer Tikka Masala", descriptionDe: "Hausgemachter, frischer Käse mit Rahm-Tomatensauce und frischem Koriander", descriptionEn: "Homemade fresh cheese with a creamy tomato sauce and fresh cilantro", price: 23.9 },
    ],
  },
  {
    id: "poulet",
    title: "Gerichte mit Poulet",
    subtitle: "Chicken Specialities",
    noteDe: "Alle Gerichte werden mit einer Portion Basmatireis serviert.",
    noteEn: "All dishes are served with a portion of basmati rice.",
    items: [
      { number: 42, name: "Chicken Curry", descriptionDe: "Pouletfilet zubereitet nach Punjabi Art mit speziellen indischen Gewürzen", descriptionEn: "Chicken fillet prepared Punjabi-style with special Indian spices", price: 22.9 },
      { number: 43, name: "Safran Chicken Korma", descriptionDe: "Poulet mit geriebenen Mandeln, Kokos und Currysauce", descriptionEn: "Chicken with grated almonds, coconut, and curry sauce", price: 23.5 },
      { number: 44, name: "Butter Chicken", descriptionDe: "Pouletfilet zubereitet in Tomaten-Rahmsauce und indischen Gewürzen", descriptionEn: "Chicken fillet prepared in a tomato-cream sauce with Indian spices", price: 25.9 },
      { number: 45, name: "Palak Poulet", descriptionDe: "Poulet zubereitet mit Spinat, Ingwer und Knoblauchsauce", descriptionEn: "Chicken prepared with spinach, ginger, and garlic sauce", price: 23.9 },
      { number: 46, name: "Chicken Masala", descriptionDe: "Pouletfilet zubereitet mit Zwiebeln, Joghurt-Sahnesauce und indischen Gewürzen", descriptionEn: "Chicken fillet prepared with onions, a yogurt-cream sauce, and Indian spices", price: 22.9 },
      { number: 47, name: "Mango Chicken Curry", descriptionDe: "Poulet mit hausgemachter Mango-, Koriander-, Ingwer- und Knoblauchsauce", descriptionEn: "Chicken with homemade mango, coriander, ginger, and garlic sauce", price: 24.9 },
      { number: 48, name: "Chicken Tikka Masala", descriptionDe: "Mariniertes Tandoori-Pouletfilet zubereitet mit indischen Gewürzen", descriptionEn: "Marinated tandoori chicken fillet prepared with Indian spices", price: 26.9 },
      { number: 49, name: "Chili Chicken", descriptionDe: "Poulet mit frischem Knoblauch, Koriander und Tomaten-Chilisauce", descriptionEn: "Chicken with fresh garlic, coriander, and tomato-chili sauce", price: 25.9 },
      { number: 50, name: "Madras Curry", descriptionDe: "Pouletfilet in einer scharfen Kokosnusssauce", descriptionEn: "Chicken fillet in a spicy coconut sauce", price: 24.9 },
      { number: 51, name: "Lemon Chicken Tikka", descriptionDe: "Poulet Tikka mit Paprika, Chili, Zwiebeln, Tomaten und Zitrone", descriptionEn: "Chicken Tikka with bell peppers, chili, onions, tomatoes, and lemon", price: 29.9 },
      { number: 52, name: "Chicken Vindaloo", descriptionDe: "Pouletfilet zubereitet mit Kartoffeln", descriptionEn: "Chicken fillet prepared with potatoes", price: 24.9 },
      { number: 53, name: "Chicken Jalfrezi", descriptionDe: "Tandoori-Pouletfilet mit Zwiebeln, Tomaten, Paprika und Pfeffer", descriptionEn: "Tandoori chicken fillet with onions, tomatoes, bell peppers, and pepper", price: 23.5 },
      { number: 54, name: "Garlic Chicken", descriptionDe: "Poulet mit frischem Knoblauch, Koriander und Chilisauce", descriptionEn: "Chicken with fresh garlic, coriander, and chili sauce", price: 22.5 },
    ],
  },
  {
    id: "lamm",
    title: "Gerichte mit Lammfleisch",
    subtitle: "Lamb Specialities",
    noteDe: "Alle Gerichte werden mit einer Portion Basmatireis serviert.",
    noteEn: "All dishes are served with a portion of basmati rice.",
    items: [
      { number: 55, name: "Lamb Vindaloo", descriptionDe: "Lammfilet zubereitet mit Kartoffeln und indischen Gewürzen", descriptionEn: "Lamb fillet prepared with potatoes and Indian spices", price: 27.9 },
      { number: 56, name: "Lamb Safran Curry", descriptionDe: "Lammfilet zubereitet mit indischen Gewürzen nach indischer Art", descriptionEn: "Lamb fillet prepared with Indian spices in the Indian style", price: 24.9 },
      { number: 57, name: "Lamb Korma", descriptionDe: "Milde Sauce aus indischen Gewürzen, Rahmkäse, Mandeln, Cashew und Rosinen", descriptionEn: "Mild sauce made with Indian spices, cream cheese, almonds, cashews, and raisins", price: 27.9 },
      { number: 58, name: "Lamb Handi", descriptionDe: "Traditionelles Gericht aus Lamm, Gewürzen, Tomaten und Zwiebeln", descriptionEn: "Traditional dish made with lamb, spices, tomatoes, and onions", price: 27.9 },
      { number: 59, name: "Lamb Madras", descriptionDe: "Lammfilet in einer scharfen Kokosnuss-Currysauce", descriptionEn: "Lamb fillet in a spicy coconut curry sauce", price: 26.9 },
      { number: 60, name: "Lamb Spinat", descriptionDe: "Lamm zubereitet mit Spinat, Ingwer und Knoblauchsauce", descriptionEn: "Lamb prepared with spinach, ginger, and garlic sauce", price: 25.9 },
      { number: 61, name: "Lamb Rogan Josh", descriptionDe: "Aromatisch gewürztes Lamm nach Kashmiri Art mit Kashmiri-Chili", descriptionEn: "Aromatically spiced Kashmiri-style lamb with Kashmiri chili", price: 26.9 },
      { number: 62, name: "Lamb Tikka Masala", descriptionDe: "Gegrilltes Lammfilet mit frischem Koriander und Zwiebel-Knoblauchsauce", descriptionEn: "Grilled lamb fillet with fresh coriander and onion-garlic sauce", price: 27.5 },
      { number: 63, name: "Mango Lamb Curry", descriptionDe: "Lamm mit hausgemachter Mango-, Koriander- und Ingwersauce", descriptionEn: "Lamb with homemade mango, coriander, and ginger sauce", price: 25.9 },
      { number: 64, name: "Lamb Jalfrezi", descriptionDe: "Lammfilet zubereitet mit Tomaten, Zwiebeln, Paprika und Gewürzen", descriptionEn: "Lamb fillet prepared with tomatoes, onions, bell peppers, and spices", price: 25.9 },
    ],
  },
  {
    id: "rind",
    title: "Gerichte mit Rind",
    subtitle: "Beef Specialities",
    noteDe: "Alle Gerichte werden mit einer Portion Basmatireis serviert.",
    noteEn: "All dishes are served with a portion of basmati rice.",
    items: [
      { number: 65, name: "Beef Vindaloo (Mild Spicy)", descriptionDe: "Rindfleisch, zubereitet mit Zwiebeln und Tomatensauce, serviert mit Kartoffeln und einer speziellen Sauce mit indischen Gewürzen", descriptionEn: "Beef prepared with onions and tomato sauce, served with potatoes and a special Indian-spiced sauce", price: 26.9 },
      { number: 66, name: "Beef Indian Curry", descriptionDe: "Zubereitetes Rind mit mild gewürzter Zwiebel- und Tomatensauce", descriptionEn: "Prepared beef with mildly spiced onion and tomato sauce", price: 25.9 },
      { number: 67, name: "Beef Masala", descriptionDe: "Zubereitetes Rind mit frischen Zwiebeln, frischen Tomaten und mild gewürzter Sauce", descriptionEn: "Prepared beef with fresh onions and fresh tomatoes, and a mildly spiced sauce", price: 25.9 },
    ],
  },
  {
    id: "fisch",
    title: "Gerichte mit Fisch & Crevetten",
    subtitle: "Fish & Seafood",
    noteDe: "Alle Gerichte werden mit einer Portion Basmatireis serviert.",
    noteEn: "All dishes are served with a portion of basmati rice.",
    items: [
      { number: 68, name: "Goa Fisch Curry", descriptionDe: "Pangasiusfilet zubereitet mit Kokosnusssauce", descriptionEn: "Pangasius fillet prepared with coconut sauce", price: 28.9 },
      { number: 69, name: "Crevetten Curry", descriptionDe: "Zubereitet mit Zwiebelsauce, Tomatensauce und indischen Gewürzen", descriptionEn: "Shrimp prepared with onion sauce, tomato sauce, and Indian spices", price: 28.9 },
      { number: 70, name: "Fisch Madras Curry", descriptionDe: "Pangasiusfilet zubereitet mit speziellen indischen Gewürzen", descriptionEn: "Pangasius fillet prepared with special Indian spices", price: 27.9 },
      { number: 71, name: "Prawns Mughlai", descriptionDe: "Crevetten zubereitet mit Kokosnusssauce", descriptionEn: "Shrimp prepared with coconut sauce", price: 27.9 },
      { number: 72, name: "Mango Fisch Curry", descriptionDe: "Fisch an hausgemachter Mango-, Ingwer- und Knoblauchsauce", descriptionEn: "Fish with a homemade mango, ginger, and garlic sauce", price: 27.9 },
      { number: 73, name: "Mango Crevetten Curry", descriptionDe: "Crevetten an hausgemachter Mango-, Ingwer- und Knoblauchsauce", descriptionEn: "Shrimp in a homemade mango, ginger, and garlic sauce", price: 28.9 },
      { number: 74, name: "Crevetten Tikka Masala", descriptionDe: "Im Holzofen grilliert, mit Zwiebeln, Lauch und Garam Masala", descriptionEn: "Grilled in a wood-fired oven, with onions, leeks, and garam masala", price: 28.9 },
    ],
  },
  {
    id: "biryani",
    title: "Biryani",
    noteDe: "Jedes Biryani wird mit einer Portion Mixed Raita serviert.",
    items: [
      { number: 75, name: "Vegetable Biryani", descriptionDe: "Gemüsemix zubereitet mit Basmatireis und indischen Gewürzen", descriptionEn: "Mixed vegetables prepared with basmati rice and Indian spices", price: 21.9 },
      { number: 76, name: "Chicken Biryani", descriptionDe: "Poulet mit Basmatireis gemischt, zubereitet mit Safran und milden Gewürzen", descriptionEn: "Chicken and basmati rice cooked together with saffron and mild spices.", price: 23.9 },
      { number: 77, name: "Lamb Biryani", descriptionDe: "Lammstücke mit Basmatireis, Safran und indischen Gewürzen", descriptionEn: "Lamb pieces with basmati rice, saffron, and Indian spices", price: 24.9 },
      { number: 78, name: "Crevetten Biryani", descriptionDe: "Crevetten mit Basmatireis, indischen Gewürzen, Nüssen und Rosinen", descriptionEn: "Shrimp with basmati rice, Indian spices, nuts, and raisins", price: 27.9 },
      { number: 79, name: "Safran Spezial Mix Biryani", descriptionDe: "Basmatireis mit Lamm, Poulet und Crevetten, serviert mit Joghurtsauce", descriptionEn: "Basmati rice with lamb, chicken, and shrimp, served with yogurt sauce", price: 35.9 },
    ],
  },
  {
    id: "special-menu",
    title: "Spezialmenü",
    subtitle: "Special Menu",
    items: [
      { number: 80, name: "Veg Menu (2 Person)", descriptionDe: "1 Mixed Gemüse Pakora, 1 Mixed Gemüse Curry und 1 Punjabi Dal (gemischte Linsen), 2 Rice, 1 Garlic Naan, 1 Mango Lassi 0.3 l, 1 Mango Juice 0.30 l, Rasgulla (2 Pc)", price: 79.5 },
      { number: 81, name: "Veg Menu (3 Person)", descriptionDe: "1 Mixed Gemüse Pakora, 1 Palak Paneer, 1 Mixed Veggie Curry und 1 Punjabi Dal (gemischte Linsen), 3 Rice, 2 Garlic Naan, 1 Mango Lassi, 1 Mango Juice 1 l, Gulab Jamun (3 pc)", price: 108.9 },
      { number: 82, name: "Veg Menu (4 Person)", descriptionDe: "1 Mixed Gemüse Pakora, 1 Paneer Pakora, 1 Palak Paneer, 1 Mixed Veggie Curry, 1 Punjabi Dal (gemischte Linsen), 1 Bhindi (Okra) Masala, 4 Rice, 2 Garlic Naan, 2 Mango Lassi, 1 Mango Juice 1 l, Gulab Jamun (2 pc), Rasgulla (2 pc)", price: 138.9 },
      { number: 83, name: "Non Veg Menu (2 Person)", descriptionDe: "1 Safran Mixed Vorspeisen, 1 Butter Chicken und 1 Lamb Madras Curry, 2 Rice, 1 Garlic Naan, 1 Mango Lassi 0.30 l, 1 Mango Juice 0.30 l, Rasmalai (2 pc)", price: 93.5 },
      { number: 84, name: "Non Veg Menu (3 Person)", descriptionDe: "1 Safran Mixed Vorspeisen, 1 Butter Chicken, 1 Lamb Madras Curry, 1 Mango Chicken Curry, 3 Rice, 2 Garlic Naan, 1 Guava Juice 1 l, 1 Mango Lassi 0.30 l, Rasmalai (3 pc)", price: 118.9 },
      { number: 85, name: "Special Lamm Menu (2 Person) (Spicy)", descriptionDe: "1 Safran Mixed Vorspeisen, 1 Lamm Vindaloo, 1 Lamm Tikka Masala, 1 Mango Lassi 0.30 l, 1 Guava Juice 0.30 l, 2 Rice, 1 Garlic Naan, Gulab Jamun (2 pc)", price: 97.5 },
      { number: 86, name: "Special Lamm Menu (3 Person) (Spicy)", descriptionDe: "1 Safran Mixed Vorspeisen, 1 Lamm Vindaloo, 1 Lamm Tikka Masala, 1 Lamm Spinat, 3 Rice, 2 Garlic Naan, 2 Mango Lassi 0.30 l, Guava Juice 0.30 l, Gulab Jamun (3 pc)", price: 120.9 },
    ],
  },
  {
    id: "kinder",
    title: "Kindermenü",
    items: [
      { number: 87, name: "Pommes frites / French Fries", descriptionDe: "Mit Mayonnaise oder Ketchup", descriptionEn: "With mayonnaise or ketchup", price: 7.5 },
      { number: 88, name: "Vegi Nudeln", descriptionDe: "Spaghetti mit Tomaten-Basilikum-Sauce ohne Gewürze, serviert mit einer Portion Pommes frites", descriptionEn: "Prepared spaghetti with tomato-basil sauce (without spices) and served with a portion of French fries", price: 15.9 },
      { number: 89, name: "Chicken Nudeln", descriptionDe: "Spaghetti mit Poulet-Tomatensauce ohne Gewürze, serviert mit einer Portion Pommes frites", descriptionEn: "Prepared spaghetti with chicken and tomato sauce (unseasoned) and served with a portion of French fries.", price: 16.9 },
      { number: 90, name: "Chicken Nuggets (5 PC)", descriptionDe: "Serviert mit Pommes frites und Ketchup oder Mayonnaise.", descriptionEn: "Served with French fries and ketchup or mayonnaise", price: 12.9 },
    ],
  },
  {
    id: "desserts",
    title: "Indische Nachspeisen",
    subtitle: "Desserts",
    items: [
      { number: 91, name: "Gulab Jamun (2 Stück)", price: 6.9 },
      { number: 92, name: "Rasgulla (2 Stück)", price: 7 },
      { number: 93, name: "Rasmalai (1 Portion)", descriptionDe: "Süße Käseklößchen in gezuckerter Rahmmilch, verfeinert mit Kardamom und Pistazien", descriptionEn: "Sweet cheese dumplings in sweetened cream milk, refined with cardamom and pistachios", price: 12.9 },
    ],
  },
  {
    id: "extras",
    title: "Spezielle Beilagen",
    subtitle: "Special Extra Side Dishes",
    items: [
      { number: 94, name: "Plain Rice", price: 6 },
      { number: 95, name: "Lemon Rice", price: 7 },
      { number: 96, name: "Hot Chilli Sauce", price: 2.5 },
      { number: 97, name: "Sweet Chilli Sauce", price: 2.5 },
      { number: 98, name: "Mango Chutney", price: 2.5 },
      { number: 99, name: "Mixed Pickle", price: 3 },
      { number: 100, name: "Minzsauce", price: 4.5 },
      { number: 101, name: "Raita", descriptionDe: "Zubereitet mit mild gewürztem Joghurt, Gurken und Karotten", descriptionEn: "Prepared with mildly spiced yogurt, cucumber and carrots", price: 5 },
    ],
  },
  {
    id: "indische-getraenke",
    title: "Indische Getränke",
    subtitle: "Indian Beverages",
    items: [
      { number: 102, name: "Lassi Sweet (3dl)", descriptionDe: "Joghurt mit Zucker und Milch", descriptionEn: "Yogurt with sugar & milk", price: 7 },
      { number: 103, name: "Lassi Salzig (3dl)", descriptionDe: "Joghurt mit Salz und Milch", descriptionEn: "Yogurt with salt & milk", price: 7 },
      { number: 104, name: "Rose Milch (3dl)", descriptionDe: "Rosensirup, Joghurt und Zucker mit Milch", descriptionEn: "Rose syrup, yogurt & sugar with milk", price: 7.9 },
      { number: 105, name: "Mango Lassi (3dl)", descriptionDe: "Joghurt mit Zucker, Milch und Mango-Pulp", descriptionEn: "Yogurt with sugar, milk & mango pulp", price: 6.9 },
      { number: 106, name: "Guava Saft (1L) / Guava Juice", price: 7 },
      { number: 107, name: "Mango Saft (1L) / Mango Juice", price: 7 },
      { number: 108, name: "Pineapple Saft (1L) / Pineapple Juice", price: 7 },
      { number: 109, name: "Orange Saft (1L) / Orange Juice", price: 7 },
    ],
  },
  {
    id: "softdrinks",
    title: "Alkoholfreie Getränke",
    subtitle: "Soft Drinks",
    items: [
      { number: 110, name: "Mineralwasser (0.5l) / Mineral Water", price: 3.5 },
      { number: 111, name: "Mineralwasser San Pellegrino (0.5l) / San Pellegrino Mineral Water", price: 3.5 },
      { number: 112, name: "Coca Cola (0.45l)", price: 4 },
      { number: 113, name: "Coca Cola Zero (0.45l)", price: 4 },
      { number: 114, name: "Citro (0.5l)", price: 4 },
      { number: 115, name: "Eistee Zitrone (0.3l)", price: 4 },
      { number: 116, name: "Eistee Pfirsich (0.3l)", price: 4 },
      { number: 117, name: "Rivella Rot (0.5l)", price: 4 },
      { number: 118, name: "Apfelschorle (0.5l)", price: 4 },
      { number: 119, name: "Red Bull (0.25l)", price: 4 },
    ],
  },
];
