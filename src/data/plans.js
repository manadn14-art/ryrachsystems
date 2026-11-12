// ============================================================
// RYRACH AGENTS — PRODUCT CATALOGUE FOR SALES AGENTS
// !!! SAMPLE PRICES — replace every number with YOUR real price.
// All amounts are in Malawi Kwacha (MK).
// Edit names/prices any time — agents see updates instantly.
// ============================================================

export const AGENT_CATALOG = [
  {
    slug: 'sms',
    title: 'School Management System',
    blurb: 'Students, attendance, fees, exams and SMS alerts to parents.',
    installationFee: 250000,
    plans: [
      { name: 'Standard', price: 45000, period: 'month' },
      { name: 'Premium', price: 75000, period: 'month' },
      { name: 'Standard — annual', price: 450000, period: 'year' },
    ],
  },
  {
    slug: 'mdm',
    title: 'Mobile Device Management',
    blurb: 'Enrol, monitor and control company phones and tablets.',
    installationFee: 150000,
    plans: [
      { name: 'Basic', price: 25000, period: 'month' },
      { name: 'Pro', price: 40000, period: 'month' },
    ],
  },
  {
    slug: 'hms',
    title: 'Hotel Management System',
    blurb: 'Bookings, rooms, POS, housekeeping and reports.',
    installationFee: 300000,
    plans: [
      { name: 'Standard', price: 65000, period: 'month' },
      { name: 'Pro', price: 95000, period: 'month' },
    ],
  },
  {
    slug: 'inv',
    title: 'Inventory & POS',
    blurb: 'Stock, sales, receipts and daily reports for shops.',
    installationFee: 180000,
    plans: [
      { name: 'Basic', price: 30000, period: 'month' },
      { name: 'Pro', price: 50000, period: 'month' },
    ],
  },
  {
    slug: 'web',
    title: 'Business Website & Apps',
    blurb: 'Company websites, web apps, hosting and support.',
    installationFee: 200000,
    plans: [
      { name: 'Business site', price: 35000, period: 'month' },
      { name: 'E-commerce', price: 60000, period: 'month' },
    ],
  },
]

export function findProduct(slug) {
  return AGENT_CATALOG.find((p) => p.slug === slug) || null
}
