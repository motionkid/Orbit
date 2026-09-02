const state = {
  idea: "",
  business: null,
  activeView: "overview"
};

const examples = document.querySelectorAll("[data-example]");
const form = document.getElementById("ideaForm");
const input = document.getElementById("ideaInput");
const charCount = document.getElementById("charCount");
const emptyState = document.getElementById("emptyState");
const workspace = document.getElementById("workspace");
const detailPanel = document.getElementById("detailPanel");

input.addEventListener("input", () => {
  charCount.textContent = `${input.value.length} / 500`;
});

examples.forEach(btn => btn.addEventListener("click", () => {
  input.value = btn.dataset.example;
  charCount.textContent = `${input.value.length} / 500`;
  input.focus();
}));

/*
  Orbit V1.1
  This is still a zero-API prototype. Instead of pretending to have live
  market data, it uses transparent business-model rules and editable
  assumptions. The classifier scores keyword evidence rather than relying
  on one broad keyword match.
*/

const PROFILES = [
  {
    id: "local-service",
    type: "Local service",
    terms: [
      "detailing", "cleaning", "car wash", "landscap", "lawn", "plumb",
      "electrician", "handyman", "salon", "barber", "photograph", "repair",
      "mobile", "home service", "pet sitting", "dog walking", "moving",
      "car detailing", "beauty service"
    ],
    customerHints: ["homeowners", "professionals", "families", "drivers", "local customers", "busy people"],
    problem: "The customer wants a reliable outcome without spending the time or effort to do the job themselves.",
    offer: "A focused, convenient service that can be delivered with a repeatable process.",
    revenue: "Per-job / package",
    economics: { price: 150, variableCost: 35, fixedCost: 2000, capacity: "Jobs per week" },
    primaryRisk: "Utilization and willingness to pay",
    test: "Offer a specific package to 10–20 reachable prospects and measure paid bookings, not compliments."
  },
  {
    id: "professional-service",
    type: "Professional service",
    terms: [
      "bookkeep", "accounting", "tax", "legal", "law", "consult", "agency",
      "marketing service", "design service", "copywriting", "recruit",
      "virtual assistant", "coaching", "advisory", "compliance", "payroll",
      "financial service", "freelance"
    ],
    customerHints: ["small business", "freelancer", "freelance", "designer", "founder", "startup", "agency", "professional"],
    problem: "The customer needs specialist work done correctly but does not want to hire or manage the capability in-house.",
    offer: "A productized specialist service with clear scope, pricing, and recurring value.",
    revenue: "Monthly retainer / project",
    economics: { price: 500, variableCost: 100, fixedCost: 1500, capacity: "Clients per month" },
    primaryRisk: "Acquisition and retention",
    test: "Sell a tightly scoped starter package to a narrow customer segment before expanding the service."
  },
  {
    id: "saas",
    type: "Software / SaaS",
    terms: [
      "saas", "software", "app", "platform", "dashboard", "automation",
      "workflow", "ai tool", "ai assistant", "api", "browser tool",
      "subscription software", "productivity tool", "crm"
    ],
    customerHints: ["teams", "businesses", "founders", "developers", "marketers", "professionals", "creators", "students"],
    problem: "A repeated workflow is slow, fragmented, expensive, or unnecessarily manual.",
    offer: "A focused software product that removes a measurable workflow cost.",
    revenue: "Subscription",
    economics: { price: 49, variableCost: 8, fixedCost: 3000, capacity: "Customers" },
    primaryRisk: "Activation and retention",
    test: "Get 5–10 target users to complete the core workflow and ask for a paid commitment before adding features."
  },
  {
    id: "ecommerce",
    type: "E-commerce",
    terms: [
      "ecommerce", "e-commerce", "shop", "store", "product", "clothing",
      "apparel", "skincare", "jewelry", "accessories", "furniture",
      "merch", "physical product", "online store"
    ],
    customerHints: ["shoppers", "parents", "students", "women", "men", "collectors", "pet owners", "consumers"],
    problem: "The customer wants a specific product or experience that is difficult to find, compare, or buy conveniently.",
    offer: "A focused product assortment with a clear reason to choose it over existing alternatives.",
    revenue: "Product margin",
    economics: { price: 60, variableCost: 28, fixedCost: 1500, capacity: "Orders per month" },
    primaryRisk: "Acquisition cost and repeat purchase",
    test: "Test one hero product and one audience before committing to a broad catalog."
  },
  {
    id: "creator",
    type: "Creator business",
    terms: [
      "creator", "newsletter", "youtube", "podcast", "course", "digital product",
      "community", "content", "influencer", "membership", "audience"
    ],
    customerHints: ["fans", "followers", "creators", "professionals", "students", "learners", "niche audience"],
    problem: "An audience wants useful knowledge, entertainment, access, or community around a specific interest.",
    offer: "A repeatable content, education, or community offer for a clearly defined audience.",
    revenue: "Membership / product / sponsorship",
    economics: { price: 20, variableCost: 3, fixedCost: 500, capacity: "Paying members" },
    primaryRisk: "Audience-to-customer conversion",
    test: "Pre-sell one concrete offer to an existing or reachable niche audience."
  },
  {
    id: "marketplace",
    type: "Marketplace",
    terms: [
      "marketplace", "connect buyers", "connect sellers", "two-sided",
      "buyers and sellers", "freelancers and clients", "match customers",
      "platform for sellers"
    ],
    customerHints: ["buyers", "sellers", "freelancers", "clients", "providers", "businesses"],
    problem: "Two sides of a fragmented market struggle with discovery, trust, matching, or transaction friction.",
    offer: "A focused marketplace with a strong reason for both sides to transact.",
    revenue: "Take rate / transaction fee",
    economics: { price: 100, variableCost: 15, fixedCost: 4000, capacity: "Transactions" },
    primaryRisk: "Liquidity on both sides",
    test: "Manually match the first 5–10 transactions before building marketplace infrastructure."
  },
  {
    id: "education",
    type: "Education / tutoring",
    terms: [
      "tutor", "tutoring", "teacher", "teaching", "lesson", "lessons",
      "homework", "exam prep", "test prep", "school", "student",
      "students", "academic", "math tutor", "science tutor", "language tutor",
      "online tutoring", "education", "learning"
    ],
    customerHints: ["students", "high school students", "parents", "learners", "teachers"],
    problem: "The customer needs targeted academic help, accountability, or exam preparation that fits their schedule and learning needs.",
    offer: "A focused tutoring program with a clear subject, student segment, delivery format, and measurable learning outcome.",
    revenue: "Per lesson / package",
    economics: { price: 40, variableCost: 10, fixedCost: 500, capacity: "Lessons per month" },
    primaryRisk: "Student acquisition and measurable outcomes",
    test: "Offer a defined tutoring package to 10 reachable students or parents and measure paid sign-ups and repeat lessons."
  },
  {
    id: "food",
    type: "Food business",
    terms: [
      "meal", "meal prep", "food", "catering", "bakery", "restaurant",
      "delivery food", "lunch", "dessert", "snack", "coffee", "juice"
    ],
    customerHints: ["families", "professionals", "students", "office workers", "busy people", "local customers"],
    problem: "The customer wants convenient food that fits a particular need, schedule, taste, or budget.",
    offer: "A narrow, repeatable food offer with predictable fulfillment.",
    revenue: "Per order / subscription",
    economics: { price: 18, variableCost: 8, fixedCost: 1000, capacity: "Orders per week" },
    primaryRisk: "Repeat demand and margin",
    test: "Sell a small menu to a defined customer group and track repeat orders and contribution margin."
  }
];

