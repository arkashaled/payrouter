const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const percent = (value) => `${value.toFixed(2).replace(/\.00$/, "")}%`;
const money = (value) => `₪${numberFormat.format(value)}`;

const stores = [
  { name: "My Store", platform: "Shopify" },
  { name: "Outlet Store", platform: "WooCommerce" },
  { name: "International Store", platform: "Wix" },
];
let selectedStoreIndex = 0;

const timeRanges = [
  { label: "May 2025", range: "May 1 - May 31, 2025" },
  { label: "Last 7 days", range: "May 25 - May 31, 2025" },
  { label: "Last 30 days", range: "May 2 - May 31, 2025" },
  { label: "Quarter to date", range: "Apr 1 - May 31, 2025" },
  { label: "Year to date", range: "Jan 1 - May 31, 2025" },
];
let selectedTimeRangeIndex = 0;
let customDateRange = { start: "2025-05-01", end: "2025-05-31" };
let activeCustomDateRange = null;

const tableState = {
  paymentMethods: { query: "", sortKey: "method", sortDir: "asc" },
  providers: { query: "", sortKey: "savings", sortDir: "desc" },
  transactions: { query: "", sortKey: "date", sortDir: "desc" },
};

const kpis = [
  ["Processed Revenue", 420270, "+12.4% vs previous month", "up"],
  ["Total PSP Cost", 8932, "2.13% of revenue", "cost"],
  ["Hidden Fees", 1247, "included in PSP cost", "warn"],
  ["Revenue Leakage", 14450, "3.4% of revenue", "risk"],
  ["Net After Fees & Leakage", 396888, "₪420,270 - ₪8,932 - ₪14,450", "up"],
];

const costBreakdown = [
  ["PSP commission", 7685, 1.83, "primary"],
  ["Payment method fees", 612, 0.15, "teal"],
  ["Monthly/gateway fees", 240, 0.06, "amber"],
  ["Refund fees", 205, 0.05, "red"],
  ["Chargeback fees", 190, 0.05, "slate"],
];

const leakage = [
  ["Failed payments not recovered", 9280, "2.4% of attempts"],
  ["Declined by PSP", 2150, "0.6% of attempts"],
  ["Abandoned at checkout", 3020, "estimate"],
  ["Total leakage", 14450, "3.4% of revenue"],
];

const paymentMethods = [
  ["Credit/Debit Cards", 258420, 61.5, 2.05, 5290, 2.1, "Optimize"],
  ["Bit", 76980, 18.3, 1.35, 1040, 1.2, "Good"],
  ["PayPal", 38760, 9.2, 3.89, 1510, 3.8, "Review"],
  ["Apple Pay", 24310, 5.8, 1.9, 462, 1.6, "Good"],
  ["Installments", 15800, 3.8, 2.6, 411, 2.7, "Optimize"],
  ["Google Pay", 5000, 1.2, 1.72, 86, 1.5, "Good"],
];

const psps = [
  {
    name: "PayPlus",
    monthlyCost: 7890,
    effectiveRate: 1.88,
    savings: 1042,
    methods: ["Cards", "Bit", "Apple Pay", "Installments"],
    reliability: "Good",
    score: 6.2,
    role: "Backup",
    bit: true,
    paypal: false,
    apple: true,
    google: false,
    amex: true,
    installments: true,
    foreign: "Manual review",
    shopify: "Good",
    woo: "Good",
    wix: "Average",
  },
  {
    name: "Tranzila",
    monthlyCost: 7112,
    effectiveRate: 1.69,
    savings: 1820,
    methods: ["Cards", "Bit", "Apple Pay", "PayPal", "Installments"],
    reliability: "Good",
    score: 7.8,
    role: "Primary",
    bit: true,
    paypal: true,
    apple: true,
    google: true,
    amex: true,
    installments: true,
    foreign: "Good",
    shopify: "Strong",
    woo: "Good",
    wix: "Good",
  },
  {
    name: "Cardcom",
    monthlyCost: 7440,
    effectiveRate: 1.77,
    savings: 1492,
    methods: ["Cards", "Installments"],
    reliability: "Average",
    score: 6.6,
    role: "Needs manual validation",
    bit: false,
    paypal: false,
    apple: false,
    google: false,
    amex: true,
    installments: true,
    foreign: "Average",
    shopify: "Average",
    woo: "Good",
    wix: "Average",
  },
  {
    name: "Grow",
    monthlyCost: 7675,
    effectiveRate: 1.83,
    savings: 1257,
    methods: ["Cards", "Bit", "Apple Pay"],
    reliability: "Average",
    score: 6.5,
    role: "Method-specific only",
    bit: true,
    paypal: false,
    apple: true,
    google: true,
    amex: false,
    installments: false,
    foreign: "Limited",
    shopify: "Good",
    woo: "Average",
    wix: "Average",
  },
  {
    name: "PayMe",
    monthlyCost: 7810,
    effectiveRate: 1.86,
    savings: 1122,
    methods: ["Cards", "Bit", "Payment Links"],
    reliability: "Good",
    score: 7.1,
    role: "Alternative",
    bit: true,
    paypal: false,
    apple: false,
    google: false,
    amex: true,
    installments: true,
    foreign: "Good",
    shopify: "Good",
    woo: "Good",
    wix: "Average",
  },
  {
    name: "Meshulam",
    monthlyCost: 8280,
    effectiveRate: 1.97,
    savings: 652,
    methods: ["Cards", "Bit", "Payment Links"],
    reliability: "Average",
    score: 6.1,
    role: "Avoid",
    bit: true,
    paypal: false,
    apple: false,
    google: false,
    amex: false,
    installments: true,
    foreign: "Limited",
    shopify: "Average",
    woo: "Average",
    wix: "Good",
  },
];

