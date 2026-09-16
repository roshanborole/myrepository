import { redirect } from 'next/navigation';

export default function ProfileBookingsPage() {
  redirect('/profile?tab=bookings');
}