function normalize(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, " ");
}

function scoreTerms(text, terms) {
  return terms.reduce((score, term) => {
    return score + (text.includes(term) ? (term.length > 7 ? 2 : 1) : 0);
  }, 0);
}

function extractCustomer(text, profile) {
  const patterns = [
    /\bfor ([^.!,;]+)/i,
    /\bserving ([^.!,;]+)/i,
    /\btargeting ([^.!,;]+)/i,
    /\baimed at ([^.!,;]+)/i,
    /\bfor ([a-z0-9 -]+?)\s+(?:who|that)\b/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      let customer = match[1].trim();
      customer = customer
        .replace(/\b(with|using|through|via|in|on|at)\b.*$/i, "")
        .replace(/\s+/g, " ")
        .trim();

      if (customer.length >= 4 && customer.length <= 70) {
        return titleCase(customer);
      }
    }
  }

  const hint = profile.customerHints.find(h => text.includes(h));
  if (hint) return titleCase(hint);

  return "A clearly defined niche customer";
}

function classifyBusiness(idea) {
  const text = normalize(idea);

  const ranked = PROFILES.map(profile => ({
    profile,
    evidence: scoreTerms(text, profile.terms)
  })).sort((a, b) => b.evidence - a.evidence);

  const winner = ranked[0];
  const profile = winner.evidence > 0 ? winner.profile : {
    id: "unknown",
    type: "Business concept",
    customerHints: [],
    problem: "A customer problem that needs to be defined more precisely.",
    offer: "A focused offer that needs clearer definition.",
    revenue: "To be determined",
    economics: { price: 50, variableCost: 20, fixedCost: 1000, capacity: "Customers" },
    primaryRisk: "Customer problem and willingness to pay",
    test: "Interview 10 target customers and test a concrete offer before investing in the build."
  };

  const words = text.split(/\s+/).filter(Boolean);
  const hasCustomerMarker = /\b(for|serving|target|targeting|aimed|designed for|built for)\b/.test(text);
  const hasOfferMarker = /\b(service|product|platform|app|software|subscription|package|store|marketplace|course|community|tool)\b/.test(text);
  const hasLocation = /\b(in|near|local|online|remote|nationwide|city|country)\b/.test(text);

  const specificity = clamp(
    42 + words.length * 2.4 + (hasCustomerMarker ? 14 : 0) + (hasOfferMarker ? 7 : 0) + (hasLocation ? 4 : 0),
    35, 95
  );

  const customer = extractCustomer(text, profile);
  const customerClarity = clamp(
    43 + (hasCustomerMarker ? 22 : 0) + (customer !== "A clearly defined niche customer" ? 15 : 0) + Math.min(15, words.length),
    35, 95
  );

  const access = profile.id === "marketplace"
    ? 55
    : profile.id === "saas"
      ? 62
      : profile.id === "ecommerce"
        ? 64
        : 72;

  const executionBase = {
    "local-service": 62,
    "professional-service": 72,
    "saas": 48,
    "ecommerce": 58,
    "creator": 66,
    "marketplace": 38,
    "food": 52,
    "education": 70,
    "unknown": 55
  }[profile.id] || 55;

  const executionRisk = clamp(
    executionBase + (words.length > 18 ? 4 : 0) - (hasCustomerMarker ? 2 : 0),
    25, 88
  );

  const demandEvidence = clamp(
    38 + (hasCustomerMarker ? 10 : 0) + (hasLocation ? 5 : 0) + Math.min(12, winner.evidence * 2),
    30, 82
  );

  const economics = profile.economics;
  const contribution = Math.max(1, economics.price - economics.variableCost);
  const breakEven = Math.ceil(economics.fixedCost / contribution);

  // Explainable score: stronger definition and access help; execution risk is inverted.
  const score = Math.round(
    specificity * 0.25 +
    customerClarity * 0.25 +
    access * 0.15 +
    (100 - executionRisk) * 0.15 +
    demandEvidence * 0.20
  );

  const confidence = winner.evidence >= 3 && customerClarity >= 65 ? "Medium" : "Low";

  return {
    id: profile.id,
    type: profile.type,
    customer,
    problem: profile.problem,
    offer: profile.offer,
    revenue: profile.revenue,
    economics,
    contribution,
    breakEven,
    primaryRisk: profile.primaryRisk,
    test: profile.test,
    specificity: Math.round(specificity),
    clarity: Math.round(customerClarity),
    access,
    executionRisk: Math.round(executionRisk),
    demandEvidence: Math.round(demandEvidence),
    score,
    confidence
  };
}