const transactions = [
  ["#10482", "May 31", "Demo Customer A", "Credit Card", "PayPlus", 640, "Paid", "Failed", "Missing", "Order marked paid but PSP failed", "Void order status and retry via backup PSP"],
  ["#10477", "May 30", "Demo Customer B", "PayPal", "PayPal", 1280, "Paid", "Approved", "Pending", "PSP approved but settlement missing", "Check settlement file and provider batch"],
  ["#10451", "May 27", "Demo Customer C", "Bit", "Tranzila", 220, "Refunded", "Approved", "Pending", "Refund pending", "Reconcile refund against bank payout"],
  ["#10444", "May 25", "Demo Customer D", "Cards", "Cardcom", 1890, "Paid", "Approved", "Held", "Chargeback opened", "Collect proof of delivery"],
  ["#10418", "May 22", "Demo Customer E", "Installments", "PayPlus", 760, "Failed", "Declined", "None", "Payment failed but fallback not configured", "Enable backup route for card declines"],
  ["#10398", "May 19", "Demo Customer F", "PayPal", "PayPal", 540, "Paid", "Approved", "Settled", "High-cost method used", "Limit PayPal to international orders"],
];

const pspSetup = {
  statusCards: [
    ["Primary PSP", "PayPlus", "Active", "up"],
    ["Backup PSP", "Not configured", "High risk", "risk"],
  ],
  current: [
    ["Current primary PSP", "PayPlus"],
    ["Platform", "Shopify"],
    ["Current blended rate", "2.13%"],
    ["Current monthly PSP cost", money(8932)],
    ["Current issue", "No backup PSP configured"],
    ["Risk", "If PayPlus fails, card payments may be lost"],
  ],
  recommended: {
    primaryPsp: "Tranzila",
    backupPsp: "PayPlus",
    estimatedMonthlySavings: 1820,
    currentBlendedRate: 2.13,
    targetBlendedRate: "1.65%-1.82%",
    failedPaymentRecovery: "₪4,000-₪9,000/month",
    reasons: [
      "Lower estimated PSP cost",
      "PayPlus already exists and can serve as backup",
      "Backup route reduces failed-payment revenue loss",
      "Cleaner PSP status and settlement checks",
    ],
  },
};

const nav = [
  ["Dashboard", "/dashboard"],
  ["PSP Comparison", "/compare"],
  ["Recommendations", "/recommendation"],
  ["PSP Setup", "/psp-setup"],
  ["Transactions", "/transactions"],
  ["Reports", "/reports"],
  ["Settings", "/settings"],
];

function statusClass(text) {
  return text.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
}

function pill(text, tone = statusClass(text)) {
  return `<span class="pill ${tone}">${text}</span>`;
}

function normalizeText(value) {
  return String(value ?? "").toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[char]);
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function selectedDateRange() {
  if (activeCustomDateRange) {
    return {
      label: "Custom",
      range: `${formatDate(activeCustomDateRange.start)} - ${formatDate(activeCustomDateRange.end)}`,
    };
  }
  return timeRanges[selectedTimeRangeIndex];
}

function compareValues(a, b) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
  return String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true, sensitivity: "base" });
}

