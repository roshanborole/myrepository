import { redirect } from 'next/navigation';

export default function ProfileTicketsPage() {
  redirect('/profile?tab=tickets');
}
