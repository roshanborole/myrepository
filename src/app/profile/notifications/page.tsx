import { redirect } from 'next/navigation';

export default function ProfileNotificationsPage() {
  redirect('/profile?tab=notifications');
}
