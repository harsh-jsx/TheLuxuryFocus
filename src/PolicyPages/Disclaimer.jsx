import React from "react";

const Disclaimer = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>

    <div className="space-y-6 text-sm leading-relaxed">
      <section>
        <h2 className="text-xl font-semibold mb-3">1. General Information</h2>
        <p>
          The information provided on TheLuxuryFocus.com is for general
          informational purposes only. While we strive to keep information
          accurate and up to date, we make no guarantees of any kind.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">2. Platform Role</h2>
        <p>
          TheLuxuryFocus.com acts as a directory platform connecting users with
          businesses. We do not own, control, or provide any services listed on
          the platform.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          3. No Professional Advice
        </h2>
        <p>
          Any information on this platform should not be considered
          professional, legal, or financial advice.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          4. External Links Disclaimer
        </h2>
        <p>
          Our website may contain links to third-party websites. We are not
          responsible for the content, policies, or practices of any external
          sites.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          5. Limitation of Liability
        </h2>
        <p>
          We are not liable for any losses, damages, or disputes arising from:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Use of the platform</li>
          <li>Interactions with listed businesses</li>
          <li>Reliance on any information provided</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">6. Updates</h2>
        <p>We may update this Disclaimer at any time without prior notice.</p>
      </section>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-white">
        <p className="text-sm">
          <strong>Last updated:</strong> April 11, 2026
        </p>
      </div>
    </div>
  </div>
);

export default Disclaimer;
