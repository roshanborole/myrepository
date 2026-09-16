'use server';

import { prisma } from '@/lib/prisma';
import { getSessionUser } from './auth';
import { getMatchById } from '@/lib/centralData';
import { MatchFormat, MatchType, MatchStatus } from '@prisma/client';
import { adminEngine } from '@/lib/adminStore';
import { logUserActivity } from '@/lib/activityLogger';
import { realtimeHub } from '@/lib/realtimeHub';

async function ensureMatchInDb(matchId: string) {
  try {
    const existing = await prisma.match.findUnique({
      where: { id: matchId },
      select: { id: true }
    });
    if (existing) return existing;

    const central = getMatchById(matchId);
    if (central) {
      let format: MatchFormat = MatchFormat.T20;
      if (central.format === 'TEST') format = MatchFormat.TEST;
      else if (central.format === 'ODI') format = MatchFormat.ODI;
      else if (central.format === 'T20') format = central.category === 'ICC' ? MatchFormat.T20I : MatchFormat.T20;

      let type: MatchType = MatchType.ICC_MENS;
      if (central.category === 'ICC') type = MatchType.ICC_MENS;
      else if (central.category === 'RPL' || central.category === 'PREMIER LEAGUE') type = MatchType.RPL_MENS;
      else if (central.category === 'WOMENS') type = MatchType.ICC_WOMENS;
      else if (central.category === 'T20 LEAGUE') type = MatchType.DOMESTIC_WOMENS;
      else type = MatchType.DOMESTIC_MENS;

      let status: MatchStatus = MatchStatus.UPCOMING;
      if (central.status === 'LIVE') status = MatchStatus.LIVE;
      else if (central.status === 'RECENT') status = MatchStatus.COMPLETED;

      let matchDate = new Date();
      if (central.datetime?.includes('Oct')) {
        matchDate = new Date('2026-10-22T19:30:00Z');
      } else if (central.datetime?.includes('Nov')) {
        matchDate = new Date('2026-11-01T15:30:00Z');
      }

      return await prisma.match.upsert({
        where: { id: matchId },
        update: {},
        create: {
          id: matchId,
          team1: central.team1.name,
          team1Logo: central.team1.logoUrl || null,
          team2: central.team2.name,
          team2Logo: central.team2.logoUrl || null,
          date: matchDate,
          format,
          type,
          status,
          liveScore: central.team1Score || (central.liveState ? `${central.liveState.currentRuns}/${central.liveState.currentWickets}` : null),
        }
      });
    }

    // Generic fallback if unknown matchId
    return await prisma.match.upsert({
      where: { id: matchId },
      update: {},
      create: {
        id: matchId,
        team1: 'India',
        team2: 'Australia',
        date: new Date(),
        format: MatchFormat.T20I,
        type: MatchType.ICC_MENS,
        status: MatchStatus.UPCOMING
      }
    });
  } catch (e) {
    console.error('Error ensuring match in DB:', e);
  }
}

export async function getBookedSeats(matchId: string, stand: string) {
  try {
    await ensureMatchInDb(matchId);
    const tickets = await prisma.ticket.findMany({
      where: {
        matchId,
        stand,
        status: { in: ['BOOKED', 'PENDING'] },
      },
      select: {
        block: true,
        seat: true,
      }
    });

    return tickets.map(t => `${t.block}-${t.seat}`);
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    return [];
  }
}

export async function getAllBookedSeats(matchId: string) {
  try {
    await ensureMatchInDb(matchId);
    const tickets = await prisma.ticket.findMany({
      where: {
        matchId,
        status: { in: ['BOOKED', 'PENDING'] },
      },
      select: {
        stand: true,
        block: true,
        seat: true,
      }
    });

    return tickets.map(t => `${t.stand}-${t.block}-${t.seat}`);
  } catch (error) {
    console.error('Error fetching all booked seats:', error);
    return [];
  }
}

export async function lockSeatsForPayment(
  matchId: string,
  seats: Array<{ stand: string; block: string; row: string; seat: string; price: number }>
) {
  const user = await getSessionUser();
  if (!user) {
    return { error: 'Unauthorized. Please login to continue.' };
  }

  if (!seats || seats.length === 0) {
    return { error: 'No seats selected.' };
  }

  try {
    await ensureMatchInDb(matchId);

    const existingTickets = await prisma.ticket.findMany({
      where: {
        matchId,
        status: { in: ['BOOKED', 'PENDING'] },
        OR: seats.map(s => ({
          stand: s.stand,
          block: s.block,
          seat: `${s.row}-${s.seat}`
        }))
      }
    });

    if (existingTickets.length > 0) {
      // Allow if the current user is the one who holds the PENDING tickets
      const othersHolding = existingTickets.some(t => t.userId !== user.id || t.status === 'BOOKED');
      if (othersHolding) {
        return { error: 'One or more selected seats are no longer available.' };
      }
    }

    // Clean up current user's existing pending tickets for these seats
    await prisma.ticket.deleteMany({
      where: {
        matchId,
        userId: user.id,
        status: 'PENDING',
        OR: seats.map(s => ({
          stand: s.stand,
          block: s.block,
          seat: `${s.row}-${s.seat}`
        }))
      }
    });

    // Create PENDING tickets
    const pendingTickets = await prisma.$transaction(
      seats.map(seatData => 
        prisma.ticket.create({
          data: {
            userId: user.id,
            matchId,
            stand: seatData.stand,
            block: seatData.block,
            seat: `${seatData.row}-${seatData.seat}`,
            price: seatData.price,
            status: 'PENDING',
          }
        })
      )
    );

    // Log seat selection activity & broadcast seat hold
    try {
      logUserActivity('Seat selected', `Selected ${seats.length} seat(s) in ${seats[0].stand}`, {
        userId: user.id,
        userName: user.name || user.email.split('@')[0],
        metadata: { matchId, count: seats.length, stand: seats[0].stand }
      });
      realtimeHub.publish('SEAT_HOLD_CHANGED', { matchId, seats, userId: user.id });
    } catch {}

    return { success: true, tickets: pendingTickets };
  } catch (error) {
    console.error('Locking error:', error);
    return { error: 'An error occurred while reserving seats.' };
  }
}

