import "dotenv/config"
import { PrismaClient, Role } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter: adapter as any })

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const pharmaPassword = await bcrypt.hash('pharma123', 10)
  const clientPassword = await bcrypt.hash('client123', 10)

  // 0. Users
  console.log('Seeding users...')
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: { password: adminPassword },
    create: {
      email: 'admin@admin.com',
      password: adminPassword,
      name: 'Administrador Vitalab',
      role: Role.ADMIN
    }
  })

  const pharmaUser = await prisma.user.upsert({
    where: { email: 'farmaceutico1@vitalab.com' },
    update: { password: pharmaPassword },
    create: {
      email: 'farmaceutico1@vitalab.com',
      password: pharmaPassword,
      name: 'Dr. Lucas Ferreira',
      role: Role.PHARMA,
      phone: '77999110099'
    }
  })

  const pharmaUser2 = await prisma.user.upsert({
    where: { email: 'contato@natureza.com' },
    update: { password: pharmaPassword },
    create: {
      email: 'contato@natureza.com',
      password: pharmaPassword,
      name: 'Dra. Beatriz Santos',
      role: Role.PHARMA,
      phone: '71988887766'
    }
  })

  await prisma.user.upsert({
    where: { email: 'cliente1@gmail.com' },
    update: { password: clientPassword },
    create: {
      email: 'cliente1@gmail.com',
      password: clientPassword,
      name: 'Ana Oliveira',
      role: Role.CLIENT
    }
  })

  // 1. Categories
  console.log('Seeding categories...')
  const categories = [
    {id:'vitamina',     label:'Vitaminas',     ico:'💊', bg:'rgba(45,134,83,.12)',  color:'#1f6340'},
    {id:'fitoterapico', label:'Fitoterápicos', ico:'🌿', bg:'rgba(34,150,90,.1)',   color:'#1a6635'},
    {id:'mineral',      label:'Minerais',      ico:'⚡', bg:'rgba(242,112,33,.12)', color:'#92400e'},
    {id:'aminoacido',   label:'Aminoácidos',   ico:'🔬', bg:'rgba(74,108,247,.12)', color:'#3730a3'},
    {id:'probiotico',   label:'Probióticos',   ico:'🦠', bg:'rgba(150,60,190,.1)',  color:'#5b21b6'},
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    })
  }

  // 2. Partners
  console.log('Seeding partners...')
  const partner1 = await prisma.partner.create({
    data: {
      name: 'Farmácia Central',
      city: 'Vitória da Conquista, BA',
      wa: '77999110099',
      rt: 'Dr. Lucas Ferreira, CRF-BA 9876',
      pharmacistEmail: pharmaUser.email,
      specs: ['Vitaminas', 'Fitoterápicos', 'Minerais'],
    }
  })

  const partner2 = await prisma.partner.create({
    data: {
      name: 'Farmácia Natureza',
      city: 'Salvador, BA',
      wa: '71988887766',
      rt: 'Dra. Beatriz Santos, CRF-BA 5432',
      pharmacistEmail: pharmaUser2.email,
      specs: ['Fitoterápicos', 'Bem-estar'],
    }
  })

  // 3. Products (Ativos)
  console.log('Seeding products...')
  const products = [
    // Partner 1
    {name:'Vitamina C',          categoryId:'vitamina',     unit:'mg',  ico:'🍊', desc:'Ácido Ascórbico. Antioxidante e suporte imunológico.',                  cpg:0.04,  doses:[250,500,1000,2000],   active:true, partnerId: partner1.id},
    {name:'Vitamina D3',          categoryId:'vitamina',     unit:'UI',  ico:'☀️', desc:'Colecalciferol. Saúde óssea e função imunológica.',                    cpg:2.80,  doses:[1000,2000,5000,10000], active:true, partnerId: partner1.id},
    {name:'Magnesio Quelato',     categoryId:'mineral',      unit:'mg',  ico:'⚡', desc:'Bisglicinato de magnésio. Alta absorção.',                             cpg:0.22,  doses:[150,300,400,500],       active:true, partnerId: partner1.id},
    
    // Partner 2
    {name:'Vitamina B12',         categoryId:'vitamina',     unit:'mcg', ico:'💉', desc:'Cianocobalamina. Energia e função neurológica.',                       cpg:180.0, doses:[500,1000,2000,5000],   active:true, partnerId: partner2.id},
    {name:'Ashwagandha KSM-66',   categoryId:'fitoterapico', unit:'mg',  ico:'🌾', desc:'Withania somnifera. Extrato padronizado de alta concentração.',         cpg:0.65,  doses:[300,500,600,900],       active:true, partnerId: partner2.id},
    {name:'Ginkgo Biloba',        categoryId:'fitoterapico', unit:'mg',  ico:'🍃', desc:'Extrato padronizado para circulação periférica.',                      cpg:0.48,  doses:[40,80,120],            active:true, partnerId: partner2.id},
  ]

  for (const prod of products) {
    await prisma.product.create({
      data: prod
    })
  }

  // 4. Default Settings
  console.log('Seeding settings...')
  await prisma.platformSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 }
  })

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error('Seed error occurred:')
    console.dir(e, { depth: null })
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
