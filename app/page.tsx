import { CatalogService } from '@/services/catalog.service';
import { PlatformSettingRepository } from '@/repositories/platform-setting.repository';
import { MainContainer } from '@/components/MainContainer';
import { Role } from '@prisma/client';

export default async function Home() {
  // Ensure settings are initialized
  await PlatformSettingRepository.ensureInitialized();
  
  const { products, categories, partners } = await CatalogService.getCatalog();
  const settings = await PlatformSettingRepository.getSettings();
  
  // Mock current user for testing (In real app, this would come from Auth)
  const currentUser = {
    name: 'Ana Oliveira',
    username: 'cliente1',
    role: 'CLIENT' as any,
  };

  return (
    <MainContainer 
      initialData={{
        products,
        categories,
        partners,
        settings
      }}
      currentUser={currentUser}
    />
  );
}
