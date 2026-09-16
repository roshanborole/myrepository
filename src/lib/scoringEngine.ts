/**
 * Cricket Scoring Engine — Mandatory Single Source of Truth
 * Adheres strictly to Section 14–33, 59–60 of specification.
 * 
 * Rules:
 * 1. Wide: +1 extra (or 1+wide runs), legalDelivery = false, over ball count does NOT increment. Bowler conceded +extras.
 * 2. No Ball: +1 extra penalty, legalDelivery = false, over ball count does NOT increment. Bat runs count to batter & bowler. Only run out valid.
 * 3. Bye: legalDelivery = true, batter runs = 0, bowler conceded = 0, team score +bye runs.
 * 4. Leg Bye: legalDelivery = true, batter runs = 0, bowler conceded = 0, team score +leg bye runs.
 * 5. Over: exactly 6 legal deliveries.
 * 6. Strike rotation: odd runs off bat/byes rotate strike; end of over rotates strike & switches bowler.
 */

export type ExtraType = 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE' | 'PENALTY';

export type DismissalType = 
  | 'BOWLED' 
  | 'CAUGHT' 
  | 'LBW' 
  | 'RUN_OUT' 
  | 'STUMPED' 
  | 'HIT_WICKET' 
  | 'RETIRED_HURT' 
  | 'RETIRED_OUT';

export interface BallDelivery {
  id?: string;
  overNumber: number;        // e.g. 18
  ballNumber: number;        // e.g. 1 to 6 legal ball
  legalDelivery: boolean;    // false for wide or no-ball
  batterId: string;
  batterName: string;
  bowlerId: string;
  bowlerName: string;
  runsOffBat: number;
  extras: number;
  extraType?: ExtraType;
  totalRuns: number;         // runsOffBat + extras
  isWicket: boolean;
  dismissalType?: DismissalType;
  dismissedBatterId?: string;
  dismissedBatterName?: string;
  fielderName?: string;
  commentary: string;
}

export interface BatterInningsStat {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: string;
  isOut: boolean;
  dismissalText: string;
  isStriker?: boolean;
  isNonStriker?: boolean;
}

export interface BowlerInningsStat {
  id: string;
  name: string;
  overs: string;             // e.g. "3.2"
  legalBalls: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: string;
  dots: number;
  fours: number;
  sixes: number;
  wides: number;
  noBalls: number;
  isActive?: boolean;
}

export interface ExtrasBreakdown {
  byes: number;
  legByes: number;
  wides: number;
  noBalls: number;
  penalty: number;
  total: number;
}

export interface FallOfWicketEntry {
  wicket: number;
  score: number;
  over: string;
  batterName: string;
  partnershipRuns: number;
  partnershipBalls: number;
}

export interface OverSummaryData {
  overNumber: number;
  bowlerName: string;
  balls: BallDelivery[];
  totalRuns: number;
  wickets: number;
  extras: number;
  legalBallsCount: number;
}

export interface PhaseScores {
  powerplay: { overs: string; runs: number; wickets: number; runRate: string };
  middle: { overs: string; runs: number; wickets: number; runRate: string };
  death: { overs: string; runs: number; wickets: number; runRate: string };
}

export interface CalculatedInnings {
  totalRuns: number;
  totalWickets: number;
  legalBalls: number;
  displayOvers: string;       // e.g. "17.2"
  runRate: string;
  extras: ExtrasBreakdown;
  batters: BatterInningsStat[];
  bowlers: BowlerInningsStat[];
  fallOfWickets: FallOfWicketEntry[];
  overs: OverSummaryData[];
  currentPartnership: {
    batter1Name: string;
    batter1Runs: number;
    batter2Name: string;
    batter2Runs: number;
    totalRuns: number;
    totalBalls: number;
    runRate: string;
  };
  phases: PhaseScores;
}

/**
 * Creates a structured delivery according to official scoring rules
 */
