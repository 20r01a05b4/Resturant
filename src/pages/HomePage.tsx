import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const featuredDishes = [
  {
    id: 1,
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with herbs and lemon',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=800',
    category: 'Main Course'
  },
  {
    id: 2,
    name: 'Truffle Risotto',
    description: 'Creamy Arborio rice with black truffle',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=800',
    category: 'Main Course'
  },
  {
    id: 3,
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800',
    category: 'Dessert'
  },
];

export default function HomePage() {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [featuredRef, featuredInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 20 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative h-screen -mt-20"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1974"
            alt="Restaurant interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center space-y-8 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white"
            >
              Experience Culinary Excellence
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-200 max-w-2xl mx-auto"
            >
              Indulge in a symphony of flavors crafted with passion and precision
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex gap-4 justify-center"
            >
              <Link
                to="/reservation"
                className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-3 rounded-full font-semibold hover:from-primary-700 hover:to-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Reserve a Table
              </Link>
              <Link
                to="/menu"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
              >
                View Menu
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Dishes */}
      <motion.section
        ref={featuredRef}
        initial={{ opacity: 0, y: 20 }}
        animate={featuredInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="px-4 py-16 bg-white dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Dishes
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover our chef's specially curated selection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDishes.map((dish, index) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
                    {dish.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {dish.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {dish.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      ${dish.price}
                    </span>
                    <Link
                      to="/menu"
                      className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      Order Now
                      <ChevronRightIcon className="w-5 h-5 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}