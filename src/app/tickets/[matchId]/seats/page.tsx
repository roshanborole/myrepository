import { prisma } from '@/lib/prisma';
import { getBookedSeats } from '@/app/actions/tickets';
import { getMatchById } from '@/lib/centralData';
import SeatLayout from './SeatLayout';

type Props = {
  params: Promise<{ matchId: string }>;
  searchParams: Promise<{ stand?: string }>;
};

export default async function SeatsPage({ params, searchParams }: Props) {
  const { matchId } = await params;
  const resolvedSearchParams = await searchParams;
  const stand = resolvedSearchParams.stand || 'North Stand';

  let matchDetails: { team1: string; team2: string; date: Date } | null = null;
  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: { team1: true, team2: true, date: true }
    });
    if (match) {
      matchDetails = {
        team1: match.team1,
        team2: match.team2,
        date: new Date(match.date)
      };
    }
  } catch {}

  if (!matchDetails) {
    const central = getMatchById(matchId);
    if (central) {
      matchDetails = {
        team1: central.team1.name,
        team2: central.team2.name,
        date: new Date('2026-10-22T19:30:00')
      };
    } else {
      matchDetails = {
        team1: 'India',
        team2: 'Australia',
        date: new Date('2026-10-22T19:30:00')
      };
    }
  }

  const bookedSeats = await getBookedSeats(matchId, stand);

  return (
    <SeatLayout 
      matchId={matchId} 
      matchDetails={matchDetails} 
      stand={stand} 
      bookedSeats={bookedSeats} 
    />
  );
}
