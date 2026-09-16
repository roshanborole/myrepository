// ROSHSPARK CRICKET STADIUM — CENTRAL ADMIN STORE & LIVE MATCH ENGINE
// Single Source of Truth for Live Scoring, Matches, Rosters, Tickets & Administration

import { 
  CENTRAL_PLAYERS, 
  CENTRAL_TEAMS, 
  CENTRAL_MATCHES, 
  CENTRAL_SERIES, 
  STADIUM_STAND_PRICES, 
  CentralPlayer, 
  Team, 
  Match as CentralMatch, 
  CommentaryEvent
} from './centralData';
import { realtimeHub } from './realtimeHub';

export type AdminRole = 'SUPER_ADMIN' | 'MATCH_ADMIN' | 'TICKET_ADMIN' | 'CONTENT_ADMIN';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string;
}

export interface BallDelivery {
  id: string;
  overBall: string; // e.g. "17.3"
  overNumber: number; // e.g. 17 (0-indexed) or 18 (1-indexed)
  ballInOver: number; // e.g. 3
  bowler: string;
  striker: string;
  nonStriker: string;
  outcome: 'DOT BALL' | '1 RUN' | '2 RUNS' | '3 RUNS' | 'FOUR' | 'SIX' | 'WIDE' | 'NO BALL' | 'BYE' | 'LEG BYE' | 'WICKET';
  runs: number;
  extras: number;
  isExtra: boolean;
  extraType?: 'WIDE' | 'NO BALL' | 'BYE' | 'LEG BYE';
  isWicket: boolean;
  wicketType?: 'Bowled' | 'Caught' | 'LBW' | 'Run Out' | 'Stumped' | 'Hit Wicket';
  dismissedPlayer?: string;
  fielder?: string;
  commentary: string;
  timestamp: string;
}

export interface LiveBatterState {
  playerId: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isStriker: boolean;
  isNonStriker: boolean;
  outDesc?: string;
}

export interface LiveBowlerState {
  playerId: string;
  name: string;
  overs: string;
  ballsBowled: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
}

export interface LiveMatchState {
  matchId: string;
  status: 'UPCOMING' | 'LIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  currentInningsNumber: 1 | 2;
  battingTeam: string;
  bowlingTeam: string;
  totalScore: number;
  wickets: number;
  ballsBowled: number; // total legal deliveries
  totalBalls: number; // e.g. 120 for T20, 300 for ODI
  target: number;
  runsRequired: number;
  ballsRemaining: number;
  crr: number;
  rrr: number;
  currentOverBall: string;
  striker: LiveBatterState;
  nonStriker: LiveBatterState;
  currentBowler: LiveBowlerState;
  deliveries: BallDelivery[];
  fallOfWickets: { wicket: number; score: number; player: string; over: string }[];
  partnerships: { batters: string[]; runs: number; balls: number }[];
  manhattanData: { over: number; runs: number; wickets: number }[];
  wormData: { ball: number; over: string; score: number }[];
  result?: {
    winner: string;
    margin: string;
    playerOfTheMatch: string;
    finalSummary: string;
  };
}

export interface AdminMatchItem {
  id: string;
  team1: string;
  team1Logo?: string;
  team1Short?: string;
  team2: string;
  team2Logo?: string;
  team2Short?: string;
  competition?: 'ICC' | 'RPL' | 'DOMESTIC' | 'WOMENS' | 'T20 LEAGUE' | 'PREMIER LEAGUE' | string;
  series?: string;
  title?: string;
  format: 'Test' | 'ODI' | 'T20' | 'T20I' | 'One Day' | 'Multi Day' | 'TEST' | string;
  date: string;
  time: string;
  venue: string;
  status: 'UPCOMING' | 'LIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  ticketAvailability?: 'Available' | 'Filling Fast' | 'Sold Out';
  ticketStatus?: 'AVAILABLE' | 'SELLING_FAST' | 'SOLD_OUT' | 'UNAVAILABLE';
  score?: string;
  overs?: string;
  result?: string;
}

export interface AdminTicketStand {
  id: string;
  name: string;
  price: number;
  capacity: number;
  totalSeats?: number;
  bookedSeats: number;
  soldSeats?: number;
  availableSeats: number;
  gate: string;
  status: 'Available' | 'Filling Fast' | 'Sold Out' | 'AVAILABLE' | 'SELLING_FAST' | 'SOLD_OUT' | string;
}

export interface AdminBooking {
  id: string;
  bookingId: string;
  user: string;
  userName?: string;
  userEmail: string;
  match: string;
  matchName?: string;
  matchDate?: string;
  date: string;
  bookingDate?: string;
  ticketsCount: number;
  seatsCount?: number;
  stand: string;
  standName?: string;
  block: string;
  seats: string;
  amount: number;
  totalAmount?: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed' | 'CONFIRMED' | 'PENDING' | 'CANCELLED' | string;
  qrUrl: string;
  qrCode?: string;
}

export interface AdminNewsItem {
  id: string;
  headline?: string;
  title: string;
  category: 'Matches' | 'Tickets' | 'Stadium' | 'Teams' | 'Events' | 'Match Report' | 'Stadium Announcement' | 'Team News' | 'Pitch Analysis' | string;
  image?: string;
  description?: string;
  summary?: string;
  content?: string;
  publishDate?: string;
  date: string;
  published: boolean;
  author: string;
}

