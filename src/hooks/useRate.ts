import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchUsdRate,
  readCachedRate,
  writeCachedRate,
  type UsdRate,
} from '../lib/rates'

type Status = 'loading' | 'ready' | 'error'

type RateState = {
  status: Status
  rate: UsdRate | null
  error: string | null
}

export type UseRateResult = RateState & {
  isRefreshing: boolean
  refresh: () => void
}

export function useRate(): UseRateResult {
  const [state, setState] = useState<RateState>(() => {
    const cached = readCachedRate()
    return cached
      ? { status: 'ready', rate: cached.rate, error: null }
      : { status: 'loading', rate: null, error: null }
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const requestId = useRef(0)

  const load = useCallback(async (force: boolean) => {
    const id = ++requestId.current
    if (force) setIsRefreshing(true)
    try {
      const rate = await fetchUsdRate()
      const fetchedAt = Date.now()
      writeCachedRate(rate, fetchedAt)
      if (id === requestId.current) {
        setState({ status: 'ready', rate, error: null })
      }
    } catch (error) {
      if (id !== requestId.current) return
      setState((prev) => ({
        status: 'error',
        rate: prev.rate,
        error:
          error instanceof Error
            ? error.message
            : 'No se pudo conectar con la API de tasas',
      }))
    } finally {
      if (id === requestId.current) setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- fetching the rate is an external-system sync, and every setState call below happens after the request resolves
    void load(false)
  }, [load])

  const refresh = useCallback(() => {
    void load(true)
  }, [load])

  return { ...state, isRefreshing, refresh }
}
