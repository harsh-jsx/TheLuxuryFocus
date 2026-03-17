import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { updateOrderStatus } from '../services/paymentService';
import { useSelectedPackageOptionStore } from '../stores/packageStore';

/**
 * When Cashfree redirects back with ?payment=return&order_id=..., mark order SUCCESS and send user to dashboard.
 */
export default function PaymentReturnHandler() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const setSelectedPackageOption = useSelectedPackageOptionStore((s) => s.setSelectedPackageOption);

    useEffect(() => {
        const orderId = searchParams.get('order_id');
        const payment = searchParams.get('payment');
        if (payment !== 'return' || !orderId) return;

        let cancelled = false;
        (async () => {
            try {
                await updateOrderStatus(orderId, 'SUCCESS', { paymentReturn: true });
                if (cancelled) return;
                setSelectedPackageOption(null);
                setSearchParams({}, { replace: true });
                navigate('/dashboard', { replace: true });
            } catch (err) {
                console.error('Payment return: failed to update order', err);
                if (!cancelled) setSearchParams({}, { replace: true });
            }
        })();
        return () => { cancelled = true; };
    }, [searchParams, setSearchParams, navigate, setSelectedPackageOption]);

    return null;
}
