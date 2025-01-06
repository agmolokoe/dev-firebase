// src/pages/LandingPage.js
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto p-6">
          <h1 className="text-4xl font-bold text-blue-600">Baseti Social Shop</h1>
          <p className="text-gray-600">Empower your business with seamless management tools</p>
        </div>
      </header>
      <main className="container mx-auto py-10">
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Revolutionize Your Business</h2>
          <p className="text-gray-600 mb-6">Manage customers, orders, and products effortlessly.</p>
          <div className="space-x-4">
            <Link to="/login">
              <button className="px-6 py-2 bg-blue-600 text-white rounded">Log In</button>
            </Link>
            <Link to="/signup">
              <button className="px-6 py-2 bg-gray-300 text-blue-600 rounded">Sign Up</button>
            </Link>
          </div>
        </section>
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white shadow rounded text-center">
            <h3 className="text-xl font-bold">Customer Management</h3>
            <p className="text-gray-600">Track and manage customer information seamlessly.</p>
          </div>
          <div className="p-4 bg-white shadow rounded text-center">
            <h3 className="text-xl font-bold">Order Management</h3>
            <p className="text-gray-600">Stay on top of your orders with ease.</p>
          </div>
          <div className="p-4 bg-white shadow rounded text-center">
            <h3 className="text-xl font-bold">Social Media Integration</h3>
            <p className="text-gray-600">Connect with platforms like TikTok and Instagram.</p>
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 text-white p-6 text-center">
        <p>© 2025 Baseti Social Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}
