import { Cashfree, CFEnvironment } from "cashfree-pg";

function readEnv(name) {
  return process.env[name] || process.env[`VITE_${name}`];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const env = (readEnv("CASHFREE_ENV") || "SANDBOX").trim().toUpperCase();
    const clientId = readEnv("CASHFREE_CLIENT_ID")?.trim();
    const clientSecret = readEnv("CASHFREE_CLIENT_SECRET")?.trim();

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: "Missing Cashfree credentials",
        detail:
          "Set CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET (or VITE_ variants) in deployment env.",
      });
    }

    Cashfree.XClientId = clientId;
    Cashfree.XClientSecret = clientSecret;
    Cashfree.XEnvironment =
      env === "PRODUCTION" ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;

    const { orderId, orderAmount, customer } = req.body || {};

    if (!orderAmount || !customer?.customer_email || !customer?.customer_phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const baseReturnUrl = (readEnv("CASHFREE_RETURN_URL") || "")
      .trim()
      .replace(/\/$/, "");

    if (!baseReturnUrl) {
      return res.status(500).json({
        error: "Missing CASHFREE_RETURN_URL",
      });
    }

    if (env === "PRODUCTION" && !baseReturnUrl.startsWith("https://")) {
      return res.status(400).json({
        error: "Production requires an HTTPS return URL",
        detail:
          "Set CASHFREE_RETURN_URL to your live https URL (or use HTTPS tunnel).",
      });
    }

    const returnUrl = `${baseReturnUrl}/?payment=return&order_id=${encodeURIComponent(orderId)}`;
    const apiVersion = readEnv("CASHFREE_API_VERSION") || "2022-09-01";

    const request = {
      order_id: String(orderId),
      order_amount: Number(orderAmount),
      order_currency: "INR",
      customer_details: {
        customer_id: customer.customer_id || `user_${Date.now()}`,
        customer_name: customer.customer_name || "Customer",
        customer_email: customer.customer_email,
        customer_phone:
          String(customer.customer_phone).replace(/\D/g, "").slice(-10) ||
          "9999999999",
      },
      order_meta: {
        return_url: returnUrl,
      },
    };

    const response = await Cashfree.PGCreateOrder(apiVersion, request);
    if (response.status !== 200) {
      return res.status(500).json({
        error: "Failed to create order with Cashfree",
        detail: response.data || null,
      });
    }

    const paymentSessionId = response.data?.payment_session_id;
    if (!paymentSessionId) {
      return res.status(500).json({ error: "Invalid response from Cashfree" });
    }

    return res.status(200).json({
      paymentSessionId,
      orderId: response.data.order_id,
    });
  } catch (err) {
    console.error("Error in /api/cashfree/create-session", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

