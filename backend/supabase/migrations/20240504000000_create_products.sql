-- Create a products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read products
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);

-- Create a policy that allows authenticated users to insert/update/delete (simple for beginners)
CREATE POLICY "Allow authenticated full access" ON products 
FOR ALL USING (auth.role() = 'authenticated');
