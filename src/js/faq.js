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
    const initiallyOpen = item.classList.contains("is-open");

    const answerId = answer.id || `faq-answer-${Math.random().toString(36).slice(2, 9)}`;
    answer.id = answerId;
    trigger.setAttribute("aria-controls", answerId);
    trigger.setAttribute("aria-expanded", String(initiallyOpen));
    answer.setAttribute("aria-hidden", String(!initiallyOpen));
    if (initiallyOpen) {
      requestAnimationFrame(() => {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      });
    }

    trigger.addEventListener("click", () => {
      const isAlreadyOpen = item.classList.contains("is-open");

      // Close every item first
      items.forEach((el) => {
        el.classList.remove("is-open");
        el.querySelector(".answer").style.maxHeight = null;
        el.querySelector(".answer").setAttribute("aria-hidden", "true");
        el.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
      });

      // If it wasn't open, open it now
      if (!isAlreadyOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        answer.setAttribute("aria-hidden", "false");
        // Set explicit pixel height so CSS transition works correctly
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  window.addEventListener("resize", () => {
    document.querySelectorAll(".accordion-item.is-open .answer").forEach((answer) => {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    });
  });
}
