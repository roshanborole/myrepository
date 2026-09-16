import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/app/actions/auth';
import { adminEngine } from '@/lib/adminStore';

export async function GET() {
  try {
    const session = await getSessionUser();
    const userEmail = session?.email || 'roshan@roshspark.com';
    const userName = session?.name || 'Roshan';

    // 1. Get canonical bookings from adminEngine
    const engineBookings = adminEngine.getUserBookings(userEmail);

    // 2. Query Prisma for any additional database tickets
    let dbTickets: any[] = [];
    try {
      if (session?.id) {
        dbTickets = await prisma.ticket.findMany({
          where: { userId: session.id },
          include: { match: true },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch {
      // safe fallback
    }

    // Combine and build unified ticket items
    const ticketsMap = new Map<string, any>();

    // Seed from adminEngine bookings
    engineBookings.forEach((b) => {
      const seatsArr = b.seats.split(',').map((s) => s.trim());
      seatsArr.forEach((seatStr, idx) => {
        const ticketId = `${b.bookingId}-T${idx + 1}`;
        const isPast = b.match.toLowerCase().includes('completed') || b.status === 'Completed';
        const verifyToken = `CRICK-${Buffer.from(`${b.bookingId}-${seatStr}-${b.stand}`).toString('base64').substring(0, 10).toUpperCase()}`;

        ticketsMap.set(ticketId, {
          id: ticketId,
          bookingId: b.bookingId,
          match: b.match,
          date: b.date,
          time: '7:30 PM IST',
          stand: b.stand,
          block: b.block,
          seat: seatStr,
          gate: b.stand.includes('VIP') ? 'Gate 1' : b.stand.includes('Premium') ? 'Gate 2' : 'Gate 3',
          price: Math.round(b.amount / (seatsArr.length || 1)),
          isUpcoming: !isPast,
          status: isPast ? 'Completed' : 'Confirmed',
          verificationToken: verifyToken,
          qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
            JSON.stringify({
              bId: b.bookingId,
              tId: ticketId,
              match: b.match,
              stand: b.stand,
              seat: seatStr,
              gate: b.stand.includes('VIP') ? 'Gate 1' : 'Gate 3',
              token: verifyToken,
            })
          )}&bgcolor=ffffff&color=000000`,
        });
      });
    });

    // Add any tickets from database that aren't in map
    dbTickets.forEach((t) => {
      const bId = t.qrCode || `RCS-${t.id.substring(0, 6).toUpperCase()}`;
      const ticketId = t.id;
      if (!ticketsMap.has(ticketId)) {
        const isPast = t.match?.status === 'COMPLETED' || t.status === 'USED';
        const verifyToken = `CRICK-${Buffer.from(`${bId}-${t.seat}-${t.stand}`).toString('base64').substring(0, 10).toUpperCase()}`;

        ticketsMap.set(ticketId, {
          id: ticketId,
          bookingId: bId,
          match: t.match ? `${t.match.team1} vs ${t.match.team2}` : 'India vs Australia',
          date: t.match ? new Date(t.match.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '22 Oct 2026',
          time: '7:30 PM IST',
          stand: t.stand,
          block: t.block || 'Block A',
          seat: t.seat,
          gate: t.entryGate || 'Gate 3',
          price: t.price,
          isUpcoming: !isPast,
          status: isPast ? 'Completed' : 'Confirmed',
          verificationToken: verifyToken,
          qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
            JSON.stringify({
              bId,
              tId: ticketId,
              match: t.match ? `${t.match.team1} vs ${t.match.team2}` : 'India vs Australia',
              stand: t.stand,
              seat: t.seat,
              token: verifyToken,
            })
          )}&bgcolor=ffffff&color=000000`,
        });
      }
    });

    // If still empty, provide the canonical default tickets
    if (ticketsMap.size === 0) {
      const defaultB = adminEngine.getBookings()[0];
      if (defaultB) {
        ticketsMap.set('tkt-default', {
          id: 'tkt-01',
          bookingId: defaultB.bookingId,
          match: defaultB.match,
          date: defaultB.date,
          time: '7:30 PM IST',
          stand: defaultB.stand,
          block: defaultB.block,
          seat: defaultB.seats,
          gate: 'Gate 3',
          price: defaultB.amount,
          isUpcoming: true,
          status: 'Confirmed',
          verificationToken: 'CRICK-RCS892411-V1',
          qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=RCS-892411&bgcolor=ffffff&color=000000`,
        });
      }
    }

    const ticketsList = Array.from(ticketsMap.values());

    // 3. User Bookings
    const bookingsList = engineBookings.map((b) => ({
      id: b.id,
      bookingId: b.bookingId,
      match: b.match,
      date: b.date,
      ticketsCount: b.ticketsCount,
      amount: b.amount,
      status: b.status,
      paymentMethod: 'UPI • Verified Instant',
      stand: b.stand,
      block: b.block,
      seats: b.seats,
    }));

    // 4. Notifications
    const adminNotifs = adminEngine.getNotifications();
    const notificationsList = adminNotifs.map((n) => ({
      id: n.id,
      type: n.type?.toLowerCase().includes('match') ? 'reminder' : n.type?.toLowerCase().includes('ticket') ? 'ticket' : 'stadium',
      title: n.title,
      message: n.message,
      time: n.timestamp,
      read: false,
    }));

    return NextResponse.json({
      success: true,
      profile: {
        id: session?.id || 'usr-roshan',
        name: userName,
        email: userEmail,
        mobile: '+91 98765 43210',
        photo: '/logo_3d.jpg',
      },
      tickets: ticketsList,
      bookings: bookingsList,
      notifications: notificationsList,
    });
  } catch (error) {
    console.error('Error in user dashboard API:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
