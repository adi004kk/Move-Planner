import { PackingItem, PackingCategory } from '../types/travel';

export const PACKING_CATEGORIES: PackingCategory[] = [
  'Documents & IDs',
  'Clothing & Footwear',
  'Toiletries & Personal Care',
  'Electronics & Gadgets',
  'Health & Medication',
  'Destination Specific',
  'Miscellaneous'
];

interface PackingGenOptions {
  destinationName?: string;
  category?: string;
  durationDays?: number;
  travellersCount?: number;
}

export function generateDefaultPackingList(options: PackingGenOptions = {}): PackingItem[] {
  const { destinationName = '', category = 'Hill Station', durationDays = 4, travellersCount = 2 } = options;
  const destLower = destinationName.toLowerCase();
  const catLower = category.toLowerCase();

  const isColdOrMountain =
    catLower.includes('hill') ||
    destLower.includes('manali') ||
    destLower.includes('ladakh') ||
    destLower.includes('kashmir') ||
    destLower.includes('shimla') ||
    destLower.includes('rishikesh');

  const isBeachOrCoastal =
    catLower.includes('beach') ||
    destLower.includes('goa') ||
    destLower.includes('andaman') ||
    destLower.includes('kerala') ||
    destLower.includes('bali');

  const isHeritageOrSpiritual =
    catLower.includes('heritage') ||
    catLower.includes('spiritual') ||
    destLower.includes('varanasi') ||
    destLower.includes('jaipur') ||
    destLower.includes('udaipur');

  const isSafariOrNature =
    catLower.includes('wildlife') ||
    catLower.includes('nature') ||
    catLower.includes('adventure');

  const items: PackingItem[] = [
    // Documents & IDs
    {
      id: 'doc-gov-id',
      name: 'Government Photo ID / Passport / Aadhaar',
      category: 'Documents & IDs',
      packed: true,
      quantity: travellersCount,
      notes: 'Required for flights, train entry, and hotel check-in'
    },
    {
      id: 'doc-tickets',
      name: 'Flight / Train / Bus Tickets & Boarding Passes',
      category: 'Documents & IDs',
      packed: true,
      notes: 'Keep digital offline copies downloaded on phone'
    },
    {
      id: 'doc-bookings',
      name: 'Hotel & Activity Booking Vouchers',
      category: 'Documents & IDs',
      packed: true,
      notes: 'Confirmation PDFs or booking reference numbers'
    },
    {
      id: 'doc-cards-cash',
      name: 'Debit/Credit Cards & Local Emergency Cash',
      category: 'Documents & IDs',
      packed: false,
      notes: 'ATMs in remote valleys can occasionally be dry'
    },
    {
      id: 'doc-insurance',
      name: 'Travel Insurance Policy & Emergency Contact Card',
      category: 'Documents & IDs',
      packed: false,
      notes: 'Policy number & 24/7 assistance hotline'
    },

    // Clothing & Footwear
    {
      id: 'cloth-outfits',
      name: `Day Outfits & Breathable Tops (${Math.max(3, durationDays)} sets)`,
      category: 'Clothing & Footwear',
      packed: false,
      quantity: Math.max(3, durationDays),
      notes: 'Comfortable cotton or moisture-wicking shirts'
    },
    {
      id: 'cloth-bottoms',
      name: 'Travel Pants / Trousers / Jeans',
      category: 'Clothing & Footwear',
      packed: false,
      quantity: 3
    },
    {
      id: 'cloth-innerwear',
      name: `Undergarments & Daily Socks (${durationDays + 1} pairs)`,
      category: 'Clothing & Footwear',
      packed: false,
      quantity: durationDays + 1
    },
    {
      id: 'cloth-shoes-walking',
      name: 'Comfortable Walking / Running Shoes',
      category: 'Clothing & Footwear',
      packed: true,
      notes: 'Broken-in shoes to avoid blisters'
    },
    {
      id: 'cloth-sleepwear',
      name: 'Nightwear / Loungewear',
      category: 'Clothing & Footwear',
      packed: false,
      quantity: 2
    },
    {
      id: 'cloth-rain-wind',
      name: 'Light Windcheater / Rain Jacket',
      category: 'Clothing & Footwear',
      packed: false,
      notes: 'Essential for sudden weather changes'
    },

    // Toiletries & Personal Care
    {
      id: 'toil-dental',
      name: 'Toothbrush, Toothpaste & Floss',
      category: 'Toiletries & Personal Care',
      packed: true
    },
    {
      id: 'toil-sunscreen',
      name: 'Sunscreen Lotion (SPF 50+ PA+++)',
      category: 'Toiletries & Personal Care',
      packed: false,
      notes: 'Apply generously even on overcast or snowy days'
    },
    {
      id: 'toil-lip-balm',
      name: 'Hydrating Lip Balm with UV Filter',
      category: 'Toiletries & Personal Care',
      packed: false
    },
    {
      id: 'toil-sanitizer',
      name: 'Hand Sanitizer & Disinfectant Wet Wipes',
      category: 'Toiletries & Personal Care',
      packed: false
    },
    {
      id: 'toil-wash',
      name: 'Travel-Size Shampoo, Soap & Deodorant',
      category: 'Toiletries & Personal Care',
      packed: false
    },
    {
      id: 'toil-moisturizer',
      name: 'Deep Hydrating Face & Body Moisturizer',
      category: 'Toiletries & Personal Care',
      packed: false
    },

    // Electronics & Gadgets
    {
      id: 'elec-phone-charger',
      name: 'Smartphone Fast Charger & Braided Cable',
      category: 'Electronics & Gadgets',
      packed: true
    },
    {
      id: 'elec-power-bank',
      name: 'Power Bank (10,000–20,000 mAh)',
      category: 'Electronics & Gadgets',
      packed: false,
      notes: 'Must be in carry-on bag during flights; cold drains batteries faster'
    },
    {
      id: 'elec-headphones',
      name: 'Noise-Cancelling Earbuds / Headphones',
      category: 'Electronics & Gadgets',
      packed: true,
      notes: 'Great for flights, trains, and overnight buses'
    },
    {
      id: 'elec-adapter',
      name: 'Universal Travel Adapter / Multi-pin Plug',
      category: 'Electronics & Gadgets',
      packed: false
    },
    {
      id: 'elec-camera',
      name: 'Camera / Action Cam & Extra Memory Cards',
      category: 'Electronics & Gadgets',
      packed: false,
      notes: 'Don’t forget battery charger'
    },

    // Health & Medication
    {
      id: 'health-prescriptions',
      name: 'Personal Daily Prescription Medications',
      category: 'Health & Medication',
      packed: true,
      notes: 'Carry in original packaging with doctor prescription'
    },
    {
      id: 'health-first-aid',
      name: 'First Aid Kit (Band-aids, Antiseptic, Crepe Bandage)',
      category: 'Health & Medication',
      packed: false
    },
    {
      id: 'health-stomach-ors',
      name: 'ORS Hydration Electrolyte Packets & Antacids',
      category: 'Health & Medication',
      packed: false,
      notes: 'Prevents dehydration and handles street food adjustments'
    },
    {
      id: 'health-pain-motion',
      name: 'Pain Relievers (Paracetamol) & Motion Sickness Pills',
      category: 'Health & Medication',
      packed: false,
      notes: 'Useful on winding mountain switchbacks or boat rides'
    },

    // Destination Specific
    ...(isColdOrMountain
      ? [
          {
            id: 'dest-thermal-wear',
            name: 'Thermal Innerwear (Merino wool or fleece-lined tops & bottoms)',
            category: 'Destination Specific' as PackingCategory,
            packed: true,
            quantity: 2,
            notes: 'Essential for freezing mountain nights & high altitude passes'
          },
          {
            id: 'dest-down-jacket',
            name: 'Heavy Down Jacket / Insulated Parka',
            category: 'Destination Specific' as PackingCategory,
            packed: false,
            notes: 'Windproof and water-resistant for snow and cold breezes'
          },
          {
            id: 'dest-woolen-beanie',
            name: 'Fleece Beanie, Neck Gaiter & Warm Gloves',
            category: 'Destination Specific' as PackingCategory,
            packed: false
          },
          {
            id: 'dest-sunglasses-glare',
            name: 'UV400 Polarized Sunglasses (Snow & High Altitude Glare)',
            category: 'Destination Specific' as PackingCategory,
            packed: false,
            notes: 'Prevents severe snow blindness & eye fatigue'
          },
          {
            id: 'dest-hiking-boots',
            name: 'Water-Resistant Trekking Shoes with Deep Traction Lug',
            category: 'Destination Specific' as PackingCategory,
            packed: false,
            notes: 'For trails, icy patches, and waterfall scrambles'
          }
        ]
      : isBeachOrCoastal
      ? [
          {
            id: 'dest-swimwear',
            name: 'Swimsuits / UV Rashguard / Beach Trunks',
            category: 'Destination Specific' as PackingCategory,
            packed: false,
            quantity: 2
          },
          {
            id: 'dest-microfiber-towel',
            name: 'Quick-Dry Microfiber Beach Towel',
            category: 'Destination Specific' as PackingCategory,
            packed: false
          },
          {
            id: 'dest-waterproof-pouch',
            name: 'Waterproof Phone Case & Floating Dry Bag',
            category: 'Destination Specific' as PackingCategory,
            packed: false,
            notes: 'Protects phone and wallet while kayaking or on the sand'
          },
          {
            id: 'dest-beach-slippers',
            name: 'Water Shoes / Slip-resistant Flip Flops',
            category: 'Destination Specific' as PackingCategory,
            packed: false
          },
          {
            id: 'dest-sun-hat',
            name: 'Wide-Brim Sun Hat & UV Protection Sunglasses',
            category: 'Destination Specific' as PackingCategory,
            packed: false
          }
        ]
      : isHeritageOrSpiritual
      ? [
          {
            id: 'dest-modest-attire',
            name: 'Modest Temple Attire (Shoulders & Knees Covered)',
            category: 'Destination Specific' as PackingCategory,
            packed: false,
            notes: 'Respected at all shrines, temples, and ghats'
          },
          {
            id: 'dest-slipon-shoes',
            name: 'Slip-on Shoes / Sandals (Easy Off & On)',
            category: 'Destination Specific' as PackingCategory,
            packed: false,
            notes: 'Must remove shoes frequently at religious monuments'
          },
          {
            id: 'dest-shawl-stole',
            name: 'Light Cotton Scarf or Shawl',
            category: 'Destination Specific' as PackingCategory,
            packed: false,
            notes: 'Convenient head covering & sun shield'
          },
          {
            id: 'dest-crossbody-bag',
            name: 'Anti-Theft Crossbody Sling Bag',
            category: 'Destination Specific' as PackingCategory,
            packed: false,
            notes: 'Keeps valuables safe in bustling old city bazaars'
          }
        ]
      : isSafariOrNature
      ? [
          {
            id: 'dest-earthy-clothing',
            name: 'Neutral Tone Apparel (Khaki, Olive, Brown)',
            category: 'Destination Specific' as PackingCategory,
            packed: false,
            notes: 'Bright colors startle wildlife on safari'
          },
          {
            id: 'dest-bug-spray',
            name: 'DEET Insect & Mosquito Repellent Spray',
            category: 'Destination Specific' as PackingCategory,
            packed: false
          },
          {
            id: 'dest-binoculars',
            name: 'Compact Travel Binoculars & Headlamp',
            category: 'Destination Specific' as PackingCategory,
            packed: false
          }
        ]
      : [
          {
            id: 'dest-city-daypack',
            name: 'Lightweight Compact Foldable Daypack',
            category: 'Destination Specific' as PackingCategory,
            packed: false
          },
          {
            id: 'dest-city-sunglasses',
            name: 'UV Sunglasses & Casual Stroll Shoes',
            category: 'Destination Specific' as PackingCategory,
            packed: false
          }
        ]),

    // Miscellaneous
    {
      id: 'misc-water-bottle',
      name: 'Insulated Reusable Water Bottle',
      category: 'Miscellaneous',
      packed: true,
      notes: 'Reduces single-use plastic waste; keep filled with filtered water'
    },
    {
      id: 'misc-laundry-bag',
      name: 'Washable Laundry Bag / Drawstring Bag',
      category: 'Miscellaneous',
      packed: false,
      notes: 'Separates soiled clothes from fresh luggage'
    },
    {
      id: 'misc-ziploc-bags',
      name: 'A Few Waterproof Zip-Lock Storage Pouches',
      category: 'Miscellaneous',
      packed: false,
      notes: 'Protects liquids from exploding due to air cabin pressure'
    },
    {
      id: 'misc-luggage-locks',
      name: 'TSA-Approved Luggage Locks & Bag Tags',
      category: 'Miscellaneous',
      packed: false
    }
  ];

  return items;
}
