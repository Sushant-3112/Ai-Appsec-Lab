import { Instagram, Twitter, Youtube, Music } from 'lucide-react';

const templatesData = [
  // ── Existing templates ──
  {
    id: 1,
    name: "Katy Delma",
    description: "an innovative solar design practice that brings solar energy into daily life.",
    bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000",
    bgOverlay: "bg-teal-900/40",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    textClass: "text-white",
    btnClass: "bg-white/90 text-teal-900",
    socialClass: "text-white/80",
    buttons: ["Travel Blog", "Travel Tips", "Hiking Equipment", "Camera Equipment"]
  },
  {
    id: 2,
    name: "Matthew Hugh",
    description: "Aspiring skater with a taste for cooking.",
    bgImage: "https://images.unsplash.com/photo-1542361002-23c316f73775?auto=format&fit=crop&q=80&w=1000",
    bgOverlay: "bg-black/50 lg:bg-black/40",
    avatar: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=150",
    textClass: "text-white",
    btnClass: "bg-[#e8aa82] text-white shadow-md",
    socialClass: "text-white/80",
    buttons: ["Youtube Channel", "Tiktok Account", "Instagram"]
  },
  {
    id: 3,
    name: "Richie Cohen",
    description: "Basketball today, tomorrow, and forever",
    bgImage: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=1000",
    bgOverlay: "bg-orange-600/30",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
    textClass: "text-white",
    btnClass: "bg-white text-[#d04928] shadow-md",
    socialClass: "text-white",
    buttons: ["Team Website", "Shop my merch", "Contact my manager"]
  },
  {
    id: 4,
    name: "Brew & Bite",
    description: "Coffee roasters, brewers and lovers",
    bgImage: "https://images.unsplash.com/photo-1495474472204-51e65d5bc1eb?auto=format&fit=crop&q=80&w=1000",
    bgOverlay: "bg-black/60",
    avatar: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=150",
    textClass: "text-white",
    btnClass: "bg-white/95 text-[#241c15] shadow-sm font-bold",
    socialClass: "text-white",
    buttons: ["View our menu", "Reservation", "Shop our blends", "Locations"]
  },
  {
    id: 5,
    name: "Lindsey Dennis",
    description: "Makeup | Skin | Entrepreneur",
    bgImage: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1000",
    bgOverlay: "bg-amber-900/30",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&q=80&w=150",
    textClass: "text-white",
    btnClass: "bg-[#e2c7a8] text-[#6b4724] border border-[#d6b48a]",
    socialClass: "text-white",
    buttons: ["MUA", "💅 Make Up Tutorials 💄", "Referral Codes"]
  },
  {
    id: 6,
    name: "Rich Gerald",
    description: "New wave artist",
    bgImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1000",
    bgOverlay: "bg-blue-900/60 mix-blend-multiply",
    avatar: "https://images.unsplash.com/photo-1520409364224-63400afe26e5?auto=format&fit=crop&q=80&w=150",
    textClass: "text-white drop-shadow-md",
    btnClass: "bg-[#c4493e] text-white border-b-4 border-[#852a22]",
    socialClass: "text-white",
    buttons: ["Venues", "Live Recordings", "Talent Agent"]
  },
  {
    id: 7,
    name: "Voice Messages",
    description: "Listeners can send in questions and submissions for your next episode",
    bgImage: "",
    bgOverlay: "bg-[#4b9b82]",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    textClass: "text-white",
    btnClass: "bg-white text-gray-800 shadow-sm flex-row justify-start text-left",
    socialClass: "text-emerald-100",
    buttons: ["I have a question for you about your podcast", "What is web design these days?", "Are you going to the mall today?"]
  },
  {
    id: 8,
    name: "Library",
    description: "All the audio you've ever created or uploaded to Anchor.",
    bgImage: "",
    bgOverlay: "bg-[#6348c5]",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    textClass: "text-white",
    btnClass: "bg-white text-gray-800 shadow-sm flex-row justify-start text-left",
    socialClass: "text-[#d1c4e9]",
    buttons: ["Intro song", "Outro song", "My thoughts today", "Interview with Dave"]
  },
  {
    id: 9,
    name: "Interludes",
    description: "Search interludes and find your favorites.",
    bgImage: "",
    bgOverlay: "bg-[#ea8bbb]",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    textClass: "text-white",
    btnClass: "bg-white text-gray-800 shadow-sm flex-row justify-start text-left",
    socialClass: "text-[#fce4ec]",
    buttons: ["95 West", "A Clue", "Alley", "Anomaly", "Attn"]
  },
  {
    id: 10,
    name: "Sounds",
    description: "Search sounds and find your favorites.",
    bgImage: "",
    bgOverlay: "bg-[#3f99a8]",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
    textClass: "text-white",
    btnClass: "bg-white text-gray-800 shadow-sm flex-row justify-start text-left",
    socialClass: "text-[#b2dfdb]",
    buttons: ["Popcorn", "Synth Rise", "Attention", "Bling", "Mystery"]
  },
  {
    id: 11,
    name: "Songs",
    description: "Create a 30 second transition out of any song.",
    bgImage: "",
    bgOverlay: "bg-[#3f67c4]",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    textClass: "text-white",
    btnClass: "bg-white text-gray-800 shadow-sm flex-row justify-start text-left",
    socialClass: "text-[#bbdefb]",
    buttons: ["Electro Work Jams", "Dance Party", "Beach Vibes", "Pump Up"]
  },

  // ── NEW: Image 1 – Variant A: Teal/Orange/Pink abstract, dark pill buttons ──
  {
    id: 12,
    name: "Vivi Shin",
    description: "Product Designer in Sydney",
    bgImage: "",
    bgOverlay: "",
    bgStyle: "linear-gradient(135deg, #00bcd4 0%, #00bcd4 35%, #ff6f00 60%, #e91e8c 100%)",
    avatar: "",
    avatarInitials: "VS",
    textClass: "text-white",
    btnClass: "bg-[#1a1a2e] text-white font-semibold",
    socialClass: "text-white",
    variant: "linktree-a",
    buttons: ["Digital Product", "Physical Product", "Avid Blogger", "Medium", "Brunch"],
    category: "Influencer and Creator"
  },

  // ── NEW: Image 1 – Variant B: Blue/Black/Yellow abstract, white pill buttons ──
  {
    id: 13,
    name: "Vivi Shin",
    description: "Product Designer in Sydney",
    bgImage: "",
    bgOverlay: "",
    bgStyle: "linear-gradient(135deg, #1565c0 0%, #0d47a1 30%, #111111 60%, #f9a825 100%)",
    avatar: "",
    avatarInitials: "VS",
    textClass: "text-white",
    btnClass: "bg-white text-gray-900 font-semibold",
    socialClass: "text-white",
    variant: "linktree-b",
    buttons: ["Digital Product", "Physical Product", "Avid Blogger", "Medium", "Brunch"],
    category: "Influencer and Creator"
  },

  // ── NEW: Image 1 – Variant C: Purple/Orange/Magenta abstract, yellow-green pill buttons ──
  {
    id: 14,
    name: "Vivi Shin",
    description: "Product Designer in Sydney",
    bgImage: "",
    bgOverlay: "",
    bgStyle: "linear-gradient(135deg, #1a237e 0%, #4a148c 25%, #ff6f00 55%, #e91e63 80%, #ff6f00 100%)",
    avatar: "",
    avatarInitials: "VS",
    textClass: "text-white",
    btnClass: "bg-[#c6f135] text-gray-900 font-semibold",
    socialClass: "text-white",
    variant: "linktree-c",
    buttons: ["Digital Product", "Physical Product", "Avid Blogger", "Medium", "Brunch"],
    category: "Influencer and Creator"
  },

  // ── NEW: Image 2 – Beach/Scenic background, card-style wide link buttons ──
  {
    id: 15,
    name: "Sushant Sharma",
    description: "An effective Instagram bio concisely conveys your personality, niche, or purpose, often using emojis to show rather than tell.",
    bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    bgOverlay: "bg-teal-900/30",
    avatar: "",
    avatarInitials: "SS",
    textClass: "text-white",
    btnClass: "bg-white/90 text-teal-900 font-semibold",
    socialClass: "text-white",
    variant: "beach-card",
    location: "Mumbai, India",
    email: "sushant.sharma@somaiya.edu",
    buttons: ["TheBoys", "From"],
    category: "Social Media"
  }
];

export default templatesData;