export interface AdminVideoItem {
  id: string;
  title: string;
  category: 'Match Highlights' | 'Best Moments' | 'Player Interviews' | 'Stadium Tour' | 'Behind the Scenes' | 'Best Catches' | 'Best Sixes' | 'Best Wickets' | 'Highlights' | 'Classics' | 'Interviews' | 'Features' | string;
  thumbnail: string;
  url?: string;
  duration: string;
  date?: string;
  views: string;
  published?: boolean;
}

export interface AdminUserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Disabled' | 'ACTIVE' | 'SUSPENDED' | string;
  bookingsCount: number;
  ticketsBooked?: number;
  registeredDate: string;
}

export interface AdminActivityLogItem {
  id: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  section: string;
  details: string;
  timestamp: string;
}

export interface AdminNotification {
  id: string;
  type?: 'Match Reminder' | 'Match Started' | 'Match Result' | 'Ticket Availability' | 'Stadium Announcement' | 'Series Update' | 'Important Announcement' | string;
  category?: 'MATCH_UPDATE' | 'WEATHER_ALERT' | 'SECURITY' | 'TICKET_OFFER' | string;
  title: string;
  message: string;
  audience: 'All Registered Fans' | 'Ticket Holders Only' | 'Match Attendees' | 'ALL_FANS' | 'TICKET_HOLDERS_ONLY' | 'VIP_PAVILION_ONLY' | string;
  timestamp: string;
}

// -------------------------------------------------------------
// INITIAL STATE SEEDING
// -------------------------------------------------------------

const INITIAL_LIVE_STATE: LiveMatchState = {
  matchId: 'match-ind-aus-live',
  status: 'LIVE',
  currentInningsNumber: 2,
  battingTeam: 'India',
  bowlingTeam: 'Australia',
  totalScore: 150,
  wickets: 4,
  ballsBowled: 104, // 17.2 overs
  totalBalls: 120, // 20 overs
  target: 186,
  runsRequired: 36,
  ballsRemaining: 16,
  crr: 8.65,
  rrr: 13.50,
  currentOverBall: '17.2',
  striker: {
    playerId: 'p08',
    name: 'Player 08',
    runs: 72,
    balls: 45,
    fours: 7,
    sixes: 3,
    strikeRate: 160.00,
    isStriker: true,
    isNonStriker: false
  },
  nonStriker: {
    playerId: 'p09',
    name: 'Player 09',
    runs: 24,
    balls: 18,
    fours: 2,
    sixes: 1,
    strikeRate: 133.33,
    isStriker: false,
    isNonStriker: true
  },
  currentBowler: {
    playerId: 'p03',
    name: 'Player 03',
    overs: '3.2',
    ballsBowled: 20,
    maidens: 0,
    runsConceded: 28,
    wickets: 2,
    economy: 8.40
  },
  deliveries: [
    {
      id: 'del-18-2',
      overBall: '17.2',
      overNumber: 17,
      ballInOver: 2,
      bowler: 'Player 03',
      striker: 'Player 08',
      nonStriker: 'Player 09',
      outcome: 'FOUR',
      runs: 4,
      extras: 0,
      isExtra: false,
      isWicket: false,
      commentary: 'FOUR! Dispatched over mid-off with majestic timing!',
      timestamp: '7:42 PM'
    },
    {
      id: 'del-18-1',
      overBall: '17.1',
      overNumber: 17,
      ballInOver: 1,
      bowler: 'Player 03',
      striker: 'Player 08',
      nonStriker: 'Player 09',
      outcome: '1 RUN',
      runs: 1,
      extras: 0,
      isExtra: false,
      isWicket: false,
      commentary: 'Pushed into the covers for a quick single.',
      timestamp: '7:41 PM'
    }
  ],
  fallOfWickets: [
    { wicket: 1, score: 28, player: 'Player 01', over: '3.4' },
    { wicket: 2, score: 64, player: 'Player 02', over: '7.1' },
    { wicket: 3, score: 98, player: 'Player 04', over: '11.5' },
    { wicket: 4, score: 122, player: 'Player 05', over: '14.2' }
  ],
  partnerships: [
    { batters: ['Player 08', 'Player 09'], runs: 28, balls: 18 }
  ],
  manhattanData: [
    { over: 1, runs: 8, wickets: 0 },
    { over: 2, runs: 6, wickets: 0 },
    { over: 3, runs: 12, wickets: 0 },
    { over: 4, runs: 5, wickets: 1 },
    { over: 5, runs: 9, wickets: 0 },
    { over: 6, runs: 14, wickets: 0 },
    { over: 7, runs: 7, wickets: 0 },
    { over: 8, runs: 11, wickets: 1 },
    { over: 9, runs: 8, wickets: 0 },
    { over: 10, runs: 6, wickets: 0 },
    { over: 11, runs: 10, wickets: 0 },
    { over: 12, runs: 4, wickets: 1 },
    { over: 13, runs: 13, wickets: 0 },
    { over: 14, runs: 9, wickets: 0 },
    { over: 15, runs: 8, wickets: 1 },
    { over: 16, runs: 12, wickets: 0 },
    { over: 17, runs: 6, wickets: 0 },
    { over: 18, runs: 5, wickets: 0 }
  ],
  wormData: [
    { ball: 6, over: '1.0', score: 8 },
    { ball: 12, over: '2.0', score: 14 },
    { ball: 18, over: '3.0', score: 26 },
    { ball: 24, over: '4.0', score: 31 },
    { ball: 30, over: '5.0', score: 40 },
    { ball: 36, over: '6.0', score: 54 },
    { ball: 42, over: '7.0', score: 61 },
    { ball: 48, over: '8.0', score: 72 },
    { ball: 54, over: '9.0', score: 80 },
    { ball: 60, over: '10.0', score: 86 },
    { ball: 66, over: '11.0', score: 96 },
    { ball: 72, over: '12.0', score: 100 },
    { ball: 78, over: '13.0', score: 113 },
    { ball: 84, over: '14.0', score: 122 },
    { ball: 90, over: '15.0', score: 130 },
    { ball: 96, over: '16.0', score: 142 },
    { ball: 102, over: '17.0', score: 148 },
    { ball: 104, over: '17.2', score: 150 }
  ]
};

