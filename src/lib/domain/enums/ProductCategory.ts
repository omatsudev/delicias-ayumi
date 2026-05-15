export const ProductCategory = {
  BOLOS: 'Bolos',
  TORTAS: 'Tortas',
  EMPADOES: 'Empadões',
} as const

export type ProductCategory = (typeof ProductCategory)[keyof typeof ProductCategory]
