import type { AmountKey } from '../lib/amount'
import { BackspaceIcon } from './icons'
import './Keypad.css'

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const
const ZEROS = ['0', '00', '000'] as const

type KeypadProps = {
  onKey: (key: AmountKey) => void
  disabled: boolean
}

export function Keypad({ onKey, disabled }: KeypadProps) {
  return (
    <div className="keypad" aria-label="Teclado numerico">
      <div className="keypad__grid">
        <button
          type="button"
          className="keypad__key keypad__key--ghost"
          onClick={() => onKey('clear')}
          disabled={disabled}
        >
          C
        </button>

        <button
          type="button"
          className="keypad__key keypad__key--ghost"
          onClick={() => onKey('back')}
          disabled={disabled}
          aria-label="Borrar el ultimo digito"
        >
          <BackspaceIcon className="keypad__icon" />
        </button>

        <button
          type="button"
          className="keypad__key keypad__key--dec"
          onClick={() => onKey('dec')}
          disabled={disabled}
          aria-label="Separador decimal"
        >
          ,
        </button>

        {DIGITS.map((digit) => (
          <Key key={digit} label={digit} onPress={onKey} disabled={disabled} />
        ))}

        {ZEROS.map((zeros) => (
          <Key key={zeros} label={zeros} onPress={onKey} disabled={disabled} />
        ))}
      </div>
    </div>
  )
}

type KeyProps = {
  label: string
  onPress: (key: AmountKey) => void
  disabled: boolean
}

function Key({ label, onPress, disabled }: KeyProps) {
  return (
    <button
      type="button"
      className="keypad__key"
      onClick={() => onPress(label as AmountKey)}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