// -------------------------------------------------------------
// IN-MEMORY & CLIENT-PERSISTED ADMIN ENGINE
// -------------------------------------------------------------

class AdminEngine {
  private liveMatch: LiveMatchState = { ...INITIAL_LIVE_STATE };
  private historySnapshots: LiveMatchState[] = [];
  private currentAdmin: AdminUser = {
    id: 'adm-01',
    name: 'Stadium Chief Administrator',
    email: 'superadmin@roshspark.com',
    role: 'SUPER_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };

  private matches: AdminMatchItem[] = [
    {
      id: 'match-ind-aus-live',
      team1: 'India',
      team1Logo: '/logo_3d.jpg',
      team2: 'Australia',
      team2Logo: '/logo_3d.jpg',
      competition: 'ICC',
      format: 'T20I',
      date: 'Today',
      time: '7:30 PM IST',
      venue: 'RoshSpark Cricket Stadium',
      status: 'LIVE',
      ticketAvailability: 'Sold Out',
      score: '150/4 (17.2 ov)',
      overs: '17.2 / 20'
    },
    {
      id: 'match-ind-aus-up',
      team1: 'India',
      team1Logo: '/logo_3d.jpg',
      team2: 'Australia',
      team2Logo: '/logo_3d.jpg',
      competition: 'ICC',
      format: 'T20I',
      date: '22 Oct 2026',
      time: '7:30 PM IST',
      venue: 'RoshSpark Cricket Stadium',
      status: 'UPCOMING',
      ticketAvailability: 'Filling Fast'
    },
    {
      id: 'match-pl-clash',
      team1: 'Northern Titans',
      team1Logo: '/logo_3d.jpg',
      team2: 'Eastern Royals',
      team2Logo: '/logo_3d.jpg',
      competition: 'PREMIER LEAGUE',
      format: 'T20',
      date: '25 Oct 2026',
      time: '7:00 PM IST',
      venue: 'RoshSpark Cricket Stadium',
      status: 'UPCOMING',
      ticketAvailability: 'Available'
    },
    {
      id: 'match-rpl-derby',
      team1: 'RoshSpark Knights',
      team1Logo: '/logo_3d.jpg',
      team2: 'Thunder Strikers',
      team2Logo: '/logo_3d.jpg',
      competition: 'RPL',
      format: 'T20',
      date: '14 Oct 2026',
      time: '8:00 PM IST',
      venue: 'RoshSpark Cricket Stadium',
      status: 'COMPLETED',
      ticketAvailability: 'Sold Out',
      score: '188/6 vs 165/9',
      result: 'RoshSpark Knights won by 23 runs'
    }
  ];

  private ticketStands: AdminTicketStand[] = [
    { id: 'st-vip', name: 'VIP Pavilion', price: 5000, capacity: 5000, bookedSeats: 4850, availableSeats: 150, gate: 'Gate 1', status: 'Filling Fast' },
    { id: 'st-prem', name: 'Premium Stand', price: 3000, capacity: 8000, bookedSeats: 7600, availableSeats: 400, gate: 'Gate 2', status: 'Filling Fast' },
    { id: 'st-north', name: 'North Stand', price: 1800, capacity: 12000, bookedSeats: 12000, availableSeats: 0, gate: 'Gate 3', status: 'Sold Out' },
    { id: 'st-south', name: 'South Stand', price: 1500, capacity: 12000, bookedSeats: 11400, availableSeats: 600, gate: 'Gate 4', status: 'Available' },
    { id: 'st-east', name: 'East Stand', price: 1200, capacity: 10000, bookedSeats: 9500, availableSeats: 500, gate: 'Gate 5', status: 'Available' },
    { id: 'st-west', name: 'West Stand', price: 1000, capacity: 8000, bookedSeats: 7800, availableSeats: 200, gate: 'Gate 6', status: 'Filling Fast' }
  ];

  private bookings: AdminBooking[] = [
    {
      id: 'bk-1',
      bookingId: 'RCS-892411',
      user: 'Roshan',
      userEmail: 'roshan@roshspark.com',
      match: 'India vs Australia',
      date: '18 Sept 2026',
      ticketsCount: 1,
      stand: 'North Stand',
      block: 'Block A',
      seats: 'Seat 24',
      amount: 1800,
      status: 'Confirmed',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RCS-892411&bgcolor=ffffff&color=000000'
    },
    {
      id: 'bk-2',
      bookingId: 'RCS-389104',
      user: 'Vikram Mehta',
      userEmail: 'vikram.m@gmail.com',
      match: 'Northern Titans vs Eastern Royals',
      date: '25 Oct 2026',
      ticketsCount: 2,
      stand: 'VIP Pavilion',
      block: 'Block B',
      seats: 'Seat 11, 12',
      amount: 5000,
      status: 'Confirmed',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RCS-389104&bgcolor=ffffff&color=000000'
    },
    {
      id: 'bk-3',
      bookingId: 'RCS-194022',
      user: 'Priya Sharma',
      userEmail: 'priya.s@yahoo.com',
      match: 'India vs England (3rd T20I)',
      date: '12 Aug 2026',
      ticketsCount: 1,
      stand: 'East Stand',
      block: 'Block C',
      seats: 'Seat 08',
      amount: 1200,
      status: 'Completed',
      qrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RCS-194022&bgcolor=ffffff&color=000000'
    }
  ];

  private users: AdminUserAccount[] = [
    { id: 'usr-1', name: 'Roshan', email: 'roshan@roshspark.com', phone: '+91 98765 43210', status: 'Active', bookingsCount: 3, registeredDate: '12 Jan 2026' },
    { id: 'usr-2', name: 'Vikram Mehta', email: 'vikram.m@gmail.com', phone: '+91 98111 22334', status: 'Active', bookingsCount: 1, registeredDate: '14 Feb 2026' },
    { id: 'usr-3', name: 'Priya Sharma', email: 'priya.s@yahoo.com', phone: '+91 98444 55667', status: 'Active', bookingsCount: 2, registeredDate: '02 Mar 2026' },
    { id: 'usr-4', name: 'Rahul Verma', email: 'rahul.v@gmail.com', phone: '+91 97222 33445', status: 'Active', bookingsCount: 0, registeredDate: '18 Apr 2026' }
  ];

  private activityLogs: AdminActivityLogItem[] = [
    {
      id: 'act-1',
      adminName: 'Match Admin',
      adminRole: 'MATCH_ADMIN',
      action: 'Scored Delivery (FOUR)',
      section: 'Live Scoring Center',
      details: 'Over 17.2: Player 08 scored 4 runs off Player 03 (Score: 150/4)',
      timestamp: '7:42 PM'
    },
    {
      id: 'act-2',
      adminName: 'Super Admin',
      adminRole: 'SUPER_ADMIN',
      action: 'Updated Stand Price',
      section: 'Ticket Management',
      details: 'Verified VIP Pavilion price locked at ₹5,000',
      timestamp: '6:15 PM'
    },
    {
      id: 'act-3',
      adminName: 'Content Admin',
      adminRole: 'CONTENT_ADMIN',
      action: 'Published Matchday Article',
      section: 'News Management',
      details: 'Dispatched article: RoshSpark Ready Under 3,200 Lux Floodlights',
      timestamp: '5:00 PM'
    }
  ];

  private notifications: AdminNotification[] = [
    {
      id: 'not-1',
      type: 'Match Reminder',
      title: 'Gates Open at 5:00 PM IST',
      message: 'Turnstile sectors A through F welcoming spectators for India vs Australia.',
      audience: 'Match Attendees',
      timestamp: '5:00 PM'
    },
    {
      id: 'not-2',
      type: 'Stadium Announcement',
      title: '3,200 Lux Floodlights Energized',
      message: 'All 6 arena light towers energized at optimum beam angle.',
      audience: 'All Registered Fans',
      timestamp: '6:30 PM'
    }
  ];

  private news: AdminNewsItem[] = [
    {
      id: 'news-1',
      headline: 'RoshSpark Ready Under 3,200 Lux Floodlights For Border-Gavaskar Showdown',
      title: 'RoshSpark Ready Under 3,200 Lux Floodlights For Border-Gavaskar Showdown',
      category: 'Stadium Announcement',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
      description: 'Ground staff confirm pristine pitch prep and newly energized LED lighting arrays.',
      summary: 'Ground staff confirm pristine pitch prep and newly energized LED lighting arrays.',
      content: 'RoshSpark Cricket Stadium stands fully operational for tonight fixture.',
      publishDate: '2026-09-10',
      date: '2026-09-10',
      published: true,
      author: 'Chief Media Officer'
    },
    {
      id: 'news-2',
      headline: 'Match Center Update: High Scoring Pitch Expected For Decider',
      title: 'Match Center Update: High Scoring Pitch Expected For Decider',
      category: 'Pitch Analysis',
      image: 'https://images.unsplash.com/photo-1531415074868-036b1c57e329?w=800&auto=format&fit=crop&q=80',
      description: 'Even grass coverage and fast outfield conditions forecast an aggregate 380+ runs match.',
      summary: 'Even grass coverage and fast outfield conditions forecast an aggregate 380+ runs match.',
      content: 'Detailed pitch analysis shows ideal carry and consistent bounce for stroke-play.',
      publishDate: '2026-09-09',
      date: '2026-09-09',
      published: true,
      author: 'Head Curator'
    }
  ];

  private videos: AdminVideoItem[] = [
    {
      id: 'vid-1',
      title: 'Classic Finish: India vs Australia RoshSpark Thriller',
      category: 'Match Highlights',
      thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
      duration: '09:45',
      views: '14.2K',
      date: '2026-09-08',
      published: true
    },
    {
      id: 'vid-2',
      title: 'Press Conference: Pre-match Captains Briefing',
      category: 'Player Interviews',
      thumbnail: 'https://images.unsplash.com/photo-1531415074868-036b1c57e329?w=800&auto=format&fit=crop&q=80',
      duration: '14:20',
      views: '8.7K',
      date: '2026-09-09',
      published: true
    }
  ];

  // -----------------------------------------------------------
  // PUBLIC ACCESSORS
  // -----------------------------------------------------------

  public getAdmin(): AdminUser {
    return this.currentAdmin;
  }

  public setAdminRole(role: AdminRole) {
    this.currentAdmin.role = role;
    if (role === 'SUPER_ADMIN') this.currentAdmin.name = 'Super Administrator';
    if (role === 'MATCH_ADMIN') this.currentAdmin.name = 'Chief Scorer (Match Admin)';
    if (role === 'TICKET_ADMIN') this.currentAdmin.name = 'Box Office Supervisor (Ticket Admin)';
    if (role === 'CONTENT_ADMIN') this.currentAdmin.name = 'Broadcast & Editorial Lead (Content Admin)';
    this.logActivity('Role Switched', 'Admin System', `Switched active profile to ${role}`);
  }

  public getLiveMatchState(): LiveMatchState {
    return this.liveMatch;
  }

  public getMatches(): AdminMatchItem[] {
    return this.matches;
  }

  public getTicketStands(): AdminTicketStand[] {
    return this.ticketStands;
  }

  public getBookings(): AdminBooking[] {
    return this.bookings;
  }

  public getUsers(): AdminUserAccount[] {
    return this.users;
  }

  public getActivityLogs(): AdminActivityLogItem[] {
    return this.activityLogs;
  }

  public getNotifications(): AdminNotification[] {
    return this.notifications;
  }

  public getNews(): AdminNewsItem[] {
    return this.news;
  }

  public getVideos(): AdminVideoItem[] {
    return this.videos;
  }

  // -----------------------------------------------------------
  // BALL-BY-BALL SCORING ENGINE (ATOMIC & MATHEMATICALLY LOCKED)
  // -----------------------------------------------------------

  public recordBall(params: {
    outcome: 'DOT BALL' | '1 RUN' | '2 RUNS' | '3 RUNS' | 'FOUR' | 'SIX' | 'WIDE' | 'NO BALL' | 'BYE' | 'LEG BYE' | 'WICKET';
    runs: number;
    extras: number;
    isExtra?: boolean;
    extraType?: 'WIDE' | 'NO BALL' | 'BYE' | 'LEG BYE';
    isWicket?: boolean;
    wicketType?: 'Bowled' | 'Caught' | 'LBW' | 'Run Out' | 'Stumped' | 'Hit Wicket';
    dismissedPlayer?: string;
    fielder?: string;
    newBatsmanName?: string;
    customCommentary?: string;
  }): LiveMatchState {
    // 1. Snapshot previous state for Undo
    this.historySnapshots.push(JSON.parse(JSON.stringify(this.liveMatch)));
    if (this.historySnapshots.length > 30) this.historySnapshots.shift();

    const cur = this.liveMatch;
    const isLegalBall = !params.isExtra || (params.extraType === 'BYE' || params.extraType === 'LEG BYE');
    
    // Update deliveries count
    const newBallsBowled = isLegalBall ? cur.ballsBowled + 1 : cur.ballsBowled;
    const totalRunsThisBall = params.runs + params.extras;
    const newTotalScore = cur.totalScore + totalRunsThisBall;
    const newWickets = params.isWicket ? cur.wickets + 1 : cur.wickets;

    // Over.ball notation calculation
    const completedOvers = Math.floor(newBallsBowled / 6);
    const ballInOver = newBallsBowled % 6;
    const overBallString = `${completedOvers}.${ballInOver}`;

    // Update Chasing Equation
    const runsRequired = Math.max(0, cur.target - newTotalScore);
    const ballsRemaining = Math.max(0, cur.totalBalls - newBallsBowled);
    const crr = newBallsBowled > 0 ? Number((newTotalScore / (newBallsBowled / 6)).toFixed(2)) : 0;
    const rrr = ballsRemaining > 0 ? Number((runsRequired / (ballsRemaining / 6)).toFixed(2)) : 0;

    // Striker runs & balls update
    let updatedStriker = { ...cur.striker };
    let updatedNonStriker = { ...cur.nonStriker };

    if (!params.isExtra || params.extraType === 'NO BALL') {
      updatedStriker.runs += params.runs;
      if (isLegalBall) updatedStriker.balls += 1;
      if (params.runs === 4) updatedStriker.fours += 1;
      if (params.runs === 6) updatedStriker.sixes += 1;
      updatedStriker.strikeRate = updatedStriker.balls > 0 
        ? Number(((updatedStriker.runs / updatedStriker.balls) * 100).toFixed(2)) 
        : 0;
    } else if (isLegalBall) {
      updatedStriker.balls += 1;
    }

    // Bowler stats update
    const updatedBowler = { ...cur.currentBowler };
    if (isLegalBall) {
      updatedBowler.ballsBowled += 1;
    }
    const bowlerCompletedOvers = Math.floor(updatedBowler.ballsBowled / 6);
    const bowlerBallsInOver = updatedBowler.ballsBowled % 6;
    updatedBowler.overs = `${bowlerCompletedOvers}.${bowlerBallsInOver}`;
    updatedBowler.runsConceded += totalRunsThisBall;
    if (params.isWicket && params.wicketType !== 'Run Out') {
      updatedBowler.wickets += 1;
    }
    updatedBowler.economy = updatedBowler.ballsBowled > 0 
      ? Number(((updatedBowler.runsConceded / (updatedBowler.ballsBowled / 6)).toFixed(2))) 
      : 0;

    // Handle Wicket: replace batter if out
    const fallOfWickets = [...cur.fallOfWickets];
    if (params.isWicket) {
      const dismissed = params.dismissedPlayer || updatedStriker.name;
      fallOfWickets.push({
        wicket: newWickets,
        score: newTotalScore,
        player: dismissed,
        over: overBallString
      });

      const nextName = params.newBatsmanName || `Player ${String(newWickets + 2).padStart(2, '0')}`;
      if (dismissed === updatedStriker.name) {
        updatedStriker = {
          playerId: `p${String(newWickets + 2).padStart(2, '0')}`,
          name: nextName,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          isStriker: true,
          isNonStriker: false
        };
      } else {
        updatedNonStriker = {
          playerId: `p${String(newWickets + 2).padStart(2, '0')}`,
          name: nextName,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          isStriker: false,
          isNonStriker: true
        };
      }
    }

    // Strike Rotation:
    // Rotate if odd runs (1, 3) scored off bat or byes
    const isOddRuns = (params.runs % 2 === 1) || (params.extras % 2 === 1 && (params.extraType === 'BYE' || params.extraType === 'LEG BYE'));
    const isOverEnd = isLegalBall && ballInOver === 0 && newBallsBowled > 0;

    if ((isOddRuns && !isOverEnd) || (!isOddRuns && isOverEnd)) {
      // Swap striker & non-striker
      const temp = { ...updatedStriker, isStriker: false, isNonStriker: true };
      updatedStriker = { ...updatedNonStriker, isStriker: true, isNonStriker: false };
      updatedNonStriker = temp;
    }

    // Commentary Entry Generation
    const autoDesc = params.customCommentary || (
      params.isWicket 
        ? `WICKET! ${params.wicketType || 'Out'}! ${params.dismissedPlayer || cur.striker.name} departs under massive stadium cheers!` 
        : params.outcome === 'FOUR'
        ? `FOUR! Beautifully cracked past the backward point boundary by ${cur.striker.name}!`
        : params.outcome === 'SIX'
        ? `SIX! Smashed high into the VIP Pavilion roof by ${cur.striker.name}!`
        : params.outcome === 'DOT BALL'
        ? `DOT BALL. Good length delivery pitching outside off, beaten by pace.`
        : `${params.runs} run${params.runs > 1 ? 's' : ''} pushed into the outfield.`
    );

    const newDelivery: BallDelivery = {
      id: `del-${Date.now()}`,
      overBall: `${Math.floor((newBallsBowled - 1) / 6)}.${((newBallsBowled - 1) % 6) + 1}`,
      overNumber: Math.floor((newBallsBowled - 1) / 6),
      ballInOver: ((newBallsBowled - 1) % 6) + 1,
      bowler: cur.currentBowler.name,
      striker: cur.striker.name,
      nonStriker: cur.nonStriker.name,
      outcome: params.outcome,
      runs: params.runs,
      extras: params.extras,
      isExtra: !!params.isExtra,
      extraType: params.extraType,
      isWicket: !!params.isWicket,
      wicketType: params.wicketType,
      dismissedPlayer: params.dismissedPlayer,
      fielder: params.fielder,
      commentary: autoDesc,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    // Update Worm & Manhattan
    const wormData = [...cur.wormData, {
      ball: newBallsBowled,
      over: overBallString,
      score: newTotalScore
    }];

    const activeOverNum = Math.floor((newBallsBowled - 1) / 6) + 1;
    const manhattanData = [...cur.manhattanData];
    const existingOverIdx = manhattanData.findIndex(m => m.over === activeOverNum);
    if (existingOverIdx >= 0) {
      manhattanData[existingOverIdx] = {
        over: activeOverNum,
        runs: manhattanData[existingOverIdx].runs + totalRunsThisBall,
        wickets: manhattanData[existingOverIdx].wickets + (params.isWicket ? 1 : 0)
      };
    } else {
      manhattanData.push({
        over: activeOverNum,
        runs: totalRunsThisBall,
        wickets: params.isWicket ? 1 : 0
      });
    }

    // Check Match Completion
    let finalResult = cur.result;
    let newStatus = cur.status;
    if (runsRequired <= 0) {
      newStatus = 'COMPLETED';
      finalResult = {
        winner: cur.battingTeam,
        margin: `${10 - newWickets} wickets`,
        playerOfTheMatch: updatedStriker.name,
        finalSummary: `${cur.battingTeam} defeated ${cur.bowlingTeam} by ${10 - newWickets} wickets at RoshSpark Cricket Stadium.`
      };
    } else if (ballsRemaining <= 0 || newWickets >= 10) {
      newStatus = 'COMPLETED';
      const marginRuns = runsRequired;
      finalResult = {
        winner: cur.bowlingTeam,
        margin: `${marginRuns} runs`,
        playerOfTheMatch: cur.currentBowler.name,
        finalSummary: `${cur.bowlingTeam} defeated ${cur.battingTeam} by ${marginRuns} runs under RoshSpark floodlights.`
      };
    }

    this.liveMatch = {
      ...cur,
      status: newStatus,
      totalScore: newTotalScore,
      wickets: newWickets,
      ballsBowled: newBallsBowled,
      runsRequired,
      ballsRemaining,
      crr,
      rrr,
      currentOverBall: overBallString,
      striker: updatedStriker,
      nonStriker: updatedNonStriker,
      currentBowler: updatedBowler,
      deliveries: [newDelivery, ...cur.deliveries],
      fallOfWickets,
      wormData,
      manhattanData,
      result: finalResult
    };

    // Update live match card in matches list
    const liveMatchIdx = this.matches.findIndex(m => m.id === cur.matchId);
    if (liveMatchIdx >= 0) {
      this.matches[liveMatchIdx].score = `${newTotalScore}/${newWickets} (${overBallString} ov)`;
      this.matches[liveMatchIdx].overs = `${overBallString} / ${cur.totalBalls / 6}`;
      this.matches[liveMatchIdx].status = newStatus;
      if (finalResult) this.matches[liveMatchIdx].result = finalResult.finalSummary;
    }

    this.logActivity('Ball Scored', 'Live Match Control', `${overBallString}: ${params.outcome} (${totalRunsThisBall} runs). Score: ${newTotalScore}/${newWickets}`);
    try {
      realtimeHub.publish('MATCH_UPDATE', this.liveMatch);
    } catch {}
    return this.liveMatch;
  }

  public undoLastBall(): LiveMatchState {
    if (this.historySnapshots.length === 0) return this.liveMatch;
    const previous = this.historySnapshots.pop()!;
    this.liveMatch = previous;
    this.logActivity('Undo Ball', 'Live Match Control', `Reverted last delivery. Score restored to ${previous.totalScore}/${previous.wickets}`);
    try {
      realtimeHub.publish('MATCH_UPDATE', this.liveMatch);
    } catch {}
    return this.liveMatch;
  }

  public updateStriker(batterName: string) {
    this.liveMatch.striker.name = batterName;
    this.logActivity('Batter Changed', 'Live Match Control', `Striker set to ${batterName}`);
  }

  public updateNonStriker(batterName: string) {
    this.liveMatch.nonStriker.name = batterName;
    this.logActivity('Batter Changed', 'Live Match Control', `Non-striker set to ${batterName}`);
  }

  public updateBowler(bowlerName: string) {
    this.liveMatch.currentBowler.name = bowlerName;
    this.logActivity('Bowler Changed', 'Live Match Control', `Bowler changed to ${bowlerName}`);
  }

  public setMatchStatus(matchId: string, status: AdminMatchItem['status']) {
    const idx = this.matches.findIndex(m => m.id === matchId);
    if (idx >= 0) {
      this.matches[idx].status = status;
      if (this.liveMatch.matchId === matchId) {
        this.liveMatch.status = status;
      }
      this.logActivity('Status Updated', 'Match Management', `Match ${this.matches[idx].team1} vs ${this.matches[idx].team2} set to ${status}`);
    }
  }

  public updateMatchStatus(matchId: string, status: AdminMatchItem['status']) {
    this.setMatchStatus(matchId, status);
  }

  public addMatch(match: Omit<AdminMatchItem, 'id'>) {
    const newId = `match-custom-${Date.now()}`;
    const item: AdminMatchItem = { ...match, id: newId };
    this.matches = [item, ...this.matches];
    this.logActivity('Created Match', 'Match Management', `Added ${match.team1} vs ${match.team2} (${match.format})`);
    return item;
  }

  public deleteMatch(id: string) {
    const match = this.matches.find(m => m.id === id);
    this.matches = this.matches.filter(m => m.id !== id);
    if (match) {
      this.logActivity('Deleted Match', 'Match Management', `Removed match ${match.team1} vs ${match.team2}`);
    }
  }

  public updateTicketPrice(standId: string, newPrice: number, capacityOrStatus?: number | any) {
    const stand = this.ticketStands.find(s => s.id === standId);
    if (stand) {
      stand.price = newPrice;
      if (typeof capacityOrStatus === 'number') {
        stand.capacity = capacityOrStatus;
        stand.totalSeats = capacityOrStatus;
      } else if (typeof capacityOrStatus === 'string') {
        stand.status = capacityOrStatus as any;
      }
      this.logActivity('Price Adjusted', 'Ticket Management', `${stand.name} price updated to ₹${newPrice.toLocaleString()}`);
    }
  }

  public toggleUserAccount(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'Active' ? 'Disabled' : 'Active';
      this.logActivity('User Status Changed', 'User Management', `User ${user.name} (${user.email}) set to ${user.status}`);
    }
  }

  public toggleUserStatus(userId: string, status?: 'ACTIVE' | 'SUSPENDED' | 'Active' | 'Disabled') {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      if (status) {
        user.status = status;
      } else {
        user.status = (user.status === 'Active' || user.status === 'ACTIVE') ? 'Disabled' : 'Active';
      }
      this.logActivity('User Status Changed', 'User Management', `User ${user.name} set to ${user.status}`);
    }
  }

