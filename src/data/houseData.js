// ─── House / Property Model Data ─────────────────────────────────────────────
// Each entry maps to a .glb file served from /public.
// The selector in HeroSection cycles through these.

export const HOUSES = [
  {
    id:            'modern-house',
    name:          'Modern House',
    glb:           '/modern_house.glb',
    price:         '$1,250,000',
    beds:          4,
    baths:         3,
    sqft:          '3,200',
    badge:         'Exclusive',
    description:   'Clean lines, floor-to-ceiling glass, and an open-plan layout define this contemporary masterpiece.',
    fallbackColor: '#c9a84c',
    accentColor:   '#ffd700',
  },
  {
    id:            'modern-minimalist',
    name:          'Minimalist Residence',
    glb:           '/modern_minimalist_house.glb',
    price:         '$980,000',
    beds:          3,
    baths:         2,
    sqft:          '2,400',
    badge:         'New Listing',
    description:   'Stripped back to essentials — pure form, natural light, and intentional space.',
    fallbackColor: '#8b7355',
    accentColor:   '#d4a96a',
  },
  {
    id:            'modern-minimalist-2',
    name:          'Minimalist Villa',
    glb:           '/modern_minimalist_house_2.glb',
    price:         '$1,100,000',
    beds:          4,
    baths:         3,
    sqft:          '2,900',
    badge:         'Price Reduced',
    description:   'A refined take on minimalist living with premium finishes and a private courtyard.',
    fallbackColor: '#3d5a2e',
    accentColor:   '#6b8e23',
  },
  {
    id:            'luxury-villa',
    name:          'Luxury Villa',
    glb:           '/modern_luxury_villa_house_building_home.glb',
    price:         '$3,400,000',
    beds:          6,
    baths:         5,
    sqft:          '5,800',
    badge:         'Ultra Luxury',
    description:   'Grand proportions, resort-style pool, and panoramic views — the pinnacle of luxury living.',
    fallbackColor: '#2d5a8f',
    accentColor:   '#4a90e2',
  },
  {
    id:            'minecraft-modern',
    name:          'Urban Retreat',
    glb:           '/minecraft_modern_house.glb',
    price:         '$750,000',
    beds:          3,
    baths:         2,
    sqft:          '1,950',
    badge:         'Just Listed',
    description:   'Bold geometric form meets urban convenience — a statement home in the heart of the city.',
    fallbackColor: '#9a9a9a',
    accentColor:   '#e8e8e8',
  },
];

/**
 * Returns the house entry with the given id, or undefined if not found.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getHouseById(id) {
  return HOUSES.find((h) => h.id === id);
}
