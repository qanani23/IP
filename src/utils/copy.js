// ─── Copy Source of Truth ─────────────────────────────────────────────────────
// ALL visible text on the site must be imported from here.
// No hardcoded strings in component JSX.

export const COPY = {
  productName:  'ABBY-KEY',
  heroTagline:  'Find your perfect home.',
  heroSubtitle: 'Premium real estate, curated for you.',
  scrollPrompt: 'Scroll to explore',

  sections: {
    performance:  'Prime Location',
    aerodynamics: 'Architectural Detail',
    technical:    'Property Specs',
    podium:       'The Standard',
    champion:     'Featured Property',
    cart:         'Schedule a Visit',
  },

  sectionLabels: {
    performance:  'Location & Lifestyle',
    aerodynamics: 'Design & Architecture',
    technical:    'Floor Plan & Dimensions',
    podium:       'The Standard',
    champion:     'Exclusive Listing',
  },

  specs: {
    microfiber:    '4 Bedrooms · 3 Bathrooms',
    pebbleDepth:   'Open-Plan Living',
    dragCoeff:     '98',
    dragLabel:     'Walk Score',
    rotStability:  '4.9',
    rotLabel:      'Agent Rating',
    weightBalance: '3,200',
    weightLabel:   'sq ft Living Area',
    uniformBounce: 'A+',
    bounceLabel:   'School District',
  },

  champion: {
    rank:    '01',
    tier:    'Exclusive Listing',
    price:   '$1,250,000',
    edition: 'Featured Property',
  },

  podium: {
    headline: 'The Standard',
    sub:      'Crafted for those who demand more.',
  },

  cta:           'Save Property',
  cartAriaLabel: 'Saved listings',
  skipLink:      'Skip to main content',
  logoText:      'ABBY-KEY',

  loading: {
    message: 'Loading experience…',
  },

  fallback: {
    heading: 'ABBY-KEY',
    sub:     'Your browser does not support WebGL. Please upgrade to experience the full 3D property tour.',
  },

  // ─── Navigation ─────────────────────────────────────────────────────────────
  nav: {
    products:   'Properties',
    customize:  'Neighborhoods',
    contacts:   'Contact',
    account:    'Account',
    openMenu:   'Open menu',
    closeMenu:  'Close menu',
  },

  // ─── Property Details Page ───────────────────────────────────────────────────
  product: {
    title:        'ABBY-KEY — Signature Estate',
    subtitle:     '4 Bed · 3 Bath · 3,200 sq ft',
    price:        '$1,250,000',
    originalPrice:'$1,395,000',
    badge:        'Exclusive Listing',
    inStock:      'Available',
    outOfStock:   'Under Contract',
    sku:          'REF: AK-SE-001',
    addToCart:    'Save Property',
    buyNow:       'Schedule Visit',
    sizeLabel:    'Size',
    size:         '3,200 sq ft',
    quantityLabel:'Guests',
    shareLabel:   'Share',

    tabs: {
      overview:   'Overview',
      specs:      'Details',
      materials:  'Features',
      care:       'Neighborhood',
    },

    overview: {
      heading:    'A Home Built for Living',
      body:       'This Abby-Key Signature Estate is designed from the ground up for modern living. Every room, finish, and material choice reflects a singular obsession: the perfect home.',
    },

    specifications: [
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

  // ─── Saved Listings Page ─────────────────────────────────────────────────────
  cart: {
    title:          'Saved Listings',
    empty:          'No saved listings yet.',
    emptySubtitle:  'Browse properties and save the ones you love.',
    continueShopping: 'Browse Properties',
    subtotal:       'Estimated Value',
    shipping:       'Agent Fee',
    shippingFree:   'Included',
    shippingCalc:   'Discussed at consultation',
    tax:            'Transfer Tax',
    taxCalc:        'Calculated at closing',
    total:          'Total',
    checkout:       'Schedule Visits',
    remove:         'Remove',
    quantity:       'Qty',
    itemCount:      (n) => `${n} propert${n !== 1 ? 'ies' : 'y'}`,
    promoPlaceholder: 'Referral code',
    promoApply:     'Apply',
    promoInvalid:   'Invalid referral code.',
    promoApplied:   'Referral code applied!',
    secureCheckout: '🔒 Secure Booking',
    freeShipping:   'No hidden fees',
    returns:        'Cancel anytime',
  },

  // ─── Checkout / Booking Page ─────────────────────────────────────────────────
  checkout: {
    title:          'Schedule Visit',
    steps: {
      shipping:     'Your Details',
      payment:      'Preferred Date',
      review:       'Confirm',
    },
    shipping: {
      heading:      'Your Information',
      firstName:    'First Name',
      lastName:     'Last Name',
      email:        'Email Address',
      phone:        'Phone Number',
      address:      'Current Address',
      address2:     'Apartment, suite, etc. (optional)',
      city:         'City',
      state:        'State / Province',
      zip:          'ZIP / Postal Code',
      country:      'Country',
      continueToPayment: 'Continue',
    },
    payment: {
      heading:      'Visit Preferences',
      cardNumber:   'Preferred Date',
      cardName:     'Preferred Time',
      expiry:       'Visit Duration',
      cvv:          'Party Size',
      placeOrder:   'Confirm Visit',
      secureNote:   'Your information is kept private and secure.',
    },
    review: {
      heading:      'Confirm Your Visit',
      editShipping: 'Edit',
      editPayment:  'Edit',
      placeOrder:   'Confirm Visit',
    },
    orderSummary:   'Visit Summary',
    backToCart:     'Back to Saved Listings',
  },

  // ─── Visit Confirmation ──────────────────────────────────────────────────────
  confirmation: {
    title:          'Visit Confirmed!',
    subtitle:       'Your property tour has been scheduled.',
    orderNumber:    'Booking Reference',
    emailSent:      'A confirmation has been sent to',
    estimatedDelivery: 'Your Visit',
    deliveryWindow: 'Within 3–5 business days',
    continueShopping: 'Browse More Properties',
    trackOrder:     'View Booking',
    whatNext:       'What happens next?',
    steps: [
      { title: 'Booking Received',  desc: 'We\'ve received your request and are confirming availability.' },
      { title: 'Agent Assigned',    desc: 'A dedicated Abby-Key agent will be assigned to your tour.' },
      { title: 'Confirmation Sent', desc: 'You\'ll receive a confirmation with full tour details.' },
      { title: 'Tour Day',          desc: 'Your agent meets you at the property for a private showing.' },
    ],
  },

  // ─── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    tagline:        'Find your perfect home.',
    columns: {
      store: {
        heading: 'Properties',
        links: ['All Listings', 'Neighborhoods', 'New Developments', 'Luxury Homes'],
      },
      support: {
        heading: 'Support',
        links: ['FAQ', 'Buying Guide', 'Mortgage Calculator', 'Contact Us'],
      },
      company: {
        heading: 'Company',
        links: ['About Abby-Key', 'Careers', 'Press', 'Sustainability'],
      },
    },
    legal:          '© 2026 ABBY-KEY REAL ESTATE. All rights reserved.',
    privacy:        'Privacy Policy',
    terms:          'Terms of Service',
    cookies:        'Cookie Policy',
    social: {
      instagram:    'Instagram',
      twitter:      'Twitter',
      youtube:      'YouTube',
    },
  },

  // ─── Mobile Menu ─────────────────────────────────────────────────────────────
  mobileMenu: {
    close:          'Close menu',
  },

  // ─── Error States ────────────────────────────────────────────────────────────
  errors: {
    notFound:       'Page Not Found',
    notFoundSub:    'The page you\'re looking for doesn\'t exist.',
    backHome:       'Back to Home',
    networkError:   'Something went wrong.',
    networkSub:     'Please check your connection and try again.',
    retry:          'Try Again',
    productUnavailable: 'This property is currently unavailable.',
  },

  // ─── Save Property Toast ─────────────────────────────────────────────────────
  toast: {
    addedToCart:    'Property saved!',
    addedToWishlist: 'Added to wishlist',
    viewCart:       'View Saved',
    dismiss:        'Dismiss',
  },

  // ─── Properties Page ─────────────────────────────────────────────────────────
  shop: {
    recentlyViewed: 'Recently Viewed',
  },

  // ─── Accessibility ───────────────────────────────────────────────────────────
  a11y: {
    cartCount:      (n) => `${n} propert${n !== 1 ? 'ies' : 'y'} saved`,
    removeItem:     (name) => `Remove ${name} from saved listings`,
    decreaseQty:    'Decrease quantity',
    increaseQty:    'Increase quantity',
    closeModal:     'Close',
    loading:        'Loading…',
    imageAlt:       'Abby-Key property exterior',
  },
};
