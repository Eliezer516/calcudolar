import { CheckIcon, CopyIcon } from "./icons";

export type Currency = "VES" | "USD";

const CURRENCY_META: Record<
  Currency,
  { code: string; name: string; symbol: string }
> = {
  VES: { code: "VES", name: "Bolívares", symbol: "Bs" },
  USD: { code: "USD", name: "Dólares", symbol: "US$" },
};

type PanelProps = {
  currency: Currency;
  value: string;
  variant: "input" | "result";
  caption?: string;
  copied?: boolean;
  onCopy?: () => void;
};

export function Panel({
  currency,
  value,
  variant,
  caption,
  copied = false,
  onCopy,
}: PanelProps) {
  const meta = CURRENCY_META[currency];
  const size = value.replace(/\D/g, "").length > 11 ? "sm" : "md";

  return (
    <section className={`panel panel--${variant}`}>
      <header className="panel__head">
        <span className="panel__label">
          <span className="panel__code">{meta.symbol}</span>
          {meta.name}
        </span>
        {onCopy ? (
          <button
            type="button"
            className="panel__copy"
            onClick={onCopy}
            aria-label={`Copiar el resultado en ${meta.code}`}
          >
            {copied ? (
              <CheckIcon className="panel__copy-icon" />
            ) : (
              <CopyIcon className="panel__copy-icon" />
            )}
          </button>
        ) : null}
      </header>

      <output
        className="panel__value"
        data-size={size}
        aria-live={variant === "result" ? "polite" : "off"}
        aria-label={`${meta.name}: ${value}`}
      >
        {value}
      </output>

      {caption ? <p className="panel__caption">{caption}</p> : null}
    </section>
  );
}
