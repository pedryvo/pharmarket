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
    const user = await AuthService.login(email, pass);
    if (!user) {
      throw new Error('Email ou senha incorretos');
    }
    
    if (user.role === 'PHARMA') redirect('/pharmacist');
    if (user.role === 'ADMIN') redirect('/admin');
    redirect('/');
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
