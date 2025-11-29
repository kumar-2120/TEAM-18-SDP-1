const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors({ origin: [/^http:\/\/localhost:\d+$/], credentials: false }));
app.use(express.json());

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;
if (!key_id || !key_secret) {
  console.warn('\n[WARN] RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET not set. Payment endpoints will return 400.');
}

const rzp = key_id && key_secret ? new Razorpay({ key_id, key_secret }) : null;

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/create-order', async (req, res) => {
  try {
    if (!rzp) return res.status(400).json({ error: 'Razorpay keys not configured' });
    const { amount } = req.body || {};
    const rupees = Number(amount) || 0;
    if (rupees <= 0) return res.status(400).json({ error: 'Invalid amount' });
    const options = {
      amount: Math.max(100, Math.round(rupees * 100)), // in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };
    const order = await rzp.orders.create(options);
    return res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (e) {
    console.error('create-order error:', e);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!key_secret) return res.status(400).json({ valid: false, error: 'Missing secret' });
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ valid: false, error: 'Missing parameters' });
    }
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = hmac.digest('hex');
    const valid = digest === razorpay_signature;
    return res.json({ valid });
  } catch (e) {
    console.error('verify error:', e);
    return res.status(500).json({ valid: false });
  }
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
