import React from "react";

const RefundPolicy = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h1>

    <div className="space-y-6 text-sm leading-relaxed">
      <section>
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p>
          This policy outlines the terms for refunds and cancellations on
          TheLuxuryFocus.com.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">2. Paid Services</h2>
        <p>
          We may offer paid services such as featured listings, advertisements,
          or promotional placements.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">3. Refund Eligibility</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Refunds are not guaranteed</li>
          <li>Eligible only in case of technical issues or service failure</li>
          <li>Requests must be made within 7 days of purchase</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">4. Non-Refundable Cases</h2>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Change of mind after purchase</li>
          <li>Partial usage of services</li>
          <li>Violation of platform policies</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">5. Cancellation Policy</h2>
        <p>
          Users may request cancellation of services via email. Cancellation
          does not guarantee a refund.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">6. Refund Processing</h2>
        <p>
          Approved refunds will be processed within 7–10 business days to the
          original payment method.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">7. Contact</h2>
        <ul className="list-none pl-6 mt-2 space-y-1">
          <li>Email: support@theluxuryfocus.com</li>
          <li>Subject: Refund Request</li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-white">
        <p className="text-sm">
          <strong>Last updated:</strong> April 11, 2026
        </p>
      </div>
    </div>
  </div>
);

export default RefundPolicy;
