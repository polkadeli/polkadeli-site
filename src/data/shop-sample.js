// SAMPLE DATA for the Shopify-style shop mockup (/shop-preview).
// Product names come from the real grocery list; prices, sizes and
// descriptions are made up so the layout can be judged. Once the real
// Shopify store exists, this file goes away and products come from Shopify.

const img = (file, pos = 'center') => ({ src: `/images/shop/${file}.jpg`, pos });
const photo = (file, pos = 'center') => ({ src: `/images/${file}.jpg`, pos });

export const categories = [
  { slug: 'kielbasa', name: 'Kielbasa', blurb: 'Smoked, dry and fresh', image: img('kabanosy') },
  { slug: 'deli-meats', name: 'Deli Meats', blurb: 'Hams, bacon, pates', image: img('cold-cuts') },
  { slug: 'cheese', name: 'Cheese', blurb: 'Polish hard and smoked', image: null },
  { slug: 'pierogi', name: 'Pierogi & Dumplings', blurb: 'Frozen, ready to cook', image: photo('slide-pierogi') },
  { slug: 'jars', name: 'Jars & Pickles', blurb: 'Sauerkraut, pickles, bigos', image: img('jars') },
  { slug: 'sweets', name: 'Sweets', blurb: 'Wedel, Krowki, Prince Polo', image: img('sweets') },
  { slug: 'bakery', name: 'Baked Goods', blurb: 'Paczki, makowiec, chrusciki', image: photo('slide-makowiec') },
  { slug: 'pantry', name: 'Pantry', blurb: 'Soups, spices, yeast', image: img('groceries') },
];

// variants: [label, price]. `weighed` = cut to order at the deli counter.
const p = (slug, name, category, extra) => ({ slug, name, category, ...extra, price: extra.variants[0][1] });

