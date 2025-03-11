/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { ChevronDown, ShoppingCart } from "lucide-react";

const AdminCartPage = () => {
  const [cartData, setCartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("cart") // Your Supabase cart table
          .select("id, user_id, name, price, quantity");

        if (error) throw error;

        // Group data by user_id
        const groupedData: Record<number, any> = {};
        data.forEach((item) => {
          if (!groupedData[item.user_id]) {
            groupedData[item.user_id] = {
              user_id: item.user_id,
              total_price: 0,
              items: [],
            };
          }
          groupedData[item.user_id].items.push(item);
          groupedData[item.user_id].total_price += item.price * item.quantity;
        });

        setCartData(Object.values(groupedData));
      } catch (err) {
        console.error("Error fetching cart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Page Title */}
      <motion.h1
        className="text-4xl font-extrabold text-center text-gray-900 dark:text-white tracking-wide"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Admin Cart Management
      </motion.h1>

      {/* Loading Indicator */}
      {loading ? (
        <p className="text-center text-gray-500 mt-6 animate-pulse">Fetching cart data...</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartData.length > 0 ? (
            cartData.map((cart) => (
              <motion.div
                key={cart.user_id}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg p-6 rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setExpandedUser(expandedUser === cart.user_id ? null : cart.user_id)
                  }
                >
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <ShoppingCart size={20} /> User ID: {cart.user_id}
                    </h2>
                    <p className="text-lg font-semibold">Total: ₹{cart.total_price.toFixed(2)}</p>
                  </div>
                  <motion.div
                    className="text-gray-300"
                    animate={{ rotate: expandedUser === cart.user_id ? 180 : 0 }}
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </div>

                {expandedUser === cart.user_id && (
                  <motion.div
                    className="mt-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-lg shadow-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <ul className="space-y-2">
                      {cart.items.map((item: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; quantity: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; price: number; }, index: React.Key | null | undefined) => (
                        <li
                          key={index}
                          className="flex justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
                        >
                          <span className="text-gray-700 dark:text-gray-300">
                            {item.name} (x{item.quantity})
                          </span>
                          <span className="text-gray-800 dark:text-gray-100 font-bold">
                          ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">No carts found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCartPage;