export function createBallDelivery(params: {
  overNumber: number;
  ballNumber: number;
  batterId: string;
  batterName: string;
  bowlerId: string;
  bowlerName: string;
  runsOffBat: number;
  extraType?: ExtraType;
  extraRuns?: number;
  isWicket?: boolean;
  dismissalType?: DismissalType;
  dismissedBatterId?: string;
  dismissedBatterName?: string;
  fielderName?: string;
  commentary?: string;
}): BallDelivery {
  const {
    overNumber,
    ballNumber,
    batterId,
    batterName,
    bowlerId,
    bowlerName,
    runsOffBat = 0,
    extraType,
    extraRuns = 0,
    isWicket = false,
    dismissalType,
    dismissedBatterId,
    dismissedBatterName,
    fielderName,
    commentary,
  } = params;

  let legalDelivery = true;
  let extras = 0;

  if (extraType === 'WIDE') {
    legalDelivery = false;
    extras = Math.max(1, extraRuns || 1);
  } else if (extraType === 'NO_BALL') {
    legalDelivery = false;
    extras = Math.max(1, extraRuns || 1);
  } else if (extraType === 'BYE' || extraType === 'LEG_BYE' || extraType === 'PENALTY') {
    legalDelivery = true;
    extras = extraRuns;
  }

  // Section 17.3: On No-Ball, only run out is a valid dismissal
  let validWicket = isWicket;
  if (extraType === 'NO_BALL' && isWicket && dismissalType !== 'RUN_OUT') {
    validWicket = false;
  }

  const totalRuns = (extraType === 'WIDE' ? 0 : runsOffBat) + extras;

  let desc = commentary;
  if (!desc) {
    if (extraType === 'WIDE') {
      desc = `WIDE! ${bowlerName} strays outside line, called wide (+${extras} extra).`;
    } else if (extraType === 'NO_BALL') {
      desc = `NO BALL! Overstepping by ${bowlerName}. ${runsOffBat > 0 ? `Batter hits ${runsOffBat} runs!` : 'Free hit signalled.'}`;
    } else if (validWicket) {
      desc = `OUT! ${dismissedBatterName || batterName} dismissed (${dismissalType || 'BOWLED'}).`;
    } else if (runsOffBat === 4) {
      desc = `FOUR! Gloriously struck by ${batterName} through the covers!`;
    } else if (runsOffBat === 6) {
      desc = `SIX! Mammoth hit by ${batterName} clearing the ropes at RoshSpark Stadium!`;
    } else if (runsOffBat === 0) {
      desc = `Dot ball. Defended firmly back to the bowler.`;
    } else {
      desc = `${runsOffBat} run${runsOffBat > 1 ? 's' : ''} pushed into the gap by ${batterName}.`;
    }
  }

  return {
    overNumber,
    ballNumber,
    legalDelivery,
    batterId,
    batterName,
    bowlerId,
    bowlerName,
    runsOffBat: extraType === 'WIDE' ? 0 : runsOffBat,
    extras,
    extraType,
    totalRuns,
    isWicket: validWicket,
    dismissalType: validWicket ? dismissalType : undefined,
    dismissedBatterId: validWicket ? (dismissedBatterId || batterId) : undefined,
    dismissedBatterName: validWicket ? (dismissedBatterName || batterName) : undefined,
    fielderName,
    commentary: desc,
  };
}

/**
 * Calculates complete innings statistics derived strictly from ball-by-ball deliveries
 */
