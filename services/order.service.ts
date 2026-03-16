import { OrderRepository } from '@/repositories/order.repository';
import { PlatformSettingRepository } from '@/repositories/platform-setting.repository';
import { PricingService } from './pricing.service';
import { OrderStatus } from '@prisma/client';

export class OrderService {
  static async createOrder(data: {
    clientEmail: string;
    formulaName: string;
    form: string;
    caps: number;
    partnerId: number;
    obs?: string;
    items: { productId: number; dosePerCap: number }[]
  }, productProvider: { findById: (id: number) => Promise<any> }) {
    
    const settings = await PlatformSettingRepository.getSettings();
    const globalFactor = settings?.factor ?? 3.5;
    const capCost = settings?.capCost ?? 0.05;
    
    // Resolve items with current prices/factors
    const itemsWithData = await Promise.all(
      data.items.map(async (it) => {
        const prod = await productProvider.findById(it.productId);
        if (!prod) throw new Error(`Product ${it.productId} not found`);
        if (prod.partnerId !== data.partnerId) throw new Error(`O ativo ${prod.name} não pertence à farmácia selecionada`);
        return {
          ...it,
          name: prod.name,
          unit: prod.unit,
          ico: prod.ico,
          cpg: prod.cpg,
          factor: prod.factor ?? globalFactor
        };
      })
    );
    
    const pricing = PricingService.calculateOrder(itemsWithData, data.caps, globalFactor, capCost);
    
    // Generate order ID (VTL-XXXX)
    // In a real app we might use a sequence or auto-increment, 
    // but for parity with the original's ORDER_SEQ:
    const count = await OrderRepository.findAll();
    const nextId = `VTL-${String(count.length + 1).padStart(4, '0')}`;
    
    return OrderRepository.create({
      id: nextId,
      client: { connect: { email: data.clientEmail } },
      formulaName: data.formulaName,
      form: data.form,
      caps: data.caps,
      partner: { connect: { id: data.partnerId } },
      status: OrderStatus.REVIEW,
      capCost,
      capsTotal: pricing.capsTotal,
      total: pricing.total,
      obs: data.obs,
      items: {
        create: itemsWithData.map(it => {
          const itemCalc = PricingService.calculateItem(it.cpg, it.factor, globalFactor, it.dosePerCap, data.caps, it.unit);
          return {
            productId: it.productId,
            name: it.name,
            unit: it.unit,
            ico: it.ico,
            dosePerCap: it.dosePerCap,
            cpg: it.cpg,
            factor: it.factor ?? globalFactor,
            rawCost: itemCalc.raw,
            price: itemCalc.price
          };
        })
      }
    });
  }

  static async reviewOrder(id: string, status: OrderStatus, pharmacistNote: string) {
    return OrderRepository.updateStatus(id, status, pharmacistNote);
  }
}
