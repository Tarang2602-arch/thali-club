// Vegetarian restaurants in Ahmedabad with Jain (no onion, no garlic) food.
// Prices are approximate "for two". Always tell the waiter "Jain" when ordering.
// Photos are Creative Commons dish/venue photos from Wikimedia Commons, not every
// photo is of that exact restaurant — "Real photos" opens Google Maps for that.
//
// jain: "sattvic" = whole kitchen is onion & garlic free
//       "jain"    = Jain menu / Jain on request
//       "ask"     = not confirmed — check with the outlet
// pureVeg: false = also serves non-veg

const W = (path) => `https://thumb.wikimedia.org/wikipedia/commons/thumb/${path}`;

const P = {
  thali: [
    W("1/19/Authentic_gujarati_thali.jpg/960px-Authentic_gujarati_thali.jpg"),
    W("4/40/Gujarati_Thali.jpg/960px-Gujarati_Thali.jpg"),
    W("8/84/Gujarati_Thali_1.jpg/960px-Gujarati_Thali_1.jpg"),
    W("a/a1/Indian_Thali_2.jpg/960px-Indian_Thali_2.jpg"),
    W("e/ec/Indian_thali_with_poori_and_rice.jpg/960px-Indian_thali_with_poori_and_rice.jpg"),
    W("4/4b/Dal_dhokli.JPG/960px-Dal_dhokli.JPG"),
    W("8/86/Shrikhand.JPG/960px-Shrikhand.JPG"),
    W("5/5e/Undhiyu.jpg/960px-Undhiyu.jpg"),
    W("9/9f/Dhokla_2.jpg/960px-Dhokla_2.jpg"),
    W("b/bc/Thepla_2.jpg/960px-Thepla_2.jpg"),
    W("0/0b/Gujarati_Daal-Dhokli.jpg/960px-Gujarati_Daal-Dhokli.jpg"),
    W("4/40/Shrikhand_and_Aamras.jpg/960px-Shrikhand_and_Aamras.jpg"),
  ],
  kathiyawadi: [
    W("5/59/GKN_Rajasthani_Thali_DSC_0213.JPG/960px-GKN_Rajasthani_Thali_DSC_0213.JPG"),
    W("d/d0/Chapdi_Undhiyu_%28Tavo%29.JPG/960px-Chapdi_Undhiyu_%28Tavo%29.JPG"),
    W("4/4d/Indian_Thali_2024.jpg/960px-Indian_Thali_2024.jpg"),
    W("7/7e/Masala_thepla_with_Methi_kela.JPG/960px-Masala_thepla_with_Methi_kela.JPG"),
    W("b/b7/Rajasthani_Thali_%2826444240868%29.jpg/960px-Rajasthani_Thali_%2826444240868%29.jpg"),
    W("c/c8/Vegetable_Khichdi_1.jpg/960px-Vegetable_Khichdi_1.jpg"),
  ],
  rajasthani: [
    W("9/94/Rajasthani_Thali_at_Rajdhani.jpg/960px-Rajasthani_Thali_at_Rajdhani.jpg"),
    W("1/17/Dal_Baati.jpg/960px-Dal_Baati.jpg"),
    W("0/0f/Dal_Baati_2.jpg/960px-Dal_Baati_2.jpg"),
    W("f/f5/Jalebi_1.jpg/960px-Jalebi_1.jpg"),
  ],
  south: [
    W("2/2e/Masala_Dosa_in_Banana_Leaf_with_Chutney.jpg/960px-Masala_Dosa_in_Banana_Leaf_with_Chutney.jpg"),
    W("1/1d/Idli_Sambhar_with_Coconut_Chatni.jpg/960px-Idli_Sambhar_with_Coconut_Chatni.jpg"),
    W("a/a4/Masala_Dosa_and_Vada.jpg/960px-Masala_Dosa_and_Vada.jpg"),
    W("4/43/Masala_dosa_01.jpg/960px-Masala_dosa_01.jpg"),
    W("8/89/Idli.jpg/960px-Idli.jpg"),
    W("0/0e/Idli_and_vada_with_chutney_and_sambar.jpg/960px-Idli_and_vada_with_chutney_and_sambar.jpg"),
    W("6/6e/Masala_dosa_2.jpg/960px-Masala_dosa_2.jpg"),
  ],
  street: [
    W("1/1a/Pav_bhaji.jpg/960px-Pav_bhaji.jpg"),
    W("3/3f/Dahi_Puri_%28Indian_snack%29.jpg/960px-Dahi_Puri_%28Indian_snack%29.jpg"),
    W("5/5c/Crispy_Pani_Puri.jpg/960px-Crispy_Pani_Puri.jpg"),
    W("b/b2/Khaman-surarti.jpg/960px-Khaman-surarti.jpg"),
    W("2/21/Pav_bhaji_SWW.jpg/960px-Pav_bhaji_SWW.jpg"),
    W("2/2f/Dahi_Puri_and_Pani_Puri_from_Bombay.jpg/960px-Dahi_Puri_and_Pani_Puri_from_Bombay.jpg"),
    W("a/a4/Khaman_dhokla_%28cropped%29.jpg/960px-Khaman_dhokla_%28cropped%29.jpg"),
    W("9/91/Handvo_Gujarati_Food.jpg/960px-Handvo_Gujarati_Food.jpg"),
    W("e/ec/Dhokla_3.jpg/960px-Dhokla_3.jpg"),
  ],
  north: [
    W("6/6f/Paneer_Butter_Masala_2.jpg/960px-Paneer_Butter_Masala_2.jpg"),
    W("a/aa/Chole_Bhature_1.jpg/960px-Chole_Bhature_1.jpg"),
    W("0/02/Paratha_Sabji_MA01.jpg/960px-Paratha_Sabji_MA01.jpg"),
    W("8/8b/North_Indian_Vegetarian_Thali-MB51.jpg/960px-North_Indian_Vegetarian_Thali-MB51.jpg"),
    W("7/7e/Paneer_Butter_Masala_3.jpg/960px-Paneer_Butter_Masala_3.jpg"),
    W("f/f0/Chole_Bhature_3.jpg/960px-Chole_Bhature_3.jpg"),
    W("1/19/Paneer_butter_masala_2.jpg/960px-Paneer_butter_masala_2.jpg"),
    W("1/17/Paneer_Butter_Masala_4.jpg/960px-Paneer_Butter_Masala_4.jpg"),
  ],
  italian: [
    W("d/de/Margherita_pizza_on_plate.jpg/960px-Margherita_pizza_on_plate.jpg"),
    W("9/99/Wood_Fired_Pizza.jpg/960px-Wood_Fired_Pizza.jpg"),
    W("7/7e/Vegetarian_Pizza.jpg/960px-Vegetarian_Pizza.jpg"),
    W("d/d7/Pizza_baking_in_Wood-fired_oven.jpg/960px-Pizza_baking_in_Wood-fired_oven.jpg"),
    W("e/e6/Veggie_pizza.jpg/960px-Veggie_pizza.jpg"),
    W("a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/960px-Eq_it-na_pizza-margherita_sep2005_sml.jpg"),
  ],
  mexican: [
    W("4/4f/Mexican_food_vegetarian_tacos_20260607_161424_%281%29.jpg/960px-Mexican_food_vegetarian_tacos_20260607_161424_%281%29.jpg"),
    W("7/71/Nachos_with_sour_cream%2C_salsa_and_guacamole.jpg/960px-Nachos_with_sour_cream%2C_salsa_and_guacamole.jpg"),
    W("2/2a/Burrito_Bowl_-_La_Casa_Restaurant_-_Sarah_Stierch_-_2021-09-29.jpg/960px-Burrito_Bowl_-_La_Casa_Restaurant_-_Sarah_Stierch_-_2021-09-29.jpg"),
    W("e/ed/Vegetarian_tacos_at_Cabuche.jpg/960px-Vegetarian_tacos_at_Cabuche.jpg"),
    W("f/f4/Quesadilla_de_huitlacoche.jpg/960px-Quesadilla_de_huitlacoche.jpg"),
    "https://upload.wikimedia.org/wikipedia/commons/7/78/Nachos_with_Melted_Cheese%2C_Jalapenos%2C_and_Tasty_Toppings.jpg",
  ],
  asian: [
    W("6/68/Steamed_Cabbage_Dim-Sum_Dumplings_%288191187970%29.jpg/960px-Steamed_Cabbage_Dim-Sum_Dumplings_%288191187970%29.jpg"),
    W("2/23/Bao_Buns.jpg/960px-Bao_Buns.jpg"),
    W("3/3b/Vegetable_Yakisoba.jpg/960px-Vegetable_Yakisoba.jpg"),
    "https://upload.wikimedia.org/wikipedia/commons/d/de/Homemade_Sushi.jpg",
    W("b/bc/Vegetable_Seedling_Dumplings.jpg/960px-Vegetable_Seedling_Dumplings.jpg"),
  ],
  cafe: [
    W("4/41/The_ultimate_veggie_burger.jpg/960px-The_ultimate_veggie_burger.jpg"),
    W("d/d0/Burger_and_fries_on_a_wooden_plate.jpg/960px-Burger_and_fries_on_a_wooden_plate.jpg"),
    W("e/e6/Veggie_pizza.jpg/960px-Veggie_pizza.jpg"),
    W("2/28/Mushroom_vegetarian_burger_-_Grubbs.jpg/960px-Mushroom_vegetarian_burger_-_Grubbs.jpg"),
    W("5/5c/Crispy_Pani_Puri.jpg/960px-Crispy_Pani_Puri.jpg"),
  ],
  multi: [
    W("f/f5/Continental_Sizzler_-_Ganeshwaram%2C_Noida_-_Uttar_Pradesh.jpg/960px-Continental_Sizzler_-_Ganeshwaram%2C_Noida_-_Uttar_Pradesh.jpg"),
    W("6/6f/Paneer_Butter_Masala_2.jpg/960px-Paneer_Butter_Masala_2.jpg"),
    W("7/7e/Vegetarian_Pizza.jpg/960px-Vegetarian_Pizza.jpg"),
    W("4/4f/Mexican_food_vegetarian_tacos_20260607_161424_%281%29.jpg/960px-Mexican_food_vegetarian_tacos_20260607_161424_%281%29.jpg"),
    W("b/b1/Shashlik_sizzler.jpg/960px-Shashlik_sizzler.jpg"),
    W("3/3b/Vegetable_Yakisoba.jpg/960px-Vegetable_Yakisoba.jpg"),
  ],
  dessert: [
    W("3/3a/Jalebi_in_a_bowl.jpg/960px-Jalebi_in_a_bowl.jpg"),
    W("4/40/Shrikhand_and_Aamras.jpg/960px-Shrikhand_and_Aamras.jpg"),
    W("f/f5/Jalebi_1.jpg/960px-Jalebi_1.jpg"),
    W("8/86/Shrikhand.JPG/960px-Shrikhand.JPG"),
  ],
};

