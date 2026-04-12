import React from "react";

const CookiesPolicy = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6">Cookies Policy</h1>

    <div className="space-y-6 text-sm leading-relaxed">
      <section>
        <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
        <p>
          This Cookies Policy explains how TheLuxuryFocus.com ("we," "our," or
          "us") uses cookies and similar technologies when you visit our website
          and use our platform. This policy should be read alongside our Privacy
          Policy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">2. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are stored on your device (computer,
          tablet, or mobile) when you visit a website. They help websites
          remember information about your visit, such as your preferred language
          and other settings, which can make your next visit easier and the site
          more useful to you.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          3. Types of Cookies We Use
        </h2>

        <h3 className="text-lg font-medium mb-2">3.1 Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function properly and
          cannot be disabled. They include:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Authentication cookies to keep you logged in</li>
          <li>Security cookies to protect against fraud</li>
          <li>Session cookies to maintain your session</li>
          <li>Load balancing cookies for performance</li>
        </ul>

        <h3 className="text-lg font-medium mb-2 mt-4">
          3.2 Functional Cookies
        </h3>
        <p>These cookies enable enhanced functionality and personalization:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Language preference cookies</li>
          <li>Theme and display preference cookies</li>
          <li>User interface customization cookies</li>
          <li>Form auto-fill cookies</li>
        </ul>

        <h3 className="text-lg font-medium mb-2 mt-4">3.3 Analytics Cookies</h3>
        <p>
          These cookies help us understand how visitors interact with our
          website:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Google Analytics cookies</li>
          <li>Page view and session duration tracking</li>
          <li>User behavior analysis</li>
          <li>Website performance monitoring</li>
        </ul>

        <h3 className="text-lg font-medium mb-2 mt-4">3.4 Marketing Cookies</h3>
        <p>
          These cookies are used to deliver relevant advertisements and track
          marketing campaign effectiveness:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Advertising network cookies</li>
          <li>Social media platform cookies</li>
          <li>Retargeting cookies</li>
          <li>Campaign tracking cookies</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          4. Specific Cookies We Use
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Cookie Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Purpose
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Duration
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">session_id</td>
                <td className="border border-gray-300 px-4 py-2">
                  Maintains user session
                </td>
                <td className="border border-gray-300 px-4 py-2">Session</td>
                <td className="border border-gray-300 px-4 py-2">Essential</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">auth_token</td>
                <td className="border border-gray-300 px-4 py-2">
                  User authentication
                </td>
                <td className="border border-gray-300 px-4 py-2">1 year</td>
                <td className="border border-gray-300 px-4 py-2">Essential</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">language</td>
                <td className="border border-gray-300 px-4 py-2">
                  Language preference
                </td>
                <td className="border border-gray-300 px-4 py-2">1 year</td>
                <td className="border border-gray-300 px-4 py-2">Functional</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">theme</td>
                <td className="border border-gray-300 px-4 py-2">
                  Theme preference
                </td>
                <td className="border border-gray-300 px-4 py-2">1 year</td>
                <td className="border border-gray-300 px-4 py-2">Functional</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">_ga</td>
                <td className="border border-gray-300 px-4 py-2">
                  Google Analytics
                </td>
                <td className="border border-gray-300 px-4 py-2">2 years</td>
                <td className="border border-gray-300 px-4 py-2">Analytics</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">_gid</td>
                <td className="border border-gray-300 px-4 py-2">
                  Google Analytics
                </td>
                <td className="border border-gray-300 px-4 py-2">24 hours</td>
                <td className="border border-gray-300 px-4 py-2">Analytics</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">5. Third-Party Cookies</h2>
        <p>
          We may use third-party services that place cookies on your device:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>
            <strong>Google Analytics:</strong> Website analytics and performance
            monitoring
          </li>
          <li>
            <strong>Google Ads:</strong> Advertising and remarketing
          </li>
          <li>
            <strong>Facebook Pixel:</strong> Social media advertising
          </li>
          <li>
            <strong>Stripe:</strong> Payment processing
          </li>
          <li>
            <strong>Cloudflare:</strong> Security and performance
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          6. Managing Your Cookie Preferences
        </h2>

        <h3 className="text-lg font-medium mb-2">6.1 Browser Settings</h3>
        <p>You can control cookies through your browser settings:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>
            <strong>Chrome:</strong> Settings → Privacy and security → Cookies
            and other site data
          </li>
          <li>
            <strong>Firefox:</strong> Options → Privacy & Security → Cookies and
            Site Data
          </li>
          <li>
            <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
          </li>
          <li>
            <strong>Edge:</strong> Settings → Cookies and site permissions →
            Cookies and site data
          </li>
        </ul>

        <h3 className="text-lg font-medium mb-2 mt-4">6.2 Cookie Consent</h3>
        <p>
          When you first visit our website, you will see a cookie consent
          banner. You can:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Accept all cookies</li>
          <li>Reject non-essential cookies</li>
          <li>Customize your preferences</li>
          <li>Change your preferences at any time</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          7. Impact of Disabling Cookies
        </h2>
        <p>
          If you disable certain cookies, some features of our website may not
          function properly:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>You may need to log in repeatedly</li>
          <li>Some features may not work as expected</li>
          <li>Personalization settings may be lost</li>
          <li>Security features may be compromised</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">8. Do Not Track</h2>
        <p>
          Some browsers have a "Do Not Track" feature that signals to websites
          that you visit that you do not want to have your online activity
          tracked. We currently do not respond to "Do Not Track" signals.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          9. Updates to This Policy
        </h2>
        <p>
          We may update this Cookies Policy from time to time to reflect changes
          in our practices or for other operational, legal, or regulatory
          reasons. We will notify you of any material changes by posting the
          updated policy on our website.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
        <p>
          If you have any questions about our use of cookies, please contact us:
        </p>
        <ul className="list-none pl-6 mt-2 space-y-1">
          <li>Email: support@theluxuryfocus.com</li>
          <li>Subject: Cookie Policy Inquiry</li>
        </ul>
      </section>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-white">
        <p className="text-sm dark:text-white">
          <strong>Last updated:</strong> April 11, 2026
        </p>
        <p className="text-sm dark:text-white mt-2">
          This Cookies Policy is effective as of the date listed above and
          applies to all users of our website and platform.
        </p>
      </div>
    </div>
  </div>
);

export default CookiesPolicy;
