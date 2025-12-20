# Real Estate Project Pricing Calculator

A professional web-based calculator for estimating real estate development service costs based on project complexity, location, and specifications.

## 🌟 Features

- **Smart Pricing Calculator** - Real-time price calculations based on multiple factors
- **7 Real Estate Services** - 3D applications, walkthroughs, virtual tours, and more
- **Global Coverage** - 7 regions with location-based pricing factors
- **Multi-Currency Support** - 6 major currencies with exchange rates
- **Admin Dashboard** - Complete management system for services, regions, and pricing
- **Role-Based Access** - Admin, Manager, and Viewer roles
- **Secure Authentication** - Powered by Supabase Auth
- **Audit Logging** - Track all system changes
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Icons**: Lucide React
- **Routing**: React Router v7

## 📊 Pricing Algorithm

The calculator uses a sophisticated algorithm that considers:

- **NOA** (Net Operating Area) - Project size in square meters
- **VAT** (Value After Tax) - Total project value
- **NTB** (Number of Buildings) - Building count
- **LAC** (Level of Architectural Complexity) - Design complexity percentage
- **Priority Level** - Standard (1.0x), High (1.3x), Urgent (1.5x)
- **Regional Factor** - Location-based pricing multiplier
- **Currency** - Exchange rate conversion

### Formula

```
Complexity Factor =
  (NOA_Factor × NOA_Weight) +
  (VAT_Factor × VAT_Weight) +
  (NTB_Factor × NTB_Weight) +
  (LAC_Factor × LAC_Weight)

Final Price =
  Adjusted_Price × Priority_Multiplier × Regional_Factor × Exchange_Rate
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone or download** this repository

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:

   Create `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**:
   - The database schema is already created in Supabase
   - Initial data is seeded (services, regions, currencies)

5. **Create Admin User**:
   - Go to Supabase Dashboard → Authentication → Users
   - Create a user
   - Run SQL: `SELECT setup_admin_user('your-email@example.com');`

6. **Run development server**:
   ```bash
   npm run dev
   ```

7. **Build for production**:
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main layout with navbar
│   └── ProtectedRoute.tsx  # Auth guard component
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── lib/               # Utility libraries
│   ├── calculator.ts  # Pricing calculation engine
│   ├── supabase.ts    # Supabase client
│   └── utils.ts       # Helper functions
├── pages/             # Page components
│   ├── Home.tsx       # Landing page
│   ├── Calculator.tsx # Main calculator
│   ├── Login.tsx      # Authentication page
│   └── admin/
│       └── Dashboard.tsx  # Admin panel
├── services/          # API services
│   └── api.ts         # Supabase API wrapper
├── types/             # TypeScript definitions
│   └── index.ts       # Type definitions
├── App.tsx            # Root component
└── main.tsx           # Application entry point
```

## 🗄️ Database Schema

### Tables

1. **users** - User accounts with roles (admin/manager/viewer)
2. **services** - Real estate services with pricing configuration
3. **regions** - Geographic regions with pricing factors
4. **currencies** - Supported currencies with exchange rates
5. **pricing_factors** - Global pricing calculation parameters
6. **quotes** - Saved price quotes with full calculation details
7. **audit_logs** - System activity tracking

## 🔐 Authentication & Authorization

### User Roles

- **Admin** - Full system access, can manage all settings
- **Manager** - Can create quotes and view reports
- **Viewer** - Can only use calculator and create quotes

### Default Admin Credentials

After setting up:
- Email: `admin@calculator.com`
- Password: `Admin@123`

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions for:
- Netlify (recommended)
- Vercel
- Traditional web hosting (cPanel)

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check TypeScript

## 🎨 Design System

### Colors

- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Danger**: Red (#EF4444)

### Typography

- **Font**: Inter, system-ui, sans-serif
- **Headings**: 40px, 32px, 24px
- **Body**: 16px
- **Small**: 14px

## 📊 Seeded Data

### Services (7)

1. 3D Touch Application - Variable ($5,000)
2. 3D Units in Predefined Style - Variable ($3,000)
3. 3D Walkthrough Exterior - Hybrid ($2,000 + $1,500)
4. Amenities 2D View - Fixed ($1,000)
5. 3D Web Search - Fixed ($800)
6. 3D Web Virtual Tour Interior - Variable ($4,000)
7. Dedicated Finishing Style - Hybrid ($2,500 + $1,000)

### Regions (7)

- North America (1.20x)
- Europe (1.15x)
- Middle East (1.10x)
- Asia Pacific (1.00x)
- Latin America (0.90x)
- Africa (0.85x)
- Oceania (1.05x)

### Currencies (6)

- USD ($) - 1.0000
- EUR (€) - 0.9200
- GBP (£) - 0.7900
- AED (د.إ) - 3.6700
- JPY (¥) - 149.5000
- AUD (A$) - 1.5300

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- Secure authentication via Supabase Auth
- Role-based access control (RBAC)
- Audit logging for all administrative actions
- Input validation on frontend and backend
- Secure password hashing

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 640px, 1024px
- Touch-friendly UI elements
- Optimized for all screen sizes

## 🐛 Troubleshooting

### Calculator not showing prices
- Check that pricing_factors table has data
- Verify services, regions, and currencies are active

### Login issues
- Ensure admin user was created and promoted
- Check Supabase Auth settings
- Verify environment variables

### Routing issues (404 on refresh)
- Ensure `.htaccess` or `_redirects` file is present
- Check server configuration for SPA support

## 📄 License

This project is proprietary software for real estate pricing calculations.

## 🤝 Support

For issues or questions:
1. Check the DEPLOYMENT_GUIDE.md
2. Review Supabase logs
3. Check browser console for errors

---

**Built with ❤️ for professional real estate pricing**