// Pick 3 photos from a pool, rotating so neighbouring cards don't look identical.
let rot = 0;
const pick = (pool) => { const p = P[pool]; const s = rot++ % p.length; return [p[s], p[(s + 1) % p.length], p[(s + 2) % p.length]]; };

const JAIN_TEXT = { sattvic: "Entire kitchen is onion & garlic free", jain: "Jain food available — say “Jain” while ordering", ask: "Not confirmed — ask the outlet for no onion / no garlic" };

const R = (r) => ({
  pureVeg: true,
  jain: "jain",
  address: `${r.area}, Ahmedabad`,
  mapsQuery: `${r.name} ${r.area} Ahmedabad`,
  vibe: "",
  picks: [],
  ...r,
  jainNote: r.jainNote || JAIN_TEXT[r.jain || "jain"],
  photos: r.photos || pick(r.pool || "multi"),
});

export const RESTAURANTS = [
  // ── Gujarati thali & heritage ───────────────────────────────
  R({ id: "agashiye", name: "Agashiye", tagline: "Rooftop heritage thali at The House of MG", area: "Lal Darwaja", address: "The House of MG, Opp. Sidi Saiyed Jali, Lal Darwaja, Ahmedabad 380001", mapsQuery: "Agashiye The House of MG Lal Darwaja Ahmedabad", cuisine: ["Gujarati Thali"], price: 2400, jainNote: "Whole thali can be made Jain on request", vibe: "Candle-lit terrace, 1920s mansion", picks: ["Jain Gujarati thali", "Seasonal farsan", "Hand-churned ice cream", "Kadhi & khichdi"],
    photos: [W("1/19/Authentic_gujarati_thali.jpg/960px-Authentic_gujarati_thali.jpg"), W("8/86/Shrikhand.JPG/960px-Shrikhand.JPG"), W("c/c9/Undhiyo%2C_handvo%2C_roti_served_with_gajar_ka_halwa.jpg/960px-Undhiyo%2C_handvo%2C_roti_served_with_gajar_ka_halwa.jpg")] }),
  R({ id: "vishalla", name: "Vishalla", tagline: "Village-style dinner under lanterns", area: "Vasna", address: "Opp. APMC Market, Vishala Circle, Vasna, Ahmedabad 380055", mapsQuery: "Vishalla Restaurant Vasna Ahmedabad", cuisine: ["Gujarati Thali"], price: 1400, jainNote: "Jain thali on prior request", vibe: "Floor seating, leaf plates, folk music", picks: ["Kathiyawadi thali (Jain)", "Bajra rotla with ghee", "Chaas", "Sukhdi"],
    photos: [W("a/aa/Gujarati_Thali_at_Vishalla.jpg/960px-Gujarati_Thali_at_Vishalla.jpg"), W("0/0e/Vishalla_Art_Gallery.jpg/960px-Vishalla_Art_Gallery.jpg"), W("4/41/Vishalla_Art_Gallery_2.jpg/960px-Vishalla_Art_Gallery_2.jpg")] }),
  R({ id: "gordhan-thal", name: "Gordhan Thal", tagline: "Royal unlimited thali, legendary service", area: "Bodakdev", address: "Ground Floor, Sapath Complex, SG Highway, Opp. Rajpath Club, Bodakdev, Ahmedabad 380052", mapsQuery: "Gordhan Thal Sapath Complex SG Highway Ahmedabad", cuisine: ["Gujarati Thali", "Rajasthani"], price: 1100, jainNote: "Separate Jain thali available", vibe: "Bright, family-friendly, fast refills", picks: ["Jain unlimited thali", "Dal baati", "Jalebi", "Rotla-bhakhri"],
    photos: [W("b/b1/Gordhan_Thal.jpg/960px-Gordhan_Thal.jpg"), W("9/9f/Dhokla_2.jpg/960px-Dhokla_2.jpg"), W("f/f5/Jalebi_1.jpg/960px-Jalebi_1.jpg")] }),
  R({ id: "rajwadu", name: "Rajwadu", tagline: "Open-air Rajasthani village by the lake", area: "Jivraj Park", address: "Nr. Jivraj Tolnaka, Behind Ambaji Temple, Malav Talav, Jivraj Park, Ahmedabad 380051", mapsQuery: "Rajwadu Restaurant Malav Talav Jivraj Park Ahmedabad", cuisine: ["Gujarati Thali", "Rajasthani"], price: 1400, jainNote: "Jain thali available — mention at entry", vibe: "Khatiya seating, puppet shows, courtyard", picks: ["Jain Rajasthani thali", "Dal baati churma", "Gatte (Jain)", "Malpua"],
    photos: [W("5/59/GKN_Rajasthani_Thali_DSC_0213.JPG/960px-GKN_Rajasthani_Thali_DSC_0213.JPG"), W("1/17/Dal_Baati.jpg/960px-Dal_Baati.jpg"), W("7/7b/Handvo_1.jpg/960px-Handvo_1.jpg")] }),
  R({ id: "toran", name: "Toran Dining Hall", tagline: "30+ years of classic unlimited thali", area: "Ashram Road", address: "Opp. Sales India, Ashram Road, Ahmedabad 380009", cuisine: ["Gujarati Thali"], price: 700, vibe: "No-fuss, great value", picks: ["Jain unlimited thali", "Dal dhokli", "Two farsans", "Seasonal sweet"], pool: "thali" }),
  R({ id: "gopi", name: "Gopi Dining Hall", tagline: "Old-school favourite near Town Hall", area: "Ellisbridge", address: "Nr. V.S. Hospital, Ellisbridge, Ahmedabad 380006", cuisine: ["Gujarati Thali"], price: 700, vibe: "Homely taste, loved by locals", picks: ["Jain Gujarati thali", "Kadhi-khichdi", "Puran poli"], pool: "thali" }),
  R({ id: "pakwan", name: "Pakwan Dining Hall", tagline: "Ahmedabad's oldest thali house", area: "Paldi", cuisine: ["Gujarati Thali"], price: 700, vibe: "Classic dining hall", picks: ["Jain thali", "Papad & chutney spread", "Shrikhand"], pool: "thali" }),
  R({ id: "atithi", name: "Atithi Dining Hall", tagline: "Unlimited thali — “a hug on a plate”", area: "Bodakdev", cuisine: ["Gujarati Thali"], price: 800, vibe: "Family dining hall", picks: ["Jain thali", "Farsan of the day", "Aamras (season)"], pool: "thali" }),
  R({ id: "royal-vega", name: "Royal Vega (ITC Narmada)", tagline: "Five-star vegetarian thali", area: "Vastrapur", address: "ITC Narmada, Judges Bungalow Rd, Vastrapur, Ahmedabad", cuisine: ["Gujarati Thali", "North Indian"], price: 4000, vibe: "Luxury fine dining", picks: ["Jain royal thali", "Seasonal sweets"], pool: "thali" }),
  R({ id: "annkut", name: "Annkut", tagline: "Premium Gujarati thali experience", area: "Anand Nagar", cuisine: ["Gujarati Thali"], price: 1200, picks: ["Jain thali", "Live farsan"], pool: "thali" }),
  R({ id: "iscon-thal", name: "Iscon Thal", tagline: "Popular thali stop on SG Highway", area: "Iscon Cross Road", cuisine: ["Gujarati Thali"], price: 900, picks: ["Jain thali", "Kadhi-khichdi"], pool: "thali" }),
  R({ id: "ame-gujarati", name: "Ame Gujarati", tagline: "Simple, homely Gujarati food", area: "Ellisbridge", cuisine: ["Gujarati Thali"], price: 600, picks: ["Jain thali", "Dal-bhaat"], pool: "thali" }),
  R({ id: "thakar-thal", name: "Thakar Thal", tagline: "Budget unlimited thali", area: "Ellisbridge", cuisine: ["Gujarati Thali"], price: 600, picks: ["Jain thali", "Rotli-shaak"], pool: "thali" }),
  R({ id: "maruti-thali", name: "Maruti Gujarati Thali", tagline: "Light, health-conscious thali", area: "Vastrapur", cuisine: ["Gujarati Thali"], price: 600, picks: ["Jain thali"], pool: "thali" }),
  R({ id: "dadi-dining", name: "Dadi Dining Hall", tagline: "Grandma-style Gujarati cooking", area: "Paldi", cuisine: ["Gujarati Thali"], price: 500, picks: ["Jain thali", "Dal dhokli"], pool: "thali" }),
  R({ id: "gwalbhog", name: "GwalBhog", tagline: "Gujarati-Rajasthani thali up north", area: "Chandkheda", cuisine: ["Gujarati Thali", "Rajasthani"], price: 800, picks: ["Jain thali", "Dal baati"], pool: "rajasthani" }),
  R({ id: "aagrah", name: "Aagrah", tagline: "Family thali restaurant", area: "Chandkheda", cuisine: ["Gujarati Thali"], price: 800, picks: ["Jain thali"], pool: "thali" }),
  R({ id: "raj-thaal", name: "The Raj Thaal", tagline: "Royal Gujarati-Rajasthani thaal", area: "Bopal", cuisine: ["Gujarati Thali", "Rajasthani"], price: 900, picks: ["Jain thaal", "Churma ladoo"], pool: "rajasthani" }),
  R({ id: "vintage-village", name: "The Vintage Village", tagline: "Village-themed outing on the outskirts", area: "Kathwada", cuisine: ["Gujarati Thali", "Multi-cuisine"], price: 1200, vibe: "Open-air, good for groups", picks: ["Jain thali", "Live counters"], pool: "thali" }),
  R({ id: "karma-cafe", name: "Karma Cafe", tagline: "Sattvik Gujarati meals", area: "Navrangpura", cuisine: ["Gujarati Thali", "Healthy"], price: 500, jain: "sattvic", picks: ["Sattvik thali", "Khichdi"], pool: "thali" }),
  R({ id: "chandravilas", name: "Chandravilas", tagline: "Fafda-jalebi legend since 1900", area: "Old City", address: "Gandhi Road, Old City, Ahmedabad", mapsQuery: "Chandravilas Restaurant Gandhi Road Ahmedabad", cuisine: ["Gujarati Thali", "Street Food"], price: 400, vibe: "Heritage eatery, breakfast hotspot", picks: ["Fafda-jalebi", "Gujarati thali (Jain)"], pool: "street" }),

  // ── Kathiyawadi ─────────────────────────────────────────────
  R({ id: "grand-thakar", name: "The Grand Thakar", tagline: "Warm Kathiyawadi home-style thali", area: "Iscon Cross Road", cuisine: ["Kathiyawadi", "Gujarati Thali"], price: 1000, picks: ["Jain Kathiyawadi thali", "Sev tameta (Jain)", "Bajra rotla"], pool: "kathiyawadi" }),
  R({ id: "marutinandan", name: "Marutinandan Kathiyawadi", tagline: "Famous Kathiyawadi franchise", area: "SG Highway", cuisine: ["Kathiyawadi"], price: 700, picks: ["Jain sev tameta", "Ringan no olo (ask)", "Bajra rotla & gol"], pool: "kathiyawadi" }),
  R({ id: "shivshakti", name: "Shivshakti Kathiyawadi", tagline: "Hot phulkas, honest prices", area: "Paldi", cuisine: ["Kathiyawadi"], price: 500, picks: ["Jain Kathiyawadi thali", "Fresh phulka"], pool: "kathiyawadi" }),
  R({ id: "purohit-thali", name: "Purohit Thali Ghar", tagline: "Quick Kathiyawadi thali", area: "Thaltej", cuisine: ["Kathiyawadi", "Gujarati Thali"], price: 500, picks: ["Jain thali"], pool: "kathiyawadi" }),

  // ── Sattvik / temple / healthy ──────────────────────────────
  R({ id: "govindas", name: "Govinda's (ISKCON)", tagline: "100% no onion, no garlic — the whole menu", area: "Satellite", address: "ISKCON Temple Campus, SG Highway, Satellite, Ahmedabad 380015", mapsQuery: "Govindas Restaurant ISKCON Temple Satellite Ahmedabad", cuisine: ["North Indian", "Multi-cuisine"], price: 1000, jain: "sattvic", vibe: "Calm temple campus", picks: ["Paneer butter masala", "Sattvic thali", "Temple sweets"],
    photos: [W("4/4f/ISKCON_temple%2C_Ahmedabad.jpg/960px-ISKCON_temple%2C_Ahmedabad.jpg"), W("6/6f/Paneer_Butter_Masala_2.jpg/960px-Paneer_Butter_Masala_2.jpg"), W("8/8b/North_Indian_Vegetarian_Thali-MB51.jpg/960px-North_Indian_Vegetarian_Thali-MB51.jpg")] }),
  R({ id: "aahar-satvik", name: "Aahar Satvik Cafe & Restro", tagline: "Sattvik café food", area: "Ahmedabad", mapsQuery: "Aahar Satvik Cafe Restro Ahmedabad", cuisine: ["Café", "Healthy"], price: 500, jain: "sattvic", picks: ["Sattvik bowls", "Jain snacks"], pool: "cafe" }),
  R({ id: "sante", name: "Santé Spa Cuisine", tagline: "Healthy gourmet vegetarian", area: "Thaltej", address: "1st Floor, Sindhu Bhavan Marg, beside Ahmedabad Racquet Academy, Thaltej, Ahmedabad", mapsQuery: "Sante Spa Cuisine Sindhu Bhavan Ahmedabad", cuisine: ["Healthy", "Italian"], price: 1800, vibe: "Bright, airy, wellness-focused", picks: ["Jain pizza", "Quinoa salads", "Smoothie bowls"], pool: "italian" }),
  R({ id: "vegan-kitchen", name: "The Vegan Kitchen", tagline: "Fully vegan comfort food", area: "Gurukul", cuisine: ["Healthy", "Mexican", "Italian"], price: 900, picks: ["Vegan pizza (Jain on request)", "Burrito bowl"], pool: "mexican" }),
  R({ id: "cellad", name: "Cellad Eatery", tagline: "Salads, bowls and wraps", area: "University Area", cuisine: ["Healthy", "Café"], price: 700, picks: ["Jain salad bowls", "Wraps"], pool: "cafe" }),
  R({ id: "madhavrao", name: "Madhavrao", tagline: "Marathi classics, vegan-friendly", area: "Prahlad Nagar", cuisine: ["North Indian", "Healthy"], price: 800, picks: ["Jain misal (ask)", "Puran poli"], pool: "north" }),

  // ── South Indian ────────────────────────────────────────────
  R({ id: "sankalp", name: "Sankalp", tagline: "The original South Indian, since 1980", area: "Ashram Road", address: "16, Ashram Rd, Nr. Dinesh Hall, Navrangpura, Ahmedabad 380009", mapsQuery: "Sankalp Restaurant Ashram Road Dinesh Hall Ahmedabad", cuisine: ["South Indian"], price: 800, jainNote: "Jain dosas, sambar & chutney on request", picks: ["Jain masala dosa (raw-banana)", "Idli sambar", "Filter coffee"], pool: "south" }),
  R({ id: "dakshinayan", name: "Dakshinayan", tagline: "Authentic South Indian thali & dosas", area: "Satellite", cuisine: ["South Indian"], price: 700, picks: ["Jain dosa", "South Indian thali", "Rava idli"], pool: "south" }),
  R({ id: "udipi-jaya", name: "Udipi Jaya", tagline: "Classic Udupi canteen", area: "Memnagar", cuisine: ["South Indian"], price: 400, picks: ["Jain dosa", "Idli-vada"], pool: "south" }),
  R({ id: "balan-dosa", name: "Balan's Gwalior Dosa", tagline: "Manek Chowk's late-night dosa stall", area: "Manek Chowk", cuisine: ["South Indian", "Street Food"], price: 300, vibe: "Night market, street-side", picks: ["Jain dosa", "Cheese dosa"], pool: "south" }),

  // ── Street food & snacks ────────────────────────────────────
  R({ id: "swati-snacks", name: "Swati Snacks", tagline: "Iconic Gujarati snacks, reinvented", area: "Law Garden", address: "13, Gandhi Baug Society, Panchavati Rd, Law Garden, Ellisbridge, Ahmedabad 380006", mapsQuery: "Swati Snacks Law Garden Ahmedabad", cuisine: ["Street Food", "Gujarati Thali"], price: 900, jainNote: "Most dishes can be made Jain", picks: ["Panki", "Handvo", "Dahi puri (Jain)"],
    photos: [W("9/91/Handvo_Gujarati_Food.jpg/960px-Handvo_Gujarati_Food.jpg"), W("3/3f/Dahi_Puri_%28Indian_snack%29.jpg/960px-Dahi_Puri_%28Indian_snack%29.jpg"), W("3/3c/Law_Garden%2C_Ahmedabad%2C_Gujarat%2C_INDIA.jpg/960px-Law_Garden%2C_Ahmedabad%2C_Gujarat%2C_INDIA.jpg")] }),
  R({ id: "honest", name: "Honest", tagline: "Pav bhaji institution since 1975", area: "Prahlad Nagar", address: "Circle P Complex, SG Highway, Nr. AUDA Garden, Prahlad Nagar, Ahmedabad 380015", mapsQuery: "Honest Restaurant Circle P Prahlad Nagar Ahmedabad", cuisine: ["Street Food", "North Indian"], price: 700, jainNote: "Jain items marked “J” on the menu", picks: ["Jain pav bhaji (raw-banana)", "Jain pulao", "Masala chaas"],
    photos: [W("1/1a/Pav_bhaji.jpg/960px-Pav_bhaji.jpg"), W("3/34/Bhaji_pav_2.jpg/960px-Bhaji_pav_2.jpg"), W("a/aa/Chole_Bhature_1.jpg/960px-Chole_Bhature_1.jpg")] }),
  R({ id: "kailash-pav-bhaji", name: "Kailash Pav Bhaji", tagline: "Khada pav bhaji at Manek Chowk", area: "Manek Chowk", cuisine: ["Street Food"], price: 300, vibe: "Night market", picks: ["Jain pav bhaji", "Khada pav bhaji"], pool: "street" }),
  R({ id: "manek-chowk-sandwich", name: "Manek Chowk Sandwich & Pizza", tagline: "Ghughra & butter-loaded sandwiches", area: "Manek Chowk", cuisine: ["Street Food"], price: 300, picks: ["Jain ghughra sandwich", "Farali sandwich"], pool: "street" }),
  R({ id: "happy-street", name: "Law Garden Happy Street", tagline: "42 food trucks in one street", area: "Law Garden", cuisine: ["Street Food"], price: 500, vibe: "Evening food street — everyone picks their own", picks: ["Jain pani puri", "Jain pav bhaji", "Dabeli", "Kulfi"], pool: "street" }),
  R({ id: "das-khaman", name: "Das Khaman House", tagline: "Soft khaman & farsan", area: "Multiple outlets", mapsQuery: "Das Khaman House Ahmedabad", address: "Multiple outlets — tap Navigate for the nearest", cuisine: ["Street Food"], price: 300, picks: ["Khaman", "Nylon khaman", "Khandvi"], pool: "street" }),
  R({ id: "iscon-gathiya", name: "Iscon Gathiya", tagline: "Hot gathiya & fafda", area: "SG Highway", cuisine: ["Street Food"], price: 300, picks: ["Fafda-jalebi", "Gathiya", "Jain sambharo (ask)"], pool: "street" }),
  R({ id: "gwalia", name: "Gwalia", tagline: "Sweets, farsan and snacks", area: "SG Highway", cuisine: ["Street Food", "Desserts"], price: 400, picks: ["Jain chaat", "Mithai"], pool: "dessert" }),
  R({ id: "raipur-bhajiya", name: "Raipur Bhajiya House", tagline: "Legendary bhajiya since decades", area: "Raipur", cuisine: ["Street Food"], price: 200, jain: "ask", picks: ["Methi gota", "Mirchi bhajiya"], pool: "street" }),
  R({ id: "new-lucky", name: "New Lucky Restaurant", tagline: "Bun-maska & chai among old graves", area: "Lal Darwaja", cuisine: ["Café", "Street Food"], price: 200, jain: "ask", vibe: "Quirky heritage stop", picks: ["Bun maska", "Masala chai"], pool: "cafe" }),
  R({ id: "jashuben-pizza", name: "Jashuben Shah Old Pizza", tagline: "Ahmedabad's desi pizza since the 70s", area: "Law Garden", cuisine: ["Street Food", "Italian"], price: 400, picks: ["Jain old-style pizza", "Bhakri pizza"], pool: "italian" }),
  R({ id: "green-house", name: "The Green House", tagline: "Courtyard café for chaat & Gujarati bites", area: "Lal Darwaja", address: "The House of MG, Opp. Sidi Saiyed Jali, Lal Darwaja, Ahmedabad 380001", mapsQuery: "The Green House House of MG Lal Darwaja Ahmedabad", cuisine: ["Street Food", "Café"], price: 900, jainNote: "Jain versions of most snacks", picks: ["Jain pani puri", "Khaman", "Kulfi"], pool: "street" }),
  R({ id: "tea-post", name: "Tea Post", tagline: "Chai & snacks hangout", area: "Multiple outlets", mapsQuery: "Tea Post Ahmedabad", address: "Multiple outlets — tap Navigate for the nearest", cuisine: ["Café"], price: 300, picks: ["Jain maggi", "Masala chai", "Bun maska"], pool: "cafe" }),
  R({ id: "mr-puff", name: "Mr. Puff", tagline: "Veg puffs & bakery bites", area: "Multiple outlets", mapsQuery: "Mr Puff Ahmedabad", address: "Multiple outlets — tap Navigate for the nearest", cuisine: ["Café"], price: 300, picks: ["Jain puff", "Cheese puff"], pool: "cafe" }),

  // ── North Indian & Punjabi ──────────────────────────────────
  R({ id: "jassi", name: "Jassi De Parathe", tagline: "Stuffed parathas, Punjabi style", area: "CG Road", address: "7, Dev Complex, Nr. Parimal Garden, CG Road, Ahmedabad 380006", mapsQuery: "Jassi De Parathe Parimal Garden Ahmedabad", cuisine: ["North Indian"], price: 650, jainNote: "Jain parathas & sabzi on request", picks: ["Jain paneer paratha", "Dal fry", "Lassi"], pool: "north" }),
  R({ id: "kailash-parbat", name: "Kailash Parbat", tagline: "Sindhi-Punjabi favourites & chaat", area: "Bodakdev", cuisine: ["North Indian", "Street Food"], price: 700, picks: ["KP chaat platter (Jain)", "Paneer tikka biryani", "Bhindi aloo (ask)"], pool: "north" }),
  R({ id: "kadak-bhagat", name: "Kadak Bhagat", tagline: "North Indian with a tadka", area: "Bodakdev", cuisine: ["North Indian", "Multi-cuisine"], price: 1000, picks: ["Jain paneer malwani", "Dal tadka"], pool: "north" }),
  R({ id: "jalpaan", name: "Jalpaan", tagline: "Big Jain menu, family favourite", area: "Prahlad Nagar", cuisine: ["North Indian", "Italian", "Mexican"], price: 900, picks: ["Jain dum ki teheri", "Kashmiri malai kofta", "Pizza Milano (Jain)"], pool: "north" }),
  R({ id: "from-the-north", name: "From The North", tagline: "Punjabi plates & pan-Asian", area: "CG Road", cuisine: ["North Indian", "Asian"], price: 700, picks: ["Jain veg kofta", "Masala chole (Jain)"], pool: "north" }),
  R({ id: "the-dhaba", name: "The Dhaba", tagline: "Highway-dhaba style dinners", area: "Prahlad Nagar", cuisine: ["North Indian"], price: 600, picks: ["Jain sizzler", "Dal makhani (Jain)"], pool: "north" }),
  R({ id: "page-one", name: "Page One", tagline: "Indian, Oriental & Continental", area: "Vastrapur", cuisine: ["North Indian", "Multi-cuisine"], price: 1000, picks: ["Jain khurchan paneer", "Sizzlers"], pool: "multi" }),
  R({ id: "mr-mrs-somani", name: "Mr & Mrs Somani", tagline: "Rich North Indian at The Grand Bhagwati", area: "Bodakdev", address: "The Grand Bhagwati, SG Highway, Bodakdev, Ahmedabad", cuisine: ["North Indian"], price: 1500, picks: ["Jain paneer curries", "Tandoori breads"], pool: "north" }),
  R({ id: "pleasure-trove", name: "Pleasure Trove", tagline: "Old Ahmedabad Punjabi-Chinese favourite", area: "Ashram Road", cuisine: ["North Indian", "Asian"], price: 900, picks: ["Jain paneer tikka", "Hakka noodles (Jain)"], pool: "north" }),
  R({ id: "hocco-kitchen", name: "Hocco Kitchen", tagline: "Comfort Indian & quick bites", area: "Navrangpura", cuisine: ["North Indian", "Café"], price: 700, picks: ["Jain chole kulche", "Ice cream"], pool: "north" }),
  R({ id: "jungle-bhookh", name: "Jungle Bhookh", tagline: "Jungle-themed family restaurant", area: "Navrangpura", cuisine: ["North Indian", "Multi-cuisine"], price: 900, vibe: "Fun for groups", picks: ["Jain paneer tikka", "Sizzlers"], pool: "north" }),
  R({ id: "taste-city", name: "Taste City", tagline: "Punjabi, Chinese & Italian under one roof", area: "Sola", cuisine: ["North Indian", "Multi-cuisine"], price: 800, picks: ["Jain Punjabi thali", "Jain pasta"], pool: "multi" }),
  R({ id: "kake-di-hatti", name: "Kake Di Hatti", tagline: "Big naans & Punjabi feasts", area: "South Bopal", cuisine: ["North Indian", "Multi-cuisine"], price: 800, picks: ["Jain stuffed naan", "Dal makhani (Jain)"], pool: "north" }),
  R({ id: "yanki", name: "Yanki Sizzlerr", tagline: "Sizzlers & Chinese with Jain menu", area: "Navrangpura", cuisine: ["Multi-cuisine", "Asian"], price: 800, picks: ["Jain sizzler", "Jain manchurian"], pool: "multi" }),
  R({ id: "just-live", name: "Just Live", tagline: "Mexican & Chinese, Jain-friendly", area: "Navrangpura", cuisine: ["Mexican", "Asian"], price: 700, picks: ["Jain nachos", "Jain fried rice"], pool: "mexican" }),
  R({ id: "mondo-kitchen", name: "The Mondo Kitchen", tagline: "Indian & continental in Gota", area: "Gota", cuisine: ["North Indian", "Multi-cuisine"], price: 800, picks: ["Jain veg kolhapuri", "Dal makhani"], pool: "multi" }),
  R({ id: "vanashree", name: "Vanashree", tagline: "Garden restaurant with pizzas & thali", area: "Bopal", cuisine: ["Multi-cuisine", "Gujarati Thali"], price: 1000, picks: ["Jain pizza", "Jain pasta"], pool: "multi" }),
  R({ id: "sattvik", name: "Sattvik", tagline: "Elegant traditional-meets-modern veg", area: "SG Highway", cuisine: ["North Indian", "Gujarati Thali"], price: 1200, picks: ["Jain thali", "Paneer specials"], pool: "north" }),

  // ── Global / fine dining ────────────────────────────────────
  R({ id: "650", name: "650 – The Global Kitchen", tagline: "Huge veg buffet across world cuisines", area: "Bodakdev", mapsQuery: "650 The Global Kitchen Ahmedabad", cuisine: ["Multi-cuisine", "Italian", "Mexican"], price: 2000, vibe: "Buffet, great for celebrations", picks: ["Jain live counters", "Desserts bar"], pool: "multi" }),
  R({ id: "makeba", name: "The House of Makeba", tagline: "Multi-level rooftop, Neapolitan pizzas", area: "Sindhu Bhavan Road", address: "Sigma Corporates, Sindhu Bhavan Rd, Opp. Courtyard Marriott, Bodakdev, Ahmedabad", mapsQuery: "The House of Makeba Sindhu Bhavan Ahmedabad", cuisine: ["Italian", "Mexican", "Multi-cuisine"], price: 1800, vibe: "Rooftop sunsets, open till late", picks: ["Jain Neapolitan pizza", "Jain tacos"], pool: "italian" }),
  R({ id: "lollo-rosso", name: "Lollo Rosso", tagline: "Lebanese, Japanese, Mexican & Asian", area: "Bodakdev", cuisine: ["Asian", "Mexican", "Multi-cuisine"], price: 1600, picks: ["Jain sushi", "Jain mezze"], pool: "asian" }),
  R({ id: "mango", name: "@Mango", tagline: "Wood-fired global plates", area: "Sindhu Bhavan Road", mapsQuery: "@Mango Restaurant Sindhu Bhavan Ahmedabad", cuisine: ["Italian", "Multi-cuisine"], price: 1600, picks: ["Jain wood-fired pizza", "Pasta"], pool: "italian" }),
  R({ id: "ninis-kitchen", name: "Nini's Kitchen", tagline: "Italian & Mediterranean comfort", area: "Navrangpura", mapsQuery: "Ninis Kitchen Panchvati Ahmedabad", cuisine: ["Italian", "Multi-cuisine"], price: 1400, picks: ["Jain pasta", "Jain pizza"], pool: "italian" }),
  R({ id: "jamie-oliver", name: "Jamie Oliver Kitchen", tagline: "100% vegetarian Italian at Palladium", area: "Thaltej", address: "Phoenix Palladium Mall, SG Highway, Thaltej, Ahmedabad", mapsQuery: "Jamie Oliver Kitchen Palladium Ahmedabad", cuisine: ["Italian"], price: 2000, picks: ["Jain pizza", "Fresh pasta"], pool: "italian" }),
  R({ id: "corbezzolo", name: "Corbezzolo", tagline: "Handmade pasta & wood-fired pizza", area: "Sindhu Bhavan Road", cuisine: ["Italian"], price: 1600, picks: ["Fungi Neapolitan (Jain on request)", "Strawberry cheesecake"], pool: "italian" }),
  R({ id: "granville", name: "Granville Greens Café", tagline: "Leafy café on SBR", area: "Sindhu Bhavan Road", cuisine: ["Café", "Italian"], price: 1200, picks: ["Jain pizza", "Coffee"], pool: "cafe" }),
  R({ id: "temptt", name: "Temptt", tagline: "Thalis to tacos under one canopy", area: "Tapovan Circle", cuisine: ["Multi-cuisine", "Mexican"], price: 900, picks: ["Achari baby potatoes (ask)", "Basil-paneer tikka (Jain)"], pool: "multi" }),
  R({ id: "ph-se-food", name: "Ph Se Food", tagline: "Indian, Chinese, Continental & Mexican", area: "Bodakdev", cuisine: ["Multi-cuisine"], price: 750, picks: ["Jain pav bhaji platter", "Four cheese pizza (Jain)"], pool: "multi" }),
  R({ id: "fresh-roast", name: "Fresh Roast", tagline: "Multi-cuisine veg café", area: "Ellisbridge", cuisine: ["Café", "Mexican", "Multi-cuisine"], price: 800, picks: ["Jain nachos", "Pasta"], pool: "cafe" }),
  R({ id: "cafe-de-italiano", name: "Cafe De Italiano", tagline: "Pizzas, pastas & Punjabi", area: "Bopal", cuisine: ["Café", "Italian"], price: 700, picks: ["Jain pizza", "Garlic-free pasta (ask)"], pool: "italian" }),
  R({ id: "sandwichworkz", name: "sandwichworkZ", tagline: "Grilled sandwiches & breakfast", area: "Vastrapur", cuisine: ["Café"], price: 500, picks: ["Jain grilled sandwich", "Cold coffee"], pool: "cafe" }),
  R({ id: "shambhus", name: "Shambhu's Coffee Bar", tagline: "Famous thick cold coffee", area: "Law Garden", cuisine: ["Café"], price: 300, picks: ["Cold coffee", "Jain sandwich"], pool: "cafe" }),

  // ── Pizza ───────────────────────────────────────────────────
  R({ id: "ciao", name: "Ciao Pizzeria", tagline: "Italian pizza at Cafe Brewgarten", area: "Bopal", address: "Cafe Brewgarten, S Bopal Rd, beside Manoj Furniture, Nr. SP Ring Rd, Mumatpura, Ahmedabad 380058", mapsQuery: "Ciao Pizzeria Brewgarten Bopal Ahmedabad", cuisine: ["Italian"], price: 500, jain: "ask", picks: ["Margherita", "Jain pizza (ask)"], pool: "italian" }),
  R({ id: "la-milano", name: "La Milano Pizzeria", tagline: "Jain pizza specialists", area: "Multiple outlets", mapsQuery: "La Milano Pizzeria Ahmedabad", address: "Multiple outlets — tap Navigate for the nearest", cuisine: ["Italian"], price: 600, picks: ["Jain cheese burst", "Jain pasta"], pool: "italian" }),
  R({ id: "martinoz", name: "Martino'z Pizza", tagline: "Popular Jain pizza joint", area: "Ashram Road", cuisine: ["Italian"], price: 600, picks: ["Jain pizza", "Garlic-free bread (ask)"], pool: "italian" }),
  R({ id: "dominos", name: "Domino's Pizza", tagline: "Quick pizza — many outlets", area: "Multiple outlets", mapsQuery: "Domino's Pizza Ahmedabad", address: "Many outlets across Ahmedabad — tap Navigate for the nearest", cuisine: ["Italian"], price: 600, pureVeg: false, jain: "ask", jainNote: "Serves non-veg too. No-onion/garlic menu mainly during Navratri at select outlets — ask first", picks: ["Margherita (no onion)", "Farmhouse without onion"],
    photos: [W("e/e5/Domino%27s_Pizza_in_India.jpg/960px-Domino%27s_Pizza_in_India.jpg"), W("a/aa/Pizza_%40Dominoz_2025_%2801%29.jpg/960px-Pizza_%40Dominoz_2025_%2801%29.jpg"), W("7/7e/Vegetarian_Pizza.jpg/960px-Vegetarian_Pizza.jpg")] }),

  // ── Mexican ─────────────────────────────────────────────────
  R({ id: "dos-bros", name: "DosBros", tagline: "Pure veg fresh Mexican grill", area: "Navrangpura", address: "GF-002, Phoenix Complex, Opp. Girish Cold Drinks, Nr. Vijay Cross Road, Navrangpura, Ahmedabad", mapsQuery: "DosBros Mexican Restaurant Navrangpura Ahmedabad", cuisine: ["Mexican"], price: 800, picks: ["Jain burrito bowl", "Jain tacos", "Nachos"], pool: "mexican" }),
  R({ id: "tres-amigos", name: "Tres Amigos", tagline: "Mexican & continental café", area: "Thaltej", address: "17, Ground Floor, Times Square 1, Thaltej-Shilaj Rd, Nr. Baghban Party Plot, Thaltej, Ahmedabad", mapsQuery: "Tres Amigos Thaltej Ahmedabad", cuisine: ["Mexican", "Café"], price: 1000, picks: ["Jain quesadilla", "Jain nachos", "Churros"], pool: "mexican" }),

  // ── Asian ───────────────────────────────────────────────────
  R({ id: "burma-burma", name: "Burma Burma", tagline: "Burmese tea house — dedicated Jain menu", area: "Thaltej", address: "FF-7, Phoenix Palladium Mall, Opp. Zydus Hospital, SG Highway, Thaltej, Ahmedabad 380054", mapsQuery: "Burma Burma Palladium Ahmedabad", cuisine: ["Asian"], price: 1800, jainNote: "Dedicated no onion-garlic Jain menu", vibe: "Stylish, no alcohol, great for groups", picks: ["Jain khow suey", "Tea leaf salad", "Samuza hincho", "Bubble tea"],
    photos: [W("1/1c/Khow_Suey_%2825204448596%29.jpg/960px-Khow_Suey_%2825204448596%29.jpg"), W("6/64/Laphet_thoke.JPG/960px-Laphet_thoke.JPG"), W("6/68/Steamed_Cabbage_Dim-Sum_Dumplings_%288191187970%29.jpg/960px-Steamed_Cabbage_Dim-Sum_Dumplings_%288191187970%29.jpg")] }),
  R({ id: "tim-tim", name: "Tim Tim", tagline: "Pure veg sushi, dim sum & bao", area: "Bodakdev", address: "Swagarena, Rajpath Rangoli Rd, Opp. Shilp Epitome, Bodakdev, Ahmedabad", mapsQuery: "Tim Tim Swagarena Bodakdev Ahmedabad", cuisine: ["Asian"], price: 2000, picks: ["Sushi boat (Jain on request)", "Crackling spinach", "Bao", "Dim sums"],
    photos: ["https://upload.wikimedia.org/wikipedia/commons/d/de/Homemade_Sushi.jpg", W("2/23/Bao_Buns.jpg/960px-Bao_Buns.jpg"), W("b/bc/Vegetable_Seedling_Dumplings.jpg/960px-Vegetable_Seedling_Dumplings.jpg")] }),
  R({ id: "tuk-tuk", name: "Tuk Tuk", tagline: "Thai & Asian street flavours", area: "Ahmedabad", mapsQuery: "Tuk Tuk Restaurant Ahmedabad vegetarian", cuisine: ["Asian"], price: 900, picks: ["Jain Thai curry", "Pad thai (Jain on request)"], pool: "asian" }),

  // ── Burgers / desserts ──────────────────────────────────────
  R({ id: "bunoissimo", name: "Bunoissimo", tagline: "Burgers & buns", area: "Ahmedabad", mapsQuery: "Bunoissimo Ahmedabad", address: "Ahmedabad — tap Navigate for the exact location", cuisine: ["Café"], price: 600, jain: "ask", picks: ["Jain burger (ask)", "Fries"], pool: "cafe" }),
  R({ id: "asharfi-kulfi", name: "Asharfi Kulfi", tagline: "Dessert stop after dinner", area: "Navrangpura", cuisine: ["Desserts"], price: 300, picks: ["Kesar pista kulfi", "Rabdi"], pool: "dessert" }),
  R({ id: "havmor", name: "Havmor Eatery", tagline: "Ahmedabad's own ice-cream brand", area: "Navrangpura", cuisine: ["Desserts", "Multi-cuisine"], price: 700, jain: "ask", picks: ["Sundaes", "Jain sizzler (ask)"], pool: "dessert" }),
  R({ id: "rasranjan", name: "Rasranjan", tagline: "Snacks, sweets & ice-cream near Vijay CR", area: "Navrangpura", cuisine: ["Street Food", "Desserts"], price: 400, picks: ["Jain chaat", "Ice cream"], pool: "dessert" }),
];

export const CUISINES = ["All", "Gujarati Thali", "Kathiyawadi", "Rajasthani", "South Indian", "Street Food", "North Indian", "Italian", "Mexican", "Asian", "Café", "Multi-cuisine", "Healthy", "Desserts"];
export const AREAS = ["All areas", ...[...new Set(RESTAURANTS.map((r) => r.area))].sort()];

export const mapsSearchUrl = (r) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.mapsQuery)}`;
export const mapsDirectionsUrl = (r) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.mapsQuery)}`;
export const mapsEmbedUrl = (r) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(r.mapsQuery)}&z=15&output=embed`;
export const menuUrl = (r) =>
  `https://www.google.com/search?q=${encodeURIComponent(`${r.name} ${r.area} Ahmedabad menu`)}`;
