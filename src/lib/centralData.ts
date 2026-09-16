export type MatchStatus = 'LIVE' | 'RECENT' | 'UPCOMING' | 'BREAK' | 'COMPLETED' | 'ABANDONED' | 'POSTPONED' | 'CANCELLED' | 'NO RESULT' | 'DRAW' | 'TIED';
export type MatchCategory = 'ICC' | 'RPL' | 'DOMESTIC' | 'WOMENS' | 'T20 LEAGUE' | 'PREMIER LEAGUE';
export type MatchFormat = 'T20' | 'ODI' | 'TEST' | 'T20I' | 'MULTI-DAY' | 'ONE-DAY';
export type PlayerRole = 'Batter' | 'Bowler' | 'All-rounder' | 'Wicketkeeper';

export interface CentralPlayer {
  id: string;
  name: string;
  shortName: string;
  jersey: number;
  role: PlayerRole;
  battingStyle: string;
  bowlingStyle: string;
  teamId: string;
  teamName: string;
  age: number;
  dob: string;
  nationality: string;
  avatar: string;
  // Stadium specific statistics at RoshSpark Cricket Stadium
  stadiumStats: {
    matches: number;
    innings: number;
    runs: number;
    highestScore: string;
    average: number;
    strikeRate: number;
    centuries: number;
    fifties: number;
    fours: number;
    sixes: number;
    // Bowling
    oversBowled: number;
    wickets: number;
    runsConceded: number;
    economy: number;
    bowlingAverage: number;
    bestFigures: string;
    maidens: number;
    dotBalls: number;
    // Fielding
    catches: number;
    runOuts: number;
    stumpings: number;
    // All-rounder rating
    allRounderRating: number;
  };
  recentForm: { match: string; runs?: number; wickets?: number; balls?: number; opp: string }[];
  achievements: string[];
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  secondaryColor?: string;
  logoUrl?: string;
}

export interface BattingStats {
  name: string;
  dismissal: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: string;
  isStriker?: boolean;
  isNonStriker?: boolean;
}

export interface BowlingStats {
  name: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
  economy: string;
  dots: number;
  isActive?: boolean;
}

export interface InningsScorecard {
  teamId: string;
  teamName: string;
  inningsNumber: number;
  total: string;
  overs: string;
  runRate: string;
  extras: string;
  fallOfWickets: string;
  batters: BattingStats[];
  bowlers: BowlingStats[];
}

export interface CommentaryEvent {
  overBall: string;
  runs: number;
  outcome: 'DOT BALL' | '1 RUN' | '2 RUNS' | '3 RUNS' | 'FOUR' | 'SIX' | 'WICKET' | 'WIDE' | 'NO BALL' | 'BYE' | 'LEG BYE';
  batter: string;
  bowler: string;
  description: string;
  isWicket?: boolean;
  wicketType?: string;
  wicketPlayer?: string;
}

export interface OverSummary {
  overNumber: number;
  runs: number;
  wickets: number;
  bowler: string;
  events: string[];
}

export interface MatchLiveState {
  target: number;
  totalBalls: number; // e.g. 120 for T20
  currentRuns: number;
  currentWickets: number;
  ballsBowled: number;
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  partnershipRuns: number;
  partnershipBalls: number;
  fallOfWickets: { score: number; wicket: number; over: string; player: string }[];
  commentaryHistory: CommentaryEvent[];
}

export interface MatchInfo {
  matchNumber: string;
  format: MatchFormat;
  date: string;
  time: string;
  venue: string;
  toss: string;
  tossDecision: string;
  umpires: string;
  thirdUmpire: string;
  matchReferee: string;
  pitch: string;
  weather: string;
  matchStatusText: string;
  potm?: string;
}

export interface MatchHighlight {
  id: string;
  title: string;
  duration: string;
  timestamp: string;
  category: 'Match Highlights' | 'Best Sixes' | 'Best Fours' | 'Best Wickets' | 'Best Catches' | 'Important Moments';
  thumbnailUrl: string;
  videoUrl: string;
}

export interface MatchArticle {
  id: string;
  headline: string;
  category: string;
  date: string;
  shortDescription: string;
  content: string;
  author: string;
}

export interface MatchGraphData {
  overs: number[];
  team1RunsPerOver: number[];
  team2RunsPerOver: number[];
  team1Cumulative: number[];
  team2Cumulative: number[];
  team1Wickets: { over: number; runs: number; player: string }[];
  team2Wickets: { over: number; runs: number; player: string }[];
  partnerships: { batters: string; runs: number; balls: number }[];
  requiredRunRateTimeline: { over: number; rrr: number; crr: number }[];
}

export interface Match {
  id: string;
  status: MatchStatus;
  category: MatchCategory;
  format: MatchFormat;
  tournament: string;
  matchName: string;
  matchNumber?: string;
  gender?: "Men's" | "Women's";
  breakType?: string;
  isToday?: boolean;
  month?: string;
  year?: string;
  target?: number;
  datetime: string;
  dateShort: string;
  time: string;
  venue: string;
  team1: Team;
  team2: Team;
  team1Score?: string;
  team1Overs?: string;
  team2Score?: string;
  team2Overs?: string;
  resultSummary?: string;
  ticketsStartingPrice?: number;
  info: MatchInfo;
  liveState?: MatchLiveState;
  scorecard: InningsScorecard[];
  oversData: OverSummary[];
  commentary: CommentaryEvent[];
  highlights: MatchHighlight[];
  news: MatchArticle[];
  graphs?: MatchGraphData;
}

