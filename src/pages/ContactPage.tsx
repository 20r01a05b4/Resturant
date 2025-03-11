/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { supabase } from '../lib/supabase';

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Get user ID from localStorage (or from Supabase auth if enabled)
    const user = localStorage.getItem("user");

    if (!user) {
      alert("Please log in to submit the contact form.");
      setLoading(false);
      return;
    }

    try {
      // Insert data into Supabase
      const {error } = await supabase
  .from("contact_messages")  // Your table name in Supabase
  .insert([{ name, email, message, user_id: user }]);


      if (error) throw error;

      setSuccessMessage("Your message has been sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Failed to send the message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg mb-2">Feel free to reach out to us for any queries!</p>
      
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Your Message"
          className="border p-2 rounded h-32"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
