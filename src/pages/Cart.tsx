import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getUser } from '../lib/getUser';
import { supabase } from '../lib/supabase';
import {
  ShoppingCartIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      const userDetails = await getUser();
      if (!userDetails) {
        alert('Please log in to see your cart.');
        navigate('/login');
        return;
      }
      setUser(userDetails);
      fetchCart(userDetails.id);
    }
    fetchUser();
  }, []);

  const fetchCart = async (userId: string) => {
    const { data, error } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', userId);
    if (error) console.error('Error fetching cart:', error);
    else setCart(data || []);
  };

  const updateQuantity = async (id: number, change: number) => {
    if (!user) {
      alert('Please log in to modify your cart.');
      return;
    }

    const item = cart.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      await supabase.from('cart').delete().eq('id', id);
    } else {
      await supabase
        .from('cart')
        .update({ quantity: newQuantity })
        .eq('id', id);
    }
    fetchCart(user.id);
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-xl rounded-2xl border border-gray-200"
    >
      <h2 className="text-3xl font-extrabold flex items-center text-gray-800">
        <ShoppingCartIcon className="h-7 w-7 mr-3 text-blue-500" /> Cart (
        {cart.length} items)
      </h2>

      <AnimatePresence>
        {cart.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex justify-between items-center p-3 my-2 bg-gray-50 rounded-lg shadow-md"
          >
            <span className="text-lg font-medium text-gray-700">
              {item.name}
            </span>
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => updateQuantity(item.id, -1)}
              >
                <MinusCircleIcon className="h-6 w-6 cursor-pointer text-red-500 hover:text-red-700" />
              </motion.button>
              <span className="text-lg font-bold">{item.quantity}</span>
              <motion.button
                whileTap={{ scale: 1.1 }}
                onClick={() => updateQuantity(item.id, 1)}
              >
                <PlusCircleIcon className="h-6 w-6 cursor-pointer text-green-500 hover:text-green-700" />
              </motion.button>
            </div>
            <span className="text-lg font-semibold text-gray-800">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="mt-6 flex justify-between items-center text-xl font-bold text-gray-900">
        <span>Total:</span>
        <motion.span
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-green-600"
        >
          ${totalAmount.toFixed(2)}
        </motion.span>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 w-full px-5 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700"
        onClick={() => navigate('/order')}
      >
        Order Now
      </motion.button>
    </motion.div>
  );
}
