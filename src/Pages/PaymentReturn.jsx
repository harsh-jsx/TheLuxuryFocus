import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useSelectedPackageOptionStore } from "../stores/packageStore";

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const setSelectedPackageOption = useSelectedPackageOptionStore(
    (s) => s.setSelectedPackageOption,
  );

  const [state, setState] = useState({
    status: "processing",
    message: "Verifying your payment, please wait...",
  });

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    if (!orderId) {
      setState({
        status: "failed",
        message: "Missing order ID in payment return URL.",
      });
      return;
    }

    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const verifyRes = await fetch(
          `/api/cashfree/verify-order?order_id=${encodeURIComponent(orderId)}`,
        );
        const verifyText = await verifyRes.text();
        const verifyData = verifyText ? JSON.parse(verifyText) : {};
        if (!verifyRes.ok) {
          throw new Error(verifyData?.error || "Could not verify payment.");
        }

        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);
        if (!orderSnap.exists()) {
          throw new Error("Order not found.");
        }
        const orderData = orderSnap.data();

        if (orderData?.customer?.uid !== currentUser.uid) {
          throw new Error("This order does not belong to the logged-in user.");
        }

        if (verifyData.paid) {
          await updateDoc(orderRef, {
            status: "SUCCESS",
            paymentReturn: true,
            paymentVerifiedAt: serverTimestamp(),
            cashfreeOrderStatus: verifyData.orderStatus || null,
            cashfreePaymentStatus: verifyData.paymentStatus || null,
            cfPaymentId: verifyData.cfPaymentId || null,
          });

          const userRef = doc(db, "users", currentUser.uid);
          await setDoc(
            userRef,
            {
              activePackageId: orderData.packageId ?? null,
              activePackageName: orderData.packageName ?? null,
              activePackagePrice: orderData.packagePrice ?? orderData.amount ?? null,
              packageOrderId: orderId,
              packageStatus: "ACTIVE",
              packageActivatedAt: serverTimestamp(),
              lastPaymentStatus: "SUCCESS",
              lastPaymentAt: serverTimestamp(),
            },
            { merge: true },
          );

          if (!cancelled) {
            setSelectedPackageOption(null);
            setState({
              status: "success",
              message: "Payment successful. Your package is now active.",
            });
            setTimeout(() => {
              navigate("/dashboard", { replace: true });
            }, 1400);
          }
        } else {
          await updateDoc(orderRef, {
            status: "FAILED",
            paymentReturn: true,
            paymentVerifiedAt: serverTimestamp(),
            cashfreeOrderStatus: verifyData.orderStatus || null,
            cashfreePaymentStatus: verifyData.paymentStatus || null,
          });

          if (!cancelled) {
            setState({
              status: "failed",
              message:
                "Payment was not successful. Please try again from Packages.",
            });
          }
        }
      } catch (err) {
        console.error("Payment return processing failed", err);
        if (!cancelled) {
          setState({
            status: "failed",
            message: err?.message || "Could not process payment return.",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, currentUser, navigate, setSelectedPackageOption]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center">
        {state.status === "processing" && (
          <Loader2 className="mx-auto mb-5 animate-spin" size={34} />
        )}
        {state.status === "success" && (
          <CheckCircle2 className="mx-auto mb-5 text-green-400" size={34} />
        )}
        {state.status === "failed" && (
          <XCircle className="mx-auto mb-5 text-red-400" size={34} />
        )}

        <h1 className="font-[Albra] text-3xl mb-3">
          {state.status === "processing"
            ? "Finalizing Payment"
            : state.status === "success"
              ? "Payment Confirmed"
              : "Payment Not Completed"}
        </h1>
        <p className="font-[ABC] text-sm text-white/70">{state.message}</p>
      </div>
    </div>
  );
};

export default PaymentReturn;

