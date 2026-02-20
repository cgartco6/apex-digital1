// All services offered by Apex Digital
export const services = [
  {
    id: 'web-design',
    name: 'Web Design',
    description: 'Custom, responsive websites tailored to your brand.',
    icon: '🌐',
    packages: {
      basic: { price: 2999, features: ['5 pages', 'Mobile friendly', 'Contact form'] },
      pro: { price: 5999, features: ['10 pages', 'CMS integration', 'SEO basics'] },
      enterprise: { price: 9999, features: ['Unlimited pages', 'E‑commerce', 'Custom features'] }
    }
  },
  {
    id: 'landing-pages',
    name: 'Landing Pages',
    description: 'High‑converting landing pages for campaigns.',
    icon: '📄',
    packages: {
      basic: { price: 1499, features: ['Single page', 'A/B testing ready', 'Analytics'] },
      pro: { price: 2999, features: ['Multi‑page funnel', 'Email capture', 'Integration'] },
      enterprise: { price: 4999, features: ['Personalized content', 'Dynamic offers', 'Full funnel'] }
    }
  },
  {
    id: 'ecommerce-design',
    name: 'E‑commerce Design',
    description: 'Full online stores with shopping cart and payments.',
    icon: '🛒',
    packages: {
      basic: { price: 4999, features: ['Up to 50 products', 'Basic checkout', 'Inventory'] },
      pro: { price: 8999, features: ['Up to 500 products', 'Advanced filters', 'Reviews'] },
      enterprise: { price: 14999, features: ['Unlimited products', 'Multi‑vendor', 'Custom apps'] }
    }
  },
  // ... other design services (posters, wraps, etc.) can be added similarly
];
