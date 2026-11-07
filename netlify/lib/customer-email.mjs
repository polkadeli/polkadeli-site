// Order confirmation email for the customer (English only, per KK). Plain tables and inline
// styles so it looks right in Gmail, Apple Mail and Outlook.
const money = (c) => `$${(c / 100).toFixed(2)}`;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const RED = '#c82023';
const DARK_RED = '#8b0000';
const GREY = '#5e5e5e';
const SERIF = "Lora, Georgia, 'Times New Roman', serif";
const SANS = "Mulish, 'Helvetica Neue', Arial, sans-serif";

// "2026-11-08" + "11:30" -> "Saturday, November 8 at 11:30 am"
export const pickupLabel = (date, time) => {
  const [y, m, d] = date.split('-').map(Number);
  const day = new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
  const [h, mm] = time.split(':').map(Number);
  return `${day} at ${h % 12 || 12}:${String(mm).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
};

export function customerEmail(order, site) {
  const firstName = order.customer.name.split(/\s+/)[0];
  const when = pickupLabel(order.date, order.time);
  const cell = `font:16px/1.4 ${SANS};color:#1f1f1f;padding:10px 0;border-bottom:1px solid #e6e6e6`;
  const rows = order.lines.map((l) => `
            <tr>
              <td style="${cell}">${l.qty} &times; ${esc(l.name)}</td>
              <td style="${cell};text-align:right;white-space:nowrap">${money(l.qty * l.price)}</td>
            </tr>`).join('');
  const label = (t) => `<p style="margin:0 0 6px;font:700 13px/1.3 ${SANS};color:${RED};text-transform:uppercase">${t}</p>`;
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your Polka Deli order</title></head>
<body style="margin:0;padding:0;background:#f4f4f4">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4">
    <tr><td align="center" style="padding:24px 12px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff">
        <tr><td align="center" style="padding:26px 24px 22px">
          <img src="${site}/images/logo-email.png" width="200" alt="Polka Deli · Polish Food &amp; Market" style="display:block;border:0;width:200px;height:auto">
        </td></tr>
        <tr><td style="padding:0"><img src="${site}/images/email-banner.jpg" width="600" alt="" style="display:block;width:100%;height:auto;border:0"></td></tr>
        <tr><td align="center" style="padding:32px 28px 4px">
          <h1 style="margin:0 0 10px;font:500 30px/1.2 ${SERIF};color:#1f1f1f">Thank you, ${esc(firstName)}!</h1>
          <p style="margin:0;font:17px/1.6 ${SANS};color:${GREY}">Your order is paid and we'll have it ready for you.</p>
        </td></tr>
        <tr><td style="padding:24px 28px 4px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4">
            <tr><td align="center" style="padding:22px 20px">
              ${label('Pick-up')}
              <p style="margin:0 0 8px;font:500 22px/1.3 ${SERIF};color:${DARK_RED}">${when}</p>
              <p style="margin:0 0 10px;font:16px/1.5 ${SANS};color:${GREY}">Polka Deli Silver Spring<br>13438 New Hampshire Ave, Silver Spring, MD 20904</p>
              <a href="https://www.google.com/maps/search/?api=1&amp;query=13438+New+Hampshire+Ave+Silver+Spring+MD+20904" style="font:700 15px ${SANS};color:${RED}">Get directions</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:22px 28px 4px">
          ${label('Your order')}
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
            <tr><td style="padding:12px 0 2px;font:15px ${SANS};color:${GREY}">Subtotal</td><td style="padding:12px 0 2px;font:15px ${SANS};color:${GREY};text-align:right">${money(order.subtotal)}</td></tr>
            <tr><td style="padding:2px 0;font:15px ${SANS};color:${GREY}">MD sales tax</td><td style="padding:2px 0;font:15px ${SANS};color:${GREY};text-align:right">${money(order.tax)}</td></tr>
            <tr><td style="padding:8px 0 0;font:700 18px ${SANS};color:#1f1f1f">Total paid</td><td style="padding:8px 0 0;font:700 18px ${SANS};color:#1f1f1f;text-align:right">${money(order.total)}</td></tr>
          </table>
          ${order.notes ? `<p style="margin:16px 0 0;font:15px/1.5 ${SANS};color:${GREY}"><strong style="color:#1f1f1f">Your note:</strong> ${esc(order.notes)}</p>` : ''}
        </td></tr>
        <tr><td align="center" style="padding:28px 28px 32px">
          <p style="margin:0 0 4px;font:15px/1.5 ${SANS};color:${GREY}">Questions or changes? Call us at</p>
          <a href="tel:+13013843354" style="font:700 18px ${SANS};color:#1f1f1f;text-decoration:none">301-384-3354</a>
        </td></tr>
        <tr><td align="center" style="padding:18px 24px;background:#1f1f1f">
          <p style="margin:0;font:13px/1.6 ${SANS};color:#bdbdbd">Polka Deli · Polish Food &amp; Market<br>
          <a href="${site}" style="color:#ff8a8c">polkadelimd.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
  const text = [
    `Thank you, ${firstName}! Your order is paid.`,
    '',
    `Pick-up: ${when}`,
    'Polka Deli Silver Spring, 13438 New Hampshire Ave, Silver Spring, MD 20904',
    '',
    ...order.lines.map((l) => `${l.qty} x ${l.name}: ${money(l.qty * l.price)}`),
    '',
    `Subtotal ${money(order.subtotal)}, MD sales tax ${money(order.tax)}, total paid ${money(order.total)}`,
    order.notes ? `Your note: ${order.notes}` : '',
    '',
    'Questions or changes? Call us at 301-384-3354.',
  ].join('\n');
  return { subject: `Your Polka Deli order: pick-up ${when}`, html, text };
}
