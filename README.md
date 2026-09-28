# calcudolar

Calculadora de cambio de **bolívares (VES) ⇄ dólares oficiales (USD)** con la tasa
del BCV. Mobile first, con una versión de escritorio en dos columnas y teclado
numérico en pantalla (no usa el teclado del sistema).

## Scripts

```bash
bun install
bun run dev      # servidor de desarrollo
bun run build    # typecheck + build de produccion
bun run preview  # sirve el build
bun run lint     # oxlint
```

## Datos

La tasa se obtiene de `https://rates.dolarvzla.com/bcv/current.json` (CORS
habilitado). Se guarda en `localStorage` por 30 minutos para que la app abra
instantaneamente y siga mostrando el ultimo valor si no hay conexion.

## Estructura

- `src/lib/amount.ts` — modelo de entrada (dígitos enteros + decimales) y formato venezolano `1.234,56`
- `src/lib/rates.ts` — API, validación y caché de la tasa
- `src/hooks/useRate.ts` — carga, refresco y estados de error
- `src/components/` — `Keypad`, `Panel`, `RateBar`, iconos
