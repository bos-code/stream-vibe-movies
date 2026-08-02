import { showToast } from "./ui";

const PLAN_DATA = {
  monthly: [
    {
      name: "Basic Plan",
      description:
        "Enjoy an extensive library of movies and shows, including recently released titles.",
      price: "Ksh. 900",
      suffix: "/month"
    },
    {
      name: "Standard Plan",
      description:
        "Access more new releases, exclusive titles, Full HD, and two simultaneous streams.",
      price: "Ksh. 1,200",
      suffix: "/month"
    },
    {
      name: "Premium Plan",
      description:
        "Watch every new release in 4K, download offline, and stream on four devices.",
      price: "Ksh. 1,499",
      suffix: "/month"
    }
  ],
  yearly: [
    {
      name: "Basic Plan",
      description:
        "Enjoy an extensive library of movies and shows with two months included free.",
      price: "Ksh. 9,000",
      suffix: "/year"
    },
    {
      name: "Standard Plan",
      description:
        "Get Full HD, two simultaneous streams, and two months included free.",
      price: "Ksh. 12,000",
      suffix: "/year"
    },
    {
      name: "Premium Plan",
      description:
        "Enjoy 4K, offline downloads, four streams, and two months included free.",
      price: "Ksh. 14,990",
      suffix: "/year"
    }
  ]
};

export function initHomePage() {
  const subscription = document.querySelector(".subscription");
  if (!subscription) return;

  const billingButtons = Array.from(subscription.querySelectorAll(".tabs button"));
  const cards = Array.from(subscription.querySelectorAll(".subcription_card"));
  let billing = "monthly";

  const renderPlans = () => {
    const plans = PLAN_DATA[billing];
    cards.forEach((card, index) => {
      const plan = plans[index];
      if (!plan) return;
      card.dataset.plan = plan.name.replace(" Plan", "").toLowerCase();
      card.querySelector("h3").textContent = plan.name;
      card.querySelector(".textbox p").textContent = plan.description;
      card.querySelector(
        ".price"
      ).innerHTML = `${plan.price}<span class="text-gray60 text-sm">${plan.suffix}</span>`;

      card.querySelectorAll("button").forEach((button) => {
        button.dataset.planAction = button.textContent.toLowerCase().includes("trial")
          ? "trial"
          : "choose";
      });
    });

    billingButtons.forEach((button) => {
      const active = button.textContent.trim().toLowerCase() === billing;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  billingButtons.forEach((button) => {
    button.type = "button";
    button.addEventListener("click", () => {
      billing = button.textContent.trim().toLowerCase();
      renderPlans();
    });
  });

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-plan-action]");
      if (!button) return;

      const selection = {
        plan: card.dataset.plan,
        billing,
        trial: button.dataset.planAction === "trial"
      };
      try {
        sessionStorage.setItem("streamvibe:selected-plan", JSON.stringify(selection));
      } catch {
        // The confirmation remains useful if storage is unavailable.
      }

      const planName = `${selection.plan[0].toUpperCase()}${selection.plan.slice(1)}`;
      showToast(
        selection.trial
          ? `${planName} free trial selected.`
          : `${planName} plan selected for ${billing} billing.`
      );
      const params = new URLSearchParams({
        billing: selection.billing,
        plan: selection.plan,
        trial: String(selection.trial)
      });
      window.location.href = `./subscription.html?${params.toString()}`;
    });
  });

  renderPlans();
}