function tableRows(tableId, rows, searchValues, sortValue) {
  const state = tableState[tableId];
  const query = normalizeText(state.query).trim();
  const filtered = query
    ? rows.filter((row) => searchValues(row).some((value) => normalizeText(value).includes(query)))
    : [...rows];
  const direction = state.sortDir === "asc" ? 1 : -1;
  return filtered.sort((a, b) => compareValues(sortValue(a, state.sortKey), sortValue(b, state.sortKey)) * direction);
}

function tableTools(tableId, placeholder, shown, total) {
  const query = tableState[tableId].query;
  return `
    <div class="table-tools">
      <label>
        <span>Filter</span>
        <input data-table-filter="${tableId}" value="${escapeHtml(query)}" placeholder="${placeholder}" />
      </label>
      <span>${shown} of ${total} rows</span>
    </div>
  `;
}

function sortHeader(tableId, key, label) {
  const state = tableState[tableId];
  const active = state.sortKey === key;
  const icon = active ? (state.sortDir === "asc" ? "↑" : "↓") : "↕";
  return `
    <th>
      <button class="sort-button ${active ? "active" : ""}" type="button" data-sort-table="${tableId}" data-sort-key="${key}">
        <span>${label}</span>
        <span aria-hidden="true">${icon}</span>
      </button>
    </th>
  `;
}

function emptyTableRow(colspan) {
  return `<tr><td class="empty-row" colspan="${colspan}">No rows match this filter.</td></tr>`;
}

function shell(title, body, actions = "", subtitle = "") {
  const selectedStore = stores[selectedStoreIndex];
  const selectedRange = selectedDateRange();
  return `
    <div class="app-shell">
      <aside class="sidebar">
        <a class="brand mini" href="/" data-link>
          <span class="brand-mark">PR</span>
          <span><strong>PayRouter</strong><small>Payment profitability</small></span>
        </a>
        <nav>${nav.map(([label, path]) => `<a href="${path}" data-link class="${isActive(path) ? "active" : ""}">${label}</a>`).join("")}</nav>
      </aside>
      <main class="workspace">
        <div class="topbar">
          <div>
            <div class="eyebrow">${selectedRange.range}</div>
            <h1>${title}</h1>
            ${subtitle ? `<p class="topbar-subtitle">${subtitle}</p>` : ""}
          </div>
          <div class="top-actions">
            <div class="time-picker">
              <button class="icon-button time-toggle" type="button" data-time-toggle aria-expanded="false">
                ${selectedRange.label}
                <span aria-hidden="true">⌄</span>
              </button>
              <div class="time-menu" data-time-menu hidden>
                ${timeRanges.map((timeRange, index) => `
                  <button class="time-option ${!activeCustomDateRange && index === selectedTimeRangeIndex ? "active" : ""}" type="button" data-time-index="${index}">
                    <span>${timeRange.label}</span>
                    <small>${timeRange.range}</small>
                  </button>
                `).join("")}
                <form class="custom-date-form" data-custom-date-form>
                  <strong>Custom range</strong>
                  <label>
                    <span>Start</span>
                    <input type="date" name="start" value="${customDateRange.start}" />
                  </label>
                  <label>
                    <span>End</span>
                    <input type="date" name="end" value="${customDateRange.end}" />
                  </label>
                  <button class="button primary" type="submit">Apply custom range</button>
                </form>
              </div>
            </div>
            <div class="store-picker">
              <button class="button secondary store-toggle" type="button" data-store-toggle aria-expanded="false">
                <span>${selectedStore.name} (${selectedStore.platform})</span>
                <span aria-hidden="true">⌄</span>
              </button>
              <div class="store-menu" data-store-menu hidden>
                ${stores.map((store, index) => `
                  <button class="store-option ${index === selectedStoreIndex ? "active" : ""}" type="button" data-store-index="${index}">
                    <span>${store.name}</span>
                    <small>${store.platform}</small>
                  </button>
                `).join("")}
                <button class="store-option add-store" type="button" data-add-store>
                  <span class="plus-icon" aria-hidden="true">+</span>
                  <span>Add new store</span>
                </button>
              </div>
            </div>
            <button class="button primary">Sync Data</button>
            <span class="sync">Last sync: 11:18</span>
          </div>
        </div>
        ${actions}
        ${body}
      </main>
    </div>
  `;
}

function isActive(path) {
  const current = window.location.pathname === "/" ? "/" : window.location.pathname.replace(/\/$/, "");
  return current === path;
}

