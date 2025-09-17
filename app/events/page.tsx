'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'online' | 'in-person' | 'hybrid';
  category: string;
  image: string;
  attendees: number;
  maxAttendees?: number;
  price: number;
  organizer: string;
  registrationUrl?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    // Mock events data
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'African Storytelling Workshop',
        description: 'Learn traditional African storytelling techniques from master storytellers. This interactive workshop covers oral tradition, narrative structure, and cultural context.',
        date: '2024-03-15',
        time: '14:00',
        location: 'Nairobi Cultural Center',
        type: 'in-person',
        category: 'workshop',
        image: 'https://images.pexels.com/photos/6147366/pexels-photo-6147366.jpeg?auto=compress&cs=tinysrgb&w=800',
        attendees: 45,
        maxAttendees: 60,
        price: 25,
        organizer: 'Hadithi Platform',
        registrationUrl: '#'
      },
      {
        id: '2',
        title: 'Virtual Ubuntu Philosophy Discussion',
        description: 'Join us for an online discussion about Ubuntu philosophy and its relevance in modern society. Featuring guest speakers from across Africa.',
        date: '2024-03-20',
        time: '18:00',
        location: 'Online via Zoom',
        type: 'online',
        category: 'discussion',
        image: 'https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=800',
        attendees: 120,
        maxAttendees: 200,
        price: 0,
        organizer: 'African Philosophy Society',
        registrationUrl: '#'
      },
      {
        id: '3',
        title: 'Griot Tradition Music & Stories Evening',
        description: 'Experience the ancient griot tradition with live music and storytelling. A celebration of West African cultural heritage.',
        date: '2024-03-25',
        time: '19:30',
        location: 'Lagos Arts Center',
        type: 'in-person',
        category: 'performance',
        image: 'https://images.pexels.com/photos/8828431/pexels-photo-8828431.jpeg?auto=compress&cs=tinysrgb&w=800',
        attendees: 80,
        maxAttendees: 150,
        price: 15,
        organizer: 'West African Cultural Foundation',
        registrationUrl: '#'
      },
      {
        id: '4',
        title: 'Digital Preservation of Oral Traditions',
        description: 'A hybrid conference exploring how technology can help preserve African oral traditions for future generations.',
        date: '2024-04-02',
        time: '09:00',
        location: 'Cape Town Convention Center + Online',
        type: 'hybrid',
        category: 'conference',
        image: 'https://images.pexels.com/photos/5214413/pexels-photo-5214413.jpeg?auto=compress&cs=tinysrgb&w=800',
        attendees: 250,
        maxAttendees: 500,
        price: 50,
        organizer: 'Digital Heritage Initiative',
        registrationUrl: '#'
      }
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    if (timeFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        if (timeFilter === 'upcoming') {
          return eventDate >= now;
        } else if (timeFilter === 'past') {
          return eventDate < now;
        }
        return true;
      });
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, typeFilter, timeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'online':
        return 'text-blue-600 bg-blue-100';
      case 'in-person':
        return 'text-green-600 bg-green-100';
      case 'hybrid':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-textPrimary)' }}>
            Events & Workshops
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-textSecondary)' }}>
            Join our community events, workshops, and cultural celebrations to deepen your 
            connection with African heritage and storytelling traditions.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--color-textTertiary)' }} size={20} />
            <input
              type="text"
              placeholder="Search events..."
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

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                Type:
              </span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: 'var(--color-input)',
                  borderColor: 'var(--color-inputBorder)',
                  color: 'var(--color-textPrimary)'
                }}
              >
                <option value="all">All Types</option>
                <option value="online">Online</option>
                <option value="in-person">In Person</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium" style={{ color: 'var(--color-textPrimary)' }}>
                Time:
              </span>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: 'var(--color-input)',
                  borderColor: 'var(--color-inputBorder)',
                  color: 'var(--color-textPrimary)'
                }}
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past Events</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="content-grid">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="card group overflow-hidden transition-all duration-300"
                style={{ backgroundColor: 'var(--color-card)' }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    width={400}
                    height={192}
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(event.type)}`}>
                      {event.type.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-white text-xs font-semibold rounded-full capitalize" style={{ backgroundColor: 'var(--color-primary)' }}>
                      {event.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2" style={{ color: 'var(--color-textPrimary)' }}>
                    {event.title}
                  </h3>
                  
                  <p className="mb-4 line-clamp-3" style={{ color: 'var(--color-textSecondary)' }}>
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4 text-sm" style={{ color: 'var(--color-textSecondary)' }}>
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} />
                      <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={14} />
                      <span>
                        {event.attendees} attending
                        {event.maxAttendees && ` / ${event.maxAttendees} max`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold" style={{ color: 'var(--color-textPrimary)' }}>
                        {event.price === 0 ? 'Free' : `$${event.price}`}
                      </span>
                    </div>
                    
                    <button
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                    >
                      <span>Register</span>
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-backgroundSecondary)' }}>
              <Calendar size={32} style={{ color: 'var(--color-textTertiary)' }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
              No events found
            </h3>
            <p style={{ color: 'var(--color-textSecondary)' }}>
              Try adjusting your search or filter criteria to find events.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}