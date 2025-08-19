// Static data fetching for build-time generation
// This replaces API calls during static export

// Mock/static data for build time
// Replace this with your actual static data source
export const STATIC_POSTS = [
  {
    _id: '1',
    title: 'Getting Started with AI Email Marketing',
    desc: 'Learn how to leverage AI for better email marketing campaigns...',
    catSlug: 'ai-marketing',
    slug: 'getting-started-ai-email',
    img: '/p1.jpeg',
    createdAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '2', 
    title: 'AMP Email Best Practices',
    desc: 'Discover the best practices for creating effective AMP emails...',
    catSlug: 'amp-email',
    slug: 'amp-email-best-practices',
    img: '/p1.jpeg',
    createdAt: '2024-01-10T00:00:00.000Z'
  },
  {
    _id: '3',
    title: 'Convertic AI Features Overview',
    desc: 'Explore all the features that make Convertic AI powerful...',
    catSlug: 'product',
    slug: 'convertic-features-overview', 
    img: '/p1.jpeg',
    createdAt: '2024-01-05T00:00:00.000Z'
  },
  {
    _id: '4',
    title: 'Interactive Email Templates',
    desc: 'Create engaging interactive email templates that convert...',
    catSlug: 'ai-marketing',
    slug: 'interactive-email-templates',
    img: '/p1.jpeg',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '5',
    title: 'Email Marketing Analytics',
    desc: 'Track and analyze your email marketing performance...',
    catSlug: 'product',
    slug: 'email-marketing-analytics',
    img: '/p1.jpeg',
    createdAt: '2023-12-25T00:00:00.000Z'
  }
];

export const STATIC_CATEGORIES = [
  { id: '1', slug: 'ai-marketing', title: 'AI Marketing', color: '#3B82F6' },
  { id: '2', slug: 'amp-email', title: 'AMP Email', color: '#EF4444' },
  { id: '3', slug: 'product', title: 'Product', color: '#10B981' }
];

// Static data fetching functions
export const getStaticPosts = (page = 1, category = null) => {
  const POST_PER_PAGE = 5;
  let filteredPosts = STATIC_POSTS;
  
  if (category) {
    filteredPosts = STATIC_POSTS.filter(post => post.catSlug === category);
  }
  
  const startIndex = (page - 1) * POST_PER_PAGE;
  const endIndex = startIndex + POST_PER_PAGE;
  const posts = filteredPosts.slice(startIndex, endIndex);
  
  return {
    posts,
    count: filteredPosts.length
  };
};

export const getStaticCategories = () => {
  return STATIC_CATEGORIES;
};

// For build-time, return empty comments
export const getStaticComments = (postSlug) => {
  return [];
};
