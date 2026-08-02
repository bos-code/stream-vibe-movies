import { showToast } from "./ui";

const PLAN_DATA = {
  monthly: {
    basic: { price: 900, suffix: "/month" },
    premium: { price: 1499, suffix: "/month" },
    standard: { price: 1200, suffix: "/month" }
  },
  yearly: {
    basic: { price: 9000, suffix: "/year" },
    premium: { price: 14990, suffix: "/year" },
    standard: { price: 12000, suffix: "/year" }
  }
};

let billing = "monthly";
let selectedPlan = "standard";
let trialSelected = false;

export function initSubscriptionPage() {
  const page = document.querySelector(".subscription-page");
  if (!page) return;

  const stored = readSelectedPlan();
  const params = new URLSearchParams(window.location.search);
  const requestedBilling = params.get("billing");
  billing = ["monthly", "yearly"].includes(requestedBilling)
    ? requestedBilling
    : stored?.billing === "yearly"
      ? "yearly"
      : "monthly";
  selectedPlan = ["basic", "standard", "premium"].includes(params.get("plan"))
    ? params.get("plan")
    : ["basic", "standard", "premium"].includes(stored?.plan)
      ? stored.plan
      : "standard";
  trialSelected = params.has("trial") ? params.get("trial") === "true" : Boolean(stored?.trial);

  page.querySelector(".billing-tabs").addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-billing]") : null;
    if (!target) return;
    billing = target.dataset.billing;
    renderPlans(page);
  });
  page.querySelector(".plan-grid").addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-plan-action]") : null;
    if (!target) return;
    const card = target.closest("[data-plan]");
    selectedPlan = card.dataset.plan;
    trialSelected = target.dataset.planAction === "trial";
    rememberSelection();
    renderPlans(page);
    openCheckout();
  });
  page.querySelector("[data-subscription-cta]").addEventListener("click", () => {
    selectedPlan = "standard";
    trialSelected = true;
    rememberSelection();
    renderPlans(page);
    openCheckout();
  });

  renderPlans(page);
  if (params.has("plan") || stored?.plan) {
    document.querySelector(`[data-plan="${selectedPlan}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function renderPlans(page) {
  page.querySelectorAll("[data-billing]").forEach((button) => {
    const active = button.dataset.billing === billing;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  page.querySelectorAll("[data-plan]").forEach((card) => {
    const plan = card.dataset.plan;
    const price = PLAN_DATA[billing][plan];
    card.querySelector("[data-plan-price]").textContent = formatKsh(price.price);
    card.querySelector("[data-plan-suffix]").textContent = price.suffix;
    card.classList.toggle("is-selected", plan === selectedPlan);
  });
  const priceRow = page.querySelector(".comparison-table tbody tr:first-child");
  if (priceRow) {
    ["basic", "standard", "premium"].forEach((plan, index) => {
      priceRow.children[index + 1].textContent = `${formatKsh(PLAN_DATA[billing][plan].price)}${PLAN_DATA[billing][plan].suffix}`;
    });
  }
}

function openCheckout() {
  const dialog = ensureCheckout();
  const planName = `${selectedPlan[0].toUpperCase()}${selectedPlan.slice(1)}`;
  const data = PLAN_DATA[billing][selectedPlan];
  dialog.querySelector("[data-checkout-plan]").textContent = `${planName} Plan`;
  dialog.querySelector("[data-checkout-price]").textContent = `${formatKsh(data.price)}${data.suffix}`;
  dialog.querySelector("[data-checkout-trial]").hidden = !trialSelected;
  dialog.showModal();
}

function ensureCheckout() {
  let dialog = document.querySelector("[data-checkout-dialog]");
  if (dialog) return dialog;

  dialog = document.createElement("dialog");
  dialog.className = "detail-dialog checkout-dialog";
  dialog.dataset.checkoutDialog = "";
  dialog.innerHTML = `
    <form class="checkout-form" data-checkout-form>
      <button class="detail-dialog__close" type="button" aria-label="Close checkout">×</button>
      <p class="support-eyebrow">Complete your selection</p>
      <h2 data-checkout-plan></h2>
      <p class="checkout-form__price" data-checkout-price></p>
      <p class="checkout-form__trial" data-checkout-trial>Includes a 7-day free trial. Billing starts after your trial.</p>
      <label>Email<input type="email" name="email" autocomplete="email" required placeholder="you@example.com" /></label>
      <fieldset><legend>Payment method</legend><label><input type="radio" name="payment" value="mpesa" checked /> M-Pesa</label><label><input type="radio" name="payment" value="card" /> Debit or credit card</label></fieldset>
      <label class="checkout-form__consent"><input type="checkbox" name="terms" required /> I agree to the Terms of Use and recurring billing.</label>
      <button class="checkout-form__submit" type="submit">Confirm Plan</button>
      <p class="checkout-form__status" role="status" aria-live="polite"></p>
    </form>`;
  document.body.appendChild(dialog);
  dialog.querySelector(".detail-dialog__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.querySelector("[data-checkout-form]").addEventListener("submit", completeCheckout);
  return dialog;
}

function completeCheckout(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const subscription = {
    billing,
    plan: selectedPlan,
    startedAt: new Date().toISOString(),
    status: trialSelected ? "trial" : "active"
  };
  try {
    localStorage.setItem("streamvibe:subscription", JSON.stringify(subscription));
    sessionStorage.removeItem("streamvibe:selected-plan");
  } catch {
    // Confirmation is still shown if storage is restricted.
  }
  form.querySelector(".checkout-form__status").textContent = trialSelected
    ? "Your free trial is active on this device."
    : "Your plan is active on this device.";
  form.querySelector(".checkout-form__submit").textContent = "Plan Confirmed";
  showToast(trialSelected ? "Free trial started." : "Subscription activated.");
  setTimeout(() => {
    document.querySelector("[data-checkout-dialog]")?.close();
    form.reset();
    form.querySelector(".checkout-form__submit").textContent = "Confirm Plan";
    form.querySelector(".checkout-form__status").textContent = "";
  }, 1800);
}

function rememberSelection() {
  try {
    sessionStorage.setItem(
      "streamvibe:selected-plan",
      JSON.stringify({ billing, plan: selectedPlan, trial: trialSelected })
    );
  } catch {
    // Query-free handoff is optional.
  }
}

function readSelectedPlan() {
  try {
    return JSON.parse(sessionStorage.getItem("streamvibe:selected-plan") || "null");
  } catch {
    return null;
  }
}

function formatKsh(value) {
  return `Ksh. ${Number(value).toLocaleString("en-KE")}`;
}
