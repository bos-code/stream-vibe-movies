export function View(selector) {
  const parentElement = document.querySelector(selector);
  if (!parentElement) return;

  /**
   * render — resolves all item templates in parallel then writes to DOM once.
   *
   * The previous implementation used async forEach which is "fire and forget" —
   * each item's async template ran independently and wrote to innerHTML as it
   * resolved, causing race conditions and layout thrashing. Using Promise.all
   * means we wait for every template to resolve first, then do a single DOM write.
   */
  async function render(data, templateFn) {
    if (!data) return renderError("Invalid or empty data!");
    clear();

    // Resolve all templates concurrently, then join and write once
    const templates = await Promise.all(data.map(item => templateFn(item)));
    parentElement.innerHTML = templates.join("");
  }

  function clear() {
    parentElement.innerHTML = "";
  }

  function attachEvent(eventType, handler) {
    parentElement.addEventListener(eventType, handler);
  }

  function renderError(message = "Something went wrong!") {
    clear();
    parentElement.insertAdjacentHTML("afterbegin", `<p>${message}</p>`);
  }

  return {
    render,
    clear,
    attachEvent,
    renderError
  };
}
