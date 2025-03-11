/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

const UploadMenuItem = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null); // Fix for 'setUser' error
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [dietary, setDietary] = useState('Vegetarian');
  const [loading, setLoading] = useState(false);
  console.log(user);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.log('Error fetching user:', error);
      } else {
        setUser(data?.user);
      }
    };

    checkUser();
  }, []);

  const dietaryOptions = ['Vegetarian', 'Gluten-Free', 'Vegan'];
  const categoryOptions = ['Main Course', 'Dessert'];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { // Fix for 'any' error
    event.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('menuitems').insert([
        {
          name,
          description,
          price: parseFloat(price),
          image: imageUrl,
          category,
          dietary,
        },
      ]);

      if (error) {
        console.log(error);
        return;
      }

      alert('Menu item uploaded successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setCategory('Main Course');
      setDietary('Vegetarian');
    } catch (error: any) {
      console.error('Error uploading menu item:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-12"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Upload Menu Item</h2>
      <form onSubmit={handleSubmit}>
        <motion.div className="mb-4" whileHover={{ scale: 1.05 }}>
          <label className="block text-sm font-medium">Item Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </motion.div>

        <motion.div className="mb-4" whileHover={{ scale: 1.05 }}>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </motion.div>

        <motion.div className="mb-4" whileHover={{ scale: 1.05 }}>
          <label className="block text-sm font-medium">Price ($)</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </motion.div>

        <motion.div className="mb-4" whileHover={{ scale: 1.05 }}>
          <label className="block text-sm font-medium">Category</label>
          <select
            className="w-full p-2 border rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div className="mb-4" whileHover={{ scale: 1.05 }}>
          <label className="block text-sm font-medium">Dietary Options</label>
          <select
            className="w-full p-2 border rounded-md"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
          >
            {dietaryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div className="mb-4" whileHover={{ scale: 1.05 }}>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </motion.div>

        <motion.button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default UploadMenuItem;
