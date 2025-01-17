import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-gray-400">Effective Date: 1 January 2025</p>
        
        <p>
          <strong>Baseti Group</strong> ("we," "our," "us") respects your privacy and is committed to protecting the personal data you share with us. This Privacy Policy outlines how we collect, use, store, and protect your information when you use our services, website (www.baseti.co.za), and mobile applications.
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Information</strong>: Name, email address, phone number, and any other details you provide when contacting us or registering an account.</li>
            <li><strong>Usage Data</strong>: Information about your interactions with our website and services, such as IP addresses, browser types, and browsing behavior.</li>
            <li><strong>Cookies</strong>: We use cookies to enhance your experience on our website and improve our services.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
          <p>We may use your information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and improve our services.</li>
            <li>To respond to inquiries and support requests.</li>
            <li>To send you promotional materials, updates, and notifications (if you've opted-in).</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Sharing Your Information</h2>
          <p>We will not share your personal data with third parties unless:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You have given us permission to do so.</li>
            <li>We are required by law to disclose it.</li>
            <li>We share it with service providers who assist in our business operations (e.g., payment processors), under strict confidentiality agreements.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your data, but please be aware that no method of data transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access, update, or correct your personal information.</li>
            <li>Request that we delete your personal data.</li>
            <li>Withdraw consent for any communications you receive from us.</li>
          </ul>
          <p>
            For any inquiries or requests regarding your personal information, please contact us at <strong>info@baseti.co.za</strong>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the effective date will be updated.
          </p>
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