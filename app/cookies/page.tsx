'use client';

export default function CookiesPage() {
  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Cookie Policy
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-textSecondary)' }}>
            Last updated: February 15, 2024
          </p>
        </div>

        <div className="prose max-w-none space-y-8">
          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              What Are Cookies
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                Cookies are small text files that are stored on your computer or mobile device when 
                you visit our website. They help us provide you with a better experience by remembering 
                your preferences and improving our services.
              </p>
            </div>
          </section>

          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Types of Cookies We Use
            </h2>
            <div className="space-y-6" style={{ color: 'var(--color-textSecondary)' }}>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Essential Cookies
                </h3>
                <p>
                  These cookies are necessary for the website to function properly. They enable basic 
                  functions like page navigation and access to secure areas.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Performance Cookies
                </h3>
                <p>
                  These cookies collect information about how visitors use our website, such as which 
                  pages are visited most often. This data helps us improve our website performance.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Functionality Cookies
                </h3>
                <p>
                  These cookies allow the website to remember choices you make and provide enhanced, 
                  more personal features like remembering your theme preferences.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  Analytics Cookies
                </h3>
                <p>
                  We use analytics cookies to understand how our website is being used and to improve 
                  the user experience. These cookies collect anonymous information.
                </p>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Managing Cookies
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Browser settings: Most browsers allow you to refuse cookies</li>
                <li>Third-party tools: Use privacy tools to manage tracking</li>
                <li>Opt-out links: Use provided opt-out mechanisms</li>
              </ul>
              <p>
                Please note that disabling cookies may affect the functionality of our website.
              </p>
            </div>
          </section>

          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Third-Party Cookies
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                We may use third-party services that place cookies on your device:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Google Analytics for website analytics</li>
                <li>Payment processors for subscription management</li>
                <li>Social media platforms for sharing features</li>
              </ul>
            </div>
          </section>

          <section className="p-6 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Contact Us
            </h2>
            <div style={{ color: 'var(--color-textSecondary)' }}>
              <p>
                If you have any questions about our use of cookies, please contact us at:
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