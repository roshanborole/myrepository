import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import MatchTicketsClient from './MatchTicketsClient';
import BackButton from '@/components/BackButton';
import { getAllBookedSeats } from '@/app/actions/tickets';
import { getMatchById } from '@/lib/centralData';

export default async function MatchTicketsPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  
  let matchDetails: { team1: string; team2: string; date: Date } | null = null;

  try {
    const dbMatch = await prisma.match.findUnique({
      where: { id: matchId }
    });
    if (dbMatch) {
      matchDetails = {
        team1: dbMatch.team1,
        team2: dbMatch.team2,
        date: new Date(dbMatch.date)
      };
    }
  } catch {
    // Database fallback
  }

  if (!matchDetails) {
    const centralMatch = getMatchById(matchId);
    if (centralMatch) {
      matchDetails = {
        team1: centralMatch.team1.name,
        team2: centralMatch.team2.name,
        date: new Date('2026-10-22T19:30:00')
      };
    }
  }

  if (!matchDetails) {
    notFound();
  }

  const bookedSeats = await getAllBookedSeats(matchId);

  return (
    <main className="w-full pt-20 pb-4 min-h-[100dvh] flex flex-col bg-background">
      <div className="flex flex-col w-full h-full px-container-padding max-w-7xl mx-auto gap-4">
        {/* Compact Match Details Header */}
        <div className="flex items-center gap-4 bg-surface-container px-4 py-3 rounded-2xl border border-white/5 shrink-0 w-full h-fit">
          <BackButton />
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-on-surface leading-tight">
              {matchDetails.team1} vs {matchDetails.team2}
            </h2>
            <p className="text-sm text-on-surface-variant leading-tight mt-1">
              {matchDetails.date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })} • {matchDetails.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} IST | RoshSpark Cricket Stadium
            </p>
          </div>
        </div>

        {/* Stadium Map taking remaining space */}
        <div className="flex-1 min-h-0 w-full mb-4">
          <MatchTicketsClient matchId={matchId} matchDetails={matchDetails} bookedSeats={bookedSeats} />
        </div>
      </div>
    </main>
  );
}
