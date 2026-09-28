import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Keypad } from "./components/Keypad";
import { Panel, type Currency } from "./components/Panel";
import { RateBar } from "./components/RateBar";
import { AlertIcon, SwapIcon } from "./components/icons";
import { useRate } from "./hooks/useRate";
import {
  ZERO,
  amountToNumber,
  formatAmount,
  numberToAmount,
  pressKey,
  type Amount,
  type AmountKey,
} from "./lib/amount";
import { copyToClipboard } from "./lib/clipboard";

type Direction = "VES_USD" | "USD_VES";

const CURRENCY_NAME: Record<Currency, string> = {
  VES: "VES",
  USD: "USD",
};

function App() {
  const { status, rate, error, isRefreshing, refresh } = useRate();
  const [direction, setDirection] = useState<Direction>("VES_USD");
  const [amount, setAmount] = useState<Amount>(ZERO);
  const [isCopied, setIsCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const inputValue = amountToNumber(amount);
  const from: Currency = direction === "VES_USD" ? "VES" : "USD";
  const to: Currency = direction === "VES_USD" ? "USD" : "VES";

  const inputText = formatAmount(amount);
  const resultAmount = rate
    ? direction === "VES_USD"
      ? numberToAmount(inputValue / rate.usd)
      : numberToAmount(inputValue * rate.usd)
    : ZERO;
  const resultText = rate ? formatAmount(resultAmount) : "—";
  const hasRate = status === "ready" && rate !== null;

  const handleKey = useCallback((key: AmountKey) => {
    setAmount((prev) => pressKey(prev, key));
  }, []);

  const handleSwap = useCallback(() => {
    if (!rate) return;
    setAmount(
      direction === "VES_USD"
        ? numberToAmount(inputValue / rate.usd)
        : numberToAmount(inputValue * rate.usd),
    );
    setDirection((prev) => (prev === "VES_USD" ? "USD_VES" : "VES_USD"));
  }, [direction, inputValue, rate]);

  const handleCopy = useCallback(async () => {
    const text = `${inputText} ${CURRENCY_NAME[from]} = ${resultText} ${CURRENCY_NAME[to]}`;
    if (await copyToClipboard(text)) {
      setIsCopied(true);
      setToast("Conversion copiada");
    } else {
      setToast("No se pudo copiar");
    }
  }, [from, inputText, resultText, to]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!isCopied) return;
    const timer = window.setTimeout(() => setIsCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [isCopied]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable]")) return;

      if (event.key >= "0" && event.key <= "9") {
        handleKey(event.key as AmountKey);
      } else if (event.key === "," || event.key === ".") {
        handleKey("dec");
      } else if (event.key === "Backspace") {
        event.preventDefault();
        handleKey("back");
      } else if (event.key === "Delete" || event.key === "Escape") {
        handleKey("clear");
      } else {
        return;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  if (status === "error" && !rate) {
    return (
      <div className="app">
        <div className="state-card">
          <span className="state-card__icon">
            <AlertIcon />
          </span>
          <h1 className="state-card__title">Sin conexion con la tasa</h1>
          <p className="state-card__text">
            {error ?? "No se pudo consultar la API del BCV."}
          </p>
          <button
            type="button"
            className="state-card__retry"
            onClick={refresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Reintentando…" : "Reintentar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <h1 className="app__title">Cambio de moneda</h1>
          <p className="app__subtitle">Bolivar ⇄ Dolar oficial (BCV)</p>
        </div>
        {/* <RateBar rate={rate} isRefreshing={isRefreshing} onRefresh={refresh} /> */}
      </header>

      {status === "error" && rate ? (
        <p className="app__warning">
          <AlertIcon className="app__warning-icon" />
          No se pudo actualizar la tasa, se muestra el ultimo valor guardado.
        </p>
      ) : null}

      <main className="calculator">
        <div className="calculator__panels">
          <Panel currency={from} value={inputText} variant="input" />

          <div className="swap">
            <span className="swap__line" />
            <button
              type="button"
              className="swap__button"
              onClick={handleSwap}
              disabled={!hasRate}
              aria-label="Invertir la direccion de la conversion"
            >
              <SwapIcon className="swap__icon" />
            </button>
            <span className="swap__line" />
          </div>

          <Panel
            currency={to}
            value={resultText}
            variant="result"
            caption={
              rate
                ? `1 USD = ${rate.usd.toLocaleString("es-VE", {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                  })} Bs`
                : "Esperando la tasa del BCV…"
            }
            copied={isCopied}
            onCopy={hasRate ? handleCopy : undefined}
          />
        </div>

        <Keypad onKey={handleKey} disabled={!hasRate} />
      </main>

      <footer className="app__footer">
        <span>
          Tasa oficial BCV via{" "}
          <a
            href="https://rates.dolarvzla.com/bcv/current.json"
            target="_blank"
            rel="noreferrer"
          >
            rates.dolarvzla.com
          </a>
        </span>
        <span className="app__footer-hint">
          Usa el teclado en pantalla para ingresar el monto
        </span>
      </footer>

      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

export default App;
