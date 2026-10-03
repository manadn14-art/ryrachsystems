// JOB BOARD — add a job by appending an object; it appears automatically.
// status: 'open' | 'closed' (closed jobs are hidden)
// 'requirements' = shown as "What we're looking for"
// 'deadline' = application closing date, shown on the listing and job page

export const jobs = [
  {
    id: 'sales-marketing-officer',
    title: 'Sales & Marketing Officer',
    type: 'Full-time',
    location: 'Blantyre (2) · Lilongwe (5) · Mzuzu (2)',
    status: 'open',
    deadline: '30 October 2026',
    skills: ['Sales', 'Business Management', 'Marketing', 'Negotiation', 'Client relations', 'Communication'],
    description:
      'We are hiring 9 Sales & Marketing Officers — 2 in Blantyre, 5 in Lilongwe and 2 in Mzuzu — to drive the growth of Ryrach Systems: marketing our software products, opening doors with businesses and turning conversations into long-term clients.',
    points: [
      'Market and sell Ryrach Systems products and services to businesses across industries.',
      'Generate leads, book product demos and manage the full sales pipeline.',
      'Build lasting client relationships and follow through after every sale.',
      'Prepare proposals and quotations together with the technical team.',
      'Represent Ryrach Systems at meetings, pitches and industry events.',
    ],
    requirements: [
      'Diploma or degree in Business Management, Marketing, or a related field.',
      'Proven work experience in sales, marketing or business management.',
      'Strong communication and negotiation skills.',
      'Self-driven and target-focused — you set goals and hit them.',
      'Interest in software and technology solutions is an advantage.',
    ],
  },
  {
    id: 'software-developer',
    title: 'Software Developer',
    type: 'Full-time',
    location: 'Malawi / Remote',
    status: 'open',
    deadline: '30 October 2026',
    skills: ['Python', 'JavaScript', 'APIs', 'Databases', 'Git', 'Web development'],
    description:
      'Help build and improve web applications, APIs and SaaS products used by real businesses every day.',
    points: [
      'Build and maintain features across Ryrach products and client systems.',
      'Design and consume REST APIs with clean, documented contracts.',
      'Work with relational databases and write queries that scale.',
      'Review code, write tests where they matter, and keep Git history sane.',
    ],
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX & Product Designer',
    type: 'Contract / Remote',
    location: 'Remote',
    status: 'open',
    deadline: '30 October 2026',
    skills: ['UI/UX', 'Figma', 'Product design', 'Design systems'],
    description:
      'Shape the interfaces of Ryrach products — from flows and wireframes to polished, reusable design systems.',
    points: [
      'Turn business workflows into clear product flows and screens.',
      'Design and maintain a shared design system across products.',
      'Prototype in Figma and hand off developer-ready specs.',
      'Work directly with engineering — no hand-off-and-vanish.',
    ],
  },
  {
    id: 'technology-intern',
    title: 'Technology Intern',
    type: 'Internship',
    location: 'Malawi',
    status: 'open',
    deadline: '30 October 2026',
    skills: ['Curiosity', 'Basic programming', 'Documentation', 'Testing'],
    description:
      'Learn by contributing to real software projects, testing and documentation.',
    points: [
      'Contribute to live projects alongside experienced engineers.',
      'Help with testing, documentation and small build tasks.',
      'Learn the full lifecycle of shipping software to real users.',
      'Structured feedback throughout the internship.',
    ],
  },
];

export const getJob = (id) => jobs.find((j) => j.id === id);
export const openJobs = () => jobs.filter((j) => j.status === 'open');