// -------------------------------------------------------------
// PLAYERS 01 TO 22 (Consistent players used across the entire site)
// -------------------------------------------------------------
export const CENTRAL_PLAYERS: CentralPlayer[] = [
  {
    id: "p01",
    name: "Player 01",
    shortName: "Player 01",
    jersey: 1,
    role: "Batter",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm off break",
    teamId: "ind",
    teamName: "India",
    age: 27,
    dob: "14 Jan 1999",
    nationality: "Indian",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 18,
      innings: 18,
      runs: 742,
      highestScore: "112*",
      average: 46.38,
      strikeRate: 154.26,
      centuries: 2,
      fifties: 5,
      fours: 78,
      sixes: 29,
      oversBowled: 4.0,
      wickets: 1,
      runsConceded: 32,
      economy: 8.0,
      bowlingAverage: 32.0,
      bestFigures: "1/18",
      maidens: 0,
      dotBalls: 8,
      catches: 12,
      runOuts: 3,
      stumpings: 0,
      allRounderRating: 62.5
    },
    recentForm: [
      { match: "vs AUS", runs: 45, balls: 30, opp: "Australia" },
      { match: "vs ENG", runs: 82, balls: 51, opp: "England" },
      { match: "vs RSA", runs: 18, balls: 14, opp: "South Africa" },
      { match: "vs NZ", runs: 112, balls: 68, opp: "New Zealand" }
    ],
    achievements: ["Fastest T20 century at RoshSpark Stadium (48 balls)", "Player of the Match vs NZ 2025"]
  },
  {
    id: "p02",
    name: "Player 02",
    shortName: "Player 02",
    jersey: 2,
    role: "Batter",
    battingStyle: "Left-hand bat",
    bowlingStyle: "Right-arm medium",
    teamId: "ind",
    teamName: "India",
    age: 25,
    dob: "22 Mar 2001",
    nationality: "Indian",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 14,
      innings: 14,
      runs: 560,
      highestScore: "89",
      average: 43.07,
      strikeRate: 147.8,
      centuries: 0,
      fifties: 4,
      fours: 62,
      sixes: 21,
      oversBowled: 0,
      wickets: 0,
      runsConceded: 0,
      economy: 0,
      bowlingAverage: 0,
      bestFigures: "-",
      maidens: 0,
      dotBalls: 0,
      catches: 9,
      runOuts: 2,
      stumpings: 0,
      allRounderRating: 48.0
    },
    recentForm: [
      { match: "vs AUS", runs: 20, balls: 15, opp: "Australia" },
      { match: "vs ENG", runs: 64, balls: 42, opp: "England" },
      { match: "vs RSA", runs: 39, balls: 28, opp: "South Africa" }
    ],
    achievements: ["Best opening partnership (148 runs) at RoshSpark"]
  },
  {
    id: "p03",
    name: "Player 03",
    shortName: "Player 03",
    jersey: 3,
    role: "All-rounder",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm fast",
    teamId: "ind",
    teamName: "India",
    age: 28,
    dob: "05 Jun 1998",
    nationality: "Indian",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 22,
      innings: 19,
      runs: 615,
      highestScore: "78*",
      average: 38.43,
      strikeRate: 161.4,
      centuries: 0,
      fifties: 5,
      fours: 54,
      sixes: 34,
      oversBowled: 74.2,
      wickets: 28,
      runsConceded: 580,
      economy: 7.8,
      bowlingAverage: 20.71,
      bestFigures: "4/22",
      maidens: 3,
      dotBalls: 168,
      catches: 15,
      runOuts: 4,
      stumpings: 0,
      allRounderRating: 88.5
    },
    recentForm: [
      { match: "vs AUS", runs: 65, balls: 40, wickets: 2, opp: "Australia" },
      { match: "vs ENG", runs: 42, balls: 24, wickets: 3, opp: "England" },
      { match: "vs RSA", runs: 12, balls: 8, wickets: 1, opp: "South Africa" }
    ],
    achievements: ["Highest All-rounder impact score at RoshSpark", "4-wicket haul under floodlights"]
  },
  {
    id: "p04",
    name: "Player 04",
    shortName: "Player 04",
    jersey: 4,
    role: "Batter",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm leg break",
    teamId: "ind",
    teamName: "India",
    age: 26,
    dob: "18 Aug 2000",
    nationality: "Indian",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 16,
      innings: 16,
      runs: 512,
      highestScore: "95",
      average: 36.57,
      strikeRate: 142.1,
      centuries: 0,
      fifties: 3,
      fours: 48,
      sixes: 18,
      oversBowled: 8.0,
      wickets: 3,
      runsConceded: 65,
      economy: 8.12,
      bowlingAverage: 21.66,
      bestFigures: "2/14",
      maidens: 0,
      dotBalls: 16,
      catches: 8,
      runOuts: 1,
      stumpings: 0,
      allRounderRating: 54.2
    },
    recentForm: [
      { match: "vs AUS", runs: 15, balls: 10, opp: "Australia" },
      { match: "vs ENG", runs: 53, balls: 36, opp: "England" }
    ],
    achievements: ["Match-winning 95 vs Australia in 2024"]
  },
  {
    id: "p05",
    name: "Player 05",
    shortName: "Player 05",
    jersey: 5,
    role: "Wicketkeeper",
    battingStyle: "Right-hand bat",
    bowlingStyle: "None",
    teamId: "ind",
    teamName: "India",
    age: 29,
    dob: "11 Nov 1996",
    nationality: "Indian",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 24,
      innings: 20,
      runs: 680,
      highestScore: "84*",
      average: 42.5,
      strikeRate: 158.9,
      centuries: 0,
      fifties: 6,
      fours: 60,
      sixes: 31,
      oversBowled: 0,
      wickets: 0,
      runsConceded: 0,
      economy: 0,
      bowlingAverage: 0,
      bestFigures: "-",
      maidens: 0,
      dotBalls: 0,
      catches: 28,
      runOuts: 6,
      stumpings: 14,
      allRounderRating: 68.0
    },
    recentForm: [
      { match: "vs AUS", runs: 25, balls: 15, opp: "Australia" },
      { match: "vs ENG", runs: 44, balls: 22, opp: "England" }
    ],
    achievements: ["Most dismissals by a wicketkeeper at RoshSpark (48 dismissals)"]
  },
  {
    id: "p06",
    name: "Player 06",
    shortName: "Player 06",
    jersey: 6,
    role: "All-rounder",
    battingStyle: "Left-hand bat",
    bowlingStyle: "Slow left-arm orthodox",
    teamId: "ind",
    teamName: "India",
    age: 30,
    dob: "03 Feb 1996",
    nationality: "Indian",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 26,
      innings: 21,
      runs: 490,
      highestScore: "62*",
      average: 32.66,
      strikeRate: 138.4,
      centuries: 0,
      fifties: 2,
      fours: 42,
      sixes: 16,
      oversBowled: 92.0,
      wickets: 34,
      runsConceded: 644,
      economy: 7.0,
      bowlingAverage: 18.94,
      bestFigures: "4/15",
      maidens: 4,
      dotBalls: 240,
      catches: 18,
      runOuts: 5,
      stumpings: 0,
      allRounderRating: 91.0
    },
    recentForm: [
      { match: "vs AUS", runs: 5, balls: 5, wickets: 1, opp: "Australia" },
      { match: "vs ENG", runs: 28, balls: 19, wickets: 2, opp: "England" }
    ],
    achievements: ["Best economy rate by a spinner at RoshSpark (7.00)", "RoshSpark MVP 2025"]
  },
  {
    id: "p07",
    name: "Player 07",
    shortName: "Player 07",
    jersey: 7,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm off break",
    teamId: "ind",
    teamName: "India",
    age: 26,
    dob: "30 Sep 1999",
    nationality: "Indian",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 17,
      innings: 8,
      runs: 88,
      highestScore: "24*",
      average: 14.66,
      strikeRate: 118.9,
      centuries: 0,
      fifties: 0,
      fours: 7,
      sixes: 3,
      oversBowled: 64.0,
      wickets: 25,
      runsConceded: 472,
      economy: 7.37,
      bowlingAverage: 18.88,
      bestFigures: "3/18",
      maidens: 2,
      dotBalls: 156,
      catches: 7,
      runOuts: 1,
      stumpings: 0,
      allRounderRating: 58.5
    },
    recentForm: [
      { match: "vs AUS", runs: 0, balls: 2, wickets: 0, opp: "Australia" },
      { match: "vs ENG", runs: 12, balls: 7, wickets: 2, opp: "England" }
    ],
    achievements: ["Leading powerplay wicket-taker at RoshSpark"]
  },
  {
    id: "p08",
    name: "Player 08",
    shortName: "Player 08",
    jersey: 8,
    role: "Batter",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm fast-medium",
    teamId: "aus",
    teamName: "Australia",
    age: 31,
    dob: "12 Dec 1994",
    nationality: "Australian",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 21,
      innings: 20,
      runs: 890,
      highestScore: "108*",
      average: 55.62,
      strikeRate: 164.2,
      centuries: 3,
      fifties: 6,
      fours: 94,
      sixes: 42,
      oversBowled: 32.0,
      wickets: 12,
      runsConceded: 275,
      economy: 8.59,
      bowlingAverage: 22.91,
      bestFigures: "3/26",
      maidens: 1,
      dotBalls: 72,
      catches: 14,
      runOuts: 2,
      stumpings: 0,
      allRounderRating: 79.4
    },
    recentForm: [
      { match: "vs IND", runs: 72, balls: 45, opp: "India" },
      { match: "vs ENG", runs: 68, balls: 38, opp: "England" },
      { match: "vs RSA", runs: 104, balls: 59, opp: "South Africa" }
    ],
    achievements: ["Most Sixes hit at RoshSpark Stadium (42 sixes)", "Current Rank #1 Batsman at RoshSpark"]
  },
  {
    id: "p09",
    name: "Player 09",
    shortName: "Player 09",
    jersey: 9,
    role: "Batter",
    battingStyle: "Left-hand bat",
    bowlingStyle: "Right-arm off break",
    teamId: "aus",
    teamName: "Australia",
    age: 24,
    dob: "19 Jul 2002",
    nationality: "Australian",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 12,
      innings: 12,
      runs: 480,
      highestScore: "76",
      average: 43.63,
      strikeRate: 144.5,
      centuries: 0,
      fifties: 4,
      fours: 52,
      sixes: 17,
      oversBowled: 6.0,
      wickets: 2,
      runsConceded: 48,
      economy: 8.0,
      bowlingAverage: 24.0,
      bestFigures: "2/20",
      maidens: 0,
      dotBalls: 14,
      catches: 7,
      runOuts: 1,
      stumpings: 0,
      allRounderRating: 52.0
    },
    recentForm: [
      { match: "vs IND", runs: 24, balls: 18, opp: "India" },
      { match: "vs RSA", runs: 58, balls: 40, opp: "South Africa" }
    ],
    achievements: ["Emerging Player of the RPL 2025"]
  },
  {
    id: "p10",
    name: "Player 10",
    shortName: "Player 10",
    jersey: 10,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm fast",
    teamId: "aus",
    teamName: "Australia",
    age: 29,
    dob: "25 Apr 1997",
    nationality: "Australian",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 23,
      innings: 10,
      runs: 95,
      highestScore: "28*",
      average: 15.83,
      strikeRate: 130.1,
      centuries: 0,
      fifties: 0,
      fours: 9,
      sixes: 4,
      oversBowled: 88.0,
      wickets: 38,
      runsConceded: 650,
      economy: 7.38,
      bowlingAverage: 17.1,
      bestFigures: "5/18",
      maidens: 5,
      dotBalls: 260,
      catches: 8,
      runOuts: 2,
      stumpings: 0,
      allRounderRating: 64.0
    },
    recentForm: [
      { match: "vs IND", runs: 0, balls: 0, wickets: 1, opp: "India" },
      { match: "vs ENG", runs: 4, balls: 3, wickets: 3, opp: "England" },
      { match: "vs RSA", runs: 10, balls: 6, wickets: 4, opp: "South Africa" }
    ],
    achievements: ["RoshSpark Stadium All-Time Leading Wicket-Taker (38 wickets)", "Only 5-wicket haul under floodlights"]
  },
  {
    id: "p11",
    name: "Player 11",
    shortName: "Player 11",
    jersey: 11,
    role: "Bowler",
    battingStyle: "Left-hand bat",
    bowlingStyle: "Left-arm fast",
    teamId: "aus",
    teamName: "Australia",
    age: 27,
    dob: "08 Oct 1998",
    nationality: "Australian",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 19,
      innings: 7,
      runs: 45,
      highestScore: "18",
      average: 9.0,
      strikeRate: 107.1,
      centuries: 0,
      fifties: 0,
      fours: 4,
      sixes: 1,
      oversBowled: 72.0,
      wickets: 31,
      runsConceded: 568,
      economy: 7.88,
      bowlingAverage: 18.32,
      bestFigures: "4/28",
      maidens: 3,
      dotBalls: 195,
      catches: 6,
      runOuts: 0,
      stumpings: 0,
      allRounderRating: 50.5
    },
    recentForm: [
      { match: "vs IND", runs: 0, balls: 0, wickets: 0, opp: "India" },
      { match: "vs ENG", runs: 2, balls: 2, wickets: 2, opp: "England" }
    ],
    achievements: ["Fastest delivery recorded at RoshSpark: 153.8 km/h"]
  },
  // Players 12-22
  {
    id: "p12",
    name: "Player 12",
    shortName: "Player 12",
    jersey: 12,
    role: "Batter",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm medium",
    teamId: "rsk",
    teamName: "RoshSpark Knights",
    age: 26,
    dob: "14 Feb 2000",
    nationality: "Indian",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 15,
      innings: 15,
      runs: 495,
      highestScore: "81",
      average: 35.35,
      strikeRate: 141.4,
      centuries: 0,
      fifties: 4,
      fours: 50,
      sixes: 16,
      oversBowled: 0,
      wickets: 0,
      runsConceded: 0,
      economy: 0,
      bowlingAverage: 0,
      bestFigures: "-",
      maidens: 0,
      dotBalls: 0,
      catches: 6,
      runOuts: 1,
      stumpings: 0,
      allRounderRating: 42.0
    },
    recentForm: [{ match: "vs THS", runs: 54, balls: 36, opp: "Thunder Strikers" }],
    achievements: ["RPL Knights leading run-scorer at home"]
  },
  {
    id: "p13",
    name: "Player 13",
    shortName: "Player 13",
    jersey: 13,
    role: "All-rounder",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm off break",
    teamId: "rsk",
    teamName: "RoshSpark Knights",
    age: 28,
    dob: "29 May 1998",
    nationality: "Indian",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 20,
      innings: 18,
      runs: 540,
      highestScore: "71*",
      average: 36.0,
      strikeRate: 150.0,
      centuries: 0,
      fifties: 4,
      fours: 46,
      sixes: 22,
      oversBowled: 68.0,
      wickets: 22,
      runsConceded: 520,
      economy: 7.64,
      bowlingAverage: 23.63,
      bestFigures: "3/21",
      maidens: 2,
      dotBalls: 160,
      catches: 11,
      runOuts: 3,
      stumpings: 0,
      allRounderRating: 82.5
    },
    recentForm: [{ match: "vs THS", runs: 38, balls: 24, wickets: 2, opp: "Thunder Strikers" }],
    achievements: ["Key finisher for Knights at RoshSpark"]
  },
  {
    id: "p14",
    name: "Player 14",
    shortName: "Player 14",
    jersey: 14,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm leg break",
    teamId: "ths",
    teamName: "Thunder Strikers",
    age: 25,
    dob: "16 Sep 2001",
    nationality: "South African",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 16,
      innings: 6,
      runs: 36,
      highestScore: "14",
      average: 9.0,
      strikeRate: 102.8,
      centuries: 0,
      fifties: 0,
      fours: 2,
      sixes: 1,
      oversBowled: 60.0,
      wickets: 26,
      runsConceded: 432,
      economy: 7.2,
      bowlingAverage: 16.61,
      bestFigures: "4/19",
      maidens: 1,
      dotBalls: 164,
      catches: 5,
      runOuts: 1,
      stumpings: 0,
      allRounderRating: 55.0
    },
    recentForm: [{ match: "vs RSK", runs: 2, balls: 4, wickets: 3, opp: "RoshSpark Knights" }],
    achievements: ["Best strike rate for a spinner at RoshSpark"]
  },
  {
    id: "p15",
    name: "Player 15",
    shortName: "Player 15",
    jersey: 15,
    role: "Wicketkeeper",
    battingStyle: "Left-hand bat",
    bowlingStyle: "None",
    teamId: "ths",
    teamName: "Thunder Strikers",
    age: 27,
    dob: "04 Dec 1998",
    nationality: "English",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 18,
      innings: 17,
      runs: 580,
      highestScore: "88",
      average: 38.66,
      strikeRate: 152.6,
      centuries: 0,
      fifties: 5,
      fours: 56,
      sixes: 24,
      oversBowled: 0,
      wickets: 0,
      runsConceded: 0,
      economy: 0,
      bowlingAverage: 0,
      bestFigures: "-",
      maidens: 0,
      dotBalls: 0,
      catches: 18,
      runOuts: 4,
      stumpings: 9,
      allRounderRating: 62.0
    },
    recentForm: [{ match: "vs RSK", runs: 62, balls: 38, opp: "RoshSpark Knights" }],
    achievements: ["Quickest stumping time (0.09s) at RoshSpark"]
  },
  {
    id: "p16",
    name: "Player 16",
    shortName: "Player 16",
    jersey: 16,
    role: "Batter",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm medium",
    teamId: "eng",
    teamName: "England",
    age: 30,
    dob: "17 Mar 1996",
    nationality: "English",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 14,
      innings: 14,
      runs: 620,
      highestScore: "102*",
      average: 47.69,
      strikeRate: 148.3,
      centuries: 1,
      fifties: 5,
      fours: 64,
      sixes: 20,
      oversBowled: 12.0,
      wickets: 4,
      runsConceded: 98,
      economy: 8.16,
      bowlingAverage: 24.5,
      bestFigures: "2/24",
      maidens: 0,
      dotBalls: 25,
      catches: 10,
      runOuts: 1,
      stumpings: 0,
      allRounderRating: 66.0
    },
    recentForm: [{ match: "vs RSA", runs: 78, balls: 54, opp: "South Africa" }],
    achievements: ["Centurion in ICC Super 50 at RoshSpark"]
  },
  {
    id: "p17",
    name: "Player 17",
    shortName: "Player 17",
    jersey: 17,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm fast",
    teamId: "eng",
    teamName: "England",
    age: 28,
    dob: "21 Nov 1997",
    nationality: "English",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 15,
      innings: 6,
      runs: 40,
      highestScore: "16*",
      average: 10.0,
      strikeRate: 111.1,
      centuries: 0,
      fifties: 0,
      fours: 3,
      sixes: 1,
      oversBowled: 68.0,
      wickets: 27,
      runsConceded: 510,
      economy: 7.5,
      bowlingAverage: 18.88,
      bestFigures: "4/32",
      maidens: 2,
      dotBalls: 175,
      catches: 5,
      runOuts: 0,
      stumpings: 0,
      allRounderRating: 52.0
    },
    recentForm: [{ match: "vs RSA", runs: 4, balls: 5, wickets: 3, opp: "South Africa" }],
    achievements: ["Player of the Match vs South Africa"]
  },
  {
    id: "p18",
    name: "Player 18",
    shortName: "Player 18",
    jersey: 18,
    role: "Batter",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm off break",
    teamId: "rsa",
    teamName: "South Africa",
    age: 29,
    dob: "02 Feb 1997",
    nationality: "South African",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 16,
      innings: 16,
      runs: 690,
      highestScore: "118",
      average: 49.28,
      strikeRate: 151.6,
      centuries: 2,
      fifties: 4,
      fours: 72,
      sixes: 26,
      oversBowled: 0,
      wickets: 0,
      runsConceded: 0,
      economy: 0,
      bowlingAverage: 0,
      bestFigures: "-",
      maidens: 0,
      dotBalls: 0,
      catches: 8,
      runOuts: 2,
      stumpings: 0,
      allRounderRating: 46.0
    },
    recentForm: [{ match: "vs ENG", runs: 94, balls: 68, opp: "England" }],
    achievements: ["Highest individual ODI score at RoshSpark (118)"]
  },
  {
    id: "p19",
    name: "Player 19",
    shortName: "Player 19",
    jersey: 19,
    role: "All-rounder",
    battingStyle: "Left-hand bat",
    bowlingStyle: "Right-arm fast-medium",
    teamId: "rsv",
    teamName: "RoshSpark Valkyries",
    age: 25,
    dob: "10 Jun 2001",
    nationality: "Indian",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 18,
      innings: 17,
      runs: 580,
      highestScore: "86*",
      average: 44.61,
      strikeRate: 146.4,
      centuries: 0,
      fifties: 5,
      fours: 60,
      sixes: 19,
      oversBowled: 62.0,
      wickets: 24,
      runsConceded: 418,
      economy: 6.74,
      bowlingAverage: 17.41,
      bestFigures: "4/16",
      maidens: 3,
      dotBalls: 180,
      catches: 12,
      runOuts: 4,
      stumpings: 0,
      allRounderRating: 94.2
    },
    recentForm: [{ match: "vs CQN", runs: 68, balls: 42, wickets: 2, opp: "Coastal Queens" }],
    achievements: ["Women's RPL MVP 2025", "Leading all-rounder in Women's cricket at RoshSpark"]
  },
  {
    id: "p20",
    name: "Player 20",
    shortName: "Player 20",
    jersey: 20,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm off break",
    teamId: "rsv",
    teamName: "RoshSpark Valkyries",
    age: 23,
    dob: "14 Aug 2003",
    nationality: "Indian",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 15,
      innings: 5,
      runs: 28,
      highestScore: "12*",
      average: 9.33,
      strikeRate: 96.5,
      centuries: 0,
      fifties: 0,
      fours: 2,
      sixes: 0,
      oversBowled: 58.0,
      wickets: 26,
      runsConceded: 365,
      economy: 6.29,
      bowlingAverage: 14.03,
      bestFigures: "5/12",
      maidens: 4,
      dotBalls: 190,
      catches: 7,
      runOuts: 1,
      stumpings: 0,
      allRounderRating: 58.0
    },
    recentForm: [{ match: "vs CQN", runs: 0, balls: 1, wickets: 3, opp: "Coastal Queens" }],
    achievements: ["Best bowling figures in Women's RPL at RoshSpark (5/12)"]
  },
  {
    id: "p21",
    name: "Player 21",
    shortName: "Player 21",
    jersey: 21,
    role: "Batter",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Right-arm medium",
    teamId: "cqn",
    teamName: "Coastal Queens",
    age: 26,
    dob: "08 May 2000",
    nationality: "Australian",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 14,
      innings: 14,
      runs: 520,
      highestScore: "78",
      average: 40.0,
      strikeRate: 139.0,
      centuries: 0,
      fifties: 4,
      fours: 54,
      sixes: 15,
      oversBowled: 0,
      wickets: 0,
      runsConceded: 0,
      economy: 0,
      bowlingAverage: 0,
      bestFigures: "-",
      maidens: 0,
      dotBalls: 0,
      catches: 8,
      runOuts: 2,
      stumpings: 0,
      allRounderRating: 44.0
    },
    recentForm: [{ match: "vs RSV", runs: 52, balls: 38, opp: "RoshSpark Valkyries" }],
    achievements: ["Top run getter for Coastal Queens at RoshSpark"]
  },
  {
    id: "p22",
    name: "Player 22",
    shortName: "Player 22",
    jersey: 22,
    role: "Bowler",
    battingStyle: "Right-hand bat",
    bowlingStyle: "Left-arm orthodox",
    teamId: "cqn",
    teamName: "Coastal Queens",
    age: 24,
    dob: "27 Jan 2002",
    nationality: "New Zealander",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
    stadiumStats: {
      matches: 13,
      innings: 6,
      runs: 32,
      highestScore: "15",
      average: 8.0,
      strikeRate: 94.1,
      centuries: 0,
      fifties: 0,
      fours: 2,
      sixes: 0,
      oversBowled: 48.0,
      wickets: 20,
      runsConceded: 320,
      economy: 6.66,
      bowlingAverage: 16.0,
      bestFigures: "3/18",
      maidens: 2,
      dotBalls: 140,
      catches: 5,
      runOuts: 1,
      stumpings: 0,
      allRounderRating: 51.0
    },
    recentForm: [{ match: "vs RSV", runs: 4, balls: 4, wickets: 2, opp: "RoshSpark Valkyries" }],
    achievements: ["Most dot balls bowled in Women's tournament at RoshSpark"]
  }
];