  public updateNewsStatus(id: string, published: boolean) {
    const article = this.news.find(n => n.id === id);
    if (article) {
      article.published = published;
      this.logActivity('Article Status', 'News Management', `Article "${article.headline}" set to ${published ? 'Published' : 'Draft'}`);
    }
  }

  public addNews(newsItem: AdminNewsItem) {
    this.news = [newsItem, ...this.news];
    this.logActivity('Article Published', 'News Management', `Published "${newsItem.headline || newsItem.title}"`);
    return newsItem;
  }

  public deleteNews(id: string) {
    const art = this.news.find(n => n.id === id);
    this.news = this.news.filter(n => n.id !== id);
    if (art) {
      this.logActivity('Article Deleted', 'News Management', `Removed article "${art.headline || art.title}"`);
    }
  }

  public addVideo(videoItem: AdminVideoItem) {
    this.videos = [videoItem, ...this.videos];
    this.logActivity('Video Uploaded', 'Video Vault', `Uploaded "${videoItem.title}"`);
    return videoItem;
  }

  public deleteVideo(id: string) {
    const vid = this.videos.find(v => v.id === id);
    this.videos = this.videos.filter(v => v.id !== id);
    if (vid) {
      this.logActivity('Video Deleted', 'Video Vault', `Removed video "${vid.title}"`);
    }
  }

