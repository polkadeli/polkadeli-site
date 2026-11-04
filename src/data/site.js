// Business details used across the site. Edit here, and every page updates.
export const business = {
  name: 'Polka Deli',
  tagline: 'Authentic Polish groceries and food prepared daily',
  email: 'polkadelistore@gmail.com',
  facebook: 'https://www.facebook.com/PolkaDeliMD/',
  instagram: 'https://www.instagram.com/polkadelimd',
  uberEats: 'https://www.ubereats.com/washington-dc/food-delivery/polka-deli/uOT7qknHTkWl-ivMgRA6TQ',
};

export const stores = [
  {
    city: 'Silver Spring',
    street: '13438 New Hampshire Avenue',
    locality: 'Silver Spring, MD 20904',
    phone: '301-384-3354',
    phoneHref: 'tel:+13013843354',
    maps: 'https://www.google.com/maps/search/?api=1&query=13438+New+Hampshire+Ave+Silver+Spring+MD+20904',
    hours: [['Mon–Fri', '11:00 am – 6:30 pm'], ['Saturday', '10:00 am – 6:00 pm'], ['Sunday', '11:00 am – 3:00 pm']],
  },
  {
    city: 'Vienna',
    street: '431 Maple Ave W',
    locality: 'Vienna, VA 22180',
    phone: '703-261-6385',
    phoneHref: 'tel:+17032616385',
    maps: 'https://www.google.com/maps/search/?api=1&query=431+Maple+Ave+W+Vienna+VA+22180',
    hours: [['Mon–Fri', '10:00 am – 6:00 pm'], ['Saturday', '10:00 am – 5:00 pm'], ['Sunday', '11:00 am – 2:00 pm']],
  },
];

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/deli-menu', label: 'Deli Menu' },
  { href: '/platters', label: 'Platters' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/find-us', label: 'Visit us' },
];
