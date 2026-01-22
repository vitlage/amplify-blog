'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/footer/Footer';
import styles from './ampElement.module.css';

const ampElementsData = {
  'spin-wheel': {
    title: 'Spin Wheel',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3e%3ccircle cx='12' cy='12' r='8'/%3e%3cpath d='M12 2v7.5M19 5l-5.23 5.23M22 12h-7.5m4.5 7-5.23-5.23M12 14.5V22m-1.77-8.23L5 19m4.5-7H2m8.23-1.77L5 5'/%3e%3ccircle cx='12' cy='12' r='2.5'/%3e%3c/svg%3e",
    description: 'Gamify your email campaigns with interactive spin wheels. Engage customers with fun, interactive experiences that drive conversions and increase engagement.',
    benefits: ['Increase email engagement by 60%', 'Gamify discount distribution', 'Create memorable brand experiences', 'Boost click-through rates', 'Drive impulse purchases'],
    useCases: [
      { title: 'Discount Campaigns', description: 'Let customers spin to win discounts, creating excitement and urgency.' },
      { title: 'Product Launches', description: 'Generate buzz for new products with spin-to-win prizes.' },
      { title: 'Customer Loyalty', description: 'Reward loyal customers with exclusive spin wheel opportunities.' },
      { title: 'Holiday Promotions', description: 'Create festive campaigns with themed spin wheels.' }
    ],
    features: ['Customizable wheel design', 'Multiple prize tiers', 'Probability controls', 'Instant prize delivery', 'Analytics tracking'],
    relatedUseCases: [
      { slug: 'abandoned-cart-recovery', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='m7.21 15.82 15.27-2.86v-8.6H4.15'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='M.52 1.5h2.87L7.2 15.82l-1.66 2.49a1.5 1.5 0 0 0-.24.82 1.46 1.46 0 0 0 1.46 1.46h11.9'/%3e%3ccircle cx='18.66' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3ccircle cx='9.11' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3c/svg%3e", title: 'Abandoned Cart Recovery' },
      { slug: 'shopping-in-email', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M3.41 7.23h17.18v12.41a2.86 2.86 0 0 1-2.86 2.86H6.27a2.86 2.86 0 0 1-2.86-2.86z'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M7.23 10.09V6.27A4.77 4.77 0 0 1 12 1.5a4.77 4.77 0 0 1 4.77 4.77v3.82'/%3e%3c/svg%3e", title: 'Shopping in Email' }
    ]
  },
  'quiz': {
    title: 'Quiz',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M4 6H2v14c0 1.1.9 2 2 2h14v-2H4zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H8V4h12zm-6.49-5.84c.41-.73 1.18-1.16 1.63-1.8.48-.68.21-1.94-1.14-1.94-.88 0-1.32.67-1.5 1.23l-1.37-.57C11.51 5.96 12.52 5 13.99 5c1.23 0 2.08.56 2.51 1.26.37.6.58 1.73.01 2.57-.63.93-1.23 1.21-1.56 1.81-.13.24-.18.4-.18 1.18h-1.52c.01-.41-.06-1.08.26-1.66m-.56 3.79c0-.59.47-1.04 1.05-1.04.59 0 1.04.45 1.04 1.04 0 .58-.44 1.05-1.04 1.05-.58 0-1.05-.47-1.05-1.05'/%3e%3c/svg%3e",
    description: 'Create interactive quizzes directly in email to engage your audience, collect valuable data, and provide personalized recommendations based on responses.',
    benefits: ['Increase engagement rates', 'Collect customer preferences', 'Provide personalized recommendations', 'Segment your audience', 'Educational content delivery'],
    useCases: [
      { title: 'Product Finder', description: 'Help customers find the perfect product through quiz questions.' },
      { title: 'Knowledge Tests', description: 'Test customer knowledge about your brand or industry.' },
      { title: 'Personality Quizzes', description: 'Create fun personality quizzes that recommend products.' },
      { title: 'Feedback Collection', description: 'Gather feedback through interactive quiz format.' }
    ],
    features: ['Multiple question types', 'Conditional logic', 'Personalized results', 'Progress tracking', 'Result sharing'],
    relatedUseCases: [
      { slug: 'product-recommendations', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m6 10.05L15.46 18H7v-7.56L12 5l1 1v.53L12.41 10H18z'/%3e%3c/svg%3e", title: 'Product Recommendations' },
      { slug: 'surveys-and-polls', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' fill-rule='evenodd' d='M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z' clip-rule='evenodd'/%3e%3cpath fill='%234a5fd9' d='M11 7h2v10h-2zm4 6h2v4h-2zm-8-3h2v7H7z'/%3e%3c/svg%3e", title: 'Surveys & Polls' }
    ]
  },
  'accordion': {
    title: 'Accordion',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='M.5 13h23M.5 7.25h23m-23 11.5h12.46'/%3e%3c/svg%3e",
    description: 'Organize content efficiently with expandable accordion sections. Perfect for FAQs, product details, and lengthy content that needs to be digestible.',
    benefits: ['Improve content organization', 'Reduce email length', 'Better mobile experience', 'Increase content consumption', 'Clean, professional design'],
    useCases: [
      { title: 'FAQ Sections', description: 'Present frequently asked questions in an organized, expandable format.' },
      { title: 'Product Specifications', description: 'Show detailed product specs without overwhelming the reader.' },
      { title: 'Event Agendas', description: 'Display event schedules with expandable session details.' },
      { title: 'Pricing Tiers', description: 'Present pricing plans with expandable feature lists.' }
    ],
    features: ['Smooth animations', 'Multiple sections', 'Auto-collapse options', 'Custom styling', 'Mobile optimized'],
    relatedUseCases: [
      { slug: 'event-registration', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 8H3m13-6v3M8 2v3m-.2 17h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 19.72 21 18.88 21 17.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.28 3 7.12 3 8.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 22 6.12 22 7.8 22m4.197-9.67c-.8-.908-2.133-1.153-3.135-.32-1.002.832-1.143 2.223-.356 3.208.571.715 2.153 2.122 2.977 2.839.179.155.268.233.373.264.09.027.192.027.283 0 .104-.03.194-.109.372-.264.824-.717 2.407-2.124 2.978-2.84a2.256 2.256 0 0 0-.356-3.208c-1.02-.823-2.336-.587-3.136.322Z'/%3e%3c/svg%3e", title: 'Event Registration' },
      { slug: 'subscription-management', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2m0 10H4v-8h16zm-10-7.27v6.53L16 16z'/%3e%3c/svg%3e", title: 'Subscription Management' }
    ]
  },
  'score': {
    title: 'Score (1-5)',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m4.635 14.415 1.039-2.203a.357.357 0 0 1 .652 0l1.04 2.203 2.323.356c.298.045.416.429.2.649l-1.68 1.713.396 2.421c.051.311-.26.548-.527.401L6 18.812l-2.078 1.143c-.267.147-.578-.09-.527-.4l.396-2.422-1.68-1.713c-.217-.22-.098-.604.2-.65zm12 0 1.039-2.203a.357.357 0 0 1 .652 0l1.04 2.203 2.323.356c.298.045.416.429.2.649l-1.68 1.713.396 2.421c.051.311-.26.548-.527.401L18 18.812l-2.078 1.143c-.267.147-.578-.09-.527-.4l.396-2.422-1.68-1.713c-.216-.22-.098-.604.2-.65zm-6-9 1.039-2.203a.357.357 0 0 1 .652 0l1.04 2.203 2.323.356c.298.045.416.429.2.649l-1.68 1.713.396 2.421c.051.311-.26.548-.527.401L12 9.812l-2.078 1.143c-.267.147-.578-.09-.527-.4l.396-2.422-1.68-1.713c-.217-.22-.098-.604.2-.65z'/%3e%3c/svg%3e",
    description: 'Collect customer satisfaction ratings with intuitive 1-5 scoring system, from unhappy to happy. Perfect for NPS surveys and feedback collection.',
    benefits: ['Quick feedback collection', 'Visual satisfaction scale', 'High response rates', 'Easy data analysis', 'Customer sentiment tracking'],
    useCases: [
      { title: 'Post-Purchase Feedback', description: 'Collect satisfaction ratings after purchase completion.' },
      { title: 'Service Quality', description: 'Measure customer service experience quality.' },
      { title: 'Product Reviews', description: 'Gather quick product satisfaction scores.' },
      { title: 'Event Feedback', description: 'Collect attendee satisfaction ratings after events.' }
    ],
    features: ['Emoji-based ratings', 'Custom scale labels', 'Follow-up questions', 'Instant submission', 'Analytics dashboard'],
    relatedUseCases: [
      { slug: 'in-email-reviews-and-feedback', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M11.283 3.453c.23-.467.345-.7.502-.775a.5.5 0 0 1 .43 0c.157.075.272.308.502.775l2.187 4.43c.068.138.102.207.152.26a.5.5 0 0 0 .155.114c.067.03.143.042.295.064l4.891.715c.515.075.773.113.892.238a.5.5 0 0 1 .133.41c-.023.172-.21.353-.582.716l-3.54 3.446c-.11.108-.165.162-.2.226a.5.5 0 0 0-.06.183c-.009.072.004.148.03.3l.835 4.867c.088.514.132.77.05.922a.5.5 0 0 1-.349.253c-.17.032-.4-.09-.862-.332l-4.373-2.3c-.136-.07-.204-.107-.276-.12a.5.5 0 0 0-.192 0c-.072.013-.14.05-.276.12l-4.373 2.3c-.461.243-.692.364-.862.332a.5.5 0 0 1-.348-.253c-.083-.152-.039-.409.05-.922l.834-4.867c.026-.152.039-.228.03-.3a.5.5 0 0 0-.06-.184c-.035-.063-.09-.117-.2-.225L3.16 10.4c-.373-.363-.56-.544-.582-.716a.5.5 0 0 1 .132-.41c.12-.125.377-.163.892-.238l4.891-.715c.152-.022.228-.034.295-.064a.5.5 0 0 0 .155-.113c.05-.054.084-.123.152-.26l2.187-4.43Z'/%3e%3c/svg%3e", title: 'In-Email Reviews & Feedback' },
      { slug: 'nps-and-customer-satisfaction', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3e%3cpath d='M4 8h1v8m4-6v4a2 2 0 1 0 4 0v-4a2 2 0 1 0-4 0m7 0v4a2 2 0 1 0 4 0v-4a2 2 0 1 0-4 0'/%3e%3c/svg%3e", title: 'NPS & Customer Satisfaction' },
      { slug: 'surveys-and-polls', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' fill-rule='evenodd' d='M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z' clip-rule='evenodd'/%3e%3cpath fill='%234a5fd9' d='M11 7h2v10h-2zm4 6h2v4h-2zm-8-3h2v7H7z'/%3e%3c/svg%3e", title: 'Surveys & Polls' }
    ]
  },
  'carousel': {
    title: 'Carousel',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3e%3cpath d='M7 6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1zm15 11h-1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1M2 17h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2'/%3e%3c/svg%3e",
    description: 'Showcase multiple products, images, or content pieces in swipeable carousels. Perfect for product catalogs, image galleries, and content collections.',
    benefits: ['Display more content efficiently', 'Increase product discovery', 'Better mobile experience', 'Higher engagement rates', 'Space-efficient design'],
    useCases: [
      { title: 'Product Showcases', description: 'Display multiple products in a compact, browseable format.' },
      { title: 'Image Galleries', description: 'Share photo collections with swipeable navigation.' },
      { title: 'Testimonials', description: 'Rotate through customer testimonials and reviews.' },
      { title: 'Feature Highlights', description: 'Showcase multiple product features or benefits.' }
    ],
    features: ['Touch-enabled swiping', 'Auto-play options', 'Navigation dots', 'Infinite loop', 'Lazy loading'],
    relatedUseCases: [
      { slug: 'shopping-in-email', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M3.41 7.23h17.18v12.41a2.86 2.86 0 0 1-2.86 2.86H6.27a2.86 2.86 0 0 1-2.86-2.86z'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M7.23 10.09V6.27A4.77 4.77 0 0 1 12 1.5a4.77 4.77 0 0 1 4.77 4.77v3.82'/%3e%3c/svg%3e", title: 'Shopping in Email' },
      { slug: 'product-recommendations', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m6 10.05L15.46 18H7v-7.56L12 5l1 1v.53L12.41 10H18z'/%3e%3c/svg%3e", title: 'Product Recommendations' },
      { slug: 'abandoned-cart-recovery', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='m7.21 15.82 15.27-2.86v-8.6H4.15'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='M.52 1.5h2.87L7.2 15.82l-1.66 2.49a1.5 1.5 0 0 0-.24.82 1.46 1.46 0 0 0 1.46 1.46h11.9'/%3e%3ccircle cx='18.66' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3ccircle cx='9.11' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3c/svg%3e", title: 'Abandoned Cart Recovery' },
      { slug: 'product-bundles-and-upsells', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 9.5V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 3 17.88 3 16.2 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21h1.7m7.886-3.289-1.698 3.154c-.278.516-.417.774-.586.84a.5.5 0 0 1-.447-.038c-.155-.096-.247-.374-.43-.93L11.5 12.511c-.16-.486-.241-.73-.183-.892a.5.5 0 0 1 .302-.302c.162-.058.405.022.892.183l8.226 2.724c.556.184.834.276.93.431a.5.5 0 0 1 .039.447c-.067.17-.325.308-.84.586l-3.155 1.698a1 1 0 0 0-.152.09.5.5 0 0 0-.082.083 1 1 0 0 0-.09.152Z'/%3e%3c/svg%3e", title: 'Product Bundles & Upsells' }
    ]
  },
  'checkbox': {
    title: 'Checkbox',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%234a5fd9' viewBox='0 0 24 24'%3e%3cpath d='M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0m8-10C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m5.457 7.457-1.414-1.414L11 13.086l-2.793-2.793-1.414 1.414L11 15.914z'/%3e%3c/svg%3e",
    description: 'Interactive checkboxes for preferences, selections, and multi-choice options. Enable customers to make selections directly within the email.',
    benefits: ['Easy preference management', 'Multi-select capabilities', 'Improved user experience', 'Higher completion rates', 'Instant updates'],
    useCases: [
      { title: 'Preference Centers', description: 'Let users select email preferences and interests.' },
      { title: 'Product Options', description: 'Allow customers to select product variations or add-ons.' },
      { title: 'Survey Responses', description: 'Collect multi-select survey responses.' },
      { title: 'Subscription Management', description: 'Enable users to manage subscription preferences.' }
    ],
    features: ['Custom styling', 'Multi-select support', 'Validation rules', 'Conditional display', 'State persistence'],
    relatedUseCases: [
      { slug: 'shopping-in-email', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M3.41 7.23h17.18v12.41a2.86 2.86 0 0 1-2.86 2.86H6.27a2.86 2.86 0 0 1-2.86-2.86z'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M7.23 10.09V6.27A4.77 4.77 0 0 1 12 1.5a4.77 4.77 0 0 1 4.77 4.77v3.82'/%3e%3c/svg%3e", title: 'Shopping in Email' },
      { slug: 'event-registration', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 8H3m13-6v3M8 2v3m-.2 17h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 19.72 21 18.88 21 17.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.28 3 7.12 3 8.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 22 6.12 22 7.8 22m4.197-9.67c-.8-.908-2.133-1.153-3.135-.32-1.002.832-1.143 2.223-.356 3.208.571.715 2.153 2.122 2.977 2.839.179.155.268.233.373.264.09.027.192.027.283 0 .104-.03.194-.109.372-.264.824-.717 2.407-2.124 2.978-2.84a2.256 2.256 0 0 0-.356-3.208c-1.02-.823-2.336-.587-3.136.322Z'/%3e%3c/svg%3e", title: 'Event Registration' },
      { slug: 'surveys-and-polls', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' fill-rule='evenodd' d='M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z' clip-rule='evenodd'/%3e%3cpath fill='%234a5fd9' d='M11 7h2v10h-2zm4 6h2v4h-2zm-8-3h2v7H7z'/%3e%3c/svg%3e", title: 'Surveys & Polls' },
      { slug: 'subscription-management', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2m0 10H4v-8h16zm-10-7.27v6.53L16 16z'/%3e%3c/svg%3e", title: 'Subscription Management' },
      { slug: 'product-bundles-and-upsells', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 9.5V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 3 17.88 3 16.2 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21h1.7m7.886-3.289-1.698 3.154c-.278.516-.417.774-.586.84a.5.5 0 0 1-.447-.038c-.155-.096-.247-.374-.43-.93L11.5 12.511c-.16-.486-.241-.73-.183-.892a.5.5 0 0 1 .302-.302c.162-.058.405.022.892.183l8.226 2.724c.556.184.834.276.93.431a.5.5 0 0 1 .039.447c-.067.17-.325.308-.84.586l-3.155 1.698a1 1 0 0 0-.152.09.5.5 0 0 0-.082.083 1 1 0 0 0-.09.152Z'/%3e%3c/svg%3e", title: 'Product Bundles & Upsells' }
    ]
  },
  'form': {
    title: 'Form',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M4 9h7V6H4zm0 9h9v-3H4z' opacity='.3'/%3e%3cpath fill='%234a5fd9' d='M13 11H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h9zM4 9h7V6H4zm11 11H4c-1.1 0-2-.9-2-2v-3c0-1.1.9-2 2-2h11zM4 18h9v-3H4zm18-9h-2l2-5h-7v7h2v9zM4.75 17.25h1.5v-1.5h-1.5zm0-9h1.5v-1.5h-1.5z'/%3e%3c/svg%3e",
    description: 'Collect information with interactive forms embedded directly in email. From simple contact forms to complex multi-step forms.',
    benefits: ['Reduce friction', 'Higher conversion rates', 'Data collection in email', 'Better user experience', 'Instant submissions'],
    useCases: [
      { title: 'Contact Forms', description: 'Enable customers to reach out without leaving email.' },
      { title: 'Registration Forms', description: 'Collect event or webinar registrations directly.' },
      { title: 'Lead Generation', description: 'Capture leads with embedded forms.' },
      { title: 'Feedback Forms', description: 'Gather detailed feedback and suggestions.' }
    ],
    features: ['Multiple field types', 'Validation rules', 'Conditional fields', 'File uploads', 'Auto-save drafts'],
    relatedUseCases: [
      { slug: 'shopping-in-email', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M3.41 7.23h17.18v12.41a2.86 2.86 0 0 1-2.86 2.86H6.27a2.86 2.86 0 0 1-2.86-2.86z'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M7.23 10.09V6.27A4.77 4.77 0 0 1 12 1.5a4.77 4.77 0 0 1 4.77 4.77v3.82'/%3e%3c/svg%3e", title: 'Shopping in Email' },
      { slug: 'in-email-reviews-and-feedback', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M11.283 3.453c.23-.467.345-.7.502-.775a.5.5 0 0 1 .43 0c.157.075.272.308.502.775l2.187 4.43c.068.138.102.207.152.26a.5.5 0 0 0 .155.114c.067.03.143.042.295.064l4.891.715c.515.075.773.113.892.238a.5.5 0 0 1 .133.41c-.023.172-.21.353-.582.716l-3.54 3.446c-.11.108-.165.162-.2.226a.5.5 0 0 0-.06.183c-.009.072.004.148.03.3l.835 4.867c.088.514.132.77.05.922a.5.5 0 0 1-.349.253c-.17.032-.4-.09-.862-.332l-4.373-2.3c-.136-.07-.204-.107-.276-.12a.5.5 0 0 0-.192 0c-.072.013-.14.05-.276.12l-4.373 2.3c-.461.243-.692.364-.862.332a.5.5 0 0 1-.348-.253c-.083-.152-.039-.409.05-.922l.834-4.867c.026-.152.039-.228.03-.3a.5.5 0 0 0-.06-.184c-.035-.063-.09-.117-.2-.225L3.16 10.4c-.373-.363-.56-.544-.582-.716a.5.5 0 0 1 .132-.41c.12-.125.377-.163.892-.238l4.891-.715c.152-.022.228-.034.295-.064a.5.5 0 0 0 .155-.113c.05-.054.084-.123.152-.26l2.187-4.43Z'/%3e%3c/svg%3e", title: 'In-Email Reviews & Feedback' },
      { slug: 'event-registration', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 8H3m13-6v3M8 2v3m-.2 17h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 19.72 21 18.88 21 17.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.28 3 7.12 3 8.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 22 6.12 22 7.8 22m4.197-9.67c-.8-.908-2.133-1.153-3.135-.32-1.002.832-1.143 2.223-.356 3.208.571.715 2.153 2.122 2.977 2.839.179.155.268.233.373.264.09.027.192.027.283 0 .104-.03.194-.109.372-.264.824-.717 2.407-2.124 2.978-2.84a2.256 2.256 0 0 0-.356-3.208c-1.02-.823-2.336-.587-3.136.322Z'/%3e%3c/svg%3e", title: 'Event Registration' },
      { slug: 'subscription-management', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2m0 10H4v-8h16zm-10-7.27v6.53L16 16z'/%3e%3c/svg%3e", title: 'Subscription Management' },
      { slug: 'abandoned-cart-recovery', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='m7.21 15.82 15.27-2.86v-8.6H4.15'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='M.52 1.5h2.87L7.2 15.82l-1.66 2.49a1.5 1.5 0 0 0-.24.82 1.46 1.46 0 0 0 1.46 1.46h11.9'/%3e%3ccircle cx='18.66' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3ccircle cx='9.11' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3c/svg%3e", title: 'Abandoned Cart Recovery' }
    ]
  },
  'feedback': {
    title: 'Feedback',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H5.17L4 17.17V4h16zm-9-4h2v2h-2zm0-6h2v4h-2z'/%3e%3c/svg%3e",
    description: 'Let customers leave product reviews and ratings directly in email. Collect authentic feedback without requiring external website visits.',
    benefits: ['Increase review collection', 'Authentic customer feedback', 'Higher response rates', 'Build social proof', 'Improve products'],
    useCases: [
      { title: 'Product Reviews', description: 'Collect detailed product reviews with ratings.' },
      { title: 'Service Feedback', description: 'Gather feedback on service quality and experience.' },
      { title: 'Post-Purchase Reviews', description: 'Request reviews after purchase completion.' },
      { title: 'Feature Requests', description: 'Collect customer suggestions and feature requests.' }
    ],
    features: ['Star ratings', 'Text reviews', 'Photo uploads', 'Verified purchases', 'Moderation tools'],
    relatedUseCases: [
      { slug: 'in-email-reviews-and-feedback', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M11.283 3.453c.23-.467.345-.7.502-.775a.5.5 0 0 1 .43 0c.157.075.272.308.502.775l2.187 4.43c.068.138.102.207.152.26a.5.5 0 0 0 .155.114c.067.03.143.042.295.064l4.891.715c.515.075.773.113.892.238a.5.5 0 0 1 .133.41c-.023.172-.21.353-.582.716l-3.54 3.446c-.11.108-.165.162-.2.226a.5.5 0 0 0-.06.183c-.009.072.004.148.03.3l.835 4.867c.088.514.132.77.05.922a.5.5 0 0 1-.349.253c-.17.032-.4-.09-.862-.332l-4.373-2.3c-.136-.07-.204-.107-.276-.12a.5.5 0 0 0-.192 0c-.072.013-.14.05-.276.12l-4.373 2.3c-.461.243-.692.364-.862.332a.5.5 0 0 1-.348-.253c-.083-.152-.039-.409.05-.922l.834-4.867c.026-.152.039-.228.03-.3a.5.5 0 0 0-.06-.184c-.035-.063-.09-.117-.2-.225L3.16 10.4c-.373-.363-.56-.544-.582-.716a.5.5 0 0 1 .132-.41c.12-.125.377-.163.892-.238l4.891-.715c.152-.022.228-.034.295-.064a.5.5 0 0 0 .155-.113c.05-.054.084-.123.152-.26l2.187-4.43Z'/%3e%3c/svg%3e", title: 'In-Email Reviews & Feedback' },
      { slug: 'nps-and-customer-satisfaction', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3e%3cpath d='M4 8h1v8m4-6v4a2 2 0 1 0 4 0v-4a2 2 0 1 0-4 0m7 0v4a2 2 0 1 0 4 0v-4a2 2 0 1 0-4 0'/%3e%3c/svg%3e", title: 'NPS & Customer Satisfaction' }
    ]
  },
  'poll': {
    title: 'Poll',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' fill-rule='evenodd' d='M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z' clip-rule='evenodd'/%3e%3cpath fill='%234a5fd9' d='M11 7h2v10h-2zm4 6h2v4h-2zm-8-3h2v7H7z'/%3e%3c/svg%3e",
    description: 'Gather opinions with interactive polls and see instant results. Perfect for market research, customer preferences, and engagement.',
    benefits: ['Quick opinion gathering', 'Real-time results', 'High engagement rates', 'Market insights', 'Community building'],
    useCases: [
      { title: 'Product Preferences', description: 'Ask customers about product preferences and features.' },
      { title: 'Content Ideas', description: 'Poll audience for content topics they want to see.' },
      { title: 'Event Planning', description: 'Gather input on event dates, locations, or topics.' },
      { title: 'Brand Decisions', description: 'Involve customers in brand decisions and choices.' }
    ],
    features: ['Multiple choice options', 'Real-time results', 'Result visualization', 'Anonymous voting', 'Time limits'],
    relatedUseCases: [
      { slug: 'surveys-and-polls', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' fill-rule='evenodd' d='M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z' clip-rule='evenodd'/%3e%3cpath fill='%234a5fd9' d='M11 7h2v10h-2zm4 6h2v4h-2zm-8-3h2v7H7z'/%3e%3c/svg%3e", title: 'Surveys & Polls' },
      { slug: 'nps-and-customer-satisfaction', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3e%3cpath d='M4 8h1v8m4-6v4a2 2 0 1 0 4 0v-4a2 2 0 1 0-4 0m7 0v4a2 2 0 1 0 4 0v-4a2 2 0 1 0-4 0'/%3e%3c/svg%3e", title: 'NPS & Customer Satisfaction' }
    ]
  },
  'tinder-products': {
    title: 'Tinder Products',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='M12 2.16s8 3.58 8 10.73-4.47 9-8.95 9a8 8 0 0 1-8-8 9.68 9.68 0 0 1 3.53-7.26 5.9 5.9 0 0 0 1.79 3.58A8 8 0 0 0 12 2.16Z'/%3e%3c/svg%3e",
    description: 'Revolutionary swipe-based product discovery. Let customers swipe through products like Tinder, making e-commerce fun and engaging.',
    benefits: ['Gamified shopping experience', 'Increased product discovery', 'Higher engagement', 'Fun user experience', 'Better product matching'],
    useCases: [
      { title: 'Product Discovery', description: 'Help customers discover products through swipe interactions.' },
      { title: 'Personalized Shopping', description: 'Learn preferences through swipe patterns.' },
      { title: 'New Arrivals', description: 'Showcase new products in an engaging swipe format.' },
      { title: 'Clearance Sales', description: 'Make clearance shopping fun with swipe mechanics.' }
    ],
    features: ['Swipe gestures', 'Like/dislike tracking', 'Preference learning', 'Quick add to cart', 'Match notifications'],
    relatedUseCases: [
      { slug: 'shopping-in-email', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M3.41 7.23h17.18v12.41a2.86 2.86 0 0 1-2.86 2.86H6.27a2.86 2.86 0 0 1-2.86-2.86z'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M7.23 10.09V6.27A4.77 4.77 0 0 1 12 1.5a4.77 4.77 0 0 1 4.77 4.77v3.82'/%3e%3c/svg%3e", title: 'Shopping in Email' },
      { slug: 'product-recommendations', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m6 10.05L15.46 18H7v-7.56L12 5l1 1v.53L12.41 10H18z'/%3e%3c/svg%3e", title: 'Product Recommendations' },
      { slug: 'product-bundles-and-upsells', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 9.5V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 3 17.88 3 16.2 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21h1.7m7.886-3.289-1.698 3.154c-.278.516-.417.774-.586.84a.5.5 0 0 1-.447-.038c-.155-.096-.247-.374-.43-.93L11.5 12.511c-.16-.486-.241-.73-.183-.892a.5.5 0 0 1 .302-.302c.162-.058.405.022.892.183l8.226 2.724c.556.184.834.276.93.431a.5.5 0 0 1 .039.447c-.067.17-.325.308-.84.586l-3.155 1.698a1 1 0 0 0-.152.09.5.5 0 0 0-.082.083 1 1 0 0 0-.09.152Z'/%3e%3c/svg%3e", title: 'Product Bundles & Upsells' }
    ]
  },
  'stories': {
    title: 'Stories',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M16.75 4v16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m-4-2h-9c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 18h-9V4h9zm8-14v12c.83 0 1.5-.67 1.5-1.5v-9c0-.83-.67-1.5-1.5-1.5'/%3e%3c/svg%3e",
    description: 'Instagram-style stories for engaging content delivery. Create immersive, full-screen experiences directly in email.',
    benefits: ['Immersive content experience', 'Higher engagement rates', 'Modern, familiar format', 'Sequential storytelling', 'Mobile-optimized'],
    useCases: [
      { title: 'Product Launches', description: 'Tell product stories in an engaging, sequential format.' },
      { title: 'Behind the Scenes', description: 'Share behind-the-scenes content in story format.' },
      { title: 'Tutorials', description: 'Create step-by-step tutorials as swipeable stories.' },
      { title: 'Brand Stories', description: 'Share brand narratives and values through stories.' }
    ],
    features: ['Full-screen display', 'Tap to advance', 'Progress indicators', 'Auto-advance', 'Interactive elements'],
    relatedUseCases: [
      { slug: 'product-recommendations', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m6 10.05L15.46 18H7v-7.56L12 5l1 1v.53L12.41 10H18z'/%3e%3c/svg%3e", title: 'Product Recommendations' },
      { slug: 'shopping-in-email', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M3.41 7.23h17.18v12.41a2.86 2.86 0 0 1-2.86 2.86H6.27a2.86 2.86 0 0 1-2.86-2.86z'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M7.23 10.09V6.27A4.77 4.77 0 0 1 12 1.5a4.77 4.77 0 0 1 4.77 4.77v3.82'/%3e%3c/svg%3e", title: 'Shopping in Email' }
    ]
  },
  'subscription-portal': {
    title: 'Subscription Portal',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2m0 10H4v-8h16zm-10-7.27v6.53L16 16z'/%3e%3c/svg%3e",
    description: 'Provide an in-email dashboard where subscribers can manage their entire subscription - skip deliveries, pause, update frequency, or cancel - all without leaving their inbox.',
    benefits: ['Reduce support tickets', 'Improve retention rates', 'Enhance user experience', 'Increase customer control', 'Lower cancellation rates'],
    useCases: [
      { title: 'Delivery Management', description: 'Let subscribers skip, pause, or reschedule deliveries.' },
      { title: 'Frequency Control', description: 'Allow customers to adjust delivery frequency.' },
      { title: 'Payment Updates', description: 'Enable payment method updates directly in email.' },
      { title: 'Address Changes', description: 'Let subscribers update shipping addresses easily.' }
    ],
    features: ['Full subscription dashboard', 'Skip/pause options', 'Frequency adjustment', 'Cancellation flow', 'Order history view'],
    relatedUseCases: [
      { slug: 'subscription-management', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2m0 10H4v-8h16zm-10-7.27v6.53L16 16z'/%3e%3c/svg%3e", title: 'Subscription Management' }
    ]
  },
  'reactivate': {
    title: 'Reactivate',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M17 18.875A8.5 8.5 0 0 0 12 3.5h-.5m.5 17A8.5 8.5 0 0 1 7 5.125M11 22.4l2-2-2-2m2-12.8-2-2 2-2'/%3e%3c/svg%3e",
    description: 'Win back inactive or canceled customers with a one-click "resume subscription" widget. Make it effortless for customers to restart their subscription directly from email.',
    benefits: ['Recover lost revenue', 'Re-engage churned customers', 'Reduce reactivation friction', 'Increase lifetime value', 'Simple win-back campaigns'],
    useCases: [
      { title: 'Win-Back Campaigns', description: 'Reactivate canceled subscriptions with special offers.' },
      { title: 'Pause Recovery', description: 'Remind paused subscribers to resume their subscription.' },
      { title: 'Seasonal Reactivation', description: 'Bring back customers for seasonal products.' },
      { title: 'New Product Launch', description: 'Reactivate with announcements of new products.' }
    ],
    features: ['One-click reactivation', 'Special offer integration', 'Preference retention', 'Instant confirmation', 'Incentive display'],
    relatedUseCases: [
      { slug: 'subscription-management', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2m0 10H4v-8h16zm-10-7.27v6.53L16 16z'/%3e%3c/svg%3e", title: 'Subscription Management' },
      { slug: 'abandoned-cart-recovery', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='m7.21 15.82 15.27-2.86v-8.6H4.15'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='M.52 1.5h2.87L7.2 15.82l-1.66 2.49a1.5 1.5 0 0 0-.24.82 1.46 1.46 0 0 0 1.46 1.46h11.9'/%3e%3ccircle cx='18.66' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3ccircle cx='9.11' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3c/svg%3e", title: 'Abandoned Cart Recovery' }
    ]
  },
  'action-button': {
    title: 'Action Button',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M22 8v6c0 1.1-.9 2-2 2h-1v-2h1V8H4v6h6v2H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2m-7.5 10 1.09-2.41L18 14.5l-2.41-1.09L14.5 11l-1.09 2.41L11 14.5l2.41 1.09zm2.5-5 .62-1.38L19 11l-1.38-.62L17 9l-.62 1.38L15 11l1.38.62zm-2.5 5 1.09-2.41L18 14.5l-2.41-1.09L14.5 11l-1.09 2.41L11 14.5l2.41 1.09zm2.5-5 .62-1.38L19 11l-1.38-.62L17 9l-.62 1.38L15 11l1.38.62z'/%3e%3c/svg%3e",
    description: 'A flexible, powerful CTA button that can trigger various AMP actions - toggle sections, submit forms, confirm interactions, or update preferences - all within the email.',
    benefits: ['Versatile functionality', 'Improved interactivity', 'Better user engagement', 'Reduced friction', 'Multiple use cases'],
    useCases: [
      { title: 'Form Submission', description: 'Submit forms and collect data without page redirects.' },
      { title: 'Content Toggle', description: 'Show or hide content sections with button clicks.' },
      { title: 'Preference Updates', description: 'Update user preferences instantly.' },
      { title: 'Confirmation Actions', description: 'Confirm attendance, RSVPs, or selections.' }
    ],
    features: ['Custom actions', 'Visual feedback', 'Loading states', 'Success messages', 'Error handling'],
    relatedUseCases: [
      { slug: 'event-registration', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 8H3m13-6v3M8 2v3m-.2 17h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 19.72 21 18.88 21 17.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.28 3 7.12 3 8.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 22 6.12 22 7.8 22m4.197-9.67c-.8-.908-2.133-1.153-3.135-.32-1.002.832-1.143 2.223-.356 3.208.571.715 2.153 2.122 2.977 2.839.179.155.268.233.373.264.09.027.192.027.283 0 .104-.03.194-.109.372-.264.824-.717 2.407-2.124 2.978-2.84a2.256 2.256 0 0 0-.356-3.208c-1.02-.823-2.336-.587-3.136.322Z'/%3e%3c/svg%3e", title: 'Event Registration' },
      { slug: 'subscription-management', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2m0 10H4v-8h16zm-10-7.27v6.53L16 16z'/%3e%3c/svg%3e", title: 'Subscription Management' },
      { slug: 'surveys-and-polls', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' fill-rule='evenodd' d='M19 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z' clip-rule='evenodd'/%3e%3cpath fill='%234a5fd9' d='M11 7h2v10h-2zm4 6h2v4h-2zm-8-3h2v7H7z'/%3e%3c/svg%3e", title: 'Surveys & Polls' }
    ]
  },
  'review-collection': {
    title: 'Review Collection',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M6 10c0-.83.67-1.5 1.5-1.5S9 9.17 9 10s-.67 1.5-1.5 1.5S6 10.83 6 10m5 8c2.33 0 4.31-1.46 5.11-3.5H5.89C6.69 16.54 8.67 18 11 18m3.5-6.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S13 9.17 13 10s.67 1.5 1.5 1.5m6.5-10h-2v2h-2v2h2v2h2v-2h2v-2h-2zm-2 11c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8c1.46 0 2.82.4 4 1.08V3.34a9.9 9.9 0 0 0-4.01-.84C5.47 2.5 1 6.98 1 12.5s4.47 10 9.99 10c5.53 0 10.01-4.48 10.01-10 0-1.05-.17-2.05-.47-3H18.4c.38.93.6 1.94.6 3'/%3e%3c/svg%3e",
    description: 'Collect authentic customer reviews with star ratings and comments directly in email. Seamlessly integrate with your review platform to build social proof.',
    benefits: ['Increase review collection', 'Build social proof', 'Higher response rates', 'Authentic feedback', 'Platform integration'],
    useCases: [
      { title: 'Post-Purchase Reviews', description: 'Collect product reviews after purchase completion.' },
      { title: 'Service Feedback', description: 'Gather feedback on service quality and experience.' },
      { title: 'Platform Integration', description: 'Send reviews directly to Trustpilot, Google, etc.' },
      { title: 'Incentivized Reviews', description: 'Offer rewards for leaving detailed reviews.' }
    ],
    features: ['Star rating system', 'Text comments', 'Photo uploads', 'Platform sync', 'Review moderation'],
    relatedUseCases: [
      { slug: 'in-email-reviews-and-feedback', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M11.283 3.453c.23-.467.345-.7.502-.775a.5.5 0 0 1 .43 0c.157.075.272.308.502.775l2.187 4.43c.068.138.102.207.152.26a.5.5 0 0 0 .155.114c.067.03.143.042.295.064l4.891.715c.515.075.773.113.892.238a.5.5 0 0 1 .133.41c-.023.172-.21.353-.582.716l-3.54 3.446c-.11.108-.165.162-.2.226a.5.5 0 0 0-.06.183c-.009.072.004.148.03.3l.835 4.867c.088.514.132.77.05.922a.5.5 0 0 1-.349.253c-.17.032-.4-.09-.862-.332l-4.373-2.3c-.136-.07-.204-.107-.276-.12a.5.5 0 0 0-.192 0c-.072.013-.14.05-.276.12l-4.373 2.3c-.461.243-.692.364-.862.332a.5.5 0 0 1-.348-.253c-.083-.152-.039-.409.05-.922l.834-4.867c.026-.152.039-.228.03-.3a.5.5 0 0 0-.06-.184c-.035-.063-.09-.117-.2-.225L3.16 10.4c-.373-.363-.56-.544-.582-.716a.5.5 0 0 1 .132-.41c.12-.125.377-.163.892-.238l4.891-.715c.152-.022.228-.034.295-.064a.5.5 0 0 0 .155-.113c.05-.054.084-.123.152-.26l2.187-4.43Z'/%3e%3c/svg%3e", title: 'In-Email Reviews & Feedback' },
      { slug: 'nps-and-customer-satisfaction', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3e%3cpath d='M4 8h1v8m4-6v4a2 2 0 1 0 4 0v-4a2 2 0 1 0-4 0m7 0v4a2 2 0 1 0 4 0v-4a2 2 0 1 0-4 0'/%3e%3c/svg%3e", title: 'NPS & Customer Satisfaction' }
    ]
  },
  'flip-to-reveal': {
    title: 'Flip To Reveal',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' fill-opacity='.5' d='M17 18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-3H5v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3h-2z'/%3e%3cpath fill='%234a5fd9' d='M16 5a1 1 0 0 1 1 1v3h2V6a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v3h2V6a1 1 0 0 1 1-1zm5 8v-2H3v2z'/%3e%3c/svg%3e",
    description: 'Add gamification with animated flip cards that reveal hidden content - surprise discounts, special messages, or exclusive offers. Create memorable, engaging email experiences.',
    benefits: ['Gamified experience', 'Increased engagement', 'Memorable interactions', 'Higher click rates', 'Fun user experience'],
    useCases: [
      { title: 'Discount Reveals', description: 'Hide discount codes behind flip cards for surprise factor.' },
      { title: 'Product Features', description: 'Reveal product benefits with interactive flip animations.' },
      { title: 'Mystery Offers', description: 'Create excitement with mystery offer reveals.' },
      { title: 'Educational Content', description: 'Use flip cards for tips, facts, or tutorials.' }
    ],
    features: ['Smooth animations', 'Custom card designs', 'Front/back content', 'Auto-flip options', 'Mobile optimized'],
    relatedUseCases: [
      { slug: 'shopping-in-email', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M3.41 7.23h17.18v12.41a2.86 2.86 0 0 1-2.86 2.86H6.27a2.86 2.86 0 0 1-2.86-2.86z'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M7.23 10.09V6.27A4.77 4.77 0 0 1 12 1.5a4.77 4.77 0 0 1 4.77 4.77v3.82'/%3e%3c/svg%3e", title: 'Shopping in Email' },
      { slug: 'abandoned-cart-recovery', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='m7.21 15.82 15.27-2.86v-8.6H4.15'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='M.52 1.5h2.87L7.2 15.82l-1.66 2.49a1.5 1.5 0 0 0-.24.82 1.46 1.46 0 0 0 1.46 1.46h11.9'/%3e%3ccircle cx='18.66' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3ccircle cx='9.11' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3c/svg%3e", title: 'Abandoned Cart Recovery' }
    ]
  },
  'click-to-reveal': {
    title: 'Click To Reveal',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 32 32'%3e%3cpath fill='%234a5fd9' d='M11.5 3V2a.5.5 0 0 1 1 0v1a.5.5 0 1 1-1 0M2 12.5h1a.5.5 0 0 0 0-1H2a.5.5 0 0 0 0 1m13.776-8.052a.5.5 0 0 0 .671-.224l1-2a.5.5 0 1 0-.895-.448l-1 2a.5.5 0 0 0 .224.672m-12 11.105-2 1a.5.5 0 0 0 .448.895l2-1a.5.5 0 1 0-.448-.896m23.285 7.8a1.5 1.5 0 0 1 0 2.126l-1.586 1.582a1.5 1.5 0 0 1-2.125 0l-6.414-6.413a.49.49 0 0 0-.447-.14.5.5 0 0 0-.362.285l-2.222 5.788-.009.02a1.48 1.48 0 0 1-1.364.899h-.073a1.485 1.485 0 0 1-1.35-1.029L4.575 6.46A1.5 1.5 0 0 1 6.46 4.575l20.01 6.534a1.5 1.5 0 0 1 .13 2.791l-.02.009-5.789 2.222a.5.5 0 0 0-.146.809zm-.707.708-6.414-6.415a1.5 1.5 0 0 1 .462-2.436l.02-.008 5.79-2.223a.493.493 0 0 0-.053-.919L6.149 5.526a.5.5 0 0 0-.624.625L12.06 26.16a.5.5 0 0 0 .92.052l2.222-5.788.01-.02a1.5 1.5 0 0 1 2.435-.462l6.414 6.414a.5.5 0 0 0 .706 0l1.587-1.586a.5.5 0 0 0 0-.708'/%3e%3c/svg%3e",
    description: 'Hide content initially and let users click to uncover it. Perfect for coupon codes, exclusive content, or creating curiosity-driven engagement.',
    benefits: ['Create curiosity', 'Increase engagement', 'Protect sensitive content', 'Track interactions', 'Build anticipation'],
    useCases: [
      { title: 'Coupon Codes', description: 'Hide discount codes until users click to reveal.' },
      { title: 'Exclusive Content', description: 'Gate premium content behind click-to-reveal.' },
      { title: 'Surprise Offers', description: 'Build anticipation with hidden special offers.' },
      { title: 'Contest Results', description: 'Reveal contest winners or results interactively.' }
    ],
    features: ['Click interaction', 'Blur effects', 'Custom reveal animations', 'Content protection', 'Analytics tracking'],
    relatedUseCases: [
      { slug: 'shopping-in-email', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M3.41 7.23h17.18v12.41a2.86 2.86 0 0 1-2.86 2.86H6.27a2.86 2.86 0 0 1-2.86-2.86z'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M7.23 10.09V6.27A4.77 4.77 0 0 1 12 1.5a4.77 4.77 0 0 1 4.77 4.77v3.82'/%3e%3c/svg%3e", title: 'Shopping in Email' },
      { slug: 'abandoned-cart-recovery', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='m7.21 15.82 15.27-2.86v-8.6H4.15'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='M.52 1.5h2.87L7.2 15.82l-1.66 2.49a1.5 1.5 0 0 0-.24.82 1.46 1.46 0 0 0 1.46 1.46h11.9'/%3e%3ccircle cx='18.66' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3ccircle cx='9.11' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3c/svg%3e", title: 'Abandoned Cart Recovery' }
    ]
  },
  'image-carousel': {
    title: 'Image Carousel',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24'%3e%3cpath d='m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16'/%3e%3cpath d='M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2'/%3e%3ccircle cx='13' cy='7' r='1' fill='%234a5fd9'/%3e%3crect width='14' height='14' x='8' y='2' rx='2'/%3e%3c/svg%3e",
    description: 'Display multiple product or campaign images in a swipeable gallery inside the email. Perfect for showcasing product collections, lookbooks, or visual storytelling.',
    benefits: ['Showcase more content', 'Visual storytelling', 'Better product display', 'Space efficient', 'Mobile friendly'],
    useCases: [
      { title: 'Product Galleries', description: 'Show multiple product images in swipeable format.' },
      { title: 'Lookbooks', description: 'Create fashion lookbooks with image carousels.' },
      { title: 'Before/After', description: 'Display transformation or comparison images.' },
      { title: 'Event Photos', description: 'Share event or campaign photo galleries.' }
    ],
    features: ['Touch swiping', 'Navigation arrows', 'Image zoom', 'Lazy loading', 'Caption support'],
    relatedUseCases: [
      { slug: 'shopping-in-email', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M3.41 7.23h17.18v12.41a2.86 2.86 0 0 1-2.86 2.86H6.27a2.86 2.86 0 0 1-2.86-2.86z'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M7.23 10.09V6.27A4.77 4.77 0 0 1 12 1.5a4.77 4.77 0 0 1 4.77 4.77v3.82'/%3e%3c/svg%3e", title: 'Shopping in Email' },
      { slug: 'product-recommendations', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m6 10.05L15.46 18H7v-7.56L12 5l1 1v.53L12.41 10H18z'/%3e%3c/svg%3e", title: 'Product Recommendations' }
    ]
  },
  'sms-capture': {
    title: 'SMS Capture',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M7.5 12h.01M12 12h.01m4.49 0h.01M12 21a9 9 0 1 0-8.342-5.616c.081.2.122.3.14.381a1 1 0 0 1 .024.219c0 .083-.015.173-.045.353l-.593 3.558c-.062.373-.093.56-.035.694a.5.5 0 0 0 .262.262c.135.058.321.027.694-.035l3.558-.593c.18-.03.27-.045.353-.045.081 0 .14.006.219.024.08.018.18.059.38.14A9 9 0 0 0 12 21m-4-9a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m4.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m4.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0'/%3e%3c/svg%3e",
    description: 'Gather customer phone numbers for SMS opt-in directly in email. Build your SMS marketing list with compliant, easy-to-use phone number collection.',
    benefits: ['Grow SMS list', 'Multi-channel marketing', 'Higher opt-in rates', 'Compliant collection', 'Instant verification'],
    useCases: [
      { title: 'SMS List Building', description: 'Collect phone numbers for SMS marketing campaigns.' },
      { title: 'Order Updates', description: 'Gather numbers for shipping and delivery notifications.' },
      { title: 'Exclusive Offers', description: 'Offer SMS-exclusive deals to encourage opt-in.' },
      { title: 'Two-Factor Auth', description: 'Collect numbers for account security features.' }
    ],
    features: ['Phone validation', 'Country code support', 'Opt-in confirmation', 'Privacy compliance', 'Instant sync'],
    relatedUseCases: [
      { slug: 'subscription-management', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2m0 10H4v-8h16zm-10-7.27v6.53L16 16z'/%3e%3c/svg%3e", title: 'Subscription Management' },
      { slug: 'event-registration', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 8H3m13-6v3M8 2v3m-.2 17h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 19.72 21 18.88 21 17.2V8.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 6.28 3 7.12 3 8.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 22 6.12 22 7.8 22m4.197-9.67c-.8-.908-2.133-1.153-3.135-.32-1.002.832-1.143 2.223-.356 3.208.571.715 2.153 2.122 2.977 2.839.179.155.268.233.373.264.09.027.192.027.283 0 .104-.03.194-.109.372-.264.824-.717 2.407-2.124 2.978-2.84a2.256 2.256 0 0 0-.356-3.208c-1.02-.823-2.336-.587-3.136.322Z'/%3e%3c/svg%3e", title: 'Event Registration' }
    ]
  },
  'product-block': {
    title: 'Product Block',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='M18.68 1.5H5.32L1.5 8.18V22.5h21V8.18zM4.36 18.68h3.82M12 1.5V12M1.5 8.18h21' data-name='package 1'/%3e%3c/svg%3e",
    description: 'Showcase a single product with image, name, price, and an in-email "add to cart" or "shop now" option. Perfect for featured products or personalized recommendations.',
    benefits: ['Direct product showcase', 'In-email purchasing', 'Clean presentation', 'Quick add to cart', 'Conversion focused'],
    useCases: [
      { title: 'Featured Products', description: 'Highlight hero products with detailed blocks.' },
      { title: 'Personalized Picks', description: 'Show individually recommended products.' },
      { title: 'New Arrivals', description: 'Showcase latest product launches.' },
      { title: 'Best Sellers', description: 'Feature top-selling products prominently.' }
    ],
    features: ['Product image', 'Price display', 'Add to cart', 'Quick view', 'Stock status'],
    relatedUseCases: [
      { slug: 'shopping-in-email', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M3.41 7.23h17.18v12.41a2.86 2.86 0 0 1-2.86 2.86H6.27a2.86 2.86 0 0 1-2.86-2.86z'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M7.23 10.09V6.27A4.77 4.77 0 0 1 12 1.5a4.77 4.77 0 0 1 4.77 4.77v3.82'/%3e%3c/svg%3e", title: 'Shopping in Email' },
      { slug: 'product-recommendations', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m6 10.05L15.46 18H7v-7.56L12 5l1 1v.53L12.41 10H18z'/%3e%3c/svg%3e", title: 'Product Recommendations' },
      { slug: 'abandoned-cart-recovery', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='m7.21 15.82 15.27-2.86v-8.6H4.15'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5' d='M.52 1.5h2.87L7.2 15.82l-1.66 2.49a1.5 1.5 0 0 0-.24.82 1.46 1.46 0 0 0 1.46 1.46h11.9'/%3e%3ccircle cx='18.66' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3ccircle cx='9.11' cy='21.55' r='.95' fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.5'/%3e%3c/svg%3e", title: 'Abandoned Cart Recovery' }
    ]
  },
  'product-grid': {
    title: 'Product Grid',
    icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 32 32'%3e%3cpath fill='%234a5fd9' d='M27 6.5H5A1.5 1.5 0 0 0 3.5 8v16A1.5 1.5 0 0 0 5 25.5h22a1.5 1.5 0 0 0 1.5-1.5V8A1.5 1.5 0 0 0 27 6.5m-14.5 12v-5h7v5zm7 1v5h-7v-5zm-15-6h7v5h-7zm8-1v-5h7v5zm8 1h7v5h-7zm7-5.5v4.5h-7v-5H27a.5.5 0 0 1 .5.5M5 7.5h6.5v5h-7V8a.5.5 0 0 1 .5-.5M4.5 24v-4.5h7v5H5a.5.5 0 0 1-.5-.5m22.5.5h-6.5v-5h7V24a.5.5 0 0 1-.5.5'/%3e%3c/svg%3e",
    description: 'Arrange multiple product blocks into a grid layout, ideal for showcasing collections, categories, or curated selections. Create a mini-shop experience in email.',
    benefits: ['Display multiple products', 'Collection showcase', 'Organized layout', 'Easy browsing', 'Higher discovery'],
    useCases: [
      { title: 'Collection Showcase', description: 'Display entire product collections in grid format.' },
      { title: 'Category Browse', description: 'Show products from specific categories.' },
      { title: 'Sale Items', description: 'Feature sale or clearance products in grid.' },
      { title: 'Curated Selections', description: 'Present hand-picked product assortments.' }
    ],
    features: ['Responsive grid', 'Multiple columns', 'Uniform sizing', 'Quick actions', 'Filter options'],
    relatedUseCases: [
      { slug: 'shopping-in-email', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' data-name='Layer 1' viewBox='0 0 24 24'%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M3.41 7.23h17.18v12.41a2.86 2.86 0 0 1-2.86 2.86H6.27a2.86 2.86 0 0 1-2.86-2.86z'/%3e%3cpath fill='none' stroke='%234a5fd9' stroke-miterlimit='10' stroke-width='1.75' d='M7.23 10.09V6.27A4.77 4.77 0 0 1 12 1.5a4.77 4.77 0 0 1 4.77 4.77v3.82'/%3e%3c/svg%3e", title: 'Shopping in Email' },
      { slug: 'product-recommendations', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath fill='%234a5fd9' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m6 10.05L15.46 18H7v-7.56L12 5l1 1v.53L12.41 10H18z'/%3e%3c/svg%3e", title: 'Product Recommendations' },
      { slug: 'product-bundles-and-upsells', icon: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3e%3cpath stroke='%234a5fd9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M21 9.5V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 3 17.88 3 16.2 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21h1.7m7.886-3.289-1.698 3.154c-.278.516-.417.774-.586.84a.5.5 0 0 1-.447-.038c-.155-.096-.247-.374-.43-.93L11.5 12.511c-.16-.486-.241-.73-.183-.892a.5.5 0 0 1 .302-.302c.162-.058.405.022.892.183l8.226 2.724c.556.184.834.276.93.431a.5.5 0 0 1 .039.447c-.067.17-.325.308-.84.586l-3.155 1.698a1 1 0 0 0-.152.09.5.5 0 0 0-.082.083 1 1 0 0 0-.09.152Z'/%3e%3c/svg%3e", title: 'Product Bundles & Upsells' }
    ]
  }
};

export default function AmpElementDetail() {
  const params = useParams();
  const slug = params.slug;
  const element = ampElementsData[slug];

  if (!element) {
    return (
      <>
        <NavBar />
        <div className="container">
          <div className={styles.wrapper}>
            <h1>AMP Element Not Found</h1>
            <p>The AMP element you're looking for doesn't exist.</p>
            <a href="/use-cases">Back to Use Cases</a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className={styles.navbarWrapper}>
        <div className="container-fluid">
          <div className="container">
            <NavBar />
          </div>
        </div>
      </div>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.icon}>
              {element.icon.startsWith('data:image') ? (
                <img src={element.icon} alt={element.title} style={{ width: '48px', height: '48px' }} />
              ) : (
                element.icon
              )}
            </div>
            <h1 className={styles.title}>{element.title}</h1>
            <p className={styles.description}>{element.description}</p>
          </div>

          <div className={styles.benefitsUseCasesContainer}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Key Benefits</h2>
              <ul className={styles.benefitsList}>
                {element.benefits.map((benefit, idx) => (
                  <li key={idx} className={styles.benefit}>
                    <span className={styles.checkmark}>
                      <svg width="12" height="11" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.00378 0.445204L3.80248 6.06595L1.9908 3.694C1.80952 3.45846 1.54314 3.30542 1.25029 3.26852C0.957432 3.23163 0.66208 3.31391 0.429207 3.49727C0.196333 3.68063 0.0450134 3.95004 0.00853663 4.24624C-0.0279401 4.54244 0.0534138 4.84117 0.234701 5.0767L2.93554 8.57281C3.04021 8.70678 3.17368 8.81488 3.32582 8.8889C3.47796 8.96291 3.64477 9.0009 3.81359 8.99998C3.98333 8.99957 4.15072 8.95984 4.30293 8.88385C4.45513 8.80785 4.5881 8.6976 4.69164 8.56156L9.771 1.81667C9.95082 1.57815 10.0296 1.27716 9.98998 0.979906C9.95038 0.682651 9.79564 0.413482 9.55982 0.231615C9.324 0.0497478 9.02641 -0.0299211 8.73251 0.0101345C8.43861 0.0501901 8.17248 0.20669 7.99267 0.445204H8.00378Z" fill="#ED5370"/>
                      </svg>
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Use Cases</h2>
              <div className={styles.useCasesGrid}>
                {element.useCases.map((useCase, idx) => (
                  <div key={idx} className={styles.useCaseCard}>
                    <h3 className={styles.useCaseTitle}>{useCase.title}</h3>
                    <p className={styles.useCaseDescription}>{useCase.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Features</h2>
            <div className={styles.featuresList}>
              {element.features.map((feature, idx) => (
                <div key={idx} className={styles.featureItem}>
                  <span className={styles.featureIcon}>✨</span>
                  <span className={styles.featureText}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {element.relatedUseCases && element.relatedUseCases.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Perfect For These Use Cases</h2>
              <p className={styles.useCaseSubtitle}>See how {element.title} can be used in real scenarios</p>
              <div className={styles.relatedUseCasesGrid}>
                {element.relatedUseCases.map((useCase, idx) => (
                  <a key={idx} href={`/use-cases/${useCase.slug}`} className={styles.relatedUseCaseCard}>
                    <div className={styles.relatedUseCaseIcon}>
                      {useCase.icon.startsWith('data:image') ? (
                        <img src={useCase.icon} alt={useCase.title} style={{ width: '32px', height: '48px' }} />
                      ) : (
                        useCase.icon
                      )}
                    </div>
                    <h3 className={styles.relatedUseCaseTitle}>{useCase.title}</h3>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>Ready to Use {element.title}?</h2>
            <p className={styles.ctaText}>
              Start creating interactive emails with {element.title} today.
            </p>
            <div className={styles.ctaButtons}>
              <a href="https://app.convertic.ai/users/register" className={styles.primaryButton}>
                Get Started Free
              </a>
              <a href="/pricing" className={styles.secondaryButton}>
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
