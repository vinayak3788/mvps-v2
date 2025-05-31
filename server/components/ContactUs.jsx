// src/components/ContactUs.jsx
import React from "react";
import { Link } from "react-router-dom";
import EnquiryForm from "./EnquiryForm";

const ContactUs = () => {
  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Contact Info */}
          <div className="md:w-1/2 bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Support Details</h2>
            <p className="mb-2">
              📧 Email:{" "}
              <a
                href="mailto:mvpservices2310@gmail.com"
                className="text-blue-600 underline"
              >
                mvpservices2310@gmail.com
              </a>
            </p>
            <p className="mb-2">📞 Phone: +91-9518916780</p>
            <p className="mb-2">💬 WhatsApp: +91-9518916780</p>
            <p className="mt-4 text-sm text-gray-600">
              We are available Monday to Saturday, 10 AM – 7 PM.
            </p>
          </div>

          {/* Enquiry Form */}
          <div className="md:w-1/2 bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Send Us an Enquiry</h2>
            <EnquiryForm />
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/" className="text-blue-600 underline hover:text-blue-800">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
