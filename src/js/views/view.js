export function View(selector) {
  const parentElement = document.querySelector(selector);
  if (!parentElement)return;

  function render(data, templateFn) {
    if (!data ) return renderError("Invalid or empty data!");
    clear();
    data.forEach(async (item) => {
      const content = await templateFn(item);
  
      parentElement.innerHTML += content;
  
    });
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
    renderError,
  };
}
