export const MAX_INT_DIGITS = 12
export const MAX_DEC_DIGITS = 2

export type Amount = {
  int: string
  dec: string | null
}

export type Digit = `${number}`

export type AmountKey = Digit | 'dec' | 'back' | 'clear'

export const ZERO: Amount = { int: '0', dec: null }

const groupThousands = (digits: string) =>
  digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

/** Formats an amount using the Venezuelan convention: 1.234.567,89 */
export function formatAmount({ int, dec }: Amount): string {
  return `${groupThousands(int)},${(dec ?? '').padEnd(MAX_DEC_DIGITS, '0')}`
}

export function amountToNumber({ int, dec }: Amount): number {
  return Number(`${int}.${(dec ?? '').padEnd(MAX_DEC_DIGITS, '0')}`)
}

export function numberToAmount(value: number): Amount {
  if (!Number.isFinite(value)) return ZERO
  const [int = '0', dec = ''] = Math.max(0, value)
    .toFixed(MAX_DEC_DIGITS)
    .split('.')
  return { int: int.replace(/^0+(?=\d)/, ''), dec }
}

function appendDigit({ int, dec }: Amount, digit: Digit): Amount {
  if (dec !== null && dec.length < MAX_DEC_DIGITS) {
    return { int, dec: dec + digit }
  }
  if (int.length >= MAX_INT_DIGITS) return { int, dec }
  if (int === '0' && digit === '0') return { int, dec }
  return { int: int === '0' ? digit : int + digit, dec }
}

function removeLast({ int, dec }: Amount): Amount {
  if (dec !== null) {
    if (dec.length > 0) return { int, dec: dec.slice(0, -1) }
    return { int, dec: null }
  }
  if (int.length > 1) return { int: int.slice(0, -1), dec }
  return ZERO
}

export function pressKey(amount: Amount, key: AmountKey): Amount {
  if (key === 'clear') return ZERO
  if (key === 'back') return removeLast(amount)
  if (key === 'dec') {
    return amount.dec === null ? { ...amount, dec: '' } : amount
  }
  return [...key].reduce((acc, digit) => appendDigit(acc, digit as Digit), amount)
}
