/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase'; // Ensure Supabase is correctly set up
import { User } from '@supabase/supabase-js';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  dietary?: string[];
  quantity?: number; // Added for cart items
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDietary, setSelectedDietary] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<MenuItem[]>([]);
  console.log(cart.length);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); // Explicitly typed

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('menuitems').select('*');

      if (error) {
        console.error('Error fetching menu items:', error);
      } else {
        setMenuItems(data || []);
      }
      setLoading(false);
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(user);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const addToCart = async (item: MenuItem) => {
    if (!user) {
      alert('Please log in to add items to the cart.');
      return;
    }

    try {
      // Check if item exists in cart
      const { data: existingCartItem, error: fetchError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('menu_item_id', item.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching cart item:', fetchError);
        return;
      }

      if (existingCartItem) {
        // If item exists, update quantity
        const { error: updateError } = await supabase
          .from('cart')
          .update({ quantity: existingCartItem.quantity + 1 })
          .eq('id', existingCartItem.id);

        if (updateError) {
          console.error('Error updating cart item:', updateError);
        } else {
          setCart((prevCart) =>
            prevCart.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: (cartItem.quantity || 0) + 1 }
                : cartItem
            )
          );
        }
      } else {
        // Add new item to cart
        const newItem = {
          user_id: user.id,
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          created_at: new Date(),
        };

        const { error: insertError } = await supabase.from('cart').insert([newItem]);

        if (insertError) {
          console.error('Error adding to cart:', insertError);
        } else {
          setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const categories = ['All', ...new Set(menuItems.map((item) => item.category))];
  const dietaryOptions = ['All', 'Vegetarian', 'Gluten-Free', 'Vegan'];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDietary = selectedDietary === 'All' || item.dietary?.includes(selectedDietary);
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDietary && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
      <h1 className="text-4xl font-bold text-center mb-6">Our Menu</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search menu items..."
          className="border p-2 rounded-md w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border p-2 rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded-md"
          value={selectedDietary}
          onChange={(e) => setSelectedDietary(e.target.value)}
        >
          {dietaryOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading menu items...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white shadow-lg rounded-lg p-4 relative"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm mb-2">{item.description}</p>
              <p className="text-lg font-bold mb-4">₹{item.price.toFixed(2)}</p>
              <motion.button
                onClick={() => addToCart(item)}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                whileTap={{ scale: 0.9 }}
              >
                Add to Cart
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
