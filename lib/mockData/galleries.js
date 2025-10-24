export const mockGalleries = [
  {
    id: '1',
    title: 'African Wildlife',
    description: 'Stunning images of African wildlife in their natural habitat',
    images: [
      {
        url: '/images/1991 Africa, Hwange_04_002.jpg',
        caption: 'Wildlife in Hwange National Park',
        alt: 'African wildlife in Hwange National Park',
      },
      {
        url: '/images/1991 Africa, Savoti - Chobe_03_001.jpg',
        caption: 'Savoti wildlife in Chobe region',
        alt: 'Savoti wildlife in Chobe',
      },
      {
        url: '/images/Pic 5.jpg',
        caption: 'African wildlife scene',
        alt: 'African wildlife',
      },
    ],
    is_published: true,
    created_by: '2',
    created_at: new Date('2024-10-20').toISOString(),
    updated_at: new Date('2024-10-20').toISOString(),
    published_at: new Date('2024-10-20').toISOString(),
    tags: ['wildlife', 'africa', 'animals', 'savanna'],
    view_count: 156,
  },
  {
    id: '2',
    title: 'African Culture & People',
    description: 'Celebrating the rich cultural heritage and people of Africa',
    images: [
      {
        url: '/images/A Nandi herdsman & Queen Mother.jpg',
        caption: 'Nandi herdsman and Queen Mother',
        alt: 'Nandi herdsman and Queen Mother portrait',
      },
      {
        url: '/images/Kikuyu People.jpg',
        caption: 'Kikuyu community members',
        alt: 'Kikuyu people cultural portrait',
      },
      {
        url: '/images/An Old Kikuyu Guard.jpg',
        caption: 'Elderly Kikuyu guard',
        alt: 'Old Kikuyu guard portrait',
      },
    ],
    is_published: true,
    created_by: '3',
    created_at: new Date('2024-10-18').toISOString(),
    updated_at: new Date('2024-10-18').toISOString(),
    published_at: new Date('2024-10-18').toISOString(),
    tags: ['culture', 'people', 'portrait', 'tradition'],
    view_count: 98,
  },
  {
    id: '3',
    title: 'Traditional African Dances',
    description: 'Vibrant traditional dance performances from across Africa',
    images: [
      {
        url: '/images/Some of the 1,200 dancers who took part in the ceremonies in the Independence Arena.jpg',
        caption: 'Mass dance performance at Independence Arena',
        alt: 'Large group of traditional dancers',
      },
      {
        url: '/images/The Karachuonyo Dancers.jpg',
        caption: 'Karachuonyo traditional dancers',
        alt: 'Karachuonyo dance performance',
      },
      {
        url: '/images/Luo dancers from Nyanza.jpg',
        caption: 'Luo dancers from Nyanza region',
        alt: 'Luo traditional dancers',
      },
    ],
    is_published: true,
    created_by: '4',
    created_at: new Date('2024-10-15').toISOString(),
    updated_at: new Date('2024-10-15').toISOString(),
    published_at: new Date('2024-10-15').toISOString(),
    tags: ['dance', 'culture', 'performance', 'tradition'],
    view_count: 72,
  },
  {
    id: '4',
    title: 'African Warriors & Guardians',
    description: 'Traditional warriors and guardians of African communities',
    images: [
      {
        url: '/images/Marakwet warriors.jpg',
        caption: 'Marakwet warriors in traditional attire',
        alt: 'Marakwet warriors portrait',
      },
      {
        url: '/images/An Old Kikuyu Guard.jpg',
        caption: 'Experienced Kikuyu guardian',
        alt: 'Kikuyu guard portrait',
      },
      {
        url: '/images/A Nandi herdsman & Queen Mother.jpg',
        caption: 'Nandi protector and royalty',
        alt: 'Nandi herdsman and Queen Mother',
      },
    ],
    is_published: true,
    created_by: '2',
    created_at: new Date('2024-10-12').toISOString(),
    updated_at: new Date('2024-10-12').toISOString(),
    published_at: new Date('2024-10-12').toISOString(),
    tags: ['warriors', 'guardians', 'tradition', 'culture'],
    view_count: 124,
  },
  {
    id: '5',
    title: 'Daily Life in Africa',
    description: 'Scenes from everyday life across African communities',
    images: [
      {
        url: '/images/Kisumu women balancing eggs.jpg',
        caption: 'Kisumu women skillfully balancing eggs',
        alt: 'Kisumu women with eggs',
      },
      {
        url: '/images/A Nandi herdsman & Queen Mother.jpg',
        caption: 'Daily life of Nandi community',
        alt: 'Nandi herdsman daily life',
      },
      {
        url: '/images/Kikuyu People.jpg',
        caption: 'Kikuyu community daily activities',
        alt: 'Kikuyu people daily life',
      },
    ],
    is_published: true,
    created_by: '3',
    created_at: new Date('2024-10-10').toISOString(),
    updated_at: new Date('2024-10-10').toISOString(),
    published_at: new Date('2024-10-10').toISOString(),
    tags: ['daily life', 'community', 'people', 'culture'],
    view_count: 89,
  },
  {
    id: '6',
    title: 'African Ceremonies & Celebrations',
    description: 'Traditional ceremonies and cultural celebrations across Africa',
    images: [
      {
        url: '/images/Some of the 1,200 dancers who took part in the ceremonies in the Independence Arena.jpg',
        caption: 'Grand ceremony at Independence Arena',
        alt: 'Large ceremonial celebration',
      },
      {
        url: '/images/The Karachuonyo Dancers.jpg',
        caption: 'Cultural celebration with Karachuonyo dancers',
        alt: 'Karachuonyo ceremonial dance',
      },
      {
        url: '/images/Luo dancers from Nyanza.jpg',
        caption: 'Luo ceremonial performance',
        alt: 'Luo ceremony dancers',
      },
    ],
    is_published: true,
    created_by: '4',
    created_at: new Date('2024-10-08').toISOString(),
    updated_at: new Date('2024-10-08').toISOString(),
    published_at: new Date('2024-10-08').toISOString(),
    tags: ['ceremony', 'celebration', 'culture', 'tradition'],
    view_count: 167,
  },
];

export const galleryAuthors = {
  '2': {
    id: '2',
    name: 'Kwame Asante',
    avatar: '/images/An Old Kikuyu Guard.jpg',
  },
  '3': {
    id: '3',
    name: 'Amara Kone',
    avatar: '/images/1991 Africa, Savoti - Chobe_03_001.JPG',
  },
  '4': {
    id: '4',
    name: 'Fatima Okafor',
    avatar: '/images/Kisumu women balancing eggs.jpg',
  },
};