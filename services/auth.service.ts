import { UserRepository } from '@/repositories/user.repository';
import { Role } from '@prisma/client';

export class AuthService {
  static async validateUser(username: string, password: string) {
    const user = await UserRepository.findByUsername(username);
    if (user && user.password === password) {
      // In a real app, don't return the password
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  static async register(data: { username: string; password: string; name: string; phone: string }) {
    const existing = await UserRepository.findByUsername(data.username);
    if (existing) throw new Error('Username already exists');
    
    return UserRepository.create({
      ...data,
      role: Role.CLIENT
    });
  }
}
