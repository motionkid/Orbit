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

input.addEventListener("input", () => charCount.textContent = `${input.value.length} / 500`);
examples.forEach(btn => btn.addEventListener("click", () => {
  input.value = btn.dataset.example;
  charCount.textContent = `${input.value.length} / 500`;
  input.focus();
}));

function inferBusiness(idea) {
  const text = idea.toLowerCase();
  let type = "Service business";
  let customer = "A clearly defined niche customer";
  let problem = "An existing problem that is currently solved with time, money, or friction";
  let offer = "A focused service with a simple value proposition";

  if (/saas|software|app|platform|tool|ai/.test(text)) {
    type = "Software / SaaS";
    customer = "A specific professional or consumer segment with repeat demand";
    problem = "A workflow that is slow, fragmented, or unnecessarily manual";
    offer = "A focused product that removes a measurable workflow cost";
  } else if (/meal|food|catering|bakery|restaurant/.test(text)) {
    type = "Food / local service";
    customer = "People who value convenience, quality, or a specific dietary need";
    problem = "The tradeoff between time, quality, and affordable food";
    offer = "A narrow, repeatable food offer with predictable fulfillment";
  } else if (/marketplace|connect|artists|freelance/.test(text)) {
    type = "Marketplace";
    customer = "A supply-side niche and a buyer segment with a matching problem";
    problem = "Discovery and trust between two sides of a fragmented market";
    offer = "A focused marketplace with a strong reason to transact";
  } else if (/bookkeep|account|tax|legal|consult|agency/.test(text)) {
    type = "Professional service";
    customer = "Small businesses or professionals with recurring specialist needs";
    problem = "Expensive, confusing, or time-consuming specialist work";
    offer = "A productized service with clear scope and recurring value";
  }

  const words = text.split(/\s+/).filter(Boolean).length;
  const specificity = Math.min(92, 42 + words * 3 + (/\b(for|target|serving|aimed)\b/.test(text) ? 12 : 0));
  const clarity = Math.min(94, 48 + words * 2.2);
  const access = type === "Software / SaaS" ? 71 : 76;
  const risk = Math.max(28, 68 - Math.floor(specificity / 3));
  const score = Math.round((specificity * .3) + (clarity * .25) + (access * .25) + ((100-risk) * .2));

  return { type, customer, problem, offer, specificity: Math.round(specificity), clarity: Math.round(clarity), access, risk, score };
}

function buildOrbit(idea) {
  state.idea = idea.trim();
  state.business = inferBusiness(state.idea);

  document.getElementById("ventureTitle").textContent = titleCase(state.idea.split(/[.!?]/)[0].slice(0, 54));
  document.getElementById("ventureDescription").textContent = `${state.business.type} · Initial validation model based on the idea you provided.`;
  document.getElementById("coreName").textContent = shortCoreName(state.idea);
  document.getElementById("scoreNumber").textContent = state.business.score;
  document.getElementById("scoreNote").textContent = state.business.score >= 70 ? "Promising initial shape" : "Needs sharper validation";
  document.getElementById("thesisPill").textContent = state.business.score >= 70 ? "Promising" : "Unproven";
  document.getElementById("thesisTitle").textContent = thesisTitle(state.business);
  document.getElementById("thesisText").textContent = `${state.business.offer}. The initial opportunity is strongest if the customer segment is narrow enough to reach efficiently and the first offer can be tested without heavy upfront spend.`;
  document.getElementById("truthList").innerHTML = [
    `A specific customer experiences the problem frequently`,
    `The first offer can be delivered without major fixed costs`,
    `The customer will pay enough to support acquisition and delivery`
  ].map(x => `<li>${x}</li>`).join("");
  document.getElementById("riskTitle").textContent = "Willingness to pay";
  document.getElementById("riskText").textContent = "The model is still an assumption. Before building heavily, get evidence from real prospects and measure whether they will commit to the proposed offer.";
  document.getElementById("signalList").innerHTML = [
    ["Idea specificity", state.business.specificity],
    ["Customer clarity", state.business.clarity],
    ["Go-to-market access", state.business.access],
    ["Execution risk", 100 - state.business.risk]
  ].map(([name, value]) => `<div class="signal"><span class="signal-name">${name}</span><span class="signal-score">${value}</span><div class="bar"><i style="width:${value}%"></i></div></div>`).join("");

  emptyState.classList.add("hidden");
  workspace.classList.remove("hidden");
  document.getElementById("crumbName").textContent = shortCoreName(state.idea);
  renderView("overview");
}

