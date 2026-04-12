import React from "react";

const Sitemap = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6">Sitemap</h1>

    <div className="space-y-6 text-sm leading-relaxed">
      <section>
        <h2 className="text-xl font-semibold mb-3">Main Pages</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Home</li>
          <li>Categories</li>
          <li>Search</li>
          <li>About Us</li>
          <li>Contact Us</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">User Pages</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Login</li>
          <li>Register</li>
          <li>User Dashboard</li>
          <li>My Listings</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Business Pages</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Add Listing</li>
          <li>Manage Listings</li>
          <li>Promote Listings</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Legal Pages</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Terms & Conditions</li>
          <li>Privacy Policy</li>
          <li>Cookies Policy</li>
          <li>Disclaimer</li>
          <li>Refund Policy</li>
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

export default Sitemap;
