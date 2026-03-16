import { CatalogService } from '@/services/catalog.service';
import { PlatformSettingRepository } from '@/repositories/platform-setting.repository';
import { MainContainer } from '@/components/MainContainer';
import { AuthService } from '@/services/auth.service';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await AuthService.getSession();
  if (!session) redirect('/login');

  if (session.role === 'PHARMA') redirect('/pharmacist');
  if (session.role === 'ADMIN') redirect('/admin');

  // Ensure settings are initialized
  await PlatformSettingRepository.ensureInitialized();
  
  const { products, categories, partners } = await CatalogService.getCatalog();
  const settings = await PlatformSettingRepository.getSettings();
  
  return (
    <MainContainer 
      initialData={{
        products,
        categories,
        partners,
        settings
      }}
      currentUser={session}
    />
  );
}