function titleCase(str) {
  return str.replace(/\s+/g," ").trim().replace(/^./, c => c.toUpperCase());
}
function shortCoreName(str) {
  const clean = str.replace(/^(a|an|the)\s+/i,"").trim();
  return clean.length > 30 ? clean.slice(0,29) + "…" : clean;
}
function thesisTitle(b) {
  if (b.score >= 75) return "A focused idea with a plausible entry point.";
  if (b.score >= 60) return "Interesting premise, but the wedge needs proof.";
  return "The idea needs sharper definition before the model is investable.";
}

function renderView(view) {
  state.activeView = view;
  document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === view));
  if (!state.business) return;

  const b = state.business;
  const common = {
    market: {
      title:"Market / demand",
      body:`Start with the narrowest reachable market rather than a giant TAM headline. For this concept, the first research question is whether the target customer actively pays for an existing solution.`,
      metrics:[["Customer","Defined niche"],["Signal","Demand to verify"],["Entry","Focused wedge"]],
      actions:["List 10 direct alternatives","Interview 10 target customers","Document the strongest recurring pain"]
    },
    economics: {
      title:"Economics / unit model",
      body:"Use the simulator to understand what has to be true. These numbers are deliberately editable assumptions, not forecasts.",
      metrics:[["Price","$150"],["Variable cost","$35"],["Contribution","$115"]],
      actions:["Test a real price with prospects","Estimate acquisition cost","Calculate weekly delivery capacity"]
    },
    risks: {
      title:"Risks / assumptions",
      body:"A professional venture process does not hide uncertainty. Orbit surfaces the assumptions most capable of breaking the model and turns them into experiments.",
      metrics:[["Primary risk","Demand"],["Confidence","Medium"],["Next test","Customer interviews"]],
      actions:["Write the smallest test","Set a pass/fail threshold","Run the test before adding complexity"]
    },
    launch: {
      title:"Launch / first 30 days",
      body:"The first launch is an evidence-gathering exercise. The objective is not to look big; it is to learn quickly from real customers.",
      metrics:[["Week 1","Offer"],["Week 2","Demand"],["Week 3","Sales"],["Week 4","Review"]],
      actions:["Define one offer","Create one conversion page","Contact 30 qualified prospects","Review conversion and objections"]
    },
    overview: {
      title:"Customer / opportunity",
      body:`${b.customer}. The problem Orbit is testing is: ${b.problem}. Keep the first customer profile narrow enough that you can find and speak to real people.`,
      metrics:[["Type",b.type],["Specificity",`${b.specificity}/100`],["Score",`${b.score}/100`]],
      actions:["Name the exact first customer","Write the painful job-to-be-done","Identify the current workaround"]
    }
  }[view];

  let html = `<div class="detail-grid"><div class="detail-panel"><div class="eyebrow">${view.toUpperCase()} / WORKSPACE</div><h2>${common.title}</h2><p>${common.body}</p><div class="action-list">${common.actions.map((x,i)=>`<div class="action"><b>${i+1}. ${x}</b><span>→</span></div>`).join("")}</div></div><div><div class="metric-grid">${common.metrics.map(m=>`<div class="metric"><span>${m[0]}</span><strong>${m[1]}</strong></div>`).join("")}</div>`;

  if (view === "economics") {
    html += `<div class="slider-row"><label>Price <strong id="priceValue">$150</strong></label><input class="slider" id="priceSlider" type="range" min="50" max="300" value="150"></div>
    <div class="metric-grid"><div class="metric"><span>Variable cost</span><strong>$35</strong></div><div class="metric"><span>Contribution</span><strong id="contribution">$115</strong></div><div class="metric"><span>Break-even / $2k</span><strong id="breakEven">18</strong></div></div>`;
  }
  html += `</div></div>`;
  detailPanel.innerHTML = html;

  const slider = document.getElementById("priceSlider");
  if (slider) {
    slider.addEventListener("input", () => {
      const price = Number(slider.value);
      const contribution = price - 35;
      document.getElementById("priceValue").textContent = `$${price}`;
      document.getElementById("contribution").textContent = `$${contribution}`;
      document.getElementById("breakEven").textContent = Math.ceil(2000 / contribution);
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
  const brief = `ORBIT — VENTURE BRIEF\n\nIDEA\n${state.idea}\n\nORBIT SCORE\n${b.score}/100\n\nCUSTOMER\n${b.customer}\n\nPROBLEM\n${b.problem}\n\nOFFER\n${b.offer}\n\nBIGGEST UNCERTAINTY\nWillingness to pay\n\nNEXT TESTS\n1. Interview 10 target customers.\n2. Test one concrete offer and price.\n3. Measure response before investing in complexity.\n`;
  const blob = new Blob([brief], {type:"text/plain"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "orbit-venture-brief.txt";
  a.click();
  URL.revokeObjectURL(url);
});