function renderLanding() {
  return `
    <header class="site-nav">
      <a class="brand" href="/" data-link><span class="brand-mark">PR</span><span>PayRouter</span></a>
      <nav>
        <a href="/dashboard" data-link>Dashboard</a>
        <a href="/compare" data-link>Compare</a>
        <a href="/recommendation" data-link>Recommendation</a>
        <a class="button primary" href="/dashboard" data-link>Analyze my payment setup</a>
      </nav>
    </header>
    <section class="hero">
      <img src="/assets/payrouter-hero.png" alt="PayRouter payment profitability dashboard mockup" />
      <div class="hero-overlay"></div>
      <div class="hero-copy">
        <div class="eyebrow">Payment Profitability for Ecommerce Sellers</div>
        <h1>PayRouter</h1>
        <p class="hero-line">Stop overpaying for payments.</p>
        <p>
          Compare PSPs by real cost, payment-method coverage, checkout compatibility,
          failed-payment risk, and settlement visibility. Then get a clear recommendation
          for your store.
        </p>
        <div class="hero-actions">
          <a class="button primary large" href="/dashboard" data-link>Analyze my payment setup</a>
          <a class="button glass large" href="/dashboard" data-link>View demo dashboard</a>
        </div>
      </div>
    </section>
    <main class="landing-main">
      <section class="proof-strip">
        <div><strong>16,074</strong><span>messages analyzed</span></div>
        <div><strong>947</strong><span>payment-relevant signals</span></div>
        <div><strong>196</strong><span>qualified target profiles</span></div>
        <div><strong>35.3%</strong><span>showed payment-stack pain</span></div>
      </section>
      <section class="section two-col">
        <div>
          <span class="eyebrow">Problem</span>
          <h2>Your payment stack is more expensive than it looks.</h2>
          <p>
            Monthly fees, refund fees, installment costs, wallet fees, foreign-card fees,
            failed transactions, settlement delays, and checkout bugs all eat into margin.
          </p>
        </div>
        <div class="pain-grid">
          ${[
            "Hidden fees across PSPs and payment methods.",
            "Unclear PSP fit for Shopify, WooCommerce, and Wix.",
            "Failed payments and PSP downtime.",
            "Order status and settlement mismatches.",
            "Wallets, PayPal, installments, and Amex are hard to compare.",
            "Switching PSPs feels risky and developer-heavy.",
          ].map((item) => `<article class="mini-card">${item}</article>`).join("")}
        </div>
      </section>
      <section class="section">
        <div class="section-heading">
          <span class="eyebrow">Product</span>
          <h2>One control layer for payment profitability.</h2>
          <p>Not another PSP list. A decision and execution layer for ecommerce payments.</p>
        </div>
        <div class="feature-grid">
          ${[
            ["Profit Dashboard", "See true payment cost, blended rate, hidden fees, and leakage."],
            ["PSP Comparison", "Model providers against your store, platform, and method mix."],
            ["Payment Method Fit", "Know when to enable, limit, or review each payment method."],
            ["Recommended Setup", "Move from raw data to a specific primary and backup PSP plan."],
            ["Fallback Readiness", "Understand where failed payments need recovery paths."],
            ["Reconciliation Visibility", "Spot order, PSP, settlement, refund, and chargeback mismatches."],
          ].map(([title, copy]) => `<article class="feature-card"><h3>${title}</h3><p>${copy}</p></article>`).join("")}
        </div>
      </section>
      <section class="section steps-band">
        <div class="section-heading">
          <span class="eyebrow">Workflow</span>
          <h2>Data to insight to recommendation to execution.</h2>
        </div>
        <div class="steps">
          ${["Connect or input store data", "See your true payment cost", "Compare providers and methods", "Get a recommended setup", "Execute safely with a checklist"].map((step, index) => `
            <article>
              <span>${index + 1}</span>
              <h3>${step}</h3>
            </article>
          `).join("")}
        </div>
      </section>
    </main>
  `;
}

function renderDashboard() {
  return shell("Profit Dashboard", `
    <section class="kpi-grid">
      ${kpis.map(([label, value, detail, tone]) => `
        <article class="kpi-card ${tone}">
          <span>${label}</span>
          <strong>${money(value)}</strong>
          <small>${detail}</small>
        </article>
      `).join("")}
    </section>
    <section class="dashboard-grid">
      <article class="panel cost-panel">
        <div class="panel-head"><h2>PSP Cost Breakdown</h2><span>Effective rate: 2.13%</span></div>
        <div class="donut-wrap">
          ${donutChart()}
          <div class="legend-list">
            ${costBreakdown.map(([label, amount, rate, tone]) => `
              <div class="legend-row">
                <span><i class="${tone}"></i>${label}</span>
                <b>${money(amount)}</b>
                <small>${percent(rate)}</small>
              </div>
            `).join("")}
          </div>
        </div>
      </article>
      <article class="panel leakage-panel">
        <div class="panel-head"><h2>Revenue Leakage</h2><span>Actionable loss signals</span></div>
        ${leakage.map(([source, amount, detail], index) => `
          <div class="leak-row ${index === leakage.length - 1 ? "total" : ""}">
            <span>${source}<small>${detail}</small></span>
            <strong>${money(amount)}</strong>
          </div>
        `).join("")}
      </article>
    </section>
    <section class="table-grid">
      <article class="panel wide">
        <div class="panel-head"><h2>Payment Methods Performance</h2><span>Cost, failures, and guidance</span></div>
        ${paymentMethodTable()}
      </article>
    </section>
  `);
}