function buildOrbit(idea) {
  state.idea = idea.trim();
  state.business = classifyBusiness(state.idea);

  const b = state.business;

  document.getElementById("ventureTitle").textContent =
    titleCase(state.idea.split(/[.!?]/)[0].slice(0, 72));

  document.getElementById("ventureDescription").textContent =
    `${b.type} · ${b.confidence} confidence · modelled from the idea you provided.`;

  document.getElementById("coreName").textContent = shortCoreName(state.idea);
  document.getElementById("scoreNumber").textContent = b.score;
  document.getElementById("scoreNote").textContent =
    b.score >= 75 ? "Strong initial shape" :
    b.score >= 60 ? "Needs sharper validation" :
    "Early concept — validate fundamentals";

  document.getElementById("thesisPill").textContent =
    b.confidence === "Medium" ? (b.score >= 70 ? "Promising" : "Unproven") : "Low confidence";

  document.getElementById("thesisTitle").textContent = thesisTitle(b);
  document.getElementById("thesisText").textContent =
    `${b.offer} The current model is ${b.confidence.toLowerCase()} confidence because it is based on the description alone, not live market evidence.`;

  document.getElementById("truthList").innerHTML = [
    `The target customer experiences the problem often enough to act`,
    `The first offer can be delivered at a sustainable contribution margin`,
    `You can reach the first customers without disproportionate acquisition cost`
  ].map(x => `<li>${x}</li>`).join("");

  document.getElementById("riskTitle").textContent = b.primaryRisk;
  document.getElementById("riskText").textContent =
    `${b.test} Orbit treats this as an assumption to test, not a prediction.`;

  document.getElementById("signalList").innerHTML = [
    ["Idea specificity", b.specificity],
    ["Customer clarity", b.clarity],
    ["Go-to-market access", b.access],
    ["Execution readiness", 100 - b.executionRisk]
  ].map(([name, value]) => `
    <div class="signal">
      <span class="signal-name">${name}</span>
      <span class="signal-score">${value}</span>
      <div class="bar"><i style="width:${value}%"></i></div>
    </div>
  `).join("");

  emptyState.classList.add("hidden");
  workspace.classList.remove("hidden");
  document.getElementById("crumbName").textContent = shortCoreName(state.idea);

  renderView("overview");
}