// Helper to look up player
export const getPlayerById = (id: string): CentralPlayer | undefined => {
  return CENTRAL_PLAYERS.find(p => p.id === id);
};

// -------------------------------------------------------------
// TEAMS
// -------------------------------------------------------------
export const CENTRAL_TEAMS: Record<string, Team> = {
  ind: { id: "ind", name: "India", shortName: "IND", color: "bg-blue-600", secondaryColor: "border-blue-500" },
  aus: { id: "aus", name: "Australia", shortName: "AUS", color: "bg-amber-500", secondaryColor: "border-amber-400" },
  rsk: { id: "rsk", name: "RoshSpark Knights", shortName: "RSK", color: "bg-emerald-600", secondaryColor: "border-emerald-400" },
  ths: { id: "ths", name: "Thunder Strikers", shortName: "THS", color: "bg-cyan-600", secondaryColor: "border-cyan-400" },
  eng: { id: "eng", name: "England", shortName: "ENG", color: "bg-red-600", secondaryColor: "border-red-400" },
  rsa: { id: "rsa", name: "South Africa", shortName: "RSA", color: "bg-green-700", secondaryColor: "border-green-500" },
  rsv: { id: "rsv", name: "RoshSpark Valkyries", shortName: "RSV", color: "bg-purple-600", secondaryColor: "border-purple-400" },
  cqn: { id: "cqn", name: "Coastal Queens", shortName: "CQN", color: "bg-teal-600", secondaryColor: "border-teal-400" },
  not: { id: "not", name: "Northern Titans", shortName: "NOT", color: "bg-indigo-600", secondaryColor: "border-indigo-400" },
  ear: { id: "ear", name: "Eastern Royals", shortName: "EAR", color: "bg-rose-600", secondaryColor: "border-rose-400" },
  wzn: { id: "wzn", name: "West Zone", shortName: "WZN", color: "bg-orange-600", secondaryColor: "border-orange-400" },
  nzn: { id: "nzn", name: "North Zone", shortName: "NZN", color: "bg-sky-600", secondaryColor: "border-sky-400" },
  ssp: { id: "ssp", name: "Southern Sparks", shortName: "SSP", color: "bg-yellow-600", secondaryColor: "border-yellow-400" }
};