export function calculateInningsState(
  deliveries: BallDelivery[],
  initialBatters: { id: string; name: string }[],
  initialBowlers: { id: string; name: string }[]
): CalculatedInnings {
  let totalRuns = 0;
  let totalWickets = 0;
  let legalBalls = 0;

  const extras: ExtrasBreakdown = {
    byes: 0,
    legByes: 0,
    wides: 0,
    noBalls: 0,
    penalty: 0,
    total: 0,
  };

  const batterMap = new Map<string, BatterInningsStat>();
  initialBatters.forEach(b => {
    batterMap.set(b.id, {
      id: b.id,
      name: b.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: '0.00',
      isOut: false,
      dismissalText: 'not out',
    });
  });

  const bowlerMap = new Map<string, {
    id: string;
    name: string;
    legalBalls: number;
    runsConceded: number;
    wickets: number;
    dots: number;
    fours: number;
    sixes: number;
    wides: number;
    noBalls: number;
    oversRuns: Map<number, number>;
  }>();

  initialBowlers.forEach(b => {
    bowlerMap.set(b.id, {
      id: b.id,
      name: b.name,
      legalBalls: 0,
      runsConceded: 0,
      wickets: 0,
      dots: 0,
      fours: 0,
      sixes: 0,
      wides: 0,
      noBalls: 0,
      oversRuns: new Map(),
    });
  });

  const fallOfWickets: FallOfWicketEntry[] = [];
  const overMap = new Map<number, OverSummaryData>();

  let p1Name = initialBatters[0]?.name || 'Batter 1';
  let p1Runs = 0;
  let p2Name = initialBatters[1]?.name || 'Batter 2';
  let p2Runs = 0;
  let curPartRuns = 0;
  let curPartBalls = 0;

  deliveries.forEach((d) => {
    totalRuns += d.totalRuns;

    if (d.legalDelivery) {
      legalBalls += 1;
      curPartBalls += 1;
    }

    if (d.extraType === 'WIDE') {
      extras.wides += d.extras;
    } else if (d.extraType === 'NO_BALL') {
      extras.noBalls += d.extras;
    } else if (d.extraType === 'BYE') {
      extras.byes += d.extras;
    } else if (d.extraType === 'LEG_BYE') {
      extras.legByes += d.extras;
    } else if (d.extraType === 'PENALTY') {
      extras.penalty += d.extras;
    }
    extras.total = extras.byes + extras.legByes + extras.wides + extras.noBalls + extras.penalty;

    let batter = batterMap.get(d.batterId);
    if (!batter) {
      batter = {
        id: d.batterId,
        name: d.batterName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        strikeRate: '0.00',
        isOut: false,
        dismissalText: 'not out',
      };
      batterMap.set(d.batterId, batter);
    }

    if (d.extraType !== 'WIDE') {
      batter.balls += 1;
      batter.runs += d.runsOffBat;
      if (d.runsOffBat === 4) batter.fours += 1;
      if (d.runsOffBat === 6) batter.sixes += 1;
    }
    batter.strikeRate = batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(2) : '0.00';

    let bowler = bowlerMap.get(d.bowlerId);
    if (!bowler) {
      bowler = {
        id: d.bowlerId,
        name: d.bowlerName,
        legalBalls: 0,
        runsConceded: 0,
        wickets: 0,
        dots: 0,
        fours: 0,
        sixes: 0,
        wides: 0,
        noBalls: 0,
        oversRuns: new Map(),
      };
      bowlerMap.set(d.bowlerId, bowler);
    }

    if (d.legalDelivery) {
      bowler.legalBalls += 1;
    }

    let bowlerRunsForBall = 0;
    if (d.extraType === 'WIDE' || d.extraType === 'NO_BALL') {
      bowlerRunsForBall = d.totalRuns;
      if (d.extraType === 'WIDE') bowler.wides += 1;
      if (d.extraType === 'NO_BALL') bowler.noBalls += 1;
    } else if (d.extraType === 'BYE' || d.extraType === 'LEG_BYE') {
      bowlerRunsForBall = 0;
    } else {
      bowlerRunsForBall = d.runsOffBat;
    }

    bowler.runsConceded += bowlerRunsForBall;
    const prevOverRuns = bowler.oversRuns.get(d.overNumber) || 0;
    bowler.oversRuns.set(d.overNumber, prevOverRuns + bowlerRunsForBall);

    if (d.runsOffBat === 0 && d.extras === 0) bowler.dots += 1;
    if (d.runsOffBat === 4) bowler.fours += 1;
    if (d.runsOffBat === 6) bowler.sixes += 1;

    if (d.batterName === p1Name) {
      p1Runs += d.runsOffBat;
    } else if (d.batterName === p2Name) {
      p2Runs += d.runsOffBat;
    } else {
      p2Name = d.batterName;
      p2Runs = d.runsOffBat;
    }
    curPartRuns += d.totalRuns;

    if (d.isWicket) {
      totalWickets += 1;
      bowler.wickets += 1;

      const dismissedName = d.dismissedBatterName || d.batterName;
      const dismissedId = d.dismissedBatterId || d.batterId;
      const dismissedBatter = batterMap.get(dismissedId);
      if (dismissedBatter) {
        dismissedBatter.isOut = true;
        if (d.dismissalType === 'CAUGHT') {
          dismissedBatter.dismissalText = `c ${d.fielderName || 'fielder'} b ${d.bowlerName}`;
        } else if (d.dismissalType === 'BOWLED') {
          dismissedBatter.dismissalText = `b ${d.bowlerName}`;
        } else if (d.dismissalType === 'LBW') {
          dismissedBatter.dismissalText = `lbw b ${d.bowlerName}`;
        } else if (d.dismissalType === 'RUN_OUT') {
          dismissedBatter.dismissalText = `run out (${d.fielderName || 'direct'})`;
        } else if (d.dismissalType === 'STUMPED') {
          dismissedBatter.dismissalText = `st ${d.fielderName || 'keeper'} b ${d.bowlerName}`;
        } else {
          dismissedBatter.dismissalText = `${d.dismissalType || 'out'} b ${d.bowlerName}`;
        }
      }

      const overStr = `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;
      fallOfWickets.push({
        wicket: totalWickets,
        score: totalRuns,
        over: overStr,
        batterName: dismissedName,
        partnershipRuns: curPartRuns,
        partnershipBalls: curPartBalls,
      });

      curPartRuns = 0;
      curPartBalls = 0;
      if (dismissedName === p1Name) {
        p1Name = 'Next Batter';
        p1Runs = 0;
      } else {
        p2Name = 'Next Batter';
        p2Runs = 0;
      }
    }

    let overObj = overMap.get(d.overNumber);
    if (!overObj) {
      overObj = {
        overNumber: d.overNumber,
        bowlerName: d.bowlerName,
        balls: [],
        totalRuns: 0,
        wickets: 0,
        extras: 0,
        legalBallsCount: 0,
      };
      overMap.set(d.overNumber, overObj);
    }
    overObj.balls.push(d);
    overObj.totalRuns += d.totalRuns;
    if (d.isWicket) overObj.wickets += 1;
    if (d.extras > 0) overObj.extras += d.extras;
    if (d.legalDelivery) overObj.legalBallsCount += 1;
  });

  const finalBowlers: BowlerInningsStat[] = Array.from(bowlerMap.values()).map(b => {
    let maidens = 0;
    b.oversRuns.forEach((runsInOver, overNum) => {
      const overBalls = overMap.get(overNum)?.legalBallsCount || 0;
      if (overBalls === 6 && runsInOver === 0) {
        maidens += 1;
      }
    });

    const ovInt = Math.floor(b.legalBalls / 6);
    const ovRem = b.legalBalls % 6;
    const oversStr = `${ovInt}.${ovRem}`;
    const totalOversDec = b.legalBalls / 6;
    const economy = totalOversDec > 0 ? (b.runsConceded / totalOversDec).toFixed(2) : '0.00';

    return {
      id: b.id,
      name: b.name,
      overs: oversStr,
      legalBalls: b.legalBalls,
      maidens,
      runsConceded: b.runsConceded,
      wickets: b.wickets,
      economy,
      dots: b.dots,
      fours: b.fours,
      sixes: b.sixes,
      wides: b.wides,
      noBalls: b.noBalls,
    };
  });

  const displayOvers = `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;
  const totalOversDec = legalBalls / 6;
  const runRate = totalOversDec > 0 ? (totalRuns / totalOversDec).toFixed(2) : '0.00';

  let ppRuns = 0, ppWickets = 0, ppBalls = 0;
  let midRuns = 0, midWickets = 0, midBalls = 0;
  let deathRuns = 0, deathWickets = 0, deathBalls = 0;

  overMap.forEach(o => {
    if (o.overNumber <= 6) {
      ppRuns += o.totalRuns;
      ppWickets += o.wickets;
      ppBalls += o.legalBallsCount;
    } else if (o.overNumber <= 15) {
      midRuns += o.totalRuns;
      midWickets += o.wickets;
      midBalls += o.legalBallsCount;
    } else {
      deathRuns += o.totalRuns;
      deathWickets += o.wickets;
      deathBalls += o.legalBallsCount;
    }
  });

  const ppOvers = `${Math.floor(ppBalls / 6)}.${ppBalls % 6}`;
  const midOvers = `${Math.floor(midBalls / 6)}.${midBalls % 6}`;
  const deathOvers = `${Math.floor(deathBalls / 6)}.${deathBalls % 6}`;

  const phases: PhaseScores = {
    powerplay: {
      overs: `0–6 (${ppOvers} ov)`,
      runs: ppRuns,
      wickets: ppWickets,
      runRate: ppBalls > 0 ? (ppRuns / (ppBalls / 6)).toFixed(2) : '0.00',
    },
    middle: {
      overs: `7–15 (${midOvers} ov)`,
      runs: midRuns,
      wickets: midWickets,
      runRate: midBalls > 0 ? (midRuns / (midBalls / 6)).toFixed(2) : '0.00',
    },
    death: {
      overs: `16–20 (${deathOvers} ov)`,
      runs: deathRuns,
      wickets: deathWickets,
      runRate: deathBalls > 0 ? (deathRuns / (deathBalls / 6)).toFixed(2) : '0.00',
    },
  };

  const partRunRate = curPartBalls > 0 ? (curPartRuns / (curPartBalls / 6)).toFixed(2) : '0.00';

  return {
    totalRuns,
    totalWickets,
    legalBalls,
    displayOvers,
    runRate,
    extras,
    batters: Array.from(batterMap.values()),
    bowlers: finalBowlers,
    fallOfWickets,
    overs: Array.from(overMap.values()).sort((a, b) => a.overNumber - b.overNumber),
    currentPartnership: {
      batter1Name: p1Name,
      batter1Runs: p1Runs,
      batter2Name: p2Name,
      batter2Runs: p2Runs,
      totalRuns: curPartRuns,
      totalBalls: curPartBalls,
      runRate: partRunRate,
    },
    phases,
  };
}

/**
 * Calculates live chase metrics (Section 31)
 */
export function calculateChaseEquations(params: {
  target: number;
  totalBallsAllowed: number; // 120 for T20
  currentRuns: number;
  legalBallsBowled: number;
}) {
  const { target, totalBallsAllowed, currentRuns, legalBallsBowled } = params;
  const runsRequired = Math.max(0, target - currentRuns);
  const ballsRemaining = Math.max(0, totalBallsAllowed - legalBallsBowled);

  const oversBowledDec = legalBallsBowled / 6;
  const crr = oversBowledDec > 0 ? (currentRuns / oversBowledDec).toFixed(2) : '0.00';

  const oversRemDec = ballsRemaining / 6;
  const rrr = runsRequired > 0 && oversRemDec > 0 ? (runsRequired / oversRemDec).toFixed(2) : '0.00';

  const isWon = currentRuns >= target;
  const isLost = ballsRemaining === 0 && currentRuns < target;
  const isTied = ballsRemaining === 0 && currentRuns === target - 1;

  return {
    target,
    runsRequired,
    ballsRemaining,
    crr,
    rrr,
    isWon,
    isLost,
    isTied,
  };
}
