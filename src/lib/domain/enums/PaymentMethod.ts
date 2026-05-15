export const PaymentMethod = {
  PIX: 'pix',
  CARTAO: 'cartao',
  DINHEIRO: 'dinheiro',
} as const

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]
