import { PrismaClient, MatchFormat, MatchType, PlayerRole, DeliveryMethod } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create some players
  const player1 = await prisma.player.create({
    data: {
      name: "Virat Kohli",
      age: 35,
      nationality: "India",
      team: "RoshSpark XI",
      role: PlayerRole.BATSMAN,
      battingStyle: "Right-hand bat",
      jerseyNumber: 18,
      playerStats: {
        create: {
          matchesPlayed: 45,
          runs: 2450,
          highestScore: 113,
          battingAvg: 54.4,
          strikeRate: 135.6,
          fifties: 15,
          hundreds: 4,
          fours: 210,
          sixes: 45
        }
      }
    }
  })

  // Create matches
  const matches = [
    {
      id: "match-ind-aus-live",
      team1: "India",
      team2: "Australia",
      date: new Date(Date.now() + 86400000 * 3),
      format: MatchFormat.T20I,
      type: MatchType.ICC_MENS,
      status: "LIVE" as const,
      liveScore: "184/3 (17.4 ov)",
      overs: "17.4"
    },
    {
      id: "match-ind-aus-up",
      team1: "India",
      team2: "Australia",
      date: new Date("2026-10-22T19:30:00Z"),
      format: MatchFormat.T20I,
      type: MatchType.ICC_MENS,
      status: "UPCOMING" as const,
    },
    {
      id: "match-pl-clash",
      team1: "Northern Titans",
      team2: "Eastern Royals",
      date: new Date("2026-10-25T19:00:00Z"),
      format: MatchFormat.T20,
      type: MatchType.RPL_MENS,
      status: "UPCOMING" as const,
    },
    {
      id: "match-dom-test",
      team1: "West Zone",
      team2: "North Zone",
      date: new Date("2026-10-28T09:30:00Z"),
      format: MatchFormat.TEST,
      type: MatchType.DOMESTIC_MENS,
      status: "UPCOMING" as const,
    },
    {
      id: "match-w-t20l",
      team1: "RoshSpark Valkyries",
      team2: "Southern Sparks",
      date: new Date("2026-11-01T15:30:00Z"),
      format: MatchFormat.T20,
      type: MatchType.DOMESTIC_WOMENS,
      status: "UPCOMING" as const,
    }
  ];

  for (const m of matches) {
    await prisma.match.upsert({
      where: { id: m.id },
      update: m,
      create: m
    });
  }

  // Create news
  await prisma.news.create({
    data: {
      title: "RoshSpark Stadium Selected for RPL Final",
      summary: "The grand finale of the RoshSpark Premier League will be hosted here next month.",
      content: "The grand finale of the RoshSpark Premier League will be hosted here next month. Fans can expect an immersive experience with 3D stadium tours and seat-delivery food options.",
      category: "Stadium",
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