function renderCompare() {
  const providerRows = tableRows(
    "providers",
    psps,
    (p) => [
      p.name,
      p.monthlyCost,
      p.effectiveRate,
      p.savings,
      p.methods.join(" "),
      p.bit ? "yes" : "no",
      p.paypal ? "yes" : "no",
      p.apple ? "yes" : "no",
      p.google ? "yes" : "no",
      p.amex ? "yes" : "no",
      p.installments ? "yes" : "no",
      p.reliability,
      p.score,
      p.role,
      p.foreign,
      p.shopify,
      p.woo,
      p.wix,
    ],
    (p, key) => {
      const values = {
        name: p.name,
        monthlyCost: p.monthlyCost,
        effectiveRate: p.effectiveRate,
        savings: p.savings,
        bit: p.bit,
        paypal: p.paypal,
        apple: p.apple,
        google: p.google,
        amex: p.amex,
        installments: p.installments,
        foreign: p.foreign,
        shopify: p.shopify,
        woo: p.woo,
        wix: p.wix,
        reliability: p.reliability,
        role: p.role,
      };
      return values[key];
    },
  );
  return shell("PSP Comparison", `
    <article class="panel wide">
      <div class="panel-head"><h2>Provider Comparison</h2><span>Monthly estimate from mock data</span></div>
      ${tableTools("providers", "Filter providers, methods, fit, or role", providerRows.length, psps.length)}
      <div class="table-scroll">
        <table class="provider-table">
          <thead>
            <tr>
              ${[
                ["name", "PSP"],
                ["monthlyCost", "Monthly Cost"],
                ["effectiveRate", "Effective Rate"],
                ["savings", "Monthly Savings"],
                ["bit", "Bit"],
                ["paypal", "PayPal"],
                ["apple", "Apple Pay"],
                ["google", "Google Pay"],
                ["amex", "Amex"],
                ["installments", "Installments"],
                ["foreign", "Foreign Cards"],
                ["shopify", "Shopify Fit"],
                ["woo", "Woo Fit"],
                ["wix", "Wix Fit"],
                ["reliability", "Reliability"],
                ["role", "Recommended Role"],
              ].map(([key, label]) => sortHeader("providers", key, label)).join("")}
            </tr>
          </thead>
          <tbody>
            ${providerRows.length ? providerRows.map((p) => `
              <tr>
                <td><strong>${p.name}</strong></td>
                <td>${money(p.monthlyCost)}</td>
                <td>${percent(p.effectiveRate)}</td>
                <td class="good-text">${money(p.savings)}</td>
                <td>${check(p.bit)}</td>
                <td>${check(p.paypal)}</td>
                <td>${check(p.apple)}</td>
                <td>${check(p.google)}</td>
                <td>${check(p.amex)}</td>
                <td>${check(p.installments)}</td>
                <td>${p.foreign}</td>
                <td>${p.shopify}</td>
                <td>${p.woo}</td>
                <td>${p.wix}</td>
                <td>${p.reliability}</td>
                <td>${pill(p.role)}</td>
              </tr>
            `).join("") : emptyTableRow(16)}
          </tbody>
        </table>
      </div>
    </article>
  `);
}

