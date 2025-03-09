import React from "react";

const ContactPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg mb-2">Feel free to reach out to us for any queries!</p>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Your Name" className="border p-2 rounded" />
        <input type="email" placeholder="Your Email" className="border p-2 rounded" />
        <textarea placeholder="Your Message" className="border p-2 rounded h-32"></textarea>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Send Message</button>
      </form>
    </div>
  );
};

export default ContactPage;
