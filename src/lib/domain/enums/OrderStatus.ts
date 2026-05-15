export const OrderStatus = {
  EM_PRODUCAO: 'em_producao',
  SAIU_ENTREGA: 'saiu_entrega',
  PRONTO_RETIRADA: 'pronto_retirada',
  ENTREGUE: 'entregue',
  CANCELADO: 'cancelado',
} as const

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  em_producao: 'Em produção',
  saiu_entrega: 'Saiu para entrega',
  pronto_retirada: 'Pronto para retirada',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}
