# Supabase Migration Guide

## Overview
This project has been migrated from SQLite to Supabase for better scalability, real-time features, and cloud-native architecture.

## Setup Instructions

### 1. Supabase Project Configuration
- Project URL: `https://lzynzuyrefhnkajqpchx.supabase.co`
- The environment variables are already configured in `.env.local`

### 2. Database Schema Setup
Execute the following SQL in your Supabase SQL Editor:

```sql
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
```

### 3. Migration Benefits
- **Scalability**: Cloud-native PostgreSQL database that can handle large datasets
- **Real-time**: Built-in real-time subscriptions (can be implemented later)
- **Security**: Row Level Security and built-in authentication
- **Performance**: Better performance for concurrent users
- **Backup**: Automatic backups and point-in-time recovery
- **Analytics**: Built-in analytics dashboard

### 4. API Changes
All API endpoints now use async/await pattern:
- `POST /api/simulations` - Save simulation
- `GET /api/simulations/[code]` - Get simulation by code  
- `GET /api/simulations/list` - Get all simulations

### 5. File Changes
- ✅ `src/lib/supabase.ts` - New Supabase client and database functions
- ✅ `src/app/api/simulations/route.ts` - Updated to use Supabase
- ✅ `src/app/api/simulations/[code]/route.ts` - Updated to use Supabase
- ✅ `src/app/api/simulations/list/route.ts` - Updated to use Supabase
- ✅ `.env.local` - Added Supabase configuration
- ✅ `package.json` - Removed SQLite dependencies, added Supabase
- ❌ `src/lib/database.ts` - Legacy file (can be removed)

### 6. Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=https://lzynzuyrefhnkajqpchx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 7. Testing
1. Run the application: `npm run dev`
2. Test saving a simulation
3. Test loading a simulation by code
4. Test comparing simulations
5. Verify data persistence in Supabase dashboard

### 8. Production Considerations
- Implement proper Row Level Security policies
- Consider adding user authentication
- Set up database backups
- Monitor performance and usage
- Implement rate limiting for API endpoints

## Troubleshooting

### Common Issues
1. **Connection Error**: Check if Supabase URL and API key are correct
2. **Table Not Found**: Make sure to run the SQL schema in Supabase
3. **RLS Policy**: Ensure Row Level Security policies are properly configured
4. **CORS Issues**: Supabase should handle CORS automatically for your domain

### Support
- Supabase Documentation: https://supabase.com/docs
- Project Dashboard: https://supabase.com/dashboard/project/lzynzuyrefhnkajqpchx
