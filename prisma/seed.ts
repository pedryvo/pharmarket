import "dotenv/config"
import { PrismaClient, Role } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Categories
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

  // 2. Products (Ativos)
  const products = [
    {name:'Vitamina C',          categoryId:'vitamina',     unit:'mg',  ico:'🍊', desc:'Ácido Ascórbico. Antioxidante e suporte imunológico.',                  cpg:0.04,  doses:[250,500,1000,2000],   active:true},
    {name:'Vitamina D3',          categoryId:'vitamina',     unit:'UI',  ico:'☀️', desc:'Colecalciferol. Saúde óssea e função imunológica.',                    cpg:2.80,  doses:[1000,2000,5000,10000], active:true},
    {name:'Vitamina B12',         categoryId:'vitamina',     unit:'mcg', ico:'💉', desc:'Cianocobalamina. Energia e função neurológica.',                       cpg:180.0, doses:[500,1000,2000,5000],   active:true},
    {name:'Ashwagandha KSM-66',   categoryId:'fitoterapico', unit:'mg',  ico:'🌾', desc:'Withania somnifera. Extrato padronizado de alta concentração.',         cpg:0.65,  doses:[300,500,600,900],       active:true},
    {name:'Magnesio Quelato',     categoryId:'mineral',      unit:'mg',  ico:'⚡', desc:'Bisglicinato de magnésio. Alta absorção.',                             cpg:0.22,  doses:[150,300,400,500],       active:true},
  ]

  for (const prod of products) {
    await prisma.product.create({
      data: prod
    })
  }

  // 3. User & Partner
  const pharmacist = await prisma.user.upsert({
    where: { username: 'farmaceutico' },
    update: {},
    create: {
      username: 'farmaceutico',
      password: 'admin',
      name: 'Dra. Carla Figueiredo',
      role: Role.PHARMA,
      phone: '77999110099'
    }
  })

  await prisma.partner.create({
    data: {
      name: 'Farmácia Central',
      city: 'Vitória da Conquista, BA',
      wa: '77999110099',
      rt: 'Dra. Carla Figueiredo, CRF-BA 9876',
      pharmacistUsername: pharmacist.username,
      specs: ['Vitaminas', 'Fitoterápicos', 'Minerais'],
    }
  })

  // 4. Default Settings
  await prisma.platformSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 }
  })

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
