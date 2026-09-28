import { useRegisterSW } from "virtual:pwa-register/react";

type UpdatePromptProps = {
  onOfflineReady: () => void;
};

export function UpdatePrompt({ onOfflineReady }: UpdatePromptProps) {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({ onOfflineReady });

  if (!needRefresh) return null;

  return (
    <div className="update" role="status">
      <p className="update__text">Hay una version nueva disponible</p>
      <div className="update__actions">
        <button
          type="button"
          className="update__btn update__btn--ghost"
          onClick={() => setNeedRefresh(false)}
        >
          Ahora no
        </button>
        <button
          type="button"
          className="update__btn"
          onClick={() => void updateServiceWorker(true)}
        >
          Actualizar
        </button>
      </div>
    </div>
  );
}
