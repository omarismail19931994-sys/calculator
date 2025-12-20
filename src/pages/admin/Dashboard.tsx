import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  LayoutDashboard,
  Package,
  Globe,
  DollarSign,
  Settings,
  FileText,
  Users,
  FileSpreadsheet,
} from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    services: 0,
    regions: 0,
    currencies: 0,
    quotes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [services, regions, currencies, quotes] = await Promise.all([
        api.services.getAll(),
        api.regions.getAll(),
        api.currencies.getAll(),
        api.quotes.getAll(),
      ]);

      setStats({
        services: services.length,
        regions: regions.length,
        currencies: currencies.length,
        quotes: quotes.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: 'Services Management',
      description: 'Manage real estate services and pricing',
      icon: Package,
      link: '/admin/services',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Regions Management',
      description: 'Configure regional pricing factors',
      icon: Globe,
      link: '/admin/regions',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Currencies Management',
      description: 'Manage currencies and exchange rates',
      icon: DollarSign,
      link: '/admin/currencies',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Pricing Factors',
      description: 'Configure global pricing parameters',
      icon: Settings,
      link: '/admin/pricing-factors',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Quotes History',
      description: 'View and manage saved quotes',
      icon: FileText,
      link: '/admin/quotes',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'User Management',
      description: 'Manage system users and roles',
      icon: Users,
      link: '/admin/users',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      title: 'Audit Logs',
      description: 'View system activity logs',
      icon: FileSpreadsheet,
      link: '/admin/audit-logs',
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your real estate pricing calculator system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Services</p>
                <p className="text-3xl font-bold text-gray-900">{stats.services}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Regions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.regions}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Currencies</p>
                <p className="text-3xl font-bold text-gray-900">{stats.currencies}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Quotes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.quotes}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.link}
                to={item.link}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
              >
                <div className="flex items-start gap-4">
                  <div className={`${item.color} p-3 rounded-lg group-hover:scale-110 transition`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
