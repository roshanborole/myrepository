export interface Video {
  id: string;
  title: string;
  category: string;
  categories: string[];
  duration: string;
  date: string;
  views: string;
  likes: string;
  poster: string;
  videoUrl: string;
  description: string;
}

export const VIDEO_CATALOG: Video[] = [
  {
    id: "v-grand-final",
    title: "Grand Derby RPL Final: Royal Thunder vs Coastal Titans - Extended 4K Highlights",
    category: "Match Highlights",
    categories: ["Match Highlights", "Best Moments"],
    duration: "18:42",
    date: "Oct 14, 2024",
    views: "428K Views",
    likes: "98.4%",
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8AOC6PdoSy7QCfuLnFCwjRDPIBvoUB9Ut-wfjcJ4W42wq_hpowayQmH5vYw2JqCgc4QUEJBE3jA21QCqWbiVFPIk-cMho1JzE36S-F6_GuVBNzjg1pjyAUy2PFRC6upoTgcrimrSizIyKrbpVHxCDU5ShePe2OlJ_GQUxThI_NNNMef-Yg3VnvnuG8bxZZvg8J1rZHtWstfW374ZAUFS8UrfSRs4ICLSZNPEEvtP2YF3XQIM9Ip7PFg",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Witness the historic final over under 3,200 lux floodlights as Miller smashes 24 runs in 5 deliveries to seal the championship before a roaring 55,000 capacity crowd at RoshSpark Stadium. Includes dual stump audio and ball telemetry overlay."
  },
  {
    id: "v-pitch-curator",
    title: "Pitch Cam: Head Curator Explains Dry-Deck Preparation for Matchday 4",
    category: "Behind the Scenes",
    categories: ["Behind the Scenes", "Stadium Tour"],
    duration: "08:15",
    date: "2 days ago",
    views: "84K views",
    likes: "97.1%",
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9as81whFvPhRskLQiSrHLGiWXoJPrZSQ-17U6olmmqRGnvgF3WyvextsHSZ5RcgLX2e4iChShL1Q1dMpy9y6dJ5uKwrl3ZTBPariw4pXRHK75SWtby9CkFK0XhVk7zSdClxHyo5DUnOUYRR9wxlEAkX-YokX1MfLWH3jd9ZJbTauSSeQIhI0mZXplaIi9tBjsVZqzploCCqRnQKjMLoR_7yBeeQqGeXXmTvFtw7nFX6T9okN1RbskfA",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Deep dive into soil compaction, grass shears, and predicted turn ratings for the decisive 2nd innings under the night moisture with head curator Frank Miller."
  },
  {
    id: "v-drone-flyover",
    title: "Drone Flyover: RoshSpark Stadium Under Radiant 3,200 Lux Floodlights",
    category: "Stadium Tour",
    categories: ["Stadium Tour", "Best Moments"],
    duration: "05:40",
    date: "1 week ago",
    views: "1.2M views",
    likes: "99.2%",
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTE3K-7a8a_XxFsaiupHWRB_m48-wcT7BmHdd8TD6AXIrPudlg1odwdwtJrXqjf1xLtY1lHDr527w4zI0_5dR1FRuseIY0AatFQDX7Z0NHWEB_-P-Ree3CNZGZeqs8yUwW3O4FMNhYA_TNDAf0pKLld8m7FnftU3NmS0kNEgXVG2vqs925mRERj4qN5AKdbIjv0NqK9UQ5-WsDaKOPf1zjO-eHdDjniNBs9IubL9E50-giGsWLkS_Tig",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Experience the stadium from breathtaking angles captured via cinematic FPV drones showcasing our modern acoustic architecture and illuminated roof geometry."
  },
  {
    id: "v-press-conf",
    title: "Post-Match Press Conference: Captain & Head Coach on Historic Chase",
    category: "Player Interviews",
    categories: ["Player Interviews", "Behind the Scenes"],
    duration: "22:10",
    date: "3 days ago",
    views: "112K views",
    likes: "95.6%",
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW_6WPk4E7amWcoAMquvMathsiK7k0GDNVQ0dtVIIfd1rOApgka2HQdTlsJgwEsL21zfPXmmVtd8qpvKJmRhtWJlcm1g4y-8XhA8Ad3LULwDkVmroh3IrygjT4o_EE4YWxX70LSPaU4ht38FcmVvcKl1LycNrcmgmrVK4sDtlySOyzFp1iLBxVAeQXKgSifnEaJLwZ77atQ9vjdhmnNFRpwIrSUDhC5DXmeUF_tT5VynqV7KeEYNKXBg",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Unfiltered post-match analysis directly from the RoshSpark Press Pavilion following the heart-stopping last-ball triumph against the Southern Vipers."
  },
  {
    id: "v-slomo-wicket",
    title: "Ultra Slo-Mo: 152 km/h Stump-Shattering Yorker by R. Khan",
    category: "Best Wickets",
    categories: ["Best Wickets", "Best Moments"],
    duration: "02:30",
    date: "4 days ago",
    views: "650K views",
    likes: "99.5%",
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzdvpawgsBvPMsLh5elul11AHgNdv5RzRmDTTikn29u8vIM74JKQN7Ikwg_ScU_c-K0Plyk_1wKHZl16KCJIqsESUhPUZWs5gvDwwb8dyQcQVHJoQdgwNkLhDxc3xXuj87jpdpg2a8wMur9wq7j2ZC8fbpg5QZCHLUVdm9lc2jJIX_dK_L603dI5ERsZy8b-L8iXhQoMq-ejiorqAlADsGB8BKhr0yGtpT0Llp1ibEuLIo_Z0UjBMNog",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    description: "Rendered at 1000 frames per second: watch the seam position, release whip, and devastating ball impact that dismantled middle stump into pieces."
  },
  {
    id: "v-sixes-reel",
    title: "Monstrous Hits: Top 10 Longest Sixes Cleared Over RoshSpark Canopy",
    category: "Best Sixes",
    categories: ["Best Sixes", "Best Moments", "Match Highlights"],
    duration: "10:14",
    date: "5 days ago",
    views: "890K views",
    likes: "98.8%",
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8AOC6PdoSy7QCfuLnFCwjRDPIBvoUB9Ut-wfjcJ4W42wq_hpowayQmH5vYw2JqCgc4QUEJBE3jA21QCqWbiVFPIk-cMho1JzE36S-F6_GuVBNzjg1pjyAUy2PFRC6upoTgcrimrSizIyKrbpVHxCDU5ShePe2OlJ_GQUxThI_NNNMef-Yg3VnvnuG8bxZZvg8J1rZHtWstfW374ZAUFS8UrfSRs4ICLSZNPEEvtP2YF3XQIM9Ip7PFg",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "Every jaw-dropping 110m+ maximum hit outside the stadium roof perimeter during the tournament, featuring Hawk-Eye ball trajectory graphs."
  },
  {
    id: "v-acrobatic-catches",
    title: "Airborne Brilliance: Greatest Boundary Catches at Mid-Wicket",
    category: "Best Catches",
    categories: ["Best Catches", "Best Moments"],
    duration: "06:45",
    date: "6 days ago",
    views: "520K views",
    likes: "97.9%",
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuBe-WG2RSK1E662RumnnuBUm07DSNfec2iRPmRhsYpjQ42-ldohQHCEmD3DwsYeew_a7klJgenbTVxKAwb9-ArXm6w8xAeY1dR-Bf0vFsG4_P2EZd8DtkFXg57Db5njsrx44MjeITQhqyQZvSzn8-f5KZ6GLNXTpZxmZRvU3jb4Y8pdaSAnY8d79jV-_QJHNty4ROAgDsp1hzwi-glwnFLMctIKDg8pF-6Wr94XTWCgQLc4p-j_YXBbMg",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    description: "Gravity-defying boundary relay catches and diving slips from the 2024 season filmed from multi-angle high speed cameras."
  },
  {
    id: "v-vip-skyline",
    title: "VIP Pavilion & Skyline Suite: Matchday Hospitality Walkthrough",
    category: "Stadium Tour",
    categories: ["Stadium Tour", "Behind the Scenes"],
    duration: "06:15",
    date: "5 days ago",
    views: "45K views",
    likes: "94.2%",
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnYSveuxnPI0AWWx6UgRzJYGbnsIwUUXSbIZe0xPi8x12H7hH-f7NYn_VdrczFx9G0Rfv3fwhim0F98H0B3u4A_530mrkruA32ZuFmqeV_kNWKCjqvNd0FqMUi6M5E6ne1dSPCEkvkQJ9ZvGNeZGjJBQJUPP3ZarfGi5ZBQ4uofSv-8KbjyIutJN72ohaE85sM1hyPajzJJV9qw_AhaoYfSQ2qMlya3uYzIjDrjEm1CJkBskuAvPRs4w",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description: "Inside look at five-star Michelin hospitality, executive boxes, private tasting menus, and luxury pitch-facing suites overlooking the oval."
  },
  {
    id: "v-concourse-ops",
    title: "Behind The Scenes: How 55,000 Fans Enter in Under 25 Minutes",
    category: "Behind the Scenes",
    categories: ["Behind the Scenes", "Stadium Tour"],
    duration: "11:20",
    date: "1 week ago",
    views: "92K views",
    likes: "96.4%",
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnP_3hDyGl8UNq3ZZYCs9Rzlp19z4gkWQ2mjiqSplBQJMA3xNGHBakZTkAwnb1lsmOJy878RZLtFnh7yNSnaRsdfCtCZ7UXA9823jxqq96Cv6WErLmBEPG0muPfvnxHBX1j4OGynovztWdww6oASwB5zw5mmi61I4eAZA4RUG7bzMgoEkeKR25RFjbd79CeZ49nq9OD67nxQMeoTyYw5JyogomgWpc2zdU7ogXBs5MPF6CBHx1T7DOtQ",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description: "Our stadium operations director breaks down the NFC fast-track turnstiles and logistical engineering keeping entry queues strictly at zero."
  },
  {
    id: "v-player-intv-miller",
    title: "Man of the Match Interview: David Miller on 24 Runs in Final Over",
    category: "Player Interviews",
    categories: ["Player Interviews", "Best Moments"],
    duration: "09:30",
    date: "2 days ago",
    views: "340K views",
    likes: "98.9%",
    poster: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW_6WPk4E7amWcoAMquvMathsiK7k0GDNVQ0dtVIIfd1rOApgka2HQdTlsJgwEsL21zfPXmmVtd8qpvKJmRhtWJlcm1g4y-8XhA8Ad3LULwDkVmroh3IrygjT4o_EE4YWxX70LSPaU4ht38FcmVvcKl1LycNrcmgmrVK4sDtlySOyzFp1iLBxVAeQXKgSifnEaJLwZ77atQ9vjdhmnNFRpwIrSUDhC5DXmeUF_tT5VynqV7KeEYNKXBg",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    description: "Exclusive fieldside sit-down discussing game plan adjustments, pacing under extreme crowd noise, and lifting the championship trophy."
  }
];

export const MULTI_CAMS = [
  { id: "cam1", name: "SpiderCam Pitch Overhead", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", label: "CAM 01 • SPIDERCAM" },
  { id: "cam2", name: "North Stand Wide Deck", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", label: "CAM 02 • NORTH STAND" },
  { id: "cam3", name: "Crease Level Micro-Cam", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", label: "CAM 03 • CREASE HD" },
  { id: "cam4", name: "Dugout Strategy Cam", url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4", label: "CAM 04 • DUGOUT" }
];

export function getAllVideos() {
  return VIDEO_CATALOG;
}

export function getVideoById(id: string) {
  return VIDEO_CATALOG.find((v) => v.id === id);
}

export function getRelatedVideos(category: string, currentId: string) {
  return VIDEO_CATALOG.filter((v) => v.categories.includes(category) && v.id !== currentId).slice(0, 4);
}
