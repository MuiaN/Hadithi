'use client';

import { useState } from 'react';
import { Search, HelpCircle, BookOpen, Users, Settings, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'All Topics', icon: HelpCircle },
    { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
    { id: 'account', label: 'Account & Profile', icon: Users },
    { id: 'subscription', label: 'Subscription', icon: Settings },
    { id: 'content', label: 'Content & Stories', icon: MessageCircle }
  ];

  const faqItems: FAQItem[] = [
    {
      id: '1',
      category: 'getting-started',
      question: 'How do I get started with Hadithi Platform?',
      answer: 'Simply create a free account to start exploring our collection of African stories. You can browse free content immediately and upgrade to access premium stories and features.'
    },
    {
      id: '2',
      category: 'getting-started',
      question: 'What types of content are available?',
      answer: 'We offer three main types of content: Stories (traditional folktales and contemporary narratives), Articles (analytical pieces and cultural insights), and Books (comprehensive literary works and historical accounts).'
    },
    {
      id: '3',
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Go to your Profile page from the user menu in the top navigation. Click "Edit Profile" to update your name, bio, location, and other details.'
    },
    {
      id: '4',
      category: 'account',
      question: 'Can I change my email address?',
      answer: 'For security reasons, email changes must be requested through our support team. Contact us at contact@hadithi.com with your current and desired email addresses.'
    },
    {
      id: '5',
      category: 'subscription',
      question: 'What are the different subscription tiers?',
      answer: 'We offer Bronze ($9.99/month), Silver ($19.99/month), and Gold ($39.99/month) tiers. Each tier provides access to different levels of premium content, features, and community benefits.'
    },
    {
      id: '6',
      category: 'subscription',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from your Subscription page. You\'ll retain access to premium content until the end of your current billing period.'
    },
    {
      id: '7',
      category: 'content',
      question: 'How can I submit my own stories?',
      answer: 'Create a Creator account and use our content submission portal. All submissions go through an editorial review process to ensure quality and cultural authenticity.'
    },
    {
      id: '8',
      category: 'content',
      question: 'What languages are supported?',
      answer: 'We support content in English, Swahili, French, Arabic, and many other African languages. Our goal is to preserve stories in their original languages while providing translations when possible.'
    }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Help Center
          </h1>
          <p className="text-xl" style={{ color: 'var(--color-textSecondary)' }}>
            Find answers to common questions and get the help you need
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--color-textTertiary)' }} size={20} />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent"
              style={{
                backgroundColor: 'var(--color-input)',
                borderColor: 'var(--color-inputBorder)',
                color: 'var(--color-textPrimary)'
              }}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: selectedCategory === category.id 
                    ? 'var(--color-primary)' 
                    : 'var(--color-backgroundSecondary)',
                  color: selectedCategory === category.id 
                    ? 'white' 
                    : 'var(--color-textPrimary)'
                }}
              >
                <category.icon size={16} />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item) => (
            <div
              key={item.id}
              className="card border rounded-lg overflow-hidden"
              style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
            >
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full p-6 text-left flex items-center justify-between transition-colors"
                style={{ color: 'var(--color-textPrimary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-backgroundSecondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <h3 className="font-semibold text-lg pr-4">
                  {item.question}
                </h3>
                {expandedItems.includes(item.id) ? (
                  <ChevronUp size={20} style={{ color: 'var(--color-primary)' }} />
                ) : (
                  <ChevronDown size={20} style={{ color: 'var(--color-textSecondary)' }} />
                )}
              </button>
              
              {expandedItems.includes(item.id) && (
                <div className="px-6 pb-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="pt-4" style={{ color: 'var(--color-textSecondary)' }}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <HelpCircle size={32} style={{ color: 'var(--color-textTertiary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No help topics found
            </h3>
            <p className="mb-6" style={{ color: 'var(--color-textSecondary)' }}>
              Try adjusting your search or browse different categories.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 text-white font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 p-6 rounded-lg text-center" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
            Still need help?
          </h2>
          <p className="mb-4" style={{ color: 'var(--color-textSecondary)' }}>
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 text-white font-semibold rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}