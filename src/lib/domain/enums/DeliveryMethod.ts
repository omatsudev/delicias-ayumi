export const DeliveryMethod = {
  ENTREGA: 'entrega',
  RETIRADA: 'retirada',
} as const

export type DeliveryMethod = (typeof DeliveryMethod)[keyof typeof DeliveryMethod]
