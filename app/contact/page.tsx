'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSending(false);
    setSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 3 seconds
    setTimeout(() => setSent(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Hero Section */}
      <section className="african-pattern-overlay py-16 lg:py-24" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--color-textPrimary)' }}>
              Get in Touch
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
              We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-textPrimary)' }}>
                Contact Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--color-textPrimary)' }}>
                      Email Us
                    </h3>
                    <p style={{ color: 'var(--color-textSecondary)' }}>
                      contact@hadithi.com
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-textTertiary)' }}>
                      We&apos;ll respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--color-textPrimary)' }}>
                      Call Us
                    </h3>
                    <p style={{ color: 'var(--color-textSecondary)' }}>
                      +254 700 123 456
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-textTertiary)' }}>
                      Monday to Friday, 9AM - 6PM EAT
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-success)' }}>
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--color-textPrimary)' }}>
                      Visit Us
                    </h3>
                    <p style={{ color: 'var(--color-textSecondary)' }}>
                      Nairobi, Kenya
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-textTertiary)' }}>
                      By appointment only
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-textPrimary)' }}>
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                    <h4 className="font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      How can I submit my story?
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      Create a creator account and use our submission portal to share your stories with our community.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                    <h4 className="font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      What languages do you support?
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      We support content in English, Swahili, French, Arabic, and many other African languages.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="card p-8" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-textPrimary)' }}>
                  Send us a Message
                </h2>

                {sent && (
                  <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-success)20', border: '1px solid var(--color-success)' }}>
                    <p style={{ color: 'var(--color-success)' }}>
                      Thank you! Your message has been sent successfully.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent"
                        style={{
                          backgroundColor: 'var(--color-input)',
                          borderColor: 'var(--color-inputBorder)',
                          color: 'var(--color-textPrimary)'
                        }}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Subject
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent"
                      style={{
                        backgroundColor: 'var(--color-input)',
                        borderColor: 'var(--color-inputBorder)',
                        color: 'var(--color-textPrimary)'
                      }}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="content">Content Submission</option>
                      <option value="technical">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent"
                      style={{
                        backgroundColor: 'var(--color-input)',
                        borderColor: 'var(--color-inputBorder)',
                        color: 'var(--color-textPrimary)'
                      }}
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                  >
                    {sending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}