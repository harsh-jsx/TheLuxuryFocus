import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * When Cashfree redirects back with ?payment=return&order_id=..., route user
 * to the dedicated payment return page that verifies and activates package.
 */
export default function PaymentReturnHandler() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const orderId = params.get("order_id");
        const payment = params.get("payment");

        if (payment !== "return" || !orderId) return;
        if (location.pathname === "/payment-return") return;

        navigate(`/payment-return?order_id=${encodeURIComponent(orderId)}`, {
            replace: true,
        });
    }, [location.pathname, location.search, navigate]);

    return null;
}