function titleCase(str) {
  return str.replace(/\s+/g, " ").trim().replace(/^./, c => c.toUpperCase());
}

function shortCoreName(str) {
  const clean = str.replace(/^(a|an|the)\s+/i, "").trim();
  return clean.length > 30 ? clean.slice(0, 29) + "…" : clean;
}

function thesisTitle(b) {
  if (b.score >= 78) return "A focused concept with a credible entry point.";
  if (b.score >= 62) return "Interesting premise, but the wedge needs proof.";
  return "The fundamentals need sharper definition before scaling.";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function renderView(view) {
  state.activeView = view;
  document.querySelectorAll(".nav-item").forEach(n =>
    n.classList.toggle("active", n.dataset.view === view)
  );

  if (!state.business) return;

  const b = state.business;
  const e = b.economics;

  const common = {
    market: {
      title: "Market / demand",
      body: `${b.customer}. Orbit is testing whether this customer has a frequent enough problem to switch, pay, and remain a customer. No live market data is being claimed in prototype mode.`,
      metrics: [
        ["Customer", b.customer],
        ["Demand signal", `${b.demandEvidence}/100`],
        ["GTM access", `${b.access}/100`]
      ],
      actions: [
        "List 10 direct alternatives customers already use",
        "Interview 10 target customers",
        "Record the strongest recurring pain and current workaround"
      ]
    },
    economics: {
      title: "Economics / unit model",
      body: `The starting assumptions are tailored to a ${b.type.toLowerCase()} model. Change price below to see how contribution and break-even move. These are modelled assumptions, not forecasts.`,
      metrics: [
        ["Revenue model", b.revenue],
        ["Starting price", `$${e.price}`],
        ["Variable cost", `$${e.variableCost}`]
      ],
      actions: [
        "Test the proposed price with real prospects",
        "Estimate acquisition cost from your first channel",
        "Check capacity and delivery constraints"
      ]
    },
    risks: {
      title: "Risks / assumptions",
      body: `Orbit's current highest-risk assumption is ${b.primaryRisk.toLowerCase()}. The point is to turn that uncertainty into a cheap experiment before committing more time or money.`,
      metrics: [
        ["Primary risk", b.primaryRisk],
        ["Confidence", b.confidence],
        ["Next test", "Evidence first"]
      ],
      actions: [
        b.test,
        "Set a pass/fail threshold before running the test",
        "Update the model when real evidence changes an assumption"
      ]
    },
    launch: {
      title: "Launch / first 30 days",
      body: "The first launch should be an evidence-gathering cycle. Start with one offer, one customer segment, and one acquisition channel.",
      metrics: [
        ["Week 1", "Offer + interviews"],
        ["Week 2", "Demand test"],
        ["Week 3", "First sales"],
        ["Week 4", "Review"]
      ],
      actions: [
        "Define one concrete starter offer",
        "Create one simple conversion page or sales message",
        "Contact 30 qualified prospects",
        "Review conversion, objections, delivery cost, and repeat intent"
      ]
    },
    overview: {
      title: "Customer / opportunity",
      body: `${b.customer}. The problem Orbit is testing is: ${b.problem} The offer is: ${b.offer}`,
      metrics: [
        ["Business model", b.type],
        ["Revenue", b.revenue],
        ["Score", `${b.score}/100`]
      ],
      actions: [
        `Name the exact first customer: ${b.customer}`,
        "Write the painful job-to-be-done in one sentence",
        "Identify the customer's current workaround"
      ]
    }
  }[view];

  let html = `
    <div class="detail-grid">
      <div class="detail-panel">
        <div class="eyebrow">${view.toUpperCase()} / WORKSPACE</div>
        <h2>${common.title}</h2>
        <p>${common.body}</p>
        <div class="action-list">
          ${common.actions.map((x, i) =>
            `<div class="action"><b>${i + 1}. ${x}</b><span>→</span></div>`
          ).join("")}
        </div>
      </div>
      <div>
        <div class="metric-grid">
          ${common.metrics.map(m =>
            `<div class="metric"><span>${m[0]}</span><strong>${m[1]}</strong></div>`
          ).join("")}
        </div>
  `;

  if (view === "economics") {
    html += `
      <div class="slider-row">
        <label>Price <strong id="priceValue">$${e.price}</strong></label>
        <input class="slider" id="priceSlider" type="range"
          min="${Math.max(5, Math.floor(e.price * 0.4))}"
          max="${Math.max(e.price * 3, e.price + 50)}"
          value="${e.price}">
      </div>
      <div class="metric-grid">
        <div class="metric"><span>Variable cost</span><strong>$${e.variableCost}</strong></div>
        <div class="metric"><span>Contribution</span><strong id="contribution">$${b.contribution}</strong></div>
        <div class="metric"><span>Break-even / fixed costs</span><strong id="breakEven">${b.breakEven}</strong></div>
      </div>
      <p class="model-note">Modelled fixed-cost assumption: $${e.fixedCost}. Break-even = fixed costs ÷ contribution per ${e.capacity.toLowerCase().replace(/s$/, "")}.</p>
    `;
  }

  html += `</div></div>`;
  detailPanel.innerHTML = html;

  const slider = document.getElementById("priceSlider");
  if (slider) {
    slider.addEventListener("input", () => {
      const price = Number(slider.value);
      const contribution = Math.max(1, price - e.variableCost);
      const breakEven = Math.ceil(e.fixedCost / contribution);

      document.getElementById("priceValue").textContent = `$${price}`;
      document.getElementById("contribution").textContent = `$${contribution}`;
      document.getElementById("breakEven").textContent = breakEven;
    });
  }
}

document.addEventListener("click", e => {
  const viewButton = e.target.closest("[data-view]");
  if (viewButton && state.business) renderView(viewButton.dataset.view);
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const idea = input.value.trim();

  if (idea.length < 10) {
    input.focus();
    input.setCustomValidity("Give Orbit a little more detail about the business.");
    input.reportValidity();
    return;
  }

  input.setCustomValidity("");
  buildOrbit(idea);
});

document.getElementById("loadDemo").addEventListener("click", () => {
  input.value = "A premium mobile car-detailing service for busy professionals in Brooklyn.";
  charCount.textContent = `${input.value.length} / 500`;
  buildOrbit(input.value);
});

document.getElementById("resetBtn").addEventListener("click", () => {
  state.business = null;
  state.idea = "";
  workspace.classList.add("hidden");
  emptyState.classList.remove("hidden");
  input.value = "";
  charCount.textContent = "0 / 500";
  document.getElementById("crumbName").textContent = "New venture";
});

document.getElementById("exportBtn").addEventListener("click", () => {
  if (!state.business) return;

  const b = state.business;
  const e = b.economics;

  const brief = `ORBIT — VENTURE BRIEF

IDEA
${state.idea}

BUSINESS MODEL
${b.type}

ORBIT SCORE
${b.score}/100

CONFIDENCE
${b.confidence}

CUSTOMER
${b.customer}

PROBLEM
${b.problem}

OFFER
${b.offer}

REVENUE MODEL
${b.revenue}

MODELLED ECONOMICS
Starting price: $${e.price}
Variable cost: $${e.variableCost}
Contribution: $${b.contribution}
Fixed-cost assumption: $${e.fixedCost}
Break-even units: ${b.breakEven}

SIGNALS
Idea specificity: ${b.specificity}/100
Customer clarity: ${b.clarity}/100
Go-to-market access: ${b.access}/100
Execution readiness: ${100 - b.executionRisk}/100
Demand evidence: ${b.demandEvidence}/100

BIGGEST UNCERTAINTY
${b.primaryRisk}

NEXT TEST
${b.test}

NOTE
Orbit prototype mode uses transparent modelled assumptions. It does not claim live market research or predict business success.
`;

  const blob = new Blob([brief], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "orbit-venture-brief.txt";
  a.click();
  URL.revokeObjectURL(url);
});
