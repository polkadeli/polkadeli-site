// Deli Menu content. Edit prices and items here; the page updates automatically.

export const pierogi = {
  prices: [
    ['12 pieces', '$14.99'],
    ['6 pieces', '$7.99'],
  ],
  fillings: ['Potato & Cheese', 'Meat & Kraut', 'Kraut & Mushroom', 'Mix Pierogi'],
  servedWith: 'Served with onions and sour cream',
};

export const sandwiches = {
  price: '$10.99',
  items: [
    { name: 'Smoked Kielbasa', desc: 'Sub roll, kraut, grilled onions, mustard, horseradish sauce' },
    { name: 'BLT', desc: 'Sub roll, bacon, lettuce, tomato' },
    { name: 'Kielbasa Reuben', desc: 'Rye bread, cheese, kraut, Russian dressing' },
    { name: 'Pork Schnitzel', desc: 'Sub roll, lettuce, tomato, horseradish sauce' },
    { name: 'Ham or Turkey & Cheese', desc: 'Sub roll, lettuce, tomato, mayo, mustard' },
  ],
  side: ['Add a side of Polish potato salad', '$1'],
};

export const entrees = [
  { name: 'Sweet Cheese Crepes', price: '$10.99', desc: '3 crepes served with fruit jam and sour cream' },
  { name: 'Stuffed Cabbage & Roasted Potatoes', price: '$11.99', desc: 'Topped with tomato sauce' },
  { name: 'Kielbasa w/ Rye Bread & Potato Salad', note: '(fresh or smoked)', price: '$11.99', desc: 'Kraut, grilled onions, mustard, horseradish sauce' },
  { name: 'Kielbasa & 4 Pierogi', price: '$14.99', desc: 'Kraut, grilled onions, mustard, horseradish sauce' },
  { name: 'Polish Sampler', price: '$14.99', desc: 'Fresh & smoked kielbasa, 4 pierogi, kraut, grilled onions, mustard, horseradish sauce' },
  { name: 'Schnitzel & Potato Dumplings', note: '(pork or chicken)', price: '$14.99', desc: 'Sauerkraut, horseradish sauce' },
  { name: 'Soup of the Day', price: '$6.99' },
];

// Platters content (Platters page).
export const platters = [
  {
    heading: 'Cold Cut Platters',
    serves: 'Serve 15–18',
    items: [
      { name: 'Kielbasa Platter', price: '$54.99', desc: 'Variety of smoked kielbasa' },
      { name: 'Cheese Platter', price: '$54.99', desc: 'Variety of cheese' },
      { name: 'Mixed Platter', price: '$54.99', desc: 'Variety of kielbasa, cheese and cold cuts' },
    ],
  },
  {
    heading: 'Bread Tray',
    items: [{ name: 'Bread Tray', price: '$29.99', desc: 'Variety of breads and condiments' }],
  },
  {
    heading: 'Party Trays',
    serves: 'Serve 6',
    items: [
      { name: 'Polish Feast', price: '$84.99', list: ['3 Pork Schnitzels', '3 Stuffed Cabbages', '6 Grilled Kielbasas with Kraut and Onion', '12 Pierogi (potato & cheese)', '1 lb Salad'] },
      { name: 'Grilled Kielbasa & Pierogi', price: '$69.99', list: ['6 Grilled Kielbasas with Kraut and Onion', '24 Pierogi (potato & cheese)', '1 lb Salad'] },
    ],
  },
  {
    heading: 'Cake Platter',
    serves: 'Serves 8–10',
    items: [{ name: 'Polish Cake Platter', price: '$44.99', desc: 'Variety of Polish cakes and cheesecakes' }],
  },
];
