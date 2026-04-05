import { Cashfree, CFEnvironment } from "cashfree-pg";

function readEnv(name) {
  return process.env[name] || process.env[`VITE_${name}`];
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const orderId = req.query?.order_id;
  if (!orderId) {
    return res.status(400).json({ error: "Missing order_id" });
  }

  try {
    const env = (readEnv("CASHFREE_ENV") || "SANDBOX").trim().toUpperCase();
    const clientId = readEnv("CASHFREE_CLIENT_ID")?.trim();
    const clientSecret = readEnv("CASHFREE_CLIENT_SECRET")?.trim();
    const apiVersion = readEnv("CASHFREE_API_VERSION") || "2022-09-01";

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: "Missing Cashfree credentials",
      });
    }

    Cashfree.XClientId = clientId;
    Cashfree.XClientSecret = clientSecret;
    Cashfree.XEnvironment =
      env === "PRODUCTION" ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;

    const orderResp = await Cashfree.PGFetchOrder(apiVersion, String(orderId));
    const orderStatus = orderResp?.data?.order_status || null;

    let paymentStatus = null;
    let cfPaymentId = null;
    try {
      const paymentsResp = await Cashfree.PGOrderFetchPayments(
        apiVersion,
        String(orderId),
      );
      const latestPayment = Array.isArray(paymentsResp?.data)
        ? paymentsResp.data[paymentsResp.data.length - 1]
        : null;
      paymentStatus = latestPayment?.payment_status || null;
      cfPaymentId = latestPayment?.cf_payment_id || null;
    } catch (paymentsErr) {
      console.warn("Could not fetch order payments", paymentsErr?.message);
    }

    const paid = orderStatus === "PAID" || paymentStatus === "SUCCESS";

    return res.status(200).json({
      orderId: String(orderId),
      paid,
      orderStatus,
      paymentStatus,
      cfPaymentId,
    });
  } catch (err) {
    console.error("Error in /api/cashfree/verify-order", err);
    return res.status(500).json({ error: "Failed to verify order" });
  }
}