function renderRecommendation() {
  return shell("Recommended Payment Setup", `
    <section class="recommendation-hero">
      <div>
        <span class="eyebrow">Our recommendation</span>
        <h2>Use Tranzila as primary PSP and PayPlus as backup.</h2>
        <p>Enable Bit, Apple Pay, and Google Pay. Review PayPal for international orders. Avoid installments below ₪500 basket size.</p>
      </div>
      <div class="impact-stack">
        <strong>${money(1820)}/month</strong>
        <span>Estimated monthly savings</span>
      </div>
    </section>
    <section class="insight-grid">
      <article class="panel"><h2>Expected Impact</h2>${metricList([
        ["Estimated annual savings", money(21840)],
        ["Failed-payment recovery potential", "₪4,000-₪9,000/month"],
        ["Current blended rate", "2.13%"],
        ["Target blended rate", "1.65%-1.82%"],
      ])}</article>
      <article class="panel"><h2>Why this setup</h2>${bulletList([
        "Lower estimated effective cost.",
        "Better payment-method coverage for the current store mix.",
        "Backup provider reduces downtime risk.",
        "Better checkout fit for Shopify and WooCommerce paths.",
        "Cleaner reconciliation path across orders and settlements.",
      ])}</article>
      <article class="panel"><h2>Risks to validate</h2>${bulletList([
        "Requires PSP contract validation.",
        "Requires checkout test before launch.",
        "Requires order-status sync validation.",
        "Quoted fees may differ from provider paperwork.",
      ])}</article>
    </section>
  `);
}

function PspStatusCards() {
  return pspSetup.statusCards.map(([label, value, detail, tone]) => `
    <article class="kpi-card ${tone}">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${detail}</small>
    </article>
  `).join("");
}

function CurrentPspSetupCard() {
  return `
    <article class="panel psp-current-card">
      <span class="eyebrow">Current PSP Setup</span>
      <h2>PayPlus is currently active as the primary PSP.</h2>
      <p>No backup PSP is configured, so eligible failed payments cannot be retried through another provider.</p>
      ${metricList(pspSetup.current)}
    </article>
  `;
}

function RecommendedPspSetupCard() {
  const setup = pspSetup.recommended;
  return `
    <article class="panel psp-recommendation-card">
      <span class="eyebrow">Recommended PSP Setup</span>
      <h2>Use ${setup.primaryPsp} as primary PSP and ${setup.backupPsp} as backup.</h2>
      <div class="psp-metrics">
        <div><span>Recommended primary PSP</span><strong>${setup.primaryPsp}</strong></div>
        <div><span>Recommended backup PSP</span><strong>${setup.backupPsp}</strong></div>
        <div><span>Estimated monthly savings</span><strong>${money(setup.estimatedMonthlySavings)}</strong></div>
        <div><span>Current blended rate</span><strong>${percent(setup.currentBlendedRate)}</strong></div>
        <div><span>Target blended rate</span><strong>${setup.targetBlendedRate}</strong></div>
        <div><span>Failed-payment recovery potential</span><strong>${setup.failedPaymentRecovery}</strong></div>
      </div>
      <div class="reason-grid">
        ${setup.reasons.map((reason) => `<span>${reason}</span>`).join("")}
      </div>
      <div class="setup-actions">
        <a class="button secondary" href="/compare" data-link>View PSP Comparison</a>
      </div>
    </article>
  `;
}

function renderPspSetup() {
  return shell(
    "PSP Setup",
    `
      <section class="setup-health-grid">
        ${PspStatusCards()}
      </section>
      <section class="psp-setup-grid">
        ${CurrentPspSetupCard()}
        ${RecommendedPspSetupCard()}
      </section>
    `,
    "",
    "Configure your primary PSP, backup PSP, and failover readiness.",
  );
}

function renderTransactions() {
  const transactionRows = tableRows(
    "transactions",
    transactions,
    (row) => row,
    (row, key) => {
      const values = {
        orderId: Number(row[0].replace(/\D/g, "")),
        date: Number(row[1].replace(/\D/g, "")),
        customer: row[2],
        method: row[3],
        psp: row[4],
        amount: row[5],
        storeStatus: row[6],
        pspStatus: row[7],
        settlement: row[8],
        issueType: row[9],
      };
      return values[key];
    },
  );
  return shell("Transaction Exceptions", `
    <section class="exception-summary">
      ${[
        ["Overall Revenue", money(420270), "matches dashboard revenue"],
        ["Overall Orders", "6", "mock transactions"],
        ["Orders Paid", "4", "approved or settled"],
        ["Orders Failed", "2", "failed or declined"],
      ].map(([label, value, detail]) => `<article class="kpi-card"><span>${label}</span><strong>${value}</strong><small>${detail}</small></article>`).join("")}
    </section>
    <article class="panel wide">
      <div class="panel-head"><h2>Transactions</h2><span>Mock transaction exceptions</span></div>
      ${tableTools("transactions", "Filter orders, PSPs, statuses, or issues", transactionRows.length, transactions.length)}
      <div class="table-scroll">
        <table class="transactions-table">
          <thead>
            <tr>
              ${[
                ["orderId", "Order ID"],
                ["date", "Date"],
                ["customer", "Customer"],
                ["method", "Method"],
                ["psp", "PSP"],
                ["amount", "Amount"],
                ["storeStatus", "Store Status"],
                ["pspStatus", "PSP Status"],
                ["settlement", "Settlement"],
                ["issueType", "Issue Type"],
              ].map(([key, label]) => sortHeader("transactions", key, label)).join("")}
            </tr>
          </thead>
          <tbody>
            ${transactionRows.length ? transactionRows.map((row) => `
              <tr>
                ${row.slice(0, 10).map((cell, index) => `<td>${index === 5 ? money(cell) : cell}</td>`).join("")}
              </tr>
            `).join("") : emptyTableRow(10)}
          </tbody>
        </table>
      </div>
    </article>
  `);
}

