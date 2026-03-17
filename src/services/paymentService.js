import { load } from "@cashfreepayments/cashfree-js";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

let cashfree;
const initCashfree = async () => {
  if (cashfree) return cashfree;
  cashfree = await load({
    mode: import.meta.env.VITE_CASHFREE_ENV || "production",
  });
  return cashfree;
};

// Create Order in Firestore
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      status: "PENDING",
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// Update Order Status
export const updateOrderStatus = async (
  orderId,
  status,
  paymentDetails = {},
) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status,
      ...paymentDetails,
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

// Initiate Payment — live Cashfree checkout
export const initiatePayment = async (orderId, amount, customerDetails) => {
  const sdk = await initCashfree();
  const numericAmount =
    typeof amount === "number"
      ? amount
      : Number(String(amount).replace(/[^\d.]/g, "")) || 0;

  const res = await fetch("/api/cashfree/create-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId,
      orderAmount: numericAmount,
      customer: {
        customer_id: customerDetails?.uid || `user_${Date.now()}`,
        customer_name: customerDetails?.fullName || "Customer",
        customer_email: customerDetails?.email || "",
        customer_phone: customerDetails?.phone || "9999999999",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Payment session failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  const paymentSessionId = data.paymentSessionId;
  if (!paymentSessionId)
    throw new Error("Missing paymentSessionId from server");

  return sdk.checkout({ paymentSessionId, redirectTarget: "_self" });
};
