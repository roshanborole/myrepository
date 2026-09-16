import { getSessionUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import CheckoutClient from './CheckoutClient';
import { prisma } from '@/lib/prisma';
import { getMatchById } from '@/lib/centralData';

export default async function CheckoutPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  
  const user = await getSessionUser();
  if (!user) {
    redirect(`/login?redirect=/tickets/${matchId}/checkout`);
  }

  let matchDetails: { team1: string; team2: string; date: Date } | null = null;

  try {
    const dbMatch = await prisma.match.findUnique({
      where: { id: matchId },
      select: { team1: true, team2: true, date: true }
    });
    if (dbMatch) {
      matchDetails = {
        team1: dbMatch.team1,
        team2: dbMatch.team2,
        date: new Date(dbMatch.date)
      };
    }
  } catch {
    // Fallback
  }

  if (!matchDetails) {
    const centralMatch = getMatchById(matchId);
    if (centralMatch) {
      matchDetails = {
        team1: centralMatch.team1.name,
        team2: centralMatch.team2.name,
        date: new Date('2026-10-22T19:30:00')
      };
    } else {
      matchDetails = {
        team1: "India",
        team2: "Australia",
        date: new Date('2026-10-22T19:30:00')
      };
    }
  }

  return (
    <CheckoutClient matchId={matchId} matchDetails={matchDetails} user={user} />
  );
}