export async function confirmBooking(
  matchId: string,
  seats: Array<{ stand: string; block: string; row: string; seat: string }>
) {
  const user = await getSessionUser();
  if (!user) {
    return { error: 'Unauthorized. Please login to continue.' };
  }

  if (!seats || seats.length === 0) {
    return { error: 'No seats selected.' };
  }

  try {
    await ensureMatchInDb(matchId);

    // Generate a canonical booking ID
    const bookingId = `RCS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const getPrice = (standName: string) => {
      if (standName.includes('VIP')) return 5000;
      if (standName.includes('Premium')) return 3000;
      if (standName.includes('North')) return 1800;
      if (standName.includes('South')) return 1500;
      if (standName.includes('East')) return 1200;
      if (standName.includes('West')) return 1000;
      return 800;
    };

    // Process each seat
    for (const seatData of seats) {
      const seatKey = `${seatData.row}-${seatData.seat}`;
      const existing = await prisma.ticket.findFirst({
        where: {
          matchId,
          stand: seatData.stand,
          block: seatData.block,
          seat: seatKey,
        }
      });

      if (existing) {
        if (existing.status === 'BOOKED' && existing.userId !== user.id) {
          return { error: `Seat in ${seatData.stand} (${seatData.block}-${seatKey}) is already booked by another user.` };
        }
        await prisma.ticket.update({
          where: { id: existing.id },
          data: {
            userId: user.id,
            status: 'BOOKED',
            qrCode: bookingId,
            entryGate: getGateForStand(seatData.stand),
          }
        });
      } else {
        await prisma.ticket.create({
          data: {
            userId: user.id,
            matchId,
            stand: seatData.stand,
            block: seatData.block,
            seat: seatKey,
            price: getPrice(seatData.stand),
            status: 'BOOKED',
            qrCode: bookingId,
            entryGate: getGateForStand(seatData.stand),
          }
        });
      }
    }

    // AUTOMATIC SYNCHRONIZATION WITH ADMIN PORTAL (Section 57, 79)
    const standName = seats[0].stand;
    const blockName = seats[0].block;
    const seatsList = seats.map(s => `${s.row}-${s.seat}`).join(', ');
    const totalAmount = seats.reduce((acc, s) => acc + getPrice(s.stand), 0);

    const centralMatch = getMatchById(matchId);
    const matchTitle = centralMatch ? `${centralMatch.team1.name} vs ${centralMatch.team2.name}` : 'India vs Australia';
    const userName = user.name || user.email.split('@')[0];

    // 1. Sync booking into Admin Engine
    adminEngine.addBooking({
      id: `bk-${Date.now()}`,
      bookingId,
      user: userName,
      userName,
      userEmail: user.email,
      match: matchTitle,
      matchName: matchTitle,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      ticketsCount: seats.length,
      stand: standName,
      standName,
      block: blockName,
      seats: seatsList,
      amount: totalAmount,
      totalAmount,
      status: 'Confirmed',
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${bookingId}&bgcolor=ffffff&color=000000`,
    });

    // 2. Generate Notification for User & Broadcast
    adminEngine.broadcastNotification({
      title: 'Ticket Booking Confirmed',
      message: `Your booking #${bookingId} for ${matchTitle} has been confirmed. Stand: ${standName}, Seats: ${seatsList}. Allocated turnstile at ${getGateForStand(standName)}.`,
      audience: 'Ticket Holders Only',
      category: 'TICKET_OFFER',
    });

    // 3. Log user activity events (Section 56)
    logUserActivity('Booking submitted', `Submitted booking for ${seats.length} seat(s) in ${standName}`, {
      userId: user.id,
      userName,
      metadata: { bookingId, stand: standName, count: seats.length }
    });
    logUserActivity('Payment successful', `Payment of ₹${totalAmount.toLocaleString()} confirmed for booking #${bookingId}`, {
      userId: user.id,
      userName,
      metadata: { bookingId, amount: totalAmount }
    });
    logUserActivity('Ticket generated', `Digital barcode and QR generated for booking #${bookingId}`, {
      userId: user.id,
      userName,
      metadata: { bookingId, seat: seatsList, gate: getGateForStand(standName) }
    });

    return { success: true, bookingId };
  } catch (error) {
    console.error('Confirm error:', error);
    return { error: 'An error occurred while confirming booking.' };
  }
}

function getGateForStand(stand: string) {
  switch (stand) {
    case 'VIP Pavilion': return 'Gate 1';
    case 'Premium Stand': return 'Gate 2';
    case 'North Stand': return 'Gate 3';
    case 'South Stand': return 'Gate 4';
    case 'East Stand': return 'Gate 5';
    case 'West Stand': return 'Gate 6';
    default: return 'Gate 3';
  }
}

