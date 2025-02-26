export default class View {
    constructor(selector) {
      this.parentElement = document.querySelector(selector);
      if (!this.parentElement) throw new Error(`Element ${selector} not found`);
    }
  
    render(data) {
      if (!data) return this.renderError("No data available!");
      this.clear();
      this.parentElement.insertAdjacentHTML("beforeend", this.getTemplate(data));
    }
  
    clear() {
      this.parentElement.innerHTML = "";
    }
  
    attachEvent(eventType, handler) {
      this.parentElement.addEventListener(eventType, handler);
    }
  
    getTemplate(data) {
      return `<pre>${JSON.stringify(data, null, 2)}</pre>`; // Default: show JSON
    }
  
    renderError(message = "Something went wrong!") {
      this.clear();
      this.parentElement.insertAdjacentHTML("afterbegin", `<p>${message}</p>`);
    }
  }
  