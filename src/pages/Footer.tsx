import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 text-center mt-auto">
      <p>&copy; {new Date().getFullYear()} Restaurant Name. All rights reserved.</p>
    </footer>
  );
};

export default Footer;