  public broadcastNotification(
    titleOrNotif: string | Omit<AdminNotification, 'id' | 'timestamp'>,
    message?: string,
    audience?: any,
    category?: any
  ) {
    let item: AdminNotification;
    if (typeof titleOrNotif === 'string') {
      item = {
        id: `not-${Date.now()}`,
        title: titleOrNotif,
        message: message || '',
        audience: audience || 'ALL_FANS',
        category: category || 'MATCH_UPDATE',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
    } else {
      item = {
        ...titleOrNotif,
        id: `not-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };
    }
    this.notifications = [item, ...this.notifications];
    this.logActivity('Notification Broadcast', 'Notifications', `Sent "${item.title}" to ${item.audience}`);
    try {
      realtimeHub.publish('NOTIFICATION', item);
    } catch {}
    return item;
  }

  public addBooking(booking: AdminBooking) {
    this.bookings = [booking, ...this.bookings];

    // Update stand booked count & status
    const stand = this.ticketStands.find(s => s.name.toLowerCase() === (booking.standName || booking.stand).toLowerCase());
    if (stand) {
      stand.bookedSeats += (booking.ticketsCount || booking.seatsCount || 1);
      stand.availableSeats = Math.max(0, stand.capacity - stand.bookedSeats);
      if (stand.availableSeats === 0) {
        stand.status = 'Sold Out';
      } else if (stand.availableSeats < stand.capacity * 0.15) {
        stand.status = 'Filling Fast';
      }
    }

    // Register or increment user account
    let userAcc = this.users.find(u => u.email.toLowerCase() === booking.userEmail.toLowerCase());
    if (userAcc) {
      userAcc.bookingsCount += 1;
    } else {
      this.users.push({
        id: `usr-${Date.now()}`,
        name: booking.userName || booking.user || 'Fan',
        email: booking.userEmail,
        phone: '+91 98000 00000',
        status: 'Active',
        bookingsCount: 1,
        registeredDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      });
    }

    this.logActivity(
      'New Booking Placed',
      'Box Office',
      `${booking.userName || booking.user} booked ${booking.ticketsCount} seat(s) in ${booking.stand} (#${booking.bookingId})`
    );

    try {
      realtimeHub.publish('BOOKING_CREATED', booking);
      realtimeHub.publish('TICKET_UPDATE', this.ticketStands);
    } catch {
      // safe fallback
    }

    return booking;
  }

  public cancelBooking(bookingId: string) {
    const booking = this.bookings.find(b => b.bookingId === bookingId || b.id === bookingId);
    if (booking) {
      booking.status = 'Cancelled';
      const stand = this.ticketStands.find(s => s.name.toLowerCase() === (booking.standName || booking.stand).toLowerCase());
      if (stand) {
        stand.bookedSeats = Math.max(0, stand.bookedSeats - (booking.ticketsCount || booking.seatsCount || 1));
        stand.availableSeats = stand.capacity - stand.bookedSeats;
        if (stand.availableSeats > 0 && stand.status === 'Sold Out') {
          stand.status = 'Filling Fast';
        }
      }
      this.logActivity('Booking Cancelled', 'Box Office', `Booking #${booking.bookingId} cancelled & refund processed`);
      try {
        realtimeHub.publish('TICKET_UPDATE', this.ticketStands);
        realtimeHub.publish('BOOKING_CREATED', booking);
      } catch {}
    }
  }

  public getUserBookings(email: string): AdminBooking[] {
    return this.bookings.filter(b => b.userEmail.toLowerCase() === email.toLowerCase());
  }

  public logActivity(action: string, sectionOrDetails: string, maybeDetails?: string) {
    const section = maybeDetails !== undefined ? sectionOrDetails : 'Admin System';
    const details = maybeDetails !== undefined ? maybeDetails : sectionOrDetails;
    const logItem: AdminActivityLogItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      adminName: this.currentAdmin.name,
      adminRole: this.currentAdmin.role,
      action,
      section,
      details,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
    this.activityLogs = [logItem, ...this.activityLogs.slice(0, 50)];
    try {
      realtimeHub.publish('ACTIVITY_LOGGED', logItem);
    } catch {}
  }
}

// Global Singleton Instance
declare global {
  var __roshspark_admin_engine__: AdminEngine | undefined;
}

export const adminEngine: AdminEngine = globalThis.__roshspark_admin_engine__ || new AdminEngine();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__roshspark_admin_engine__ = adminEngine;
}
