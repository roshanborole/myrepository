import { PrismaClient, MatchFormat, MatchType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.match.createMany({
    data: [
      {
        team1: "RoshSpark Titans",
        team2: "Delhi Capitals",
        date: new Date(Date.now() + 86400000 * 5),
        format: MatchFormat.T20,
        type: MatchType.RPL_MENS,
        status: "UPCOMING",
      },
      {
        team1: "India",
        team2: "England",
        date: new Date(Date.now() + 86400000 * 12),
        format: MatchFormat.ODI,
        type: MatchType.ICC_MENS,
        status: "UPCOMING",
      },
      {
        team1: "RoshSpark Women",
        team2: "Mumbai Women",
        date: new Date(Date.now() + 86400000 * 15),
        format: MatchFormat.T20,
        type: MatchType.DOMESTIC_WOMENS,
        status: "UPCOMING",
      }
    ]
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
