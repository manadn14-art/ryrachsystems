// ---------------------------------------------------------------------------
// PRODUCT CATALOGUE — add Product 6, 7… here and the whole site picks it up.
// mockup variants: 'hms' | 'sms' | 'kyc' | 'mdm' | 'custom' | 'generic'
// ---------------------------------------------------------------------------

export const products = [
  {
    slug: 'ryrach-hms',
    name: 'Ryrach HMS',
    shortName: 'Ryrach HMS',
    category: 'Hospitality · SaaS',
    tags: ['SaaS', 'Hospitality'],
    mockup: 'hms',
    featured: true,
    tagline: 'Run rooms, guests and payments from one console.',
    description:
      'A hotel and lodge management platform for reservations, rooms, guests, payments and daily operations — designed for properties that have outgrown paper, spreadsheets and messaging apps.',
    features: [
      { title: 'Reservations', detail: 'Book rooms across seasons and rate types, with live availability.' },
      { title: 'Room management', detail: 'Room types, statuses, housekeeping state and maintenance flags.' },
      { title: 'Guest management', detail: 'Guest records, stay history and preferences in one profile.' },
      { title: 'Check-in / check-out', detail: 'A front-desk flow built for speed at the busiest hours.' },
      { title: 'Payments', detail: 'Post charges, track invoices and keep a clean payment trail.' },
      { title: 'Reports', detail: 'Occupancy, revenue and operations reporting for owners and managers.' },
      { title: 'Operations dashboard', detail: 'Today at a glance: arrivals, departures, occupancy, alerts.' },
      { title: 'Hotel & lodge records', detail: 'Structured records for properties, rooms and rate plans.' },
    ],
    how: [
      'Configure your property — rooms, rates, seasons and staff roles.',
      'Take reservations from the front desk or your own channels.',
      'Check guests in and out, post payments as you go.',
      'Review occupancy and revenue reports — daily or on demand.',
    ],
    audience: ['Hotels', 'Lodges', 'Guest houses', 'Serviced apartments'],
    useCases: [
      { title: 'Front-desk operations', body: 'Arrivals, departures and room moves handled in seconds, not notebooks.' },
      { title: 'Owner oversight', body: 'Occupancy and revenue visible without asking for a spreadsheet.' },
      { title: 'Guest history', body: 'Returning guests recognised, preferences carried forward.' },
    ],
    tech: ['Web-based console', 'Role-based access', 'REST API endpoints', 'Cloud or self-hosted deployment', 'Runs on desktop & tablet'],
    note: null,
  },
  {
    slug: 'kyc',
    name: 'KYC Verification',
    shortName: 'KYC',
    category: 'Identity · API',
    tags: ['API', 'Identity'],
    mockup: 'kyc',
    featured: false,
    tagline: 'Verification workflows for onboarding that can’t afford shortcuts.',
    description:
      'Identity verification workflows designed around document checks, selfie verification and liveness — exposed through an API so product teams can drop verification straight into their own onboarding flow.',
    features: [
      { title: 'ID verification', detail: 'Structured document checks designed for onboarding flows.' },
      { title: 'Selfie verification', detail: 'Face-match step comparing a live selfie to the document photo.' },
      { title: 'Liveness', detail: 'Liveness detection designed to reject static images and replay attempts.' },
      { title: 'Verification workflows', detail: 'Chain checks into a flow that fits your risk appetite.' },
      { title: 'API architecture', detail: 'A clean REST surface with JSON responses and clear status states.' },
      { title: 'Business onboarding', detail: 'Verification steps for businesses onboarding their own customers.' },
    ],
    how: [
      'Request sandbox credentials through the developers page.',
      'Integrate the verification endpoint into your onboarding flow.',
      'Submit document and selfie captures from your application.',
      'Receive a structured result with per-check status you can act on.',
    ],
    audience: ['Fintechs', 'Marketplaces', 'Lenders', 'Platforms with customer onboarding'],
    useCases: [
      { title: 'Customer onboarding', body: 'Verify identity before the first transaction, not after the first loss.' },
      { title: 'Marketplace trust', body: 'Give buyers and sellers a reason to trust each other early.' },
      { title: 'Step-up checks', body: 'Trigger stronger verification when risk signals appear.' },
    ],
    tech: ['REST API', 'Sandbox environment', 'JSON responses designed for webhooks', 'Session-based capture', 'Per-check result objects'],
    note:
      'Compliance note — these workflows are designed for document, selfie and liveness checks and support integration with accredited verification providers where required. We make no claim of government database connectivity or third-party certifications that are not in place.',
  },
  {
    slug: 'mdm',
    name: 'MDM & Monitoring',
    shortName: 'MDM',
    category: 'Business · Devices',
    tags: ['Devices', 'Business'],
    mockup: 'mdm',
    featured: false,
    tagline: 'Your company devices, managed from one place.',
    description:
      'Centralized management and operational visibility for company-owned devices and business workflows — enrol devices, control applications and keep administrators informed.',
    features: [
      { title: 'Device management', detail: 'Enrol, group and track company-owned devices through their lifecycle.' },
      { title: 'Application management', detail: 'Control which apps are installed, updated or blocked on the fleet.' },
      { title: 'Business-device monitoring', detail: 'Operational health of the fleet: sync state, compliance, alerts.' },
      { title: 'Administrative controls', detail: 'Policies and permissions managed by named administrators.' },
      { title: 'Operational visibility', detail: 'See what state your fleet is in without walking around the office.' },
      { title: 'Reporting', detail: 'Fleet reports for audits, budgeting and replacement planning.' },
    ],
    how: [
      'Enrol company devices into your organisation’s workspace.',
      'Define policies — required apps, restrictions, update windows.',
      'Administrators monitor fleet health from the console.',
      'Report on compliance and plan replacements with real data.',
    ],
    audience: ['Logistics & field teams', 'Sales teams with devices', 'Multi-branch operations', 'IT administrators'],
    useCases: [
      { title: 'Field fleet management', body: 'Tablets in the field stay enrolled, updated and accountable.' },
      { title: 'App control', body: 'Company devices run company software — nothing else.' },
      { title: 'Audit readiness', body: 'Answer “what devices do we have and what state are they in?” in minutes.' },
    ],
    tech: ['Web admin console', 'Device enrolment flow', 'Policy engine', 'Scheduled reporting', 'Role-based administrator access'],
    note:
      'Scope note — this is a business management system for company-owned devices with administrator oversight. It provides operational visibility for the business; it is not designed for covert surveillance of individuals.',
  },
  {
    slug: 'custom-saas',
    name: 'Custom SaaS',
    shortName: 'Custom SaaS',
    category: 'Custom Software',
    tags: ['Custom', 'SaaS'],
    mockup: 'custom',
    featured: false,
    tagline: 'Your business problem, engineered into software.',
    description:
      'Have a business problem that needs software? Ryrach Systems can design and build a custom digital solution — from the first problem statement to a live platform your team runs on.',
    features: [
      { title: 'Web applications', detail: 'Purpose-built tools your staff actually want to use.' },
      { title: 'SaaS platforms', detail: 'Multi-tenant products designed to be licensed or resold.' },
      { title: 'APIs', detail: 'Clean interfaces so your system talks to the rest of your stack.' },
      { title: 'Dashboards', detail: 'Operational and executive views over the data that matters.' },
      { title: 'Business automation', detail: 'Remove repetitive steps from the workflows that drain your team.' },
      { title: 'Database systems', detail: 'Data models designed for reporting, not just for storage.' },
      { title: 'Custom integrations', detail: 'Connect the tools you already rely on.' },
    ],
    how: [
      'Start with the problem — an order enquiry, a call, or a rough brief.',
      'We scope it: flows, data model, phases and a clear quotation.',
      'We build in short cycles; you review working software early.',
      'We deploy, train your team and stay reachable afterwards.',
    ],
    audience: ['SMEs digitising operations', 'Corporates replacing spreadsheets', 'Founders building a product', 'Any team with a workflow problem'],
    useCases: [
      { title: 'Internal platforms', body: 'One system instead of six spreadsheets and a group chat.' },
      { title: 'Client portals', body: 'Give your customers a window into your operation.' },
      { title: 'New SaaS products', body: 'Design, build and launch a product you can sell under your brand.' },
    ],
    tech: ['Modern web stack', 'REST APIs', 'Relational databases', 'Cloud or on-premise deployment', 'Phased delivery model'],
    note: null,
  },
  {
    slug: 'sms',
    name: 'School Management System',
    shortName: 'School SMS',
    category: 'Education · SaaS',
    tags: ['SaaS', 'Education'],
    mockup: 'sms',
    featured: false,
    tagline: 'Students, attendance, fees and reports — one school system.',
    description:
      'A school management platform for student records, attendance, fees, examinations and reporting — built for schools that have outgrown paper registers, scattered spreadsheets and endless manual calculations.',
    features: [
      { title: 'Student records', detail: 'Profiles, classes, guardians and academic history in one place.' },
      { title: 'Attendance', detail: 'Daily and per-period registers, with absences visible the same morning.' },
      { title: 'Fees & invoicing', detail: 'Term fee structures, invoices, payments, balances and receipts.' },
      { title: 'Examinations & grading', detail: 'Marks entry with configurable grading scales per level.' },
      { title: 'Report cards', detail: 'Generated automatically from marks — ready to print or share.' },
      { title: 'Timetable', detail: 'Class and teacher schedules that staff can actually consult.' },
      { title: 'Staff management', detail: 'Teacher records, roles and responsibilities.' },
      { title: 'Reports & dashboard', detail: 'Enrolment, fee collection and performance views for school leadership.' },
    ],
    how: [
      'Set up your school — classes, streams, terms and fee structures.',
      'Enrol students and assign them to classes.',
      'Run the term: registers, marks, fees — all recorded as you go.',
      'Generate report cards and term reports at the tap of a button.',
    ],
    audience: ['Primary & secondary schools', 'Private academies', 'International schools', 'Technical & vocational colleges'],
    useCases: [
      { title: 'Daily registers', body: 'Attendance marked in seconds, visible to administration immediately.' },
      { title: 'Fee tracking', body: 'Know exactly who has paid, who owes, and print receipts on the spot.' },
      { title: 'End of term', body: 'Report cards generated from real marks — no more week of manual compiling.' },
    ],
    tech: ['Web-based console', 'Role-based access (admin, teacher, accounts)', 'REST API endpoints', 'Cloud or self-hosted deployment', 'Multi-campus support'],
    note: null,
  },
];

export const getProduct = (slug) => products.find((p) => p.slug === slug);
export const PRODUCT_CHOICES = [...products.map((p) => p.name), 'Other'];