/**
 * faq.js — Accordion / FAQ dropdown
 *
 * Uses a .is-open class on .accordion-item to drive open/close.
 * Clicking an item closes any other open item first (single-open behaviour).
 * Smooth height animation handled via CSS max-height transition.
 */

export function initFAQ() {
  const items = document.querySelectorAll(".accordion-item");
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    const answer = item.querySelector(".answer");
    if (!trigger || !answer) return;

    trigger.addEventListener("click", () => {
      const isAlreadyOpen = item.classList.contains("is-open");

      // Close every item first
      items.forEach((el) => {
        el.classList.remove("is-open");
        el.querySelector(".answer").style.maxHeight = null;
      });

      // If it wasn't open, open it now
      if (!isAlreadyOpen) {
        item.classList.add("is-open");
        // Set explicit pixel height so CSS transition works correctly
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}
