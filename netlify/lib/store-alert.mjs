// Push notification to the Silver Spring store iPhone through the free ntfy app (ntfy.sh).
// Staff subscribe to the topic in the app; the topic name is the only key, so it lives in the
// NTFY_TOPIC environment variable in Netlify (never in this public repo).
const money = (c) => `$${(c / 100).toFixed(2)}`;

export async function sendStoreAlert(order) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return 'skipped: NTFY_TOPIC not set';
  const kind = order.type === 'platters' ? 'platter' : 'pick-up';
  const lines = (order.lines || []).map((l) => `${l.qty} x ${l.name}`);
  const body = [
    `Pick-up ${order.date} at ${order.time}`,
    `${order.customer?.name ?? ''}, paid ${money(order.total)}`,
    '',
    ...lines,
    order.notes ? `Notes: ${order.notes}` : '',
  ].join('\n').trim();
  const res = await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
    method: 'POST',
    headers: { Title: `New ${kind} order${order.number ? ` #${order.number}` : ''}`, Priority: 'high', Tags: 'bell' },
    body,
  });
  return res.ok ? 'sent' : `failed: ${res.status}`;
}

// Used by GET /api/clover-webhook?test-alert to check the phone gets notifications.
export const sendTestAlert = () => sendStoreAlert({
  type: 'deli', date: 'today', time: 'now', total: 0,
  customer: { name: 'Test from the website' },
  lines: [{ qty: 1, name: 'If you can read this, order alerts work' }],
});
