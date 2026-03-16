import { AuthService } from '@/services/auth.service';
import { LoginForm } from '@/components/auth/LoginForm';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await AuthService.getSession();
  if (session) {
    if (session.role === 'CLIENT') redirect('/');
    if (session.role === 'PHARMA') redirect('/pharmacist');
    if (session.role === 'ADMIN') redirect('/admin');
    redirect('/');
  }

  async function handleLogin(email: string, pass: string) {
    "use server";
    try {
      const user = await AuthService.login(email, pass);
      if (!user) {
        return { success: false, error: 'Email ou senha incorretos' };
      }
      
      // Redirect after successful login
      if (user.role === 'PHARMA') redirect('/pharmacist');
      if (user.role === 'ADMIN') redirect('/admin');
      redirect('/');
      return { success: true };
    } catch (e: any) {
      if (e.message === 'NEXT_REDIRECT') throw e; // Let Next.js handle redirects
      return { success: false, error: e.message || 'Erro ao realizar login' };
    }
  }

  return (
    <main className="min-h-screen bg-vitalab-bg flex items-center justify-center p-4">
      {/* Background patterns similar to the static HTML */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-vitalab-green rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-vitalab-orange rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm onLogin={handleLogin} />
      </div>
    </main>
  );
}
