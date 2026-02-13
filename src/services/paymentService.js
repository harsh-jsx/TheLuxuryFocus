import { load } from '@cashfreepayments/cashfree-js';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

// Initialize Cashfree
let cashfree;
const initCashfree = async () => {
    cashfree = await load({
        mode: "sandbox" // or "production"
    });
};
initCashfree();

// Create Order in Firestore
export const createOrder = async (orderData) => {
    try {
        const docRef = await addDoc(collection(db, "orders"), {
            ...orderData,
            status: "PENDING",
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

// Update Order Status
export const updateOrderStatus = async (orderId, status, paymentDetails = {}) => {
    try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
            status,
            ...paymentDetails,
            updatedAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Error updating document: ", e);
        throw e;
    }
};

// Initiate Payment (Mock Session for now)
export const initiatePayment = async (orderId, amount, customerDetails) => {
    try {
        // REAL IMPLEMENTATION NEEDS BACKEND TO GENERATE SESSION ID
        // const response = await fetch('/api/create-payment-session', { ... });
        // const { payment_session_id } = await response.json();

        // MOCK SESSION ID GENERATION
        // This will fail in actual Cashfree SDK without a valid session ID from their server
        // But we setup the structure.
        const paymentSessionId = "session_" + orderId;

        const checkoutOptions = {
            paymentSessionId,
            redirectTarget: "_self", // or "_blank", "_top"
        };

        // return cashfree.checkout(checkoutOptions);

        console.log("Mock Payment Initiated for Order:", orderId);
        console.log("Customer:", customerDetails);
        console.log("Amount:", amount);

        // For demonstration, let's simulate a success after a delay
        return new Promise((resolve) => {
            setTimeout(() => {
                alert("Payment Mock: Success!");
                resolve({ paymentId: "pay_" + Date.now() });
            }, 2000);
        });

    } catch (err) {
        console.error(err);
        throw err;
    }
};
