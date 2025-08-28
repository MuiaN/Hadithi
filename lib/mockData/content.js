// Mock content data
export const content = [
  {
    id: '1',
    title: 'The Golden Stool of Ashanti',
    type: 'story',
    author: 'Kwame Asante',
    authorId: '2',
    description: 'A legendary tale about the sacred Golden Stool that descended from the heavens to unite the Ashanti people.',
    content: `Long ago, when the Ashanti kingdom was young, the great priest Okomfo Anokye gathered the people under the vast sky. As he chanted ancient words, the golden stool descended from the heavens, floating gently into the hands of the first Asantehene.

"This stool," declared Okomfo Anokye, "contains the soul of our nation. As long as it remains with us, the Ashanti people shall never be conquered."

The stool glowed with an inner light, and from that day forward, it became the symbol of unity, strength, and the unbreakable spirit of the Ashanti people. Even today, the Golden Stool remains the most sacred symbol of the Ashanti Kingdom, representing the power and continuity of a proud civilization.`,
    coverImage: 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['folklore', 'ashanti', 'ghana', 'legend'],
    isFree: true,
    subscriptionTier: null,
    status: 'published',
    publishedAt: '2024-01-20T10:00:00.000Z',
    createdAt: '2024-01-18T00:00:00.000Z',
    updatedAt: '2024-01-20T10:00:00.000Z',
    likes: 245,
    views: 1240,
    readingTime: '5 min read'
  },
  {
    id: '2',
    title: 'Ancient Trading Routes of the Sahara',
    type: 'article',
    author: 'Amara Kone',
    authorId: '3',
    description: 'Exploring the historical significance of trans-Saharan trade routes and their impact on African civilizations.',
    content: `The vast Sahara Desert, often perceived as an insurmountable barrier, was actually a highway of commerce that connected sub-Saharan Africa with the Mediterranean world for over a millennium.

The great trading cities of Timbuktu, Gao, and Djenné became centers of learning and commerce, where gold, salt, and slaves were exchanged for horses, textiles, and books. These routes brought not only material wealth but also ideas, religions, and cultural practices that shaped the destiny of African civilizations.

Caravans of hundreds of camels would traverse these dangerous routes, guided by the stars and sustained by the promise of great riches. The legacy of these ancient highways continues to influence modern Africa, reminding us of a time when African kingdoms were among the wealthiest in the world.`,
    coverImage: 'https://images.pexels.com/photos/3568520/pexels-photo-3568520.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['history', 'trade', 'sahara', 'timbuktu'],
    isFree: false,
    subscriptionTier: 'bronze',
    status: 'published',
    publishedAt: '2024-01-25T14:00:00.000Z',
    createdAt: '2024-01-22T00:00:00.000Z',
    updatedAt: '2024-01-25T14:00:00.000Z',
    likes: 189,
    views: 892,
    readingTime: '8 min read'
  },
  {
    id: '3',
    title: 'Ubuntu Philosophy: I Am Because We Are',
    type: 'article',
    author: 'Fatima Okafor',
    authorId: '4',
    description: 'Understanding the profound African philosophy of Ubuntu and its relevance in today\'s interconnected world.',
    content: `Ubuntu, a philosophy that originated in Southern Africa, embodies one of humanity's most profound truths: "I am because we are." This ancient wisdom recognizes that our individual humanity is inextricably linked to the humanity of others.

In the Ubuntu worldview, a person is not an isolated individual but part of a larger community. Our actions, thoughts, and very existence are meaningful only in relation to others. This philosophy has guided African societies for centuries, emphasizing compassion, reciprocity, and mutual aid.

Today, as our world becomes increasingly interconnected, Ubuntu offers valuable insights for addressing global challenges. It reminds us that our well-being depends on the well-being of others, and that true progress comes not from individual achievement but from collective advancement.

The Ubuntu philosophy teaches us that we find ourselves through others, and in recognizing our shared humanity, we discover the path to a more just and compassionate world.`,
    coverImage: 'https://images.pexels.com/photos/6147366/pexels-photo-6147366.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['philosophy', 'ubuntu', 'community', 'wisdom'],
    isFree: false,
    subscriptionTier: 'silver',
    status: 'published',
    publishedAt: '2024-02-01T09:00:00.000Z',
    createdAt: '2024-01-28T00:00:00.000Z',
    updatedAt: '2024-02-01T09:00:00.000Z',
    likes: 312,
    views: 1456,
    readingTime: '6 min read'
  },
  {
    id: '4',
    title: 'The Great Library of Alexandria: African Scholarship',
    type: 'book',
    author: 'Kwame Asante',
    authorId: '2',
    description: 'A comprehensive examination of African scholars and their contributions to the ancient Library of Alexandria.',
    content: `The Great Library of Alexandria, one of history's most celebrated centers of learning, was not merely a Greek or Roman institution. It was a truly multicultural center where African scholars played crucial roles in advancing human knowledge.

Chapter 1: The African Foundations
Alexandria itself was located in Africa, and many of its greatest scholars came from across the continent. Eratosthenes, who calculated the Earth's circumference, worked alongside scholars from Nubia, Ethiopia, and other African regions.

Chapter 2: Mathematical Contributions
African mathematicians contributed significantly to geometry, astronomy, and engineering. The techniques used in building the great monuments of Egypt influenced the architectural marvels of Alexandria.

Chapter 3: Medical Knowledge
Ancient African medical practices, refined over millennia, found their way into the Library's vast collection of healing arts. Egyptian, Nubian, and Ethiopian medical texts formed the foundation of ancient medical knowledge.

Chapter 4: The Lost Knowledge
When the Library declined, much of this African wisdom was scattered across the continent, preserved in oral traditions and hidden manuscripts. Today, we are still discovering the full extent of Africa's contribution to human learning.`,
    coverImage: 'https://images.pexels.com/photos/4577735/pexels-photo-4577735.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['history', 'scholarship', 'alexandria', 'education'],
    isFree: false,
    subscriptionTier: 'gold',
    status: 'published',
    publishedAt: '2024-02-05T11:00:00.000Z',
    createdAt: '2024-01-30T00:00:00.000Z',
    updatedAt: '2024-02-05T11:00:00.000Z',
    likes: 89,
    views: 456,
    readingTime: '25 min read'
  },
  {
    id: '5',
    title: 'Anansi the Spider: Wisdom Keeper',
    type: 'story',
    author: 'Amara Kone',
    authorId: '3',
    description: 'A classic West African folktale about Anansi, the clever spider who brought wisdom to humanity.',
    content: `In the beginning, all the wisdom in the world belonged to Nyame, the Sky God. He kept it locked in a great calabash, high in the heavens, far from the reach of humans and animals.

Anansi the spider, known for his cleverness, looked down at the world and saw how people struggled without wisdom. They could not solve their problems, create beautiful things, or live in harmony. His heart was moved with compassion.

"I must help them," thought Anansi. So he spun a web all the way up to the sky and appeared before Nyame.

"Great Sky God," said Anansi, "the people below need wisdom to live good lives. Will you share it with them?"

Nyame considered this request. "If you can complete three impossible tasks," he said, "I will give you the wisdom to share with humanity."

The tasks seemed impossible: capture the python that could swallow an elephant, bring back the leopard with teeth like spears, and collect the hornets whose sting could fell a tree.

But Anansi was clever. For the python, he cut a long bamboo pole and went to the python's home. "Python," he called, "my wife and I have been arguing about your length. She says you are longer than this pole, but I say you are shorter. Will you help us settle this?"

The proud python stretched himself along the pole, and as soon as he did, Anansi quickly tied him to it with strong vines.

For the leopard, Anansi dug a deep pit and covered it with thin branches and leaves. Then he sat nearby and began to insult the leopard's family. The angry leopard charged and fell into the pit. Anansi threw down a rope and helped him climb out, tying him up in the process.

For the hornets, Anansi found their nest and began to argue with himself loudly. "It's going to rain! No, it's not going to rain!" He splashed water on the hornets and said, "Look, it's already raining! You should come into my gourd to stay dry." The confused hornets flew into his gourd, and he quickly sealed it shut.

When Anansi returned with these prizes, Nyame was amazed. True to his word, he gave Anansi the calabash of wisdom.

But as Anansi climbed down from the sky, carrying the heavy calabash, he slipped and fell. The calabash broke open, and all the wisdom scattered across the world like seeds in the wind.

And that is why, to this day, wisdom can be found everywhere - in every village, in every person, in every corner of the earth. Thanks to Anansi's sacrifice, wisdom belongs to all humanity.

But Anansi kept a little bit of wisdom for himself, which is why spiders are still clever, and why storytellers remember to share Anansi's tales, passing wisdom from one generation to the next.`,
    coverImage: 'https://images.pexels.com/photos/8828431/pexels-photo-8828431.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['folklore', 'anansi', 'wisdom', 'west-africa'],
    isFree: true,
    subscriptionTier: null,
    status: 'published',
    publishedAt: '2024-02-08T16:00:00.000Z',
    createdAt: '2024-02-05T00:00:00.000Z',
    updatedAt: '2024-02-08T16:00:00.000Z',
    likes: 423,
    views: 2341,
    readingTime: '7 min read'
  },
  {
    id: '6',
    title: 'The Rise and Fall of Great Zimbabwe',
    type: 'article',
    author: 'Kwame Asante',
    authorId: '2',
    description: 'Exploring the magnificent stone city that was once the heart of a powerful African empire.',
    content: `Between the 11th and 15th centuries, Great Zimbabwe stood as one of Africa's most impressive civilizations...`,
    coverImage: 'https://images.pexels.com/photos/5214413/pexels-photo-5214413.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['history', 'zimbabwe', 'archaeology', 'empire'],
    isFree: false,
    subscriptionTier: 'bronze',
    status: 'draft',
    publishedAt: null,
    createdAt: '2024-02-10T00:00:00.000Z',
    updatedAt: '2024-02-10T00:00:00.000Z',
    likes: 0,
    views: 0,
    readingTime: '12 min read'
  },
  {
    id: '7',
    title: 'Oral Traditions: The Living Libraries of Africa',
    type: 'article',
    author: 'Amara Kone',
    authorId: '3',
    description: 'How African oral traditions preserve knowledge, history, and wisdom across generations.',
    content: `Oral traditions in Africa are not merely stories told around a fire...`,
    coverImage: 'https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['oral-tradition', 'culture', 'storytelling', 'preservation'],
    isFree: true,
    subscriptionTier: null,
    status: 'in-review',
    publishedAt: null,
    createdAt: '2024-02-12T00:00:00.000Z',
    updatedAt: '2024-02-12T00:00:00.000Z',
    likes: 0,
    views: 0,
    readingTime: '9 min read'
  },
  {
    id: 'p1',
    title: 'Voices of the Ancestors',
    type: 'podcast',
    author: 'Kwame Asante',
    authorId: '2',
    description: 'Exploring ancient African wisdom through oral traditions and storytelling.',
    content: 'In this episode, we dive deep into the oral traditions that have preserved African wisdom for millennia...',
    coverImage: 'https://images.pexels.com/photos/6147366/pexels-photo-6147366.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['oral-tradition', 'wisdom', 'ancestors', 'culture'],
    isFree: true,
    subscriptionTier: null,
    status: 'published',
    publishedAt: '2024-02-15T10:00:00.000Z',
    createdAt: '2024-02-10T00:00:00.000Z',
    updatedAt: '2024-02-15T10:00:00.000Z',
    likes: 89,
    views: 1240,
    readingTime: '45 min listen',
    duration: '45:32',
    audioUrl: '#'
  },
  {
    id: 'p2',
    title: 'Ubuntu Philosophy Today',
    type: 'podcast',
    author: 'Amara Kone',
    authorId: '3',
    description: 'How ancient African philosophy applies to modern community building.',
    content: 'Ubuntu teaches us that we are interconnected. In this episode, we explore how this ancient philosophy...',
    coverImage: 'https://images.pexels.com/photos/7014337/pexels-photo-7014337.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['ubuntu', 'philosophy', 'community', 'modern'],
    isFree: false,
    subscriptionTier: 'bronze',
    status: 'published',
    publishedAt: '2024-02-12T14:00:00.000Z',
    createdAt: '2024-02-08T00:00:00.000Z',
    updatedAt: '2024-02-12T14:00:00.000Z',
    likes: 67,
    views: 892,
    readingTime: '38 min listen',
    duration: '38:15',
    audioUrl: '#'
  }
];

export const comments = [
  {
    id: '1',
    contentId: '1',
    userId: '4',
    userName: 'Fatima Okafor',
    userAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    comment: 'This is a beautiful retelling of the Golden Stool legend. I learned about this in school but this version captures the spiritual significance so well.',
    createdAt: '2024-01-21T14:30:00.000Z',
    likes: 12
  },
  {
    id: '2',
    contentId: '1',
    userId: '3',
    userName: 'Amara Kone',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    comment: 'The way you describe Okomfo Anokye gives me chills! Our ancestors had such powerful wisdom.',
    createdAt: '2024-01-22T09:15:00.000Z',
    likes: 8
  },
  {
    id: '3',
    contentId: '5',
    userId: '4',
    userName: 'Fatima Okafor',
    userAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    comment: 'Anansi stories always teach such profound lessons. Thank you for sharing this complete version - I only knew fragments before.',
    createdAt: '2024-02-09T11:45:00.000Z',
    likes: 15
  }
];