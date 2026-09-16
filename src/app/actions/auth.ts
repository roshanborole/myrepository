'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
import { logUserActivity } from '@/lib/activityLogger';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    let isNewAccount = false;
    if (!user) {
      // Auto-signup for demonstration purposes
      user = await prisma.user.create({
        data: {
          email,
          password, // In a real app, hash this!
          name: email.split('@')[0],
          role: Role.USER,
        },
      });
      isNewAccount = true;
      logUserActivity('Account created', `New fan account created for ${email}`, {
        userId: user.id,
        userName: user.name || email.split('@')[0]
      });
    } else {
      if (user.password !== password) {
        return { error: 'Invalid credentials' };
      }
    }

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session_userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    // Track Login
    logUserActivity('Login', `User ${user.email} signed into platform`, {
      userId: user.id,
      userName: user.name || user.email.split('@')[0]
    });

    return { success: true, user: { id: user.id, email: user.email, name: user.name } };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An error occurred during authentication' };
  }
}

export async function logout() {
  const session = await getSessionUser();
  if (session) {
    logUserActivity('Logout', `User ${session.email} logged out`, {
      userId: session.id,
      userName: session.name || session.email.split('@')[0]
    });
  }
  const cookieStore = await cookies();
  cookieStore.delete('session_userId');
  return { success: true };
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_userId')?.value;

  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });
    return user;
  } catch {
    return null;
  }
}
