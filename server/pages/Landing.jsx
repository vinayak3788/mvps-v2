// src/pages/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to MVPS Printing</h1>
      <p className="mb-8 text-center max-w-xl">
        Your one-stop shop for printing, stationery and on-campus rent agreement
        services in Navyangan Campus, Kasar Amboli, Pune.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Sign Up
        </Link>
        <Link
          to="/contact-us"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          Contact Us
        </Link>
      </div>
    </main>
  );
}
