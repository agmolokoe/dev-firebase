import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the services provided by Baseti Group, you agree to be bound by these Terms of Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Services Description</h2>
          <p>
            We provide business management and social integration tools. Our services include customer management, order processing, and social media integration.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintain accurate account information</li>
            <li>Protect account credentials</li>
            <li>Comply with applicable laws and regulations</li>
            <li>Use services in accordance with these terms</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Contact Information</h2>
          <p>For any questions regarding these terms, please contact us:</p>
          <ul className="space-y-2">
            <li>Email: info@baseti.co.za</li>
            <li>Phone: 0607279246</li>
            <li>Website: baseti.co.za</li>
          </ul>
        </section>

        <div className="pt-8">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}