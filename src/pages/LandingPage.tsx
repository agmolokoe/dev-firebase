import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, ShoppingCart, Share2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-10">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Baseti Social Shop
              </h1>
              <p className="text-gray-600 mt-1">Empower your business with seamless management tools</p>
            </div>
            <div className="space-x-4">
              <Link to="/auth">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/auth">
                <Button>Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-32">
        <section className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Revolutionize Your Business
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Manage customers, orders, and products effortlessly with our integrated platform.
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/auth?mode=login">
              <Button size="lg" className="text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Customer Management</h3>
              <p className="text-gray-600">
                Track and manage customer information with our intuitive interface.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Order Management</h3>
              <p className="text-gray-600">
                Stay on top of your orders with real-time tracking and updates.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
                <Share2 className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Social Integration</h3>
              <p className="text-gray-600">
                Connect seamlessly with TikTok, Instagram, and other platforms.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">About Us</h4>
              <p className="text-gray-400">
                Empowering businesses with modern management solutions.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Customer Management</li>
                <li>Order Tracking</li>
                <li>Social Media Integration</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@baseti.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 Baseti Social Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}