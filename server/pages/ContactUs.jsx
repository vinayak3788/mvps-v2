// src/pages/ContactUs.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

export default function ContactUs() {
  const phone = "+919518916780";
  const whatsappLink = `https://wa.me/919518916780`;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    subject: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("/api/send-enquiry", form);
      toast.success("Enquiry sent! We’ll be in touch shortly.");
      setForm({
        firstName: "",
        lastName: "",
        mobile: "",
        email: "",
        subject: "",
        description: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          "Failed to send enquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Contact & Enquiry</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Info */}
          <section className="lg:w-1/2 space-y-6">
            <h2 className="text-2xl font-medium">Get in Touch</h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <FaPhone className="mr-2 text-blue-600" />
                <a href={`tel:${phone}`} className="hover:underline">
                  {phone}
                </a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-green-600" />
                <a
                  href="mailto:mvpservices2310@gmail.com"
                  className="hover:underline"
                >
                  mvpservices2310@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <FaWhatsapp className="mr-2 text-green-500" />
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  WhatsApp us
                </a>
              </li>
            </ul>
            <Link
              to="/"
              className="inline-block mt-4 text-sm text-gray-500 hover:underline"
            >
              ← Back to Home
            </Link>
          </section>

          {/* Enquiry Form */}
          <section className="lg:w-1/2 bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-medium mb-4">Submit an Enquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  className="flex-1 p-2 border rounded"
                />
              </div>
              <div className="flex gap-4">
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  required
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="flex-1 p-2 border rounded"
                />
              </div>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                className="w-full p-2 border rounded"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description of your enquiry"
                rows={4}
                required
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-2 rounded transition ${
                  submitting
                    ? "bg-gray-400 text-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {submitting ? "Sending..." : "Send Enquiry"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