// -------------------------------------------------------------
// CENTRAL MATCHES (All strictly hosted at ROSHSPARK CRICKET STADIUM)
// -------------------------------------------------------------

// MATCH 1: LIVE (ICC Men's T20I: India vs Australia)
// Exact prompt data: Target 186, current score 150/4 after 17.2 overs, Runs req = 36, Balls rem = 16
// Over 18 deliveries: 18.1: 1, 18.2: 4, 18.3: 0, 18.4: W, 18.5: 2, 18.6: 6
const liveMatchIndAus: Match = {
  id: "match-ind-aus-live",
  status: "LIVE",
  category: "ICC",
  format: "T20",
  gender: "Men's",
  matchNumber: "Match 18",
  tournament: "ICC Men's T20I Series",
  matchName: "3rd T20I",
  datetime: "18 Oct 2026 • 7:30 PM",
  dateShort: "18 Oct 2026",
  time: "7:30 PM",
  venue: "RoshSpark Cricket Stadium",
  isToday: true,
  month: "Oct",
  year: "2026",
  target: 186,
  team1: CENTRAL_TEAMS.ind,
  team2: CENTRAL_TEAMS.aus,
  team1Score: "185/6",
  team1Overs: "(20.0 ov)",
  team2Score: "150/4",
  team2Overs: "(17.2 ov)",
  resultSummary: "Australia need 36 runs in 16 balls to win",
  ticketsStartingPrice: 800,
  info: {
    matchNumber: "3rd T20I of 5",
    format: "T20",
    date: "18 Oct 2026",
    time: "7:30 PM IST",
    venue: "RoshSpark Cricket Stadium",
    toss: "India won the toss and elected to bat first",
    tossDecision: "Bat first",
    umpires: "Richard Illingworth, Nitin Menon",
    thirdUmpire: "Kumar Dharmasena",
    matchReferee: "Javagal Srinath",
    pitch: "Even bounce with good carry, lush outfield, dew starting to settle under floodlights",
    weather: "Clear night, 24°C, 65% Humidity, Wind 8 km/h SW",
    matchStatusText: "Innings Break / 2nd Innings in Progress",
  },
  liveState: {
    target: 186,
    totalBalls: 120,
    currentRuns: 150,
    currentWickets: 4,
    ballsBowled: 104, // 17.2 overs
    strikerId: "p08",
    nonStrikerId: "p09",
    bowlerId: "p03",
    partnershipRuns: 22,
    partnershipBalls: 10,
    fallOfWickets: [
      { score: 42, wicket: 1, over: "5.4", player: "Player 01" },
      { score: 78, wicket: 2, over: "9.2", player: "Player 02" },
      { score: 111, wicket: 3, over: "13.1", player: "Player 04" },
      { score: 128, wicket: 4, over: "15.4", player: "Player 05" }
    ],
    commentaryHistory: [
      { overBall: "17.2", runs: 4, outcome: "FOUR", batter: "Player 08", bowler: "Player 03", description: "CRACKED! Pitched slightly full outside off, Player 08 leans into a glorious cover drive that races to the fence." },
      { overBall: "17.1", runs: 1, outcome: "1 RUN", batter: "Player 09", bowler: "Player 03", description: "Good length delivery angling into middle stump, clipped softly into the leg-side gap for a quick single." },
      { overBall: "16.6", runs: 6, outcome: "SIX", batter: "Player 08", bowler: "Player 06", description: "INTO THE SECOND TIER! Tossed up on off, Player 08 charges down the track and bludgeons it over long-on for a monster 98m six!" },
      { overBall: "16.5", runs: 2, outcome: "2 RUNS", batter: "Player 08", bowler: "Player 06", description: "Flatter on the pads, worked wide of deep mid-wicket. Superb hustle from both batters to turn one into two." },
      { overBall: "16.4", runs: 0, outcome: "WICKET", batter: "Player 05", bowler: "Player 06", description: "OUT! In the air and taken at deep cover! Player 05 attempts an inside-out lofted drive but doesn't get enough elevation.", isWicket: true, wicketType: "c Player 01 b Player 06", wicketPlayer: "Player 05" },
      { overBall: "16.3", runs: 0, outcome: "DOT BALL", batter: "Player 05", bowler: "Player 06", description: "Beaten! Slower through the air, grips the pitch and turns past the outside edge into keeper's gloves." },
      { overBall: "16.2", runs: 4, outcome: "FOUR", batter: "Player 05", bowler: "Player 06", description: "BOUNDARY! Short and punished. Rocked back quickly and pulled with authority through mid-wicket." },
      { overBall: "16.1", runs: 1, outcome: "1 RUN", batter: "Player 08", bowler: "Player 06", description: "Pushed down to long-off for an easy single to rotate the strike." }
    ]
  },
  scorecard: [
    {
      teamId: "ind",
      teamName: "India",
      inningsNumber: 1,
      total: "185/6",
      overs: "20.0",
      runRate: "9.25",
      extras: "10 (b 1, lb 2, w 6, nb 1)",
      fallOfWickets: "1-32 (4.1), 2-75 (8.4), 3-110 (12.2), 4-145 (16.0), 5-160 (17.5), 6-178 (19.2)",
      batters: [
        { name: "Player 01", dismissal: "c Player 03 b Player 08", runs: 45, balls: 30, fours: 5, sixes: 2, strikeRate: "150.00" },
        { name: "Player 02", dismissal: "lbw b Player 09", runs: 20, balls: 15, fours: 2, sixes: 1, strikeRate: "133.33" },
        { name: "Player 03", dismissal: "b Player 10", runs: 65, balls: 40, fours: 6, sixes: 3, strikeRate: "162.50" },
        { name: "Player 04", dismissal: "run out (Player 08)", runs: 15, balls: 10, fours: 1, sixes: 0, strikeRate: "150.00" },
        { name: "Player 05", dismissal: "not out", runs: 25, balls: 15, fours: 2, sixes: 1, strikeRate: "166.67" },
        { name: "Player 06", dismissal: "c Player 02 b Player 08", runs: 5, balls: 5, fours: 0, sixes: 0, strikeRate: "100.00" },
        { name: "Player 07", dismissal: "c Player 04 b Player 09", runs: 0, balls: 2, fours: 0, sixes: 0, strikeRate: "0.00" },
        { name: "Player 08", dismissal: "not out", runs: 0, balls: 3, fours: 0, sixes: 0, strikeRate: "0.00" }
      ],
      bowlers: [
        { name: "Player 08", overs: "4.0", maidens: 0, runs: 35, wickets: 2, economy: "8.75", dots: 8 },
        { name: "Player 09", overs: "4.0", maidens: 0, runs: 40, wickets: 2, economy: "10.00", dots: 6 },
        { name: "Player 10", overs: "4.0", maidens: 0, runs: 30, wickets: 1, economy: "7.50", dots: 10 },
        { name: "Player 11", overs: "4.0", maidens: 0, runs: 45, wickets: 0, economy: "11.25", dots: 4 },
        { name: "Player 06", overs: "4.0", maidens: 0, runs: 35, wickets: 0, economy: "8.75", dots: 7 }
      ]
    },
    {
      teamId: "aus",
      teamName: "Australia",
      inningsNumber: 2,
      total: "150/4",
      overs: "17.2",
      runRate: "8.65",
      extras: "5 (w 4, nb 1)",
      fallOfWickets: "1-42 (5.4 ov), 2-78 (9.2 ov), 3-111 (13.1 ov), 4-128 (15.4 ov)",
      batters: [
        { name: "Player 08", dismissal: "not out", runs: 72, balls: 45, fours: 6, sixes: 2, strikeRate: "160.00", isStriker: true },
        { name: "Player 09", dismissal: "not out", runs: 24, balls: 18, fours: 2, sixes: 1, strikeRate: "133.33", isNonStriker: true },
        { name: "Player 01", dismissal: "b Player 03", runs: 20, balls: 15, fours: 3, sixes: 0, strikeRate: "133.33" },
        { name: "Player 02", dismissal: "c Player 04 b Player 05", runs: 15, balls: 12, fours: 2, sixes: 0, strikeRate: "125.00" },
        { name: "Player 05", dismissal: "c Player 01 b Player 06", runs: 14, balls: 14, fours: 1, sixes: 0, strikeRate: "100.00" }
      ],
      bowlers: [
        { name: "Player 03", overs: "3.2", maidens: 0, runs: 28, wickets: 2, economy: "8.40", dots: 6, isActive: true },
        { name: "Player 05", overs: "4.0", maidens: 0, runs: 35, wickets: 1, economy: "8.75", dots: 8 },
        { name: "Player 06", overs: "4.0", maidens: 0, runs: 42, wickets: 1, economy: "10.50", dots: 5 },
        { name: "Player 07", overs: "4.0", maidens: 0, runs: 30, wickets: 0, economy: "7.50", dots: 10 },
        { name: "Player 09", overs: "2.0", maidens: 0, runs: 15, wickets: 0, economy: "7.50", dots: 4 }
      ]
    }
  ],
  oversData: [
    { overNumber: 18, runs: 5, wickets: 0, bowler: "Player 03", events: ["1", "4"] },
    { overNumber: 17, runs: 13, wickets: 1, bowler: "Player 06", events: ["1", "4", "0", "W", "2", "6"] },
    { overNumber: 16, runs: 8, wickets: 0, bowler: "Player 05", events: ["1", "1", "2", "0", "4", "0"] },
    { overNumber: 15, runs: 14, wickets: 0, bowler: "Player 07", events: ["6", "1", "1", "4", "1", "1"] },
    { overNumber: 14, runs: 9, wickets: 1, bowler: "Player 03", events: ["1", "W", "4", "1", "1", "2"] }
  ],
  commentary: [],
  highlights: [
    { id: "hl-1", title: "Player 08's Majestic 98m Six Clears Long-On", duration: "00:48", timestamp: "16.6 ov", category: "Best Sixes", thumbnailUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { id: "hl-2", title: "Player 03's Unplayable Yorker Rattles Stumps", duration: "00:35", timestamp: "13.1 ov", category: "Best Wickets", thumbnailUrl: "https://images.unsplash.com/photo-1531415074868-036b107e775a?w=500&auto=format&fit=crop&q=80", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4" },
    { id: "hl-3", title: "Spectacular Diving Catch at Deep Mid-Wicket", duration: "00:52", timestamp: "9.2 ov", category: "Best Catches", thumbnailUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=80", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
    { id: "hl-4", title: "Player 08 Reaches Flamboyant 38-Ball Fifty", duration: "01:15", timestamp: "14.2 ov", category: "Match Highlights", thumbnailUrl: "https://images.unsplash.com/photo-1512719994953-9ab1b5700143?w=500&auto=format&fit=crop&q=80", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
    { id: "hl-5", title: "Four in a Row: Player 01 Takes on the Powerplay", duration: "01:20", timestamp: "3.4 ov", category: "Best Fours", thumbnailUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }
  ],
  news: [
    {
      id: "news-m1-1",
      headline: "Dew Factor Tests Bowlers at RoshSpark in Thrilling Run Chase",
      category: "Match Report",
      date: "18 Oct 2026",
      shortDescription: "Under 3,200 lux floodlights, Australia mount a spirited counter-attack requiring 36 from the final 16 deliveries.",
      content: "The moisture from the sea breeze has settled on the lush outfield at RoshSpark Cricket Stadium, causing gripping challenges for bowlers in the death overs. Player 08 has anchored the chase with sublime poise, reaching 72 off 45 deliveries.",
      author: "RoshSpark Editorial Desk"
    },
    {
      id: "news-m1-2",
      headline: "Captain Praises RoshSpark Pitch for Balanced Contest",
      category: "Analysis",
      date: "18 Oct 2026",
      shortDescription: "Curator's dry-deck preparation delivers true pace and even carry throughout 40 overs.",
      content: "Both camp leaders commended the RoshSpark playing surface, which has rewarded strokeplay while offering fast bowlers seam movement with the new ball.",
      author: "Pitch Operations Dispatch"
    }
  ],
  graphs: {
    overs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    team1RunsPerOver: [8, 12, 10, 6, 14, 9, 7, 8, 11, 15, 6, 8, 12, 10, 14, 11, 8, 9],
    team2RunsPerOver: [9, 7, 11, 10, 8, 12, 6, 9, 14, 8, 7, 10, 12, 9, 14, 8, 13, 5],
    team1Cumulative: [8, 20, 30, 36, 50, 59, 66, 74, 85, 100, 106, 114, 126, 136, 150, 161, 169, 178],
    team2Cumulative: [9, 16, 27, 37, 45, 57, 63, 72, 86, 94, 101, 111, 123, 132, 146, 154, 167, 172],
    team1Wickets: [
      { over: 4, runs: 32, player: "Player 01" },
      { over: 9, runs: 75, player: "Player 02" },
      { over: 12, runs: 110, player: "Player 04" },
      { over: 16, runs: 145, player: "Player 06" }
    ],
    team2Wickets: [
      { over: 5, runs: 42, player: "Player 01" },
      { over: 9, runs: 78, player: "Player 02" },
      { over: 13, runs: 111, player: "Player 04" },
      { over: 16, runs: 128, player: "Player 05" }
    ],
    partnerships: [
      { batters: "Player 01 + Player 02", runs: 42, balls: 28 },
      { batters: "Player 02 + Player 08", runs: 36, balls: 22 },
      { batters: "Player 08 + Player 04", runs: 33, balls: 24 },
      { batters: "Player 08 + Player 09", runs: 22, balls: 10 }
    ],
    requiredRunRateTimeline: [
      { over: 10, rrr: 9.2, crr: 8.6 },
      { over: 12, rrr: 9.8, crr: 8.4 },
      { over: 14, rrr: 10.5, crr: 8.5 },
      { over: 16, rrr: 12.0, crr: 8.6 },
      { over: 17, rrr: 13.5, crr: 8.65 }
    ]
  }
};

// MATCH 2: RECENT (RPL Derby: RoshSpark Knights vs Thunder Strikers)
const recentMatchRpl: Match = {
  id: "match-rpl-derby",
  status: "RECENT",
  category: "RPL",
  format: "T20",
  gender: "Men's",
  matchNumber: "Match 24",
  tournament: "RoshSpark Premier League (RPL) Men's",
  matchName: "Match 24",
  datetime: "14 Oct 2026 • 8:00 PM",
  dateShort: "14 Oct 2026",
  time: "8:00 PM",
  venue: "RoshSpark Cricket Stadium",
  isToday: true,
  month: "Oct",
  year: "2026",
  team1: CENTRAL_TEAMS.ths,
  team2: CENTRAL_TEAMS.rsk,
  team1Score: "189/5",
  team1Overs: "(20.0 ov)",
  team2Score: "193/4",
  team2Overs: "(19.3 ov)",
  resultSummary: "RoshSpark Knights won by 6 wickets (with 3 balls remaining)",
  ticketsStartingPrice: 650,
  info: {
    matchNumber: "Match 24",
    format: "T20",
    date: "14 Oct 2026",
    time: "8:00 PM IST",
    venue: "RoshSpark Cricket Stadium",
    toss: "Thunder Strikers elected to bat first",
    tossDecision: "Bat first",
    umpires: "Anil Chaudhary, Chris Gaffaney",
    thirdUmpire: "Paul Reiffel",
    matchReferee: "David Boon",
    pitch: "True surface with fast outfield, rewarding power-hitters",
    weather: "25°C, Mild breeze, 50% Humidity",
    matchStatusText: "Match Finished",
    potm: "Player 12 (RSK) — 81 (44)"
  },
  scorecard: [
    {
      teamId: "ths",
      teamName: "Thunder Strikers",
      inningsNumber: 1,
      total: "189/5",
      overs: "20.0",
      runRate: "9.45",
      extras: "8 (w 5, nb 1, lb 2)",
      fallOfWickets: "1-45, 2-88, 3-132, 4-165, 5-189",
      batters: [
        { name: "Player 15", dismissal: "c Player 13 b Player 06", runs: 62, balls: 38, fours: 7, sixes: 3, strikeRate: "163.15" },
        { name: "Player 14", dismissal: "b Player 03", runs: 34, balls: 25, fours: 4, sixes: 1, strikeRate: "136.00" },
        { name: "Player 04", dismissal: "not out", runs: 58, balls: 34, fours: 5, sixes: 2, strikeRate: "170.58" }
      ],
      bowlers: [
        { name: "Player 03", overs: "4.0", maidens: 0, runs: 34, wickets: 2, economy: "8.50", dots: 8 },
        { name: "Player 06", overs: "4.0", maidens: 0, runs: 32, wickets: 1, economy: "8.00", dots: 10 }
      ]
    },
    {
      teamId: "rsk",
      teamName: "RoshSpark Knights",
      inningsNumber: 2,
      total: "193/4",
      overs: "19.3",
      runRate: "9.89",
      extras: "6 (w 4, b 2)",
      fallOfWickets: "1-28, 2-92, 3-145, 4-178",
      batters: [
        { name: "Player 12", dismissal: "c Player 15 b Player 14", runs: 81, balls: 44, fours: 9, sixes: 4, strikeRate: "184.09" },
        { name: "Player 13", dismissal: "not out", runs: 54, balls: 32, fours: 5, sixes: 2, strikeRate: "168.75" },
        { name: "Player 01", dismissal: "not out", runs: 32, balls: 18, fours: 3, sixes: 1, strikeRate: "177.77" }
      ],
      bowlers: [
        { name: "Player 14", overs: "4.0", maidens: 0, runs: 42, wickets: 2, economy: "10.50", dots: 6 },
        { name: "Player 10", overs: "4.0", maidens: 0, runs: 38, wickets: 1, economy: "9.50", dots: 8 }
      ]
    }
  ],
  oversData: [
    { overNumber: 20, runs: 12, wickets: 0, bowler: "Player 10", events: ["4", "1", "6", "1"] },
    { overNumber: 19, runs: 15, wickets: 1, bowler: "Player 14", events: ["6", "W", "2", "1", "4", "2"] }
  ],
  commentary: [
    { overBall: "19.3", runs: 6, outcome: "SIX", batter: "Player 13", bowler: "Player 10", description: "KNIGHTS WIN IT IN STYLE! A towering six over deep extra cover to seal the derby triumph at RoshSpark!" }
  ],
  highlights: [
    { id: "hl-rpl-1", title: "Player 12's Sizzling 81 (44) Leads Knights Chase", duration: "03:10", timestamp: "Full Match", category: "Match Highlights", thumbnailUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=500&auto=format&fit=crop&q=80", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
  ],
  news: [
    {
      id: "news-rpl-1",
      headline: "RoshSpark Knights Seal Derby Classic in Front of 54,000 Spectators",
      category: "RPL Dispatch",
      date: "15 Oct 2026",
      shortDescription: "Player 12 and Player 13 combine to pull off a dramatic 190+ chase at RoshSpark Stadium.",
      content: "The amphitheatre erupted as Player 13 struck a majestic six into the East Stand to bring home the derby win for the Knights.",
      author: "RPL Media"
    }
  ]
};

// MATCH 3: RECENT (ICC Super 50: England vs South Africa)
const recentMatchSaEng: Match = {
  id: "match-sa-eng",
  status: "RECENT",
  category: "ICC",
  format: "ODI",
  gender: "Men's",
  matchNumber: "2nd ODI",
  tournament: "ICC Super 50 Series",
  matchName: "2nd ODI",
  datetime: "11 Oct 2026 • 2:00 PM",
  dateShort: "11 Oct 2026",
  time: "2:00 PM",
  venue: "RoshSpark Cricket Stadium",
  isToday: false,
  month: "Oct",
  year: "2026",
  team1: CENTRAL_TEAMS.rsa,
  team2: CENTRAL_TEAMS.eng,
  team1Score: "284/8",
  team1Overs: "(50.0 ov)",
  team2Score: "286/6",
  team2Overs: "(48.2 ov)",
  resultSummary: "England won by 4 wickets (with 10 balls remaining)",
  ticketsStartingPrice: 500,
  info: {
    matchNumber: "2nd ODI of 3",
    format: "ODI",
    date: "11 Oct 2026",
    time: "2:00 PM IST",
    venue: "RoshSpark Cricket Stadium",
    toss: "South Africa opted to bat first",
    tossDecision: "Bat first",
    umpires: "Joel Wilson, Richard Kettleborough",
    thirdUmpire: "Rod Tucker",
    matchReferee: "Ranjan Madugalle",
    pitch: "Classic 50-over deck offering initial seam then smoothing out",
    weather: "Sunny day transitioning into floodlit evening, 27°C",
    matchStatusText: "Match Finished",
    potm: "Player 16 (ENG) — 102* (94)"
  },
  scorecard: [
    {
      teamId: "rsa",
      teamName: "South Africa",
      inningsNumber: 1,
      total: "284/8",
      overs: "50.0",
      runRate: "5.68",
      extras: "14 (w 8, lb 4, b 2)",
      fallOfWickets: "1-52, 2-118, 3-180, 4-220, 5-245, 6-260, 7-275, 8-284",
      batters: [
        { name: "Player 18", dismissal: "c Player 15 b Player 17", runs: 94, balls: 88, fours: 9, sixes: 2, strikeRate: "106.81" },
        { name: "Player 03", dismissal: "b Player 17", runs: 45, balls: 52, fours: 4, sixes: 1, strikeRate: "86.53" }
      ],
      bowlers: [
        { name: "Player 17", overs: "10.0", maidens: 1, runs: 48, wickets: 3, economy: "4.80", dots: 34 }
      ]
    },
    {
      teamId: "eng",
      teamName: "England",
      inningsNumber: 2,
      total: "286/6",
      overs: "48.2",
      runRate: "5.91",
      extras: "10 (w 6, nb 1, lb 3)",
      fallOfWickets: "1-34, 2-85, 3-145, 4-210, 5-255, 6-278",
      batters: [
        { name: "Player 16", dismissal: "not out", runs: 102, balls: 94, fours: 11, sixes: 2, strikeRate: "108.51" },
        { name: "Player 04", dismissal: "c Player 18 b Player 14", runs: 58, balls: 64, fours: 5, sixes: 1, strikeRate: "90.62" }
      ],
      bowlers: [
        { name: "Player 14", overs: "10.0", maidens: 0, runs: 56, wickets: 2, economy: "5.60", dots: 28 }
      ]
    }
  ],
  oversData: [],
  commentary: [],
  highlights: [],
  news: []
};

// MATCH 4: RECENT (WOMEN'S RPL Final: RoshSpark Valkyries vs Coastal Queens)
const recentMatchWomensFinal: Match = {
  id: "match-rpl-wfinal",
  status: "RECENT",
  category: "WOMENS",
  format: "T20",
  gender: "Women's",
  matchNumber: "Grand Final",
  tournament: "RoshSpark Premier League (RPL) Women's",
  matchName: "CHAMPIONSHIP FINAL",
  datetime: "08 Oct 2026 • 7:00 PM",
  dateShort: "08 Oct 2026",
  time: "7:00 PM",
  venue: "RoshSpark Cricket Stadium",
  isToday: false,
  month: "Oct",
  year: "2026",
  team1: CENTRAL_TEAMS.rsv,
  team2: CENTRAL_TEAMS.cqn,
  team1Score: "162/4",
  team1Overs: "(20.0 ov)",
  team2Score: "158/9",
  team2Overs: "(20.0 ov)",
  resultSummary: "RoshSpark Valkyries won by 4 runs (Championship Title)",
  ticketsStartingPrice: 400,
  info: {
    matchNumber: "Grand Final",
    format: "T20",
    date: "08 Oct 2026",
    time: "7:00 PM IST",
    venue: "RoshSpark Cricket Stadium",
    toss: "RoshSpark Valkyries opted to bat first",
    tossDecision: "Bat first",
    umpires: "Claire Polosak, Vrinda Rathi",
    thirdUmpire: "Lauren Agenbag",
    matchReferee: "GS Lakshmi",
    pitch: "Excellent surface for all-round cricket, gripping spinners in 2nd half",
    weather: "26°C, Clear night",
    matchStatusText: "Match Finished",
    potm: "Player 19 (RSV) — 68 (42) & 2/18"
  },
  scorecard: [],
  oversData: [],
  commentary: [],
  highlights: [],
  news: []
};

// MATCH 5: UPCOMING (ICC Men's T20I: India vs Australia Decider)
const upcomingMatchIndAus: Match = {
  id: "match-ind-aus-up",
  status: "UPCOMING",
  category: "ICC",
  format: "T20",
  gender: "Men's",
  matchNumber: "4th T20I",
  tournament: "ICC Men's T20I Series",
  matchName: "4th T20I (Series Decider)",
  datetime: "22 Oct 2026 • 7:30 PM",
  dateShort: "22 Oct 2026",
  time: "7:30 PM",
  venue: "RoshSpark Cricket Stadium",
  isToday: false,
  month: "Oct",
  year: "2026",
  team1: CENTRAL_TEAMS.ind,
  team2: CENTRAL_TEAMS.aus,
  ticketsStartingPrice: 800,
  info: {
    matchNumber: "4th T20I of 5",
    format: "T20",
    date: "22 Oct 2026",
    time: "7:30 PM IST",
    venue: "RoshSpark Cricket Stadium",
    toss: "Toss at 7:00 PM IST",
    tossDecision: "TBA",
    umpires: "Nitin Menon, Richard Illingworth",
    thirdUmpire: "Michael Gough",
    matchReferee: "Javagal Srinath",
    pitch: "Fresh centre wicket 4 prepared for maximum pace and bounce",
    weather: "Expected 23°C, clear sky",
    matchStatusText: "Match Starts in 4 Days"
  },
  scorecard: [],
  oversData: [],
  commentary: [],
  highlights: [],
  news: []
};

// MATCH 6: UPCOMING (Premier League Clash: Northern Titans vs Eastern Royals)
const upcomingMatchPl: Match = {
  id: "match-pl-clash",
  status: "UPCOMING",
  category: "PREMIER LEAGUE",
  format: "T20",
  gender: "Men's",
  matchNumber: "Match 18",
  tournament: "Premier League Super Clash",
  matchName: "Group Stage Match 18",
  datetime: "25 Oct 2026 • 7:00 PM",
  dateShort: "25 Oct 2026",
  time: "7:00 PM",
  venue: "RoshSpark Cricket Stadium",
  isToday: false,
  month: "Oct",
  year: "2026",
  team1: CENTRAL_TEAMS.not,
  team2: CENTRAL_TEAMS.ear,
  ticketsStartingPrice: 650,
  info: {
    matchNumber: "Match 18",
    format: "T20",
    date: "25 Oct 2026",
    time: "7:00 PM IST",
    venue: "RoshSpark Cricket Stadium",
    toss: "Toss at 6:30 PM IST",
    tossDecision: "TBA",
    umpires: "TBA",
    thirdUmpire: "TBA",
    matchReferee: "TBA",
    pitch: "Standard T20 batting track",
    weather: "24°C, Pleasant evening",
    matchStatusText: "Tickets Selling Fast"
  },
  scorecard: [],
  oversData: [],
  commentary: [],
  highlights: [],
  news: []
};

// MATCH 7: UPCOMING (Domestic 4-Day Semi-Final: West Zone vs North Zone)
const upcomingMatchDom: Match = {
  id: "match-dom-test",
  status: "UPCOMING",
  category: "DOMESTIC",
  format: "TEST",
  gender: "Men's",
  matchNumber: "Semi-Final 1",
  tournament: "Domestic Trophy Championship",
  matchName: "Semi-Final 1 (4-Day Red Ball)",
  datetime: "28 Oct 2026 • 9:30 AM",
  dateShort: "28 Oct 2026",
  time: "9:30 AM",
  venue: "RoshSpark Cricket Stadium",
  isToday: false,
  month: "Oct",
  year: "2026",
  team1: CENTRAL_TEAMS.wzn,
  team2: CENTRAL_TEAMS.nzn,
  ticketsStartingPrice: 300,
  info: {
    matchNumber: "Semi-Final 1",
    format: "TEST",
    date: "28 Oct 2026",
    time: "9:30 AM IST",
    venue: "RoshSpark Cricket Stadium",
    toss: "Toss at 9:00 AM IST",
    tossDecision: "TBA",
    umpires: "TBA",
    thirdUmpire: "TBA",
    matchReferee: "TBA",
    pitch: "Red-soil surface with green tinge for early seam movement",
    weather: "Sunny mornings, 29°C peak",
    matchStatusText: "Entry Free for North Stand / Paid Pavilion"
  },
  scorecard: [],
  oversData: [],
  commentary: [],
  highlights: [],
  news: []
};

// MATCH 8: UPCOMING (Women's T20 League: RoshSpark Valkyries vs Southern Sparks)
const upcomingMatchWomensLeague: Match = {
  id: "match-w-t20l",
  status: "UPCOMING",
  category: "T20 LEAGUE",
  format: "T20",
  gender: "Women's",
  matchNumber: "Match 1",
  tournament: "Women's T20 Challenge",
  matchName: "League Stage Opener",
  datetime: "01 Nov 2026 • 3:30 PM",
  dateShort: "01 Nov 2026",
  time: "3:30 PM",
  venue: "RoshSpark Cricket Stadium",
  isToday: false,
  month: "Nov",
  year: "2026",
  team1: CENTRAL_TEAMS.rsv,
  team2: CENTRAL_TEAMS.ssp,
  ticketsStartingPrice: 450,
  info: {
    matchNumber: "Match 1",
    format: "T20",
    date: "01 Nov 2026",
    time: "3:30 PM IST",
    venue: "RoshSpark Cricket Stadium",
    toss: "Toss at 3:00 PM IST",
    tossDecision: "TBA",
    umpires: "TBA",
    thirdUmpire: "TBA",
    matchReferee: "TBA",
    pitch: "Firm batting track",
    weather: "Afternoon sun, 28°C",
    matchStatusText: "Weekend Double-Header"
  },
  scorecard: [],
  oversData: [],
  commentary: [],
  highlights: [],
  news: []
};

// MATCH 9: UPCOMING (RPL Women's T20 League Match) - Matches "RPL + Women's + T20 + Upcoming" test case
const upcomingRplWomensMatch: Match = {
  id: "match-rpl-w-up",
  status: "UPCOMING",
  category: "RPL",
  format: "T20",
  gender: "Women's",
  matchNumber: "Match 9",
  tournament: "RoshSpark Premier League (RPL) Women's",
  matchName: "RPL Women's — Match 9",
  datetime: "26 Oct 2026 • 7:30 PM",
  dateShort: "26 Oct 2026",
  time: "7:30 PM",
  venue: "RoshSpark Cricket Stadium",
  isToday: false,
  month: "Oct",
  year: "2026",
  team1: CENTRAL_TEAMS.rsv,
  team2: CENTRAL_TEAMS.cqn,
  ticketsStartingPrice: 400,
  info: {
    matchNumber: "Match 9",
    format: "T20",
    date: "26 Oct 2026",
    time: "7:30 PM IST",
    venue: "RoshSpark Cricket Stadium",
    toss: "Toss at 7:00 PM IST",
    tossDecision: "TBA",
    umpires: "Vrinda Rathi, Gayathri Venugopalan",
    thirdUmpire: "N Janani",
    matchReferee: "GS Lakshmi",
    pitch: "True bounce, fast outfield",
    weather: "24°C, Clear night",
    matchStatusText: "Tickets Selling Rapidly"
  },
  scorecard: [],
  oversData: [],
  commentary: [],
  highlights: [],
  news: []
};

export const CENTRAL_MATCHES: Match[] = [
  liveMatchIndAus,
  recentMatchRpl,
  recentMatchSaEng,
  recentMatchWomensFinal,
  upcomingMatchIndAus,
  upcomingMatchPl,
  upcomingMatchDom,
  upcomingMatchWomensLeague,
  upcomingRplWomensMatch
];

export const getMatchById = (id: string): Match | undefined => {
  return CENTRAL_MATCHES.find(m => m.id === id);
};

// -------------------------------------------------------------
// SERIES & TOURNAMENTS
// -------------------------------------------------------------
export interface SeriesItem {
  id: string;
  name: string;
  category: 'Live' | 'Upcoming' | 'Completed';
  dates: string;
  format: string;
  matchesCount: number;
  teamsCount: number;
  teams: string[];
  bannerUrl: string;
  overview: string;
  pointsTable: {
    pos: number;
    team: string;
    played: number;
    won: number;
    lost: number;
    nr: number;
    pts: number;
    nrr: string;
  }[];
  fixtures: {
    matchId: string;
    date: string;
    teams: string;
    status: string;
    venue: string;
  }[];
  topPerformers: {
    runsLeader: { name: string; runs: number; avg: number };
    wicketsLeader: { name: string; wickets: number; econ: number };
  };
}

export const CENTRAL_SERIES: SeriesItem[] = [
  {
    id: "icc-t20-2026",
    name: "ICC Men's T20I Series: India vs Australia",
    category: "Live",
    dates: "12 Oct - 26 Oct 2026",
    format: "T20I",
    matchesCount: 5,
    teamsCount: 2,
    teams: ["India", "Australia"],
    bannerUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80",
    overview: "A flagship 5-match bilateral T20 international encounter hosted exclusively at RoshSpark Cricket Stadium under cutting-edge stadium illumination.",
    pointsTable: [
      { pos: 1, team: "India", played: 2, won: 1, lost: 1, nr: 0, pts: 2, nrr: "+0.342" },
      { pos: 2, team: "Australia", played: 2, won: 1, lost: 1, nr: 0, pts: 2, nrr: "-0.342" }
    ],
    fixtures: [
      { matchId: "match-ind-aus-live", date: "18 Oct 2026", teams: "India vs Australia (3rd T20I)", status: "LIVE", venue: "RoshSpark Cricket Stadium" },
      { matchId: "match-ind-aus-up", date: "22 Oct 2026", teams: "India vs Australia (4th T20I)", status: "UPCOMING", venue: "RoshSpark Cricket Stadium" }
    ],
    topPerformers: {
      runsLeader: { name: "Player 08 (AUS)", runs: 184, avg: 61.33 },
      wicketsLeader: { name: "Player 03 (IND)", wickets: 7, econ: 7.42 }
    }
  },
  {
    id: "rpl-mens-2026",
    name: "RoshSpark Premier League (RPL) Men's",
    category: "Upcoming",
    dates: "15 Nov - 20 Dec 2026",
    format: "T20",
    matchesCount: 28,
    teamsCount: 8,
    teams: ["RoshSpark Knights", "Thunder Strikers", "Northern Titans", "Eastern Royals", "Coastal Queens", "Southern Sparks", "Deccan Chargers", "Western Blasters"],
    bannerUrl: "https://images.unsplash.com/photo-1531415074868-036b107e775a?w=1200&auto=format&fit=crop&q=80",
    overview: "The most prestigious franchise league of RoshSpark Stadium bringing together international and regional superstars.",
    pointsTable: [
      { pos: 1, team: "RoshSpark Knights", played: 6, won: 5, lost: 1, nr: 0, pts: 10, nrr: "+1.120" },
      { pos: 2, team: "Thunder Strikers", played: 6, won: 4, lost: 2, nr: 0, pts: 8, nrr: "+0.540" },
      { pos: 3, team: "Northern Titans", played: 6, won: 3, lost: 3, nr: 0, pts: 6, nrr: "+0.110" },
      { pos: 4, team: "Eastern Royals", played: 6, won: 2, lost: 4, nr: 0, pts: 4, nrr: "-0.450" }
    ],
    fixtures: [
      { matchId: "match-rpl-derby", date: "14 Oct 2026", teams: "RoshSpark Knights vs Thunder Strikers", status: "COMPLETED", venue: "RoshSpark Cricket Stadium" },
      { matchId: "match-pl-clash", date: "25 Oct 2026", teams: "Northern Titans vs Eastern Royals", status: "UPCOMING", venue: "RoshSpark Cricket Stadium" }
    ],
    topPerformers: {
      runsLeader: { name: "Player 12 (RSK)", runs: 320, avg: 53.33 },
      wicketsLeader: { name: "Player 14 (THS)", wickets: 12, econ: 6.95 }
    }
  },
  {
    id: "rpl-womens-2026",
    name: "RoshSpark Premier League (RPL) Women's",
    category: "Completed",
    dates: "20 Sep - 08 Oct 2026",
    format: "T20",
    matchesCount: 16,
    teamsCount: 6,
    teams: ["RoshSpark Valkyries", "Coastal Queens", "Southern Sparks", "Royal Challengers", "Capital Giants", "Midland Warriors"],
    bannerUrl: "https://images.unsplash.com/photo-1512719994953-9ab1b5700143?w=1200&auto=format&fit=crop&q=80",
    overview: "The groundbreaking Women's RPL tournament celebrating world-class women's cricket at RoshSpark.",
    pointsTable: [
      { pos: 1, team: "RoshSpark Valkyries (Champions)", played: 8, won: 7, lost: 1, nr: 0, pts: 14, nrr: "+1.380" },
      { pos: 2, team: "Coastal Queens", played: 8, won: 5, lost: 3, nr: 0, pts: 10, nrr: "+0.450" }
    ],
    fixtures: [
      { matchId: "match-rpl-wfinal", date: "08 Oct 2026", teams: "RoshSpark Valkyries vs Coastal Queens", status: "COMPLETED", venue: "RoshSpark Cricket Stadium" }
    ],
    topPerformers: {
      runsLeader: { name: "Player 19 (RSV)", runs: 365, avg: 52.14 },
      wicketsLeader: { name: "Player 20 (RSV)", wickets: 16, econ: 5.85 }
    }
  }
];

export const getSeriesById = (id: string): SeriesItem | undefined => {
  return CENTRAL_SERIES.find(s => s.id === id);
};


// -------------------------------------------------------------
// STADIUM STANDS & PRICING TIERS
// -------------------------------------------------------------
export const STADIUM_STAND_PRICES: Record<string, { price: number; gate: string; desc: string }> = {
  "VIP Pavilion": { price: 5000, gate: "Gate 1", desc: "Ultra-premium cushioned box with hospitality & air-conditioned lounge access" },
  "Premium Stand": { price: 3000, gate: "Gate 2", desc: "Elevated tier overlooking batsman stance and slip cordon" },
  "North Stand": { price: 1800, gate: "Gate 3", desc: "Direct straight view behind the bowler's arm from the northern pavilion" },
  "South Stand": { price: 1500, gate: "Gate 4", desc: "Energetic atmosphere directly opposite player dugouts" },
  "East Stand": { price: 1200, gate: "Gate 5", desc: "Wide square-boundary view under primary floodlight bank" },
  "West Stand": { price: 1000, gate: "Gate 6", desc: "Panoramic view of both pitch crease and giant LED replay screens" }
};
