// ============================================================
// PRODUCTS-ENGINE.JS � Haute Fighting Gears
// Loads from products/products.json
// Works from ANY page depth (root, /pages/, etc.)
// Requires a local server (Live Server / localhost) � NOT file://
// ============================================================

// -- Note about file:// protocol ------------------------------
// Products will attempt to fetch from JSON, and fall back to
// inline data if the fetch fails (e.g. file:// or server issues).
if (window.location.protocol === 'file:') {
    console.warn('[products-engine] Running on file://. Products load from inline fallback data.');
}

// -- Category display name map � clean ecommerce labels -------
// Defined early so loadProducts() can reference it
const _categoryDisplayNames = {
    'street-fashion': 'Streetwear',
    'gym-fitness': 'Gym Wear',
    'mma': 'MMA',
    'boxing': 'Boxing Equipment',
    'sports': 'Sports Gear',
    'apparel': 'Apparel',
    'accessories': 'Accessories',
    'ring-equipment': 'Ring Equipment'
};

function _getCategoryLabel(cat) {
    return _categoryDisplayNames[cat.id] || cat.name;
}

// -- Resolve relative path prefix from current page to site root --
function _getRelativeRootPrefix() {
    const path = window.location.pathname;
    const cleaned = path.replace(/^\//, '').replace(/\/$/, '');
    const parts = cleaned.split('/').filter(Boolean);
    const depth = parts.length > 0 && parts[parts.length - 1].includes('.') ? parts.length - 1 : parts.length;
    return depth === 0 ? './' : '../'.repeat(depth);
}

// -- Resolve correct path to products.json from any page ------
function _getJsonPath() {
    // Try absolute path first (works on a proper server).
    // _fetchProductData() falls back to relative path on failure.
    return '/products/products.json';
}

// -- Relative fallback path (for file:// or sub-path deployments) --
function _getJsonPathRelative() {
    const root = _getRelativeRootPrefix();
    return root + 'products/products.json';
}

// -- Resolve correct path prefix for product page links -------
function _getPagePrefix() {
    return '/product/';
}

// -- Resolve correct path prefix for root-level links ---------
function _getRootPrefix() {
    return '/';
}

// Cache so we only fetch once per page load
let _productsCache = null;
let _categoriesCache = null;
let _rawDataCache = null;

// -- Inline product data � used as fallback when fetch fails --
// This guarantees products always show regardless of server setup.
const _INLINE_PRODUCT_DATA = {"categories":[{"id":"boxing","name":"Boxing Equipment","products":[{"id":"boxing-gloves","name":"Boxing Gloves","category":"Boxing Equipment","image":"/assets/products/boxing-gloves/1.webp","images":["/assets/products/boxing-gloves/1.webp","/assets/products/boxing-gloves/2.webp","/assets/products/boxing-gloves/3.webp"],"description":"Professional-grade boxing gloves built for training, sparring, and competition. Choose your material and weight for the perfect fit.","variants":[{"id":"cowhide","label":"Cowhide Leather"},{"id":"cowhide-enhanced","label":"Cowhide Enhanced Padding"},{"id":"pu","label":"PU Synthetic"},{"id":"pu-molded","label":"PU Hand Molded"}],"specs":{"Weight (oz)":["8oz","10oz","12oz","14oz","16oz"],"Closure":["Velcro","Lace-Up"],"Color":["Black","Red","Blue","White","Custom"]},"seo":{"title":"Custom Boxing Gloves Manufacturer | Haute Fighting Gears","description":"Private label custom boxing gloves manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.","slug":"boxing-gloves"}},{"id":"boxing-head-guard","name":"Boxing Head Guard","category":"Boxing Equipment","image":"/assets2/products/head-guard/1.webp","images":["/assets2/products/head-guard/1.webp","/assets2/products/head-guard/2.webp","/assets2/products/head-guard/3.webp"],"description":"Protective headgear designed for sparring with maximum safety, visibility, and comfort. Made from cowhide leather with high-density foam padding.","variants":[{"id":"open-face","label":"Open Face"},{"id":"nose-bar","label":"Nose Bar"}],"specs":{"Size":["S","M","L","XL"],"Color":["Black","Red","Blue","White","Custom"]},"seo":{"title":"Custom Boxing Head Guard Manufacturer | Haute Fighting Gears","description":"Private label boxing head guards manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.","slug":"boxing-head-guard"}},{"id":"round-punching-mitt","name":"Round Punching Mitt","category":"Boxing Equipment","image":"/assets2/products/round punching mitt/1.webp","images":["/assets2/products/round punching mitt/1.webp","/assets2/products/round punching mitt/2.webp","/assets2/products/round punching mitt/3.webp","/assets2/products/round punching mitt/4.webp","/assets2/products/round punching mitt/5.webp","/assets2/products/round punching mitt/6.webp","/assets2/products/round punching mitt/7.webp"],"description":"Professional round punching mitts manufactured for boxing, kickboxing, and MMA coaches. Lightweight construction with multi-layer padding provides superior shock absorption while allowing trainers to work on speed, precision, and combination drills. Fully customizable with your logo, colors, and branding.","variants":[{"id":"cowhide","label":"Cowhide Leather"},{"id":"pu","label":"PU Synthetic"}],"specs":{"Color":["Black","Red","Blue","White","Custom"],"Material":["Cowhide Leather","PU Synthetic"],"Hand":["Left","Right","Pair"],"Logo":["Yes","No"]},"seo":{"title":"Custom Round Punching Mitts Manufacturer | Haute Fighting Gears","description":"Private label round punching mitts manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom logo, colors, branding, worldwide shipping.","slug":"round-punching-mitt"}},{"id":"focus-mitt","name":"Focus Mitt","category":"Boxing Equipment","image":"/assets/products/focus mitt/1.webp","images":["/assets/products/focus mitt/1.webp","/assets/products/focus mitt/2.webp","/assets/products/focus mitt/3.webp","/assets/products/focus mitt/4.webp","/assets/products/focus mitt/5.webp","/assets/products/focus mitt/6.webp"],"description":"Professional curved focus mitts manufactured for boxing, MMA, Muay Thai, and kickboxing coaching. High-density foam padding absorbs impact while maintaining lightweight performance for extended training sessions.","variants":[{"id":"cowhide","label":"Cowhide Leather"},{"id":"pu","label":"PU Synthetic"}],"specs":{"Color":["Black","Red","Blue","White","Custom"],"Material":["Cowhide Leather","PU Synthetic"],"Hand":["Left","Right","Pair"],"Logo":["Yes","No"]},"seo":{"title":"Custom Focus Mitts Manufacturer | Haute Fighting Gears","description":"Private label focus mitts manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom logo, colors, branding, worldwide shipping.","slug":"focus-mitt"}},{"id":"bag-mitt","name":"Bag Mitt","category":"Boxing Equipment","image":"/assets/products/Bag Mitt/1.webp","images":["/assets/products/Bag Mitt/1.webp","/assets/products/Bag Mitt/2.webp","/assets/products/Bag Mitt/3.webp","/assets/products/Bag Mitt/4.webp","/assets/products/Bag Mitt/5.webp"],"description":"Premium bag mitts manufactured for heavy bag training and conditioning. Ergonomic design with shock-absorbing padding offers comfort, wrist support, and durability during intense workouts.","variants":[{"id":"cowhide","label":"Cowhide Leather"},{"id":"pu","label":"PU Synthetic"}],"specs":{"Size":["S","M","L","XL"],"Color":["Black","Red","Blue","White","Custom"],"Material":["Cowhide Leather","PU Synthetic"],"Logo":["Yes","No"]},"seo":{"title":"Custom Bag Mitts Manufacturer | Haute Fighting Gears","description":"Private label bag mitts manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom logo, colors, branding, worldwide shipping.","slug":"bag-mitt"}},{"id":"double-end-ball","name":"Double End Ball","category":"Boxing Equipment","image":"/assets/products/double end ball/1.webp","images":["/assets/products/double end ball/1.webp","/assets/products/double end ball/2.webp","/assets/products/double end ball/3.webp","/assets/products/double end ball/4.webp","/assets/products/double end ball/5.webp","/assets/products/double end ball/6.webp"],"description":"Professional double-end punching ball manufactured for improving speed, timing, rhythm, and defensive movement. Constructed using durable leather or PU with reinforced bladder for long-lasting performance.","variants":[{"id":"leather","label":"Genuine Leather"},{"id":"pu","label":"PU Synthetic"}],"specs":{"Size":["Small","Medium","Large"],"Color":["Black","Red","Blue","White","Custom"],"Material":["Genuine Leather","PU Synthetic"],"Logo":["Yes","No"]},"seo":{"title":"Custom Double End Ball Manufacturer | Haute Fighting Gears","description":"Private label double end punching balls manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom logo, colors, branding, worldwide shipping.","slug":"double-end-ball"}},{"id":"belly-pad","name":"Belly Pad","category":"Boxing Equipment","image":"/assets/products/belly-pad/1.webp","images":["/assets/products/belly-pad/1.webp","/assets/products/belly-pad/2.webp","/assets/products/belly-pad/3.webp"],"description":"Professional belly pads manufactured for boxing, Muay Thai, MMA, and kickboxing coaching. Ergonomic curved design distributes impact across the torso while multi-layer foam absorbs powerful kicks and punches. Adjustable harness system fits all trainer body types.","variants":[{"id":"cowhide","label":"Cowhide Leather"},{"id":"pu","label":"PU Synthetic"},{"id":"microfiber","label":"Microfiber Leather"}],"specs":{"Training Type":["Boxing","Muay Thai","MMA / Kickboxing","Universal"],"Padding":["Standard Foam","High Density","Multi-Layer EVA"],"Closure":["Hook & Loop (Velcro)","Buckle Strap","Hybrid"],"Size":["S/M","L/XL"],"Color":["Black","Red","Blue","White","Custom"],"Logo":["Yes","No"]},"seo":{"title":"Custom Belly Pad Manufacturer | Haute Fighting Gears","description":"Private label belly pads manufactured in Sialkot, Pakistan. Boxing, Muay Thai, MMA training. OEM, ODM, wholesale, custom branding.","slug":"belly-pad"}},{"id":"groin-guard","name":"Groin Guard","category":"Boxing Equipment","image":"/assets2/products/groin-guard/1.webp","images":["/assets2/products/groin-guard/1.webp","/assets2/products/groin-guard/2.webp","/assets2/products/groin-guard/3.webp","/assets2/products/groin-guard/4.webp"],"description":"Professional groin guards manufactured for boxing, MMA, Muay Thai, and kickboxing. Constructed with high-density shock-absorbing foam and premium outer shell for maximum protection. Available in cup, suspender, and compression short styles with full custom branding.","variants":[{"id":"cup-style","label":"Cup Style"},{"id":"suspender","label":"Suspender Style"},{"id":"foul-protector","label":"Foul Protector / Trunks Style"}],"specs":{"Size":["S","M","L","XL","XXL"],"Material":["Cowhide Leather","PU Synthetic","Neoprene"],"Padding":["Standard Foam","High Density","Multi-Layer EVA"],"Color":["Black","Red","Blue","White","Custom"],"Logo":["Yes","No"]},"seo":{"title":"Custom Groin Guard Manufacturer | Haute Fighting Gears","description":"Private label groin guards manufactured in Sialkot, Pakistan. Boxing, MMA, Muay Thai protection. OEM, ODM, wholesale, custom branding.","slug":"groin-guard"}},{"id":"bjj-belt","name":"BJJ Belt","category":"Boxing Equipment","image":"/assets/products/bjj-belt/1.webp","images":["/assets/products/bjj-belt/1.webp","/assets/products/bjj-belt/2.webp","/assets/products/bjj-belt/3.webp"],"description":"Official Brazilian Jiu-Jitsu belts manufactured to IBJJF standards. Available across all belt ranks in premium cotton and pearl weave construction. Reinforced center bar and double-stitched edges for durability. Fully customizable with embroidery, woven labels, and custom packaging for academies and brands.","variants":[{"id":"cotton","label":"Premium Cotton"},{"id":"pearl-weave","label":"Pearl Weave"},{"id":"ripstop","label":"Ripstop Cotton"}],"specs":{"Belt Rank":["White","Blue","Purple","Brown","Black","Red & Black (Coral)","Red & White","Red"],"Size":["A0","A1","A2","A3","A4","A5","M0","M1","M2"],"Stitch Color":["White","Black","Gold","Red","Blue","Custom"],"Branding":["Embroidery","Woven Label","Screen Print","No Branding"],"Packaging":["Standard","Custom Hang Tag","Custom Polybag","Gift Box"]},"seo":{"title":"Custom BJJ Belt Manufacturer | Haute Fighting Gears","description":"Private label BJJ belts manufactured in Sialkot, Pakistan. All ranks, IBJJF standard, custom embroidery, woven labels, wholesale orders.","slug":"bjj-belt"}}]},{"id":"mma","name":"MMA","products":[{"id":"quick-hand-wrap","name":"Quick Hand Wrap","category":"MMA","image":"/assets2/products/mma-grappling-glove/1.webp","images":["/assets2/products/mma-grappling-glove/1.webp","/assets2/products/mma-grappling-glove/2.webp"],"description":"Open-finger gloves designed for grappling and striking, offering flexibility and protection. Available in PU Sparring or Cowhide Competition grade.","variants":[{"id":"pu-sparring","label":"PU Sparring"},{"id":"cowhide-competition","label":"Cowhide Competition"}],"specs":{"Size":["S","M","L","XL"],"Finger Style":["Open Finger","Pre-Curved"],"Color":["Black","Red","Blue","White","Custom"]},"seo":{"title":"Custom MMA Grappling Gloves Manufacturer | Haute Fighting Gears","description":"Private label MMA grappling gloves manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.","slug":"quick-hand-wrap"}},{"id":"mma-gloves","name":"MMA Gloves","category":"MMA","image":"/assets2/products/mma gloves/1.webp","images":["/assets2/products/mma gloves/1.webp","/assets2/products/mma gloves/2.webp","/assets2/products/mma gloves/3.webp","/assets2/products/mma gloves/4.webp"],"description":"High-performance MMA gloves designed for sparring, competition, and training. Manufactured with premium leather or PU and multi-layer foam padding to deliver comfort, protection, and flexibility.","variants":[{"id":"cowhide","label":"Cowhide Leather"},{"id":"pu","label":"PU Synthetic"}],"specs":{"Size":["XS","S","M","L","XL"],"Color":["Black","Red","Blue","White","Custom"],"Material":["Cowhide Leather","PU Synthetic"],"Logo":["Yes","No"]},"seo":{"title":"Custom MMA Gloves Manufacturer | Haute Fighting Gears","description":"Private label custom MMA gloves manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.","slug":"mma-gloves"}},{"id":"ear-guard","name":"Ear Guard","category":"MMA","image":"/assets/products/ear guard/1.webp","images":["/assets/products/ear guard/1.webp","/assets/products/ear guard/2.webp","/assets/products/ear guard/3.webp"],"description":"Premium wrestling and grappling ear guards designed to protect athletes during training and competition. Adjustable straps provide a secure and comfortable fit while reducing the risk of ear injuries.","variants":[{"id":"junior","label":"Junior"},{"id":"senior","label":"Senior"}],"specs":{"Size":["Junior","Senior"],"Color":["Black","Red","Blue","White","Custom"],"Material":["PU Synthetic","Cowhide Leather"],"Logo":["Yes","No"]},"seo":{"title":"Custom Ear Guards Manufacturer | Haute Fighting Gears","description":"Private label wrestling and MMA ear guards manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.","slug":"ear-guard"}},{"id":"chest-guard","name":"Chest Guard","category":"MMA","image":"/assets/products/chest-guard/1.webp","images":["/assets/products/chest-guard/1.webp","/assets/products/chest-guard/2.webp","/assets/products/chest-guard/3.webp","/assets/products/chest-guard/4.webp","/assets/products/chest-guard/5.webp"],"description":"Professional chest protectors manufactured for Taekwondo, Muay Thai, MMA, and kickboxing training and competition. Constructed with high-impact foam padding and reinforced outer shell for superior protection. Available in adult and youth sizing with full custom branding.","variants":[{"id":"adult","label":"Adult"},{"id":"youth","label":"Youth / Junior"},{"id":"female","label":"Female Cut"}],"specs":{"Size":["XS","S","M","L","XL","XXL"],"Material":["PU Synthetic","Cowhide Leather","Neoprene Shell"],"Padding":["Standard Foam","High Density EVA","Multi-Layer"],"Closure":["Hook & Loop Back Strap","Full Zipper","Side Buckles"],"Color":["Black","Red","Blue","White","Custom"],"Logo":["Yes","No"]},"seo":{"title":"Custom Chest Guard Manufacturer | Haute Fighting Gears","description":"Private label chest guards manufactured in Sialkot, Pakistan. Taekwondo, Muay Thai, MMA. Adult and youth sizes. OEM, ODM, wholesale.","slug":"chest-guard"}}]},{"id":"apparel","name":"Apparel","products":[{"id":"muay-thai-shorts","name":"Muay Thai Shorts","category":"Apparel","image":"/assets2/products/Muaythai shorts/1.webp","images":["/assets2/products/Muaythai shorts/1.webp","/assets2/products/Muaythai shorts/2.webp","/assets2/products/Muaythai shorts/3.webp","/assets2/products/Muaythai shorts/4.webp"],"description":"Premium Muay Thai shorts designed for unrestricted movement during training and competition. Manufactured using lightweight satin or polyester fabric with reinforced stitching and customizable sublimation or embroidery.","variants":[{"id":"satin","label":"Satin"},{"id":"polyester","label":"Polyester"}],"specs":{"Size":["XS","S","M","L","XL","XXL"],"Color":["Black","Red","Blue","White","Gold","Custom"],"Material":["Satin","Polyester"],"Logo":["Sublimation","Embroidery","No"]},"seo":{"title":"Custom Muay Thai Shorts Manufacturer | Haute Fighting Gears","description":"Private label custom Muay Thai shorts manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, sublimation, embroidery, worldwide shipping.","slug":"muay-thai-shorts"}},{"id":"boxing-shoes","name":"Boxing Shoes","category":"Apparel","image":"/assets/products/boxing shoe/1.webp","images":["/assets/products/boxing shoe/1.webp","/assets/products/boxing shoe/2.webp","/assets/products/boxing shoe/3.webp","/assets/products/boxing shoe/4.webp","/assets/products/boxing shoe/5.webp","/assets/products/boxing shoe/6.webp"],"description":"Professional boxing shoes engineered for agility, stability, and comfort inside the ring. Lightweight construction with durable sole provides superior grip and foot support during training and competition.","variants":[{"id":"low-top","label":"Low Top"},{"id":"high-top","label":"High Top"}],"specs":{"Size":["US 5","US 6","US 7","US 8","US 9","US 10","US 11","US 12","US 13"],"Color":["Black","Red","Blue","White","Custom"],"Material":["Synthetic Leather","Genuine Leather"],"Logo":["Yes","No"]},"seo":{"title":"Custom Boxing Shoes Manufacturer | Haute Fighting Gears","description":"Private label boxing shoes manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.","slug":"boxing-shoes"}},{"id":"boxing-robe","name":"Boxing Robe","category":"Apparel","image":"/assets/products/boxing-robe/1.webp","images":["/assets/products/boxing-robe/1.webp","/assets/products/boxing-robe/2.webp","/assets/products/boxing-robe/3.webp","/assets/products/boxing-robe/4.webp","/assets/products/boxing-robe/5.webp"],"description":"Professional boxing robes manufactured for ring walk, competition, and team branding. Lightweight satin construction with optional hood, custom embroidery, and sublimation printing. Available in full-length and short cut styles for both men and women.","variants":[{"id":"satin","label":"Satin"},{"id":"polyester-satin","label":"Polyester Satin"},{"id":"lightweight-satin","label":"Lightweight Satin"}],"specs":{"Size":["XS","S","M","L","XL","XXL","Custom"],"Length":["Short (Hip)","Mid (Thigh)","Full Length"],"Sleeve":["Short Sleeve","Long Sleeve"],"Hood":["With Hood","Without Hood"],"Color":["Black","Red","Blue","White","Gold","Custom"],"Trim Color":["Gold","Silver","Contrast Color","Custom"],"Branding":["Embroidery","Sublimation","Screen Print","Woven Label"]},"seo":{"title":"Custom Boxing Robe Manufacturer | Haute Fighting Gears","description":"Private label boxing robes manufactured in Sialkot, Pakistan. Satin, custom colors, hood options, embroidery and sublimation. OEM wholesale.","slug":"boxing-robe"}}]},{"id":"accessories","name":"Accessories","products":[{"id":"boxing-gloves-keychain","name":"Boxing Gloves Keychain","category":"Accessories","image":"/assets/products/boxing gloves keychain/1.webp","images":["/assets/products/boxing gloves keychain/1.webp","/assets/products/boxing gloves keychain/2.webp","/assets/products/boxing gloves keychain/3.webp"],"description":"Custom mini boxing glove keychains manufactured using durable synthetic leather. Perfect for promotional events, retail merchandise, gifts, and private label branding.","variants":[{"id":"pu","label":"PU Synthetic"},{"id":"cowhide","label":"Cowhide Leather"}],"specs":{"Color":["Black","Red","Blue","White","Custom"],"Material":["PU Synthetic","Cowhide Leather"],"Logo":["Yes","No"]},"seo":{"title":"Custom Boxing Gloves Keychain Manufacturer | Haute Fighting Gears","description":"Private label mini boxing glove keychains manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom logo, colors, worldwide shipping.","slug":"boxing-gloves-keychain"}},{"id":"ufc-gloves-keychain","name":"UFC Gloves Keychain","category":"Accessories","image":"/assets2/products/ufc gloves keychain/1.webp","images":["/assets2/products/ufc gloves keychain/1.webp","/assets2/products/ufc gloves keychain/2.webp","/assets2/products/ufc gloves keychain/3.webp","/assets2/products/ufc gloves keychain/4.webp","/assets2/products/ufc gloves keychain/5.webp"],"description":"Miniature boxing-inspired keychain manufactured from premium synthetic leather. Ideal for promotional giveaways, gyms, sports brands, and merchandise collections. Fully customizable with logos and colors.","variants":[{"id":"pu","label":"PU Synthetic"},{"id":"cowhide","label":"Cowhide Leather"}],"specs":{"Color":["Black","Red","Blue","White","Custom"],"Material":["PU Synthetic","Cowhide Leather"],"Logo":["Yes","No"]},"seo":{"title":"Custom UFC Gloves Keychain Manufacturer | Haute Fighting Gears","description":"Private label UFC-style mini glove keychains manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom logo, colors, worldwide shipping.","slug":"ufc-gloves-keychain"}}]},{"id":"gym-fitness","name":"Gym & Fitness","products":[{"id":"inner-gloves","name":"Hand Wraps","category":"Gym & Fitness","image":"/assets2/products/hand-wrap-gloves/1.webp","images":["/assets2/products/hand-wrap-gloves/1.webp","/assets2/products/hand-wrap-gloves/2.webp"],"description":"Durable hand wraps providing wrist stability and knuckle protection for training and fights. Available in Cotton/Nylon, Gel, or Quick Wrap styles.","variants":[{"id":"cotton","label":"Cotton / Nylon"},{"id":"gel","label":"Gel Wrap"},{"id":"quick-wrap","label":"Quick Wrap"}],"specs":{"Length":["1.5m","3m","4m","4.5m"],"Color":["Black","Red","Blue","White","Pink","Custom"]},"seo":{"title":"Custom Hand Wraps Manufacturer | Haute Fighting Gears","description":"Private label hand wraps manufactured in Sialkot, Pakistan. OEM, ODM, wholesale, custom colors, branding, worldwide shipping.","slug":"inner-gloves"}},{"id":"hand-wrap","name":"Hand Wrap","category":"Gym & Fitness","image":"/assets2/products/hand-wrap/1.webp","images":["/assets2/products/hand-wrap/1.webp","/assets2/products/hand-wrap/2.webp","/assets2/products/hand-wrap/3.webp","/assets2/products/hand-wrap/4.webp"],"description":"Professional hand wraps manufactured for boxing, Muay Thai, MMA, and kickboxing. Provides essential wrist support, knuckle protection, and hand stabilization during training and competition. Available in traditional cotton, elastic cotton, and quick-wrap styles with custom lengths and private label branding.","variants":[{"id":"cotton","label":"Traditional Cotton"},{"id":"elastic-cotton","label":"Elastic Cotton"},{"id":"quick-wrap","label":"Quick Wrap / Gel"},{"id":"semi-elastic","label":"Semi-Elastic"}],"specs":{"Length":["2.5m","3m","4m","4.5m","5m"],"Color":["Black","Red","Blue","White","Pink","Yellow","Custom"],"Thumb Loop":["Yes","No"],"Closure":["Hook-and-Loop Velcro","Elastic Cuff"],"Label":["Woven Label","Printed Label","Custom Branding"]},"seo":{"title":"Custom Hand Wraps Manufacturer | Haute Fighting Gears","description":"Private label hand wraps manufactured in Sialkot, Pakistan. Cotton, elastic, gel wraps in custom lengths, colors and branding. OEM wholesale.","slug":"hand-wrap"}}]},{"id":"ring-equipment","name":"Ring Equipment","products":[{"id":"boxing-ring","name":"Boxing Ring","category":"Ring Equipment","image":"/assets/products/boxing-ring/1.webp","images":["/assets/products/boxing-ring/1.webp","/assets/products/boxing-ring/2.webp","/assets/products/boxing-ring/3.webp"],"description":"Professional boxing rings manufactured for gyms, promotions, training centers, and events. Fully custom built with your choice of ring size, rope colors, corner pad colors, canvas design, and complete branding. Flat-pack shipping worldwide with assembly instructions included.","variants":[{"id":"training","label":"Training Ring"},{"id":"competition","label":"Competition Ring"},{"id":"portable","label":"Portable / Collapsible"}],"specs":{"Ring Size":["14ft x 14ft","16ft x 16ft","18ft x 18ft","20ft x 20ft","22ft x 22ft","Custom"],"Ropes":["3 Ropes","4 Ropes"],"Rope Color":["Red / Blue / White","Custom Colors"],"Corner Pad Color":["Red","Blue","Black","Custom"],"Frame Finish":["Black Powder Coat","Chrome","Custom Color"],"Canvas":["Printed Canvas","Plain Canvas","No Canvas"]},"seo":{"title":"Custom Boxing Ring Manufacturer | Haute Fighting Gears","description":"Professional boxing rings manufactured in Sialkot, Pakistan. Custom size, rope colors, canvas printing, OEM, ODM, wholesale, worldwide shipping.","slug":"boxing-ring"}},{"id":"ring-canvas","name":"Ring Canvas","category":"Ring Equipment","image":"/assets2/products/ring-canvas/1.webp","images":["/assets2/products/ring-canvas/1.webp","/assets2/products/ring-canvas/2.webp","/assets2/products/ring-canvas/3.webp","/assets2/products/ring-canvas/4.webp","/assets2/products/ring-canvas/5.webp"],"description":"Professional boxing ring canvas covers manufactured for competition and training rings. Heavy-duty vinyl construction with non-slip surface treatment and reinforced eyelets for secure ring attachment. Available in standard and custom sizes with full sublimation branding for gyms, promotions, and TV events.","variants":[{"id":"standard-vinyl","label":"Standard Vinyl"},{"id":"premium-vinyl","label":"Premium Non-Slip Vinyl"},{"id":"custom-sublimated","label":"Custom Sublimated"}],"specs":{"Ring Size":["16\ufffd16 ft","18\ufffd18 ft","20\ufffd20 ft","22\ufffd22 ft","24\ufffd24 ft","Custom"],"Surface":["Standard Grip","Non-Slip Texture","Competition Grade"],"Printing":["Sublimation (Full Design)","Screen Print (Logo)","Plain / No Print"],"Eyelets":["Standard Brass","Reinforced Heavy Duty"],"Color":["White","Blue","Grey","Custom"]},"seo":{"title":"Custom Ring Canvas Manufacturer | Haute Fighting Gears","description":"Professional boxing ring canvas manufactured in Sialkot, Pakistan. Custom sizes, sublimation printing, reinforced edges. OEM, wholesale.","slug":"ring-canvas"}}]}]};

// -- Core fetch � shared by loadProducts and loadCategories ---
async function _fetchProductData() {
    if (_rawDataCache) return _rawDataCache;

    // Try absolute path first (works on any proper server / GitHub Pages root)
    const urlAbsolute = _getJsonPath();
    // Try relative path second (works when site is in a subdirectory)
    const urlRelative = _getJsonPathRelative();

    const urlsToTry = [urlAbsolute];
    // Only add relative if it differs from absolute
    if (urlRelative !== urlAbsolute) urlsToTry.push(urlRelative);

    for (const url of urlsToTry) {
        try {
            const res = await fetch(url);
            if (!res.ok) { continue; }
            const data = await res.json();
            _rawDataCache = data;
            return _rawDataCache;
        } catch (e) { continue; }
    }
    _rawDataCache = _INLINE_PRODUCT_DATA;
    return _rawDataCache;
}

// -- Load all products (flattened array) -----------------------
async function loadProducts() {
    if (_productsCache) return _productsCache;
    try {
        const data = await _fetchProductData();
        _productsCache = [];
        (data.categories || []).forEach(cat => {
            (cat.products || []).forEach(p => {
                _productsCache.push({
                    ...p,
                    categoryId: cat.id,
                    categoryName: _categoryDisplayNames[cat.id] || cat.name
                });
            });
        });
        return _productsCache;
    } catch (e) {
        console.error('[products-engine] Failed to load products:', e.message);
        _rawDataCache = null;
        return [];
    }
}

// -- Load ONLY the real sample products (have local images + specs) --
// Used by Samples page and Featured sections � NOT by Bulk/Custom dropdowns
const _REAL_PRODUCT_IDS = [
    'boxing-gloves', 'boxing-head-guard', 'inner-gloves', 'quick-hand-wrap',
    'round-punching-mitt', 'focus-mitt', 'bag-mitt', 'double-end-ball',
    'mma-gloves', 'ear-guard', 'muay-thai-shorts', 'boxing-shoes',
    'boxing-gloves-keychain', 'ufc-gloves-keychain',
    'bjj-belt', 'belly-pad', 'ring-canvas', 'groin-guard',
    'chest-guard', 'boxing-robe', 'hand-wrap', 'boxing-ring'
];

async function loadSampleProducts() {
    const all = await loadProducts();
    return all.filter(p => _REAL_PRODUCT_IDS.includes(p.id));
}

// -- Get tiered price for a product based on variant + quantity -
// variant: variant object from product.variants[], or null for legacy pricing
// qty: number
function getPrice(product, qty, variant) {
    qty = parseInt(qty) || 1;
    // Use variant pricing if provided
    const pricing = (variant && variant.pricing) ? variant.pricing
        : (product && product.pricing) ? product.pricing
            : null;
    if (!pricing) return null;
    if (qty >= 50) return pricing['50'];
    if (qty >= 25) return pricing['25'];
    return pricing['1'];
}

function getStartingPrice(product) {
    if (!product) return null;
    // Use first variant's pricing if variants exist
    if (product.variants && product.variants.length > 0) {
        return product.variants[0].pricing['1'];
    }
    if (product.pricing) return product.pricing['1'];
    return null;
}

function formatPrice(price) {
    if (price == null) return '';
    return '$' + parseFloat(price).toFixed(2);
}

// -- Load categories -------------------------------------------
async function loadCategories() {
    if (_categoriesCache) return _categoriesCache;
    try {
        const data = await _fetchProductData();
        _categoriesCache = data.categories;
        return _categoriesCache;
    } catch (e) {
        console.error('[products-engine] Failed to load categories:', e.message);
        return [];
    }
}

// -- Get single product by id ----------------------------------
async function getProductById(id) {
    const products = await loadProducts();
    return products.find(p => p.id === id) || null;
}

// -- Resolve image URL � always returns a valid image ---------
function _resolveImage(p, index) {
    index = index || 0;

    // If product has a local images array, use it
    if (p.images && p.images.length > index) {
        return _toAbsoluteProductPath(p.images[index]);
    }

    // If product has a single local image path (starts with ../ or ./)
    if (p.image && (p.image.startsWith('../') || p.image.startsWith('./'))) {
        return _toAbsoluteProductPath(p.image);
    }

    // Use the product's own image if it's a real external URL
    if (
        p.image &&
        p.image.startsWith('http') &&
        !p.image.includes('via.placeholder.com') &&
        !p.image.includes('data:image/svg')
    ) {
        return p.image;
    }

    // Category-level fallback images (Unsplash)
    const categoryImages = {
        'street-fashion': 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=400&fit=crop&auto=format',
        'gym-fitness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
        'mma': 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=400&fit=crop&auto=format',
        'boxing': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=400&fit=crop&auto=format',
        'sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop&auto=format'
    };

    return categoryImages[p.categoryId] ||
        'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22400%22%3E%3Crect width%3D%22400%22 height%3D%22400%22 fill%3D%22%231b1b1b%22%2F%3E%3C%2Fsvg%3E';
}

// Convert a product image path to the correct absolute URL
function _toAbsoluteProductPath(relativePath) {
    // If already an absolute path (starts with /)
    if (relativePath.startsWith('/')) {
        // On GitHub Pages with a repo subdirectory, HFG_BASE is set by mobile-fixes.js
        // e.g. HFG_BASE = "https://user.github.io/fightgear-site"
        // Use it as prefix only when it differs from the origin (i.e. there's a subpath)
        if (window.HFG_BASE && window.HFG_BASE !== window.location.origin) {
            // Strip origin to get just the base path (e.g. "/fightgear-site")
            const basePath = window.HFG_BASE.replace(window.location.origin, '');
            // Avoid double-prefixing if path already starts with basePath
            if (basePath && !relativePath.startsWith(basePath + '/')) {
                return basePath + relativePath;
            }
        }
        return relativePath;
    }

    // Strip leading ../ or ./
    const clean = relativePath.replace(/^(\.\.\/|\.\/)+/, '');

    // Prepend / to make it absolute
    return '/' + clean;
}

// -- Build product dropdown options HTML -----------------------
async function buildProductOptions(selectedId) {
    const categories = await loadCategories();
    if (!categories || categories.length === 0) {
        return '<option value="">� No products found �</option>';
    }
    let html = '<option value="">� Select a product �</option>';
    categories.forEach(cat => {
        html += `<optgroup label="${cat.name}">`;
        cat.products.forEach(p => {
            if (!p.id || !p.name) return; // skip malformed entries
            const sel = p.id === selectedId ? ' selected' : '';
            html += `<option value="${p.id}"${sel}>${p.name}</option>`;
        });
        html += '</optgroup>';
    });
    return html;
}

// -- Render product grid ---------------------------------------
// filter: category id string, or 'all'
async function renderProductGrid(container, filter) {
    filter = filter || 'all';
    const products = await loadProducts();
    const list = filter === 'all' ? products : products.filter(p => p.categoryId === filter);

    if (list.length === 0) {
        container.innerHTML = '<div class="col-span-4 text-center py-20 font-label-bold uppercase opacity-40">No products found</div>';
        return;
    }

    const pagePrefix = _getPagePrefix();
    const rootPrefix = _getRootPrefix();

    container.innerHTML = list.map(p => {
        const img = _resolveImage(p, 0);

        const target = `/product/?id=${encodeURIComponent(p.id)}`;
        return `
        <a href="${target}" class="group border border-outline-variant bg-surface-container-lowest overflow-hidden flex flex-col" data-reveal style="text-decoration:none;color:inherit;display:flex">
            <div style="width:100%;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;aspect-ratio:1/1;border-bottom:1px solid #eee">
                <img
                    src="${img}"
                    alt="${p.name}"
                    loading="lazy"
                    class="transition-transform duration-500 group-hover:scale-105"
                    style="display:block;width:100%;height:auto;object-fit:contain;padding:8px"
                    onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22400%22%3E%3Crect width%3D%22400%22 height%3D%22400%22 fill%3D%22%23eeeeee%22%2F%3E%3C%2Fsvg%3E'"
                />
            </div>
            <div class="p-5 flex flex-col flex-grow">
                <h3 class="font-headline-md text-headline-md uppercase mb-1 leading-tight" style="font-size:17px">${p.name}</h3>
                <p class="font-body-md text-neutral-gray mb-4" style="font-size:12px;font-weight:400;letter-spacing:0.04em">${p.categoryName || p.category || ''}</p>
                <div class="mt-auto">
                    <span class="w-full bg-accent-red text-on-primary py-3 font-label-bold uppercase flex items-center justify-center gap-2 text-center text-sm" style="pointer-events:none">
                        Send Inquiry
                    </span>
                </div>
            </div>
        </a>`;
    }).join('');

    if (typeof initScrollReveal === 'function') initScrollReveal();
}

// -- Build category filter buttons -----------------------------
async function buildCategoryFilters(container, activeId, onFilter) {
    const categories = await loadCategories();
    const allActive = (!activeId || activeId === 'all') ? 'bg-primary text-on-primary' : '';
    let html = `<button data-filter="all" class="filter-btn ${allActive} px-5 py-2 font-label-bold uppercase border-2 border-primary hover:bg-primary hover:text-on-primary transition-all">All Products</button>`;
    categories.forEach(cat => {
        const active = cat.id === activeId ? 'bg-primary text-on-primary' : '';
        html += `<button data-filter="${cat.id}" class="filter-btn ${active} px-5 py-2 font-label-bold uppercase border-2 border-primary hover:bg-primary hover:text-on-primary transition-all">${_getCategoryLabel(cat)}</button>`;
    });
    container.innerHTML = html;
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('bg-primary', 'text-on-primary'));
            btn.classList.add('bg-primary', 'text-on-primary');
            if (typeof onFilter === 'function') onFilter(btn.dataset.filter);
        });
    });
}


