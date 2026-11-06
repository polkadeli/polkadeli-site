// Prints a paid online order on the store's Clover Station, so staff see it without watching email.
//
// How: after Clover approves a Hosted Checkout payment, we look up the Clover order that payment
// belongs to, write the pick-up details into the order's note, and ask Clover to print it
// (Clover prints on the default order printer, or the Station's own printer if there is none).
// If the payment has no order, we create one with the items, marked PAID ONLINE, and print that.
//
// Netlify environment variable (Site configuration > Environment variables):
//   CLOVER_API_TOKEN  Merchant REST API token, made in the Clover dashboard under
//                     Account & Setup > API Tokens, with permissions: Orders (Read and Write)
//                     and Payments (Read). This is NOT the Ecommerce private token.
// Without the token this step is skipped; the order email still goes out.

const money = (c) => `$${(c / 100).toFixed(2)}`;

// The note printed on the ticket: who, when, and that it is already paid.
export const ticketNote = (o) => [
  `ONLINE ORDER - PAID, DO NOT CHARGE`,
  `${o.type === 'platters' ? 'PLATTER' : 'DELI'} PICK-UP ${o.date} at ${o.time}`,
  `${o.customer.name}, ${o.customer.phone}`,
  ...o.lines.map((l) => `${l.qty} x ${l.name}`),
  `Total ${money(o.total)} incl. MD tax`,
  o.notes ? `Notes: ${o.notes}` : '',
].filter(Boolean).join('\n').slice(0, 2000);

export async function printOrder(order, paymentId) {
  const token = process.env.CLOVER_API_TOKEN;
  if (!token) return { skipped: 'no CLOVER_API_TOKEN' };
  const merchant = process.env.CLOVER_MERCHANT_ID || 'XESF2ZXD2SF94';
  const host = process.env.CLOVER_ENV === 'sandbox' ? 'https://apisandbox.dev.clover.com' : 'https://api.clover.com';
  const base = `${host}/v3/merchants/${merchant}`;
  const api = async (path, body) => {
    const res = await fetch(base + path, {
      method: body ? 'POST' : 'GET',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`Clover ${path} ${res.status}: ${text.slice(0, 300)}`);
    return text ? JSON.parse(text) : {};
  };

  const note = ticketNote(order);
  let orderId;

  // 1. The order Clover made for this payment (Hosted Checkout payments normally have one).
  if (paymentId) {
    try {
      const pay = await api(`/payments/${encodeURIComponent(paymentId)}?expand=order`);
      orderId = pay.order?.id;
    } catch (e) {
      console.warn('Clover print: payment lookup failed', e.message);
    }
  }

  if (orderId) {
    await api(`/orders/${orderId}`, { note });
  } else {
    // 2. No order found: create one with the items so the ticket still lists them.
    const created = await api('/orders', { state: 'open', title: `ONLINE PAID - ${order.customer.name}`.slice(0, 127), note });
    orderId = created.id;
    const items = order.lines.flatMap((l) => Array.from({ length: l.qty }, () => ({ name: l.name.slice(0, 127), price: l.price })));
    if (order.tax) items.push({ name: 'MD tax 6% (paid online)', price: order.tax });
    for (let i = 0; i < items.length; i += 50) await api(`/orders/${orderId}/bulk_line_items`, { items: items.slice(i, i + 50) });
  }

  // 3. Print it on the Station.
  const ev = await api('/print_event', { orderRef: { id: orderId } });
  return { orderId, printEvent: ev.id, state: ev.state };
}
