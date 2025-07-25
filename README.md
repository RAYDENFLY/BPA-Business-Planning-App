# Business Planning App (BPA) 🚀

A comprehensive Next.js application for business planning, ROI simulation, and financial projections designed specifically for Small and Medium Enterprises (SMEs).

## 🌟 Features

- **ROI Simulator**: Advanced financial calculations with outlet management
- **Business Planning**: Comprehensive tools for business analysis
- **Financial Projections**: Multi-scenario forecasting capabilities  
- **Export & Sharing**: PDF exports and simulation sharing via unique codes
- **Responsive Design**: Mobile-first approach for all devices
- **Real-time Data**: Powered by Supabase for scalable, real-time database operations

## 🔧 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Charts**: Chart.js & React-ChartJS-2
- **Icons**: Lucide React
- **Export**: jsPDF with html2canvas
- **Deployment**: Vercel-ready

## 🏗️ Database Migration

**✅ MIGRATED FROM SQLITE TO SUPABASE**

This project has been successfully migrated from SQLite to Supabase for better scalability and cloud-native features.

### Supabase Configuration
- **Project URL**: `https://lzynzuyrefhnkajqpchx.supabase.co`
- **Environment Variables**: Already configured in `.env.local`

For detailed migration information, see [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RAYDENFLY/BPA-Business-Planning-App.git
   cd BPA-Business-Planning-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase Database**
   
   Go to your Supabase project and run this SQL in the SQL Editor:
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

   -- Create indexes for better performance
   CREATE INDEX IF NOT EXISTS idx_simulations_code ON simulations(code);
   CREATE INDEX IF NOT EXISTS idx_simulations_created_at ON simulations(created_at);

   -- Enable Row Level Security
   ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

   -- Create policy for public access (demo purposes)
   CREATE POLICY "Allow all operations for simulations" ON simulations
     FOR ALL TO anon USING (true) WITH CHECK (true);

   -- Auto-update timestamp function
   CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ language 'plpgsql';

   -- Trigger for auto-updating timestamps
   CREATE TRIGGER update_simulations_updated_at 
     BEFORE UPDATE ON simulations 
     FOR EACH ROW 
     EXECUTE FUNCTION update_updated_at_column();
   ```

4. **Environment Variables**
   
   Environment variables are already configured in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://lzynzuyrefhnkajqpchx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📱 Features Overview

### ROI Simulator
- Comprehensive financial calculations
- Multiple outlet management  
- Scenario-based projections (optimistic, realistic, pessimistic)
- Break-even analysis
- Export to PDF

### Business Planning
- Market analysis tools
- Cost-benefit analysis
- Risk assessment
- Financial forecasting

### Data Management
- Save simulations with unique codes
- Load and compare simulations
- Export data to various formats
- Real-time data synchronization

## 🌐 API Endpoints

### Simulations
- `POST /api/simulations` - Save new simulation
- `GET /api/simulations/[code]` - Get simulation by code
- `GET /api/simulations/list` - Get all simulations

### Admin (if applicable)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/logs` - System logs

## 🔐 Security

- Row Level Security (RLS) enabled on Supabase
- Environment variables for sensitive data
- Input validation and sanitization
- Secure API endpoints

## 📊 Performance

- Server-side rendering with Next.js 15
- Optimized database queries
- Image optimization
- Code splitting and lazy loading

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms
- Compatible with any Node.js hosting platform
- Docker support available
- Static export option for CDN deployment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md)
- **Issues**: [GitHub Issues](https://github.com/RAYDENFLY/BPA-Business-Planning-App/issues)
- **Discussions**: [GitHub Discussions](https://github.com/RAYDENFLY/BPA-Business-Planning-App/discussions)

## 🏆 Credits

Developed by **RAYDENFLY - Authentic Media Services**

---

**Made with ❤️ for the SME community**
