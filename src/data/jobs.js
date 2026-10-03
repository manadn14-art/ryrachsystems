// JOB BOARD — add a job by appending an object; it appears automatically.
// status: 'open' | 'closed' (closed jobs are hidden)

export const jobs = [
  {
    id: 'software-developer',
    title: 'Software Developer',
    type: 'Full-time',
    location: 'Malawi / Remote',
    status: 'open',
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