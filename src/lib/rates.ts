const ENDPOINT = 'https://rates.dolarvzla.com/bcv/current.json'
const CACHE_KEY = 'calcudolar:bcv-usd-rate'
const CACHE_TTL = 30 * 60 * 1000

export type UsdRate = {
  date: string
  usd: number
  previousUsd: number
  changePercent: number
}

type CachedRate = {
  rate: UsdRate
  fetchedAt: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toRate(payload: unknown): UsdRate {
  if (!isRecord(payload) || !isRecord(payload.current)) {
    throw new Error('Respuesta de la tasa con formato inesperado')
  }
  const { current, previous, changePercentage } = payload
  const { date, usd } = current
  if (typeof date !== 'string' || typeof usd !== 'number' || usd <= 0) {
    throw new Error('La API no devolvio una tasa de dolar valida')
  }
  return {
    date,
    usd,
    previousUsd:
      isRecord(previous) && typeof previous.usd === 'number'
        ? previous.usd
        : usd,
    changePercent:
      isRecord(changePercentage) &&
      typeof changePercentage.usd === 'number'
        ? changePercentage.usd
        : 0,
  }
}

export async function fetchUsdRate(): Promise<UsdRate> {
  const response = await fetch(ENDPOINT, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`No se pudo consultar la tasa (${response.status})`)
  }
  return toRate(await response.json())
}

export function readCachedRate(): CachedRate | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached: unknown = JSON.parse(raw)
    if (!isRecord(cached) || typeof cached.fetchedAt !== 'number') return null
    if (Date.now() - cached.fetchedAt > CACHE_TTL) return null
    return { rate: toRate(cached.rate), fetchedAt: cached.fetchedAt }
  } catch {
    return null
  }
}

export function writeCachedRate(rate: UsdRate, fetchedAt: number): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, fetchedAt }))
  } catch {
    /* private mode or storage full: the cache is optional */
  }
}

/** "2026-09-28" -> "28/09/2026" */
export function formatRateDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return isoDate
  return `${day}/${month}/${year}`
}
