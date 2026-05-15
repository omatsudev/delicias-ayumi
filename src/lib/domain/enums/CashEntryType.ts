export const CashEntryType = {
  IN: 'in',
  OUT: 'out',
} as const

export type CashEntryType = (typeof CashEntryType)[keyof typeof CashEntryType]
