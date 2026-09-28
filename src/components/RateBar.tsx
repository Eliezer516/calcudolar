import { formatRateDate, type UsdRate } from '../lib/rates'
import { RefreshIcon } from './icons'

type RateBarProps = {
  rate: UsdRate | null
  isRefreshing: boolean
  onRefresh: () => void
}

function formatRate(rate: number): string {
  return rate.toLocaleString('es-VE', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}

export function RateBar({ rate, isRefreshing, onRefresh }: RateBarProps) {
  const isUp = rate ? rate.changePercent >= 0 : true

  return (
    <div className="rate">
      <div className="rate__info">
        {rate ? (
          <>
            <p className="rate__value">
              1 USD = <strong>{formatRate(rate.usd)}</strong> Bs
            </p>
            <p className="rate__meta">
              <span className="rate__date">
                BCV · {formatRateDate(rate.date)}
              </span>
              <span
                className="rate__change"
                data-trend={isUp ? 'up' : 'down'}
              >
                {isUp ? '+' : '−'}
                {Math.abs(rate.changePercent).toLocaleString('es-VE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                %
              </span>
            </p>
          </>
        ) : (
          <p className="rate__value rate__value--skeleton" aria-busy="true">
            Obteniendo tasa BCV…
          </p>
        )}
      </div>

      <button
        type="button"
        className="rate__refresh"
        onClick={onRefresh}
        disabled={isRefreshing}
        aria-label="Actualizar la tasa del dolar"
      >
        <RefreshIcon
          className={`rate__refresh-icon${isRefreshing ? ' is-spinning' : ''}`}
        />
      </button>
    </div>
  )
}
