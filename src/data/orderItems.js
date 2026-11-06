// Items that can be ordered online for pickup, built from src/data/menu.js.
// Used by the order page (to show them) and by the checkout function (to check prices),
// so a customer can never change a price in their browser.
import { pierogi, sandwiches, entrees, platters } from './menu.js';

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const cents = (price) => Math.round(parseFloat(String(price).replace('$', '')) * 100);

// group: 'pierogi' | 'sandwiches' | 'entrees' | 'platters'; type: 'deli' | 'platters'
export const orderItems = [
  ...pierogi.prices.map(([size, price]) => ({ key: `pierogi-${slug(size)}`, group: 'pierogi', type: 'deli', name: `Pierogi, ${size}`, size, price, choices: pierogi.fillings })),
  ...sandwiches.items.map((i) => ({ key: `sandwich-${slug(i.name)}`, group: 'sandwiches', type: 'deli', name: i.name, price: sandwiches.price, desc: i.desc })),
  ...entrees.map((i) => ({ key: `entree-${slug(i.name)}`, group: 'entrees', type: 'deli', name: i.choices ? i.name : `${i.name}${i.note ? ` ${i.note}` : ''}`, base: i.name, note: i.choices ? undefined : i.note, choices: i.choices, price: i.price, desc: i.desc })),
  ...platters.flatMap((g) => g.items.map((i) => ({ key: `platter-${slug(i.name)}`, group: 'platters', type: 'platters', name: i.name, price: i.price, serves: g.serves, heading: g.heading, desc: i.desc, list: i.list }))),
];

export const fillings = pierogi.fillings;
export const pierogiNote = pierogi.servedWith;
export const platterHeadings = platters.map((g) => ({ heading: g.heading, serves: g.serves }));
export const TAX_MD = 0.06; // Maryland sales tax; all online orders are picked up in Silver Spring, MD
