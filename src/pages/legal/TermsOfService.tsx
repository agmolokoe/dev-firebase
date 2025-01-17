import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-gray-400">Effective Date: 1 January 2025</p>
        
        <p>
          These <strong>Terms of Service</strong> govern your access to and use of the services and website of <strong>Baseti Group</strong> ("we," "our," "us"). By accessing or using our website and services, you agree to comply with these terms.
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Use of Our Services</h2>
          <p>
            You agree to use our website and services only for lawful purposes and in accordance with our terms and applicable laws.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Account Registration</h2>
          <p>
            To access certain features of our services, you may need to register an account. You agree to provide accurate, complete, and up-to-date information when creating your account.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Payment Terms</h2>
          <p>
            If you use paid services on our website, you agree to provide accurate billing information and authorize us to charge the applicable fees to your payment method.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and ensuring that all activity on your account complies with these Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Limitation of Liability</h2>
          <p>
            Baseti Group shall not be liable for any damages, losses, or expenses resulting from your use of our services, except in cases of gross negligence or willful misconduct. We do not guarantee that our website or services will be error-free or uninterrupted.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
          <p>
            All content and materials provided on our website, including but not limited to logos, text, images, and software, are owned by Baseti Group and protected by intellectual property laws. You may not copy, reproduce, or distribute any part of our website without our express permission.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">7. Termination</h2>
          <p>
            We may suspend or terminate your access to our services at any time for violation of these terms or any other reason at our sole discretion.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">8. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of South Africa.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Contact Us</h2>
          <p>For any questions or concerns about these Terms of Service, please contact us at:</p>
          <ul className="space-y-2">
            <li>Phone: 0607279246</li>
            <li>Email: info@baseti.co.za</li>
            <li>Website: www.baseti.co.za</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Changes to These Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Any changes will be posted on this page, and the effective date will be updated.
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