'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Terms of Service
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-textSecondary)' }}>
            Last updated: February 15, 2024
          </p>
        </div>

        <div className="prose max-w-none space-y-8">
          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Acceptance of Terms
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                By accessing and using Hadithi Platform, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
              <p>
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
          </section>

          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              User Accounts
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                To access certain features of our service, you may be required to create an account.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must notify us of any unauthorized use</li>
                <li>One person or entity may not maintain multiple accounts</li>
              </ul>
            </div>
          </section>

          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Content Guidelines
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                Users may submit content that aligns with our mission of preserving African heritage.
              </p>
              <p>Prohibited content includes:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Hate speech or discriminatory content</li>
                <li>Copyrighted material without permission</li>
                <li>Spam or misleading information</li>
                <li>Content that violates local laws</li>
                <li>Personal attacks or harassment</li>
              </ul>
            </div>
          </section>

          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Intellectual Property
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                Content creators retain ownership of their original work while granting us 
                necessary licenses to operate the platform.
              </p>
              <p>
                By submitting content, you grant us a non-exclusive, worldwide, royalty-free 
                license to use, display, and distribute your content on our platform.
              </p>
            </div>
          </section>

          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Subscriptions and Payments
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                Subscription fees are billed in advance on a monthly or annual basis.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>All fees are non-refundable except as required by law</li>
                <li>You may cancel your subscription at any time</li>
                <li>Access continues until the end of your billing period</li>
                <li>Prices may change with 30 days notice</li>
              </ul>
            </div>
          </section>

          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Contact Information
            </h2>
            <div style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-4">
                Email: legal@hadithi.com<br />
                Address: Nairobi, Kenya
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}