export const products = [
  p('wedding-kielbasa', 'Wedding Kielbasa', 'kielbasa', { weighed: true, image: img('sausages-kiszka', '20% 60%'), badge: 'Bestseller', variants: [['1/2 lb', 4.5], ['1 lb', 8.99], ['2 lb', 17.98]], desc: 'Coarsely ground pork, garlic and marjoram, gently smoked. The one for wedding tables, grilling and bigos.' }),
  p('kabanosy', 'Kabanosy', 'kielbasa', { weighed: true, image: img('kabanosy', 'center 30%'), badge: 'Bestseller', variants: [['1/2 lb', 6.5], ['1 lb', 12.99]], desc: 'Thin, dry-smoked pork sticks. A road-trip snack and a must on every cold cut platter.' }),
  p('kabanosy-spicy', 'Kabanosy, Spicy', 'kielbasa', { weighed: true, image: img('kabanosy', 'center 85%'), variants: [['1/2 lb', 6.5], ['1 lb', 12.99]], desc: 'Our kabanosy with chili. Dry, smoky and a little hot.' }),
  p('fresh-kielbasa', 'Fresh Kielbasa', 'kielbasa', { weighed: true, image: img('fresh-sausage'), variants: [['1 lb', 7.99], ['2 lb', 15.98]], desc: 'Uncooked white kielbasa for Easter zurek or the oven. Keep refrigerated and cook before eating.' }),
  p('hunters-kielbasa', 'Hunters Kielbasa', 'kielbasa', { weighed: true, image: img('kabanosy', 'left 50%'), variants: [['1/2 lb', 6], ['1 lb', 11.99]], desc: 'Short, dry and heavily smoked with juniper and pepper.' }),
  p('cracow-kielbasa', 'Cracow Dry Kielbasa', 'kielbasa', { weighed: true, image: img('cold-cuts', 'right 60%'), variants: [['1/2 lb', 5.5], ['1 lb', 10.99]], desc: 'Thick dry sausage with lean chunks of pork. Slice thin for sandwiches.' }),

  p('polish-ham', 'Polish Ham', 'deli-meats', { weighed: true, image: img('cold-cuts', '45% 60%'), badge: 'Sliced to order', variants: [['1/2 lb', 5.5], ['1 lb', 10.99]], desc: 'Classic smoked ham, sliced fresh at the counter.' }),
  p('kiszka', 'Kiszka', 'deli-meats', { weighed: true, image: img('sausages-kiszka', '55% 30%'), variants: [['1 lb', 6.99], ['2 lb', 13.98]], desc: 'Buckwheat and pork blood sausage. Fry with onions.' }),
  p('smoked-ribs', 'Smoked Ribs', 'deli-meats', { weighed: true, image: img('sausages-kiszka', 'right 60%'), variants: [['1 lb', 7.49], ['2 lb', 14.98]], desc: 'Smoked pork ribs for soups, beans and sauerkraut.' }),
  p('country-headcheese', 'Country Headcheese', 'deli-meats', { weighed: true, image: img('headcheese', '30% 70%'), variants: [['1/2 lb', 3.5], ['1 lb', 6.99]], desc: 'Old-fashioned salceson, made the country way. Serve with vinegar and onion.' }),
  p('homemade-pate', 'Homemade Pate', 'deli-meats', { weighed: true, image: img('headcheese', '70% 70%'), variants: [['1/2 lb', 5], ['1 lb', 9.99]], desc: 'Baked pork and liver pate, made in house.' }),
  p('hunter-bacon', 'Hunter Bacon', 'deli-meats', { weighed: true, image: img('cold-cuts', 'left 70%'), variants: [['1/2 lb', 4.75], ['1 lb', 9.49]], desc: 'Smoked slab bacon, ready to eat or render for a pierogi topping.' }),

  p('morski', 'Morski Cheese', 'cheese', { weighed: true, image: null, variants: [['1/2 lb', 4.5], ['1 lb', 8.99]], desc: 'Mild, creamy Polish hard cheese, sliced or by the piece.' }),
  p('krolewski-smoked', 'Krolewski Smoked', 'cheese', { weighed: true, image: null, variants: [['1/2 lb', 5], ['1 lb', 9.99]], desc: "The \"king's cheese\", smoked. Nutty and slightly sweet." }),
  p('rycki-edam', 'Rycki Edam', 'cheese', { weighed: true, image: null, variants: [['1/2 lb', 4.25], ['1 lb', 8.49]], desc: 'Semi-hard Edam from Ryki. A breakfast table classic.' }),

  p('pierogi-potato-cheese', 'Pierogi, Potato & Cheese', 'pierogi', { size: 'Frozen', image: photo('bg-pierogi', 'center 60%'), badge: 'Bestseller', variants: [['12 pcs', 7.99], ['24 pcs', 14.99]], desc: "Ruskie pierogi: potato, farmer's cheese and onion. Boil 4 minutes, then fry in butter." }),
  p('pierogi-meat', 'Pierogi, Meat', 'pierogi', { size: 'Frozen', image: photo('slide-pierogi', '30% 50%'), variants: [['12 pcs', 8.99], ['24 pcs', 16.99]], desc: 'Seasoned pork and beef filling.' }),
  p('pierogi-sauerkraut-mushroom', 'Pierogi, Sauerkraut & Mushroom', 'pierogi', { size: 'Frozen', image: photo('slide-pierogi', '75% 40%'), variants: [['12 pcs', 8.49], ['24 pcs', 15.99]], desc: 'The Christmas Eve pierogi, with sauerkraut and forest mushrooms.' }),
  p('kopytka', 'Potato Dumplings (Kopytka)', 'pierogi', { size: 'Frozen', image: photo('bg-pierogi', 'left 30%'), variants: [['1 lb', 5.99]], desc: 'Little potato dumplings. Serve with butter and breadcrumbs, or under goulash.' }),
  p('blintzes-cherry-cheese', 'Blintzes, Cherry Cheese', 'pierogi', { size: 'Frozen', image: null, variants: [['6 pcs', 6.99]], desc: 'Thin crepes filled with sweet cheese and cherries.' }),

  p('sauerkraut-jar', 'Sauerkraut', 'jars', { size: '900 g jar', image: img('jars', '75% 30%'), variants: [['1 jar', 3.99]], desc: 'Naturally fermented cabbage for bigos, pierogi and salads.' }),
  p('bigos-jar', "Hunter's Stew (Bigos)", 'jars', { size: '860 g jar', image: img('jars', '15% 30%'), badge: 'New', variants: [['1 jar', 6.49]], desc: 'Slow-cooked sauerkraut, cabbage and meats. Heat and serve with rye bread.' }),
  p('pickles-in-brine', 'Cucumbers in Brine', 'jars', { size: '900 g jar', image: img('jars', '45% 30%'), variants: [['1 jar', 4.49]], desc: 'Ogórki kiszone: sour, garlicky dill pickles.' }),
  p('beets-horseradish', 'Beets with Horseradish', 'jars', { size: '500 g jar', image: img('jars', '30% 85%'), variants: [['1 jar', 3.79]], desc: 'Ćwikła: grated beets with a horseradish kick. The Easter ham partner.' }),

  p('ptasie-mleczko', 'Ptasie Mleczko', 'sweets', { size: '380 g box', image: img('sweets', '35% 40%'), badge: 'Bestseller', variants: [['Vanilla', 6.99], ['Chocolate', 6.99], ['Lemon', 6.99]], desc: 'Chocolate-covered marshmallow soufflé from E. Wedel.' }),
  p('prince-polo', 'Prince Polo', 'sweets', { size: '35 g bar', image: img('sweets', '85% 50%'), variants: [['1 bar', 1.29], ['Box of 28', 29.99]], desc: 'Chocolate-covered wafer bar. The Polish classic.' }),
  p('krowki', 'Krowki', 'sweets', { size: '250 g bag', image: img('sweets', '60% 30%'), variants: [['1 bag', 4.99]], desc: 'Fudgy milk caramels, soft inside and crumbly outside.' }),
  p('torcik-wedlowski', 'Torcik Wedlowski', 'sweets', { size: '250 g', image: img('sweets', 'left 70%'), variants: [['1 cake', 9.99]], desc: 'Wafer cake in Wedel chocolate. A perfect hostess gift.' }),

  p('paczki', 'Paczki', 'bakery', { image: null, badge: 'Order ahead', variants: [['Box of 6', 13.99], ['Box of 12', 26.99]], desc: 'Rose-jam filled Polish doughnuts with orange glaze. Order ahead for Fat Thursday.' }),
  p('poppyseed-roll', 'Poppyseed Roll', 'bakery', { image: photo('slide-makowiec', '60% 50%'), variants: [['Whole roll', 14.99]], desc: 'Makowiec: sweet yeast dough rolled with poppyseed, honey and raisins.' }),
  p('chrusciki', 'Chrusciki', 'bakery', { image: null, variants: [['1/2 lb box', 7.99]], desc: 'Angel wings: thin, crisp fried pastry dusted with powdered sugar.' }),

  p('white-borscht', 'White Borscht (Zurek) in a Box', 'pantry', { size: '500 ml', image: img('groceries', '35% 85%'), variants: [['1 box', 3.49]], desc: 'Sour rye soup base. Add fresh kielbasa, egg and potatoes.' }),
  p('fresh-yeast', 'Fresh Yeast', 'pantry', { size: '100 g cube', image: null, variants: [['1 cube', 1.49]], desc: 'For paczki, babka and bread. Keep refrigerated.' }),
  p('marjoram', 'Marjoram (Majeranek)', 'pantry', { size: '8 g', image: img('groceries', '10% 60%'), variants: [['1 pack', 2.29]], desc: 'The herb that makes zurek and kielbasa taste like home.' }),
];

export const bySlug = Object.fromEntries(products.map((x) => [x.slug, x]));
export const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
export const money = (n) => `$${n.toFixed(2)}`;
// Price shown on product cards: per pound for counter items, "from" for multi-size items.
export const listPrice = (x) => {
  const lb = x.variants.find((v) => v[0] === '1 lb');
  if (x.weighed && lb) return `${money(lb[1])} / lb`;
  return (x.variants.length > 1 && new Set(x.variants.map((v) => v[1])).size > 1 ? 'from ' : '') + money(Math.min(...x.variants.map((v) => v[1])));
};

// Compact product info the cart script needs in the browser.
export const cartCatalog = Object.fromEntries(products.map((x) => [x.slug, { n: x.name, i: x.image, v: x.variants, w: !!x.weighed }]));

export const fulfillment = [
  { id: 'pickup-ss', label: 'Pickup, Silver Spring', note: '13438 New Hampshire Ave · usually ready in 2 hours', fee: 0 },
  { id: 'pickup-va', label: 'Pickup, Vienna', note: '431 Maple Ave W · usually ready in 2 hours', fee: 0 },
  { id: 'delivery', label: 'Local delivery', note: 'Within 10 miles of either store · $45 minimum', fee: 7.99 },
];
