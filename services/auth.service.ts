import { UserRepository } from '@/repositories/user.repository';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'vitalab-secret-key-2024');

export class AuthService {
  static async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const token = await new SignJWT({ 
      id: user.id, 
      email: user.email, 
      role: user.role,
      name: user.name 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(SECRET);

    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return { id: user.id, email: user.email, role: user.role, name: user.name };
  }

  static async logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
  }

  static async getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return null;

    try {
      const { payload } = await jwtVerify(token, SECRET);
      return payload as any;
    } catch (e) {
      return null;
    }
  }
}
