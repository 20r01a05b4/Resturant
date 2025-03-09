import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase'; // Import Supabase client

const OrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCart() {
      const { data, error } = await supabase.from('cart').select('*');
      if (error) {
        console.error('Error fetching cart:', error);
      } else {
        setCart(data || []);
      }
      setLoading(false);
    }
    fetchCart();
  }, []);

  // Calculate total amount
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Order Summary
        </h1>
        <AnimatePresence>
          {cart.length > 0 ? (
            cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex justify-between items-center border-b py-2"
              >
                <span className="text-gray-700">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
        </AnimatePresence>

        {/* Billing Breakdown */}
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Tax (8%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2 text-gray-900">
            <span>Total:</span>
            <motion.span
              key={total}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-green-600"
            >
              ${total.toFixed(2)}
            </motion.span>
          </div>
        </div>

        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600 transition-transform transform hover:scale-105"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </motion.div>
    </div>
  );
};

export default OrderPage;
