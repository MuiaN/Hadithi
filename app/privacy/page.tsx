'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Privacy Policy
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-textSecondary)' }}>
            Last updated: February 15, 2024
          </p>
        </div>

        <div className="prose max-w-none space-y-8">
          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Information We Collect
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                submit content, or contact us for support.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Account information (name, email, password)</li>
                <li>Profile information (bio, location, preferences)</li>
                <li>Content you create and publish</li>
                <li>Comments and interactions with other users</li>
                <li>Usage data and analytics</li>
              </ul>
            </div>
          </section>

          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              How We Use Your Information
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                We use the information we collect to provide, maintain, and improve our services.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Provide and personalize our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Communicate about new features and content</li>
                <li>Monitor and analyze usage patterns</li>
              </ul>
            </div>
          </section>

          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Information Sharing
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </p>
              <p>
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>In connection with a business transfer</li>
              </ul>
            </div>
          </section>

          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Your Rights
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access and update your information</li>
                <li>Delete your account and data</li>
                <li>Opt out of marketing communications</li>
                <li>Request data portability</li>
                <li>Object to processing</li>
              </ul>
            </div>
          </section>

          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Contact Us
            </h2>
            <div style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-4">
                Email: privacy@hadithi.com<br />
                Address: Nairobi, Kenya
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}