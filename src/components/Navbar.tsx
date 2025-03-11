import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../hooks/useAuth";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Cart", href: "/cart" },
  { name: "Reservation", href: "/reservation" },
  { name: "Order", href: "/order" },
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, userRole, logout } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md">
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text">
          Restaurant
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-500 transition duration-300"
            >
              {item.name}
            </Link>
          ))}
          {userRole === "admin" && (
            <Link to="/dashboard" className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-500 transition">
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Side - Theme Toggle & User Actions */}
        <div className="flex items-center gap-x-4">
          {/* Theme Toggle Button (Always Visible) */}
          <button onClick={toggleTheme} className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300">
            {theme === "dark" ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>

          {/* Auth Buttons */}
          {user ? (
            <>
              {userRole === "admin" && (
                <Link to="/upload-menu" className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-500 transition">
                  Upload Menu
                </Link>
              )}
              <button onClick={logout} className="text-sm font-medium text-red-500 hover:text-red-600 transition">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary-500 transition">
              Log in →
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-200" onClick={() => setMobileMenuOpen(true)}>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile Menu */}
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Panel className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-900 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text">
              Restaurant
            </span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-200">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <nav className="space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-gray-900 dark:text-gray-100 text-lg hover:text-primary-500 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {userRole === "admin" && (
              <Link to="/dashboard" className="block text-lg text-gray-900 dark:text-gray-100 hover:text-primary-500 transition">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Mobile Menu User Actions */}
          <div className="mt-6 space-y-4">
            {user ? (
              <>
                {userRole === "admin" && (
                  <Link to="/upload-menu" className="block text-lg text-gray-900 dark:text-gray-100 hover:text-primary-500 transition">
                    Upload Menu
                  </Link>
                )}
                {/* Mobile Theme Toggle Button */}
                <button onClick={toggleTheme} className="w-full text-left p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                  {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
                </button>
                <button onClick={logout} className="w-full text-left text-lg text-red-500 hover:text-red-600 transition">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="block text-lg text-gray-900 dark:text-gray-100 hover:text-primary-500 transition">
                Log in →
              </Link>
            )}
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
