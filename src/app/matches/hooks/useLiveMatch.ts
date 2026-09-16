import { useState, useCallback, useMemo, useEffect } from 'react';
import { Match, CommentaryEvent, InningsScorecard } from '../data';

export function useLiveMatch(initialMatch: Match) {
  const [match, setMatch] = useState<Match>(initialMatch);

  // Synchronize in real-time with Admin scoring console API
  useEffect(() => {
    if (initialMatch.id !== 'm-live-01' && initialMatch.status !== 'LIVE') return;

    let isMounted = true;
    const fetchLiveState = async () => {
      try {
        const res = await fetch('/api/admin/live-match');
        if (!res.ok) return;
        const json = await res.json();
        if (!json.success || !json.data) return;
        const live = json.data;

        if (!isMounted) return;

        setMatch(prevMatch => {
          const prevLive = prevMatch.liveState;
          const displayOvers = `${Math.floor(live.ballsBowled / 6)}.${live.ballsBowled % 6}`;

          const commentaryHistory: CommentaryEvent[] = (live.commentary || []).map((c: any) => ({
            overBall: `${c.over}.${c.ball}`,
            runs: c.runs,
            outcome: c.outcome,
            batter: c.batter,
            bowler: c.bowler,
            description: c.description,
            isWicket: c.isWicket,
            wicketType: c.wicketType
          }));

          const currentInnings = prevMatch.scorecard[prevMatch.scorecard.length - 1];
          const updatedBatters = (currentInnings?.batters || []).map(b => {
            if (b.name === live.striker?.name) {
              return {
                ...b,
                runs: live.striker.runs,
                balls: live.striker.balls,
                fours: live.striker.fours,
                sixes: live.striker.sixes,
                strikeRate: live.striker.sr,
                isStriker: true,
                isNonStriker: false
              };
            }
            if (b.name === live.nonStriker?.name) {
              return {
                ...b,
                runs: live.nonStriker.runs,
                balls: live.nonStriker.balls,
                fours: live.nonStriker.fours,
                sixes: live.nonStriker.sixes,
                strikeRate: live.nonStriker.sr,
                isStriker: false,
                isNonStriker: true
              };
            }
            return { ...b, isStriker: false, isNonStriker: false };
          });

          const updatedBowlers = (currentInnings?.bowlers || []).map(b => {
            if (b.name === live.bowler?.name) {
              return {
                ...b,
                overs: live.bowler.overs,
                runs: live.bowler.runs,
                wickets: live.bowler.wickets,
                economy: live.bowler.econ,
                dots: live.bowler.dots
              };
            }
            return b;
          });

          const updatedScorecard = [...prevMatch.scorecard];
          if (updatedScorecard.length > 0 && currentInnings) {
            updatedScorecard[updatedScorecard.length - 1] = {
              ...currentInnings,
              total: `${live.currentRuns}/${live.currentWickets}`,
              overs: displayOvers,
              runRate: live.ballsBowled > 0 ? (live.currentRuns / (live.ballsBowled / 6)).toFixed(2) : "0.00",
              batters: updatedBatters,
              bowlers: updatedBowlers
            };
          }

          return {
            ...prevMatch,
            team2Score: `${live.currentRuns}/${live.currentWickets}`,
            team2Overs: `(${displayOvers} ov)`,
            resultSummary: live.summary,
            scorecard: updatedScorecard,
            status: live.status === 'COMPLETED' ? 'RECENT' : prevMatch.status,
            liveState: {
              target: live.target,
              currentRuns: live.currentRuns,
              currentWickets: live.currentWickets,
              ballsBowled: live.ballsBowled,
              totalBalls: live.totalBalls,
              partnershipRuns: prevLive?.partnershipRuns || 45,
              partnershipBalls: prevLive?.partnershipBalls || 28,
              fallOfWickets: prevLive?.fallOfWickets || [],
              commentaryHistory: commentaryHistory.length > 0 ? commentaryHistory : (prevLive?.commentaryHistory || []),
              strikerId: prevLive?.strikerId || 'p08',
              nonStrikerId: prevLive?.nonStrikerId || 'p09',
              bowlerId: prevLive?.bowlerId || 'p03'
            }
          };
        });
      } catch (err) {
        // quiet fallback
      }
    };

    fetchLiveState();
    const interval = setInterval(fetchLiveState, 2000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [initialMatch.id, initialMatch.status]);

  const liveState = match.liveState;
  
  // Calculate derived values if it's a live match
  const derivedStats = useMemo(() => {
    if (!liveState || match.status !== 'LIVE' || match.scorecard.length === 0) return null;
    
    const target = liveState.target || 186;
    const currentRuns = liveState.currentRuns || 150;
    const ballsBowled = liveState.ballsBowled || 104;
    const totalBalls = liveState.totalBalls || 120;
    
    const runsRequired = Math.max(0, target - currentRuns);
    const ballsRemaining = Math.max(0, totalBalls - ballsBowled);
    
    const completedOvers = Math.floor(ballsBowled / 6);
    const ballsInCurrentOver = ballsBowled % 6;
    const oversBowled = `${completedOvers}.${ballsInCurrentOver}`;
    
    const crr = ballsBowled > 0 ? (currentRuns / (ballsBowled / 6)).toFixed(2) : "0.00";
    const rrr = ballsRemaining > 0 ? (runsRequired / (ballsRemaining / 6)).toFixed(2) : "0.00";

    // Current over balls: all balls bowled in the current active over
    // If ballsBowled is 104 (17.2 overs), the current over is Over 18 (index 17).
    const commentary = liveState.commentaryHistory || [];
    
    // Determine the active over index:
    // If ballsInCurrentOver === 0 and ballsBowled > 0, an over just completed, so show the 6 balls of that completed over.
    // Otherwise, show the balls bowled so far in the over currently in progress.
    const activeOverIndex = (ballsInCurrentOver === 0 && ballsBowled > 0) ? completedOvers - 1 : completedOvers;
    
    // Sort commentary chronologically for the active over
    const currentOverBalls = commentary
      .filter(c => {
        const [ov] = c.overBall.split('.').map(Number);
        return ov === activeOverIndex;
      })
      .reverse(); // chronological order

    // Last over balls: completed over before the active one
    const lastOverIndex = activeOverIndex - 1;
    const lastOverBalls = lastOverIndex >= 0 
      ? commentary.filter(c => {
          const [ov] = c.overBall.split('.').map(Number);
          return ov === lastOverIndex;
        }).reverse()
      : [];

    const currentOverRuns = currentOverBalls.reduce((sum, b) => sum + b.runs, 0);
    const lastOverRuns = lastOverBalls.reduce((sum, b) => sum + b.runs, 0);

    return {
      target,
      runsRequired,
      ballsRemaining,
      oversBowled,
      crr,
      rrr,
      currentOverNumber: activeOverIndex + 1,
      currentOverBalls,
      currentOverRuns,
      lastOverBalls,
      lastOverRuns,
      isFinished: runsRequired <= 0 || ballsRemaining <= 0 || (liveState.currentWickets || 0) >= 10
    };
  }, [liveState, match.status, match.scorecard.length]);

  const simulateNextBall = useCallback((forcedOutcome?: CommentaryEvent['outcome']) => {
    if (!liveState || match.status !== 'LIVE' || !derivedStats) return null;
    if (derivedStats.isFinished) return null;

    // Simulation outcome options matching supported results
    const simulationPool: { outcome: CommentaryEvent['outcome']; runs: number; isWicket: boolean; desc: string }[] = [
      { outcome: 'DOT BALL', runs: 0, isWicket: false, desc: 'DOT BALL. Good length delivery pitching outside off, defended firmly back to the bowler with no run taken.' },
      { outcome: '1 RUN', runs: 1, isWicket: false, desc: 'Pushed gently into the gap at mid-on, rotates the strike.' },
      { outcome: '2 RUNS', runs: 2, isWicket: false, desc: '2 RUNS. Nicely guided down to deep third man, quick running between the wickets.' },
      { outcome: 'FOUR', runs: 4, isWicket: false, desc: 'FOUR! Leans into an elegant boundary through extra cover with pure timing.' },
      { outcome: 'SIX', runs: 6, isWicket: false, desc: 'SIX! Clean swing of the bat, dispatched high and handsome into the North Stand!' },
      { outcome: 'WICKET', runs: 0, isWicket: true, desc: 'WICKET! Edged and taken! A vital breakthrough under pressure for India!' }
    ];

    // Pick next simulated event or use forcedOutcome if provided
    const chosenEvent = forcedOutcome
      ? (simulationPool.find(e => e.outcome === forcedOutcome) || simulationPool[0])
      : simulationPool[Math.floor(Math.random() * simulationPool.length)];

    setMatch(prevMatch => {
      const prevLive = prevMatch.liveState!;
      const prevScorecard = prevMatch.scorecard;
      const currentInnings = prevScorecard[prevScorecard.length - 1];

      const newBallsBowled = prevLive.ballsBowled + 1;
      const newRuns = prevLive.currentRuns + chosenEvent.runs;
      const newWickets = prevLive.currentWickets + (chosenEvent.isWicket ? 1 : 0);

      const completedOvers = Math.floor((newBallsBowled - 1) / 6);
      const ballInOver = ((newBallsBowled - 1) % 6) + 1;
      const overBallString = `${completedOvers}.${ballInOver}`;

      const activeBatter = currentInnings.batters.find(b => b.isStriker) || currentInnings.batters[0];
      const nonStriker = currentInnings.batters.find(b => b.isNonStriker) || currentInnings.batters[1];
      const activeBowler = currentInnings.bowlers.find(b => b.isActive) || currentInnings.bowlers[0];

      // New Commentary Event
      const newCommentaryEvent: CommentaryEvent = {
        overBall: overBallString,
        runs: chosenEvent.runs,
        outcome: chosenEvent.outcome,
        batter: activeBatter.name,
        bowler: activeBowler.name,
        description: chosenEvent.desc,
        isWicket: chosenEvent.isWicket,
        wicketType: chosenEvent.isWicket ? `c Player 05 b ${activeBowler.name}` : undefined,
        wicketPlayer: chosenEvent.isWicket ? activeBatter.name : undefined
      };

      const newCommentaryHistory = [newCommentaryEvent, ...(prevLive.commentaryHistory || [])];

      // Strike rotation logic:
      // Singles/triples rotate strike.
      // At the end of over (ball 6), strike rotates again.
      let switchStriker = (chosenEvent.runs % 2 === 1);
      if (ballInOver === 6) {
        switchStriker = !switchStriker;
      }

      // Update Batters
      let newBatters = currentInnings.batters.map(b => {
        if (b.name === activeBatter.name) {
          const updatedRuns = b.runs + chosenEvent.runs;
          const updatedBalls = b.balls + 1;
          const updatedFours = b.fours + (chosenEvent.runs === 4 ? 1 : 0);
          const updatedSixes = b.sixes + (chosenEvent.runs === 6 ? 1 : 0);
          const updatedSr = updatedBalls > 0 ? ((updatedRuns / updatedBalls) * 100).toFixed(2) : "0.00";
          return {
            ...b,
            runs: updatedRuns,
            balls: updatedBalls,
            fours: updatedFours,
            sixes: updatedSixes,
            strikeRate: updatedSr,
            dismissal: chosenEvent.isWicket ? `c Player 05 b ${activeBowler.name}` : b.dismissal,
            isStriker: chosenEvent.isWicket ? false : !switchStriker,
            isNonStriker: chosenEvent.isWicket ? false : switchStriker
          };
        } else if (b.name === nonStriker.name) {
          return {
            ...b,
            isStriker: switchStriker,
            isNonStriker: !switchStriker
          };
        }
        return b;
      });

      // If wicket fell, bring in a new batter
      if (chosenEvent.isWicket && newWickets < 10) {
        const nextBatterIndex = newBatters.length + 1;
        const newIncomingBatter = {
          name: `Player ${String(nextBatterIndex).padStart(2, '0')}`,
          dismissal: 'not out',
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          strikeRate: '0.00',
          isStriker: true,
          isNonStriker: false
        };
        newBatters = [...newBatters, newIncomingBatter];
      }

      // Update Bowler: explicitly count dots only when outcome === 'DOT BALL'
      const newBowlers = currentInnings.bowlers.map(b => {
        if (b.name === activeBowler.name) {
          const updatedRuns = b.runs + chosenEvent.runs;
          const updatedWickets = b.wickets + (chosenEvent.isWicket ? 1 : 0);
          const prevBalls = Math.floor(parseFloat(b.overs)) * 6 + Math.round((parseFloat(b.overs) % 1) * 10);
          const updatedTotalBalls = prevBalls + 1;
          const updatedOvers = `${Math.floor(updatedTotalBalls / 6)}.${updatedTotalBalls % 6}`;
          const updatedEcon = updatedTotalBalls > 0 ? (updatedRuns / (updatedTotalBalls / 6)).toFixed(2) : "0.00";
          return {
            ...b,
            runs: updatedRuns,
            wickets: updatedWickets,
            overs: updatedOvers,
            economy: updatedEcon,
            dots: b.dots + (chosenEvent.outcome === 'DOT BALL' ? 1 : 0)
          };
        }
        return b;
      });

      const displayOvers = `${Math.floor(newBallsBowled / 6)}.${newBallsBowled % 6}`;

      const updatedInnings: InningsScorecard = {
        ...currentInnings,
        total: `${newRuns}/${newWickets}`,
        overs: displayOvers,
        runRate: (newRuns / (newBallsBowled / 6)).toFixed(2),
        batters: newBatters,
        bowlers: newBowlers
      };

      const updatedScorecard = [...prevScorecard];
      updatedScorecard[updatedScorecard.length - 1] = updatedInnings;

      // Update or create OverSummary in oversData
      const existingOvers = [...(prevMatch.oversData || [])];
      const overIndex = completedOvers; // e.g. 17 for over 18
      const existingOverSummary = existingOvers.find(o => o.overNumber === overIndex + 1);

      const eventSymbol = chosenEvent.isWicket ? 'W' : chosenEvent.runs.toString();

      if (existingOverSummary) {
        existingOverSummary.runs += chosenEvent.runs;
        existingOverSummary.wickets += chosenEvent.isWicket ? 1 : 0;
        existingOverSummary.events.push(eventSymbol);
      } else {
        existingOvers.unshift({
          overNumber: overIndex + 1,
          runs: chosenEvent.runs,
          wickets: chosenEvent.isWicket ? 1 : 0,
          bowler: activeBowler.name,
          events: [eventSymbol]
        });
      }

      const runsReq = Math.max(0, prevLive.target - newRuns);
      const ballsRem = Math.max(0, prevLive.totalBalls - newBallsBowled);
      const resultText = runsReq === 0
        ? `Australia won by ${10 - newWickets} wickets`
        : `Australia need ${runsReq} runs in ${ballsRem} balls to win`;

      return {
        ...prevMatch,
        team2Score: `${newRuns}/${newWickets}`,
        team2Overs: `(${displayOvers} ov)`,
        resultSummary: resultText,
        scorecard: updatedScorecard,
        oversData: existingOvers,
        liveState: {
          ...prevLive,
          currentRuns: newRuns,
          currentWickets: newWickets,
          ballsBowled: newBallsBowled,
          partnershipRuns: chosenEvent.isWicket ? 0 : prevLive.partnershipRuns + chosenEvent.runs,
          partnershipBalls: chosenEvent.isWicket ? 0 : prevLive.partnershipBalls + 1,
          fallOfWickets: chosenEvent.isWicket
            ? [...prevLive.fallOfWickets, { score: newRuns, wicket: newWickets, over: overBallString, player: activeBatter.name }]
            : prevLive.fallOfWickets,
          commentaryHistory: newCommentaryHistory
        }
      };
    });

    return chosenEvent;
  }, [liveState, match.status, derivedStats]);

  return { match, derivedStats, simulateNextBall };
}
