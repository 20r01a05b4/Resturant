/*
  # Initial Restaurant Management Schema

  1. New Tables
    - `profiles`
      - User profiles with role-based access
      - Linked to auth.users for authentication
    - `menu_categories`
      - Categories for menu items (e.g., Veg, Non-Veg, Beverages)
    - `menu_items`
      - Restaurant menu items with details and pricing
    - `tables`
      - Restaurant tables for reservations
    - `reservations`
      - Table reservations with status tracking
    - `orders`
      - Customer orders with status and payment tracking
    - `order_items`
      - Individual items in each order
    - `reviews`
      - Customer reviews and ratings
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Specific policies for admin and employee roles
*/

-- Create enum types for status tracking
CREATE TYPE user_role AS ENUM ('customer', 'employee', 'admin');
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');

-- Profiles table for user roles and additional info
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  full_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Menu categories
CREATE TABLE menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Menu items
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES menu_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  is_veg boolean DEFAULT false,
  is_available boolean DEFAULT true,
  preparation_time interval,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Restaurant tables
CREATE TABLE tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number int NOT NULL UNIQUE,
  capacity int NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reservations
CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  table_id uuid REFERENCES tables(id),
  reservation_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  guest_count int NOT NULL,
  status reservation_status DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  table_id uuid REFERENCES tables(id),
  reservation_id uuid REFERENCES reservations(id),
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id),
  quantity int NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  order_id uuid REFERENCES orders(id),
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Menu policies (public read, admin write)
CREATE POLICY "Public can view active menu categories"
  ON menu_categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can view available menu items"
  ON menu_items FOR SELECT
  TO anon, authenticated
  USING (is_available = true);

-- Reservation policies
CREATE POLICY "Users can view their reservations"
  ON reservations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create reservations"
  ON reservations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order policies
CREATE POLICY "Users can view their orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Review policies
CREATE POLICY "Public can view published reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Users can create reviews for their orders"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (new.id, 'customer', new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();