function renderSettings() {
  return shell("Store & Payment Settings", `
    <section class="settings-grid">
      <article class="panel">
        <h2>Store profile</h2>
        ${metricList([
          ["Platform", "Shopify"],
          ["Currency", "ILS"],
          ["Monthly revenue", money(420270)],
          ["Average order value", money(121)],
          ["Foreign card usage", "8%"],
        ])}
      </article>
      <article class="panel">
        <h2>Current payment stack</h2>
        ${metricList([
          ["Primary PSP", "PayPlus"],
          ["Backup PSP", "None configured"],
          ["Wallets", "Bit, PayPal"],
          ["Installments", "Enabled"],
          ["Settlement file", "Manual upload"],
        ])}
      </article>
    </section>
  `);
}

function renderOperations(title, copy) {
  return shell(title, `
    <section class="panel empty-state">
      <span class="eyebrow">Mock module</span>
      <h2>${title}</h2>
      <p>${copy}</p>
      <a href="/dashboard" data-link class="button secondary">Back to dashboard</a>
    </section>
  `);
}

function paymentMethodTable() {
  const methodRows = tableRows(
    "paymentMethods",
    paymentMethods,
    (row) => row,
    (row, key) => {
      const values = {
        method: row[0],
        revenue: row[1],
        revenueShare: row[2],
        paymentCost: row[4],
        failedRate: row[5],
        recommendation: row[6],
      };
      return values[key];
    },
  );
  return `
    ${tableTools("paymentMethods", "Filter methods or recommendations", methodRows.length, paymentMethods.length)}
    <div class="table-scroll">
      <table>
        <thead><tr>${[
          ["method", "Method"],
          ["revenue", "Revenue"],
          ["revenueShare", "% Revenue"],
          ["paymentCost", "Payment Cost"],
          ["failedRate", "Failed Rate"],
          ["recommendation", "Recommendation"],
        ].map(([key, label]) => sortHeader("paymentMethods", key, label)).join("")}</tr></thead>
        <tbody>
          ${methodRows.length ? methodRows.map(([method, revenue, share, rate, cost, failed, rec]) => `
            <tr>
              <td><strong>${method}</strong></td>
              <td>${money(revenue)}</td>
              <td>${percent(share)}</td>
              <td>${money(cost)}</td>
              <td>${percent(failed)}</td>
              <td>${pill(rec)}</td>
            </tr>
          `).join("") : emptyTableRow(6)}
        </tbody>
      </table>
    </div>
  `;
}

function metricList(rows) {
  return `<div class="metric-list">${rows.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}</div>`;
}

