import { Review } from '../types/travel';

export const INITIAL_REVIEWS: Review[] = [
  // --- MANALI DESTINATION REVIEWS ---
  {
    id: 'rev-dest-manali-1',
    targetId: 'dest-manali',
    targetType: 'destination',
    author: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-10-14',
    title: 'Mesmerizing Himalayan getaway! Atal Tunnel is a must-visit',
    comment: 'We visited Manali in early October. The autumn foliage was starting, skies were crystal blue, and Solang Valley offered amazing paragliding views. Don’t miss hiring a local 4x4 Gypsy to cross Atal Tunnel into Sissu—the contrast in terrain between the lush Kullu valley and the rugged dry mountains of Lahaul is breathtaking!',
    travelerType: 'Couple',
    monthOfVisit: 'October 2026',
    helpfulCount: 28,
    isDemo: true
  },
  {
    id: 'rev-dest-manali-2',
    targetId: 'dest-manali',
    targetType: 'destination',
    author: 'Rohan Mehra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-09-22',
    title: 'Old Manali cafes and Jogini Falls made this trip special',
    comment: 'Stayed in Old Manali for 5 days working remotely. The mountain cafes with wood-fired pizzas, live acoustic music, and riverside sounds are pure therapy. The hike up to Jogini Waterfall from Vashisht takes around an hour and is totally worth the trek.',
    travelerType: 'Solo',
    monthOfVisit: 'September 2026',
    helpfulCount: 19,
    isDemo: true
  },
  {
    id: 'rev-dest-manali-3',
    targetId: 'dest-manali',
    targetType: 'destination',
    author: 'Vikram & Ananya Sengupta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 4,
    date: '2026-08-30',
    title: 'Great family vacation, but watch out for Mall Road traffic',
    comment: 'Our kids loved the river rafting in Kullu and hot springs at Vashisht. The mountain views from the resort were spectacular. Only downside is Mall Road gets heavily congested in the evenings, so walk instead of taking cabs within town.',
    travelerType: 'Family',
    monthOfVisit: 'August 2026',
    helpfulCount: 14,
    isDemo: true
  },
  {
    id: 'rev-dest-manali-4',
    targetId: 'dest-manali',
    targetType: 'destination',
    author: 'Kavita Nair',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-06-12',
    title: 'The Himachali Dhaam and Hadimba cedar forest are sublime',
    comment: 'Try traditional Siddu with desi ghee at local food stalls. Visiting Hadimba temple in the morning mist when bells chime among ancient towering deodars is an unforgettable spiritual experience.',
    travelerType: 'Friends',
    monthOfVisit: 'June 2026',
    helpfulCount: 22,
    isDemo: true
  },

  // --- GOA DESTINATION REVIEWS ---
  {
    id: 'rev-dest-goa-1',
    targetId: 'dest-goa',
    targetType: 'destination',
    author: 'Aditya Kapoor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-10-02',
    title: 'South Goa peaceful shores & heritage Fontainhas tour',
    comment: 'Avoid the typical crowded party strips if you want real Goa! Rent a scooter and explore the pastel Portuguese villas of Fontainhas in Panjim, then head south to Palolem and Agonda. The sunset beach shacks serving grilled kingfish and fresh lime soda are unmatched.',
    travelerType: 'Couple',
    monthOfVisit: 'September 2026',
    helpfulCount: 35,
    isDemo: true
  },
  {
    id: 'rev-dest-goa-2',
    targetId: 'dest-goa',
    targetType: 'destination',
    author: 'Sophie Martin',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    rating: 4,
    date: '2026-08-18',
    title: 'Lush green monsoon magic, but water sports closed',
    comment: 'Monsoon in Goa is so underrated. Everything turns vibrant emerald, waterfalls like Dudhsagar roar with vigor, and luxury stays offer deep discounts. Just keep in mind that beach shacks and ocean swimming are shut down during June-August.',
    travelerType: 'Solo',
    monthOfVisit: 'August 2026',
    helpfulCount: 16,
    isDemo: true
  },

  // --- JAIPUR DESTINATION REVIEWS ---
  {
    id: 'rev-dest-jaipur-1',
    targetId: 'dest-jaipur',
    targetType: 'destination',
    author: 'Devendra Rathore',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-10-19',
    title: 'Amer Fort elephant trail and sunset at Nahargarh',
    comment: 'Jaipur’s royal architecture is majestic. Nahargarh fort at golden hour gives a panoramic view over the entire Pink City. Be sure to hire an authorized audio guide at City Palace and don’t skip Pyaz Kachori at Rawat Mishtan Bhandar!',
    travelerType: 'Family',
    monthOfVisit: 'October 2026',
    helpfulCount: 41,
    isDemo: true
  },

  // --- UDAIPUR DESTINATION REVIEWS ---
  {
    id: 'rev-dest-udaipur-1',
    targetId: 'dest-udaipur',
    targetType: 'destination',
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-10-21',
    title: 'The Venice of the East — pure romance and tranquility',
    comment: 'Lake Pichola at dusk with Taj Lake Palace lit up in the middle of the water is something out of a fairytale. The sunset boat cruise is an absolute essential.',
    travelerType: 'Couple',
    monthOfVisit: 'October 2026',
    helpfulCount: 29,
    isDemo: true
  },

  // --- LEH LADAKH DESTINATION REVIEWS ---
  {
    id: 'rev-dest-leh-1',
    targetId: 'dest-leh',
    targetType: 'destination',
    author: 'Karan Singhania',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-09-10',
    title: 'High altitude wonderland. Pangong Lake blue hues are surreal',
    comment: 'Take 48 hours to acclimatize in Leh town before driving to Khardung La or Pangong Tso. Stay hydrated with garlic soup and kahwa tea. The midnight sky in Nubra Valley shows the Milky Way clearly with the naked eye!',
    travelerType: 'Friends',
    monthOfVisit: 'September 2026',
    helpfulCount: 48,
    isDemo: true
  },

  // --- HOTEL REVIEWS (e.g. Manu Allaya, Taj Lake Palace) ---
  {
    id: 'rev-hotel-manu-1',
    targetId: 'hotel-manu-allaya',
    targetType: 'hotel',
    author: 'Siddharth V.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-10-11',
    title: 'Incredible cedar valley views and warm hospitality',
    comment: 'The garden luxury rooms overlook snow-clad peaks. The heated indoor pool was wonderful after a chilly evening hike. Buffet breakfast had both traditional Himachali dishes and continental spreads.',
    travelerType: 'Couple',
    monthOfVisit: 'October 2026',
    helpfulCount: 15,
    isDemo: true
  },
  {
    id: 'rev-hotel-manu-2',
    targetId: 'hotel-manu-allaya',
    targetType: 'hotel',
    author: 'Meera Chawla',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 4,
    date: '2026-08-15',
    title: 'Peaceful stay away from the noise of Mall road',
    comment: 'Located in sunny side of Manali so it stays quieter than city center hotels. Staff arranged an early morning packed breakfast box for our Atal Tunnel day excursion.',
    travelerType: 'Family',
    monthOfVisit: 'August 2026',
    helpfulCount: 8,
    isDemo: true
  },
  {
    id: 'rev-hotel-taj-lake-1',
    targetId: 'hotel-taj-lake-palace',
    targetType: 'hotel',
    author: 'Alistair Crawford',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-10-05',
    title: 'One of the most extraordinary hotel experiences on earth',
    comment: 'Arriving by private boat at the palace steps with rose petals showering down is unforgettable. Royal butler service was discreet and attentive. The lily pond courtyard dinner is pure magic.',
    travelerType: 'Couple',
    monthOfVisit: 'October 2026',
    helpfulCount: 31,
    isDemo: true
  },

  // --- ATTRACTION REVIEWS (Hadimba, Fontainhas, etc.) ---
  {
    id: 'rev-attr-hadimba-1',
    targetId: 'attr-hadimba',
    targetType: 'attraction',
    author: 'Sunita Joshi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-10-18',
    title: 'Ancient 16th century wooden pagoda temple among giant deodars',
    comment: 'The intricate wood carvings depict mythical beasts and deities. Early morning around 7:30 AM is the best time to visit when the sun rays filter through the pine mist and the crowd hasn’t arrived yet.',
    travelerType: 'Family',
    monthOfVisit: 'October 2026',
    helpfulCount: 17,
    isDemo: true
  },
  {
    id: 'rev-attr-fontainhas-1',
    targetId: 'attr-fontainhas',
    targetType: 'attraction',
    author: 'Marcus Lee',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-09-25',
    title: 'Photographer’s dream walk through Portuguese history',
    comment: 'Yellow, indigo, and terracotta houses with traditional wooden balconies and rooster weather vanes. Stop by Confeitaria 31 De Janeiro for fresh warm custard pastéis de nata!',
    travelerType: 'Solo',
    monthOfVisit: 'September 2026',
    helpfulCount: 24,
    isDemo: true
  },

  // --- RESTAURANT REVIEWS ---
  {
    id: 'rev-rest-cafe-1947-1',
    targetId: 'rest-cafe-1947',
    targetType: 'restaurant',
    author: 'Tanya Grover',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-10-16',
    title: 'Riverside sound, thin crust pizza, and great coffee',
    comment: 'Sit by the outdoor wooden deck right on the Manalsu river rapids. We had the Bella Vista woodfired pizza, garlic trout fish, and cold brew coffee. Excellent bohemian vibe with board games and guitar acoustics.',
    travelerType: 'Friends',
    monthOfVisit: 'October 2026',
    helpfulCount: 20,
    isDemo: true
  },
  {
    id: 'rev-rest-vinayak-1',
    targetId: 'rest-vinayak-family-goa',
    targetType: 'restaurant',
    author: 'Nikhil D’Souza',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-09-18',
    title: 'The gold standard of authentic Goan Fish Curry Thalis',
    comment: 'Overlooking scenic green paddy fields in Assagao. The Chonak (sea bass) rava fry and prawn curry thali served with kismur and sol kadi is delicious beyond words. Get there by 12:45 PM to avoid the line!',
    travelerType: 'Family',
    monthOfVisit: 'September 2026',
    helpfulCount: 38,
    isDemo: true
  }
];
