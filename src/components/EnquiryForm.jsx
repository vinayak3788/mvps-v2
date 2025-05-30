// src/components/EnquiryForm.jsx
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EnquiryForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    subject: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/enquiry/send-enquiry", formData);
      if (res.status === 200) {
        toast.success("Enquiry submitted successfully.");
        setFormData({
          firstName: "",
          lastName: "",
          mobile: "",
          email: "",
          subject: "",
          description: "",
        });
      }
    } catch (err) {
      toast.error("Failed to send enquiry.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full border border-gray-300 rounded px-4 py-2"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full border border-gray-300 rounded px-4 py-2"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <input
        type="tel"
        name="mobile"
        placeholder="Mobile Number"
        className="w-full border border-gray-300 rounded px-4 py-2"
        value={formData.mobile}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        className="w-full border border-gray-300 rounded px-4 py-2"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="subject"
        placeholder="Subject"
        className="w-full border border-gray-300 rounded px-4 py-2"
        value={formData.subject}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        className="w-full border border-gray-300 rounded px-4 py-2 h-32 resize-none"
        value={formData.description}
        onChange={handleChange}
        required
      ></textarea>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        Submit Enquiry
      </button>
    </form>
  );
};

export default EnquiryForm;
