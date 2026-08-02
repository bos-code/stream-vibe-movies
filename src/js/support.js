const DRAFT_KEY = "streamvibe:support-draft";

export function initSupportPage() {
  const form = document.querySelector(".support-form");
  if (!form) return;

  const message = form.elements.message;
  const counter = form.querySelector(".support-form__count");
  const status = form.querySelector(".support-form__status");
  const submit = form.querySelector(".support-submit");

  restoreDraft(form);
  updateCounter(message, counter);

  form.addEventListener("input", (event) => {
    const field = event.target;
    field.removeAttribute("aria-invalid");
    if (field === message) updateCounter(message, counter);
    saveDraft(form);
  });
  form.addEventListener(
    "invalid",
    (event) => {
      event.target.setAttribute("aria-invalid", "true");
    },
    true
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = "Please complete the highlighted fields before sending.";
      status.className = "support-form__status is-error";
      return;
    }

    const ticketId = `SV-${Date.now().toString(36).toUpperCase()}`;
    try {
      sessionStorage.setItem(
        "streamvibe:last-support-ticket",
        JSON.stringify({ createdAt: new Date().toISOString(), id: ticketId, topic: form.elements.topic.value })
      );
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // The success reference remains available on screen.
    }

    status.textContent = `Thanks — your request was submitted. Your reference is ${ticketId}.`;
    status.className = "support-form__status is-success";
    submit.textContent = "Message Sent";
    form.reset();
    updateCounter(message, counter);
    setTimeout(() => {
      submit.textContent = "Send Message";
    }, 3000);
  });

  document.querySelector("[data-ask-question]")?.addEventListener("click", () => {
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => form.elements.firstName.focus(), 450);
  });
}

function updateCounter(message, counter) {
  if (!message || !counter) return;
  counter.textContent = `${message.value.length} / ${message.maxLength}`;
}

function saveDraft(form) {
  const values = {};
  new FormData(form).forEach((value, key) => {
    if (key !== "consent") values[key] = String(value);
  });
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
  } catch {
    // Draft saving is optional.
  }
}

function restoreDraft(form) {
  try {
    const values = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null");
    if (!values) return;
    Object.entries(values).forEach(([name, value]) => {
      if (form.elements[name]) form.elements[name].value = value;
    });
  } catch {
    // Ignore malformed or unavailable session data.
  }
}