function bulletList(items) {
  return `<ul class="clean-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function check(value) {
  return value ? `<span class="check yes">Yes</span>` : `<span class="check no">No</span>`;
}

function donutChart() {
  const total = costBreakdown.reduce((sum, [, amount]) => sum + amount, 0);
  let start = 0;
  const colors = {
    primary: "var(--cost-psp)",
    teal: "var(--cost-method)",
    amber: "var(--cost-gateway)",
    red: "var(--cost-refund)",
    slate: "var(--cost-chargeback)",
  };
  const circles = costBreakdown.map(([, amount, , tone]) => {
    const dash = (amount / total) * 100;
    const circle = `<circle r="38" cx="50" cy="50" pathLength="100" fill="transparent" stroke="${colors[tone]}" stroke-width="12" stroke-dasharray="${dash} ${100 - dash}" stroke-dashoffset="${-start}" transform="rotate(-90 50 50)" />`;
    start += dash;
    return circle;
  }).join("");
  return `<svg class="donut" viewBox="0 0 100 100" role="img" aria-label="PSP cost breakdown chart">${circles}<text x="50" y="48" text-anchor="middle">₪8.9k</text><text x="50" y="62" text-anchor="middle">total</text></svg>`;
}

function route(options = {}) {
  let path = window.location.pathname.replace(/\/$/, "") || "/";
  if (path === "/methods" || path === "/setup") {
    window.history.replaceState({}, "", "/psp-setup");
    path = "/psp-setup";
  }
  const routes = {
    "/": renderLanding,
    "/dashboard": renderDashboard,
    "/compare": renderCompare,
    "/recommendation": renderRecommendation,
    "/psp-setup": renderPspSetup,
    "/transactions": renderTransactions,
    "/settings": renderSettings,
    "/reports": () => renderOperations("Reports", "Export monthly profitability reports for finance, ecommerce, and agency review."),
  };
  document.getElementById("app").innerHTML = (routes[path] || renderDashboard)();
  if (options.focusFilter) {
    const input = document.querySelector(`[data-table-filter="${options.focusFilter}"]`);
    input?.focus();
    input?.setSelectionRange(input.value.length, input.value.length);
  }
  if (!options.preserveScroll) {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

document.addEventListener("click", (event) => {
  const storeToggle = event.target.closest("[data-store-toggle]");
  const storeMenu = document.querySelector("[data-store-menu]");
  const timeToggle = event.target.closest("[data-time-toggle]");
  const timeMenu = document.querySelector("[data-time-menu]");

  if (timeToggle && timeMenu) {
    const willOpen = timeMenu.hidden;
    timeMenu.hidden = !willOpen;
    timeToggle.setAttribute("aria-expanded", String(willOpen));
    if (storeMenu) {
      storeMenu.hidden = true;
      document.querySelector("[data-store-toggle]")?.setAttribute("aria-expanded", "false");
    }
    return;
  }

  const timeOption = event.target.closest("[data-time-index]");
  if (timeOption) {
    selectedTimeRangeIndex = Number(timeOption.dataset.timeIndex);
    activeCustomDateRange = null;
    route();
    return;
  }

  if (storeToggle && storeMenu) {
    const willOpen = storeMenu.hidden;
    storeMenu.hidden = !willOpen;
    storeToggle.setAttribute("aria-expanded", String(willOpen));
    if (timeMenu) {
      timeMenu.hidden = true;
      document.querySelector("[data-time-toggle]")?.setAttribute("aria-expanded", "false");
    }
    return;
  }

  const storeOption = event.target.closest("[data-store-index]");
  if (storeOption) {
    selectedStoreIndex = Number(storeOption.dataset.storeIndex);
    route();
    return;
  }

  const addStore = event.target.closest("[data-add-store]");
  if (addStore) {
    window.alert("Add new store flow coming soon.");
    return;
  }

  const sortButton = event.target.closest("[data-sort-table]");
  if (sortButton) {
    const tableId = sortButton.dataset.sortTable;
    const sortKey = sortButton.dataset.sortKey;
    const state = tableState[tableId];
    if (state.sortKey === sortKey) {
      state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
    } else {
      state.sortKey = sortKey;
      state.sortDir = "asc";
    }
    route({ preserveScroll: true });
    return;
  }

  const link = event.target.closest("[data-link]");
  if (!link) {
    if (storeMenu) {
      storeMenu.hidden = true;
      document.querySelector("[data-store-toggle]")?.setAttribute("aria-expanded", "false");
    }
    if (timeMenu) {
      timeMenu.hidden = true;
      document.querySelector("[data-time-toggle]")?.setAttribute("aria-expanded", "false");
    }
    return;
  }
  const url = new URL(link.href);
  if (url.origin !== window.location.origin) return;
  event.preventDefault();
  window.history.pushState({}, "", url.pathname);
  route();
});

document.addEventListener("input", (event) => {
  const customDateInput = event.target.closest("[data-custom-date-form] input");
  if (customDateInput) {
    customDateRange[customDateInput.name] = customDateInput.value;
    return;
  }

  const filterInput = event.target.closest("[data-table-filter]");
  if (!filterInput) return;
  const tableId = filterInput.dataset.tableFilter;
  tableState[tableId].query = filterInput.value;
  route({ preserveScroll: true, focusFilter: tableId });
});

document.addEventListener("submit", (event) => {
  const customDateForm = event.target.closest("[data-custom-date-form]");
  if (!customDateForm) return;
  event.preventDefault();
  const formData = new FormData(customDateForm);
  customDateRange = {
    start: formData.get("start"),
    end: formData.get("end"),
  };
  activeCustomDateRange = { ...customDateRange };
  route();
});

window.addEventListener("popstate", route);
route();
