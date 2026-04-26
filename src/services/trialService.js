import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
    ONE_DAY_MS,
    SUBSCRIPTION_PLANS,
    TRIAL_DURATION_DAYS,
    TRIAL_PLAN_ID,
} from '../constants/subscriptionPlans';

/**
 * Free-trial activation. Mirrors the zero-amount coupon path in PaymentReturn.jsx
 * but skips the Cashfree round-trip and the address form, since trial only
 * needs an authenticated uid.
 *
 * Trial is one-shot per user: enforced by `users/{uid}.trialUsed`.
 */
export const trialService = {
    /** Quick read so the Packages page can disable the CTA when a trial is already used. */
    hasUsedTrial: async (uid) => {
        if (!uid) return false;
        const snap = await getDoc(doc(db, 'users', uid));
        return Boolean(snap.exists() && snap.data().trialUsed);
    },

    /**
     * Create the trial order + activate the user's subscription.
     * Throws if the user is missing or has already used their trial.
     * Returns { orderId, expiresAt, planId } on success.
     */
    claimTrial: async (currentUser) => {
        if (!currentUser?.uid) throw new Error('You need to sign in first.');

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().trialUsed) {
            throw new Error('Your free trial has already been used.');
        }

        const plan = SUBSCRIPTION_PLANS[TRIAL_PLAN_ID] || SUBSCRIPTION_PLANS[2];
        const startMs = Date.now();
        const expiresMs = startMs + TRIAL_DURATION_DAYS * ONE_DAY_MS;
        const startsAt = Timestamp.fromMillis(startMs);
        const expiresAt = Timestamp.fromMillis(expiresMs);

        // Order record — visible in Admin → Orders, with `isTrial` flag.
        const orderRef = await addDoc(collection(db, 'orders'), {
            packageId: plan.id,
            packageName: plan.name,
            packagePrice: '₹0',
            amount: 0,
            originalAmount: plan.price || null,
            isTrial: true,
            planDurationDays: TRIAL_DURATION_DAYS,
            subscriptionStartsAt: startsAt,
            subscriptionExpiresAt: expiresAt,
            status: 'SUCCESS',
            paymentMethod: 'TRIAL',
            paymentReturn: true,
            customer: {
                uid: currentUser.uid,
                fullName: currentUser.displayName || '',
                email: currentUser.email || '',
                phone: '',
            },
            createdAt: serverTimestamp(),
            paymentVerifiedAt: serverTimestamp(),
        });

        // User record — mirrors the shape PaymentReturn.jsx writes for paid plans.
        await setDoc(
            userRef,
            {
                activePackageId: plan.id,
                activePackageName: plan.name,
                activePackagePrice: '₹0',
                packageOrderId: orderRef.id,
                packageStatus: 'ACTIVE',
                packageActivatedAt: serverTimestamp(),
                isTrial: true,
                trialUsed: true,
                trialStartedAt: startsAt,
                subscriptionStartsAt: startsAt,
                subscriptionExpiresAt: expiresAt,
                planDurationDays: TRIAL_DURATION_DAYS,
                lastPaymentStatus: 'SUCCESS',
                lastPaymentAt: serverTimestamp(),
            },
            { merge: true },
        );

        return { orderId: orderRef.id, expiresAt: expiresMs, planId: plan.id };
    },
};
