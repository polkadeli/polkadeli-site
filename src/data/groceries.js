// Shop ("Groceries") list. Each category is a column block; `note` adds a grey sub-line.
// Add or remove items here and the Shop page updates.

export const columns = [
  [
    { title: 'Kielbasa', items: ['Wedding', 'Traditional', 'Hunters', 'Original', 'Juniper', 'Cherrywood', 'Kabanosy', 'Fresh kielbasa', 'Cracow dry Kielbasa', 'Zywiecka Kielbasa', 'Ring Kielbasa', 'Homemade'] },
    { title: 'Cheese', items: ['Morski', 'Podlaski', 'Lubelski', 'Krolewicz', 'Gouda', 'Rycki Edam', 'Provolone', 'Krolewski', 'Krolewski smoked', 'Pepper Jack', 'Radamer Hard'] },
  ],
  [
    { title: 'Deli Meats', items: ['Kiszka', 'Chicken Wieners', 'Veal Wieners', 'Pork Wieners', 'Pork/Veal Wieners', 'Tyrolian Ham', 'Gypsy Ham', 'Traditional Ham', 'Polish Ham', 'Mortadella', 'Pork Butt', 'Stuffed Bacon', 'Canadian Bacon', 'Cold Smoked Pork Loin', 'Homemade Pork Loin', 'Smoked Liver Sausage', 'Liver Sausage', 'Homemade Pate', 'Country Headcheese', 'Pork Blood Tongue', 'Pork Tongue', 'Chicken Headcheese', 'Danish Bacon', 'Spyrka', 'Smoked Turkey', 'Picante salami', 'Hungarian Salami', 'Old Forest Salami', 'Hunter Bacon', 'Smoked Ribs', 'Hot Smoked Mackerel', 'Meatloaf', 'Bacon Roll'] },
  ],
  [
    { title: 'Pierogi', tag: '(Frozen)', items: ['Meat', 'Sauerkraut', 'Sauerkraut & Mushroom', 'Sauerkraut & Potato with Bacon', 'Beef', 'Potato & Cheese', 'Potato & Cheddar', 'Potato & Sauerkraut', 'Potato & Mushroom', 'Potato', 'Sweet Cheese', 'Fruit', 'Mushroom', 'Silesian Dumplings (Kluski Slaskie)', 'Potato Dumplings (Kopytka)', 'Potato Pyzy', 'Meat Pyzy'] },
    { title: 'Blintzes', tag: '(Frozen)', items: ['Peach', 'Apple', 'Cherry Cheese', 'Strawberry Cheese', 'Sweet cheese'] },
    { title: 'Marinated Goods', items: ['Pickles', 'Sauerkraut', 'Red Cabbage', 'Cucumbers in Brine', 'Sweet Red Pepper', "Hunter's Stew (Bigos)", 'Horseradish', 'Beets w/ horseradish'] },
  ],
  [
    { title: 'Sweets', items: [
      { name: 'Ptasie Mleczko', note: '(Chocolate covered marshmallow)' },
      { name: 'Jaffa Cakes', note: '(Delicje) (Orange, Raspberry, Cherry)' },
      { name: 'Prince Polo', note: '(Chocolate covered wafers)' },
      { name: 'Milka Chocolate', note: '(Assorted flavors)' },
      { name: 'Wedel Chocolate', note: '(Assorted flavors)' },
      'Torcik Wedlowski', 'Chocolate Covered Plum',
      { name: 'Krowki', note: '(Caramel candy)' },
      'Gingerbread in chocolate',
    ] },
    { title: 'Baked Goods', items: ['Chrusciki', 'Paczki', 'Sweet Bun', 'Napoleon', 'Apple Cherry Cake', 'Apple Cake', 'Poppyseed Roll', 'Poppyseed Cheesecake'] },
  ],
];

export const photos = [
  { src: '/images/shop/cold-cuts.jpg', alt: 'Polish hams and cold cuts on a wooden board' },
  { src: '/images/shop/headcheese.jpg', alt: 'Sliced headcheese and pates' },
  { src: '/images/shop/sausages-kiszka.jpg', alt: 'Ring sausage, kiszka and smoked ribs' },
  { src: '/images/shop/sweets.jpg', alt: 'Ptasie Mleczko and other Polish sweets' },
  { src: '/images/shop/jars.jpg', alt: 'Jars of pickled vegetables and sauerkraut' },
  { src: '/images/shop/fresh-sausage.jpg', alt: 'Coil of fresh white kielbasa' },
  { src: '/images/shop/groceries.jpg', alt: 'Polish pantry groceries: barszcz, spices and jars' },
  { src: '/images/shop/kabanosy.jpg', alt: 'Kabanosy sausage sticks' },
];
