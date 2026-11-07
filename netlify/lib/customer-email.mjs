// The order confirmation email the customer gets after paying (English only, KK 2026-11-07).
// Plain tables and inline styles, because email apps ignore most CSS. Web fonts load in
// Apple Mail and iOS; Gmail and Outlook fall back to Georgia and Helvetica.
import { stores } from '../../src/data/site.js';

const ss = stores[0];
const RED = '#c82023';
const RED_HEADING = '#8b0000';
const INK = '#111111';
const MUTED = '#666666';
const SERIF = "Lora, Georgia, 'Times New Roman', serif";
const SANS = "Mulish, 'Helvetica Neue', Helvetica, Arial, sans-serif";

const money = (c) => `$${(c / 100).toFixed(2)}`;
// Keep the last two words of a line together, so no word is left alone on a line.
const noWidow = (s) => s.replace(/ (\S+)$/, '\u00a0$1');
// Item names like "Pierogi (12), Potato & cheese": each comma part stays on one line.
const itemName = (s) => s.split(', ').map((p) => `<span style="white-space:nowrap;">${esc(p)}</span>`).join(', ');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);

// "2026-11-07" + "12:30" -> "Saturday, November 7 at 12:30 pm"
export const pickupText = (date, time) => {
  const day = new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
  const [h, m] = time.split(':').map(Number);
  return `${day}\u00a0at\u00a0${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
};

export function customerEmail(order, site) {
  const first = esc(order.customer.name.split(/\s+/)[0]);
  const when = pickupText(order.date, order.time);
  const row = (left, right, style = '') => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font:16px/1.4 ${SANS};color:${INK};${style}">${left}</td>
      <td align="right" style="padding:10px 0 10px 16px;border-bottom:1px solid #e5e5e5;font:16px/1.4 ${SANS};color:${INK};white-space:nowrap;${style}">${right}</td>
    </tr>`;
  const items = order.lines.map((l) => row(`${l.qty}&nbsp;×&nbsp;${itemName(l.name)}`, money(l.qty * l.price))).join('');

  const subject = `Your Polka Deli order for ${when.replace(' ', ' ')}`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><title>${esc(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@500;600&family=Mulish:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#f4f4f4;">
<div style="display:none;max-height:0;overflow:hidden;">Paid and ready for pick-up in Silver Spring, ${esc(when)}.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-top:4px solid ${RED};">
  <tr><td align="center" style="padding:28px 24px 8px;">
    <a href="${site}/"><img src="${site}/images/email-logo.png" width="180" alt="Polka Deli" style="display:block;border:0;width:180px;height:auto;"></a>
  </td></tr>
  <tr><td align="center" style="padding:16px 32px 0;">
    <h1 style="margin:0;font:600 28px/1.25 ${SERIF};color:${INK};">Thank you, ${first}!</h1>
    <p style="margin:12px 0 0;font:17px/1.55 ${SANS};color:#444;">Your order is paid. We'll have it ready for pick-up at our Silver Spring store.</p>
  </td></tr>
  <tr><td style="padding:24px 32px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;">
      <tr><td align="center" style="padding:20px 16px;">
        <div style="font:700 13px/1.4 ${SANS};color:${RED};text-transform:uppercase;letter-spacing:0;">Pick-up</div>
        <div style="margin-top:6px;font:600 21px/1.35 ${SERIF};color:${RED_HEADING};">${esc(when).replace(/\u00a0at\u00a0/, '<br>')}</div>
        <div style="margin-top:10px;font:16px/1.5 ${SANS};color:#444;">${esc(ss.street)}<br>${esc(ss.locality)}</div>
        <div style="margin-top:10px;font:700 16px/1.5 ${SANS};"><a href="${ss.maps}" style="color:${RED};">Get directions</a></div>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:28px 32px 0;">
    <h2 style="margin:0 0 4px;font:600 20px/1.3 ${SERIF};color:${INK};">${order.type === 'platters' ? 'Your platter order' : 'Your order'}</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${items}
      ${row('Subtotal', money(order.subtotal), `color:${MUTED};`)}
      ${row('MD sales tax 6%', money(order.tax), `color:${MUTED};`)}
      ${row('<strong>Total paid</strong>', `<strong>${money(order.total)}</strong>`, 'border-bottom:0;')}
    </table>
    ${order.notes ? `<p style="margin:12px 0 0;font:15px/1.5 ${SANS};color:${MUTED};"><strong style="color:${INK};">Your note:</strong> ${esc(order.notes)}</p>` : ''}
  </td></tr>
  <tr><td align="center" style="padding:28px 32px 32px;">
    <p style="margin:0;font:16px/1.55 ${SANS};color:#444;">Questions about your order?<br>Call us at <a href="${ss.phoneHref}" style="color:${INK};font-weight:700;">${ss.phone}</a></p>
  </td></tr>
</table>
<p style="margin:16px 0 0;font:13px/1.5 ${SANS};color:${MUTED};">Polka Deli, Polish food &amp; market · <a href="${site}/" style="color:${MUTED};">polkadelimd.com</a></p>
</td></tr></table>
</body></html>`;

  const text = [
    `Thank you, ${order.customer.name.split(/\s+/)[0]}!`,
    'Your order is paid. We\'ll have it ready for pick-up at our Silver Spring store.',
    '',
    `Pick-up: ${when.replace(' ', ' ')}`,
    `${ss.street}, ${ss.locality}`,
    `Directions: ${ss.maps}`,
    '',
    ...order.lines.map((l) => `${l.qty} x ${l.name}: ${money(l.qty * l.price)}`),
    `Subtotal: ${money(order.subtotal)}`,
    `MD sales tax 6%: ${money(order.tax)}`,
    `Total paid: ${money(order.total)}`,
    order.notes ? `\nYour note: ${order.notes}` : '',
    '',
    `Questions about your order? Call us at ${ss.phone}.`,
  ].join('\n');

  return { subject, html, text };
}
