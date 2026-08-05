'use server';

import { getSession } from '@/lib/session';

export async function loginAction(formData: FormData) {
  const username = (formData.get('username') as string || '').trim();
  const password = (formData.get('password') as string || '').trim();

  const validUsername = (process.env.ADMIN_USER || 'admin').trim();
  const validPassword = (process.env.ADMIN_PASS || 'password123').trim();

  if (username === validUsername && password === validPassword) {
    const session = await getSession();
    session.isLoggedIn = true;
    session.username = username;
    await session.save();
    return { success: true };
  }

  return { error: 'Invalid credentials' };
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  return { success: true };
}
