-- Create simulations table
CREATE TABLE IF NOT EXISTS simulations (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  data TEXT NOT NULL,
  results TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_simulations_code ON simulations(code);
CREATE INDEX IF NOT EXISTS idx_simulations_created_at ON simulations(created_at);

-- Enable Row Level Security
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for anonymous users (for demo purposes)
-- In production, you might want to implement more restrictive policies
CREATE POLICY "Allow all operations for simulations" ON simulations
  FOR ALL 
  TO anon
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_simulations_updated_at 
  BEFORE UPDATE ON simulations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
