// Push notification to the Silver Spring store iPhone when an online order is paid.
// Main: Pushover app (PUSHOVER_TOKEN = the app's API token, PUSHOVER_USER = the user key).
// Fallback: free ntfy app (NTFY_TOPIC). Keys live in Netlify env vars, never in this public repo.
const money = (c) => `$${(c / 100).toFixed(2)}`;

function message(order) {
  const kind = order.type === 'platters' ? 'platter' : 'pick-up';
  const title = `New ${kind} order${order.number ? ` #${order.number}` : ''}`;
  const lines = (order.lines || []).map((l) => `${l.qty} x ${l.name}`);
  const body = [
    `Pick-up ${order.date} at ${order.time}`,
    `${order.customer?.name ?? ''}, paid ${money(order.total)}`,
    '',
    ...lines,
    order.notes ? `Notes: ${order.notes}` : '',
  ].join('\n').trim();
  return { title, body };
}

async function pushover(token, user, { title, body }) {
  const res = await fetch('https://api.pushover.net/1/messages.json', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      token, user, title, message: body,
      priority: '1',             // high: always makes a sound, even outside quiet hours
      sound: process.env.PUSHOVER_SOUND || 'cashregister',
    }),
  });
  return res.ok ? 'sent (Pushover)' : `failed (Pushover): ${res.status} ${await res.text().catch(() => '')}`;
}

async function ntfy(topic, { title, body }) {
  const res = await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
    method: 'POST',
    headers: { Title: title, Priority: 'high', Tags: 'bell' },
    body,
  });
  return res.ok ? 'sent (ntfy)' : `failed (ntfy): ${res.status}`;
}

export async function sendStoreAlert(order) {
  const msg = message(order);
  const token = (process.env.PUSHOVER_TOKEN || '').trim();
  const user = (process.env.PUSHOVER_USER || '').trim();
  const topic = (process.env.NTFY_TOPIC || '').trim();
  const results = [];
  if (token && user) results.push(await pushover(token, user, msg));
  if (topic) results.push(await ntfy(topic, msg));
  return results.length ? results.join('; ') : 'skipped: no PUSHOVER_TOKEN/PUSHOVER_USER or NTFY_TOPIC set';
}

// Used by GET /api/clover-webhook?test-alert to check the phone gets notifications.
export const sendTestAlert = () => sendStoreAlert({
  type: 'deli', date: 'today', time: 'now', total: 0,
  customer: { name: 'Test from the website' },
  lines: [{ qty: 1, name: 'If you can read this, order alerts work' }],
});
