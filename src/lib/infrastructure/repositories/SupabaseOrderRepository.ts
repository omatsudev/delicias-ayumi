import type { SupabaseClient } from '@supabase/supabase-js'
import type { IOrderRepository } from '@/lib/domain/interfaces/IOrderRepository'
import type { Order, CreateOrderInput, OrderItemSnapshot } from '@/lib/domain/entities/Order'
import type { OrderStatus } from '@/lib/domain/enums/OrderStatus'
import type { DeliveryMethod } from '@/lib/domain/enums/DeliveryMethod'
import type { PaymentMethod } from '@/lib/domain/enums/PaymentMethod'

type DbRow = {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  delivery_method: string
  bairro: string | null
  address: string | null
  cep: string | null
  payment_method: string
  status: string
  subtotal_cents: number
  fee_cents: number
  total_cents: number
  notes: string | null
  items: OrderItemSnapshot[]
  created_at: string
}

function toEntity(row: DbRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    deliveryMethod: row.delivery_method as DeliveryMethod,
    bairro: row.bairro,
    address: row.address,
    cep: row.cep,
    paymentMethod: row.payment_method as PaymentMethod,
    status: row.status as OrderStatus,
    subtotalCents: row.subtotal_cents,
    feeCents: row.fee_cents,
    totalCents: row.total_cents,
    notes: row.notes,
    items: row.items ?? [],
    createdAt: row.created_at,
  }
}

export class SupabaseOrderRepository implements IOrderRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findAll(): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('ayumi_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as DbRow[]).map(toEntity)
  }

  async findById(id: string): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from('ayumi_orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return toEntity(data as DbRow)
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from('ayumi_orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single()

    if (error) return null
    return toEntity(data as DbRow)
  }

  async create(input: CreateOrderInput): Promise<Order> {
    const seq = await this.supabase.rpc('nextval', { seq: 'ayumi_order_seq' })
    const orderNumber = `#${seq.data ?? Date.now()}`

    const { data, error } = await this.supabase
      .from('ayumi_orders')
      .insert({
        order_number: orderNumber,
        customer_name: input.customerName,
        customer_phone: input.customerPhone,
        delivery_method: input.deliveryMethod,
        bairro: input.bairro ?? null,
        address: input.address ?? null,
        cep: input.cep ?? null,
        payment_method: input.paymentMethod,
        subtotal_cents: input.subtotalCents,
        fee_cents: input.feeCents,
        total_cents: input.totalCents,
        notes: input.notes ?? null,
        items: input.items,
      })
      .select()
      .single()

    if (error) throw error
    return toEntity(data as DbRow)
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data, error } = await this.supabase
      .from('ayumi_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return toEntity(data as DbRow)
  }
}
