const lastFocused = new WeakMap();
const OPEN_LAYER_SELECTOR =
  ".search-panel.is-open, .watchlist-panel.is-open, .navmobile.slide-in";

export function openLayer(
  layer,
  { name, trigger, openClass = "is-open", focusTarget } = {}
) {
  if (!layer) return;

  window.dispatchEvent(
    new CustomEvent("streamvibe:layer-opening", { detail: { name } })
  );

  lastFocused.set(layer, trigger || document.activeElement);
  layer.classList.add(openClass);
  layer.setAttribute("aria-hidden", "false");
  trigger?.setAttribute("aria-expanded", "true");
  syncBodyLock();

  requestAnimationFrame(() => {
    const target =
      focusTarget ||
      layer.querySelector(
        "[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
    target?.focus();
  });
}

export function closeLayer(
  layer,
  { trigger, openClass = "is-open", restoreFocus = true } = {}
) {
  if (!layer || !layer.classList.contains(openClass)) return;

  layer.classList.remove(openClass);
  layer.setAttribute("aria-hidden", "true");
  trigger?.setAttribute("aria-expanded", "false");
  syncBodyLock();

  if (restoreFocus) {
    const previous = lastFocused.get(layer);
    if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
  }
}

export function closeWhenAnotherLayerOpens(name, close) {
  window.addEventListener("streamvibe:layer-opening", (event) => {
    if (event.detail?.name !== name) close({ restoreFocus: false });
  });
}

export function trapFocus(container, event) {
  if (event.key !== "Tab") return;

  const focusable = Array.from(
    container.querySelectorAll(
      "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
    )
  ).filter((element) => element.getClientRects().length > 0);

  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function syncBodyLock() {
  document.body.classList.toggle(
    "overlay-is-open",
    Boolean(document.querySelector(OPEN_LAYER_SELECTOR))
  );
}
