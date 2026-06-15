import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class AddonsService {
  constructor(private readonly db: DbService) {}

  async createProduct(tenantId: string, input: { sku: string; name: string; price: number; description?: string; commission_pct?: number; availability_buildings?: string[] }) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query(
        `insert into addon_products (tenant_id, sku, name, description, price, commission_pct, availability_buildings)
         values ($1, $2, $3, $4, $5, $6, $7) returning *`,
        [
          tenantId,
          input.sku,
          input.name,
          input.description ?? null,
          input.price,
          input.commission_pct ?? 0,
          input.availability_buildings ?? [],
        ],
      );
      return rows[0];
    });
  }

  async listForBuilding(tenantId: string, buildingId: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query(
        `select * from addon_products
         where status = 'active'
           and ($1 = any(availability_buildings) or availability_buildings = '{}')
         order by name`,
        [buildingId],
      );
      return rows;
    });
  }

  /**
   * Place an addon order and raise a charge for it billed to the orderer, so
   * payment flows through the normal Tranzila pay → receipt pipeline (per
   * ADR-001). The charge is linked back to the order via charge metadata; the
   * resident pays it with the existing /v1/payments flow.
   */
  async order(
    tenantId: string,
    personId: string,
    input: { product_id: string; apartment_id: string; building_id: string; qty: number },
  ) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'resident' }, async (c) => {
      const productRes = await c.query<{ price: string; name: string }>(
        `select price, name from addon_products where id = $1`,
        [input.product_id],
      );
      if (productRes.rows.length === 0) throw new NotFoundException('Product not found');
      const product = productRes.rows[0]!;
      const total = Number(product.price) * input.qty;

      const orderRes = await c.query<{ id: string }>(
        `insert into addon_orders
          (tenant_id, product_id, ordered_by_person_id, building_id, apartment_id, qty, total)
         values ($1, $2, $3, $4, $5, $6, $7) returning *`,
        [tenantId, input.product_id, personId, input.building_id, input.apartment_id, input.qty, total],
      );
      const order = orderRes.rows[0]!;

      const chargeRes = await c.query<{ id: string }>(
        `insert into charges
          (tenant_id, building_id, apartment_id, billed_to_person_id, description, amount,
           currency, due_date, status, metadata)
         values ($1, $2, $3, $4, $5, $6, 'ILS', current_date, 'pending', $7::jsonb)
         returning id`,
        [
          tenantId,
          input.building_id,
          input.apartment_id,
          personId,
          `הזמנת מוצר: ${product.name} ×${input.qty}`,
          total,
          JSON.stringify({ kind: 'addon_order', addon_order_id: order.id }),
        ],
      );

      return { order, charge_id: chargeRes.rows[0]!.id, total };
    });
  }

  /** List orders for the tenant (admin view), optionally by fulfillment status. */
  async listOrders(tenantId: string, status?: string) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const params: any[] = [];
      let where = '';
      if (status) {
        params.push(status);
        where = `where fulfillment_status = $1`;
      }
      const { rows } = await c.query(
        `select o.*, p.name as product_name from addon_orders o
         join addon_products p on p.id = o.product_id ${where}
         order by o.created_at desc`,
        params,
      );
      return rows;
    });
  }

  /** Admin updates the fulfillment status of an order (SPEC §19.2). */
  async updateFulfillment(
    tenantId: string,
    orderId: string,
    status: 'pending' | 'in_progress' | 'delivered' | 'cancelled',
  ) {
    return this.db.withTenantContext({ tenant_id: tenantId, role: 'mgmt_admin' }, async (c) => {
      const { rows } = await c.query(
        `update addon_orders set fulfillment_status = $2, updated_at = now()
         where id = $1 returning *`,
        [orderId, status],
      );
      if (rows.length === 0) throw new NotFoundException('Order not found');
      return rows[0];
    });
  }
}
