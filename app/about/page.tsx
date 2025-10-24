'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Users, Heart, Globe, BookOpen, Target, Award } from 'lucide-react';

export default function AboutPage() {
  const [stats, setStats] = useState({
    stories: 500,
    users: 10000,
    countries: 54,
    languages: 12
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Hero Section */}
      <section className="african-pattern-overlay py-16 lg:py-24" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--color-textPrimary)' }}>
              Preserving African Heritage
              <span className="block" style={{ color: 'var(--color-primary)' }}>
                One Story at a Time
              </span>
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
              Hadithi Platform is dedicated to collecting, preserving, and sharing the rich tapestry 
              of African stories, wisdom, and cultural heritage for current and future generations.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--color-textPrimary)' }}>
                Our Mission
              </h2>
              <p className="text-lg mb-6" style={{ color: 'var(--color-textSecondary)' }}>
                We believe that every story matters, every voice deserves to be heard, and every 
                culture has wisdom to share. Our platform serves as a digital sanctuary where 
                African narratives can flourish and reach global audiences.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target size={20} style={{ color: 'var(--color-primary)' }} className="mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--color-textPrimary)' }}>
                      Cultural Preservation
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      Safeguarding oral traditions and cultural knowledge for future generations
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Globe size={20} style={{ color: 'var(--color-primary)' }} className="mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--color-textPrimary)' }}>
                      Global Reach
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      Connecting African stories with audiences worldwide
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart size={20} style={{ color: 'var(--color-primary)' }} className="mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--color-textPrimary)' }}>
                      Community Building
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                      Creating connections between storytellers and audiences
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/Kikuyu People.jpg"
                alt="African storytelling"
                width={1200}
                height={800}
                className="rounded-lg shadow-lg w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Our Impact
            </h2>
            <p className="text-xl" style={{ color: 'var(--color-textSecondary)' }}>
              Growing community of storytellers and story lovers
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                <BookOpen className="text-white" size={24} />
              </div>
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                {stats.stories.toLocaleString()}+
              </h3>
              <p style={{ color: 'var(--color-textSecondary)' }}>Stories Preserved</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                {stats.users.toLocaleString()}+
              </h3>
              <p style={{ color: 'var(--color-textSecondary)' }}>Community Members</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-success)' }}>
                <Globe className="text-white" size={24} />
              </div>
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                {stats.countries}
              </h3>
              <p style={{ color: 'var(--color-textSecondary)' }}>African Countries</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-info)' }}>
                <Award className="text-white" size={24} />
              </div>
              <h3 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                {stats.languages}
              </h3>
              <p style={{ color: 'var(--color-textSecondary)' }}>Languages Supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
              Our Team
            </h2>
            <p className="text-xl" style={{ color: 'var(--color-textSecondary)' }}>
              Passionate individuals dedicated to preserving African heritage
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Amara Kone',
                role: 'Founder & CEO',
                image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'Cultural anthropologist with 15 years of experience in African heritage preservation.'
              },
              {
                name: 'Kwame Asante',
                role: 'Head of Content',
                image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'Award-winning author and storyteller specializing in West African literature.'
              },
              {
                name: 'Fatima Okafor',
                role: 'Community Manager',
                image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
                bio: 'Digital strategist passionate about connecting communities through storytelling.'
              }
            ].map((member) => (
              <div key={member.name} className="card text-center p-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                <Image 
                  src={member.image} 
                  alt={member.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
                  {member.name}
                </h3>
                <p className="font-medium mb-3" style={{ color: 'var(--color-primary)' }}>
                  {member.role}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}