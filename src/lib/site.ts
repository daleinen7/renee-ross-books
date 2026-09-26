export const SITE = {
  name: 'Renee Ross Books',
  tagline: 'Gothic Romance the Way You Remember It',
  description: 'Gothic romance novels by author Renee Ross.',
  email: 'reneerossbooks@gmail.com',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/reneerossbooks/', icon: 'instagram' },
    {
      label: 'Amazon author page',
      href: 'https://www.amazon.com/Renee-Ross/e/B007WDCBI2',
      icon: 'amazon',
    },
    {
      label: 'Goodreads',
      href: 'https://www.goodreads.com/author/show/6037599.Renee_Ross',
      icon: 'goodreads',
    },
    { label: 'Pinterest', href: 'https://www.pinterest.com/ReneeRossBooks/', icon: 'pinterest' },
    { label: 'Facebook', href: 'https://www.facebook.com/reneerossbooks', icon: 'facebook' },
    { label: 'X', href: 'https://twitter.com/reneerossbooks', icon: 'x' },
    { label: 'Email', href: 'mailto:reneerossbooks@gmail.com', icon: 'email' },
  ],
} as const;

export type SocialIcon = (typeof SITE.social)[number]['icon'];
