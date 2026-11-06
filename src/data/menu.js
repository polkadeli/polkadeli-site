// Deli Menu content. Edit prices and items here; the page updates automatically.

export const pierogi = {
  prices: [
    ['12 pieces', '$14.99'],
    ['6 pieces', '$7.99'],
  ],
  fillings: ['Potato & Cheese', 'Meat & Kraut', 'Kraut & Mushroom', 'Mix Pierogi'],
  servedWith: 'Served with onions and sour cream',
  // Optional extras ticked on the order page; the price is added to each order of pierogi
  extras: [{ name: 'Fried', price: '$1.00' }],
};

export const sandwiches = {
  price: '$10.99',
  items: [
    { name: 'Smoked Kielbasa', desc: 'Sub roll, kraut, grilled onions, mustard, horseradish sauce', removable: ['Kraut', 'Grilled onions', 'Mustard', 'Horseradish sauce'] },
    { name: 'BLT', desc: 'Sub roll, bacon, lettuce, tomato', removable: ['Lettuce', 'Tomato'] },
    { name: 'Kielbasa Reuben', desc: 'Rye bread, cheese, kraut, Russian dressing', removable: ['Cheese', 'Kraut', 'Russian dressing'] },
    { name: 'Pork Schnitzel', desc: 'Sub roll, lettuce, tomato, horseradish sauce', removable: ['Lettuce', 'Tomato', 'Horseradish sauce'] },
    { name: 'Ham or Turkey & Cheese', choices: ['Ham', 'Turkey'], desc: 'Sub roll, lettuce, tomato, mayo, mustard', removable: ['Lettuce', 'Tomato', 'Mayo', 'Mustard'] },
  ],
  side: ['Add a side of Polish potato salad', '$1'],
};

// Optional paid side ticked on the order page, offered with every entree
const saladSide = [{ name: 'Side of potato salad', price: '$1.00' }];

export const entrees = [
  { name: 'Sweet Cheese Crepes', price: '$10.99', extras: saladSide, desc: '3 crepes served with fruit jam and sour cream', removable: ['Fruit jam', 'Sour cream'] },
  { name: 'Stuffed Cabbage & Roasted Potatoes', price: '$11.99', extras: saladSide, desc: 'Topped with tomato sauce', removable: ['Tomato sauce'] },
  { name: 'Kielbasa w/ Rye Bread & Potato Salad', extras: saladSide, note: '(fresh or smoked)', choices: ['Fresh', 'Smoked'], price: '$11.99', desc: 'Kraut, grilled onions, mustard, horseradish sauce', removable: ['Kraut', 'Grilled onions', 'Mustard', 'Horseradish sauce'] },
  { name: 'Kielbasa & 4 Pierogi', price: '$14.99', extras: saladSide, desc: 'Kraut, grilled onions, mustard, horseradish sauce', removable: ['Kraut', 'Grilled onions', 'Mustard', 'Horseradish sauce'] },
  { name: 'Polish Food Sampler', price: '$14.99', extras: saladSide, desc: 'Fresh & smoked kielbasa, 4 pierogi, kraut, grilled onions, mustard, horseradish sauce', removable: ['Kraut', 'Grilled onions', 'Mustard', 'Horseradish sauce'] },
  { name: 'Pork Schnitzel & Potato Dumplings', price: '$14.99', extras: saladSide, desc: 'Sauerkraut, horseradish sauce', removable: ['Sauerkraut', 'Horseradish sauce'] },
  { name: 'Soup of the Day', price: '$6.99', extras: saladSide, desc: 'One of four in rotation: sour rye, borscht, split pea or pickle soup' },
];

// Platters content (Platters page).
export const platters = [
  {
    heading: 'Cold Cut Platters',
    serves: 'Serves 15–18',
    items: [
      { name: 'Kielbasa Platter', price: '$54.99', desc: 'Variety of smoked kielbasa' },
      { name: 'Cheese Platter', price: '$54.99', desc: 'Variety of cheese' },
      { name: 'Mixed Platter', price: '$54.99', desc: 'Variety of kielbasa, cheese and cold cuts' },
    ],
  },
  {
    heading: 'Bread',
    items: [{ name: 'Bread Tray', price: '$29.99' }],
  },
  {
    heading: 'Party Trays',
    serves: 'Serves 6',
    items: [
      { name: 'Polish Feast', price: '$84.99', list: ['3 pork schnitzels', '3 stuffed cabbages', '6 grilled kielbasas with kraut and onion', '12 Pierogi (potato & cheese)', '1 lb salad'] },
      { name: 'Grilled Kielbasa & Pierogi', price: '$69.99', list: ['6 grilled kielbasas with kraut and onion', '24 Pierogi (potato & cheese)', '1 lb salad'] },
    ],
  },
  {
    heading: 'Cake Platter',
    serves: 'Serves 8–10',
    items: [{ name: 'Polish Cake Platter', price: '$44.99', desc: 'Assortment of Polish baked goods' }],
  },
];
