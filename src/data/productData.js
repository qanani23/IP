// ─── Property Data Layer ──────────────────────────────────────────────────────
// Single source of truth for all property information.
// No property data is hardcoded in components — import from here exclusively.
// Adding a new property = add one entry to PRODUCTS. Zero component changes.

export const PRODUCTS = [
  {
    id:            'ak-se-001',
    name:          'Abby-Key — Signature Estate',
    price:         1250000,
    originalPrice: 1395000,
    images:        ['/property-fallback.jpg'],
    stock:         1,
    badge:         'Exclusive Listing',
    sku:           'AK-SE-001',
    category:      'luxury',
    createdAt:     '2026-01-01T00:00:00.000Z',

    overview: {
      heading: 'A Home Built for Living',
      body:    'This Abby-Key Signature Estate is designed from the ground up for modern living. Every room, finish, and material choice reflects a singular obsession: the perfect home.',
    },

    specs: [
      { label: 'Bedrooms',         value: '4' },
      { label: 'Bathrooms',        value: '3' },
      { label: 'Living Area',      value: '3,200 sq ft' },
      { label: 'Lot Size',         value: '0.45 acres' },
      { label: 'Year Built',       value: '2022' },
      { label: 'Garage',           value: '2-car attached' },
      { label: 'Heating',          value: 'Forced Air / Radiant' },
      { label: 'Cooling',          value: 'Central A/C' },
      { label: 'School District',  value: 'A+ Rated' },
      { label: 'Listing',          value: 'Exclusive — AK-SE-001' },
    ],

    materials: {
      heading: 'Premium Features',
      items: [
        {
          name: 'Chef\'s Kitchen',
          desc: 'Quartz countertops, professional-grade appliances, and a large island perfect for entertaining.',
        },
        {
          name: 'Primary Suite',
          desc: 'Spa-inspired en-suite with soaking tub, walk-in shower, and dual vanities.',
        },
        {
          name: 'Smart Home System',
          desc: 'Integrated lighting, climate, and security controls from your phone.',
        },
        {
          name: 'Outdoor Living',
          desc: 'Covered patio, landscaped yard, and in-ground pool with automated cover.',
        },
      ],
    },

    care: {
      heading: 'Neighborhood Highlights',
      items: [
        'Walk Score 98 — steps from shops, cafés, and parks.',
        'Top-rated A+ school district within 0.5 miles.',
        'Easy highway access and 20-minute commute to downtown.',
        'Active HOA with community events and maintained common areas.',
        'Low crime index — one of the safest neighborhoods in the region.',
      ],
    },
  },
];

/**
 * Returns the property with the given id, or undefined if not found.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}
