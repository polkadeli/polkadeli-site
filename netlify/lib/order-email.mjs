// Sends an order to the store's inbox through Netlify Forms (form "pickup-order",
// declared in src/pages/[...lang]/order.astro). Netlify emails each submission to the
// address set under Forms > Form notifications.
const money = (c) => `$${(c / 100).toFixed(2)}`;

export const formatOrder = (o) => [
  `${o.type === 'platters' ? 'PLATTER ORDER' : 'DELI ORDER'}: pick-up ${o.date} at ${o.time}, Silver Spring`,
  `${o.customer.name}, ${o.customer.phone}, ${o.customer.email}`,
  '',
  ...o.lines.map((l) => `${l.qty} x ${l.name}: ${money(l.qty * l.price)}`),
  '',
  `Subtotal ${money(o.subtotal)} + MD tax ${money(o.tax)} = ${money(o.total)}`,
  o.notes ? `Notes: ${o.notes}` : '',
].join('\n').trim();

export async function sendOrderEmail(site, order, status) {
  const fields = {
    'form-name': 'pickup-order',
    status,
    pickup: `${order.date} ${order.time}`,
    'order-type': order.type === 'platters' ? 'Platter order' : 'Deli order',
    name: order.customer.name,
    phone: order.customer.phone,
    email: order.customer.email,
    order: formatOrder(order),
    total: money(order.total),
  };
  const res = await fetch(`${site}/`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields).toString(),
  });
  if (!res.ok) console.error('Order email failed', res.status);
  return res.ok;
}
