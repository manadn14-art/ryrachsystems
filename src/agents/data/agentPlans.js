// ============================================================
// RYRACH SYSTEMS — AGENT PRODUCT CATALOG
// What field agents are allowed to sell, with the plans and
// prices they quote to clients. Kept in its OWN file so your
// main site pricing (data/plans.js) is never touched.
//
// ┌──────────────────────────────────────────────────────────┐
// │ PRICES: the figures below are the working draft from our │
// │ plan. If your real price list differs, edit ONLY the     │
// │ numbers here — every price the agent sees comes from     │
// │ this one file. Nothing else in the app needs to change.  │
// └──────────────────────────────────────────────────────────┘
// ============================================================

export const AGENT_CATALOG = [
  {
    slug: 'ryrach-hms',
    title: 'Ryrach HMS',
    blurb:
      'Hospital / clinic management — patients, records, billing, pharmacy and reports, in one system.',
    installationFee: 75000,
    plans: [
      { name: 'Starter', price: 65000, period: 'month' },
      { name: 'Standard', price: 120000, period: 'month' },
      { name: 'Pro', price: 1200000, period: 'year' },
    ],
  },
  {
    slug: 'school-management',
    title: 'School Management System',
    blurb:
      'For schools and colleges — learners, fees, attendance, reports and SMS updates for guardians.',
    installationFee: 50000,
    plans: [
      { name: 'Starter', price: 35000, period: 'month' },
      { name: 'Standard', price: 75000, period: 'month' },
      { name: 'Pro', price: 750000, period: 'year' },
    ],
  },
  {
    slug: 'pos-stock',
    title: 'POS & Stock System',
    blurb:
      'For shops, wholesalers and fuel stations — fast tills, stock counts, low-stock alerts and daily sales reports.',
    installationFee: 35000,
    plans: [
      { name: 'Starter', price: 20000, period: 'month' },
      { name: 'Standard', price: 45000, period: 'month' },
      { name: 'Pro', price: 450000, period: 'year' },
    ],
  },
]
