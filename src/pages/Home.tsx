import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Shield, Zap } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Real Estate Project
              <br />
              <span className="text-blue-200">Pricing Calculator</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Professional pricing solutions for real estate development services.
              Calculate accurate project costs based on complexity, location, and
              specifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                to="/calculator"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition transform hover:scale-105 shadow-lg"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4 p-6 rounded-lg hover:shadow-lg transition">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full">
                <Calculator className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Smart Calculations
              </h3>
              <p className="text-gray-600">
                Advanced pricing algorithms that consider multiple factors including
                project size, complexity, and location.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg hover:shadow-lg transition">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Real-Time Pricing
              </h3>
              <p className="text-gray-600">
                See pricing updates instantly as you adjust project parameters for
                accurate cost estimation.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg hover:shadow-lg transition">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Enterprise-grade security with role-based access control and
                comprehensive audit logging.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg hover:shadow-lg transition">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Multiple Services
              </h3>
              <p className="text-gray-600">
                Support for various real estate services including 3D visualization,
                walkthroughs, and virtual tours.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Ready to Calculate Your Project Cost?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Get accurate pricing estimates for your real estate development projects
            in seconds.
          </p>
          <Link
            to="/calculator"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
          >
            Start Calculating Now
          </Link>
        </div>
      </section>
    </div>
  );
}
